'use strict'

// Read enviroment variables from .env if available
require('dotenv').config()

// Import libraries
const Discord = require('discord.js')
const logger = require('./lib/logger')('Bot')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const dHelper = require('./lib/discordHelper')

// Check if all enviroment variables are set
;['PORT', 'host', 'twitchStreamerId', 'twitchClientId', 'discordBotToken', 'discordShoutoutChannelId', 'discordRoleId'].forEach(variableName => {
	if (typeof process.env[variableName] === 'undefined' || process.env[variableName] === '') {
		logger.error('Variable %s is unset', variableName)
		process.exit(1)
	}
})

// Discord connection
const dClient = new Discord.Client()

dClient.on('ready', () => {
	logger.info('Discord bot connected')
})

// Handle ping/pong protocol
dClient.on('message', message => {
	if (message.content === 'ping') {
		message.reply('pong')
	}
})

// Setup express
const app = express()
app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', req.headers.origin)
	res.header('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token')
	res.header('Access-Control-Allow-Credentials', 'true')
	next()
})

// Handle twitch stream notifications
app.post('/notifyStreamStatus', (req, res) => {
	try {
		const data = req.body.data
		const channels = dClient.channels
		const channel = channels.get(process.env.discordShoutoutChannelId)

		if (data.length === 0) {
			dHelper.enableSendPermission(process.env.discordRoleId, channel, 'Streamer is not streaming').then(() => {
				logger.info('Shoutout channel unlocked')
			})
		} else {
			const type = req.body.data[0].type
			if (type === 'live') {
				dHelper.disableSendPermission(process.env.discordRoleId, channel, 'Streamer is streaming').then(() => {
					logger.info('Shoutout channel locked')
				})
			} else {
				throw new Error('Unknown type ' + type)
			}
		}
	} catch (e) {
		logger.error('Error while trying to process twitch stream event: %s', e.message)
		logger.error(req.body)
	}

	res.send('200 ok')
})

// Handle 500 errors
app.use((err, req, res, next) => {
	logger.error('500 error occured: %s', err)
	res.send('500 sorry 🤷‍♂️')
})

// Handle 404 errors
app.use((req, res) => {
	res.send('404 🕵️‍♂️ still looking')
})

app.get('/', (req, res) => {
	res.send('Bye 🙆‍♂️')
})

app.listen(app.get('port'), () => {
	logger.info('Started listening at %s', app.get('port'))

	// Connect to discord
	dClient.login(process.env.discordBotToken)

	// Subscribe to twitch stream events
	let url = 'https://api.twitch.tv/helix/webhooks/hub?'
	url = url + 'hub.mode=subscribe&'
	url = url + 'hub.topic=https://api.twitch.tv/helix/streams?user_id=' + process.env.twitchStreamerId + '&'
	url = url + 'hub.callback=' + process.env.host + 'notifyStreamStatus&'
	url = url + 'hub.lease_seconds=864000'

	request({
		headers: {
			'Client-ID': process.env.twitchClientId
		},
		uri: url,
		method: 'POST'
	}, (err, res, body) => {
		logger.trace('Subscribe request: %s - %s', res.statusCode, body)
		if (err) return logger.error('Error while subscribing to twitch stream events: %s', err)
		else logger.info('Subscribed succesfully to twitch stream events')
	})
})
