import Telegraf, { Markup } from "telegraf";
import axios from "axios";
const LocalSession = require("telegraf-session-local");

const { NODE_ENV } = process.env;

if (NODE_ENV !== "production") require("dotenv").config();

const { TELEGRAM_TOKEN, CLICKUP_CLIENT_ID, CLICKUP_CLIENT_PASS, SERVER_URL } = process.env;

if (!TELEGRAM_TOKEN) {
  throw new Error("Telegram token is not defined.");
}

const bot = new Telegraf(TELEGRAM_TOKEN);
const localSession = new LocalSession();

axios.defaults.baseURL = "https://app.clickup.com/api/v2";
axios.defaults.headers.post["Content-Type"] = "application/json";

bot.use(localSession.middleware());

bot.start(async (ctx) => {
  ctx.replyWithMarkdown(
    `*Welcome to The Unofficial Clickup Bot for Telegram* - Stay tuned!\n\n_Contributions are welcome: https://github.com/HosseinYousefi/clkupbot/_\n`,
    {
      "disable_web_page_preview": true
    }
  );
  const { message } = ctx;
  try {
    const code = message.text.split(" ")[1];
    const res = await axios.post("/oauth/token/", null,
      {
        params: {
          client_id: CLICKUP_CLIENT_ID,
          client_secret: CLICKUP_CLIENT_PASS,
          code: code
        }
      },
    );
    ctx["session"].token = res.data['access_token'];
    ctx.replyWithMarkdown(`*You logged in successfully!*`);
  } catch (error) {
    console.log(error);
    ctx.reply(
      `Please authenticate using your clickup account:\nhttps://app.clickup.com/api?client_id=G515ZQMHFKME64O5LICE0Q6B1TFRRHU3&redirect_uri=${SERVER_URL}%2Fstart`,
      {
        "disable_web_page_preview": true
      }
    )
  }
});

bot.launch()