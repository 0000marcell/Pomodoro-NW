let schedule = [];
['monday', 'tuesday', 'wednesday', 
  'thrusday', 'friday', 'saturday', 'sunday'].forEach((item) => {
  schedule.push({day: item, tasks: []});
});
let tags = [{id: null, name: null, color: null}];

App.Store = Ember.Object.extend({
  task: [],
  schedule: schedule,
  tags: tags,
});

const store = App.Store.create({});
