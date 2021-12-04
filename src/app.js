import { Bot, webhookCallback } from "grammy";
import { config } from "dotenv";
import express from "express";

config();

const bot = new Bot(process.env.TG_TOKEN);
bot.command("start", async (ctx) => await ctx.reply("Вася Пупкин"));
bot.command("remind", async (ctx) => {
  await ctx
    .reply("Ты Секретный Санта для: Вася Пупкин")
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});

const app = express();
app.use(express.json());
app.use(`/${process.env.TG_TOKEN}`, webhookCallback(bot, "express"));
app.listen(
    process.env.PORT,
  async () =>
    await bot.api.setWebhook(`https://${process.env.DOMAIN}/${process.env.TG_TOKEN}`)
);
