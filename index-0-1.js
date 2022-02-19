const calendar = require('./calendar');

const Telegrambot = require('node-telegram-bot-api');
const token = "5180288492:AAFi6zDP1HmqFvdy6CJSgkvGp426PfAzKdo";

const bot = new Telegrambot(token, {polling: true});

 //_________________________________________________________
 // формирование списка дат
//  const sendEventsList = async (chatId, messageId, day) => {
//   try {
//     // Просто метод, который дергает метод по токену и дате
//     const eventsList = await api.getEventsTimesList(day);

//     if (eventsList && eventsList.length === 0) {
//       await bot.sendMessage(chatId, 'На эту дату нет тренировок');
//     } else {
//      // Формируем шаблон тренировок на выбранную дату
//       const keyboardList = eventsList.map((listItem) => ([{
//         text: `${listItem.time} Мест: ${listItem.free}`,
//         callback_data: JSON.stringify({
//           day,
//           data: listItem.time,
//           id: constants.EVENTS_LIST
//         })
//       }]));

//       // Отправляем сообщение пользователю
//       await bot.sendMessage(chatId, 'За каким временем следить?', {
//         "reply_markup": {
//           "inline_keyboard": keyboardList
//         },
//       })
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
// enf forming
//______________________________________________________
// bot.onText(/\/echo (.+)/, (msg, match) => {

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"
//   console.log('match=', match);
//   bot.sendMessage(chatId, resp);
// });
let date_base = {}; 
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
        try {
          
         // Тут мы получаем список слотов на текущую неделю (рассмотрим этот метод ниже)
          const days = helpers.getCurrentWeek();
      
          // Отправляем шаблонное "красивое" сообщение
          await bot.sendMessage(chatId, 'На какое число посмотреть расписание?', {
            "reply_markup": {
              "inline_keyboard": days
            },
          })
      
          // Удаляем /start чтоб не было мусора
          await bot.deleteMessage(chatId, msg.message_id);
        } catch (e) {
          console.log(e);
        }
        // return bot.sendMessage(chatId, 'Обирай стіл за номером', tableOptions);
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
       bot.sendMessage(chatId, 'OK!!!Done!');
       return
    }
    if (data === '/select') {
      return selectTable(chatId)
    }
    await bot.sendMessage(chatId, `Ти обрав столік за номером ${data}`, orderExit); 
 })
}

//_____________________________________

const eventsList = Object.entries(date_base);

console.log(eventsList);

const keyboardList = eventsList.map((listItem) => ([{
text: `${listItem[0]} Вільних столів: ${listItem[1]}`,
callback_data: JSON.stringify({
data: listItem[0],
id: chatId
})
}]));

// Отправляем сообщение пользователю
await bot.sendMessage(chatId, 'Оберіть зручну дату', {
  "reply_markup": {
    "inline_keyboard": keyboardList
  },
})
//_____________________________________

start() 
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));