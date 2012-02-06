module.exports.use = (now, Vertex, Edge) ->
  
  # helper class for signal features
  class Signal
    constructor: (@signalTransformer, @name = "") ->

    bind: (handle) ->
      now.bind now.core.clientId, @name, (signalData) =>
        @signalTransformer.call null, signalData, handle
    unbind: ()->
      now.unbind now.core.clientId, @name

  signals = 
    
    newVertex: new Signal (response, handle) ->
      handle new Vertex(response.results)
    newEdge: new Signal (response, handle) ->  
      handle new Edge(response.results)

    vertexPropertiesChanged: new Signal (response, handle) ->
      handle response.results
    edgePropertiesChanged: new Signal (response, handle) ->
      handle response.results

    vertexRemoved: new Signal (response, handle) ->
      handle response # void?
    edgeRemoved: new Signal (response, handle) ->
      handle response # void?

    vertexPropertiesRemoved: new Signal (response, handle) ->
      handle response # void?
    edgePropertiesRemoved: new Signal (response, handle) ->
      handle response # void?

    graphCleared: new Signal (response, handle) ->
      handle response
  
  # self-inject signal names
  for key of signals
    signals[key].signal = key
  
  return signals