import DS from 'ember-data';
import { Model  } from 'ember-pouch';

export default Model.extend({
  name: DS.attr('string'),
  value: DS.attr('string'),
  tags: DS.hasMany('tag')
});
