let workColors = ['#880E4F', '#AD1457', '#C2185B', 
    '#D81B60', '#E91E63', '#EC407A'].map((color) => { 
      return {color: color, style: `background-color: ${color};`}; }),
    learnColors = ['#4A148C', '#6A1B9A', '#7B1FA2', 
      '#8E24AA', '#9C27B0', '#AB47BC'].map((color) => { 
       return {color: color, style: `background-color: ${color};`}; }),
    otherColors = ['#0D47A1', '#1565C0', '#1976D2', 
       '#1E88E5', '#2196F3', '#42A5F5'].map((color) => { 
       return {color: color, style: `background-color: ${color};`}; });
let colorsObj = [{type: 'work', colors: workColors},
                 {type: 'learn', colors: learnColors},
                 {type: 'other', colors: otherColors}];
console.log(colorsObj);
App.EditController = Ember.ObjectController.extend({
  colorsObj: colorsObj, 
  changeSelection(color){
    let obj = this.get('colorsObj');
    obj = obj.map((item) => {
      item.colors = item.colors.map((col) => {
        if(col.color === color.color){
          col.style = `background-color: ${col.color}; 
                       border: 2px solid #000;`; 
        }else{
          col.style = `background-color: ${col.color}; 
                       border: 2px solid #fff;`;
        }
        return col;  
      });
      return item;
    });
    console.log('obj: ', obj);
    this.set('colorsObj', obj);
  },
  actions: {
    save(task) {
      if(!task.get('name')){
        console.log('the name of the task cant be blank');
        return;
      }
      fileIO.saveTasks(utils.transformTaskObject(this.store.all('task').content));
      this.transitionToRoute('main');
    },
    delete(task) {
      let result = this.store.all('task').content.filter((item) => {
        return item.id !== task.id;
      });
      let obj = utils.transformTaskObject(result);
      fileIO.saveTasks(obj);
      this.store.unloadAll('task');
      obj.tasks.forEach((item) => {
        this.store.push('task', item); 
      });
      this.transitionToRoute('main');
    },
    selectColor(color){
      this.changeSelection(color); 
    }
  }
});
