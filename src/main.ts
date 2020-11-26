import {OutgoingHttpHeaders} from 'http'
import https from 'https'

interface PostOps {
  path: string
  accesstoken?: string
  params?: {
    email?: string
    password?: string
    authorization?: string
    limit?: number
    startTime?: string
  }
}

interface AuthorizeRes {
  authorization: string
}
interface AccesstokenRes {
  accesstoken: string
}
interface SensorsRes {
  [k: string]: {
    calibration: {
      humidity: number
      temperature: number
    }
    address: string
    name: string
    active: boolean
    deviceId: string
    id: string
    battery_voltage: number
    alerts: {
      temperature: {
        enabled: boolean
        max?: number
        min?: number
      }
      humidity: {
        enabled: boolean
        max?: number
        min?: number
      }
    }
  }
}

interface GatewaysRes {
  [k: string]: {
    name: string
    last_alert: string
    last_seen: string
    version: string
    message: null | string
    paired: boolean
  }
}
interface Sample {
  observed: string
  temperature: number
  humidity: number
}
interface SamplesRes {
  last_time: string
  sensors: {
    [k: string]: Sample[]
  }
  truncated: boolean
  status: string
  total_samples: number
  total_sensors: number
}
// ---------------------------------------------------------------------

function postToSensorPush(opts: PostOps): Promise<any> {
  const params = opts.params || {}
  const path = opts.path
  const postData = JSON.stringify(params)

  const headers: OutgoingHttpHeaders = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': postData.length,
  }
  if (opts.accesstoken) {
    headers.Authorization = opts.accesstoken
  }
  const options: https.RequestOptions = {
    hostname: 'api.sensorpush.com',
    port: 443,
    path: path,
    method: 'POST',
    headers: headers,
  }
  let body: Buffer = Buffer.alloc(0)
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.on('data', (d) => (body = Buffer.concat([body, d])))
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Got status code ${res.statusCode}`))
        }
        try {
          resolve(JSON.parse(body.toString('utf-8')))
        } catch (e) {
          reject(e)
        }
      })
    })
    req.on('error', (err) => reject(err))
    req.write(postData)
    req.end()
  })
}

// ---------------------------------------------------------------------

function authorize(email: string, password: string): Promise<AuthorizeRes> {
  return postToSensorPush({
    path: '/api/v1/oauth/authorize',
    params: {
      email: email,
      password: password,
    },
  })
}

// ---------------------------------------------------------------------

function accesstoken(authorization: string): Promise<AccesstokenRes> {
  return postToSensorPush({
    path: '/api/v1/oauth/accesstoken',
    params: {
      authorization: authorization,
    },
  })
}

// ---------------------------------------------------------------------

function gateways(accesstoken: string): Promise<GatewaysRes> {
  return postToSensorPush({
    path: '/api/v1/devices/gateways',
    accesstoken: accesstoken,
  })
}

// ---------------------------------------------------------------------

function sensors(accesstoken: string): Promise<SensorsRes> {
  return postToSensorPush({
    path: '/api/v1/devices/sensors',
    accesstoken: accesstoken,
  })
}

// ---------------------------------------------------------------------

function samples(accesstoken: string, startTime: Date, limit: number): Promise<SamplesRes> {
  return postToSensorPush({
    path: '/api/v1/samples',
    accesstoken: accesstoken,
    params: {
      limit: limit,
      startTime: startTime.toISOString(),
    },
  })
}

// ---------------------------------------------------------------------

const api = {
  oauth: {authorize, accesstoken},
  devices: {gateways, sensors},
  samples,
}
export {api}
