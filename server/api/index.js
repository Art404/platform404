import express from 'express'
import Firebase from 'firebase'
import MobileDetect from 'mobile-detect'
import request from 'request'

const fire = new Firebase('https://platform404.firebaseio.com')
const router = new express.Router()

let snapshot = null

fire.on('value', (data) => {
  snapshot = data.val()
})

router.get('/getDB', (req, res) => {
  const md = new MobileDetect(global.ua)
  const agent = md.mobile() ? 'mobile' : 'desktop'
  res.send({agent, ... snapshot}).end()
})

router.get('/getInsta', (req, res) => {
  let url = 'http://api.instagram.com/oembed?url='
  url += req.query.url
  url += '&omitscript=true'

  req.pipe(request(url)).pipe(res)
})

export default router
