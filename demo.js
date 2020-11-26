//
// To try this demo, just change the email and password below
// to match your sensorpush credentials
//
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
