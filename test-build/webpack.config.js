const path = require('path');

module.exports = {
  context: __dirname,
  entry: './entry.js',
  output: {
    path: path.join(__dirname, '../test'),
    filename: 'bundle.js'
  }
}