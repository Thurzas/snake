
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

function Coord(X, Y) {
  this.x = Math.floor(X);
  this.y = Math.floor(Y);
};

function Perlin(size){
  var res = new Array(size);
  for(var i=0;i<size;i++)
  {
    res.push(noise(0,size));
  }
  return res;
}