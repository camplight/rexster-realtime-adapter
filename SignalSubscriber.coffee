module.exports = class Subscriber
  constructor: (@clientId, @event, @handler) ->
  
  match: (req) ->
    expression = @event == "newVertex" and req.method == "POST" and req.url.indexOf("/vertices") != -1 ||
      @event == "newEdge" and req.method == "POST" and req.url.indexOf("/edges") != -1 ||
      
      @event == "vertexRemoved" and req.method == "DELETE" and req.url.indexOf("/vertices") != -1 and req.url.indexOf("?") == -1 ||
      @event == "edgeRemoved" and req.method == "DELETE" and req.url.indexOf("/edges") != -1 and req.url.indexOf("?") == -1 ||
      
      @event == "vertexPropertiesChanged" and req.method == "PUT" and req.url.indexOf("/vertices/") != -1 ||
      @event == "edgePropertiesChanged" and req.method == "PUT" and req.url.indexOf("/edges/") != -1 ||
      
      @event == "vertexPropertiesRemoved" and req.method == "DELETE" and req.url.indexOf("/vertices/") != -1 and req.url.indexOf("?") != -1 ||
      @event == "edgePropertiesRemoved" and req.method == "DELETE" and req.url.indexOf("/edges/") != -1 and req.url.indexOf("?") != -1 ||

      @event == "graphCleared" and req.method == "DELETE" and req.url.indexOf("/graphs/") != -1

    return expression

  notify: (req, result) ->
    if @event == "vertexPropertiesRemoved" || @event == "edgePropertiesRemoved"
      data = req.url.split("/").pop().split("?")
      id = data[0]
      keys = data[1].split("&")
      @handler {_id: id, keys: keys}
    else if @event == "vertexRemoved" || @event == "edgeRemoved"
      id = req.url.split("/").pop()
      @handler {_id: id}
    else
      @handler result