// Paint.jsx
import { ImageContext } from "@/context/ImageContext";
import { Input } from "@nextui-org/react";
import { set } from "mongoose";
import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
} from "react";
import {
  FaAngleDown,
  FaEraser,
  FaMousePointer,
  FaPaintBrush,
} from "react-icons/fa";
import { IoShapesOutline } from "react-icons/io5";
import {
  RiCircleLine,
  RiLineChartLine,
  RiLineHeight,
  RiRectangleLine,
  RiTriangleLine,
} from "react-icons/ri";
import rough from "roughjs/bundled/rough.esm";
import getStroke from "perfect-freehand";
import { GiStraightPipe } from "react-icons/gi";
import "../css/menuEditor.css";

const generator = rough.generator();

function createElement(id, x1, y1, x2, y2, type, shape, options) {
  let roughElement;
  if (type === "shape") {
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    // Tạo hình dạng dựa trên giá trị của shape
    if (shape === "rectangle") {
      roughElement = generator.rectangle(minX, minY, width, height, options);
    } else if (shape === "circle") {
      const radius = Math.min(width, height) / 2;
      roughElement = generator.circle(
        minX + radius,
        minY + radius,
        radius * 2,
        options
      );
    } else if (shape === "triangle") {
      roughElement = generator.polygon(
        [
          [x1, y2],
          [(x1 + x2) / 2, y1],
          [x2, y2],
        ],
        options
      );
    } else if (shape === "line") {
      roughElement = generator.line(x1, y1, x2, y2, options);
    }
    return { id, x1, y1, x2, y2, type, shape, roughElement };
  } else if (type === "pen") {
    return {
      id,
      type,
      points: [{ x: x1, y: y1 }],
      stroke: options.stroke,
      strokeWidth: options.strokeWidth,
    };
  }
}

function nearPoint(x, y, x1, y1, point) {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? point : null;
}

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

const positionWithinElement = (x, y, element) => {
  const { type, shape, x1, x2, y1, y2 } = element;
  if (type === "shape") {
    switch (shape) {
      case "line":
        const on = onLine(x1, y1, x2, y2, x, y);
        const start = nearPoint(x, y, x1, y1, "start");
        const end = nearPoint(x, y, x2, y2, "end");
        return start || end || on;
      case "rectangle":
        const topLeft = nearPoint(x, y, x1, y1, "tl");
        const topRight = nearPoint(x, y, x2, y1, "tr");
        const bottomLeft = nearPoint(x, y, x1, y2, "bl");
        const bottomRight = nearPoint(x, y, x2, y2, "br");
        const inside =
          x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
        return topLeft || topRight || bottomLeft || bottomRight || inside;
      case "circle":
        const center = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
        const radius = distance(center, { x: x1, y: y1 });
        const insideC = distance(center, { x, y }) < radius ? "inside" : null;
        return insideC;
      case "triangle":
        const top = { x: (x1 + x2) / 2, y: y1 };
        const left = { x: x1, y: y2 };
        const right = { x: x2, y: y2 };
        const insideT =
          onLine(top.x, top.y, left.x, left.y, x, y, 5) ||
          onLine(top.x, top.y, right.x, right.y, x, y, 5) ||
          onLine(left.x, left.y, right.x, right.y, x, y, 5)
            ? "inside"
            : null;
        return insideT;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  } else if (type === "pen") {
    const betweenAnyPoint = element.points.some((point, index) => {
      const nextPoint = element.points[index + 1];
      if (!nextPoint) return false;
      return (
        onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
      );
    });
    return betweenAnyPoint ? "inside" : null;
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
  const { type, shape, x1, y1, x2, y2 } = element;
  if (type === "shape") {
    if (shape === "line") {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    } else if (shape === "rectangle") {
      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const maxX = Math.max(x1, x2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else if (shape === "circle") {
      // adjust circle to fit in a rectangle
      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const maxX = Math.max(x1, x2);
      const maxY = Math.max(y1, y2);
      const dx = maxX - minX;
      const dy = maxY - minY;
      const d = Math.min(dx, dy);
      return {
        x1: minX,
        y1: minY,
        x2: minX + d,
        y2: minY + d,
      };
    } else if (shape === "triangle") {
      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const maxX = Math.max(x1, x2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
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

const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

const drawElement = (roughCanvas, ctx, element) => {
  switch (element.type) {
    case "shape":
      if (element.roughElement) {
        roughCanvas.draw(element.roughElement);
      } else {
        console.warn("roughElement is undefined for the shape");
      }
      break;
    case "pen":
      if (element.points && element.points.length > 0) {
        const stroke = getStroke(element.points, { size: element.strokeWidth });
        const path = getSvgPathFromStroke(stroke);
        ctx.strokeStyle = element.stroke || "black";
        ctx.lineWidth = element.strokeWidth || 1;
        ctx.stroke(new Path2D(path));
      } else {
        console.warn("No points found for the pen");
      }
      break;
    default:
      console.warn(`Type not recognised: ${element.type}`);
  }
};

const adjustmentRequired = (type) => ["shape"].includes(type);

const Paint = () => {
  const {
    currentImage,
    getImageParameters,
    mergeDrawingWithImage,
    elements,
    setElements,
    dimensions,
    undoE,
    redoE,
  } = useContext(ImageContext);
  const canvasRef = useRef(null);
  const [action, setAction] = useState("none");
  const [lineWidth, setLineWidth] = useState(2);
  const [color, setColor] = useState("black");

  const [tool, setTool] = useState("shape");
  const [selectedElement, setSelectedElement] = useState(null);
  const [shape, setShape] = useState("rectangle");

  const menuTool = [
    { id: "pen", name: "Bút", icon: <FaPaintBrush /> },
    { id: "shape", name: "Tạo hình", icon: <IoShapesOutline /> },
    { id: "eraser", name: "Bút xóa", icon: <FaEraser /> },
    { id: "selection", name: "Chọn", icon: <FaMousePointer /> },
  ];

  const menuShape = [
    { id: "rectangle", name: "Hình chữ nhật", icon: <RiRectangleLine /> },
    { id: "circle", name: "Hình tròn", icon: <RiCircleLine /> },
    { id: "triangle", name: "Hình tam giác", icon: <RiTriangleLine /> },
    { id: "line", name: "Đường thẳng", icon: <GiStraightPipe /> },
  ];
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Kiểm tra nếu getImageParameters hoặc dimensions không tồn tại
    const imageParams = getImageParameters();
    if (!imageParams || !dimensions) {
      return; // Thoát ra nếu chưa có hình ảnh hoặc kích thước chưa xác định
    }

    const { top, left, width, height } = imageParams;

    // Set canvas dimensions and styles before drawing
    canvas.style.position = "absolute";
    canvas.style.top = `${top}px`;
    const offset = (22 * 16 * 15) / 100;
    canvas.style.left = `${left - offset}px`;

    console.log("size for image ", width, height);
    console.log("size for canvas ", dimensions.width, dimensions.height);

    // Giới hạn kích thước của canvas để không vượt quá kích thước màn hình
    canvas.width = Math.min(width, dimensions.width);
    canvas.height = Math.min(height, dimensions.height);
    canvas.style.zIndex = 10; // Ensure canvas is on top of the image

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Now proceed to draw
    const roughCanvas = rough.canvas(canvas);

    // Draw elements
    elements.forEach((element) => drawElement(roughCanvas, ctx, element));

    // Draw the bounding box if an element is selected
    if (selectedElement && selectedElement.type === "shape") {
      ctx.save();
      ctx.strokeStyle = "white"; // Chọn màu viền rõ ràng
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 3]); // Đường gạch ngang cho border

      // Điều chỉnh toạ độ để đường bao nằm bên ngoài element
      const padding = 5; // Độ giãn khoảng cách của viền bao ngoài
      const { x1, y1, x2, y2 } = adjustElementCoordinates(selectedElement);
      const minX = Math.min(x1, x2) - padding; // Di chuyển viền ra ngoài
      const minY = Math.min(y1, y2) - padding; // Di chuyển viền ra ngoài
      const boxWidth = Math.abs(x2 - x1) + padding * 2; // Tăng chiều rộng
      const boxHeight = Math.abs(y2 - y1) + padding * 2; // Tăng chiều cao

      // Vẽ hình chữ nhật bao quanh phần tử
      ctx.strokeRect(minX, minY, boxWidth, boxHeight);
      ctx.restore();
    }
  }, [elements, getImageParameters, currentImage, selectedElement, dimensions]);

  const updateElement = (id, x1, y1, x2, y2, type, shape) => {
    const elementsCopy = [...elements];
    switch (type) {
      case "shape":
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type, shape, {
          stroke: color,
          strokeWidth: lineWidth,
        });
        break;
      case "pen":
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    setElements(elementsCopy, true);
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === "pen") {
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
          setTimeout(() => {
            setAction("moving");
          }, 0);
        } else if (element.position === "inside") {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          const width = element.x2 - element.x1;
          const height = element.y2 - element.y1;

          // Cập nhật màu và độ dày trước khi cho phép di chuyển
          setSelectedElement({ ...element, offsetX, offsetY, width, height });
          setShape(element.shape);
          setColor(element.roughElement.options.stroke);
          setLineWidth(element.roughElement.options.strokeWidth);
          setElements((prevState) => prevState);

          setTimeout(() => {
            setAction("moving");
          }, 0);
        } else {
          const { id, x1, y1, x2, y2, type, shape } = element;
          const position = element.position;
          const offsetX = clientX - x1;
          const offsetY = clientY - y1;

          setSelectedElement({
            id,
            x1,
            y1,
            x2,
            y2,
            type,
            shape,
            position,
            offsetX,
            offsetY,
          });
          setAction("resizing");
        }
      }
    } else if (tool === "shape" || tool === "pen") {
      setAction("drawing");

      const id = elements.length;
      const newElement = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool,
        shape, // Truyền shape vào
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
    if (selectedElement) {
      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (
        (action === "drawing" || action === "resizing") &&
        adjustmentRequired(type)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type, shape);
      }
    }
    setTool("selection");
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
      updateElement(index, x1, y1, currentX, currentY, tool, shape); // Truyền shape vào
    } else if (action === "moving" && selectedElement) {
      if (selectedElement.type === "pen") {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: currentX - selectedElement.xOffsets[index],
          y: currentY - selectedElement.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id].points = newPoints;
        setElements(elementsCopy, true);
      } else {
        const { id, type, offsetX, offsetY, width, height } = selectedElement;

        const nextX1 = currentX - offsetX;
        const nextY1 = currentY - offsetY;
        const nextX2 = nextX1 + width;
        const nextY2 = nextY1 + height;

        updateElement(id, nextX1, nextY1, nextX2, nextY2, type, shape); // Truyền shape vào
      }
    } else if (action === "resizing" && selectedElement.type === "shape") {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        currentX,
        currentY,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, type, shape); // Truyền shape vào
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

  const handleChangeColor = (e) => {
    if (selectedElement) {
      const { id, type, shape } = selectedElement;
      const updatedElement = createElement(
        id,
        selectedElement.x1,
        selectedElement.y1,
        selectedElement.x2,
        selectedElement.y2,
        type,
        shape, // Truyền shape vào
        {
          stroke: e.target.value,
          strokeWidth: lineWidth,
        }
      );
      const elementsCopy = [...elements];
      elementsCopy[id] = updatedElement;
      setElements(elementsCopy);
    }
    setColor(e.target.value);
  };

  const handleChangeLineWidth = (e) => {
    const newLineWidth = e.target.value;

    if (selectedElement) {
      const { id, type } = selectedElement;

      // Nếu là phần tử 'pen'
      if (type === "pen") {
        const elementsCopy = [...elements];
        elementsCopy[id].strokeWidth = newLineWidth;
        setElements(elementsCopy);
      } else if (type === "shape") {
        // Nếu là phần tử 'shape'
        const updatedElement = createElement(
          id,
          selectedElement.x1,
          selectedElement.y1,
          selectedElement.x2,
          selectedElement.y2,
          type,
          selectedElement.shape, // Truyền shape vào
          {
            stroke: color,
            strokeWidth: newLineWidth,
          }
        );
        const elementsCopy = [...elements];
        elementsCopy[id] = updatedElement;
        setElements(elementsCopy);
      }
    }

    setLineWidth(newLineWidth);
  };

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Tìm phần tử tại vị trí click
    const element = getElementAtPosition(clientX, clientY, elements);

    // Nếu phần tử đã được chọn và bạn click vào chính nó thì không làm gì cả
    if (element && selectedElement && element.id === selectedElement.id) {
      return; // Không làm gì nếu phần tử đang được chọn lại
    }

    if (element && element.type === "shape") {
      // Nếu có phần tử được chọn, vẽ border và lưu vào state
      setSelectedElement(element);
      setShape(element.shape); // Cập nhật shape
      setColor(element.roughElement.options.stroke);
      setLineWidth(element.roughElement.options.strokeWidth);
    } else {
      // Nếu click ra ngoài, bỏ chọn phần tử
      setSelectedElement(null);
    }
  };

  return (
    <>
      {/* Canvas overlaying the image */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
        onClick={handleClick} // Sử dụng onClick để chọn hoặc bỏ chọn phần tử
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></canvas>

      <section id="paint" className="tool-drawer">
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
                  onChange={handleChangeColor}
                  className="input__color"
                />
                <FaAngleDown />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <label>Độ dày</label>
                <label>{lineWidth}</label>
              </div>
              {/* input type range */}
              <input
                type="range"
                min="1"
                max="50"
                value={lineWidth}
                onChange={handleChangeLineWidth}
                style={{ border: "none", outline: "none", width: "100%" }}
              />
            </div>
          </div>
        </div>
        {tool === "shape" && (
          <div id="crop-content" className="tool-content">
            <div className="tool-detail">
              <div className="group group1">
                <span>Khối</span>
                <div className="grid__tool">
                  {menuShape.map((item) => (
                    <div
                      className={`box__tool ${
                        shape === item.id ? "box__tool--active" : ""
                      }`}
                      onClick={() => setShape(item.id)}
                    >
                      {item.icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
  
        <div className="bottom-content">
          <div className="action-btn">
            <button id="filter-action-apply" onClick={undoE}>
              Hoàn tác
            </button>
            <button id="filter-action-apply" onClick={redoE}>
              Hoàn lại
            </button>
          </div>
        </div>
        <div className="bottom-content">
          <div className="action-btn">
            <button id="crop-action-cancel" onClick={{}}>
              Hủy
            </button>
            <button id="crop-action-apply" onClick={handleMerge}>
              Áp dụng
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Paint;
