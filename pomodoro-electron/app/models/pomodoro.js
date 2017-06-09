import DS from 'ember-data';
import { Model  } from 'ember-pouch';

export default Model.extend({
  date: DS.attr('date'),
  task: DS.belongsTo('task')
});
