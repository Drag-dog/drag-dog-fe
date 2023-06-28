import React from "react";

/**
 * @description Find the component with "type.name" in the children array.
 * @returns Array
 */
export const getChildrenByName = (children: React.ReactNode, typeName: string) => {
  return React.Children.toArray(children).filter((element) => {
    if (React.isValidElement(element) && typeof element.type === "function")
      return element.type.name === typeName;
    return false;
  });
};
