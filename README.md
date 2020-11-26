# sensorpush

This is a JavaScript/TypeScript npm module for the SensorPush API. It is lightweight; this module requires ZERO external modules, especially no big `request` or `node-fetch` module.

It is unofficial and I'm happy to hand ownership over to the [sensorpush.com](http://www.sensorpush.com) team, or another engineer they approve of.

![SensorPush](https://github.com/malgorithms/sensorpush/raw/master/media/logo.png)

### Installation

```
npm install sensorpush
# or
yarn add sensorpush
```

### A quick example

It's very easy to get all your sensorpush data in a NodeJs program.

```javascript
const sensorpush = require('sensorpush').api
const email = 'you@foo.com'
const password = 'BO000yAH!'

async function main() {
  try {
    // autorize ourselves
    const {authorization} = await sensorpush.oauth.authorize(email, password)
    const {accesstoken} = await sensorpush.oauth.accesstoken(authorization)

    // get and print some data
    const sensors = await sensorpush.devices.sensors(accesstoken)
    const gateways = await sensorpush.devices.gateways(accesstoken)
    const samples = await sensorpush.samples(accesstoken, new Date(Date.now() - 3600000), 5)
    console.log({sensors, gateways, samples})
  } catch (err) {
    console.error(err)
  }
}

main()
```
