const execa = require('execa');
const fs = require('fs')
const path = require('path');

exports.startServices = () => {
  const dotenvPath = path.join('../api', '.env');
  const dotenvExists = fs.existsSync(dotenvPath);

  if (!dotenvExists) {
    console.log('We cannot find any credentials. Please run install first.')
    process.exit(1);
  }

  execa.shell(`node ./node_modules/concurrently/src/main.js --kill-others "npm start --prefix ../api" "npm start --prefix ../client"`).stdout.pipe(process.stdout);
};