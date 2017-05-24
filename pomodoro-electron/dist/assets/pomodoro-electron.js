"use strict";



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
define('pomodoro-electron/components/sidenav-list', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['sidenav-list'],
    didReceiveAttrs: function didReceiveAttrs() {
      this.set('filteredList', this.get('model.storage.' + this.get('listMode')));
    },
    loading: false,
    actions: {
      searchList: function searchList() {
        var _this = this;

        this.set('loading', true);
        _ember['default'].run.later(this, function () {
          var regex = new RegExp(_this.get('search'), 'i');
          var model = _this.get('model.storage.' + _this.get('listMode'));
          console.log('model', model);
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
        this.set('state.selectedItem', item);
      },
      showLeftPanel: function showLeftPanel(item) {
        this.set('mode', 'editTag');
        this.set('showLeftPanel', true);
        if (item) {
          this.set('model.state.selectedItem', item);
        } else {
          this.set('model.state.selectedItem', null);
        }
      },
      changeListMode: function changeListMode(mode) {
        this.set('listMode', mode);
      }
    }
  });
});
define('pomodoro-electron/components/sidenav-panel', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNameBindings: ['openSidenav', 'leftPanel'],
    listMode: 'tasks',
    newTag: { name: null, description: null,
      color: null },
    newTask: { name: null, description: null,
      pomodoros: [] },
    actions: {
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
    classNames: ['edit-tag-comp', 'column'],
    didInsertElement: function didInsertElement() {
      this.set('msgs', []);
    },
    title: 'new task',
    tag: { name: '', description: '',
      color: '' },
    actions: {
      saveTag: function saveTag(tag) {
        var _this = this;

        this.get('saveTag')(tag).then(function () {
          _this.set('msgs', ['tag saved!']);
        })['catch'](function () {
          _this.set('msgs', ['an error occored!']);
        });
      }
    }
  });
});
define('pomodoro-electron/components/task-form', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['edit-task-comp', 'column'],
    actions: {
      saveTask: function saveTask(task) {
        this.get('saveTask')(task);
      }
    }
  });
});
define('pomodoro-electron/components/tasks-sidenav', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['sidenav-panel'],
    didInsertElement: function didInsertElement() {
      this.set('filteredTasks', this.get('model.storage.tasks'));
    },
    loading: false,
    searchResults: _ember['default'].observer('search', function () {
      var _this = this;

      this.set('loading', true);
      _ember['default'].run.later(this, function () {
        var regex = new RegExp(_this.get('search'), 'i');
        var result = _this.get('model.storage.tasks').filter(function (item) {
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

  var links = [{ icon: 'clock-o', name: 'schedule', link: 'schedule' }, { icon: 'bar-chart', name: 'statistics', link: 'statistics' }, { icon: 'cog', name: 'configuration', link: 'configuration' }];

  exports['default'] = _ember['default'].Controller.extend({
    openSidenav: true,
    links: links,
    clock: {
      state: 'paused',
      mode: 'pomodoro'
    },
    savePomodoro: _ember['default'].computed('clock', function () {
      if (this.get('clock.mode') === 'interval') {
        alert('save pomodoro!');
      }
    }),
    actions: {
      showSidenav: function showSidenav() {
        this.toggleProperty('openSidenav');
      }
    }
  });
});
define('pomodoro-electron/controllers/main', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    clock: {
      state: 'paused',
      mode: 'pomodoro',
      time: 5,
      shortInterval: 10,
      longInterval: 10
    }
  });
});
define('pomodoro-electron/controllers/testing', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    colors: [{ id: 1, name: 'pink', value: '#ff00ff' }, { id: 2, name: 'red', value: '#ff0000' }]
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
    store: _ember['default'].inject.service(),
    data: {
      storage: _pomodoroElectronRoutesData['default'],
      state: { selectedTask: null,
        selectedTag: null }
    },
    model: function model() {
      return this.get('data');
    },
    redirect: function redirect() {
      //this.transitionTo('main');
    },
    saveToStore: function saveToStore() {
      this.get('store').persist(this.get('data.storage'));
    },
    actions: {
      createTask: function createTask(task) {
        console.log('create task: ', task);
        this.saveToStore();
      },
      editTask: function editTask() {
        console.log('edit task');
        this.saveToStore();
      },
      createTag: function createTag(tag) {
        console.log('create tag!', tag);
        this.saveToStore();
      },
      editTag: function editTag() {
        console.log('edit tag!');
        this.saveToStore();
      }
    }
  });
});
define('pomodoro-electron/routes/configuration', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('pomodoro-electron/routes/data', ['exports'], function (exports) {
  var obj = { tasks: [],
    tags: [{ id: 1, name: 'work',
      description: 'work!', color: '#ff00ff' }, { id: 2, name: 'learning', description: 'learning!',
      color: '#fff00' }] };

  function createTasks() {
    for (var i = 1; i < 6; i++) {
      obj.tasks.push({ id: i + '', name: 'Task ' + i,
        description: 'description ' + i,
        pomodoros: [] });
      for (var j = 1; j < 6; j++) {
        obj.tasks[i - 1].pomodoros.push({ date: new Date() });
      }
    }
    return obj;
  }

  exports['default'] = createTasks();
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
define('pomodoro-electron/services/store', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Service.extend({
    persist: function persist() {
      console.log('persist!');
    }
  });
});
define("pomodoro-electron/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "lIbfBLu+", "block": "{\"statements\":[[\"append\",[\"helper\",[\"sidenav-panel\"],null,[[\"createTask\",\"editTask\",\"createTag\",\"editTag\",\"openSidenav\",\"model\"],[[\"helper\",[\"route-action\"],[\"createTask\"],null],[\"helper\",[\"route-action\"],[\"editTask\"],null],[\"helper\",[\"route-action\"],[\"createTag\"],null],[\"helper\",[\"route-action\"],[\"editTag\"],null],[\"get\",[\"openSidenav\"]],[\"get\",[\"model\"]]]]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tasks-button\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showSidenav\"]],[\"flush-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"bars\"],null],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"root-div column\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-header row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-header-side row\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"menu-options\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"main\"],null,2],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-header-main\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-header-aside row\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"menu-options\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"links\"]]],null,1],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-body row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-body-container\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"              \"],[\"append\",[\"helper\",[\"fa-icon\"],[[\"get\",[\"item\",\"icon\"]]],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[[\"get\",[\"item\",\"link\"]]],null,0],[\"text\",\"          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"item\"]},{\"statements\":[[\"text\",\"            \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"home\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/application.hbs" } });
});
define("pomodoro-electron/templates/components/flip-clock", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "zYlwRvN5", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"clock\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"id\",\"fc-test-startbtn\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"playPause\"],null],null],[\"static-attr\",\"href\",\"#\"],[\"static-attr\",\"title\",\"Start clock\"],[\"dynamic-attr\",\"class\",[\"concat\",[\"play-button \",[\"helper\",[\"if\"],[[\"get\",[\"active\"]],\"active\"],null]]]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/flip-clock.hbs" } });
});
define("pomodoro-electron/templates/components/sidenav-list", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "zw18pnYW", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-header column\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-header-header row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"bars\"],null],false],[\"text\",\"\\n      \"],[\"append\",[\"unknown\",[\"listMode\"]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-header-body column\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"id\",\"key-up\",\"type\",\"value\"],[\"Search\",\"sl-test-search\",[\"helper\",[\"action\"],[[\"get\",[null]],\"searchList\"],null],\"text\",[\"get\",[\"search\"]]]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showLeftPanel\"],null],null],[\"static-attr\",\"class\",\"add-item-container\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"plus\"],null],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-body\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"loading\"]]],null,5,4],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-list-footer\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-footer-opts-container\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"changeListMode\",\"tasks\"],null],null],[\"flush-element\"],[\"text\",\"\\n      Tasks\\n    \"],[\"close-element\"],[\"text\",\" \\n    \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"changeListMode\",\"tags\"],null],null],[\"flush-element\"],[\"text\",\"\\n      Tags\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"no-result-container\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"No Items\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                  \"],[\"append\",[\"helper\",[\"pomodoro-hours\"],[[\"get\",[\"item\",\"pomodoros\"]]],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"toggle\",[\"get\",[\"item\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"item-name\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"unknown\",[\"item\",\"name\"]],false],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"pomodoro-time\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"item\",\"pomodoros\"]]],null,1],[\"text\",\"              \"],[\"close-element\"],[\"text\",\"  \\n              \"],[\"open-element\",\"span\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showLeftPanel\",[\"get\",[\"item\"]]],null],null],[\"static-attr\",\"class\",\"opt-container\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"ellipsis-v\"],null],false],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"item\"]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"filteredList\"]]],null,2],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"  \\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"filteredList\"]]],null,3,0]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"loading-container\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-circle-o-notch fa-spin fa-4x fa-fw\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/sidenav-list.hbs" } });
});
define("pomodoro-electron/templates/components/sidenav-panel", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "eC5ISusF", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel-overlay\"],[\"static-attr\",\"id\",\"sp-test-overlaybtn\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"overlayClick\"],null],null],[\"flush-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel row\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel-side column\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel-side-header\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showLeftPanel\"],null],null],[\"flush-element\"],[\"text\",\"\\n        \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"chevron-left\"],null],false],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel-side-body row\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel-side-body-container\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"helper\",[\"eq\"],[[\"get\",[\"mode\"]],\"editTask\"],null]],null,6,5],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-panel-aside\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"sidenav-list\"],null,[[\"model\",\"mode\",\"showLeftPanel\",\"listMode\"],[[\"get\",[\"model\"]],[\"get\",[\"mode\"]],[\"get\",[\"leftPanel\"]],[\"get\",[\"listMode\"]]]]],false],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showLeftPanel\"]],[\"flush-element\"],[\"text\",\"show\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"          \"],[\"append\",[\"helper\",[\"tag-form\"],null,[[\"title\",\"tag\",\"saveTag\"],[\"Edit Tag\",[\"get\",[\"model\",\"state\",\"selectedTag\"]],[\"helper\",[\"route-action\"],[\"editTag\"],null]]]],false],[\"text\",\"\\n        \"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"helper\",[\"eq\"],[[\"get\",[\"mode\"]],\"editTag\"],null]],null,0]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"append\",[\"helper\",[\"tag-form\"],null,[[\"title\",\"tag\",\"saveTag\"],[\"Create Tag\",[\"get\",[\"newTag\"]],[\"helper\",[\"route-action\"],[\"createTag\"],null]]]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"helper\",[\"eq\"],[[\"get\",[\"mode\"]],\"createTag\"],null]],null,2,1]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"append\",[\"helper\",[\"task-form\"],null,[[\"title\",\"task\",\"saveTask\",\"task\"],[\"Create Task\",[\"get\",[\"newTask\"]],[\"helper\",[\"route-action\"],[\"createTask\"],null],[\"get\",[\"newObj\"]]]]],false],[\"text\",\" \\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"helper\",[\"eq\"],[[\"get\",[\"mode\"]],\"createTask\"],null]],null,4,3]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"append\",[\"helper\",[\"task-form\"],null,[[\"title\",\"task\",\"saveTask\",\"task\"],[\"Edit Task\",[\"get\",[\"model\",\"state\",\"selectedTask\"]],[\"helper\",[\"route-action\"],[\"editTask\"],null],[\"get\",[\"selectedTask\"]]]]],false],[\"text\",\" \\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/sidenav-panel.hbs" } });
});
define("pomodoro-electron/templates/components/tag-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "6BvROepR", "block": "{\"statements\":[[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"title\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"msgs\"]]],null,2],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\"],[\"text\",[\"get\",[\"tag\",\"name\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\"],[\"text\",[\"get\",[\"tag\",\"description\"]]]]],false],[\"text\",\"\\n\"],[\"open-element\",\"select\",[]],[\"static-attr\",\"id\",\"tf-test-colorList\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"colors\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"button-primary\"],[\"static-attr\",\"id\",\"tf-test-saveButton\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"saveTag\",[\"get\",[\"tag\"]]],null],null],[\"flush-element\"],[\"text\",\"Save\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"option\",[]],[\"dynamic-attr\",\"value\",[\"unknown\",[\"color\",\"id\"]],null],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"div\",[]],[\"dynamic-attr\",\"style\",[\"concat\",[\"background-color: \",[\"unknown\",[\"color\",\"value\"]]]]],[\"static-attr\",\"class\",\"color-block\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"color\"]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"append\",[\"get\",[\"msg\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"msg\"]},{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"id\",\"tf-test-msgs\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"msgs\"]]],null,1],[\"text\",\"  \"],[\"close-element\"],[\"text\",\" \\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/tag-form.hbs" } });
});
define("pomodoro-electron/templates/components/task-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "qN611J7P", "block": "{\"statements\":[[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"mode\"]],false],[\"text\",\" Task\"],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\"],[\"text\",[\"get\",[\"task\",\"name\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"value\"],[\"text\",[\"get\",[\"task\",\"description\"]]]]],false],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"button-primary\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"saveTask\",[\"get\",[\"task\"]]],null],null],[\"flush-element\"],[\"text\",\"Save\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/task-form.hbs" } });
});
define("pomodoro-electron/templates/components/tasks-sidenav", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Q6cbmFgB", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tasks-sidenav-header column\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tasks-sidenav-header-header row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h3\",[]],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"bars\"],null],false],[\"text\",\"\\n      Tasks\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tasks-sidenav-header-body column\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"type\",\"value\"],[\"Search\",\"text\",[\"get\",[\"search\"]]]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tasks-sidenav-body\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"loading\"]]],null,4,3],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tasks-sidenav-footer\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sidenav-footer-opts-container\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showCreateTask\"],null],null],[\"static-attr\",\"class\",\"add-task-container\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"plus\"],null],false],[\"text\",\"\\n      Task\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showCreateTag\"],null],null],[\"flush-element\"],[\"text\",\"\\n      \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"plus\"],null],false],[\"text\",\"\\n      Tag\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"no-result-container\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"No Tasks\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"li\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"toggle\",[\"get\",[\"task\"]]],null],null],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"task-name\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"unknown\",[\"task\",\"name\"]],false],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"pomodoro-time\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"pomodoro-hours\"],[[\"get\",[\"task\",\"pomodoros\"]]],null],false],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"span\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showEditTask\",[\"get\",[\"task\"]]],null],null],[\"static-attr\",\"class\",\"opt-container\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"ellipsis-v\"],null],false],[\"text\",\"\\n              \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"task\"]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"filteredTasks\"]]],null,1],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"  \\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"filteredTasks\"]]],null,2,0]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"loading-container\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-circle-o-notch fa-spin fa-4x fa-fw\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/tasks-sidenav.hbs" } });
});
define("pomodoro-electron/templates/configuration", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "eIiVqaSK", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/configuration.hbs" } });
});
define("pomodoro-electron/templates/main", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+Okzdu4k", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"main-container column\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"main-body\"],[\"flush-element\"],[\"text\",\"\\n    state: \"],[\"append\",[\"unknown\",[\"clock\",\"state\"]],false],[\"text\",\"\\n    mode: \"],[\"append\",[\"unknown\",[\"clock\",\"mode\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"flip-clock\"],null,[[\"clock\"],[[\"get\",[\"clock\"]]]]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/main.hbs" } });
});
define("pomodoro-electron/templates/schedule", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "VBYx0O08", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/schedule.hbs" } });
});
define("pomodoro-electron/templates/statistics", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Uhn7Yd4z", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/statistics.hbs" } });
});
define("pomodoro-electron/templates/testing", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "FitIAgnM", "block": "{\"statements\":[[\"append\",[\"helper\",[\"tag-form\"],null,[[\"title\",\"colors\"],[\"new tag\",[\"get\",[\"colors\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/testing.hbs" } });
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
  require("pomodoro-electron/app")["default"].create({"name":"pomodoro-electron","version":"0.0.0+e8b04752"});
}
//# sourceMappingURL=pomodoro-electron.map
