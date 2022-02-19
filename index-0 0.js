// const TelegramApi = require('node-telegram-bot-api');
const token = "5180288492:AAFi6zDP1HmqFvdy6CJSgkvGp426PfAzKdo";

// const bot = new TelegramApi(token, {polling: true});
// const process = require('process');
const Telegrambot = require('node-telegram-bot-api');

// const TOKEN = config.get('token');
// console.log('TOKEN=',TOKEN);
// require('dotenv').config();
// const bot = new Telegrambot(process.env.TOKEN, {polling: true});
 const bot = new Telegrambot(token, {polling: true});

const chats = {};

const tableOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}],
        ]
    })
};

 const orderExit = {
   reply_markup: JSON.stringify({
       inline_keyboard: [
           [{text: 'Обрати ще столік', callback_data: '/select'},{text: 'Оформити бронь', callback_data: '/done'}]
       ]
   })
 };

const selectTable = async (chatId) => {
  await bot.sendMessage(chatId, 'Обирай стіл за номером', tableOptions);
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Почати спілкування'},
    {command: '/info', description: 'Інформація про користувача'},
    {command: '/list', description: 'Переглянути вакантні столи'}
  ]);
  
  bot.on('message', async msg => {
    const text = msg.text;
    console.log('text=',text);
    const chatId = msg.chat.id;
    console.log(chatId);
    try {
      if (text==='/start') {
        await bot.sendSticker(chatId, 'https://tgram.ru/wiki/stickers/img/ruffy_vk/gif/4.gif');
        return bot.sendMessage(chatId, `Привет, ${msg.chat.first_name}`);
      };
      if (text==='/info') {
        return bot.sendMessage(chatId, `Тебе звати ${msg.from.first_name} ${msg.from.last_name}`);
      };
      if (text==='/list') {
        return bot.sendMessage(chatId, 'Обирай стіл за номером', tableOptions);
      };
      return bot.sendMessage(chatId, `Перепрошую, я не зрозумів тебе. Спробуй ще раз`);
  } catch(err) {
    return bot.sendMessage(chatId, 'Произошла какая то ошибка!)');
  }
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/done') {
       bot.sendMessage(chatId, 'OK!!!Done!');
       return
    }
    if (data === '/select') {
      return selectTable(chatId)
    }
    await bot.sendMessage(chatId, `Ти обрав столік за номером ${data}`, orderExit); 
 })
}

start() 
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));