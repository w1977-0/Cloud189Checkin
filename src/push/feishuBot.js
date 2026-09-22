const crypto = require("crypto");

// 飞书自定义机器人 webhook，形如：
// https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
const webhook = process.env.FEISHU_BOT_WEBHOOK || "";
// 可选：机器人安全设置里的「签名校验」密钥，没开就不用填
const secret = process.env.FEISHU_BOT_SECRET || "";

// 飞书签名校验：timestamp + "\n" + secret 做 HMAC-SHA256，再 base64
const sign = (timestamp) => {
  if (!secret) {
    return "";
  }
  const stringToSign = `${timestamp}\n${secret}`;
  return crypto
    .createHmac("sha256", secret)
    .update(stringToSign)
    .digest("base64");
};

module.exports = {
  webhook,
  secret,
  sign,
};
