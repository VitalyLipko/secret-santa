import { config } from 'dotenv';
import { Bot, InlineKeyboard } from 'grammy';
import mongooseLoader, { userModel } from './mongoose.js';

config();

await mongooseLoader();

export const bot = new Bot(process.env.TG_TOKEN);

const users = await userModel.find();
const userListInlineKeyBoard = new InlineKeyboard();
users.forEach(({displayName}) => {
  userListInlineKeyBoard.text(displayName, displayName).row();
});

bot.on('callback_query:data', async (ctx) => {
  const { data: currentUser, from } = ctx.callbackQuery;
  const users = await userModel.find();
  await ctx.answerCallbackQuery('Эльфы сделали свою работу...');
  const selectedUser = users.find((item) => item.from === from.id);
  if (selectedUser) {
    await ctx.reply(
      `Вы уже стали Тайным Сантой 🎅 для: ${selectedUser.displayName}`,
    );
    return;
  }

  const selectableList = users.filter(
    (item) => !item.from && item.displayName !== currentUser,
  );
  if (!selectableList.length) {
    await ctx.reply('Упс, закончились свободные пользователи');
    return;
  }

  const length = selectableList.length;
  const res = selectableList[Math.floor(Math.random() * (length - 1))];
  const user = await userModel.findOne({ displayName: res.displayName });
  user.from = from.id;

  await user.save();
  await ctx.reply(`Вы Тайный Санта 🎅 для: ${res.displayName}`);
});

bot.command(['start', 'remind'], async (ctx) => {
  const command = ctx.update.message.text.split('/')[1];
  const user = await userModel.findOne({ from: ctx.update.message.from.id });

  if (user && command !== 'remind') {
    await ctx.reply(`Вы уже стали Тайным Сантой 🎅 для: ${user.displayName}`);
    return;
  }

  if (command === 'start') {
    await ctx.reply('Представьтесь:', {
      reply_markup: userListInlineKeyBoard,
    });
    return;
  }

  await ctx.reply(
    user
      ? `Вы Тайный Санта 🎅 для: ${user.displayName}`
      : 'Пользователь ещё не назначен: выполните команду /start',
  );
});
