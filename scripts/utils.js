
// webgl

define(function(){
  
  function createShader(gl, str, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw gl.getShaderInfoLog(shader);
    }
    
    return shader;
  };

  function createProgram(gl, vstr, fstr) {
    var program = gl.createProgram();
    var vshader = createShader(gl, vstr, gl.VERTEX_SHADER);
    var fshader = createShader(gl, fstr, gl.FRAGMENT_SHADER);
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(gl, program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(program);
    }
    
    return program;
  };
  
  function linkProgram(gl, program) {
    var vshader = createShader(gl, program.vshaderSource, gl.VERTEX_SHADER);
    var fshader = createShader(gl, program.fshaderSource, gl.FRAGMENT_SHADER);
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(program);
    }
  }
  
  function loadFile(file, callback, noCache, isJson) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 1) {
        if (isJson) {
          request.overrideMimeType('application/json');
        }
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
      url += '?dt=' + (new Date()).getTime();
    }
    request.open('GET', url, true);
  }
  
  function loadProgram(gl, vs, fs, callback) {
    
    var program = gl.createProgram();
    
    function vshaderLoaded(str) {
      program.vshaderSource = str;
      if (program.fshaderSource) {
        linkProgram(gl, program);
        callback(program);
      }
    }
    
    function fshaderLoaded(str) {
      program.fshaderSource = str;
      if (program.vshaderSource) {
        linkProgram(gl, program);
        callback(program);
      }
    }
    
    loadFile(vs, vshaderLoaded, true);
    loadFile(fs, fshaderLoaded, true);
    return program;
  }
  
  var lastTime = 0;
  
  function requestAnimationFrame(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime, lastTime))
    var id = setTimeout(
      function() {
        callback(currTime + timeToCall);
      },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  }
  
  function cancelAnimationFrame(id) {
    clearTimeout(id);
  }
  
  return {
    createShader : createShader,
    createProgram : createProgram,
    //screenQuad,screenQuad,
    linkProgram : linkProgram,
    loadFile : loadFile,
    loadProgram : loadProgram,
    requestAnimationFrame : requestAnimationFrame,
    cancelAnimationFrame : cancelAnimationFrame
  };
  
})
