var moment = require('moment');
var log = require('./log.js');
var util = require('./util.js');
var push = require( 'pushover-notifications' );
var config = util.getConfig().mail;
var server;

module.exports.init = function(callback) {
  var setupMail = function(err, result) {
    server = new push( {
      user: config.user,
      token: config.token
    });

    if(config.sendMailOnStart) {
      server.send({
        title: "Gekko has started",
        message: [
          "I've just started watching the markets, ",
          "I'll let you know when I got some advice"
        ].join('')
      }, send);
    }

    log.debug('Setup email adviser.');
    callback();
  };

  setupMail(false, false);
};

var send = function(err) {
  if(err)
    log.warn('ERROR SENDING MAIL', err);
  else
    log.info('Send advice via email.');
}

module.exports.send = function(what, price, meta) {
  // if(what !== 'BUY' && what !== 'SELL')
  //   return;

  var text = [
    'Gekko is watching the bitcoin market and has detected a new trend, advice is to ' + what,
    'The current BTC price is ' + price,
    '',
    'Additional information:\n',
    meta
  ].join('\n');

  server.send({
    message: text,
    title: "New Gekko advice: " + what
  }, send);
};
