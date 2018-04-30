require("dotenv").config();

// APP_ENV names the host platform ("test", "staging", "production"
// etc). It falls back to NODE_ENV if unset, but is normally
// independent of NODE_ENV, except for 'test'
const _appEnv = () => {
  if (process.env.APP_ENV !== undefined) {
    return process.env.APP_ENV;
  } else if (process.env.NODE_ENV !== undefined) {
    return process.env.NODE_ENV;
  } else {
    return "development";
  }
};

const env = _appEnv();

const cfg = require(`./${env}.config`);
cfg.environment = env;

module.exports = cfg;
