(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mc = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
//! moment.js

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

var hookCallback;

function hooks () {
    return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback (callback) {
    hookCallback = callback;
}

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

function isObject(input) {
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

function isObjectEmpty(obj) {
    if (Object.getOwnPropertyNames) {
        return (Object.getOwnPropertyNames(obj).length === 0);
    } else {
        var k;
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                return false;
            }
        }
        return true;
    }
}

function isUndefined(input) {
    return input === void 0;
}

function isNumber(input) {
    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function map(arr, fn) {
    var res = [], i;
    for (i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}

function extend(a, b) {
    for (var i in b) {
        if (hasOwnProp(b, i)) {
            a[i] = b[i];
        }
    }

    if (hasOwnProp(b, 'toString')) {
        a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
        a.valueOf = b.valueOf;
    }

    return a;
}

function createUTC (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
}

function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
        empty           : false,
        unusedTokens    : [],
        unusedInput     : [],
        overflow        : -2,
        charsLeftOver   : 0,
        nullInput       : false,
        invalidMonth    : null,
        invalidFormat   : false,
        userInvalidated : false,
        iso             : false,
        parsedDateParts : [],
        meridiem        : null,
        rfc2822         : false,
        weekdayMismatch : false
    };
}

function getParsingFlags(m) {
    if (m._pf == null) {
        m._pf = defaultParsingFlags();
    }
    return m._pf;
}

var some;
if (Array.prototype.some) {
    some = Array.prototype.some;
} else {
    some = function (fun) {
        var t = Object(this);
        var len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}

function isValid(m) {
    if (m._isValid == null) {
        var flags = getParsingFlags(m);
        var parsedParts = some.call(flags.parsedDateParts, function (i) {
            return i != null;
        });
        var isNowValid = !isNaN(m._d.getTime()) &&
            flags.overflow < 0 &&
            !flags.empty &&
            !flags.invalidMonth &&
            !flags.invalidWeekday &&
            !flags.weekdayMismatch &&
            !flags.nullInput &&
            !flags.invalidFormat &&
            !flags.userInvalidated &&
            (!flags.meridiem || (flags.meridiem && parsedParts));

        if (m._strict) {
            isNowValid = isNowValid &&
                flags.charsLeftOver === 0 &&
                flags.unusedTokens.length === 0 &&
                flags.bigHour === undefined;
        }

        if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
        }
        else {
            return isNowValid;
        }
    }
    return m._isValid;
}

function createInvalid (flags) {
    var m = createUTC(NaN);
    if (flags != null) {
        extend(getParsingFlags(m), flags);
    }
    else {
        getParsingFlags(m).userInvalidated = true;
    }

    return m;
}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = hooks.momentProperties = [];

function copyConfig(to, from) {
    var i, prop, val;

    if (!isUndefined(from._isAMomentObject)) {
        to._isAMomentObject = from._isAMomentObject;
    }
    if (!isUndefined(from._i)) {
        to._i = from._i;
    }
    if (!isUndefined(from._f)) {
        to._f = from._f;
    }
    if (!isUndefined(from._l)) {
        to._l = from._l;
    }
    if (!isUndefined(from._strict)) {
        to._strict = from._strict;
    }
    if (!isUndefined(from._tzm)) {
        to._tzm = from._tzm;
    }
    if (!isUndefined(from._isUTC)) {
        to._isUTC = from._isUTC;
    }
    if (!isUndefined(from._offset)) {
        to._offset = from._offset;
    }
    if (!isUndefined(from._pf)) {
        to._pf = getParsingFlags(from);
    }
    if (!isUndefined(from._locale)) {
        to._locale = from._locale;
    }

    if (momentProperties.length > 0) {
        for (i = 0; i < momentProperties.length; i++) {
            prop = momentProperties[i];
            val = from[prop];
            if (!isUndefined(val)) {
                to[prop] = val;
            }
        }
    }

    return to;
}

var updateInProgress = false;

// Moment prototype object
function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (!this.isValid()) {
        this._d = new Date(NaN);
    }
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
    }
}

function isMoment (obj) {
    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
}

function absFloor (number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
}

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
}

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
        lengthDiff = Math.abs(array1.length - array2.length),
        diffs = 0,
        i;
    for (i = 0; i < len; i++) {
        if ((dontConvert && array1[i] !== array2[i]) ||
            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
        }
    }
    return diffs + lengthDiff;
}

function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !==  'undefined') && console.warn) {
        console.warn('Deprecation warning: ' + msg);
    }
}

function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
            var args = [];
            var arg;
            for (var i = 0; i < arguments.length; i++) {
                arg = '';
                if (typeof arguments[i] === 'object') {
                    arg += '\n[' + i + '] ';
                    for (var key in arguments[0]) {
                        arg += key + ': ' + arguments[0][key] + ', ';
                    }
                    arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                    arg = arguments[i];
                }
                args.push(arg);
            }
            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
    if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}

function set (config) {
    var prop, i;
    for (i in config) {
        prop = config[i];
        if (isFunction(prop)) {
            this[i] = prop;
        } else {
            this['_' + i] = prop;
        }
    }
    this._config = config;
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
    // TODO: Remove "ordinalParse" fallback in next major release.
    this._dayOfMonthOrdinalParseLenient = new RegExp(
        (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
            '|' + (/\d{1,2}/).source);
}

function mergeConfigs(parentConfig, childConfig) {
    var res = extend({}, parentConfig), prop;
    for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                res[prop] = {};
                extend(res[prop], parentConfig[prop]);
                extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
                res[prop] = childConfig[prop];
            } else {
                delete res[prop];
            }
        }
    }
    for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
            // make sure changes to properties don't modify parent config
            res[prop] = extend({}, res[prop]);
        }
    }
    return res;
}

function Locale(config) {
    if (config != null) {
        this.set(config);
    }
}

var keys;

if (Object.keys) {
    keys = Object.keys;
} else {
    keys = function (obj) {
        var i, res = [];
        for (i in obj) {
            if (hasOwnProp(obj, i)) {
                res.push(i);
            }
        }
        return res;
    };
}

var defaultCalendar = {
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    nextWeek : 'dddd [at] LT',
    lastDay : '[Yesterday at] LT',
    lastWeek : '[Last] dddd [at] LT',
    sameElse : 'L'
};

function calendar (key, mom, now) {
    var output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
}

var defaultLongDateFormat = {
    LTS  : 'h:mm:ss A',
    LT   : 'h:mm A',
    L    : 'MM/DD/YYYY',
    LL   : 'MMMM D, YYYY',
    LLL  : 'MMMM D, YYYY h:mm A',
    LLLL : 'dddd, MMMM D, YYYY h:mm A'
};

function longDateFormat (key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
        return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
    });

    return this._longDateFormat[key];
}

var defaultInvalidDate = 'Invalid date';

function invalidDate () {
    return this._invalidDate;
}

var defaultOrdinal = '%d';
var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

var defaultRelativeTime = {
    future : 'in %s',
    past   : '%s ago',
    s  : 'a few seconds',
    ss : '%d seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
};

function relativeTime (number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ?
        output(number, withoutSuffix, string, isFuture) :
        output.replace(/%d/i, number);
}

function pastFuture (diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}

var aliases = {};

function addUnitAlias (unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;

    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }

    return normalizedInput;
}

var priorities = {};

function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
        units.push({unit: u, priority: priorities[u]});
    }
    units.sort(function (a, b) {
        return a.priority - b.priority;
    });
    return units;
}

function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
        zerosToFill = targetLength - absNumber.length,
        sign = number >= 0;
    return (sign ? (forceSign ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var formatFunctions = {};

var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken (token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
        func = function () {
            return this[callback]();
        };
    }
    if (token) {
        formatTokenFunctions[token] = func;
    }
    if (padded) {
        formatTokenFunctions[padded[0]] = function () {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
    }
    if (ordinal) {
        formatTokenFunctions[ordinal] = function () {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        };
    }
}

function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
    var array = format.match(formattingTokens), i, length;

    for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
        } else {
            array[i] = removeFormattingTokens(array[i]);
        }
    }

    return function (mom) {
        var output = '', i;
        for (i = 0; i < length; i++) {
            output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
        }
        return output;
    };
}

// format date using native date object
function formatMoment(m, format) {
    if (!m.isValid()) {
        return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

    return formatFunctions[format](m);
}

function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
        return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        localFormattingTokens.lastIndex = 0;
        i -= 1;
    }

    return format;
}

var match1         = /\d/;            //       0 - 9
var match2         = /\d\d/;          //      00 - 99
var match3         = /\d{3}/;         //     000 - 999
var match4         = /\d{4}/;         //    0000 - 9999
var match6         = /[+-]?\d{6}/;    // -999999 - 999999
var match1to2      = /\d\d?/;         //       0 - 99
var match3to4      = /\d\d\d\d?/;     //     999 - 9999
var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
var match1to3      = /\d{1,3}/;       //       0 - 999
var match1to4      = /\d{1,4}/;       //       0 - 9999
var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

var matchUnsigned  = /\d+/;           //       0 - inf
var matchSigned    = /[+-]?\d+/;      //    -inf - inf

var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

var regexes = {};

function addRegexToken (token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
        return (isStrict && strictRegex) ? strictRegex : regex;
    };
}

function getParseRegexForToken (token, config) {
    if (!hasOwnProp(regexes, token)) {
        return new RegExp(unescapeFormat(token));
    }

    return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
    }));
}

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var tokens = {};

function addParseToken (token, callback) {
    var i, func = callback;
    if (typeof token === 'string') {
        token = [token];
    }
    if (isNumber(callback)) {
        func = function (input, array) {
            array[callback] = toInt(input);
        };
    }
    for (i = 0; i < token.length; i++) {
        tokens[token[i]] = func;
    }
}

function addWeekParseToken (token, callback) {
    addParseToken(token, function (input, array, config, token) {
        config._w = config._w || {};
        callback(input, config._w, config, token);
    });
}

function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
        tokens[token](input, config._a, config, token);
    }
}

var YEAR = 0;
var MONTH = 1;
var DATE = 2;
var HOUR = 3;
var MINUTE = 4;
var SECOND = 5;
var MILLISECOND = 6;
var WEEK = 7;
var WEEKDAY = 8;

// FORMATTING

addFormatToken('Y', 0, 0, function () {
    var y = this.year();
    return y <= 9999 ? '' + y : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
});

addFormatToken(0, ['YYYY',   4],       0, 'year');
addFormatToken(0, ['YYYYY',  5],       0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

addUnitAlias('year', 'y');

// PRIORITIES

addUnitPriority('year', 1);

// PARSING

addRegexToken('Y',      matchSigned);
addRegexToken('YY',     match1to2, match2);
addRegexToken('YYYY',   match1to4, match4);
addRegexToken('YYYYY',  match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
    array[YEAR] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// HOOKS

hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = makeGetSet('FullYear', true);

function getIsLeapYear () {
    return isLeapYear(this.year());
}

function makeGetSet (unit, keepTime) {
    return function (value) {
        if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
        } else {
            return get(this, unit);
        }
    };
}

function get (mom, unit) {
    return mom.isValid() ?
        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set$1 (mom, unit, value) {
    if (mom.isValid() && !isNaN(value)) {
        if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
        }
        else {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }
}

// MOMENTS

function stringGet (units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
        return this[units]();
    }
    return this;
}


function stringSet (units, value) {
    if (typeof units === 'object') {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units);
        for (var i = 0; i < prioritized.length; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
        }
    } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units](value);
        }
    }
    return this;
}

function mod(n, x) {
    return ((n % x) + x) % x;
}

var indexOf;

if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
} else {
    indexOf = function (o) {
        // I know
        var i;
        for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
                return i;
            }
        }
        return -1;
    };
}

function daysInMonth(year, month) {
    if (isNaN(year) || isNaN(month)) {
        return NaN;
    }
    var modMonth = mod(month, 12);
    year += (month - modMonth) / 12;
    return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

// ALIASES

addUnitAlias('month', 'M');

// PRIORITY

addUnitPriority('month', 8);

// PARSING

addRegexToken('M',    match1to2);
addRegexToken('MM',   match1to2, match2);
addRegexToken('MMM',  function (isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
    return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
        array[MONTH] = month;
    } else {
        getParsingFlags(config).invalidMonth = input;
    }
});

// LOCALES

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
function localeMonths (m, format) {
    if (!m) {
        return isArray(this._months) ? this._months :
            this._months['standalone'];
    }
    return isArray(this._months) ? this._months[m.month()] :
        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}

var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
function localeMonthsShort (m, format) {
    if (!m) {
        return isArray(this._monthsShort) ? this._monthsShort :
            this._monthsShort['standalone'];
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
    var i, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
        // this is not used
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
            mom = createUTC([2000, i]);
            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'MMM') {
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'MMM') {
            ii = indexOf.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeMonthsParse (monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
        }
        if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

// MOMENTS

function setMonth (mom, value) {
    var dayOfMonth;

    if (!mom.isValid()) {
        // No op
        return mom;
    }

    if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
            value = toInt(value);
        } else {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (!isNumber(value)) {
                return mom;
            }
        }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
}

function getSetMonth (value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

function getDaysInMonth () {
    return daysInMonth(this.year(), this.month());
}

var defaultMonthsShortRegex = matchWord;
function monthsShortRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsShortStrictRegex;
        } else {
            return this._monthsShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsShortRegex')) {
            this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ?
            this._monthsShortStrictRegex : this._monthsShortRegex;
    }
}

var defaultMonthsRegex = matchWord;
function monthsRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsStrictRegex;
        } else {
            return this._monthsRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsRegex')) {
            this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ?
            this._monthsStrictRegex : this._monthsRegex;
    }
}

function computeMonthsParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom;
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        shortPieces.push(this.monthsShort(mom, ''));
        longPieces.push(this.months(mom, ''));
        mixedPieces.push(this.months(mom, ''));
        mixedPieces.push(this.monthsShort(mom, ''));
    }
    // Sorting makes sure if one month (or abbr) is a prefix of another it
    // will match the longer piece.
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i < 24; i++) {
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

function createDate (y, m, d, h, M, s, ms) {
    // can't just apply() to create a date:
    // https://stackoverflow.com/q/181348
    var date = new Date(y, m, d, h, M, s, ms);

    // the date constructor remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
        date.setFullYear(y);
    }
    return date;
}

function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));

    // the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        fwd = 7 + dow - doy,
        // first-week day local weekday -- which local weekday is fwd
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

    return -fwdlw + fwd - 1;
}

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
        weekOffset = firstWeekOffset(year, dow, doy),
        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
        resYear, resDayOfYear;

    if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
    } else {
        resYear = year;
        resDayOfYear = dayOfYear;
    }

    return {
        year: resYear,
        dayOfYear: resDayOfYear
    };
}

function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}

function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

// FORMATTING

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

// PRIORITIES

addUnitPriority('week', 5);
addUnitPriority('isoWeek', 5);

// PARSING

addRegexToken('w',  match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W',  match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
});

// HELPERS

// LOCALES

function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
    dow : 0, // Sunday is the first day of the week.
    doy : 6  // The week that contains Jan 1st is the first week of the year.
};

function localeFirstDayOfWeek () {
    return this._week.dow;
}

function localeFirstDayOfYear () {
    return this._week.doy;
}

// MOMENTS

function getSetWeek (input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek (input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
}

// FORMATTING

addFormatToken('d', 0, 'do', 'day');

addFormatToken('dd', 0, 0, function (format) {
    return this.localeData().weekdaysMin(this, format);
});

addFormatToken('ddd', 0, 0, function (format) {
    return this.localeData().weekdaysShort(this, format);
});

addFormatToken('dddd', 0, 0, function (format) {
    return this.localeData().weekdays(this, format);
});

addFormatToken('e', 0, 0, 'weekday');
addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

addUnitAlias('day', 'd');
addUnitAlias('weekday', 'e');
addUnitAlias('isoWeekday', 'E');

// PRIORITY
addUnitPriority('day', 11);
addUnitPriority('weekday', 11);
addUnitPriority('isoWeekday', 11);

// PARSING

addRegexToken('d',    match1to2);
addRegexToken('e',    match1to2);
addRegexToken('E',    match1to2);
addRegexToken('dd',   function (isStrict, locale) {
    return locale.weekdaysMinRegex(isStrict);
});
addRegexToken('ddd',   function (isStrict, locale) {
    return locale.weekdaysShortRegex(isStrict);
});
addRegexToken('dddd',   function (isStrict, locale) {
    return locale.weekdaysRegex(isStrict);
});

addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
    var weekday = config._locale.weekdaysParse(input, token, config._strict);
    // if we didn't get a weekday name, mark the date as invalid
    if (weekday != null) {
        week.d = weekday;
    } else {
        getParsingFlags(config).invalidWeekday = input;
    }
});

addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    week[token] = toInt(input);
});

// HELPERS

function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
        return input;
    }

    if (!isNaN(input)) {
        return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
        return input;
    }

    return null;
}

function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
        return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
}

// LOCALES

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
function localeWeekdays (m, format) {
    if (!m) {
        return isArray(this._weekdays) ? this._weekdays :
            this._weekdays['standalone'];
    }
    return isArray(this._weekdays) ? this._weekdays[m.day()] :
        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
}

var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
function localeWeekdaysShort (m) {
    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}

var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
function localeWeekdaysMin (m) {
    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}

function handleStrictParse$1(weekdayName, format, strict) {
    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];

        for (i = 0; i < 7; ++i) {
            mom = createUTC([2000, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'dddd') {
            ii = indexOf.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'dddd') {
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeWeekdaysParse (weekdayName, format, strict) {
    var i, mom, regex;

    if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format, strict);
    }

    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
    }

    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already

        mom = createUTC([2000, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
        }
        if (!this._weekdaysParse[i]) {
            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
        }
    }
}

// MOMENTS

function getSetDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
        input = parseWeekday(input, this.localeData());
        return this.add(input - day, 'd');
    } else {
        return day;
    }
}

function getSetLocaleDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }

    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.

    if (input != null) {
        var weekday = parseIsoWeekday(input, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
        return this.day() || 7;
    }
}

var defaultWeekdaysRegex = matchWord;
function weekdaysRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysStrictRegex;
        } else {
            return this._weekdaysRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ?
            this._weekdaysStrictRegex : this._weekdaysRegex;
    }
}

var defaultWeekdaysShortRegex = matchWord;
function weekdaysShortRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysShortStrictRegex;
        } else {
            return this._weekdaysShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ?
            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
}

var defaultWeekdaysMinRegex = matchWord;
function weekdaysMinRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysMinStrictRegex;
        } else {
            return this._weekdaysMinRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ?
            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
}


function computeWeekdaysParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom, minp, shortp, longp;
    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, 1]).day(i);
        minp = this.weekdaysMin(mom, '');
        shortp = this.weekdaysShort(mom, '');
        longp = this.weekdays(mom, '');
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
    }
    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
    // will match the longer piece.
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;

    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

// FORMATTING

function hFormat() {
    return this.hours() % 12 || 12;
}

function kFormat() {
    return this.hours() || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

function meridiem (token, lowercase) {
    addFormatToken(token, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
}

meridiem('a', true);
meridiem('A', false);

// ALIASES

addUnitAlias('hour', 'h');

// PRIORITY
addUnitPriority('hour', 13);

// PARSING

function matchMeridiem (isStrict, locale) {
    return locale._meridiemParse;
}

addRegexToken('a',  matchMeridiem);
addRegexToken('A',  matchMeridiem);
addRegexToken('H',  match1to2);
addRegexToken('h',  match1to2);
addRegexToken('k',  match1to2);
addRegexToken('HH', match1to2, match2);
addRegexToken('hh', match1to2, match2);
addRegexToken('kk', match1to2, match2);

addRegexToken('hmm', match3to4);
addRegexToken('hmmss', match5to6);
addRegexToken('Hmm', match3to4);
addRegexToken('Hmmss', match5to6);

addParseToken(['H', 'HH'], HOUR);
addParseToken(['k', 'kk'], function (input, array, config) {
    var kInput = toInt(input);
    array[HOUR] = kInput === 24 ? 0 : kInput;
});
addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
});
addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
});
addParseToken('Hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
});
addParseToken('Hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
});

// LOCALES

function localeIsPM (input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((input + '').toLowerCase().charAt(0) === 'p');
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
function localeMeridiem (hours, minutes, isLower) {
    if (hours > 11) {
        return isLower ? 'pm' : 'PM';
    } else {
        return isLower ? 'am' : 'AM';
    }
}


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
var getSetHour = makeGetSet('Hours', true);

var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    relativeTime: defaultRelativeTime,

    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,

    week: defaultLocaleWeek,

    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,

    meridiemParse: defaultLocaleMeridiemParse
};

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
            }
            j--;
        }
        i++;
    }
    return globalLocale;
}

function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
        try {
            oldLocale = globalLocale._abbr;
            var aliasedRequire = require;
            aliasedRequire('./locale/' + name);
            getSetGlobalLocale(oldLocale);
        } catch (e) {}
    }
    return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale (key, values) {
    var data;
    if (key) {
        if (isUndefined(values)) {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            // moment.duration._locale = moment._locale = data;
            globalLocale = data;
        }
        else {
            if ((typeof console !==  'undefined') && console.warn) {
                //warn user if arguments are passed but the locale could not be set
                console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
            }
        }
    }

    return globalLocale._abbr;
}

function defineLocale (name, config) {
    if (config !== null) {
        var locale, parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
            deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
            parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
            } else {
                locale = loadLocale(config.parentLocale);
                if (locale != null) {
                    parentConfig = locale._config;
                } else {
                    if (!localeFamilies[config.parentLocale]) {
                        localeFamilies[config.parentLocale] = [];
                    }
                    localeFamilies[config.parentLocale].push({
                        name: name,
                        config: config
                    });
                    return null;
                }
            }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));

        if (localeFamilies[name]) {
            localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
            });
        }

        // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name);


        return locales[name];
    } else {
        // useful for testing
        delete locales[name];
        return null;
    }
}

function updateLocale(name, config) {
    if (config != null) {
        var locale, tmpLocale, parentConfig = baseConfig;
        // MERGE
        tmpLocale = loadLocale(name);
        if (tmpLocale != null) {
            parentConfig = tmpLocale._config;
        }
        config = mergeConfigs(parentConfig, config);
        locale = new Locale(config);
        locale.parentLocale = locales[name];
        locales[name] = locale;

        // backwards compat for now: also set the locale
        getSetGlobalLocale(name);
    } else {
        // pass null for config to unupdate, useful for tests
        if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;
            } else if (locales[name] != null) {
                delete locales[name];
            }
        }
    }
    return locales[name];
}

// returns locale data
function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}

function listLocales() {
    return keys(locales);
}

function checkOverflow (m) {
    var overflow;
    var a = m._a;

    if (a && getParsingFlags(m).overflow === -2) {
        overflow =
            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
            -1;

        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
        }

        getParsingFlags(m).overflow = overflow;
    }

    return m;
}

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
    if (a != null) {
        return a;
    }
    if (b != null) {
        return b;
    }
    return c;
}

function currentDateArray(config) {
    // hooks is actually the exported moment object
    var nowValue = new Date(hooks.now());
    if (config._useUTC) {
        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray (config) {
    var i, date, input = [], currentDate, expectedWeekday, yearToUse;

    if (config._d) {
        return;
    }

    currentDate = currentDateArray(config);

    //compute day of the year from weeks and weekdays
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
    }

    //if the day of the year is set, figure out what it is
    if (config._dayOfYear != null) {
        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

        if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
            getParsingFlags(config)._overflowDayOfYear = true;
        }

        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
    }

    // Default to current date.
    // * if no year, month, day of month are given, default to today
    // * if day of month is given, default month and year
    // * if month is given, default only year
    // * if year is given, don't default anything
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input[i] = currentDate[i];
    }

    // Zero out whatever was not defaulted, including time
    for (; i < 7; i++) {
        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
    }

    // Check for 24:00:00.000
    if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
    }

    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

    // Apply timezone offset from input. The actual utcOffset can be changed
    // with parseZone.
    if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }

    if (config._nextDay) {
        config._a[HOUR] = 24;
    }

    // check for mismatching day of week
    if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
        getParsingFlags(config).weekdayMismatch = true;
    }
}

function dayOfYearFromWeekInfo(config) {
    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;

        // TODO: We need to take the current isoWeekYear, but that depends on
        // how we interpret now (local, utc, fixed offset). So create
        // a now version of current config (take local/utc/offset flags, and
        // create now).
        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
        week = defaults(w.W, 1);
        weekday = defaults(w.E, 1);
        if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
        }
    } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;

        var curWeek = weekOfYear(createLocal(), dow, doy);

        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

        // Default to current week.
        week = defaults(w.w, curWeek.week);

        if (w.d != null) {
            // weekday -- low day numbers are considered next week
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
                weekdayOverflow = true;
            }
        } else if (w.e != null) {
            // local weekday -- counting starts from begining of week
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
                weekdayOverflow = true;
            }
        } else {
            // default to begining of week
            weekday = dow;
        }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
    } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }
}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

var isoDates = [
    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    ['YYYY-DDD', /\d{4}-\d{3}/],
    ['YYYY-MM', /\d{4}-\d\d/, false],
    ['YYYYYYMMDD', /[+-]\d{10}/],
    ['YYYYMMDD', /\d{8}/],
    // YYYYMM is NOT allowed by the standard
    ['GGGG[W]WWE', /\d{4}W\d{3}/],
    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    ['YYYYDDD', /\d{7}/]
];

// iso time formats and regexes
var isoTimes = [
    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    ['HH:mm', /\d\d:\d\d/],
    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    ['HHmmss', /\d\d\d\d\d\d/],
    ['HHmm', /\d\d\d\d/],
    ['HH', /\d\d/]
];

var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
function configFromISO(config) {
    var i, l,
        string = config._i,
        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
        allowTime, dateFormat, timeFormat, tzFormat;

    if (match) {
        getParsingFlags(config).iso = true;

        for (i = 0, l = isoDates.length; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0];
                allowTime = isoDates[i][2] !== false;
                break;
            }
        }
        if (dateFormat == null) {
            config._isValid = false;
            return;
        }
        if (match[3]) {
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(match[3])) {
                    // match[2] should be 'T' or space
                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (timeFormat == null) {
                config._isValid = false;
                return;
            }
        }
        if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
        }
        if (match[4]) {
            if (tzRegex.exec(match[4])) {
                tzFormat = 'Z';
            } else {
                config._isValid = false;
                return;
            }
        }
        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
        configFromStringAndFormat(config);
    } else {
        config._isValid = false;
    }
}

// RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
    var result = [
        untruncateYear(yearStr),
        defaultLocaleMonthsShort.indexOf(monthStr),
        parseInt(dayStr, 10),
        parseInt(hourStr, 10),
        parseInt(minuteStr, 10)
    ];

    if (secondStr) {
        result.push(parseInt(secondStr, 10));
    }

    return result;
}

function untruncateYear(yearStr) {
    var year = parseInt(yearStr, 10);
    if (year <= 49) {
        return 2000 + year;
    } else if (year <= 999) {
        return 1900 + year;
    }
    return year;
}

function preprocessRFC2822(s) {
    // Remove comments and folding whitespace and replace multiple-spaces with a single space
    return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').trim();
}

function checkWeekday(weekdayStr, parsedInput, config) {
    if (weekdayStr) {
        // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
        var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
            weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
        if (weekdayProvided !== weekdayActual) {
            getParsingFlags(config).weekdayMismatch = true;
            config._isValid = false;
            return false;
        }
    }
    return true;
}

var obsOffsets = {
    UT: 0,
    GMT: 0,
    EDT: -4 * 60,
    EST: -5 * 60,
    CDT: -5 * 60,
    CST: -6 * 60,
    MDT: -6 * 60,
    MST: -7 * 60,
    PDT: -7 * 60,
    PST: -8 * 60
};

function calculateOffset(obsOffset, militaryOffset, numOffset) {
    if (obsOffset) {
        return obsOffsets[obsOffset];
    } else if (militaryOffset) {
        // the only allowed military tz is Z
        return 0;
    } else {
        var hm = parseInt(numOffset, 10);
        var m = hm % 100, h = (hm - m) / 100;
        return h * 60 + m;
    }
}

// date and time from ref 2822 format
function configFromRFC2822(config) {
    var match = rfc2822.exec(preprocessRFC2822(config._i));
    if (match) {
        var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
        if (!checkWeekday(match[1], parsedArray, config)) {
            return;
        }

        config._a = parsedArray;
        config._tzm = calculateOffset(match[8], match[9], match[10]);

        config._d = createUTCDate.apply(null, config._a);
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

        getParsingFlags(config).rfc2822 = true;
    } else {
        config._isValid = false;
    }
}

// date from iso format or fallback
function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);

    if (matched !== null) {
        config._d = new Date(+matched[1]);
        return;
    }

    configFromISO(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    configFromRFC2822(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    // Final attempt, use Input Fallback
    hooks.createFromInputFallback(config);
}

hooks.createFromInputFallback = deprecate(
    'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
    'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
    'discouraged and will be removed in an upcoming major release. Please refer to ' +
    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
    function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    }
);

// constant that refers to the ISO standard
hooks.ISO_8601 = function () {};

// constant that refers to the RFC 2822 form
hooks.RFC_2822 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
    // TODO: Move this to another part of the creation flow to prevent circular deps
    if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
    }
    if (config._f === hooks.RFC_2822) {
        configFromRFC2822(config);
        return;
    }
    config._a = [];
    getParsingFlags(config).empty = true;

    // This array is used to make a Date, either with `new Date` or `Date.UTC`
    var string = '' + config._i,
        i, parsedInput, tokens, token, skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
        // console.log('token', token, 'parsedInput', parsedInput,
        //         'regex', getParseRegexForToken(token, config));
        if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
                getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
        }
        // don't parse if it's not a known token
        if (formatTokenFunctions[token]) {
            if (parsedInput) {
                getParsingFlags(config).empty = false;
            }
            else {
                getParsingFlags(config).unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
        }
        else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token);
        }
    }

    // add remaining unparsed input length to the string
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
    }

    // clear _12h flag if hour is <= 12
    if (config._a[HOUR] <= 12 &&
        getParsingFlags(config).bigHour === true &&
        config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = undefined;
    }

    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    // handle meridiem
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
}


function meridiemFixWrap (locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
        // nothing to do
        return hour;
    }
    if (locale.meridiemHour != null) {
        return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
        // Fallback
        isPm = locale.isPM(meridiem);
        if (isPm && hour < 12) {
            hour += 12;
        }
        if (!isPm && hour === 12) {
            hour = 0;
        }
        return hour;
    } else {
        // this is not supposed to happen
        return hour;
    }
}

// date from string and array of format strings
function configFromStringAndArray(config) {
    var tempConfig,
        bestMoment,

        scoreToBeat,
        i,
        currentScore;

    if (config._f.length === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = new Date(NaN);
        return;
    }

    for (i = 0; i < config._f.length; i++) {
        currentScore = 0;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);

        if (!isValid(tempConfig)) {
            continue;
        }

        // if there is any input that was not parsed add a penalty for that format
        currentScore += getParsingFlags(tempConfig).charsLeftOver;

        //or tokens
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

        getParsingFlags(tempConfig).score = currentScore;

        if (scoreToBeat == null || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
        }
    }

    extend(config, bestMoment || tempConfig);
}

function configFromObject(config) {
    if (config._d) {
        return;
    }

    var i = normalizeObjectUnits(config._i);
    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
        return obj && parseInt(obj, 10);
    });

    configFromArray(config);
}

function createFromConfig (config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
        // Adding is smart enough around DST
        res.add(1, 'd');
        res._nextDay = undefined;
    }

    return res;
}

function prepareConfig (config) {
    var input = config._i,
        format = config._f;

    config._locale = config._locale || getLocale(config._l);

    if (input === null || (format === undefined && input === '')) {
        return createInvalid({nullInput: true});
    }

    if (typeof input === 'string') {
        config._i = input = config._locale.preparse(input);
    }

    if (isMoment(input)) {
        return new Moment(checkOverflow(input));
    } else if (isDate(input)) {
        config._d = input;
    } else if (isArray(format)) {
        configFromStringAndArray(config);
    } else if (format) {
        configFromStringAndFormat(config);
    }  else {
        configFromInput(config);
    }

    if (!isValid(config)) {
        config._d = null;
    }

    return config;
}

function configFromInput(config) {
    var input = config._i;
    if (isUndefined(input)) {
        config._d = new Date(hooks.now());
    } else if (isDate(input)) {
        config._d = new Date(input.valueOf());
    } else if (typeof input === 'string') {
        configFromString(config);
    } else if (isArray(input)) {
        config._a = map(input.slice(0), function (obj) {
            return parseInt(obj, 10);
        });
        configFromArray(config);
    } else if (isObject(input)) {
        configFromObject(config);
    } else if (isNumber(input)) {
        // from milliseconds
        config._d = new Date(input);
    } else {
        hooks.createFromInputFallback(config);
    }
}

function createLocalOrUTC (input, format, locale, strict, isUTC) {
    var c = {};

    if (locale === true || locale === false) {
        strict = locale;
        locale = undefined;
    }

    if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
        input = undefined;
    }
    // object construction must be done this way.
    // https://github.com/moment/moment/issues/1423
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;

    return createFromConfig(c);
}

function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}

var prototypeMin = deprecate(
    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

var prototypeMax = deprecate(
    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
    var res, i;
    if (moments.length === 1 && isArray(moments[0])) {
        moments = moments[0];
    }
    if (!moments.length) {
        return createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
        }
    }
    return res;
}

// TODO: Use [].sort instead?
function min () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isBefore', args);
}

function max () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isAfter', args);
}

var now = function () {
    return Date.now ? Date.now() : +(new Date());
};

var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

function isDurationValid(m) {
    for (var key in m) {
        if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
            return false;
        }
    }

    var unitHasDecimal = false;
    for (var i = 0; i < ordering.length; ++i) {
        if (m[ordering[i]]) {
            if (unitHasDecimal) {
                return false; // only allow non-integers for smallest unit
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                unitHasDecimal = true;
            }
        }
    }

    return true;
}

function isValid$1() {
    return this._isValid;
}

function createInvalid$1() {
    return createDuration(NaN);
}

function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    this._isValid = isDurationValid(normalizedInput);

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible to translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;

    this._data = {};

    this._locale = getLocale();

    this._bubble();
}

function isDuration (obj) {
    return obj instanceof Duration;
}

function absRound (number) {
    if (number < 0) {
        return Math.round(-1 * number) * -1;
    } else {
        return Math.round(number);
    }
}

// FORMATTING

function offset (token, separator) {
    addFormatToken(token, 0, 0, function () {
        var offset = this.utcOffset();
        var sign = '+';
        if (offset < 0) {
            offset = -offset;
            sign = '-';
        }
        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
}

offset('Z', ':');
offset('ZZ', '');

// PARSING

addRegexToken('Z',  matchShortOffset);
addRegexToken('ZZ', matchShortOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
    var matches = (string || '').match(matcher);

    if (matches === null) {
        return null;
    }

    var chunk   = matches[matches.length - 1] || [];
    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return minutes === 0 ?
      0 :
      parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
        res = model.clone();
        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
        // Use low-level api, because this fn is low-level api.
        res._d.setTime(res._d.valueOf() + diff);
        hooks.updateOffset(res, false);
        return res;
    } else {
        return createLocal(input).local();
    }
}

function getDateOffset (m) {
    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    // https://github.com/moment/moment/pull/1871
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset (input, keepLocalTime, keepMinutes) {
    var offset = this._offset || 0,
        localAdjust;
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    if (input != null) {
        if (typeof input === 'string') {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
                return this;
            }
        } else if (Math.abs(input) < 16 && !keepMinutes) {
            input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
            this.add(localAdjust, 'm');
        }
        if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
        }
        return this;
    } else {
        return this._isUTC ? offset : getDateOffset(this);
    }
}

function getSetZone (input, keepLocalTime) {
    if (input != null) {
        if (typeof input !== 'string') {
            input = -input;
        }

        this.utcOffset(input, keepLocalTime);

        return this;
    } else {
        return -this.utcOffset();
    }
}

function setOffsetToUTC (keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal (keepLocalTime) {
    if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
        }
    }
    return this;
}

function setOffsetToParsedOffset () {
    if (this._tzm != null) {
        this.utcOffset(this._tzm, false, true);
    } else if (typeof this._i === 'string') {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
            this.utcOffset(tZone);
        }
        else {
            this.utcOffset(0, true);
        }
    }
    return this;
}

function hasAlignedHourOffset (input) {
    if (!this.isValid()) {
        return false;
    }
    input = input ? createLocal(input).utcOffset() : 0;

    return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime () {
    return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
    );
}

function isDaylightSavingTimeShifted () {
    if (!isUndefined(this._isDSTShifted)) {
        return this._isDSTShifted;
    }

    var c = {};

    copyConfig(c, this);
    c = prepareConfig(c);

    if (c._a) {
        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() &&
            compareArrays(c._a, other.toArray()) > 0;
    } else {
        this._isDSTShifted = false;
    }

    return this._isDSTShifted;
}

function isLocal () {
    return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset () {
    return this.isValid() ? this._isUTC : false;
}

function isUtc () {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
}

// ASP.NET json date format regex
var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

function createDuration (input, key) {
    var duration = input,
        // matching against regexp is expensive, do it on demand
        match = null,
        sign,
        ret,
        diffRes;

    if (isDuration(input)) {
        duration = {
            ms : input._milliseconds,
            d  : input._days,
            M  : input._months
        };
    } else if (isNumber(input)) {
        duration = {};
        if (key) {
            duration[key] = input;
        } else {
            duration.milliseconds = input;
        }
    } else if (!!(match = aspNetRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y  : 0,
            d  : toInt(match[DATE])                         * sign,
            h  : toInt(match[HOUR])                         * sign,
            m  : toInt(match[MINUTE])                       * sign,
            s  : toInt(match[SECOND])                       * sign,
            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
        };
    } else if (!!(match = isoRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : (match[1] === '+') ? 1 : 1;
        duration = {
            y : parseIso(match[2], sign),
            M : parseIso(match[3], sign),
            w : parseIso(match[4], sign),
            d : parseIso(match[5], sign),
            h : parseIso(match[6], sign),
            m : parseIso(match[7], sign),
            s : parseIso(match[8], sign)
        };
    } else if (duration == null) {// checks for null or undefined
        duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
    }

    ret = new Duration(duration);

    if (isDuration(input) && hasOwnProp(input, '_locale')) {
        ret._locale = input._locale;
    }

    return ret;
}

createDuration.fn = Duration.prototype;
createDuration.invalid = createInvalid$1;

function parseIso (inp, sign) {
    // We'd normally use ~~inp for this, but unfortunately it also
    // converts floats to ints.
    // inp may be undefined, so careful calling replace on it.
    var res = inp && parseFloat(inp.replace(',', '.'));
    // apply sign while we're at it
    return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
    var res = {milliseconds: 0, months: 0};

    res.months = other.month() - base.month() +
        (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
        --res.months;
    }

    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

    return res;
}

function momentsDifference(base, other) {
    var res;
    if (!(base.isValid() && other.isValid())) {
        return {milliseconds: 0, months: 0};
    }

    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
    } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
    }

    return res;
}

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
    return function (val, period) {
        var dur, tmp;
        //invert the arguments, but complain about it
        if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
            tmp = val; val = period; period = tmp;
        }

        val = typeof val === 'string' ? +val : val;
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
    };
}

function addSubtract (mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);

    if (!mom.isValid()) {
        // No op
        return;
    }

    updateOffset = updateOffset == null ? true : updateOffset;

    if (months) {
        setMonth(mom, get(mom, 'Month') + months * isAdding);
    }
    if (days) {
        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
    }
    if (milliseconds) {
        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (updateOffset) {
        hooks.updateOffset(mom, days || months);
    }
}

var add      = createAdder(1, 'add');
var subtract = createAdder(-1, 'subtract');

function getCalendarFormat(myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);
    return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
}

function calendar$1 (time, formats) {
    // We want to compare the start of today, vs this.
    // Getting start-of-today depends on whether we're local/utc/offset or not.
    var now = time || createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        format = hooks.calendarFormat(this, sod) || 'sameElse';

    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
}

function clone () {
    return new Moment(this);
}

function isAfter (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() > localInput.valueOf();
    } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
}

function isBefore (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() < localInput.valueOf();
    } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
}

function isBetween (from, to, units, inclusivity) {
    inclusivity = inclusivity || '()';
    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
}

function isSame (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input),
        inputMs;
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() === localInput.valueOf();
    } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
}

function isSameOrAfter (input, units) {
    return this.isSame(input, units) || this.isAfter(input,units);
}

function isSameOrBefore (input, units) {
    return this.isSame(input, units) || this.isBefore(input,units);
}

function diff (input, units, asFloat) {
    var that,
        zoneDelta,
        output;

    if (!this.isValid()) {
        return NaN;
    }

    that = cloneWithOffset(input, this);

    if (!that.isValid()) {
        return NaN;
    }

    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

    units = normalizeUnits(units);

    switch (units) {
        case 'year': output = monthDiff(this, that) / 12; break;
        case 'month': output = monthDiff(this, that); break;
        case 'quarter': output = monthDiff(this, that) / 3; break;
        case 'second': output = (this - that) / 1e3; break; // 1000
        case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
        case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
        case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
        case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
        default: output = this - that;
    }

    return asFloat ? output : absFloor(output);
}

function monthDiff (a, b) {
    // difference in months
    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
        anchor2, adjust;

    if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor - anchor2);
    } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor2 - anchor);
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}

hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString () {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString(keepOffset) {
    if (!this.isValid()) {
        return null;
    }
    var utc = keepOffset !== true;
    var m = utc ? this.clone().utc() : this;
    if (m.year() < 0 || m.year() > 9999) {
        return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }
    if (isFunction(Date.prototype.toISOString)) {
        // native implementation is ~50x faster, use it when we can
        if (utc) {
            return this.toDate().toISOString();
        } else {
            return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
        }
    }
    return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect () {
    if (!this.isValid()) {
        return 'moment.invalid(/* ' + this._i + ' */)';
    }
    var func = 'moment';
    var zone = '';
    if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
        zone = 'Z';
    }
    var prefix = '[' + func + '("]';
    var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
    var suffix = zone + '[")]';

    return this.format(prefix + year + datetime + suffix);
}

function format (inputString) {
    if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
}

function from (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function fromNow (withoutSuffix) {
    return this.from(createLocal(), withoutSuffix);
}

function to (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function toNow (withoutSuffix) {
    return this.to(createLocal(), withoutSuffix);
}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale (key) {
    var newLocaleData;

    if (key === undefined) {
        return this._locale._abbr;
    } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
            this._locale = newLocaleData;
        }
        return this;
    }
}

var lang = deprecate(
    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
    function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    }
);

function localeData () {
    return this._locale;
}

function startOf (units) {
    units = normalizeUnits(units);
    // the following switch intentionally omits break keywords
    // to utilize falling through the cases.
    switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
    }

    // weeks are a special case
    if (units === 'week') {
        this.weekday(0);
    }
    if (units === 'isoWeek') {
        this.isoWeekday(1);
    }

    // quarters are also special
    if (units === 'quarter') {
        this.month(Math.floor(this.month() / 3) * 3);
    }

    return this;
}

function endOf (units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
        return this;
    }

    // 'date' is an alias for 'day', so it should be considered as such.
    if (units === 'date') {
        units = 'day';
    }

    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
}

function valueOf () {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
}

function unix () {
    return Math.floor(this.valueOf() / 1000);
}

function toDate () {
    return new Date(this.valueOf());
}

function toArray () {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject () {
    var m = this;
    return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
    };
}

function toJSON () {
    // new Date(NaN).toJSON() === null
    return this.isValid() ? this.toISOString() : null;
}

function isValid$2 () {
    return isValid(this);
}

function parsingFlags () {
    return extend({}, getParsingFlags(this));
}

function invalidAt () {
    return getParsingFlags(this).overflow;
}

function creationData() {
    return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
    };
}

// FORMATTING

addFormatToken(0, ['gg', 2], 0, function () {
    return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function () {
    return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken (token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg',     'weekYear');
addWeekYearFormatToken('ggggg',    'weekYear');
addWeekYearFormatToken('GGGG',  'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);


// PARSING

addRegexToken('G',      matchSigned);
addRegexToken('g',      matchSigned);
addRegexToken('GG',     match1to2, match2);
addRegexToken('gg',     match1to2, match2);
addRegexToken('GGGG',   match1to4, match4);
addRegexToken('gggg',   match1to4, match4);
addRegexToken('GGGGG',  match1to6, match6);
addRegexToken('ggggg',  match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
});

addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    week[token] = hooks.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
}

function getSetISOWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear () {
    return weeksInYear(this.year(), 1, 4);
}

function getWeeksInYear () {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
        return weekOfYear(this, dow, doy).year;
    } else {
        weeksTarget = weeksInYear(input, dow, doy);
        if (week > weeksTarget) {
            week = weeksTarget;
        }
        return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
}

// FORMATTING

addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

addUnitAlias('quarter', 'Q');

// PRIORITY

addUnitPriority('quarter', 7);

// PARSING

addRegexToken('Q', match1);
addParseToken('Q', function (input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter (input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}

// FORMATTING

addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

addUnitAlias('date', 'D');

// PRIOROITY
addUnitPriority('date', 9);

// PARSING

addRegexToken('D',  match1to2);
addRegexToken('DD', match1to2, match2);
addRegexToken('Do', function (isStrict, locale) {
    // TODO: Remove "ordinalParse" fallback in next major release.
    return isStrict ?
      (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
      locale._dayOfMonthOrdinalParseLenient;
});

addParseToken(['D', 'DD'], DATE);
addParseToken('Do', function (input, array) {
    array[DATE] = toInt(input.match(match1to2)[0]);
});

// MOMENTS

var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
addUnitPriority('dayOfYear', 4);

// PARSING

addRegexToken('DDD',  match1to3);
addRegexToken('DDDD', match3);
addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    config._dayOfYear = toInt(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear (input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
}

// FORMATTING

addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

addUnitAlias('minute', 'm');

// PRIORITY

addUnitPriority('minute', 14);

// PARSING

addRegexToken('m',  match1to2);
addRegexToken('mm', match1to2, match2);
addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

addUnitAlias('second', 's');

// PRIORITY

addUnitPriority('second', 15);

// PARSING

addRegexToken('s',  match1to2);
addRegexToken('ss', match1to2, match2);
addParseToken(['s', 'ss'], SECOND);

// MOMENTS

var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

addFormatToken('S', 0, 0, function () {
    return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function () {
    return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');
addFormatToken(0, ['SSSS', 4], 0, function () {
    return this.millisecond() * 10;
});
addFormatToken(0, ['SSSSS', 5], 0, function () {
    return this.millisecond() * 100;
});
addFormatToken(0, ['SSSSSS', 6], 0, function () {
    return this.millisecond() * 1000;
});
addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    return this.millisecond() * 10000;
});
addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    return this.millisecond() * 100000;
});
addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    return this.millisecond() * 1000000;
});


// ALIASES

addUnitAlias('millisecond', 'ms');

// PRIORITY

addUnitPriority('millisecond', 16);

// PARSING

addRegexToken('S',    match1to3, match1);
addRegexToken('SS',   match1to3, match2);
addRegexToken('SSS',  match1to3, match3);

var token;
for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
}

function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
}
// MOMENTS

var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}

var proto = Moment.prototype;

proto.add               = add;
proto.calendar          = calendar$1;
proto.clone             = clone;
proto.diff              = diff;
proto.endOf             = endOf;
proto.format            = format;
proto.from              = from;
proto.fromNow           = fromNow;
proto.to                = to;
proto.toNow             = toNow;
proto.get               = stringGet;
proto.invalidAt         = invalidAt;
proto.isAfter           = isAfter;
proto.isBefore          = isBefore;
proto.isBetween         = isBetween;
proto.isSame            = isSame;
proto.isSameOrAfter     = isSameOrAfter;
proto.isSameOrBefore    = isSameOrBefore;
proto.isValid           = isValid$2;
proto.lang              = lang;
proto.locale            = locale;
proto.localeData        = localeData;
proto.max               = prototypeMax;
proto.min               = prototypeMin;
proto.parsingFlags      = parsingFlags;
proto.set               = stringSet;
proto.startOf           = startOf;
proto.subtract          = subtract;
proto.toArray           = toArray;
proto.toObject          = toObject;
proto.toDate            = toDate;
proto.toISOString       = toISOString;
proto.inspect           = inspect;
proto.toJSON            = toJSON;
proto.toString          = toString;
proto.unix              = unix;
proto.valueOf           = valueOf;
proto.creationData      = creationData;
proto.year       = getSetYear;
proto.isLeapYear = getIsLeapYear;
proto.weekYear    = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;
proto.quarter = proto.quarters = getSetQuarter;
proto.month       = getSetMonth;
proto.daysInMonth = getDaysInMonth;
proto.week           = proto.weeks        = getSetWeek;
proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
proto.weeksInYear    = getWeeksInYear;
proto.isoWeeksInYear = getISOWeeksInYear;
proto.date       = getSetDayOfMonth;
proto.day        = proto.days             = getSetDayOfWeek;
proto.weekday    = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear  = getSetDayOfYear;
proto.hour = proto.hours = getSetHour;
proto.minute = proto.minutes = getSetMinute;
proto.second = proto.seconds = getSetSecond;
proto.millisecond = proto.milliseconds = getSetMillisecond;
proto.utcOffset            = getSetOffset;
proto.utc                  = setOffsetToUTC;
proto.local                = setOffsetToLocal;
proto.parseZone            = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST                = isDaylightSavingTime;
proto.isLocal              = isLocal;
proto.isUtcOffset          = isUtcOffset;
proto.isUtc                = isUtc;
proto.isUTC                = isUtc;
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;
proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

function createUnix (input) {
    return createLocal(input * 1000);
}

function createInZone () {
    return createLocal.apply(null, arguments).parseZone();
}

function preParsePostFormat (string) {
    return string;
}

var proto$1 = Locale.prototype;

proto$1.calendar        = calendar;
proto$1.longDateFormat  = longDateFormat;
proto$1.invalidDate     = invalidDate;
proto$1.ordinal         = ordinal;
proto$1.preparse        = preParsePostFormat;
proto$1.postformat      = preParsePostFormat;
proto$1.relativeTime    = relativeTime;
proto$1.pastFuture      = pastFuture;
proto$1.set             = set;

proto$1.months            =        localeMonths;
proto$1.monthsShort       =        localeMonthsShort;
proto$1.monthsParse       =        localeMonthsParse;
proto$1.monthsRegex       = monthsRegex;
proto$1.monthsShortRegex  = monthsShortRegex;
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;

proto$1.weekdays       =        localeWeekdays;
proto$1.weekdaysMin    =        localeWeekdaysMin;
proto$1.weekdaysShort  =        localeWeekdaysShort;
proto$1.weekdaysParse  =        localeWeekdaysParse;

proto$1.weekdaysRegex       =        weekdaysRegex;
proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;

function get$1 (format, index, field, setter) {
    var locale = getLocale();
    var utc = createUTC().set(setter, index);
    return locale[field](utc, format);
}

function listMonthsImpl (format, index, field) {
    if (isNumber(format)) {
        index = format;
        format = undefined;
    }

    format = format || '';

    if (index != null) {
        return get$1(format, index, field, 'month');
    }

    var i;
    var out = [];
    for (i = 0; i < 12; i++) {
        out[i] = get$1(format, i, field, 'month');
    }
    return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl (localeSorted, format, index, field) {
    if (typeof localeSorted === 'boolean') {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    } else {
        format = localeSorted;
        index = format;
        localeSorted = false;

        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    }

    var locale = getLocale(),
        shift = localeSorted ? locale._week.dow : 0;

    if (index != null) {
        return get$1(format, (index + shift) % 7, field, 'day');
    }

    var i;
    var out = [];
    for (i = 0; i < 7; i++) {
        out[i] = get$1(format, (i + shift) % 7, field, 'day');
    }
    return out;
}

function listMonths (format, index) {
    return listMonthsImpl(format, index, 'months');
}

function listMonthsShort (format, index) {
    return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}

getSetGlobalLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (toInt(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

// Side effect imports

hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

var mathAbs = Math.abs;

function abs () {
    var data           = this._data;

    this._milliseconds = mathAbs(this._milliseconds);
    this._days         = mathAbs(this._days);
    this._months       = mathAbs(this._months);

    data.milliseconds  = mathAbs(data.milliseconds);
    data.seconds       = mathAbs(data.seconds);
    data.minutes       = mathAbs(data.minutes);
    data.hours         = mathAbs(data.hours);
    data.months        = mathAbs(data.months);
    data.years         = mathAbs(data.years);

    return this;
}

function addSubtract$1 (duration, input, value, direction) {
    var other = createDuration(input, value);

    duration._milliseconds += direction * other._milliseconds;
    duration._days         += direction * other._days;
    duration._months       += direction * other._months;

    return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add$1 (input, value) {
    return addSubtract$1(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function subtract$1 (input, value) {
    return addSubtract$1(this, input, value, -1);
}

function absCeil (number) {
    if (number < 0) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}

function bubble () {
    var milliseconds = this._milliseconds;
    var days         = this._days;
    var months       = this._months;
    var data         = this._data;
    var seconds, minutes, hours, years, monthsFromDays;

    // if we have a mix of positive and negative values, bubble down first
    // check: https://github.com/moment/moment/issues/2166
    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
            (milliseconds <= 0 && days <= 0 && months <= 0))) {
        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
        days = 0;
        months = 0;
    }

    // The following code bubbles up values, see the tests for
    // examples of what that means.
    data.milliseconds = milliseconds % 1000;

    seconds           = absFloor(milliseconds / 1000);
    data.seconds      = seconds % 60;

    minutes           = absFloor(seconds / 60);
    data.minutes      = minutes % 60;

    hours             = absFloor(minutes / 60);
    data.hours        = hours % 24;

    days += absFloor(hours / 24);

    // convert days to months
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;

    data.days   = days;
    data.months = months;
    data.years  = years;

    return this;
}

function daysToMonths (days) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
}

function monthsToDays (months) {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
}

function as (units) {
    if (!this.isValid()) {
        return NaN;
    }
    var days;
    var months;
    var milliseconds = this._milliseconds;

    units = normalizeUnits(units);

    if (units === 'month' || units === 'year') {
        days   = this._days   + milliseconds / 864e5;
        months = this._months + daysToMonths(days);
        return units === 'month' ? months : months / 12;
    } else {
        // handle milliseconds separately because of floating point math errors (issue #1867)
        days = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
            case 'week'   : return days / 7     + milliseconds / 6048e5;
            case 'day'    : return days         + milliseconds / 864e5;
            case 'hour'   : return days * 24    + milliseconds / 36e5;
            case 'minute' : return days * 1440  + milliseconds / 6e4;
            case 'second' : return days * 86400 + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
            default: throw new Error('Unknown unit ' + units);
        }
    }
}

// TODO: Use this.as('ms')?
function valueOf$1 () {
    if (!this.isValid()) {
        return NaN;
    }
    return (
        this._milliseconds +
        this._days * 864e5 +
        (this._months % 12) * 2592e6 +
        toInt(this._months / 12) * 31536e6
    );
}

function makeAs (alias) {
    return function () {
        return this.as(alias);
    };
}

var asMilliseconds = makeAs('ms');
var asSeconds      = makeAs('s');
var asMinutes      = makeAs('m');
var asHours        = makeAs('h');
var asDays         = makeAs('d');
var asWeeks        = makeAs('w');
var asMonths       = makeAs('M');
var asYears        = makeAs('y');

function clone$1 () {
    return createDuration(this);
}

function get$2 (units) {
    units = normalizeUnits(units);
    return this.isValid() ? this[units + 's']() : NaN;
}

function makeGetter(name) {
    return function () {
        return this.isValid() ? this._data[name] : NaN;
    };
}

var milliseconds = makeGetter('milliseconds');
var seconds      = makeGetter('seconds');
var minutes      = makeGetter('minutes');
var hours        = makeGetter('hours');
var days         = makeGetter('days');
var months       = makeGetter('months');
var years        = makeGetter('years');

function weeks () {
    return absFloor(this.days() / 7);
}

var round = Math.round;
var thresholds = {
    ss: 44,         // a few seconds to seconds
    s : 45,         // seconds to minute
    m : 45,         // minutes to hour
    h : 22,         // hours to day
    d : 26,         // days to month
    M : 11          // months to year
};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
    var duration = createDuration(posNegDuration).abs();
    var seconds  = round(duration.as('s'));
    var minutes  = round(duration.as('m'));
    var hours    = round(duration.as('h'));
    var days     = round(duration.as('d'));
    var months   = round(duration.as('M'));
    var years    = round(duration.as('y'));

    var a = seconds <= thresholds.ss && ['s', seconds]  ||
            seconds < thresholds.s   && ['ss', seconds] ||
            minutes <= 1             && ['m']           ||
            minutes < thresholds.m   && ['mm', minutes] ||
            hours   <= 1             && ['h']           ||
            hours   < thresholds.h   && ['hh', hours]   ||
            days    <= 1             && ['d']           ||
            days    < thresholds.d   && ['dd', days]    ||
            months  <= 1             && ['M']           ||
            months  < thresholds.M   && ['MM', months]  ||
            years   <= 1             && ['y']           || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding (roundingFunction) {
    if (roundingFunction === undefined) {
        return round;
    }
    if (typeof(roundingFunction) === 'function') {
        round = roundingFunction;
        return true;
    }
    return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold (threshold, limit) {
    if (thresholds[threshold] === undefined) {
        return false;
    }
    if (limit === undefined) {
        return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    if (threshold === 's') {
        thresholds.ss = limit - 1;
    }
    return true;
}

function humanize (withSuffix) {
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var locale = this.localeData();
    var output = relativeTime$1(this, !withSuffix, locale);

    if (withSuffix) {
        output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
}

var abs$1 = Math.abs;

function sign(x) {
    return ((x > 0) - (x < 0)) || +x;
}

function toISOString$1() {
    // for ISO strings we do not use the normal bubbling rules:
    //  * milliseconds bubble up until they become hours
    //  * days do not bubble at all
    //  * months bubble up until they become years
    // This is because there is no context-free conversion between hours and days
    // (think of clock changes)
    // and also not between days and months (28-31 days per month)
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var seconds = abs$1(this._milliseconds) / 1000;
    var days         = abs$1(this._days);
    var months       = abs$1(this._months);
    var minutes, hours, years;

    // 3600 seconds -> 60 minutes -> 1 hour
    minutes           = absFloor(seconds / 60);
    hours             = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;

    // 12 months -> 1 year
    years  = absFloor(months / 12);
    months %= 12;


    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
    var total = this.asSeconds();

    if (!total) {
        // this is the same as C#'s (Noda) and python (isodate)...
        // but not other JS (goog.date)
        return 'P0D';
    }

    var totalSign = total < 0 ? '-' : '';
    var ymSign = sign(this._months) !== sign(total) ? '-' : '';
    var daysSign = sign(this._days) !== sign(total) ? '-' : '';
    var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

    return totalSign + 'P' +
        (Y ? ymSign + Y + 'Y' : '') +
        (M ? ymSign + M + 'M' : '') +
        (D ? daysSign + D + 'D' : '') +
        ((h || m || s) ? 'T' : '') +
        (h ? hmsSign + h + 'H' : '') +
        (m ? hmsSign + m + 'M' : '') +
        (s ? hmsSign + s + 'S' : '');
}

var proto$2 = Duration.prototype;

proto$2.isValid        = isValid$1;
proto$2.abs            = abs;
proto$2.add            = add$1;
proto$2.subtract       = subtract$1;
proto$2.as             = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds      = asSeconds;
proto$2.asMinutes      = asMinutes;
proto$2.asHours        = asHours;
proto$2.asDays         = asDays;
proto$2.asWeeks        = asWeeks;
proto$2.asMonths       = asMonths;
proto$2.asYears        = asYears;
proto$2.valueOf        = valueOf$1;
proto$2._bubble        = bubble;
proto$2.clone          = clone$1;
proto$2.get            = get$2;
proto$2.milliseconds   = milliseconds;
proto$2.seconds        = seconds;
proto$2.minutes        = minutes;
proto$2.hours          = hours;
proto$2.days           = days;
proto$2.weeks          = weeks;
proto$2.months         = months;
proto$2.years          = years;
proto$2.humanize       = humanize;
proto$2.toISOString    = toISOString$1;
proto$2.toString       = toISOString$1;
proto$2.toJSON         = toISOString$1;
proto$2.locale         = locale;
proto$2.localeData     = localeData;

proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
proto$2.lang = lang;

// Side effect imports

// FORMATTING

addFormatToken('X', 0, 0, 'unix');
addFormatToken('x', 0, 0, 'valueOf');

// PARSING

addRegexToken('x', matchSigned);
addRegexToken('X', matchTimestamp);
addParseToken('X', function (input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
});
addParseToken('x', function (input, array, config) {
    config._d = new Date(toInt(input));
});

// Side effect imports


hooks.version = '2.21.0';

setHookCallback(createLocal);

hooks.fn                    = proto;
hooks.min                   = min;
hooks.max                   = max;
hooks.now                   = now;
hooks.utc                   = createUTC;
hooks.unix                  = createUnix;
hooks.months                = listMonths;
hooks.isDate                = isDate;
hooks.locale                = getSetGlobalLocale;
hooks.invalid               = createInvalid;
hooks.duration              = createDuration;
hooks.isMoment              = isMoment;
hooks.weekdays              = listWeekdays;
hooks.parseZone             = createInZone;
hooks.localeData            = getLocale;
hooks.isDuration            = isDuration;
hooks.monthsShort           = listMonthsShort;
hooks.weekdaysMin           = listWeekdaysMin;
hooks.defineLocale          = defineLocale;
hooks.updateLocale          = updateLocale;
hooks.locales               = listLocales;
hooks.weekdaysShort         = listWeekdaysShort;
hooks.normalizeUnits        = normalizeUnits;
hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat        = getCalendarFormat;
hooks.prototype             = proto;

// currently HTML5 input type only supports 24-hour formats
hooks.HTML5_FMT = {
    DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
    DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
    DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
    DATE: 'YYYY-MM-DD',                             // <input type="date" />
    TIME: 'HH:mm',                                  // <input type="time" />
    TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
    TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
    WEEK: 'YYYY-[W]WW',                             // <input type="week" />
    MONTH: 'YYYY-MM'                                // <input type="month" />
};

return hooks;

})));

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var prefix = 'mc-auto-complete';

var AutoComplete = function () {
  function AutoComplete(dom, options) {
    var _this = this;

    _classCallCheck(this, AutoComplete);

    this.autoComplete = $(dom);

    this.textContainerDom = this.autoComplete.find('.' + prefix + '-text-container');
    this.textInputDom = this.textContainerDom.find('.' + prefix + '-text');
    this.valueInputDom = this.textContainerDom.find('.' + prefix + '-value');

    this.optionContainerDom = this.autoComplete.find('.' + prefix + '-option-container');
    this.optionDoms = this.autoComplete.find('.' + prefix + '-option');

    document.addEventListener('click', function (e) {
      _this.autoComplete.removeClass('show');
    }, false);

    this.addListeners();

    this.keyword = '';
  }

  _createClass(AutoComplete, [{
    key: 'handleToggle',
    value: function handleToggle(e) {
      this.autoComplete.toggleClass('show');
      return false;
    }
  }, {
    key: 'handleInput',
    value: function handleInput(e) {
      var value = $(e.target).val();
      this.valueInputDom.val(value);
      if (value) {
        this.autoComplete.trigger('change');
      }
      this.keyword = value;
      this.renderOptions();
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(e) {
      var value = $(e.target).attr('data-value');
      var text = $(e.target).text();
      if (value) {
        this.autoComplete.removeClass('show');
        this.textInputDom.val(text);
        this.valueInputDom.val(value);
        this.valueInputDom.trigger('change');
        this.autoComplete.trigger('change');
      }
      this.keyword = value;
      this.renderOptions();
    }
  }, {
    key: 'renderOptions',
    value: function renderOptions() {
      var _this2 = this;

      var optionDoms = $.grep(this.optionDoms, function (item) {
        return $(item).text().match(_this2.keyword);
      });
      this.optionContainerDom.html(optionDoms);
      return false;
    }
  }, {
    key: 'addListeners',
    value: function addListeners() {
      this.textInputDom.on('input', this.handleInput.bind(this));
      this.textContainerDom.on('click', this.handleToggle.bind(this));
      this.optionContainerDom.on('click', this.handleSelect.bind(this));
    }
  }]);

  return AutoComplete;
}();

module.exports = AutoComplete;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var moment = require('moment');
var langs = require('./langs');
var prefix = 'mc-calendar';

var calendars = $('.' + prefix);

function getPopHtml(options) {
  var dayNames = langs[options.lang].dayNames;
  var confirmName = langs[options.lang].confirmName;
  return '<div class="mc-calendar-pop">\n    <div class="mc-calendar-pop-header"></div>\n    <div class="mc-calendar-pop-body">\n      <div class="mc-calendar-pop-calendar">\n        <div class="mc-calendar-pop-calendar-weeks">\n          ' + dayNames.map(function (item) {
    return '<span>' + item + '</span>';
  }).join('') + '\n        </div>\n        <div class="mc-calendar-pop-calendar-days"></div>\n      </div>\n      <div class="mc-calendar-pop-time"></div>\n    </div>\n    <div class="mc-calendar-pop-footer">\n      <a>' + confirmName + '</a>\n    </div>\n  </div>';
}

var Calendar = function () {
  function Calendar(dom) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Calendar);

    this.options = $.extend({}, Calendar.defaultOptions, options);
    this.calendarDom = $(dom);
    this.popDom = $(getPopHtml(this.options));
    this.calendarDom.append(this.popDom);
    this.calendarHeaderDom = this.popDom.find('.' + prefix + '-pop-header');
    this.calendarDaysDom = this.popDom.find('.' + prefix + '-pop-calendar-days');
    this.timeDom = this.popDom.find('.' + prefix + '-pop-time');

    this.now = new moment();
    this.month = new moment();

    this.selectedDate = new moment();
    this.selectedTime = new moment();

    this.renderMonth();
    this.renderDate();
    this.renderTime();

    this.addListeners();
  }

  _createClass(Calendar, [{
    key: 'handleToggle',
    value: function handleToggle(e) {
      $(this.calendarDom).toggleClass('show');
      return false;
    }
  }, {
    key: 'handleConfirm',
    value: function handleConfirm() {
      var value = this.selectedDate.format('YYYY-MM-DD') + ' ' + this.selectedTime.format('HH:mm');
      this.calendarDom.find('.' + prefix + '-text').val(value);
      this.calendarDom.find('.' + prefix + '-text').trigger('change');
      $(this.calendarDom).removeClass('show');
      return false;
    }
  }, {
    key: 'preMonth',
    value: function preMonth(e) {
      var context = e.data.context;
      context.month = context.month.subtract(1, 'month');
      context.renderMonth();
      context.renderDate();
    }
  }, {
    key: 'nextMonth',
    value: function nextMonth(e) {
      var context = e.data.context;
      context.month = context.month.add(1, 'month');
      context.renderMonth();
      context.renderDate();
    }
  }, {
    key: 'preHour',
    value: function preHour(e) {
      var context = e.data.context;
      context.selectedTime.subtract(1, 'hours');
      context.renderTime();
    }
  }, {
    key: 'nextHour',
    value: function nextHour(e) {
      var context = e.data.context;
      context.selectedTime.add(1, 'hours');
      context.renderTime();
    }
  }, {
    key: 'preMinute',
    value: function preMinute(e) {
      var context = e.data.context;
      context.selectedTime.subtract(1, 'minutes');
      context.renderTime();
    }
  }, {
    key: 'nextMinute',
    value: function nextMinute(e) {
      var context = e.data.context;
      context.selectedTime.add(1, 'minutes');
      context.renderTime();
    }
  }, {
    key: 'handleSelectDate',
    value: function handleSelectDate(e) {
      var context = e.data.context;
      if (!$(this).hasClass('disabled')) {
        context.selectedDate = new moment($(this).attr('data-date'));
        context.renderDate();
      }
    }
  }, {
    key: 'addListeners',
    value: function addListeners() {
      this.calendarDom.on('click', '.' + prefix + '-text-container', this.handleToggle.bind(this));
      this.popDom.on('click', '.' + prefix + '-pop-footer', this.handleConfirm.bind(this));

      this.calendarDaysDom.on('click', 'span', {
        context: this
      }, this.handleSelectDate);

      this.calendarHeaderDom.on('click', '.pre-btn', {
        context: this
      }, this.preMonth);

      this.calendarHeaderDom.on('click', '.next-btn', {
        context: this
      }, this.nextMonth);

      this.timeDom.on('click', '.' + prefix + '-pop-time-hour-left', {
        context: this
      }, this.preHour);

      this.timeDom.on('click', '.' + prefix + '-pop-time-hour-right', {
        context: this
      }, this.nextHour);

      this.timeDom.on('click', '.' + prefix + '-pop-time-minute-left', {
        context: this
      }, this.preMinute);

      this.timeDom.on('click', '.' + prefix + '-pop-time-minute-right', {
        context: this
      }, this.nextMinute);
    }
  }, {
    key: 'renderMonth',
    value: function renderMonth() {
      var month = this.month.format(langs[this.options.lang].monthFormat);
      this.calendarHeaderDom.html('\n      <span class="pre-btn"></span>\n      <span class="month">\n        ' + month + '\n      </span>\n      <span class="next-btn"></span>\n    ');
    }
  }, {
    key: 'renderDate',
    value: function renderDate() {
      var _this = this;

      var startDate = this.month.clone().startOf('month');
      var endDate = this.month.clone().endOf('month');
      var startWeekday = startDate.weekday();
      var endWeekday = endDate.weekday();
      var todayDate = this.now.date();

      var monthLen = endDate.date();

      var dateList = [];
      var tempStart = startDate.clone();
      var tempEnd = endDate.clone();
      var tempMonth = this.month.clone();

      if (startWeekday > 1) {
        for (var i = 0; i < startWeekday; i++) {
          dateList.unshift(tempStart.subtract(1, 'days').format('YYYY-MM-DD'));
        }
      }

      for (var _i = 1; _i <= monthLen; _i++) {
        dateList.push(tempMonth.date(_i).format('YYYY-MM-DD'));
      }

      if (endWeekday < 6) {
        for (var _i2 = 1; _i2 < 7 - endWeekday; _i2++) {
          dateList.push(tempEnd.add(1, 'days').format('YYYY-MM-DD'));
        }
      }

      var html = dateList.map(function (item) {
        if (new moment(item).isBefore(startDate) || new moment(item).isAfter(endDate)) {
          return '<span class="disabled" data-date="' + item + '"><i>' + new moment(item).date() + '</i></span>';
        } else if (_this.selectedDate && item === _this.selectedDate.format('YYYY-MM-DD')) {
          return '<span class="selected" data-date="' + item + '"><i>' + new moment(item).date() + '</i></span>';
        } else if (item === _this.now.format('YYYY-MM-DD')) {
          return '<span class="today" data-date="' + item + '"><i>' + new moment(item).date() + '</i></span>';
        } else {
          return '<span data-date="' + item + '"><i>' + new moment(item).date() + '</i></span>';
        }
      }).join('');

      this.calendarDaysDom.html(html);
    }
  }, {
    key: 'renderTime',
    value: function renderTime() {
      this.timeDom.html('\n      ' + langs[this.options.lang].timeName + '\n      <span class="mc-calendar-pop-time-hour-left"></span>\n      ' + this.selectedTime.format('HH') + '\n      <span class="mc-calendar-pop-time-hour-right"></span>\n      :\n      <span class="mc-calendar-pop-time-minute-left"></span>\n      ' + this.selectedTime.format('mm') + '\n      <span class="mc-calendar-pop-time-minute-right"></span>\n    ');
    }
  }]);

  return Calendar;
}();

Calendar.defaultOptions = {
  lang: 'zh',
  startDay: 1
};


module.exports = Calendar;

},{"./langs":4,"moment":1}],4:[function(require,module,exports){
'use strict';

var langs = {
  zh: {
    monthFormat: 'YYYY年MM月',
    confirmName: '确定',
    timeName: '时间',
    dayNames: ['日', '一', '二', '三', '四', '五', '六']

  },
  en: {
    monthFormat: 'MMMM YYYY',
    confirmName: 'confirm',
    timeName: 'time',
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }
};
module.exports = langs;

},{}],5:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = require('./base');

var prefix = 'mc-dialog-actionsheet';

var ActionSheet = function (_Base) {
  _inherits(ActionSheet, _Base);

  function ActionSheet(options) {
    _classCallCheck(this, ActionSheet);

    var _this = _possibleConstructorReturn(this, (ActionSheet.__proto__ || Object.getPrototypeOf(ActionSheet)).call(this));

    _this.hide = function () {
      _get(ActionSheet.prototype.__proto__ || Object.getPrototypeOf(ActionSheet.prototype), 'hide', _this).call(_this);
      $('.mc-dialog-mask').off('click', _this.hide);
    };

    _this.show = function () {
      if (!_this.mounted) _this.mount();
      _get(ActionSheet.prototype.__proto__ || Object.getPrototypeOf(ActionSheet.prototype), 'show', _this).call(_this);
      $('.mc-dialog-mask').on('click', _this.hide);
    };

    $.extend(_this, ActionSheet.defaultOptions, options);

    var self = _this;
    _this.container.className += ' ' + prefix;

    var buttons = options.buttons;

    var buttonsHtml = buttons.map(function (item, index) {
      return '<span class="button" data-index=' + index + '>' + item.text + '</span>';
    }).join('');
    _this.container.innerHTML = buttonsHtml;
    _this.content = _this.container.querySelector('.dialog-content-text');

    $(_this.container).on('click', '.button', function () {
      var _$$data = $(this).data(),
          index = _$$data.index;

      if (buttons[index] && buttons[index].onClick) {
        buttons[index].onClick(buttons[index]);
        self.hide();
      }
    });
    return _this;
  }

  return ActionSheet;
}(Base);

ActionSheet.defaultOptions = {
  contentHTML: 'This is content!',
  duration: 2000,
  useMask: false
};


module.exports = ActionSheet;

},{"./base":7}],6:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var General = require('./general');

var prefix = 'mc-dialog-alert';

var AlertDialog = function (_General) {
  _inherits(AlertDialog, _General);

  function AlertDialog(options) {
    _classCallCheck(this, AlertDialog);

    var _this = _possibleConstructorReturn(this, (AlertDialog.__proto__ || Object.getPrototypeOf(AlertDialog)).call(this));

    $.extend(_this, AlertDialog.defaultOptions, options);
    _this.container.className += ' ' + prefix;
    _this.buttonGroup.innerHTML = '<button>' + _this.buttonText + '</button>';
    _this.button = _this.buttonGroup.querySelector('button');
    _this.container.addEventListener('click', function (e) {
      if (e.target === _this.button) {
        _this.onConfirm.call(_this, function () {
          _this.hide();
        });
      }
    }, false);
    return _this;
  }

  return AlertDialog;
}(General);

AlertDialog.defaultOptions = {
  contentHTML: 'This is content!',
  buttonText: 'confirm',
  lang: 'zh',
  onConfirm: function onConfirm() {
    this.hide();
  }
};


module.exports = AlertDialog;

},{"./general":10}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mask = require('./mask');
var uniqueId = require('./utils').uniqueId;

var prefix = 'mc-dialog';

var Base = function () {
  function Base() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Base);

    this.id = uniqueId();
    this.isDisplay = false;
    this.useMask = true; // 是否使用遮罩
    this.mounted = false;
    this.container = document.createElement('div');
    this.container.className = prefix + (' ' + (options.className || ''));
    this.container.setAttribute('dialog-id', this.id);
    this.classList = this.container.classList;
    this.container.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  }

  _createClass(Base, [{
    key: 'mount',
    value: function mount() {
      document.body.appendChild(this.container);
      this.mounted = true;
    }
  }, {
    key: 'show',
    value: function show() {
      var _this = this;

      if (!this.mounted) this.mount();
      if (this.useMask) Base.mask.show();
      this.container.style.display = 'block';
      setTimeout(function () {
        return _this.classList.add('in');
      }, 0);
      this.isDisplay = true;
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this2 = this;

      if (this.useMask) Base.mask.hide();
      this.classList.remove('in');
      setTimeout(function () {
        return _this2.container.style.display = 'none';
      }, 300);
      this.isDisplay = false;
    }
  }]);

  return Base;
}();

Base.mask = new Mask();


module.exports = Base;

},{"./mask":13,"./utils":16}],8:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var General = require('./general');

var prefix = 'mc-dialog-complex';

var Complex = function (_General) {
  _inherits(Complex, _General);

  function Complex() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Complex);

    var _this = _possibleConstructorReturn(this, (Complex.__proto__ || Object.getPrototypeOf(Complex)).call(this, options));

    $.extend(_this, Complex.defaultOptions, options);
    _this.container.className += ' ' + prefix;
    _this.buttonGroup.innerHTML = _this.buttons.map(function (button) {
      return '<button class="complex-btn ' + (button.className || '') + '">' + button.text + '</button>';
    }).join('');
    _this.container.addEventListener('click', function (e) {
      var target = $(e.target);
      if (target.hasClass('complex-btn')) {
        var index = target.index();
        var onClick = _this.buttons[index] && _this.buttons[index].onClick;
        if (onClick) {
          onClick.call(_this, function () {
            _this.hide();
          });
        } else {
          _this.hide();
        }
      }
    }, false);
    return _this;
  }

  return Complex;
}(General);

Complex.defaultOptions = {
  contentHTML: 'This is content!',
  buttons: [{
    className: 'cancel',
    text: 'cancel',
    onClick: function onClick() {
      this.hide();
    }
  }]
};


module.exports = Complex;

},{"./general":10}],9:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var General = require('./general');

var prefix = 'mc-dialog-confirm';

var ConfirmDialog = function (_General) {
  _inherits(ConfirmDialog, _General);

  function ConfirmDialog(options) {
    _classCallCheck(this, ConfirmDialog);

    var _this = _possibleConstructorReturn(this, (ConfirmDialog.__proto__ || Object.getPrototypeOf(ConfirmDialog)).call(this, options));

    $.extend(_this, ConfirmDialog.defaultOptions, options);
    _this.container.className += ' ' + prefix;
    _this.buttonGroup.innerHTML = '\n      <button class="cancel-btn">' + _this.cancelButtonText + '</button>\n      <button class="confirm-btn">' + _this.confirmButtonText + '</button>\n    ';
    _this.confirmBtn = _this.buttonGroup.querySelector('.confirm-btn');
    _this.cancelBtn = _this.buttonGroup.querySelector('.cancel-btn');
    _this.container.addEventListener('click', function (e) {
      if (e.target === _this.confirmBtn) {
        _this.onConfirm.call(_this, function () {
          _this.hide();
        });
      } else if (e.target === _this.cancelBtn) {
        _this.onCancel.call(_this, function () {
          _this.hide();
        });
      }
    }, false);
    return _this;
  }

  return ConfirmDialog;
}(General);

ConfirmDialog.defaultOptions = {
  contentHTML: 'This is content!',
  confirmButtonText: 'confirm',
  cancelButtonText: 'cancel',
  lang: 'zh',
  onConfirm: function onConfirm() {
    this.hide();
  },
  onCancel: function onCancel() {
    this.hide();
  }
};


module.exports = ConfirmDialog;

},{"./general":10}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = require('./base');

var prefix = 'mc-dialog-general';

var tmpl = '\n  <div class="dialog-content"><p class="dialog-content-text"></p></div>\n  <div class="dialog-button-group"></div>\n';

var General = function (_Base) {
  _inherits(General, _Base);

  function General() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, General);

    var _this = _possibleConstructorReturn(this, (General.__proto__ || Object.getPrototypeOf(General)).call(this, options));

    _this.container.className += ' ' + prefix;
    _this.container.innerHTML = tmpl;
    _this.content = _this.container.querySelector('.dialog-content-text');
    _this.buttonGroup = _this.container.querySelector('.dialog-button-group');
    return _this;
  }

  _createClass(General, [{
    key: 'show',
    value: function show() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.contentHTML = options.contentHTML || this.contentHTML;
      this.content.innerHTML = this.contentHTML;
      _get(General.prototype.__proto__ || Object.getPrototypeOf(General.prototype), 'show', this).call(this);
    }
  }]);

  return General;
}(Base);

module.exports = General;

},{"./base":7}],11:[function(require,module,exports){
'use strict';

module.exports = {
  loading: {
    en: {
      loadingText: 'loading...'
    },
    zh: {
      loadingText: '加载中...'
    }
  },
  confirm: {
    en: {
      cancelName: 'cancel',
      confirmName: 'confirm'
    },
    zh: {
      cancelName: '取消',
      confirmName: '确认'
    }
  },
  alert: {
    en: {
      confirmName: 'confirm'
    },
    zh: {
      confirmName: '确认'
    }
  }
};

},{}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = require('./base');
var appendToSelector = require('./utils').appendToSelector;
var langs = require('./langs').loading;
var prefix = 'mc-dialog-loading';

var Loading = function (_Base) {
  _inherits(Loading, _Base);

  function Loading(options) {
    _classCallCheck(this, Loading);

    var _this = _possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).call(this));

    $.extend(_this, Loading.defaultOptions, options);

    var html = '';
    for (var i = 0; i < _this.count; i++) {
      html += '<i></i>';
    }

    _this.container.className += ' ' + prefix;
    _this.container.innerHTML = '\n      ' + html + '\n      <p>' + langs[_this.lang].loadingText + '</p>\n    ';

    return _this;
  }

  _createClass(Loading, [{
    key: 'show',
    value: function show() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!this.mounted) this.mount();
      _get(Loading.prototype.__proto__ || Object.getPrototypeOf(Loading.prototype), 'show', this).call(this);
    }
  }]);

  return Loading;
}(Base);

Loading.defaultOptions = {
  useMask: false,
  count: 12,
  lang: 'zh'
};


module.exports = Loading;

},{"./base":7,"./langs":11,"./utils":16}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uniqueId = require('./utils').uniqueId;

var prefix = 'mc-dialog-mask';

var Mask = function () {
  function Mask() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Mask);

    options = $.extend({
      zIndex: 9,
      opacity: .8
    }, options.mask);
    this.id = uniqueId();
    this.mounted = false;
    this.container = document.createElement('div');
    this.container.className = prefix;
    this.container.setAttribute('mask-id', this.id);
    this.container.addEventListener('touchmove', function (e) {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  }

  _createClass(Mask, [{
    key: 'mount',
    value: function mount() {
      document.body.appendChild(this.container);
      this.mounted = true;
    }
  }, {
    key: 'show',
    value: function show() {
      var _this = this;

      if (!this.mounted) this.mount();
      this.container.style.display = 'block';
      setTimeout(function () {
        return _this.container.classList.add('in');
      }, 0);
      this.isDisplay = true;
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this2 = this;

      this.container.classList.remove('in');
      setTimeout(function () {
        return _this2.container.style.display = 'none';
      }, 300);
      this.isDisplay = false;
    }
  }, {
    key: 'on',
    value: function on(eventType, fun) {
      this.container.addEventListener(eventType, fun, false);
    }
  }]);

  return Mask;
}();

module.exports = Mask;

},{"./utils":16}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = require('./base');

var prefix = 'mc-dialog-tip';

var Tip = function (_Base) {
  _inherits(Tip, _Base);

  function Tip(options) {
    _classCallCheck(this, Tip);

    var _this = _possibleConstructorReturn(this, (Tip.__proto__ || Object.getPrototypeOf(Tip)).call(this));

    $.extend(_this, Tip.defaultOptions, options);
    _this.container.className += ' ' + prefix;
    _this.container.innerHTML = '<p class="dialog-content-text"></p>';
    _this.content = _this.container.querySelector('.dialog-content-text');
    return _this;
  }

  _createClass(Tip, [{
    key: 'show',
    value: function show() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!this.mounted) this.mount();
      this.contentHTML = options.contentHTML || this.contentHTML;
      this.content.innerHTML = this.contentHTML;
      _get(Tip.prototype.__proto__ || Object.getPrototypeOf(Tip.prototype), 'show', this).call(this);
      clearTimeout(this.timerId);
      this.timerId = setTimeout(function () {
        _this2.hide();
      }, options.duration || this.duration);
    }
  }]);

  return Tip;
}(Base);

Tip.defaultOptions = {
  contentHTML: 'This is content!',
  duration: 2000,
  useMask: false
};


module.exports = Tip;

},{"./base":7}],15:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Base = require('./base');
var appendToSelector = require('./utils').appendToSelector;

var prefix = 'mc-dialog-toast';

var Toast = function (_Base) {
  _inherits(Toast, _Base);

  function Toast(options) {
    _classCallCheck(this, Toast);

    var _this = _possibleConstructorReturn(this, (Toast.__proto__ || Object.getPrototypeOf(Toast)).call(this));

    $.extend(_this, Toast.defaultOptions, options);
    _this.container.className += ' ' + prefix;
    _this.container.innerHTML = '<p class="dialog-content-text"></p>';
    _this.content = _this.container.querySelector('.dialog-content-text');
    return _this;
  }

  _createClass(Toast, [{
    key: 'show',
    value: function show() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!this.mounted) this.mount();
      this.contentHTML = options.contentHTML || this.contentHTML;
      this.content.innerHTML = this.contentHTML;
      _get(Toast.prototype.__proto__ || Object.getPrototypeOf(Toast.prototype), 'show', this).call(this);
      clearTimeout(this.timerId);
      this.timerId = setTimeout(function () {
        _this2.hide();
      }, options.duration || this.duration);
    }
  }]);

  return Toast;
}(Base);

Toast.defaultOptions = {
  contentHTML: 'This is content!',
  duration: 2000,
  useMask: false
};


module.exports = Toast;

},{"./base":7,"./utils":16}],16:[function(require,module,exports){
'use strict';

/**
 * 生成唯一8位ID
 * @type {[type]}
 */
exports.uniqueId = function () {
  var ids = [];
  return function () {
    var id = Math.random().toString(36).slice(-8);
    if (ids.indexOf(id) < 0) {
      ids.push(id);
      return id;
    } else {
      return uniqueId();
    }
  };
}();

/**
 * 将一个字符串添加到所有选择器后
 * @param  {[type]} style [description]
 * @param  {[type]} str   [description]
 * @param  {[type]} bloon   [description]
 * @return {[type]}       [description]
 */
exports.appendToSelector = function (style, str, toTail) {
  if (typeof style === 'string') {
    var reg = /[^}]+[\s]*?(?=\s*\{[\s\S]*)/gm;
    if (toTail) {
      return style.replace(reg, function (match) {
        return '' + match.trim() + str;
      });
    }
    return style.replace(reg, function (match) {
      return '' + str + match.trim();
    });
  } else {
    throw 'please pass in style sheet string';
  }
};

/**
 * 将一个字符串
 * @param  {[type]} style [description]
 * @param  {[type]} str   [description]
 * @return {[type]}       [description]
 */
exports.preAppendToSelector = function (style, str) {
  if (typeof style === 'string') {
    var reg = /[^}]+[\s]*?(?=\s*\{[\s\S]*)/gm;
    return style.replace(reg, function (match) {
      return match.trim() + ('[' + str + ']');
    });
  } else {
    throw 'please pass in style sheet string';
  }
};

},{}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var prefix = 'mc-image-uploader';

var imageUploaders = $('.' + prefix);

var noop = function noop() {};

var ImageUploader = function () {
  function ImageUploader(dom) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, ImageUploader);

    this.imageUploader = $(dom);

    this.pictureList = this.imageUploader.find('.' + prefix + '-list');
    this.placeholderDom = this.imageUploader.find('.' + prefix + '-placeholder');
    this.inputDom = $('<input type="file">');

    this.itemDoms = [];
    this.fileList = [];

    this.options = options;
    this.options.onChange = this.options.onChange || noop;
    this.options.onPreview = this.options.onPreview || noop;
    this.options.onRemove = this.options.onRemove || noop;

    this.options.getExtraParams = this.options.getExtraParams;

    this.renderThumbnail();
    this.addListeners();
  }

  _createClass(ImageUploader, [{
    key: 'pickImage',
    value: function pickImage() {
      this.inputDom.attr({
        accept: 'image/*'
      });
      this.inputDom.removeAttr('capture');
      this.inputDom.trigger('click');
    }
  }, {
    key: 'pickFile',
    value: function pickFile() {
      this.inputDom.removeAttr('accept').removeAttr('capture');
      this.inputDom.trigger('click');
    }
  }, {
    key: 'pickWithCamera',
    value: function pickWithCamera() {
      this.inputDom.attr({
        accept: 'image/*',
        capture: 'camera'
      });
      this.inputDom.trigger('click');
    }
  }, {
    key: 'readThumbnail',
    value: function readThumbnail(file) {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          resolve(e.target.result);
        };
        reader.onerror = reject;
      });
    }
  }, {
    key: 'renderThumbnail',
    value: function renderThumbnail() {
      this.pictureList.html(this.itemDoms.concat($('<span class="' + prefix + '-placeholder"></span>')));
    }
  }, {
    key: 'handleInputChange',
    value: function handleInputChange(e) {
      var _this = this;

      var file = e.target.files[0];
      if (file) {
        this.readThumbnail(file).then(function (data) {

          var upFileObject = {
            file: file,
            thumbnail: data,
            status: 'uploading'
          };
          var isImage = /^image\/.*/.test(file.type);

          _this.fileList = _this.fileList.concat(upFileObject);

          var thumbnailDom = $('<span class="' + prefix + '-item">\n              ' + (isImage ? '<img src="' + upFileObject.thumbnail + '" alt="">' : '<span class=' + prefix + '-file-placeholder></span>') + '\n              <span class="' + prefix + '-percentage"></span>\n              <span class="' + prefix + '-fail"></span>\n              <i></i>\n            </span>');

          _this.itemDoms = _this.itemDoms.concat(thumbnailDom);
          _this.renderThumbnail();
          _this.uploadFile(upFileObject, thumbnailDom);
          e.target.value = '';
        });
      }
    }
  }, {
    key: 'uploadFile',
    value: function uploadFile(upFileObject, thumbnailDom) {
      var _this2 = this;

      var data = new FormData();
      data.append("file", upFileObject.file);

      var getExtraParams = this.options.getExtraParams;
      var extraParams = getExtraParams();
      for (var key in extraParams) {
        if (extraParams.hasOwnProperty(key)) {
          var element = extraParams[key];
          data.append(key, element);
        }
      }

      var handleProgress = function handleProgress(e) {
        if (e.lengthComputable) {
          thumbnailDom.find('.' + prefix + '-percentage').addClass('active');
          thumbnailDom.find('.' + prefix + '-percentage').html(Math.round(e.loaded / e.total * 100) + "%");
        }
      };

      var handleUploadSuccess = function handleUploadSuccess(e) {
        upFileObject.status = 'done';
        thumbnailDom.find('.' + prefix + '-percentage').removeClass('active');
        _this2.options.onChange(_this2.fileList);
      };

      var handleUploadFail = function handleUploadFail(e) {
        upFileObject.status = 'error';
        thumbnailDom.find('.' + prefix + '-fail').addClass('active');
        thumbnailDom.find('.' + prefix + '-percentage').removeClass('active');
        _this2.options.onChange(_this2.fileList);
      };

      $.ajax({
        type: 'POST',
        contentType: false,
        processData: false,
        url: this.options.action || '',
        data: data,
        xhr: function xhr() {
          var xhr = $.ajaxSettings.xhr();
          upFileObject.xhr = xhr;
          if (xhr.upload) {
            xhr.onerror = handleUploadFail;
            xhr.upload.onprogress = handleProgress;
          }
          return xhr;
        },
        success: function success(data, status, xhr) {
          if (typeof _this2.options.judger !== 'function' || _this2.options.judger(data)) {
            upFileObject.responseData = data;
            handleUploadSuccess();
          } else {
            handleUploadFail();
          }
        },
        error: function error(xhr, errorType, _error) {
          handleUploadFail();
        }
      });
    }
  }, {
    key: 'handleRemoveItem',
    value: function handleRemoveItem(e) {
      e.preventDefault();
      e.stopPropagation();
      var context = e.data.context;
      var index = $(this).parent('.' + prefix + '-item').index();
      var file = context.fileList[index];
      var beforeRemove = context.options.beforeRemove;
      var remove = function remove() {
        context.fileList[index].xhr.abort();
        context.itemDoms.splice(index, 1);
        context.fileList.splice(index, 1);
        context.options.onChange(context.fileList);
        context.options.onRemove(file, index, context.fileList);
        context.renderThumbnail();
      };
      if (typeof beforeRemove === 'function') {
        beforeRemove(file, index, context.fileList, remove);
      } else {
        remove();
      }
    }
  }, {
    key: 'handlePreview',
    value: function handlePreview(e) {
      var context = e.data.context;
      var index = $(this).index();
      context.options.onPreview(context.fileList, index);
    }
  }, {
    key: 'addListeners',
    value: function addListeners() {
      var options = this.options;
      if (typeof options.customTrigger === 'function') {
        this.imageUploader.on('click', '.' + prefix + '-placeholder', options.customTrigger);
      } else {
        this.imageUploader.on('click', '.' + prefix + '-placeholder', this.handlePick.bind(this));
      }
      this.inputDom.on('change', this.handleInputChange.bind(this));
      this.imageUploader.on('click', '.' + prefix + '-item', {
        context: this
      }, this.handlePreview);

      this.imageUploader.on('click', 'i', {
        context: this
      }, this.handleRemoveItem);
    }
  }]);

  return ImageUploader;
}();

module.exports = ImageUploader;

// $.each(imageUploaders, (index, imageUploader) => {
//   new ImageUploader(imageUploader).init()
// })

},{}],18:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * mobileSelect.js
 * (c) 2017-present onlyhom
 * Released under the MIT License.
 */

(function () {
	function getClass(dom, string) {
		return dom.getElementsByClassName(string);
	}
	//构造器
	function MobileSelect(config) {
		this.mobileSelect;
		this.wheelsData = config.wheels;
		this.jsonType = false;
		this.cascadeJsonData = [];
		this.displayJson = [];
		this.curValue = [];
		this.curIndexArr = [];
		this.cascade = false;
		this.startY;
		this.moveEndY;
		this.moveY;
		this.oldMoveY;
		this.offset = 0;
		this.offsetSum = 0;
		this.oversizeBorder;
		this.curDistance = [];
		this.clickStatus = false;
		this.isPC = true;
		this.init(config);
	}
	MobileSelect.prototype = {
		constructor: MobileSelect,
		init: function init(config) {
			var _this = this;
			if (config.wheels[0].data.length == 0) {
				console.error('mobileSelect has been successfully installed, but the data is empty and cannot be initialized.');
				return false;
			}
			_this.keyMap = config.keyMap ? config.keyMap : { id: 'id', value: 'value', childs: 'childs' };
			_this.checkDataType();
			_this.renderWheels(_this.wheelsData, config.cancelBtnText, config.ensureBtnText);
			_this.trigger = document.querySelector(config.trigger);
			if (!_this.trigger) {
				console.error('mobileSelect has been successfully installed, but no trigger found on your page.');
				return false;
			}
			_this.wheel = getClass(_this.mobileSelect, 'wheel');
			_this.slider = getClass(_this.mobileSelect, 'selectContainer');
			_this.wheels = _this.mobileSelect.querySelector('.wheels');
			_this.liHeight = _this.mobileSelect.querySelector('li').offsetHeight;
			_this.ensureBtn = _this.mobileSelect.querySelector('.ensure');
			_this.cancelBtn = _this.mobileSelect.querySelector('.cancel');
			_this.grayLayer = _this.mobileSelect.querySelector('.grayLayer');
			_this.popUp = _this.mobileSelect.querySelector('.content');
			_this.callback = config.callback || function () {};
			_this.cancel = config.cancel || function () {};
			_this.transitionEnd = config.transitionEnd || function () {};
			_this.onShow = config.onShow || function () {};
			_this.onHide = config.onHide || function () {};
			_this.initPosition = config.position || [];
			_this.titleText = config.title || '';
			_this.connector = config.connector || ' ';
			_this.triggerDisplayData = !(typeof config.triggerDisplayData == 'undefined') ? config.triggerDisplayData : true;
			_this.trigger.style.cursor = 'pointer';
			_this.setStyle(config);
			_this.setTitle(_this.titleText);
			_this.checkIsPC();
			_this.checkCascade();
			_this.addListenerAll();

			if (_this.cascade) {
				_this.initCascade();
			}
			//定位 初始位置
			if (_this.initPosition.length < _this.slider.length) {
				var diff = _this.slider.length - _this.initPosition.length;
				for (var i = 0; i < diff; i++) {
					_this.initPosition.push(0);
				}
			}

			_this.setCurDistance(_this.initPosition);

			//按钮监听
			_this.cancelBtn.addEventListener('click', function () {
				_this.hide();
				_this.cancel(_this.curIndexArr, _this.curValue);
			});

			_this.ensureBtn.addEventListener('click', function () {
				_this.hide();
				if (!_this.liHeight) {
					_this.liHeight = _this.mobileSelect.querySelector('li').offsetHeight;
				}
				var tempValue = '';
				for (var i = 0; i < _this.wheel.length; i++) {
					i == _this.wheel.length - 1 ? tempValue += _this.getInnerHtml(i) : tempValue += _this.getInnerHtml(i) + _this.connector;
				}
				if (_this.triggerDisplayData) {
					_this.trigger.innerHTML = tempValue;
				}
				_this.curIndexArr = _this.getIndexArr();
				_this.curValue = _this.getCurValue();
				_this.callback(_this.curIndexArr, _this.curValue);
			});

			_this.trigger.addEventListener('click', function () {
				_this.show();
			});
			_this.grayLayer.addEventListener('click', function () {
				_this.hide();
				_this.cancel(_this.curIndexArr, _this.curValue);
			});
			_this.popUp.addEventListener('click', function () {
				event.stopPropagation();
			});

			_this.fixRowStyle(); //修正列数
		},

		setTitle: function setTitle(string) {
			var _this = this;
			_this.titleText = string;
			_this.mobileSelect.querySelector('.title').innerHTML = _this.titleText;
		},

		setStyle: function setStyle(config) {
			var _this = this;
			if (config.ensureBtnColor) {
				_this.ensureBtn.style.color = config.ensureBtnColor;
			}
			if (config.cancelBtnColor) {
				_this.cancelBtn.style.color = config.cancelBtnColor;
			}
			if (config.titleColor) {
				_this.title = _this.mobileSelect.querySelector('.title');
				_this.title.style.color = config.titleColor;
			}
			if (config.textColor) {
				_this.panel = _this.mobileSelect.querySelector('.panel');
				_this.panel.style.color = config.textColor;
			}
			if (config.titleBgColor) {
				_this.btnBar = _this.mobileSelect.querySelector('.btnBar');
				_this.btnBar.style.backgroundColor = config.titleBgColor;
			}
			if (config.bgColor) {
				_this.panel = _this.mobileSelect.querySelector('.panel');
				_this.shadowMask = _this.mobileSelect.querySelector('.shadowMask');
				_this.panel.style.backgroundColor = config.bgColor;
				_this.shadowMask.style.background = 'linear-gradient(to bottom, ' + config.bgColor + ', rgba(255, 255, 255, 0), ' + config.bgColor + ')';
			}
			if (!isNaN(config.maskOpacity)) {
				_this.grayMask = _this.mobileSelect.querySelector('.grayLayer');
				_this.grayMask.style.background = 'rgba(0, 0, 0, ' + config.maskOpacity + ')';
			}
		},

		checkIsPC: function checkIsPC() {
			var _this = this;
			var sUserAgent = navigator.userAgent.toLowerCase();
			var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
			var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
			var bIsMidp = sUserAgent.match(/midp/i) == "midp";
			var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
			var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
			var bIsAndroid = sUserAgent.match(/android/i) == "android";
			var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
			var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
			if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
				_this.isPC = false;
			}
		},

		show: function show() {
			this.mobileSelect.classList.add('mobileSelect-show');
			if (typeof this.onShow === 'function') {
				this.onShow(this);
			}
		},

		hide: function hide() {
			this.mobileSelect.classList.remove('mobileSelect-show');
			if (typeof this.onHide === 'function') {
				this.onHide(this);
			}
		},

		renderWheels: function renderWheels(wheelsData, cancelBtnText, ensureBtnText) {
			var _this = this;
			var cancelText = cancelBtnText ? cancelBtnText : '取消';
			var ensureText = ensureBtnText ? ensureBtnText : '确认';
			_this.mobileSelect = document.createElement("div");
			_this.mobileSelect.className = "mobileSelect";
			_this.mobileSelect.innerHTML = '<div class="grayLayer"></div>' + '<div class="content">' + '<div class="btnBar">' + '<div class="fixWidth">' + '<div class="cancel">' + cancelText + '</div>' + '<div class="title"></div>' + '<div class="ensure">' + ensureText + '</div>' + '</div>' + '</div>' + '<div class="panel">' + '<div class="fixWidth">' + '<div class="wheels">' + '</div>' + '<div class="selectLine"></div>' + '<div class="shadowMask"></div>' + '</div>' + '</div>' + '</div>';
			document.body.appendChild(_this.mobileSelect);

			//根据数据长度来渲染

			var tempHTML = '';
			for (var i = 0; i < wheelsData.length; i++) {
				//列
				tempHTML += '<div class="wheel"><ul class="selectContainer">';
				if (_this.jsonType) {
					for (var j = 0; j < wheelsData[i].data.length; j++) {
						//行
						tempHTML += '<li data-id="' + wheelsData[i].data[j][_this.keyMap.id] + '">' + wheelsData[i].data[j][_this.keyMap.value] + '</li>';
					}
				} else {
					for (var j = 0; j < wheelsData[i].data.length; j++) {
						//行
						tempHTML += '<li>' + wheelsData[i].data[j] + '</li>';
					}
				}
				tempHTML += '</ul></div>';
			}
			_this.mobileSelect.querySelector('.wheels').innerHTML = tempHTML;
		},

		addListenerAll: function addListenerAll() {
			var _this = this;
			for (var i = 0; i < _this.slider.length; i++) {
				//手势监听
				(function (i) {
					_this.addListenerWheel(_this.wheel[i], i);
				})(i);
			}
		},

		addListenerWheel: function addListenerWheel(theWheel, index) {
			var _this = this;
			theWheel.addEventListener('touchstart', function () {
				_this.touch(event, this.firstChild, index);
			}, false);
			theWheel.addEventListener('touchend', function () {
				_this.touch(event, this.firstChild, index);
			}, false);
			theWheel.addEventListener('touchmove', function () {
				_this.touch(event, this.firstChild, index);
			}, false);

			if (_this.isPC) {
				//如果是PC端则再增加拖拽监听 方便调试
				theWheel.addEventListener('mousedown', function () {
					_this.dragClick(event, this.firstChild, index);
				}, false);
				theWheel.addEventListener('mousemove', function () {
					_this.dragClick(event, this.firstChild, index);
				}, false);
				theWheel.addEventListener('mouseup', function () {
					_this.dragClick(event, this.firstChild, index);
				}, true);
			}
		},

		checkDataType: function checkDataType() {
			var _this = this;
			if (_typeof(_this.wheelsData[0].data[0]) == 'object') {
				_this.jsonType = true;
			}
		},

		checkCascade: function checkCascade() {
			var _this = this;
			if (_this.jsonType) {
				var node = _this.wheelsData[0].data;
				for (var i = 0; i < node.length; i++) {
					if (_this.keyMap.childs in node[i] && node[i][_this.keyMap.childs].length > 0) {
						_this.cascade = true;
						_this.cascadeJsonData = _this.wheelsData[0].data;
						break;
					}
				}
			} else {
				_this.cascade = false;
			}
		},

		generateArrData: function generateArrData(targetArr) {
			var tempArr = [];
			var keyMap_id = this.keyMap.id;
			var keyMap_value = this.keyMap.value;
			for (var i = 0; i < targetArr.length; i++) {
				var tempObj = {};
				tempObj[keyMap_id] = targetArr[i][this.keyMap.id];
				tempObj[keyMap_value] = targetArr[i][this.keyMap.value];
				tempArr.push(tempObj);
			}
			return tempArr;
		},

		initCascade: function initCascade() {
			var _this = this;
			_this.displayJson.push(_this.generateArrData(_this.cascadeJsonData));
			if (_this.initPosition.length > 0) {
				_this.initDeepCount = 0;
				_this.initCheckArrDeep(_this.cascadeJsonData[_this.initPosition[0]]);
			} else {
				_this.checkArrDeep(_this.cascadeJsonData[0]);
			}
			_this.reRenderWheels();
		},

		initCheckArrDeep: function initCheckArrDeep(parent) {
			var _this = this;
			if (parent) {
				if (_this.keyMap.childs in parent && parent[_this.keyMap.childs].length > 0) {
					_this.displayJson.push(_this.generateArrData(parent[_this.keyMap.childs]));
					_this.initDeepCount++;
					var nextNode = parent[_this.keyMap.childs][_this.initPosition[_this.initDeepCount]];
					if (nextNode) {
						_this.initCheckArrDeep(nextNode);
					} else {
						_this.checkArrDeep(parent[_this.keyMap.childs][0]);
					}
				}
			}
		},

		checkArrDeep: function checkArrDeep(parent) {
			//检测子节点深度  修改 displayJson
			var _this = this;
			if (parent) {
				if (_this.keyMap.childs in parent && parent[_this.keyMap.childs].length > 0) {
					_this.displayJson.push(_this.generateArrData(parent[_this.keyMap.childs])); //生成子节点数组
					_this.checkArrDeep(parent[_this.keyMap.childs][0]); //检测下一个子节点
				}
			}
		},

		checkRange: function checkRange(index, posIndexArr) {
			var _this = this;
			var deleteNum = _this.displayJson.length - 1 - index;
			for (var i = 0; i < deleteNum; i++) {
				_this.displayJson.pop(); //修改 displayJson
			}
			var resultNode;
			for (var i = 0; i <= index; i++) {
				if (i == 0) resultNode = _this.cascadeJsonData[posIndexArr[0]];else {
					resultNode = resultNode[_this.keyMap.childs][posIndexArr[i]];
				}
			}
			_this.checkArrDeep(resultNode);
			//console.log(_this.displayJson);
			_this.reRenderWheels();
			_this.fixRowStyle();
			_this.setCurDistance(_this.resetPosition(index, posIndexArr));
		},

		resetPosition: function resetPosition(index, posIndexArr) {
			var _this = this;
			var tempPosArr = posIndexArr;
			var tempCount;
			if (_this.slider.length > posIndexArr.length) {
				tempCount = _this.slider.length - posIndexArr.length;
				for (var i = 0; i < tempCount; i++) {
					tempPosArr.push(0);
				}
			} else if (_this.slider.length < posIndexArr.length) {
				tempCount = posIndexArr.length - _this.slider.length;
				for (var i = 0; i < tempCount; i++) {
					tempPosArr.pop();
				}
			}
			for (var i = index + 1; i < tempPosArr.length; i++) {
				tempPosArr[i] = 0;
			}
			return tempPosArr;
		},
		reRenderWheels: function reRenderWheels() {
			var _this = this;
			//删除多余的wheel
			if (_this.wheel.length > _this.displayJson.length) {
				var count = _this.wheel.length - _this.displayJson.length;
				for (var i = 0; i < count; i++) {
					_this.wheels.removeChild(_this.wheel[_this.wheel.length - 1]);
				}
			}
			for (var i = 0; i < _this.displayJson.length; i++) {
				//列
				(function (i) {
					var tempHTML = '';
					if (_this.wheel[i]) {
						//console.log('插入Li');
						for (var j = 0; j < _this.displayJson[i].length; j++) {
							//行
							tempHTML += '<li data-id="' + _this.displayJson[i][j][_this.keyMap.id] + '">' + _this.displayJson[i][j][_this.keyMap.value] + '</li>';
						}
						_this.slider[i].innerHTML = tempHTML;
					} else {
						var tempWheel = document.createElement("div");
						tempWheel.className = "wheel";
						tempHTML = '<ul class="selectContainer">';
						for (var j = 0; j < _this.displayJson[i].length; j++) {
							//行
							tempHTML += '<li data-id="' + _this.displayJson[i][j][_this.keyMap.id] + '">' + _this.displayJson[i][j][_this.keyMap.value] + '</li>';
						}
						tempHTML += '</ul>';
						tempWheel.innerHTML = tempHTML;

						_this.addListenerWheel(tempWheel, i);
						_this.wheels.appendChild(tempWheel);
					}
					//_this.·(i);
				})(i);
			}
		},

		updateWheels: function updateWheels(data) {
			var _this = this;
			if (_this.cascade) {
				_this.cascadeJsonData = data;
				_this.displayJson = [];
				_this.initCascade();
				if (_this.initPosition.length < _this.slider.length) {
					var diff = _this.slider.length - _this.initPosition.length;
					for (var i = 0; i < diff; i++) {
						_this.initPosition.push(0);
					}
				}
				_this.setCurDistance(_this.initPosition);
				_this.fixRowStyle();
			}
		},

		updateWheel: function updateWheel(sliderIndex, data) {
			var _this = this;
			var tempHTML = '';
			if (_this.cascade) {
				console.error('级联格式不支持updateWheel(),请使用updateWheels()更新整个数据源');
				return false;
			} else if (_this.jsonType) {
				for (var j = 0; j < data.length; j++) {
					tempHTML += '<li data-id="' + data[j][_this.keyMap.id] + '">' + data[j][_this.keyMap.value] + '</li>';
				}
				_this.wheelsData[sliderIndex] = { data: data };
			} else {
				for (var j = 0; j < data.length; j++) {
					tempHTML += '<li>' + data[j] + '</li>';
				}
				_this.wheelsData[sliderIndex] = data;
			}
			_this.slider[sliderIndex].innerHTML = tempHTML;
		},

		fixRowStyle: function fixRowStyle() {
			var _this = this;
			var width = (100 / _this.wheel.length).toFixed(2);
			for (var i = 0; i < _this.wheel.length; i++) {
				_this.wheel[i].style.width = width + '%';
			}
		},

		getIndex: function getIndex(distance) {
			return Math.round((2 * this.liHeight - distance) / this.liHeight);
		},

		getIndexArr: function getIndexArr() {
			var _this = this;
			var temp = [];
			for (var i = 0; i < _this.curDistance.length; i++) {
				temp.push(_this.getIndex(_this.curDistance[i]));
			}
			return temp;
		},

		getCurValue: function getCurValue() {
			var _this = this;
			var temp = [];
			var positionArr = _this.getIndexArr();
			if (_this.cascade) {
				for (var i = 0; i < _this.wheel.length; i++) {
					temp.push(_this.displayJson[i][positionArr[i]]);
				}
			} else if (_this.jsonType) {
				for (var i = 0; i < _this.curDistance.length; i++) {
					temp.push(_this.wheelsData[i].data[_this.getIndex(_this.curDistance[i])]);
				}
			} else {
				for (var i = 0; i < _this.curDistance.length; i++) {
					temp.push(_this.getInnerHtml(i));
				}
			}
			return temp;
		},

		getValue: function getValue() {
			return this.curValue;
		},

		calcDistance: function calcDistance(index) {
			return 2 * this.liHeight - index * this.liHeight;
		},

		setCurDistance: function setCurDistance(indexArr) {
			var _this = this;
			var temp = [];
			for (var i = 0; i < _this.slider.length; i++) {
				temp.push(_this.calcDistance(indexArr[i]));
				_this.movePosition(_this.slider[i], temp[i]);
			}
			_this.curDistance = temp;
		},

		fixPosition: function fixPosition(distance) {
			return -(this.getIndex(distance) - 2) * this.liHeight;
		},

		movePosition: function movePosition(theSlider, distance) {
			theSlider.style.webkitTransform = 'translate3d(0,' + distance + 'px, 0)';
			theSlider.style.transform = 'translate3d(0,' + distance + 'px, 0)';
		},

		locatePosition: function locatePosition(index, posIndex) {
			var _this = this;
			this.curDistance[index] = this.calcDistance(posIndex);
			this.movePosition(this.slider[index], this.curDistance[index]);
			if (_this.cascade) {
				_this.checkRange(index, _this.getIndexArr());
			}
		},

		updateCurDistance: function updateCurDistance(theSlider, index) {
			if (theSlider.style.transform) {
				this.curDistance[index] = parseInt(theSlider.style.transform.split(',')[1]);
			} else {
				this.curDistance[index] = parseInt(theSlider.style.webkitTransform.split(',')[1]);
			}
		},

		getDistance: function getDistance(theSlider) {
			if (theSlider.style.transform) {
				return parseInt(theSlider.style.transform.split(',')[1]);
			} else {
				return parseInt(theSlider.style.webkitTransform.split(',')[1]);
			}
		},

		getInnerHtml: function getInnerHtml(sliderIndex) {
			var _this = this;
			var index = _this.getIndex(_this.curDistance[sliderIndex]);
			return _this.slider[sliderIndex].getElementsByTagName('li')[index].innerHTML;
		},

		touch: function touch(event, theSlider, index) {
			var _this = this;
			event = event || window.event;
			switch (event.type) {
				case "touchstart":
					_this.startY = event.touches[0].clientY;
					_this.startY = parseInt(_this.startY);
					_this.oldMoveY = _this.startY;
					break;

				case "touchend":

					_this.moveEndY = parseInt(event.changedTouches[0].clientY);
					_this.offsetSum = _this.moveEndY - _this.startY;
					_this.oversizeBorder = -(theSlider.getElementsByTagName('li').length - 3) * _this.liHeight;

					if (_this.offsetSum == 0) {
						//offsetSum为0,相当于点击事件
						// 0 1 [2] 3 4
						var clickOffetNum = parseInt((document.documentElement.clientHeight - _this.moveEndY) / 40);
						if (clickOffetNum != 2) {
							var offset = clickOffetNum - 2;
							var newDistance = _this.curDistance[index] + offset * _this.liHeight;
							if (newDistance <= 2 * _this.liHeight && newDistance >= _this.oversizeBorder) {
								_this.curDistance[index] = newDistance;
								_this.movePosition(theSlider, _this.curDistance[index]);
								_this.transitionEnd(_this.getIndexArr(), _this.getCurValue());
							}
						}
					} else {
						//修正位置
						_this.updateCurDistance(theSlider, index);
						_this.curDistance[index] = _this.fixPosition(_this.curDistance[index]);
						_this.movePosition(theSlider, _this.curDistance[index]);

						//反弹
						if (_this.curDistance[index] + _this.offsetSum > 2 * _this.liHeight) {
							_this.curDistance[index] = 2 * _this.liHeight;
							setTimeout(function () {
								_this.movePosition(theSlider, _this.curDistance[index]);
							}, 100);
						} else if (_this.curDistance[index] + _this.offsetSum < _this.oversizeBorder) {
							_this.curDistance[index] = _this.oversizeBorder;
							setTimeout(function () {
								_this.movePosition(theSlider, _this.curDistance[index]);
							}, 100);
						}
						_this.transitionEnd(_this.getIndexArr(), _this.getCurValue());
					}

					if (_this.cascade) {
						_this.checkRange(index, _this.getIndexArr());
					}

					break;

				case "touchmove":
					event.preventDefault();
					_this.moveY = event.touches[0].clientY;
					_this.offset = _this.moveY - _this.oldMoveY;

					_this.updateCurDistance(theSlider, index);
					_this.curDistance[index] = _this.curDistance[index] + _this.offset;
					_this.movePosition(theSlider, _this.curDistance[index]);
					_this.oldMoveY = _this.moveY;
					break;
			}
		},

		dragClick: function dragClick(event, theSlider, index) {
			var _this = this;
			event = event || window.event;
			switch (event.type) {
				case "mousedown":
					_this.startY = event.clientY;
					_this.oldMoveY = _this.startY;
					_this.clickStatus = true;
					break;

				case "mouseup":

					_this.moveEndY = event.clientY;
					_this.offsetSum = _this.moveEndY - _this.startY;
					_this.oversizeBorder = -(theSlider.getElementsByTagName('li').length - 3) * _this.liHeight;

					if (_this.offsetSum == 0) {
						var clickOffetNum = parseInt((document.documentElement.clientHeight - _this.moveEndY) / 40);
						if (clickOffetNum != 2) {
							var offset = clickOffetNum - 2;
							var newDistance = _this.curDistance[index] + offset * _this.liHeight;
							if (newDistance <= 2 * _this.liHeight && newDistance >= _this.oversizeBorder) {
								_this.curDistance[index] = newDistance;
								_this.movePosition(theSlider, _this.curDistance[index]);
								_this.transitionEnd(_this.getIndexArr(), _this.getCurValue());
							}
						}
					} else {
						//修正位置
						_this.updateCurDistance(theSlider, index);
						_this.curDistance[index] = _this.fixPosition(_this.curDistance[index]);
						_this.movePosition(theSlider, _this.curDistance[index]);

						//反弹
						if (_this.curDistance[index] + _this.offsetSum > 2 * _this.liHeight) {
							_this.curDistance[index] = 2 * _this.liHeight;
							setTimeout(function () {
								_this.movePosition(theSlider, _this.curDistance[index]);
							}, 100);
						} else if (_this.curDistance[index] + _this.offsetSum < _this.oversizeBorder) {
							_this.curDistance[index] = _this.oversizeBorder;
							setTimeout(function () {
								_this.movePosition(theSlider, _this.curDistance[index]);
							}, 100);
						}
						_this.transitionEnd(_this.getIndexArr(), _this.getCurValue());
					}

					_this.clickStatus = false;
					if (_this.cascade) {
						_this.checkRange(index, _this.getIndexArr());
					}
					break;

				case "mousemove":
					event.preventDefault();
					if (_this.clickStatus) {
						_this.moveY = event.clientY;
						_this.offset = _this.moveY - _this.oldMoveY;
						_this.updateCurDistance(theSlider, index);
						_this.curDistance[index] = _this.curDistance[index] + _this.offset;
						_this.movePosition(theSlider, _this.curDistance[index]);
						_this.oldMoveY = _this.moveY;
					}
					break;
			}
		}

	};

	if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == "object") {
		module.exports = MobileSelect;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return MobileSelect;
		});
	} else {
		window.MobileSelect = MobileSelect;
	}
})();

},{}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var prefix = 'mc-select';

var selects = $('.' + prefix);

var Select = function () {
  function Select(dom, options) {
    var _this = this;

    _classCallCheck(this, Select);

    this.select = $(dom);

    this.textContainerDom = this.select.find('.' + prefix + '-text-container');
    this.textDom = this.textContainerDom.find('.' + prefix + '-text');
    this.valueInputDom = this.textContainerDom.find('.' + prefix + '-value');

    this.optionContainer = this.select.find('.' + prefix + '-option-container');
    this.optionContainerHeight = this.optionContainer[0].scrollHeight;

    if (!options.value) {
      this.textDom.addClass('placeholder');
      this.textDom.text(this.textDom.attr('placeholder'));
    }
    document.addEventListener('click', function (e) {
      _this.select.removeClass('show');
    }, false);

    this.addListeners();
  }

  _createClass(Select, [{
    key: 'handleToggle',
    value: function handleToggle(e) {
      if (this.select.hasClass('show')) {
        this.select.removeClass('show');
        this.optionContainer.height(0);
      } else {
        this.select.addClass('show');
        this.optionContainer.height(this.optionContainerHeight);
      }
      return false;
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(e) {
      var value = $(e.target).attr('data-value');
      var text = $(e.target).text();
      if (value) {
        this.handleToggle();
        $(this.textDom).removeClass('placeholder');
        this.textDom.text(text);
        this.valueInputDom.val(value);
        this.select.trigger('change');
        this.valueInputDom.trigger('change');
      }
      return false;
    }
  }, {
    key: 'addListeners',
    value: function addListeners() {
      this.textContainerDom.on('click', this.handleToggle.bind(this));
      this.optionContainer.on('click', this.handleSelect.bind(this));
    }
  }]);

  return Select;
}();

module.exports = Select;

},{}],20:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var prefix = 'mc-tab';

var tabs = $('.' + prefix + '-group');

var Tab = function () {
  function Tab(dom) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Tab);

    this.tabDom = $(dom);
    this.btnGroupDom = this.tabDom.find('.' + prefix + '-btns');
    this.btnDoms = this.tabDom.find('.' + prefix + '-btn');
    this.panelDoms = this.tabDom.find('.' + prefix + '-panel');

    this.addListeners();
  }

  _createClass(Tab, [{
    key: 'active',
    value: function active(index) {
      this.btnDoms.eq(index).addClass('active').siblings().removeClass('active');
      this.panelDoms.eq(index).addClass('active').siblings().removeClass('active');
    }
  }, {
    key: 'handleClickBtn',
    value: function handleClickBtn(e) {
      var index = $(e.target).index();
      if (index >= 0) {
        this.active(index);
      }
    }
  }, {
    key: 'addListeners',
    value: function addListeners() {
      this.btnGroupDom.on('click', this.handleClickBtn.bind(this));
    }
  }]);

  return Tab;
}();

module.exports = Tab;

},{}],21:[function(require,module,exports){
'use strict';

var Tab = require('./components/tab');
var Select = require('./components/select');
var AutoComplete = require('./components/autoComplete');
var Calendar = require('./components/calendar');
var ImageUploader = require('./components/imageUploader');
var MobileSelect = require('./components/mobile-select');
var Alert = require('./components/dialog/alert');
var Confirm = require('./components/dialog/confirm');
var Complex = require('./components/dialog/complex');
var Toast = require('./components/dialog/toast');
var Tip = require('./components/dialog/tip');
var ActionSheet = require('./components/dialog/actionSheet');
var Loading = require('./components/dialog/loading');

module.exports = {
  Alert: Alert,
  Confirm: Confirm,
  Complex: Complex,
  Toast: Toast,
  Loading: Loading,
  Tip: Tip,
  ActionSheet: ActionSheet,

  Tab: Tab,
  Select: Select,
  AutoComplete: AutoComplete,
  Calendar: Calendar,
  ImageUploader: ImageUploader,
  MobileSelect: MobileSelect
};

},{"./components/autoComplete":2,"./components/calendar":3,"./components/dialog/actionSheet":5,"./components/dialog/alert":6,"./components/dialog/complex":8,"./components/dialog/confirm":9,"./components/dialog/loading":12,"./components/dialog/tip":14,"./components/dialog/toast":15,"./components/imageUploader":17,"./components/mobile-select":18,"./components/select":19,"./components/tab":20}]},{},[21])(21)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbW9tZW50L21vbWVudC5qcyIsInNyYy9jb21wb25lbnRzL2F1dG9Db21wbGV0ZS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2NhbGVuZGFyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvY2FsZW5kYXIvbGFuZ3MuanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvYWN0aW9uU2hlZXQuanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvYWxlcnQuanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvYmFzZS5qcyIsInNyYy9jb21wb25lbnRzL2RpYWxvZy9jb21wbGV4LmpzIiwic3JjL2NvbXBvbmVudHMvZGlhbG9nL2NvbmZpcm0uanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvZ2VuZXJhbC5qcyIsInNyYy9jb21wb25lbnRzL2RpYWxvZy9sYW5ncy5qcyIsInNyYy9jb21wb25lbnRzL2RpYWxvZy9sb2FkaW5nLmpzIiwic3JjL2NvbXBvbmVudHMvZGlhbG9nL21hc2suanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvdGlwLmpzIiwic3JjL2NvbXBvbmVudHMvZGlhbG9nL3RvYXN0LmpzIiwic3JjL2NvbXBvbmVudHMvZGlhbG9nL3V0aWxzLmpzIiwic3JjL2NvbXBvbmVudHMvaW1hZ2VVcGxvYWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL21vYmlsZS1zZWxlY3QvbW9iaWxlLXNlbGVjdC5qcyIsInNyYy9jb21wb25lbnRzL3NlbGVjdC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3RhYi9pbmRleC5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQzE1SUEsSUFBTSxTQUFTLGtCQUFmOztJQUVNLFk7QUFDSix3QkFBWSxHQUFaLEVBQWlC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LElBQU0sVUFBVSxRQUFRLDZCQUFSLENBQWhCOztBQUVBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLGNBRGU7QUFFZixrQkFGZTtBQUdmLGtCQUhlO0FBSWYsY0FKZTtBQUtmLGtCQUxlO0FBTWYsVUFOZTtBQU9mLDBCQVBlOztBQVNmLFVBVGU7QUFVZixnQkFWZTtBQVdmLDRCQVhlO0FBWWYsb0JBWmU7QUFhZiw4QkFiZTtBQWNmO0FBZGUsQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIi8vISBtb21lbnQuanNcblxuOyhmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgZ2xvYmFsLm1vbWVudCA9IGZhY3RvcnkoKVxufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbnZhciBob29rQ2FsbGJhY2s7XG5cbmZ1bmN0aW9uIGhvb2tzICgpIHtcbiAgICByZXR1cm4gaG9va0NhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG59XG5cbi8vIFRoaXMgaXMgZG9uZSB0byByZWdpc3RlciB0aGUgbWV0aG9kIGNhbGxlZCB3aXRoIG1vbWVudCgpXG4vLyB3aXRob3V0IGNyZWF0aW5nIGNpcmN1bGFyIGRlcGVuZGVuY2llcy5cbmZ1bmN0aW9uIHNldEhvb2tDYWxsYmFjayAoY2FsbGJhY2spIHtcbiAgICBob29rQ2FsbGJhY2sgPSBjYWxsYmFjaztcbn1cblxuZnVuY3Rpb24gaXNBcnJheShpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dCBpbnN0YW5jZW9mIEFycmF5IHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGlucHV0KSB7XG4gICAgLy8gSUU4IHdpbGwgdHJlYXQgdW5kZWZpbmVkIGFuZCBudWxsIGFzIG9iamVjdCBpZiBpdCB3YXNuJ3QgZm9yXG4gICAgLy8gaW5wdXQgIT0gbnVsbFxuICAgIHJldHVybiBpbnB1dCAhPSBudWxsICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdEVtcHR5KG9iaikge1xuICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcykge1xuICAgICAgICByZXR1cm4gKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikubGVuZ3RoID09PSAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaztcbiAgICAgICAgZm9yIChrIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGlucHV0KSB7XG4gICAgcmV0dXJuIGlucHV0ID09PSB2b2lkIDA7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGlucHV0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgTnVtYmVyXSc7XG59XG5cbmZ1bmN0aW9uIGlzRGF0ZShpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dCBpbnN0YW5jZW9mIERhdGUgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG5mdW5jdGlvbiBtYXAoYXJyLCBmbikge1xuICAgIHZhciByZXMgPSBbXSwgaTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHJlcy5wdXNoKGZuKGFycltpXSwgaSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBoYXNPd25Qcm9wKGEsIGIpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIGIpO1xufVxuXG5mdW5jdGlvbiBleHRlbmQoYSwgYikge1xuICAgIGZvciAodmFyIGkgaW4gYikge1xuICAgICAgICBpZiAoaGFzT3duUHJvcChiLCBpKSkge1xuICAgICAgICAgICAgYVtpXSA9IGJbaV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzT3duUHJvcChiLCAndG9TdHJpbmcnKSkge1xuICAgICAgICBhLnRvU3RyaW5nID0gYi50b1N0cmluZztcbiAgICB9XG5cbiAgICBpZiAoaGFzT3duUHJvcChiLCAndmFsdWVPZicpKSB7XG4gICAgICAgIGEudmFsdWVPZiA9IGIudmFsdWVPZjtcbiAgICB9XG5cbiAgICByZXR1cm4gYTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVVRDIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgIHJldHVybiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCB0cnVlKS51dGMoKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFBhcnNpbmdGbGFncygpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGRlZXAgY2xvbmUgdGhpcyBvYmplY3QuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZW1wdHkgICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgIHVudXNlZFRva2VucyAgICA6IFtdLFxuICAgICAgICB1bnVzZWRJbnB1dCAgICAgOiBbXSxcbiAgICAgICAgb3ZlcmZsb3cgICAgICAgIDogLTIsXG4gICAgICAgIGNoYXJzTGVmdE92ZXIgICA6IDAsXG4gICAgICAgIG51bGxJbnB1dCAgICAgICA6IGZhbHNlLFxuICAgICAgICBpbnZhbGlkTW9udGggICAgOiBudWxsLFxuICAgICAgICBpbnZhbGlkRm9ybWF0ICAgOiBmYWxzZSxcbiAgICAgICAgdXNlckludmFsaWRhdGVkIDogZmFsc2UsXG4gICAgICAgIGlzbyAgICAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICBwYXJzZWREYXRlUGFydHMgOiBbXSxcbiAgICAgICAgbWVyaWRpZW0gICAgICAgIDogbnVsbCxcbiAgICAgICAgcmZjMjgyMiAgICAgICAgIDogZmFsc2UsXG4gICAgICAgIHdlZWtkYXlNaXNtYXRjaCA6IGZhbHNlXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0UGFyc2luZ0ZsYWdzKG0pIHtcbiAgICBpZiAobS5fcGYgPT0gbnVsbCkge1xuICAgICAgICBtLl9wZiA9IGRlZmF1bHRQYXJzaW5nRmxhZ3MoKTtcbiAgICB9XG4gICAgcmV0dXJuIG0uX3BmO1xufVxuXG52YXIgc29tZTtcbmlmIChBcnJheS5wcm90b3R5cGUuc29tZSkge1xuICAgIHNvbWUgPSBBcnJheS5wcm90b3R5cGUuc29tZTtcbn0gZWxzZSB7XG4gICAgc29tZSA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICAgICAgdmFyIHQgPSBPYmplY3QodGhpcyk7XG4gICAgICAgIHZhciBsZW4gPSB0Lmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiB0ICYmIGZ1bi5jYWxsKHRoaXMsIHRbaV0sIGksIHQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZChtKSB7XG4gICAgaWYgKG0uX2lzVmFsaWQgPT0gbnVsbCkge1xuICAgICAgICB2YXIgZmxhZ3MgPSBnZXRQYXJzaW5nRmxhZ3MobSk7XG4gICAgICAgIHZhciBwYXJzZWRQYXJ0cyA9IHNvbWUuY2FsbChmbGFncy5wYXJzZWREYXRlUGFydHMsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICByZXR1cm4gaSAhPSBudWxsO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGlzTm93VmFsaWQgPSAhaXNOYU4obS5fZC5nZXRUaW1lKCkpICYmXG4gICAgICAgICAgICBmbGFncy5vdmVyZmxvdyA8IDAgJiZcbiAgICAgICAgICAgICFmbGFncy5lbXB0eSAmJlxuICAgICAgICAgICAgIWZsYWdzLmludmFsaWRNb250aCAmJlxuICAgICAgICAgICAgIWZsYWdzLmludmFsaWRXZWVrZGF5ICYmXG4gICAgICAgICAgICAhZmxhZ3Mud2Vla2RheU1pc21hdGNoICYmXG4gICAgICAgICAgICAhZmxhZ3MubnVsbElucHV0ICYmXG4gICAgICAgICAgICAhZmxhZ3MuaW52YWxpZEZvcm1hdCAmJlxuICAgICAgICAgICAgIWZsYWdzLnVzZXJJbnZhbGlkYXRlZCAmJlxuICAgICAgICAgICAgKCFmbGFncy5tZXJpZGllbSB8fCAoZmxhZ3MubWVyaWRpZW0gJiYgcGFyc2VkUGFydHMpKTtcblxuICAgICAgICBpZiAobS5fc3RyaWN0KSB7XG4gICAgICAgICAgICBpc05vd1ZhbGlkID0gaXNOb3dWYWxpZCAmJlxuICAgICAgICAgICAgICAgIGZsYWdzLmNoYXJzTGVmdE92ZXIgPT09IDAgJiZcbiAgICAgICAgICAgICAgICBmbGFncy51bnVzZWRUb2tlbnMubGVuZ3RoID09PSAwICYmXG4gICAgICAgICAgICAgICAgZmxhZ3MuYmlnSG91ciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE9iamVjdC5pc0Zyb3plbiA9PSBudWxsIHx8ICFPYmplY3QuaXNGcm96ZW4obSkpIHtcbiAgICAgICAgICAgIG0uX2lzVmFsaWQgPSBpc05vd1ZhbGlkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlzTm93VmFsaWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG0uX2lzVmFsaWQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUludmFsaWQgKGZsYWdzKSB7XG4gICAgdmFyIG0gPSBjcmVhdGVVVEMoTmFOKTtcbiAgICBpZiAoZmxhZ3MgIT0gbnVsbCkge1xuICAgICAgICBleHRlbmQoZ2V0UGFyc2luZ0ZsYWdzKG0pLCBmbGFncyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MobSkudXNlckludmFsaWRhdGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbTtcbn1cblxuLy8gUGx1Z2lucyB0aGF0IGFkZCBwcm9wZXJ0aWVzIHNob3VsZCBhbHNvIGFkZCB0aGUga2V5IGhlcmUgKG51bGwgdmFsdWUpLFxuLy8gc28gd2UgY2FuIHByb3Blcmx5IGNsb25lIG91cnNlbHZlcy5cbnZhciBtb21lbnRQcm9wZXJ0aWVzID0gaG9va3MubW9tZW50UHJvcGVydGllcyA9IFtdO1xuXG5mdW5jdGlvbiBjb3B5Q29uZmlnKHRvLCBmcm9tKSB7XG4gICAgdmFyIGksIHByb3AsIHZhbDtcblxuICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5faXNBTW9tZW50T2JqZWN0KSkge1xuICAgICAgICB0by5faXNBTW9tZW50T2JqZWN0ID0gZnJvbS5faXNBTW9tZW50T2JqZWN0O1xuICAgIH1cbiAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2kpKSB7XG4gICAgICAgIHRvLl9pID0gZnJvbS5faTtcbiAgICB9XG4gICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9mKSkge1xuICAgICAgICB0by5fZiA9IGZyb20uX2Y7XG4gICAgfVxuICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fbCkpIHtcbiAgICAgICAgdG8uX2wgPSBmcm9tLl9sO1xuICAgIH1cbiAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX3N0cmljdCkpIHtcbiAgICAgICAgdG8uX3N0cmljdCA9IGZyb20uX3N0cmljdDtcbiAgICB9XG4gICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl90em0pKSB7XG4gICAgICAgIHRvLl90em0gPSBmcm9tLl90em07XG4gICAgfVxuICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5faXNVVEMpKSB7XG4gICAgICAgIHRvLl9pc1VUQyA9IGZyb20uX2lzVVRDO1xuICAgIH1cbiAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX29mZnNldCkpIHtcbiAgICAgICAgdG8uX29mZnNldCA9IGZyb20uX29mZnNldDtcbiAgICB9XG4gICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9wZikpIHtcbiAgICAgICAgdG8uX3BmID0gZ2V0UGFyc2luZ0ZsYWdzKGZyb20pO1xuICAgIH1cbiAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2xvY2FsZSkpIHtcbiAgICAgICAgdG8uX2xvY2FsZSA9IGZyb20uX2xvY2FsZTtcbiAgICB9XG5cbiAgICBpZiAobW9tZW50UHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwcm9wID0gbW9tZW50UHJvcGVydGllc1tpXTtcbiAgICAgICAgICAgIHZhbCA9IGZyb21bcHJvcF07XG4gICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKHZhbCkpIHtcbiAgICAgICAgICAgICAgICB0b1twcm9wXSA9IHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0bztcbn1cblxudmFyIHVwZGF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcblxuLy8gTW9tZW50IHByb3RvdHlwZSBvYmplY3RcbmZ1bmN0aW9uIE1vbWVudChjb25maWcpIHtcbiAgICBjb3B5Q29uZmlnKHRoaXMsIGNvbmZpZyk7XG4gICAgdGhpcy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5fZCAhPSBudWxsID8gY29uZmlnLl9kLmdldFRpbWUoKSA6IE5hTik7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICB0aGlzLl9kID0gbmV3IERhdGUoTmFOKTtcbiAgICB9XG4gICAgLy8gUHJldmVudCBpbmZpbml0ZSBsb29wIGluIGNhc2UgdXBkYXRlT2Zmc2V0IGNyZWF0ZXMgbmV3IG1vbWVudFxuICAgIC8vIG9iamVjdHMuXG4gICAgaWYgKHVwZGF0ZUluUHJvZ3Jlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzTW9tZW50IChvYmopIHtcbiAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTW9tZW50IHx8IChvYmogIT0gbnVsbCAmJiBvYmouX2lzQU1vbWVudE9iamVjdCAhPSBudWxsKTtcbn1cblxuZnVuY3Rpb24gYWJzRmxvb3IgKG51bWJlcikge1xuICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgIC8vIC0wIC0+IDBcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpIHx8IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRvSW50KGFyZ3VtZW50Rm9yQ29lcmNpb24pIHtcbiAgICB2YXIgY29lcmNlZE51bWJlciA9ICthcmd1bWVudEZvckNvZXJjaW9uLFxuICAgICAgICB2YWx1ZSA9IDA7XG5cbiAgICBpZiAoY29lcmNlZE51bWJlciAhPT0gMCAmJiBpc0Zpbml0ZShjb2VyY2VkTnVtYmVyKSkge1xuICAgICAgICB2YWx1ZSA9IGFic0Zsb29yKGNvZXJjZWROdW1iZXIpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuLy8gY29tcGFyZSB0d28gYXJyYXlzLCByZXR1cm4gdGhlIG51bWJlciBvZiBkaWZmZXJlbmNlc1xuZnVuY3Rpb24gY29tcGFyZUFycmF5cyhhcnJheTEsIGFycmF5MiwgZG9udENvbnZlcnQpIHtcbiAgICB2YXIgbGVuID0gTWF0aC5taW4oYXJyYXkxLmxlbmd0aCwgYXJyYXkyLmxlbmd0aCksXG4gICAgICAgIGxlbmd0aERpZmYgPSBNYXRoLmFicyhhcnJheTEubGVuZ3RoIC0gYXJyYXkyLmxlbmd0aCksXG4gICAgICAgIGRpZmZzID0gMCxcbiAgICAgICAgaTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKChkb250Q29udmVydCAmJiBhcnJheTFbaV0gIT09IGFycmF5MltpXSkgfHxcbiAgICAgICAgICAgICghZG9udENvbnZlcnQgJiYgdG9JbnQoYXJyYXkxW2ldKSAhPT0gdG9JbnQoYXJyYXkyW2ldKSkpIHtcbiAgICAgICAgICAgIGRpZmZzKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRpZmZzICsgbGVuZ3RoRGlmZjtcbn1cblxuZnVuY3Rpb24gd2Fybihtc2cpIHtcbiAgICBpZiAoaG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgKHR5cGVvZiBjb25zb2xlICE9PSAgJ3VuZGVmaW5lZCcpICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0RlcHJlY2F0aW9uIHdhcm5pbmc6ICcgKyBtc2cpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGVwcmVjYXRlKG1zZywgZm4pIHtcbiAgICB2YXIgZmlyc3RUaW1lID0gdHJ1ZTtcblxuICAgIHJldHVybiBleHRlbmQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlcihudWxsLCBtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICB2YXIgYXJnO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhcmcgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnICs9ICdcXG5bJyArIGkgKyAnXSAnO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXJndW1lbnRzWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgKz0ga2V5ICsgJzogJyArIGFyZ3VtZW50c1swXVtrZXldICsgJywgJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcuc2xpY2UoMCwgLTIpOyAvLyBSZW1vdmUgdHJhaWxpbmcgY29tbWEgYW5kIHNwYWNlXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhcmdzLnB1c2goYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdhcm4obXNnICsgJ1xcbkFyZ3VtZW50czogJyArIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpLmpvaW4oJycpICsgJ1xcbicgKyAobmV3IEVycm9yKCkpLnN0YWNrKTtcbiAgICAgICAgICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0sIGZuKTtcbn1cblxudmFyIGRlcHJlY2F0aW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBkZXByZWNhdGVTaW1wbGUobmFtZSwgbXNnKSB7XG4gICAgaWYgKGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlciAhPSBudWxsKSB7XG4gICAgICAgIGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlcihuYW1lLCBtc2cpO1xuICAgIH1cbiAgICBpZiAoIWRlcHJlY2F0aW9uc1tuYW1lXSkge1xuICAgICAgICB3YXJuKG1zZyk7XG4gICAgICAgIGRlcHJlY2F0aW9uc1tuYW1lXSA9IHRydWU7XG4gICAgfVxufVxuXG5ob29rcy5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPSBmYWxzZTtcbmhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlciA9IG51bGw7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oaW5wdXQpIHtcbiAgICByZXR1cm4gaW5wdXQgaW5zdGFuY2VvZiBGdW5jdGlvbiB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG5mdW5jdGlvbiBzZXQgKGNvbmZpZykge1xuICAgIHZhciBwcm9wLCBpO1xuICAgIGZvciAoaSBpbiBjb25maWcpIHtcbiAgICAgICAgcHJvcCA9IGNvbmZpZ1tpXTtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24ocHJvcCkpIHtcbiAgICAgICAgICAgIHRoaXNbaV0gPSBwcm9wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpc1snXycgKyBpXSA9IHByb3A7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xuICAgIC8vIExlbmllbnQgb3JkaW5hbCBwYXJzaW5nIGFjY2VwdHMganVzdCBhIG51bWJlciBpbiBhZGRpdGlvbiB0b1xuICAgIC8vIG51bWJlciArIChwb3NzaWJseSkgc3R1ZmYgY29taW5nIGZyb20gX2RheU9mTW9udGhPcmRpbmFsUGFyc2UuXG4gICAgLy8gVE9ETzogUmVtb3ZlIFwib3JkaW5hbFBhcnNlXCIgZmFsbGJhY2sgaW4gbmV4dCBtYWpvciByZWxlYXNlLlxuICAgIHRoaXMuX2RheU9mTW9udGhPcmRpbmFsUGFyc2VMZW5pZW50ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgKHRoaXMuX2RheU9mTW9udGhPcmRpbmFsUGFyc2Uuc291cmNlIHx8IHRoaXMuX29yZGluYWxQYXJzZS5zb3VyY2UpICtcbiAgICAgICAgICAgICd8JyArICgvXFxkezEsMn0vKS5zb3VyY2UpO1xufVxuXG5mdW5jdGlvbiBtZXJnZUNvbmZpZ3MocGFyZW50Q29uZmlnLCBjaGlsZENvbmZpZykge1xuICAgIHZhciByZXMgPSBleHRlbmQoe30sIHBhcmVudENvbmZpZyksIHByb3A7XG4gICAgZm9yIChwcm9wIGluIGNoaWxkQ29uZmlnKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGNoaWxkQ29uZmlnLCBwcm9wKSkge1xuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KHBhcmVudENvbmZpZ1twcm9wXSkgJiYgaXNPYmplY3QoY2hpbGRDb25maWdbcHJvcF0pKSB7XG4gICAgICAgICAgICAgICAgcmVzW3Byb3BdID0ge307XG4gICAgICAgICAgICAgICAgZXh0ZW5kKHJlc1twcm9wXSwgcGFyZW50Q29uZmlnW3Byb3BdKTtcbiAgICAgICAgICAgICAgICBleHRlbmQocmVzW3Byb3BdLCBjaGlsZENvbmZpZ1twcm9wXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkQ29uZmlnW3Byb3BdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXNbcHJvcF0gPSBjaGlsZENvbmZpZ1twcm9wXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlc1twcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHByb3AgaW4gcGFyZW50Q29uZmlnKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wKHBhcmVudENvbmZpZywgcHJvcCkgJiZcbiAgICAgICAgICAgICAgICAhaGFzT3duUHJvcChjaGlsZENvbmZpZywgcHJvcCkgJiZcbiAgICAgICAgICAgICAgICBpc09iamVjdChwYXJlbnRDb25maWdbcHJvcF0pKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgY2hhbmdlcyB0byBwcm9wZXJ0aWVzIGRvbid0IG1vZGlmeSBwYXJlbnQgY29uZmlnXG4gICAgICAgICAgICByZXNbcHJvcF0gPSBleHRlbmQoe30sIHJlc1twcm9wXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gTG9jYWxlKGNvbmZpZykge1xuICAgIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnNldChjb25maWcpO1xuICAgIH1cbn1cblxudmFyIGtleXM7XG5cbmlmIChPYmplY3Qua2V5cykge1xuICAgIGtleXMgPSBPYmplY3Qua2V5cztcbn0gZWxzZSB7XG4gICAga2V5cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdmFyIGksIHJlcyA9IFtdO1xuICAgICAgICBmb3IgKGkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChvYmosIGkpKSB7XG4gICAgICAgICAgICAgICAgcmVzLnB1c2goaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9O1xufVxuXG52YXIgZGVmYXVsdENhbGVuZGFyID0ge1xuICAgIHNhbWVEYXkgOiAnW1RvZGF5IGF0XSBMVCcsXG4gICAgbmV4dERheSA6ICdbVG9tb3Jyb3cgYXRdIExUJyxcbiAgICBuZXh0V2VlayA6ICdkZGRkIFthdF0gTFQnLFxuICAgIGxhc3REYXkgOiAnW1llc3RlcmRheSBhdF0gTFQnLFxuICAgIGxhc3RXZWVrIDogJ1tMYXN0XSBkZGRkIFthdF0gTFQnLFxuICAgIHNhbWVFbHNlIDogJ0wnXG59O1xuXG5mdW5jdGlvbiBjYWxlbmRhciAoa2V5LCBtb20sIG5vdykge1xuICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldIHx8IHRoaXMuX2NhbGVuZGFyWydzYW1lRWxzZSddO1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKG91dHB1dCkgPyBvdXRwdXQuY2FsbChtb20sIG5vdykgOiBvdXRwdXQ7XG59XG5cbnZhciBkZWZhdWx0TG9uZ0RhdGVGb3JtYXQgPSB7XG4gICAgTFRTICA6ICdoOm1tOnNzIEEnLFxuICAgIExUICAgOiAnaDptbSBBJyxcbiAgICBMICAgIDogJ01NL0REL1lZWVknLFxuICAgIExMICAgOiAnTU1NTSBELCBZWVlZJyxcbiAgICBMTEwgIDogJ01NTU0gRCwgWVlZWSBoOm1tIEEnLFxuICAgIExMTEwgOiAnZGRkZCwgTU1NTSBELCBZWVlZIGg6bW0gQSdcbn07XG5cbmZ1bmN0aW9uIGxvbmdEYXRlRm9ybWF0IChrZXkpIHtcbiAgICB2YXIgZm9ybWF0ID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSxcbiAgICAgICAgZm9ybWF0VXBwZXIgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV07XG5cbiAgICBpZiAoZm9ybWF0IHx8ICFmb3JtYXRVcHBlcikge1xuICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgIH1cblxuICAgIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0gPSBmb3JtYXRVcHBlci5yZXBsYWNlKC9NTU1NfE1NfEREfGRkZGQvZywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICByZXR1cm4gdmFsLnNsaWNlKDEpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV07XG59XG5cbnZhciBkZWZhdWx0SW52YWxpZERhdGUgPSAnSW52YWxpZCBkYXRlJztcblxuZnVuY3Rpb24gaW52YWxpZERhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLl9pbnZhbGlkRGF0ZTtcbn1cblxudmFyIGRlZmF1bHRPcmRpbmFsID0gJyVkJztcbnZhciBkZWZhdWx0RGF5T2ZNb250aE9yZGluYWxQYXJzZSA9IC9cXGR7MSwyfS87XG5cbmZ1bmN0aW9uIG9yZGluYWwgKG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLl9vcmRpbmFsLnJlcGxhY2UoJyVkJywgbnVtYmVyKTtcbn1cblxudmFyIGRlZmF1bHRSZWxhdGl2ZVRpbWUgPSB7XG4gICAgZnV0dXJlIDogJ2luICVzJyxcbiAgICBwYXN0ICAgOiAnJXMgYWdvJyxcbiAgICBzICA6ICdhIGZldyBzZWNvbmRzJyxcbiAgICBzcyA6ICclZCBzZWNvbmRzJyxcbiAgICBtICA6ICdhIG1pbnV0ZScsXG4gICAgbW0gOiAnJWQgbWludXRlcycsXG4gICAgaCAgOiAnYW4gaG91cicsXG4gICAgaGggOiAnJWQgaG91cnMnLFxuICAgIGQgIDogJ2EgZGF5JyxcbiAgICBkZCA6ICclZCBkYXlzJyxcbiAgICBNICA6ICdhIG1vbnRoJyxcbiAgICBNTSA6ICclZCBtb250aHMnLFxuICAgIHkgIDogJ2EgeWVhcicsXG4gICAgeXkgOiAnJWQgeWVhcnMnXG59O1xuXG5mdW5jdGlvbiByZWxhdGl2ZVRpbWUgKG51bWJlciwgd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSkge1xuICAgIHZhciBvdXRwdXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbc3RyaW5nXTtcbiAgICByZXR1cm4gKGlzRnVuY3Rpb24ob3V0cHV0KSkgP1xuICAgICAgICBvdXRwdXQobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSA6XG4gICAgICAgIG91dHB1dC5yZXBsYWNlKC8lZC9pLCBudW1iZXIpO1xufVxuXG5mdW5jdGlvbiBwYXN0RnV0dXJlIChkaWZmLCBvdXRwdXQpIHtcbiAgICB2YXIgZm9ybWF0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW2RpZmYgPiAwID8gJ2Z1dHVyZScgOiAncGFzdCddO1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKGZvcm1hdCkgPyBmb3JtYXQob3V0cHV0KSA6IGZvcm1hdC5yZXBsYWNlKC8lcy9pLCBvdXRwdXQpO1xufVxuXG52YXIgYWxpYXNlcyA9IHt9O1xuXG5mdW5jdGlvbiBhZGRVbml0QWxpYXMgKHVuaXQsIHNob3J0aGFuZCkge1xuICAgIHZhciBsb3dlckNhc2UgPSB1bml0LnRvTG93ZXJDYXNlKCk7XG4gICAgYWxpYXNlc1tsb3dlckNhc2VdID0gYWxpYXNlc1tsb3dlckNhc2UgKyAncyddID0gYWxpYXNlc1tzaG9ydGhhbmRdID0gdW5pdDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVW5pdHModW5pdHMpIHtcbiAgICByZXR1cm4gdHlwZW9mIHVuaXRzID09PSAnc3RyaW5nJyA/IGFsaWFzZXNbdW5pdHNdIHx8IGFsaWFzZXNbdW5pdHMudG9Mb3dlckNhc2UoKV0gOiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU9iamVjdFVuaXRzKGlucHV0T2JqZWN0KSB7XG4gICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IHt9LFxuICAgICAgICBub3JtYWxpemVkUHJvcCxcbiAgICAgICAgcHJvcDtcblxuICAgIGZvciAocHJvcCBpbiBpbnB1dE9iamVjdCkge1xuICAgICAgICBpZiAoaGFzT3duUHJvcChpbnB1dE9iamVjdCwgcHJvcCkpIHtcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wID0gbm9ybWFsaXplVW5pdHMocHJvcCk7XG4gICAgICAgICAgICBpZiAobm9ybWFsaXplZFByb3ApIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkSW5wdXRbbm9ybWFsaXplZFByb3BdID0gaW5wdXRPYmplY3RbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm9ybWFsaXplZElucHV0O1xufVxuXG52YXIgcHJpb3JpdGllcyA9IHt9O1xuXG5mdW5jdGlvbiBhZGRVbml0UHJpb3JpdHkodW5pdCwgcHJpb3JpdHkpIHtcbiAgICBwcmlvcml0aWVzW3VuaXRdID0gcHJpb3JpdHk7XG59XG5cbmZ1bmN0aW9uIGdldFByaW9yaXRpemVkVW5pdHModW5pdHNPYmopIHtcbiAgICB2YXIgdW5pdHMgPSBbXTtcbiAgICBmb3IgKHZhciB1IGluIHVuaXRzT2JqKSB7XG4gICAgICAgIHVuaXRzLnB1c2goe3VuaXQ6IHUsIHByaW9yaXR5OiBwcmlvcml0aWVzW3VdfSk7XG4gICAgfVxuICAgIHVuaXRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEucHJpb3JpdHkgLSBiLnByaW9yaXR5O1xuICAgIH0pO1xuICAgIHJldHVybiB1bml0cztcbn1cblxuZnVuY3Rpb24gemVyb0ZpbGwobnVtYmVyLCB0YXJnZXRMZW5ndGgsIGZvcmNlU2lnbikge1xuICAgIHZhciBhYnNOdW1iZXIgPSAnJyArIE1hdGguYWJzKG51bWJlciksXG4gICAgICAgIHplcm9zVG9GaWxsID0gdGFyZ2V0TGVuZ3RoIC0gYWJzTnVtYmVyLmxlbmd0aCxcbiAgICAgICAgc2lnbiA9IG51bWJlciA+PSAwO1xuICAgIHJldHVybiAoc2lnbiA/IChmb3JjZVNpZ24gPyAnKycgOiAnJykgOiAnLScpICtcbiAgICAgICAgTWF0aC5wb3coMTAsIE1hdGgubWF4KDAsIHplcm9zVG9GaWxsKSkudG9TdHJpbmcoKS5zdWJzdHIoMSkgKyBhYnNOdW1iZXI7XG59XG5cbnZhciBmb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KFtIaF1tbShzcyk/fE1vfE1NP00/TT98RG98REREb3xERD9EP0Q/fGRkZD9kP3xkbz98d1tvfHddP3xXW298V10/fFFvP3xZWVlZWVl8WVlZWVl8WVlZWXxZWXxnZyhnZ2c/KT98R0coR0dHPyk/fGV8RXxhfEF8aGg/fEhIP3xraz98bW0/fHNzP3xTezEsOX18eHxYfHp6P3xaWj98LikvZztcblxudmFyIGxvY2FsRm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhMVFN8TFR8TEw/TD9MP3xsezEsNH0pL2c7XG5cbnZhciBmb3JtYXRGdW5jdGlvbnMgPSB7fTtcblxudmFyIGZvcm1hdFRva2VuRnVuY3Rpb25zID0ge307XG5cbi8vIHRva2VuOiAgICAnTSdcbi8vIHBhZGRlZDogICBbJ01NJywgMl1cbi8vIG9yZGluYWw6ICAnTW8nXG4vLyBjYWxsYmFjazogZnVuY3Rpb24gKCkgeyB0aGlzLm1vbnRoKCkgKyAxIH1cbmZ1bmN0aW9uIGFkZEZvcm1hdFRva2VuICh0b2tlbiwgcGFkZGVkLCBvcmRpbmFsLCBjYWxsYmFjaykge1xuICAgIHZhciBmdW5jID0gY2FsbGJhY2s7XG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW2NhbGxiYWNrXSgpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbdG9rZW5dID0gZnVuYztcbiAgICB9XG4gICAgaWYgKHBhZGRlZCkge1xuICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1twYWRkZWRbMF1dID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHplcm9GaWxsKGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgcGFkZGVkWzFdLCBwYWRkZWRbMl0pO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAob3JkaW5hbCkge1xuICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1tvcmRpbmFsXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5vcmRpbmFsKGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgdG9rZW4pO1xuICAgICAgICB9O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhpbnB1dCkge1xuICAgIGlmIChpbnB1dC5tYXRjaCgvXFxbW1xcc1xcU10vKSkge1xuICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKTtcbiAgICB9XG4gICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL1xcXFwvZywgJycpO1xufVxuXG5mdW5jdGlvbiBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgdmFyIGFycmF5ID0gZm9ybWF0Lm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpLCBpLCBsZW5ndGg7XG5cbiAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dKSB7XG4gICAgICAgICAgICBhcnJheVtpXSA9IGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFycmF5W2ldID0gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhhcnJheVtpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gJycsIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb3V0cHV0ICs9IGlzRnVuY3Rpb24oYXJyYXlbaV0pID8gYXJyYXlbaV0uY2FsbChtb20sIGZvcm1hdCkgOiBhcnJheVtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG59XG5cbi8vIGZvcm1hdCBkYXRlIHVzaW5nIG5hdGl2ZSBkYXRlIG9iamVjdFxuZnVuY3Rpb24gZm9ybWF0TW9tZW50KG0sIGZvcm1hdCkge1xuICAgIGlmICghbS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIG0ubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgfVxuXG4gICAgZm9ybWF0ID0gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbS5sb2NhbGVEYXRhKCkpO1xuICAgIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdID0gZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0gfHwgbWFrZUZvcm1hdEZ1bmN0aW9uKGZvcm1hdCk7XG5cbiAgICByZXR1cm4gZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0obSk7XG59XG5cbmZ1bmN0aW9uIGV4cGFuZEZvcm1hdChmb3JtYXQsIGxvY2FsZSkge1xuICAgIHZhciBpID0gNTtcblxuICAgIGZ1bmN0aW9uIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2VucyhpbnB1dCkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLmxvbmdEYXRlRm9ybWF0KGlucHV0KSB8fCBpbnB1dDtcbiAgICB9XG5cbiAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICB3aGlsZSAoaSA+PSAwICYmIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy50ZXN0KGZvcm1hdCkpIHtcbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UobG9jYWxGb3JtYXR0aW5nVG9rZW5zLCByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMpO1xuICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgaSAtPSAxO1xuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXQ7XG59XG5cbnZhciBtYXRjaDEgICAgICAgICA9IC9cXGQvOyAgICAgICAgICAgIC8vICAgICAgIDAgLSA5XG52YXIgbWF0Y2gyICAgICAgICAgPSAvXFxkXFxkLzsgICAgICAgICAgLy8gICAgICAwMCAtIDk5XG52YXIgbWF0Y2gzICAgICAgICAgPSAvXFxkezN9LzsgICAgICAgICAvLyAgICAgMDAwIC0gOTk5XG52YXIgbWF0Y2g0ICAgICAgICAgPSAvXFxkezR9LzsgICAgICAgICAvLyAgICAwMDAwIC0gOTk5OVxudmFyIG1hdGNoNiAgICAgICAgID0gL1srLV0/XFxkezZ9LzsgICAgLy8gLTk5OTk5OSAtIDk5OTk5OVxudmFyIG1hdGNoMXRvMiAgICAgID0gL1xcZFxcZD8vOyAgICAgICAgIC8vICAgICAgIDAgLSA5OVxudmFyIG1hdGNoM3RvNCAgICAgID0gL1xcZFxcZFxcZFxcZD8vOyAgICAgLy8gICAgIDk5OSAtIDk5OTlcbnZhciBtYXRjaDV0bzYgICAgICA9IC9cXGRcXGRcXGRcXGRcXGRcXGQ/LzsgLy8gICA5OTk5OSAtIDk5OTk5OVxudmFyIG1hdGNoMXRvMyAgICAgID0gL1xcZHsxLDN9LzsgICAgICAgLy8gICAgICAgMCAtIDk5OVxudmFyIG1hdGNoMXRvNCAgICAgID0gL1xcZHsxLDR9LzsgICAgICAgLy8gICAgICAgMCAtIDk5OTlcbnZhciBtYXRjaDF0bzYgICAgICA9IC9bKy1dP1xcZHsxLDZ9LzsgIC8vIC05OTk5OTkgLSA5OTk5OTlcblxudmFyIG1hdGNoVW5zaWduZWQgID0gL1xcZCsvOyAgICAgICAgICAgLy8gICAgICAgMCAtIGluZlxudmFyIG1hdGNoU2lnbmVkICAgID0gL1srLV0/XFxkKy87ICAgICAgLy8gICAgLWluZiAtIGluZlxuXG52YXIgbWF0Y2hPZmZzZXQgICAgPSAvWnxbKy1dXFxkXFxkOj9cXGRcXGQvZ2k7IC8vICswMDowMCAtMDA6MDAgKzAwMDAgLTAwMDAgb3IgWlxudmFyIG1hdGNoU2hvcnRPZmZzZXQgPSAvWnxbKy1dXFxkXFxkKD86Oj9cXGRcXGQpPy9naTsgLy8gKzAwIC0wMCArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcblxudmFyIG1hdGNoVGltZXN0YW1wID0gL1srLV0/XFxkKyhcXC5cXGR7MSwzfSk/LzsgLy8gMTIzNDU2Nzg5IDEyMzQ1Njc4OS4xMjNcblxuLy8gYW55IHdvcmQgKG9yIHR3bykgY2hhcmFjdGVycyBvciBudW1iZXJzIGluY2x1ZGluZyB0d28vdGhyZWUgd29yZCBtb250aCBpbiBhcmFiaWMuXG4vLyBpbmNsdWRlcyBzY290dGlzaCBnYWVsaWMgdHdvIHdvcmQgYW5kIGh5cGhlbmF0ZWQgbW9udGhzXG52YXIgbWF0Y2hXb3JkID0gL1swLTldezAsMjU2fVsnYS16XFx1MDBBMC1cXHUwNUZGXFx1MDcwMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRjA3XFx1RkYxMC1cXHVGRkVGXXsxLDI1Nn18W1xcdTA2MDAtXFx1MDZGRlxcL117MSwyNTZ9KFxccyo/W1xcdTA2MDAtXFx1MDZGRl17MSwyNTZ9KXsxLDJ9L2k7XG5cbnZhciByZWdleGVzID0ge307XG5cbmZ1bmN0aW9uIGFkZFJlZ2V4VG9rZW4gKHRva2VuLCByZWdleCwgc3RyaWN0UmVnZXgpIHtcbiAgICByZWdleGVzW3Rva2VuXSA9IGlzRnVuY3Rpb24ocmVnZXgpID8gcmVnZXggOiBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZURhdGEpIHtcbiAgICAgICAgcmV0dXJuIChpc1N0cmljdCAmJiBzdHJpY3RSZWdleCkgPyBzdHJpY3RSZWdleCA6IHJlZ2V4O1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGdldFBhcnNlUmVnZXhGb3JUb2tlbiAodG9rZW4sIGNvbmZpZykge1xuICAgIGlmICghaGFzT3duUHJvcChyZWdleGVzLCB0b2tlbikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAodW5lc2NhcGVGb3JtYXQodG9rZW4pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVnZXhlc1t0b2tlbl0oY29uZmlnLl9zdHJpY3QsIGNvbmZpZy5fbG9jYWxlKTtcbn1cblxuLy8gQ29kZSBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzU2MTQ5My9pcy10aGVyZS1hLXJlZ2V4cC1lc2NhcGUtZnVuY3Rpb24taW4tamF2YXNjcmlwdFxuZnVuY3Rpb24gdW5lc2NhcGVGb3JtYXQocykge1xuICAgIHJldHVybiByZWdleEVzY2FwZShzLnJlcGxhY2UoJ1xcXFwnLCAnJykucmVwbGFjZSgvXFxcXChcXFspfFxcXFwoXFxdKXxcXFsoW15cXF1cXFtdKilcXF18XFxcXCguKS9nLCBmdW5jdGlvbiAobWF0Y2hlZCwgcDEsIHAyLCBwMywgcDQpIHtcbiAgICAgICAgcmV0dXJuIHAxIHx8IHAyIHx8IHAzIHx8IHA0O1xuICAgIH0pKTtcbn1cblxuZnVuY3Rpb24gcmVnZXhFc2NhcGUocykge1xuICAgIHJldHVybiBzLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xufVxuXG52YXIgdG9rZW5zID0ge307XG5cbmZ1bmN0aW9uIGFkZFBhcnNlVG9rZW4gKHRva2VuLCBjYWxsYmFjaykge1xuICAgIHZhciBpLCBmdW5jID0gY2FsbGJhY2s7XG4gICAgaWYgKHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdG9rZW4gPSBbdG9rZW5dO1xuICAgIH1cbiAgICBpZiAoaXNOdW1iZXIoY2FsbGJhY2spKSB7XG4gICAgICAgIGZ1bmMgPSBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgICAgICBhcnJheVtjYWxsYmFja10gPSB0b0ludChpbnB1dCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB0b2tlbnNbdG9rZW5baV1dID0gZnVuYztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZFdlZWtQYXJzZVRva2VuICh0b2tlbiwgY2FsbGJhY2spIHtcbiAgICBhZGRQYXJzZVRva2VuKHRva2VuLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgY2FsbGJhY2soaW5wdXQsIGNvbmZpZy5fdywgY29uZmlnLCB0b2tlbik7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBpbnB1dCwgY29uZmlnKSB7XG4gICAgaWYgKGlucHV0ICE9IG51bGwgJiYgaGFzT3duUHJvcCh0b2tlbnMsIHRva2VuKSkge1xuICAgICAgICB0b2tlbnNbdG9rZW5dKGlucHV0LCBjb25maWcuX2EsIGNvbmZpZywgdG9rZW4pO1xuICAgIH1cbn1cblxudmFyIFlFQVIgPSAwO1xudmFyIE1PTlRIID0gMTtcbnZhciBEQVRFID0gMjtcbnZhciBIT1VSID0gMztcbnZhciBNSU5VVEUgPSA0O1xudmFyIFNFQ09ORCA9IDU7XG52YXIgTUlMTElTRUNPTkQgPSA2O1xudmFyIFdFRUsgPSA3O1xudmFyIFdFRUtEQVkgPSA4O1xuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKCdZJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB5ID0gdGhpcy55ZWFyKCk7XG4gICAgcmV0dXJuIHkgPD0gOTk5OSA/ICcnICsgeSA6ICcrJyArIHk7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oMCwgWydZWScsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMueWVhcigpICUgMTAwO1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWScsICAgNF0sICAgICAgIDAsICd5ZWFyJyk7XG5hZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVlZJywgIDVdLCAgICAgICAwLCAneWVhcicpO1xuYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZWVknLCA2LCB0cnVlXSwgMCwgJ3llYXInKTtcblxuLy8gQUxJQVNFU1xuXG5hZGRVbml0QWxpYXMoJ3llYXInLCAneScpO1xuXG4vLyBQUklPUklUSUVTXG5cbmFkZFVuaXRQcmlvcml0eSgneWVhcicsIDEpO1xuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ1knLCAgICAgIG1hdGNoU2lnbmVkKTtcbmFkZFJlZ2V4VG9rZW4oJ1lZJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbmFkZFJlZ2V4VG9rZW4oJ1lZWVknLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbmFkZFJlZ2V4VG9rZW4oJ1lZWVlZJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbmFkZFJlZ2V4VG9rZW4oJ1lZWVlZWScsIG1hdGNoMXRvNiwgbWF0Y2g2KTtcblxuYWRkUGFyc2VUb2tlbihbJ1lZWVlZJywgJ1lZWVlZWSddLCBZRUFSKTtcbmFkZFBhcnNlVG9rZW4oJ1lZWVknLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgYXJyYXlbWUVBUl0gPSBpbnB1dC5sZW5ndGggPT09IDIgPyBob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCkgOiB0b0ludChpbnB1dCk7XG59KTtcbmFkZFBhcnNlVG9rZW4oJ1lZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgIGFycmF5W1lFQVJdID0gaG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xufSk7XG5hZGRQYXJzZVRva2VuKCdZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgIGFycmF5W1lFQVJdID0gcGFyc2VJbnQoaW5wdXQsIDEwKTtcbn0pO1xuXG4vLyBIRUxQRVJTXG5cbmZ1bmN0aW9uIGRheXNJblllYXIoeWVhcikge1xuICAgIHJldHVybiBpc0xlYXBZZWFyKHllYXIpID8gMzY2IDogMzY1O1xufVxuXG5mdW5jdGlvbiBpc0xlYXBZZWFyKHllYXIpIHtcbiAgICByZXR1cm4gKHllYXIgJSA0ID09PSAwICYmIHllYXIgJSAxMDAgIT09IDApIHx8IHllYXIgJSA0MDAgPT09IDA7XG59XG5cbi8vIEhPT0tTXG5cbmhvb2tzLnBhcnNlVHdvRGlnaXRZZWFyID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgcmV0dXJuIHRvSW50KGlucHV0KSArICh0b0ludChpbnB1dCkgPiA2OCA/IDE5MDAgOiAyMDAwKTtcbn07XG5cbi8vIE1PTUVOVFNcblxudmFyIGdldFNldFllYXIgPSBtYWtlR2V0U2V0KCdGdWxsWWVhcicsIHRydWUpO1xuXG5mdW5jdGlvbiBnZXRJc0xlYXBZZWFyICgpIHtcbiAgICByZXR1cm4gaXNMZWFwWWVhcih0aGlzLnllYXIoKSk7XG59XG5cbmZ1bmN0aW9uIG1ha2VHZXRTZXQgKHVuaXQsIGtlZXBUaW1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgc2V0JDEodGhpcywgdW5pdCwgdmFsdWUpO1xuICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIGtlZXBUaW1lKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGdldCh0aGlzLCB1bml0KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGdldCAobW9tLCB1bml0KSB7XG4gICAgcmV0dXJuIG1vbS5pc1ZhbGlkKCkgP1xuICAgICAgICBtb20uX2RbJ2dldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0oKSA6IE5hTjtcbn1cblxuZnVuY3Rpb24gc2V0JDEgKG1vbSwgdW5pdCwgdmFsdWUpIHtcbiAgICBpZiAobW9tLmlzVmFsaWQoKSAmJiAhaXNOYU4odmFsdWUpKSB7XG4gICAgICAgIGlmICh1bml0ID09PSAnRnVsbFllYXInICYmIGlzTGVhcFllYXIobW9tLnllYXIoKSkgJiYgbW9tLm1vbnRoKCkgPT09IDEgJiYgbW9tLmRhdGUoKSA9PT0gMjkpIHtcbiAgICAgICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSh2YWx1ZSwgbW9tLm1vbnRoKCksIGRheXNJbk1vbnRoKHZhbHVlLCBtb20ubW9udGgoKSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gTU9NRU5UU1xuXG5mdW5jdGlvbiBzdHJpbmdHZXQgKHVuaXRzKSB7XG4gICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgaWYgKGlzRnVuY3Rpb24odGhpc1t1bml0c10pKSB7XG4gICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuXG5mdW5jdGlvbiBzdHJpbmdTZXQgKHVuaXRzLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdW5pdHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplT2JqZWN0VW5pdHModW5pdHMpO1xuICAgICAgICB2YXIgcHJpb3JpdGl6ZWQgPSBnZXRQcmlvcml0aXplZFVuaXRzKHVuaXRzKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmlvcml0aXplZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpc1twcmlvcml0aXplZFtpXS51bml0XSh1bml0c1twcmlvcml0aXplZFtpXS51bml0XSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odGhpc1t1bml0c10pKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1t1bml0c10odmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBtb2QobiwgeCkge1xuICAgIHJldHVybiAoKG4gJSB4KSArIHgpICUgeDtcbn1cblxudmFyIGluZGV4T2Y7XG5cbmlmIChBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgIGluZGV4T2YgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZjtcbn0gZWxzZSB7XG4gICAgaW5kZXhPZiA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIC8vIEkga25vd1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmICh0aGlzW2ldID09PSBvKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGRheXNJbk1vbnRoKHllYXIsIG1vbnRoKSB7XG4gICAgaWYgKGlzTmFOKHllYXIpIHx8IGlzTmFOKG1vbnRoKSkge1xuICAgICAgICByZXR1cm4gTmFOO1xuICAgIH1cbiAgICB2YXIgbW9kTW9udGggPSBtb2QobW9udGgsIDEyKTtcbiAgICB5ZWFyICs9IChtb250aCAtIG1vZE1vbnRoKSAvIDEyO1xuICAgIHJldHVybiBtb2RNb250aCA9PT0gMSA/IChpc0xlYXBZZWFyKHllYXIpID8gMjkgOiAyOCkgOiAoMzEgLSBtb2RNb250aCAlIDcgJSAyKTtcbn1cblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbignTScsIFsnTU0nLCAyXSwgJ01vJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vbnRoKCkgKyAxO1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKCdNTU0nLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRoc1Nob3J0KHRoaXMsIGZvcm1hdCk7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oJ01NTU0nLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRocyh0aGlzLCBmb3JtYXQpO1xufSk7XG5cbi8vIEFMSUFTRVNcblxuYWRkVW5pdEFsaWFzKCdtb250aCcsICdNJyk7XG5cbi8vIFBSSU9SSVRZXG5cbmFkZFVuaXRQcmlvcml0eSgnbW9udGgnLCA4KTtcblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCdNJywgICAgbWF0Y2gxdG8yKTtcbmFkZFJlZ2V4VG9rZW4oJ01NJywgICBtYXRjaDF0bzIsIG1hdGNoMik7XG5hZGRSZWdleFRva2VuKCdNTU0nLCAgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICByZXR1cm4gbG9jYWxlLm1vbnRoc1Nob3J0UmVnZXgoaXNTdHJpY3QpO1xufSk7XG5hZGRSZWdleFRva2VuKCdNTU1NJywgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICByZXR1cm4gbG9jYWxlLm1vbnRoc1JlZ2V4KGlzU3RyaWN0KTtcbn0pO1xuXG5hZGRQYXJzZVRva2VuKFsnTScsICdNTSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgYXJyYXlbTU9OVEhdID0gdG9JbnQoaW5wdXQpIC0gMTtcbn0pO1xuXG5hZGRQYXJzZVRva2VuKFsnTU1NJywgJ01NTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgIHZhciBtb250aCA9IGNvbmZpZy5fbG9jYWxlLm1vbnRoc1BhcnNlKGlucHV0LCB0b2tlbiwgY29uZmlnLl9zdHJpY3QpO1xuICAgIC8vIGlmIHdlIGRpZG4ndCBmaW5kIGEgbW9udGggbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkLlxuICAgIGlmIChtb250aCAhPSBudWxsKSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9IG1vbnRoO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRNb250aCA9IGlucHV0O1xuICAgIH1cbn0pO1xuXG4vLyBMT0NBTEVTXG5cbnZhciBNT05USFNfSU5fRk9STUFUID0gL0Rbb0RdPyhcXFtbXlxcW1xcXV0qXFxdfFxccykrTU1NTT8vO1xudmFyIGRlZmF1bHRMb2NhbGVNb250aHMgPSAnSmFudWFyeV9GZWJydWFyeV9NYXJjaF9BcHJpbF9NYXlfSnVuZV9KdWx5X0F1Z3VzdF9TZXB0ZW1iZXJfT2N0b2Jlcl9Ob3ZlbWJlcl9EZWNlbWJlcicuc3BsaXQoJ18nKTtcbmZ1bmN0aW9uIGxvY2FsZU1vbnRocyAobSwgZm9ybWF0KSB7XG4gICAgaWYgKCFtKSB7XG4gICAgICAgIHJldHVybiBpc0FycmF5KHRoaXMuX21vbnRocykgPyB0aGlzLl9tb250aHMgOlxuICAgICAgICAgICAgdGhpcy5fbW9udGhzWydzdGFuZGFsb25lJ107XG4gICAgfVxuICAgIHJldHVybiBpc0FycmF5KHRoaXMuX21vbnRocykgPyB0aGlzLl9tb250aHNbbS5tb250aCgpXSA6XG4gICAgICAgIHRoaXMuX21vbnRoc1sodGhpcy5fbW9udGhzLmlzRm9ybWF0IHx8IE1PTlRIU19JTl9GT1JNQVQpLnRlc3QoZm9ybWF0KSA/ICdmb3JtYXQnIDogJ3N0YW5kYWxvbmUnXVttLm1vbnRoKCldO1xufVxuXG52YXIgZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0ID0gJ0phbl9GZWJfTWFyX0Fwcl9NYXlfSnVuX0p1bF9BdWdfU2VwX09jdF9Ob3ZfRGVjJy5zcGxpdCgnXycpO1xuZnVuY3Rpb24gbG9jYWxlTW9udGhzU2hvcnQgKG0sIGZvcm1hdCkge1xuICAgIGlmICghbSkge1xuICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl9tb250aHNTaG9ydCkgPyB0aGlzLl9tb250aHNTaG9ydCA6XG4gICAgICAgICAgICB0aGlzLl9tb250aHNTaG9ydFsnc3RhbmRhbG9uZSddO1xuICAgIH1cbiAgICByZXR1cm4gaXNBcnJheSh0aGlzLl9tb250aHNTaG9ydCkgPyB0aGlzLl9tb250aHNTaG9ydFttLm1vbnRoKCldIDpcbiAgICAgICAgdGhpcy5fbW9udGhzU2hvcnRbTU9OVEhTX0lOX0ZPUk1BVC50ZXN0KGZvcm1hdCkgPyAnZm9ybWF0JyA6ICdzdGFuZGFsb25lJ11bbS5tb250aCgpXTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU3RyaWN0UGFyc2UobW9udGhOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgIHZhciBpLCBpaSwgbW9tLCBsbGMgPSBtb250aE5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICBpZiAoIXRoaXMuX21vbnRoc1BhcnNlKSB7XG4gICAgICAgIC8vIHRoaXMgaXMgbm90IHVzZWRcbiAgICAgICAgdGhpcy5fbW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlID0gW107XG4gICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyArK2kpIHtcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXSA9IHRoaXMubW9udGhzU2hvcnQobW9tLCAnJykudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXSA9IHRoaXMubW9udGhzKG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgIGlmIChmb3JtYXQgPT09ICdNTU0nKSB7XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydE1vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX2xvbmdNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm9ybWF0ID09PSAnTU1NJykge1xuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9sb25nTW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbG9uZ01vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0TW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsb2NhbGVNb250aHNQYXJzZSAobW9udGhOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgaWYgKHRoaXMuX21vbnRoc1BhcnNlRXhhY3QpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZVN0cmljdFBhcnNlLmNhbGwodGhpcywgbW9udGhOYW1lLCBmb3JtYXQsIHN0cmljdCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICB0aGlzLl9tb250aHNQYXJzZSA9IFtdO1xuICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGFkZCBzb3J0aW5nXG4gICAgLy8gU29ydGluZyBtYWtlcyBzdXJlIGlmIG9uZSBtb250aCAob3IgYWJicikgaXMgYSBwcmVmaXggb2YgYW5vdGhlclxuICAgIC8vIHNlZSBzb3J0aW5nIGluIGNvbXB1dGVNb250aHNQYXJzZVxuICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIGldKTtcbiAgICAgICAgaWYgKHN0cmljdCAmJiAhdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsICdpJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzdHJpY3QgJiYgIXRoaXMuX21vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJyk7XG4gICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ01NTU0nICYmIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9IGVsc2UgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdNTU0nICYmIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfSBlbHNlIGlmICghc3RyaWN0ICYmIHRoaXMuX21vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIE1PTUVOVFNcblxuZnVuY3Rpb24gc2V0TW9udGggKG1vbSwgdmFsdWUpIHtcbiAgICB2YXIgZGF5T2ZNb250aDtcblxuICAgIGlmICghbW9tLmlzVmFsaWQoKSkge1xuICAgICAgICAvLyBObyBvcFxuICAgICAgICByZXR1cm4gbW9tO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICgvXlxcZCskLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgdmFsdWUgPSB0b0ludCh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG1vbS5sb2NhbGVEYXRhKCkubW9udGhzUGFyc2UodmFsdWUpO1xuICAgICAgICAgICAgLy8gVE9ETzogQW5vdGhlciBzaWxlbnQgZmFpbHVyZT9cbiAgICAgICAgICAgIGlmICghaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRheU9mTW9udGggPSBNYXRoLm1pbihtb20uZGF0ZSgpLCBkYXlzSW5Nb250aChtb20ueWVhcigpLCB2YWx1ZSkpO1xuICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyAnTW9udGgnXSh2YWx1ZSwgZGF5T2ZNb250aCk7XG4gICAgcmV0dXJuIG1vbTtcbn1cblxuZnVuY3Rpb24gZ2V0U2V0TW9udGggKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgc2V0TW9udGgodGhpcywgdmFsdWUpO1xuICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBnZXQodGhpcywgJ01vbnRoJyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXREYXlzSW5Nb250aCAoKSB7XG4gICAgcmV0dXJuIGRheXNJbk1vbnRoKHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCkpO1xufVxuXG52YXIgZGVmYXVsdE1vbnRoc1Nob3J0UmVnZXggPSBtYXRjaFdvcmQ7XG5mdW5jdGlvbiBtb250aHNTaG9ydFJlZ2V4IChpc1N0cmljdCkge1xuICAgIGlmICh0aGlzLl9tb250aHNQYXJzZUV4YWN0KSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1JlZ2V4JykpIHtcbiAgICAgICAgICAgIGNvbXB1dGVNb250aHNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1Nob3J0U3RyaWN0UmVnZXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRSZWdleDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1Nob3J0UmVnZXgnKSkge1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzU2hvcnRSZWdleCA9IGRlZmF1bHRNb250aHNTaG9ydFJlZ2V4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1Nob3J0U3RyaWN0UmVnZXggOiB0aGlzLl9tb250aHNTaG9ydFJlZ2V4O1xuICAgIH1cbn1cblxudmFyIGRlZmF1bHRNb250aHNSZWdleCA9IG1hdGNoV29yZDtcbmZ1bmN0aW9uIG1vbnRoc1JlZ2V4IChpc1N0cmljdCkge1xuICAgIGlmICh0aGlzLl9tb250aHNQYXJzZUV4YWN0KSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1JlZ2V4JykpIHtcbiAgICAgICAgICAgIGNvbXB1dGVNb250aHNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1N0cmljdFJlZ2V4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1JlZ2V4O1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfbW9udGhzUmVnZXgnKSkge1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzUmVnZXggPSBkZWZhdWx0TW9udGhzUmVnZXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1N0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1N0cmljdFJlZ2V4IDogdGhpcy5fbW9udGhzUmVnZXg7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb21wdXRlTW9udGhzUGFyc2UgKCkge1xuICAgIGZ1bmN0aW9uIGNtcExlblJldihhLCBiKSB7XG4gICAgICAgIHJldHVybiBiLmxlbmd0aCAtIGEubGVuZ3RoO1xuICAgIH1cblxuICAgIHZhciBzaG9ydFBpZWNlcyA9IFtdLCBsb25nUGllY2VzID0gW10sIG1peGVkUGllY2VzID0gW10sXG4gICAgICAgIGksIG1vbTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCBpXSk7XG4gICAgICAgIHNob3J0UGllY2VzLnB1c2godGhpcy5tb250aHNTaG9ydChtb20sICcnKSk7XG4gICAgICAgIGxvbmdQaWVjZXMucHVzaCh0aGlzLm1vbnRocyhtb20sICcnKSk7XG4gICAgICAgIG1peGVkUGllY2VzLnB1c2godGhpcy5tb250aHMobW9tLCAnJykpO1xuICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHRoaXMubW9udGhzU2hvcnQobW9tLCAnJykpO1xuICAgIH1cbiAgICAvLyBTb3J0aW5nIG1ha2VzIHN1cmUgaWYgb25lIG1vbnRoIChvciBhYmJyKSBpcyBhIHByZWZpeCBvZiBhbm90aGVyIGl0XG4gICAgLy8gd2lsbCBtYXRjaCB0aGUgbG9uZ2VyIHBpZWNlLlxuICAgIHNob3J0UGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICBsb25nUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICBtaXhlZFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgc2hvcnRQaWVjZXNbaV0gPSByZWdleEVzY2FwZShzaG9ydFBpZWNlc1tpXSk7XG4gICAgICAgIGxvbmdQaWVjZXNbaV0gPSByZWdleEVzY2FwZShsb25nUGllY2VzW2ldKTtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IDI0OyBpKyspIHtcbiAgICAgICAgbWl4ZWRQaWVjZXNbaV0gPSByZWdleEVzY2FwZShtaXhlZFBpZWNlc1tpXSk7XG4gICAgfVxuXG4gICAgdGhpcy5fbW9udGhzUmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBtaXhlZFBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgdGhpcy5fbW9udGhzU2hvcnRSZWdleCA9IHRoaXMuX21vbnRoc1JlZ2V4O1xuICAgIHRoaXMuX21vbnRoc1N0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbG9uZ1BpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIHNob3J0UGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRGF0ZSAoeSwgbSwgZCwgaCwgTSwgcywgbXMpIHtcbiAgICAvLyBjYW4ndCBqdXN0IGFwcGx5KCkgdG8gY3JlYXRlIGEgZGF0ZTpcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3EvMTgxMzQ4XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcyk7XG5cbiAgICAvLyB0aGUgZGF0ZSBjb25zdHJ1Y3RvciByZW1hcHMgeWVhcnMgMC05OSB0byAxOTAwLTE5OTlcbiAgICBpZiAoeSA8IDEwMCAmJiB5ID49IDAgJiYgaXNGaW5pdGUoZGF0ZS5nZXRGdWxsWWVhcigpKSkge1xuICAgICAgICBkYXRlLnNldEZ1bGxZZWFyKHkpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0ZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVVRDRGF0ZSAoeSkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMuYXBwbHkobnVsbCwgYXJndW1lbnRzKSk7XG5cbiAgICAvLyB0aGUgRGF0ZS5VVEMgZnVuY3Rpb24gcmVtYXBzIHllYXJzIDAtOTkgdG8gMTkwMC0xOTk5XG4gICAgaWYgKHkgPCAxMDAgJiYgeSA+PSAwICYmIGlzRmluaXRlKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSkpIHtcbiAgICAgICAgZGF0ZS5zZXRVVENGdWxsWWVhcih5KTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGU7XG59XG5cbi8vIHN0YXJ0LW9mLWZpcnN0LXdlZWsgLSBzdGFydC1vZi15ZWFyXG5mdW5jdGlvbiBmaXJzdFdlZWtPZmZzZXQoeWVhciwgZG93LCBkb3kpIHtcbiAgICB2YXIgLy8gZmlyc3Qtd2VlayBkYXkgLS0gd2hpY2ggamFudWFyeSBpcyBhbHdheXMgaW4gdGhlIGZpcnN0IHdlZWsgKDQgZm9yIGlzbywgMSBmb3Igb3RoZXIpXG4gICAgICAgIGZ3ZCA9IDcgKyBkb3cgLSBkb3ksXG4gICAgICAgIC8vIGZpcnN0LXdlZWsgZGF5IGxvY2FsIHdlZWtkYXkgLS0gd2hpY2ggbG9jYWwgd2Vla2RheSBpcyBmd2RcbiAgICAgICAgZndkbHcgPSAoNyArIGNyZWF0ZVVUQ0RhdGUoeWVhciwgMCwgZndkKS5nZXRVVENEYXkoKSAtIGRvdykgJSA3O1xuXG4gICAgcmV0dXJuIC1md2RsdyArIGZ3ZCAtIDE7XG59XG5cbi8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0lTT193ZWVrX2RhdGUjQ2FsY3VsYXRpbmdfYV9kYXRlX2dpdmVuX3RoZV95ZWFyLjJDX3dlZWtfbnVtYmVyX2FuZF93ZWVrZGF5XG5mdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla3MoeWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpIHtcbiAgICB2YXIgbG9jYWxXZWVrZGF5ID0gKDcgKyB3ZWVrZGF5IC0gZG93KSAlIDcsXG4gICAgICAgIHdlZWtPZmZzZXQgPSBmaXJzdFdlZWtPZmZzZXQoeWVhciwgZG93LCBkb3kpLFxuICAgICAgICBkYXlPZlllYXIgPSAxICsgNyAqICh3ZWVrIC0gMSkgKyBsb2NhbFdlZWtkYXkgKyB3ZWVrT2Zmc2V0LFxuICAgICAgICByZXNZZWFyLCByZXNEYXlPZlllYXI7XG5cbiAgICBpZiAoZGF5T2ZZZWFyIDw9IDApIHtcbiAgICAgICAgcmVzWWVhciA9IHllYXIgLSAxO1xuICAgICAgICByZXNEYXlPZlllYXIgPSBkYXlzSW5ZZWFyKHJlc1llYXIpICsgZGF5T2ZZZWFyO1xuICAgIH0gZWxzZSBpZiAoZGF5T2ZZZWFyID4gZGF5c0luWWVhcih5ZWFyKSkge1xuICAgICAgICByZXNZZWFyID0geWVhciArIDE7XG4gICAgICAgIHJlc0RheU9mWWVhciA9IGRheU9mWWVhciAtIGRheXNJblllYXIoeWVhcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzWWVhciA9IHllYXI7XG4gICAgICAgIHJlc0RheU9mWWVhciA9IGRheU9mWWVhcjtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB5ZWFyOiByZXNZZWFyLFxuICAgICAgICBkYXlPZlllYXI6IHJlc0RheU9mWWVhclxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHdlZWtPZlllYXIobW9tLCBkb3csIGRveSkge1xuICAgIHZhciB3ZWVrT2Zmc2V0ID0gZmlyc3RXZWVrT2Zmc2V0KG1vbS55ZWFyKCksIGRvdywgZG95KSxcbiAgICAgICAgd2VlayA9IE1hdGguZmxvb3IoKG1vbS5kYXlPZlllYXIoKSAtIHdlZWtPZmZzZXQgLSAxKSAvIDcpICsgMSxcbiAgICAgICAgcmVzV2VlaywgcmVzWWVhcjtcblxuICAgIGlmICh3ZWVrIDwgMSkge1xuICAgICAgICByZXNZZWFyID0gbW9tLnllYXIoKSAtIDE7XG4gICAgICAgIHJlc1dlZWsgPSB3ZWVrICsgd2Vla3NJblllYXIocmVzWWVhciwgZG93LCBkb3kpO1xuICAgIH0gZWxzZSBpZiAod2VlayA+IHdlZWtzSW5ZZWFyKG1vbS55ZWFyKCksIGRvdywgZG95KSkge1xuICAgICAgICByZXNXZWVrID0gd2VlayAtIHdlZWtzSW5ZZWFyKG1vbS55ZWFyKCksIGRvdywgZG95KTtcbiAgICAgICAgcmVzWWVhciA9IG1vbS55ZWFyKCkgKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc1llYXIgPSBtb20ueWVhcigpO1xuICAgICAgICByZXNXZWVrID0gd2VlaztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB3ZWVrOiByZXNXZWVrLFxuICAgICAgICB5ZWFyOiByZXNZZWFyXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gd2Vla3NJblllYXIoeWVhciwgZG93LCBkb3kpIHtcbiAgICB2YXIgd2Vla09mZnNldCA9IGZpcnN0V2Vla09mZnNldCh5ZWFyLCBkb3csIGRveSksXG4gICAgICAgIHdlZWtPZmZzZXROZXh0ID0gZmlyc3RXZWVrT2Zmc2V0KHllYXIgKyAxLCBkb3csIGRveSk7XG4gICAgcmV0dXJuIChkYXlzSW5ZZWFyKHllYXIpIC0gd2Vla09mZnNldCArIHdlZWtPZmZzZXROZXh0KSAvIDc7XG59XG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oJ3cnLCBbJ3d3JywgMl0sICd3bycsICd3ZWVrJyk7XG5hZGRGb3JtYXRUb2tlbignVycsIFsnV1cnLCAyXSwgJ1dvJywgJ2lzb1dlZWsnKTtcblxuLy8gQUxJQVNFU1xuXG5hZGRVbml0QWxpYXMoJ3dlZWsnLCAndycpO1xuYWRkVW5pdEFsaWFzKCdpc29XZWVrJywgJ1cnKTtcblxuLy8gUFJJT1JJVElFU1xuXG5hZGRVbml0UHJpb3JpdHkoJ3dlZWsnLCA1KTtcbmFkZFVuaXRQcmlvcml0eSgnaXNvV2VlaycsIDUpO1xuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ3cnLCAgbWF0Y2gxdG8yKTtcbmFkZFJlZ2V4VG9rZW4oJ3d3JywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuYWRkUmVnZXhUb2tlbignVycsICBtYXRjaDF0bzIpO1xuYWRkUmVnZXhUb2tlbignV1cnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5cbmFkZFdlZWtQYXJzZVRva2VuKFsndycsICd3dycsICdXJywgJ1dXJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgIHdlZWtbdG9rZW4uc3Vic3RyKDAsIDEpXSA9IHRvSW50KGlucHV0KTtcbn0pO1xuXG4vLyBIRUxQRVJTXG5cbi8vIExPQ0FMRVNcblxuZnVuY3Rpb24gbG9jYWxlV2VlayAobW9tKSB7XG4gICAgcmV0dXJuIHdlZWtPZlllYXIobW9tLCB0aGlzLl93ZWVrLmRvdywgdGhpcy5fd2Vlay5kb3kpLndlZWs7XG59XG5cbnZhciBkZWZhdWx0TG9jYWxlV2VlayA9IHtcbiAgICBkb3cgOiAwLCAvLyBTdW5kYXkgaXMgdGhlIGZpcnN0IGRheSBvZiB0aGUgd2Vlay5cbiAgICBkb3kgOiA2ICAvLyBUaGUgd2VlayB0aGF0IGNvbnRhaW5zIEphbiAxc3QgaXMgdGhlIGZpcnN0IHdlZWsgb2YgdGhlIHllYXIuXG59O1xuXG5mdW5jdGlvbiBsb2NhbGVGaXJzdERheU9mV2VlayAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dlZWsuZG93O1xufVxuXG5mdW5jdGlvbiBsb2NhbGVGaXJzdERheU9mWWVhciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dlZWsuZG95O1xufVxuXG4vLyBNT01FTlRTXG5cbmZ1bmN0aW9uIGdldFNldFdlZWsgKGlucHV0KSB7XG4gICAgdmFyIHdlZWsgPSB0aGlzLmxvY2FsZURhdGEoKS53ZWVrKHRoaXMpO1xuICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbn1cblxuZnVuY3Rpb24gZ2V0U2V0SVNPV2VlayAoaW5wdXQpIHtcbiAgICB2YXIgd2VlayA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkud2VlaztcbiAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG59XG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oJ2QnLCAwLCAnZG8nLCAnZGF5Jyk7XG5cbmFkZEZvcm1hdFRva2VuKCdkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNNaW4odGhpcywgZm9ybWF0KTtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbignZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c1Nob3J0KHRoaXMsIGZvcm1hdCk7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oJ2RkZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzKHRoaXMsIGZvcm1hdCk7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oJ2UnLCAwLCAwLCAnd2Vla2RheScpO1xuYWRkRm9ybWF0VG9rZW4oJ0UnLCAwLCAwLCAnaXNvV2Vla2RheScpO1xuXG4vLyBBTElBU0VTXG5cbmFkZFVuaXRBbGlhcygnZGF5JywgJ2QnKTtcbmFkZFVuaXRBbGlhcygnd2Vla2RheScsICdlJyk7XG5hZGRVbml0QWxpYXMoJ2lzb1dlZWtkYXknLCAnRScpO1xuXG4vLyBQUklPUklUWVxuYWRkVW5pdFByaW9yaXR5KCdkYXknLCAxMSk7XG5hZGRVbml0UHJpb3JpdHkoJ3dlZWtkYXknLCAxMSk7XG5hZGRVbml0UHJpb3JpdHkoJ2lzb1dlZWtkYXknLCAxMSk7XG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbignZCcsICAgIG1hdGNoMXRvMik7XG5hZGRSZWdleFRva2VuKCdlJywgICAgbWF0Y2gxdG8yKTtcbmFkZFJlZ2V4VG9rZW4oJ0UnLCAgICBtYXRjaDF0bzIpO1xuYWRkUmVnZXhUb2tlbignZGQnLCAgIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgcmV0dXJuIGxvY2FsZS53ZWVrZGF5c01pblJlZ2V4KGlzU3RyaWN0KTtcbn0pO1xuYWRkUmVnZXhUb2tlbignZGRkJywgICBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgIHJldHVybiBsb2NhbGUud2Vla2RheXNTaG9ydFJlZ2V4KGlzU3RyaWN0KTtcbn0pO1xuYWRkUmVnZXhUb2tlbignZGRkZCcsICAgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzUmVnZXgoaXNTdHJpY3QpO1xufSk7XG5cbmFkZFdlZWtQYXJzZVRva2VuKFsnZGQnLCAnZGRkJywgJ2RkZGQnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgdmFyIHdlZWtkYXkgPSBjb25maWcuX2xvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0LCB0b2tlbiwgY29uZmlnLl9zdHJpY3QpO1xuICAgIC8vIGlmIHdlIGRpZG4ndCBnZXQgYSB3ZWVrZGF5IG5hbWUsIG1hcmsgdGhlIGRhdGUgYXMgaW52YWxpZFxuICAgIGlmICh3ZWVrZGF5ICE9IG51bGwpIHtcbiAgICAgICAgd2Vlay5kID0gd2Vla2RheTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkV2Vla2RheSA9IGlucHV0O1xuICAgIH1cbn0pO1xuXG5hZGRXZWVrUGFyc2VUb2tlbihbJ2QnLCAnZScsICdFJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgIHdlZWtbdG9rZW5dID0gdG9JbnQoaW5wdXQpO1xufSk7XG5cbi8vIEhFTFBFUlNcblxuZnVuY3Rpb24gcGFyc2VXZWVrZGF5KGlucHV0LCBsb2NhbGUpIHtcbiAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuXG4gICAgaWYgKCFpc05hTihpbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgfVxuXG4gICAgaW5wdXQgPSBsb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCk7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBwYXJzZUlzb1dlZWtkYXkoaW5wdXQsIGxvY2FsZSkge1xuICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCkgJSA3IHx8IDc7XG4gICAgfVxuICAgIHJldHVybiBpc05hTihpbnB1dCkgPyBudWxsIDogaW5wdXQ7XG59XG5cbi8vIExPQ0FMRVNcblxudmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5cyA9ICdTdW5kYXlfTW9uZGF5X1R1ZXNkYXlfV2VkbmVzZGF5X1RodXJzZGF5X0ZyaWRheV9TYXR1cmRheScuc3BsaXQoJ18nKTtcbmZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzIChtLCBmb3JtYXQpIHtcbiAgICBpZiAoIW0pIHtcbiAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fd2Vla2RheXMpID8gdGhpcy5fd2Vla2RheXMgOlxuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNbJ3N0YW5kYWxvbmUnXTtcbiAgICB9XG4gICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fd2Vla2RheXMpID8gdGhpcy5fd2Vla2RheXNbbS5kYXkoKV0gOlxuICAgICAgICB0aGlzLl93ZWVrZGF5c1t0aGlzLl93ZWVrZGF5cy5pc0Zvcm1hdC50ZXN0KGZvcm1hdCkgPyAnZm9ybWF0JyA6ICdzdGFuZGFsb25lJ11bbS5kYXkoKV07XG59XG5cbnZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydCA9ICdTdW5fTW9uX1R1ZV9XZWRfVGh1X0ZyaV9TYXQnLnNwbGl0KCdfJyk7XG5mdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1Nob3J0IChtKSB7XG4gICAgcmV0dXJuIChtKSA/IHRoaXMuX3dlZWtkYXlzU2hvcnRbbS5kYXkoKV0gOiB0aGlzLl93ZWVrZGF5c1Nob3J0O1xufVxuXG52YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluID0gJ1N1X01vX1R1X1dlX1RoX0ZyX1NhJy5zcGxpdCgnXycpO1xuZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNNaW4gKG0pIHtcbiAgICByZXR1cm4gKG0pID8gdGhpcy5fd2Vla2RheXNNaW5bbS5kYXkoKV0gOiB0aGlzLl93ZWVrZGF5c01pbjtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU3RyaWN0UGFyc2UkMSh3ZWVrZGF5TmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICB2YXIgaSwgaWksIG1vbSwgbGxjID0gd2Vla2RheU5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2UpIHtcbiAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgdGhpcy5fbWluV2Vla2RheXNQYXJzZSA9IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyArK2kpIHtcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2VbaV0gPSB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2VbaV0gPSB0aGlzLndlZWtkYXlzU2hvcnQobW9tLCAnJykudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSB0aGlzLndlZWtkYXlzKG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgIGlmIChmb3JtYXQgPT09ICdkZGRkJykge1xuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnZGRkJykge1xuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX21pbldlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ2RkZGQnKSB7XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl93ZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9taW5XZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQgPT09ICdkZGQnKSB7XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9taW5XZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX21pbldlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1BhcnNlICh3ZWVrZGF5TmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlRXhhY3QpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZVN0cmljdFBhcnNlJDEuY2FsbCh0aGlzLCB3ZWVrZGF5TmFtZSwgZm9ybWF0LCBzdHJpY3QpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fd2Vla2RheXNQYXJzZSkge1xuICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgdGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgIHRoaXMuX2Z1bGxXZWVrZGF5c1BhcnNlID0gW107XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcblxuICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgIGlmIChzdHJpY3QgJiYgIXRoaXMuX2Z1bGxXZWVrZGF5c1BhcnNlW2ldKSB7XG4gICAgICAgICAgICB0aGlzLl9mdWxsV2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy53ZWVrZGF5cyhtb20sICcnKS5yZXBsYWNlKCcuJywgJ1xcLj8nKSArICckJywgJ2knKTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnXFwuPycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgdGhpcy5fbWluV2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy53ZWVrZGF5c01pbihtb20sICcnKS5yZXBsYWNlKCcuJywgJ1xcLj8nKSArICckJywgJ2knKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy53ZWVrZGF5cyhtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzU2hvcnQobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c01pbihtb20sICcnKTtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdkZGRkJyAmJiB0aGlzLl9mdWxsV2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ2RkZCcgJiYgdGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnZGQnICYmIHRoaXMuX21pbldlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9IGVsc2UgaWYgKCFzdHJpY3QgJiYgdGhpcy5fd2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIE1PTUVOVFNcblxuZnVuY3Rpb24gZ2V0U2V0RGF5T2ZXZWVrIChpbnB1dCkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgIH1cbiAgICB2YXIgZGF5ID0gdGhpcy5faXNVVEMgPyB0aGlzLl9kLmdldFVUQ0RheSgpIDogdGhpcy5fZC5nZXREYXkoKTtcbiAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICBpbnB1dCA9IHBhcnNlV2Vla2RheShpbnB1dCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoaW5wdXQgLSBkYXksICdkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGRheTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldFNldExvY2FsZURheU9mV2VlayAoaW5wdXQpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICB9XG4gICAgdmFyIHdlZWtkYXkgPSAodGhpcy5kYXkoKSArIDcgLSB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3cpICUgNztcbiAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWtkYXkgOiB0aGlzLmFkZChpbnB1dCAtIHdlZWtkYXksICdkJyk7XG59XG5cbmZ1bmN0aW9uIGdldFNldElTT0RheU9mV2VlayAoaW5wdXQpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICB9XG5cbiAgICAvLyBiZWhhdmVzIHRoZSBzYW1lIGFzIG1vbWVudCNkYXkgZXhjZXB0XG4gICAgLy8gYXMgYSBnZXR0ZXIsIHJldHVybnMgNyBpbnN0ZWFkIG9mIDAgKDEtNyByYW5nZSBpbnN0ZWFkIG9mIDAtNilcbiAgICAvLyBhcyBhIHNldHRlciwgc3VuZGF5IHNob3VsZCBiZWxvbmcgdG8gdGhlIHByZXZpb3VzIHdlZWsuXG5cbiAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICB2YXIgd2Vla2RheSA9IHBhcnNlSXNvV2Vla2RheShpbnB1dCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuICAgICAgICByZXR1cm4gdGhpcy5kYXkodGhpcy5kYXkoKSAlIDcgPyB3ZWVrZGF5IDogd2Vla2RheSAtIDcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRheSgpIHx8IDc7XG4gICAgfVxufVxuXG52YXIgZGVmYXVsdFdlZWtkYXlzUmVnZXggPSBtYXRjaFdvcmQ7XG5mdW5jdGlvbiB3ZWVrZGF5c1JlZ2V4IChpc1N0cmljdCkge1xuICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlRXhhY3QpIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICBjb21wdXRlV2Vla2RheXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNSZWdleDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzUmVnZXgnKSkge1xuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNSZWdleCA9IGRlZmF1bHRXZWVrZGF5c1JlZ2V4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXggOiB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuICAgIH1cbn1cblxudmFyIGRlZmF1bHRXZWVrZGF5c1Nob3J0UmVnZXggPSBtYXRjaFdvcmQ7XG5mdW5jdGlvbiB3ZWVrZGF5c1Nob3J0UmVnZXggKGlzU3RyaWN0KSB7XG4gICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgIGNvbXB1dGVXZWVrZGF5c1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFN0cmljdFJlZ2V4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzU2hvcnRSZWdleCcpKSB7XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXggPSBkZWZhdWx0V2Vla2RheXNTaG9ydFJlZ2V4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0U3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNTaG9ydFN0cmljdFJlZ2V4IDogdGhpcy5fd2Vla2RheXNTaG9ydFJlZ2V4O1xuICAgIH1cbn1cblxudmFyIGRlZmF1bHRXZWVrZGF5c01pblJlZ2V4ID0gbWF0Y2hXb3JkO1xuZnVuY3Rpb24gd2Vla2RheXNNaW5SZWdleCAoaXNTdHJpY3QpIHtcbiAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzUmVnZXgnKSkge1xuICAgICAgICAgICAgY29tcHV0ZVdlZWtkYXlzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluUmVnZXg7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c01pblJlZ2V4JykpIHtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzTWluUmVnZXggPSBkZWZhdWx0V2Vla2RheXNNaW5SZWdleDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNNaW5TdHJpY3RSZWdleCAmJiBpc1N0cmljdCA/XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4IDogdGhpcy5fd2Vla2RheXNNaW5SZWdleDtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gY29tcHV0ZVdlZWtkYXlzUGFyc2UgKCkge1xuICAgIGZ1bmN0aW9uIGNtcExlblJldihhLCBiKSB7XG4gICAgICAgIHJldHVybiBiLmxlbmd0aCAtIGEubGVuZ3RoO1xuICAgIH1cblxuICAgIHZhciBtaW5QaWVjZXMgPSBbXSwgc2hvcnRQaWVjZXMgPSBbXSwgbG9uZ1BpZWNlcyA9IFtdLCBtaXhlZFBpZWNlcyA9IFtdLFxuICAgICAgICBpLCBtb20sIG1pbnAsIHNob3J0cCwgbG9uZ3A7XG4gICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICBtaW5wID0gdGhpcy53ZWVrZGF5c01pbihtb20sICcnKTtcbiAgICAgICAgc2hvcnRwID0gdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpO1xuICAgICAgICBsb25ncCA9IHRoaXMud2Vla2RheXMobW9tLCAnJyk7XG4gICAgICAgIG1pblBpZWNlcy5wdXNoKG1pbnApO1xuICAgICAgICBzaG9ydFBpZWNlcy5wdXNoKHNob3J0cCk7XG4gICAgICAgIGxvbmdQaWVjZXMucHVzaChsb25ncCk7XG4gICAgICAgIG1peGVkUGllY2VzLnB1c2gobWlucCk7XG4gICAgICAgIG1peGVkUGllY2VzLnB1c2goc2hvcnRwKTtcbiAgICAgICAgbWl4ZWRQaWVjZXMucHVzaChsb25ncCk7XG4gICAgfVxuICAgIC8vIFNvcnRpbmcgbWFrZXMgc3VyZSBpZiBvbmUgd2Vla2RheSAob3IgYWJicikgaXMgYSBwcmVmaXggb2YgYW5vdGhlciBpdFxuICAgIC8vIHdpbGwgbWF0Y2ggdGhlIGxvbmdlciBwaWVjZS5cbiAgICBtaW5QaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgIHNob3J0UGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICBsb25nUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICBtaXhlZFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICBzaG9ydFBpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKHNob3J0UGllY2VzW2ldKTtcbiAgICAgICAgbG9uZ1BpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKGxvbmdQaWVjZXNbaV0pO1xuICAgICAgICBtaXhlZFBpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKG1peGVkUGllY2VzW2ldKTtcbiAgICB9XG5cbiAgICB0aGlzLl93ZWVrZGF5c1JlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbWl4ZWRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleCA9IHRoaXMuX3dlZWtkYXlzUmVnZXg7XG4gICAgdGhpcy5fd2Vla2RheXNNaW5SZWdleCA9IHRoaXMuX3dlZWtkYXlzUmVnZXg7XG5cbiAgICB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbG9uZ1BpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgdGhpcy5fd2Vla2RheXNTaG9ydFN0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgc2hvcnRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBtaW5QaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xufVxuXG4vLyBGT1JNQVRUSU5HXG5cbmZ1bmN0aW9uIGhGb3JtYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaG91cnMoKSAlIDEyIHx8IDEyO1xufVxuXG5mdW5jdGlvbiBrRm9ybWF0KCkge1xuICAgIHJldHVybiB0aGlzLmhvdXJzKCkgfHwgMjQ7XG59XG5cbmFkZEZvcm1hdFRva2VuKCdIJywgWydISCcsIDJdLCAwLCAnaG91cicpO1xuYWRkRm9ybWF0VG9rZW4oJ2gnLCBbJ2hoJywgMl0sIDAsIGhGb3JtYXQpO1xuYWRkRm9ybWF0VG9rZW4oJ2snLCBbJ2trJywgMl0sIDAsIGtGb3JtYXQpO1xuXG5hZGRGb3JtYXRUb2tlbignaG1tJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnJyArIGhGb3JtYXQuYXBwbHkodGhpcykgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMik7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oJ2htbXNzJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnJyArIGhGb3JtYXQuYXBwbHkodGhpcykgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMikgK1xuICAgICAgICB6ZXJvRmlsbCh0aGlzLnNlY29uZHMoKSwgMik7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oJ0htbScsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJycgKyB0aGlzLmhvdXJzKCkgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMik7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oJ0htbXNzJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnJyArIHRoaXMuaG91cnMoKSArIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKSArXG4gICAgICAgIHplcm9GaWxsKHRoaXMuc2Vjb25kcygpLCAyKTtcbn0pO1xuXG5mdW5jdGlvbiBtZXJpZGllbSAodG9rZW4sIGxvd2VyY2FzZSkge1xuICAgIGFkZEZvcm1hdFRva2VuKHRva2VuLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tZXJpZGllbSh0aGlzLmhvdXJzKCksIHRoaXMubWludXRlcygpLCBsb3dlcmNhc2UpO1xuICAgIH0pO1xufVxuXG5tZXJpZGllbSgnYScsIHRydWUpO1xubWVyaWRpZW0oJ0EnLCBmYWxzZSk7XG5cbi8vIEFMSUFTRVNcblxuYWRkVW5pdEFsaWFzKCdob3VyJywgJ2gnKTtcblxuLy8gUFJJT1JJVFlcbmFkZFVuaXRQcmlvcml0eSgnaG91cicsIDEzKTtcblxuLy8gUEFSU0lOR1xuXG5mdW5jdGlvbiBtYXRjaE1lcmlkaWVtIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgcmV0dXJuIGxvY2FsZS5fbWVyaWRpZW1QYXJzZTtcbn1cblxuYWRkUmVnZXhUb2tlbignYScsICBtYXRjaE1lcmlkaWVtKTtcbmFkZFJlZ2V4VG9rZW4oJ0EnLCAgbWF0Y2hNZXJpZGllbSk7XG5hZGRSZWdleFRva2VuKCdIJywgIG1hdGNoMXRvMik7XG5hZGRSZWdleFRva2VuKCdoJywgIG1hdGNoMXRvMik7XG5hZGRSZWdleFRva2VuKCdrJywgIG1hdGNoMXRvMik7XG5hZGRSZWdleFRva2VuKCdISCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbmFkZFJlZ2V4VG9rZW4oJ2hoJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuYWRkUmVnZXhUb2tlbigna2snLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5cbmFkZFJlZ2V4VG9rZW4oJ2htbScsIG1hdGNoM3RvNCk7XG5hZGRSZWdleFRva2VuKCdobW1zcycsIG1hdGNoNXRvNik7XG5hZGRSZWdleFRva2VuKCdIbW0nLCBtYXRjaDN0bzQpO1xuYWRkUmVnZXhUb2tlbignSG1tc3MnLCBtYXRjaDV0bzYpO1xuXG5hZGRQYXJzZVRva2VuKFsnSCcsICdISCddLCBIT1VSKTtcbmFkZFBhcnNlVG9rZW4oWydrJywgJ2trJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgIHZhciBrSW5wdXQgPSB0b0ludChpbnB1dCk7XG4gICAgYXJyYXlbSE9VUl0gPSBrSW5wdXQgPT09IDI0ID8gMCA6IGtJbnB1dDtcbn0pO1xuYWRkUGFyc2VUb2tlbihbJ2EnLCAnQSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICBjb25maWcuX2lzUG0gPSBjb25maWcuX2xvY2FsZS5pc1BNKGlucHV0KTtcbiAgICBjb25maWcuX21lcmlkaWVtID0gaW5wdXQ7XG59KTtcbmFkZFBhcnNlVG9rZW4oWydoJywgJ2hoJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQpO1xuICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xufSk7XG5hZGRQYXJzZVRva2VuKCdobW0nLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICB2YXIgcG9zID0gaW5wdXQubGVuZ3RoIC0gMjtcbiAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MpKTtcbiAgICBhcnJheVtNSU5VVEVdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvcykpO1xuICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xufSk7XG5hZGRQYXJzZVRva2VuKCdobW1zcycsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgIHZhciBwb3MxID0gaW5wdXQubGVuZ3RoIC0gNDtcbiAgICB2YXIgcG9zMiA9IGlucHV0Lmxlbmd0aCAtIDI7XG4gICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dC5zdWJzdHIoMCwgcG9zMSkpO1xuICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zMSwgMikpO1xuICAgIGFycmF5W1NFQ09ORF0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zMikpO1xuICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xufSk7XG5hZGRQYXJzZVRva2VuKCdIbW0nLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICB2YXIgcG9zID0gaW5wdXQubGVuZ3RoIC0gMjtcbiAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MpKTtcbiAgICBhcnJheVtNSU5VVEVdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvcykpO1xufSk7XG5hZGRQYXJzZVRva2VuKCdIbW1zcycsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgIHZhciBwb3MxID0gaW5wdXQubGVuZ3RoIC0gNDtcbiAgICB2YXIgcG9zMiA9IGlucHV0Lmxlbmd0aCAtIDI7XG4gICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dC5zdWJzdHIoMCwgcG9zMSkpO1xuICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zMSwgMikpO1xuICAgIGFycmF5W1NFQ09ORF0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zMikpO1xufSk7XG5cbi8vIExPQ0FMRVNcblxuZnVuY3Rpb24gbG9jYWxlSXNQTSAoaW5wdXQpIHtcbiAgICAvLyBJRTggUXVpcmtzIE1vZGUgJiBJRTcgU3RhbmRhcmRzIE1vZGUgZG8gbm90IGFsbG93IGFjY2Vzc2luZyBzdHJpbmdzIGxpa2UgYXJyYXlzXG4gICAgLy8gVXNpbmcgY2hhckF0IHNob3VsZCBiZSBtb3JlIGNvbXBhdGlibGUuXG4gICAgcmV0dXJuICgoaW5wdXQgKyAnJykudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkgPT09ICdwJyk7XG59XG5cbnZhciBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZSA9IC9bYXBdXFwuP20/XFwuPy9pO1xuZnVuY3Rpb24gbG9jYWxlTWVyaWRpZW0gKGhvdXJzLCBtaW51dGVzLCBpc0xvd2VyKSB7XG4gICAgaWYgKGhvdXJzID4gMTEpIHtcbiAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAncG0nIDogJ1BNJztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdhbScgOiAnQU0nO1xuICAgIH1cbn1cblxuXG4vLyBNT01FTlRTXG5cbi8vIFNldHRpbmcgdGhlIGhvdXIgc2hvdWxkIGtlZXAgdGhlIHRpbWUsIGJlY2F1c2UgdGhlIHVzZXIgZXhwbGljaXRseVxuLy8gc3BlY2lmaWVkIHdoaWNoIGhvdXIgaGUgd2FudHMuIFNvIHRyeWluZyB0byBtYWludGFpbiB0aGUgc2FtZSBob3VyIChpblxuLy8gYSBuZXcgdGltZXpvbmUpIG1ha2VzIHNlbnNlLiBBZGRpbmcvc3VidHJhY3RpbmcgaG91cnMgZG9lcyBub3QgZm9sbG93XG4vLyB0aGlzIHJ1bGUuXG52YXIgZ2V0U2V0SG91ciA9IG1ha2VHZXRTZXQoJ0hvdXJzJywgdHJ1ZSk7XG5cbnZhciBiYXNlQ29uZmlnID0ge1xuICAgIGNhbGVuZGFyOiBkZWZhdWx0Q2FsZW5kYXIsXG4gICAgbG9uZ0RhdGVGb3JtYXQ6IGRlZmF1bHRMb25nRGF0ZUZvcm1hdCxcbiAgICBpbnZhbGlkRGF0ZTogZGVmYXVsdEludmFsaWREYXRlLFxuICAgIG9yZGluYWw6IGRlZmF1bHRPcmRpbmFsLFxuICAgIGRheU9mTW9udGhPcmRpbmFsUGFyc2U6IGRlZmF1bHREYXlPZk1vbnRoT3JkaW5hbFBhcnNlLFxuICAgIHJlbGF0aXZlVGltZTogZGVmYXVsdFJlbGF0aXZlVGltZSxcblxuICAgIG1vbnRoczogZGVmYXVsdExvY2FsZU1vbnRocyxcbiAgICBtb250aHNTaG9ydDogZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0LFxuXG4gICAgd2VlazogZGVmYXVsdExvY2FsZVdlZWssXG5cbiAgICB3ZWVrZGF5czogZGVmYXVsdExvY2FsZVdlZWtkYXlzLFxuICAgIHdlZWtkYXlzTWluOiBkZWZhdWx0TG9jYWxlV2Vla2RheXNNaW4sXG4gICAgd2Vla2RheXNTaG9ydDogZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQsXG5cbiAgICBtZXJpZGllbVBhcnNlOiBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZVxufTtcblxuLy8gaW50ZXJuYWwgc3RvcmFnZSBmb3IgbG9jYWxlIGNvbmZpZyBmaWxlc1xudmFyIGxvY2FsZXMgPSB7fTtcbnZhciBsb2NhbGVGYW1pbGllcyA9IHt9O1xudmFyIGdsb2JhbExvY2FsZTtcblxuZnVuY3Rpb24gbm9ybWFsaXplTG9jYWxlKGtleSkge1xuICAgIHJldHVybiBrZXkgPyBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdfJywgJy0nKSA6IGtleTtcbn1cblxuLy8gcGljayB0aGUgbG9jYWxlIGZyb20gdGhlIGFycmF5XG4vLyB0cnkgWydlbi1hdScsICdlbi1nYiddIGFzICdlbi1hdScsICdlbi1nYicsICdlbicsIGFzIGluIG1vdmUgdGhyb3VnaCB0aGUgbGlzdCB0cnlpbmcgZWFjaFxuLy8gc3Vic3RyaW5nIGZyb20gbW9zdCBzcGVjaWZpYyB0byBsZWFzdCwgYnV0IG1vdmUgdG8gdGhlIG5leHQgYXJyYXkgaXRlbSBpZiBpdCdzIGEgbW9yZSBzcGVjaWZpYyB2YXJpYW50IHRoYW4gdGhlIGN1cnJlbnQgcm9vdFxuZnVuY3Rpb24gY2hvb3NlTG9jYWxlKG5hbWVzKSB7XG4gICAgdmFyIGkgPSAwLCBqLCBuZXh0LCBsb2NhbGUsIHNwbGl0O1xuXG4gICAgd2hpbGUgKGkgPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgc3BsaXQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaV0pLnNwbGl0KCctJyk7XG4gICAgICAgIGogPSBzcGxpdC5sZW5ndGg7XG4gICAgICAgIG5leHQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaSArIDFdKTtcbiAgICAgICAgbmV4dCA9IG5leHQgPyBuZXh0LnNwbGl0KCctJykgOiBudWxsO1xuICAgICAgICB3aGlsZSAoaiA+IDApIHtcbiAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoc3BsaXQuc2xpY2UoMCwgaikuam9pbignLScpKTtcbiAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5leHQgJiYgbmV4dC5sZW5ndGggPj0gaiAmJiBjb21wYXJlQXJyYXlzKHNwbGl0LCBuZXh0LCB0cnVlKSA+PSBqIC0gMSkge1xuICAgICAgICAgICAgICAgIC8vdGhlIG5leHQgYXJyYXkgaXRlbSBpcyBiZXR0ZXIgdGhhbiBhIHNoYWxsb3dlciBzdWJzdHJpbmcgb2YgdGhpcyBvbmVcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGotLTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBnbG9iYWxMb2NhbGU7XG59XG5cbmZ1bmN0aW9uIGxvYWRMb2NhbGUobmFtZSkge1xuICAgIHZhciBvbGRMb2NhbGUgPSBudWxsO1xuICAgIC8vIFRPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlZ2lzdGVyIGFuZCBsb2FkIGFsbCB0aGUgbG9jYWxlcyBpbiBOb2RlXG4gICAgaWYgKCFsb2NhbGVzW25hbWVdICYmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykgJiZcbiAgICAgICAgICAgIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgb2xkTG9jYWxlID0gZ2xvYmFsTG9jYWxlLl9hYmJyO1xuICAgICAgICAgICAgdmFyIGFsaWFzZWRSZXF1aXJlID0gcmVxdWlyZTtcbiAgICAgICAgICAgIGFsaWFzZWRSZXF1aXJlKCcuL2xvY2FsZS8nICsgbmFtZSk7XG4gICAgICAgICAgICBnZXRTZXRHbG9iYWxMb2NhbGUob2xkTG9jYWxlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG59XG5cbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBsb2FkIGxvY2FsZSBhbmQgdGhlbiBzZXQgdGhlIGdsb2JhbCBsb2NhbGUuICBJZlxuLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudCBnbG9iYWxcbi8vIGxvY2FsZSBrZXkuXG5mdW5jdGlvbiBnZXRTZXRHbG9iYWxMb2NhbGUgKGtleSwgdmFsdWVzKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgaWYgKGtleSkge1xuICAgICAgICBpZiAoaXNVbmRlZmluZWQodmFsdWVzKSkge1xuICAgICAgICAgICAgZGF0YSA9IGdldExvY2FsZShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGF0YSA9IGRlZmluZUxvY2FsZShrZXksIHZhbHVlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgLy8gbW9tZW50LmR1cmF0aW9uLl9sb2NhbGUgPSBtb21lbnQuX2xvY2FsZSA9IGRhdGE7XG4gICAgICAgICAgICBnbG9iYWxMb2NhbGUgPSBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKCh0eXBlb2YgY29uc29sZSAhPT0gICd1bmRlZmluZWQnKSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgICAgICAvL3dhcm4gdXNlciBpZiBhcmd1bWVudHMgYXJlIHBhc3NlZCBidXQgdGhlIGxvY2FsZSBjb3VsZCBub3QgYmUgc2V0XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdMb2NhbGUgJyArIGtleSArICAnIG5vdCBmb3VuZC4gRGlkIHlvdSBmb3JnZXQgdG8gbG9hZCBpdD8nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBnbG9iYWxMb2NhbGUuX2FiYnI7XG59XG5cbmZ1bmN0aW9uIGRlZmluZUxvY2FsZSAobmFtZSwgY29uZmlnKSB7XG4gICAgaWYgKGNvbmZpZyAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbG9jYWxlLCBwYXJlbnRDb25maWcgPSBiYXNlQ29uZmlnO1xuICAgICAgICBjb25maWcuYWJiciA9IG5hbWU7XG4gICAgICAgIGlmIChsb2NhbGVzW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRlcHJlY2F0ZVNpbXBsZSgnZGVmaW5lTG9jYWxlT3ZlcnJpZGUnLFxuICAgICAgICAgICAgICAgICAgICAndXNlIG1vbWVudC51cGRhdGVMb2NhbGUobG9jYWxlTmFtZSwgY29uZmlnKSB0byBjaGFuZ2UgJyArXG4gICAgICAgICAgICAgICAgICAgICdhbiBleGlzdGluZyBsb2NhbGUuIG1vbWVudC5kZWZpbmVMb2NhbGUobG9jYWxlTmFtZSwgJyArXG4gICAgICAgICAgICAgICAgICAgICdjb25maWcpIHNob3VsZCBvbmx5IGJlIHVzZWQgZm9yIGNyZWF0aW5nIGEgbmV3IGxvY2FsZSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1NlZSBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL2RlZmluZS1sb2NhbGUvIGZvciBtb3JlIGluZm8uJyk7XG4gICAgICAgICAgICBwYXJlbnRDb25maWcgPSBsb2NhbGVzW25hbWVdLl9jb25maWc7XG4gICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLnBhcmVudExvY2FsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobG9jYWxlc1tjb25maWcucGFyZW50TG9jYWxlXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gbG9jYWxlc1tjb25maWcucGFyZW50TG9jYWxlXS5fY29uZmlnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKGNvbmZpZy5wYXJlbnRMb2NhbGUpO1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRDb25maWcgPSBsb2NhbGUuX2NvbmZpZztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWxvY2FsZUZhbWlsaWVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGVGYW1pbGllc1tjb25maWcucGFyZW50TG9jYWxlXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZUZhbWlsaWVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbG9jYWxlc1tuYW1lXSA9IG5ldyBMb2NhbGUobWVyZ2VDb25maWdzKHBhcmVudENvbmZpZywgY29uZmlnKSk7XG5cbiAgICAgICAgaWYgKGxvY2FsZUZhbWlsaWVzW25hbWVdKSB7XG4gICAgICAgICAgICBsb2NhbGVGYW1pbGllc1tuYW1lXS5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgZGVmaW5lTG9jYWxlKHgubmFtZSwgeC5jb25maWcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0IGZvciBub3c6IGFsc28gc2V0IHRoZSBsb2NhbGVcbiAgICAgICAgLy8gbWFrZSBzdXJlIHdlIHNldCB0aGUgbG9jYWxlIEFGVEVSIGFsbCBjaGlsZCBsb2NhbGVzIGhhdmUgYmVlblxuICAgICAgICAvLyBjcmVhdGVkLCBzbyB3ZSB3b24ndCBlbmQgdXAgd2l0aCB0aGUgY2hpbGQgbG9jYWxlIHNldC5cbiAgICAgICAgZ2V0U2V0R2xvYmFsTG9jYWxlKG5hbWUpO1xuXG5cbiAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdXNlZnVsIGZvciB0ZXN0aW5nXG4gICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxvY2FsZShuYW1lLCBjb25maWcpIHtcbiAgICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGxvY2FsZSwgdG1wTG9jYWxlLCBwYXJlbnRDb25maWcgPSBiYXNlQ29uZmlnO1xuICAgICAgICAvLyBNRVJHRVxuICAgICAgICB0bXBMb2NhbGUgPSBsb2FkTG9jYWxlKG5hbWUpO1xuICAgICAgICBpZiAodG1wTG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IHRtcExvY2FsZS5fY29uZmlnO1xuICAgICAgICB9XG4gICAgICAgIGNvbmZpZyA9IG1lcmdlQ29uZmlncyhwYXJlbnRDb25maWcsIGNvbmZpZyk7XG4gICAgICAgIGxvY2FsZSA9IG5ldyBMb2NhbGUoY29uZmlnKTtcbiAgICAgICAgbG9jYWxlLnBhcmVudExvY2FsZSA9IGxvY2FsZXNbbmFtZV07XG4gICAgICAgIGxvY2FsZXNbbmFtZV0gPSBsb2NhbGU7XG5cbiAgICAgICAgLy8gYmFja3dhcmRzIGNvbXBhdCBmb3Igbm93OiBhbHNvIHNldCB0aGUgbG9jYWxlXG4gICAgICAgIGdldFNldEdsb2JhbExvY2FsZShuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBwYXNzIG51bGwgZm9yIGNvbmZpZyB0byB1bnVwZGF0ZSwgdXNlZnVsIGZvciB0ZXN0c1xuICAgICAgICBpZiAobG9jYWxlc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobG9jYWxlc1tuYW1lXS5wYXJlbnRMb2NhbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0gPSBsb2NhbGVzW25hbWVdLnBhcmVudExvY2FsZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobG9jYWxlc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGxvY2FsZXNbbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG59XG5cbi8vIHJldHVybnMgbG9jYWxlIGRhdGFcbmZ1bmN0aW9uIGdldExvY2FsZSAoa2V5KSB7XG4gICAgdmFyIGxvY2FsZTtcblxuICAgIGlmIChrZXkgJiYga2V5Ll9sb2NhbGUgJiYga2V5Ll9sb2NhbGUuX2FiYnIpIHtcbiAgICAgICAga2V5ID0ga2V5Ll9sb2NhbGUuX2FiYnI7XG4gICAgfVxuXG4gICAgaWYgKCFrZXkpIHtcbiAgICAgICAgcmV0dXJuIGdsb2JhbExvY2FsZTtcbiAgICB9XG5cbiAgICBpZiAoIWlzQXJyYXkoa2V5KSkge1xuICAgICAgICAvL3Nob3J0LWNpcmN1aXQgZXZlcnl0aGluZyBlbHNlXG4gICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoa2V5KTtcbiAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgfVxuICAgICAgICBrZXkgPSBba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hvb3NlTG9jYWxlKGtleSk7XG59XG5cbmZ1bmN0aW9uIGxpc3RMb2NhbGVzKCkge1xuICAgIHJldHVybiBrZXlzKGxvY2FsZXMpO1xufVxuXG5mdW5jdGlvbiBjaGVja092ZXJmbG93IChtKSB7XG4gICAgdmFyIG92ZXJmbG93O1xuICAgIHZhciBhID0gbS5fYTtcblxuICAgIGlmIChhICYmIGdldFBhcnNpbmdGbGFncyhtKS5vdmVyZmxvdyA9PT0gLTIpIHtcbiAgICAgICAgb3ZlcmZsb3cgPVxuICAgICAgICAgICAgYVtNT05USF0gICAgICAgPCAwIHx8IGFbTU9OVEhdICAgICAgID4gMTEgID8gTU9OVEggOlxuICAgICAgICAgICAgYVtEQVRFXSAgICAgICAgPCAxIHx8IGFbREFURV0gICAgICAgID4gZGF5c0luTW9udGgoYVtZRUFSXSwgYVtNT05USF0pID8gREFURSA6XG4gICAgICAgICAgICBhW0hPVVJdICAgICAgICA8IDAgfHwgYVtIT1VSXSAgICAgICAgPiAyNCB8fCAoYVtIT1VSXSA9PT0gMjQgJiYgKGFbTUlOVVRFXSAhPT0gMCB8fCBhW1NFQ09ORF0gIT09IDAgfHwgYVtNSUxMSVNFQ09ORF0gIT09IDApKSA/IEhPVVIgOlxuICAgICAgICAgICAgYVtNSU5VVEVdICAgICAgPCAwIHx8IGFbTUlOVVRFXSAgICAgID4gNTkgID8gTUlOVVRFIDpcbiAgICAgICAgICAgIGFbU0VDT05EXSAgICAgIDwgMCB8fCBhW1NFQ09ORF0gICAgICA+IDU5ICA/IFNFQ09ORCA6XG4gICAgICAgICAgICBhW01JTExJU0VDT05EXSA8IDAgfHwgYVtNSUxMSVNFQ09ORF0gPiA5OTkgPyBNSUxMSVNFQ09ORCA6XG4gICAgICAgICAgICAtMTtcblxuICAgICAgICBpZiAoZ2V0UGFyc2luZ0ZsYWdzKG0pLl9vdmVyZmxvd0RheU9mWWVhciAmJiAob3ZlcmZsb3cgPCBZRUFSIHx8IG92ZXJmbG93ID4gREFURSkpIHtcbiAgICAgICAgICAgIG92ZXJmbG93ID0gREFURTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2V0UGFyc2luZ0ZsYWdzKG0pLl9vdmVyZmxvd1dlZWtzICYmIG92ZXJmbG93ID09PSAtMSkge1xuICAgICAgICAgICAgb3ZlcmZsb3cgPSBXRUVLO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MobSkuX292ZXJmbG93V2Vla2RheSAmJiBvdmVyZmxvdyA9PT0gLTEpIHtcbiAgICAgICAgICAgIG92ZXJmbG93ID0gV0VFS0RBWTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhtKS5vdmVyZmxvdyA9IG92ZXJmbG93O1xuICAgIH1cblxuICAgIHJldHVybiBtO1xufVxuXG4vLyBQaWNrIHRoZSBmaXJzdCBkZWZpbmVkIG9mIHR3byBvciB0aHJlZSBhcmd1bWVudHMuXG5mdW5jdGlvbiBkZWZhdWx0cyhhLCBiLCBjKSB7XG4gICAgaWYgKGEgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgaWYgKGIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYjtcbiAgICB9XG4gICAgcmV0dXJuIGM7XG59XG5cbmZ1bmN0aW9uIGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKSB7XG4gICAgLy8gaG9va3MgaXMgYWN0dWFsbHkgdGhlIGV4cG9ydGVkIG1vbWVudCBvYmplY3RcbiAgICB2YXIgbm93VmFsdWUgPSBuZXcgRGF0ZShob29rcy5ub3coKSk7XG4gICAgaWYgKGNvbmZpZy5fdXNlVVRDKSB7XG4gICAgICAgIHJldHVybiBbbm93VmFsdWUuZ2V0VVRDRnVsbFllYXIoKSwgbm93VmFsdWUuZ2V0VVRDTW9udGgoKSwgbm93VmFsdWUuZ2V0VVRDRGF0ZSgpXTtcbiAgICB9XG4gICAgcmV0dXJuIFtub3dWYWx1ZS5nZXRGdWxsWWVhcigpLCBub3dWYWx1ZS5nZXRNb250aCgpLCBub3dWYWx1ZS5nZXREYXRlKCldO1xufVxuXG4vLyBjb252ZXJ0IGFuIGFycmF5IHRvIGEgZGF0ZS5cbi8vIHRoZSBhcnJheSBzaG91bGQgbWlycm9yIHRoZSBwYXJhbWV0ZXJzIGJlbG93XG4vLyBub3RlOiBhbGwgdmFsdWVzIHBhc3QgdGhlIHllYXIgYXJlIG9wdGlvbmFsIGFuZCB3aWxsIGRlZmF1bHQgdG8gdGhlIGxvd2VzdCBwb3NzaWJsZSB2YWx1ZS5cbi8vIFt5ZWFyLCBtb250aCwgZGF5ICwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpc2Vjb25kXVxuZnVuY3Rpb24gY29uZmlnRnJvbUFycmF5IChjb25maWcpIHtcbiAgICB2YXIgaSwgZGF0ZSwgaW5wdXQgPSBbXSwgY3VycmVudERhdGUsIGV4cGVjdGVkV2Vla2RheSwgeWVhclRvVXNlO1xuXG4gICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZyk7XG5cbiAgICAvL2NvbXB1dGUgZGF5IG9mIHRoZSB5ZWFyIGZyb20gd2Vla3MgYW5kIHdlZWtkYXlzXG4gICAgaWYgKGNvbmZpZy5fdyAmJiBjb25maWcuX2FbREFURV0gPT0gbnVsbCAmJiBjb25maWcuX2FbTU9OVEhdID09IG51bGwpIHtcbiAgICAgICAgZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgLy9pZiB0aGUgZGF5IG9mIHRoZSB5ZWFyIGlzIHNldCwgZmlndXJlIG91dCB3aGF0IGl0IGlzXG4gICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyICE9IG51bGwpIHtcbiAgICAgICAgeWVhclRvVXNlID0gZGVmYXVsdHMoY29uZmlnLl9hW1lFQVJdLCBjdXJyZW50RGF0ZVtZRUFSXSk7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyID4gZGF5c0luWWVhcih5ZWFyVG9Vc2UpIHx8IGNvbmZpZy5fZGF5T2ZZZWFyID09PSAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5fb3ZlcmZsb3dEYXlPZlllYXIgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0ZSA9IGNyZWF0ZVVUQ0RhdGUoeWVhclRvVXNlLCAwLCBjb25maWcuX2RheU9mWWVhcik7XG4gICAgICAgIGNvbmZpZy5fYVtNT05USF0gPSBkYXRlLmdldFVUQ01vbnRoKCk7XG4gICAgICAgIGNvbmZpZy5fYVtEQVRFXSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIERlZmF1bHQgdG8gY3VycmVudCBkYXRlLlxuICAgIC8vICogaWYgbm8geWVhciwgbW9udGgsIGRheSBvZiBtb250aCBhcmUgZ2l2ZW4sIGRlZmF1bHQgdG8gdG9kYXlcbiAgICAvLyAqIGlmIGRheSBvZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBtb250aCBhbmQgeWVhclxuICAgIC8vICogaWYgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgb25seSB5ZWFyXG4gICAgLy8gKiBpZiB5ZWFyIGlzIGdpdmVuLCBkb24ndCBkZWZhdWx0IGFueXRoaW5nXG4gICAgZm9yIChpID0gMDsgaSA8IDMgJiYgY29uZmlnLl9hW2ldID09IG51bGw7ICsraSkge1xuICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IGN1cnJlbnREYXRlW2ldO1xuICAgIH1cblxuICAgIC8vIFplcm8gb3V0IHdoYXRldmVyIHdhcyBub3QgZGVmYXVsdGVkLCBpbmNsdWRpbmcgdGltZVxuICAgIGZvciAoOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gKGNvbmZpZy5fYVtpXSA9PSBudWxsKSA/IChpID09PSAyID8gMSA6IDApIDogY29uZmlnLl9hW2ldO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciAyNDowMDowMC4wMDBcbiAgICBpZiAoY29uZmlnLl9hW0hPVVJdID09PSAyNCAmJlxuICAgICAgICAgICAgY29uZmlnLl9hW01JTlVURV0gPT09IDAgJiZcbiAgICAgICAgICAgIGNvbmZpZy5fYVtTRUNPTkRdID09PSAwICYmXG4gICAgICAgICAgICBjb25maWcuX2FbTUlMTElTRUNPTkRdID09PSAwKSB7XG4gICAgICAgIGNvbmZpZy5fbmV4dERheSA9IHRydWU7XG4gICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDA7XG4gICAgfVxuXG4gICAgY29uZmlnLl9kID0gKGNvbmZpZy5fdXNlVVRDID8gY3JlYXRlVVRDRGF0ZSA6IGNyZWF0ZURhdGUpLmFwcGx5KG51bGwsIGlucHV0KTtcbiAgICBleHBlY3RlZFdlZWtkYXkgPSBjb25maWcuX3VzZVVUQyA/IGNvbmZpZy5fZC5nZXRVVENEYXkoKSA6IGNvbmZpZy5fZC5nZXREYXkoKTtcblxuICAgIC8vIEFwcGx5IHRpbWV6b25lIG9mZnNldCBmcm9tIGlucHV0LiBUaGUgYWN0dWFsIHV0Y09mZnNldCBjYW4gYmUgY2hhbmdlZFxuICAgIC8vIHdpdGggcGFyc2Vab25lLlxuICAgIGlmIChjb25maWcuX3R6bSAhPSBudWxsKSB7XG4gICAgICAgIGNvbmZpZy5fZC5zZXRVVENNaW51dGVzKGNvbmZpZy5fZC5nZXRVVENNaW51dGVzKCkgLSBjb25maWcuX3R6bSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5fbmV4dERheSkge1xuICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAyNDtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBmb3IgbWlzbWF0Y2hpbmcgZGF5IG9mIHdlZWtcbiAgICBpZiAoY29uZmlnLl93ICYmIHR5cGVvZiBjb25maWcuX3cuZCAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uZmlnLl93LmQgIT09IGV4cGVjdGVkV2Vla2RheSkge1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS53ZWVrZGF5TWlzbWF0Y2ggPSB0cnVlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZykge1xuICAgIHZhciB3LCB3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3ksIHRlbXAsIHdlZWtkYXlPdmVyZmxvdztcblxuICAgIHcgPSBjb25maWcuX3c7XG4gICAgaWYgKHcuR0cgIT0gbnVsbCB8fCB3LlcgIT0gbnVsbCB8fCB3LkUgIT0gbnVsbCkge1xuICAgICAgICBkb3cgPSAxO1xuICAgICAgICBkb3kgPSA0O1xuXG4gICAgICAgIC8vIFRPRE86IFdlIG5lZWQgdG8gdGFrZSB0aGUgY3VycmVudCBpc29XZWVrWWVhciwgYnV0IHRoYXQgZGVwZW5kcyBvblxuICAgICAgICAvLyBob3cgd2UgaW50ZXJwcmV0IG5vdyAobG9jYWwsIHV0YywgZml4ZWQgb2Zmc2V0KS4gU28gY3JlYXRlXG4gICAgICAgIC8vIGEgbm93IHZlcnNpb24gb2YgY3VycmVudCBjb25maWcgKHRha2UgbG9jYWwvdXRjL29mZnNldCBmbGFncywgYW5kXG4gICAgICAgIC8vIGNyZWF0ZSBub3cpLlxuICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKHcuR0csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihjcmVhdGVMb2NhbCgpLCAxLCA0KS55ZWFyKTtcbiAgICAgICAgd2VlayA9IGRlZmF1bHRzKHcuVywgMSk7XG4gICAgICAgIHdlZWtkYXkgPSBkZWZhdWx0cyh3LkUsIDEpO1xuICAgICAgICBpZiAod2Vla2RheSA8IDEgfHwgd2Vla2RheSA+IDcpIHtcbiAgICAgICAgICAgIHdlZWtkYXlPdmVyZmxvdyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBkb3cgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3c7XG4gICAgICAgIGRveSA9IGNvbmZpZy5fbG9jYWxlLl93ZWVrLmRveTtcblxuICAgICAgICB2YXIgY3VyV2VlayA9IHdlZWtPZlllYXIoY3JlYXRlTG9jYWwoKSwgZG93LCBkb3kpO1xuXG4gICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5nZywgY29uZmlnLl9hW1lFQVJdLCBjdXJXZWVrLnllYXIpO1xuXG4gICAgICAgIC8vIERlZmF1bHQgdG8gY3VycmVudCB3ZWVrLlxuICAgICAgICB3ZWVrID0gZGVmYXVsdHMody53LCBjdXJXZWVrLndlZWspO1xuXG4gICAgICAgIGlmICh3LmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gd2Vla2RheSAtLSBsb3cgZGF5IG51bWJlcnMgYXJlIGNvbnNpZGVyZWQgbmV4dCB3ZWVrXG4gICAgICAgICAgICB3ZWVrZGF5ID0gdy5kO1xuICAgICAgICAgICAgaWYgKHdlZWtkYXkgPCAwIHx8IHdlZWtkYXkgPiA2KSB7XG4gICAgICAgICAgICAgICAgd2Vla2RheU92ZXJmbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh3LmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbG9jYWwgd2Vla2RheSAtLSBjb3VudGluZyBzdGFydHMgZnJvbSBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICB3ZWVrZGF5ID0gdy5lICsgZG93O1xuICAgICAgICAgICAgaWYgKHcuZSA8IDAgfHwgdy5lID4gNikge1xuICAgICAgICAgICAgICAgIHdlZWtkYXlPdmVyZmxvdyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBkZWZhdWx0IHRvIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgIHdlZWtkYXkgPSBkb3c7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHdlZWsgPCAxIHx8IHdlZWsgPiB3ZWVrc0luWWVhcih3ZWVrWWVhciwgZG93LCBkb3kpKSB7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLl9vdmVyZmxvd1dlZWtzID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHdlZWtkYXlPdmVyZmxvdyAhPSBudWxsKSB7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLl9vdmVyZmxvd1dlZWtkYXkgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRlbXAgPSBkYXlPZlllYXJGcm9tV2Vla3Mod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KTtcbiAgICAgICAgY29uZmlnLl9hW1lFQVJdID0gdGVtcC55ZWFyO1xuICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRlbXAuZGF5T2ZZZWFyO1xuICAgIH1cbn1cblxuLy8gaXNvIDg2MDEgcmVnZXhcbi8vIDAwMDAtMDAtMDAgMDAwMC1XMDAgb3IgMDAwMC1XMDAtMCArIFQgKyAwMCBvciAwMDowMCBvciAwMDowMDowMCBvciAwMDowMDowMC4wMDAgKyArMDA6MDAgb3IgKzAwMDAgb3IgKzAwKVxudmFyIGV4dGVuZGVkSXNvUmVnZXggPSAvXlxccyooKD86WystXVxcZHs2fXxcXGR7NH0pLSg/OlxcZFxcZC1cXGRcXGR8V1xcZFxcZC1cXGR8V1xcZFxcZHxcXGRcXGRcXGR8XFxkXFxkKSkoPzooVHwgKShcXGRcXGQoPzo6XFxkXFxkKD86OlxcZFxcZCg/OlsuLF1cXGQrKT8pPyk/KShbXFwrXFwtXVxcZFxcZCg/Ojo/XFxkXFxkKT98XFxzKlopPyk/JC87XG52YXIgYmFzaWNJc29SZWdleCA9IC9eXFxzKigoPzpbKy1dXFxkezZ9fFxcZHs0fSkoPzpcXGRcXGRcXGRcXGR8V1xcZFxcZFxcZHxXXFxkXFxkfFxcZFxcZFxcZHxcXGRcXGQpKSg/OihUfCApKFxcZFxcZCg/OlxcZFxcZCg/OlxcZFxcZCg/OlsuLF1cXGQrKT8pPyk/KShbXFwrXFwtXVxcZFxcZCg/Ojo/XFxkXFxkKT98XFxzKlopPyk/JC87XG5cbnZhciB0elJlZ2V4ID0gL1p8WystXVxcZFxcZCg/Ojo/XFxkXFxkKT8vO1xuXG52YXIgaXNvRGF0ZXMgPSBbXG4gICAgWydZWVlZWVktTU0tREQnLCAvWystXVxcZHs2fS1cXGRcXGQtXFxkXFxkL10sXG4gICAgWydZWVlZLU1NLUREJywgL1xcZHs0fS1cXGRcXGQtXFxkXFxkL10sXG4gICAgWydHR0dHLVtXXVdXLUUnLCAvXFxkezR9LVdcXGRcXGQtXFxkL10sXG4gICAgWydHR0dHLVtXXVdXJywgL1xcZHs0fS1XXFxkXFxkLywgZmFsc2VdLFxuICAgIFsnWVlZWS1EREQnLCAvXFxkezR9LVxcZHszfS9dLFxuICAgIFsnWVlZWS1NTScsIC9cXGR7NH0tXFxkXFxkLywgZmFsc2VdLFxuICAgIFsnWVlZWVlZTU1ERCcsIC9bKy1dXFxkezEwfS9dLFxuICAgIFsnWVlZWU1NREQnLCAvXFxkezh9L10sXG4gICAgLy8gWVlZWU1NIGlzIE5PVCBhbGxvd2VkIGJ5IHRoZSBzdGFuZGFyZFxuICAgIFsnR0dHR1tXXVdXRScsIC9cXGR7NH1XXFxkezN9L10sXG4gICAgWydHR0dHW1ddV1cnLCAvXFxkezR9V1xcZHsyfS8sIGZhbHNlXSxcbiAgICBbJ1lZWVlEREQnLCAvXFxkezd9L11cbl07XG5cbi8vIGlzbyB0aW1lIGZvcm1hdHMgYW5kIHJlZ2V4ZXNcbnZhciBpc29UaW1lcyA9IFtcbiAgICBbJ0hIOm1tOnNzLlNTU1MnLCAvXFxkXFxkOlxcZFxcZDpcXGRcXGRcXC5cXGQrL10sXG4gICAgWydISDptbTpzcyxTU1NTJywgL1xcZFxcZDpcXGRcXGQ6XFxkXFxkLFxcZCsvXSxcbiAgICBbJ0hIOm1tOnNzJywgL1xcZFxcZDpcXGRcXGQ6XFxkXFxkL10sXG4gICAgWydISDptbScsIC9cXGRcXGQ6XFxkXFxkL10sXG4gICAgWydISG1tc3MuU1NTUycsIC9cXGRcXGRcXGRcXGRcXGRcXGRcXC5cXGQrL10sXG4gICAgWydISG1tc3MsU1NTUycsIC9cXGRcXGRcXGRcXGRcXGRcXGQsXFxkKy9dLFxuICAgIFsnSEhtbXNzJywgL1xcZFxcZFxcZFxcZFxcZFxcZC9dLFxuICAgIFsnSEhtbScsIC9cXGRcXGRcXGRcXGQvXSxcbiAgICBbJ0hIJywgL1xcZFxcZC9dXG5dO1xuXG52YXIgYXNwTmV0SnNvblJlZ2V4ID0gL15cXC8/RGF0ZVxcKChcXC0/XFxkKykvaTtcblxuLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXRcbmZ1bmN0aW9uIGNvbmZpZ0Zyb21JU08oY29uZmlnKSB7XG4gICAgdmFyIGksIGwsXG4gICAgICAgIHN0cmluZyA9IGNvbmZpZy5faSxcbiAgICAgICAgbWF0Y2ggPSBleHRlbmRlZElzb1JlZ2V4LmV4ZWMoc3RyaW5nKSB8fCBiYXNpY0lzb1JlZ2V4LmV4ZWMoc3RyaW5nKSxcbiAgICAgICAgYWxsb3dUaW1lLCBkYXRlRm9ybWF0LCB0aW1lRm9ybWF0LCB0ekZvcm1hdDtcblxuICAgIGlmIChtYXRjaCkge1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pc28gPSB0cnVlO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29EYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpc29EYXRlc1tpXVsxXS5leGVjKG1hdGNoWzFdKSkge1xuICAgICAgICAgICAgICAgIGRhdGVGb3JtYXQgPSBpc29EYXRlc1tpXVswXTtcbiAgICAgICAgICAgICAgICBhbGxvd1RpbWUgPSBpc29EYXRlc1tpXVsyXSAhPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGVGb3JtYXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoWzNdKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvVGltZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzb1RpbWVzW2ldWzFdLmV4ZWMobWF0Y2hbM10pKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoWzJdIHNob3VsZCBiZSAnVCcgb3Igc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgdGltZUZvcm1hdCA9IChtYXRjaFsyXSB8fCAnICcpICsgaXNvVGltZXNbaV1bMF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aW1lRm9ybWF0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhbGxvd1RpbWUgJiYgdGltZUZvcm1hdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbNF0pIHtcbiAgICAgICAgICAgIGlmICh0elJlZ2V4LmV4ZWMobWF0Y2hbNF0pKSB7XG4gICAgICAgICAgICAgICAgdHpGb3JtYXQgPSAnWic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25maWcuX2YgPSBkYXRlRm9ybWF0ICsgKHRpbWVGb3JtYXQgfHwgJycpICsgKHR6Rm9ybWF0IHx8ICcnKTtcbiAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgIH1cbn1cblxuLy8gUkZDIDI4MjIgcmVnZXg6IEZvciBkZXRhaWxzIHNlZSBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMjgyMiNzZWN0aW9uLTMuM1xudmFyIHJmYzI4MjIgPSAvXig/OihNb258VHVlfFdlZHxUaHV8RnJpfFNhdHxTdW4pLD9cXHMpPyhcXGR7MSwyfSlcXHMoSmFufEZlYnxNYXJ8QXByfE1heXxKdW58SnVsfEF1Z3xTZXB8T2N0fE5vdnxEZWMpXFxzKFxcZHsyLDR9KVxccyhcXGRcXGQpOihcXGRcXGQpKD86OihcXGRcXGQpKT9cXHMoPzooVVR8R01UfFtFQ01QXVtTRF1UKXwoW1p6XSl8KFsrLV1cXGR7NH0pKSQvO1xuXG5mdW5jdGlvbiBleHRyYWN0RnJvbVJGQzI4MjJTdHJpbmdzKHllYXJTdHIsIG1vbnRoU3RyLCBkYXlTdHIsIGhvdXJTdHIsIG1pbnV0ZVN0ciwgc2Vjb25kU3RyKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtcbiAgICAgICAgdW50cnVuY2F0ZVllYXIoeWVhclN0ciksXG4gICAgICAgIGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydC5pbmRleE9mKG1vbnRoU3RyKSxcbiAgICAgICAgcGFyc2VJbnQoZGF5U3RyLCAxMCksXG4gICAgICAgIHBhcnNlSW50KGhvdXJTdHIsIDEwKSxcbiAgICAgICAgcGFyc2VJbnQobWludXRlU3RyLCAxMClcbiAgICBdO1xuXG4gICAgaWYgKHNlY29uZFN0cikge1xuICAgICAgICByZXN1bHQucHVzaChwYXJzZUludChzZWNvbmRTdHIsIDEwKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gdW50cnVuY2F0ZVllYXIoeWVhclN0cikge1xuICAgIHZhciB5ZWFyID0gcGFyc2VJbnQoeWVhclN0ciwgMTApO1xuICAgIGlmICh5ZWFyIDw9IDQ5KSB7XG4gICAgICAgIHJldHVybiAyMDAwICsgeWVhcjtcbiAgICB9IGVsc2UgaWYgKHllYXIgPD0gOTk5KSB7XG4gICAgICAgIHJldHVybiAxOTAwICsgeWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIHllYXI7XG59XG5cbmZ1bmN0aW9uIHByZXByb2Nlc3NSRkMyODIyKHMpIHtcbiAgICAvLyBSZW1vdmUgY29tbWVudHMgYW5kIGZvbGRpbmcgd2hpdGVzcGFjZSBhbmQgcmVwbGFjZSBtdWx0aXBsZS1zcGFjZXMgd2l0aCBhIHNpbmdsZSBzcGFjZVxuICAgIHJldHVybiBzLnJlcGxhY2UoL1xcKFteKV0qXFwpfFtcXG5cXHRdL2csICcgJykucmVwbGFjZSgvKFxcc1xccyspL2csICcgJykudHJpbSgpO1xufVxuXG5mdW5jdGlvbiBjaGVja1dlZWtkYXkod2Vla2RheVN0ciwgcGFyc2VkSW5wdXQsIGNvbmZpZykge1xuICAgIGlmICh3ZWVrZGF5U3RyKSB7XG4gICAgICAgIC8vIFRPRE86IFJlcGxhY2UgdGhlIHZhbmlsbGEgSlMgRGF0ZSBvYmplY3Qgd2l0aCBhbiBpbmRlcGVudGVudCBkYXktb2Ytd2VlayBjaGVjay5cbiAgICAgICAgdmFyIHdlZWtkYXlQcm92aWRlZCA9IGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0LmluZGV4T2Yod2Vla2RheVN0ciksXG4gICAgICAgICAgICB3ZWVrZGF5QWN0dWFsID0gbmV3IERhdGUocGFyc2VkSW5wdXRbMF0sIHBhcnNlZElucHV0WzFdLCBwYXJzZWRJbnB1dFsyXSkuZ2V0RGF5KCk7XG4gICAgICAgIGlmICh3ZWVrZGF5UHJvdmlkZWQgIT09IHdlZWtkYXlBY3R1YWwpIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLndlZWtkYXlNaXNtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxudmFyIG9ic09mZnNldHMgPSB7XG4gICAgVVQ6IDAsXG4gICAgR01UOiAwLFxuICAgIEVEVDogLTQgKiA2MCxcbiAgICBFU1Q6IC01ICogNjAsXG4gICAgQ0RUOiAtNSAqIDYwLFxuICAgIENTVDogLTYgKiA2MCxcbiAgICBNRFQ6IC02ICogNjAsXG4gICAgTVNUOiAtNyAqIDYwLFxuICAgIFBEVDogLTcgKiA2MCxcbiAgICBQU1Q6IC04ICogNjBcbn07XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZU9mZnNldChvYnNPZmZzZXQsIG1pbGl0YXJ5T2Zmc2V0LCBudW1PZmZzZXQpIHtcbiAgICBpZiAob2JzT2Zmc2V0KSB7XG4gICAgICAgIHJldHVybiBvYnNPZmZzZXRzW29ic09mZnNldF07XG4gICAgfSBlbHNlIGlmIChtaWxpdGFyeU9mZnNldCkge1xuICAgICAgICAvLyB0aGUgb25seSBhbGxvd2VkIG1pbGl0YXJ5IHR6IGlzIFpcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGhtID0gcGFyc2VJbnQobnVtT2Zmc2V0LCAxMCk7XG4gICAgICAgIHZhciBtID0gaG0gJSAxMDAsIGggPSAoaG0gLSBtKSAvIDEwMDtcbiAgICAgICAgcmV0dXJuIGggKiA2MCArIG07XG4gICAgfVxufVxuXG4vLyBkYXRlIGFuZCB0aW1lIGZyb20gcmVmIDI4MjIgZm9ybWF0XG5mdW5jdGlvbiBjb25maWdGcm9tUkZDMjgyMihjb25maWcpIHtcbiAgICB2YXIgbWF0Y2ggPSByZmMyODIyLmV4ZWMocHJlcHJvY2Vzc1JGQzI4MjIoY29uZmlnLl9pKSk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHZhciBwYXJzZWRBcnJheSA9IGV4dHJhY3RGcm9tUkZDMjgyMlN0cmluZ3MobWF0Y2hbNF0sIG1hdGNoWzNdLCBtYXRjaFsyXSwgbWF0Y2hbNV0sIG1hdGNoWzZdLCBtYXRjaFs3XSk7XG4gICAgICAgIGlmICghY2hlY2tXZWVrZGF5KG1hdGNoWzFdLCBwYXJzZWRBcnJheSwgY29uZmlnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9hID0gcGFyc2VkQXJyYXk7XG4gICAgICAgIGNvbmZpZy5fdHptID0gY2FsY3VsYXRlT2Zmc2V0KG1hdGNoWzhdLCBtYXRjaFs5XSwgbWF0Y2hbMTBdKTtcblxuICAgICAgICBjb25maWcuX2QgPSBjcmVhdGVVVENEYXRlLmFwcGx5KG51bGwsIGNvbmZpZy5fYSk7XG4gICAgICAgIGNvbmZpZy5fZC5zZXRVVENNaW51dGVzKGNvbmZpZy5fZC5nZXRVVENNaW51dGVzKCkgLSBjb25maWcuX3R6bSk7XG5cbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykucmZjMjgyMiA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgfVxufVxuXG4vLyBkYXRlIGZyb20gaXNvIGZvcm1hdCBvciBmYWxsYmFja1xuZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZyhjb25maWcpIHtcbiAgICB2YXIgbWF0Y2hlZCA9IGFzcE5ldEpzb25SZWdleC5leGVjKGNvbmZpZy5faSk7XG5cbiAgICBpZiAobWF0Y2hlZCAhPT0gbnVsbCkge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgrbWF0Y2hlZFsxXSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgaWYgKGNvbmZpZy5faXNWYWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uZmlnRnJvbVJGQzI4MjIoY29uZmlnKTtcbiAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICBkZWxldGUgY29uZmlnLl9pc1ZhbGlkO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGaW5hbCBhdHRlbXB0LCB1c2UgSW5wdXQgRmFsbGJhY2tcbiAgICBob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xufVxuXG5ob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayA9IGRlcHJlY2F0ZShcbiAgICAndmFsdWUgcHJvdmlkZWQgaXMgbm90IGluIGEgcmVjb2duaXplZCBSRkMyODIyIG9yIElTTyBmb3JtYXQuIG1vbWVudCBjb25zdHJ1Y3Rpb24gZmFsbHMgYmFjayB0byBqcyBEYXRlKCksICcgK1xuICAgICd3aGljaCBpcyBub3QgcmVsaWFibGUgYWNyb3NzIGFsbCBicm93c2VycyBhbmQgdmVyc2lvbnMuIE5vbiBSRkMyODIyL0lTTyBkYXRlIGZvcm1hdHMgYXJlICcgK1xuICAgICdkaXNjb3VyYWdlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGFuIHVwY29taW5nIG1ham9yIHJlbGVhc2UuIFBsZWFzZSByZWZlciB0byAnICtcbiAgICAnaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9qcy1kYXRlLyBmb3IgbW9yZSBpbmZvLicsXG4gICAgZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShjb25maWcuX2kgKyAoY29uZmlnLl91c2VVVEMgPyAnIFVUQycgOiAnJykpO1xuICAgIH1cbik7XG5cbi8vIGNvbnN0YW50IHRoYXQgcmVmZXJzIHRvIHRoZSBJU08gc3RhbmRhcmRcbmhvb2tzLklTT184NjAxID0gZnVuY3Rpb24gKCkge307XG5cbi8vIGNvbnN0YW50IHRoYXQgcmVmZXJzIHRvIHRoZSBSRkMgMjgyMiBmb3JtXG5ob29rcy5SRkNfMjgyMiA9IGZ1bmN0aW9uICgpIHt9O1xuXG4vLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBmb3JtYXQgc3RyaW5nXG5mdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZykge1xuICAgIC8vIFRPRE86IE1vdmUgdGhpcyB0byBhbm90aGVyIHBhcnQgb2YgdGhlIGNyZWF0aW9uIGZsb3cgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzXG4gICAgaWYgKGNvbmZpZy5fZiA9PT0gaG9va3MuSVNPXzg2MDEpIHtcbiAgICAgICAgY29uZmlnRnJvbUlTTyhjb25maWcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjb25maWcuX2YgPT09IGhvb2tzLlJGQ18yODIyKSB7XG4gICAgICAgIGNvbmZpZ0Zyb21SRkMyODIyKGNvbmZpZyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uZmlnLl9hID0gW107XG4gICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZW1wdHkgPSB0cnVlO1xuXG4gICAgLy8gVGhpcyBhcnJheSBpcyB1c2VkIHRvIG1ha2UgYSBEYXRlLCBlaXRoZXIgd2l0aCBgbmV3IERhdGVgIG9yIGBEYXRlLlVUQ2BcbiAgICB2YXIgc3RyaW5nID0gJycgKyBjb25maWcuX2ksXG4gICAgICAgIGksIHBhcnNlZElucHV0LCB0b2tlbnMsIHRva2VuLCBza2lwcGVkLFxuICAgICAgICBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoID0gMDtcblxuICAgIHRva2VucyA9IGV4cGFuZEZvcm1hdChjb25maWcuX2YsIGNvbmZpZy5fbG9jYWxlKS5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSB8fCBbXTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgIHBhcnNlZElucHV0ID0gKHN0cmluZy5tYXRjaChnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykpIHx8IFtdKVswXTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3Rva2VuJywgdG9rZW4sICdwYXJzZWRJbnB1dCcsIHBhcnNlZElucHV0LFxuICAgICAgICAvLyAgICAgICAgICdyZWdleCcsIGdldFBhcnNlUmVnZXhGb3JUb2tlbih0b2tlbiwgY29uZmlnKSk7XG4gICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgc2tpcHBlZCA9IHN0cmluZy5zdWJzdHIoMCwgc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpKTtcbiAgICAgICAgICAgIGlmIChza2lwcGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRJbnB1dC5wdXNoKHNraXBwZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnNsaWNlKHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSArIHBhcnNlZElucHV0Lmxlbmd0aCk7XG4gICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoICs9IHBhcnNlZElucHV0Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICAvLyBkb24ndCBwYXJzZSBpZiBpdCdzIG5vdCBhIGtub3duIHRva2VuXG4gICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0pIHtcbiAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgcGFyc2VkSW5wdXQsIGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29uZmlnLl9zdHJpY3QgJiYgIXBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhZGQgcmVtYWluaW5nIHVucGFyc2VkIGlucHV0IGxlbmd0aCB0byB0aGUgc3RyaW5nXG4gICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuY2hhcnNMZWZ0T3ZlciA9IHN0cmluZ0xlbmd0aCAtIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGg7XG4gICAgaWYgKHN0cmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZElucHV0LnB1c2goc3RyaW5nKTtcbiAgICB9XG5cbiAgICAvLyBjbGVhciBfMTJoIGZsYWcgaWYgaG91ciBpcyA8PSAxMlxuICAgIGlmIChjb25maWcuX2FbSE9VUl0gPD0gMTIgJiZcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9PT0gdHJ1ZSAmJlxuICAgICAgICBjb25maWcuX2FbSE9VUl0gPiAwKSB7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykucGFyc2VkRGF0ZVBhcnRzID0gY29uZmlnLl9hLnNsaWNlKDApO1xuICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLm1lcmlkaWVtID0gY29uZmlnLl9tZXJpZGllbTtcbiAgICAvLyBoYW5kbGUgbWVyaWRpZW1cbiAgICBjb25maWcuX2FbSE9VUl0gPSBtZXJpZGllbUZpeFdyYXAoY29uZmlnLl9sb2NhbGUsIGNvbmZpZy5fYVtIT1VSXSwgY29uZmlnLl9tZXJpZGllbSk7XG5cbiAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICBjaGVja092ZXJmbG93KGNvbmZpZyk7XG59XG5cblxuZnVuY3Rpb24gbWVyaWRpZW1GaXhXcmFwIChsb2NhbGUsIGhvdXIsIG1lcmlkaWVtKSB7XG4gICAgdmFyIGlzUG07XG5cbiAgICBpZiAobWVyaWRpZW0gPT0gbnVsbCkge1xuICAgICAgICAvLyBub3RoaW5nIHRvIGRvXG4gICAgICAgIHJldHVybiBob3VyO1xuICAgIH1cbiAgICBpZiAobG9jYWxlLm1lcmlkaWVtSG91ciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUubWVyaWRpZW1Ib3VyKGhvdXIsIG1lcmlkaWVtKTtcbiAgICB9IGVsc2UgaWYgKGxvY2FsZS5pc1BNICE9IG51bGwpIHtcbiAgICAgICAgLy8gRmFsbGJhY2tcbiAgICAgICAgaXNQbSA9IGxvY2FsZS5pc1BNKG1lcmlkaWVtKTtcbiAgICAgICAgaWYgKGlzUG0gJiYgaG91ciA8IDEyKSB7XG4gICAgICAgICAgICBob3VyICs9IDEyO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNQbSAmJiBob3VyID09PSAxMikge1xuICAgICAgICAgICAgaG91ciA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdGhpcyBpcyBub3Qgc3VwcG9zZWQgdG8gaGFwcGVuXG4gICAgICAgIHJldHVybiBob3VyO1xuICAgIH1cbn1cblxuLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgYXJyYXkgb2YgZm9ybWF0IHN0cmluZ3NcbmZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmdBbmRBcnJheShjb25maWcpIHtcbiAgICB2YXIgdGVtcENvbmZpZyxcbiAgICAgICAgYmVzdE1vbWVudCxcblxuICAgICAgICBzY29yZVRvQmVhdCxcbiAgICAgICAgaSxcbiAgICAgICAgY3VycmVudFNjb3JlO1xuXG4gICAgaWYgKGNvbmZpZy5fZi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZEZvcm1hdCA9IHRydWU7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLl9mLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGN1cnJlbnRTY29yZSA9IDA7XG4gICAgICAgIHRlbXBDb25maWcgPSBjb3B5Q29uZmlnKHt9LCBjb25maWcpO1xuICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGVtcENvbmZpZy5fdXNlVVRDID0gY29uZmlnLl91c2VVVEM7XG4gICAgICAgIH1cbiAgICAgICAgdGVtcENvbmZpZy5fZiA9IGNvbmZpZy5fZltpXTtcbiAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdCh0ZW1wQ29uZmlnKTtcblxuICAgICAgICBpZiAoIWlzVmFsaWQodGVtcENvbmZpZykpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW55IGlucHV0IHRoYXQgd2FzIG5vdCBwYXJzZWQgYWRkIGEgcGVuYWx0eSBmb3IgdGhhdCBmb3JtYXRcbiAgICAgICAgY3VycmVudFNjb3JlICs9IGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS5jaGFyc0xlZnRPdmVyO1xuXG4gICAgICAgIC8vb3IgdG9rZW5zXG4gICAgICAgIGN1cnJlbnRTY29yZSArPSBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykudW51c2VkVG9rZW5zLmxlbmd0aCAqIDEwO1xuXG4gICAgICAgIGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS5zY29yZSA9IGN1cnJlbnRTY29yZTtcblxuICAgICAgICBpZiAoc2NvcmVUb0JlYXQgPT0gbnVsbCB8fCBjdXJyZW50U2NvcmUgPCBzY29yZVRvQmVhdCkge1xuICAgICAgICAgICAgc2NvcmVUb0JlYXQgPSBjdXJyZW50U2NvcmU7XG4gICAgICAgICAgICBiZXN0TW9tZW50ID0gdGVtcENvbmZpZztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4dGVuZChjb25maWcsIGJlc3RNb21lbnQgfHwgdGVtcENvbmZpZyk7XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKSB7XG4gICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGkgPSBub3JtYWxpemVPYmplY3RVbml0cyhjb25maWcuX2kpO1xuICAgIGNvbmZpZy5fYSA9IG1hcChbaS55ZWFyLCBpLm1vbnRoLCBpLmRheSB8fCBpLmRhdGUsIGkuaG91ciwgaS5taW51dGUsIGkuc2Vjb25kLCBpLm1pbGxpc2Vjb25kXSwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqICYmIHBhcnNlSW50KG9iaiwgMTApO1xuICAgIH0pO1xuXG4gICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZyb21Db25maWcgKGNvbmZpZykge1xuICAgIHZhciByZXMgPSBuZXcgTW9tZW50KGNoZWNrT3ZlcmZsb3cocHJlcGFyZUNvbmZpZyhjb25maWcpKSk7XG4gICAgaWYgKHJlcy5fbmV4dERheSkge1xuICAgICAgICAvLyBBZGRpbmcgaXMgc21hcnQgZW5vdWdoIGFyb3VuZCBEU1RcbiAgICAgICAgcmVzLmFkZCgxLCAnZCcpO1xuICAgICAgICByZXMuX25leHREYXkgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gcHJlcGFyZUNvbmZpZyAoY29uZmlnKSB7XG4gICAgdmFyIGlucHV0ID0gY29uZmlnLl9pLFxuICAgICAgICBmb3JtYXQgPSBjb25maWcuX2Y7XG5cbiAgICBjb25maWcuX2xvY2FsZSA9IGNvbmZpZy5fbG9jYWxlIHx8IGdldExvY2FsZShjb25maWcuX2wpO1xuXG4gICAgaWYgKGlucHV0ID09PSBudWxsIHx8IChmb3JtYXQgPT09IHVuZGVmaW5lZCAmJiBpbnB1dCA9PT0gJycpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVJbnZhbGlkKHtudWxsSW5wdXQ6IHRydWV9KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25maWcuX2kgPSBpbnB1dCA9IGNvbmZpZy5fbG9jYWxlLnByZXBhcnNlKGlucHV0KTtcbiAgICB9XG5cbiAgICBpZiAoaXNNb21lbnQoaW5wdXQpKSB7XG4gICAgICAgIHJldHVybiBuZXcgTW9tZW50KGNoZWNrT3ZlcmZsb3coaW5wdXQpKTtcbiAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgY29uZmlnLl9kID0gaW5wdXQ7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KGZvcm1hdCkpIHtcbiAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZyk7XG4gICAgfSBlbHNlIGlmIChmb3JtYXQpIHtcbiAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgIH0gIGVsc2Uge1xuICAgICAgICBjb25maWdGcm9tSW5wdXQoY29uZmlnKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzVmFsaWQoY29uZmlnKSkge1xuICAgICAgICBjb25maWcuX2QgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjb25maWc7XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ0Zyb21JbnB1dChjb25maWcpIHtcbiAgICB2YXIgaW5wdXQgPSBjb25maWcuX2k7XG4gICAgaWYgKGlzVW5kZWZpbmVkKGlucHV0KSkge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShob29rcy5ub3coKSk7XG4gICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGlucHV0LnZhbHVlT2YoKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgIGNvbmZpZy5fYSA9IG1hcChpbnB1dC5zbGljZSgwKSwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdChpbnB1dCkpIHtcbiAgICAgICAgY29uZmlnRnJvbU9iamVjdChjb25maWcpO1xuICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIoaW5wdXQpKSB7XG4gICAgICAgIC8vIGZyb20gbWlsbGlzZWNvbmRzXG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGlucHV0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTG9jYWxPclVUQyAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIGlzVVRDKSB7XG4gICAgdmFyIGMgPSB7fTtcblxuICAgIGlmIChsb2NhbGUgPT09IHRydWUgfHwgbG9jYWxlID09PSBmYWxzZSkge1xuICAgICAgICBzdHJpY3QgPSBsb2NhbGU7XG4gICAgICAgIGxvY2FsZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoKGlzT2JqZWN0KGlucHV0KSAmJiBpc09iamVjdEVtcHR5KGlucHV0KSkgfHxcbiAgICAgICAgICAgIChpc0FycmF5KGlucHV0KSAmJiBpbnB1dC5sZW5ndGggPT09IDApKSB7XG4gICAgICAgIGlucHV0ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBvYmplY3QgY29uc3RydWN0aW9uIG11c3QgYmUgZG9uZSB0aGlzIHdheS5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgYy5fdXNlVVRDID0gYy5faXNVVEMgPSBpc1VUQztcbiAgICBjLl9sID0gbG9jYWxlO1xuICAgIGMuX2kgPSBpbnB1dDtcbiAgICBjLl9mID0gZm9ybWF0O1xuICAgIGMuX3N0cmljdCA9IHN0cmljdDtcblxuICAgIHJldHVybiBjcmVhdGVGcm9tQ29uZmlnKGMpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMb2NhbCAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgZmFsc2UpO1xufVxuXG52YXIgcHJvdG90eXBlTWluID0gZGVwcmVjYXRlKFxuICAgICdtb21lbnQoKS5taW4gaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5tYXggaW5zdGVhZC4gaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9taW4tbWF4LycsXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkgJiYgb3RoZXIuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gb3RoZXIgPCB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUludmFsaWQoKTtcbiAgICAgICAgfVxuICAgIH1cbik7XG5cbnZhciBwcm90b3R5cGVNYXggPSBkZXByZWNhdGUoXG4gICAgJ21vbWVudCgpLm1heCBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1pbiBpbnN0ZWFkLiBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL21pbi1tYXgvJyxcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvdGhlciA9IGNyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSAmJiBvdGhlci5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvdGhlciA+IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlSW52YWxpZCgpO1xuICAgICAgICB9XG4gICAgfVxuKTtcblxuLy8gUGljayBhIG1vbWVudCBtIGZyb20gbW9tZW50cyBzbyB0aGF0IG1bZm5dKG90aGVyKSBpcyB0cnVlIGZvciBhbGxcbi8vIG90aGVyLiBUaGlzIHJlbGllcyBvbiB0aGUgZnVuY3Rpb24gZm4gdG8gYmUgdHJhbnNpdGl2ZS5cbi8vXG4vLyBtb21lbnRzIHNob3VsZCBlaXRoZXIgYmUgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMgb3IgYW4gYXJyYXksIHdob3NlXG4vLyBmaXJzdCBlbGVtZW50IGlzIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzLlxuZnVuY3Rpb24gcGlja0J5KGZuLCBtb21lbnRzKSB7XG4gICAgdmFyIHJlcywgaTtcbiAgICBpZiAobW9tZW50cy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShtb21lbnRzWzBdKSkge1xuICAgICAgICBtb21lbnRzID0gbW9tZW50c1swXTtcbiAgICB9XG4gICAgaWYgKCFtb21lbnRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWwoKTtcbiAgICB9XG4gICAgcmVzID0gbW9tZW50c1swXTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbW9tZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAoIW1vbWVudHNbaV0uaXNWYWxpZCgpIHx8IG1vbWVudHNbaV1bZm5dKHJlcykpIHtcbiAgICAgICAgICAgIHJlcyA9IG1vbWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gVE9ETzogVXNlIFtdLnNvcnQgaW5zdGVhZD9cbmZ1bmN0aW9uIG1pbiAoKSB7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICByZXR1cm4gcGlja0J5KCdpc0JlZm9yZScsIGFyZ3MpO1xufVxuXG5mdW5jdGlvbiBtYXggKCkge1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgcmV0dXJuIHBpY2tCeSgnaXNBZnRlcicsIGFyZ3MpO1xufVxuXG52YXIgbm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBEYXRlLm5vdyA/IERhdGUubm93KCkgOiArKG5ldyBEYXRlKCkpO1xufTtcblxudmFyIG9yZGVyaW5nID0gWyd5ZWFyJywgJ3F1YXJ0ZXInLCAnbW9udGgnLCAnd2VlaycsICdkYXknLCAnaG91cicsICdtaW51dGUnLCAnc2Vjb25kJywgJ21pbGxpc2Vjb25kJ107XG5cbmZ1bmN0aW9uIGlzRHVyYXRpb25WYWxpZChtKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG0pIHtcbiAgICAgICAgaWYgKCEoaW5kZXhPZi5jYWxsKG9yZGVyaW5nLCBrZXkpICE9PSAtMSAmJiAobVtrZXldID09IG51bGwgfHwgIWlzTmFOKG1ba2V5XSkpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHVuaXRIYXNEZWNpbWFsID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmRlcmluZy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAobVtvcmRlcmluZ1tpXV0pIHtcbiAgICAgICAgICAgIGlmICh1bml0SGFzRGVjaW1hbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gb25seSBhbGxvdyBub24taW50ZWdlcnMgZm9yIHNtYWxsZXN0IHVuaXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KG1bb3JkZXJpbmdbaV1dKSAhPT0gdG9JbnQobVtvcmRlcmluZ1tpXV0pKSB7XG4gICAgICAgICAgICAgICAgdW5pdEhhc0RlY2ltYWwgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWQkMSgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNWYWxpZDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSW52YWxpZCQxKCkge1xuICAgIHJldHVybiBjcmVhdGVEdXJhdGlvbihOYU4pO1xufVxuXG5mdW5jdGlvbiBEdXJhdGlvbiAoZHVyYXRpb24pIHtcbiAgICB2YXIgbm9ybWFsaXplZElucHV0ID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoZHVyYXRpb24pLFxuICAgICAgICB5ZWFycyA9IG5vcm1hbGl6ZWRJbnB1dC55ZWFyIHx8IDAsXG4gICAgICAgIHF1YXJ0ZXJzID0gbm9ybWFsaXplZElucHV0LnF1YXJ0ZXIgfHwgMCxcbiAgICAgICAgbW9udGhzID0gbm9ybWFsaXplZElucHV0Lm1vbnRoIHx8IDAsXG4gICAgICAgIHdlZWtzID0gbm9ybWFsaXplZElucHV0LndlZWsgfHwgMCxcbiAgICAgICAgZGF5cyA9IG5vcm1hbGl6ZWRJbnB1dC5kYXkgfHwgMCxcbiAgICAgICAgaG91cnMgPSBub3JtYWxpemVkSW5wdXQuaG91ciB8fCAwLFxuICAgICAgICBtaW51dGVzID0gbm9ybWFsaXplZElucHV0Lm1pbnV0ZSB8fCAwLFxuICAgICAgICBzZWNvbmRzID0gbm9ybWFsaXplZElucHV0LnNlY29uZCB8fCAwLFxuICAgICAgICBtaWxsaXNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQubWlsbGlzZWNvbmQgfHwgMDtcblxuICAgIHRoaXMuX2lzVmFsaWQgPSBpc0R1cmF0aW9uVmFsaWQobm9ybWFsaXplZElucHV0KTtcblxuICAgIC8vIHJlcHJlc2VudGF0aW9uIGZvciBkYXRlQWRkUmVtb3ZlXG4gICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gK21pbGxpc2Vjb25kcyArXG4gICAgICAgIHNlY29uZHMgKiAxZTMgKyAvLyAxMDAwXG4gICAgICAgIG1pbnV0ZXMgKiA2ZTQgKyAvLyAxMDAwICogNjBcbiAgICAgICAgaG91cnMgKiAxMDAwICogNjAgKiA2MDsgLy91c2luZyAxMDAwICogNjAgKiA2MCBpbnN0ZWFkIG9mIDM2ZTUgdG8gYXZvaWQgZmxvYXRpbmcgcG9pbnQgcm91bmRpbmcgZXJyb3JzIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8yOTc4XG4gICAgLy8gQmVjYXVzZSBvZiBkYXRlQWRkUmVtb3ZlIHRyZWF0cyAyNCBob3VycyBhcyBkaWZmZXJlbnQgZnJvbSBhXG4gICAgLy8gZGF5IHdoZW4gd29ya2luZyBhcm91bmQgRFNULCB3ZSBuZWVkIHRvIHN0b3JlIHRoZW0gc2VwYXJhdGVseVxuICAgIHRoaXMuX2RheXMgPSArZGF5cyArXG4gICAgICAgIHdlZWtzICogNztcbiAgICAvLyBJdCBpcyBpbXBvc3NpYmxlIHRvIHRyYW5zbGF0ZSBtb250aHMgaW50byBkYXlzIHdpdGhvdXQga25vd2luZ1xuICAgIC8vIHdoaWNoIG1vbnRocyB5b3UgYXJlIGFyZSB0YWxraW5nIGFib3V0LCBzbyB3ZSBoYXZlIHRvIHN0b3JlXG4gICAgLy8gaXQgc2VwYXJhdGVseS5cbiAgICB0aGlzLl9tb250aHMgPSArbW9udGhzICtcbiAgICAgICAgcXVhcnRlcnMgKiAzICtcbiAgICAgICAgeWVhcnMgKiAxMjtcblxuICAgIHRoaXMuX2RhdGEgPSB7fTtcblxuICAgIHRoaXMuX2xvY2FsZSA9IGdldExvY2FsZSgpO1xuXG4gICAgdGhpcy5fYnViYmxlKCk7XG59XG5cbmZ1bmN0aW9uIGlzRHVyYXRpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEdXJhdGlvbjtcbn1cblxuZnVuY3Rpb24gYWJzUm91bmQgKG51bWJlcikge1xuICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKC0xICogbnVtYmVyKSAqIC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKG51bWJlcik7XG4gICAgfVxufVxuXG4vLyBGT1JNQVRUSU5HXG5cbmZ1bmN0aW9uIG9mZnNldCAodG9rZW4sIHNlcGFyYXRvcikge1xuICAgIGFkZEZvcm1hdFRva2VuKHRva2VuLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnV0Y09mZnNldCgpO1xuICAgICAgICB2YXIgc2lnbiA9ICcrJztcbiAgICAgICAgaWYgKG9mZnNldCA8IDApIHtcbiAgICAgICAgICAgIG9mZnNldCA9IC1vZmZzZXQ7XG4gICAgICAgICAgICBzaWduID0gJy0nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaWduICsgemVyb0ZpbGwofn4ob2Zmc2V0IC8gNjApLCAyKSArIHNlcGFyYXRvciArIHplcm9GaWxsKH5+KG9mZnNldCkgJSA2MCwgMik7XG4gICAgfSk7XG59XG5cbm9mZnNldCgnWicsICc6Jyk7XG5vZmZzZXQoJ1paJywgJycpO1xuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ1onLCAgbWF0Y2hTaG9ydE9mZnNldCk7XG5hZGRSZWdleFRva2VuKCdaWicsIG1hdGNoU2hvcnRPZmZzZXQpO1xuYWRkUGFyc2VUb2tlbihbJ1onLCAnWlonXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgY29uZmlnLl91c2VVVEMgPSB0cnVlO1xuICAgIGNvbmZpZy5fdHptID0gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaFNob3J0T2Zmc2V0LCBpbnB1dCk7XG59KTtcblxuLy8gSEVMUEVSU1xuXG4vLyB0aW1lem9uZSBjaHVua2VyXG4vLyAnKzEwOjAwJyA+IFsnMTAnLCAgJzAwJ11cbi8vICctMTUzMCcgID4gWyctMTUnLCAnMzAnXVxudmFyIGNodW5rT2Zmc2V0ID0gLyhbXFwrXFwtXXxcXGRcXGQpL2dpO1xuXG5mdW5jdGlvbiBvZmZzZXRGcm9tU3RyaW5nKG1hdGNoZXIsIHN0cmluZykge1xuICAgIHZhciBtYXRjaGVzID0gKHN0cmluZyB8fCAnJykubWF0Y2gobWF0Y2hlcik7XG5cbiAgICBpZiAobWF0Y2hlcyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgY2h1bmsgICA9IG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAxXSB8fCBbXTtcbiAgICB2YXIgcGFydHMgICA9IChjaHVuayArICcnKS5tYXRjaChjaHVua09mZnNldCkgfHwgWyctJywgMCwgMF07XG4gICAgdmFyIG1pbnV0ZXMgPSArKHBhcnRzWzFdICogNjApICsgdG9JbnQocGFydHNbMl0pO1xuXG4gICAgcmV0dXJuIG1pbnV0ZXMgPT09IDAgP1xuICAgICAgMCA6XG4gICAgICBwYXJ0c1swXSA9PT0gJysnID8gbWludXRlcyA6IC1taW51dGVzO1xufVxuXG4vLyBSZXR1cm4gYSBtb21lbnQgZnJvbSBpbnB1dCwgdGhhdCBpcyBsb2NhbC91dGMvem9uZSBlcXVpdmFsZW50IHRvIG1vZGVsLlxuZnVuY3Rpb24gY2xvbmVXaXRoT2Zmc2V0KGlucHV0LCBtb2RlbCkge1xuICAgIHZhciByZXMsIGRpZmY7XG4gICAgaWYgKG1vZGVsLl9pc1VUQykge1xuICAgICAgICByZXMgPSBtb2RlbC5jbG9uZSgpO1xuICAgICAgICBkaWZmID0gKGlzTW9tZW50KGlucHV0KSB8fCBpc0RhdGUoaW5wdXQpID8gaW5wdXQudmFsdWVPZigpIDogY3JlYXRlTG9jYWwoaW5wdXQpLnZhbHVlT2YoKSkgLSByZXMudmFsdWVPZigpO1xuICAgICAgICAvLyBVc2UgbG93LWxldmVsIGFwaSwgYmVjYXVzZSB0aGlzIGZuIGlzIGxvdy1sZXZlbCBhcGkuXG4gICAgICAgIHJlcy5fZC5zZXRUaW1lKHJlcy5fZC52YWx1ZU9mKCkgKyBkaWZmKTtcbiAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHJlcywgZmFsc2UpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbChpbnB1dCkubG9jYWwoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldERhdGVPZmZzZXQgKG0pIHtcbiAgICAvLyBPbiBGaXJlZm94LjI0IERhdGUjZ2V0VGltZXpvbmVPZmZzZXQgcmV0dXJucyBhIGZsb2F0aW5nIHBvaW50LlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L3B1bGwvMTg3MVxuICAgIHJldHVybiAtTWF0aC5yb3VuZChtLl9kLmdldFRpbWV6b25lT2Zmc2V0KCkgLyAxNSkgKiAxNTtcbn1cblxuLy8gSE9PS1NcblxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBhIG1vbWVudCBpcyBtdXRhdGVkLlxuLy8gSXQgaXMgaW50ZW5kZWQgdG8ga2VlcCB0aGUgb2Zmc2V0IGluIHN5bmMgd2l0aCB0aGUgdGltZXpvbmUuXG5ob29rcy51cGRhdGVPZmZzZXQgPSBmdW5jdGlvbiAoKSB7fTtcblxuLy8gTU9NRU5UU1xuXG4vLyBrZWVwTG9jYWxUaW1lID0gdHJ1ZSBtZWFucyBvbmx5IGNoYW5nZSB0aGUgdGltZXpvbmUsIHdpdGhvdXRcbi8vIGFmZmVjdGluZyB0aGUgbG9jYWwgaG91ci4gU28gNTozMToyNiArMDMwMCAtLVt1dGNPZmZzZXQoMiwgdHJ1ZSldLS0+XG4vLyA1OjMxOjI2ICswMjAwIEl0IGlzIHBvc3NpYmxlIHRoYXQgNTozMToyNiBkb2Vzbid0IGV4aXN0IHdpdGggb2Zmc2V0XG4vLyArMDIwMCwgc28gd2UgYWRqdXN0IHRoZSB0aW1lIGFzIG5lZWRlZCwgdG8gYmUgdmFsaWQuXG4vL1xuLy8gS2VlcGluZyB0aGUgdGltZSBhY3R1YWxseSBhZGRzL3N1YnRyYWN0cyAob25lIGhvdXIpXG4vLyBmcm9tIHRoZSBhY3R1YWwgcmVwcmVzZW50ZWQgdGltZS4gVGhhdCBpcyB3aHkgd2UgY2FsbCB1cGRhdGVPZmZzZXRcbi8vIGEgc2Vjb25kIHRpbWUuIEluIGNhc2UgaXQgd2FudHMgdXMgdG8gY2hhbmdlIHRoZSBvZmZzZXQgYWdhaW5cbi8vIF9jaGFuZ2VJblByb2dyZXNzID09IHRydWUgY2FzZSwgdGhlbiB3ZSBoYXZlIHRvIGFkanVzdCwgYmVjYXVzZVxuLy8gdGhlcmUgaXMgbm8gc3VjaCB0aW1lIGluIHRoZSBnaXZlbiB0aW1lem9uZS5cbmZ1bmN0aW9uIGdldFNldE9mZnNldCAoaW5wdXQsIGtlZXBMb2NhbFRpbWUsIGtlZXBNaW51dGVzKSB7XG4gICAgdmFyIG9mZnNldCA9IHRoaXMuX29mZnNldCB8fCAwLFxuICAgICAgICBsb2NhbEFkanVzdDtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICB9XG4gICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlucHV0ID0gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaFNob3J0T2Zmc2V0LCBpbnB1dCk7XG4gICAgICAgICAgICBpZiAoaW5wdXQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhpbnB1dCkgPCAxNiAmJiAha2VlcE1pbnV0ZXMpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXQgKiA2MDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2lzVVRDICYmIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgIGxvY2FsQWRqdXN0ID0gZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vZmZzZXQgPSBpbnB1dDtcbiAgICAgICAgdGhpcy5faXNVVEMgPSB0cnVlO1xuICAgICAgICBpZiAobG9jYWxBZGp1c3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hZGQobG9jYWxBZGp1c3QsICdtJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9mZnNldCAhPT0gaW5wdXQpIHtcbiAgICAgICAgICAgIGlmICgha2VlcExvY2FsVGltZSB8fCB0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgYWRkU3VidHJhY3QodGhpcywgY3JlYXRlRHVyYXRpb24oaW5wdXQgLSBvZmZzZXQsICdtJyksIDEsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gb2Zmc2V0IDogZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldFNldFpvbmUgKGlucHV0LCBrZWVwTG9jYWxUaW1lKSB7XG4gICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlucHV0ID0gLWlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51dGNPZmZzZXQoaW5wdXQsIGtlZXBMb2NhbFRpbWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAtdGhpcy51dGNPZmZzZXQoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldE9mZnNldFRvVVRDIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xufVxuXG5mdW5jdGlvbiBzZXRPZmZzZXRUb0xvY2FsIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgaWYgKHRoaXMuX2lzVVRDKSB7XG4gICAgICAgIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgICAgICB0aGlzLl9pc1VUQyA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnRyYWN0KGdldERhdGVPZmZzZXQodGhpcyksICdtJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0ICgpIHtcbiAgICBpZiAodGhpcy5fdHptICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy51dGNPZmZzZXQodGhpcy5fdHptLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5faSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIHRab25lID0gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaE9mZnNldCwgdGhpcy5faSk7XG4gICAgICAgIGlmICh0Wm9uZSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCh0Wm9uZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgwLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gaGFzQWxpZ25lZEhvdXJPZmZzZXQgKGlucHV0KSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlucHV0ID0gaW5wdXQgPyBjcmVhdGVMb2NhbChpbnB1dCkudXRjT2Zmc2V0KCkgOiAwO1xuXG4gICAgcmV0dXJuICh0aGlzLnV0Y09mZnNldCgpIC0gaW5wdXQpICUgNjAgPT09IDA7XG59XG5cbmZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLnV0Y09mZnNldCgpID4gdGhpcy5jbG9uZSgpLm1vbnRoKDApLnV0Y09mZnNldCgpIHx8XG4gICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoNSkudXRjT2Zmc2V0KClcbiAgICApO1xufVxuXG5mdW5jdGlvbiBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQgKCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5faXNEU1RTaGlmdGVkKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNEU1RTaGlmdGVkO1xuICAgIH1cblxuICAgIHZhciBjID0ge307XG5cbiAgICBjb3B5Q29uZmlnKGMsIHRoaXMpO1xuICAgIGMgPSBwcmVwYXJlQ29uZmlnKGMpO1xuXG4gICAgaWYgKGMuX2EpIHtcbiAgICAgICAgdmFyIG90aGVyID0gYy5faXNVVEMgPyBjcmVhdGVVVEMoYy5fYSkgOiBjcmVhdGVMb2NhbChjLl9hKTtcbiAgICAgICAgdGhpcy5faXNEU1RTaGlmdGVkID0gdGhpcy5pc1ZhbGlkKCkgJiZcbiAgICAgICAgICAgIGNvbXBhcmVBcnJheXMoYy5fYSwgb3RoZXIudG9BcnJheSgpKSA+IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faXNEU1RTaGlmdGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2lzRFNUU2hpZnRlZDtcbn1cblxuZnVuY3Rpb24gaXNMb2NhbCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gIXRoaXMuX2lzVVRDIDogZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzVXRjT2Zmc2V0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzLl9pc1VUQyA6IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1V0YyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy5faXNVVEMgJiYgdGhpcy5fb2Zmc2V0ID09PSAwIDogZmFsc2U7XG59XG5cbi8vIEFTUC5ORVQganNvbiBkYXRlIGZvcm1hdCByZWdleFxudmFyIGFzcE5ldFJlZ2V4ID0gL14oXFwtfFxcKyk/KD86KFxcZCopWy4gXSk/KFxcZCspXFw6KFxcZCspKD86XFw6KFxcZCspKFxcLlxcZCopPyk/JC87XG5cbi8vIGZyb20gaHR0cDovL2RvY3MuY2xvc3VyZS1saWJyYXJ5Lmdvb2dsZWNvZGUuY29tL2dpdC9jbG9zdXJlX2dvb2dfZGF0ZV9kYXRlLmpzLnNvdXJjZS5odG1sXG4vLyBzb21ld2hhdCBtb3JlIGluIGxpbmUgd2l0aCA0LjQuMy4yIDIwMDQgc3BlYywgYnV0IGFsbG93cyBkZWNpbWFsIGFueXdoZXJlXG4vLyBhbmQgZnVydGhlciBtb2RpZmllZCB0byBhbGxvdyBmb3Igc3RyaW5ncyBjb250YWluaW5nIGJvdGggd2VlayBhbmQgZGF5XG52YXIgaXNvUmVnZXggPSAvXigtfFxcKyk/UCg/OihbLStdP1swLTksLl0qKVkpPyg/OihbLStdP1swLTksLl0qKU0pPyg/OihbLStdP1swLTksLl0qKVcpPyg/OihbLStdP1swLTksLl0qKUQpPyg/OlQoPzooWy0rXT9bMC05LC5dKilIKT8oPzooWy0rXT9bMC05LC5dKilNKT8oPzooWy0rXT9bMC05LC5dKilTKT8pPyQvO1xuXG5mdW5jdGlvbiBjcmVhdGVEdXJhdGlvbiAoaW5wdXQsIGtleSkge1xuICAgIHZhciBkdXJhdGlvbiA9IGlucHV0LFxuICAgICAgICAvLyBtYXRjaGluZyBhZ2FpbnN0IHJlZ2V4cCBpcyBleHBlbnNpdmUsIGRvIGl0IG9uIGRlbWFuZFxuICAgICAgICBtYXRjaCA9IG51bGwsXG4gICAgICAgIHNpZ24sXG4gICAgICAgIHJldCxcbiAgICAgICAgZGlmZlJlcztcblxuICAgIGlmIChpc0R1cmF0aW9uKGlucHV0KSkge1xuICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgIG1zIDogaW5wdXQuX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgIGQgIDogaW5wdXQuX2RheXMsXG4gICAgICAgICAgICBNICA6IGlucHV0Ll9tb250aHNcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGlzTnVtYmVyKGlucHV0KSkge1xuICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICBkdXJhdGlvbltrZXldID0gaW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkdXJhdGlvbi5taWxsaXNlY29uZHMgPSBpbnB1dDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBhc3BOZXRSZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogMTtcbiAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICB5ICA6IDAsXG4gICAgICAgICAgICBkICA6IHRvSW50KG1hdGNoW0RBVEVdKSAgICAgICAgICAgICAgICAgICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICBoICA6IHRvSW50KG1hdGNoW0hPVVJdKSAgICAgICAgICAgICAgICAgICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICBtICA6IHRvSW50KG1hdGNoW01JTlVURV0pICAgICAgICAgICAgICAgICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICBzICA6IHRvSW50KG1hdGNoW1NFQ09ORF0pICAgICAgICAgICAgICAgICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICBtcyA6IHRvSW50KGFic1JvdW5kKG1hdGNoW01JTExJU0VDT05EXSAqIDEwMDApKSAqIHNpZ24gLy8gdGhlIG1pbGxpc2Vjb25kIGRlY2ltYWwgcG9pbnQgaXMgaW5jbHVkZWQgaW4gdGhlIG1hdGNoXG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGlzb1JlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSAnLScpID8gLTEgOiAobWF0Y2hbMV0gPT09ICcrJykgPyAxIDogMTtcbiAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICB5IDogcGFyc2VJc28obWF0Y2hbMl0sIHNpZ24pLFxuICAgICAgICAgICAgTSA6IHBhcnNlSXNvKG1hdGNoWzNdLCBzaWduKSxcbiAgICAgICAgICAgIHcgOiBwYXJzZUlzbyhtYXRjaFs0XSwgc2lnbiksXG4gICAgICAgICAgICBkIDogcGFyc2VJc28obWF0Y2hbNV0sIHNpZ24pLFxuICAgICAgICAgICAgaCA6IHBhcnNlSXNvKG1hdGNoWzZdLCBzaWduKSxcbiAgICAgICAgICAgIG0gOiBwYXJzZUlzbyhtYXRjaFs3XSwgc2lnbiksXG4gICAgICAgICAgICBzIDogcGFyc2VJc28obWF0Y2hbOF0sIHNpZ24pXG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmIChkdXJhdGlvbiA9PSBudWxsKSB7Ly8gY2hlY2tzIGZvciBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGR1cmF0aW9uID09PSAnb2JqZWN0JyAmJiAoJ2Zyb20nIGluIGR1cmF0aW9uIHx8ICd0bycgaW4gZHVyYXRpb24pKSB7XG4gICAgICAgIGRpZmZSZXMgPSBtb21lbnRzRGlmZmVyZW5jZShjcmVhdGVMb2NhbChkdXJhdGlvbi5mcm9tKSwgY3JlYXRlTG9jYWwoZHVyYXRpb24udG8pKTtcblxuICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICBkdXJhdGlvbi5tcyA9IGRpZmZSZXMubWlsbGlzZWNvbmRzO1xuICAgICAgICBkdXJhdGlvbi5NID0gZGlmZlJlcy5tb250aHM7XG4gICAgfVxuXG4gICAgcmV0ID0gbmV3IER1cmF0aW9uKGR1cmF0aW9uKTtcblxuICAgIGlmIChpc0R1cmF0aW9uKGlucHV0KSAmJiBoYXNPd25Qcm9wKGlucHV0LCAnX2xvY2FsZScpKSB7XG4gICAgICAgIHJldC5fbG9jYWxlID0gaW5wdXQuX2xvY2FsZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufVxuXG5jcmVhdGVEdXJhdGlvbi5mbiA9IER1cmF0aW9uLnByb3RvdHlwZTtcbmNyZWF0ZUR1cmF0aW9uLmludmFsaWQgPSBjcmVhdGVJbnZhbGlkJDE7XG5cbmZ1bmN0aW9uIHBhcnNlSXNvIChpbnAsIHNpZ24pIHtcbiAgICAvLyBXZSdkIG5vcm1hbGx5IHVzZSB+fmlucCBmb3IgdGhpcywgYnV0IHVuZm9ydHVuYXRlbHkgaXQgYWxzb1xuICAgIC8vIGNvbnZlcnRzIGZsb2F0cyB0byBpbnRzLlxuICAgIC8vIGlucCBtYXkgYmUgdW5kZWZpbmVkLCBzbyBjYXJlZnVsIGNhbGxpbmcgcmVwbGFjZSBvbiBpdC5cbiAgICB2YXIgcmVzID0gaW5wICYmIHBhcnNlRmxvYXQoaW5wLnJlcGxhY2UoJywnLCAnLicpKTtcbiAgICAvLyBhcHBseSBzaWduIHdoaWxlIHdlJ3JlIGF0IGl0XG4gICAgcmV0dXJuIChpc05hTihyZXMpID8gMCA6IHJlcykgKiBzaWduO1xufVxuXG5mdW5jdGlvbiBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgdmFyIHJlcyA9IHttaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMH07XG5cbiAgICByZXMubW9udGhzID0gb3RoZXIubW9udGgoKSAtIGJhc2UubW9udGgoKSArXG4gICAgICAgIChvdGhlci55ZWFyKCkgLSBiYXNlLnllYXIoKSkgKiAxMjtcbiAgICBpZiAoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpLmlzQWZ0ZXIob3RoZXIpKSB7XG4gICAgICAgIC0tcmVzLm1vbnRocztcbiAgICB9XG5cbiAgICByZXMubWlsbGlzZWNvbmRzID0gK290aGVyIC0gKyhiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykpO1xuXG4gICAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gbW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICB2YXIgcmVzO1xuICAgIGlmICghKGJhc2UuaXNWYWxpZCgpICYmIG90aGVyLmlzVmFsaWQoKSkpIHtcbiAgICAgICAgcmV0dXJuIHttaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMH07XG4gICAgfVxuXG4gICAgb3RoZXIgPSBjbG9uZVdpdGhPZmZzZXQob3RoZXIsIGJhc2UpO1xuICAgIGlmIChiYXNlLmlzQmVmb3JlKG90aGVyKSkge1xuICAgICAgICByZXMgPSBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXMgPSBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKG90aGVyLCBiYXNlKTtcbiAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9IC1yZXMubWlsbGlzZWNvbmRzO1xuICAgICAgICByZXMubW9udGhzID0gLXJlcy5tb250aHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gVE9ETzogcmVtb3ZlICduYW1lJyBhcmcgYWZ0ZXIgZGVwcmVjYXRpb24gaXMgcmVtb3ZlZFxuZnVuY3Rpb24gY3JlYXRlQWRkZXIoZGlyZWN0aW9uLCBuYW1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2YWwsIHBlcmlvZCkge1xuICAgICAgICB2YXIgZHVyLCB0bXA7XG4gICAgICAgIC8vaW52ZXJ0IHRoZSBhcmd1bWVudHMsIGJ1dCBjb21wbGFpbiBhYm91dCBpdFxuICAgICAgICBpZiAocGVyaW9kICE9PSBudWxsICYmICFpc05hTigrcGVyaW9kKSkge1xuICAgICAgICAgICAgZGVwcmVjYXRlU2ltcGxlKG5hbWUsICdtb21lbnQoKS4nICsgbmFtZSAgKyAnKHBlcmlvZCwgbnVtYmVyKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIG1vbWVudCgpLicgKyBuYW1lICsgJyhudW1iZXIsIHBlcmlvZCkuICcgK1xuICAgICAgICAgICAgJ1NlZSBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL2FkZC1pbnZlcnRlZC1wYXJhbS8gZm9yIG1vcmUgaW5mby4nKTtcbiAgICAgICAgICAgIHRtcCA9IHZhbDsgdmFsID0gcGVyaW9kOyBwZXJpb2QgPSB0bXA7XG4gICAgICAgIH1cblxuICAgICAgICB2YWwgPSB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/ICt2YWwgOiB2YWw7XG4gICAgICAgIGR1ciA9IGNyZWF0ZUR1cmF0aW9uKHZhbCwgcGVyaW9kKTtcbiAgICAgICAgYWRkU3VidHJhY3QodGhpcywgZHVyLCBkaXJlY3Rpb24pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBhZGRTdWJ0cmFjdCAobW9tLCBkdXJhdGlvbiwgaXNBZGRpbmcsIHVwZGF0ZU9mZnNldCkge1xuICAgIHZhciBtaWxsaXNlY29uZHMgPSBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzLFxuICAgICAgICBkYXlzID0gYWJzUm91bmQoZHVyYXRpb24uX2RheXMpLFxuICAgICAgICBtb250aHMgPSBhYnNSb3VuZChkdXJhdGlvbi5fbW9udGhzKTtcblxuICAgIGlmICghbW9tLmlzVmFsaWQoKSkge1xuICAgICAgICAvLyBObyBvcFxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdXBkYXRlT2Zmc2V0ID0gdXBkYXRlT2Zmc2V0ID09IG51bGwgPyB0cnVlIDogdXBkYXRlT2Zmc2V0O1xuXG4gICAgaWYgKG1vbnRocykge1xuICAgICAgICBzZXRNb250aChtb20sIGdldChtb20sICdNb250aCcpICsgbW9udGhzICogaXNBZGRpbmcpO1xuICAgIH1cbiAgICBpZiAoZGF5cykge1xuICAgICAgICBzZXQkMShtb20sICdEYXRlJywgZ2V0KG1vbSwgJ0RhdGUnKSArIGRheXMgKiBpc0FkZGluZyk7XG4gICAgfVxuICAgIGlmIChtaWxsaXNlY29uZHMpIHtcbiAgICAgICAgbW9tLl9kLnNldFRpbWUobW9tLl9kLnZhbHVlT2YoKSArIG1pbGxpc2Vjb25kcyAqIGlzQWRkaW5nKTtcbiAgICB9XG4gICAgaWYgKHVwZGF0ZU9mZnNldCkge1xuICAgICAgICBob29rcy51cGRhdGVPZmZzZXQobW9tLCBkYXlzIHx8IG1vbnRocyk7XG4gICAgfVxufVxuXG52YXIgYWRkICAgICAgPSBjcmVhdGVBZGRlcigxLCAnYWRkJyk7XG52YXIgc3VidHJhY3QgPSBjcmVhdGVBZGRlcigtMSwgJ3N1YnRyYWN0Jyk7XG5cbmZ1bmN0aW9uIGdldENhbGVuZGFyRm9ybWF0KG15TW9tZW50LCBub3cpIHtcbiAgICB2YXIgZGlmZiA9IG15TW9tZW50LmRpZmYobm93LCAnZGF5cycsIHRydWUpO1xuICAgIHJldHVybiBkaWZmIDwgLTYgPyAnc2FtZUVsc2UnIDpcbiAgICAgICAgICAgIGRpZmYgPCAtMSA/ICdsYXN0V2VlaycgOlxuICAgICAgICAgICAgZGlmZiA8IDAgPyAnbGFzdERheScgOlxuICAgICAgICAgICAgZGlmZiA8IDEgPyAnc2FtZURheScgOlxuICAgICAgICAgICAgZGlmZiA8IDIgPyAnbmV4dERheScgOlxuICAgICAgICAgICAgZGlmZiA8IDcgPyAnbmV4dFdlZWsnIDogJ3NhbWVFbHNlJztcbn1cblxuZnVuY3Rpb24gY2FsZW5kYXIkMSAodGltZSwgZm9ybWF0cykge1xuICAgIC8vIFdlIHdhbnQgdG8gY29tcGFyZSB0aGUgc3RhcnQgb2YgdG9kYXksIHZzIHRoaXMuXG4gICAgLy8gR2V0dGluZyBzdGFydC1vZi10b2RheSBkZXBlbmRzIG9uIHdoZXRoZXIgd2UncmUgbG9jYWwvdXRjL29mZnNldCBvciBub3QuXG4gICAgdmFyIG5vdyA9IHRpbWUgfHwgY3JlYXRlTG9jYWwoKSxcbiAgICAgICAgc29kID0gY2xvbmVXaXRoT2Zmc2V0KG5vdywgdGhpcykuc3RhcnRPZignZGF5JyksXG4gICAgICAgIGZvcm1hdCA9IGhvb2tzLmNhbGVuZGFyRm9ybWF0KHRoaXMsIHNvZCkgfHwgJ3NhbWVFbHNlJztcblxuICAgIHZhciBvdXRwdXQgPSBmb3JtYXRzICYmIChpc0Z1bmN0aW9uKGZvcm1hdHNbZm9ybWF0XSkgPyBmb3JtYXRzW2Zvcm1hdF0uY2FsbCh0aGlzLCBub3cpIDogZm9ybWF0c1tmb3JtYXRdKTtcblxuICAgIHJldHVybiB0aGlzLmZvcm1hdChvdXRwdXQgfHwgdGhpcy5sb2NhbGVEYXRhKCkuY2FsZW5kYXIoZm9ybWF0LCB0aGlzLCBjcmVhdGVMb2NhbChub3cpKSk7XG59XG5cbmZ1bmN0aW9uIGNsb25lICgpIHtcbiAgICByZXR1cm4gbmV3IE1vbWVudCh0aGlzKTtcbn1cblxuZnVuY3Rpb24gaXNBZnRlciAoaW5wdXQsIHVuaXRzKSB7XG4gICAgdmFyIGxvY2FsSW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGNyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICBpZiAoISh0aGlzLmlzVmFsaWQoKSAmJiBsb2NhbElucHV0LmlzVmFsaWQoKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKCFpc1VuZGVmaW5lZCh1bml0cykgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCkgPiBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbG9jYWxJbnB1dC52YWx1ZU9mKCkgPCB0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykudmFsdWVPZigpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNCZWZvcmUgKGlucHV0LCB1bml0cykge1xuICAgIHZhciBsb2NhbElucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBjcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgaWYgKCEodGhpcy5pc1ZhbGlkKCkgJiYgbG9jYWxJbnB1dC5pc1ZhbGlkKCkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyghaXNVbmRlZmluZWQodW5pdHMpID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVPZigpIDwgbG9jYWxJbnB1dC52YWx1ZU9mKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5lbmRPZih1bml0cykudmFsdWVPZigpIDwgbG9jYWxJbnB1dC52YWx1ZU9mKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc0JldHdlZW4gKGZyb20sIHRvLCB1bml0cywgaW5jbHVzaXZpdHkpIHtcbiAgICBpbmNsdXNpdml0eSA9IGluY2x1c2l2aXR5IHx8ICcoKSc7XG4gICAgcmV0dXJuIChpbmNsdXNpdml0eVswXSA9PT0gJygnID8gdGhpcy5pc0FmdGVyKGZyb20sIHVuaXRzKSA6ICF0aGlzLmlzQmVmb3JlKGZyb20sIHVuaXRzKSkgJiZcbiAgICAgICAgKGluY2x1c2l2aXR5WzFdID09PSAnKScgPyB0aGlzLmlzQmVmb3JlKHRvLCB1bml0cykgOiAhdGhpcy5pc0FmdGVyKHRvLCB1bml0cykpO1xufVxuXG5mdW5jdGlvbiBpc1NhbWUgKGlucHV0LCB1bml0cykge1xuICAgIHZhciBsb2NhbElucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBjcmVhdGVMb2NhbChpbnB1dCksXG4gICAgICAgIGlucHV0TXM7XG4gICAgaWYgKCEodGhpcy5pc1ZhbGlkKCkgJiYgbG9jYWxJbnB1dC5pc1ZhbGlkKCkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyB8fCAnbWlsbGlzZWNvbmQnKTtcbiAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVPZigpID09PSBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dE1zID0gbG9jYWxJbnB1dC52YWx1ZU9mKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykudmFsdWVPZigpIDw9IGlucHV0TXMgJiYgaW5wdXRNcyA8PSB0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpLnZhbHVlT2YoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzU2FtZU9yQWZ0ZXIgKGlucHV0LCB1bml0cykge1xuICAgIHJldHVybiB0aGlzLmlzU2FtZShpbnB1dCwgdW5pdHMpIHx8IHRoaXMuaXNBZnRlcihpbnB1dCx1bml0cyk7XG59XG5cbmZ1bmN0aW9uIGlzU2FtZU9yQmVmb3JlIChpbnB1dCwgdW5pdHMpIHtcbiAgICByZXR1cm4gdGhpcy5pc1NhbWUoaW5wdXQsIHVuaXRzKSB8fCB0aGlzLmlzQmVmb3JlKGlucHV0LHVuaXRzKTtcbn1cblxuZnVuY3Rpb24gZGlmZiAoaW5wdXQsIHVuaXRzLCBhc0Zsb2F0KSB7XG4gICAgdmFyIHRoYXQsXG4gICAgICAgIHpvbmVEZWx0YSxcbiAgICAgICAgb3V0cHV0O1xuXG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gTmFOO1xuICAgIH1cblxuICAgIHRoYXQgPSBjbG9uZVdpdGhPZmZzZXQoaW5wdXQsIHRoaXMpO1xuXG4gICAgaWYgKCF0aGF0LmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gTmFOO1xuICAgIH1cblxuICAgIHpvbmVEZWx0YSA9ICh0aGF0LnV0Y09mZnNldCgpIC0gdGhpcy51dGNPZmZzZXQoKSkgKiA2ZTQ7XG5cbiAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcblxuICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgY2FzZSAneWVhcic6IG91dHB1dCA9IG1vbnRoRGlmZih0aGlzLCB0aGF0KSAvIDEyOyBicmVhaztcbiAgICAgICAgY2FzZSAnbW9udGgnOiBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCk7IGJyZWFrO1xuICAgICAgICBjYXNlICdxdWFydGVyJzogb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpIC8gMzsgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3NlY29uZCc6IG91dHB1dCA9ICh0aGlzIC0gdGhhdCkgLyAxZTM7IGJyZWFrOyAvLyAxMDAwXG4gICAgICAgIGNhc2UgJ21pbnV0ZSc6IG91dHB1dCA9ICh0aGlzIC0gdGhhdCkgLyA2ZTQ7IGJyZWFrOyAvLyAxMDAwICogNjBcbiAgICAgICAgY2FzZSAnaG91cic6IG91dHB1dCA9ICh0aGlzIC0gdGhhdCkgLyAzNmU1OyBicmVhazsgLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgY2FzZSAnZGF5Jzogb3V0cHV0ID0gKHRoaXMgLSB0aGF0IC0gem9uZURlbHRhKSAvIDg2NGU1OyBicmVhazsgLy8gMTAwMCAqIDYwICogNjAgKiAyNCwgbmVnYXRlIGRzdFxuICAgICAgICBjYXNlICd3ZWVrJzogb3V0cHV0ID0gKHRoaXMgLSB0aGF0IC0gem9uZURlbHRhKSAvIDYwNDhlNTsgYnJlYWs7IC8vIDEwMDAgKiA2MCAqIDYwICogMjQgKiA3LCBuZWdhdGUgZHN0XG4gICAgICAgIGRlZmF1bHQ6IG91dHB1dCA9IHRoaXMgLSB0aGF0O1xuICAgIH1cblxuICAgIHJldHVybiBhc0Zsb2F0ID8gb3V0cHV0IDogYWJzRmxvb3Iob3V0cHV0KTtcbn1cblxuZnVuY3Rpb24gbW9udGhEaWZmIChhLCBiKSB7XG4gICAgLy8gZGlmZmVyZW5jZSBpbiBtb250aHNcbiAgICB2YXIgd2hvbGVNb250aERpZmYgPSAoKGIueWVhcigpIC0gYS55ZWFyKCkpICogMTIpICsgKGIubW9udGgoKSAtIGEubW9udGgoKSksXG4gICAgICAgIC8vIGIgaXMgaW4gKGFuY2hvciAtIDEgbW9udGgsIGFuY2hvciArIDEgbW9udGgpXG4gICAgICAgIGFuY2hvciA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYsICdtb250aHMnKSxcbiAgICAgICAgYW5jaG9yMiwgYWRqdXN0O1xuXG4gICAgaWYgKGIgLSBhbmNob3IgPCAwKSB7XG4gICAgICAgIGFuY2hvcjIgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmIC0gMSwgJ21vbnRocycpO1xuICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICBhZGp1c3QgPSAoYiAtIGFuY2hvcikgLyAoYW5jaG9yIC0gYW5jaG9yMik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgKyAxLCAnbW9udGhzJyk7XG4gICAgICAgIC8vIGxpbmVhciBhY3Jvc3MgdGhlIG1vbnRoXG4gICAgICAgIGFkanVzdCA9IChiIC0gYW5jaG9yKSAvIChhbmNob3IyIC0gYW5jaG9yKTtcbiAgICB9XG5cbiAgICAvL2NoZWNrIGZvciBuZWdhdGl2ZSB6ZXJvLCByZXR1cm4gemVybyBpZiBuZWdhdGl2ZSB6ZXJvXG4gICAgcmV0dXJuIC0od2hvbGVNb250aERpZmYgKyBhZGp1c3QpIHx8IDA7XG59XG5cbmhvb2tzLmRlZmF1bHRGb3JtYXQgPSAnWVlZWS1NTS1ERFRISDptbTpzc1onO1xuaG9va3MuZGVmYXVsdEZvcm1hdFV0YyA9ICdZWVlZLU1NLUREVEhIOm1tOnNzW1pdJztcblxuZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiB0aGlzLmNsb25lKCkubG9jYWxlKCdlbicpLmZvcm1hdCgnZGRkIE1NTSBERCBZWVlZIEhIOm1tOnNzIFtHTVRdWlonKTtcbn1cblxuZnVuY3Rpb24gdG9JU09TdHJpbmcoa2VlcE9mZnNldCkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciB1dGMgPSBrZWVwT2Zmc2V0ICE9PSB0cnVlO1xuICAgIHZhciBtID0gdXRjID8gdGhpcy5jbG9uZSgpLnV0YygpIDogdGhpcztcbiAgICBpZiAobS55ZWFyKCkgPCAwIHx8IG0ueWVhcigpID4gOTk5OSkge1xuICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sIHV0YyA/ICdZWVlZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nIDogJ1lZWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1onKTtcbiAgICB9XG4gICAgaWYgKGlzRnVuY3Rpb24oRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcpKSB7XG4gICAgICAgIC8vIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBpcyB+NTB4IGZhc3RlciwgdXNlIGl0IHdoZW4gd2UgY2FuXG4gICAgICAgIGlmICh1dGMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodGhpcy52YWx1ZU9mKCkgKyB0aGlzLnV0Y09mZnNldCgpICogNjAgKiAxMDAwKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1onLCBmb3JtYXRNb21lbnQobSwgJ1onKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCB1dGMgPyAnWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScgOiAnWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1onKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBodW1hbiByZWFkYWJsZSByZXByZXNlbnRhdGlvbiBvZiBhIG1vbWVudCB0aGF0IGNhblxuICogYWxzbyBiZSBldmFsdWF0ZWQgdG8gZ2V0IGEgbmV3IG1vbWVudCB3aGljaCBpcyB0aGUgc2FtZVxuICpcbiAqIEBsaW5rIGh0dHBzOi8vbm9kZWpzLm9yZy9kaXN0L2xhdGVzdC9kb2NzL2FwaS91dGlsLmh0bWwjdXRpbF9jdXN0b21faW5zcGVjdF9mdW5jdGlvbl9vbl9vYmplY3RzXG4gKi9cbmZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuICdtb21lbnQuaW52YWxpZCgvKiAnICsgdGhpcy5faSArICcgKi8pJztcbiAgICB9XG4gICAgdmFyIGZ1bmMgPSAnbW9tZW50JztcbiAgICB2YXIgem9uZSA9ICcnO1xuICAgIGlmICghdGhpcy5pc0xvY2FsKCkpIHtcbiAgICAgICAgZnVuYyA9IHRoaXMudXRjT2Zmc2V0KCkgPT09IDAgPyAnbW9tZW50LnV0YycgOiAnbW9tZW50LnBhcnNlWm9uZSc7XG4gICAgICAgIHpvbmUgPSAnWic7XG4gICAgfVxuICAgIHZhciBwcmVmaXggPSAnWycgKyBmdW5jICsgJyhcIl0nO1xuICAgIHZhciB5ZWFyID0gKDAgPD0gdGhpcy55ZWFyKCkgJiYgdGhpcy55ZWFyKCkgPD0gOTk5OSkgPyAnWVlZWScgOiAnWVlZWVlZJztcbiAgICB2YXIgZGF0ZXRpbWUgPSAnLU1NLUREW1RdSEg6bW06c3MuU1NTJztcbiAgICB2YXIgc3VmZml4ID0gem9uZSArICdbXCIpXSc7XG5cbiAgICByZXR1cm4gdGhpcy5mb3JtYXQocHJlZml4ICsgeWVhciArIGRhdGV0aW1lICsgc3VmZml4KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0IChpbnB1dFN0cmluZykge1xuICAgIGlmICghaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgaW5wdXRTdHJpbmcgPSB0aGlzLmlzVXRjKCkgPyBob29rcy5kZWZhdWx0Rm9ybWF0VXRjIDogaG9va3MuZGVmYXVsdEZvcm1hdDtcbiAgICB9XG4gICAgdmFyIG91dHB1dCA9IGZvcm1hdE1vbWVudCh0aGlzLCBpbnB1dFN0cmluZyk7XG4gICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLnBvc3Rmb3JtYXQob3V0cHV0KTtcbn1cblxuZnVuY3Rpb24gZnJvbSAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgIGlmICh0aGlzLmlzVmFsaWQoKSAmJlxuICAgICAgICAgICAgKChpc01vbWVudCh0aW1lKSAmJiB0aW1lLmlzVmFsaWQoKSkgfHxcbiAgICAgICAgICAgICBjcmVhdGVMb2NhbCh0aW1lKS5pc1ZhbGlkKCkpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVEdXJhdGlvbih7dG86IHRoaXMsIGZyb206IHRpbWV9KS5sb2NhbGUodGhpcy5sb2NhbGUoKSkuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZnJvbU5vdyAod2l0aG91dFN1ZmZpeCkge1xuICAgIHJldHVybiB0aGlzLmZyb20oY3JlYXRlTG9jYWwoKSwgd2l0aG91dFN1ZmZpeCk7XG59XG5cbmZ1bmN0aW9uIHRvICh0aW1lLCB3aXRob3V0U3VmZml4KSB7XG4gICAgaWYgKHRoaXMuaXNWYWxpZCgpICYmXG4gICAgICAgICAgICAoKGlzTW9tZW50KHRpbWUpICYmIHRpbWUuaXNWYWxpZCgpKSB8fFxuICAgICAgICAgICAgIGNyZWF0ZUxvY2FsKHRpbWUpLmlzVmFsaWQoKSkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUR1cmF0aW9uKHtmcm9tOiB0aGlzLCB0bzogdGltZX0pLmxvY2FsZSh0aGlzLmxvY2FsZSgpKS5odW1hbml6ZSghd2l0aG91dFN1ZmZpeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0b05vdyAod2l0aG91dFN1ZmZpeCkge1xuICAgIHJldHVybiB0aGlzLnRvKGNyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xufVxuXG4vLyBJZiBwYXNzZWQgYSBsb2NhbGUga2V5LCBpdCB3aWxsIHNldCB0aGUgbG9jYWxlIGZvciB0aGlzXG4vLyBpbnN0YW5jZS4gIE90aGVyd2lzZSwgaXQgd2lsbCByZXR1cm4gdGhlIGxvY2FsZSBjb25maWd1cmF0aW9uXG4vLyB2YXJpYWJsZXMgZm9yIHRoaXMgaW5zdGFuY2UuXG5mdW5jdGlvbiBsb2NhbGUgKGtleSkge1xuICAgIHZhciBuZXdMb2NhbGVEYXRhO1xuXG4gICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGUuX2FiYnI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmV3TG9jYWxlRGF0YSA9IGdldExvY2FsZShrZXkpO1xuICAgICAgICBpZiAobmV3TG9jYWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2NhbGUgPSBuZXdMb2NhbGVEYXRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxudmFyIGxhbmcgPSBkZXByZWNhdGUoXG4gICAgJ21vbWVudCgpLmxhbmcoKSBpcyBkZXByZWNhdGVkLiBJbnN0ZWFkLCB1c2UgbW9tZW50KCkubG9jYWxlRGF0YSgpIHRvIGdldCB0aGUgbGFuZ3VhZ2UgY29uZmlndXJhdGlvbi4gVXNlIG1vbWVudCgpLmxvY2FsZSgpIHRvIGNoYW5nZSBsYW5ndWFnZXMuJyxcbiAgICBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG4pO1xuXG5mdW5jdGlvbiBsb2NhbGVEYXRhICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xufVxuXG5mdW5jdGlvbiBzdGFydE9mICh1bml0cykge1xuICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgIC8vIHRoZSBmb2xsb3dpbmcgc3dpdGNoIGludGVudGlvbmFsbHkgb21pdHMgYnJlYWsga2V5d29yZHNcbiAgICAvLyB0byB1dGlsaXplIGZhbGxpbmcgdGhyb3VnaCB0aGUgY2FzZXMuXG4gICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgICAgIHRoaXMubW9udGgoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICB0aGlzLmRhdGUoMSk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ3dlZWsnOlxuICAgICAgICBjYXNlICdpc29XZWVrJzpcbiAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgICAgICB0aGlzLmhvdXJzKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdob3VyJzpcbiAgICAgICAgICAgIHRoaXMubWludXRlcygwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnbWludXRlJzpcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kcygwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnc2Vjb25kJzpcbiAgICAgICAgICAgIHRoaXMubWlsbGlzZWNvbmRzKDApO1xuICAgIH1cblxuICAgIC8vIHdlZWtzIGFyZSBhIHNwZWNpYWwgY2FzZVxuICAgIGlmICh1bml0cyA9PT0gJ3dlZWsnKSB7XG4gICAgICAgIHRoaXMud2Vla2RheSgwKTtcbiAgICB9XG4gICAgaWYgKHVuaXRzID09PSAnaXNvV2VlaycpIHtcbiAgICAgICAgdGhpcy5pc29XZWVrZGF5KDEpO1xuICAgIH1cblxuICAgIC8vIHF1YXJ0ZXJzIGFyZSBhbHNvIHNwZWNpYWxcbiAgICBpZiAodW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICB0aGlzLm1vbnRoKE1hdGguZmxvb3IodGhpcy5tb250aCgpIC8gMykgKiAzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gZW5kT2YgKHVuaXRzKSB7XG4gICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgaWYgKHVuaXRzID09PSB1bmRlZmluZWQgfHwgdW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gJ2RhdGUnIGlzIGFuIGFsaWFzIGZvciAnZGF5Jywgc28gaXQgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXMgc3VjaC5cbiAgICBpZiAodW5pdHMgPT09ICdkYXRlJykge1xuICAgICAgICB1bml0cyA9ICdkYXknO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0YXJ0T2YodW5pdHMpLmFkZCgxLCAodW5pdHMgPT09ICdpc29XZWVrJyA/ICd3ZWVrJyA6IHVuaXRzKSkuc3VidHJhY3QoMSwgJ21zJyk7XG59XG5cbmZ1bmN0aW9uIHZhbHVlT2YgKCkge1xuICAgIHJldHVybiB0aGlzLl9kLnZhbHVlT2YoKSAtICgodGhpcy5fb2Zmc2V0IHx8IDApICogNjAwMDApO1xufVxuXG5mdW5jdGlvbiB1bml4ICgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLnZhbHVlT2YoKSAvIDEwMDApO1xufVxuXG5mdW5jdGlvbiB0b0RhdGUgKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLnZhbHVlT2YoKSk7XG59XG5cbmZ1bmN0aW9uIHRvQXJyYXkgKCkge1xuICAgIHZhciBtID0gdGhpcztcbiAgICByZXR1cm4gW20ueWVhcigpLCBtLm1vbnRoKCksIG0uZGF0ZSgpLCBtLmhvdXIoKSwgbS5taW51dGUoKSwgbS5zZWNvbmQoKSwgbS5taWxsaXNlY29uZCgpXTtcbn1cblxuZnVuY3Rpb24gdG9PYmplY3QgKCkge1xuICAgIHZhciBtID0gdGhpcztcbiAgICByZXR1cm4ge1xuICAgICAgICB5ZWFyczogbS55ZWFyKCksXG4gICAgICAgIG1vbnRoczogbS5tb250aCgpLFxuICAgICAgICBkYXRlOiBtLmRhdGUoKSxcbiAgICAgICAgaG91cnM6IG0uaG91cnMoKSxcbiAgICAgICAgbWludXRlczogbS5taW51dGVzKCksXG4gICAgICAgIHNlY29uZHM6IG0uc2Vjb25kcygpLFxuICAgICAgICBtaWxsaXNlY29uZHM6IG0ubWlsbGlzZWNvbmRzKClcbiAgICB9O1xufVxuXG5mdW5jdGlvbiB0b0pTT04gKCkge1xuICAgIC8vIG5ldyBEYXRlKE5hTikudG9KU09OKCkgPT09IG51bGxcbiAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzLnRvSVNPU3RyaW5nKCkgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkJDIgKCkge1xuICAgIHJldHVybiBpc1ZhbGlkKHRoaXMpO1xufVxuXG5mdW5jdGlvbiBwYXJzaW5nRmxhZ3MgKCkge1xuICAgIHJldHVybiBleHRlbmQoe30sIGdldFBhcnNpbmdGbGFncyh0aGlzKSk7XG59XG5cbmZ1bmN0aW9uIGludmFsaWRBdCAoKSB7XG4gICAgcmV0dXJuIGdldFBhcnNpbmdGbGFncyh0aGlzKS5vdmVyZmxvdztcbn1cblxuZnVuY3Rpb24gY3JlYXRpb25EYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGlucHV0OiB0aGlzLl9pLFxuICAgICAgICBmb3JtYXQ6IHRoaXMuX2YsXG4gICAgICAgIGxvY2FsZTogdGhpcy5fbG9jYWxlLFxuICAgICAgICBpc1VUQzogdGhpcy5faXNVVEMsXG4gICAgICAgIHN0cmljdDogdGhpcy5fc3RyaWN0XG4gICAgfTtcbn1cblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbigwLCBbJ2dnJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy53ZWVrWWVhcigpICUgMTAwO1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKDAsIFsnR0cnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlzb1dlZWtZZWFyKCkgJSAxMDA7XG59KTtcblxuZnVuY3Rpb24gYWRkV2Vla1llYXJGb3JtYXRUb2tlbiAodG9rZW4sIGdldHRlcikge1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFt0b2tlbiwgdG9rZW4ubGVuZ3RoXSwgMCwgZ2V0dGVyKTtcbn1cblxuYWRkV2Vla1llYXJGb3JtYXRUb2tlbignZ2dnZycsICAgICAnd2Vla1llYXInKTtcbmFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2dnJywgICAgJ3dlZWtZZWFyJyk7XG5hZGRXZWVrWWVhckZvcm1hdFRva2VuKCdHR0dHJywgICdpc29XZWVrWWVhcicpO1xuYWRkV2Vla1llYXJGb3JtYXRUb2tlbignR0dHR0cnLCAnaXNvV2Vla1llYXInKTtcblxuLy8gQUxJQVNFU1xuXG5hZGRVbml0QWxpYXMoJ3dlZWtZZWFyJywgJ2dnJyk7XG5hZGRVbml0QWxpYXMoJ2lzb1dlZWtZZWFyJywgJ0dHJyk7XG5cbi8vIFBSSU9SSVRZXG5cbmFkZFVuaXRQcmlvcml0eSgnd2Vla1llYXInLCAxKTtcbmFkZFVuaXRQcmlvcml0eSgnaXNvV2Vla1llYXInLCAxKTtcblxuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ0cnLCAgICAgIG1hdGNoU2lnbmVkKTtcbmFkZFJlZ2V4VG9rZW4oJ2cnLCAgICAgIG1hdGNoU2lnbmVkKTtcbmFkZFJlZ2V4VG9rZW4oJ0dHJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbmFkZFJlZ2V4VG9rZW4oJ2dnJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbmFkZFJlZ2V4VG9rZW4oJ0dHR0cnLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbmFkZFJlZ2V4VG9rZW4oJ2dnZ2cnLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbmFkZFJlZ2V4VG9rZW4oJ0dHR0dHJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbmFkZFJlZ2V4VG9rZW4oJ2dnZ2dnJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcblxuYWRkV2Vla1BhcnNlVG9rZW4oWydnZ2dnJywgJ2dnZ2dnJywgJ0dHR0cnLCAnR0dHR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMildID0gdG9JbnQoaW5wdXQpO1xufSk7XG5cbmFkZFdlZWtQYXJzZVRva2VuKFsnZ2cnLCAnR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgd2Vla1t0b2tlbl0gPSBob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG59KTtcblxuLy8gTU9NRU5UU1xuXG5mdW5jdGlvbiBnZXRTZXRXZWVrWWVhciAoaW5wdXQpIHtcbiAgICByZXR1cm4gZ2V0U2V0V2Vla1llYXJIZWxwZXIuY2FsbCh0aGlzLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICB0aGlzLndlZWsoKSxcbiAgICAgICAgICAgIHRoaXMud2Vla2RheSgpLFxuICAgICAgICAgICAgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93LFxuICAgICAgICAgICAgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG95KTtcbn1cblxuZnVuY3Rpb24gZ2V0U2V0SVNPV2Vla1llYXIgKGlucHV0KSB7XG4gICAgcmV0dXJuIGdldFNldFdlZWtZZWFySGVscGVyLmNhbGwodGhpcyxcbiAgICAgICAgICAgIGlucHV0LCB0aGlzLmlzb1dlZWsoKSwgdGhpcy5pc29XZWVrZGF5KCksIDEsIDQpO1xufVxuXG5mdW5jdGlvbiBnZXRJU09XZWVrc0luWWVhciAoKSB7XG4gICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCAxLCA0KTtcbn1cblxuZnVuY3Rpb24gZ2V0V2Vla3NJblllYXIgKCkge1xuICAgIHZhciB3ZWVrSW5mbyA9IHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrO1xuICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgd2Vla0luZm8uZG93LCB3ZWVrSW5mby5kb3kpO1xufVxuXG5mdW5jdGlvbiBnZXRTZXRXZWVrWWVhckhlbHBlcihpbnB1dCwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpIHtcbiAgICB2YXIgd2Vla3NUYXJnZXQ7XG4gICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdlZWtPZlllYXIodGhpcywgZG93LCBkb3kpLnllYXI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2Vla3NUYXJnZXQgPSB3ZWVrc0luWWVhcihpbnB1dCwgZG93LCBkb3kpO1xuICAgICAgICBpZiAod2VlayA+IHdlZWtzVGFyZ2V0KSB7XG4gICAgICAgICAgICB3ZWVrID0gd2Vla3NUYXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNldFdlZWtBbGwuY2FsbCh0aGlzLCBpbnB1dCwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2V0V2Vla0FsbCh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpIHtcbiAgICB2YXIgZGF5T2ZZZWFyRGF0YSA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpLFxuICAgICAgICBkYXRlID0gY3JlYXRlVVRDRGF0ZShkYXlPZlllYXJEYXRhLnllYXIsIDAsIGRheU9mWWVhckRhdGEuZGF5T2ZZZWFyKTtcblxuICAgIHRoaXMueWVhcihkYXRlLmdldFVUQ0Z1bGxZZWFyKCkpO1xuICAgIHRoaXMubW9udGgoZGF0ZS5nZXRVVENNb250aCgpKTtcbiAgICB0aGlzLmRhdGUoZGF0ZS5nZXRVVENEYXRlKCkpO1xuICAgIHJldHVybiB0aGlzO1xufVxuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKCdRJywgMCwgJ1FvJywgJ3F1YXJ0ZXInKTtcblxuLy8gQUxJQVNFU1xuXG5hZGRVbml0QWxpYXMoJ3F1YXJ0ZXInLCAnUScpO1xuXG4vLyBQUklPUklUWVxuXG5hZGRVbml0UHJpb3JpdHkoJ3F1YXJ0ZXInLCA3KTtcblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCdRJywgbWF0Y2gxKTtcbmFkZFBhcnNlVG9rZW4oJ1EnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgYXJyYXlbTU9OVEhdID0gKHRvSW50KGlucHV0KSAtIDEpICogMztcbn0pO1xuXG4vLyBNT01FTlRTXG5cbmZ1bmN0aW9uIGdldFNldFF1YXJ0ZXIgKGlucHV0KSB7XG4gICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyBNYXRoLmNlaWwoKHRoaXMubW9udGgoKSArIDEpIC8gMykgOiB0aGlzLm1vbnRoKChpbnB1dCAtIDEpICogMyArIHRoaXMubW9udGgoKSAlIDMpO1xufVxuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKCdEJywgWydERCcsIDJdLCAnRG8nLCAnZGF0ZScpO1xuXG4vLyBBTElBU0VTXG5cbmFkZFVuaXRBbGlhcygnZGF0ZScsICdEJyk7XG5cbi8vIFBSSU9ST0lUWVxuYWRkVW5pdFByaW9yaXR5KCdkYXRlJywgOSk7XG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbignRCcsICBtYXRjaDF0bzIpO1xuYWRkUmVnZXhUb2tlbignREQnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5hZGRSZWdleFRva2VuKCdEbycsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgLy8gVE9ETzogUmVtb3ZlIFwib3JkaW5hbFBhcnNlXCIgZmFsbGJhY2sgaW4gbmV4dCBtYWpvciByZWxlYXNlLlxuICAgIHJldHVybiBpc1N0cmljdCA/XG4gICAgICAobG9jYWxlLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlIHx8IGxvY2FsZS5fb3JkaW5hbFBhcnNlKSA6XG4gICAgICBsb2NhbGUuX2RheU9mTW9udGhPcmRpbmFsUGFyc2VMZW5pZW50O1xufSk7XG5cbmFkZFBhcnNlVG9rZW4oWydEJywgJ0REJ10sIERBVEUpO1xuYWRkUGFyc2VUb2tlbignRG8nLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgYXJyYXlbREFURV0gPSB0b0ludChpbnB1dC5tYXRjaChtYXRjaDF0bzIpWzBdKTtcbn0pO1xuXG4vLyBNT01FTlRTXG5cbnZhciBnZXRTZXREYXlPZk1vbnRoID0gbWFrZUdldFNldCgnRGF0ZScsIHRydWUpO1xuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKCdEREQnLCBbJ0REREQnLCAzXSwgJ0RERG8nLCAnZGF5T2ZZZWFyJyk7XG5cbi8vIEFMSUFTRVNcblxuYWRkVW5pdEFsaWFzKCdkYXlPZlllYXInLCAnREREJyk7XG5cbi8vIFBSSU9SSVRZXG5hZGRVbml0UHJpb3JpdHkoJ2RheU9mWWVhcicsIDQpO1xuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ0RERCcsICBtYXRjaDF0bzMpO1xuYWRkUmVnZXhUb2tlbignRERERCcsIG1hdGNoMyk7XG5hZGRQYXJzZVRva2VuKFsnREREJywgJ0REREQnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgY29uZmlnLl9kYXlPZlllYXIgPSB0b0ludChpbnB1dCk7XG59KTtcblxuLy8gSEVMUEVSU1xuXG4vLyBNT01FTlRTXG5cbmZ1bmN0aW9uIGdldFNldERheU9mWWVhciAoaW5wdXQpIHtcbiAgICB2YXIgZGF5T2ZZZWFyID0gTWF0aC5yb3VuZCgodGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpIC0gdGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ3llYXInKSkgLyA4NjRlNSkgKyAxO1xuICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gZGF5T2ZZZWFyIDogdGhpcy5hZGQoKGlucHV0IC0gZGF5T2ZZZWFyKSwgJ2QnKTtcbn1cblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbignbScsIFsnbW0nLCAyXSwgMCwgJ21pbnV0ZScpO1xuXG4vLyBBTElBU0VTXG5cbmFkZFVuaXRBbGlhcygnbWludXRlJywgJ20nKTtcblxuLy8gUFJJT1JJVFlcblxuYWRkVW5pdFByaW9yaXR5KCdtaW51dGUnLCAxNCk7XG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbignbScsICBtYXRjaDF0bzIpO1xuYWRkUmVnZXhUb2tlbignbW0nLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5hZGRQYXJzZVRva2VuKFsnbScsICdtbSddLCBNSU5VVEUpO1xuXG4vLyBNT01FTlRTXG5cbnZhciBnZXRTZXRNaW51dGUgPSBtYWtlR2V0U2V0KCdNaW51dGVzJywgZmFsc2UpO1xuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKCdzJywgWydzcycsIDJdLCAwLCAnc2Vjb25kJyk7XG5cbi8vIEFMSUFTRVNcblxuYWRkVW5pdEFsaWFzKCdzZWNvbmQnLCAncycpO1xuXG4vLyBQUklPUklUWVxuXG5hZGRVbml0UHJpb3JpdHkoJ3NlY29uZCcsIDE1KTtcblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCdzJywgIG1hdGNoMXRvMik7XG5hZGRSZWdleFRva2VuKCdzcycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbmFkZFBhcnNlVG9rZW4oWydzJywgJ3NzJ10sIFNFQ09ORCk7XG5cbi8vIE1PTUVOVFNcblxudmFyIGdldFNldFNlY29uZCA9IG1ha2VHZXRTZXQoJ1NlY29uZHMnLCBmYWxzZSk7XG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oJ1MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIH5+KHRoaXMubWlsbGlzZWNvbmQoKSAvIDEwMCk7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oMCwgWydTUycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIH5+KHRoaXMubWlsbGlzZWNvbmQoKSAvIDEwKTtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbigwLCBbJ1NTUycsIDNdLCAwLCAnbWlsbGlzZWNvbmQnKTtcbmFkZEZvcm1hdFRva2VuKDAsIFsnU1NTUycsIDRdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwO1xufSk7XG5hZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTJywgNV0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwO1xufSk7XG5hZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTUycsIDZdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDA7XG59KTtcbmFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTUycsIDddLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwO1xufSk7XG5hZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1NTJywgOF0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDAwO1xufSk7XG5hZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1NTUycsIDldLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwMDA7XG59KTtcblxuXG4vLyBBTElBU0VTXG5cbmFkZFVuaXRBbGlhcygnbWlsbGlzZWNvbmQnLCAnbXMnKTtcblxuLy8gUFJJT1JJVFlcblxuYWRkVW5pdFByaW9yaXR5KCdtaWxsaXNlY29uZCcsIDE2KTtcblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCdTJywgICAgbWF0Y2gxdG8zLCBtYXRjaDEpO1xuYWRkUmVnZXhUb2tlbignU1MnLCAgIG1hdGNoMXRvMywgbWF0Y2gyKTtcbmFkZFJlZ2V4VG9rZW4oJ1NTUycsICBtYXRjaDF0bzMsIG1hdGNoMyk7XG5cbnZhciB0b2tlbjtcbmZvciAodG9rZW4gPSAnU1NTUyc7IHRva2VuLmxlbmd0aCA8PSA5OyB0b2tlbiArPSAnUycpIHtcbiAgICBhZGRSZWdleFRva2VuKHRva2VuLCBtYXRjaFVuc2lnbmVkKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VNcyhpbnB1dCwgYXJyYXkpIHtcbiAgICBhcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xufVxuXG5mb3IgKHRva2VuID0gJ1MnOyB0b2tlbi5sZW5ndGggPD0gOTsgdG9rZW4gKz0gJ1MnKSB7XG4gICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgcGFyc2VNcyk7XG59XG4vLyBNT01FTlRTXG5cbnZhciBnZXRTZXRNaWxsaXNlY29uZCA9IG1ha2VHZXRTZXQoJ01pbGxpc2Vjb25kcycsIGZhbHNlKTtcblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbigneicsICAwLCAwLCAnem9uZUFiYnInKTtcbmFkZEZvcm1hdFRva2VuKCd6eicsIDAsIDAsICd6b25lTmFtZScpO1xuXG4vLyBNT01FTlRTXG5cbmZ1bmN0aW9uIGdldFpvbmVBYmJyICgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnVVRDJyA6ICcnO1xufVxuXG5mdW5jdGlvbiBnZXRab25lTmFtZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ0Nvb3JkaW5hdGVkIFVuaXZlcnNhbCBUaW1lJyA6ICcnO1xufVxuXG52YXIgcHJvdG8gPSBNb21lbnQucHJvdG90eXBlO1xuXG5wcm90by5hZGQgICAgICAgICAgICAgICA9IGFkZDtcbnByb3RvLmNhbGVuZGFyICAgICAgICAgID0gY2FsZW5kYXIkMTtcbnByb3RvLmNsb25lICAgICAgICAgICAgID0gY2xvbmU7XG5wcm90by5kaWZmICAgICAgICAgICAgICA9IGRpZmY7XG5wcm90by5lbmRPZiAgICAgICAgICAgICA9IGVuZE9mO1xucHJvdG8uZm9ybWF0ICAgICAgICAgICAgPSBmb3JtYXQ7XG5wcm90by5mcm9tICAgICAgICAgICAgICA9IGZyb207XG5wcm90by5mcm9tTm93ICAgICAgICAgICA9IGZyb21Ob3c7XG5wcm90by50byAgICAgICAgICAgICAgICA9IHRvO1xucHJvdG8udG9Ob3cgICAgICAgICAgICAgPSB0b05vdztcbnByb3RvLmdldCAgICAgICAgICAgICAgID0gc3RyaW5nR2V0O1xucHJvdG8uaW52YWxpZEF0ICAgICAgICAgPSBpbnZhbGlkQXQ7XG5wcm90by5pc0FmdGVyICAgICAgICAgICA9IGlzQWZ0ZXI7XG5wcm90by5pc0JlZm9yZSAgICAgICAgICA9IGlzQmVmb3JlO1xucHJvdG8uaXNCZXR3ZWVuICAgICAgICAgPSBpc0JldHdlZW47XG5wcm90by5pc1NhbWUgICAgICAgICAgICA9IGlzU2FtZTtcbnByb3RvLmlzU2FtZU9yQWZ0ZXIgICAgID0gaXNTYW1lT3JBZnRlcjtcbnByb3RvLmlzU2FtZU9yQmVmb3JlICAgID0gaXNTYW1lT3JCZWZvcmU7XG5wcm90by5pc1ZhbGlkICAgICAgICAgICA9IGlzVmFsaWQkMjtcbnByb3RvLmxhbmcgICAgICAgICAgICAgID0gbGFuZztcbnByb3RvLmxvY2FsZSAgICAgICAgICAgID0gbG9jYWxlO1xucHJvdG8ubG9jYWxlRGF0YSAgICAgICAgPSBsb2NhbGVEYXRhO1xucHJvdG8ubWF4ICAgICAgICAgICAgICAgPSBwcm90b3R5cGVNYXg7XG5wcm90by5taW4gICAgICAgICAgICAgICA9IHByb3RvdHlwZU1pbjtcbnByb3RvLnBhcnNpbmdGbGFncyAgICAgID0gcGFyc2luZ0ZsYWdzO1xucHJvdG8uc2V0ICAgICAgICAgICAgICAgPSBzdHJpbmdTZXQ7XG5wcm90by5zdGFydE9mICAgICAgICAgICA9IHN0YXJ0T2Y7XG5wcm90by5zdWJ0cmFjdCAgICAgICAgICA9IHN1YnRyYWN0O1xucHJvdG8udG9BcnJheSAgICAgICAgICAgPSB0b0FycmF5O1xucHJvdG8udG9PYmplY3QgICAgICAgICAgPSB0b09iamVjdDtcbnByb3RvLnRvRGF0ZSAgICAgICAgICAgID0gdG9EYXRlO1xucHJvdG8udG9JU09TdHJpbmcgICAgICAgPSB0b0lTT1N0cmluZztcbnByb3RvLmluc3BlY3QgICAgICAgICAgID0gaW5zcGVjdDtcbnByb3RvLnRvSlNPTiAgICAgICAgICAgID0gdG9KU09OO1xucHJvdG8udG9TdHJpbmcgICAgICAgICAgPSB0b1N0cmluZztcbnByb3RvLnVuaXggICAgICAgICAgICAgID0gdW5peDtcbnByb3RvLnZhbHVlT2YgICAgICAgICAgID0gdmFsdWVPZjtcbnByb3RvLmNyZWF0aW9uRGF0YSAgICAgID0gY3JlYXRpb25EYXRhO1xucHJvdG8ueWVhciAgICAgICA9IGdldFNldFllYXI7XG5wcm90by5pc0xlYXBZZWFyID0gZ2V0SXNMZWFwWWVhcjtcbnByb3RvLndlZWtZZWFyICAgID0gZ2V0U2V0V2Vla1llYXI7XG5wcm90by5pc29XZWVrWWVhciA9IGdldFNldElTT1dlZWtZZWFyO1xucHJvdG8ucXVhcnRlciA9IHByb3RvLnF1YXJ0ZXJzID0gZ2V0U2V0UXVhcnRlcjtcbnByb3RvLm1vbnRoICAgICAgID0gZ2V0U2V0TW9udGg7XG5wcm90by5kYXlzSW5Nb250aCA9IGdldERheXNJbk1vbnRoO1xucHJvdG8ud2VlayAgICAgICAgICAgPSBwcm90by53ZWVrcyAgICAgICAgPSBnZXRTZXRXZWVrO1xucHJvdG8uaXNvV2VlayAgICAgICAgPSBwcm90by5pc29XZWVrcyAgICAgPSBnZXRTZXRJU09XZWVrO1xucHJvdG8ud2Vla3NJblllYXIgICAgPSBnZXRXZWVrc0luWWVhcjtcbnByb3RvLmlzb1dlZWtzSW5ZZWFyID0gZ2V0SVNPV2Vla3NJblllYXI7XG5wcm90by5kYXRlICAgICAgID0gZ2V0U2V0RGF5T2ZNb250aDtcbnByb3RvLmRheSAgICAgICAgPSBwcm90by5kYXlzICAgICAgICAgICAgID0gZ2V0U2V0RGF5T2ZXZWVrO1xucHJvdG8ud2Vla2RheSAgICA9IGdldFNldExvY2FsZURheU9mV2VlaztcbnByb3RvLmlzb1dlZWtkYXkgPSBnZXRTZXRJU09EYXlPZldlZWs7XG5wcm90by5kYXlPZlllYXIgID0gZ2V0U2V0RGF5T2ZZZWFyO1xucHJvdG8uaG91ciA9IHByb3RvLmhvdXJzID0gZ2V0U2V0SG91cjtcbnByb3RvLm1pbnV0ZSA9IHByb3RvLm1pbnV0ZXMgPSBnZXRTZXRNaW51dGU7XG5wcm90by5zZWNvbmQgPSBwcm90by5zZWNvbmRzID0gZ2V0U2V0U2Vjb25kO1xucHJvdG8ubWlsbGlzZWNvbmQgPSBwcm90by5taWxsaXNlY29uZHMgPSBnZXRTZXRNaWxsaXNlY29uZDtcbnByb3RvLnV0Y09mZnNldCAgICAgICAgICAgID0gZ2V0U2V0T2Zmc2V0O1xucHJvdG8udXRjICAgICAgICAgICAgICAgICAgPSBzZXRPZmZzZXRUb1VUQztcbnByb3RvLmxvY2FsICAgICAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9Mb2NhbDtcbnByb3RvLnBhcnNlWm9uZSAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQ7XG5wcm90by5oYXNBbGlnbmVkSG91ck9mZnNldCA9IGhhc0FsaWduZWRIb3VyT2Zmc2V0O1xucHJvdG8uaXNEU1QgICAgICAgICAgICAgICAgPSBpc0RheWxpZ2h0U2F2aW5nVGltZTtcbnByb3RvLmlzTG9jYWwgICAgICAgICAgICAgID0gaXNMb2NhbDtcbnByb3RvLmlzVXRjT2Zmc2V0ICAgICAgICAgID0gaXNVdGNPZmZzZXQ7XG5wcm90by5pc1V0YyAgICAgICAgICAgICAgICA9IGlzVXRjO1xucHJvdG8uaXNVVEMgICAgICAgICAgICAgICAgPSBpc1V0YztcbnByb3RvLnpvbmVBYmJyID0gZ2V0Wm9uZUFiYnI7XG5wcm90by56b25lTmFtZSA9IGdldFpvbmVOYW1lO1xucHJvdG8uZGF0ZXMgID0gZGVwcmVjYXRlKCdkYXRlcyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgZGF0ZSBpbnN0ZWFkLicsIGdldFNldERheU9mTW9udGgpO1xucHJvdG8ubW9udGhzID0gZGVwcmVjYXRlKCdtb250aHMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbnRoIGluc3RlYWQnLCBnZXRTZXRNb250aCk7XG5wcm90by55ZWFycyAgPSBkZXByZWNhdGUoJ3llYXJzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSB5ZWFyIGluc3RlYWQnLCBnZXRTZXRZZWFyKTtcbnByb3RvLnpvbmUgICA9IGRlcHJlY2F0ZSgnbW9tZW50KCkuem9uZSBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50KCkudXRjT2Zmc2V0IGluc3RlYWQuIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3Mvem9uZS8nLCBnZXRTZXRab25lKTtcbnByb3RvLmlzRFNUU2hpZnRlZCA9IGRlcHJlY2F0ZSgnaXNEU1RTaGlmdGVkIGlzIGRlcHJlY2F0ZWQuIFNlZSBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL2RzdC1zaGlmdGVkLyBmb3IgbW9yZSBpbmZvcm1hdGlvbicsIGlzRGF5bGlnaHRTYXZpbmdUaW1lU2hpZnRlZCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVVuaXggKGlucHV0KSB7XG4gICAgcmV0dXJuIGNyZWF0ZUxvY2FsKGlucHV0ICogMTAwMCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUluWm9uZSAoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cykucGFyc2Vab25lKCk7XG59XG5cbmZ1bmN0aW9uIHByZVBhcnNlUG9zdEZvcm1hdCAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZztcbn1cblxudmFyIHByb3RvJDEgPSBMb2NhbGUucHJvdG90eXBlO1xuXG5wcm90byQxLmNhbGVuZGFyICAgICAgICA9IGNhbGVuZGFyO1xucHJvdG8kMS5sb25nRGF0ZUZvcm1hdCAgPSBsb25nRGF0ZUZvcm1hdDtcbnByb3RvJDEuaW52YWxpZERhdGUgICAgID0gaW52YWxpZERhdGU7XG5wcm90byQxLm9yZGluYWwgICAgICAgICA9IG9yZGluYWw7XG5wcm90byQxLnByZXBhcnNlICAgICAgICA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbnByb3RvJDEucG9zdGZvcm1hdCAgICAgID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xucHJvdG8kMS5yZWxhdGl2ZVRpbWUgICAgPSByZWxhdGl2ZVRpbWU7XG5wcm90byQxLnBhc3RGdXR1cmUgICAgICA9IHBhc3RGdXR1cmU7XG5wcm90byQxLnNldCAgICAgICAgICAgICA9IHNldDtcblxucHJvdG8kMS5tb250aHMgICAgICAgICAgICA9ICAgICAgICBsb2NhbGVNb250aHM7XG5wcm90byQxLm1vbnRoc1Nob3J0ICAgICAgID0gICAgICAgIGxvY2FsZU1vbnRoc1Nob3J0O1xucHJvdG8kMS5tb250aHNQYXJzZSAgICAgICA9ICAgICAgICBsb2NhbGVNb250aHNQYXJzZTtcbnByb3RvJDEubW9udGhzUmVnZXggICAgICAgPSBtb250aHNSZWdleDtcbnByb3RvJDEubW9udGhzU2hvcnRSZWdleCAgPSBtb250aHNTaG9ydFJlZ2V4O1xucHJvdG8kMS53ZWVrID0gbG9jYWxlV2VlaztcbnByb3RvJDEuZmlyc3REYXlPZlllYXIgPSBsb2NhbGVGaXJzdERheU9mWWVhcjtcbnByb3RvJDEuZmlyc3REYXlPZldlZWsgPSBsb2NhbGVGaXJzdERheU9mV2VlaztcblxucHJvdG8kMS53ZWVrZGF5cyAgICAgICA9ICAgICAgICBsb2NhbGVXZWVrZGF5cztcbnByb3RvJDEud2Vla2RheXNNaW4gICAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNNaW47XG5wcm90byQxLndlZWtkYXlzU2hvcnQgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzU2hvcnQ7XG5wcm90byQxLndlZWtkYXlzUGFyc2UgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzUGFyc2U7XG5cbnByb3RvJDEud2Vla2RheXNSZWdleCAgICAgICA9ICAgICAgICB3ZWVrZGF5c1JlZ2V4O1xucHJvdG8kMS53ZWVrZGF5c1Nob3J0UmVnZXggID0gICAgICAgIHdlZWtkYXlzU2hvcnRSZWdleDtcbnByb3RvJDEud2Vla2RheXNNaW5SZWdleCAgICA9ICAgICAgICB3ZWVrZGF5c01pblJlZ2V4O1xuXG5wcm90byQxLmlzUE0gPSBsb2NhbGVJc1BNO1xucHJvdG8kMS5tZXJpZGllbSA9IGxvY2FsZU1lcmlkaWVtO1xuXG5mdW5jdGlvbiBnZXQkMSAoZm9ybWF0LCBpbmRleCwgZmllbGQsIHNldHRlcikge1xuICAgIHZhciBsb2NhbGUgPSBnZXRMb2NhbGUoKTtcbiAgICB2YXIgdXRjID0gY3JlYXRlVVRDKCkuc2V0KHNldHRlciwgaW5kZXgpO1xuICAgIHJldHVybiBsb2NhbGVbZmllbGRdKHV0YywgZm9ybWF0KTtcbn1cblxuZnVuY3Rpb24gbGlzdE1vbnRoc0ltcGwgKGZvcm1hdCwgaW5kZXgsIGZpZWxkKSB7XG4gICAgaWYgKGlzTnVtYmVyKGZvcm1hdCkpIHtcbiAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJyc7XG5cbiAgICBpZiAoaW5kZXggIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZ2V0JDEoZm9ybWF0LCBpbmRleCwgZmllbGQsICdtb250aCcpO1xuICAgIH1cblxuICAgIHZhciBpO1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICBvdXRbaV0gPSBnZXQkMShmb3JtYXQsIGksIGZpZWxkLCAnbW9udGgnKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cblxuLy8gKClcbi8vICg1KVxuLy8gKGZtdCwgNSlcbi8vIChmbXQpXG4vLyAodHJ1ZSlcbi8vICh0cnVlLCA1KVxuLy8gKHRydWUsIGZtdCwgNSlcbi8vICh0cnVlLCBmbXQpXG5mdW5jdGlvbiBsaXN0V2Vla2RheXNJbXBsIChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgsIGZpZWxkKSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbGVTb3J0ZWQgPT09ICdib29sZWFuJykge1xuICAgICAgICBpZiAoaXNOdW1iZXIoZm9ybWF0KSkge1xuICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybWF0ID0gbG9jYWxlU29ydGVkO1xuICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgbG9jYWxlU29ydGVkID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGlzTnVtYmVyKGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuICAgIH1cblxuICAgIHZhciBsb2NhbGUgPSBnZXRMb2NhbGUoKSxcbiAgICAgICAgc2hpZnQgPSBsb2NhbGVTb3J0ZWQgPyBsb2NhbGUuX3dlZWsuZG93IDogMDtcblxuICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBnZXQkMShmb3JtYXQsIChpbmRleCArIHNoaWZ0KSAlIDcsIGZpZWxkLCAnZGF5Jyk7XG4gICAgfVxuXG4gICAgdmFyIGk7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgb3V0W2ldID0gZ2V0JDEoZm9ybWF0LCAoaSArIHNoaWZ0KSAlIDcsIGZpZWxkLCAnZGF5Jyk7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RNb250aHMgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICByZXR1cm4gbGlzdE1vbnRoc0ltcGwoZm9ybWF0LCBpbmRleCwgJ21vbnRocycpO1xufVxuXG5mdW5jdGlvbiBsaXN0TW9udGhzU2hvcnQgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICByZXR1cm4gbGlzdE1vbnRoc0ltcGwoZm9ybWF0LCBpbmRleCwgJ21vbnRoc1Nob3J0Jyk7XG59XG5cbmZ1bmN0aW9uIGxpc3RXZWVrZGF5cyAobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4KSB7XG4gICAgcmV0dXJuIGxpc3RXZWVrZGF5c0ltcGwobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCAnd2Vla2RheXMnKTtcbn1cblxuZnVuY3Rpb24gbGlzdFdlZWtkYXlzU2hvcnQgKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCkge1xuICAgIHJldHVybiBsaXN0V2Vla2RheXNJbXBsKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzU2hvcnQnKTtcbn1cblxuZnVuY3Rpb24gbGlzdFdlZWtkYXlzTWluIChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgpIHtcbiAgICByZXR1cm4gbGlzdFdlZWtkYXlzSW1wbChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5c01pbicpO1xufVxuXG5nZXRTZXRHbG9iYWxMb2NhbGUoJ2VuJywge1xuICAgIGRheU9mTW9udGhPcmRpbmFsUGFyc2U6IC9cXGR7MSwyfSh0aHxzdHxuZHxyZCkvLFxuICAgIG9yZGluYWwgOiBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgIHZhciBiID0gbnVtYmVyICUgMTAsXG4gICAgICAgICAgICBvdXRwdXQgPSAodG9JbnQobnVtYmVyICUgMTAwIC8gMTApID09PSAxKSA/ICd0aCcgOlxuICAgICAgICAgICAgKGIgPT09IDEpID8gJ3N0JyA6XG4gICAgICAgICAgICAoYiA9PT0gMikgPyAnbmQnIDpcbiAgICAgICAgICAgIChiID09PSAzKSA/ICdyZCcgOiAndGgnO1xuICAgICAgICByZXR1cm4gbnVtYmVyICsgb3V0cHV0O1xuICAgIH1cbn0pO1xuXG4vLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cbmhvb2tzLmxhbmcgPSBkZXByZWNhdGUoJ21vbWVudC5sYW5nIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlIGluc3RlYWQuJywgZ2V0U2V0R2xvYmFsTG9jYWxlKTtcbmhvb2tzLmxhbmdEYXRhID0gZGVwcmVjYXRlKCdtb21lbnQubGFuZ0RhdGEgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGVEYXRhIGluc3RlYWQuJywgZ2V0TG9jYWxlKTtcblxudmFyIG1hdGhBYnMgPSBNYXRoLmFicztcblxuZnVuY3Rpb24gYWJzICgpIHtcbiAgICB2YXIgZGF0YSAgICAgICAgICAgPSB0aGlzLl9kYXRhO1xuXG4gICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gbWF0aEFicyh0aGlzLl9taWxsaXNlY29uZHMpO1xuICAgIHRoaXMuX2RheXMgICAgICAgICA9IG1hdGhBYnModGhpcy5fZGF5cyk7XG4gICAgdGhpcy5fbW9udGhzICAgICAgID0gbWF0aEFicyh0aGlzLl9tb250aHMpO1xuXG4gICAgZGF0YS5taWxsaXNlY29uZHMgID0gbWF0aEFicyhkYXRhLm1pbGxpc2Vjb25kcyk7XG4gICAgZGF0YS5zZWNvbmRzICAgICAgID0gbWF0aEFicyhkYXRhLnNlY29uZHMpO1xuICAgIGRhdGEubWludXRlcyAgICAgICA9IG1hdGhBYnMoZGF0YS5taW51dGVzKTtcbiAgICBkYXRhLmhvdXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEuaG91cnMpO1xuICAgIGRhdGEubW9udGhzICAgICAgICA9IG1hdGhBYnMoZGF0YS5tb250aHMpO1xuICAgIGRhdGEueWVhcnMgICAgICAgICA9IG1hdGhBYnMoZGF0YS55ZWFycyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gYWRkU3VidHJhY3QkMSAoZHVyYXRpb24sIGlucHV0LCB2YWx1ZSwgZGlyZWN0aW9uKSB7XG4gICAgdmFyIG90aGVyID0gY3JlYXRlRHVyYXRpb24oaW5wdXQsIHZhbHVlKTtcblxuICAgIGR1cmF0aW9uLl9taWxsaXNlY29uZHMgKz0gZGlyZWN0aW9uICogb3RoZXIuX21pbGxpc2Vjb25kcztcbiAgICBkdXJhdGlvbi5fZGF5cyAgICAgICAgICs9IGRpcmVjdGlvbiAqIG90aGVyLl9kYXlzO1xuICAgIGR1cmF0aW9uLl9tb250aHMgICAgICAgKz0gZGlyZWN0aW9uICogb3RoZXIuX21vbnRocztcblxuICAgIHJldHVybiBkdXJhdGlvbi5fYnViYmxlKCk7XG59XG5cbi8vIHN1cHBvcnRzIG9ubHkgMi4wLXN0eWxlIGFkZCgxLCAncycpIG9yIGFkZChkdXJhdGlvbilcbmZ1bmN0aW9uIGFkZCQxIChpbnB1dCwgdmFsdWUpIHtcbiAgICByZXR1cm4gYWRkU3VidHJhY3QkMSh0aGlzLCBpbnB1dCwgdmFsdWUsIDEpO1xufVxuXG4vLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBzdWJ0cmFjdCgxLCAncycpIG9yIHN1YnRyYWN0KGR1cmF0aW9uKVxuZnVuY3Rpb24gc3VidHJhY3QkMSAoaW5wdXQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGFkZFN1YnRyYWN0JDEodGhpcywgaW5wdXQsIHZhbHVlLCAtMSk7XG59XG5cbmZ1bmN0aW9uIGFic0NlaWwgKG51bWJlcikge1xuICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYnViYmxlICgpIHtcbiAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuICAgIHZhciBkYXlzICAgICAgICAgPSB0aGlzLl9kYXlzO1xuICAgIHZhciBtb250aHMgICAgICAgPSB0aGlzLl9tb250aHM7XG4gICAgdmFyIGRhdGEgICAgICAgICA9IHRoaXMuX2RhdGE7XG4gICAgdmFyIHNlY29uZHMsIG1pbnV0ZXMsIGhvdXJzLCB5ZWFycywgbW9udGhzRnJvbURheXM7XG5cbiAgICAvLyBpZiB3ZSBoYXZlIGEgbWl4IG9mIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSB2YWx1ZXMsIGJ1YmJsZSBkb3duIGZpcnN0XG4gICAgLy8gY2hlY2s6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8yMTY2XG4gICAgaWYgKCEoKG1pbGxpc2Vjb25kcyA+PSAwICYmIGRheXMgPj0gMCAmJiBtb250aHMgPj0gMCkgfHxcbiAgICAgICAgICAgIChtaWxsaXNlY29uZHMgPD0gMCAmJiBkYXlzIDw9IDAgJiYgbW9udGhzIDw9IDApKSkge1xuICAgICAgICBtaWxsaXNlY29uZHMgKz0gYWJzQ2VpbChtb250aHNUb0RheXMobW9udGhzKSArIGRheXMpICogODY0ZTU7XG4gICAgICAgIGRheXMgPSAwO1xuICAgICAgICBtb250aHMgPSAwO1xuICAgIH1cblxuICAgIC8vIFRoZSBmb2xsb3dpbmcgY29kZSBidWJibGVzIHVwIHZhbHVlcywgc2VlIHRoZSB0ZXN0cyBmb3JcbiAgICAvLyBleGFtcGxlcyBvZiB3aGF0IHRoYXQgbWVhbnMuXG4gICAgZGF0YS5taWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZHMgJSAxMDAwO1xuXG4gICAgc2Vjb25kcyAgICAgICAgICAgPSBhYnNGbG9vcihtaWxsaXNlY29uZHMgLyAxMDAwKTtcbiAgICBkYXRhLnNlY29uZHMgICAgICA9IHNlY29uZHMgJSA2MDtcblxuICAgIG1pbnV0ZXMgICAgICAgICAgID0gYWJzRmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBkYXRhLm1pbnV0ZXMgICAgICA9IG1pbnV0ZXMgJSA2MDtcblxuICAgIGhvdXJzICAgICAgICAgICAgID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICBkYXRhLmhvdXJzICAgICAgICA9IGhvdXJzICUgMjQ7XG5cbiAgICBkYXlzICs9IGFic0Zsb29yKGhvdXJzIC8gMjQpO1xuXG4gICAgLy8gY29udmVydCBkYXlzIHRvIG1vbnRoc1xuICAgIG1vbnRoc0Zyb21EYXlzID0gYWJzRmxvb3IoZGF5c1RvTW9udGhzKGRheXMpKTtcbiAgICBtb250aHMgKz0gbW9udGhzRnJvbURheXM7XG4gICAgZGF5cyAtPSBhYnNDZWlsKG1vbnRoc1RvRGF5cyhtb250aHNGcm9tRGF5cykpO1xuXG4gICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgIHllYXJzID0gYWJzRmxvb3IobW9udGhzIC8gMTIpO1xuICAgIG1vbnRocyAlPSAxMjtcblxuICAgIGRhdGEuZGF5cyAgID0gZGF5cztcbiAgICBkYXRhLm1vbnRocyA9IG1vbnRocztcbiAgICBkYXRhLnllYXJzICA9IHllYXJzO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIGRheXNUb01vbnRocyAoZGF5cykge1xuICAgIC8vIDQwMCB5ZWFycyBoYXZlIDE0NjA5NyBkYXlzICh0YWtpbmcgaW50byBhY2NvdW50IGxlYXAgeWVhciBydWxlcylcbiAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxMiBtb250aHMgPT09IDQ4MDBcbiAgICByZXR1cm4gZGF5cyAqIDQ4MDAgLyAxNDYwOTc7XG59XG5cbmZ1bmN0aW9uIG1vbnRoc1RvRGF5cyAobW9udGhzKSB7XG4gICAgLy8gdGhlIHJldmVyc2Ugb2YgZGF5c1RvTW9udGhzXG4gICAgcmV0dXJuIG1vbnRocyAqIDE0NjA5NyAvIDQ4MDA7XG59XG5cbmZ1bmN0aW9uIGFzICh1bml0cykge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIE5hTjtcbiAgICB9XG4gICAgdmFyIGRheXM7XG4gICAgdmFyIG1vbnRocztcbiAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuXG4gICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICBpZiAodW5pdHMgPT09ICdtb250aCcgfHwgdW5pdHMgPT09ICd5ZWFyJykge1xuICAgICAgICBkYXlzICAgPSB0aGlzLl9kYXlzICAgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgbW9udGhzID0gdGhpcy5fbW9udGhzICsgZGF5c1RvTW9udGhzKGRheXMpO1xuICAgICAgICByZXR1cm4gdW5pdHMgPT09ICdtb250aCcgPyBtb250aHMgOiBtb250aHMgLyAxMjtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBoYW5kbGUgbWlsbGlzZWNvbmRzIHNlcGFyYXRlbHkgYmVjYXVzZSBvZiBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyAoaXNzdWUgIzE4NjcpXG4gICAgICAgIGRheXMgPSB0aGlzLl9kYXlzICsgTWF0aC5yb3VuZChtb250aHNUb0RheXModGhpcy5fbW9udGhzKSk7XG4gICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgIGNhc2UgJ3dlZWsnICAgOiByZXR1cm4gZGF5cyAvIDcgICAgICsgbWlsbGlzZWNvbmRzIC8gNjA0OGU1O1xuICAgICAgICAgICAgY2FzZSAnZGF5JyAgICA6IHJldHVybiBkYXlzICAgICAgICAgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgIGNhc2UgJ2hvdXInICAgOiByZXR1cm4gZGF5cyAqIDI0ICAgICsgbWlsbGlzZWNvbmRzIC8gMzZlNTtcbiAgICAgICAgICAgIGNhc2UgJ21pbnV0ZScgOiByZXR1cm4gZGF5cyAqIDE0NDAgICsgbWlsbGlzZWNvbmRzIC8gNmU0O1xuICAgICAgICAgICAgY2FzZSAnc2Vjb25kJyA6IHJldHVybiBkYXlzICogODY0MDAgKyBtaWxsaXNlY29uZHMgLyAxMDAwO1xuICAgICAgICAgICAgLy8gTWF0aC5mbG9vciBwcmV2ZW50cyBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyBoZXJlXG4gICAgICAgICAgICBjYXNlICdtaWxsaXNlY29uZCc6IHJldHVybiBNYXRoLmZsb29yKGRheXMgKiA4NjRlNSkgKyBtaWxsaXNlY29uZHM7XG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdW5pdCAnICsgdW5pdHMpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBUT0RPOiBVc2UgdGhpcy5hcygnbXMnKT9cbmZ1bmN0aW9uIHZhbHVlT2YkMSAoKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gTmFOO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgK1xuICAgICAgICB0aGlzLl9kYXlzICogODY0ZTUgK1xuICAgICAgICAodGhpcy5fbW9udGhzICUgMTIpICogMjU5MmU2ICtcbiAgICAgICAgdG9JbnQodGhpcy5fbW9udGhzIC8gMTIpICogMzE1MzZlNlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIG1ha2VBcyAoYWxpYXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcyhhbGlhcyk7XG4gICAgfTtcbn1cblxudmFyIGFzTWlsbGlzZWNvbmRzID0gbWFrZUFzKCdtcycpO1xudmFyIGFzU2Vjb25kcyAgICAgID0gbWFrZUFzKCdzJyk7XG52YXIgYXNNaW51dGVzICAgICAgPSBtYWtlQXMoJ20nKTtcbnZhciBhc0hvdXJzICAgICAgICA9IG1ha2VBcygnaCcpO1xudmFyIGFzRGF5cyAgICAgICAgID0gbWFrZUFzKCdkJyk7XG52YXIgYXNXZWVrcyAgICAgICAgPSBtYWtlQXMoJ3cnKTtcbnZhciBhc01vbnRocyAgICAgICA9IG1ha2VBcygnTScpO1xudmFyIGFzWWVhcnMgICAgICAgID0gbWFrZUFzKCd5Jyk7XG5cbmZ1bmN0aW9uIGNsb25lJDEgKCkge1xuICAgIHJldHVybiBjcmVhdGVEdXJhdGlvbih0aGlzKTtcbn1cblxuZnVuY3Rpb24gZ2V0JDIgKHVuaXRzKSB7XG4gICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpc1t1bml0cyArICdzJ10oKSA6IE5hTjtcbn1cblxuZnVuY3Rpb24gbWFrZUdldHRlcihuYW1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy5fZGF0YVtuYW1lXSA6IE5hTjtcbiAgICB9O1xufVxuXG52YXIgbWlsbGlzZWNvbmRzID0gbWFrZUdldHRlcignbWlsbGlzZWNvbmRzJyk7XG52YXIgc2Vjb25kcyAgICAgID0gbWFrZUdldHRlcignc2Vjb25kcycpO1xudmFyIG1pbnV0ZXMgICAgICA9IG1ha2VHZXR0ZXIoJ21pbnV0ZXMnKTtcbnZhciBob3VycyAgICAgICAgPSBtYWtlR2V0dGVyKCdob3VycycpO1xudmFyIGRheXMgICAgICAgICA9IG1ha2VHZXR0ZXIoJ2RheXMnKTtcbnZhciBtb250aHMgICAgICAgPSBtYWtlR2V0dGVyKCdtb250aHMnKTtcbnZhciB5ZWFycyAgICAgICAgPSBtYWtlR2V0dGVyKCd5ZWFycycpO1xuXG5mdW5jdGlvbiB3ZWVrcyAoKSB7XG4gICAgcmV0dXJuIGFic0Zsb29yKHRoaXMuZGF5cygpIC8gNyk7XG59XG5cbnZhciByb3VuZCA9IE1hdGgucm91bmQ7XG52YXIgdGhyZXNob2xkcyA9IHtcbiAgICBzczogNDQsICAgICAgICAgLy8gYSBmZXcgc2Vjb25kcyB0byBzZWNvbmRzXG4gICAgcyA6IDQ1LCAgICAgICAgIC8vIHNlY29uZHMgdG8gbWludXRlXG4gICAgbSA6IDQ1LCAgICAgICAgIC8vIG1pbnV0ZXMgdG8gaG91clxuICAgIGggOiAyMiwgICAgICAgICAvLyBob3VycyB0byBkYXlcbiAgICBkIDogMjYsICAgICAgICAgLy8gZGF5cyB0byBtb250aFxuICAgIE0gOiAxMSAgICAgICAgICAvLyBtb250aHMgdG8geWVhclxufTtcblxuLy8gaGVscGVyIGZ1bmN0aW9uIGZvciBtb21lbnQuZm4uZnJvbSwgbW9tZW50LmZuLmZyb21Ob3csIGFuZCBtb21lbnQuZHVyYXRpb24uZm4uaHVtYW5pemVcbmZ1bmN0aW9uIHN1YnN0aXR1dGVUaW1lQWdvKHN0cmluZywgbnVtYmVyLCB3aXRob3V0U3VmZml4LCBpc0Z1dHVyZSwgbG9jYWxlKSB7XG4gICAgcmV0dXJuIGxvY2FsZS5yZWxhdGl2ZVRpbWUobnVtYmVyIHx8IDEsICEhd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSk7XG59XG5cbmZ1bmN0aW9uIHJlbGF0aXZlVGltZSQxIChwb3NOZWdEdXJhdGlvbiwgd2l0aG91dFN1ZmZpeCwgbG9jYWxlKSB7XG4gICAgdmFyIGR1cmF0aW9uID0gY3JlYXRlRHVyYXRpb24ocG9zTmVnRHVyYXRpb24pLmFicygpO1xuICAgIHZhciBzZWNvbmRzICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdzJykpO1xuICAgIHZhciBtaW51dGVzICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdtJykpO1xuICAgIHZhciBob3VycyAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdoJykpO1xuICAgIHZhciBkYXlzICAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdkJykpO1xuICAgIHZhciBtb250aHMgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdNJykpO1xuICAgIHZhciB5ZWFycyAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCd5JykpO1xuXG4gICAgdmFyIGEgPSBzZWNvbmRzIDw9IHRocmVzaG9sZHMuc3MgJiYgWydzJywgc2Vjb25kc10gIHx8XG4gICAgICAgICAgICBzZWNvbmRzIDwgdGhyZXNob2xkcy5zICAgJiYgWydzcycsIHNlY29uZHNdIHx8XG4gICAgICAgICAgICBtaW51dGVzIDw9IDEgICAgICAgICAgICAgJiYgWydtJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICBtaW51dGVzIDwgdGhyZXNob2xkcy5tICAgJiYgWydtbScsIG1pbnV0ZXNdIHx8XG4gICAgICAgICAgICBob3VycyAgIDw9IDEgICAgICAgICAgICAgJiYgWydoJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICBob3VycyAgIDwgdGhyZXNob2xkcy5oICAgJiYgWydoaCcsIGhvdXJzXSAgIHx8XG4gICAgICAgICAgICBkYXlzICAgIDw9IDEgICAgICAgICAgICAgJiYgWydkJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICBkYXlzICAgIDwgdGhyZXNob2xkcy5kICAgJiYgWydkZCcsIGRheXNdICAgIHx8XG4gICAgICAgICAgICBtb250aHMgIDw9IDEgICAgICAgICAgICAgJiYgWydNJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICBtb250aHMgIDwgdGhyZXNob2xkcy5NICAgJiYgWydNTScsIG1vbnRoc10gIHx8XG4gICAgICAgICAgICB5ZWFycyAgIDw9IDEgICAgICAgICAgICAgJiYgWyd5J10gICAgICAgICAgIHx8IFsneXknLCB5ZWFyc107XG5cbiAgICBhWzJdID0gd2l0aG91dFN1ZmZpeDtcbiAgICBhWzNdID0gK3Bvc05lZ0R1cmF0aW9uID4gMDtcbiAgICBhWzRdID0gbG9jYWxlO1xuICAgIHJldHVybiBzdWJzdGl0dXRlVGltZUFnby5hcHBseShudWxsLCBhKTtcbn1cblxuLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCB0aGUgcm91bmRpbmcgZnVuY3Rpb24gZm9yIHJlbGF0aXZlIHRpbWUgc3RyaW5nc1xuZnVuY3Rpb24gZ2V0U2V0UmVsYXRpdmVUaW1lUm91bmRpbmcgKHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICBpZiAocm91bmRpbmdGdW5jdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiByb3VuZDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZihyb3VuZGluZ0Z1bmN0aW9uKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByb3VuZCA9IHJvdW5kaW5nRnVuY3Rpb247XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFRoaXMgZnVuY3Rpb24gYWxsb3dzIHlvdSB0byBzZXQgYSB0aHJlc2hvbGQgZm9yIHJlbGF0aXZlIHRpbWUgc3RyaW5nc1xuZnVuY3Rpb24gZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkICh0aHJlc2hvbGQsIGxpbWl0KSB7XG4gICAgaWYgKHRocmVzaG9sZHNbdGhyZXNob2xkXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGxpbWl0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRocmVzaG9sZHNbdGhyZXNob2xkXTtcbiAgICB9XG4gICAgdGhyZXNob2xkc1t0aHJlc2hvbGRdID0gbGltaXQ7XG4gICAgaWYgKHRocmVzaG9sZCA9PT0gJ3MnKSB7XG4gICAgICAgIHRocmVzaG9sZHMuc3MgPSBsaW1pdCAtIDE7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBodW1hbml6ZSAod2l0aFN1ZmZpeCkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgfVxuXG4gICAgdmFyIGxvY2FsZSA9IHRoaXMubG9jYWxlRGF0YSgpO1xuICAgIHZhciBvdXRwdXQgPSByZWxhdGl2ZVRpbWUkMSh0aGlzLCAhd2l0aFN1ZmZpeCwgbG9jYWxlKTtcblxuICAgIGlmICh3aXRoU3VmZml4KSB7XG4gICAgICAgIG91dHB1dCA9IGxvY2FsZS5wYXN0RnV0dXJlKCt0aGlzLCBvdXRwdXQpO1xuICAgIH1cblxuICAgIHJldHVybiBsb2NhbGUucG9zdGZvcm1hdChvdXRwdXQpO1xufVxuXG52YXIgYWJzJDEgPSBNYXRoLmFicztcblxuZnVuY3Rpb24gc2lnbih4KSB7XG4gICAgcmV0dXJuICgoeCA+IDApIC0gKHggPCAwKSkgfHwgK3g7XG59XG5cbmZ1bmN0aW9uIHRvSVNPU3RyaW5nJDEoKSB7XG4gICAgLy8gZm9yIElTTyBzdHJpbmdzIHdlIGRvIG5vdCB1c2UgdGhlIG5vcm1hbCBidWJibGluZyBydWxlczpcbiAgICAvLyAgKiBtaWxsaXNlY29uZHMgYnViYmxlIHVwIHVudGlsIHRoZXkgYmVjb21lIGhvdXJzXG4gICAgLy8gICogZGF5cyBkbyBub3QgYnViYmxlIGF0IGFsbFxuICAgIC8vICAqIG1vbnRocyBidWJibGUgdXAgdW50aWwgdGhleSBiZWNvbWUgeWVhcnNcbiAgICAvLyBUaGlzIGlzIGJlY2F1c2UgdGhlcmUgaXMgbm8gY29udGV4dC1mcmVlIGNvbnZlcnNpb24gYmV0d2VlbiBob3VycyBhbmQgZGF5c1xuICAgIC8vICh0aGluayBvZiBjbG9jayBjaGFuZ2VzKVxuICAgIC8vIGFuZCBhbHNvIG5vdCBiZXR3ZWVuIGRheXMgYW5kIG1vbnRocyAoMjgtMzEgZGF5cyBwZXIgbW9udGgpXG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICB9XG5cbiAgICB2YXIgc2Vjb25kcyA9IGFicyQxKHRoaXMuX21pbGxpc2Vjb25kcykgLyAxMDAwO1xuICAgIHZhciBkYXlzICAgICAgICAgPSBhYnMkMSh0aGlzLl9kYXlzKTtcbiAgICB2YXIgbW9udGhzICAgICAgID0gYWJzJDEodGhpcy5fbW9udGhzKTtcbiAgICB2YXIgbWludXRlcywgaG91cnMsIHllYXJzO1xuXG4gICAgLy8gMzYwMCBzZWNvbmRzIC0+IDYwIG1pbnV0ZXMgLT4gMSBob3VyXG4gICAgbWludXRlcyAgICAgICAgICAgPSBhYnNGbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGhvdXJzICAgICAgICAgICAgID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICBzZWNvbmRzICU9IDYwO1xuICAgIG1pbnV0ZXMgJT0gNjA7XG5cbiAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgeWVhcnMgID0gYWJzRmxvb3IobW9udGhzIC8gMTIpO1xuICAgIG1vbnRocyAlPSAxMjtcblxuXG4gICAgLy8gaW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2RvcmRpbGxlL21vbWVudC1pc29kdXJhdGlvbi9ibG9iL21hc3Rlci9tb21lbnQuaXNvZHVyYXRpb24uanNcbiAgICB2YXIgWSA9IHllYXJzO1xuICAgIHZhciBNID0gbW9udGhzO1xuICAgIHZhciBEID0gZGF5cztcbiAgICB2YXIgaCA9IGhvdXJzO1xuICAgIHZhciBtID0gbWludXRlcztcbiAgICB2YXIgcyA9IHNlY29uZHMgPyBzZWNvbmRzLnRvRml4ZWQoMykucmVwbGFjZSgvXFwuPzArJC8sICcnKSA6ICcnO1xuICAgIHZhciB0b3RhbCA9IHRoaXMuYXNTZWNvbmRzKCk7XG5cbiAgICBpZiAoIXRvdGFsKSB7XG4gICAgICAgIC8vIHRoaXMgaXMgdGhlIHNhbWUgYXMgQyMncyAoTm9kYSkgYW5kIHB5dGhvbiAoaXNvZGF0ZSkuLi5cbiAgICAgICAgLy8gYnV0IG5vdCBvdGhlciBKUyAoZ29vZy5kYXRlKVxuICAgICAgICByZXR1cm4gJ1AwRCc7XG4gICAgfVxuXG4gICAgdmFyIHRvdGFsU2lnbiA9IHRvdGFsIDwgMCA/ICctJyA6ICcnO1xuICAgIHZhciB5bVNpZ24gPSBzaWduKHRoaXMuX21vbnRocykgIT09IHNpZ24odG90YWwpID8gJy0nIDogJyc7XG4gICAgdmFyIGRheXNTaWduID0gc2lnbih0aGlzLl9kYXlzKSAhPT0gc2lnbih0b3RhbCkgPyAnLScgOiAnJztcbiAgICB2YXIgaG1zU2lnbiA9IHNpZ24odGhpcy5fbWlsbGlzZWNvbmRzKSAhPT0gc2lnbih0b3RhbCkgPyAnLScgOiAnJztcblxuICAgIHJldHVybiB0b3RhbFNpZ24gKyAnUCcgK1xuICAgICAgICAoWSA/IHltU2lnbiArIFkgKyAnWScgOiAnJykgK1xuICAgICAgICAoTSA/IHltU2lnbiArIE0gKyAnTScgOiAnJykgK1xuICAgICAgICAoRCA/IGRheXNTaWduICsgRCArICdEJyA6ICcnKSArXG4gICAgICAgICgoaCB8fCBtIHx8IHMpID8gJ1QnIDogJycpICtcbiAgICAgICAgKGggPyBobXNTaWduICsgaCArICdIJyA6ICcnKSArXG4gICAgICAgIChtID8gaG1zU2lnbiArIG0gKyAnTScgOiAnJykgK1xuICAgICAgICAocyA/IGhtc1NpZ24gKyBzICsgJ1MnIDogJycpO1xufVxuXG52YXIgcHJvdG8kMiA9IER1cmF0aW9uLnByb3RvdHlwZTtcblxucHJvdG8kMi5pc1ZhbGlkICAgICAgICA9IGlzVmFsaWQkMTtcbnByb3RvJDIuYWJzICAgICAgICAgICAgPSBhYnM7XG5wcm90byQyLmFkZCAgICAgICAgICAgID0gYWRkJDE7XG5wcm90byQyLnN1YnRyYWN0ICAgICAgID0gc3VidHJhY3QkMTtcbnByb3RvJDIuYXMgICAgICAgICAgICAgPSBhcztcbnByb3RvJDIuYXNNaWxsaXNlY29uZHMgPSBhc01pbGxpc2Vjb25kcztcbnByb3RvJDIuYXNTZWNvbmRzICAgICAgPSBhc1NlY29uZHM7XG5wcm90byQyLmFzTWludXRlcyAgICAgID0gYXNNaW51dGVzO1xucHJvdG8kMi5hc0hvdXJzICAgICAgICA9IGFzSG91cnM7XG5wcm90byQyLmFzRGF5cyAgICAgICAgID0gYXNEYXlzO1xucHJvdG8kMi5hc1dlZWtzICAgICAgICA9IGFzV2Vla3M7XG5wcm90byQyLmFzTW9udGhzICAgICAgID0gYXNNb250aHM7XG5wcm90byQyLmFzWWVhcnMgICAgICAgID0gYXNZZWFycztcbnByb3RvJDIudmFsdWVPZiAgICAgICAgPSB2YWx1ZU9mJDE7XG5wcm90byQyLl9idWJibGUgICAgICAgID0gYnViYmxlO1xucHJvdG8kMi5jbG9uZSAgICAgICAgICA9IGNsb25lJDE7XG5wcm90byQyLmdldCAgICAgICAgICAgID0gZ2V0JDI7XG5wcm90byQyLm1pbGxpc2Vjb25kcyAgID0gbWlsbGlzZWNvbmRzO1xucHJvdG8kMi5zZWNvbmRzICAgICAgICA9IHNlY29uZHM7XG5wcm90byQyLm1pbnV0ZXMgICAgICAgID0gbWludXRlcztcbnByb3RvJDIuaG91cnMgICAgICAgICAgPSBob3VycztcbnByb3RvJDIuZGF5cyAgICAgICAgICAgPSBkYXlzO1xucHJvdG8kMi53ZWVrcyAgICAgICAgICA9IHdlZWtzO1xucHJvdG8kMi5tb250aHMgICAgICAgICA9IG1vbnRocztcbnByb3RvJDIueWVhcnMgICAgICAgICAgPSB5ZWFycztcbnByb3RvJDIuaHVtYW5pemUgICAgICAgPSBodW1hbml6ZTtcbnByb3RvJDIudG9JU09TdHJpbmcgICAgPSB0b0lTT1N0cmluZyQxO1xucHJvdG8kMi50b1N0cmluZyAgICAgICA9IHRvSVNPU3RyaW5nJDE7XG5wcm90byQyLnRvSlNPTiAgICAgICAgID0gdG9JU09TdHJpbmckMTtcbnByb3RvJDIubG9jYWxlICAgICAgICAgPSBsb2NhbGU7XG5wcm90byQyLmxvY2FsZURhdGEgICAgID0gbG9jYWxlRGF0YTtcblxucHJvdG8kMi50b0lzb1N0cmluZyA9IGRlcHJlY2F0ZSgndG9Jc29TdHJpbmcoKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRvSVNPU3RyaW5nKCkgaW5zdGVhZCAobm90aWNlIHRoZSBjYXBpdGFscyknLCB0b0lTT1N0cmluZyQxKTtcbnByb3RvJDIubGFuZyA9IGxhbmc7XG5cbi8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbignWCcsIDAsIDAsICd1bml4Jyk7XG5hZGRGb3JtYXRUb2tlbigneCcsIDAsIDAsICd2YWx1ZU9mJyk7XG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbigneCcsIG1hdGNoU2lnbmVkKTtcbmFkZFJlZ2V4VG9rZW4oJ1gnLCBtYXRjaFRpbWVzdGFtcCk7XG5hZGRQYXJzZVRva2VuKCdYJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgY29uZmlnLl9kID0gbmV3IERhdGUocGFyc2VGbG9hdChpbnB1dCwgMTApICogMTAwMCk7XG59KTtcbmFkZFBhcnNlVG9rZW4oJ3gnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSh0b0ludChpbnB1dCkpO1xufSk7XG5cbi8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuXG5ob29rcy52ZXJzaW9uID0gJzIuMjEuMCc7XG5cbnNldEhvb2tDYWxsYmFjayhjcmVhdGVMb2NhbCk7XG5cbmhvb2tzLmZuICAgICAgICAgICAgICAgICAgICA9IHByb3RvO1xuaG9va3MubWluICAgICAgICAgICAgICAgICAgID0gbWluO1xuaG9va3MubWF4ICAgICAgICAgICAgICAgICAgID0gbWF4O1xuaG9va3Mubm93ICAgICAgICAgICAgICAgICAgID0gbm93O1xuaG9va3MudXRjICAgICAgICAgICAgICAgICAgID0gY3JlYXRlVVRDO1xuaG9va3MudW5peCAgICAgICAgICAgICAgICAgID0gY3JlYXRlVW5peDtcbmhvb2tzLm1vbnRocyAgICAgICAgICAgICAgICA9IGxpc3RNb250aHM7XG5ob29rcy5pc0RhdGUgICAgICAgICAgICAgICAgPSBpc0RhdGU7XG5ob29rcy5sb2NhbGUgICAgICAgICAgICAgICAgPSBnZXRTZXRHbG9iYWxMb2NhbGU7XG5ob29rcy5pbnZhbGlkICAgICAgICAgICAgICAgPSBjcmVhdGVJbnZhbGlkO1xuaG9va3MuZHVyYXRpb24gICAgICAgICAgICAgID0gY3JlYXRlRHVyYXRpb247XG5ob29rcy5pc01vbWVudCAgICAgICAgICAgICAgPSBpc01vbWVudDtcbmhvb2tzLndlZWtkYXlzICAgICAgICAgICAgICA9IGxpc3RXZWVrZGF5cztcbmhvb2tzLnBhcnNlWm9uZSAgICAgICAgICAgICA9IGNyZWF0ZUluWm9uZTtcbmhvb2tzLmxvY2FsZURhdGEgICAgICAgICAgICA9IGdldExvY2FsZTtcbmhvb2tzLmlzRHVyYXRpb24gICAgICAgICAgICA9IGlzRHVyYXRpb247XG5ob29rcy5tb250aHNTaG9ydCAgICAgICAgICAgPSBsaXN0TW9udGhzU2hvcnQ7XG5ob29rcy53ZWVrZGF5c01pbiAgICAgICAgICAgPSBsaXN0V2Vla2RheXNNaW47XG5ob29rcy5kZWZpbmVMb2NhbGUgICAgICAgICAgPSBkZWZpbmVMb2NhbGU7XG5ob29rcy51cGRhdGVMb2NhbGUgICAgICAgICAgPSB1cGRhdGVMb2NhbGU7XG5ob29rcy5sb2NhbGVzICAgICAgICAgICAgICAgPSBsaXN0TG9jYWxlcztcbmhvb2tzLndlZWtkYXlzU2hvcnQgICAgICAgICA9IGxpc3RXZWVrZGF5c1Nob3J0O1xuaG9va3Mubm9ybWFsaXplVW5pdHMgICAgICAgID0gbm9ybWFsaXplVW5pdHM7XG5ob29rcy5yZWxhdGl2ZVRpbWVSb3VuZGluZyAgPSBnZXRTZXRSZWxhdGl2ZVRpbWVSb3VuZGluZztcbmhvb2tzLnJlbGF0aXZlVGltZVRocmVzaG9sZCA9IGdldFNldFJlbGF0aXZlVGltZVRocmVzaG9sZDtcbmhvb2tzLmNhbGVuZGFyRm9ybWF0ICAgICAgICA9IGdldENhbGVuZGFyRm9ybWF0O1xuaG9va3MucHJvdG90eXBlICAgICAgICAgICAgID0gcHJvdG87XG5cbi8vIGN1cnJlbnRseSBIVE1MNSBpbnB1dCB0eXBlIG9ubHkgc3VwcG9ydHMgMjQtaG91ciBmb3JtYXRzXG5ob29rcy5IVE1MNV9GTVQgPSB7XG4gICAgREFURVRJTUVfTE9DQUw6ICdZWVlZLU1NLUREVEhIOm1tJywgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIC8+XG4gICAgREFURVRJTUVfTE9DQUxfU0VDT05EUzogJ1lZWVktTU0tRERUSEg6bW06c3MnLCAgLy8gPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIHN0ZXA9XCIxXCIgLz5cbiAgICBEQVRFVElNRV9MT0NBTF9NUzogJ1lZWVktTU0tRERUSEg6bW06c3MuU1NTJywgICAvLyA8aW5wdXQgdHlwZT1cImRhdGV0aW1lLWxvY2FsXCIgc3RlcD1cIjAuMDAxXCIgLz5cbiAgICBEQVRFOiAnWVlZWS1NTS1ERCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cImRhdGVcIiAvPlxuICAgIFRJTUU6ICdISDptbScsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwidGltZVwiIC8+XG4gICAgVElNRV9TRUNPTkRTOiAnSEg6bW06c3MnLCAgICAgICAgICAgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJ0aW1lXCIgc3RlcD1cIjFcIiAvPlxuICAgIFRJTUVfTVM6ICdISDptbTpzcy5TU1MnLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwidGltZVwiIHN0ZXA9XCIwLjAwMVwiIC8+XG4gICAgV0VFSzogJ1lZWVktW1ddV1cnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJ3ZWVrXCIgLz5cbiAgICBNT05USDogJ1lZWVktTU0nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cIm1vbnRoXCIgLz5cbn07XG5cbnJldHVybiBob29rcztcblxufSkpKTtcbiIsImNvbnN0IHByZWZpeCA9ICdtYy1hdXRvLWNvbXBsZXRlJztcblxuY2xhc3MgQXV0b0NvbXBsZXRlIHtcbiAgY29uc3RydWN0b3IoZG9tLCBvcHRpb25zKSB7XG4gICAgdGhpcy5hdXRvQ29tcGxldGUgPSAkKGRvbSk7XG5cbiAgICB0aGlzLnRleHRDb250YWluZXJEb20gPSB0aGlzLmF1dG9Db21wbGV0ZS5maW5kKGAuJHtwcmVmaXh9LXRleHQtY29udGFpbmVyYCk7XG4gICAgdGhpcy50ZXh0SW5wdXREb20gPSB0aGlzLnRleHRDb250YWluZXJEb20uZmluZChgLiR7cHJlZml4fS10ZXh0YCk7XG4gICAgdGhpcy52YWx1ZUlucHV0RG9tID0gdGhpcy50ZXh0Q29udGFpbmVyRG9tLmZpbmQoYC4ke3ByZWZpeH0tdmFsdWVgKTtcblxuICAgIHRoaXMub3B0aW9uQ29udGFpbmVyRG9tID0gdGhpcy5hdXRvQ29tcGxldGUuZmluZChgLiR7cHJlZml4fS1vcHRpb24tY29udGFpbmVyYCk7XG4gICAgdGhpcy5vcHRpb25Eb21zID0gdGhpcy5hdXRvQ29tcGxldGUuZmluZChgLiR7cHJlZml4fS1vcHRpb25gKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+e1xuICAgICAgdGhpcy5hdXRvQ29tcGxldGUucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgICB9LCBmYWxzZSlcblxuICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG5cbiAgICB0aGlzLmtleXdvcmQgPSAnJztcbiAgfVxuXG4gIGhhbmRsZVRvZ2dsZShlKSB7XG4gICAgdGhpcy5hdXRvQ29tcGxldGUudG9nZ2xlQ2xhc3MoJ3Nob3cnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoYW5kbGVJbnB1dChlKSB7XG4gICAgbGV0IHZhbHVlID0gJChlLnRhcmdldCkudmFsKCk7XG4gICAgdGhpcy52YWx1ZUlucHV0RG9tLnZhbCh2YWx1ZSk7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmF1dG9Db21wbGV0ZS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9XG4gICAgdGhpcy5rZXl3b3JkID0gdmFsdWU7XG4gICAgdGhpcy5yZW5kZXJPcHRpb25zKCk7XG4gIH1cblxuICBoYW5kbGVTZWxlY3QoZSkge1xuICAgIGxldCB2YWx1ZSA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcbiAgICBsZXQgdGV4dCA9ICQoZS50YXJnZXQpLnRleHQoKTtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuYXV0b0NvbXBsZXRlLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG4gICAgICB0aGlzLnRleHRJbnB1dERvbS52YWwodGV4dCk7XG4gICAgICB0aGlzLnZhbHVlSW5wdXREb20udmFsKHZhbHVlKTtcbiAgICAgIHRoaXMudmFsdWVJbnB1dERvbS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgIHRoaXMuYXV0b0NvbXBsZXRlLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH1cbiAgICB0aGlzLmtleXdvcmQgPSB2YWx1ZTtcbiAgICB0aGlzLnJlbmRlck9wdGlvbnMoKTtcbiAgfVxuXG4gIHJlbmRlck9wdGlvbnMoKSB7XG4gICAgbGV0IG9wdGlvbkRvbXMgPSAkLmdyZXAodGhpcy5vcHRpb25Eb21zLCBpdGVtID0+IHtcbiAgICAgIHJldHVybiAkKGl0ZW0pLnRleHQoKS5tYXRjaCh0aGlzLmtleXdvcmQpO1xuICAgIH0pO1xuICAgIHRoaXMub3B0aW9uQ29udGFpbmVyRG9tLmh0bWwob3B0aW9uRG9tcyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKCkge1xuICAgIHRoaXMudGV4dElucHV0RG9tLm9uKCdpbnB1dCcsIHRoaXMuaGFuZGxlSW5wdXQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy50ZXh0Q29udGFpbmVyRG9tLm9uKCdjbGljaycsIHRoaXMuaGFuZGxlVG9nZ2xlLmJpbmQodGhpcykpO1xuICAgIHRoaXMub3B0aW9uQ29udGFpbmVyRG9tLm9uKCdjbGljaycsIHRoaXMuaGFuZGxlU2VsZWN0LmJpbmQodGhpcykpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0b0NvbXBsZXRlO1xuIiwiY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XG5jb25zdCBsYW5ncyA9IHJlcXVpcmUoJy4vbGFuZ3MnKTtcbmNvbnN0IHByZWZpeCA9ICdtYy1jYWxlbmRhcic7XG5cbmNvbnN0IGNhbGVuZGFycyA9ICQoYC4ke3ByZWZpeH1gKTtcblxuZnVuY3Rpb24gZ2V0UG9wSHRtbChvcHRpb25zKSB7XG4gIGxldCBkYXlOYW1lcyA9IGxhbmdzW29wdGlvbnMubGFuZ10uZGF5TmFtZXM7XG4gIGxldCBjb25maXJtTmFtZSA9IGxhbmdzW29wdGlvbnMubGFuZ10uY29uZmlybU5hbWU7XG4gIHJldHVybiBgPGRpdiBjbGFzcz1cIm1jLWNhbGVuZGFyLXBvcFwiPlxuICAgIDxkaXYgY2xhc3M9XCJtYy1jYWxlbmRhci1wb3AtaGVhZGVyXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1jLWNhbGVuZGFyLXBvcC1ib2R5XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibWMtY2FsZW5kYXItcG9wLWNhbGVuZGFyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYy1jYWxlbmRhci1wb3AtY2FsZW5kYXItd2Vla3NcIj5cbiAgICAgICAgICAke2RheU5hbWVzLm1hcChpdGVtID0+IGA8c3Bhbj4ke2l0ZW19PC9zcGFuPmApLmpvaW4oJycpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1jLWNhbGVuZGFyLXBvcC1jYWxlbmRhci1kYXlzXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYy1jYWxlbmRhci1wb3AtdGltZVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtYy1jYWxlbmRhci1wb3AtZm9vdGVyXCI+XG4gICAgICA8YT4ke2NvbmZpcm1OYW1lfTwvYT5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+YFxufVxuXG5jbGFzcyBDYWxlbmRhciB7XG4gIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBsYW5nOiAnemgnLFxuICAgIHN0YXJ0RGF5OiAxLFxuICB9XG4gIGNvbnN0cnVjdG9yKGRvbSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIENhbGVuZGFyLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB0aGlzLmNhbGVuZGFyRG9tID0gJChkb20pO1xuICAgIHRoaXMucG9wRG9tID0gJChnZXRQb3BIdG1sKFxuICAgICAgdGhpcy5vcHRpb25zXG4gICAgKSk7XG4gICAgdGhpcy5jYWxlbmRhckRvbS5hcHBlbmQodGhpcy5wb3BEb20pO1xuICAgIHRoaXMuY2FsZW5kYXJIZWFkZXJEb20gPSB0aGlzLnBvcERvbS5maW5kKGAuJHtwcmVmaXh9LXBvcC1oZWFkZXJgKTtcbiAgICB0aGlzLmNhbGVuZGFyRGF5c0RvbSA9IHRoaXMucG9wRG9tLmZpbmQoYC4ke3ByZWZpeH0tcG9wLWNhbGVuZGFyLWRheXNgKTtcbiAgICB0aGlzLnRpbWVEb20gPSB0aGlzLnBvcERvbS5maW5kKGAuJHtwcmVmaXh9LXBvcC10aW1lYCk7XG5cbiAgICB0aGlzLm5vdyA9IG5ldyBtb21lbnQoKTtcbiAgICB0aGlzLm1vbnRoID0gbmV3IG1vbWVudCgpO1xuXG4gICAgdGhpcy5zZWxlY3RlZERhdGUgPSBuZXcgbW9tZW50KCk7XG4gICAgdGhpcy5zZWxlY3RlZFRpbWUgPSBuZXcgbW9tZW50KCk7XG5cbiAgICB0aGlzLnJlbmRlck1vbnRoKCk7XG4gICAgdGhpcy5yZW5kZXJEYXRlKCk7XG4gICAgdGhpcy5yZW5kZXJUaW1lKCk7XG5cbiAgICB0aGlzLmFkZExpc3RlbmVycygpO1xuICB9XG5cbiAgaGFuZGxlVG9nZ2xlKGUpIHtcbiAgICAkKHRoaXMuY2FsZW5kYXJEb20pLnRvZ2dsZUNsYXNzKCdzaG93Jyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaGFuZGxlQ29uZmlybSgpIHtcbiAgICBsZXQgdmFsdWUgPSBgJHt0aGlzLnNlbGVjdGVkRGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKX0gJHt0aGlzLnNlbGVjdGVkVGltZS5mb3JtYXQoJ0hIOm1tJyl9YFxuICAgIHRoaXMuY2FsZW5kYXJEb20uZmluZChgLiR7cHJlZml4fS10ZXh0YCkudmFsKHZhbHVlKTtcbiAgICB0aGlzLmNhbGVuZGFyRG9tLmZpbmQoYC4ke3ByZWZpeH0tdGV4dGApLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICQodGhpcy5jYWxlbmRhckRvbSkucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcmVNb250aChlKSB7XG4gICAgbGV0IGNvbnRleHQgPSBlLmRhdGEuY29udGV4dDtcbiAgICBjb250ZXh0Lm1vbnRoID0gY29udGV4dC5tb250aC5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcbiAgICBjb250ZXh0LnJlbmRlck1vbnRoKCk7XG4gICAgY29udGV4dC5yZW5kZXJEYXRlKCk7XG4gIH1cblxuICBuZXh0TW9udGgoZSkge1xuICAgIGxldCBjb250ZXh0ID0gZS5kYXRhLmNvbnRleHQ7XG4gICAgY29udGV4dC5tb250aCA9IGNvbnRleHQubW9udGguYWRkKDEsICdtb250aCcpO1xuICAgIGNvbnRleHQucmVuZGVyTW9udGgoKTtcbiAgICBjb250ZXh0LnJlbmRlckRhdGUoKTtcbiAgfVxuXG4gIHByZUhvdXIoZSkge1xuICAgIGxldCBjb250ZXh0ID0gZS5kYXRhLmNvbnRleHQ7XG4gICAgY29udGV4dC5zZWxlY3RlZFRpbWUuc3VidHJhY3QoMSwgJ2hvdXJzJylcbiAgICBjb250ZXh0LnJlbmRlclRpbWUoKTtcbiAgfVxuXG4gIG5leHRIb3VyKGUpIHtcbiAgICBsZXQgY29udGV4dCA9IGUuZGF0YS5jb250ZXh0O1xuICAgIGNvbnRleHQuc2VsZWN0ZWRUaW1lLmFkZCgxLCAnaG91cnMnKTtcbiAgICBjb250ZXh0LnJlbmRlclRpbWUoKTtcbiAgfVxuXG4gIHByZU1pbnV0ZShlKSB7XG4gICAgbGV0IGNvbnRleHQgPSBlLmRhdGEuY29udGV4dDtcbiAgICBjb250ZXh0LnNlbGVjdGVkVGltZS5zdWJ0cmFjdCgxLCAnbWludXRlcycpO1xuICAgIGNvbnRleHQucmVuZGVyVGltZSgpO1xuICB9XG5cbiAgbmV4dE1pbnV0ZShlKSB7XG4gICAgbGV0IGNvbnRleHQgPSBlLmRhdGEuY29udGV4dDtcbiAgICBjb250ZXh0LnNlbGVjdGVkVGltZS5hZGQoMSwgJ21pbnV0ZXMnKTtcbiAgICBjb250ZXh0LnJlbmRlclRpbWUoKTtcbiAgfVxuXG4gIGhhbmRsZVNlbGVjdERhdGUoZSkge1xuICAgIGxldCBjb250ZXh0ID0gZS5kYXRhLmNvbnRleHQ7XG4gICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XG4gICAgICBjb250ZXh0LnNlbGVjdGVkRGF0ZSA9IG5ldyBtb21lbnQoJCh0aGlzKS5hdHRyKCdkYXRhLWRhdGUnKSk7XG4gICAgICBjb250ZXh0LnJlbmRlckRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBhZGRMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5jYWxlbmRhckRvbS5vbignY2xpY2snLCBgLiR7cHJlZml4fS10ZXh0LWNvbnRhaW5lcmAsIHRoaXMuaGFuZGxlVG9nZ2xlLmJpbmQodGhpcykpO1xuICAgIHRoaXMucG9wRG9tLm9uKCdjbGljaycsIGAuJHtwcmVmaXh9LXBvcC1mb290ZXJgLCB0aGlzLmhhbmRsZUNvbmZpcm0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmNhbGVuZGFyRGF5c0RvbS5vbignY2xpY2snLCAnc3BhbicsIHtcbiAgICAgIGNvbnRleHQ6IHRoaXNcbiAgICB9LHRoaXMuaGFuZGxlU2VsZWN0RGF0ZSk7XG5cbiAgICB0aGlzLmNhbGVuZGFySGVhZGVyRG9tLm9uKCdjbGljaycsIGAucHJlLWJ0bmAsIHtcbiAgICAgIGNvbnRleHQ6IHRoaXNcbiAgICB9LCB0aGlzLnByZU1vbnRoKTtcblxuICAgIHRoaXMuY2FsZW5kYXJIZWFkZXJEb20ub24oJ2NsaWNrJywgYC5uZXh0LWJ0bmAsIHtcbiAgICAgIGNvbnRleHQ6IHRoaXNcbiAgICB9LCB0aGlzLm5leHRNb250aCk7XG5cbiAgICB0aGlzLnRpbWVEb20ub24oJ2NsaWNrJywgYC4ke3ByZWZpeH0tcG9wLXRpbWUtaG91ci1sZWZ0YCwge1xuICAgICAgY29udGV4dDogdGhpc1xuICAgIH0sIHRoaXMucHJlSG91cik7XG5cbiAgICB0aGlzLnRpbWVEb20ub24oJ2NsaWNrJywgYC4ke3ByZWZpeH0tcG9wLXRpbWUtaG91ci1yaWdodGAsIHtcbiAgICAgIGNvbnRleHQ6IHRoaXNcbiAgICB9LCB0aGlzLm5leHRIb3VyKTtcblxuICAgIHRoaXMudGltZURvbS5vbignY2xpY2snLCBgLiR7cHJlZml4fS1wb3AtdGltZS1taW51dGUtbGVmdGAsIHtcbiAgICAgIGNvbnRleHQ6IHRoaXNcbiAgICB9LCB0aGlzLnByZU1pbnV0ZSk7XG5cbiAgICB0aGlzLnRpbWVEb20ub24oJ2NsaWNrJywgYC4ke3ByZWZpeH0tcG9wLXRpbWUtbWludXRlLXJpZ2h0YCwge1xuICAgICAgY29udGV4dDogdGhpc1xuICAgIH0sIHRoaXMubmV4dE1pbnV0ZSk7XG4gIH1cblxuICByZW5kZXJNb250aCgpIHtcbiAgICBsZXQgbW9udGggPSAgdGhpcy5tb250aC5mb3JtYXQobGFuZ3NbdGhpcy5vcHRpb25zLmxhbmddLm1vbnRoRm9ybWF0KVxuICAgIHRoaXMuY2FsZW5kYXJIZWFkZXJEb20uaHRtbChgXG4gICAgICA8c3BhbiBjbGFzcz1cInByZS1idG5cIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cIm1vbnRoXCI+XG4gICAgICAgICR7bW9udGh9XG4gICAgICA8L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cIm5leHQtYnRuXCI+PC9zcGFuPlxuICAgIGApXG4gIH1cblxuICByZW5kZXJEYXRlKCkge1xuICAgIGxldCBzdGFydERhdGUgPSB0aGlzLm1vbnRoLmNsb25lKCkuc3RhcnRPZignbW9udGgnKTtcbiAgICBsZXQgZW5kRGF0ZSA9IHRoaXMubW9udGguY2xvbmUoKS5lbmRPZignbW9udGgnKTtcbiAgICBsZXQgc3RhcnRXZWVrZGF5ID0gc3RhcnREYXRlLndlZWtkYXkoKTtcbiAgICBsZXQgZW5kV2Vla2RheSA9IGVuZERhdGUud2Vla2RheSgpO1xuICAgIGxldCB0b2RheURhdGUgPSB0aGlzLm5vdy5kYXRlKCk7XG5cbiAgICBsZXQgbW9udGhMZW4gPSBlbmREYXRlLmRhdGUoKTtcblxuICAgIGxldCBkYXRlTGlzdCA9IFtdO1xuICAgIGxldCB0ZW1wU3RhcnQgPSBzdGFydERhdGUuY2xvbmUoKTtcbiAgICBsZXQgdGVtcEVuZCA9IGVuZERhdGUuY2xvbmUoKTtcbiAgICBsZXQgdGVtcE1vbnRoID0gdGhpcy5tb250aC5jbG9uZSgpO1xuXG4gICAgaWYgKHN0YXJ0V2Vla2RheSA+IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnRXZWVrZGF5IDtpKyspIHtcbiAgICAgICAgZGF0ZUxpc3QudW5zaGlmdCh0ZW1wU3RhcnQuc3VidHJhY3QoMSwgJ2RheXMnKS5mb3JtYXQoJ1lZWVktTU0tREQnKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yKGxldCBpID0gMTsgaSA8PSBtb250aExlbiA7aSsrKSB7XG4gICAgICBkYXRlTGlzdC5wdXNoKHRlbXBNb250aC5kYXRlKGkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpKTtcbiAgICB9XG5cbiAgICBpZiAoZW5kV2Vla2RheSA8IDYpIHtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgNyAtIGVuZFdlZWtkYXkgO2krKykge1xuICAgICAgICBkYXRlTGlzdC5wdXNoKHRlbXBFbmQuYWRkKDEsICdkYXlzJykuZm9ybWF0KCdZWVlZLU1NLUREJykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBodG1sID0gZGF0ZUxpc3QubWFwKGl0ZW0gPT4ge1xuICAgICAgaWYgKG5ldyBtb21lbnQoaXRlbSkuaXNCZWZvcmUoc3RhcnREYXRlKSB8fCBuZXcgbW9tZW50KGl0ZW0pLmlzQWZ0ZXIoZW5kRGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cImRpc2FibGVkXCIgZGF0YS1kYXRlPVwiJHtpdGVtfVwiPjxpPiR7bmV3IG1vbWVudChpdGVtKS5kYXRlKCl9PC9pPjwvc3Bhbj5gXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWREYXRlICYmIGl0ZW0gPT09IHRoaXMuc2VsZWN0ZWREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKSB7XG4gICAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCJzZWxlY3RlZFwiIGRhdGEtZGF0ZT1cIiR7aXRlbX1cIj48aT4ke25ldyBtb21lbnQoaXRlbSkuZGF0ZSgpfTwvaT48L3NwYW4+YFxuICAgICAgfSBlbHNlIGlmIChpdGVtID09PSB0aGlzLm5vdy5mb3JtYXQoJ1lZWVktTU0tREQnKSkge1xuICAgICAgICByZXR1cm4gYDxzcGFuIGNsYXNzPVwidG9kYXlcIiBkYXRhLWRhdGU9XCIke2l0ZW19XCI+PGk+JHtuZXcgbW9tZW50KGl0ZW0pLmRhdGUoKX08L2k+PC9zcGFuPmBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBgPHNwYW4gZGF0YS1kYXRlPVwiJHtpdGVtfVwiPjxpPiR7bmV3IG1vbWVudChpdGVtKS5kYXRlKCl9PC9pPjwvc3Bhbj5gXG4gICAgICB9XG4gICAgfSkuam9pbignJyk7XG5cbiAgICB0aGlzLmNhbGVuZGFyRGF5c0RvbS5odG1sKGh0bWwpXG4gIH1cblxuICByZW5kZXJUaW1lKCkge1xuICAgIHRoaXMudGltZURvbS5odG1sKGBcbiAgICAgICR7bGFuZ3NbdGhpcy5vcHRpb25zLmxhbmddLnRpbWVOYW1lfVxuICAgICAgPHNwYW4gY2xhc3M9XCJtYy1jYWxlbmRhci1wb3AtdGltZS1ob3VyLWxlZnRcIj48L3NwYW4+XG4gICAgICAke3RoaXMuc2VsZWN0ZWRUaW1lLmZvcm1hdCgnSEgnKX1cbiAgICAgIDxzcGFuIGNsYXNzPVwibWMtY2FsZW5kYXItcG9wLXRpbWUtaG91ci1yaWdodFwiPjwvc3Bhbj5cbiAgICAgIDpcbiAgICAgIDxzcGFuIGNsYXNzPVwibWMtY2FsZW5kYXItcG9wLXRpbWUtbWludXRlLWxlZnRcIj48L3NwYW4+XG4gICAgICAke3RoaXMuc2VsZWN0ZWRUaW1lLmZvcm1hdCgnbW0nKX1cbiAgICAgIDxzcGFuIGNsYXNzPVwibWMtY2FsZW5kYXItcG9wLXRpbWUtbWludXRlLXJpZ2h0XCI+PC9zcGFuPlxuICAgIGApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYWxlbmRhcjtcbiIsImNvbnN0IGxhbmdzID0ge1xuICB6aDoge1xuICAgIG1vbnRoRm9ybWF0OiAnWVlZWeW5tE1N5pyIJyxcbiAgICBjb25maXJtTmFtZTogJ+ehruWumicsXG4gICAgdGltZU5hbWU6ICfml7bpl7QnLFxuICAgIGRheU5hbWVzOiBbJ+aXpScsICfkuIAnLCAn5LqMJywgJ+S4iScsICflm5snLCAn5LqUJywgJ+WFrSddLFxuXG4gIH0sXG4gIGVuOiB7XG4gICAgbW9udGhGb3JtYXQ6ICdNTU1NIFlZWVknLFxuICAgIGNvbmZpcm1OYW1lOiAnY29uZmlybScsXG4gICAgdGltZU5hbWU6ICd0aW1lJyxcbiAgICBkYXlOYW1lczogWydTdW4nLCAnTW9uJywgJ1R1ZScsICdXZWQnLCAnVGh1JywgJ0ZyaScsICdTYXQnXSxcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBsYW5ncztcbiIsImNvbnN0IEJhc2UgPSAgcmVxdWlyZSgnLi9iYXNlJyk7XG5cbmNvbnN0IHByZWZpeCA9ICdtYy1kaWFsb2ctYWN0aW9uc2hlZXQnO1xuXG5jbGFzcyBBY3Rpb25TaGVldCBleHRlbmRzIEJhc2Uge1xuICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgY29udGVudEhUTUw6ICdUaGlzIGlzIGNvbnRlbnQhJyxcbiAgICBkdXJhdGlvbjogMjAwMCxcbiAgICB1c2VNYXNrOiBmYWxzZVxuICB9XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xuICAgIHN1cGVyKCk7XG4gICAgJC5leHRlbmQodGhpcywgQWN0aW9uU2hlZXQuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTmFtZSArPSBgICR7cHJlZml4fWA7XG5cbiAgICBjb25zdCB7IGJ1dHRvbnMgfSA9IG9wdGlvbnNcbiAgICBsZXQgYnV0dG9uc0h0bWwgPSBidXR0b25zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCJidXR0b25cIiBkYXRhLWluZGV4PSR7aW5kZXh9PiR7aXRlbS50ZXh0fTwvc3Bhbj5gXG4gICAgfSkuam9pbignJyk7XG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gYnV0dG9uc0h0bWw7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLmRpYWxvZy1jb250ZW50LXRleHQnKTtcblxuICAgICQodGhpcy5jb250YWluZXIpLm9uKCdjbGljaycsICcuYnV0dG9uJywgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgeyBpbmRleCB9ID0gJCh0aGlzKS5kYXRhKCk7XG4gICAgICBpZiAoYnV0dG9uc1tpbmRleF0gJiYgYnV0dG9uc1tpbmRleF0ub25DbGljaykge1xuICAgICAgICBidXR0b25zW2luZGV4XS5vbkNsaWNrKGJ1dHRvbnNbaW5kZXhdKVxuICAgICAgICBzZWxmLmhpZGUoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgaGlkZSA9ICgpID0+IHtcbiAgICBzdXBlci5oaWRlKCk7XG4gICAgJCgnLm1jLWRpYWxvZy1tYXNrJykub2ZmKCdjbGljaycsIHRoaXMuaGlkZSlcbiAgfVxuXG4gIHNob3cgPSAoKSA9PiB7XG4gICAgaWYoIXRoaXMubW91bnRlZCkgdGhpcy5tb3VudCgpO1xuICAgIHN1cGVyLnNob3coKTtcbiAgICAkKCcubWMtZGlhbG9nLW1hc2snKS5vbignY2xpY2snLCB0aGlzLmhpZGUpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb25TaGVldDtcbiIsImNvbnN0IEdlbmVyYWwgPSByZXF1aXJlKCcuL2dlbmVyYWwnKTtcblxubGV0IHByZWZpeCA9ICdtYy1kaWFsb2ctYWxlcnQnO1xuXG5jbGFzcyBBbGVydERpYWxvZyBleHRlbmRzIEdlbmVyYWwge1xuICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgY29udGVudEhUTUw6ICdUaGlzIGlzIGNvbnRlbnQhJyxcbiAgICBidXR0b25UZXh0OiAnY29uZmlybScsXG4gICAgbGFuZzogJ3poJyxcbiAgICBvbkNvbmZpcm06IGZ1bmN0aW9uICgpIHt0aGlzLmhpZGUoKX1cbiAgfVxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcbiAgICAkLmV4dGVuZCh0aGlzLCBBbGVydERpYWxvZy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NOYW1lICs9IGAgJHtwcmVmaXh9YDtcbiAgICB0aGlzLmJ1dHRvbkdyb3VwLmlubmVySFRNTCA9IGA8YnV0dG9uPiR7dGhpcy5idXR0b25UZXh0fTwvYnV0dG9uPmA7XG4gICAgdGhpcy5idXR0b24gPSB0aGlzLmJ1dHRvbkdyb3VwLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpO1xuICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICBpZihlLnRhcmdldCA9PT0gdGhpcy5idXR0b24pe1xuICAgICAgICB0aGlzLm9uQ29uZmlybS5jYWxsKHRoaXMsICgpID0+IHtcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LCBmYWxzZSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFsZXJ0RGlhbG9nO1xuIiwiY29uc3QgTWFzayA9IHJlcXVpcmUoJy4vbWFzaycpO1xuY29uc3QgdW5pcXVlSWQgPSByZXF1aXJlKCcuL3V0aWxzJykudW5pcXVlSWQ7XG5cbmNvbnN0IHByZWZpeCA9ICdtYy1kaWFsb2cnO1xuXG5jbGFzcyBCYXNlIHtcbiAgc3RhdGljIG1hc2sgPSBuZXcgTWFzaygpXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuaWQgPSB1bmlxdWVJZCgpO1xuICAgIHRoaXMuaXNEaXNwbGF5ID0gZmFsc2U7XG4gICAgdGhpcy51c2VNYXNrID0gdHJ1ZTsgLy8g5piv5ZCm5L2/55So6YGu572pXG4gICAgdGhpcy5tb3VudGVkID0gZmFsc2U7XG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgPSBwcmVmaXggKyBgICR7b3B0aW9ucy5jbGFzc05hbWUgfHwgJyd9YDtcbiAgICB0aGlzLmNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RpYWxvZy1pZCcsIHRoaXMuaWQpXG4gICAgdGhpcy5jbGFzc0xpc3QgPSB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3Q7XG4gICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSwgZmFsc2UpXG4gIH1cbiAgbW91bnQoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XG4gICAgdGhpcy5tb3VudGVkID0gdHJ1ZTtcbiAgfVxuICBzaG93KCkge1xuICAgIGlmKCF0aGlzLm1vdW50ZWQpIHRoaXMubW91bnQoKTtcbiAgICBpZih0aGlzLnVzZU1hc2spIEJhc2UubWFzay5zaG93KCk7XG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmNsYXNzTGlzdC5hZGQoJ2luJyksIDApO1xuICAgIHRoaXMuaXNEaXNwbGF5ID0gdHJ1ZTtcbiAgfVxuICBoaWRlKCkge1xuICAgIGlmKHRoaXMudXNlTWFzaykgQmFzZS5tYXNrLmhpZGUoKTtcbiAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2luJylcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScsIDMwMClcbiAgICB0aGlzLmlzRGlzcGxheSA9IGZhbHNlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZTtcbiIsImNvbnN0IEdlbmVyYWwgPSByZXF1aXJlKCcuL2dlbmVyYWwnKTtcblxuY29uc3QgcHJlZml4ID0gJ21jLWRpYWxvZy1jb21wbGV4JztcblxuY2xhc3MgQ29tcGxleCBleHRlbmRzIEdlbmVyYWwge1xuICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgY29udGVudEhUTUw6ICdUaGlzIGlzIGNvbnRlbnQhJyxcbiAgICBidXR0b25zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NhbmNlbCcsXG4gICAgICAgIHRleHQ6ICdjYW5jZWwnLFxuICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoKSB7dGhpcy5oaWRlKCl9LFxuICAgICAgfVxuICAgIF1cbiAgfVxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICAkLmV4dGVuZCh0aGlzLCBDb21wbGV4LmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgKz0gYCAke3ByZWZpeH1gO1xuICAgIHRoaXMuYnV0dG9uR3JvdXAuaW5uZXJIVE1MID0gdGhpcy5idXR0b25zLm1hcChidXR0b24gPT4ge1xuICAgICAgcmV0dXJuIGA8YnV0dG9uIGNsYXNzPVwiY29tcGxleC1idG4gJHtidXR0b24uY2xhc3NOYW1lIHx8ICcnfVwiPiR7YnV0dG9uLnRleHR9PC9idXR0b24+YFxuICAgIH0pLmpvaW4oJycpO1xuICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICBsZXQgdGFyZ2V0ID0gJChlLnRhcmdldCk7XG4gICAgICBpZiAodGFyZ2V0Lmhhc0NsYXNzKCdjb21wbGV4LWJ0bicpKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHRhcmdldC5pbmRleCgpO1xuICAgICAgICBsZXQgb25DbGljayA9IHRoaXMuYnV0dG9uc1tpbmRleF0gJiYgdGhpcy5idXR0b25zW2luZGV4XS5vbkNsaWNrO1xuICAgICAgICBpZiAob25DbGljaykge1xuICAgICAgICAgIG9uQ2xpY2suY2FsbCh0aGlzLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgZmFsc2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcGxleDtcbiIsImNvbnN0IEdlbmVyYWwgPSByZXF1aXJlKCcuL2dlbmVyYWwnKTtcblxuY29uc3QgcHJlZml4ID0gJ21jLWRpYWxvZy1jb25maXJtJztcblxuY2xhc3MgQ29uZmlybURpYWxvZyBleHRlbmRzIEdlbmVyYWwge1xuICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgY29udGVudEhUTUw6ICdUaGlzIGlzIGNvbnRlbnQhJyxcbiAgICBjb25maXJtQnV0dG9uVGV4dDogJ2NvbmZpcm0nLFxuICAgIGNhbmNlbEJ1dHRvblRleHQ6ICdjYW5jZWwnLFxuICAgIGxhbmc6ICd6aCcsXG4gICAgb25Db25maXJtOiBmdW5jdGlvbiAoKSB7dGhpcy5oaWRlKCl9LFxuICAgIG9uQ2FuY2VsOiBmdW5jdGlvbiAoKSB7dGhpcy5oaWRlKCl9XG4gIH1cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICQuZXh0ZW5kKHRoaXMsIENvbmZpcm1EaWFsb2cuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTmFtZSArPSBgICR7cHJlZml4fWA7XG4gICAgdGhpcy5idXR0b25Hcm91cC5pbm5lckhUTUwgPSBgXG4gICAgICA8YnV0dG9uIGNsYXNzPVwiY2FuY2VsLWJ0blwiPiR7dGhpcy5jYW5jZWxCdXR0b25UZXh0fTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBjbGFzcz1cImNvbmZpcm0tYnRuXCI+JHt0aGlzLmNvbmZpcm1CdXR0b25UZXh0fTwvYnV0dG9uPlxuICAgIGA7XG4gICAgdGhpcy5jb25maXJtQnRuID0gdGhpcy5idXR0b25Hcm91cC5xdWVyeVNlbGVjdG9yKCcuY29uZmlybS1idG4nKTtcbiAgICB0aGlzLmNhbmNlbEJ0biA9IHRoaXMuYnV0dG9uR3JvdXAucXVlcnlTZWxlY3RvcignLmNhbmNlbC1idG4nKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgaWYoZS50YXJnZXQgPT09IHRoaXMuY29uZmlybUJ0bil7XG4gICAgICAgIHRoaXMub25Db25maXJtLmNhbGwodGhpcywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9KVxuICAgICAgfWVsc2UgaWYoZS50YXJnZXQgPT09IHRoaXMuY2FuY2VsQnRuKXtcbiAgICAgICAgdGhpcy5vbkNhbmNlbC5jYWxsKHRoaXMsICgpID0+IHtcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LCBmYWxzZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25maXJtRGlhbG9nO1xuIiwiY29uc3QgQmFzZSA9ICByZXF1aXJlKCcuL2Jhc2UnKTtcblxuY29uc3QgcHJlZml4ID0gJ21jLWRpYWxvZy1nZW5lcmFsJztcblxuY29uc3QgdG1wbCA9IGBcbiAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250ZW50XCI+PHAgY2xhc3M9XCJkaWFsb2ctY29udGVudC10ZXh0XCI+PC9wPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWJ1dHRvbi1ncm91cFwiPjwvZGl2PlxuYDtcblxuY2xhc3MgR2VuZXJhbCBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgKz0gYCAke3ByZWZpeH1gO1xuICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IHRtcGw7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLmRpYWxvZy1jb250ZW50LXRleHQnKTtcbiAgICB0aGlzLmJ1dHRvbkdyb3VwID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLmRpYWxvZy1idXR0b24tZ3JvdXAnKTtcbiAgfVxuICBzaG93KG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuY29udGVudEhUTUwgPSBvcHRpb25zLmNvbnRlbnRIVE1MIHx8IHRoaXMuY29udGVudEhUTUw7XG4gICAgdGhpcy5jb250ZW50LmlubmVySFRNTCA9IHRoaXMuY29udGVudEhUTUw7XG4gICAgc3VwZXIuc2hvdygpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2VuZXJhbDtcbiIsIlxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGxvYWRpbmc6IHtcbiAgICBlbjoge1xuICAgICAgbG9hZGluZ1RleHQ6ICdsb2FkaW5nLi4uJ1xuICAgIH0sXG4gICAgemg6IHtcbiAgICAgIGxvYWRpbmdUZXh0OiAn5Yqg6L295LitLi4uJ1xuICAgIH1cbiAgfSxcbiAgY29uZmlybToge1xuICAgIGVuOiB7XG4gICAgICBjYW5jZWxOYW1lOiAnY2FuY2VsJyxcbiAgICAgIGNvbmZpcm1OYW1lOiAnY29uZmlybSdcbiAgICB9LFxuICAgIHpoOiB7XG4gICAgICBjYW5jZWxOYW1lOiAn5Y+W5raIJyxcbiAgICAgIGNvbmZpcm1OYW1lOiAn56Gu6K6kJ1xuICAgIH1cbiAgfSxcbiAgYWxlcnQ6IHtcbiAgICBlbjoge1xuICAgICAgY29uZmlybU5hbWU6ICdjb25maXJtJ1xuICAgIH0sXG4gICAgemg6IHtcbiAgICAgIGNvbmZpcm1OYW1lOiAn56Gu6K6kJ1xuICAgIH1cbiAgfVxufVxuIiwiY29uc3QgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xuY29uc3QgYXBwZW5kVG9TZWxlY3RvciA9IHJlcXVpcmUoJy4vdXRpbHMnKS5hcHBlbmRUb1NlbGVjdG9yO1xuY29uc3QgbGFuZ3MgPSByZXF1aXJlKCcuL2xhbmdzJykubG9hZGluZztcbmNvbnN0IHByZWZpeCA9ICdtYy1kaWFsb2ctbG9hZGluZyc7XG5cbmNsYXNzIExvYWRpbmcgZXh0ZW5kcyBCYXNlIHtcbiAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHVzZU1hc2s6IGZhbHNlLFxuICAgIGNvdW50OiAxMixcbiAgICBsYW5nOiAnemgnXG4gIH1cbiAgY29uc3RydWN0b3Iob3B0aW9ucyl7XG4gICAgc3VwZXIoKTtcbiAgICAkLmV4dGVuZCh0aGlzLCBMb2FkaW5nLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICAgIGxldCBodG1sID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvdW50OyBpKyspIHtcbiAgICAgIGh0bWwgKz0gJzxpPjwvaT4nO1xuICAgIH1cblxuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTmFtZSArPSBgICR7cHJlZml4fWA7XG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gYFxuICAgICAgJHtodG1sfVxuICAgICAgPHA+JHtsYW5nc1t0aGlzLmxhbmddLmxvYWRpbmdUZXh0fTwvcD5cbiAgICBgO1xuXG4gIH1cblxuICBzaG93KG9wdGlvbnMgPSB7fSkge1xuICAgIGlmKCF0aGlzLm1vdW50ZWQpIHRoaXMubW91bnQoKTtcbiAgICBzdXBlci5zaG93KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkaW5nO1xuIiwiY29uc3QgdW5pcXVlSWQgPSByZXF1aXJlKCcuL3V0aWxzJykudW5pcXVlSWQ7XG5cbmNvbnN0IHByZWZpeCA9ICdtYy1kaWFsb2ctbWFzayc7XG5cbmNsYXNzIE1hc2sge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zID0gJC5leHRlbmQoe1xuICAgICAgekluZGV4OiA5LFxuICAgICAgb3BhY2l0eTogLjhcbiAgICB9LCBvcHRpb25zLm1hc2spO1xuICAgIHRoaXMuaWQgPSB1bmlxdWVJZCgpO1xuICAgIHRoaXMubW91bnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NOYW1lID0gcHJlZml4O1xuICAgIHRoaXMuY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnbWFzay1pZCcsIHRoaXMuaWQpO1xuICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9LCBmYWxzZSk7XG4gIH1cbiAgbW91bnQoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XG4gICAgdGhpcy5tb3VudGVkID0gdHJ1ZTtcbiAgfVxuICBzaG93KCkge1xuICAgIGlmKCF0aGlzLm1vdW50ZWQpIHRoaXMubW91bnQoKTtcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2luJyksIDApO1xuICAgIHRoaXMuaXNEaXNwbGF5ID0gdHJ1ZTtcbiAgfVxuICBoaWRlKCkge1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2luJylcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScsIDMwMCk7XG4gICAgdGhpcy5pc0Rpc3BsYXkgPSBmYWxzZTtcbiAgfVxuICBvbihldmVudFR5cGUsIGZ1bikge1xuICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBmdW4sIGZhbHNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hc2s7XG4iLCJjb25zdCBCYXNlID0gIHJlcXVpcmUoJy4vYmFzZScpO1xuXG5jb25zdCBwcmVmaXggPSAnbWMtZGlhbG9nLXRpcCc7XG5cbmNsYXNzIFRpcCBleHRlbmRzIEJhc2Uge1xuICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgY29udGVudEhUTUw6ICdUaGlzIGlzIGNvbnRlbnQhJyxcbiAgICBkdXJhdGlvbjogMjAwMCxcbiAgICB1c2VNYXNrOiBmYWxzZVxuICB9XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xuICAgIHN1cGVyKCk7XG4gICAgJC5leHRlbmQodGhpcywgVGlwLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgKz0gYCAke3ByZWZpeH1gO1xuICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9ICc8cCBjbGFzcz1cImRpYWxvZy1jb250ZW50LXRleHRcIj48L3A+JztcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWNvbnRlbnQtdGV4dCcpO1xuICB9XG4gIHNob3cob3B0aW9ucyA9IHt9KSB7XG4gICAgaWYoIXRoaXMubW91bnRlZCkgdGhpcy5tb3VudCgpO1xuICAgIHRoaXMuY29udGVudEhUTUwgPSBvcHRpb25zLmNvbnRlbnRIVE1MIHx8IHRoaXMuY29udGVudEhUTUw7XG4gICAgdGhpcy5jb250ZW50LmlubmVySFRNTCA9IHRoaXMuY29udGVudEhUTUw7XG4gICAgc3VwZXIuc2hvdygpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVySWQpO1xuICAgIHRoaXMudGltZXJJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSwgb3B0aW9ucy5kdXJhdGlvbiB8fCB0aGlzLmR1cmF0aW9uKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGlwO1xuIiwiY29uc3QgQmFzZSA9ICByZXF1aXJlKCcuL2Jhc2UnKTtcbmNvbnN0IGFwcGVuZFRvU2VsZWN0b3IgPSByZXF1aXJlKCcuL3V0aWxzJykuYXBwZW5kVG9TZWxlY3RvcjtcblxuY29uc3QgcHJlZml4ID0gJ21jLWRpYWxvZy10b2FzdCc7XG5cbmNsYXNzIFRvYXN0IGV4dGVuZHMgQmFzZSB7XG4gIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBjb250ZW50SFRNTDogJ1RoaXMgaXMgY29udGVudCEnLFxuICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgIHVzZU1hc2s6IGZhbHNlXG4gIH1cbiAgY29uc3RydWN0b3Iob3B0aW9ucyl7XG4gICAgc3VwZXIoKTtcbiAgICAkLmV4dGVuZCh0aGlzLCBUb2FzdC5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NOYW1lICs9IGAgJHtwcmVmaXh9YDtcbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSAnPHAgY2xhc3M9XCJkaWFsb2ctY29udGVudC10ZXh0XCI+PC9wPic7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLmRpYWxvZy1jb250ZW50LXRleHQnKTtcbiAgfVxuICBzaG93KG9wdGlvbnMgPSB7fSkge1xuICAgIGlmKCF0aGlzLm1vdW50ZWQpIHRoaXMubW91bnQoKTtcbiAgICB0aGlzLmNvbnRlbnRIVE1MID0gb3B0aW9ucy5jb250ZW50SFRNTCB8fCB0aGlzLmNvbnRlbnRIVE1MO1xuICAgIHRoaXMuY29udGVudC5pbm5lckhUTUwgPSB0aGlzLmNvbnRlbnRIVE1MO1xuICAgIHN1cGVyLnNob3coKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcklkKTtcbiAgICB0aGlzLnRpbWVySWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH0sIG9wdGlvbnMuZHVyYXRpb24gfHwgdGhpcy5kdXJhdGlvbilcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRvYXN0O1xuIiwiLyoqXG4gKiDnlJ/miJDllK/kuIA45L2NSURcbiAqIEB0eXBlIHtbdHlwZV19XG4gKi9cbmV4cG9ydHMudW5pcXVlSWQgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCBpZHMgPSBbXTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgaWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgtOCk7XG4gICAgaWYoaWRzLmluZGV4T2YoaWQpIDwgMCl7XG4gICAgICBpZHMucHVzaChpZCk7XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfWVsc2V7XG4gICAgICByZXR1cm4gdW5pcXVlSWQoKVxuICAgIH1cbiAgfTtcbn0pKCk7XG5cbi8qKlxuICog5bCG5LiA5Liq5a2X56ym5Liy5re75Yqg5Yiw5omA5pyJ6YCJ5oup5Zmo5ZCOXG4gKiBAcGFyYW0gIHtbdHlwZV19IHN0eWxlIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gc3RyICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBibG9vbiAgIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnRzLmFwcGVuZFRvU2VsZWN0b3IgPSBmdW5jdGlvbiAoc3R5bGUsIHN0ciwgdG9UYWlsKSB7XG4gIGlmKHR5cGVvZiBzdHlsZSA9PT0gJ3N0cmluZycpe1xuICAgIGxldCByZWcgPSAvW159XStbXFxzXSo/KD89XFxzKlxce1tcXHNcXFNdKikvZ207XG4gICAgaWYodG9UYWlsKXtcbiAgICAgIHJldHVybiBzdHlsZS5yZXBsYWNlKHJlZywgbWF0Y2ggPT4gYCR7bWF0Y2gudHJpbSgpfSR7c3RyfWApXG4gICAgfVxuICAgIHJldHVybiBzdHlsZS5yZXBsYWNlKHJlZywgbWF0Y2ggPT4gYCR7c3RyfSR7bWF0Y2gudHJpbSgpfWApXG4gIH1lbHNle1xuICAgIHRocm93ICdwbGVhc2UgcGFzcyBpbiBzdHlsZSBzaGVldCBzdHJpbmcnXG4gIH1cbn1cblxuLyoqXG4gKiDlsIbkuIDkuKrlrZfnrKbkuLJcbiAqIEBwYXJhbSAge1t0eXBlXX0gc3R5bGUgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBzdHIgICBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0cy5wcmVBcHBlbmRUb1NlbGVjdG9yID0gZnVuY3Rpb24gKHN0eWxlLCBzdHIpIHtcbiAgaWYodHlwZW9mIHN0eWxlID09PSAnc3RyaW5nJyl7XG4gICAgbGV0IHJlZyA9IC9bXn1dK1tcXHNdKj8oPz1cXHMqXFx7W1xcc1xcU10qKS9nbTtcbiAgICByZXR1cm4gc3R5bGUucmVwbGFjZShyZWcsIG1hdGNoID0+IG1hdGNoLnRyaW0oKSArIGBbJHtzdHJ9XWApXG4gIH1lbHNle1xuICAgIHRocm93ICdwbGVhc2UgcGFzcyBpbiBzdHlsZSBzaGVldCBzdHJpbmcnXG4gIH1cbn1cbiIsImNvbnN0IHByZWZpeCA9ICdtYy1pbWFnZS11cGxvYWRlcic7XG5cbmNvbnN0IGltYWdlVXBsb2FkZXJzID0gJChgLiR7cHJlZml4fWApO1xuXG5jb25zdCBub29wID0gKCkgPT4ge31cblxuY2xhc3MgSW1hZ2VVcGxvYWRlciB7XG4gIGNvbnN0cnVjdG9yKGRvbSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5pbWFnZVVwbG9hZGVyID0gJChkb20pO1xuXG4gICAgdGhpcy5waWN0dXJlTGlzdCA9IHRoaXMuaW1hZ2VVcGxvYWRlci5maW5kKGAuJHtwcmVmaXh9LWxpc3RgKTtcbiAgICB0aGlzLnBsYWNlaG9sZGVyRG9tID0gdGhpcy5pbWFnZVVwbG9hZGVyLmZpbmQoYC4ke3ByZWZpeH0tcGxhY2Vob2xkZXJgKTtcbiAgICB0aGlzLmlucHV0RG9tID0gJCgnPGlucHV0IHR5cGU9XCJmaWxlXCI+Jyk7XG5cbiAgICB0aGlzLml0ZW1Eb21zID0gW107XG4gICAgdGhpcy5maWxlTGlzdCA9IFtdO1xuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLm9wdGlvbnMub25DaGFuZ2UgPSB0aGlzLm9wdGlvbnMub25DaGFuZ2UgfHwgbm9vcDtcbiAgICB0aGlzLm9wdGlvbnMub25QcmV2aWV3ID0gdGhpcy5vcHRpb25zLm9uUHJldmlldyB8fCBub29wO1xuICAgIHRoaXMub3B0aW9ucy5vblJlbW92ZSA9IHRoaXMub3B0aW9ucy5vblJlbW92ZSB8fCBub29wO1xuXG4gICAgdGhpcy5vcHRpb25zLmdldEV4dHJhUGFyYW1zID0gdGhpcy5vcHRpb25zLmdldEV4dHJhUGFyYW1zO1xuXG4gICAgdGhpcy5yZW5kZXJUaHVtYm5haWwoKTtcbiAgICB0aGlzLmFkZExpc3RlbmVycygpO1xuICB9XG5cbiAgcGlja0ltYWdlKCkge1xuICAgIHRoaXMuaW5wdXREb20uYXR0cih7XG4gICAgICBhY2NlcHQ6ICdpbWFnZS8qJyxcbiAgICB9KTtcbiAgICB0aGlzLmlucHV0RG9tLnJlbW92ZUF0dHIoJ2NhcHR1cmUnKVxuICAgIHRoaXMuaW5wdXREb20udHJpZ2dlcignY2xpY2snKTtcbiAgfVxuXG4gIHBpY2tGaWxlKCkge1xuICAgIHRoaXMuaW5wdXREb21cbiAgICAgIC5yZW1vdmVBdHRyKCdhY2NlcHQnKVxuICAgICAgLnJlbW92ZUF0dHIoJ2NhcHR1cmUnKTtcbiAgICB0aGlzLmlucHV0RG9tLnRyaWdnZXIoJ2NsaWNrJyk7XG4gIH1cblxuICBwaWNrV2l0aENhbWVyYSgpIHtcbiAgICB0aGlzLmlucHV0RG9tLmF0dHIoe1xuICAgICAgYWNjZXB0OiAnaW1hZ2UvKicsXG4gICAgICBjYXB0dXJlOiAnY2FtZXJhJ1xuICAgIH0pO1xuICAgIHRoaXMuaW5wdXREb20udHJpZ2dlcignY2xpY2snKTtcbiAgfVxuXG4gIHJlYWRUaHVtYm5haWwoZmlsZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGUgPT4ge1xuICAgICAgICByZXNvbHZlKGUudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9XG4gICAgICByZWFkZXIub25lcnJvciA9IHJlamVjdDtcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyVGh1bWJuYWlsKCkge1xuICAgIHRoaXMucGljdHVyZUxpc3QuaHRtbChcbiAgICAgIHRoaXMuaXRlbURvbXMuY29uY2F0KCQoYDxzcGFuIGNsYXNzPVwiJHtwcmVmaXh9LXBsYWNlaG9sZGVyXCI+PC9zcGFuPmApKVxuICAgICk7XG4gIH1cblxuICBoYW5kbGVJbnB1dENoYW5nZShlKSB7XG4gICAgbGV0IGZpbGUgPSBlLnRhcmdldC5maWxlc1swXTtcbiAgICBpZiAoZmlsZSkge1xuICAgICAgdGhpcy5yZWFkVGh1bWJuYWlsKGZpbGUpXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xuXG4gICAgICAgICAgbGV0IHVwRmlsZU9iamVjdCA9IHtcbiAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICB0aHVtYm5haWw6IGRhdGEsXG4gICAgICAgICAgICBzdGF0dXM6ICd1cGxvYWRpbmcnLFxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBpc0ltYWdlID0gL15pbWFnZVxcLy4qLy50ZXN0KGZpbGUudHlwZSlcblxuICAgICAgICAgIHRoaXMuZmlsZUxpc3QgPSB0aGlzLmZpbGVMaXN0LmNvbmNhdCh1cEZpbGVPYmplY3QpO1xuXG4gICAgICAgICAgbGV0IHRodW1ibmFpbERvbSA9ICQoYDxzcGFuIGNsYXNzPVwiJHtwcmVmaXh9LWl0ZW1cIj5cbiAgICAgICAgICAgICAgJHtpc0ltYWdlP2A8aW1nIHNyYz1cIiR7dXBGaWxlT2JqZWN0LnRodW1ibmFpbH1cIiBhbHQ9XCJcIj5gOmA8c3BhbiBjbGFzcz0ke3ByZWZpeH0tZmlsZS1wbGFjZWhvbGRlcj48L3NwYW4+YH1cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCIke3ByZWZpeH0tcGVyY2VudGFnZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCIke3ByZWZpeH0tZmFpbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPGk+PC9pPlxuICAgICAgICAgICAgPC9zcGFuPmApO1xuXG4gICAgICAgICAgdGhpcy5pdGVtRG9tcyA9IHRoaXMuaXRlbURvbXMuY29uY2F0KHRodW1ibmFpbERvbSk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJUaHVtYm5haWwoKTtcbiAgICAgICAgICB0aGlzLnVwbG9hZEZpbGUodXBGaWxlT2JqZWN0LCB0aHVtYm5haWxEb20pO1xuICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdXBsb2FkRmlsZSh1cEZpbGVPYmplY3QsIHRodW1ibmFpbERvbSkge1xuICAgIGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZGF0YS5hcHBlbmQoXCJmaWxlXCIsIHVwRmlsZU9iamVjdC5maWxlKVxuXG4gICAgY29uc3QgZ2V0RXh0cmFQYXJhbXMgPSB0aGlzLm9wdGlvbnMuZ2V0RXh0cmFQYXJhbXM7XG4gICAgY29uc3QgZXh0cmFQYXJhbXMgPSBnZXRFeHRyYVBhcmFtcygpO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGV4dHJhUGFyYW1zKSB7XG4gICAgICBpZiAoZXh0cmFQYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZXh0cmFQYXJhbXNba2V5XTtcbiAgICAgICAgZGF0YS5hcHBlbmQoa2V5LCBlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBoYW5kbGVQcm9ncmVzcyA9IChlKSA9PiB7XG4gICAgICBpZiAoZS5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgIHRodW1ibmFpbERvbS5maW5kKGAuJHtwcmVmaXh9LXBlcmNlbnRhZ2VgKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIHRodW1ibmFpbERvbS5maW5kKGAuJHtwcmVmaXh9LXBlcmNlbnRhZ2VgKS5odG1sKE1hdGgucm91bmQoZS5sb2FkZWQgLyBlLnRvdGFsICogMTAwKSArIFwiJVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBoYW5kbGVVcGxvYWRTdWNjZXNzID0gKGUpID0+IHtcbiAgICAgIHVwRmlsZU9iamVjdC5zdGF0dXMgPSAnZG9uZSc7XG4gICAgICB0aHVtYm5haWxEb20uZmluZChgLiR7cHJlZml4fS1wZXJjZW50YWdlYCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgdGhpcy5vcHRpb25zLm9uQ2hhbmdlKHRoaXMuZmlsZUxpc3QpO1xuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsZVVwbG9hZEZhaWwgPSAoZSkgPT4ge1xuICAgICAgdXBGaWxlT2JqZWN0LnN0YXR1cyA9ICdlcnJvcic7XG4gICAgICB0aHVtYm5haWxEb20uZmluZChgLiR7cHJlZml4fS1mYWlsYCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgdGh1bWJuYWlsRG9tLmZpbmQoYC4ke3ByZWZpeH0tcGVyY2VudGFnZWApLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgIHRoaXMub3B0aW9ucy5vbkNoYW5nZSh0aGlzLmZpbGVMaXN0KTtcbiAgICB9XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgdXJsOiB0aGlzLm9wdGlvbnMuYWN0aW9uIHx8ICcnLFxuICAgICAgZGF0YSxcbiAgICAgIHhocjogKCkgPT4ge1xu44CA44CA44CA44CAIGxldCB4aHIgPSAkLmFqYXhTZXR0aW5ncy54aHIoKTtcbiAgICAgICAgdXBGaWxlT2JqZWN0LnhociA9IHhocjtcbuOAgOOAgOOAgOOAgCBpZih4aHIudXBsb2FkKSB7XG4gICAgICAgICAgeGhyLm9uZXJyb3IgPSBoYW5kbGVVcGxvYWRGYWlsO1xuICAgICAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzO1xuICDjgIDjgIDjgIAgfVxuICAgICAgICByZXR1cm4geGhyO1xuICAgIOOAgH0sXG4gICAgICBzdWNjZXNzOiAoZGF0YSwgc3RhdHVzLCB4aHIpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuanVkZ2VyICE9PSAnZnVuY3Rpb24nIHx8IHRoaXMub3B0aW9ucy5qdWRnZXIoZGF0YSkpIHtcbiAgICAgICAgICB1cEZpbGVPYmplY3QucmVzcG9uc2VEYXRhID0gZGF0YTtcbiAgICAgICAgICBoYW5kbGVVcGxvYWRTdWNjZXNzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGFuZGxlVXBsb2FkRmFpbCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXJyb3I6ICh4aHIsIGVycm9yVHlwZSwgZXJyb3IpID0+IHtcbiAgICAgICAgaGFuZGxlVXBsb2FkRmFpbCgpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVSZW1vdmVJdGVtKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBsZXQgY29udGV4dCA9IGUuZGF0YS5jb250ZXh0O1xuICAgIGxldCBpbmRleCA9ICQodGhpcykucGFyZW50KGAuJHtwcmVmaXh9LWl0ZW1gKS5pbmRleCgpO1xuICAgIGxldCBmaWxlID0gY29udGV4dC5maWxlTGlzdFtpbmRleF07XG4gICAgbGV0IGJlZm9yZVJlbW92ZSA9IGNvbnRleHQub3B0aW9ucy5iZWZvcmVSZW1vdmU7XG4gICAgbGV0IHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29udGV4dC5maWxlTGlzdFtpbmRleF0ueGhyLmFib3J0KCk7XG4gICAgICBjb250ZXh0Lml0ZW1Eb21zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICBjb250ZXh0LmZpbGVMaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICBjb250ZXh0Lm9wdGlvbnMub25DaGFuZ2UoY29udGV4dC5maWxlTGlzdCk7XG4gICAgICBjb250ZXh0Lm9wdGlvbnMub25SZW1vdmUoZmlsZSwgaW5kZXgsIGNvbnRleHQuZmlsZUxpc3QpXG4gICAgICBjb250ZXh0LnJlbmRlclRodW1ibmFpbCgpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGJlZm9yZVJlbW92ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYmVmb3JlUmVtb3ZlKGZpbGUsIGluZGV4LCBjb250ZXh0LmZpbGVMaXN0LCByZW1vdmUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlbW92ZSgpXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlUHJldmlldyhlKSB7XG4gICAgbGV0IGNvbnRleHQgPSBlLmRhdGEuY29udGV4dDtcbiAgICBsZXQgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XG4gICAgY29udGV4dC5vcHRpb25zLm9uUHJldmlldyhjb250ZXh0LmZpbGVMaXN0LCBpbmRleCk7XG4gIH1cblxuICBhZGRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY3VzdG9tVHJpZ2dlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5pbWFnZVVwbG9hZGVyLm9uKCdjbGljaycsIGAuJHtwcmVmaXh9LXBsYWNlaG9sZGVyYCwgb3B0aW9ucy5jdXN0b21UcmlnZ2VyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbWFnZVVwbG9hZGVyLm9uKCdjbGljaycsIGAuJHtwcmVmaXh9LXBsYWNlaG9sZGVyYCwgdGhpcy5oYW5kbGVQaWNrLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICB0aGlzLmlucHV0RG9tLm9uKCdjaGFuZ2UnLCB0aGlzLmhhbmRsZUlucHV0Q2hhbmdlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuaW1hZ2VVcGxvYWRlci5vbignY2xpY2snLCBgLiR7cHJlZml4fS1pdGVtYCx7XG4gICAgICBjb250ZXh0OiB0aGlzXG4gICAgfSwgdGhpcy5oYW5kbGVQcmV2aWV3KTtcblxuICAgIHRoaXMuaW1hZ2VVcGxvYWRlci5vbignY2xpY2snLCBgaWAsIHtcbiAgICAgIGNvbnRleHQ6IHRoaXNcbiAgICB9LCB0aGlzLmhhbmRsZVJlbW92ZUl0ZW0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VVcGxvYWRlcjtcblxuLy8gJC5lYWNoKGltYWdlVXBsb2FkZXJzLCAoaW5kZXgsIGltYWdlVXBsb2FkZXIpID0+IHtcbi8vICAgbmV3IEltYWdlVXBsb2FkZXIoaW1hZ2VVcGxvYWRlcikuaW5pdCgpXG4vLyB9KVxuIiwiLyohXG4gKiBtb2JpbGVTZWxlY3QuanNcbiAqIChjKSAyMDE3LXByZXNlbnQgb25seWhvbVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbigpIHtcblx0ZnVuY3Rpb24gZ2V0Q2xhc3MoZG9tLHN0cmluZykge1xuXHRcdHJldHVybiBkb20uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShzdHJpbmcpO1xuXHR9XG5cdC8v5p6E6YCg5ZmoXG5cdGZ1bmN0aW9uIE1vYmlsZVNlbGVjdChjb25maWcpIHtcblx0XHR0aGlzLm1vYmlsZVNlbGVjdDtcblx0XHR0aGlzLndoZWVsc0RhdGEgPSBjb25maWcud2hlZWxzO1xuXHRcdHRoaXMuanNvblR5cGUgPSAgZmFsc2U7XG5cdFx0dGhpcy5jYXNjYWRlSnNvbkRhdGEgPSBbXTtcblx0XHR0aGlzLmRpc3BsYXlKc29uID0gW107XG5cdFx0dGhpcy5jdXJWYWx1ZSA9IFtdO1xuXHRcdHRoaXMuY3VySW5kZXhBcnIgPSBbXTtcblx0XHR0aGlzLmNhc2NhZGUgPSBmYWxzZTtcblx0XHR0aGlzLnN0YXJ0WTtcblx0XHR0aGlzLm1vdmVFbmRZO1xuXHRcdHRoaXMubW92ZVk7XG5cdFx0dGhpcy5vbGRNb3ZlWTtcblx0XHR0aGlzLm9mZnNldCA9IDA7XG5cdFx0dGhpcy5vZmZzZXRTdW0gPSAwO1xuXHRcdHRoaXMub3ZlcnNpemVCb3JkZXI7XG5cdFx0dGhpcy5jdXJEaXN0YW5jZSA9IFtdO1xuXHRcdHRoaXMuY2xpY2tTdGF0dXMgPSBmYWxzZTtcblx0XHR0aGlzLmlzUEMgPSB0cnVlO1xuXHRcdHRoaXMuaW5pdChjb25maWcpO1xuXHR9XG5cdE1vYmlsZVNlbGVjdC5wcm90b3R5cGUgPSB7XG5cdFx0Y29uc3RydWN0b3I6IE1vYmlsZVNlbGVjdCxcblx0XHRpbml0OiBmdW5jdGlvbihjb25maWcpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdGlmKGNvbmZpZy53aGVlbHNbMF0uZGF0YS5sZW5ndGg9PTApe1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdtb2JpbGVTZWxlY3QgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGluc3RhbGxlZCwgYnV0IHRoZSBkYXRhIGlzIGVtcHR5IGFuZCBjYW5ub3QgYmUgaW5pdGlhbGl6ZWQuJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdF90aGlzLmtleU1hcCA9IGNvbmZpZy5rZXlNYXAgPyBjb25maWcua2V5TWFwIDoge2lkOidpZCcsIHZhbHVlOid2YWx1ZScsIGNoaWxkczonY2hpbGRzJ307XG5cdFx0XHRfdGhpcy5jaGVja0RhdGFUeXBlKCk7XG5cdFx0XHRfdGhpcy5yZW5kZXJXaGVlbHMoX3RoaXMud2hlZWxzRGF0YSwgY29uZmlnLmNhbmNlbEJ0blRleHQsIGNvbmZpZy5lbnN1cmVCdG5UZXh0KTtcblx0XHRcdF90aGlzLnRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbmZpZy50cmlnZ2VyKTtcblx0XHRcdGlmKCFfdGhpcy50cmlnZ2VyKXtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignbW9iaWxlU2VsZWN0IGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBpbnN0YWxsZWQsIGJ1dCBubyB0cmlnZ2VyIGZvdW5kIG9uIHlvdXIgcGFnZS4nKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0X3RoaXMud2hlZWwgPSBnZXRDbGFzcyhfdGhpcy5tb2JpbGVTZWxlY3QsJ3doZWVsJyk7XG5cdFx0XHRfdGhpcy5zbGlkZXIgPSBnZXRDbGFzcyhfdGhpcy5tb2JpbGVTZWxlY3QsJ3NlbGVjdENvbnRhaW5lcicpO1xuXHRcdFx0X3RoaXMud2hlZWxzID0gX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy53aGVlbHMnKTtcblx0XHRcdF90aGlzLmxpSGVpZ2h0ID0gX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJ2xpJykub2Zmc2V0SGVpZ2h0O1xuXHRcdFx0X3RoaXMuZW5zdXJlQnRuID0gX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy5lbnN1cmUnKTtcblx0XHRcdF90aGlzLmNhbmNlbEJ0biA9IF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcuY2FuY2VsJyk7XG5cdFx0XHRfdGhpcy5ncmF5TGF5ZXIgPSBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLmdyYXlMYXllcicpO1xuXHRcdFx0X3RoaXMucG9wVXAgPSBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLmNvbnRlbnQnKTtcblx0XHRcdF90aGlzLmNhbGxiYWNrID0gY29uZmlnLmNhbGxiYWNrIHx8IGZ1bmN0aW9uKCl7fTtcblx0XHRcdF90aGlzLmNhbmNlbCA9IGNvbmZpZy5jYW5jZWwgfHwgZnVuY3Rpb24oKXt9O1xuXHRcdFx0X3RoaXMudHJhbnNpdGlvbkVuZCA9IGNvbmZpZy50cmFuc2l0aW9uRW5kIHx8IGZ1bmN0aW9uKCl7fTtcblx0XHRcdF90aGlzLm9uU2hvdyA9IGNvbmZpZy5vblNob3cgfHwgZnVuY3Rpb24oKXt9O1xuXHRcdFx0X3RoaXMub25IaWRlID0gY29uZmlnLm9uSGlkZSB8fCBmdW5jdGlvbigpe307XG5cdFx0XHRfdGhpcy5pbml0UG9zaXRpb24gPSBjb25maWcucG9zaXRpb24gfHwgW107XG5cdFx0XHRfdGhpcy50aXRsZVRleHQgPSBjb25maWcudGl0bGUgfHwgJyc7XG5cdFx0XHRfdGhpcy5jb25uZWN0b3IgPSBjb25maWcuY29ubmVjdG9yIHx8ICcgJztcblx0XHRcdF90aGlzLnRyaWdnZXJEaXNwbGF5RGF0YSA9ICEodHlwZW9mKGNvbmZpZy50cmlnZ2VyRGlzcGxheURhdGEpPT0ndW5kZWZpbmVkJykgPyBjb25maWcudHJpZ2dlckRpc3BsYXlEYXRhIDogdHJ1ZTtcblx0XHRcdF90aGlzLnRyaWdnZXIuc3R5bGUuY3Vyc29yPSdwb2ludGVyJztcblx0XHRcdF90aGlzLnNldFN0eWxlKGNvbmZpZyk7XG5cdFx0XHRfdGhpcy5zZXRUaXRsZShfdGhpcy50aXRsZVRleHQpO1xuXHRcdFx0X3RoaXMuY2hlY2tJc1BDKCk7XG5cdFx0XHRfdGhpcy5jaGVja0Nhc2NhZGUoKTtcblx0XHRcdF90aGlzLmFkZExpc3RlbmVyQWxsKCk7XG5cblx0XHRcdGlmIChfdGhpcy5jYXNjYWRlKSB7XG5cdFx0XHRcdF90aGlzLmluaXRDYXNjYWRlKCk7XG5cdFx0XHR9XG5cdFx0XHQvL+WumuS9jSDliJ3lp4vkvY3nva5cblx0XHRcdGlmKF90aGlzLmluaXRQb3NpdGlvbi5sZW5ndGggPCBfdGhpcy5zbGlkZXIubGVuZ3RoKXtcblx0XHRcdFx0dmFyIGRpZmYgPSBfdGhpcy5zbGlkZXIubGVuZ3RoIC0gX3RoaXMuaW5pdFBvc2l0aW9uLmxlbmd0aDtcblx0XHRcdFx0Zm9yKHZhciBpPTA7IGk8ZGlmZjsgaSsrKXtcblx0XHRcdFx0XHRfdGhpcy5pbml0UG9zaXRpb24ucHVzaCgwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRfdGhpcy5zZXRDdXJEaXN0YW5jZShfdGhpcy5pbml0UG9zaXRpb24pO1xuXG5cblx0XHRcdC8v5oyJ6ZKu55uR5ZCsXG5cdFx0XHRfdGhpcy5jYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdF90aGlzLmhpZGUoKTtcblx0XHRcdFx0X3RoaXMuY2FuY2VsKF90aGlzLmN1ckluZGV4QXJyLCBfdGhpcy5jdXJWYWx1ZSk7XG5cdFx0ICAgIH0pO1xuXG5cdFx0ICAgIF90aGlzLmVuc3VyZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24oKXtcblx0XHRcdFx0X3RoaXMuaGlkZSgpO1xuXHRcdFx0ICAgIGlmKCFfdGhpcy5saUhlaWdodCkge1xuXHRcdFx0ICAgICAgICBfdGhpcy5saUhlaWdodCA9ICBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignbGknKS5vZmZzZXRIZWlnaHQ7XG5cdFx0XHQgICAgfVxuXHRcdFx0XHR2YXIgdGVtcFZhbHVlID0nJztcblx0XHQgICAgXHRmb3IodmFyIGk9MDsgaTxfdGhpcy53aGVlbC5sZW5ndGg7IGkrKyl7XG5cdFx0ICAgIFx0XHRpPT1fdGhpcy53aGVlbC5sZW5ndGgtMSA/IHRlbXBWYWx1ZSArPSBfdGhpcy5nZXRJbm5lckh0bWwoaSkgOiB0ZW1wVmFsdWUgKz0gX3RoaXMuZ2V0SW5uZXJIdG1sKGkpICsgX3RoaXMuY29ubmVjdG9yO1xuXHRcdCAgICBcdH1cblx0XHQgICAgXHRpZihfdGhpcy50cmlnZ2VyRGlzcGxheURhdGEpe1xuXHRcdCAgICBcdFx0X3RoaXMudHJpZ2dlci5pbm5lckhUTUwgPSB0ZW1wVmFsdWU7XG5cdFx0ICAgIFx0fVxuXHRcdCAgICBcdF90aGlzLmN1ckluZGV4QXJyID0gX3RoaXMuZ2V0SW5kZXhBcnIoKTtcblx0XHQgICAgXHRfdGhpcy5jdXJWYWx1ZSA9IF90aGlzLmdldEN1clZhbHVlKCk7XG5cdFx0ICAgIFx0X3RoaXMuY2FsbGJhY2soX3RoaXMuY3VySW5kZXhBcnIsIF90aGlzLmN1clZhbHVlKTtcblx0XHQgICAgfSk7XG5cblx0XHQgICAgX3RoaXMudHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24oKXtcblx0XHQgICAgXHRfdGhpcy5zaG93KCk7XG5cdFx0ICAgIH0pO1xuXHRcdCAgICBfdGhpcy5ncmF5TGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdF90aGlzLmhpZGUoKTtcblx0XHRcdFx0X3RoaXMuY2FuY2VsKF90aGlzLmN1ckluZGV4QXJyLCBfdGhpcy5jdXJWYWx1ZSk7XG5cdFx0ICAgIH0pO1xuXHRcdCAgICBfdGhpcy5wb3BVcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24oKXtcblx0XHQgICAgXHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHQgICAgfSk7XG5cblx0XHRcdF90aGlzLmZpeFJvd1N0eWxlKCk7IC8v5L+u5q2j5YiX5pWwXG5cdFx0fSxcblxuXHRcdHNldFRpdGxlOiBmdW5jdGlvbihzdHJpbmcpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdF90aGlzLnRpdGxlVGV4dCA9IHN0cmluZztcblx0XHRcdF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5pbm5lckhUTUwgPSBfdGhpcy50aXRsZVRleHQ7XG5cdFx0fSxcblxuXHRcdHNldFN0eWxlOiBmdW5jdGlvbihjb25maWcpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdGlmKGNvbmZpZy5lbnN1cmVCdG5Db2xvcil7XG5cdFx0XHRcdF90aGlzLmVuc3VyZUJ0bi5zdHlsZS5jb2xvciA9IGNvbmZpZy5lbnN1cmVCdG5Db2xvcjtcblx0XHRcdH1cblx0XHRcdGlmKGNvbmZpZy5jYW5jZWxCdG5Db2xvcil7XG5cdFx0XHRcdF90aGlzLmNhbmNlbEJ0bi5zdHlsZS5jb2xvciA9IGNvbmZpZy5jYW5jZWxCdG5Db2xvcjtcblx0XHRcdH1cblx0XHRcdGlmKGNvbmZpZy50aXRsZUNvbG9yKXtcblx0XHRcdFx0X3RoaXMudGl0bGUgPSBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLnRpdGxlJyk7XG5cdFx0XHRcdF90aGlzLnRpdGxlLnN0eWxlLmNvbG9yID0gY29uZmlnLnRpdGxlQ29sb3I7XG5cdFx0XHR9XG5cdFx0XHRpZihjb25maWcudGV4dENvbG9yKXtcblx0XHRcdFx0X3RoaXMucGFuZWwgPSBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLnBhbmVsJyk7XG5cdFx0XHRcdF90aGlzLnBhbmVsLnN0eWxlLmNvbG9yID0gY29uZmlnLnRleHRDb2xvcjtcblx0XHRcdH1cblx0XHRcdGlmKGNvbmZpZy50aXRsZUJnQ29sb3Ipe1xuXHRcdFx0XHRfdGhpcy5idG5CYXIgPSBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLmJ0bkJhcicpO1xuXHRcdFx0XHRfdGhpcy5idG5CYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29uZmlnLnRpdGxlQmdDb2xvcjtcblx0XHRcdH1cblx0XHRcdGlmKGNvbmZpZy5iZ0NvbG9yKXtcblx0XHRcdFx0X3RoaXMucGFuZWwgPSBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLnBhbmVsJyk7XG5cdFx0XHRcdF90aGlzLnNoYWRvd01hc2sgPSBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLnNoYWRvd01hc2snKTtcblx0XHRcdFx0X3RoaXMucGFuZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29uZmlnLmJnQ29sb3I7XG5cdFx0XHRcdF90aGlzLnNoYWRvd01hc2suc3R5bGUuYmFja2dyb3VuZCA9ICdsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCAnKyBjb25maWcuYmdDb2xvciArICcsIHJnYmEoMjU1LCAyNTUsIDI1NSwgMCksICcrIGNvbmZpZy5iZ0NvbG9yICsgJyknO1xuXHRcdFx0fVxuXHRcdFx0aWYoIWlzTmFOKGNvbmZpZy5tYXNrT3BhY2l0eSkpe1xuXHRcdFx0XHRfdGhpcy5ncmF5TWFzayA9IF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcuZ3JheUxheWVyJyk7XG5cdFx0XHRcdF90aGlzLmdyYXlNYXNrLnN0eWxlLmJhY2tncm91bmQgPSAncmdiYSgwLCAwLCAwLCAnKyBjb25maWcubWFza09wYWNpdHkgKycpJztcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Y2hlY2tJc1BDOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdHZhciBzVXNlckFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0dmFyIGJJc0lwYWQgPSBzVXNlckFnZW50Lm1hdGNoKC9pcGFkL2kpID09IFwiaXBhZFwiO1xuXHRcdFx0dmFyIGJJc0lwaG9uZU9zID0gc1VzZXJBZ2VudC5tYXRjaCgvaXBob25lIG9zL2kpID09IFwiaXBob25lIG9zXCI7XG5cdFx0XHR2YXIgYklzTWlkcCA9IHNVc2VyQWdlbnQubWF0Y2goL21pZHAvaSkgPT0gXCJtaWRwXCI7XG5cdFx0XHR2YXIgYklzVWM3ID0gc1VzZXJBZ2VudC5tYXRjaCgvcnY6MS4yLjMuNC9pKSA9PSBcInJ2OjEuMi4zLjRcIjtcblx0XHRcdHZhciBiSXNVYyA9IHNVc2VyQWdlbnQubWF0Y2goL3Vjd2ViL2kpID09IFwidWN3ZWJcIjtcblx0XHRcdHZhciBiSXNBbmRyb2lkID0gc1VzZXJBZ2VudC5tYXRjaCgvYW5kcm9pZC9pKSA9PSBcImFuZHJvaWRcIjtcblx0XHRcdHZhciBiSXNDRSA9IHNVc2VyQWdlbnQubWF0Y2goL3dpbmRvd3MgY2UvaSkgPT0gXCJ3aW5kb3dzIGNlXCI7XG5cdFx0XHR2YXIgYklzV00gPSBzVXNlckFnZW50Lm1hdGNoKC93aW5kb3dzIG1vYmlsZS9pKSA9PSBcIndpbmRvd3MgbW9iaWxlXCI7XG5cdFx0XHRpZiAoKGJJc0lwYWQgfHwgYklzSXBob25lT3MgfHwgYklzTWlkcCB8fCBiSXNVYzcgfHwgYklzVWMgfHwgYklzQW5kcm9pZCB8fCBiSXNDRSB8fCBiSXNXTSkpIHtcblx0XHRcdCAgICBfdGhpcy5pc1BDID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSxcblxuIFx0XHRzaG93OiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5tb2JpbGVTZWxlY3QuY2xhc3NMaXN0LmFkZCgnbW9iaWxlU2VsZWN0LXNob3cnKTtcblx0XHRcdGlmICh0eXBlb2YgdGhpcy5vblNob3cgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0dGhpcy5vblNob3codGhpcyk7XG5cdFx0XHR9XG4gIFx0XHR9LFxuXG5cdCAgICBoaWRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMubW9iaWxlU2VsZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ21vYmlsZVNlbGVjdC1zaG93Jyk7XG5cdFx0XHRpZiAodHlwZW9mIHRoaXMub25IaWRlID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRoaXMub25IaWRlKHRoaXMpO1xuXHRcdFx0fVxuXHQgICAgfSxcblxuXHRcdHJlbmRlcldoZWVsczogZnVuY3Rpb24od2hlZWxzRGF0YSwgY2FuY2VsQnRuVGV4dCwgZW5zdXJlQnRuVGV4dCl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0dmFyIGNhbmNlbFRleHQgPSBjYW5jZWxCdG5UZXh0ID8gY2FuY2VsQnRuVGV4dCA6ICflj5bmtognO1xuXHRcdFx0dmFyIGVuc3VyZVRleHQgPSBlbnN1cmVCdG5UZXh0ID8gZW5zdXJlQnRuVGV4dCA6ICfnoa7orqQnO1xuXHRcdFx0X3RoaXMubW9iaWxlU2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdF90aGlzLm1vYmlsZVNlbGVjdC5jbGFzc05hbWUgPSBcIm1vYmlsZVNlbGVjdFwiO1xuXHRcdFx0X3RoaXMubW9iaWxlU2VsZWN0LmlubmVySFRNTCA9XG5cdFx0ICAgIFx0JzxkaXYgY2xhc3M9XCJncmF5TGF5ZXJcIj48L2Rpdj4nK1xuXHRcdCAgICAgICAgJzxkaXYgY2xhc3M9XCJjb250ZW50XCI+Jytcblx0XHQgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJ0bkJhclwiPicrXG5cdFx0ICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZml4V2lkdGhcIj4nK1xuXHRcdCAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjYW5jZWxcIj4nKyBjYW5jZWxUZXh0ICsnPC9kaXY+Jytcblx0XHQgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwidGl0bGVcIj48L2Rpdj4nK1xuXHRcdCAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJlbnN1cmVcIj4nKyBlbnN1cmVUZXh0ICsnPC9kaXY+Jytcblx0XHQgICAgICAgICAgICAgICAgJzwvZGl2PicrXG5cdFx0ICAgICAgICAgICAgJzwvZGl2PicrXG5cdFx0ICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwYW5lbFwiPicrXG5cdFx0ICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZml4V2lkdGhcIj4nK1xuXHRcdCAgICAgICAgICAgICAgICBcdCc8ZGl2IGNsYXNzPVwid2hlZWxzXCI+Jytcblx0XHRcdCAgICAgICAgICAgICAgICAnPC9kaXY+Jytcblx0XHQgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic2VsZWN0TGluZVwiPjwvZGl2PicrXG5cdFx0ICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNoYWRvd01hc2tcIj48L2Rpdj4nK1xuXHRcdCAgICAgICAgICAgICAgICAnPC9kaXY+Jytcblx0XHQgICAgICAgICAgICAnPC9kaXY+Jytcblx0XHQgICAgICAgICc8L2Rpdj4nO1xuXHRcdCAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF90aGlzLm1vYmlsZVNlbGVjdCk7XG5cblx0XHRcdC8v5qC55o2u5pWw5o2u6ZW/5bqm5p2l5riy5p+TXG5cblx0XHRcdHZhciB0ZW1wSFRNTD0nJztcblx0XHRcdGZvcih2YXIgaT0wOyBpPHdoZWVsc0RhdGEubGVuZ3RoOyBpKyspe1xuXHRcdFx0Ly/liJdcblx0XHRcdFx0dGVtcEhUTUwgKz0gJzxkaXYgY2xhc3M9XCJ3aGVlbFwiPjx1bCBjbGFzcz1cInNlbGVjdENvbnRhaW5lclwiPic7XG5cdFx0XHRcdGlmKF90aGlzLmpzb25UeXBlKXtcblx0XHRcdFx0XHRmb3IodmFyIGo9MDsgajx3aGVlbHNEYXRhW2ldLmRhdGEubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHRcdC8v6KGMXG5cdFx0XHRcdFx0XHR0ZW1wSFRNTCArPSAnPGxpIGRhdGEtaWQ9XCInK3doZWVsc0RhdGFbaV0uZGF0YVtqXVtfdGhpcy5rZXlNYXAuaWRdKydcIj4nK3doZWVsc0RhdGFbaV0uZGF0YVtqXVtfdGhpcy5rZXlNYXAudmFsdWVdKyc8L2xpPic7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRmb3IodmFyIGo9MDsgajx3aGVlbHNEYXRhW2ldLmRhdGEubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHRcdC8v6KGMXG5cdFx0XHRcdFx0XHR0ZW1wSFRNTCArPSAnPGxpPicrd2hlZWxzRGF0YVtpXS5kYXRhW2pdKyc8L2xpPic7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRlbXBIVE1MICs9ICc8L3VsPjwvZGl2Pic7XG5cdFx0XHR9XG5cdFx0XHRfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLndoZWVscycpLmlubmVySFRNTCA9IHRlbXBIVE1MO1xuXHRcdH0sXG5cblx0XHRhZGRMaXN0ZW5lckFsbDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRmb3IodmFyIGk9MDsgaTxfdGhpcy5zbGlkZXIubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHQvL+aJi+WKv+ebkeWQrFxuXHRcdFx0XHQoZnVuY3Rpb24gKGkpIHtcblx0XHRcdFx0XHRfdGhpcy5hZGRMaXN0ZW5lcldoZWVsKF90aGlzLndoZWVsW2ldLCBpKTtcblx0XHRcdFx0fSkoaSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGFkZExpc3RlbmVyV2hlZWw6IGZ1bmN0aW9uKHRoZVdoZWVsLCBpbmRleCl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0dGhlV2hlZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0X3RoaXMudG91Y2goZXZlbnQsIHRoaXMuZmlyc3RDaGlsZCwgaW5kZXgpO1xuXHRcdFx0fSxmYWxzZSk7XG5cdFx0XHR0aGVXaGVlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0X3RoaXMudG91Y2goZXZlbnQsIHRoaXMuZmlyc3RDaGlsZCwgaW5kZXgpO1xuXHRcdFx0fSxmYWxzZSk7XG5cdFx0XHR0aGVXaGVlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdF90aGlzLnRvdWNoKGV2ZW50LCB0aGlzLmZpcnN0Q2hpbGQsIGluZGV4KTtcblx0XHRcdH0sZmFsc2UpO1xuXG5cdFx0XHRpZihfdGhpcy5pc1BDKXtcblx0XHRcdFx0Ly/lpoLmnpzmmK9QQ+err+WImeWGjeWinuWKoOaLluaLveebkeWQrCDmlrnkvr/osIPor5Vcblx0XHRcdFx0dGhlV2hlZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdF90aGlzLmRyYWdDbGljayhldmVudCwgdGhpcy5maXJzdENoaWxkLCBpbmRleCk7XG5cdFx0XHRcdH0sZmFsc2UpO1xuXHRcdFx0XHR0aGVXaGVlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0X3RoaXMuZHJhZ0NsaWNrKGV2ZW50LCB0aGlzLmZpcnN0Q2hpbGQsIGluZGV4KTtcblx0XHRcdFx0fSxmYWxzZSk7XG5cdFx0XHRcdHRoZVdoZWVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0X3RoaXMuZHJhZ0NsaWNrKGV2ZW50LCB0aGlzLmZpcnN0Q2hpbGQsIGluZGV4KTtcblx0XHRcdFx0fSx0cnVlKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Y2hlY2tEYXRhVHlwZTogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRpZih0eXBlb2YoX3RoaXMud2hlZWxzRGF0YVswXS5kYXRhWzBdKT09J29iamVjdCcpe1xuXHRcdFx0XHRfdGhpcy5qc29uVHlwZSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGNoZWNrQ2FzY2FkZTogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRpZihfdGhpcy5qc29uVHlwZSl7XG5cdFx0XHRcdHZhciBub2RlID0gX3RoaXMud2hlZWxzRGF0YVswXS5kYXRhO1xuXHRcdFx0XHRmb3IodmFyIGk9MDsgaTxub2RlLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRpZihfdGhpcy5rZXlNYXAuY2hpbGRzIGluIG5vZGVbaV0gJiYgbm9kZVtpXVtfdGhpcy5rZXlNYXAuY2hpbGRzXS5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRcdF90aGlzLmNhc2NhZGUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0X3RoaXMuY2FzY2FkZUpzb25EYXRhID0gX3RoaXMud2hlZWxzRGF0YVswXS5kYXRhO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0X3RoaXMuY2FzY2FkZSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRnZW5lcmF0ZUFyckRhdGE6IGZ1bmN0aW9uICh0YXJnZXRBcnIpIHtcblx0XHRcdHZhciB0ZW1wQXJyID0gW107XG5cdFx0XHR2YXIga2V5TWFwX2lkID0gdGhpcy5rZXlNYXAuaWQ7XG5cdFx0XHR2YXIga2V5TWFwX3ZhbHVlID0gdGhpcy5rZXlNYXAudmFsdWU7XG5cdFx0XHRmb3IodmFyIGk9MDsgaTx0YXJnZXRBcnIubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHR2YXIgdGVtcE9iaiA9IHt9O1xuXHRcdFx0XHR0ZW1wT2JqW2tleU1hcF9pZF0gPSB0YXJnZXRBcnJbaV1bdGhpcy5rZXlNYXAuaWRdO1xuXHRcdFx0XHR0ZW1wT2JqW2tleU1hcF92YWx1ZV0gPSB0YXJnZXRBcnJbaV1bdGhpcy5rZXlNYXAudmFsdWVdO1xuXHRcdFx0XHR0ZW1wQXJyLnB1c2godGVtcE9iaik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGVtcEFycjtcblx0XHR9LFxuXG5cdFx0aW5pdENhc2NhZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0X3RoaXMuZGlzcGxheUpzb24ucHVzaChfdGhpcy5nZW5lcmF0ZUFyckRhdGEoX3RoaXMuY2FzY2FkZUpzb25EYXRhKSk7XG5cdFx0XHRpZihfdGhpcy5pbml0UG9zaXRpb24ubGVuZ3RoPjApe1xuXHRcdFx0XHRfdGhpcy5pbml0RGVlcENvdW50ID0gMDtcblx0XHRcdFx0X3RoaXMuaW5pdENoZWNrQXJyRGVlcChfdGhpcy5jYXNjYWRlSnNvbkRhdGFbX3RoaXMuaW5pdFBvc2l0aW9uWzBdXSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0X3RoaXMuY2hlY2tBcnJEZWVwKF90aGlzLmNhc2NhZGVKc29uRGF0YVswXSk7XG5cdFx0XHR9XG5cdFx0XHRfdGhpcy5yZVJlbmRlcldoZWVscygpO1xuXHRcdH0sXG5cblx0XHRpbml0Q2hlY2tBcnJEZWVwOiBmdW5jdGlvbiAocGFyZW50KSB7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0aWYocGFyZW50KXtcblx0XHRcdFx0aWYgKF90aGlzLmtleU1hcC5jaGlsZHMgaW4gcGFyZW50ICYmIHBhcmVudFtfdGhpcy5rZXlNYXAuY2hpbGRzXS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0X3RoaXMuZGlzcGxheUpzb24ucHVzaChfdGhpcy5nZW5lcmF0ZUFyckRhdGEocGFyZW50W190aGlzLmtleU1hcC5jaGlsZHNdKSk7XG5cdFx0XHRcdFx0X3RoaXMuaW5pdERlZXBDb3VudCsrO1xuXHRcdFx0XHRcdHZhciBuZXh0Tm9kZSA9IHBhcmVudFtfdGhpcy5rZXlNYXAuY2hpbGRzXVtfdGhpcy5pbml0UG9zaXRpb25bX3RoaXMuaW5pdERlZXBDb3VudF1dO1xuXHRcdFx0XHRcdGlmKG5leHROb2RlKXtcblx0XHRcdFx0XHRcdF90aGlzLmluaXRDaGVja0FyckRlZXAobmV4dE5vZGUpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0X3RoaXMuY2hlY2tBcnJEZWVwKHBhcmVudFtfdGhpcy5rZXlNYXAuY2hpbGRzXVswXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGNoZWNrQXJyRGVlcDogZnVuY3Rpb24gKHBhcmVudCkge1xuXHRcdFx0Ly/mo4DmtYvlrZDoioLngrnmt7HluqYgIOS/ruaUuSBkaXNwbGF5SnNvblxuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdGlmKHBhcmVudCl7XG5cdFx0XHRcdGlmIChfdGhpcy5rZXlNYXAuY2hpbGRzIGluIHBhcmVudCAmJiBwYXJlbnRbX3RoaXMua2V5TWFwLmNoaWxkc10ubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdF90aGlzLmRpc3BsYXlKc29uLnB1c2goX3RoaXMuZ2VuZXJhdGVBcnJEYXRhKHBhcmVudFtfdGhpcy5rZXlNYXAuY2hpbGRzXSkpOyAvL+eUn+aIkOWtkOiKgueCueaVsOe7hFxuXHRcdFx0XHRcdF90aGlzLmNoZWNrQXJyRGVlcChwYXJlbnRbX3RoaXMua2V5TWFwLmNoaWxkc11bMF0pOy8v5qOA5rWL5LiL5LiA5Liq5a2Q6IqC54K5XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Y2hlY2tSYW5nZTogZnVuY3Rpb24oaW5kZXgsIHBvc0luZGV4QXJyKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHR2YXIgZGVsZXRlTnVtID0gX3RoaXMuZGlzcGxheUpzb24ubGVuZ3RoLTEtaW5kZXg7XG5cdFx0XHRmb3IodmFyIGk9MDsgaTxkZWxldGVOdW07IGkrKyl7XG5cdFx0XHRcdF90aGlzLmRpc3BsYXlKc29uLnBvcCgpOyAvL+S/ruaUuSBkaXNwbGF5SnNvblxuXHRcdFx0fVxuXHRcdFx0dmFyIHJlc3VsdE5vZGU7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBpbmRleDsgaSsrKXtcblx0XHRcdFx0aWYgKGkgPT0gMClcblx0XHRcdFx0XHRyZXN1bHROb2RlID0gX3RoaXMuY2FzY2FkZUpzb25EYXRhW3Bvc0luZGV4QXJyWzBdXTtcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cmVzdWx0Tm9kZSA9IHJlc3VsdE5vZGVbX3RoaXMua2V5TWFwLmNoaWxkc11bcG9zSW5kZXhBcnJbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRfdGhpcy5jaGVja0FyckRlZXAocmVzdWx0Tm9kZSk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKF90aGlzLmRpc3BsYXlKc29uKTtcblx0XHRcdF90aGlzLnJlUmVuZGVyV2hlZWxzKCk7XG5cdFx0XHRfdGhpcy5maXhSb3dTdHlsZSgpO1xuXHRcdFx0X3RoaXMuc2V0Q3VyRGlzdGFuY2UoX3RoaXMucmVzZXRQb3NpdGlvbihpbmRleCwgcG9zSW5kZXhBcnIpKTtcblx0XHR9LFxuXG5cdFx0cmVzZXRQb3NpdGlvbjogZnVuY3Rpb24oaW5kZXgsIHBvc0luZGV4QXJyKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHR2YXIgdGVtcFBvc0FyciA9IHBvc0luZGV4QXJyO1xuXHRcdFx0dmFyIHRlbXBDb3VudDtcblx0XHRcdGlmKF90aGlzLnNsaWRlci5sZW5ndGggPiBwb3NJbmRleEFyci5sZW5ndGgpe1xuXHRcdFx0XHR0ZW1wQ291bnQgPSBfdGhpcy5zbGlkZXIubGVuZ3RoIC0gcG9zSW5kZXhBcnIubGVuZ3RoO1xuXHRcdFx0XHRmb3IodmFyIGk9MDsgaTx0ZW1wQ291bnQ7IGkrKyl7XG5cdFx0XHRcdFx0dGVtcFBvc0Fyci5wdXNoKDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZSBpZihfdGhpcy5zbGlkZXIubGVuZ3RoIDwgcG9zSW5kZXhBcnIubGVuZ3RoKXtcblx0XHRcdFx0dGVtcENvdW50ID0gcG9zSW5kZXhBcnIubGVuZ3RoIC0gX3RoaXMuc2xpZGVyLmxlbmd0aDtcblx0XHRcdFx0Zm9yKHZhciBpPTA7IGk8dGVtcENvdW50OyBpKyspe1xuXHRcdFx0XHRcdHRlbXBQb3NBcnIucG9wKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGZvcih2YXIgaT1pbmRleCsxOyBpPCB0ZW1wUG9zQXJyLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0dGVtcFBvc0FycltpXSA9IDA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGVtcFBvc0Fycjtcblx0XHR9LFxuXHRcdHJlUmVuZGVyV2hlZWxzOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdC8v5Yig6Zmk5aSa5L2Z55qEd2hlZWxcblx0XHRcdGlmKF90aGlzLndoZWVsLmxlbmd0aCA+IF90aGlzLmRpc3BsYXlKc29uLmxlbmd0aCl7XG5cdFx0XHRcdHZhciBjb3VudCA9IF90aGlzLndoZWVsLmxlbmd0aCAtIF90aGlzLmRpc3BsYXlKc29uLmxlbmd0aDtcblx0XHRcdFx0Zm9yKHZhciBpPTA7IGk8Y291bnQ7IGkrKyl7XG5cdFx0XHRcdFx0X3RoaXMud2hlZWxzLnJlbW92ZUNoaWxkKF90aGlzLndoZWVsW190aGlzLndoZWVsLmxlbmd0aC0xXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGZvcih2YXIgaT0wOyBpPF90aGlzLmRpc3BsYXlKc29uLmxlbmd0aDsgaSsrKXtcblx0XHRcdC8v5YiXXG5cdFx0XHRcdChmdW5jdGlvbiAoaSkge1xuXHRcdFx0XHRcdHZhciB0ZW1wSFRNTD0nJztcblx0XHRcdFx0XHRpZihfdGhpcy53aGVlbFtpXSl7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCfmj5LlhaVMaScpO1xuXHRcdFx0XHRcdFx0Zm9yKHZhciBqPTA7IGo8X3RoaXMuZGlzcGxheUpzb25baV0ubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHRcdFx0Ly/ooYxcblx0XHRcdFx0XHRcdFx0dGVtcEhUTUwgKz0gJzxsaSBkYXRhLWlkPVwiJytfdGhpcy5kaXNwbGF5SnNvbltpXVtqXVtfdGhpcy5rZXlNYXAuaWRdKydcIj4nK190aGlzLmRpc3BsYXlKc29uW2ldW2pdW190aGlzLmtleU1hcC52YWx1ZV0rJzwvbGk+Jztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdF90aGlzLnNsaWRlcltpXS5pbm5lckhUTUwgPSB0ZW1wSFRNTDtcblxuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0dmFyIHRlbXBXaGVlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRcdFx0XHR0ZW1wV2hlZWwuY2xhc3NOYW1lID0gXCJ3aGVlbFwiO1xuXHRcdFx0XHRcdFx0dGVtcEhUTUwgPSAnPHVsIGNsYXNzPVwic2VsZWN0Q29udGFpbmVyXCI+Jztcblx0XHRcdFx0XHRcdGZvcih2YXIgaj0wOyBqPF90aGlzLmRpc3BsYXlKc29uW2ldLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0XHRcdC8v6KGMXG5cdFx0XHRcdFx0XHRcdHRlbXBIVE1MICs9ICc8bGkgZGF0YS1pZD1cIicrX3RoaXMuZGlzcGxheUpzb25baV1bal1bX3RoaXMua2V5TWFwLmlkXSsnXCI+JytfdGhpcy5kaXNwbGF5SnNvbltpXVtqXVtfdGhpcy5rZXlNYXAudmFsdWVdKyc8L2xpPic7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0ZW1wSFRNTCArPSAnPC91bD4nO1xuXHRcdFx0XHRcdFx0dGVtcFdoZWVsLmlubmVySFRNTCA9IHRlbXBIVE1MO1xuXG5cdFx0XHRcdFx0XHRfdGhpcy5hZGRMaXN0ZW5lcldoZWVsKHRlbXBXaGVlbCwgaSk7XG5cdFx0XHRcdCAgICBcdF90aGlzLndoZWVscy5hcHBlbmRDaGlsZCh0ZW1wV2hlZWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL190aGlzLsK3KGkpO1xuXHRcdFx0XHR9KShpKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0dXBkYXRlV2hlZWxzOmZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdGlmKF90aGlzLmNhc2NhZGUpe1xuXHRcdFx0XHRfdGhpcy5jYXNjYWRlSnNvbkRhdGEgPSBkYXRhO1xuXHRcdFx0XHRfdGhpcy5kaXNwbGF5SnNvbiA9IFtdO1xuXHRcdFx0XHRfdGhpcy5pbml0Q2FzY2FkZSgpO1xuXHRcdFx0XHRpZihfdGhpcy5pbml0UG9zaXRpb24ubGVuZ3RoIDwgX3RoaXMuc2xpZGVyLmxlbmd0aCl7XG5cdFx0XHRcdFx0dmFyIGRpZmYgPSBfdGhpcy5zbGlkZXIubGVuZ3RoIC0gX3RoaXMuaW5pdFBvc2l0aW9uLmxlbmd0aDtcblx0XHRcdFx0XHRmb3IodmFyIGk9MDsgaTxkaWZmOyBpKyspe1xuXHRcdFx0XHRcdFx0X3RoaXMuaW5pdFBvc2l0aW9uLnB1c2goMCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdF90aGlzLnNldEN1ckRpc3RhbmNlKF90aGlzLmluaXRQb3NpdGlvbik7XG5cdFx0XHRcdF90aGlzLmZpeFJvd1N0eWxlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHVwZGF0ZVdoZWVsOiBmdW5jdGlvbihzbGlkZXJJbmRleCwgZGF0YSl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0dmFyIHRlbXBIVE1MPScnO1xuXHQgICAgXHRpZihfdGhpcy5jYXNjYWRlKXtcblx0ICAgIFx0XHRjb25zb2xlLmVycm9yKCfnuqfogZTmoLzlvI/kuI3mlK/mjIF1cGRhdGVXaGVlbCgpLOivt+S9v+eUqHVwZGF0ZVdoZWVscygp5pu05paw5pW05Liq5pWw5o2u5rqQJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0ICAgIFx0fVxuXHQgICAgXHRlbHNlIGlmKF90aGlzLmpzb25UeXBlKXtcblx0XHRcdFx0Zm9yKHZhciBqPTA7IGo8ZGF0YS5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdFx0dGVtcEhUTUwgKz0gJzxsaSBkYXRhLWlkPVwiJytkYXRhW2pdW190aGlzLmtleU1hcC5pZF0rJ1wiPicrZGF0YVtqXVtfdGhpcy5rZXlNYXAudmFsdWVdKyc8L2xpPic7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3RoaXMud2hlZWxzRGF0YVtzbGlkZXJJbmRleF0gPSB7ZGF0YTogZGF0YX07XG5cdCAgICBcdH1lbHNle1xuXHRcdFx0XHRmb3IodmFyIGo9MDsgajxkYXRhLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0XHR0ZW1wSFRNTCArPSAnPGxpPicrZGF0YVtqXSsnPC9saT4nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF90aGlzLndoZWVsc0RhdGFbc2xpZGVySW5kZXhdID0gZGF0YTtcblx0ICAgIFx0fVxuXHRcdFx0X3RoaXMuc2xpZGVyW3NsaWRlckluZGV4XS5pbm5lckhUTUwgPSB0ZW1wSFRNTDtcblx0XHR9LFxuXG5cdFx0Zml4Um93U3R5bGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0dmFyIHdpZHRoID0gKDEwMC9fdGhpcy53aGVlbC5sZW5ndGgpLnRvRml4ZWQoMik7XG5cdFx0XHRmb3IodmFyIGk9MDsgaTxfdGhpcy53aGVlbC5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdF90aGlzLndoZWVsW2ldLnN0eWxlLndpZHRoID0gd2lkdGgrJyUnO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0ICAgIGdldEluZGV4OiBmdW5jdGlvbihkaXN0YW5jZSl7XG5cdCAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoKDIqdGhpcy5saUhlaWdodC1kaXN0YW5jZSkvdGhpcy5saUhlaWdodCk7XG5cdCAgICB9LFxuXG5cdCAgICBnZXRJbmRleEFycjogZnVuY3Rpb24oKXtcblx0ICAgIFx0dmFyIF90aGlzID0gdGhpcztcblx0ICAgIFx0dmFyIHRlbXAgPSBbXTtcblx0ICAgIFx0Zm9yKHZhciBpPTA7IGk8X3RoaXMuY3VyRGlzdGFuY2UubGVuZ3RoOyBpKyspe1xuXHQgICAgXHRcdHRlbXAucHVzaChfdGhpcy5nZXRJbmRleChfdGhpcy5jdXJEaXN0YW5jZVtpXSkpO1xuXHQgICAgXHR9XG5cdCAgICBcdHJldHVybiB0ZW1wO1xuXHQgICAgfSxcblxuXHQgICAgZ2V0Q3VyVmFsdWU6IGZ1bmN0aW9uKCl7XG5cdCAgICBcdHZhciBfdGhpcyA9IHRoaXM7XG5cdCAgICBcdHZhciB0ZW1wID0gW107XG5cdCAgICBcdHZhciBwb3NpdGlvbkFyciA9IF90aGlzLmdldEluZGV4QXJyKCk7XG5cdCAgICBcdGlmKF90aGlzLmNhc2NhZGUpe1xuXHRcdCAgICBcdGZvcih2YXIgaT0wOyBpPF90aGlzLndoZWVsLmxlbmd0aDsgaSsrKXtcblx0XHQgICAgXHRcdHRlbXAucHVzaChfdGhpcy5kaXNwbGF5SnNvbltpXVtwb3NpdGlvbkFycltpXV0pO1xuXHRcdCAgICBcdH1cblx0ICAgIFx0fVxuXHQgICAgXHRlbHNlIGlmKF90aGlzLmpzb25UeXBlKXtcblx0XHQgICAgXHRmb3IodmFyIGk9MDsgaTxfdGhpcy5jdXJEaXN0YW5jZS5sZW5ndGg7IGkrKyl7XG5cdFx0ICAgIFx0XHR0ZW1wLnB1c2goX3RoaXMud2hlZWxzRGF0YVtpXS5kYXRhW190aGlzLmdldEluZGV4KF90aGlzLmN1ckRpc3RhbmNlW2ldKV0pO1xuXHRcdCAgICBcdH1cblx0ICAgIFx0fWVsc2V7XG5cdFx0ICAgIFx0Zm9yKHZhciBpPTA7IGk8X3RoaXMuY3VyRGlzdGFuY2UubGVuZ3RoOyBpKyspe1xuXHRcdCAgICBcdFx0dGVtcC5wdXNoKF90aGlzLmdldElubmVySHRtbChpKSk7XG5cdFx0ICAgIFx0fVxuXHQgICAgXHR9XG5cdCAgICBcdHJldHVybiB0ZW1wO1xuXHQgICAgfSxcblxuXHQgICAgZ2V0VmFsdWU6IGZ1bmN0aW9uKCl7XG5cdCAgICBcdHJldHVybiB0aGlzLmN1clZhbHVlO1xuXHQgICAgfSxcblxuXHQgICAgY2FsY0Rpc3RhbmNlOiBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHRyZXR1cm4gMip0aGlzLmxpSGVpZ2h0LWluZGV4KnRoaXMubGlIZWlnaHQ7XG5cdCAgICB9LFxuXG5cdCAgICBzZXRDdXJEaXN0YW5jZTogZnVuY3Rpb24oaW5kZXhBcnIpe1xuXHQgICAgXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHQgICAgXHR2YXIgdGVtcCA9IFtdO1xuXHQgICAgXHRmb3IodmFyIGk9MDsgaTxfdGhpcy5zbGlkZXIubGVuZ3RoOyBpKyspe1xuXHQgICAgXHRcdHRlbXAucHVzaChfdGhpcy5jYWxjRGlzdGFuY2UoaW5kZXhBcnJbaV0pKTtcblx0ICAgIFx0XHRfdGhpcy5tb3ZlUG9zaXRpb24oX3RoaXMuc2xpZGVyW2ldLHRlbXBbaV0pO1xuXHQgICAgXHR9XG5cdCAgICBcdF90aGlzLmN1ckRpc3RhbmNlID0gdGVtcDtcblx0ICAgIH0sXG5cblx0ICAgIGZpeFBvc2l0aW9uOiBmdW5jdGlvbihkaXN0YW5jZSl7XG5cdCAgICAgICAgcmV0dXJuIC0odGhpcy5nZXRJbmRleChkaXN0YW5jZSktMikqdGhpcy5saUhlaWdodDtcblx0ICAgIH0sXG5cblx0ICAgIG1vdmVQb3NpdGlvbjogZnVuY3Rpb24odGhlU2xpZGVyLCBkaXN0YW5jZSl7XG5cdCAgICAgICAgdGhlU2xpZGVyLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgwLCcgKyBkaXN0YW5jZSArICdweCwgMCknO1xuXHQgICAgICAgIHRoZVNsaWRlci5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoMCwnICsgZGlzdGFuY2UgKyAncHgsIDApJztcblx0ICAgIH0sXG5cblx0ICAgIGxvY2F0ZVBvc2l0aW9uOiBmdW5jdGlvbihpbmRleCwgcG9zSW5kZXgpe1xuXHQgICAgXHR2YXIgX3RoaXMgPSB0aGlzO1xuICBcdCAgICBcdHRoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gdGhpcy5jYWxjRGlzdGFuY2UocG9zSW5kZXgpO1xuICBcdCAgICBcdHRoaXMubW92ZVBvc2l0aW9uKHRoaXMuc2xpZGVyW2luZGV4XSx0aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cdCAgICAgICAgaWYoX3RoaXMuY2FzY2FkZSl7XG5cdFx0ICAgIFx0X3RoaXMuY2hlY2tSYW5nZShpbmRleCwgX3RoaXMuZ2V0SW5kZXhBcnIoKSk7XG5cdFx0XHR9XG5cdCAgICB9LFxuXG5cdCAgICB1cGRhdGVDdXJEaXN0YW5jZTogZnVuY3Rpb24odGhlU2xpZGVyLCBpbmRleCl7XG5cdCAgICAgICAgaWYodGhlU2xpZGVyLnN0eWxlLnRyYW5zZm9ybSl7XG5cdFx0XHRcdHRoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gcGFyc2VJbnQodGhlU2xpZGVyLnN0eWxlLnRyYW5zZm9ybS5zcGxpdCgnLCcpWzFdKTtcblx0ICAgICAgICB9ZWxzZXtcblx0XHRcdFx0dGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSBwYXJzZUludCh0aGVTbGlkZXIuc3R5bGUud2Via2l0VHJhbnNmb3JtLnNwbGl0KCcsJylbMV0pO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIGdldERpc3RhbmNlOmZ1bmN0aW9uKHRoZVNsaWRlcil7XG5cdCAgICBcdGlmKHRoZVNsaWRlci5zdHlsZS50cmFuc2Zvcm0pe1xuXHQgICAgXHRcdHJldHVybiBwYXJzZUludCh0aGVTbGlkZXIuc3R5bGUudHJhbnNmb3JtLnNwbGl0KCcsJylbMV0pO1xuXHQgICAgXHR9ZWxzZXtcblx0ICAgIFx0XHRyZXR1cm4gcGFyc2VJbnQodGhlU2xpZGVyLnN0eWxlLndlYmtpdFRyYW5zZm9ybS5zcGxpdCgnLCcpWzFdKTtcblx0ICAgIFx0fVxuXHQgICAgfSxcblxuXHQgICAgZ2V0SW5uZXJIdG1sOiBmdW5jdGlvbihzbGlkZXJJbmRleCl7XG5cdCAgICBcdHZhciBfdGhpcyA9IHRoaXM7XG5cdCAgICBcdHZhciBpbmRleCA9IF90aGlzLmdldEluZGV4KF90aGlzLmN1ckRpc3RhbmNlW3NsaWRlckluZGV4XSk7XG5cdCAgICBcdHJldHVybiBfdGhpcy5zbGlkZXJbc2xpZGVySW5kZXhdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpW2luZGV4XS5pbm5lckhUTUw7XG5cdCAgICB9LFxuXG5cdCAgICB0b3VjaDogZnVuY3Rpb24oZXZlbnQsIHRoZVNsaWRlciwgaW5kZXgpe1xuXHQgICAgXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHQgICAgXHRldmVudCA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcblx0ICAgIFx0c3dpdGNoKGV2ZW50LnR5cGUpe1xuXHQgICAgXHRcdGNhc2UgXCJ0b3VjaHN0YXJ0XCI6XG5cdFx0XHQgICAgICAgIF90aGlzLnN0YXJ0WSA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WTtcblx0XHRcdCAgICAgICAgX3RoaXMuc3RhcnRZID0gcGFyc2VJbnQoX3RoaXMuc3RhcnRZKTtcblx0XHRcdCAgICAgICAgX3RoaXMub2xkTW92ZVkgPSBfdGhpcy5zdGFydFk7XG5cdCAgICBcdFx0XHRicmVhaztcblxuXHQgICAgXHRcdGNhc2UgXCJ0b3VjaGVuZFwiOlxuXG5cdFx0XHQgICAgICAgIF90aGlzLm1vdmVFbmRZID0gcGFyc2VJbnQoZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSk7XG5cdFx0XHQgICAgICAgIF90aGlzLm9mZnNldFN1bSA9IF90aGlzLm1vdmVFbmRZIC0gX3RoaXMuc3RhcnRZO1xuXHRcdFx0XHRcdF90aGlzLm92ZXJzaXplQm9yZGVyID0gLSh0aGVTbGlkZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJykubGVuZ3RoLTMpKl90aGlzLmxpSGVpZ2h0O1xuXG5cdFx0XHRcdFx0aWYoX3RoaXMub2Zmc2V0U3VtID09IDApe1xuXHRcdFx0XHRcdFx0Ly9vZmZzZXRTdW3kuLowLOebuOW9k+S6jueCueWHu+S6i+S7tlxuXHRcdFx0XHRcdFx0Ly8gMCAxIFsyXSAzIDRcblx0XHRcdFx0XHRcdHZhciBjbGlja09mZmV0TnVtID0gcGFyc2VJbnQoKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLSBfdGhpcy5tb3ZlRW5kWSkvNDApO1xuXHRcdFx0XHRcdFx0aWYoY2xpY2tPZmZldE51bSE9Mil7XG5cdFx0XHRcdFx0XHRcdHZhciBvZmZzZXQgPSBjbGlja09mZmV0TnVtIC0gMjtcblx0XHRcdFx0XHRcdFx0dmFyIG5ld0Rpc3RhbmNlID0gX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdICsgKG9mZnNldCpfdGhpcy5saUhlaWdodCk7XG5cdFx0XHRcdFx0XHRcdGlmKChuZXdEaXN0YW5jZSA8PSAyKl90aGlzLmxpSGVpZ2h0KSAmJiAobmV3RGlzdGFuY2UgPj0gX3RoaXMub3ZlcnNpemVCb3JkZXIpICl7XG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gbmV3RGlzdGFuY2U7XG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMubW92ZVBvc2l0aW9uKHRoZVNsaWRlciwgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy50cmFuc2l0aW9uRW5kKF90aGlzLmdldEluZGV4QXJyKCksX3RoaXMuZ2V0Q3VyVmFsdWUoKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdC8v5L+u5q2j5L2N572uXG5cdFx0XHRcdFx0XHRfdGhpcy51cGRhdGVDdXJEaXN0YW5jZSh0aGVTbGlkZXIsIGluZGV4KTtcblx0XHRcdFx0XHRcdF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IF90aGlzLmZpeFBvc2l0aW9uKF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlUG9zaXRpb24odGhlU2xpZGVyLCBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXG5cdFx0XHRcdCAgICAgICAgLy/lj43lvLlcblx0XHRcdFx0ICAgICAgICBpZihfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gKyBfdGhpcy5vZmZzZXRTdW0gPiAyKl90aGlzLmxpSGVpZ2h0KXtcblx0XHRcdFx0ICAgICAgICAgICAgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gMipfdGhpcy5saUhlaWdodDtcblx0XHRcdFx0ICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQgICAgICAgICAgICAgICAgX3RoaXMubW92ZVBvc2l0aW9uKHRoZVNsaWRlciwgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblx0XHRcdFx0ICAgICAgICAgICAgfSwgMTAwKTtcblxuXHRcdFx0XHQgICAgICAgIH1lbHNlIGlmKF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSArIF90aGlzLm9mZnNldFN1bSA8IF90aGlzLm92ZXJzaXplQm9yZGVyKXtcblx0XHRcdFx0ICAgICAgICAgICAgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gX3RoaXMub3ZlcnNpemVCb3JkZXI7XG5cdFx0XHRcdCAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0ICAgICAgICAgICAgICAgIF90aGlzLm1vdmVQb3NpdGlvbih0aGVTbGlkZXIsIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cdFx0XHRcdCAgICAgICAgICAgIH0sIDEwMCk7XG5cdFx0XHRcdCAgICAgICAgfVxuXHRcdFx0XHRcdFx0X3RoaXMudHJhbnNpdGlvbkVuZChfdGhpcy5nZXRJbmRleEFycigpLF90aGlzLmdldEN1clZhbHVlKCkpO1xuXHRcdFx0XHRcdH1cblxuIFx0XHRcdCAgICAgICAgaWYoX3RoaXMuY2FzY2FkZSl7XG5cdFx0XHRcdCAgICAgICAgX3RoaXMuY2hlY2tSYW5nZShpbmRleCwgX3RoaXMuZ2V0SW5kZXhBcnIoKSk7XG5cdFx0XHRcdCAgICB9XG5cblx0ICAgIFx0XHRcdGJyZWFrO1xuXG5cdCAgICBcdFx0Y2FzZSBcInRvdWNobW92ZVwiOlxuXHRcdFx0ICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ICAgICAgICBfdGhpcy5tb3ZlWSA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WTtcblx0XHRcdCAgICAgICAgX3RoaXMub2Zmc2V0ID0gX3RoaXMubW92ZVkgLSBfdGhpcy5vbGRNb3ZlWTtcblxuXHRcdFx0ICAgICAgICBfdGhpcy51cGRhdGVDdXJEaXN0YW5jZSh0aGVTbGlkZXIsIGluZGV4KTtcblx0XHRcdCAgICAgICAgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdICsgX3RoaXMub2Zmc2V0O1xuXHRcdFx0ICAgICAgICBfdGhpcy5tb3ZlUG9zaXRpb24odGhlU2xpZGVyLCBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXHRcdFx0ICAgICAgICBfdGhpcy5vbGRNb3ZlWSA9IF90aGlzLm1vdmVZO1xuXHQgICAgXHRcdFx0YnJlYWs7XG5cdCAgICBcdH1cblx0ICAgIH0sXG5cblx0ICAgIGRyYWdDbGljazogZnVuY3Rpb24oZXZlbnQsIHRoZVNsaWRlciwgaW5kZXgpe1xuXHQgICAgXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHQgICAgXHRldmVudCA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcblx0ICAgIFx0c3dpdGNoKGV2ZW50LnR5cGUpe1xuXHQgICAgXHRcdGNhc2UgXCJtb3VzZWRvd25cIjpcblx0XHRcdCAgICAgICAgX3RoaXMuc3RhcnRZID0gZXZlbnQuY2xpZW50WTtcblx0XHRcdCAgICAgICAgX3RoaXMub2xkTW92ZVkgPSBfdGhpcy5zdGFydFk7XG5cdFx0XHQgICAgICAgIF90aGlzLmNsaWNrU3RhdHVzID0gdHJ1ZTtcblx0ICAgIFx0XHRcdGJyZWFrO1xuXG5cdCAgICBcdFx0Y2FzZSBcIm1vdXNldXBcIjpcblxuXHRcdFx0ICAgICAgICBfdGhpcy5tb3ZlRW5kWSA9IGV2ZW50LmNsaWVudFk7XG5cdFx0XHQgICAgICAgIF90aGlzLm9mZnNldFN1bSA9IF90aGlzLm1vdmVFbmRZIC0gX3RoaXMuc3RhcnRZO1xuXHRcdFx0XHRcdF90aGlzLm92ZXJzaXplQm9yZGVyID0gLSh0aGVTbGlkZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJykubGVuZ3RoLTMpKl90aGlzLmxpSGVpZ2h0O1xuXG5cdFx0XHRcdFx0aWYoX3RoaXMub2Zmc2V0U3VtID09IDApe1xuXHRcdFx0XHRcdFx0dmFyIGNsaWNrT2ZmZXROdW0gPSBwYXJzZUludCgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCAtIF90aGlzLm1vdmVFbmRZKS80MCk7XG5cdFx0XHRcdFx0XHRpZihjbGlja09mZmV0TnVtIT0yKXtcblx0XHRcdFx0XHRcdFx0dmFyIG9mZnNldCA9IGNsaWNrT2ZmZXROdW0gLSAyO1xuXHRcdFx0XHRcdFx0XHR2YXIgbmV3RGlzdGFuY2UgPSBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gKyAob2Zmc2V0Kl90aGlzLmxpSGVpZ2h0KTtcblx0XHRcdFx0XHRcdFx0aWYoKG5ld0Rpc3RhbmNlIDw9IDIqX3RoaXMubGlIZWlnaHQpICYmIChuZXdEaXN0YW5jZSA+PSBfdGhpcy5vdmVyc2l6ZUJvcmRlcikgKXtcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSBuZXdEaXN0YW5jZTtcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy5tb3ZlUG9zaXRpb24odGhlU2xpZGVyLCBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXHRcdFx0XHRcdFx0XHRcdF90aGlzLnRyYW5zaXRpb25FbmQoX3RoaXMuZ2V0SW5kZXhBcnIoKSxfdGhpcy5nZXRDdXJWYWx1ZSgpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0Ly/kv67mraPkvY3nva5cblx0XHRcdFx0XHRcdF90aGlzLnVwZGF0ZUN1ckRpc3RhbmNlKHRoZVNsaWRlciwgaW5kZXgpO1xuXHRcdFx0XHRcdFx0X3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gX3RoaXMuZml4UG9zaXRpb24oX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVQb3NpdGlvbih0aGVTbGlkZXIsIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cblx0XHRcdFx0XHRcdC8v5Y+N5by5XG5cdFx0XHRcdFx0XHRpZihfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gKyBfdGhpcy5vZmZzZXRTdW0gPiAyKl90aGlzLmxpSGVpZ2h0KXtcblx0XHRcdFx0XHRcdCAgICBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSAyKl90aGlzLmxpSGVpZ2h0O1xuXHRcdFx0XHRcdFx0ICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdCAgICAgICAgX3RoaXMubW92ZVBvc2l0aW9uKHRoZVNsaWRlciwgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblx0XHRcdFx0XHRcdCAgICB9LCAxMDApO1xuXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZihfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gKyBfdGhpcy5vZmZzZXRTdW0gPCBfdGhpcy5vdmVyc2l6ZUJvcmRlcil7XG5cdFx0XHRcdFx0XHQgICAgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gX3RoaXMub3ZlcnNpemVCb3JkZXI7XG5cdFx0XHRcdFx0XHQgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0ICAgICAgICBfdGhpcy5tb3ZlUG9zaXRpb24odGhlU2xpZGVyLCBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXHRcdFx0XHRcdFx0ICAgIH0sIDEwMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRfdGhpcy50cmFuc2l0aW9uRW5kKF90aGlzLmdldEluZGV4QXJyKCksX3RoaXMuZ2V0Q3VyVmFsdWUoKSk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdCAgICAgICAgX3RoaXMuY2xpY2tTdGF0dXMgPSBmYWxzZTtcbiBcdFx0XHQgICAgICAgIGlmKF90aGlzLmNhc2NhZGUpe1xuXHRcdFx0XHQgICAgICAgIF90aGlzLmNoZWNrUmFuZ2UoaW5kZXgsIF90aGlzLmdldEluZGV4QXJyKCkpO1xuXHRcdFx0ICAgIFx0fVxuXHQgICAgXHRcdFx0YnJlYWs7XG5cblx0ICAgIFx0XHRjYXNlIFwibW91c2Vtb3ZlXCI6XG5cdFx0XHQgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQgICAgICAgIGlmKF90aGlzLmNsaWNrU3RhdHVzKXtcblx0XHRcdFx0ICAgICAgICBfdGhpcy5tb3ZlWSA9IGV2ZW50LmNsaWVudFk7XG5cdFx0XHRcdCAgICAgICAgX3RoaXMub2Zmc2V0ID0gX3RoaXMubW92ZVkgLSBfdGhpcy5vbGRNb3ZlWTtcblx0XHRcdFx0ICAgICAgICBfdGhpcy51cGRhdGVDdXJEaXN0YW5jZSh0aGVTbGlkZXIsIGluZGV4KTtcblx0XHRcdFx0ICAgICAgICBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gKyBfdGhpcy5vZmZzZXQ7XG5cdFx0XHRcdCAgICAgICAgX3RoaXMubW92ZVBvc2l0aW9uKHRoZVNsaWRlciwgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblx0XHRcdFx0ICAgICAgICBfdGhpcy5vbGRNb3ZlWSA9IF90aGlzLm1vdmVZO1xuXHRcdFx0ICAgICAgICB9XG5cdCAgICBcdFx0XHRicmVhaztcblx0ICAgIFx0fVxuXHQgICAgfVxuXG5cdH07XG5cblx0aWYgKHR5cGVvZiBleHBvcnRzID09IFwib2JqZWN0XCIpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IE1vYmlsZVNlbGVjdDtcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gTW9iaWxlU2VsZWN0O1xuXHRcdH0pXG5cdH0gZWxzZSB7XG5cdFx0d2luZG93Lk1vYmlsZVNlbGVjdCA9IE1vYmlsZVNlbGVjdDtcblx0fVxufSkoKTtcbiIsImNvbnN0IHByZWZpeCA9ICdtYy1zZWxlY3QnO1xuXG5jb25zdCBzZWxlY3RzID0gJChgLiR7cHJlZml4fWApO1xuXG5jbGFzcyBTZWxlY3Qge1xuICBjb25zdHJ1Y3Rvcihkb20sIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNlbGVjdCA9ICQoZG9tKTtcblxuICAgIHRoaXMudGV4dENvbnRhaW5lckRvbSA9IHRoaXMuc2VsZWN0LmZpbmQoYC4ke3ByZWZpeH0tdGV4dC1jb250YWluZXJgKTtcbiAgICB0aGlzLnRleHREb20gPSB0aGlzLnRleHRDb250YWluZXJEb20uZmluZChgLiR7cHJlZml4fS10ZXh0YCk7XG4gICAgdGhpcy52YWx1ZUlucHV0RG9tID0gdGhpcy50ZXh0Q29udGFpbmVyRG9tLmZpbmQoYC4ke3ByZWZpeH0tdmFsdWVgKTtcblxuICAgIHRoaXMub3B0aW9uQ29udGFpbmVyID0gdGhpcy5zZWxlY3QuZmluZChgLiR7cHJlZml4fS1vcHRpb24tY29udGFpbmVyYCk7XG4gICAgdGhpcy5vcHRpb25Db250YWluZXJIZWlnaHQgPSB0aGlzLm9wdGlvbkNvbnRhaW5lclswXS5zY3JvbGxIZWlnaHQ7XG5cbiAgICBpZiAoIW9wdGlvbnMudmFsdWUpIHtcbiAgICAgIHRoaXMudGV4dERvbS5hZGRDbGFzcygncGxhY2Vob2xkZXInKTtcbiAgICAgIHRoaXMudGV4dERvbS50ZXh0KHRoaXMudGV4dERvbS5hdHRyKCdwbGFjZWhvbGRlcicpKTtcbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT57XG4gICAgICB0aGlzLnNlbGVjdC5yZW1vdmVDbGFzcygnc2hvdycpO1xuICAgIH0sIGZhbHNlKVxuXG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoKVxuICB9XG5cbiAgaGFuZGxlVG9nZ2xlKGUpIHtcbiAgICBpZiAodGhpcy5zZWxlY3QuaGFzQ2xhc3MoJ3Nob3cnKSkge1xuICAgICAgdGhpcy5zZWxlY3QucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgICAgIHRoaXMub3B0aW9uQ29udGFpbmVyLmhlaWdodCgwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3QuYWRkQ2xhc3MoJ3Nob3cnKTtcbiAgICAgIHRoaXMub3B0aW9uQ29udGFpbmVyLmhlaWdodCh0aGlzLm9wdGlvbkNvbnRhaW5lckhlaWdodCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZVNlbGVjdChlKSB7XG4gICAgbGV0IHZhbHVlID0gJChlLnRhcmdldCkuYXR0cignZGF0YS12YWx1ZScpO1xuICAgIGxldCB0ZXh0ID0gJChlLnRhcmdldCkudGV4dCgpO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5oYW5kbGVUb2dnbGUoKVxuICAgICAgJCh0aGlzLnRleHREb20pLnJlbW92ZUNsYXNzKCdwbGFjZWhvbGRlcicpXG4gICAgICB0aGlzLnRleHREb20udGV4dCh0ZXh0KTtcbiAgICAgIHRoaXMudmFsdWVJbnB1dERvbS52YWwodmFsdWUpO1xuICAgICAgdGhpcy5zZWxlY3QudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICB0aGlzLnZhbHVlSW5wdXREb20udHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFkZExpc3RlbmVycygpIHtcbiAgICB0aGlzLnRleHRDb250YWluZXJEb20ub24oJ2NsaWNrJywgdGhpcy5oYW5kbGVUb2dnbGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5vcHRpb25Db250YWluZXIub24oJ2NsaWNrJywgdGhpcy5oYW5kbGVTZWxlY3QuYmluZCh0aGlzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3Q7XG4iLCJjb25zdCBwcmVmaXggPSAnbWMtdGFiJztcblxuY29uc3QgdGFicyA9ICQoYC4ke3ByZWZpeH0tZ3JvdXBgKTtcblxuXG5jbGFzcyBUYWIge1xuICBjb25zdHJ1Y3Rvcihkb20sIG9wdGlvbnMgPXt9KSB7XG4gICAgdGhpcy50YWJEb20gPSAkKGRvbSk7XG4gICAgdGhpcy5idG5Hcm91cERvbSA9IHRoaXMudGFiRG9tLmZpbmQoYC4ke3ByZWZpeH0tYnRuc2ApO1xuICAgIHRoaXMuYnRuRG9tcyA9IHRoaXMudGFiRG9tLmZpbmQoYC4ke3ByZWZpeH0tYnRuYCk7XG4gICAgdGhpcy5wYW5lbERvbXMgPSB0aGlzLnRhYkRvbS5maW5kKGAuJHtwcmVmaXh9LXBhbmVsYCk7XG5cbiAgICB0aGlzLmFkZExpc3RlbmVycygpO1xuICB9XG5cbiAgYWN0aXZlKGluZGV4KSB7XG4gICAgdGhpcy5idG5Eb21zLmVxKGluZGV4KS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgdGhpcy5wYW5lbERvbXMuZXEoaW5kZXgpLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrQnRuKGUpIHtcbiAgICBsZXQgaW5kZXggPSAkKGUudGFyZ2V0KS5pbmRleCgpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB0aGlzLmFjdGl2ZShpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgYWRkTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuYnRuR3JvdXBEb20ub24oJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGlja0J0bi5iaW5kKHRoaXMpKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGFiO1xuIiwiY29uc3QgVGFiID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RhYicpO1xuY29uc3QgU2VsZWN0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3NlbGVjdCcpO1xuY29uc3QgQXV0b0NvbXBsZXRlID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2F1dG9Db21wbGV0ZScpO1xuY29uc3QgQ2FsZW5kYXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2FsZW5kYXInKTtcbmNvbnN0IEltYWdlVXBsb2FkZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvaW1hZ2VVcGxvYWRlcicpO1xuY29uc3QgTW9iaWxlU2VsZWN0ID0gcmVxdWlyZSggJy4vY29tcG9uZW50cy9tb2JpbGUtc2VsZWN0Jyk7XG5jb25zdCBBbGVydCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kaWFsb2cvYWxlcnQnKTtcbmNvbnN0IENvbmZpcm0gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGlhbG9nL2NvbmZpcm0nKTtcbmNvbnN0IENvbXBsZXggPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGlhbG9nL2NvbXBsZXgnKTtcbmNvbnN0IFRvYXN0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2RpYWxvZy90b2FzdCcpO1xuY29uc3QgVGlwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2RpYWxvZy90aXAnKTtcbmNvbnN0IEFjdGlvblNoZWV0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2RpYWxvZy9hY3Rpb25TaGVldCcpO1xuY29uc3QgTG9hZGluZyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kaWFsb2cvbG9hZGluZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQWxlcnQsXG4gIENvbmZpcm0sXG4gIENvbXBsZXgsXG4gIFRvYXN0LFxuICBMb2FkaW5nLFxuICBUaXAsXG4gIEFjdGlvblNoZWV0LFxuXG4gIFRhYixcbiAgU2VsZWN0LFxuICBBdXRvQ29tcGxldGUsXG4gIENhbGVuZGFyLFxuICBJbWFnZVVwbG9hZGVyLFxuICBNb2JpbGVTZWxlY3QsXG59XG5cbiJdfQ==
