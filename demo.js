//
// To try this demo, just change the email and password below
// to match your sensorpush credentials.
// Or add your sensorpush email/password to environment variables and use code as is.

const sensorpush = require('sensorpush');
const limit = 10

let credentials = {
  email: process.env.SENSOR_PUSH_EMAIL,
  password: process.env.SENSOR_PUSH_PASSWORD
};

function init (isPromise) {
  if (isPromise) {
    let accessToken
    // step 1: get an authorization code
    return sensorpush.promise.oauth.authorize(credentials)
      .then(resp => {
        // step 2: get an access token
        return sensorpush.promise.oauth.accessToken({ authorization: resp.authorization })
      })
      .then(resp => {
        accessToken = resp.accesstoken;
        // steps 3-5: get data, using the access token
        return sensorpush.promise.devices.sensors({ accessToken })
      })
      .then(resp => {
        console.log("Sensor response:", JSON.stringify(resp));
        return sensorpush.promise.devices.gateways({ accessToken })
      })
      .then(resp => {
        console.log("Gateways response:", JSON.stringify(resp));
        // get any readings from the last 10 mins
        let startTime = new Date(Date.now() - 60 * 1000 * 10);
        return sensorpush.promise.samples({ limit, startTime, accessToken });
      })
      .then(resp => {
        console.log("Samples response:", JSON.stringify(resp));
      })
      .catch(err => {
        console.error(err)
      })
  } else {
    // step 1: get an authorization code
    sensorpush.api.oauth.authorize(credentials, function (err1, res1) {

      // step 2: get an access token
      sensorpush.api.oauth.accessToken({ authorization: res1.authorization }, function (err2, res2) {

        let accessToken = res2.accesstoken;

        // steps 3-5: get data, using the access token
        sensorpush.api.devices.sensors({ accessToken: accessToken }, function (err3, res3) {
          console.log("Sensor response:", res3);
        });

        sensorpush.api.devices.gateways({ accessToken: accessToken }, function (err4, res4) {
          console.log("Gateways response:", res4);
        });

        // get any readings from the last 10 mins
        let startTime = new Date(Date.now() - 60 * 1000 * 10);
        sensorpush.api.samples({ limit: 10, startTime: startTime, accessToken: accessToken }, function (err5, res5) {
          console.log("Samples response:", res5);
        });
      });
    });
  }
}

// pass "false" to init function if you'd prefer to use callbacks instead of promises
init(true)
