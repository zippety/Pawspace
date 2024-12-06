export const ETHICS_CONFIG = {
  // Minimum requirements
  MIN_SPACE_PER_PET: {
    DOG: 100, // square feet
    CAT: 50,
    BIRD: 30,
    OTHER: 50
  },

  // Safety features required
  REQUIRED_SAFETY_FEATURES: [
    'FENCING',
    'EMERGENCY_EQUIPMENT',
    'FIRST_AID_KIT',
    'SURVEILLANCE',
    'FIRE_SAFETY'
  ],

  // Pricing limits for fairness
  PRICING_LIMITS: {
    MIN_PRICE_PER_HOUR: 5,
    MAX_PRICE_PER_HOUR: 100,
    MAX_PRICE_MULTIPLIER: 3 // Maximum allowed multiplier compared to average in area
  },

  // Special needs accommodation requirements
  SPECIAL_NEEDS_REQUIREMENTS: {
    MOBILITY_IMPAIRED: ['RAMPS', 'WIDE_PASSAGES'],
    ELDERLY: ['SOFT_SURFACES', 'QUIET_AREAS'],
    ANXIETY: ['QUIET_AREAS', 'SEPARATE_SPACES'],
    MEDICAL: ['MEDICAL_STATION', 'REFRIGERATION']
  },

  // AI model configurations
  AI_MODELS: {
    WELFARE_CLASSIFIER: 'PawSpace/space-welfare-classifier',
    SAFETY_ANALYZER: 'PawSpace/safety-feature-analyzer',
    COMPATIBILITY_CHECKER: 'PawSpace/pet-space-compatibility'
  },

  // Assessment thresholds
  THRESHOLDS: {
    MINIMUM_APPROVAL_SCORE: 70,
    CRITICAL_CONCERN_PENALTY: 30,
    MAJOR_CONCERN_PENALTY: 20,
    MINOR_CONCERN_PENALTY: 15
  }
};
