workColors = [];
['#880E4F', '#AD1457', '#C2185B', 
  '#D81B60', '#E91E63', '#EC407A'].forEach((color) => {
  workColors.push({color: color, style: `background-color: ${color};`}); 
});

App.EditController = Ember.ObjectController.extend({
  workColors: workColors, 
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
    }
  }
});
