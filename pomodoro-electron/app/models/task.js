import DS from 'ember-data';
import { Model  } from 'ember-pouch';

export default Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  active: DS.attr('boolean'),
  pomodoros: DS.hasMany('pomodoro')
});
