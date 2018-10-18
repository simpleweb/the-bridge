const async = require('async');
const envfile = require('envfile');
const execa = require('execa');
const fs = require('fs');
const path = require('path');

const credentials = require('./credentials');
const dotenvPath = path.join('../api', '.env');

const installPackages = async () => {
  async.parallel([
    function() {
      execa.shell('npm install --prefix ../api').stdout.pipe(process.stdout);
    },
    function() {
      execa.shell('npm install --prefix ../client').stdout.pipe(process.stdout);
    },
  ], function(err, results) {
    if (err) {
      console.log('There was an error in installing NPM packages');
      console.log(err);
      process.exit(1);
    }
    console.log('Finished');
  });
};

const answersToFile = async (answers) => {
  fs.writeFile(dotenvPath,
    'EMAIL='+ answers.email +
    '\nPASS=' + answers.password);
};

const getCredentials = async () => {
  return await credentials.getFacebookCredentials();
};

const shouldOverwrite = async () => {
  return await credentials.overwriteCredentials();
};

const setupUser = async () => {
  getCredentials().then(answers => {
    answersToFile(answers);
  }).then(() => {
    installPackages();
  });
};

exports.installServices = () => {
  const dotenvExists = fs.existsSync(dotenvPath);

  if (dotenvExists) {
    console.log('A dotenv file already exists.');

    shouldOverwrite().then(answer => {
      answer.overwrite ? setupUser() : installPackages();
    });
  } else {
    setupUser();
  }
};