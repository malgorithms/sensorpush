const https = require('https');

exports.api = { oauth: {}, devices: {} };
exports.promise = { oauth: {}, devices: {} };

const START_TIME_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/

function validateStartTime (startTime) {
  return startTime && START_TIME_REGEX.test(startTime)
}

// ---------------------------------------------------------------------

function postToSensorPush(opts, cb) {
  let params = opts.params || {};
  let path = opts.path;
  let accessToken = opts.accessToken; // possibly undefined
  let postData = JSON.stringify(params)

  let headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  };
  if (accessToken) {
    headers.Authorization = accessToken;
  }
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
  req.on('error', function (e) {
      err = e
    }
  );
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

exports.api.oauth.accessToken = function (opts, cb) {
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
    accessToken: opts.accessToken
  }, cb);
};

// ---------------------------------------------------------------------

exports.api.devices.sensors = function (opts, cb) {
  postToSensorPush({
    path: "/api/v1/devices/sensors",
    accessToken: opts.accessToken
  }, cb);
};

// ---------------------------------------------------------------------

exports.api.samples = function (opts, cb) {
  let startTime = opts.startTime
  if (startTime && startTime instanceof Date) {
    startTime = startTime.toISOString()
  }
  if (!validateStartTime(startTime)) {
    throw new Error('Bad `startTime` value. Please provide a Date object or string formatted with Date::toISOString()');
  }
  postToSensorPush({
    path: "/api/v1/samples",
    accessToken: opts.accessToken,
    params: {
      limit: opts.limit,
      startTime: startTime
    }
  }, cb);
};

// Promise based functions
// ---------------------------------------------------------------------

exports.promise.oauth.authorize = opts => {
  return new Promise((resolve, reject) => {
    return postToSensorPush({
      path: "/api/v1/oauth/authorize",
      params: {
        email: opts.email,
        password: opts.password
      }
    }, function callback (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

// ---------------------------------------------------------------------

exports.promise.oauth.accessToken = function (opts) {
  return new Promise((resolve, reject) => {
    return postToSensorPush({
      path: "/api/v1/oauth/accesstoken",
      params: {
        authorization: opts.authorization
      }
    }, function callback (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

// ---------------------------------------------------------------------

exports.promise.devices.gateways = function (opts) {
  return new Promise((resolve, reject) => {
    return postToSensorPush({
      path: "/api/v1/devices/gateways",
      accessToken: opts.accessToken
    }, function callback (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

// ---------------------------------------------------------------------

exports.promise.devices.sensors = function (opts) {
  return new Promise((resolve, reject) => {
    return postToSensorPush({
      path: "/api/v1/devices/sensors",
      accessToken: opts.accessToken
    }, function callback (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

// ---------------------------------------------------------------------

exports.promise.samples = function (opts) {
  let startTime = opts.startTime
  if (startTime && startTime instanceof Date) {
    startTime = startTime.toISOString()
  }
  if (!validateStartTime(startTime)) {
    throw new Error('Bad `startTime` value. Please provide a Date object or string formatted with Date::toISOString()');
  }
  return new Promise((resolve, reject) => {
    return postToSensorPush({
      path: "/api/v1/samples",
      accessToken: opts.accessToken,
      params: {
        limit: opts.limit,
        startTime: startTime
      }
    }, function callback (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}