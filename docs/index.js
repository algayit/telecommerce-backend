const servers = require("./");
const components = require("./components");
const tags = require("./tags");
const paths = require("./paths");

module.exports = {
  ...servers,
  ...components,
  ...tags,
  ...paths,
};
