/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const express = require('express')
const formData = require('express-form-data')

const ROOT_PREFIX = '/api'
const MOCK_DATA_DIR = path.resolve('./mockData')

module.exports = app => {
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json({ limit: '500mb', strict: false }))
  app.use(formData.parse())

  app.use(function (_req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  app.use(ROOT_PREFIX, handleApiRequestDefault)
}

function handleApiRequestDefault(req, res) {
  try {
    const url = req.url
    console.log(`Request: ${req.method} ${url}, Body: ${JSON.stringify(req.body, null, 2)}`)
    const fileName = url
      .replace(/(^\/|\/$)/g, '') // remove trailing and beginning '\'
      .replace(/\?.*/, '') // remove query params
      .replace(/\//g, '-')
    console.log(`Resolved file basename: ${fileName}`)
    const fileFound = fs
      .readdirSync(MOCK_DATA_DIR)
      .find(file => file.startsWith(fileName) && path.parse(file).name === fileName)

    if (fileFound) {
      setTimeout(() => {
        const fileToSend = path.resolve(MOCK_DATA_DIR, fileFound)
        if (path.parse(fileFound).ext === '.json') {
          res.sendFile(fileToSend)
        } else {
          res.download(fileToSend)
        }
      }, 200)
    } else {
      console.warn(`Mocked service does not exist.`)
      res.status(404).end()
    }
  } catch (e) {
    res.status(500).send(e.stack)
  }
}
