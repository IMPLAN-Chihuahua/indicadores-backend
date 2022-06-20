const { level, format, transports, createLogger } = require('winston');
const { printf, combine, timestamp, colorize, errors } = format;
const env = process.env.NODE_ENV || 'development';

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});


const getLevel = () => {
  return env === 'production' ? 'info' : 'debug';
}

const logger = createLogger({
  level: getLevel(),
  format: combine(
    timestamp(),
    colorize(),
    logFormat,
    errors({ stack: true })
  ),
  transports: [new transports.Console()],
  exitOnError: false
});

module.exports = logger;