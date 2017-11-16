$(function() {
	var chooseColor, 
	myCanvas = document.getElementById("canvas"), 
	ctx = myCanvas.getContext("2d"), 
	image = new Image();
	image.onload = function() {
		ctx.drawImage(image, 0, 0)
	};
	image.src = "img/img_canvas.png";
	$("#wire").on("click", function(e) {
		if (!chooseColor) {
			alert("请选择要填充的颜色");
			return false
		}
		e = e.originalEvent || e;
		var wireOffset = $(this).offset();
		var left = Math.floor(e.pageX - wireOffset.left);
		var top = Math.floor(e.pageY - wireOffset.top);
		var imgData = ctx.getImageData(left, top, 1, 1);
		var colorArr = imgData.data;
		if (colorArr[0] === 0 && colorArr[1] === 0 && colorArr[2] === 0 && colorArr[3] === 0) {
			alert("此处不能上色");
			return false
		}
		//判断是否点在线条上
		if(colorArr[0] < 50 && colorArr[1] < 50 && colorArr[2] < 50 && colorArr[3] === 255){
			alert("线条处不能上色");
			return false
		}
		var fillColor = hexToRgb(chooseColor).split(",");
		fillColor.push(255);
		floodFillLinear(myCanvas, left, top, fillColor, 80);
	});
	$("#colors").on("click", "li:not(.checked)", function() {
		$(this).addClass("checked").siblings(".checked").removeClass("checked");
		chooseColor = $(this).html()
	});
});