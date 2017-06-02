'use strict';

define('pomodoro-electron/tests/app.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/color-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/color-option.js should pass ESLint\n\n');
  });

  QUnit.test('components/dropdown-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/dropdown-list.js should pass ESLint\n\n');
  });

  QUnit.test('components/flip-clock.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/flip-clock.js should pass ESLint\n\n');
  });

  QUnit.test('components/info-card.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/info-card.js should pass ESLint\n\n');
  });

  QUnit.test('components/pop-dialog.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/pop-dialog.js should pass ESLint\n\n');
  });

  QUnit.test('components/sidenav-list.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/sidenav-list.js should pass ESLint\n\n39:9 - Unexpected console statement. (no-console)');
  });

  QUnit.test('components/sidenav-panel.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/sidenav-panel.js should pass ESLint\n\n');
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

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/application.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/main.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/main.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/testing.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/testing.js should pass ESLint\n\n8:8 - Unexpected console statement. (no-console)\n12:10 - Unexpected console statement. (no-console)');
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
    assert.ok(false, 'routes/application.js should pass ESLint\n\n33:7 - Unexpected console statement. (no-console)\n49:7 - Unexpected console statement. (no-console)');
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

  QUnit.test('routes/testing.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/testing.js should pass ESLint\n\n');
  });

  QUnit.test('services/store.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/store.js should pass ESLint\n\n5:45 - \'reject\' is defined but never used. (no-unused-vars)\n7:7 - Unexpected console statement. (no-console)');
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
define('pomodoro-electron/tests/helpers/ember-test-selectors', ['exports', 'ember', 'ember-test-selectors'], function (exports, _ember, _emberTestSelectors) {
  var deprecate = _ember['default'].deprecate;

  var message = 'Importing testSelector() from "<appname>/tests/helpers/ember-test-selectors" is deprecated. ' + 'Please import testSelector() from "ember-test-selectors" instead.';

  deprecate(message, false, {
    id: 'ember-test-selectors.test-selector-import',
    until: '0.2.0',
    url: 'https://github.com/simplabs/ember-test-selectors#usage'
  });

  exports['default'] = _emberTestSelectors['default'];
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
define('pomodoro-electron/tests/integration/components/color-option-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('color-option', 'Integration | Component | color option', {
    integration: true
  });

  (0, _emberQunit.test)('#color-option-01 it show a clock with the color passed', function (assert) {

    this.set('color', { id: 1, value: '#ff00ff' });
    this.render(Ember.HTMLBars.template({
      'id': 'rXLjRxAw',
      'block': '{"statements":[["append",["helper",["color-option"],null,[["color"],[["get",["color"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    var result = this.$('#co-test-block').css('background-color');
    assert.equal(result, 'rgb(255, 0, 255)');
  });
});
define('pomodoro-electron/tests/integration/components/dropdown-list-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('dropdown-list', 'Integration | Component | dropdown list', {
    integration: true
  });

  (0, _emberQunit.test)('#dropdown-list-01 shows a list of items', function (assert) {
    this.set('items', [{ id: 1, name: 'pink', value: '#ff00ff' }, { id: 2, name: 'red', value: '#ff0000' }]);
    this.render(Ember.HTMLBars.template({
      'id': 'uNa+bywi',
      'block': '{"statements":[["text","\\n"],["block",["dropdown-list"],null,[["items"],[["get",["items"]]]],0]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      "],["open-element","p",[]],["flush-element"],["append",["unknown",["item","name"]],false],["close-element"],["text","\\n"]],"locals":["color"]}],"hasPartials":false}',
      'meta': {}
    }));
    assert.equal(this.$('#dl-test-list li').length, 1);
  });
});
define('pomodoro-electron/tests/integration/components/flip-clock-test', ['exports', 'ember-qunit', 'ember-test-helpers/wait', 'ember'], function (exports, _emberQunit, _emberTestHelpersWait, _ember) {

  (0, _emberQunit.moduleForComponent)('flip-clock', 'Integration | Component | flip clock', {
    integration: true
  });

  (0, _emberQunit.test)('#flip-clock-01 it renders a clock', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    var clock = { state: 'paused', mode: 'pomodoro' };
    this.set('clock', clock);
    this.render(_ember['default'].HTMLBars.template({
      'id': 'qd51EArQ',
      'block': '{"statements":[["append",["helper",["flip-clock"],null,[["clock"],[["get",["clock"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    assert.equal(this.$('.flip-clock').length, 1);
  });

  (0, _emberQunit.test)('#flip-clock-02 it shows the correct time', function (assert) {
    var clock = {
      state: 'paused',
      mode: 'pomodoro',
      time: 15
    };
    this.set('clock', clock);
    this.set('flipClock', null);
    this.render(_ember['default'].HTMLBars.template({
      'id': 'HNuUO9Hw',
      'block': '{"statements":[["append",["helper",["flip-clock"],null,[["flipClock","clock"],[["get",["flipClock"]],["get",["clock"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    assert.equal(this.get('flipClock').getTime().time, 14);
  });

  (0, _emberQunit.test)('#flip-clock-03 it starts the clock', function (assert) {
    var _this = this;

    var clock = {
      state: 'paused',
      mode: 'pomodoro',
      time: 5
    };
    this.set('clock', clock);
    this.set('flipClock', null);
    this.render(_ember['default'].HTMLBars.template({
      'id': 'HNuUO9Hw',
      'block': '{"statements":[["append",["helper",["flip-clock"],null,[["flipClock","clock"],[["get",["flipClock"]],["get",["clock"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    this.$('#fc-test-startbtn').click();
    _ember['default'].run(this, function () {
      assert.equal(_this.get('flipClock').getTime().time, 3);
    });
  });

  (0, _emberQunit.test)('#flip-clock-04 it stops the clock', function (assert) {
    var _this2 = this;

    var clock = {
      state: 'paused',
      mode: 'pomodoro',
      time: 5
    };
    this.set('clock', clock);
    this.render(_ember['default'].HTMLBars.template({
      'id': 'qd51EArQ',
      'block': '{"statements":[["append",["helper",["flip-clock"],null,[["clock"],[["get",["clock"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    this.$('#fc-test-startbtn').click();
    _ember['default'].run(this, function () {
      _this2.$('#fc-test-startbtn').click();
      _ember['default'].run(_this2, function () {
        assert.equal(_this2.get('clock.state'), 'paused');
      });
    });
  });

  (0, _emberQunit.test)('#flip-clock-05 goes to interval mode', function (assert) {
    var _this3 = this;

    var clock = {
      state: 'paused',
      mode: 'pomodoro',
      time: 2,
      shortInterval: 5
    };
    this.set('clock', clock);
    this.render(_ember['default'].HTMLBars.template({
      'id': 'qd51EArQ',
      'block': '{"statements":[["append",["helper",["flip-clock"],null,[["clock"],[["get",["clock"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    this.$('#fc-test-startbtn').click();
    return new _ember['default'].RSVP.Promise(function (resolve, reject) {
      var wait = setInterval(function () {
        assert.equal(_this3.get('clock.mode'), 'interval');
        _this3.$('#fc-test-startbtn').click();
        clearInterval(wait);
        resolve();
      }, 3000);
    });
  });

  (0, _emberQunit.test)('#flip-clock-06 comes out of interval mode', function (assert) {
    var _this4 = this;

    var clock = {
      state: 'paused',
      mode: 'pomodoro',
      time: 2,
      shortInterval: 2
    };
    this.set('clock', clock);
    this.render(_ember['default'].HTMLBars.template({
      'id': 'qd51EArQ',
      'block': '{"statements":[["append",["helper",["flip-clock"],null,[["clock"],[["get",["clock"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    this.$('#fc-test-startbtn').click();
    return new _ember['default'].RSVP.Promise(function (resolve) {
      var wait = setInterval(function () {
        assert.equal(_this4.get('clock.mode'), 'interval');
        _this4.$('#fc-test-startbtn').click();
        clearInterval(wait);
        resolve();
      }, 4000);
    });
  });
});
define('pomodoro-electron/tests/integration/components/info-card-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('info-card', 'Integration | Component | info card', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'Bx2W2tn3',
      'block': '{"statements":[["append",["unknown",["info-card"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '61yuDTWj',
      'block': '{"statements":[["text","\\n"],["block",["info-card"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('pomodoro-electron/tests/integration/components/pop-dialog-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('pop-dialog', 'Integration | Component | pop dialog', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'opuZ4rTW',
      'block': '{"statements":[["append",["unknown",["pop-dialog"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'g/WH0x+9',
      'block': '{"statements":[["text","\\n"],["block",["pop-dialog"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('pomodoro-electron/tests/integration/components/sidenav-list-test', ['exports', 'ember', 'ember-qunit'], function (exports, _ember, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('sidenav-list', 'Integration | Component | sidenav list', {
    integration: true
  });

  var baseObj = {
    storage: {
      tasks: [{ id: 1, name: 'task 1',
        description: 'description 1', pomodoros: [] }, { id: 2, name: 'task 2', description: 'description 2',
        pomodoros: [] }],
      tags: [{ id: 1, name: 'work',
        description: 'work!', color: '#ff00ff' }, { id: 2, name: 'learning', description: 'learning!',
        color: '#fff00' }] }
  };

  (0, _emberQunit.test)('#sidenav-list-01 shows a list of tasks', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    var data = JSON.parse(JSON.stringify(baseObj));
    this.set('model', data);
    this.set('listMode', 'tasks');
    this.render(_ember['default'].HTMLBars.template({
      'id': '+M9AoxUG',
      'block': '{"statements":[["append",["helper",["sidenav-list"],null,[["listMode","model"],[["get",["listMode"]],["get",["model"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    assert.equal(this.$('li').length, 2);
  });

  (0, _emberQunit.test)('#sidenav-list-02 shows a list of tags', function (assert) {
    var data = JSON.parse(JSON.stringify(baseObj));
    this.set('model', data);
    this.set('listMode', 'tags');
    this.render(_ember['default'].HTMLBars.template({
      'id': '+M9AoxUG',
      'block': '{"statements":[["append",["helper",["sidenav-list"],null,[["listMode","model"],[["get",["listMode"]],["get",["model"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    assert.equal(this.$('li').length, 2);
  });

  (0, _emberQunit.test)('#sidenav-list-03 searchs the list', function (assert) {
    var _this = this;

    var data = JSON.parse(JSON.stringify(baseObj));
    this.set('model', data);
    this.set('listMode', 'tags');
    this.render(_ember['default'].HTMLBars.template({
      'id': '+M9AoxUG',
      'block': '{"statements":[["append",["helper",["sidenav-list"],null,[["listMode","model"],[["get",["listMode"]],["get",["model"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    this.$('#sl-test-search').val('learning');
    this.$('#sl-test-search').trigger('keyup');
    return new _ember['default'].RSVP.Promise(function (resolve) {
      var wait = setInterval(function () {
        assert.equal(_this.$('li').length, 1);
        clearInterval(wait);
        resolve();
      }, 700);
    });
  });
});
define('pomodoro-electron/tests/integration/components/sidenav-panel-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('sidenav-panel', 'Integration | Component | sidenav panel', {
    integration: true
  });

  (0, _emberQunit.test)('#sidenav-panel-01 it opens the panel', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('openSidenav', true);
    this.render(Ember.HTMLBars.template({
      'id': 'Fp/c9YpB',
      'block': '{"statements":[["append",["helper",["sidenav-panel"],null,[["openSidenav"],[["get",["openSidenav"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    assert.equal(this.$('.open-sidenav').length, 1);
  });

  (0, _emberQunit.test)('#sidenav-panel-02 opens left panel', function (assert) {
    this.set('leftPanel', true);
    this.render(Ember.HTMLBars.template({
      'id': 'uq4wkitt',
      'block': '{"statements":[["append",["helper",["sidenav-panel"],null,[["leftPanel"],[["get",["leftPanel"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    assert.equal(this.$('.left-panel').length, 1);
  });

  (0, _emberQunit.test)('#sidenav-panel-03 closes the panel on overlay click', function (assert) {
    this.set('leftPanel', true);
    this.set('openSidenav', true);
    this.render(Ember.HTMLBars.template({
      'id': 'BXAEXEd+',
      'block': '{"statements":[["append",["helper",["sidenav-panel"],null,[["leftPanel","openSidenav"],[["get",["leftPanel"]],["get",["openSidenav"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    this.$('#sp-test-overlaybtn').click();
    assert.equal(this.$('.open-sidenav').length, 0);
    assert.equal(this.$('.left-panel').length, 0);
  });
});
define('pomodoro-electron/tests/integration/components/tag-form-test', ['exports', 'ember-qunit', 'ember-test-selectors'], function (exports, _emberQunit, _emberTestSelectors) {

  (0, _emberQunit.moduleForComponent)('tag-form', 'Integration | Component | tag form', {
    integration: true
  });

  var baseTag = { name: 'work', description: 'work',
    color: '#ff00ff' };

  var baseModel = { tasks: [], tags: [{ id: 1, name: 'learning',
      description: 'learning', color: '#fff000' }] };

  (0, _emberQunit.test)('#tag-form-01 it creates a tag, shows a msg', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('tag', JSON.parse(JSON.stringify(baseTag)));
    this.set('saveTag', function (newTag) {
      assert.deepEqual(newTag, baseTag);
      return new Ember.RSVP.Promise(function (resolve, reject) {
        if (newTag.name && newTag.description && newTag.color) {
          resolve();
        } else {
          reject();
        }
      });
    });
    this.render(Ember.HTMLBars.template({
      'id': 'vr64Xwm8',
      'block': '{"statements":[["append",["helper",["tag-form"],null,[["saveTag","tag"],[["get",["saveTag"]],["get",["tag"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    this.$((0, _emberTestSelectors['default'])('tag-save')).click();
    assert.equal(this.$((0, _emberTestSelectors['default'])('tag-msgs')).text().trim(), 'tag saved!');
  });

  (0, _emberQunit.test)('#tag-form-02 it shows an error msg', function (assert) {
    this.set('tag', { name: '', description: '' });
    this.set('saveTag', function (newTag) {
      return new Ember.RSVP.Promise(function (resolve, reject) {
        if (newTag.name && newTag.description && newTag.color) {
          resolve();
        } else {
          reject();
        }
      });
    });
    this.render(Ember.HTMLBars.template({
      'id': 'vr64Xwm8',
      'block': '{"statements":[["append",["helper",["tag-form"],null,[["saveTag","tag"],[["get",["saveTag"]],["get",["tag"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    this.$('#tf-test-saveButton').click();
    assert.equal(this.$('#tf-test-msgs').text().trim(), 'an error occored!');
  });

  (0, _emberQunit.test)('#tag-form-03 shows a list of colors passed', function (assert) {
    this.set('colors', [{ id: 1, name: 'pink', value: '#ff00ff' }, { id: 2, name: 'red', value: '#ff0000' }]);
    this.render(Ember.HTMLBars.template({
      'id': 'PUMTD9g3',
      'block': '{"statements":[["append",["helper",["tag-form"],null,[["colors"],[["get",["colors"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    assert.equal(this.$('#tf-test-colorList option').length, 2);
  });
});
define('pomodoro-electron/tests/integration/components/task-form-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('task-form', 'Integration | Component | task form', {
    integration: true
  });

  var baseModel = { tasks: [{ id: 1, name: 'Task 1',
      description: 'Task 2', pomodoros: [] }, { id: 2,
      name: 'Task 2', description: 'Task 2', pomodoros: [] }],
    tags: [{ id: 1, name: 'learning',
      description: 'learning', color: '#fff000' }, { id: 2, name: 'work', description: 'work', color: '#ff00ff' }] };

  (0, _emberQunit.test)('#task-form-01 it shows task form with a select of tags', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('model', JSON.parse(JSON.stringify(baseModel)));
    this.render(Ember.HTMLBars.template({
      'id': 'mS7Gmtsz',
      'block': '{"statements":[["append",["helper",["task-form"],null,[["tags"],[["get",["model","tags"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    assert.equal(this.$('#taf-test-tagsList option').length, 2);
  });

  (0, _emberQunit.test)('#task-form-02 it create a task shows a msg', function (assert) {
    this.set('newTask', { name: 'Task 2',
      description: 'Task 2', pomodoros: [] });
    this.set('saveAction', function (newTask) {
      return new Ember.RSVP.Promise(function (resolve, reject) {
        if (newTask.name && newTask.description) {
          resolve();
        } else {
          reject();
        }
      });
    });
    this.render(Ember.HTMLBars.template({
      'id': '6HzgALiC',
      'block': '{"statements":[["append",["helper",["task-form"],null,[["task","saveTask"],[["get",["newTask"]],["get",["saveAction"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    this.$('#taf-test-saveButton').click();
    assert.equal(this.$('#taf-test-msgs li').length, 1);
  });

  (0, _emberQunit.test)('#task-form-03 dont create a task show error msg', function (assert) {
    this.set('newTask', { name: 'Task 3',
      description: null, pomodoros: [] });
    this.set('saveAction', function (newTask) {
      return new Ember.RSVP.Promise(function (resolve, reject) {
        if (newTask.name && newTask.description) {
          resolve();
        } else {
          reject();
        }
      });
    });
    this.render(Ember.HTMLBars.template({
      'id': '6HzgALiC',
      'block': '{"statements":[["append",["helper",["task-form"],null,[["task","saveTask"],[["get",["newTask"]],["get",["saveAction"]]]]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));
    this.$('#taf-test-saveButton').click();
    assert.equal(this.$('#taf-test-msgs li').length, 1);
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

  QUnit.test('integration/components/color-option-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/color-option-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/dropdown-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/dropdown-list-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/flip-clock-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'integration/components/flip-clock-test.js should pass ESLint\n\n3:8 - \'wait\' is defined but never used. (no-unused-vars)\n84:43 - \'reject\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('integration/components/info-card-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/info-card-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/pop-dialog-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/pop-dialog-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/sidenav-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/sidenav-list-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/sidenav-panel-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/sidenav-panel-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/tag-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'integration/components/tag-form-test.js should pass ESLint\n\n13:7 - \'baseModel\' is assigned a value but never used. (no-unused-vars)\n24:16 - \'Ember\' is not defined. (no-undef)\n42:16 - \'Ember\' is not defined. (no-undef)');
  });

  QUnit.test('integration/components/task-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'integration/components/task-form-test.js should pass ESLint\n\n31:16 - \'Ember\' is not defined. (no-undef)\n51:16 - \'Ember\' is not defined. (no-undef)');
  });

  QUnit.test('integration/components/tasks-sidenav-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/tasks-sidenav-test.js should pass ESLint\n\n');
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

  QUnit.test('unit/controllers/testing-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/testing-test.js should pass ESLint\n\n');
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

  QUnit.test('unit/routes/testing-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/testing-test.js should pass ESLint\n\n');
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
define('pomodoro-electron/tests/unit/controllers/testing-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('controller:testing', 'Unit | Controller | testing', {
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
define('pomodoro-electron/tests/unit/routes/testing-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:testing', 'Unit | Route | testing', {
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
