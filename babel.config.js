module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    ["@babel/preset-env", { targets: { node: "current" } }] // Ensure Jest compatibility
  ]
};
