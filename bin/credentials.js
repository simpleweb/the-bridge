const inquirer = require('inquirer');

module.exports = {
  getFacebookCredentials: () => {
    const questions = [
      {
        name: 'email',
        type: 'input',
        message: 'Enter your email address:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter a valid email address.'
          }
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your password.';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },

  overwriteCredentials: () => {
    const question = [
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Would you like to overwrite the credentials?',
        default: false
      }
    ];
    return inquirer.prompt(question);
  }
}