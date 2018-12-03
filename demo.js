//
// To try this demo, just change the email and password below
// to match your sensorpush credentials
//

const sensorpush = require('sensorpush');

let credentials = {
  email: "you@example.com",
  password: "y0urP@ssword-on-sensorpush"
};

sensorpush.api.oauth.authorize(credentials, function (err1, res1) {
  sensorpush.api.oauth.accesstoken({ authorization: res1.authorization }, function (err2, res2) {

    let accesstoken = res2.accesstoken;

    sensorpush.api.devices.sensors({ accesstoken: accesstoken }, function (err3, res3) {
      console.log("Sensor response:", res3);
    });

    sensorpush.api.devices.gateways({ accesstoken: accesstoken }, function (err4, res4) {
      console.log("Gateways response:", res4);
    });

    sensorpush.api.samples({ limit: 10, accesstoken: accesstoken }, function (err5, res5) {
      console.log("Samples response:", res5);
    });
  });
});
