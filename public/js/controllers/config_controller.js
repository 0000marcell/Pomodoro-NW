App.ConfigController = Ember.ObjectController.extend({
  actions: {
    chooseAsSource: function(){
      if(!$('#sourceDir').val()){
        alert('first choose a source file!');
        return;
      }
      jsonio.copy($('#sourceDir').val(), 'data.json');
    },
    backupData: function(){
      if(!$('#destDirectory').val()){
        alert('first choose a directory');
        return;
      }
      var dest = $('#destDirectory').val()+'/data.json';
      jsonio.copy('data.json', dest);
    }
  }
});


