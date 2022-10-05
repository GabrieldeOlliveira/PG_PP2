/* Autor: Gabriel Givigi de Oliveira
*  RA:    760924
*/

/**
 * Shader de Vertex
 * Input: posicaoVertex
 * Input: corVertex
 * Output: corFragment
 */
 var vertexShaderText = [
  "precision mediump float;",
  "",
  "attribute vec3 vertPosition;",
  "attribute vec3 vertColor;",
  "varying vec3 fragColor;",
  "uniform mat4 mWorld;",
  "uniform mat4 mView;",
  "uniform mat4 mProj;",
  "",
  "void main()",
  "{",
  "  fragColor = vertColor;",
  "  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);",
  "}",
].join("\n");

/**
 * Shader de Fragment
 * Output: corFragment
 */

var fragmentShaderText = [
  "precision mediump float;",
  "",
  "varying vec3 fragColor;",
  "void main()",
  "{",
  "  gl_FragColor = vec4(fragColor, 1.0);",
  "}",
].join("\n");

/* Variáveis Globais */
var distancia = -8.0;
var angleY = 2.0;
var angleX = 2.0;

var xRotationMatrix = new Float32Array(16);
var yRotationMatrix = new Float32Array(16);
var worldMatrix = new Float32Array(16);
var viewMatrix = new Float32Array(16);
var projMatrix = new Float32Array(16);

/*FUNÇÃO PRINCIPAL*/
var InitDemo = function () {
  /**
   * Capta o valor do HTML e carrega o WebGL
   */
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl2");

  /**
   * Tratativas de erro.
   */

  if (!gl) {
    alert("Seu navegador não suporta o WebGL 2.0");
  }

  /**
   * Seta as cores que serão chamadas na função clear.
   */

  // RED, GREEN, BLUE, ALPHA
  gl.clearColor(0.75, 0.85, 0.8, 1.0);

  // Limpa o buffer para as cores adicionadas acima
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Ativa a comparação de profundidade para atualizar o buffer de profundidade
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  // Permite rodar no sentido horário
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  /**
   * Cria os Shaders
   */
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  /**
   * Liga os Shaders ás funções
   */
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  /**
   * Verifica se não houve problemas no vertexShader
   */
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "Erro ao compilar o vertex shader!",
      gl.getShaderInfoLog(vertexShader)
    );
    return;
  }

  /**
   * Verifica se não houve problemas no fragmentShader
   */
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      "Erro ao compilar o fragment shader!",
      gl.getShaderInfoLog(fragmentShader)
    );
    return;
  }

  var cuboPrograma = gl.createProgram();

  /**
   * Liga os shaders declarados acima ao programa do Cubo
   */
  gl.attachShader(cuboPrograma, vertexShader);
  gl.attachShader(cuboPrograma, fragmentShader);

  /**
   * Verifica se houve problemas ao linkar ao programa do Cubo
   */
  gl.linkProgram(cuboPrograma);
  if (!gl.getProgramParameter(cuboPrograma, gl.LINK_STATUS)) {
    console.error(
      "Erro ao linkar o programa Cubo!",
      gl.getProgramInfoLog(cuboPrograma)
    );
    return;
  }

  /**
   * Verifica se houveram outros problemas genéricos com o programa do Cubo
   */
  gl.validateProgram(cuboPrograma);
  if (!gl.getProgramParameter(cuboPrograma, gl.VALIDATE_STATUS)) {
    console.error(
      "ERROR validating cuboPrograma!",
      gl.getProgramInfoLog(cuboPrograma)
    );
    return;
  }

  /**
   * Cria o buffer do cubo
   * -> O cubo é formado por dois triângulos, então cada face vai compartilhar de dois vértices
   */
  var cuboVertices = [
    // X, Y, Z           R, G, B
    // Cima
    -1.0, 1.0, -1.0, 0.5, 0.5, 0.5, -1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0,
    1.0, 0.5, 0.5, 0.5, 1.0, 1.0, -1.0, 0.5, 0.5, 0.5,

    // Esquerda
    -1.0, 1.0, 1.0, 0.75, 0.25, 0.5, -1.0, -1.0, 1.0, 0.75, 0.25, 0.5, -1.0,
    -1.0, -1.0, 0.75, 0.25, 0.5, -1.0, 1.0, -1.0, 0.75, 0.25, 0.5,

    // Direita
    1.0, 1.0, 1.0, 0.25, 0.25, 0.75, 1.0, -1.0, 1.0, 0.25, 0.25, 0.75, 1.0,
    -1.0, -1.0, 0.25, 0.25, 0.75, 1.0, 1.0, -1.0, 0.25, 0.25, 0.75,

    // Frente
    1.0, 1.0, 1.0, 1.0, 0.0, 0.15, 1.0, -1.0, 1.0, 1.0, 0.0, 0.15, -1.0, -1.0,
    1.0, 1.0, 0.0, 0.15, -1.0, 1.0, 1.0, 1.0, 0.0, 0.15,

    // Trás
    1.0, 1.0, -1.0, 0.0, 1.0, 0.15, 1.0, -1.0, -1.0, 0.0, 1.0, 0.15, -1.0, -1.0,
    -1.0, 0.0, 1.0, 0.15, -1.0, 1.0, -1.0, 0.0, 1.0, 0.15,

    // Baixo
    -1.0, -1.0, -1.0, 0.5, 0.5, 1.0, -1.0, -1.0, 1.0, 0.5, 0.5, 1.0, 1.0, -1.0,
    1.0, 0.5, 0.5, 1.0, 1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
  ];

  var cuboIndices = [
    // Cima
    0, 1, 2, 0, 2, 3,

    // Esquerda
    5, 4, 6, 6, 4, 7,

    // Direita
    8, 9, 10, 8, 10, 11,

    // Frente
    13, 12, 14, 15, 14, 12,

    // Trás
    16, 17, 18, 16, 18, 19,

    // Baixo
    21, 20, 22, 22, 20, 23,
  ];

  /**
   * Cria o buffer responsável pelas vértices do objeto
   */
  var cuboVertexBuffer = gl.createBuffer();

  /**
   * Se utiliza o ARRAY_BUFFER quando é vértice
   */
  gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(cuboVertices),
    gl.STATIC_DRAW
  );

  /**
   * Cria o buffer responsável pelo index do objeto
   */
  var cuboIndexBuffer = gl.createBuffer();

  /**
   * Se utiliza ELEMENT_ARRAY_BUFFER quando é index
   */
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cuboIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(cuboIndices),
    gl.STATIC_DRAW
  );

  /**
   * Retorna a localização de uma variável de atributo
   */
  var locAtributoPosicao = gl.getAttribLocation(cuboPrograma, "vertPosition");

  /**
   * Retorna a localização de uma variável de atributo
   */
  var locAtributoCor = gl.getAttribLocation(cuboPrograma, "vertColor");

  /**
   * Responsável por dizer ao WebGL como interpretar os dados
   */
  gl.vertexAttribPointer(
    locAtributoPosicao, // Atributo de localização
    3, // Número de elementos por atributo
    gl.FLOAT, // Tipo de atributo
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // Tamanho de um vértice
    0 // Offset em relação a posição inicial
  );
  gl.vertexAttribPointer(
    locAtributoCor, // Atributo de localização
    3, // Número de elementos por atributo
    gl.FLOAT, // Type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // Tamanho de um vértice
    3 * Float32Array.BYTES_PER_ELEMENT // Offset em relação a posição inicial
  );

  /**
   * Habilita o atributo do vertex
   */
  gl.enableVertexAttribArray(locAtributoPosicao);
  gl.enableVertexAttribArray(locAtributoCor);

  /**
   * Diz para o WebGL que irá utilizar determinado programa
   */
  gl.useProgram(cuboPrograma);

  /**
   * Retorna a localização das variáveis uniformes para o programa
   */
  var matWorldUniformLocation = gl.getUniformLocation(cuboPrograma, "mWorld");
  var matViewUniformLocation = gl.getUniformLocation(cuboPrograma, "mView");
  var matProjUniformLocation = gl.getUniformLocation(cuboPrograma, "mProj");

  /**
   * Funções responsáveis pela movimentação do objeto
   */
  document.getElementById("Aproxima").onclick = function () {
    distancia *= 1.1;
  };

  document.getElementById("Afasta").onclick = function () {
    distancia *= 0.9;
  };

  document.getElementById("Esquerda").onclick = function () {
    angleY = (performance.now() / 1000 / 6) * 2 * Math.PI;
  };

  document.getElementById("Direita").onclick = function () {
    angleY = -(performance.now() / 1000 / 6) * 2 * Math.PI;
  };

  document.getElementById("Cima").onclick = function () {
    angleX = (performance.now() / 1000 / 6) * 2 * Math.PI;
  };

  document.getElementById("Baixo").onclick = function () {
    angleX = -(performance.now() / 1000 / 6) * 2 * Math.PI;
  };

  /**
   * Cria uma matriz identidade
   */
  mat4.identity(worldMatrix);

  mat4.perspective(
    projMatrix,
    glMatrix.toRadian(45), // Ângulo da visão vertical
    canvas.clientWidth / canvas.clientHeight, // Proporção
    0.1,
    1000.0
  );

  /**
   * Especifica os valores das matrizes para variáveis uniforme
   */
  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  var identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);

  var render = function () {
    mat4.rotate(yRotationMatrix, identityMatrix, angleY, [0, 1, 0]);
    mat4.rotate(xRotationMatrix, identityMatrix, angleX, [1, 0, 0]);
    mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);

    mat4.lookAt(
      viewMatrix,
      [0, 0, distancia], //Posição do observador
      [0, 0, 0], // Posição para qual o observador está olhando (centro)
      [0, 1, 0] // Verifica qual ângulo olhar
    );

    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, cuboIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render); // Atualiza a renderização
  };
  requestAnimationFrame(render);
};
