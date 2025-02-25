module.exports = {
    moduleFileExtensions: ["vue", "js", "json"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
      "^.+\\.vue$": "vue-jest",
      "^.+\\.js$": "babel-jest",
    },
    testEnvironment: "jsdom",
  };
  