// https://github.com/kelektiv/node-cron
const CronJob = require('cron').CronJob;
const to = require('await-to-js').default;
const moment = require('moment');

const TimeZoneVN = 'Asia/Ho_Chi_Minh';
const TAG = '[cronjob/cron.js]';

module.exports = {
  async start() {
    // abc
    try {
      // job('0 0 23 * * *', callback);
      
    } catch (e) {
      console.log(TAG + ' error:', e);
    }
  },

  test() {
    // test
  }
}; // module.exports

function job(time, cb) {
  return new CronJob(time, () => cb(), null, true, TimeZoneVN);
}
