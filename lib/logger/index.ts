import winston from "winston";
const { combine, timestamp, json, colorize } = winston.format;

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json(), colorize()),
  defaultMeta: {},
  transports: [new winston.transports.File({ filename: "app.log" })],
});

export const createLogger = (namespace?: string) => {
  if (namespace) {
    return logger.child({ service: namespace });
  }
  return logger;
};

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}
