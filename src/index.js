require('dotenv')()

const Discord = require('discord.js')
const dClient = new Discord.Client()

dClient.on('ready', () => {
	console.log('Discord bot connected')
})

dClient.on('message', message => {
	if (message.content === 'ping') {
		message.reply('pong')
	}
})
