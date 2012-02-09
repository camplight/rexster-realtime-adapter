http = require 'http'
###
req =
url: "/graph/..."
method: "GET" or "POST" or "DELETE" or "PUT"
body: {} or "" if "POST" or "PUT"
full list of the available RESTapi to rexter:
https://github.com/tinkerpop/rexster/wiki/Basic-REST-API
###
module.exports.proxyRequest = (req, resultHandler) ->
  r = 
    host: "localhost"
    path: req.url
    method: req.method
    port: 8182

  request = http.request r, (resp) ->

    body = ""
    resp.on "data", (chunk) ->
      body += chunk.toString()
    resp.on "end", () ->
      if resp.statusCode isnt 200
        resultHandler {error: resp.statusCode, message: body}, null
      else
        resultHandler null, body

  request.on "error", (error)->
    resultHandler {error: error}, null

  request.write req.body.toString() if req.body
  request.end()