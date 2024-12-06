export interface PetProfile {
    id: string;
    name: string;
    type: 'dog' | 'cat' | 'bird' | 'other';
    breed: string;
    age: number;
    size: 'small' | 'medium' | 'large';
    description: string;
    personality: string[];
    requirements: string[];
    medicalHistory: {
        conditions: string[];
        medications: string[];
        vaccinations: {
            name: string;
            date: Date;
        }[];
    };
    behavior: {
        traits: string[];
        goodWith?: {
            children: boolean;
            otherDogs: boolean;
            otherCats: boolean;
        };
        trainingLevel?: 'beginner' | 'intermediate' | 'advanced';
    };
    schedule: {
        feedingTimes: string[];
        walkTimes?: string[];
        medications?: {
            name: string;
            time: string;
            dosage: string;
        }[];
    };
    embedding: number[];
    createdAt: Date;
    updatedAt: Date;
}

export interface SearchResult {
    profile: PetProfile;
    score: number;
}

export interface ProfileValidationError {
    field: string;
    message: string;
}

export interface ProfileMatch {
    profile: PetProfile;
    similarity: number;
}
