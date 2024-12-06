import { PetProfile } from '../types';

export const validProfile: PetProfile = {
    id: 'test-id',
    name: 'Buddy',
    type: 'dog' as const,
    breed: 'Golden Retriever',
    age: 3,
    size: 'medium' as const,
    description: 'Friendly and energetic dog',
    personality: ['friendly', 'energetic', 'playful'],
    requirements: ['daily walks', 'regular grooming'],
    medicalHistory: {
        conditions: [],
        medications: [],
        vaccinations: [
            { name: 'Rabies', date: new Date('2023-01-01') }
        ]
    },
    behavior: {
        traits: ['well-behaved', 'trained'],
        goodWith: {
            children: true,
            otherDogs: true,
            otherCats: false
        },
        trainingLevel: 'intermediate' as const
    },
    schedule: {
        feedingTimes: ['08:00', '18:00'],
        walkTimes: ['07:00', '12:00', '19:00']
    },
    embedding: new Float32Array([0.1, 0.2, 0.3]),
    createdAt: new Date(),
    updatedAt: new Date()
};

export const invalidPersonalityProfile: PetProfile = {
    ...validProfile,
    personality: null
};

export const invalidMedicalProfile: PetProfile = {
    ...validProfile,
    medicalHistory: {
        conditions: null,
        medications: [],
        vaccinations: []
    }
};

export const invalidBehaviorProfile: PetProfile = {
    ...validProfile,
    behavior: {
        traits: null,
        goodWith: {
            children: true,
            otherDogs: true,
            otherCats: false
        },
        trainingLevel: 'intermediate' as const
    }
};

export const invalidScheduleProfile: PetProfile = {
    ...validProfile,
    schedule: {
        feedingTimes: null
    }
};

export const updateData: Partial<PetProfile> = {
    description: 'Updated description',
    personality: ['friendly', 'calm', 'gentle'],
    behavior: {
        goodWith: {
            children: true,
            otherDogs: true,
            otherCats: true
        },
        traits: ['calm', 'gentle'],
        trainingLevel: 'advanced'
    }
};
