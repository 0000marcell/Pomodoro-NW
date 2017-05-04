'use strict';

define('pomodoro-electron/tests/app.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
});
define('pomodoro-electron/tests/ember-electron/main', ['exports'], function (exports) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  /* jshint node:true */

  var _require = require('electron');

  var app = _require.app;
  var BrowserWindow = _require.BrowserWindow;
  var protocol = _require.protocol;

  var _require2 = require('path');

  var dirname = _require2.dirname;
  var resolve = _require2.resolve;

  var url = require('url');
  var protocolServe = require('electron-protocol-serve');

  var mainWindow = null;

  // The testUrl is a file: url pointing to our index.html, with some query
  // params we need to preserve for testem. So we need to register our ember
  // protocol accordingly.

  var _process$argv = _slicedToArray(process.argv, 3);

  var indexUrl = _process$argv[2];

  var _url$parse = url.parse(indexUrl);

  var indexPath = _url$parse.pathname;
  var indexQuery = _url$parse.search;

  var emberAppLocation = 'serve://dist' + indexQuery;

  protocol.registerStandardSchemes(['serve'], { secure: true });
  // The index.html is in the tests/ directory, so we want all other assets to
  // load from its parent directory
  protocolServe({
    cwd: resolve(dirname(indexPath), '..'),
    app: app,
    protocol: protocol,
    indexPath: indexPath
  });

  app.on('window-all-closed', function onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('ready', function onReady() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      backgroundThrottling: false
    });

    delete mainWindow.module;

    mainWindow.loadURL(emberAppLocation);

    mainWindow.on('closed', function onClosed() {
      mainWindow = null;
    });
  });
});
define('pomodoro-electron/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('pomodoro-electron/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'pomodoro-electron/tests/helpers/start-app', 'pomodoro-electron/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _pomodoroElectronTestsHelpersStartApp, _pomodoroElectronTestsHelpersDestroyApp) {
  var Promise = _ember['default'].RSVP.Promise;

  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _pomodoroElectronTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _pomodoroElectronTestsHelpersDestroyApp['default'])(_this.application);
        });
      }
    });
  };
});
define('pomodoro-electron/tests/helpers/resolver', ['exports', 'pomodoro-electron/resolver', 'pomodoro-electron/config/environment'], function (exports, _pomodoroElectronResolver, _pomodoroElectronConfigEnvironment) {

  var resolver = _pomodoroElectronResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _pomodoroElectronConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _pomodoroElectronConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('pomodoro-electron/tests/helpers/start-app', ['exports', 'ember', 'pomodoro-electron/app', 'pomodoro-electron/config/environment'], function (exports, _ember, _pomodoroElectronApp, _pomodoroElectronConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var attributes = _ember['default'].merge({}, _pomodoroElectronConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    return _ember['default'].run(function () {
      var application = _pomodoroElectronApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('pomodoro-electron/tests/test-helper', ['exports', 'pomodoro-electron/tests/helpers/resolver', 'ember-qunit'], function (exports, _pomodoroElectronTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_pomodoroElectronTestsHelpersResolver['default']);
});
define('pomodoro-electron/tests/tests.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('ember-electron/main.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'ember-electron/main.js should pass ESLint\n\n2:42 - \'require\' is not defined. (no-undef)\n3:30 - \'require\' is not defined. (no-undef)\n4:13 - \'require\' is not defined. (no-undef)\n5:23 - \'require\' is not defined. (no-undef)\n12:24 - \'process\' is not defined. (no-undef)\n30:7 - \'process\' is not defined. (no-undef)');
  });

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
});
require('pomodoro-electron/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
