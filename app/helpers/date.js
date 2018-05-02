const moment = require('moment');
const chrono = require('chrono-node');

exports.convertFacebookDate = (dateStr) => {
  let isRelative = dateStr.includes("ago") 
    || dateStr.includes('Yesterday') 
    || dateStr.includes('hrs') 
    || dateStr.includes('mins');

  if (dateStr.includes('hrs')) {
    dateStr = dateStr.replace('hrs', 'hours ago');
  } else if (dateStr.includes('mins')) {
    dateStr = dateStr.replace('mins', 'mins ago');
  }

  if (isRelative) {
    dateStr = chrono.parseDate(dateStr);    
  }

  date = moment(dateStr, 'D MMMM at hh:mm');

  return date.valueOf();
};