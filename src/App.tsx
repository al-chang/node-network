import "./App.css";
import { easeLinear, scaleLinear, select, Selection } from "d3";
import { useEffect, useRef, useState } from "react";
import { angleRad, randomNumber } from "./utils";
import Node from "./Node";

const MIN_CONNECTION_DISTANCE = 150;
const COLOR_SCALE = scaleLinear()
  .domain([0, MIN_CONNECTION_DISTANCE])
  .range(["black", "white"]);
const STROKE_SCALE = scaleLinear()
  .domain([0, MIN_CONNECTION_DISTANCE])
  .range([1.5, 0.5]);

function App() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);
  const [nodes, _setNodes] = useState<Node[]>(
    Array.from({ length: 75 }, () => {
      return new Node(
        randomNumber(0, window.innerWidth),
        randomNumber(0, window.innerHeight)
      );
    })
  );

  useEffect(() => {
    if (selection === null) {
      setSelection(select(svgRef.current));
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    selection
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.getX())
      .attr("cy", (d) => d.getY())
      .attr("r", 10);

    const drawLine = (node1: Node, node2: Node) => {
      const distance = node1.distanceToNode(node2);
      const color = COLOR_SCALE(distance);

      selection
        .insert("line", ":first-child")
        .attr("x1", node1.getX())
        .attr("y1", node1.getY())
        .attr("x2", node2.getX())
        .attr("y2", node2.getY())
        .attr("stroke", color)
        .attr("stroke-width", STROKE_SCALE(distance));
    };

    const tick = () => {
      selection.selectAll("line").remove();

      nodes.forEach((d, i) => {
        const node = d as Node;
        if (node.isOutOfBounds(window.innerWidth, window.innerHeight)) {
          node.bounce();
        }

        if (node.isWithinPoint(mouseRef.current.x, mouseRef.current.y, 200)) {
          console.log(mouseRef.current);
          const angle = angleRad(mouseRef.current, node);
          const offsetX = Math.cos(angle) * 10;
          const offsetY = Math.sin(angle) * 10;
          node.move(offsetX, offsetY);
          node.bounce();
        } else {
          node.move();
        }

        // check if node is within 50px to another node
        nodes.slice(i).forEach((otherNode) => {
          if (node === otherNode) return;
          if (node.isWithinNode(otherNode, MIN_CONNECTION_DISTANCE)) {
            drawLine(node, otherNode);
          }
        });
      });

      selection
        .selectAll("circle")
        .attr("cx", (d) => (d as Node).getX())
        .attr("cy", (d) => (d as Node).getY());
      animationFrameId = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [selection, setSelection]);

  return (
    <div>
      <svg
        id="data-frame"
        style={{ width: "100vw", height: "100vh" }}
        ref={svgRef}
      />
    </div>
  );
}

export default App;
