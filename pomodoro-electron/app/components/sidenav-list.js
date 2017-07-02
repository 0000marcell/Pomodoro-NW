import Ember from 'ember';

export default Ember.Component.extend({
  inactive: false,
  classNames: ['sidenav-list'],
  newTag: {name: null, description: null,
    color: null},
  newTask: {name: null, description: null, tag: null,
            pomodoros: []},
  loadList(){
    let list = 
      this.get(`model.${this.get('listMode')}`);
    if(!list){
      this.set('filteredList', []);
      return;
    }
    list.setEach('active', true);
    this.set('filteredList', 
      list.filterBy('active', !this.get('inactive')));
  },
  didReceiveAttrs(){
    this.loadList();
    this.get('register')()
      .set('sidenavList', this);
  },
  loading: false,
  setLeftPanelModel(item){
    if(this.get('listMode') === 'tasks'){
      this.set('mode.model', 
        (item.name) ? item :  
          this.get('newTask'));
      this.set('mode.saveAction', 
        (item.name) ? 'editTask' : 
          'createTask');
    }else{
      this.set('mode.model', 
        (item.name) ? item :  
          this.get('newTag'));
      this.set('mode.saveAction', 
        (item.name) ? 'editTag' : 
          'createTag')
    }
  },
  actions: {
    toggleInactive(){
      this.toggleProperty('inactive');
      this.loadList();
    },
    searchList(){
      this.set('loading', true);
      Ember.run.later(this, () => {
        let regex = 
          new RegExp(this.get('search'), 'i');
        let model = 
          this.get(`model.${this.get('listMode')}`)
        let result = 
          model.filter((item) => {
            return item.name.match(regex); 
          });
        this.set('filteredList', result);
        this.set('loading', false);
      }, 500);     
    },
    toggle(item, event){
      let el = Ember.$(event.target)
        .closest("li");
      el.addClass('active');
      if(this.get('prevItem')){
        this.get('prevItem')
          .removeClass('active');  
      }
      this.set('prevItem', el);
      if(this.get('listMode') === 'tasks'){
        this.get('changeSelected')(item);
      }
      this.setLeftPanelModel(item);
    },
    showLeftPanel(item){
      this.setLeftPanelModel(item); 
      this.set('showLeftPanel', true);
    },
    changeListMode(mode){
      this.set('listMode', mode);
      //this.loadList();
    }
  }
});
