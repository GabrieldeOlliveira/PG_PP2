/* Autor: Julia Mattias
*  RA:    759513
*/

/* Cria o Buffer principal do Octaedro */
function createBuffer(data) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buffer;
}

/* Cria os shader */
function createShader(source, type) {
  var shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var errorMessage = gl.getShaderInfoLog(shader);
    console.error(errorMessage);
    return null;
  }
  return shader;
}

/* Faz a ligação dos shaders no programa */
function createShaderProgram(vertexShaderSource, fragmentShaderSource) {
  var vertexShader = createShader(vertexShaderSource, gl.VERTEX_SHADER);
  var fragmentShader = createShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Shaders failed to link");
  }
  return shaderProgram;
}

// vertices for the octahedron
var octaedroVertice = [
  /* posicao*/ 0.0,
  1.0,
  0.0,
  /* cor */ 0,
  1,
  0, // 1
  /* posicao*/ 1.0,
  0.0,
  0.0,
  /* cor */ 0,
  0,
  1, // 0
  /* posicao*/ 0.0,
  0.0,
  -1.0,
  /* cor */ 0,
  1,
  1, // 5
  /* posicao*/ -1.0,
  0.0,
  0.0,
  /* cor */ 1,
  1,
  0, // 3
  /* posicao*/ 0.0,
  0.0,
  1.0,
  /* cor */ 1,
  0,
  0, // 2
  /* posicao*/ 1.0,
  0.0,
  0.0,
  /* cor */ 0,
  0,
  1, // 0
  /* posicao*/ 0.0,
  -1.0,
  0.0,
  /* cor */ 1,
  0,
  1, // 4
  /* posicao*/ 1.0,
  0.0,
  0.0,
  /* cor */ 0,
  0,
  1, // 0
  /* posicao*/ 0.0,
  0.0,
  -1.0,
  /* cor */ 0,
  1,
  1, // 5
  /* posicao*/ -1.0,
  0.0,
  0.0,
  /* cor */ 1,
  1,
  0, // 3
  /* posicao*/ 0.0,
  0.0,
  1.0,
  /* cor */ 1,
  0,
  0, // 2
  /* posicao*/ 1.0,
  0.0,
  0.0,
  /* cor */ 0,
  0,
  1, // 0


  /* posicao*/ 1.0,
  0.0,
  0.0,
  /* cor */ 0,
  0,
  1,
  /* posicao*/ 0.0,
  1.0,
  0.0,
  /* cor */ 0,
  1,
  0,
  /* posicao*/ 0.0,
  0.0,
  1.0,
  /* cor */ 1,
  0,
  0,
  /* posicao*/ -1.0,
  0.0,
  0.0,
  /* cor */ 1,
  1,
  0,
  /* posicao*/ 0.0,
  -1.0,
  0.0,
  /* cor */ 1,
  0,
  1,
  /* posicao*/ 0.0,
  0.0,
  -1.0,
  /* cor */ 0,
  1,
  1,
];

// Shader source code
var octVertexShaderSource =
  "\
  uniform mat4 Affine;                                      \
                                                            \
  attribute vec3 iPosition;                                 \
  attribute vec3 iColor;                                    \
                                                            \
  varying vec3 oColor;                                      \
                                                            \
  void main(void) {                                         \
      gl_Position = Affine * vec4(iPosition, 1);            \
      oColor = iColor;                                      \
  }                                                         \
  ";

var octFragmentShaderSource =
  "\
  precision mediump float;            \
                                      \
  varying vec3 oColor;                \
                                      \
  void main(void) {                   \
      gl_FragColor = vec4(oColor, 1); \
  }                                   \
  ";

/* Monta o Canvas */
var theCanvas = document.getElementById("the-canvas");

theCanvas.width = 400;
theCanvas.height = 400;
var gl = theCanvas.getContext("experimental-webgl");

/* Matriz identidade */
var aff = mat4.create();
mat4.identity(aff);

/* cria o buffer do Octaedro */
var octVertexBuffer = createBuffer(octaedroVertice);

var shaderProgram = createShaderProgram(
  octVertexShaderSource,
  octFragmentShaderSource
);
var affIndex = gl.getUniformLocation(shaderProgram, "Affine");
var positionIndex = gl.getAttribLocation(shaderProgram, "iPosition");
var colorIndex = gl.getAttribLocation(shaderProgram, "iColor");
var angle = (performance.now() / 1000 / 6) * 2* Math.PI;

function render() {
  // Precisa ser chamado periodicamente
  requestAnimationFrame(render);
  /* Rotaciona em todos os eixos */
  mat4.rotate(aff, aff, angle, [1.0, 1.0, 1.0]); 

  
  gl.viewport(0, 0, theCanvas.width, theCanvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  /* Liga o programa */
  gl.useProgram(shaderProgram);

  // Atualiza a projeção e a perspectiva da camera
  gl.uniformMatrix4fv(affIndex, false, aff);

  gl.bindBuffer(gl.ARRAY_BUFFER, octVertexBuffer);
  gl.enableVertexAttribArray(positionIndex);
  gl.vertexAttribPointer(positionIndex, 3, gl.FLOAT, false, 24, 0);

  gl.enableVertexAttribArray(colorIndex);
  gl.vertexAttribPointer(colorIndex, 3, gl.FLOAT, false, 24, 12);

  // Monta o Octaedro
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
  gl.drawArrays(gl.TRIANGLE_FAN, 6, 6);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(positionIndex);
  gl.disableVertexAttribArray(colorIndex);
}

// Renderização
render();
