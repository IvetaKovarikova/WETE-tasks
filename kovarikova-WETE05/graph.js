const CELL_SIZE = 24;
const SIZE = CELL_SIZE/2; //size of bars, circles etc
const START_ANGLE = 90;
const HIGHLIGHT_COLOR = "blue";
const BASE_COLOR = "black";

const degreesToRadians = (d) => (d * Math.PI) / 180;

const recalcPieData = (data) => {
  const sumVals = data.map((el) => el[1]).reduce((a, b) => a + b, 0);

  return data.map((el) => {
    const newVal = (360 * el[1]) / sumVals;
    return [el[0], newVal, el[2]];
  });
};

const getCanvas = (htmlParentClass, numOfXValues = 10, numOfYValues = 10) => {
  const canvas = document.createElement("canvas");
  canvas.width = numOfXValues * CELL_SIZE;
  canvas.height = numOfYValues * CELL_SIZE;
  canvas.className = "main-canvas";

  document.querySelector(htmlParentClass).appendChild(canvas);

  const context = canvas.getContext("2d");
  if (!context) return;

  return { canvas, context };
};

const drawGrid = (canvas, context) => {
  context.strokeStyle = "lightGray";

  // the grid
  for (let x = 0; x <= canvas.width; x += CELL_SIZE) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }

  for (let x = 0; x <= canvas.height; x += CELL_SIZE) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
  context.stroke();
  context.closePath();

  //the axis
  context.beginPath();
  context.strokeStyle = "black";

  context.moveTo(0, 0);
  context.lineTo(canvas.width, 0);

  context.moveTo(0, 0);
  context.lineTo(0, canvas.height);

  context.stroke();
  context.closePath();
};

const drawLabel = (text, color, htmlParentClass) => {
  const label = document.createElement("span");
  label.innerText = text;
  label.className = "label";
  label.style.color = color;

  document.querySelector(htmlParentClass).appendChild(label);
};

const drawGraph = (canvas, context, data, type, toHighlight = []) => {
  if (!context) return;

  let x, y;
  switch (type) {
    case "bar":
      data.forEach((el) => {
        x = el[0] * CELL_SIZE + (1 / 2) * SIZE;
        y = 0;

        toHighlight.includes(el)
          ? (context.fillStyle = HIGHLIGHT_COLOR)
          : (context.fillStyle = BASE_COLOR);

        context.fillRect(x, y, SIZE, el[1] * CELL_SIZE);
      });
      break;

    case "dot":
      data.forEach((el) => {
        x = el[0] * CELL_SIZE + SIZE;
        y = el[1] * CELL_SIZE - SIZE;

        toHighlight.includes(el)
          ? (context.fillStyle = HIGHLIGHT_COLOR)
          : (context.fillStyle = BASE_COLOR);

        context.beginPath();
        context.arc(x, y, (1 / 2) * SIZE, 0, 2 * Math.PI);
        context.fill();
      });
      break;

    case "line":
      context.beginPath();
      context.lineWidth = 5;
      context.lineCap = "round";
      context.lineJoin = "round";

      const highlightElems = [];

      data.forEach((el) => {
        x = el[0] * CELL_SIZE + SIZE;
        y = el[1] * CELL_SIZE - SIZE;

        context.lineTo(x, y);
        context.stroke();

        if (toHighlight.includes(el)) highlightElems.push({ x: x, y: y });
      });

      highlightElems.forEach((el) => {
        context.beginPath();
        context.fillStyle = HIGHLIGHT_COLOR;
        context.arc(el.x, el.y, (1 / 2) * SIZE, 0, 2 * Math.PI);
        context.fill();
      });

      break;

    case "pie":
      const center = { x: canvas.width / 2, y: canvas.height / 2 };
      const r = Math.min(center.x, center.y);

      const recalculatedData = recalcPieData(data);
      let startAngle = START_ANGLE;

      for (let i = 0; i < data.length; i++) {
        const el = recalculatedData[i];
        const start = degreesToRadians(startAngle);
        const end = start + degreesToRadians(el[1]);

        context.beginPath();
        context.moveTo(center.x, center.y);
        context.arc(center.x, center.y, r, start, end);
        context.closePath();

        context.fillStyle = el[2];
        context.fill();

        toHighlight.includes(data[i])
          ? ((context.strokeStyle = HIGHLIGHT_COLOR), (context.lineWidth = 2))
          : ((context.strokeStyle = BASE_COLOR), (context.lineWidth = 1));

        context.stroke();
        startAngle += el[1];
      }
      break;
  }
};

const drawLegend = (canvas, bottomMax, htmlParentClass, leftMax) => {
  const fontSize = 20;

  //left
  const leftCanvas = document.createElement("canvas");
  leftCanvas.height = canvas.height;
  leftCanvas.width = fontSize;
  leftCanvas.className = "left-legend";
  leftCanvas.style.left = -CELL_SIZE;

  const lbtx = leftCanvas.getContext("2d");
  lbtx.font = fontSize + "sans-serif";

  let x = 1;
  [...Array(leftMax).keys()].reverse().forEach((val) => {
    lbtx.fillText(val, 0, x * CELL_SIZE - (1 / 4) * CELL_SIZE);
    x++;
  });

  document.querySelector(htmlParentClass).appendChild(leftCanvas);

  //bottom
  const bottomCanvas = document.createElement("canvas");
  bottomCanvas.height = fontSize;
  bottomCanvas.width = canvas.width;
  bottomCanvas.className = "bottom-legend";
  bottomCanvas.style.bottom = -CELL_SIZE;

  const bctx = bottomCanvas.getContext("2d");
  lbtx.font = fontSize + "sans-serif";

  x = 0;
  [...Array(bottomMax).keys()].forEach((val) => {
    bctx.fillText(val, x * CELL_SIZE, 10);
    x++;
  });

  document.querySelector(htmlParentClass).appendChild(bottomCanvas);
};

const drawPieLegend = (canvas, data, htmlParentClass) => {
  const pieLabelCanvas = document.createElement("canvas");
  pieLabelCanvas.className = "pie-labels-canvas";
  pieLabelCanvas.height = canvas.height;
  pieLabelCanvas.width = canvas.width;
  const pieLabelCtx = pieLabelCanvas.getContext("2d");

  const center = { x: canvas.width / 2, y: canvas.height / 2 };
  pieLabelCtx.fillStyle = "black";
  pieLabelCtx.translate(center.x, center.y);

  const recalculatedData = recalcPieData(data);
  const x = center.x / 2;
  const y = center.y / 20;

  let startAngle = -START_ANGLE - SIZE;
  pieLabelCtx.rotate(degreesToRadians(startAngle));

  recalculatedData.forEach((el) => {
    pieLabelCtx.fillText(el[0], x, y);
    pieLabelCtx.rotate(degreesToRadians(-el[1]));
  });

  document.querySelector(htmlParentClass).appendChild(pieLabelCanvas);
};
