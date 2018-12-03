# sensorpush

An npm module for sensorpush API access. Lightweight; requires zero external modules, especially no big https request module.

This is unofficial and I'm happy to hand ownership over to the sensorpush team, or another engineer they approve of.

### Installation

```
npm install sensorpush
```

### Examples

```javascript
// signing in requires a call to get an authorization code and apikey,
// and then a second call to generate an access token.

const sensorpush = require 'sensorpush';

let credentials = {
  email: "you@example.com",
  password: "y0urP@ssword-on-sensorpush"
};

sensorpush.api.oauth.authorize(credentials, function(err2, res2) {
  sensorpush.api.oauth.accesstoken({authorization: res.authorization}, function (err2, res2) {

    let accesstoken = res2.accesstoken;

    sensorpush.api.devices.sensors({accesstoken: accesstoken}, function (err3, res3) {
      console.log("Sensor response:", res3);
    });

    sensorpush.api.devices.gateways({accesstoken: accesstoken}, function (err4, res4) {
      console.log("Gateways response:", res4);
    });

    sensorpush.api.samples({limit: 10, accesstoken: accesstoken}, function (err5, res5) {
      console.log("Samples response:", res5);
    });
  });
});
```
