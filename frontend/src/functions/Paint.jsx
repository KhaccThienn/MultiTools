// Paint.jsx
import { ImageContext } from "@/context/ImageContext";
import {Input} from "@nextui-org/react";
import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
} from "react";
import { FaAngleDown, FaEraser, FaMousePointer, FaPaintBrush } from "react-icons/fa";
import { IoShapesOutline } from "react-icons/io5";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

function createElement(id, x1, y1, x2, y2, type, options) {
  let roughElement;
  if (type === "shape") {
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    roughElement = generator.rectangle(minX, minY, width, height, options);
  } else if (type === "line") {
    roughElement = generator.line(x1, y1, x2, y2, options);
  }

  return { id, x1, y1, x2, y2, type, roughElement };
}

function nearPoint(x, y, x1, y1, point) {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? point : null;
}

const positionWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element;
  if (type === "shape") {
    const topLeft = nearPoint(x, y, x1, y1, "tl");
    const topRight = nearPoint(x, y, x2, y1, "tr");
    const bottomLeft = nearPoint(x, y, x1, y2, "bl");
    const bottomRight = nearPoint(x, y, x2, y2, "br");
    const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    return topLeft || topRight || bottomLeft || bottomRight || inside;
  } else {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    const start = nearPoint(x, y, x1, y1, "start");
    const end = nearPoint(x, y, x2, y2, "end");
    const inside = Math.abs(offset) < 1 ? "inside" : null;
    return start || end || inside;
  }
};

const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
  return elements
    .map((element) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element) => element.position !== null);
};

const adjustElementCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "shape") {
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

const cursorForPosition = (position) => {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
};

const resizedCoordinates = (clientX, clientY, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null;
  }
};

const Paint = () => {
  const { currentImage, getImageParameters, mergeDrawingWithImage } =
    useContext(ImageContext);
  const canvasRef = useRef(null);
  const [action, setAction] = useState("none");
  const [lineWidth, setLineWidth] = useState(2);
  const [color, setColor] = useState("red");
  const [elements, setElements] = useState([]);
  const [tool, setTool] = useState("line");
  const [selectedElement, setSelectedElement] = useState(null);

  const menuTool = [
    { id: "line", name: "Bút", icon: <FaPaintBrush /> },
    { id: "shape", name: "Tạo hình", icon: <IoShapesOutline /> },
    { id: "eraser", name: "Bút xóa", icon: <FaEraser /> },
    { id: "selection", name: "Chọn", icon: <FaMousePointer /> },
  ];

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const { top, left, width, height } = getImageParameters();

    // Set canvas dimensions and styles before drawing
    canvas.style.position = "absolute";
    canvas.style.top = `${top}px`;
    const offset = (22 * 16 * 15) / 100;
    canvas.style.left = `${left - offset}px`;
    canvas.width = width;
    canvas.height = height;
    canvas.style.zIndex = 10; // Ensure canvas is on top of the image

    // Now proceed to draw
    const roughCanvas = rough.canvas(canvas);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    elements.forEach((element) => roughCanvas.draw(element.roughElement));
  }, [elements, getImageParameters, currentImage]);

  const updateElement = (id, x1, y1, x2, y2, type) => {
    const updatedElement = createElement(id, x1, y1, x2, y2, type, {
      stroke: color,
      strokeWidth: lineWidth,
    });

    const elementsCopy = [...elements];
    elementsCopy[id] = updatedElement;
    setElements(elementsCopy);
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        const width = element.x2 - element.x1;
        const height = element.y2 - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY, width, height });

        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else if (tool === "shape" || tool === "line") {
      setAction("drawing");

      const id = elements.length;
      const newElement = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool,
        {
          stroke: color,
          strokeWidth: lineWidth,
        }
      );
      setElements((prevState) => [...prevState, newElement]);
      setSelectedElement(newElement);
    }
  };

  const handleMouseUp = () => {
    const index = selectedElement.id;
    const { id, type } = elements[index];
    if (action === "drawing" || action === "resizing") {
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updateElement(id, x1, y1, x2, y2, type);
    }
    setAction("none");
    setSelectedElement(null);
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (tool === "selection") {
      const element = getElementAtPosition(currentX, currentY, elements);
      e.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, currentX, currentY, tool);
    } else if (action === "moving" && selectedElement) {
      const { id, type, offsetX, offsetY, width, height } = selectedElement;

      const nextX1 = currentX - offsetX;
      const nextY1 = currentY - offsetY;
      const nextX2 = nextX1 + width;
      const nextY2 = nextY1 + height;

      updateElement(id, nextX1, nextY1, nextX2, nextY2, type);
    } else if (action === "resizing") {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        currentX,
        currentY,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, type);
    }
  };

  const handleMerge = () => {
    const canvasOverlay = canvasRef.current;
    const imageParams = getImageParameters();
    if (!imageParams) {
      console.error("Không lấy được thông số hình ảnh");
      return;
    }
    const { width, height } = imageParams;

    // Create a new canvas to merge
    const canvasMerge = document.createElement("canvas");
    canvasMerge.width = width;
    canvasMerge.height = height;
    const ctxMerge = canvasMerge.getContext("2d");

    // Create an Image object for the original image
    const image = new Image();
    image.src = currentImage;

    image.onload = () => {
      // Draw the original image onto canvasMerge
      ctxMerge.drawImage(image, 0, 0, width, height);

      // Draw the overlay canvas onto canvasMerge
      ctxMerge.drawImage(canvasOverlay, 0, 0, width, height);

      // Get the data URL from canvasMerge
      const mergedImageUrl = canvasMerge.toDataURL("image/jpeg");

      // Update the current image in context
      mergeDrawingWithImage(mergedImageUrl);

      // Clear the overlay canvas
      setElements([]);
    };
  };

  return (
    <>
      {/* Canvas overlaying the image */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></canvas>

      <section id="crop" className="tool-drawer">
        <div className="tool-name" style={{ justifyContent: "center" }}>
          <div></div>
          Cắt ảnh
        </div>
        <div className="splitter"></div>

        <div id="crop-content" className="tool-content">
          <div className="tool-detail">
            <div className="group group1">
              <span>Công cụ</span>
              <div className="grid__tool">
                {menuTool.map((item) => (
                  <div
                    className={`box__tool ${
                      tool === item.id ? "box__tool--active" : ""
                    }`}
                    onClick={() => setTool(item.id)}
                  >
                    {item.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div id="crop-content" className="tool-content">
          <div className="tool-detail">
            <div className="group group1">
              <span>Màu</span>
              <div className="box__color">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="input__color"
                />
                <FaAngleDown/>
                </div>

                <span>Độ dày</span>
                {/* input type range */}
                <Input type="range" min="1" max="10" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} style={{borderWidth:"0"}}/>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Paint;
