const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();

if (process.argv.length <= 2) {
  console.log(`Usage: node ${path.basename(process.argv[1])} [password]`);
} else {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(process.argv[2], salt);
  
  console.log(hash);
}
