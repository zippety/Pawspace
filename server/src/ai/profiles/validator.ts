import { PetProfile, ProfileValidationError } from './types';

export class ProfileValidator {
    /**
     * Validate a pet profile
     * @returns Array of validation errors, empty if valid
     */
    static validate(profile: PetProfile): ProfileValidationError[] {
        const errors: ProfileValidationError[] = [];

        // Required fields
        if (!profile.name || profile.name.trim().length === 0) {
            errors.push({
                field: 'name',
                message: 'Name is required'
            });
        }

        if (!profile.type || !['dog', 'cat', 'bird', 'other'].includes(profile.type)) {
            errors.push({
                field: 'type',
                message: 'Valid pet type is required'
            });
        }

        if (!profile.breed || profile.breed.trim().length === 0) {
            errors.push({
                field: 'breed',
                message: 'Breed is required'
            });
        }

        if (typeof profile.age !== 'number' || profile.age < 0) {
            errors.push({
                field: 'age',
                message: 'Valid age is required'
            });
        }

        if (!profile.size || !['small', 'medium', 'large'].includes(profile.size)) {
            errors.push({
                field: 'size',
                message: 'Valid size is required'
            });
        }

        if (!profile.description || profile.description.trim().length === 0) {
            errors.push({
                field: 'description',
                message: 'Description is required'
            });
        }

        // Personality validation
        if (!Array.isArray(profile.personality) || profile.personality.length === 0) {
            errors.push({
                field: 'personality',
                message: 'At least one personality trait is required'
            });
        }

        // Requirements validation
        if (!Array.isArray(profile.requirements) || profile.requirements.length === 0) {
            errors.push({
                field: 'requirements',
                message: 'At least one requirement is required'
            });
        }

        // Medical history validation
        if (!profile.medicalHistory || 
            !Array.isArray(profile.medicalHistory.conditions) ||
            !Array.isArray(profile.medicalHistory.medications) ||
            !Array.isArray(profile.medicalHistory.vaccinations)) {
            errors.push({
                field: 'medicalHistory',
                message: 'Valid medical history is required'
            });
        }

        // Behavior validation
        if (!profile.behavior || 
            !Array.isArray(profile.behavior.traits)) {
            errors.push({
                field: 'behavior',
                message: 'Valid behavior information is required'
            });
        }

        // Schedule validation
        if (!profile.schedule || 
            !Array.isArray(profile.schedule.feedingTimes) ||
            profile.schedule.feedingTimes.length === 0) {
            errors.push({
                field: 'schedule',
                message: 'Valid feeding schedule is required'
            });
        }

        return errors;
    }

    /**
     * Sanitize a pet profile by removing any invalid or dangerous content
     */
    static sanitize(profile: PetProfile): PetProfile {
        return {
            ...profile,
            name: profile.name?.trim(),
            breed: profile.breed?.trim(),
            description: profile.description?.trim(),
            personality: profile.personality?.map(p => p.trim()) || [],
            requirements: profile.requirements?.map(r => r.trim()) || [],
            medicalHistory: profile.medicalHistory ? {
                ...profile.medicalHistory,
                conditions: profile.medicalHistory.conditions?.map(c => c.trim()) || [],
                medications: profile.medicalHistory.medications?.map(m => m.trim()) || []
            } : undefined,
            behavior: profile.behavior ? {
                ...profile.behavior,
                traits: profile.behavior.traits?.map(t => t.trim()) || []
            } : undefined
        };
    }
}
