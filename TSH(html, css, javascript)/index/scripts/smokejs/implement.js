var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

var party = smokemachine(ctx, [255, 255, 255]);
party.start(); // start animating
party.setPreDrawCallback(function(dt){
    party.addSmoke(0, innerHeight, .2);
    party.addSmoke(innerWidth, innerHeight, .2);
    canvas.width = innerWidth;
    canvas.height = innerHeight;
})

// party.addsmoke(innerWidth/2, innerHeight, 100)
// onclick=e => {
// 	console.log(e)
// 	party.step()
// }

onmousemove = function (e) {
    var x = e.clientX;
    var y = e.clientY;
    var n = .4;
    var t = Math.floor(Math.random() * 200) + 3800;
    party.addsmoke(x, y, n, t);
}