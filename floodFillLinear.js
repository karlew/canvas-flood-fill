/**
 * @param canvas
 * @param x
 * @param y
 * @param fillColor
 *            要填充的颜色，为一个共4个元素的整型数组，即[r,g,b,a]，例如[255,255,255,255]
 * @param tolerance
 *            容忍度
 */
function floodFillLinear(canvas, x, y, fillColor, tolerance) {
	/**
	 * 相关数据准备
	 */
	var width = canvas.width;
	var height = canvas.height;
	var context = canvas.getContext("2d");
	var pixelData = context.getImageData(0, 0, canvas.width, canvas.height);
	var pixelsChecked = new Array(width * height);
	var startIdx = (width * y + x) * 4;
	var startColor = [ pixelData.data[startIdx], pixelData.data[startIdx + 1],
			pixelData.data[startIdx + 2], pixelData.data[startIdx + 3] ];
	if (startColor[0] == 0 && startColor[1] == 0 && startColor[2] == 0
			&& startColor[3] == 255) {
		return;
	}
	var ranges = new Queue();

	/**
	 * 算法执行
	 */
	LinearFill(x, y);

	var range;

	while (!ranges.empty()) {
		range = ranges.dequeue();

		var downPxIdx = (width * (range.Y + 1)) + range.startX;
		var upPxIdx = (width * (range.Y - 1)) + range.startX;
		var upY = range.Y - 1;
		var downY = range.Y + 1;

		for (var i = range.startX; i <= range.endX; i++) {
			if (range.Y > 0 && (!pixelsChecked[upPxIdx]) && CheckPixel(upPxIdx)) {
				LinearFill(i, upY);
			}

			if (range.Y < (height - 1) && (!pixelsChecked[downPxIdx])
					&& CheckPixel(downPxIdx)) {
				LinearFill(i, downY);
			}

			downPxIdx++;
			upPxIdx++;
		}
	}

	/**
	 * 将结果进行渲染
	 */
	context.putImageData(pixelData, 0, 0, 0, 0, width, height);

	function LinearFill(x, y) {
		var lFillLoc = x;
		var pxIdx = width * y + x;

		while (true) {
			SetPixel(pxIdx, fillColor);
			pixelsChecked[pxIdx] = true;
			lFillLoc--;
			pxIdx--;
			if (lFillLoc < 0 || (pixelsChecked[pxIdx]) || !CheckPixel(pxIdx)) {
				break;
			}
		}

		lFillLoc++;

		rFillLoc = x;
		pxIdx = (width * y) + x;
		while (true) {
			SetPixel(pxIdx, fillColor);
			pixelsChecked[pxIdx] = true;
			rFillLoc++;
			pxIdx++;
			if (rFillLoc >= width || pixelsChecked[pxIdx] || !CheckPixel(pxIdx)) {
				break;
			}
		}

		rFillLoc--;

		var r = new FloodFillRange(lFillLoc, rFillLoc, y);
		ranges.enqueue(r);
	}

	function SetPixel(pxIdx, color) {
		pixelData.data[pxIdx * 4] = color[0];
		pixelData.data[pxIdx * 4 + 1] = color[1];
		pixelData.data[pxIdx * 4 + 2] = color[2];
		pixelData.data[pxIdx * 4 + 3] = color[3];
	}

	function FloodFillRange(startX, endX, Y) {
		this.startX = startX;
		this.endX = endX;
		this.Y = Y;
	}

	function CheckPixel(px) {
		var red = pixelData.data[px * 4];
		var green = pixelData.data[px * 4 + 1];
		var blue = pixelData.data[px * 4 + 2];
		var alpha = pixelData.data[px * 4 + 3];

		return (red >= (startColor[0] - tolerance)
				&& red <= (startColor[0] + tolerance)
				&& green >= (startColor[1] - tolerance)
				&& green <= (startColor[1] + tolerance)
				&& blue >= (startColor[2] - tolerance)
				&& blue <= (startColor[2] + tolerance)
				&& alpha >= (startColor[3] - tolerance) && alpha <= (startColor[3] + tolerance));
	}
}
