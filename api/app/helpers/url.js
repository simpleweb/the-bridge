const { URL, URLSearchParams } = require('url');
const environment_config = require("../../config/environments/config")

exports.extractTimestampParams = (path) => {
  var params = new URL(environment_config.host + environment_config.port + path).searchParams
  return {get_posts_since: params.get('get_posts_since'), get_posts_before: params.get('get_posts_before')}
};


