var express = require("express");
var path = require("path");
var graphqlHTTP = require("express-graphql").graphqlHTTP;
// @ts-ignore
var axios1 = require("axios");
require("dotenv").config();
var app = express();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/static", express.static("public"));
app.use("/css", express.static("public/css"));
app.use("/img", express.static("public/img"));
app.use("/js", express.static("public/js"));
app.use(express.json()); // body-parser모듈 대체
app.use("/view", require("./routes"));
app.use(
  "/gql",
  graphqlHTTP({
    schema: require("./gql/schema"),
    rootValue: require("./gql/resolver"),
    graphiql: true,
  })
);
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  //@ts-ignore
  err.status = 404;
  next(err);
});
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  if (err.message === "Invalid URL") res.render("error");
  else res.send(err.message);
  // res.send("Internal Server Error");
});
app.listen(app.get("port"), function () {
  console.log("Running on", app.get("port"));
});
module.exports = app;
