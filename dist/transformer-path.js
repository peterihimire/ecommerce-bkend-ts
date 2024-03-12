"use strict";
// import * as ts from "typescript";
// const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
//   return (sourceFile) => {
//     function visitNode(node: ts.Node): ts.Node {
//       if (
//         ts.isCallExpression(node) &&
//         ts.isPropertyAccessExpression(node.expression) &&
//         ts.isStringLiteral(node.expression.expression) &&
//         node.expression.expression.text === "__dirname" &&
//         node.expression.name.text === "require" &&
//         node.arguments.length === 1 &&
//         ts.isStringLiteral(node.arguments[0])
//       ) {
//         const filePath = node.arguments[0].text;
//         const newFilePath = filePath.replace(/\.ts$/, ".js");
//         return ts.factory.createCallExpression(
//           ts.factory.createPropertyAccessExpression(
//             node.expression.expression,
//             "require"
//           ),
//           undefined,
//           [ts.factory.createStringLiteral(newFilePath)]
//         );
//       }
//       return ts.visitEachChild(node, visitNode, context);
//     }
//     return ts.visitNode(sourceFile, visitNode);
//   };
// };
// export default transformer;
// import * as ts from "typescript";
// const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
//   const visit: ts.Visitor = (node) => {
//     if (
//       ts.isCallExpression(node) &&
//       ts.isPropertyAccessExpression(node.expression) &&
//       ts.isStringLiteral(node.expression.expression) &&
//       node.expression.expression.text === "__dirname" &&
//       node.expression.name.text === "require" &&
//       node.arguments.length === 1 &&
//       ts.isStringLiteral(node.arguments[0])
//     ) {
//       const filePath = node.arguments[0].text;
//       const newFilePath = filePath.replace(/\.ts$/, ".js");
//       return ts.factory.createCallExpression(
//         ts.factory.createPropertyAccessExpression(
//           node.expression.expression,
//           "require"
//         ),
//         undefined,
//         [ts.factory.createStringLiteral(newFilePath)]
//       );
//     }
//     return ts.visitEachChild(node, visit, context);
//   };
//   return (sourceFile) => ts.visitNode(sourceFile, visit);
// };
// export default transformer;
// import * as ts from "typescript";
// const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
//   const visit: ts.Visitor = (node) => {
//     if (
//       ts.isCallExpression(node) &&
//       ts.isPropertyAccessExpression(node.expression) &&
//       ts.isStringLiteral(node.expression.expression) &&
//       node.expression.expression.text === "__dirname" &&
//       node.expression.name.text === "require" &&
//       node.arguments.length === 1 &&
//       ts.isStringLiteral(node.arguments[0])
//     ) {
//       const filePath = node.arguments[0].text;
//       const newFilePath = filePath.replace(/\.ts$/, ".js");
//       return ts.factory.createCallExpression(
//         ts.factory.createPropertyAccessExpression(
//           node.expression.expression,
//           "require"
//         ),
//         undefined,
//         [ts.factory.createStringLiteral(newFilePath)]
//       );
//     }
//     return node;
//   };
//   return (sourceFile) => ts.visitNode(sourceFile, visit);
// };
// export default transformer;
// import * as ts from "typescript";
// const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
//   const visit: ts.Visitor = (node) => {
//     if (
//       ts.isCallExpression(node) &&
//       ts.isPropertyAccessExpression(node.expression) &&
//       ts.isStringLiteral(node.expression.expression) &&
//       node.expression.expression.text === "__dirname" &&
//       node.expression.name.text === "require" &&
//       node.arguments.length === 1 &&
//       ts.isStringLiteral(node.arguments[0])
//     ) {
//       const filePath = node.arguments[0].text;
//       const newFilePath = filePath.replace(/\.ts$/, ".js");
//       return ts.factory.createCallExpression(
//         ts.factory.createPropertyAccessExpression(
//           node.expression.expression,
//           "require"
//         ),
//         undefined,
//         [ts.factory.createStringLiteral(newFilePath)]
//       );
//     }
//     // If the node doesn't match the condition, return it as is
//     return ts.visitEachChild(node, visit, context);
//   };
//   return (sourceFile) => ts.visitNode(sourceFile, visit);
// };
// export default transformer;
// import * as ts from 'typescript';
// const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
//   const visit: ts.Visitor = (node) => {
//     // Replace require(__dirname + '/../config/config.ts') with require(__dirname + '/../config/config.js')
//     if (
//       ts.isCallExpression(node) &&
//       ts.isPropertyAccessExpression(node.expression) &&
//       ts.isStringLiteral(node.expression.expression) &&
//       node.expression.name.text === 'require' &&
//       node.arguments.length === 1 &&
//       ts.isBinaryExpression(node.arguments[0]) &&
//       ts.isStringLiteral(node.arguments[0].left) &&
//       ts.isStringLiteral(node.arguments[0].right) &&
//       node.arguments[0].operatorToken.kind === ts.SyntaxKind.PlusToken &&
//       node.arguments[0].left.text === '__dirname' &&
//       node.arguments[0].right.text === '/../config/config.ts'
//     ) {
//       return ts.factory.createCallExpression(
//         ts.factory.createPropertyAccessExpression(
//           node.expression.expression,
//           'require'
//         ),
//         undefined,
//         [ts.factory.createStringLiteral('__dirname + '/../config/config.js'')]
//       );
//     }
//     // Replace .ts with .js and exclude .test.js files
//     if (
//       ts.isStringLiteral(node) &&
//       node.text.endsWith('.ts') &&
//       !node.text.endsWith('.test.ts')
//     ) {
//       return ts.factory.createStringLiteral(
//         node.text.replace(/\.ts$/, '.js')
//       );
//     }
//     // If the node doesn't match the condition, return it as is
//     return ts.visitEachChild(node, visit, context);
//   };
//   return (sourceFile) => ts.visitNode(sourceFile, visit);
// };
// export default transformer;
