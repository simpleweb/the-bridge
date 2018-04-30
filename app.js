const express = require("express");
const helmet = require("helmet");
const path = require("path");
const viewEngine = require("express-json-views");
const routes = require("./config/routes");
const errorHelpers = require("./app/helpers/errors");

const app = express();

// adds sets of HTTP headers to add extra layers of security
app.use(
  helmet({
    noCache: false
  })
);

// set view engine
app.engine('json', viewEngine({
  helpers: require('./app/views/helpers')
}));
app.set('views', path.join(__dirname, "app/views"));
app.set('view engine', 'json');

// configure routes
app.use("/", routes);

app.use(errorHelpers.notFound);

if (app.get("env") === "development") {
  app.use(errorHelpers.developmentErrors);
} else {
  app.use(errorHelpers.productionErrors);
}

module.exports = app;
