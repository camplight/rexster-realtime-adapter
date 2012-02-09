module.exports = class Subscriber
  constructor: (@clientId, @event, @handler) ->
  
  match: (req) ->
    expression = @event is "newVertex" and req.method is "POST" and req.url.indexOf("/vertices") isnt -1 or
      @event is "newEdge" and req.method is "POST" and req.url.indexOf("/edges") isnt -1 or
      
      @event is "vertexRemoved" and req.method is "DELETE" and req.url.indexOf("/vertices") is -1 and req.url.indexOf("?") is -1 or
      @event is "edgeRemoved" and req.method is "DELETE" and req.url.indexOf("/edges") isnt -1 and req.url.indexOf("?") is -1 or
      
      @event is "vertexPropertiesChanged" and req.method is "PUT" and req.url.indexOf("/vertices/") isnt -1 or
      @event is "edgePropertiesChanged" and req.method is "PUT" and req.url.indexOf("/edges/") isnt -1 or
      
      @event is "vertexPropertiesRemoved" and req.method is "DELETE" and req.url.indexOf("/vertices/") isnt -1 and req.url.indexOf("?") isnt -1 or
      @event is "edgePropertiesRemoved" and req.method is "DELETE" and req.url.indexOf("/edges/") isnt -1 and req.url.indexOf("?") isnt -1 or

      @event is "graphCleared" and req.method is "DELETE" and req.url is "/graphs/graph"

    return expression

  notify: (req, result) ->
    if @event is "vertexPropertiesRemoved" or @event is "edgePropertiesRemoved"
      data = req.url.split("/").pop().split("?")
      id = data[0]
      keys = data[1].split("&")
      @handler {_id: id, keys: keys}
    else if @event is "vertexRemoved" or @event is "edgeRemoved"
      id = req.url.split("/").pop()
      @handler {_id: id}
    else
      @handler result