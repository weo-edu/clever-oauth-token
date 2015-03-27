var request = require('superagent');
var qs = require('qs');

function base64(str) {
  return (new Buffer(str)).toString('base64');
}

module.exports = function(clientId, clientSecret, alternateUrl) {
  var baseUrl = 'https://clever.com/oauth/tokens';
  var authString = 'Basic ' + base64(clientId + ':' + clientSecret);

  // Allow alternate base urls to facilitate
  // mock oauth endpoints
  if(arguments.length === 3)
    baseUrl = alternateUrl;

  return function(params, cb) {
    // This is the only supported grant_type at the moment, so let's
    // not make people specify it if they don't want to
    params.grant_type = params.grant_type || 'authorization_code';
    // Not well documented on Clever, at the moment, but the only value that
    // can be passed here at the time of this writing is 'district', and if its
    // not present, the endpoint gets upset.
    params.owner_type = params.owner_type || 'district';

    var url = baseUrl + '?' + qs.stringify(params);
    request(url)
      .set('Authorization', authString)
      .end(function(err, res) {
        if(err) return cb(err);
        if(res.status !== 200)
          cb(new Error(res.body));
        cb(null, res.body.data[0].access_token);
      });
  };
};