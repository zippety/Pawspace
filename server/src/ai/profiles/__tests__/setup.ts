// Set up test environment
process.env.NODE_ENV = 'test';

// Add custom matchers
expect.extend({
    toBeValidProfile(received) {
        const pass = received &&
            typeof received.id === 'string' &&
            typeof received.name === 'string' &&
            Array.isArray(received.personality) &&
            Array.isArray(received.requirements);

        return {
            pass,
            message: () => `expected ${received} to be a valid pet profile`
        };
    }
});
