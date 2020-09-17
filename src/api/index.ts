import express from 'express'
import {ApolloServer, AuthenticationError} from "apollo-server-express";
import schema from './schema'
import passport from 'passport'
import {Strategy} from "passport-discord";
import jwt from 'jsonwebtoken'
import depthLimit from 'graphql-depth-limit'

const config = require('../../config.json')

const app = express()

passport.serializeUser((user: any, done) => {
    done(null, jwt.sign(user, config.jwt))
})

passport.deserializeUser((id: string, done) => {
    try {
        const decoded = jwt.decode(id, config.jwt)
        done(null, decoded)
    } catch (e) {
        done(e, null)
    }
})

passport.use(new Strategy({
    clientID: config.oauth2.clientID,
    clientSecret: config.oauth2.clientSecret,
    callbackURL: config.oauth2.callback,
    scope: ['guilds', 'identify']
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile)
}))

app.use(passport.initialize())

app.use('/', require('./routes').default)

export const server = new ApolloServer({
    schema,
    validationRules: [depthLimit(7)],
    context: async ({req}) => {
        if (!req.headers.authorization)
            throw new AuthenticationError('Missing token')
        const token = req.headers.authorization.substr(7)
        try {
            return {user: jwt.decode(token, config.jwt)}
        } catch (e) {
            throw new AuthenticationError('Invalid token')
        }
    }
})

server.applyMiddleware({ app, path: '/graphql' });

export default app

