const keyboardTable = Array(10);
for (let i=0;i<10;i++) {
  [{text: `Кілкість: ${i+1}.toString()`, callback_data: `${i+1}.toString()`}].push(keyboardTable);
}

const keyboardList = [];

for(let i=0;i<2;i++) {
  const stroka_table = [];
  stroka_table.push(keyboardTable[i*4+0]);
  stroka_table.push(keyboardTable[i*4+1]);
  stroka_table.push(keyboardTable[i*4+2]);
  stroka_table.push(keyboardTable[i*4+3]);
  keyboardList.push(stroka_table.flat());
}
keyboardList.push(keyboardTable[8]);
keyboardList.push(keyboardTable[9]);
return keyboardList;