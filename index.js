var request = require('superagent');

function base64(str) {
  return (new Buffer(str)).toString('base64');
}

module.exports = function(clientId, clientSecret, alternateUrl) {
  var url = 'https://clever.com/oauth/tokens';
  var authString = 'Basic ' + base64(clientId + ':' + clientSecret);

  // Allow alternate base urls to facilitate
  // mock oauth endpoints
  if(arguments.length === 3)
    baseUrl = alternateUrl;

  return function(params, cb) {
    // This is the only supported grant_type at the moment, so let's
    // not make people specify it if they don't want to
    params.grant_type = params.grant_type || 'authorization_code';

    request.post(url)
      .set('Authorization', authString)
      .send(params)
      .end(function(err, res) {
        if(err) return cb(err);
        if(res.status !== 200)
          cb(new Error(res.body));
        cb(null, res.body.access_token);
      });
  };
};