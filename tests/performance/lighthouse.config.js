module.exports = {
  ci: {
    collect: {
      startServerCommand: "npx http-server dist -a 127.0.0.1 -p 4173 -c-1",
      startServerReadyPattern: "Available on:",
      url: ["http://127.0.0.1:4173/"],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 1 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:best-practices": ["error", { minScore: 1 }],
        "categories:seo": ["error", { minScore: 1 }],
      },
    },
  },
};
