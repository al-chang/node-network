import { randomNumber } from "./utils";

class Node {
  private xSpeed: number;
  private ySpeed: number;

  constructor(private x: number, private y: number) {
    this.xSpeed = randomNumber(-1, 1);
    this.ySpeed = randomNumber(-1, 1);
  }

  public getX() {
    return this.x;
  }

  public getY() {
    return this.y;
  }

  public move(xSpeed?: number, ySpeed?: number) {
    this.x += xSpeed || this.xSpeed;
    this.y += ySpeed || this.ySpeed;
  }

  public isOutOfBounds(width: number, height: number) {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }

  public bounce() {
    this.xSpeed = -this.xSpeed;
    this.ySpeed = -this.ySpeed;
  }

  public isWithinNode(node: Node, distance: number) {
    const dx = this.x - node.getX();
    const dy = this.y - node.getY();
    const distanceBetweenNodes = Math.sqrt(dx * dx + dy * dy);

    return distanceBetweenNodes < distance;
  }

  public distanceToNode(node: Node) {
    const dx = this.x - node.getX();
    const dy = this.y - node.getY();
    const distanceBetweenNodes = Math.sqrt(dx * dx + dy * dy);

    return distanceBetweenNodes;
  }

  public isWithinPoint(x: number, y: number, distance: number) {
    const dx = this.x - x;
    const dy = this.y - y;
    const distanceBetweenNodes = Math.sqrt(dx * dx + dy * dy);

    return distanceBetweenNodes < distance;
  }
}

export default Node;
