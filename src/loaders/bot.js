import { config } from 'dotenv';
import { Bot, InlineKeyboard } from 'grammy';

config();

export const bot = new Bot(process.env.TG_TOKEN);

const mockList = [
  {
    displayName: 'Дима',
  },
  {
    displayName: 'Алина',
  },
];
const userListInlineKeyBoard = new InlineKeyboard().add(
  ...mockList.map((item) => ({
    text: item.displayName,
    callback_data: item.displayName,
  })),
);

bot.on('callback_query:data', async (ctx) => {
  await ctx.answerCallbackQuery('Эльфы делают свою работу...');
  const { data: currentUser, from } = ctx.callbackQuery;

  const selectedUser = mockList.find((item) => item.from === from.id);
  if (selectedUser) {
    await ctx.reply(
      `Вы уже стали Тайным Сантой для: ${selectedUser.displayName}`,
    );
    return;
  }

  const selectableList = mockList.filter(
    (item) => !item.from && item.displayName !== currentUser,
  );
  if (!selectableList.length) {
    await ctx.reply('Упс, закончились свободные пользователи.');
    return;
  }

  const length = selectableList.length;
  const res = selectableList[Math.floor(Math.random() * (length - 1))];
  mockList.find((item) => item.displayName === res.displayName).from =  from.id;
  await ctx.reply(`Вы Тайный Санта для: ${res.displayName}`);
});

bot.command(['start', 'remind'], async (ctx) => {
  const command = ctx.update.message.text.split('/')[1];
  if (command === 'start') {
    await ctx.reply('Представьтесь:', {
      reply_markup: userListInlineKeyBoard,
    });
    return;
  }

  const user = mockList.find(
    (item) => item.from === ctx.update.message.from.id,
  );
  await ctx.reply(
    user
      ? `Вы Тайный Санта для: ${user.displayName}`
      : 'Пользователь ещё не назначен: выполните команду /start.',
  );
});
