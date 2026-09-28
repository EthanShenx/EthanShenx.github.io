import { useEffect, useRef } from "react";

const COLUMN_WIDTH = 14;
const ROW_HEIGHT = 12;
const FONT_SIZE = 12;
const ACTIVE_COLUMN_RATIO = 0.6;
const MIN_ROWS_PER_SECOND = 1.5;
const MAX_ROWS_PER_SECOND = 3;
const GLYPH_FONT = `500 ${FONT_SIZE}px "Zen Old Mincho", "Hiragino Mincho ProN", "Yu Mincho", monospace`;
const GLYPHS =
  "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

function createActiveColumn(rowCount) {
  const row = -randomBetween(1, Math.max(rowCount, 2));

  return {
    active: true,
    row,
    lastDrawnRow: Math.floor(row),
    rowsPerSecond: randomBetween(MIN_ROWS_PER_SECOND, MAX_ROWS_PER_SECOND),
  };
}

function createColumns(columnCount, rowCount) {
  return Array.from({ length: columnCount }, () =>
    Math.random() < ACTIVE_COLUMN_RATIO
      ? createActiveColumn(rowCount)
      : { active: false },
  );
}

export function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !container || !context) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let columns = [];
    let width = 0;
    let height = 0;
    let rowCount = 0;
    let previousTime = 0;

    const setGlyphStyle = () => {
      context.font = GLYPH_FONT;
      context.textAlign = "center";
      context.textBaseline = "top";
    };

    const paintBase = () => {
      context.fillStyle = "#09090b";
      context.fillRect(0, 0, width, height);
    };

    const drawGlyph = (columnIndex, row, color) => {
      if (row < 0 || row >= rowCount) return;

      context.fillStyle = color;
      context.fillText(
        randomGlyph(),
        columnIndex * COLUMN_WIDTH + COLUMN_WIDTH / 2,
        row * ROW_HEIGHT,
      );
    };

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      setGlyphStyle();
      paintBase();

      const columnCount = Math.ceil(width / COLUMN_WIDTH);
      rowCount = Math.ceil(height / ROW_HEIGHT);
      columns = createColumns(columnCount, rowCount);
      previousTime = 0;
    };

    const drawFrame = (time) => {
      const deltaSeconds = previousTime
        ? Math.min((time - previousTime) / 1000, 0.1)
        : 0;
      previousTime = time;

      context.fillStyle = "rgba(9, 9, 11, 0.08)";
      context.fillRect(0, 0, width, height);
      setGlyphStyle();

      columns.forEach((column, columnIndex) => {
        if (!column.active) return;

        column.row += column.rowsPerSecond * deltaSeconds;
        const nextRow = Math.floor(column.row);

        if (nextRow > column.lastDrawnRow) {
          drawGlyph(columnIndex, nextRow - 1, "rgba(212, 212, 216, 0.72)");
          drawGlyph(columnIndex, nextRow, "rgba(250, 250, 250, 0.92)");
          column.lastDrawnRow = nextRow;
        }

        if (nextRow > rowCount + 1) {
          columns[columnIndex] = createActiveColumn(rowCount);
        }
      });

      animationFrame = window.requestAnimationFrame(drawFrame);
    };

    const stopAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      previousTime = 0;
    };

    const startAnimation = () => {
      stopAnimation();
      if (!reduceMotion.matches && !document.hidden) {
        animationFrame = window.requestAnimationFrame(drawFrame);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stopAnimation();
      else startAnimation();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      startAnimation();
    });

    resize();
    startAnimation();
    resizeObserver.observe(container);
    reduceMotion.addEventListener("change", startAnimation);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (document.fonts) {
      document.fonts
        .load(`500 ${FONT_SIZE}px "Zen Old Mincho"`)
        .then(setGlyphStyle)
        .catch(() => {});
    }

    return () => {
      stopAnimation();
      resizeObserver.disconnect();
      reduceMotion.removeEventListener("change", startAnimation);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="matrix-rain" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
