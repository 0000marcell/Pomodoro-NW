"use strict";



define('pomodoro-electron/adapters/application', ['exports', 'pouchdb', 'ember-pouch'], function (exports, _pouchdb, _emberPouch) {

  //var remote = new PouchDB('http://localhost:5984/my_couch');
  var db = new _pouchdb['default']('local_pouch');

  exports['default'] = _emberPouch.Adapter.extend({
    db: db
  });
});
define('pomodoro-electron/app', ['exports', 'ember', 'pomodoro-electron/resolver', 'ember-load-initializers', 'pomodoro-electron/config/environment'], function (exports, _ember, _pomodoroElectronResolver, _emberLoadInitializers, _pomodoroElectronConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _pomodoroElectronConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _pomodoroElectronConfigEnvironment['default'].podModulePrefix,
    Resolver: _pomodoroElectronResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _pomodoroElectronConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('pomodoro-electron/components/clock-comp', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['clock-comp', 'column'],
    active: false,
    min: '00',
    sec: '00',
    didReceiveAttrs: function didReceiveAttrs() {
      this.set('clock.reset', this.get('reset').bind(this));
      this.setTime(this.get('clock.time'));
    },
    reset: function reset() {
      if (this.get('timeInt')) {
        clearInterval(this.get('timeInt'));
        this.set('timeInt', null);
        this.set('clock.state', 'paused');
        this.set('active', false);
        this.setTime(this.get('clock.time'));
      }
    },
    start: function start() {
      var _this = this;

      if (!this.get('timeInt')) {
        var timeInt = setInterval(function () {
          _this.decreaseTime();
        }, 1000);
        this.set('timeInt', timeInt);
        this.set('clock.pausedByUser', false);
        this.set('active', true);
        this.set('clock.state', 'running');
      }
    },
    stop: function stop() {
      clearInterval(this.get('timeInt'));
      this.set('timeInt', null);
      this.set('clock.state', 'paused');
      if (this.get('stopCB')) {
        this.get('stopCB')(this);
      }
    },
    setTime: function setTime(time) {
      if (time > 60) {
        var min = Math.floor(time / 60);
        this.setWithPad('min', min);
        var sec = time % 60;
        this.setWithPad('sec', sec);
      } else {
        this.setWithPad('sec', time);
      }
    },
    setWithPad: function setWithPad(attr, val) {
      if (val < 10) {
        this.set(attr, '0' + val);
      } else {
        this.set(attr, val);
      }
    },

    decreaseTime: function decreaseTime() {
      var min = parseInt(this.get('min'));
      var sec = parseInt(this.get('sec'));
      sec = sec - 1;
      if (sec < 0) {
        min = min - 1;
        if (min < 0) {
          this.stop();
        } else {
          this.setWithPad('min', min);
        }
      } else {
        this.setWithPad('sec', sec);
      }
    },
    actions: {
      playPause: function playPause() {
        this.get('playPause')(this);
      }
    }
  });
});
define('pomodoro-electron/components/color-option', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['color-option'],
    didReceiveAttrs: function didReceiveAttrs() {
      var value = this.get('color.value');
      this.set('style', _ember['default'].String.htmlSafe('background-color: ' + value));
    }
  });
});
define('pomodoro-electron/components/dropdown-list', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['dropdown-list'],
    classNameBindings: ['dropdownListShow'],
    didReceiveAttrs: function didReceiveAttrs() {
      var _this = this;

      if (this.get('items')) {
        this.set('selectedItem', this.get('items')[0]);
        this.set('selection', this.get('items').filter(function (item) {
          return item.id !== _this.get('items')[0].id;
        }));
      }
    },
    actions: {
      clickSelected: function clickSelected() {
        this.toggleProperty('dropdownListShow');
      },
      selectItem: function selectItem(item) {
        this.set('dropdownListShow', false);
        this.set('selection', this.get('items').filter(function (val) {
          return item.id !== val.id;
        }));
        this.set('selectedItem', item);
        this.set('selected', item);
      }
    }

  });
});
define('pomodoro-electron/components/fa-icon', ['exports', 'ember-font-awesome/components/fa-icon'], function (exports, _emberFontAwesomeComponentsFaIcon) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberFontAwesomeComponentsFaIcon['default'];
    }
  });
});
define('pomodoro-electron/components/fa-list', ['exports', 'ember-font-awesome/components/fa-list'], function (exports, _emberFontAwesomeComponentsFaList) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberFontAwesomeComponentsFaList['default'];
    }
  });
});
define('pomodoro-electron/components/fa-stack', ['exports', 'ember-font-awesome/components/fa-stack'], function (exports, _emberFontAwesomeComponentsFaStack) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberFontAwesomeComponentsFaStack['default'];
    }
  });
});
define('pomodoro-electron/components/flip-clock', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['flip-clock'],
    previousState: false,
    didInsertElement: function didInsertElement() {
      var flipClock = _ember['default'].$('.clock').FlipClock({
        clockFace: 'MinuteCounter',
        autoStart: false,
        callbacks: {
          stop: this.stopClock.bind(this)
        }
      });
      this.set('flipClock', flipClock);
      this.initialize();
    },
    initialize: function initialize() {
      this.get('flipClock').setCountdown(true);
      this.get('flipClock').setTime(this.get('clock.time'));
    },
    reset: function reset(sec) {
      this.get('flipClock').setTime(sec);
    },
    pause: function pause() {
      this.set('clock.state', 'paused');
      this.get('flipClock').stop();
    },
    start: function start() {
      this.set('clock.state', 'active');
      this.get('flipClock').start();
    },
    stopClock: function stopClock() {
      var _this = this;

      _ember['default'].run.later(this, function () {
        if (_this.get('clock.state') === 'paused') {
          return;
        }
        if (_this.get('clock.mode') === 'pomodoro') {
          _this.incrementProperty('intervalCount');
          var interval = _this.get('intervalCount') % 3 === 0 ? _this.get('clock.longInterval') : _this.get('clock.shortInterval');
          _this.get('flipClock').setTime(interval);
          _this.set('clock.mode', 'interval');
        } else if (_this.get('clock.mode') === 'interval') {
          _this.get('flipClock').setTime(_this.get('clock.time'));
          _this.set('clock.mode', 'pomodoro');
        }
        _ember['default'].run.later(_this, function () {
          _this.start();
        }, 1000);
      }, 1000);
    },
    actions: {
      playPause: function playPause() {
        this.get('active') ? this.pause() : this.start();
        this.toggleProperty('active');
      }
    }
  });
});
define('pomodoro-electron/components/info-card', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['info-card']
  });
});
define('pomodoro-electron/components/pop-dialog', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['pop-dialog'],
    classNameBindings: ['showDialog'],
    showDialog: true,
    actions: {
      close: function close(val) {
        this.set('showDialog', false);
        this.get('confirm')(val);
      }
    }
  });
});
define('pomodoro-electron/components/sidenav-list', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    inactive: false,
    classNames: ['sidenav-list'],
    newTag: { name: null, description: null,
      color: null },
    newTask: { name: null, description: null, tag: null,
      pomodoros: [] },
    loadList: function loadList() {
      var list = this.get('model.' + this.get('listMode'));
      list.setEach('active', true);
      this.set('filteredList', list.filterBy('active', !this.get('inactive')));
    },
    didReceiveAttrs: function didReceiveAttrs() {
      this.loadList();
      this.get('register')().set('sidenavList', this);
    },
    loading: false,
    setLeftPanelModel: function setLeftPanelModel(item) {
      if (this.get('listMode') === 'tasks') {
        this.set('mode.model', item.name ? item : this.get('newTask'));
        this.set('mode.saveAction', item.name ? 'editTask' : 'createTask');
      } else {
        this.set('mode.model', item.name ? item : this.get('newTag'));
        this.set('mode.saveAction', item.name ? 'editTag' : 'createTag');
      }
    },
    actions: {
      toggleInactive: function toggleInactive() {
        this.toggleProperty('inactive');
        this.loadList();
      },
      searchList: function searchList() {
        var _this = this;

        this.set('loading', true);
        _ember['default'].run.later(this, function () {
          var regex = new RegExp(_this.get('search'), 'i');
          var model = _this.get('model.' + _this.get('listMode'));
          var result = model.filter(function (item) {
            return item.name.match(regex);
          });
          _this.set('filteredList', result);
          _this.set('loading', false);
        }, 500);
      },
      toggle: function toggle(item, event) {
        var el = _ember['default'].$(event.target).closest("li");
        el.addClass('active');
        if (this.get('prevItem')) {
          this.get('prevItem').removeClass('active');
        }
        this.set('prevItem', el);
        if (this.get('listMode') === 'tasks') {
          this.get('changeSelected')(item);
        }
        this.setLeftPanelModel(item);
      },
      showLeftPanel: function showLeftPanel(item) {
        this.setLeftPanelModel(item);
        this.set('showLeftPanel', true);
      },
      changeListMode: function changeListMode(mode) {
        this.set('listMode', mode);
        //this.loadList();
      }
    }
  });
});
define('pomodoro-electron/components/sidenav-panel', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNameBindings: ['openSidenav', 'leftPanel'],
    listMode: 'tasks',
    mode: { model: '', saveAction: 'createTask' },
    reloadList: function reloadList() {
      this.get('sidenavList').loadList();
    },
    actions: {
      register: function register() {
        return this;
      },
      overlayClick: function overlayClick() {
        this.set('leftPanel', false);
        this.set('openSidenav', false);
      },
      showLeftPanel: function showLeftPanel() {
        this.toggleProperty('leftPanel');
      }
    }
  });
});
define('pomodoro-electron/components/tag-form', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['tag-form', 'column'],
    didInsertElement: function didInsertElement() {
      this.set('msgs', []);
    },
    didReceiveAttrs: function didReceiveAttrs() {
      if (this.get('tag.name')) {
        this.set('mode', 'edit');
      } else {
        this.set('mode', 'create');
      }
      this.set('sidenavPanel', this.get('register')());
      this.get('sidenavPanel').set('tagForm', this);
    },
    title: 'new tag',
    tag: { name: '', description: '',
      color: '' },
    actions: {
      saveTag: function saveTag(tag) {
        var _this = this;

        this.get('saveTag')(tag).then(function () {
          _this.set('msgs', ['tag saved!']);
          _ember['default'].run.later(_this, function () {
            _this.set('msgs', []);
          }, 5000);
        })['catch'](function () {
          _this.set('msgs', ['an error occored!']);
          _ember['default'].run.later(_this, function () {
            _this.set('msgs', []);
          }, 5000);
        });
      },
      completeTag: function completeTag(tag) {
        var _this2 = this;

        this.get('completeTag')(tag).then(function () {
          _this2.get('sidenavPanel').reloadList();
          _this2.set('msgs', ['tag completed!']);
          _ember['default'].run.later(_this2, function () {
            _this2.set('msgs', []);
          }, 5000);
        })['catch'](function (error) {
          _this2.set('msgs', ['error: ' + error]);
          _ember['default'].run.later(_this2, function () {
            _this2.set('msgs', []);
          }, 5000);
        });
      }
    }
  });
});
define('pomodoro-electron/components/task-form', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['task-form', 'column'],
    didInsertElement: function didInsertElement() {
      this.set('msgs', []);
    },
    didReceiveAttrs: function didReceiveAttrs() {
      if (this.get('task.name')) {
        this.set('mode', 'edit');
      } else {
        this.set('mode', 'create');
      }
      this.set('sidenavPanel', this.get('register')());
      this.get('sidenavPanel').set('taskForm', this);
    },
    actions: {
      saveTask: function saveTask(task) {
        var _this = this;

        this.get('saveTask')(task).then(function () {
          _this.set('msgs', ['task saved!']);
          _ember['default'].run.later(_this, function () {
            _this.set('msgs', []);
          }, 5000);
          _this.get('sidenavPanel').reloadList();
        })['catch'](function (err) {
          _this.set('msgs', ['An error occored ' + err]);
          _ember['default'].run.later(_this, function () {
            _this.set('msgs', []);
          }, 5000);
        });
      },
      completeTask: function completeTask(task) {
        var _this2 = this;

        this.get('completeTask')(task).then(function () {
          _this2.get('sidenavPanel').reloadList();
          _this2.set('msgs', ['task completed!']);
          _ember['default'].run.later(_this2, function () {
            _this2.set('msgs', []);
          }, 5000);
        })['catch'](function (error) {
          _this2.set('msgs', ['error: ' + error]);
          _ember['default'].run.later(_this2, function () {
            _this2.set('msgs', []);
          }, 5000);
        });
      }
    }
  });
});
define('pomodoro-electron/components/task-info', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['task-info', 'column']
  });
});
define('pomodoro-electron/components/tasks-sidenav', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['sidenav-panel'],
    didInsertElement: function didInsertElement() {
      this.set('filteredTasks', this.get('model.tasks'));
    },
    loading: false,
    searchResults: _ember['default'].observer('search', function () {
      var _this = this;

      this.set('loading', true);
      _ember['default'].run.later(this, function () {
        var regex = new RegExp(_this.get('search'), 'i');
        var result = _this.get('model.tasks').filter(function (item) {
          return item.name.match(regex);
        });
        _this.set('filteredTasks', result);
        _this.set('loading', false);
      }, 500);
    }),
    actions: {
      toggle: function toggle(task, event) {
        var el = _ember['default'].$(event.target).closest("li");
        el.addClass('active');
        if (this.get('prevItem')) {
          this.get('prevItem').removeClass('active');
        }
        this.set('prevItem', el);
        this.set('model.state.selectedTask', task);
      },
      showEditTask: function showEditTask(task) {
        this.get('showEditTask')(task);
      },
      showCreateTask: function showCreateTask() {
        this.get('showCreateTask')();
      },
      showCreateTag: function showCreateTag() {
        this.get('showCreateTag')();
      }
    }
  });
});
define('pomodoro-electron/controllers/application', ['exports', 'ember'], function (exports, _ember) {

  var links = [{ icon: 'clock-o',
    name: 'schedule', link: 'schedule' }, { icon: 'bar-chart',
    name: 'statistics',
    link: 'statistics' }, { icon: 'cog',
    name: 'configuration', link: 'configuration' }];

  exports['default'] = _ember['default'].Controller.extend({
    openSidenav: false,
    links: links
  });
});
define('pomodoro-electron/controllers/main', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    actions: {
      stopClock: function stopClock(clock) {
        console.log(clock.get('clock.pausedByUser'));
        if (clock.get('clock.pausedByUser')) {
          return;
        }
        clock.incrementProperty('clock.streak');
        var model = this.get("model");
        if (clock.get('clock.mode') === 'pomodoro') {
          // TODO save the task
          if (this.get('clock.streak') % 3 === 0) {
            clock.setTime(this.get('clock.longInterval'));
          } else {
            clock.setTime(this.get('clock.shortInterval'));
          }
          clock.set('clock.mode', 'iterval');
        } else {
          clock.setTime(this.get('clock.time'));
          clock.set('clock.mode', 'pomodoro');
        }
        clock.start();
      },
      playPause: function playPause(clock) {
        if (!this.get('model.state.selectedTask')) {
          console.log('first you need to select a task!');
          return;
        }
        if (clock.get('active')) {
          clock.set('clock.pausedByUser', true);
          clock.stop();
        } else {
          clock.start();
        }
        clock.toggleProperty('active');
      }
    }
  });
});
define('pomodoro-electron/controllers/testing', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    colors: [{ id: 1, name: 'pink', value: '#ff00ff' }, { id: 2, name: 'red', value: '#ff0000' }],
    actions: {
      confirm: function confirm(val) {
        console.log(val);
      },
      showDialog: function showDialog() {
        this.set('dialogCB', function () {
          console.log('dialog callback!');
        });
        this.toggleProperty('showDialog');
      }
    }
  });
});
define('pomodoro-electron/electron/reload', ['exports'], function (exports) {
  function setupLivereload() {
    var process = window ? window.process : null;

    // Exit immediately if we're not running in Electron
    if (!window.ELECTRON || process && process.env && process.env.DO_NOT_SETUP_LIVERELOAD) {
      return;
    }

    // Reload the page when anything in `dist` changes
    var fs = undefined;
    var path = undefined;
    var devtron = undefined;

    try {
      fs = window.requireNode('fs');
      path = window.requireNode('path');
    } catch (e) {
      console.warn('ember-electron tried to require fs and path to enable live-reload features, but failed.');
      console.warn('Automatic reloading is therefore disabled.');
      console.warn(e);

      return;
    }

    /**
     * @private
     * Watch a given directory for changes and reload
     * on change
     *
     * @param sub directory
     */
    function watch() {
      var _path;

      for (var _len = arguments.length, sub = Array(_len), _key = 0; _key < _len; _key++) {
        sub[_key] = arguments[_key];
      }

      var dirname = (_path = path).join.apply(_path, [__dirname].concat(sub));

      fs.watch(dirname, { recursive: true }, function () {
        return window.location.reload();
      });
    }

    /**
     * @private
     * Install Devtron in the current window.
     */
    function installDevtron() {
      try {
        devtron = window.requireNode('devtron');

        if (devtron) {
          devtron.install();
        }
      } catch (e) {
        // no-op
      }
    }

    /**
     * @private
     * Install Ember-Inspector in the current window.
     */
    function installEmberInspector() {
      var location = undefined;

      try {
        var eiLocation = window.requireNode.resolve('ember-inspector');
        location = path.join(eiLocation, 'dist', 'chrome');
      } catch (error) {
        location = path.join(__dirname, '..', 'node_modules', 'ember-inspector', 'dist', 'chrome');
      }

      fs.lstat(location, function (err, results) {
        if (err) {
          console.warn('Error loading Ember Inspector', err);

          return;
        }

        if (results && results.isDirectory && results.isDirectory()) {
          var BrowserWindow = window.requireNode('electron').remote.BrowserWindow;

          var added = BrowserWindow.getDevToolsExtensions && BrowserWindow.getDevToolsExtensions().hasOwnProperty('Ember Inspector');

          try {
            if (!added) {
              BrowserWindow.addDevToolsExtension(location);
            }
          } catch (err) {
            // no-op
          }
        }
      });
    }

    document.addEventListener('DOMContentLoaded', function () /* e */{
      var dirname = __dirname || (process && (process || {}).cwd ? process.cwd() : null);

      if (!dirname) {
        return;
      }

      fs.stat(dirname, function (err /* , stat */) {
        if (!err) {
          watch();

          // On linux, the recursive `watch` command is not fully supported:
          // https://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener
          //
          // However, the recursive option WILL watch direct children of the
          // given directory.  So, this hack just manually sets up watches on
          // the expected subdirs -- that is, `assets` and `tests`.
          if (process && process.platform === 'linux') {
            watch('assets');
            watch('tests');
          }
        }
      });

      installDevtron();
      installEmberInspector();
    });
  }

  setupLivereload();
});
define('pomodoro-electron/helpers/and', ['exports', 'ember', 'ember-truth-helpers/helpers/and'], function (exports, _ember, _emberTruthHelpersHelpersAnd) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersAnd.andHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersAnd.andHelper);
  }

  exports['default'] = forExport;
});
define('pomodoro-electron/helpers/app-version', ['exports', 'ember', 'pomodoro-electron/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _pomodoroElectronConfigEnvironment, _emberCliAppVersionUtilsRegexp) {
  exports.appVersion = appVersion;
  var version = _pomodoroElectronConfigEnvironment['default'].APP.version;

  function appVersion(_) {
    var hash = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (hash.hideSha) {
      return version.match(_emberCliAppVersionUtilsRegexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_emberCliAppVersionUtilsRegexp.shaRegExp)[0];
    }

    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('pomodoro-electron/helpers/eq', ['exports', 'ember', 'ember-truth-helpers/helpers/equal'], function (exports, _ember, _emberTruthHelpersHelpersEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersEqual.equalHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersEqual.equalHelper);
  }

  exports['default'] = forExport;
});
define('pomodoro-electron/helpers/gt', ['exports', 'ember', 'ember-truth-helpers/helpers/gt'], function (exports, _ember, _emberTruthHelpersHelpersGt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGt.gtHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGt.gtHelper);
  }

  exports['default'] = forExport;
});
define('pomodoro-electron/helpers/gte', ['exports', 'ember', 'ember-truth-helpers/helpers/gte'], function (exports, _ember, _emberTruthHelpersHelpersGte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersGte.gteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersGte.gteHelper);
  }

  exports['default'] = forExport;
});
define('pomodoro-electron/helpers/is-array', ['exports', 'ember', 'ember-truth-helpers/helpers/is-array'], function (exports, _ember, _emberTruthHelpersHelpersIsArray) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersIsArray.isArrayHelper);
  }

  exports['default'] = forExport;
});
define('pomodoro-electron/helpers/is-equal', ['exports', 'ember-truth-helpers/helpers/is-equal'], function (exports, _emberTruthHelpersHelpersIsEqual) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberTruthHelpersHelpersIsEqual['default'];
    }
  });
  Object.defineProperty(exports, 'isEqual', {
    enumerable: true,
    get: function get() {
      return _emberTruthHelpersHelpersIsEqual.isEqual;
    }
  });
});
define('pomodoro-electron/helpers/lt', ['exports', 'ember', 'ember-truth-helpers/helpers/lt'], function (exports, _ember, _emberTruthHelpersHelpersLt) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLt.ltHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLt.ltHelper);
  }

  exports['default'] = forExport;
});
define('pomodoro-electron/helpers/lte', ['exports', 'ember', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersHelpersLte) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersLte.lteHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = forExport;
});
define('pomodoro-electron/helpers/not-eq', ['exports', 'ember', 'ember-truth-helpers/helpers/not-equal'], function (exports, _ember, _emberTruthHelpersHelpersNotEqual) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNotEqual.notEqualHelper);
  }

  exports['default'] = forExport;
});
define('pomodoro-electron/helpers/not', ['exports', 'ember', 'ember-truth-helpers/helpers/not'], function (exports, _ember, _emberTruthHelpersHelpersNot) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersNot.notHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersNot.notHelper);
  }

  exports['default'] = forExport;
});
define('pomodoro-electron/helpers/or', ['exports', 'ember', 'ember-truth-helpers/helpers/or'], function (exports, _ember, _emberTruthHelpersHelpersOr) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersOr.orHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersOr.orHelper);
  }

  exports['default'] = forExport;
});
define('pomodoro-electron/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('pomodoro-electron/helpers/pomodoro-hours', ['exports', 'ember'], function (exports, _ember) {
  exports.pomodoroHours = pomodoroHours;

  function pomodoroHours(params /*, hash*/) {
    return params[0].length / 2 + ' h';
  }

  exports['default'] = _ember['default'].Helper.helper(pomodoroHours);
});
define('pomodoro-electron/helpers/route-action', ['exports', 'ember-route-action-helper/helpers/route-action'], function (exports, _emberRouteActionHelperHelpersRouteAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberRouteActionHelperHelpersRouteAction['default'];
    }
  });
});
define('pomodoro-electron/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('pomodoro-electron/helpers/xor', ['exports', 'ember', 'ember-truth-helpers/helpers/xor'], function (exports, _ember, _emberTruthHelpersHelpersXor) {

  var forExport = null;

  if (_ember['default'].Helper) {
    forExport = _ember['default'].Helper.helper(_emberTruthHelpersHelpersXor.xorHelper);
  } else if (_ember['default'].HTMLBars.makeBoundHelper) {
    forExport = _ember['default'].HTMLBars.makeBoundHelper(_emberTruthHelpersHelpersXor.xorHelper);
  }

  exports['default'] = forExport;
});
define('pomodoro-electron/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'pomodoro-electron/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _pomodoroElectronConfigEnvironment) {
  var _config$APP = _pomodoroElectronConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('pomodoro-electron/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('pomodoro-electron/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('pomodoro-electron/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/index'], function (exports, _emberDataSetupContainer, _emberDataIndex) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('pomodoro-electron/initializers/export-application-global', ['exports', 'ember', 'pomodoro-electron/config/environment'], function (exports, _ember, _pomodoroElectronConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_pomodoroElectronConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _pomodoroElectronConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_pomodoroElectronConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('pomodoro-electron/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('pomodoro-electron/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('pomodoro-electron/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('pomodoro-electron/initializers/truth-helpers', ['exports', 'ember', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _ember, _emberTruthHelpersUtilsRegisterHelper, _emberTruthHelpersHelpersAnd, _emberTruthHelpersHelpersOr, _emberTruthHelpersHelpersEqual, _emberTruthHelpersHelpersNot, _emberTruthHelpersHelpersIsArray, _emberTruthHelpersHelpersNotEqual, _emberTruthHelpersHelpersGt, _emberTruthHelpersHelpersGte, _emberTruthHelpersHelpersLt, _emberTruthHelpersHelpersLte) {
  exports.initialize = initialize;

  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (_ember['default'].Helper) {
      return;
    }

    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('and', _emberTruthHelpersHelpersAnd.andHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('or', _emberTruthHelpersHelpersOr.orHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('eq', _emberTruthHelpersHelpersEqual.equalHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not', _emberTruthHelpersHelpersNot.notHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('is-array', _emberTruthHelpersHelpersIsArray.isArrayHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('not-eq', _emberTruthHelpersHelpersNotEqual.notEqualHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gt', _emberTruthHelpersHelpersGt.gtHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('gte', _emberTruthHelpersHelpersGte.gteHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lt', _emberTruthHelpersHelpersLt.ltHelper);
    (0, _emberTruthHelpersUtilsRegisterHelper.registerHelper)('lte', _emberTruthHelpersHelpersLte.lteHelper);
  }

  exports['default'] = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define("pomodoro-electron/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('pomodoro-electron/models/color', ['exports', 'ember-data', 'ember-pouch'], function (exports, _emberData, _emberPouch) {
  exports['default'] = _emberPouch.Model.extend({
    name: _emberData['default'].attr('string'),
    value: _emberData['default'].attr('string'),
    tags: _emberData['default'].hasMany('tag')
  });
});
define('pomodoro-electron/models/pomodoro', ['exports', 'ember-data', 'ember-pouch'], function (exports, _emberData, _emberPouch) {
  exports['default'] = _emberPouch.Model.extend({
    date: _emberData['default'].attr('date'),
    task: _emberData['default'].belongsTo('task')
  });
});
define('pomodoro-electron/models/tag', ['exports', 'ember-data', 'ember-pouch'], function (exports, _emberData, _emberPouch) {
  exports['default'] = _emberPouch.Model.extend({
    name: _emberData['default'].attr('string'),
    description: _emberData['default'].attr('string'),
    color: _emberData['default'].belongsTo('color'),
    active: _emberData['default'].attr('string')
  });
});
define('pomodoro-electron/models/task', ['exports', 'ember-data', 'ember-pouch'], function (exports, _emberData, _emberPouch) {
  exports['default'] = _emberPouch.Model.extend({
    name: _emberData['default'].attr('string'),
    description: _emberData['default'].attr('string'),
    active: _emberData['default'].attr('boolean'),
    pomodoros: _emberData['default'].hasMany('pomodoro')
  });
});
define('pomodoro-electron/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('pomodoro-electron/router', ['exports', 'ember', 'pomodoro-electron/config/environment'], function (exports, _ember, _pomodoroElectronConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _pomodoroElectronConfigEnvironment['default'].locationType,
    rootURL: _pomodoroElectronConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('main');
    this.route('schedule');
    this.route('statistics');
    this.route('configuration');
    this.route('testing');
  });

  exports['default'] = Router;
});
define('pomodoro-electron/routes/application', ['exports', 'ember', 'pomodoro-electron/routes/data'], function (exports, _ember, _pomodoroElectronRoutesData) {
  exports['default'] = _ember['default'].Route.extend({
    setupController: function setupController(controller, post) {
      this._super(controller, post);
      this.set('controller', controller);
    },
    state: { selectedTask: null,
      selectedTag: null,
      clock: {
        state: 'paused',
        mode: 'pomodoro',
        time: 5,
        shortInterval: 10,
        longInterval: 15,
        streak: 0,
        pausedByUser: false,
        reset: null
      }
    },

    // seed the db
    seed: function seed() {
      for (var key in _pomodoroElectronRoutesData['default']) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _pomodoroElectronRoutesData['default'][key][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var value = _step.value;

            console.log(key);
            this.store.createRecord(key, value).save().then(function (val) {
              console.log('value inserted');
            })['catch'](function (error) {
              console.error('\n            error trying to seed the db!: ' + error + '\n          ');
            });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    },
    model: function model() {
      //this.seed();
      return _ember['default'].RSVP.hash({
        tasks: this.store.findAll('task'),
        tags: this.store.findAll('tag'),
        state: this.get('state')
      });
    },
    redirect: function redirect() {
      //this.transitionTo('main');
    },
    actions: {
      showSidenav: function showSidenav() {
        this.get('controller').toggleProperty('openSidenav');
      },
      changeSelected: function changeSelected(item) {
        var _this = this;

        if (this.get('state.clock.state') === 'paused') {
          this.set('state.selectedTask', item);
          return;
        } else {
          var controller = this.get('controller');
          controller.set('showDialog', true);
          controller.set('popTitle', 'stop clock!');
          controller.set('popMsg', '\n        are you sure you wanna change the task,\n        clock gonna be reseted\n        ');
          controller.set('dialogCB', function (val) {
            if (val) {
              _this.set('state.selectedTask', item);
              _this.get('state.clock.reset')();
            }
          });
        }
      },
      createTask: function createTask(task) {
        return this.store.createRecord('task', task).save();
      },
      completeTask: function completeTask(task) {
        console.log('complete task!', task.id);
        task.set('active', false);
        return task.save();
      },
      editTask: function editTask(task) {
        return task.save();
      },
      createTag: function createTag(tag) {
        return this.store.createRecord('tag', tag).save();
      },
      completeTag: function completeTag(tag) {
        console.log('complete task!', tag.id);
        tag.set('active', false);
        return tag.save();
      },
      editTag: function editTag(tag) {
        return tag.save();
      }
    }
  });
});
define('pomodoro-electron/routes/configuration', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('pomodoro-electron/routes/data', ['exports'], function (exports) {
  var data = {
    task: [{ name: 'task 1', description: 'task 2', active: true }],
    tag: [{ name: 'tag 1', description: 'tag 2', color: '#ff00ff' }],
    color: [{ name: '', value: '#ff00ff' }],
    pomodoro: [{ date: new Date(), task: 1 }]
  };
  exports['default'] = data;
});
define('pomodoro-electron/routes/main', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('pomodoro-electron/routes/schedule', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('pomodoro-electron/routes/statistics', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('pomodoro-electron/routes/testing', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('pomodoro-electron/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define("pomodoro-electron/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "cSZKKv96", "block": "{\"statements\":[[\"append\",[\"helper\",[\"pop-dialog\"],null,[[\"confirm\",\"showDialog\",\"title\",\"text\"],[[\"get\",[\"dialogCB\"]],[\"get\",[\"showDialog\"]],[\"get\",[\"popTitle\"]],[\"get\",[\"popMsg\"]]]]],false],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"sidenav-panel\"],null,[[\"createTask\",\"editTask\",\"createTag\",\"editTag\",\"openSidenav\",\"model\"],[[\"helper\",[\"route-action\"],[\"createTask\"],null],[\"helper\",[\"route-action\"],[\"editTask\"],null],[\"helper\",[\"route-action\"],[\"createTag\"],null],[\"helper\",[\"route-action\"],[\"editTag\"],null],[\"get\",[\"openSidenav\"]],[\"get\",[\"model\"]]]]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"route-action\"],[\"showSidenav\"],null],null],[\"static-attr\",\"class\",\"tasks-button\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"bars\"],null],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"root-div column\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-header row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-header-side row\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"menu-options\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"main\"],null,2],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-header-main\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-header-aside row\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"menu-options\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"links\"]]],null,1],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-body row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-body-container\"],[\"flush-element\"],[\"text\",\"\\n      \\n      \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"              \"],[\"append\",[\"helper\",[\"fa-icon\"],[[\"get\",[\"item\",\"icon\"]]],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[[\"get\",[\"item\",\"link\"]]],null,0],[\"text\",\"          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"item\"]},{\"statements\":[[\"text\",\"            \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"home\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/application.hbs" } });
});
define("pomodoro-electron/templates/components/clock-comp", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "UV7SdlW7", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"clock-comp-header column\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"min\"]],false],[\"text\",\":\"],[\"append\",[\"unknown\",[\"sec\"]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"clock-comp-body column\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"flip-clock-body\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"id\",\"fc-test-startbtn\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"playPause\"],null],null],[\"static-attr\",\"href\",\"#\"],[\"static-attr\",\"title\",\"Start clock\"],[\"dynamic-attr\",\"class\",[\"concat\",[\"play-button \",[\"helper\",[\"if\"],[[\"get\",[\"active\"]],\"active\"],null]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/clock-comp.hbs" } });
});
define("pomodoro-electron/templates/components/color-option", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "jvhfBK7k", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"co-test-block\"],[\"dynamic-attr\",\"style\",[\"unknown\",[\"style\"]],null],[\"static-attr\",\"class\",\"color-option-block\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"color\",\"value\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/color-option.hbs" } });
});
define("pomodoro-electron/templates/components/dropdown-list", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "4TwBp+Pe", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"clickSelected\"],null],null],[\"static-attr\",\"class\",\"dropdown-list-selected\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"yield\",\"default\",[[\"get\",[\"selectedItem\"]]]],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"id\",\"dl-test-list\"],[\"static-attr\",\"class\",\"dropdown-list-dropdown\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"selection\"]]],null,0],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"selectItem\",[\"get\",[\"item\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n        \"],[\"yield\",\"default\",[[\"get\",[\"item\"]]]],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"item\"]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/dropdown-list.hbs" } });
});
define("pomodoro-electron/templates/components/flip-clock", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "OFjVe0H3", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"flip-clock-header\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"clock\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"flip-clock-body\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"id\",\"fc-test-startbtn\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"playPause\"],null],null],[\"static-attr\",\"href\",\"#\"],[\"static-attr\",\"title\",\"Start clock\"],[\"dynamic-attr\",\"class\",[\"concat\",[\"play-button \",[\"helper\",[\"if\"],[[\"get\",[\"active\"]],\"active\"],null]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/flip-clock.hbs" } });
});
define("pomodoro-electron/templates/components/info-card", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "QBa+APR6", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/info-card.hbs" } });
});
define("pomodoro-electron/templates/components/pop-dialog", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Yp+AWiQx", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"pop-dialog-box\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"pop-dialog-header row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"title\"]],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"icon-button\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"close\",false],null],null],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"close\"],null],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"pop-dialog-body column\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"pop-dialog-body-container\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"text\"]],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"pop-dialog-footer row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"icon-button\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"close\",true],null],null],[\"flush-element\"],[\"text\",\"\\n      Confirm\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"icon-button\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"close\",false],null],null],[\"flush-element\"],[\"text\",\"\\n      Cancel\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/pop-dialog.hbs" } });
});
define("pomodoro-electron/templates/components/sidenav-list", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "RJz658+m", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-header column\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-header-header row centralized\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"bars\"],null],false],[\"text\",\"\\n      \"],[\"append\",[\"unknown\",[\"listMode\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-header-body column centralized\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"id\",\"key-up\",\"type\",\"value\"],[\"Search\",\"sl-test-search\",[\"helper\",[\"action\"],[[\"get\",[null]],\"searchList\"],null],\"text\",[\"get\",[\"search\"]]]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-header-footer row centralized\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-header-footer-container\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showLeftPanel\"],null],null],[\"flush-element\"],[\"text\",\"\\n        add\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-body row\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"loading\"]]],null,5,4],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-footer column\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-footer-header\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"toggleInactive\"],null],null],[\"flush-element\"],[\"text\",\"\\n      Inactive\\n    \"],[\"close-element\"],[\"text\",\" \\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-footer-body row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"changeListMode\",\"tasks\"],null],null],[\"flush-element\"],[\"text\",\"\\n      Tasks\\n    \"],[\"close-element\"],[\"text\",\" \\n    \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"changeListMode\",\"tags\"],null],null],[\"flush-element\"],[\"text\",\"\\n      Tags\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"no-result-container\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"No Items\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                    \"],[\"append\",[\"helper\",[\"pomodoro-hours\"],[[\"get\",[\"item\",\"pomodoros\"]]],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"li\",[]],[\"static-attr\",\"class\",\"row\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"toggle\",[\"get\",[\"item\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"append\",[\"unknown\",[\"item\",\"name\"]],false],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"item\",\"pomodoros\"]]],null,1],[\"text\",\"                \"],[\"close-element\"],[\"text\",\"  \\n                \"],[\"open-element\",\"span\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showLeftPanel\",[\"get\",[\"item\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n                  \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"ellipsis-v\"],null],false],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"item\"]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"filteredList\"]]],null,2],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"  \\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"filteredList\"]]],null,3,0]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"loading-container\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-circle-o-notch fa-spin fa-4x fa-fw\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/sidenav-list.hbs" } });
});
define("pomodoro-electron/templates/components/sidenav-panel", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "u9H8xC5L", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel-overlay\"],[\"static-attr\",\"id\",\"sp-test-overlaybtn\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"overlayClick\"],null],null],[\"flush-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel row\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel-side column\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel-side-header\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showLeftPanel\"],null],null],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"chevron-left\"],null],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel-side-body row\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel-side-body-container\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"helper\",[\"eq\"],[[\"get\",[\"listMode\"]],\"tasks\"],null]],null,2,1],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel-aside\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"sidenav-list\"],null,[[\"changeSelected\",\"model\",\"mode\",\"register\",\"showLeftPanel\",\"listMode\"],[[\"helper\",[\"route-action\"],[\"changeSelected\"],null],[\"get\",[\"model\"]],[\"get\",[\"mode\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"register\"],null],[\"get\",[\"leftPanel\"]],[\"get\",[\"listMode\"]]]]],false],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showLeftPanel\"]],[\"flush-element\"],[\"text\",\"show\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"          \"],[\"append\",[\"helper\",[\"tag-form\"],null,[[\"title\",\"colors\",\"tag\",\"register\",\"completeTag\",\"saveTag\"],[\"Create Tag\",[\"get\",[\"model\",\"colors\"]],[\"get\",[\"mode\",\"model\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"register\"],null],[\"helper\",[\"route-action\"],[\"completeTag\"],null],[\"helper\",[\"route-action\"],[[\"get\",[\"mode\",\"saveAction\"]]],null]]]],false],[\"text\",\" \\n        \"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"helper\",[\"eq\"],[[\"get\",[\"listMode\"]],\"tags\"],null]],null,0]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"append\",[\"helper\",[\"task-form\"],null,[[\"title\",\"task\",\"tags\",\"register\",\"saveTask\",\"completeTask\"],[\"Edit Task\",[\"get\",[\"mode\",\"model\"]],[\"get\",[\"model\",\"tags\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"register\"],null],[\"helper\",[\"route-action\"],[[\"get\",[\"mode\",\"saveAction\"]]],null],[\"helper\",[\"route-action\"],[\"completeTask\"],null]]]],false],[\"text\",\" \\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/sidenav-panel.hbs" } });
});
define("pomodoro-electron/templates/components/tag-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ILpVw82v", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tag-form-header row\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"mode\"]],false],[\"text\",\" tag\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"helper\",[\"eq\"],[[\"get\",[\"mode\"]],\"edit\"],null]],null,4],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"msgs\"]]],null,3],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\"],[\"text\",[\"get\",[\"tag\",\"name\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\"],[\"text\",[\"get\",[\"tag\",\"description\"]]]]],false],[\"text\",\"\\n\"],[\"block\",[\"dropdown-list\"],null,[[\"items\"],[[\"get\",[\"colors\"]]]],0],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"button-primary\"],[\"static-attr\",\"data-test-tag-save\",\"\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"saveTag\",[\"get\",[\"tag\"]]],null],null],[\"flush-element\"],[\"text\",\"Save\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"append\",[\"helper\",[\"color-option\"],null,[[\"color\"],[[\"get\",[\"color\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"color\"]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"append\",[\"get\",[\"msg\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"msg\"]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"data-test-tag-msgs\",\"\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"msgs\"]]],null,1],[\"text\",\"    \"],[\"close-element\"],[\"text\",\" \\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"info-card\"],null,null,2]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"completeTag\",[\"get\",[\"tag\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n      complete\\n    \"],[\"close-element\"],[\"text\",\"  \\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/tag-form.hbs" } });
});
define("pomodoro-electron/templates/components/task-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "lZTi2hHF", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-form-header row\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"mode\"]],false],[\"text\",\" task\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"helper\",[\"eq\"],[[\"get\",[\"mode\"]],\"edit\"],null]],null,4],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"msgs\"]]],null,3],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\"],[\"text\",[\"get\",[\"task\",\"name\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\"],[\"text\",[\"get\",[\"task\",\"description\"]]]]],false],[\"text\",\"\\n\"],[\"block\",[\"dropdown-list\"],null,[[\"selected\",\"items\"],[[\"get\",[\"task\",\"tag\"]],[\"get\",[\"tags\"]]]],0],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"button-primary\"],[\"static-attr\",\"id\",\"taf-test-saveButton\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"saveTask\",[\"get\",[\"task\"]]],null],null],[\"flush-element\"],[\"text\",\"Save\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"tag\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"tag\"]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"append\",[\"get\",[\"msg\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"msg\"]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"id\",\"taf-test-msgs\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"msgs\"]]],null,1],[\"text\",\"    \"],[\"close-element\"],[\"text\",\" \\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"info-card\"],null,null,2]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"completeTask\",[\"get\",[\"task\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n      complete\\n    \"],[\"close-element\"],[\"text\",\"  \\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/task-form.hbs" } });
});
define("pomodoro-electron/templates/components/task-info", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "NbZSZ6x1", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"state\",\"selectedTask\"]]],null,1,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"text\",\"Select a task first\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"state\",\"selectedTask\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/task-info.hbs" } });
});
define("pomodoro-electron/templates/components/tasks-sidenav", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Q6cbmFgB", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tasks-sidenav-header column\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tasks-sidenav-header-header row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"bars\"],null],false],[\"text\",\"\\n      Tasks\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tasks-sidenav-header-body column\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"type\",\"value\"],[\"Search\",\"text\",[\"get\",[\"search\"]]]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tasks-sidenav-body\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"loading\"]]],null,4,3],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tasks-sidenav-footer\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-footer-opts-container\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showCreateTask\"],null],null],[\"static-attr\",\"class\",\"add-task-container\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"plus\"],null],false],[\"text\",\"\\n      Task\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showCreateTag\"],null],null],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"plus\"],null],false],[\"text\",\"\\n      Tag\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"no-result-container\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"No Tasks\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"toggle\",[\"get\",[\"task\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"task-name\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"unknown\",[\"task\",\"name\"]],false],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"pomodoro-time\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"pomodoro-hours\"],[[\"get\",[\"task\",\"pomodoros\"]]],null],false],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"span\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showEditTask\",[\"get\",[\"task\"]]],null],null],[\"static-attr\",\"class\",\"opt-container\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"ellipsis-v\"],null],false],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"task\"]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"filteredTasks\"]]],null,1],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"  \\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"filteredTasks\"]]],null,2,0]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"loading-container\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-circle-o-notch fa-spin fa-4x fa-fw\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/tasks-sidenav.hbs" } });
});
define("pomodoro-electron/templates/configuration", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "eIiVqaSK", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/configuration.hbs" } });
});
define("pomodoro-electron/templates/main", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ClcYFKNO", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"main-container column\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"main-header\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"task-info\"],null,[[\"state\"],[[\"get\",[\"model\",\"state\"]]]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"main-body\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"clock-comp\"],null,[[\"clock\",\"playPause\",\"stopCB\"],[[\"get\",[\"model\",\"state\",\"clock\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"playPause\"],null],[\"helper\",[\"action\"],[[\"get\",[null]],\"stopClock\"],null]]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/main.hbs" } });
});
define("pomodoro-electron/templates/schedule", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "VBYx0O08", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/schedule.hbs" } });
});
define("pomodoro-electron/templates/statistics", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Uhn7Yd4z", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/statistics.hbs" } });
});
define("pomodoro-electron/templates/testing", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "R62KdK3q", "block": "{\"statements\":[[\"open-element\",\"button\",[]],[\"static-attr\",\"style\",\"float: right;\"],[\"flush-element\"],[\"text\",\"\\n  show\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/testing.hbs" } });
});
define('pomodoro-electron/transforms/attachment', ['exports', 'ember-pouch/transforms/attachment'], function (exports, _emberPouchTransformsAttachment) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPouchTransformsAttachment['default'];
    }
  });
});
define('pomodoro-electron/transforms/attachments', ['exports', 'ember-pouch/transforms/attachments'], function (exports, _emberPouchTransformsAttachments) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberPouchTransformsAttachments['default'];
    }
  });
});


define('pomodoro-electron/config/environment', ['ember'], function(Ember) {
  var prefix = 'pomodoro-electron';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("pomodoro-electron/app")["default"].create({"name":"pomodoro-electron","version":"0.0.0+ca155fd7"});
}
//# sourceMappingURL=pomodoro-electron.map
