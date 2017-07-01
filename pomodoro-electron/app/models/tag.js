import DS from 'ember-data';
import { Model  } from 'ember-pouch';

export default Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  color: DS.belongsTo('color'),
  active: DS.attr('string')
});
