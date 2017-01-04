var startDate = new Date(2016, 0, 1),
    endDate = new Date(startDate.getTime() + 100*24*60*60*1000);
console.log('end date: ', endDate.toString());

for (var iDate = new Date(startDate); iDate < endDate; iDate.setDate(iDate.getDate() + 1)) {
  console.log(iDate.toDateString());
}
