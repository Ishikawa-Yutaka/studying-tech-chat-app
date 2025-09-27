module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // パスのエイリアス
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
