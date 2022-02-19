// https://api.telegram.org/bot5180288492:AAFi6zDP1HmqFvdy6CJSgkvGp426PfAzKdo/getUpdates

function getCurrentDays(chatId, numberFree = 10) {
 const base = require('./base');
// let numberFree = 10; - загальна кількість орендуємих столів
//Здесь формируем базу свободніх мест на каждую дату
const numberOrder = 28;
const date = new Date();
// нумерация месяцев от 0
let now_year = date.getFullYear();
let now_month = date.getMonth();
let now_date = date.getDate();

const busy_table = base.updateDataBase();

 let date_base = {};

// const busy_table = {
//   '2022.02.16': [{client: '12345', table: [1,2]}, {client: '123', table: [3]}],
//   '2022.02.28': [{client: '12345', table: [1]}]
// };

let free_table = {};

//____________________________________________________

const calculateFreeTable = (numberTable = 10) => {
  for (let key in busy_table) {
    let s=numberTable;
  if (Array.isArray(busy_table[key])) { //1
    const obj = busy_table[key].reduce((acc, item_order) => {
      s > item_order.table.length ? s-=item_order.table.length : s=0 ; 			 
      return acc = {[key] : s};
   },{})

    free_table = {...free_table, ...obj};
  } //1
  
  }
}

//____________________________________________________

calculateFreeTable(numberFree);
for (let j=1; j<numberOrder; j++) {
  let date = new Date(now_year, now_month, now_date+j);
  let day = date.getDate();
  let j_str = day<10 ? '0'+ day +'' : day+'';
  let month = date.getMonth() + 1;
  let month_str = month<10 ? '0'+ month : month;
  let key = now_year+'.'+ month_str +'.'+j_str;
  if (free_table[key]) {
    date_base = {...date_base, [key]: free_table[key] };
  } else date_base = {...date_base, [key]: numberFree };
}

const eventsList = Object.entries(date_base);

const days_i = eventsList.map((listItem) => (
  [{
text: `${listItem[0].slice(8,10)+'/'+listItem[0].slice(5,7)} - ${listItem[1]}`,
callback_data: JSON.stringify({
data: listItem[0], id: `${chatId}`})
}]
));

const days = [];

for(let i=0;i<9;i++) {
  const stroka_days = [];
  stroka_days.push(days_i[i*3+0]);
  stroka_days.push(days_i[i*3+1]);
  stroka_days.push(days_i[i*3+2]);
  
  days.push(stroka_days.flat());
}
return days;
}

module.exports = {
  getCurrentDays: getCurrentDays,
};
