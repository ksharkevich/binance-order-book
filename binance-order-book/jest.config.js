module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|js|mjs|html)$': ['jest-preset-angular', { tsconfig: 'tsconfig.spec.json' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!@angular|rxjs|@taiga-ui|@ng-web-apis|@maskito|jasmine-marbles)',
  ],
  moduleFileExtensions: ['ts', 'js', 'html', 'json', 'mjs'],
  setupFilesAfterEnv: ['./jest.setup.ts']

};
