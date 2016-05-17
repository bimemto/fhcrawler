var Nightmare = require('nightmare');
var Screenshot = require('nightmare-screenshot');
var nightmare = new Nightmare();
nightmare.goto('http://ketqua.net/');
nightmare.use(Screenshot.screenshotSelector('kqsx.png', 'table[id="result_tab_mb"]'));
nightmare.run();