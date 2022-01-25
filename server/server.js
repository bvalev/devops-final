const express = require('express')
const mockServerConfig = require('./mockServerConfig')


const app = express()
const port = 3002

mockServerConfig(app)

app.listen(port, () => {
  console.log(`Local server listening at http://localhost:${port}`)
})
