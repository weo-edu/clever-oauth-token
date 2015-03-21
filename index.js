var request = require('superagent');
var qs = require('qs');

function base64(str) {
  return (new Buffer(str)).toString('base64');
}

module.exports = function(clientId, clientSecret, alternateUrl) {
  var baseUrl = 'https://clever.com/oauth/tokens';
  var authString = base64(clientId + ':' + clientSecret);

  // Allow alternate base urls to facilitate
  // mock oauth endpoints
  if(arguments.length === 3)
    baseUrl = alternateUrl;

  return function(params) {
    // This is the only supported grant_type at the moment, so let's
    // not make people specify it if they don't want to
    params.grant_type = params.grant_type || 'authorization_code';

    var url = baseUrl + '?' + qs.stringify(params);
    request(url)
      .end(function(err, res) {
        if(err) return cb(err);
        if(res.status !== 200)
          cb(new Error(res.body));
        cb(null, res.body.access_token);
      });
  };
};