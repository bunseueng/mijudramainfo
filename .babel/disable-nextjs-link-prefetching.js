module.exports = function ({ types: t }) {
  return {
    name: "nextjs-link-prefetch-default",
    visitor: {
      JSXOpeningElement({ node }) {
        if (node.name.name === "Link") {
          const defaultValue = false;
          const prefetchAttributes = node.attributes.filter(
            (attribute) =>
              attribute.type === "JSXAttribute" &&
              attribute.name.name === "prefetch"
          );
          if (prefetchAttributes.length <= 0) {
            node.attributes.push(
              t.jSXAttribute(
                t.jSXIdentifier("prefetch"),
                t.JSXExpressionContainer(t.booleanLiteral(defaultValue))
              )
            );
          }
        }
      },
    },
  };
};
