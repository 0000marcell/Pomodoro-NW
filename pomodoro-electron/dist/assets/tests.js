'use strict';

define('pomodoro-electron/tests/app.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/flip-clock.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/flip-clock.js should pass ESLint\n\n');
  });

  QUnit.test('components/tag-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/tag-form.js should pass ESLint\n\n');
  });

  QUnit.test('components/task-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/task-form.js should pass ESLint\n\n');
  });

  QUnit.test('components/tasks-sidenav.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/tasks-sidenav.js should pass ESLint\n\n');
  });

  QUnit.test('components/tasks-sidepanel.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/tasks-sidepanel.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/application.js should pass ESLint\n\n29:11 - \'height\' is assigned a value but never used. (no-unused-vars)\n38:11 - \'bars\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('controllers/main.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/main.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/pomodoro-hours.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/pomodoro-hours.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/application.js should pass ESLint\n\n17:16 - \'task\' is defined but never used. (no-unused-vars)\n34:15 - \'tag\' is defined but never used. (no-unused-vars)\n35:7 - Unexpected console statement. (no-console)\n38:7 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/configuration.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/configuration.js should pass ESLint\n\n');
  });

  QUnit.test('routes/data.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/data.js should pass ESLint\n\n');
  });

  QUnit.test('routes/main.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/main.js should pass ESLint\n\n');
  });

  QUnit.test('routes/schedule.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/schedule.js should pass ESLint\n\n');
  });

  QUnit.test('routes/statistics.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/statistics.js should pass ESLint\n\n');
  });

  QUnit.test('services/store.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/store.js should pass ESLint\n\n5:5 - Unexpected console statement. (no-console)');
  });
});
define('pomodoro-electron/tests/ember-electron/main', ['exports'], function (exports) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  /*eslint no-undef: "error"*/
  /*global require:true process:true*/

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
define('pomodoro-electron/tests/integration/components/flip-clock-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('flip-clock', 'Integration | Component | flip clock', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'HMWic2eh',
      'block': '{"statements":[["append",["unknown",["flip-clock"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'Fa2ZjApE',
      'block': '{"statements":[["text","\\n"],["block",["flip-clock"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('pomodoro-electron/tests/integration/components/tag-form-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('tag-form', 'Integration | Component | tag form', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'A68lo9Nt',
      'block': '{"statements":[["append",["unknown",["tag-form"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '4NnZXuni',
      'block': '{"statements":[["text","\\n"],["block",["tag-form"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('pomodoro-electron/tests/integration/components/task-form-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('task-form', 'Integration | Component | task form', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '+mGzBZ2D',
      'block': '{"statements":[["append",["unknown",["task-form"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '9XXWGCm/',
      'block': '{"statements":[["text","\\n"],["block",["task-form"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('pomodoro-electron/tests/integration/components/tasks-sidenav-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('tasks-sidenav', 'Integration | Component | tasks sidenav', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '2dOA0Zof',
      'block': '{"statements":[["append",["unknown",["tasks-sidenav"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'myIT/3sY',
      'block': '{"statements":[["text","\\n"],["block",["tasks-sidenav"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('pomodoro-electron/tests/integration/components/tasks-sidepanel-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('tasks-sidepanel', 'Integration | Component | tasks sidepanel', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'MvISRgM3',
      'block': '{"statements":[["append",["unknown",["tasks-sidepanel"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'cYmkxFS6',
      'block': '{"statements":[["text","\\n"],["block",["tasks-sidepanel"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('pomodoro-electron/tests/test-helper', ['exports', 'pomodoro-electron/tests/helpers/resolver', 'ember-qunit'], function (exports, _pomodoroElectronTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_pomodoroElectronTestsHelpersResolver['default']);
});
define('pomodoro-electron/tests/tests.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('ember-electron/main.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'ember-electron/main.js should pass ESLint\n\n');
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

  QUnit.test('integration/components/flip-clock-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/flip-clock-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/tag-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/tag-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/task-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/task-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/tasks-sidenav-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/tasks-sidenav-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/tasks-sidepanel-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/tasks-sidepanel-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/main-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/main-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/helpers/pomodoro-hours-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/pomodoro-hours-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/configuration-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/configuration-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/main-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/main-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/schedule-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/schedule-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/statistics-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/statistics-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/store-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/store-test.js should pass ESLint\n\n');
  });
});
define('pomodoro-electron/tests/unit/controllers/application-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:application', 'Unit | Controller | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('pomodoro-electron/tests/unit/controllers/main-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:main', 'Unit | Controller | main', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('pomodoro-electron/tests/unit/helpers/pomodoro-hours-test', ['exports', 'pomodoro-electron/helpers/pomodoro-hours', 'qunit'], function (exports, _pomodoroElectronHelpersPomodoroHours, _qunit) {

  (0, _qunit.module)('Unit | Helper | pomodoro hours');

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    var result = (0, _pomodoroElectronHelpersPomodoroHours.pomodoroHours)([42]);
    assert.ok(result);
  });
});
define('pomodoro-electron/tests/unit/routes/application-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('pomodoro-electron/tests/unit/routes/configuration-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:configuration', 'Unit | Route | configuration', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('pomodoro-electron/tests/unit/routes/main-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:main', 'Unit | Route | main', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('pomodoro-electron/tests/unit/routes/schedule-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:schedule', 'Unit | Route | schedule', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('pomodoro-electron/tests/unit/routes/statistics-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:statistics', 'Unit | Route | statistics', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('pomodoro-electron/tests/unit/services/store-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('service:store', 'Unit | Service | store', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
require('pomodoro-electron/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
