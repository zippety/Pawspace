import { Space, PetProfile } from './types';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

interface EthicalGuideline {
  id: string;
  category: 'animal_welfare' | 'safety' | 'fairness' | 'transparency';
  description: string;
  rules: string[];
  priority: 'high' | 'medium' | 'low';
}

interface EthicalAssessment {
  passed: boolean;
  score: number;
  concerns: string[];
  recommendations: string[];
  requiredActions: string[];
}

export class EthicsSystem {
  private guidelines: EthicalGuideline[] = [];
  private hf: HfInference;

  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    this.loadGuidelines();
  }

  private async loadGuidelines() {
    const defaultGuidelines: EthicalGuideline[] = [
      {
        id: 'AW001',
        category: 'animal_welfare',
        description: 'Ensure animal well-being in all spaces',
        rules: [
          'Adequate space for movement',
          'Access to water and shade',
          'Regular health checks',
          'Emergency protocols in place'
        ],
        priority: 'high'
      },
      {
        id: 'SF001',
        category: 'safety',
        description: 'Maintain safe environment for all pets',
        rules: [
          'Secure fencing and boundaries',
          'Non-toxic materials only',
          'First aid equipment available',
          'Trained staff present'
        ],
        priority: 'high'
      },
      {
        id: 'FR001',
        category: 'fairness',
        description: 'Ensure fair access to spaces',
        rules: [
          'No breed discrimination',
          'Reasonable accommodation for special needs',
          'Transparent pricing',
          'Equal consideration for all applications'
        ],
        priority: 'medium'
      }
    ];

    // In production, load from database or config file
    this.guidelines = defaultGuidelines;
  }

  async assessSpace(space: Space): Promise<EthicalAssessment> {
    const concerns: string[] = [];
    const recommendations: string[] = [];
    const requiredActions: string[] = [];
    let totalScore = 100;

    // Analyze space features against welfare guidelines
    const welfarePrompt = `Analyze this pet space for animal welfare concerns:
    Space Type: ${space.type}
    Features: ${space.features.join(', ')}
    Safety Features: ${space.safetyFeatures.join(', ')}
    Size: ${space.size} sq ft
    Capacity: ${space.capacity} pets

    List potential welfare concerns:`;

    try {
      const welfareAnalysis = await this.hf.textGeneration({
        model: 'gpt2',
        inputs: welfarePrompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
        },
      });

      const welfareConcerns = welfareAnalysis.generated_text
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.trim());

      concerns.push(...welfareConcerns);
      totalScore -= welfareConcerns.length * 5;
    } catch (error) {
      console.error('Error in welfare analysis:', error);
      concerns.push('Unable to complete welfare analysis');
      totalScore -= 20;
    }

    // Check safety compliance
    const safetyScore = this.assessSafety(space);
    totalScore = Math.min(totalScore, safetyScore);

    if (safetyScore < 80) {
      requiredActions.push('Immediate safety improvements required');
    }

    // Check fairness in pricing and access
    if (!this.checkFairness(space)) {
      concerns.push('Potential fairness issues identified');
      recommendations.push('Review pricing and access policies');
      totalScore -= 10;
    }

    return {
      passed: totalScore >= 70,
      score: totalScore,
      concerns,
      recommendations,
      requiredActions
    };
  }

  async assessBooking(space: Space, pet: PetProfile): Promise<EthicalAssessment> {
    const concerns: string[] = [];
    const recommendations: string[] = [];
    const requiredActions: string[] = [];
    let totalScore = 100;

    // Check space suitability for specific pet
    const suitabilityPrompt = `Analyze the suitability of this space for this pet:
    Pet: ${pet.species} (${pet.breed || 'Unknown breed'})
    Age: ${pet.age}
    Size: ${pet.size}
    Special Needs: ${pet.specialNeeds?.join(', ') || 'None'}
    
    Space Type: ${space.type}
    Features: ${space.features.join(', ')}
    
    List potential concerns:`;

    try {
      const suitabilityAnalysis = await this.hf.textGeneration({
        model: 'gpt2',
        inputs: suitabilityPrompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
        },
      });

      const suitabilityConcerns = suitabilityAnalysis.generated_text
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.trim());

      concerns.push(...suitabilityConcerns);
      totalScore -= suitabilityConcerns.length * 5;
    } catch (error) {
      console.error('Error in suitability analysis:', error);
      concerns.push('Unable to complete suitability analysis');
      totalScore -= 20;
    }

    // Check special needs accommodation
    if (pet.specialNeeds && pet.specialNeeds.length > 0) {
      const accommodated = this.checkSpecialNeedsAccommodation(space, pet.specialNeeds);
      if (!accommodated) {
        concerns.push('Special needs may not be fully accommodated');
        recommendations.push('Review special needs requirements');
        totalScore -= 15;
      }
    }

    return {
      passed: totalScore >= 70,
      score: totalScore,
      concerns,
      recommendations,
      requiredActions
    };
  }

  private assessSafety(space: Space): number {
    let score = 100;

    // Check required safety features
    const requiredFeatures = [
      'secure_fencing',
      'emergency_exits',
      'first_aid',
      'water_access'
    ];

    for (const feature of requiredFeatures) {
      if (!space.safetyFeatures.includes(feature)) {
        score -= 15;
      }
    }

    // Check capacity limits
    if (space.size / space.capacity < 100) { // Less than 100 sq ft per pet
      score -= 20;
    }

    return Math.max(0, score);
  }

  private checkFairness(space: Space): boolean {
    // Check for reasonable pricing
    const pricePerHour = space.pricing.baseRate / space.pricing.minimumDuration;
    if (pricePerHour > 50) { // Example threshold
      return false;
    }

    // Check for discriminatory restrictions
    const discriminatoryTerms = [
      'purebred only',
      'no mixed breeds',
      'specific breeds only'
    ];

    return !space.restrictions?.some(r => 
      discriminatoryTerms.some(term => r.toLowerCase().includes(term))
    );
  }

  private checkSpecialNeedsAccommodation(space: Space, specialNeeds: string[]): boolean {
    const accommodationFeatures = [
      ...space.features,
      ...space.amenities,
      ...space.safetyFeatures
    ];

    return specialNeeds.every(need => {
      // Convert need to required features
      const requiredFeatures = this.getRequiredFeaturesForNeed(need);
      return requiredFeatures.some(f => accommodationFeatures.includes(f));
    });
  }

  private getRequiredFeaturesForNeed(need: string): string[] {
    // Map special needs to required features
    const needsMap: { [key: string]: string[] } = {
      'mobility_impaired': ['ramp_access', 'non_slip_surface', 'level_ground'],
      'anxiety': ['quiet_space', 'low_traffic', 'privacy_screens'],
      'elderly': ['soft_surface', 'shade', 'rest_areas'],
      'medication_required': ['refrigeration', 'first_aid_station', 'staff_present']
    };

    return needsMap[need.toLowerCase()] || [];
  }
}
