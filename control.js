function validation(chatId, checking, elem) {
  let valid;
  switch (checking) {
    case 'CHECK_DATE':
      console.log('CHECK_DATE');
      valid = true;
      break;
    case 'CHECK_NUMBER':
      console.log('CHECK_NUMBER')
      valid = true;
      break;
      default:
        console.log('CHECK_ERR');
  }
  return valid;
}
module.exports = {
  validation: validation
};
