#!/usr/bin/env node

const meow = require('meow');
const execa = require('execa');
const async = require('async');
const envfile = require('envfile');
const figlet = require('figlet');
const fs = require('fs')
const path = require('path');


const credentials = require('./credentials');

const getCredentials = async () => {
  return await credentials.getFacebookCredentials('test');
};

const shouldOverwrite = async () => {
  return await credentials.overwriteCredentials();
};

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

    }
    console.log('Finished');
  });
};

console.log(figlet.textSync('The Bridge', { horizontalLayout: 'full' }));

const cli = meow(`
  Usage
    $ the-bridge <input>

  Commands
    start       Start the API and Client
    install     Set up NPM modules

  Options
    --help      Get help
`, {});

const dotenvPath = path.join('../api', '.env');
const dotenvExists = fs.existsSync(dotenvPath);

if (cli.input.length === 0) {
  cli.showHelp();
} else {
  const command = cli
    .input[0]
    .trim();

  if (command === 'install') {
    if (dotenvExists) {
      console.log('A dotenv file already exists.');
      shouldOverwrite().then(answer => {
        if (answer.overwrite) {
          getCredentials().then(answers => {
            fs.writeFile(dotenvPath, 
              'EMAIL='+ answers.email + '\nPASS=' + answers.password);
          }).then(() => {
            installPackages();
          });   
        } else {
          installPackages();
        }
      });
    } else {
      getCredentials().then(answers => {
        fs.writeFile(dotenvPath, 
          'EMAIL='+ answers.email + '\nPASS=' + answers.password);
      }).then(() => {
        installPackages();
      });
    }
  }

  if (command === 'start') {
    if (!dotenvExists) {
      console.log('We cannot find any credentials. Please run install first.')
      process.exit(1);
    }

    execa.shell(`node ./node_modules/concurrently/src/main.js --kill-others "npm start --prefix ../api" "npm start --prefix ../client"`).stdout.pipe(process.stdout);
  }
}