const moment = require('moment');
const chrono = require('chrono-node');

exports.convertFacebookDate = (dateStr) => {
  let isRelative = dateStr.includes("ago")
    || dateStr.includes('Yesterday')
    || dateStr.includes('hr')
    || dateStr.includes('mins');

  if (dateStr.includes('hrs')) {
    dateStr = dateStr.replace('hrs', 'hours ago');
  } else if (dateStr.includes('mins')) {
    dateStr = dateStr.replace('mins', 'mins ago');
  } else if (dateStr.includes('hr')) {
    dateStr = dateStr.replace('hr', 'hour ago')
  }

  if (isRelative) {
    dateStr = chrono.parseDate(dateStr);
  }

  date = moment(dateStr, ['D MMMM at hh:mm', 'D MMMM YYYY at hh:mm']);

  return date.valueOf();
};

exports.convertStandardDate = (string) => {
  // takes ISO date (including timezone) and converts to date object
  return moment(string).valueOf()
}

exports.prettyFormatRawDate = (date) => {
  // takes date object and converts to date object in local timezone
  return moment(date).format('MMMM Do YYYY, h:mm:ss a')
}

exports.isoDate = (date) => {
  // takes date object and converts into ISO string
  return moment(date).format()
}

exports.isoTwoHoursAgo = () => {
  // returns ISO string for two hours ago
  return moment().subtract(2, 'hours').format()
}

exports.isoNow = () => {
  // returns ISO string for current time
  return moment().format()
}

exports.isBefore = (dateInQuestion, comparitorDate) => {
  return moment(dateInQuestion).isBefore(comparitorDate)
}

exports.isAfter = (dateInQuestion, comparitorDate) => {
  return moment(dateInQuestion).isAfter(comparitorDate)
}

