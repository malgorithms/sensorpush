"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const https_1 = __importDefault(require("https"));
// ---------------------------------------------------------------------
function postToSensorPush(opts) {
    const params = opts.params || {};
    const path = opts.path;
    const postData = JSON.stringify(params);
    const headers = {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
    };
    if (opts.accesstoken) {
        headers.Authorization = opts.accesstoken;
    }
    const options = {
        hostname: 'api.sensorpush.com',
        port: 443,
        path: path,
        method: 'POST',
        headers: headers,
    };
    let body = Buffer.alloc(0);
    return new Promise((resolve, reject) => {
        const req = https_1.default.request(options, (res) => {
            res.on('data', (d) => (body = Buffer.concat([body, d])));
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Got status code ${res.statusCode}`));
                }
                try {
                    resolve(JSON.parse(body.toString('utf-8')));
                }
                catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', (err) => reject(err));
        req.write(postData);
        req.end();
    });
}
// ---------------------------------------------------------------------
function authorize(email, password) {
    return postToSensorPush({
        path: '/api/v1/oauth/authorize',
        params: {
            email: email,
            password: password,
        },
    });
}
// ---------------------------------------------------------------------
function accesstoken(authorization) {
    return postToSensorPush({
        path: '/api/v1/oauth/accesstoken',
        params: {
            authorization: authorization,
        },
    });
}
// ---------------------------------------------------------------------
function gateways(accesstoken) {
    return postToSensorPush({
        path: '/api/v1/devices/gateways',
        accesstoken: accesstoken,
    });
}
// ---------------------------------------------------------------------
function sensors(accesstoken) {
    return postToSensorPush({
        path: '/api/v1/devices/sensors',
        accesstoken: accesstoken,
    });
}
// ---------------------------------------------------------------------
function samples(accesstoken, startTime, limit) {
    return postToSensorPush({
        path: '/api/v1/samples',
        accesstoken: accesstoken,
        params: {
            limit: limit,
            startTime: startTime.toISOString(),
        },
    });
}
// ---------------------------------------------------------------------
const api = {
    oauth: { authorize, accesstoken },
    devices: { gateways, sensors },
    samples,
};
exports.api = api;
