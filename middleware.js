const express = require('express')
const app = express();
const PORT = process.env.PORT || 3001;

function middleware_1(req, res){
  req.newProperty = 'value 1'
  next()
}

function middleware_2(req, res){
  req.newProperty = 'value 2'
  next()
}

// custom middleware
app.get('/',
        middleware_1,
        middleware_2,
        function(req, res){
  res.send(`<h1>reached the root route with newProperty: ${req.newProperty}</h1>`)
})

app.listen (3001, function(){
  console.log(`middleware is running on: ${PORT}`)
})