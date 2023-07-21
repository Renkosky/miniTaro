const fs = require("fs");
const path = require("path");
const acron = require("acorn");
const walk = require("acorn-walk");
const jsx = require("acorn-jsx");
fs.readFile(path.join(__dirname, "page.jsx"), "utf8", (err, data) => {
  console.log(data);
  const ast = acron.Parser.extend(jsx()).parse(data, {
    plugin: {
      jsx: true,
    },
  });
  console.log(ast, "ast");
  console.log(JSON.stringify(ast), "stringAst");
  let wxmlCode = "";
  //Uncaught ReferenceError ReferenceError: parsedJsx is not defined
  // walk.full(
  //   ast,
  //   (node) => {
  //     console.log(node);
  //   },
  //   { ...walk.base, JSXElement: () => {} }
  // );
  // walk.simple(
  //   parsedJsx,
  //   {},
  //   {
  //     ...walk.base,
  //     JSXElement: () => {},
  //   }
  // );
  function generateWXML(node) {
    if (node.type === "JSXElement") {
      const openingElement = node.openingElement;
      const tagName = openingElement.name.name;
      const attributes = openingElement.attributes;
      const children = node.children;
      console.log(tagName, "tagName");
      let wxmlTagName;
      switch (tagName) {
        case "div":
          wxmlTagName = "View";
          break;
        case "text":
          wxmlTagName = "Text";
        default:
          wxmlTagName = "view";
          break;
      }
      wxmlCode += `<${wxmlTagName}`;

      // attributes.forEach((attr) => {
      //   const attrName = attr.name.name;
      //   const attrValue = attr.value.value;
      //   wxmlCode += ` ${attrName}="${attrValue}"`;
      // });

      if (children.length > 0) {
        wxmlCode += ">\n";
        children.forEach((child) => generateWXML(child));
        wxmlCode += `</${wxmlTagName}>\n`;
      } else {
        wxmlCode += " />\n";
      }
    } else if (node.type === "JSXText") {
      wxmlCode += node.value.trim();
    } else if (node.type === "Program") {
      node.body.forEach((statement) => {
        if (statement.type === "FunctionDeclaration") {
          generateWXML(statement.body);
        }
      });
    } else if (node.type === "BlockStatement") {
      node.body.forEach((statement) => {
        if (statement.type === "ExpressionStatement") {
          generateWXML(statement.expression);
        }
      });
    }
  }
  generateWXML(ast);
  console.log("content start====================");
  console.log(wxmlCode);
  console.log("content end====================");
  fs.writeFile(path.join(__dirname, "page.wxml"), wxmlCode, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("wxml 生成成功");
    }
  });
});
