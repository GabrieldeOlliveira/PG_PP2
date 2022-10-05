/* Autor: Alessandra Leria
*  RA:    760884
*/
"use strict";

var canvas;
var gl;

var numPositions = 12;

var positions = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];
var puloEixo = 8.0;

var thetaLoc;

/* Função principal */
window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = canvas.getContext("webgl2");
  if (!gl) alert("WebGL 2.0 isn't available");

  colorPyramid();

  console.log("COLORS:", colors);
  console.log("POSITIONS:", positions);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  //
  //  Carrega os shadders e buffers
  //
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  console.log("flatten: ", flatten(colors));
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var colorLoc = gl.getAttribLocation(program, "aColor");
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLoc);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

  var positionLoc = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  thetaLoc = gl.getUniformLocation(program, "uTheta");

  // Listener dos botões do HTML

  document.getElementById("xButton").onclick = function () {
    axis = xAxis;
    theta[axis] += puloEixo;
  };
  document.getElementById("yButton").onclick = function () {
    axis = yAxis;
    theta[axis] += puloEixo;
  };
  document.getElementById("zButton").onclick = function () {
    axis = zAxis;
    theta[axis] += puloEixo;
  };

  render();
};

/* Monta a imagem da Piramide */
function colorPyramid() {
  triple(0, 3, 2); //base
  triple(2, 0, 1);
  triple(3, 1, 2);
  triple(0, 1, 3);
}

function triple(a, b, c) {
  /* Monta o conjunto de variaveis para o vertice */
  var vertices = [
    vec3(0.5, -0.2722, 0.2886),
    vec3(0.0, -0.2772, -0.5773),
    vec3(-0.5, -0.2722, 0.2886),
    vec3(0.0, 0.5443, 0.0),
  ];

  /* Monta os vertices de cores  */
  var vertexColors = [
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 0.0, 0.0, 1.0),
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0),
  ];

  var indices = [a, b, c];

  /* Monta as posições e cores */
  for (var i = 0; i < indices.length; ++i) {
    positions.push(vertices[indices[i]]);
    colors.push(vertexColors[i]);
  }
}

/* Função principal que renderiza */
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform3fv(thetaLoc, theta);

  gl.drawArrays(gl.TRIANGLES, 0, numPositions);
  requestAnimationFrame(render);
}
