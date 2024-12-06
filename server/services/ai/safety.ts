import { HfInference } from '@huggingface/inference';
import { SafetyScore, Space, PetProfile } from './types';
import dotenv from 'dotenv';

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export class SafetyAnalyzer {
  private async analyzeSafetyFeatures(space: Space): Promise<string[]> {
    const prompt = `Analyze the following space features for pet safety:
    Features: ${space.features.join(', ')}
    Safety Features: ${space.safetyFeatures.join(', ')}
    Environment: ${space.environment.join(', ')}
    
    List potential safety concerns:`;

    try {
      const response = await hf.textGeneration({
        model: 'gpt2',
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
        },
      });

      return response.generated_text
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.trim());
    } catch (error) {
      console.error('Error analyzing safety features:', error);
      return ['Unable to analyze safety features'];
    }
  }

  private async generateRecommendations(
    concerns: string[],
    space: Space,
    pet: PetProfile
  ): Promise<string[]> {
    const prompt = `Given these safety concerns for a ${pet.species}:
    ${concerns.join('\n')}
    
    And these space features:
    ${space.features.join('\n')}
    
    Provide safety recommendations:`;

    try {
      const response = await hf.textGeneration({
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
      console.error('Error generating recommendations:', error);
      return ['Unable to generate safety recommendations'];
    }
  }

  private calculateSafetyScore(concerns: string[], space: Space): number {
    const baseScore = 100;
    const deductionPerConcern = 10;
    const bonusPerSafetyFeature = 5;

    const concernsDeduction = Math.min(concerns.length * deductionPerConcern, 50);
    const safetyBonus = Math.min(
      space.safetyFeatures.length * bonusPerSafetyFeature,
      25
    );

    return Math.max(0, Math.min(100, baseScore - concernsDeduction + safetyBonus));
  }

  public async analyzeSafety(
    space: Space,
    pet: PetProfile
  ): Promise<SafetyScore> {
    const concerns = await this.analyzeSafetyFeatures(space);
    const recommendations = await this.generateRecommendations(
      concerns,
      space,
      pet
    );
    const score = this.calculateSafetyScore(concerns, space);

    return {
      score,
      reasons: concerns,
      recommendations,
    };
  }
}
