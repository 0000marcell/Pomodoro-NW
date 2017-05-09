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

  var pomodoroTime = 5,
      longIntervalTime = 10,
      shortIntervalTime = 5;

  exports['default'] = _ember['default'].Component.extend({
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
      this.get('flipClock').setTime(pomodoroTime);
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
          var interval = _this.get('intervalCount') % 3 === 0 ? longIntervalTime : shortIntervalTime;
          _this.get('flipClock').setTime(interval);
          _this.set('clock.mode', 'interval');
        } else if (_this.get('clock.mode') === 'interval') {
          _this.get('flipClock').setTime(pomodoroTime);
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
define('pomodoro-electron/controllers/application', ['exports', 'ember', 'd3-selection', 'd3-scale'], function (exports, _ember, _d3Selection, _d3Scale) {

  var links = [{ icon: 'clock-o', name: 'schedule', link: 'schedule' }, { icon: 'bar-chart', name: 'statistics', link: 'statistics' }, { icon: 'cog', name: 'configuration', link: 'configuration' }];

  exports['default'] = _ember['default'].Controller.extend({
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
      graphIt: function graphIt() {
        var dataArray = [20, 40, 50];
        var colors = ['#E91E63', '#9C27B0', '#673AB7'];
        var width = 500;
        var height = 500;
        var canvas = (0, _d3Selection.select)(".graph").append("svg").attr('width', 500).attr('height', 500).attr("fill", '#ff00ff');
        var widthScale = (0, _d3Scale.scaleLinear)().domain([0, 60]).range([0, width]);
        var bars = canvas.selectAll("rect").data(dataArray).enter().append("rect").attr("width", function (d) {
          return widthScale(d);
        }).attr("height", 50).attr("fill", function (d, i) {
          return colors[i];
        }).attr("y", function (d, i) {
          return i * 60;
        });
      }
    }
  });
});
define('pomodoro-electron/controllers/main', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    clock: {
      state: 'paused',
      mode: 'pomodoro'
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
define('pomodoro-electron/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('pomodoro-electron/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
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
  });

  exports['default'] = Router;
});
define('pomodoro-electron/routes/application', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    redirect: function redirect() {
      this.transitionTo('main');
    }
  });
});
define('pomodoro-electron/routes/configuration', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('pomodoro-electron/routes/data', ['exports'], function (exports) {
  function createTasks() {
    var obj = { tasks: [] };
    for (var i = 1; i < 6; i++) {
      obj.tasks.push({ id: i + '', name: 'Task ' + i,
        pomodoros: [] });
      for (var j = 1; j < 6; j++) {
        obj.tasks[i - 1].pomodoros.push({ date: new Date() });
      }
    }
    return obj;
  }

  exports['default'] = createTasks();
});
define('pomodoro-electron/routes/main', ['exports', 'ember', 'pomodoro-electron/routes/data'], function (exports, _ember, _pomodoroElectronRoutesData) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return _pomodoroElectronRoutesData['default'];
    }
  });
});
define('pomodoro-electron/routes/schedule', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('pomodoro-electron/routes/statistics', ['exports', 'ember'], function (exports, _ember) {
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
  exports["default"] = Ember.HTMLBars.template({ "id": "LblLb1JL", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"root-div column\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-header row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-header-side row\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"main\"],null,2],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-header-main\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-header-aside row\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"links\"]]],null,1],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"app-body column\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"comment\",\"\\n    {{outlet}}\\n    \"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"              \"],[\"append\",[\"helper\",[\"fa-icon\"],[[\"get\",[\"item\",\"icon\"]]],null],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[[\"get\",[\"item\",\"link\"]]],null,0],[\"text\",\"          \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"item\"]},{\"statements\":[[\"text\",\"        \"],[\"append\",[\"helper\",[\"fa-icon\"],[\"home\"],null],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/application.hbs" } });
});
define("pomodoro-electron/templates/components/flip-clock", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "MVGhIql3", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"clock\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"static-attr\",\"title\",\"Play video\"],[\"dynamic-attr\",\"class\",[\"concat\",[\"play-button \",[\"helper\",[\"if\"],[[\"get\",[\"active\"]],\"active\"],null]]]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"playPause\"]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/components/flip-clock.hbs" } });
});
define("pomodoro-electron/templates/configuration", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "eIiVqaSK", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/configuration.hbs" } });
});
define("pomodoro-electron/templates/main", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "NEjNThLf", "block": "{\"statements\":[[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"tasks\"]]],null,0],[\"close-element\"],[\"text\",\"\\nstate: \"],[\"append\",[\"unknown\",[\"clock\",\"state\"]],false],[\"text\",\"\\nmode: \"],[\"append\",[\"unknown\",[\"clock\",\"mode\"]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"flip-clock\"],null,[[\"clock\"],[[\"get\",[\"clock\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"task\"]}],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/main.hbs" } });
});
define("pomodoro-electron/templates/schedule", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "VBYx0O08", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/schedule.hbs" } });
});
define("pomodoro-electron/templates/statistics", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Uhn7Yd4z", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "pomodoro-electron/templates/statistics.hbs" } });
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
  require("pomodoro-electron/app")["default"].create({"name":"pomodoro-electron","version":"0.0.0+cb0ff4e4"});
}
//# sourceMappingURL=pomodoro-electron.map
