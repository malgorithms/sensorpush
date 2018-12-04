# sensorpush

This is an npm module for the new SensorPush API. It is lightweight; this module requires ZERO external modules, especially no big-ass https `request` module.

It is unofficial and I'm happy to hand ownership over to the [https://www.sensorpush.com](SensorPush.com) team, or another engineer they approve of.


![SensorPush](http://www.sensorpush.com/assets/DSC_8363-2-sillo-4baaecdaddd21e48ed0b8f3541fcf136fa1a1026600d017002266ca18519146d.png)


### Installation

```
npm install sensorpush
```

### A quick example

```javascript
const sensorpush = require('sensorpush');

let credentials = {
  email: "you@example.com",
  password: "y0urP@ssword-on-sensorpush"
};

// step 1: get an authorization code
sensorpush.api.oauth.authorize(credentials, function (err1, res1) {

// step 2: get an access token
  sensorpush.api.oauth.accesstoken({ authorization: res1.authorization }, function (err2, res2) {

    let accesstoken = res2.accesstoken;

    // steps 3-5: get data, using the access token
    sensorpush.api.devices.sensors({ accesstoken: accesstoken }, function (err3, res3) {
      console.log("Sensor response:", res3);
    });

    sensorpush.api.devices.gateways({ accesstoken: accesstoken }, function (err4, res4) {
      console.log("Gateways response:", res4);
    });

    // get any readings from the last 10 mins
    let startTime = new Date(Date.now() - 60 * 1000 * 10);
    sensorpush.api.samples({ limit: 10, startTime: startTime, accesstoken: accesstoken }, function (err5, res5) {
      console.log("Samples response:", res5);
    });
  });
});
```

### Promises?

If you're looking for a version of this that uses Promises, I'll take a PR that wraps each of the API functions and exposes in a `sensorpush.promise` object.  So for example, a user of this module could call either:

```
sensorpush.api.samples(opts, cb);
```

Or


```
sensorpush.promise.samples(opts).then(/* etc. */)
```

This should be in as plain JS and require no external modules for either inclusion or building.
