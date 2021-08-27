const express = require("express");
const path = require("path");
const { graphqlHTTP } = require("express-graphql");
// @ts-ignore
const axios1 = require("axios");

require("dotenv").config();

const app = express();

app.set("port", process.env.PORT || 6713);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

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

app.use((req, res, next) => {
  const err = new Error("Not Found");
  //@ts-ignore
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  if (err.message === "Invalid URL") res.render("error");
  else res.send(err.message);
  // res.send("Internal Server Error");
});

app.listen(app.get("port"), () => {
  console.log(`Running on`, app.get("port"));
});

module.exports = app;
