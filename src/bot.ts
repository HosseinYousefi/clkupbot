import Telegraf, { Markup } from "telegraf";
import axios from "axios";
const LocalSession = require('telegraf-session-local')

const { NODE_ENV } = process.env;

if (NODE_ENV !== "production") require("dotenv").config();

const { TELEGRAM_TOKEN } = process.env;

if (!TELEGRAM_TOKEN) {
  throw new Error("Telegram token is not defined.");
}

const bot = new Telegraf(TELEGRAM_TOKEN);
const localSession = new LocalSession();

axios.defaults.baseURL = 'https://app.clickup.com/api/v2';

bot.use(localSession.middleware());

bot.start((ctx) => {
  const { message } = ctx;
  ctx['session'].code = message.text.substr(6);
  ctx.replyWithMarkdown(ctx['session']);
  return ctx.replyWithMarkdown(
    `*Welcome to The Unofficial Clickup Bot for Telegram*\n\n _Issues and suggestions: https://github.com/HosseinYousefi/clkupbot/issues_\n`,
    {
      'disable_web_page_preview': true
    }
  );
});

bot.launch()