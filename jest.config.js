module.exports = {
    testEnvironment: 'jest-environment-jsdom', // Specify the environment for Jest
    transform: {
      '^.+\\.jsx?$': 'babel-jest',  // Use babel-jest to transform JS and JSX files
    },
  };
  