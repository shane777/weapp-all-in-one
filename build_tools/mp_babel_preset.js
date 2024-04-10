"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const mpCompatData = require("miniprogram-compat");

const corejsCompatData = require("core-js-compat");

const babelPresetEnv = require("@babel/preset-env").default;

const semver = require("semver");

const declare = require("@babel/helper-plugin-utils").declare;

module.exports = declare((api, opts, dirname) => {
  api.assertVersion(7);

  const {
    wechatLibVersion = "1.0.0"
  } = opts,
        restOpts = _objectWithoutProperties(opts, ["wechatLibVersion"]);

  const browserslist = mpCompatData.getBrowsersList(wechatLibVersion);
  const {
    coreJsVersion: polyfillCoreJsVersion,
    coreJsModules: polyfillExcludeModules
  } = mpCompatData.getPolyfillInfo(wechatLibVersion);
  console.log(wechatLibVersion, polyfillCoreJsVersion, polyfillExcludeModules )
  const polyfillsToIgnore = [];

  if (semver.major(polyfillCoreJsVersion) < 3) {
    // core js 2
    polyfillsToIgnore.push(...require("../data/core-js-2-modules.json").modules);
  } else {
    // core js 3
    const polyfillExcludeRegexps = polyfillExcludeModules.map(module => new RegExp(`^${module}$`));
    polyfillsToIgnore.push(...corejsCompatData.getModulesListForTargetVersion(polyfillCoreJsVersion).filter(module => !polyfillExcludeRegexps.some(exclude => exclude.test(module))));
  }

  const result = babelPresetEnv(api, _objectSpread(_objectSpread({}, restOpts), {}, {
    ignoreBrowserslistConfig: true,
    exclude: (restOpts.exclude || []).concat(polyfillsToIgnore),
    targets: browserslist,
    corejs: 3
  }), dirname);
  return result;
});