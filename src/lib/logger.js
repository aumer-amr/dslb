'use strict'

const winston = require('winston')

module.exports = (name) => {
	// Transporters
	const consoleTransport = new winston.transports.Console({
		name: 'console',
		level: process.env.loggerConsoleLevel || 'info',
		silent: !process.env.loggerConsoleEnabled,
		stderrLevels: ['warn', 'error'],
		format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.splat(),
			winston.format.colorize(),
			winston.format.printf(({ timestamp, level, message, meta }) => {
				return `${timestamp} - ${level} - ${message} ${meta ? '- ' + JSON.stringify(meta) : ''}`
			})
		)
	})

	// Winston settings
	winston.addColors({
		trace: 'green',
		debug: 'cyan',
		info: 'white',
		warn: 'yellow',
		error: 'red'
	})

	// Logger instance
	const mainLogger = winston.createLogger({
		transports: [consoleTransport],
		levels: {
			trace: 4,
			debug: 3,
			info: 2,
			warn: 1,
			error: 0
		}
	})

	// Actual logger class
	class Logger {
		constructor (name) {
			this.name = name
		}

		info () {
			const args = Array.from(arguments)
			mainLogger.info(`[${this.name}] ${args[0]}`, ...args.slice(1))
		}

		warn () {
			const args = Array.from(arguments)
			mainLogger.warn(`[${this.name}] ${args[0]}`, ...args.slice(1))
		}

		error () {
			const args = Array.from(arguments)
			mainLogger.error(`[${this.name}] ${args[0]}`, ...args.slice(1))
		}

		trace () {
			const args = Array.from(arguments)
			mainLogger.trace(`[${this.name}] ${args[0]}`, ...args.slice(1))
		}
	}

	return new Logger(name)
}
