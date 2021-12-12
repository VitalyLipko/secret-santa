import { webhookCallback } from 'grammy';
import express from 'express';
import { bot } from './loaders/bot.js';

const app = express();
app.use(express.json());
app.use(`/${process.env.TG_TOKEN}`, webhookCallback(bot, 'express'));
app.listen(process.env.PORT, async () => {
  const host = `https://${process.env.DOMAIN}`;
  console.log(`Server started on ${host}:${process.env.PORT}`);
  await bot.api.setWebhook(`${host}/${process.env.TG_TOKEN}`);
});
