App.Utils = Ember.ObjectController.extend({
  /**
   * receives a array of store object tasks and 
   * transform in simple json to be saved on a file
   */
  transformTaskObject(arr){
    let json = {"tasks": []},
        id, obj;
    arr.forEach((item) => {
      id = item.id; 
      obj = item.toJSON();
      obj["id"] = id;
      json.tasks.push(obj);
    });
    return json;
  },
  /**
   * Transform schedule object
   */
  transformScheduleObject(data){
    data.forEach((item) => {
      item.tasks.forEach((task) => {
         
      });
    });
  },
  /**
   * returns a string in the format expected by json
   */
  getDateString(date){
    var S = date.getSeconds(),
      M = date.getMinutes(), H = date.getHours(),
      dd = date.getDate(), mm = date.getMonth()+1, 
      yyyy = date.getFullYear();
    if(dd<10){
      dd ='0'+dd
    }
    if(mm<10) {
      mm ='0'+mm
    }
    return dd+'/'+mm+'/'+yyyy+'|'+H+'|'+M+'|'+S;
  },
  getMonday(curr) {
    let sun = (curr.getDay() === 0) ? 7 : 0; // correction for sundays
    return new Date(curr.setDate(curr.getDate() - curr.getDay()+1 - sun));
  },
  getSunday(curr){
    let sun = (curr.getDay() === 0) ? 7 : 0; // correction for sundays
    return new Date(curr.setDate(curr.getDate() - curr.getDay()+7 - sun));
  },
  /**
   * transform date string
   * "27/01/2015" > "01/27/2015" 
   * @function transformDate
   */
  transformDate(date){
    //"27/01/2015" > "01/27/2015" 
    var oldDate = date.split('/');
    var newDate = [oldDate[1], oldDate[0], oldDate[2]].join('/');
    return newDate;
  },
  transformDateToString(date){
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
    return [(dd > 9 ? '' : '0') + dd,
            (mm > 9 ? '' : '0') + mm,
            date.getFullYear()].join('/');
  }
});

const utils = App.Utils.create();
