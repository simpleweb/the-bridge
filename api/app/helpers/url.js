const { URL, URLSearchParams } = require('url');
const environment_config = require("../../config/environments/config")

exports.extractTimestampParams = (path) => {
  // TO DO: tidy up parsing of params so they include the + anyway

  var params = new URL(environment_config.host + environment_config.port + path).searchParams
  var get_posts_since
  var get_posts_before

  if (params.get('get_posts_since')) {
    var get_posts_since = params.get('get_posts_since').replace(' ', '+')
  }

  if (params.get('get_posts_before')) {
    var get_posts_before = params.get('get_posts_before').replace(' ', '+')
  }

  return {get_posts_since: get_posts_since, get_posts_before: get_posts_before}
};


