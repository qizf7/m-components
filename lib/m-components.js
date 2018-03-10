"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.mc = f();
  }
})(function () {
  var define, module, exports;return function () {
    function e(t, n, r) {
      function s(o, u) {
        if (!n[o]) {
          if (!t[o]) {
            var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
          }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
            var n = t[o][1][e];return s(n ? n : e);
          }, l, l.exports, e, t, n, r);
        }return n[o].exports;
      }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
      }return s;
    }return e;
  }()({ 1: [function (require, module, exports) {
      var prefix = 'mc-tab';

      var tabs = document.querySelectorAll("." + prefix + "-group");

      var Tab = function () {
        function Tab(tab) {
          _classCallCheck(this, Tab);

          this.btnGroup = tab.querySelector("." + prefix + "-items");
          this.btns = tab.querySelectorAll("." + prefix + "-item");
          this.panels = tab.querySelectorAll("." + prefix + "-panel");

          this.btns.forEach(function (btn, index) {
            btn.setAttribute('data-index', index);
          });
        }

        _createClass(Tab, [{
          key: "active",
          value: function active(index) {
            this.btns.forEach(function (item, btnIndex) {
              var classList = item.classList;
              if (index == btnIndex) {
                classList.add('active');
              } else {
                classList.remove('active');
              }
            });

            this.panels.forEach(function (item, panelIndex) {
              var classList = item.classList;
              if (index == panelIndex) {
                classList.add('active');
              } else {
                classList.remove('active');
              }
            });
          }
        }, {
          key: "handleClickBtn",
          value: function handleClickBtn(e) {
            var index = e.target.getAttribute('data-index');
            this.active(index);
          }
        }, {
          key: "addListeners",
          value: function addListeners() {
            this.btnGroup.addEventListener('click', this.handleClickBtn.bind(this), false);
          }
        }, {
          key: "init",
          value: function init() {
            this.addListeners();
          }
        }]);

        return Tab;
      }();

      tabs.forEach(function (tab) {
        new Tab(tab).init();
      });
    }, {}], 2: [function (require, module, exports) {
      require('./components/tab');
      module.exports = {
        input: function input() {
          return 'input';
        }
      };
    }, { "./components/tab": 1 }] }, {}, [2])(2);
});