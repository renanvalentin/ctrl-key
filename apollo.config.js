module.exports = {
  client: {
    service: {
      name: "server",
      url: "http://localhost:4000/graphql",
    },
    includes: ["./mobile/src/**/*"],
  },
};
