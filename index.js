const https = require('https');

exports.api = { oauth: {}, devices: {} };

// ---------------------------------------------------------------------

function postToSensorPush(opts, cb) {
  let params = opts.params || {};
  let path = opts.path;
  let accesstoken = opts.accesstoken; // possibly undefined
  let postData = JSON.stringify(params)

  let headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  };
  if (accesstoken) {
    headers.Authorization = accesstoken;
  };
  let options = {
    hostname: "api.sensorpush.com",
    port: 443,
    path: path,
    method: "POST",
    headers: headers
  };
  let body = new Buffer(0);
  let err = null;
  let response = null;
  let req = https.request(options, function (res) {
    response = res;
    res.on('data', function (d) {
      body = Buffer.concat([body, d]);
    });
    res.on('end', function () {
      if (response.statusCode !== 200) {
        err = new Error(`Got status code ${response.statusCode}`);
        console.error("TODO: remove this logging");
        console.error(body.toString('utf-8'));
      }
      if (!err) {
        try {
          body = JSON.parse(body.toString('utf-8'));
        }
        catch (e) {
          err = e;
        }
      }
      cb(err, body, response);
    });
  });
  req.on('error', function (e) { err = e });
  req.write(postData);
  req.end()
}

// ---------------------------------------------------------------------

exports.api.oauth.authorize = function (opts, cb) {
  console.log("Logging in...")
  postToSensorPush({
    path: "/api/v1/oauth/authorize",
    params: {
      email: opts.email,
      password: opts.password
    }
  }, cb);
};

// ---------------------------------------------------------------------

exports.api.oauth.accesstoken = function (opts, cb) {
  console.log("Getting access token...")
  postToSensorPush({
    path: "/api/v1/oauth/accesstoken",
    params: {
      authorization: opts.authorization
    }
  }, cb);
};

// ---------------------------------------------------------------------

exports.api.devices.gateways = function (opts, cb) {
  postToSensorPush({
    path: "/api/v1/devices/gateways",
    params: {
      accesstoken: opts.accesstoken
    }
  }, cb);
};

// ---------------------------------------------------------------------

exports.api.devices.sensors = function (opts, cb) {
  postToSensorPush({
    path: "/api/v1/devices/sensors",
    params: {
      accesstoken: opts.accesstoken
    }
  }, cb);
};
