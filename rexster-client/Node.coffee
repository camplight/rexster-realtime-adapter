module.exports.use = (execute) ->
  return class Node
    constructor: (nodeData, @nodeType, @graph) ->
      for key of nodeData
        @[key] = nodeData[key]
    
    setProperties: (properties, handle) ->
      url = "/" + @nodeType + "/" + @_id + "?"
      
      propPairs = []
      for key of properties
        propPairs.push key + "=" + encodeURIComponent(properties[key])
      url += propPairs.join("&")
      
      execute "PUT", @graph.name, url, null, (err, response) =>
        if not err
          for key of properties
            @[key] = response.results[key]
        handle  err, response
   
    getProperty: (key) ->
      return @[key]
    
    removeProperties: (keys, handle) ->
      url = "/" + @nodeType + "/" + @_id + "?" + keys.join("&")
      execute "DELETE", @graph.name, url, null, (err, response) =>
        if not err
          for key in keys
            delete @[key]
        handle  err, response
    
    tp:
      gremlin:
        script: (script, handle) ->
          url = "/" + @nodeType + "/" + @_id + "/tp/gremlin?script=" + encodeURIComponent(script)
          execute "GET", @graph.name, url, null, (err, response) ->
            if err 
              handle err, response
              
            handle err, response.results