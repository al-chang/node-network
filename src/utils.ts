import Node from "./Node";

/**
 * Generates a random number between min and max
 * @param min the minimum number
 * @param max the maximum number
 * @returns the random number
 */
export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const angleRad = (mouse: { x: number; y: number }, node: Node) =>
  Math.atan2(node.getY() - mouse.y, node.getX() - mouse.x);
