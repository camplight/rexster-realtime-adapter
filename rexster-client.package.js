(function(context){
  context.packageme = {
    modules: [],
    register: function(modulePath, moduleBuilder) {
      this.modules[modulePath] = moduleBuilder;
    },
    require: function(modulePath, startPoint) {
      if(!startPoint)
        startPoint = "/";
      
      // build full path to the required Module based on starterPoint
      if(modulePath.indexOf("./") == 0 || modulePath.indexOf("../") == 0)
        modulePath = startPoint+modulePath;
     
      // normalize full path
      modulePath = this.normalizePath(modulePath);
      
      // try getting module at given path
      var moduleBuilder = this.modules[modulePath] || 
                          this.modules[modulePath+"/index"] || 
                          this.modules[startPoint+"node_modules/"+modulePath] || 
                          this.modules[startPoint+"node_modules/"+modulePath+"/index"] || 
                          this.modules["/node_modules/"+modulePath];

      if(moduleBuilder)
        return moduleBuilder();
      else
        throw new Error("module at path '"+modulePath+"' was not found");
    },
    normalizePath: function(path) {
      var isAbsolute = path.charAt(0) === '/',
        trailingSlash = path.slice(-1) === '/';

      // Normalize the path
      path = this.normalizeArray(path.split('/').filter(function(p) {
        return !!p;
      }), !isAbsolute).join('/');

      if (!path && !isAbsolute) {
        path = '.';
      }
      if (path && trailingSlash) {
        path += '/';
      }

      return (isAbsolute ? '/' : '') + path;
    },
    normalizeArray: function(parts, allowAboveRoot) {
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last == '.') {
          parts.splice(i, 1);
        } else if (last === '..') {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }

      // if the path is allowed to go above the root, restore leading ..s
      if (allowAboveRoot) {
        for (; up--; up) {
          parts.unshift('..');
        }
      }

      return parts;
    }
  }
})(window);
(function(){
  var require = function(path){
    return packageme.require(path, require.path);
  };
  require.path = "rexster-client/";
  var exports = {};
  var module = {exports: exports};
  packageme.register("rexster-client/now", function(){
    /*! now.js build:0.8.0. Copyright(c) 2011 Flotype <team@flotype.com> MIT Licensed */
    (function(){var nowObjects={},noConflict=function(uri,options){uri=uri||"";if(nowObjects[uri])return nowObjects[uri];options=options||{};options.socketio=options.socketio||{};options.socketio.resource=options.socketio.resource||"socket.io";var socket,closures={},nowReady=!1,readied=0,lastTimeout,util,lib,isIE=function(){try{Object.defineProperty({},"",{});return!1}catch(err){return Object.prototype.__defineGetter__&&Object.prototype.__defineSetter__?!1:!0}}(),fqnMap={data:{},arrays:{},get:function(fqn){return fqnMap.data[fqn]},set:function(fqn,val){if(fqnMap.data[fqn]!==undefined)fqnMap.deleteChildren(fqn,val);else{var lastIndex=fqn.lastIndexOf("."),parent=fqn.substring(0,lastIndex);fqnMap.addParent(parent,fqn.substring(lastIndex+1))}return fqnMap.data[fqn]=val},addParent:function(parent,key){if(parent){util.isArray(fqnMap.data[parent])||fqnMap.set(parent,[]);fqnMap.data[parent].push(key)}},deleteChildren:function(fqn){var keys=this.data[fqn],children=[];if(util.isArray(this.data[fqn]))for(var i=0;keys.length;){var arr=this.deleteVar(fqn+"."+keys[i]);for(var j=0;j<arr.length;j++)children.push(arr[j])}return children},deleteVar:function(fqn){var lastIndex=fqn.lastIndexOf("."),parent=fqn.substring(0,lastIndex);if(util.hasProperty(this.data,parent)){var index=util.indexOf(this.data[parent],fqn.substring(lastIndex+1));index>-1&&this.data[parent].splice(index,1)}var children=this.deleteChildren(fqn);children.push(fqn);delete this.data[fqn];this.unflagAsArray(fqn);return children},flagAsArray:function(val){return this.arrays[val]=!0},unflagAsArray:function(val){delete this.arrays[val]}};util={_events:{},on:function(name,fn){util.hasProperty(util._events,name)||(util._events[name]=[]);util._events[name].push(fn);return util},indexOf:function(arr,val){for(var i=0,ii=arr.length;i<ii;i++)if(""+arr[i]===val)return i;return-1},emit:function(name,args){if(util.hasProperty(util._events,name)){var events=util._events[name].slice(0);for(var i=0,ii=events.length;i<ii;i++)events[i].apply(util,args===undefined?[]:args)}return util},removeEvent:function(name,fn){if(util.hasProperty(util._events,name))for(var a=0,l=util._events[name].length;a<l;a++)util._events[name][a]===fn&&util._events[name].splice(a,1);return util},hasProperty:function(obj,prop){return Object.prototype.hasOwnProperty.call(Object(obj),prop)},isArray:Array.isArray||function(obj){return Object.prototype.toString.call(obj)==="[object Array]"},createVarAtFqn:function(scope,fqn,value){var path=fqn.split("."),currVar=util.forceGetParentVarAtFqn(scope,fqn),key=path.pop();fqnMap.set(fqn,value&&typeof value=="object"?[]:value);util.isArray(value)&&fqnMap.flagAsArray(fqn);currVar[key]=value;!isIE&&!util.isArray(currVar)&&util.watch(currVar,key,fqn)},forceGetParentVarAtFqn:function(scope,fqn){var path=fqn.split(".");path.shift();var currVar=scope;while(path.length>1){var prop=path.shift();util.hasProperty(currVar,prop)||(isNaN(path[0])?currVar[prop]={}:currVar[prop]=[]);if(!currVar[prop]||typeof currVar[prop]!="object")currVar[prop]={};currVar=currVar[prop]}return currVar},getVarFromFqn:function(scope,fqn){var path=fqn.split(".");path.shift();var currVar=scope;while(path.length>0){var prop=path.shift();if(!util.hasProperty(currVar,prop))return!1;currVar=currVar[prop]}return currVar},generateRandomString:function(){return Math.random().toString().substr(2)},getValOrFqn:function(val,fqn){return typeof val=="function"?val.remote?undefined:{fqn:fqn}:val},watch:function(obj,label,fqn){var val=obj[label];function getter(){return val}function setter(newVal){if(val!==newVal&&newVal!==fqnMap.get(fqn)){if(val&&typeof val=="object"){fqnMap.deleteVar(fqn);socket.emit("del",[fqn]);val=newVal;lib.processScope(obj,fqn.substring(0,fqn.lastIndexOf(".")));return newVal}if(newVal&&typeof newVal=="object"){fqnMap.deleteVar(fqn);socket.emit("del",[fqn]);val=newVal;lib.processScope(obj,fqn.substring(0,fqn.lastIndexOf(".")));return newVal}fqnMap.set(fqn,newVal);val=newVal;typeof newVal=="function"&&(newVal={fqn:fqn});var toReplace={};toReplace[fqn]=newVal;socket.emit("rv",toReplace)}return newVal}if(Object.defineProperty)Object.defineProperty(obj,label,{get:getter,set:setter});else{obj.__defineSetter__&&obj.__defineSetter__(label,setter);obj.__defineGetter__&&obj.__defineGetter__(label,getter)}},unwatch:function(obj,label){if(Object.defineProperty)Object.defineProperty(obj,label,{get:undefined,set:undefined});else{obj.__defineSetter__&&obj.__defineSetter__(label,undefined);obj.__defineGetter__&&obj.__defineGetter__(label,undefined)}}};var now={ready:function(func){if(arguments.length===0)util.emit("ready");else{nowReady&&func();util.on("ready",func)}},core:{on:util.on,options:options,removeEvent:util.removeEvent,clientId:undefined,noConflict:noConflict}};lib={deleteVar:function(fqn){var path,currVar,parent,key;path=fqn.split(".");currVar=now;for(var i=1;i<path.length;i++){key=path[i];if(currVar===undefined){fqnMap.deleteVar(fqn);return}if(i===path.length-1){delete currVar[path.pop()];fqnMap.deleteVar(fqn);return}currVar=currVar[key]}},replaceVar:function(data){for(var fqn in data){util.hasProperty(data[fqn],"fqn")&&(data[fqn]=lib.constructRemoteFunction(fqn));util.createVarAtFqn(now,fqn,data[fqn])}},remoteCall:function(data){var func;data.fqn.split("_")[0]==="closure"?func=closures[data.fqn]:func=util.getVarFromFqn(now,data.fqn);var i,ii,args=data.args;if(typeof args=="object"&&!util.isArray(args)){var newargs=[];for(i in args)newargs.push(args[i]);args=newargs}for(i=0,ii=args.length;i<ii;i++)util.hasProperty(args[i],"fqn")&&(args[i]=lib.constructRemoteFunction(args[i].fqn));func.apply({now:now},args)},serverReady:function(){nowReady=!0;lib.processNowScope();util.emit("ready")},constructRemoteFunction:function(fqn){var remoteFn=function(){lib.processNowScope();var args=[];for(var i=0,ii=arguments.length;i<ii;i++)args[i]=arguments[i];for(i=0,ii=args.length;i<ii;i++)if(typeof args[i]=="function"){var closureId="closure_"+args[i].name+"_"+util.generateRandomString();closures[closureId]=args[i];args[i]={fqn:closureId}}socket.emit("rfc",{fqn:fqn,args:args})};remoteFn.remote=!0;return remoteFn},handleNewConnection:function(socket){if(socket.handled)return;socket.handled=!0;socket.on("rfc",function(data){lib.remoteCall(data);util.emit("rfc",data)});socket.on("rv",function(data){lib.replaceVar(data);util.emit("rv",data)});socket.on("del",function(data){lib.deleteVar(data);util.emit("del",data)});socket.on("rd",function(data){++readied===2&&lib.serverReady()});socket.on("disconnect",function(){readied=0;util.emit("disconnect")});socket.on("error",function(){util.emit("error")});socket.on("retry",function(){util.emit("retry")});socket.on("reconnect",function(){util.emit("reconnect")});socket.on("reconnect_failed",function(){util.emit("reconnect_failed")});socket.on("connect_failed",function(){util.emit("connect_failed")})},processNowScope:function(){lib.processScope(now,"now");clearTimeout(lastTimeout);socket.socket.connected&&(lastTimeout=setTimeout(lib.processNowScope,1e3))},processScope:function(obj,path){var data={};lib.traverseScope(obj,path,data);for(var i in data)if(util.hasProperty(data,i)&&data[i]!==undefined){socket.emit("rv",data);break}},traverseScope:function(obj,path,data){if(obj&&typeof obj=="object"){var objIsArray=util.isArray(obj),keys=fqnMap.get(path);for(var key in obj){var fqn=path+"."+key;if(fqn==="now.core"||fqn==="now.ready")continue;if(util.hasProperty(obj,key)){var val=obj[key],mapVal=fqnMap.get(fqn),wasArray=fqnMap.arrays[fqn],valIsArray=util.isArray(val),valIsObj=val&&typeof val=="object",wasObject=util.isArray(mapVal)&&!wasArray;if(objIsArray||isIE){if(valIsObj){if(valIsArray){if(!wasArray){fqnMap.set(fqn,[]);fqnMap.flagAsArray(fqn);data[fqn]=[]}}else if(!wasObject){fqnMap.set(fqn,[]);fqnMap.unflagAsArray(fqn);data[fqn]={}}}else if(val!==mapVal){fqnMap.set(fqn,val);fqnMap.unflagAsArray(fqn);data[fqn]=util.getValOrFqn(val,fqn)}}else if(mapVal===undefined){util.watch(obj,key,fqn);if(valIsObj)if(valIsArray){fqnMap.set(fqn,[]);fqnMap.flagAsArray(fqn);data[fqn]=[]}else{fqnMap.set(fqn,[]);data[fqn]={}}else{fqnMap.set(fqn,val);data[fqn]=util.getValOrFqn(val,fqn)}}valIsObj&&lib.traverseScope(val,fqn,data)}}if(keys&&typeof keys=="object"){var toDelete=[];for(var i=0;i<keys.length;i++)if(keys[i]!==undefined&&obj[keys[i]]===undefined){toDelete.push(path+"."+keys[i]);fqnMap.deleteVar(path+"."+keys[i]);--i}toDelete.length>0&&socket.emit("del",toDelete)}}},traverseScopeIE:function(obj,path,data){}};var dependencies=[{key:"io",path:"/"+now.core.options.socketio.resource+"/socket.io.js"}],dependenciesLoaded=0,scriptLoaded=function(){dependenciesLoaded++;if(dependenciesLoaded!==dependencies.length)return;socket=io.connect(uri+"/",now.core.options.socketio||{});now.core.socketio=socket;socket.on("connect",function(){now.core.clientId=socket.socket.sessionid;lib.handleNewConnection(socket);setTimeout(function(){lib.processNowScope();socket.emit("rd");if(++readied===2){nowReady=!0;util.emit("ready")}},100);util.emit("connect")});socket.on("disconnect",function(){(function(y){y(y,now)})(function(fn,obj){for(var i in obj)obj[i]&&typeof obj[i]=="object"&&obj[i]!==document&&obj[i]!==now.core?fn(fn,obj[i]):typeof obj[i]=="function"&&obj[i].remote&&delete obj[i]});fqnMap.data={}})};for(var i=0,ii=dependencies.length;i<ii;i++){if(window[dependencies[i].key]){scriptLoaded();continue}var fileref=document.createElement("script");fileref.setAttribute("type","text/javascript");fileref.setAttribute("src",uri+dependencies[i].path);fileref.onload=scriptLoaded;isIE&&(fileref.onreadystatechange=function(){(fileref.readyState==="loaded"||fileref.readyState==="complete")&&scriptLoaded()});document.getElementsByTagName("head")[0].appendChild(fileref)}return nowObjects[uri]=now};window.nowInitialize=noConflict})();
    return module.exports;
  });
})();

(function() {
  var f,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (f = function() {
    var exports, module, require;
    require = function(path) {
      return packageme.require(path, require.path);
    };
    require.path = "rexster-client/";
    exports = {};
    module = {
      exports: exports
    };
    return packageme.register("rexster-client/Graph", function() {
      module.exports.use = function(execute, now) {
        var Edge, Graph, Node, Vertex, VertexEdge;
        Node = require("./Node").use(execute);
        VertexEdge = require("./VertexEdge").use(execute, Node);
        Vertex = VertexEdge.Vertex;
        Edge = VertexEdge.Edge;
        return Graph = (function() {

          function Graph(graphData) {
            var key;
            for (key in graphData) {
              this[key] = graphData[key];
            }
          }

          Graph.prototype.signals = require("./signals").use(now, Vertex, Edge);

          Graph.prototype.addVertex = function(properties, handle, classType) {
            var _this = this;
            if (classType == null) classType = Vertex;
            return execute("POST", this.name, "/vertices", properties, function(err, response) {
              return handle(err, new classType(response.results, _this));
            });
          };

          Graph.prototype.removeVertex = function(vertexId, handle) {
            var _this = this;
            return execute("DELETE", this.name, "/vertices/" + vertexId, null, function(err, response) {
              return handle(err, response);
            });
          };

          Graph.prototype.addEdge = function(fromVertexId, toVertexId, label, properties, handle, classType) {
            var url,
              _this = this;
            if (classType == null) classType = Edge;
            url = "/edges?_outV=" + fromVertexId + "&_label=" + label + "&_inV=" + toVertexId;
            return execute("POST", this.name, url, properties, function(err, response) {
              return handle(err, new classType(response.results, _this));
            });
          };

          Graph.prototype.removeEdge = function(edgeId, handle) {
            var _this = this;
            return execute("DELETE", this.name, "/edges/" + edgeId, null, function(err, response) {
              return handle(err, response);
            });
          };

          Graph.prototype.getVertex = function(id, handle, classType) {
            var _this = this;
            if (classType == null) classType = Vertex;
            return execute("GET", this.name, "/vertices/" + id, null, function(err, response) {
              return handle(err, new classType(response.results, _this));
            });
          };

          Graph.prototype.getEdge = function(id, handle, classType) {
            var _this = this;
            if (classType == null) classType = Edge;
            return execute("GET", this.name, "/edges/" + id, null, function(err, response) {
              return handle(err, new classType(response.results, _this));
            });
          };

          Graph.prototype.clear = function(handle) {
            var _this = this;
            return execute("DELETE", this.name, "", null, function(err, response) {
              return handle(err, response);
            });
          };

          Graph.prototype.tp = {
            gremlin: {
              script: function(script, hadle) {
                var url;
                url = "/tp/gremlin?script=" + encodeURIComponent(script);
                return execute("GET", this.name, url, null, function(err, response) {
                  return handle(err, response.results);
                });
              }
            }
          };

          return Graph;

        })();
      };
      return module.exports;
    });
  })();

  (f = function() {
    var exports, module, require;
    require = function(path) {
      return packageme.require(path, require.path);
    };
    require.path = "rexster-client/";
    exports = {};
    module = {
      exports: exports
    };
    return packageme.register("rexster-client/index", function() {
      exports.initialize = function(resulthandle) {
        var now;
        require("./now");
        window.now = now = window.nowInitialize("//localhost:8000", {});
        return window.now.ready(function() {
          var Graph, api, execute;
          execute = function(method, graphname, url, body, handle) {
            var key, params, req;
            params = [];
            if (body !== null) {
              for (key in body) {
                params.push(key + "=" + encodeURIComponent(body[key]));
              }
            }
            if (params.length > 0) {
              if (url.indexOf("?") === -1) {
                params = "?" + params.join("&");
              } else {
                params = "&" + params.join("&");
              }
            } else {
              params = "";
            }
            req = {
              method: method,
              url: "/graphs/" + graphname + url + params
            };
            return now.execute(now.core.clientId, req, handle);
          };
          Graph = require("./Graph").use(execute, now);
          api = {
            getGraph: function(graphName, handle) {
              return execute("GET", graphName, "", null, function(err, result) {
                if (!err) {
                  return handle(err, new Graph(result));
                } else {
                  return handle(err, result);
                }
              });
            }
          };
          return resulthandle(api);
        });
      };
      return module.exports;
    });
  })();

  (f = function() {
    var exports, module, require;
    require = function(path) {
      return packageme.require(path, require.path);
    };
    require.path = "rexster-client/";
    exports = {};
    module = {
      exports: exports
    };
    return packageme.register("rexster-client/Node", function() {
      module.exports.use = function(execute) {
        var Node;
        return Node = (function() {

          function Node(nodeData, nodeType, graph) {
            var key;
            this.nodeType = nodeType;
            this.graph = graph;
            for (key in nodeData) {
              this[key] = nodeData[key];
            }
          }

          Node.prototype.setProperties = function(properties, handle) {
            var key, propPairs, url,
              _this = this;
            url = "/" + this.nodeType + "/" + this._id + "?";
            propPairs = [];
            for (key in properties) {
              propPairs.push(key + "=" + encodeURIComponent(properties[key]));
            }
            url += propPairs.join("&");
            return execute("PUT", this.graph.name, url, null, function(err, response) {
              var key;
              if (!err) {
                for (key in properties) {
                  _this[key] = response.results[key];
                }
              }
              return handle(err, response);
            });
          };

          Node.prototype.getProperty = function(key) {
            return this[key];
          };

          Node.prototype.removeProperties = function(keys, handle) {
            var url,
              _this = this;
            url = "/" + this.nodeType + "/" + this._id + "?" + keys.join("&");
            return execute("DELETE", this.graph.name, url, null, function(err, response) {
              var key, _i, _len;
              if (!err) {
                for (_i = 0, _len = keys.length; _i < _len; _i++) {
                  key = keys[_i];
                  delete _this[key];
                }
              }
              return handle(err, response);
            });
          };

          Node.prototype.tp = {
            gremlin: {
              script: function(script, handle) {
                var url;
                url = "/" + this.nodeType + "/" + this._id + "/tp/gremlin?script=" + encodeURIComponent(script);
                return execute("GET", this.graph.name, url, null, function(err, response) {
                  if (err) handle(err, response);
                  return handle(err, response.results);
                });
              }
            }
          };

          return Node;

        })();
      };
      return module.exports;
    });
  })();

  (f = function() {
    var exports, module, require;
    require = function(path) {
      return packageme.require(path, require.path);
    };
    require.path = "rexster-client/";
    exports = {};
    module = {
      exports: exports
    };
    return packageme.register("rexster-client/signals", function() {
      module.exports.use = function(now, Vertex, Edge) {
        var Signal, key, signals;
        Signal = (function() {

          function Signal(signalTransformer, name) {
            this.signalTransformer = signalTransformer;
            this.name = name != null ? name : "";
          }

          Signal.prototype.bind = function(handle) {
            var _this = this;
            return now.bind(now.core.clientId, this.name, function(signalData) {
              return _this.signalTransformer.call(null, signalData, handle);
            });
          };

          Signal.prototype.unbind = function() {
            return now.unbind(now.core.clientId, this.name);
          };

          return Signal;

        })();
        signals = {
          newVertex: new Signal(function(response, handle) {
            return handle(new Vertex(response.results));
          }),
          newEdge: new Signal(function(response, handle) {
            return handle(new Edge(response.results));
          }),
          vertexPropertiesChanged: new Signal(function(response, handle) {
            return handle(response.results);
          }),
          edgePropertiesChanged: new Signal(function(response, handle) {
            return handle(response.results);
          }),
          vertexRemoved: new Signal(function(response, handle) {
            return handle(response);
          }),
          edgeRemoved: new Signal(function(response, handle) {
            return handle(response);
          }),
          vertexPropertiesRemoved: new Signal(function(response, handle) {
            return handle(response);
          }),
          edgePropertiesRemoved: new Signal(function(response, handle) {
            return handle(response);
          }),
          graphCleared: new Signal(function(response, handle) {
            return handle(response);
          })
        };
        for (key in signals) {
          signals[key].signal = key;
        }
        return signals;
      };
      return module.exports;
    });
  })();

  (f = function() {
    var exports, module, require;
    require = function(path) {
      return packageme.require(path, require.path);
    };
    require.path = "rexster-client/";
    exports = {};
    module = {
      exports: exports
    };
    return packageme.register("rexster-client/VertexEdge", function() {
      module.exports.use = function(execute, Node) {
        var Edge, Vertex;
        ({
          wrapResponseForArray: function(graph, classType, handle) {
            var _this = this;
            return function(err, response) {
              var data, items, _i, _len, _ref;
              if (err) {
                handle(err, response);
                return;
              }
              items = [];
              _ref = response.results;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                data = _ref[_i];
                items.push(new classType(data, graph));
              }
              return handle(err, items);
            };
          },
          wrapResponseForObject: function(graph, classType, handle) {
            return function(err, response) {
              if (err) handle(err, response);
              return handle(err, new classType(response.results, graph));
            };
          }
        });
        Vertex = (function(_super) {

          __extends(Vertex, _super);

          function Vertex(vertexData, graph) {
            this.graph = graph;
            Vertex.__super__.constructor.call(this, vertexData, "vertices", this.graph);
          }

          Vertex.prototype.getOutVertices = function(handle, classType) {
            if (classType == null) classType = Vertex;
            return execute("GET", this.graph.name, "/vertices/" + this._id + "/out", null, wrapResponseForArray(this.graph, classType, handle));
          };

          Vertex.prototype.getInVertices = function(handle, classType) {
            if (classType == null) classType = Vertex;
            return execute("GET", this.graph.name, "/vertices/" + this._id + "/in", null, wrapResponseForArray(this.graph, classType, handle));
          };

          Vertex.prototype.getOutEdges = function(handle, classType) {
            if (classType == null) classType = Edge;
            return execute("GET", this.graph.name, "/vertices/" + this._id + "/outE", null, wrapResponseForArray(this.graph, classType, handle));
          };

          Vertex.prototype.getInEdges = function(handle, classType) {
            if (classType == null) classType = Edge;
            return execute("GET", this.graph.name, "/vertices/" + this._id + "/inE", null, wrapResponseForArray(this.graph, classType, handle));
          };

          return Vertex;

        })(Node);
        Edge = (function(_super) {

          __extends(Edge, _super);

          function Edge(edgeData, graph) {
            this.graph = graph;
            Edge.__super__.constructor.call(this, edgeData, "edges", this.graph);
          }

          Edge.prototype.getOutVertex = function(handle, classType) {
            if (classType == null) classType = Vertex;
            return execute("GET", this.graph.name, "/vertices/" + this._outV, null, wrapResponseForObject(this.graph, classType, handle));
          };

          Edge.prototype.getInVertex = function(handle, classType) {
            if (classType == null) classType = Vertex;
            return execute("GET", this.graph.name, "/vertices/" + this._inV, null, wrapResponseForObject(this.graph, classType, handle));
          };

          return Edge;

        })(Node);
        return {
          Vertex: Vertex,
          Edge: Edge
        };
      };
      return module.exports;
    });
  })();

}).call(this);

