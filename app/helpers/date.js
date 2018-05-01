const moment = require('moment');

exports.convertFacebookDate = (dateStr) => {
  const isRelative = false;

  if (dateStr.includes("ago")) {
    isRelative = true
  }

  if (isRelative) {
    // handle relative time
  }

  
};