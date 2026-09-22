const log4js = require("log4js");
const fs = require("fs");

// 日志目录：云函数等只读环境下用 LOG_DIR 指到 /tmp，本地保持 .logs/
const LOG_DIR = process.env.LOG_DIR || ".logs/";

log4js.configure({
  appenders: {
    vcr: {
      type: "recording",
    },
    out: {
      type: "console",
      layout: {
        type: "pattern",
        pattern: "[%d] [%p] %X{user}: %m",
      },
    },
    file: {
      type: "multiFile",
      base: LOG_DIR,
      property: "categoryName",
      extension: ".log",
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
      layout: {
        type: "pattern",
        pattern: "[账号：%X{user}] %m",
      },
    },
  },
  categories: {
    default: { appenders: ["out", "file"], level: "info" },
    push: { appenders: ["out", "vcr"], level: "info" },
  },
});

const cleanLogs = () => {
  if (!fs.existsSync(LOG_DIR)) {
    return;
  }
  const logs = fs.readdirSync(LOG_DIR);
  logs.forEach(log => {
    if(log.endsWith(".log")) {
      fs.unlinkSync(`${LOG_DIR}${log}`);
    }
  })
};

const catLogs = () => {
  if (!fs.existsSync(LOG_DIR)) {
    return "";
  }
  const logs = fs.readdirSync(LOG_DIR);
  const content = logs
    .map((file) => fs.readFileSync(`${LOG_DIR}${file}`, { encoding: "utf-8" }))
    .join("\r");
  return content;
};

module.exports = { log4js, cleanLogs, catLogs };
