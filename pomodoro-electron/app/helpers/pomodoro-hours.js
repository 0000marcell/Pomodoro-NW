import Ember from 'ember';

export function pomodoroHours(params/*, hash*/) {
  return  `${params[0].length/2} h`;
}

export default Ember.Helper.helper(pomodoroHours);
