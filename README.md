# sensorpush

Own a SensorPush temp/humidity sensor? 

This is a JavaScript/TypeScript npm module for the SensorPush API, so you can pull and look at your data from any Node program. For example, you could grab your data and send to external stats services, store in a datbase, trigger your own alerts...whatever.

It is lightweight; this module requires zero external modules, not even `node-fetch` or `request`.

It is unofficial and I'm happy to hand ownership over to the [sensorpush.com](http://www.sensorpush.com) team, or another engineer they approve of.

![SensorPush](https://github.com/malgorithms/sensorpush/raw/master/media/logo.png)

### Installation

```
npm install sensorpush
# or
yarn add sensorpush
```

### A quick example

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

Enjoy!
