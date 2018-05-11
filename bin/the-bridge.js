#!/usr/bin/env node

const figlet = require('figlet');
const meow = require('meow');

const install = require('./lib/install');
const start = require('./lib/start');

console.log(figlet.textSync('The Bridge', { 
  horizontalLayout: 'full' }));

const cli = meow(`
  Usage
    $ the-bridge <input>

  Commands
    start       Start the API and Client
    install     Set up NPM modules

  Options
    --help      Get help
`, {});

if (cli.input.length === 0) {
  cli.showHelp();
} else {
  const command = cli
    .input[0]
    .trim();

  if (command === 'install') {
    install.installServices();
  }

  if (command === 'start') {
    start.startServices();
  }
}