// services/simpleChart.js

function createSimpleChart(data, querySelector, options = {}) {
  const canvas = document.querySelector(querySelector);
  const ctx = canvas.getContext("2d");

  // Get container dimensions
  const container = canvas.parentElement;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // Default options - now based on container size
  const config = {
    width: options.width || containerWidth,
    height: options.height || containerHeight,
    padding:
      options.padding || Math.min(containerWidth, containerHeight) * 0.05, // 5% of smaller dimension
    gridStep: options.gridStep || 10,
    lineColor: options.lineColor || "#3b82f6",
    gridColor: options.gridColor || "#374151",
    textColor: options.textColor || "#9ca3af",
    backgroundColor: options.backgroundColor || "transparent",
    showLabels: options.showLabels || false,
    labelOffset: options.labelOffset || 15,
    fillColor: options.fillColor || "rgba(59, 130, 246, 0.2)",
    smoothing: options.smoothing || 0.2, // New option for curve smoothing
    targetDataPoint: options.targetDataPoint,
  };

  if (!config.targetDataPoint) {
    console.log("No target data point provided");
    return;
  }

  // Fix for high-DPI displays and ensure proper sizing
  const dpr = window.devicePixelRatio || 1;

  // Set actual canvas size in memory (scaled for DPI)
  canvas.width = config.width * dpr;
  canvas.height = config.height * dpr;

  // Set display size (CSS pixels) and prevent stretching
  canvas.style.width = config.width + "px";
  canvas.style.height = config.height + "px";
  canvas.style.display = "block";
  canvas.style.imageRendering = "crisp-edges";

  // Scale the canvas back down using CSS transforms
  ctx.scale(dpr, dpr);

  // Enable text anti-aliasing for crisp text
  ctx.textRenderingOptimization = "optimizeQuality";
  ctx.imageSmoothingEnabled = true;

  // Extract every 3rd hour temperature (8 points total)
  const hours = [];
  const selectedDataPoints = [];

  // Take every 3rd data point starting from index 0
  for (let i = 0; i < data.hours.length && hours.length < 8; i += 3) {
    hours.push(data.hours[i].datetime.substring(0, 5));
    selectedDataPoints.push(data.hours[i][config.targetDataPoint]);
  }

  // Calculate bounds
  let minTemp =
    Math.floor(Math.min(...selectedDataPoints) / config.gridStep) *
    config.gridStep;
  let maxTemp =
    Math.ceil(Math.max(...selectedDataPoints) / config.gridStep) *
    config.gridStep;

  if (minTemp === 0 && maxTemp === 0) {
    minTemp = minTemp - config.gridStep;
    maxTemp = maxTemp + config.gridStep;
  }

  // Drawing area bounds
  const drawWidth = config.width - config.padding * 2;
  const drawHeight = config.height - config.padding * 2;

  // Clear canvas
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, config.width, config.height);

  // Helper functions
  function getX(index) {
    return (
      config.padding + (index / (selectedDataPoints.length - 1)) * drawWidth
    );
  }

  function getY(temp) {
    const ratio = (temp - minTemp) / (maxTemp - minTemp);
    return config.height - config.padding - ratio * drawHeight;
  }

  // Calculate control points for smooth curves
  function getControlPoints(points) {
    const controlPoints = [];

    for (let i = 0; i < points.length; i++) {
      const curr = points[i];

      if (i === 0) {
        // First point: use direction to next point
        const next = points[i + 1];
        const dx = next.x - curr.x;
        const dy = next.y - curr.y;
        const distance = Math.sqrt(dx * dx + dy * dy) * config.smoothing;

        controlPoints.push({
          cp1x: curr.x,
          cp1y: curr.y,
          cp2x: curr.x + dx * config.smoothing,
          cp2y: curr.y + dy * config.smoothing,
        });
        continue;
      }

      if (i === points.length - 1) {
        // Last point: use direction from previous point
        const prev = points[i - 1];
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;

        controlPoints.push({
          cp1x: curr.x - dx * config.smoothing,
          cp1y: curr.y - dy * config.smoothing,
          cp2x: curr.x,
          cp2y: curr.y,
        });
        continue;
      }

      // Middle points: use slope through previous and next points
      const prev = points[i - 1];
      const next = points[i + 1];

      // Calculate the slope of the line through previous and next points
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;

      // Control point distance (adjust smoothing factor here)
      const distance = Math.sqrt(dx * dx + dy * dy) * config.smoothing;

      // Normalize the direction
      const length = Math.sqrt(dx * dx + dy * dy);
      const unitX = length > 0 ? dx / length : 0;
      const unitY = length > 0 ? dy / length : 0;

      // Calculate control points
      const cp1x = curr.x - unitX * distance;
      const cp1y = curr.y - unitY * distance;
      const cp2x = curr.x + unitX * distance;
      const cp2y = curr.y + unitY * distance;

      controlPoints.push({ cp1x, cp1y, cp2x, cp2y });
    }

    return controlPoints;
  }

  // Convert temperature data to points
  const points = selectedDataPoints.map((temp, index) => ({
    x: getX(index),
    y: getY(temp),
  }));

  const controlPoints = getControlPoints(points);

  // Draw filled area under the curve
  ctx.fillStyle = config.fillColor;
  ctx.beginPath();

  // Start from bottom left
  ctx.moveTo(points[0].x, getY(minTemp));
  ctx.lineTo(points[0].x, points[0].y);

  // Draw smooth curve through points
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const currPoint = points[i];
    const prevControl = controlPoints[i - 1];

    ctx.bezierCurveTo(
      prevControl.cp2x,
      prevControl.cp2y,
      controlPoints[i].cp1x,
      controlPoints[i].cp1y,
      currPoint.x,
      currPoint.y,
    );
  }

  // Close the path by going to bottom right and back to start
  ctx.lineTo(points[points.length - 1].x, getY(minTemp));
  ctx.closePath();
  ctx.fill();

  // Draw smooth temperature line on top
  ctx.strokeStyle = config.lineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const currPoint = points[i];
    const prevControl = controlPoints[i - 1];

    ctx.bezierCurveTo(
      prevControl.cp2x,
      prevControl.cp2y,
      controlPoints[i].cp1x,
      controlPoints[i].cp1y,
      currPoint.x,
      currPoint.y,
    );
  }

  ctx.stroke();

  let measureUnit = "";

  switch (config.targetDataPoint) {
    case "temp":
      measureUnit = "°";
      break;
    case "precipprob":
      measureUnit = "%";
      break;
    case "windspeed":
      measureUnit = "mph";
      break;
  }

  // Draw temperature labels on data points
  if (config.showLabels) {
    ctx.fillStyle = config.textColor;
    ctx.font = "10px Arial";
    ctx.textAlign = "center";

    selectedDataPoints.forEach((temp, index) => {
      const x = getX(index);
      const y = getY(temp) - config.labelOffset;
      ctx.fillText(Math.round(temp) + measureUnit, x, y);
    });
  }

  // Draw y-axis labels
  ctx.fillStyle = config.textColor;
  ctx.font = "12px Arial";
  ctx.textAlign = "right";

  for (let temp = minTemp; temp <= maxTemp; temp += config.gridStep) {
    const y = getY(temp);
    ctx.fillText(temp + "°", config.padding - 10, y + 4);
  }
}

export { createSimpleChart };
