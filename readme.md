# Rexster Realtime Adapter #
Adapter/addon for Rexster having pubsub-like realtime notifications

Not for production, use at your own risk.

## usage ##

* start the rexster server
    
        ./rexster.sh --start
    
* start the rexster realtime adapter
    
        coffee ./app.coffee
    
* include the client API
    
        <script src="/localhost:8000/client.js"></script>
    
* write some javascript code
    
        <script>
          var graph = packageme.require("rexster-client").getGraph("neo4jsample");
          graph.addVertex({"my own property": "with json suitable value"}, function(err, createdVertex){
            console.log(createdVertex);
          });
          graph.addEdge(vertex._id, 42, "label", {createdAt: new Date()}, function(err, createdEdge){
            console.log(createdEdge);
          });
          ...
          graph.signals.newVertex(function(newVertex){
            console.log(newVertex);
          });
          ...
        </script>

## realtime signals ##
  * `newVertex`, signalData: `Vertex`
  * `newEdge`, signalData: `Edge`
  * `vertexRemoved`, signalData: `{ _id }`
  * `edgeRemoved`, signalData: `{ _id }`
  * `graphCleared`, signalData: `{ }`
  * `vertexPropertyChanged`, signalData: `{ _id, property1: value1, ... }`
  * `vertexPropertyRemoved`, signalData: `{ _id }`
  * `edgePropertyChanged`, signalData: `{ _id, property1: value1, ... }`
  * `edgePropertyRemoved`, signalData: `{ _id, keys: ["property1", "property2"] }`

## Rexster-client ##

### rexster.getGraph(`graphName`, `function resultHandler(err, Graph)`) ###

## Graph ##

### graph.addVertex(`properties json`, `function resultHandler(err, Vertex)`) ###

### graph.addEdge(`outVertexId`, `inVertexId`, `label`, `properties json`, `function resultHandler(err, Edge)`) ###

### graph.getVertex(`id`, `function resultHandler(err, Vertex)`) ###

### graph.getEdge(`id`, `function resultHandler(err, Edge)`) ###

### graph.tp.gremlin(`script`, `function resultHandler(err, json)`) ###

## Vertex ##
Extends Node

### vertex.getOutEdges(`function resultHandler(err, array Edges)`) ###

### vertex.getInEdges(`function resultHandler(err, array Edges)`) ###

### vertex.tp.gremlin(`script`, `function resultHandler(err, json)`) ###

## Edge ##
Extends Node

### edge.getOutVertex(`function resultHandler(err, Vertex)`) ###

### edge.getInVertex(`function resultHandler(err, Vertex)`) ###

### edge.tp.gremlin(`script`, `function resultHandler(err, json)`) ###

## Node ##

### node.setProperties(`properties`, `function resultHandler(err, properties)`) ###

### node.removeProperties(`array [key1, key2]`, `function resultHandler(err)`) ###

### node.getProperty(`key`) `returns value` ###

## Logic behind ##
rexster-realtime-adapter acts like realtime broker between rexster and any connected clients.
When client initiates operation based on the above api, it gets send via http to rexster and 
subscribers listening for such event will be notified with the response of rexster.

Any http messages send directly to Rexster, won't fire notification to rexster-realtimer-adapter because
the current REST API does not include such support (yet).

## hints ##
* launch app.coffee and open http://localhost:8000/tests/manual/index.html , look at the console.
* experiment