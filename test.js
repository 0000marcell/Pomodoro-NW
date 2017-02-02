function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
  diff = d.getDate() - day + (day == 0 ? -6:1);
  return new Date(d.setDate(diff));
}

let day = getMonday(new Date());
