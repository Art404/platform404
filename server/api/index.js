import express from 'express'
import Firebase from 'firebase'
import request from 'request'


const fire = new Firebase(process.env.firebase_url)
const router = new express.Router()

let snapshot = null

fire.on('value', (data) => {
  snapshot = data.val()
})

router.get('/getDB', (req, res) => {
  res.send(snapshot).end()
})

router.get('/getInsta', (req, res) => {
  let url = 'http://api.instagram.com/oembed?url='
  url += req.query.url
  url += '&omitscript=true'

  req.pipe(request(url)).pipe(res)
})

export default router
