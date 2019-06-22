let bot = {
	enableSendPermission: (role, channel, reason) => {
		return channel.overwritePermissions(role, { SEND_MESSAGES: true }, reason)
	},
	disableSendPermission: (role, channel, reason) => {
		return channel.overwritePermissions(role, { SEND_MESSAGES: false }, reason)
	}
}

module.exports = bot
