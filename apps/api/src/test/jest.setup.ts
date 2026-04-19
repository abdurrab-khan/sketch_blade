// Suppress console output during tests
global.console.log = jest.fn();
global.console.error = jest.fn();

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.CLERK_SECRET_KEY = "test_clerk_secret_key";
process.env.CLERK_PUBLIC_KEY = "test_clerk_public_key";
process.env.MONGO_URI = "mongodb://localhost:27017";
