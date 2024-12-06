import { ProfileValidator } from '../validator';
import { validProfile } from './testData';
import { PetProfile } from '../types';

describe('ProfileValidator', () => {
    describe('validate', () => {
        it('should return no errors for valid profile', () => {
            const errors = ProfileValidator.validate(validProfile);
            expect(errors).toHaveLength(0);
        });

        it('should return errors for empty personality', () => {
            const errors = ProfileValidator.validate({
                ...validProfile,
                personality: []
            });
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('personality');
        });

        it('should return errors for empty medical conditions', () => {
            const errors = ProfileValidator.validate({
                ...validProfile,
                medicalHistory: {
                    ...validProfile.medicalHistory,
                    conditions: [],
                    medications: validProfile.medicalHistory.medications,
                    vaccinations: validProfile.medicalHistory.vaccinations
                }
            });
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('medical history');
        });

        it('should return errors for empty behavior traits', () => {
            const errors = ProfileValidator.validate({
                ...validProfile,
                behavior: {
                    ...validProfile.behavior,
                    traits: [],
                    goodWith: validProfile.behavior.goodWith,
                    trainingLevel: validProfile.behavior.trainingLevel
                }
            });
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('behavior');
        });

        it('should return errors for empty feeding times', () => {
            const errors = ProfileValidator.validate({
                ...validProfile,
                schedule: {
                    ...validProfile.schedule,
                    feedingTimes: [],
                    walkTimes: validProfile.schedule.walkTimes
                }
            });
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('schedule');
        });
    });
});
