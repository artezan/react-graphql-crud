var express = require('express');
var router = express.Router();
// graphQL
var graphqlHTTP = require("express-graphql");
var schema = require("../graphql/book-schemas");

/* GET users listing. */
router.get('/', function(req, res, next) {

  graphqlHTTP({
    schema: schema,
    rootValue: global,
    graphiql: true
  })
});

module.exports = router;
