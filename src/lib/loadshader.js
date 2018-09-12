function createContext(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width || 400;
    canvas.height = height || 400;
    document.body.appendChild(canvas);
    createHtmlText(canvas)
    return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
}

function createShader(gl, code, type) {
    var gl_type = (typeof type === 'string') ? (type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER) : (type || gl.VERTEX_SHADER);
    var shader = gl.createShader(gl_type);
    // Load the shader source
    gl.shaderSource(shader, code);
    // Compile the shader
    gl.compileShader(shader);
    // Check the compile status
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      // Something went wrong during compilation; get the error
      var lastError = gl.getShaderInfoLog(shader);
      console.error('compile error: ' + shader + ': ' + lastError);
      gl.deleteShader(shader);
      return null;
    }
    return shader;
}
  /**
   * creates a program by the given vertex and fragment shader
   * @param gl GL context
   * @param vertex vertex shader or code
   * @param fragment fragment shader or code
   * @returns {WebGLProgram}
   */
  function createProgram(gl, vertex, fragment) {
    var program = gl.createProgram();
    gl.attachShader(program, typeof vertex === 'string' ? createShader(gl, vertex, gl.VERTEX_SHADER) : vertex);
    gl.attachShader(program, typeof fragment === 'string' ? createShader(gl, fragment, gl.FRAGMENT_SHADER) : fragment);
    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      // something went wrong with the link
      var lastError = gl.getProgramInfoLog(program);
      console.error('Error in program linking:' + lastError);
      gl.deleteProgram(program);
      return null;
    }
    return program;
}