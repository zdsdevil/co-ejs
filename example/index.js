var path = require('path');

var koa = require('koa');
var wait = require('co-wait');
var render = require('..');

var app = koa();

var locals = {
  version: '1.0.0',
  now: function () {
    return new Date();
  },
  ip: function *() {
    yield wait(1000);
    return this.ip;
  },
  callback: function() {
    return function (cb) {
      cb(null, '<p>callback</p>');
    }
  },
  callbackGen: function() {
    return function* () {
      yield wait(3000);
      return '<p>callbackGen</p>';
    };
  },
  doNothing: function() {
    console.log('this will not print');
  }
};

var filters = {
  format: function (time) {
    return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
  }
};

app.use(render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: true,
  debug: true,
  locals: locals,
  filters: filters
}));

app.use(function *() {
  console.time('time');
  yield this.render('content', {
    users: [{name: 'John'}, {name: 'Jack'}, {name: 'Tom'}]
  });
  console.timeEnd('time');
});

app.listen(3000, function () {
  console.log('listening on 3000.');
});