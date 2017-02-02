var curr = new Date;
var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()+1));
var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+7));

console.log('firstday: ', firstday);
console.log('lastday: ', lastday);
