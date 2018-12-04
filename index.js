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
      }
      try {
        body = JSON.parse(body.toString('utf-8'));
      }
      catch (e) {
        err = err || e;
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
    accesstoken: opts.accesstoken
  }, cb);
};

// ---------------------------------------------------------------------

exports.api.devices.sensors = function (opts, cb) {
  postToSensorPush({
    path: "/api/v1/devices/sensors",
    accesstoken: opts.accesstoken
  }, cb);
};

// ---------------------------------------------------------------------

exports.api.samples = function (opts, cb) {
  let startTime = opts.startTime
  if (startTime && startTime instanceof Date) {
    startTime = startTime.toISOString()
  }
  if (startTime && !(/\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z/).test(startTime)) {
    throw new Error('Bad `startTime` value. Please provide a Date object or string formatted with Date::toISOString()');
  }
  postToSensorPush({
    path: "/api/v1/samples",
    accesstoken: opts.accesstoken,
    params: {
      limit: opts.limit,
      startTime: startTime
    }
  }, cb);
};
