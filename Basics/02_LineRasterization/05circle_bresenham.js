const canvas = document.getElementById('webgl-canvas');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const cenetrY = canvas.height /2;
const radius = 50;

ctx.strokeStyle = 'black';
ctx.lineWidth = 2;

//Rasterization: Find the pixels
//Bresenham Circle method 1
function drawBresenhamCircle1(xc,yc,r){
    let x = 0;
    let y = r;
    let d = 3- 2*r; // Initial decision parameter

    while(x<=y){

        draw8pixel(xc,yc,x,y);
        x++;

        if (d>0){
            y--;
            d = d+ 4*(x-y) + 10; // decision parameter for diagonal step
        }else{
            d = d+ 4*x + 6; // decision parameter for Horizontal step
        }


    }
}

// Method 2
function drawBresenhamCircle2(xc,yc,r){
    x=0;
    y=r;
    d = 1-r;
    e=3;
    se=5 - 2*r;

    do{
        draw8pixel(xc,yc,x,y);
        x++;
        if(d<0){//Inside the circle
            d = d + e;
            e = e + 2;
            se = se + 2;
        }else{//Outside the circle
            d = d + se;
            e = e + 2;
            se = se + 4;
            y--;
        }
    }while(x <= y)
}

//Fill Frame Buffer pixel by pixel
function draw8pixel(xc, yc, x, y){
    // Draw points in all octants
    ctx.fillRect(xc + x, yc + y, 1, 1);
    ctx.fillRect(xc - x, yc + y, 1, 1);
    ctx.fillRect(xc + x, yc - y, 1, 1);
    ctx.fillRect(xc - x, yc - y, 1, 1);
    ctx.fillRect(xc + y, yc + x, 1, 1);
    ctx.fillRect(xc - y, yc + x, 1, 1);
    ctx.fillRect(xc + y, yc - x, 1, 1);
    ctx.fillRect(xc - y, yc - x, 1, 1);

}

drawBresenhamCircle1(centerX, cenetrY, radius);