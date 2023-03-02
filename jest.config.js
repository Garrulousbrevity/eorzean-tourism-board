const config = {
    testPathIgnorePatterns: ['/node_modules/'],
    // Don't depend on internal module state ACROSS tests
    resetModules: true,
    // Mock any static assets not relevant to tests
    moduleNameMapper: {
      '^.+\\.(ttf|woff|woff2|scss|css|jpeg|png|graphql)$': require.resolve(
        'identity-obj-proxy'
      ),
    },
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    }
}
module.exports = config;