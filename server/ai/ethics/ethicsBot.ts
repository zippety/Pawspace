import { OpenAI } from 'langchain/llms/openai';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { Space } from '../../models/space.model';
import { Pet } from '../../models/pet.model';
import { Booking } from '../../models/booking.model';
import { ETHICS_CONFIG } from './config';

export interface EthicsAssessment {
  approved: boolean;
  score: number;
  concerns: string[];
  recommendations: string[];
}

export class EthicsBot {
  private llm: OpenAI;
  private spaceAssessmentChain: LLMChain;
  private bookingAssessmentChain: LLMChain;

  constructor() {
    this.llm = new OpenAI({
      temperature: 0.3, // Lower temperature for more consistent ethical assessments
      modelName: 'gpt-4'
    });

    // Initialize assessment chains
    const spacePrompt = PromptTemplate.fromTemplate(`
      Assess the following pet care space for ethical compliance and animal welfare:
      Space Details: {spaceDetails}
      
      Consider the following aspects:
      1. Space capacity and requirements
      2. Safety features
      3. Pricing fairness
      4. Special needs accommodations
      
      Provide an assessment with:
      1. Overall score (0-100)
      2. List of concerns
      3. List of recommendations
      4. Approval status (true/false)
    `);

    const bookingPrompt = PromptTemplate.fromTemplate(`
      Assess the following pet care booking for ethical compliance:
      Booking Details: {bookingDetails}
      Pet Details: {petDetails}
      Space Details: {spaceDetails}
      
      Consider:
      1. Pet-space compatibility
      2. Special needs accommodation
      3. Capacity management
      4. Safety considerations
      
      Provide an assessment with:
      1. Overall score (0-100)
      2. List of concerns
      3. List of recommendations
      4. Approval status (true/false)
    `);

    this.spaceAssessmentChain = new LLMChain({
      llm: this.llm,
      prompt: spacePrompt
    });

    this.bookingAssessmentChain = new LLMChain({
      llm: this.llm,
      prompt: bookingPrompt
    });
  }

  async assessSpaceRegistration(space: Space): Promise<EthicsAssessment> {
    try {
      const result = await this.spaceAssessmentChain.call({
        spaceDetails: JSON.stringify(space, null, 2)
      });

      // Parse LLM response
      const assessment = this.parseAssessmentResponse(result.text);
      
      // Apply additional rule-based checks
      if (!this.validateSpaceCapacity(space)) {
        assessment.concerns.push('Space capacity does not meet minimum requirements');
        assessment.recommendations.push('Please ensure minimum space requirements per pet type');
        assessment.score = Math.max(0, assessment.score - 20);
      }

      if (!this.validateSafetyFeatures(space)) {
        assessment.concerns.push('Missing critical safety features');
        assessment.recommendations.push('Add required safety features like fencing, emergency equipment');
        assessment.score = Math.max(0, assessment.score - 30);
      }

      assessment.approved = assessment.score >= ETHICS_CONFIG.THRESHOLDS.MINIMUM_APPROVAL_SCORE;
      return assessment;
    } catch (error) {
      console.error('Space assessment failed:', error);
      return {
        approved: false,
        score: 0,
        concerns: ['Assessment failed due to technical error'],
        recommendations: ['Please try again or contact support']
      };
    }
  }

  async assessBooking(booking: Booking, pet: Pet, space: Space): Promise<EthicsAssessment> {
    try {
      const result = await this.bookingAssessmentChain.call({
        bookingDetails: JSON.stringify(booking, null, 2),
        petDetails: JSON.stringify(pet, null, 2),
        spaceDetails: JSON.stringify(space, null, 2)
      });

      // Parse LLM response
      const assessment = this.parseAssessmentResponse(result.text);

      // Apply additional rule-based checks
      if (!this.validatePetSpaceCompatibility(pet, space)) {
        assessment.concerns.push('Pet may not be compatible with this space');
        assessment.recommendations.push('Consider a more suitable space for this pet type');
        assessment.score = Math.max(0, assessment.score - 30);
      }

      if (pet.specialNeeds && !this.validateSpecialNeedsAccommodation(pet, space)) {
        assessment.concerns.push('Space may not adequately accommodate pet\'s special needs');
        assessment.recommendations.push('Ensure space has necessary accommodations for special needs');
        assessment.score = Math.max(0, assessment.score - 25);
      }

      assessment.approved = assessment.score >= ETHICS_CONFIG.THRESHOLDS.MINIMUM_APPROVAL_SCORE;
      return assessment;
    } catch (error) {
      console.error('Booking assessment failed:', error);
      return {
        approved: false,
        score: 0,
        concerns: ['Assessment failed due to technical error'],
        recommendations: ['Please try again or contact support']
      };
    }
  }

  private parseAssessmentResponse(text: string): EthicsAssessment {
    // Implement parsing logic for LLM response
    // This is a simple implementation - you might want to make it more robust
    const lines = text.split('\n');
    const score = parseInt(lines.find(l => l.includes('score'))?.match(/\d+/)?.[0] ?? '0');
    const concerns = lines
      .filter(l => l.startsWith('-') && l.toLowerCase().includes('concern'))
      .map(l => l.replace('-', '').trim());
    const recommendations = lines
      .filter(l => l.startsWith('-') && l.toLowerCase().includes('recommend'))
      .map(l => l.replace('-', '').trim());
    const approved = text.toLowerCase().includes('approved: true');

    return {
      approved,
      score,
      concerns,
      recommendations
    };
  }

  private validateSpaceCapacity(space: Space): boolean {
    const minSpace = ETHICS_CONFIG.MIN_SPACE_PER_PET;
    return space.squareFootage >= minSpace.DOG; // Using DOG as baseline
  }

  private validateSafetyFeatures(space: Space): boolean {
    return ETHICS_CONFIG.REQUIRED_SAFETY_FEATURES.every(feature => 
      space.safetyFeatures?.includes(feature)
    );
  }

  private validatePetSpaceCompatibility(pet: Pet, space: Space): boolean {
    return space.allowedPetTypes.includes(pet.type);
  }

  private validateSpecialNeedsAccommodation(pet: Pet, space: Space): boolean {
    return space.specialAccommodations?.some(acc => 
      pet.specialNeeds?.some(need => 
        ETHICS_CONFIG.SPECIAL_NEEDS_REQUIREMENTS[need]?.includes(acc)
      )
    ) ?? false;
  }
}
