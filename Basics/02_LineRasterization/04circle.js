const canvas = document.getElementById('webgl-canvas');
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const cenetrY = canvas.height /2;
const radius = 50;

ctx.strokeStyle = 'black';
ctx.lineWidth = 2;

ctx.beginPath();
for(let angle = 0; angle <2*Math.PI; angle+=0.01){
    const x = centerX + radius*Math.cos(angle);
    const y = cenetrY + radius*Math.sin(angle);
    ctx.lineTo(x,y);
}
ctx.closePath();
ctx.stroke();