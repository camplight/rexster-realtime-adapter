exports.initialize = (resulthandle) ->
  require './now'

  # register window.nowInitialize method for setuping now connection
  window.now = now = window.nowInitialize("//localhost:8000", {})
  window.now.ready ()->

    execute = (method, graphname, url, body, handle)->
      params = []
      
      # TODO replace this with PUT/POST body. currently uses the uri
      if body isnt null
        for key of body
          params.push key + "=" + encodeURIComponent(body[key])
      if params.length > 0
        if url.indexOf("?") is -1
          params = "?" + params.join("&")
        else
          params = "&" + params.join("&")
      else
        params = ""
      
      req = 
        method: method
        url: "/graphs/" + graphname + url + params
      
      now.execute now.core.clientId, req, handle
    
    Graph = require("./Graph").use(execute, now)
    
    # construct api object wrapping rexter-realtime-adapter client protocol
    api = 
      getGraph: (graphName, handle) ->
        execute "GET", graphName, "", null, (err, result) ->
          if not err
            handle err, new Graph(result)
          else
            handle err, result

    # return ready the api object
    resulthandle api