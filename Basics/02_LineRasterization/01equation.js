//Rasterize line from (x0,y0) to (x1,y1)

//Fill Frame Buffer pixel by pixel
function setPixel(x,y){
    var canvas = document.getElementById('webgl-canvas');
    var ctx = canvas.getContext("2d");
    ctx.fillRect(x,y,1,1);
}

//Rasterization: Find the pixels (that cover the line.)
function drawLine(x0,y0,x1,y1){
    var m = (y1- y0) / (x1- x0);
    for (var x=x0; x<x1; x++){
        setPixel(x, y0 + m*(x-x0))
    }
}

drawLine(50,50,200,200);
