import React, { createContext, useContext } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const ZoomContext = createContext();

export const ZoomProvider = ({ children }) => (
  <TransformWrapper
    initialScale={1}
    minScale={0.5}
    maxScale={5}
    limitToBounds={true}
  >
    {({ zoomIn, zoomOut, resetTransform, scale, positionX, positionY }) => (
      <ZoomContext.Provider
        value={{
          zoomIn,
          zoomOut,
          resetTransform,
          scale,
          positionX,
          positionY,
        }}
      >
        {children}
      </ZoomContext.Provider>
    )}
  </TransformWrapper>
);

export const useZoom = () => useContext(ZoomContext);
