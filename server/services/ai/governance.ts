import { EthicsSystem } from './ethics';
import { Space, PetProfile, Booking } from './types';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

interface PolicyRule {
  id: string;
  category: 'safety' | 'operations' | 'data' | 'compliance';
  description: string;
  enforcement: 'strict' | 'advisory';
  validationFn: (context: any) => Promise<boolean>;
}

interface GovernanceDecision {
  approved: boolean;
  reason: string;
  requiredActions: string[];
  recommendations: string[];
  policyReferences: string[];
}

export class GovernanceSystem {
  private ethicsSystem: EthicsSystem;
  private hf: HfInference;
  private policies: PolicyRule[];

  constructor() {
    this.ethicsSystem = new EthicsSystem();
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    this.initializePolicies();
  }

  private async initializePolicies() {
    this.policies = [
      {
        id: 'SAF001',
        category: 'safety',
        description: 'Emergency protocols must be documented and accessible',
        enforcement: 'strict',
        validationFn: async (space: Space) => {
          return space.safetyFeatures.includes('emergency_protocols') &&
                 space.safetyFeatures.includes('first_aid_equipment');
        }
      },
      {
        id: 'OPS001',
        category: 'operations',
        description: 'Staff must be trained in pet handling',
        enforcement: 'strict',
        validationFn: async (space: Space) => {
          return space.staff.some(s => s.certifications.includes('pet_handling'));
        }
      },
      {
        id: 'DAT001',
        category: 'data',
        description: 'Pet health records must be securely stored',
        enforcement: 'strict',
        validationFn: async (context: any) => {
          return context.dataEncryption && context.accessControls;
        }
      }
    ];
  }

  async evaluateSpaceRegistration(space: Space): Promise<GovernanceDecision> {
    const ethicalAssessment = await this.ethicsSystem.assessSpace(space);
    const policyValidations = await this.validatePolicies('space', space);
    
    const decision: GovernanceDecision = {
      approved: ethicalAssessment.passed && policyValidations.every(v => v.passed),
      reason: '',
      requiredActions: [...ethicalAssessment.requiredActions],
      recommendations: [...ethicalAssessment.recommendations],
      policyReferences: []
    };

    // Compile reasons and actions
    if (!ethicalAssessment.passed) {
      decision.reason = 'Failed ethical assessment';
      decision.policyReferences.push('Ethics Guidelines Section 1.1');
    }

    policyValidations.forEach(validation => {
      if (!validation.passed) {
        decision.requiredActions.push(
          `Comply with policy ${validation.policyId}: ${validation.description}`
        );
        decision.policyReferences.push(`Policy ${validation.policyId}`);
      }
    });

    return decision;
  }

  async evaluateBooking(booking: Booking, space: Space, pet: PetProfile): Promise<GovernanceDecision> {
    const ethicalAssessment = await this.ethicsSystem.assessBooking(space, pet);
    const policyValidations = await this.validatePolicies('booking', { booking, space, pet });

    const decision: GovernanceDecision = {
      approved: ethicalAssessment.passed && policyValidations.every(v => v.passed),
      reason: '',
      requiredActions: [...ethicalAssessment.requiredActions],
      recommendations: [...ethicalAssessment.recommendations],
      policyReferences: []
    };

    if (!ethicalAssessment.passed) {
      decision.reason = 'Failed ethical assessment for booking';
      decision.policyReferences.push('Booking Ethics Guidelines Section 2.3');
    }

    // Add capacity check
    const currentBookings = await this.getOverlappingBookings(booking, space);
    if (currentBookings.length >= space.capacity) {
      decision.approved = false;
      decision.reason = 'Space capacity exceeded';
      decision.requiredActions.push('Select alternative time slot or space');
    }

    return decision;
  }

  private async validatePolicies(type: string, context: any): Promise<Array<{
    passed: boolean;
    policyId: string;
    description: string;
  }>> {
    const relevantPolicies = this.policies.filter(p => {
      if (type === 'space') return p.category === 'safety' || p.category === 'operations';
      if (type === 'booking') return p.category === 'operations' || p.category === 'data';
      return false;
    });

    const validations = await Promise.all(
      relevantPolicies.map(async policy => ({
        passed: await policy.validationFn(context),
        policyId: policy.id,
        description: policy.description
      }))
    );

    return validations;
  }

  private async getOverlappingBookings(booking: Booking, space: Space): Promise<Booking[]> {
    // This would typically query your database
    // Mocked for now
    return [];
  }

  async monitorCompliance(space: Space): Promise<{
    compliant: boolean;
    violations: string[];
    recommendations: string[];
  }> {
    const violations: string[] = [];
    const recommendations: string[] = [];

    // Check safety compliance
    const safetyPrompt = `Analyze the following space for safety compliance:
    Type: ${space.type}
    Features: ${space.features.join(', ')}
    Safety Features: ${space.safetyFeatures.join(', ')}
    Last Inspection: ${space.lastInspection}

    List any safety violations:`;

    try {
      const safetyAnalysis = await this.hf.textGeneration({
        model: 'gpt2',
        inputs: safetyPrompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
        },
      });

      const safetyViolations = safetyAnalysis.generated_text
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.trim());

      violations.push(...safetyViolations);
    } catch (error) {
      console.error('Error in safety analysis:', error);
      recommendations.push('Schedule manual safety inspection');
    }

    // Check operational compliance
    if (!space.staff.every(s => this.isStaffCompliant(s))) {
      violations.push('Staff certifications not up to date');
      recommendations.push('Schedule staff training update');
    }

    // Check maintenance compliance
    if (this.isDueMaintenance(space)) {
      violations.push('Maintenance schedule not followed');
      recommendations.push('Schedule routine maintenance check');
    }

    return {
      compliant: violations.length === 0,
      violations,
      recommendations
    };
  }

  private isStaffCompliant(staff: any): boolean {
    // Check if staff certifications are up to date
    const requiredCerts = ['pet_handling', 'first_aid'];
    return requiredCerts.every(cert => 
      staff.certifications.includes(cert) && 
      !this.isCertificationExpired(staff.certificationDates[cert])
    );
  }

  private isCertificationExpired(date: Date): boolean {
    const expirationDate = new Date(date);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    return new Date() > expirationDate;
  }

  private isDueMaintenance(space: Space): boolean {
    const lastMaintenance = new Date(space.lastMaintenance);
    const monthsSinceLastMaintenance = 
      (new Date().getTime() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsSinceLastMaintenance > 3; // Maintenance due every 3 months
  }
}
