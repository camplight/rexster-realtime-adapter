module.exports.use = (execute, Node)->  
  
  wrapResponseForArray = (graph, classType, handle) ->
    return (err, response) =>
      if err
        handle err, response
        return

      items = []
      for data in response.results
        items.push new classType(data, graph)
      handle err, items
  
  wrapResponseForObject = (graph, classType, handle) ->
    return (err, response)->
      if err
        handle err, response

      handle err, new classType(response.results, graph)
    
  class Vertex extends Node
    constructor: (vertexData, @graph) ->
      super vertexData, "vertices", @graph
    getOutVertices: (handle, classType = Vertex) ->
      execute "GET", @graph.name, "/vertices/"+@_id+"/out", null, wrapResponseForArray(@graph, classType, handle)
    getInVertices: (handle, classType = Vertex) ->
      execute "GET", @graph.name, "/vertices/"+@_id+"/in", null, wrapResponseForArray(@graph, classType, handle)
    getOutEdges: (handle, classType = Edge) ->
      execute "GET", @graph.name, "/vertices/"+@_id+"/outE", null, wrapResponseForArray(@graph, classType, handle)
    getInEdges: (handle, classType = Edge) ->
      execute "GET", @graph.name, "/vertices/"+@_id+"/inE", null, wrapResponseForArray(@graph, classType, handle)

  class Edge extends Node
    constructor: (edgeData, @graph) ->
      super edgeData, "edges", @graph
    getOutVertex: (handle, classType = Vertex) ->
      execute "GET", @graph.name, "/vertices/"+@_outV, null, wrapResponseForObject(@graph, classType, handle)
    getInVertex: (handle, classType = Vertex) ->
      execute "GET", @graph.name, "/vertices/"+@_inV, null, wrapResponseForObject(@graph, classType, handle)
  
  return { Vertex: Vertex, Edge: Edge}