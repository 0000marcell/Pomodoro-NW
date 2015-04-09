var appClock, intervalCount = 0,
    pomodoroTime = 25 * 60, restart = false,
    shortIntervalTime = 5 * 10, longIntervalTime = 10 * 60,
    pause = false, pomodoroClock,
    jsonio = new JSONIO(), statistics = new PomodoroStatistics(), 
    appWindow = new WindowFunctions(), currentSelected = -1, clockState = new ClockState(),
    newTask;

App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.ApplicationAdapter = DS.FixtureAdapter.extend({
  namespace: 'Pomodoro-Grunt-Node'
});