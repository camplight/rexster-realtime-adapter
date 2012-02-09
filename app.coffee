now = require 'now'
express = require 'express'
packageme = require 'packageme'
rexsterAdapter = require './adapter'
subscriber = require './SignalSubscriber'
_ = require 'underscore'

app = module.exports = express.createServer()

app.configure () ->
  app.use express.bodyParser() 
  app.use express.methodOverride()
  app.use packageme(__dirname + "/rexster-client").toURI("/client.js")
  app.use app.router

app.configure 'development', () ->
  app.use express.errorHandler({ dumpExceptions: true, showStack: true })
  app.use express.static __dirname

app.configure 'production', () ->
  app.use express.errorHandler()

app.listen 8000

everyone = now.initialize app
subscribers = []

everyone.now.bind = (clientId, event, resultHandler) ->
  subscribers.push new subscriber clientId, event, resultHandler

everyone.now.unbind = (clientId, event) ->
  _.each subscribers, (subscriber) ->
    if subscriber.event == event and subscriber.clientId == clientId
      subscribers = _.without subscribers, subscriber

everyone.now.execute = (clientId, req, resultHandler) ->
  
  rexsterAdapter.proxyRequest req, (err, result) ->
    if err
      resultHandler err, null 
      return

    try
      # return response to req origin first
      response = JSON.parse result 
      resultHandler null, response
    catch err
      resultHandler err, null
      return
    
    # notify all subscribers matching req as action event
    _.each subscribers, (subscriber) ->
      if subscriber.match req
        subscriber.notify req, response

console.log "rexter adapter listening on port #{app.address().port} in #{app.settings.env} mode"