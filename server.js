const environment_config = require("./config/environments/config");

// make sure the minimum version of node is being used, 8.8.1
const [major, minor] = process.versions.node.split(".").map(parseFloat);
if (major < 8 || (major === 8 && minor < 8)) {
  console.log("⚠️ Please make sure you are running Node at >= 8.8.1 ⚠️");
  process.exit();
}

// start the application server
const app = require("./app");
app.set("port", environment_config.port || 7777);
const server = app.listen(app.get("port"), () => {
  console.log(`🏃 Express running → PORT ${server.address().port}`);
});
