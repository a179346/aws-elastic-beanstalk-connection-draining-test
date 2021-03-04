/* eslint-disable no-console */
const moment = require('moment');

// plog
console.olog = console.log;
console.plog = (type, ...params) => {
  console.olog(moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss') + ' | [' + type + ']', ...params);
};
console.log = () => {};
