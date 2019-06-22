const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema/book-apollo');
const resolvers = require('./graphql/resolvers/resolver-map');
const http = require('http');
const normalizePort = require('normalize-port');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// mongoose
var mongoose = require('mongoose');
var cors = require('cors');
var app = express();

// conf
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      console.log('Cliente conectado 🛰️ ');
    },
    onDisconnect: (webSocket, context) => {
      // ...
    }
  }
});

apollo.applyMiddleware({ app });
server = http.createServer(app);

// Add subscription support
apollo.installSubscriptionHandlers(server);

// mongoose server no-sql2018
const URL_Mongo = `mongodb://cesar:no-sql2018@ds341247.mlab.com:41247/react-graphql`;
// const URL_Mongo = "mongodb://localhost:27017/node-graphql"
mongoose
  .connect(URL_Mongo, {
    promiseLibrary: require('bluebird'),
    useNewUrlParser: true
  })
  .then(() => console.log('connection successful'))
  .catch(err => console.error(err));
const port = normalizePort(process.env.PORT || 4000);
server.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:4000${apollo.graphqlPath}`);
  console.log(
    `🚀🔥 Subscriptions ready at ws://localhost:${port}${
      apollo.subscriptionsPath
    }`
  );
});
