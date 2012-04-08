_ = require("./underscore")

module.exports.use = (execute, now) ->
  Node = require("./Node").use(execute)
  VertexEdge = require("./VertexEdge").use(execute, Node)
  Vertex = VertexEdge.Vertex
  Edge = VertexEdge.Edge
  
  return class Graph
    constructor: (graphData) ->
      for key of graphData
        @[key] = graphData[key]
    
    signals: require("./signals").use(now, Vertex, Edge)
    
    addVertex: (properties, handle, classType = Vertex) ->
      execute "POST", @name, "/vertices", properties, (err, response) =>
        handle err, new classType(response.results, @)
    removeVertex: (vertexId, handle) ->
      execute "DELETE", @name, "/vertices/"+vertexId, null, (err, response) =>
        handle err, response
    
    addEdge: (fromVertexId, toVertexId, label, properties, handle, classType = Edge) ->
      url = "/edges?_outV="+fromVertexId+"&_label="+label+"&_inV="+toVertexId
      execute "POST", @name, url, properties, (err, response) =>
        handle err, new classType(response.results, @)
    removeEdge: (edgeId, handle) ->
      execute "DELETE", @name, "/edges/"+edgeId, null, (err, response) =>
        handle err, response
    
    getVertex: (id, handle, classType = Vertex) ->
      execute "GET", @name, "/vertices/"+id, null, (err, response) =>
        handle err, new classType(response.results, @)
    getEdge: (id, handle, classType = Edge) ->
      execute "GET", @name, "/edges/"+id, null, (err, response) =>
        handle err, new classType(response.results, @)
    
    getVertexes: (handle, classType = Vertex) ->
      execute "GET", @name, "/vertices/", null, (err, response) =>
        vertexes = []
        _.each response.results, (item) ->
          vertexes.push(new classType(item, @))
        handle err, vertexes
    getEdges: (handle, classType = Edge) ->
      execute "GET", @name, "/edges/", null, (err, response) =>
        edges = []
        _.each response.results, (item) ->
          edges.push(new classType(item, @))
        handle err, edges
    
    clear: (handle) ->
      execute "DELETE", @name, "", null, (err, response) =>
        handle err, response
    
    tp:
      gremlin:
        script: (script, hadle) ->
          url = "/tp/gremlin?script="+encodeURIComponent(script)
          execute "GET", @name, url, null, (err, response) ->
            handle err, response.results