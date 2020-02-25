//
// To try this demo, just change the email and password below
// to match your sensorpush credentials
//

const sensorpush = require('./index.js');
const limit = 10

let credentials = {
  email: "tomwallace75@hotmail.com",
  password: "6#3H#577RjEW2S@ymC*W"
};

function init (isPromise) {
  if (isPromise) {
    let accessToken
    // step 1: get an authorization code
    return sensorpush.promise.oauth.authorize(credentials)
      .then(resp => {
        // step 2: get an access token
        return sensorpush.promise.oauth.accesstoken({ authorization: resp.authorization })
      })
      .then(resp => {
        accessToken = resp.accesstoken;
        // steps 3-5: get data, using the access token
        return sensorpush.promise.devices.sensors({ accessToken })
      })
      .then(resp => {
        console.log("Sensor response:", resp);
        return sensorpush.promise.devices.gateways({ accessToken })
      })
      .then(resp => {
        console.log("Gateways response:", resp);
        // get any readings from the last 10 mins
        let startTime = new Date(Date.now() - 60 * 1000 * 10);
        return sensorpush.promise.samples({ limit, startTime, accessToken });
      })
      .then(resp => {
        console.log("Samples response:", resp);
      })
      .catch(err => {
        console.error(err)
      })
  } else {
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
  }
}

init(true)