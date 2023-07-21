const fs = require("fs");
const path = require("path");
const babelParser = require("@babel/parser");
fs.readFile(path.join(__dirname, "page.jsx"), "utf8", (err, data) => {
  const astCode = babelParser.parse(data, {
    // sourceType: "module",
    plugins: ["jsx"],
  })?.program?.body;
  console.log(astCode);
});
