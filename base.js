function updateDataBase(chats = null){
  
  let busy_table = {
    '2022.02.16': [{client: '12345', table: [1,2]}, {client: '123', table: [3]}],
    '2022.02.28': [{client: '12345', table: [1]}]
  };
if (chats) {
  let date = chats[0].data;
  const client = chats[0].id;
  const numberTable = chats[1];
  // date = '2022.02.16';
  let table = Array(numberTable).fill(1);
  busy_table[date] = [...busy_table[date]||'', {client:client, table: table}];
}
return busy_table;
}
module.exports = {
  updateDataBase: updateDataBase
};
