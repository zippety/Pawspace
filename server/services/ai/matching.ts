import { PineconeClient } from '@pinecone-database/pinecone';
import { HfInference } from '@huggingface/inference';
import {
  Space,
  PetProfile,
  SpaceMatch,
  MatchingCriteria,
  SafetyScore,
} from './types';
import { SafetyAnalyzer } from './safety';
import dotenv from 'dotenv';

dotenv.config();

export class MatchingService {
  private pinecone: PineconeClient;
  private hf: HfInference;
  private safetyAnalyzer: SafetyAnalyzer;

  constructor() {
    this.pinecone = new PineconeClient();
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    this.safetyAnalyzer = new SafetyAnalyzer();
    this.initPinecone();
  }

  private async initPinecone() {
    await this.pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }

  private async getSpaceEmbedding(space: Space): Promise<number[]> {
    const spaceDescription = `${space.name} is a ${space.type} space with ${
      space.size
    } square feet. It features ${space.features.join(
      ', '
    )}. The environment includes ${space.environment.join(
      ', '
    )}. Amenities include ${space.amenities.join(', ')}.`;

    try {
      const response = await this.hf.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: spaceDescription,
      });

      return Array.isArray(response) ? response : [0]; // Fallback for type safety
    } catch (error) {
      console.error('Error getting space embedding:', error);
      return new Array(384).fill(0); // Default embedding size
    }
  }

  private async getPetProfileEmbedding(profile: PetProfile): Promise<number[]> {
    const profileDescription = `${profile.name} is a ${profile.age} year old ${
      profile.breed || ''
    } ${profile.species}. They are ${
      profile.size
    } in size with a temperament described as ${profile.temperament.join(
      ', '
    )}. ${
      profile.specialNeeds
        ? `They have special needs: ${profile.specialNeeds.join(', ')}.`
        : ''
    }`;

    try {
      const response = await this.hf.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: profileDescription,
      });

      return Array.isArray(response) ? response : [0];
    } catch (error) {
      console.error('Error getting profile embedding:', error);
      return new Array(384).fill(0);
    }
  }

  private calculateMatchScore(
    space: Space,
    criteria: MatchingCriteria,
    safetyScore: SafetyScore
  ): number {
    let score = safetyScore.score * 0.4; // Safety is 40% of total score

    // Type match (20%)
    if (!criteria.preferredType || criteria.preferredType.includes(space.type)) {
      score += 20;
    }

    // Size match (10%)
    if (!criteria.minSize || space.size >= criteria.minSize) {
      score += 10;
    }

    // Features match (15%)
    if (criteria.requiredFeatures) {
      const featureMatch =
        criteria.requiredFeatures.filter(f => space.features.includes(f)).length /
        criteria.requiredFeatures.length;
      score += featureMatch * 15;
    } else {
      score += 15;
    }

    // Amenities match (15%)
    if (criteria.requiredAmenities) {
      const amenityMatch =
        criteria.requiredAmenities.filter(a => space.amenities.includes(a))
          .length / criteria.requiredAmenities.length;
      score += amenityMatch * 15;
    } else {
      score += 15;
    }

    return Math.min(100, Math.max(0, score));
  }

  private async getMatchReasons(
    space: Space,
    pet: PetProfile,
    score: number
  ): Promise<string[]> {
    const prompt = `Given a ${pet.species} named ${pet.name} and a ${
      space.type
    } space called "${space.name}" with a match score of ${score}%, 
    explain why they match well. Consider these features:
    Space features: ${space.features.join(', ')}
    Pet temperament: ${pet.temperament.join(', ')}
    Space environment: ${space.environment.join(', ')}`;

    try {
      const response = await this.hf.textGeneration({
        model: 'gpt2',
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
        },
      });

      return response.generated_text
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.trim());
    } catch (error) {
      console.error('Error generating match reasons:', error);
      return ['Unable to generate match reasons'];
    }
  }

  public async findMatches(
    criteria: MatchingCriteria,
    spaces: Space[]
  ): Promise<SpaceMatch[]> {
    const matches: SpaceMatch[] = [];

    for (const space of spaces) {
      const safetyScore = await this.safetyAnalyzer.analyzeSafety(
        space,
        criteria.petProfile
      );
      const matchScore = this.calculateMatchScore(space, criteria, safetyScore);

      if (matchScore >= 60) {
        // Only include spaces with at least 60% match
        const matchReasons = await this.getMatchReasons(
          space,
          criteria.petProfile,
          matchScore
        );

        matches.push({
          spaceId: space.id,
          score: matchScore,
          matchReasons,
          safetyScore,
        });
      }
    }

    return matches.sort((a, b) => b.score - a.score);
  }
}
