const fs = require("fs");
const path = require("path");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse");
fs.readFile(path.join(__dirname, "page.jsx"), "utf8", (err, data) => {
  const astCode = babelParser.parse(data, {
    // sourceType: "module",
    plugins: ["jsx"],
  });
  console.log(astCode);
  let wxmlCode = "";
  babelTraverse.default(astCode, {
    enter(path) {
      // console.log(path.node, "path.node");
      if (path.isJSXText()) {
        wxmlCode += path.node.value;
      }
      if (path.isJSXOpeningElement()) {
        wxmlCode += `<${transformTagName(path.node.name.name)}>`;
      }
      if (path.isJSXClosingElement()) {
        wxmlCode += `</${transformTagName(path.node.name.name)}>`;
      }
    },
  });
  console.log(wxmlCode, "wxmlCode");
  fs.writeFile(path.join(__dirname, "page.wxml"), wxmlCode, (err) => {});
});

function transformTagName(tagName) {
  let wxmlTagName = "";
  switch (tagName) {
    case "div":
      wxmlTagName = "view";
      break;
    case "span":
      wxmlTagName = "text";
      break;
    case "img":
      wxmlTagName = "image";
      break;
    default:
      wxmlTagName = "view";
  }
  return wxmlTagName;
}
