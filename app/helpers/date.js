const moment = require('moment');
const chrono = require('chrono-node');

exports.convertFacebookDate = (dateStr) => {
  const isRelative = false;

  if (dateStr.includes("ago")) {
    isRelative = true;
  }

  if (isRelative) {
    dateStr = chrono.parseDate(dateStr);    
  }

  date = moment(dateStr, 'D MMMM at hh:mm');

  return date.valueOf();
};