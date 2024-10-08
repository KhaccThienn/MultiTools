import React, { useContext } from "react";
import { ImageContext } from "@/context/ImageContext";

const Cutout = () => {
  const {
    getImageParameters,
    drawArea,
    mergeDrawnAreaWithImage,
    currentImage,
  } = useContext(ImageContext);


  const handleAddText = () => {
    const params = getImageParameters();
    console.log(params);
    
    if (!params) return;

    // Define a drawing callback to add custom content
    const drawText = (ctx) => {
      // Example: Drawing a semi-transparent rectangle
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, params.width, params.height);

      // Adding text
      ctx.font = "48px serif";
      ctx.fillStyle = "white";
      ctx.fillText("Hello World", 50, 100);
    };

    const drawnCanvas = drawArea(params, drawText);

    mergeDrawnAreaWithImage(drawnCanvas);
  };

  return (
    <div>

      <button onClick={handleAddText}>Add Text</button>
    </div>
  );
};

export default Cutout;
