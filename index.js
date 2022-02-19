const calendar = require('./calendar');
const base = require('./base');

const {tableOptions, orderExit} = require('./options')

const Telegrambot = require('node-telegram-bot-api');

// Great this solved my issue thanks.
// Just created a new bot and new token.
// I have nodered with telegram bot on 1 linux server and another on windows docker. Shame we can't use the same bot though.
// const TelegramBot = require('node-telegram-bot-api');
// const Promise = require('bluebird');
//   Promise.config({
//     cancellation: true
//   });

const token = "5180288492:AAFi6zDP1HmqFvdy6CJSgkvGp426PfAzKdo";

const bot = new Telegrambot(token, {polling: {
  interval: 300,
  autoStart: true,
  params: {
    timeout: 10
  }
}});

let chats = [];

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Почати спілкування'},
    {command: '/info', description: 'Інформація про користувача'}
  ]);
  
  bot.on('message', async msg => {
    const text = msg.text;
    console.log('text=',msg);
    const chatId = msg.chat.id;
    try {
      if (text==='/start') {
        chats = [];
        await bot.sendSticker(chatId, 'https://tgram.ru/wiki/stickers/img/ruffy_vk/gif/4.gif');
        await bot.sendMessage(chatId, `Привіт, ${msg.chat.first_name}`);
        await bot.sendMessage(chatId, 'Замовлення на будь-який з наступних 27 днів:');
        const days = calendar.getCurrentDays(chatId, 10); 

        await bot.sendMessage(chatId, '(Дата - кількість вільних столів). Обери дату', {
          "reply_markup": {
            "inline_keyboard": days
          },
        })
        // Удаляем /start чтоб не было мусора
        return bot.deleteMessage(chatId, msg.message_id);
      };
      if (text==='/info') {
        return bot.sendMessage(chatId, `Тебе звати ${msg.from.first_name} ${msg.from.last_name}`);
      };
      
      return bot.sendMessage(chatId, `Перепрошую, я не зрозумів тебе. Спробуй ще раз`);
  } catch(err) {
    return bot.sendMessage(chatId, 'Щось пішло не так!)');
  }
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/done') {
       bot.sendMessage(chatId, 'Дякуємо! Чекаємо на вас!');
       return
    }

    chats = [...chats, data];
    console.log('chats=', chats.length);
    if (chats.length === 1) {
      await bot.sendMessage(chatId, `${JSON.parse(chats[0]).data}`);
      // тут проверка, записан ли он уже на єту дату
      await bot.sendMessage(chatId, `Скілька столів зарезервувати?`, tableOptions);
      // Удаляем, чтоб не было мусора
      // await bot.deleteMessage(chatId, msg.message_id);
      // тут проверка на количество, чтоб біло не больше свободніх столов
    }
    else if (chats.length === 2){
      await bot.sendMessage(chatId, `Замовлення на ${JSON.parse(chats[0]).data} Кількість столів - ${data} `, orderExit);

      base.updateDataBase(chats);
    }
     return
 })
}

start() 
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
// process.on('uncaughtException', function (error) {
// 	console.log("\x1b[31m", "Exception: ", error, "\x1b[0m");
// });

// process.on('unhandledRejection', function (error, p) {
// 	console.log("\x1b[31m","Error: ", error.message, "\x1b[0m");
// });