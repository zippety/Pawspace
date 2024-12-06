export interface Space {
    id: string;
    name: string;
    type: 'indoor' | 'outdoor' | 'hybrid';
    size: {
        width: number;
        length: number;
        height?: number;
    };
    features: string[];
    capacity: number;
    restrictions?: string[];
    amenities: string[];
    environment: {
        temperature?: {
            min: number;
            max: number;
        };
        lighting?: 'natural' | 'artificial' | 'mixed';
        noise?: 'quiet' | 'moderate' | 'active';
    };
}

export interface SpaceMatchingResult {
    spaceId: string;
    score: number;
    matchingFeatures: string[];
    considerations: string[];
}
