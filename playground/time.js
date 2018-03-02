var moment = require('moment');

// var date = new Date();
// console.log(date.getMonth());

var date = moment();
date.add(100, 'years').subtract(9, 'months');
console.log(date.format('Do MMMM YYYY'));
