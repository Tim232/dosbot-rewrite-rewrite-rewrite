import {Router} from "express";
import passport from "passport";
import jwt from 'jsonwebtoken'

const router = Router()
const config = require('../../../../config.json')

router.get('/login', (req, res, next) => {
    if (!req.query.callback) return res.send('callback url not provided')
    passport.authenticate('discord', {
        state: <string>req.query.callback
    })(req, res, next)
})

router.get('/callback', passport.authenticate('discord'), (req, res) => {
    const token = jwt.sign(req.user!, config.jwt)
    return res.redirect(`${req.query.state}/?token=${token}`)
})

export default router
