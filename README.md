# clever-oauth-token

Exchange a Clever oauth code for an access token.

## Usage

```javascript
var cleverToken = require('clever-oauth-token')(cleverClientId, cleverClientSecret);

cleverToken({
  code: code,
  redirect_uri: redirect_uri,
  grant_type: 'authorization_code'  // optional
}, function(err, access_token) {

});
```

### Mock Endpoints

```javascript
var cleverToken = require('clever-oauth-token')(
  cleverClientId,
  cleverClientSecret,
  'http://mock-oauth-endpoint/oauth/tokens'
);
```

