module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // setupFiles: ['<rootDir>/spec/setup.js'],
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {},
};
