
window.onerror = function(msg, url, lineno) {
  alert(url + '{' + lineno + '}:' + msg);
};

function createShader(str, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, str);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }
  
  
  return shader;
};

function createProgram(vstr, fstr) {
  var program = gl.createProgram();
  var vshader = createShader(vstr, gl.VERTEX_SHADER);
  var fshader = createShader(fstr, gl.FRAGMENT_SHADER);
  gl.attachShader(program, vshader);
  gl.attachShader(program, fshader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }
  
  return program;
};

function screenQuad() {
  var vertexPosBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
  var vertices = [-1, -1, 1, -1, -1, 1, 1, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  vertexPosBuffer.itemSize = 2;
  vertexPosBuffer.numItems = 4;
  
  /*
    2    3
     ____
    |\   |
    | \  |
    |  \ |
    |___\|
    0    1
  */
  
  return vertexPosBuffer;
};

function linkProgram(program) {
  var vshader = createShader(program.vshaderSource, gl.VERTEX_SHADER);
  var fshader = createShader(program.fshaderSource, gl.FRAGMENT_SHADER);
  gl.attachShader(program, vshader);
  gl.attachShader(program, fshader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }
}

function loadFile(file, callback, noCache) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 1) {
      request.send();
    } else if (request.readyState == 4) {
      if (request.status == 200) {
        callback(request.responseText);
      } else if (request.status == 404) {
        throw 'File "' + file + '" does not exist.';
      } else {
        throw 'XHR error ' + request.status + '.';
      }
    }
  };
  var url = file;
  if (noCache) {
    url += '?' + (new Date()).getTime();
  }
  request.open('GET', url, true);
}

function loadProgram(vs, fs, callback) {
  var program = gl.createProgram();
  function vshaderLoaded(str) {
    program.vshaderSource = str;
    if (program.fshaderSource) {
      linkProgram(program);
      callback(program);
    }
  }
  function fshaderLoaded(str) {
    program.fshaderSource = str;
    if (program.vshaderSource) {
      linkProgram(program);
      callback(program);
    }
  }
  loadFile(vs, vshaderLoaded, true);
  loadFile(fs, fshaderLoaded, true);
}
