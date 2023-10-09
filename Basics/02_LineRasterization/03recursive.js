//Fill Frame Buffer pixel by pixel
function setPixel(x,y){
    var canvas = document.getElementById('webgl-canvas');
    var ctx = canvas.getContext("2d");

    ctx.fillRect(x,y,1,1);
}

//Rasterization: Find the pixels
function drawLine(x0,y0,x1,y1){
    var xm = (x0 + x1)/2;
    var ym = (y0 + y1)/2;

    setPixel(xm, ym);

    if (x1-x0 > 1 || y1-y0 >1){
        drawLine(x0,y0,xm,ym);
        drawLine(xm,ym,y1,y1);
    }
}

drawLine(50,50,200,200);