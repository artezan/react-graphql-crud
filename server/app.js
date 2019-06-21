var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// mongoose
var mongoose = require("mongoose");
// graphQL
var graphqlHTTP = require("express-graphql");
var schema = require("./graphql/book-schemas");
var cors = require("cors");
var { buildSchema } = require('graphql');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next)=> {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
})
app.use("/", indexRouter);
app.use("/users", usersRouter);
// Root resolver


// GraphQL
app.use('*', cors());

app.use(
  '/graphql',
  cors(),

  graphqlHTTP({
    schema: schema,
    rootValue: global,
    graphiql: true
  })
 
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// mongoose server
mongoose
  .connect(
    "mongodb://localhost:27017/node-graphql",
    { promiseLibrary: require("bluebird"), useNewUrlParser: true }
  )
  .then(() => console.log("connection successful"))
  .catch(err => console.error(err));



module.exports = app;
