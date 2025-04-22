import { useEffect, useRef } from "react";
//import imgurl from "../images/earth_rotating4_nobg.png";
import imgurl from "../images/sprite_sheet.png"; // ✅ Διορθωμένο
/*
../images/earth_rotating2.png
const FRAME_WIDTH = 204.8;
const FRAME_HEIGHT = 204.8;
const TOTAL_FRAMES = 25;
const SPRITE_COLUMNS = 5;
const FRAME_DURATION = 100;
*/
/* δουλευει με το earth_rotating4.png 
const FRAME_WIDTH = 115;
const FRAME_HEIGHT = 115;
const TOTAL_FRAMES = 48;
const SPRITE_COLUMNS = 12;
const FRAME_DURATION = 100;*/

//δουλευει με το sprite_sheet.png
const FRAME_WIDTH = 1024;
const FRAME_HEIGHT = 1009;
const TOTAL_FRAMES = 36;
const SPRITE_COLUMNS = 6;
const FRAME_DURATION = 150;

/* δουλευει με το earth_rotating3.png
const FRAME_WIDTH = 256;
const FRAME_HEIGHT = 256;
const TOTAL_FRAMES = 24;
const SPRITE_COLUMNS = 4;
const FRAME_DURATION = 100;
//*/
export default function EarthCanvasAnimation() {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const frameRef = useRef(0);
  const lastFrameTime = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = new Image();
    img.src = imgurl; // ✅ Διορθωμένο
    imageRef.current = img;

    const draw = (now) => {
      if (!ctx || !imageRef.current) return;
      if (now - lastFrameTime.current >= FRAME_DURATION) {
        frameRef.current = (frameRef.current + 1) % TOTAL_FRAMES;
        lastFrameTime.current = now;
      }

      const frame = frameRef.current;
      const row = Math.floor(frame / SPRITE_COLUMNS);
      const col = frame % SPRITE_COLUMNS;

      //console.log(`Frame: ${frame}, Row: ${row}, Col: ${col}`);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        imageRef.current,
        col * FRAME_WIDTH,
        row * FRAME_HEIGHT,
        FRAME_WIDTH,
        FRAME_HEIGHT,
        0,
        0,
        canvas.width,
        canvas.height
      );

      requestAnimationFrame(draw);
    };

    img.onload = () => {
      requestAnimationFrame(draw);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="earth-canvas"
      width={FRAME_WIDTH}
      height={FRAME_HEIGHT}
    />
  );
}
