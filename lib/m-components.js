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

          var index = _this.fileList.length;

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
      this.imageUploader.on('change', '.' + prefix + '-input', this.handleInputChange.bind(this));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbW9tZW50L21vbWVudC5qcyIsInNyYy9jb21wb25lbnRzL2F1dG9Db21wbGV0ZS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2NhbGVuZGFyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvY2FsZW5kYXIvbGFuZ3MuanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvYWN0aW9uU2hlZXQuanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvYWxlcnQuanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvYmFzZS5qcyIsInNyYy9jb21wb25lbnRzL2RpYWxvZy9jb21wbGV4LmpzIiwic3JjL2NvbXBvbmVudHMvZGlhbG9nL2NvbmZpcm0uanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvZ2VuZXJhbC5qcyIsInNyYy9jb21wb25lbnRzL2RpYWxvZy9sYW5ncy5qcyIsInNyYy9jb21wb25lbnRzL2RpYWxvZy9sb2FkaW5nLmpzIiwic3JjL2NvbXBvbmVudHMvZGlhbG9nL21hc2suanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvdGlwLmpzIiwic3JjL2NvbXBvbmVudHMvZGlhbG9nL3RvYXN0LmpzIiwic3JjL2NvbXBvbmVudHMvZGlhbG9nL3V0aWxzLmpzIiwic3JjL2NvbXBvbmVudHMvaW1hZ2VVcGxvYWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL21vYmlsZS1zZWxlY3QvbW9iaWxlLXNlbGVjdC5qcyIsInNyYy9jb21wb25lbnRzL3NlbGVjdC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3RhYi9pbmRleC5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQzE1SUEsSUFBTSxTQUFTLGtCQUFmOztJQUVNLFk7QUFDSix3QkFBWSxHQUFaLEVBQWlC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ZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCIvLyEgbW9tZW50LmpzXG5cbjsoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAgIGdsb2JhbC5tb21lbnQgPSBmYWN0b3J5KClcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgaG9va0NhbGxiYWNrO1xuXG5mdW5jdGlvbiBob29rcyAoKSB7XG4gICAgcmV0dXJuIGhvb2tDYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xufVxuXG4vLyBUaGlzIGlzIGRvbmUgdG8gcmVnaXN0ZXIgdGhlIG1ldGhvZCBjYWxsZWQgd2l0aCBtb21lbnQoKVxuLy8gd2l0aG91dCBjcmVhdGluZyBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG5mdW5jdGlvbiBzZXRIb29rQ2FsbGJhY2sgKGNhbGxiYWNrKSB7XG4gICAgaG9va0NhbGxiYWNrID0gY2FsbGJhY2s7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkoaW5wdXQpIHtcbiAgICByZXR1cm4gaW5wdXQgaW5zdGFuY2VvZiBBcnJheSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChpbnB1dCkge1xuICAgIC8vIElFOCB3aWxsIHRyZWF0IHVuZGVmaW5lZCBhbmQgbnVsbCBhcyBvYmplY3QgaWYgaXQgd2Fzbid0IGZvclxuICAgIC8vIGlucHV0ICE9IG51bGxcbiAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3RFbXB0eShvYmopIHtcbiAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgcmV0dXJuIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmxlbmd0aCA9PT0gMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGs7XG4gICAgICAgIGZvciAoayBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dCA9PT0gdm9pZCAwO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihpbnB1dCkge1xuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xufVxuXG5mdW5jdGlvbiBpc0RhdGUoaW5wdXQpIHtcbiAgICByZXR1cm4gaW5wdXQgaW5zdGFuY2VvZiBEYXRlIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuZnVuY3Rpb24gbWFwKGFyciwgZm4pIHtcbiAgICB2YXIgcmVzID0gW10sIGk7XG4gICAgZm9yIChpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSkge1xuICAgICAgICByZXMucHVzaChmbihhcnJbaV0sIGkpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gaGFzT3duUHJvcChhLCBiKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLCBiKTtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcbiAgICBmb3IgKHZhciBpIGluIGIpIHtcbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgaSkpIHtcbiAgICAgICAgICAgIGFbaV0gPSBiW2ldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc093blByb3AoYiwgJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgYS50b1N0cmluZyA9IGIudG9TdHJpbmc7XG4gICAgfVxuXG4gICAgaWYgKGhhc093blByb3AoYiwgJ3ZhbHVlT2YnKSkge1xuICAgICAgICBhLnZhbHVlT2YgPSBiLnZhbHVlT2Y7XG4gICAgfVxuXG4gICAgcmV0dXJuIGE7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVVUQyAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgdHJ1ZSkudXRjKCk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRQYXJzaW5nRmxhZ3MoKSB7XG4gICAgLy8gV2UgbmVlZCB0byBkZWVwIGNsb25lIHRoaXMgb2JqZWN0LlxuICAgIHJldHVybiB7XG4gICAgICAgIGVtcHR5ICAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICB1bnVzZWRUb2tlbnMgICAgOiBbXSxcbiAgICAgICAgdW51c2VkSW5wdXQgICAgIDogW10sXG4gICAgICAgIG92ZXJmbG93ICAgICAgICA6IC0yLFxuICAgICAgICBjaGFyc0xlZnRPdmVyICAgOiAwLFxuICAgICAgICBudWxsSW5wdXQgICAgICAgOiBmYWxzZSxcbiAgICAgICAgaW52YWxpZE1vbnRoICAgIDogbnVsbCxcbiAgICAgICAgaW52YWxpZEZvcm1hdCAgIDogZmFsc2UsXG4gICAgICAgIHVzZXJJbnZhbGlkYXRlZCA6IGZhbHNlLFxuICAgICAgICBpc28gICAgICAgICAgICAgOiBmYWxzZSxcbiAgICAgICAgcGFyc2VkRGF0ZVBhcnRzIDogW10sXG4gICAgICAgIG1lcmlkaWVtICAgICAgICA6IG51bGwsXG4gICAgICAgIHJmYzI4MjIgICAgICAgICA6IGZhbHNlLFxuICAgICAgICB3ZWVrZGF5TWlzbWF0Y2ggOiBmYWxzZVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGdldFBhcnNpbmdGbGFncyhtKSB7XG4gICAgaWYgKG0uX3BmID09IG51bGwpIHtcbiAgICAgICAgbS5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG4gICAgfVxuICAgIHJldHVybiBtLl9wZjtcbn1cblxudmFyIHNvbWU7XG5pZiAoQXJyYXkucHJvdG90eXBlLnNvbWUpIHtcbiAgICBzb21lID0gQXJyYXkucHJvdG90eXBlLnNvbWU7XG59IGVsc2Uge1xuICAgIHNvbWUgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgICAgIHZhciB0ID0gT2JqZWN0KHRoaXMpO1xuICAgICAgICB2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gdCAmJiBmdW4uY2FsbCh0aGlzLCB0W2ldLCBpLCB0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWQobSkge1xuICAgIGlmIChtLl9pc1ZhbGlkID09IG51bGwpIHtcbiAgICAgICAgdmFyIGZsYWdzID0gZ2V0UGFyc2luZ0ZsYWdzKG0pO1xuICAgICAgICB2YXIgcGFyc2VkUGFydHMgPSBzb21lLmNhbGwoZmxhZ3MucGFyc2VkRGF0ZVBhcnRzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkgIT0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBpc05vd1ZhbGlkID0gIWlzTmFOKG0uX2QuZ2V0VGltZSgpKSAmJlxuICAgICAgICAgICAgZmxhZ3Mub3ZlcmZsb3cgPCAwICYmXG4gICAgICAgICAgICAhZmxhZ3MuZW1wdHkgJiZcbiAgICAgICAgICAgICFmbGFncy5pbnZhbGlkTW9udGggJiZcbiAgICAgICAgICAgICFmbGFncy5pbnZhbGlkV2Vla2RheSAmJlxuICAgICAgICAgICAgIWZsYWdzLndlZWtkYXlNaXNtYXRjaCAmJlxuICAgICAgICAgICAgIWZsYWdzLm51bGxJbnB1dCAmJlxuICAgICAgICAgICAgIWZsYWdzLmludmFsaWRGb3JtYXQgJiZcbiAgICAgICAgICAgICFmbGFncy51c2VySW52YWxpZGF0ZWQgJiZcbiAgICAgICAgICAgICghZmxhZ3MubWVyaWRpZW0gfHwgKGZsYWdzLm1lcmlkaWVtICYmIHBhcnNlZFBhcnRzKSk7XG5cbiAgICAgICAgaWYgKG0uX3N0cmljdCkge1xuICAgICAgICAgICAgaXNOb3dWYWxpZCA9IGlzTm93VmFsaWQgJiZcbiAgICAgICAgICAgICAgICBmbGFncy5jaGFyc0xlZnRPdmVyID09PSAwICYmXG4gICAgICAgICAgICAgICAgZmxhZ3MudW51c2VkVG9rZW5zLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICAgICAgICAgIGZsYWdzLmJpZ0hvdXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3QuaXNGcm96ZW4gPT0gbnVsbCB8fCAhT2JqZWN0LmlzRnJvemVuKG0pKSB7XG4gICAgICAgICAgICBtLl9pc1ZhbGlkID0gaXNOb3dWYWxpZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpc05vd1ZhbGlkO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtLl9pc1ZhbGlkO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJbnZhbGlkIChmbGFncykge1xuICAgIHZhciBtID0gY3JlYXRlVVRDKE5hTik7XG4gICAgaWYgKGZsYWdzICE9IG51bGwpIHtcbiAgICAgICAgZXh0ZW5kKGdldFBhcnNpbmdGbGFncyhtKSwgZmxhZ3MpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLnVzZXJJbnZhbGlkYXRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG07XG59XG5cbi8vIFBsdWdpbnMgdGhhdCBhZGQgcHJvcGVydGllcyBzaG91bGQgYWxzbyBhZGQgdGhlIGtleSBoZXJlIChudWxsIHZhbHVlKSxcbi8vIHNvIHdlIGNhbiBwcm9wZXJseSBjbG9uZSBvdXJzZWx2ZXMuXG52YXIgbW9tZW50UHJvcGVydGllcyA9IGhvb2tzLm1vbWVudFByb3BlcnRpZXMgPSBbXTtcblxuZnVuY3Rpb24gY29weUNvbmZpZyh0bywgZnJvbSkge1xuICAgIHZhciBpLCBwcm9wLCB2YWw7XG5cbiAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2lzQU1vbWVudE9iamVjdCkpIHtcbiAgICAgICAgdG8uX2lzQU1vbWVudE9iamVjdCA9IGZyb20uX2lzQU1vbWVudE9iamVjdDtcbiAgICB9XG4gICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9pKSkge1xuICAgICAgICB0by5faSA9IGZyb20uX2k7XG4gICAgfVxuICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fZikpIHtcbiAgICAgICAgdG8uX2YgPSBmcm9tLl9mO1xuICAgIH1cbiAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2wpKSB7XG4gICAgICAgIHRvLl9sID0gZnJvbS5fbDtcbiAgICB9XG4gICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9zdHJpY3QpKSB7XG4gICAgICAgIHRvLl9zdHJpY3QgPSBmcm9tLl9zdHJpY3Q7XG4gICAgfVxuICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fdHptKSkge1xuICAgICAgICB0by5fdHptID0gZnJvbS5fdHptO1xuICAgIH1cbiAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2lzVVRDKSkge1xuICAgICAgICB0by5faXNVVEMgPSBmcm9tLl9pc1VUQztcbiAgICB9XG4gICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9vZmZzZXQpKSB7XG4gICAgICAgIHRvLl9vZmZzZXQgPSBmcm9tLl9vZmZzZXQ7XG4gICAgfVxuICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fcGYpKSB7XG4gICAgICAgIHRvLl9wZiA9IGdldFBhcnNpbmdGbGFncyhmcm9tKTtcbiAgICB9XG4gICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9sb2NhbGUpKSB7XG4gICAgICAgIHRvLl9sb2NhbGUgPSBmcm9tLl9sb2NhbGU7XG4gICAgfVxuXG4gICAgaWYgKG1vbWVudFByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbW9tZW50UHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcHJvcCA9IG1vbWVudFByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICB2YWwgPSBmcm9tW3Byb3BdO1xuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZCh2YWwpKSB7XG4gICAgICAgICAgICAgICAgdG9bcHJvcF0gPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdG87XG59XG5cbnZhciB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG5cbi8vIE1vbWVudCBwcm90b3R5cGUgb2JqZWN0XG5mdW5jdGlvbiBNb21lbnQoY29uZmlnKSB7XG4gICAgY29weUNvbmZpZyh0aGlzLCBjb25maWcpO1xuICAgIHRoaXMuX2QgPSBuZXcgRGF0ZShjb25maWcuX2QgIT0gbnVsbCA/IGNvbmZpZy5fZC5nZXRUaW1lKCkgOiBOYU4pO1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgdGhpcy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgfVxuICAgIC8vIFByZXZlbnQgaW5maW5pdGUgbG9vcCBpbiBjYXNlIHVwZGF0ZU9mZnNldCBjcmVhdGVzIG5ldyBtb21lbnRcbiAgICAvLyBvYmplY3RzLlxuICAgIGlmICh1cGRhdGVJblByb2dyZXNzID09PSBmYWxzZSkge1xuICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc01vbWVudCAob2JqKSB7XG4gICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIE1vbWVudCB8fCAob2JqICE9IG51bGwgJiYgb2JqLl9pc0FNb21lbnRPYmplY3QgIT0gbnVsbCk7XG59XG5cbmZ1bmN0aW9uIGFic0Zsb29yIChudW1iZXIpIHtcbiAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAvLyAtMCAtPiAwXG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwobnVtYmVyKSB8fCAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0b0ludChhcmd1bWVudEZvckNvZXJjaW9uKSB7XG4gICAgdmFyIGNvZXJjZWROdW1iZXIgPSArYXJndW1lbnRGb3JDb2VyY2lvbixcbiAgICAgICAgdmFsdWUgPSAwO1xuXG4gICAgaWYgKGNvZXJjZWROdW1iZXIgIT09IDAgJiYgaXNGaW5pdGUoY29lcmNlZE51bWJlcikpIHtcbiAgICAgICAgdmFsdWUgPSBhYnNGbG9vcihjb2VyY2VkTnVtYmVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbi8vIGNvbXBhcmUgdHdvIGFycmF5cywgcmV0dXJuIHRoZSBudW1iZXIgb2YgZGlmZmVyZW5jZXNcbmZ1bmN0aW9uIGNvbXBhcmVBcnJheXMoYXJyYXkxLCBhcnJheTIsIGRvbnRDb252ZXJ0KSB7XG4gICAgdmFyIGxlbiA9IE1hdGgubWluKGFycmF5MS5sZW5ndGgsIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICBsZW5ndGhEaWZmID0gTWF0aC5hYnMoYXJyYXkxLmxlbmd0aCAtIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICBkaWZmcyA9IDAsXG4gICAgICAgIGk7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmICgoZG9udENvbnZlcnQgJiYgYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHx8XG4gICAgICAgICAgICAoIWRvbnRDb252ZXJ0ICYmIHRvSW50KGFycmF5MVtpXSkgIT09IHRvSW50KGFycmF5MltpXSkpKSB7XG4gICAgICAgICAgICBkaWZmcysrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkaWZmcyArIGxlbmd0aERpZmY7XG59XG5cbmZ1bmN0aW9uIHdhcm4obXNnKSB7XG4gICAgaWYgKGhvb2tzLnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICh0eXBlb2YgY29uc29sZSAhPT0gICd1bmRlZmluZWQnKSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdEZXByZWNhdGlvbiB3YXJuaW5nOiAnICsgbXNnKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRlcHJlY2F0ZShtc2csIGZuKSB7XG4gICAgdmFyIGZpcnN0VGltZSA9IHRydWU7XG5cbiAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlciAhPSBudWxsKSB7XG4gICAgICAgICAgICBob29rcy5kZXByZWNhdGlvbkhhbmRsZXIobnVsbCwgbXNnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICAgICAgdmFyIGFyZztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJnID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZyArPSAnXFxuWycgKyBpICsgJ10gJztcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGFyZ3VtZW50c1swXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnICs9IGtleSArICc6ICcgKyBhcmd1bWVudHNbMF1ba2V5XSArICcsICc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKDAsIC0yKTsgLy8gUmVtb3ZlIHRyYWlsaW5nIGNvbW1hIGFuZCBzcGFjZVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKGFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3YXJuKG1zZyArICdcXG5Bcmd1bWVudHM6ICcgKyBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzKS5qb2luKCcnKSArICdcXG4nICsgKG5ldyBFcnJvcigpKS5zdGFjayk7XG4gICAgICAgICAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9LCBmbik7XG59XG5cbnZhciBkZXByZWNhdGlvbnMgPSB7fTtcblxuZnVuY3Rpb24gZGVwcmVjYXRlU2ltcGxlKG5hbWUsIG1zZykge1xuICAgIGlmIChob29rcy5kZXByZWNhdGlvbkhhbmRsZXIgIT0gbnVsbCkge1xuICAgICAgICBob29rcy5kZXByZWNhdGlvbkhhbmRsZXIobmFtZSwgbXNnKTtcbiAgICB9XG4gICAgaWYgKCFkZXByZWNhdGlvbnNbbmFtZV0pIHtcbiAgICAgICAgd2Fybihtc2cpO1xuICAgICAgICBkZXByZWNhdGlvbnNbbmFtZV0gPSB0cnVlO1xuICAgIH1cbn1cblxuaG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID0gZmFsc2U7XG5ob29rcy5kZXByZWNhdGlvbkhhbmRsZXIgPSBudWxsO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGlucHV0KSB7XG4gICAgcmV0dXJuIGlucHV0IGluc3RhbmNlb2YgRnVuY3Rpb24gfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuZnVuY3Rpb24gc2V0IChjb25maWcpIHtcbiAgICB2YXIgcHJvcCwgaTtcbiAgICBmb3IgKGkgaW4gY29uZmlnKSB7XG4gICAgICAgIHByb3AgPSBjb25maWdbaV07XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHByb3ApKSB7XG4gICAgICAgICAgICB0aGlzW2ldID0gcHJvcDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXNbJ18nICsgaV0gPSBwcm9wO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcbiAgICAvLyBMZW5pZW50IG9yZGluYWwgcGFyc2luZyBhY2NlcHRzIGp1c3QgYSBudW1iZXIgaW4gYWRkaXRpb24gdG9cbiAgICAvLyBudW1iZXIgKyAocG9zc2libHkpIHN0dWZmIGNvbWluZyBmcm9tIF9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlLlxuICAgIC8vIFRPRE86IFJlbW92ZSBcIm9yZGluYWxQYXJzZVwiIGZhbGxiYWNrIGluIG5leHQgbWFqb3IgcmVsZWFzZS5cbiAgICB0aGlzLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlTGVuaWVudCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICh0aGlzLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlLnNvdXJjZSB8fCB0aGlzLl9vcmRpbmFsUGFyc2Uuc291cmNlKSArXG4gICAgICAgICAgICAnfCcgKyAoL1xcZHsxLDJ9Lykuc291cmNlKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VDb25maWdzKHBhcmVudENvbmZpZywgY2hpbGRDb25maWcpIHtcbiAgICB2YXIgcmVzID0gZXh0ZW5kKHt9LCBwYXJlbnRDb25maWcpLCBwcm9wO1xuICAgIGZvciAocHJvcCBpbiBjaGlsZENvbmZpZykge1xuICAgICAgICBpZiAoaGFzT3duUHJvcChjaGlsZENvbmZpZywgcHJvcCkpIHtcbiAgICAgICAgICAgIGlmIChpc09iamVjdChwYXJlbnRDb25maWdbcHJvcF0pICYmIGlzT2JqZWN0KGNoaWxkQ29uZmlnW3Byb3BdKSkge1xuICAgICAgICAgICAgICAgIHJlc1twcm9wXSA9IHt9O1xuICAgICAgICAgICAgICAgIGV4dGVuZChyZXNbcHJvcF0sIHBhcmVudENvbmZpZ1twcm9wXSk7XG4gICAgICAgICAgICAgICAgZXh0ZW5kKHJlc1twcm9wXSwgY2hpbGRDb25maWdbcHJvcF0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZENvbmZpZ1twcm9wXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVzW3Byb3BdID0gY2hpbGRDb25maWdbcHJvcF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXNbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChwcm9wIGluIHBhcmVudENvbmZpZykge1xuICAgICAgICBpZiAoaGFzT3duUHJvcChwYXJlbnRDb25maWcsIHByb3ApICYmXG4gICAgICAgICAgICAgICAgIWhhc093blByb3AoY2hpbGRDb25maWcsIHByb3ApICYmXG4gICAgICAgICAgICAgICAgaXNPYmplY3QocGFyZW50Q29uZmlnW3Byb3BdKSkge1xuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIGNoYW5nZXMgdG8gcHJvcGVydGllcyBkb24ndCBtb2RpZnkgcGFyZW50IGNvbmZpZ1xuICAgICAgICAgICAgcmVzW3Byb3BdID0gZXh0ZW5kKHt9LCByZXNbcHJvcF0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIExvY2FsZShjb25maWcpIHtcbiAgICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZXQoY29uZmlnKTtcbiAgICB9XG59XG5cbnZhciBrZXlzO1xuXG5pZiAoT2JqZWN0LmtleXMpIHtcbiAgICBrZXlzID0gT2JqZWN0LmtleXM7XG59IGVsc2Uge1xuICAgIGtleXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHZhciBpLCByZXMgPSBbXTtcbiAgICAgICAgZm9yIChpIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3Aob2JqLCBpKSkge1xuICAgICAgICAgICAgICAgIHJlcy5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfTtcbn1cblxudmFyIGRlZmF1bHRDYWxlbmRhciA9IHtcbiAgICBzYW1lRGF5IDogJ1tUb2RheSBhdF0gTFQnLFxuICAgIG5leHREYXkgOiAnW1RvbW9ycm93IGF0XSBMVCcsXG4gICAgbmV4dFdlZWsgOiAnZGRkZCBbYXRdIExUJyxcbiAgICBsYXN0RGF5IDogJ1tZZXN0ZXJkYXkgYXRdIExUJyxcbiAgICBsYXN0V2VlayA6ICdbTGFzdF0gZGRkZCBbYXRdIExUJyxcbiAgICBzYW1lRWxzZSA6ICdMJ1xufTtcblxuZnVuY3Rpb24gY2FsZW5kYXIgKGtleSwgbW9tLCBub3cpIHtcbiAgICB2YXIgb3V0cHV0ID0gdGhpcy5fY2FsZW5kYXJba2V5XSB8fCB0aGlzLl9jYWxlbmRhclsnc2FtZUVsc2UnXTtcbiAgICByZXR1cm4gaXNGdW5jdGlvbihvdXRwdXQpID8gb3V0cHV0LmNhbGwobW9tLCBub3cpIDogb3V0cHV0O1xufVxuXG52YXIgZGVmYXVsdExvbmdEYXRlRm9ybWF0ID0ge1xuICAgIExUUyAgOiAnaDptbTpzcyBBJyxcbiAgICBMVCAgIDogJ2g6bW0gQScsXG4gICAgTCAgICA6ICdNTS9ERC9ZWVlZJyxcbiAgICBMTCAgIDogJ01NTU0gRCwgWVlZWScsXG4gICAgTExMICA6ICdNTU1NIEQsIFlZWVkgaDptbSBBJyxcbiAgICBMTExMIDogJ2RkZGQsIE1NTU0gRCwgWVlZWSBoOm1tIEEnXG59O1xuXG5mdW5jdGlvbiBsb25nRGF0ZUZvcm1hdCAoa2V5KSB7XG4gICAgdmFyIGZvcm1hdCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0sXG4gICAgICAgIGZvcm1hdFVwcGVyID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5LnRvVXBwZXJDYXNlKCldO1xuXG4gICAgaWYgKGZvcm1hdCB8fCAhZm9ybWF0VXBwZXIpIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICB9XG5cbiAgICB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldID0gZm9ybWF0VXBwZXIucmVwbGFjZSgvTU1NTXxNTXxERHxkZGRkL2csIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgcmV0dXJuIHZhbC5zbGljZSgxKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldO1xufVxuXG52YXIgZGVmYXVsdEludmFsaWREYXRlID0gJ0ludmFsaWQgZGF0ZSc7XG5cbmZ1bmN0aW9uIGludmFsaWREYXRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5faW52YWxpZERhdGU7XG59XG5cbnZhciBkZWZhdWx0T3JkaW5hbCA9ICclZCc7XG52YXIgZGVmYXVsdERheU9mTW9udGhPcmRpbmFsUGFyc2UgPSAvXFxkezEsMn0vO1xuXG5mdW5jdGlvbiBvcmRpbmFsIChudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5fb3JkaW5hbC5yZXBsYWNlKCclZCcsIG51bWJlcik7XG59XG5cbnZhciBkZWZhdWx0UmVsYXRpdmVUaW1lID0ge1xuICAgIGZ1dHVyZSA6ICdpbiAlcycsXG4gICAgcGFzdCAgIDogJyVzIGFnbycsXG4gICAgcyAgOiAnYSBmZXcgc2Vjb25kcycsXG4gICAgc3MgOiAnJWQgc2Vjb25kcycsXG4gICAgbSAgOiAnYSBtaW51dGUnLFxuICAgIG1tIDogJyVkIG1pbnV0ZXMnLFxuICAgIGggIDogJ2FuIGhvdXInLFxuICAgIGhoIDogJyVkIGhvdXJzJyxcbiAgICBkICA6ICdhIGRheScsXG4gICAgZGQgOiAnJWQgZGF5cycsXG4gICAgTSAgOiAnYSBtb250aCcsXG4gICAgTU0gOiAnJWQgbW9udGhzJyxcbiAgICB5ICA6ICdhIHllYXInLFxuICAgIHl5IDogJyVkIHllYXJzJ1xufTtcblxuZnVuY3Rpb24gcmVsYXRpdmVUaW1lIChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIHtcbiAgICB2YXIgb3V0cHV0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW3N0cmluZ107XG4gICAgcmV0dXJuIChpc0Z1bmN0aW9uKG91dHB1dCkpID9cbiAgICAgICAgb3V0cHV0KG51bWJlciwgd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSkgOlxuICAgICAgICBvdXRwdXQucmVwbGFjZSgvJWQvaSwgbnVtYmVyKTtcbn1cblxuZnVuY3Rpb24gcGFzdEZ1dHVyZSAoZGlmZiwgb3V0cHV0KSB7XG4gICAgdmFyIGZvcm1hdCA9IHRoaXMuX3JlbGF0aXZlVGltZVtkaWZmID4gMCA/ICdmdXR1cmUnIDogJ3Bhc3QnXTtcbiAgICByZXR1cm4gaXNGdW5jdGlvbihmb3JtYXQpID8gZm9ybWF0KG91dHB1dCkgOiBmb3JtYXQucmVwbGFjZSgvJXMvaSwgb3V0cHV0KTtcbn1cblxudmFyIGFsaWFzZXMgPSB7fTtcblxuZnVuY3Rpb24gYWRkVW5pdEFsaWFzICh1bml0LCBzaG9ydGhhbmQpIHtcbiAgICB2YXIgbG93ZXJDYXNlID0gdW5pdC50b0xvd2VyQ2FzZSgpO1xuICAgIGFsaWFzZXNbbG93ZXJDYXNlXSA9IGFsaWFzZXNbbG93ZXJDYXNlICsgJ3MnXSA9IGFsaWFzZXNbc2hvcnRoYW5kXSA9IHVuaXQ7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB1bml0cyA9PT0gJ3N0cmluZycgPyBhbGlhc2VzW3VuaXRzXSB8fCBhbGlhc2VzW3VuaXRzLnRvTG93ZXJDYXNlKCldIDogdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVPYmplY3RVbml0cyhpbnB1dE9iamVjdCkge1xuICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSB7fSxcbiAgICAgICAgbm9ybWFsaXplZFByb3AsXG4gICAgICAgIHByb3A7XG5cbiAgICBmb3IgKHByb3AgaW4gaW5wdXRPYmplY3QpIHtcbiAgICAgICAgaWYgKGhhc093blByb3AoaW5wdXRPYmplY3QsIHByb3ApKSB7XG4gICAgICAgICAgICBub3JtYWxpemVkUHJvcCA9IG5vcm1hbGl6ZVVuaXRzKHByb3ApO1xuICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRQcm9wKSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZElucHV0W25vcm1hbGl6ZWRQcm9wXSA9IGlucHV0T2JqZWN0W3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRJbnB1dDtcbn1cblxudmFyIHByaW9yaXRpZXMgPSB7fTtcblxuZnVuY3Rpb24gYWRkVW5pdFByaW9yaXR5KHVuaXQsIHByaW9yaXR5KSB7XG4gICAgcHJpb3JpdGllc1t1bml0XSA9IHByaW9yaXR5O1xufVxuXG5mdW5jdGlvbiBnZXRQcmlvcml0aXplZFVuaXRzKHVuaXRzT2JqKSB7XG4gICAgdmFyIHVuaXRzID0gW107XG4gICAgZm9yICh2YXIgdSBpbiB1bml0c09iaikge1xuICAgICAgICB1bml0cy5wdXNoKHt1bml0OiB1LCBwcmlvcml0eTogcHJpb3JpdGllc1t1XX0pO1xuICAgIH1cbiAgICB1bml0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLnByaW9yaXR5IC0gYi5wcmlvcml0eTtcbiAgICB9KTtcbiAgICByZXR1cm4gdW5pdHM7XG59XG5cbmZ1bmN0aW9uIHplcm9GaWxsKG51bWJlciwgdGFyZ2V0TGVuZ3RoLCBmb3JjZVNpZ24pIHtcbiAgICB2YXIgYWJzTnVtYmVyID0gJycgKyBNYXRoLmFicyhudW1iZXIpLFxuICAgICAgICB6ZXJvc1RvRmlsbCA9IHRhcmdldExlbmd0aCAtIGFic051bWJlci5sZW5ndGgsXG4gICAgICAgIHNpZ24gPSBudW1iZXIgPj0gMDtcbiAgICByZXR1cm4gKHNpZ24gPyAoZm9yY2VTaWduID8gJysnIDogJycpIDogJy0nKSArXG4gICAgICAgIE1hdGgucG93KDEwLCBNYXRoLm1heCgwLCB6ZXJvc1RvRmlsbCkpLnRvU3RyaW5nKCkuc3Vic3RyKDEpICsgYWJzTnVtYmVyO1xufVxuXG52YXIgZm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhbSGhdbW0oc3MpP3xNb3xNTT9NP00/fERvfERERG98REQ/RD9EP3xkZGQ/ZD98ZG8/fHdbb3x3XT98V1tvfFddP3xRbz98WVlZWVlZfFlZWVlZfFlZWVl8WVl8Z2coZ2dnPyk/fEdHKEdHRz8pP3xlfEV8YXxBfGhoP3xISD98a2s/fG1tP3xzcz98U3sxLDl9fHh8WHx6ej98Wlo/fC4pL2c7XG5cbnZhciBsb2NhbEZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTFRTfExUfExMP0w/TD98bHsxLDR9KS9nO1xuXG52YXIgZm9ybWF0RnVuY3Rpb25zID0ge307XG5cbnZhciBmb3JtYXRUb2tlbkZ1bmN0aW9ucyA9IHt9O1xuXG4vLyB0b2tlbjogICAgJ00nXG4vLyBwYWRkZWQ6ICAgWydNTScsIDJdXG4vLyBvcmRpbmFsOiAgJ01vJ1xuLy8gY2FsbGJhY2s6IGZ1bmN0aW9uICgpIHsgdGhpcy5tb250aCgpICsgMSB9XG5mdW5jdGlvbiBhZGRGb3JtYXRUb2tlbiAodG9rZW4sIHBhZGRlZCwgb3JkaW5hbCwgY2FsbGJhY2spIHtcbiAgICB2YXIgZnVuYyA9IGNhbGxiYWNrO1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1tjYWxsYmFja10oKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSA9IGZ1bmM7XG4gICAgfVxuICAgIGlmIChwYWRkZWQpIHtcbiAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbcGFkZGVkWzBdXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB6ZXJvRmlsbChmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHBhZGRlZFsxXSwgcGFkZGVkWzJdKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKG9yZGluYWwpIHtcbiAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbb3JkaW5hbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkub3JkaW5hbChmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHRva2VuKTtcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQubWF0Y2goL1xcW1tcXHNcXFNdLykpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJyk7XG4gICAgfVxuICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXFxcL2csICcnKTtcbn1cblxuZnVuY3Rpb24gbWFrZUZvcm1hdEZ1bmN0aW9uKGZvcm1hdCkge1xuICAgIHZhciBhcnJheSA9IGZvcm1hdC5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSwgaSwgbGVuZ3RoO1xuXG4gICAgZm9yIChpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXSkge1xuICAgICAgICAgICAgYXJyYXlbaV0gPSBmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcnJheVtpXSA9IHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoYXJyYXlbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtb20pIHtcbiAgICAgICAgdmFyIG91dHB1dCA9ICcnLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG91dHB1dCArPSBpc0Z1bmN0aW9uKGFycmF5W2ldKSA/IGFycmF5W2ldLmNhbGwobW9tLCBmb3JtYXQpIDogYXJyYXlbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xufVxuXG4vLyBmb3JtYXQgZGF0ZSB1c2luZyBuYXRpdmUgZGF0ZSBvYmplY3RcbmZ1bmN0aW9uIGZvcm1hdE1vbWVudChtLCBmb3JtYXQpIHtcbiAgICBpZiAoIW0uaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiBtLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgIH1cblxuICAgIGZvcm1hdCA9IGV4cGFuZEZvcm1hdChmb3JtYXQsIG0ubG9jYWxlRGF0YSgpKTtcbiAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSA9IGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdIHx8IG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpO1xuXG4gICAgcmV0dXJuIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKG0pO1xufVxuXG5mdW5jdGlvbiBleHBhbmRGb3JtYXQoZm9ybWF0LCBsb2NhbGUpIHtcbiAgICB2YXIgaSA9IDU7XG5cbiAgICBmdW5jdGlvbiByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5sb25nRGF0ZUZvcm1hdChpbnB1dCkgfHwgaW5wdXQ7XG4gICAgfVxuXG4gICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgd2hpbGUgKGkgPj0gMCAmJiBsb2NhbEZvcm1hdHRpbmdUb2tlbnMudGVzdChmb3JtYXQpKSB7XG4gICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKGxvY2FsRm9ybWF0dGluZ1Rva2VucywgcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKTtcbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIGkgLT0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9ybWF0O1xufVxuXG52YXIgbWF0Y2gxICAgICAgICAgPSAvXFxkLzsgICAgICAgICAgICAvLyAgICAgICAwIC0gOVxudmFyIG1hdGNoMiAgICAgICAgID0gL1xcZFxcZC87ICAgICAgICAgIC8vICAgICAgMDAgLSA5OVxudmFyIG1hdGNoMyAgICAgICAgID0gL1xcZHszfS87ICAgICAgICAgLy8gICAgIDAwMCAtIDk5OVxudmFyIG1hdGNoNCAgICAgICAgID0gL1xcZHs0fS87ICAgICAgICAgLy8gICAgMDAwMCAtIDk5OTlcbnZhciBtYXRjaDYgICAgICAgICA9IC9bKy1dP1xcZHs2fS87ICAgIC8vIC05OTk5OTkgLSA5OTk5OTlcbnZhciBtYXRjaDF0bzIgICAgICA9IC9cXGRcXGQ/LzsgICAgICAgICAvLyAgICAgICAwIC0gOTlcbnZhciBtYXRjaDN0bzQgICAgICA9IC9cXGRcXGRcXGRcXGQ/LzsgICAgIC8vICAgICA5OTkgLSA5OTk5XG52YXIgbWF0Y2g1dG82ICAgICAgPSAvXFxkXFxkXFxkXFxkXFxkXFxkPy87IC8vICAgOTk5OTkgLSA5OTk5OTlcbnZhciBtYXRjaDF0bzMgICAgICA9IC9cXGR7MSwzfS87ICAgICAgIC8vICAgICAgIDAgLSA5OTlcbnZhciBtYXRjaDF0bzQgICAgICA9IC9cXGR7MSw0fS87ICAgICAgIC8vICAgICAgIDAgLSA5OTk5XG52YXIgbWF0Y2gxdG82ICAgICAgPSAvWystXT9cXGR7MSw2fS87ICAvLyAtOTk5OTk5IC0gOTk5OTk5XG5cbnZhciBtYXRjaFVuc2lnbmVkICA9IC9cXGQrLzsgICAgICAgICAgIC8vICAgICAgIDAgLSBpbmZcbnZhciBtYXRjaFNpZ25lZCAgICA9IC9bKy1dP1xcZCsvOyAgICAgIC8vICAgIC1pbmYgLSBpbmZcblxudmFyIG1hdGNoT2Zmc2V0ICAgID0gL1p8WystXVxcZFxcZDo/XFxkXFxkL2dpOyAvLyArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcbnZhciBtYXRjaFNob3J0T2Zmc2V0ID0gL1p8WystXVxcZFxcZCg/Ojo/XFxkXFxkKT8vZ2k7IC8vICswMCAtMDAgKzAwOjAwIC0wMDowMCArMDAwMCAtMDAwMCBvciBaXG5cbnZhciBtYXRjaFRpbWVzdGFtcCA9IC9bKy1dP1xcZCsoXFwuXFxkezEsM30pPy87IC8vIDEyMzQ1Njc4OSAxMjM0NTY3ODkuMTIzXG5cbi8vIGFueSB3b3JkIChvciB0d28pIGNoYXJhY3RlcnMgb3IgbnVtYmVycyBpbmNsdWRpbmcgdHdvL3RocmVlIHdvcmQgbW9udGggaW4gYXJhYmljLlxuLy8gaW5jbHVkZXMgc2NvdHRpc2ggZ2FlbGljIHR3byB3b3JkIGFuZCBoeXBoZW5hdGVkIG1vbnRoc1xudmFyIG1hdGNoV29yZCA9IC9bMC05XXswLDI1Nn1bJ2EtelxcdTAwQTAtXFx1MDVGRlxcdTA3MDAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkYwN1xcdUZGMTAtXFx1RkZFRl17MSwyNTZ9fFtcXHUwNjAwLVxcdTA2RkZcXC9dezEsMjU2fShcXHMqP1tcXHUwNjAwLVxcdTA2RkZdezEsMjU2fSl7MSwyfS9pO1xuXG52YXIgcmVnZXhlcyA9IHt9O1xuXG5mdW5jdGlvbiBhZGRSZWdleFRva2VuICh0b2tlbiwgcmVnZXgsIHN0cmljdFJlZ2V4KSB7XG4gICAgcmVnZXhlc1t0b2tlbl0gPSBpc0Z1bmN0aW9uKHJlZ2V4KSA/IHJlZ2V4IDogZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGVEYXRhKSB7XG4gICAgICAgIHJldHVybiAoaXNTdHJpY3QgJiYgc3RyaWN0UmVnZXgpID8gc3RyaWN0UmVnZXggOiByZWdleDtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4gKHRva2VuLCBjb25maWcpIHtcbiAgICBpZiAoIWhhc093blByb3AocmVnZXhlcywgdG9rZW4pKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHVuZXNjYXBlRm9ybWF0KHRva2VuKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlZ2V4ZXNbdG9rZW5dKGNvbmZpZy5fc3RyaWN0LCBjb25maWcuX2xvY2FsZSk7XG59XG5cbi8vIENvZGUgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM1NjE0OTMvaXMtdGhlcmUtYS1yZWdleHAtZXNjYXBlLWZ1bmN0aW9uLWluLWphdmFzY3JpcHRcbmZ1bmN0aW9uIHVuZXNjYXBlRm9ybWF0KHMpIHtcbiAgICByZXR1cm4gcmVnZXhFc2NhcGUocy5yZXBsYWNlKCdcXFxcJywgJycpLnJlcGxhY2UoL1xcXFwoXFxbKXxcXFxcKFxcXSl8XFxbKFteXFxdXFxbXSopXFxdfFxcXFwoLikvZywgZnVuY3Rpb24gKG1hdGNoZWQsIHAxLCBwMiwgcDMsIHA0KSB7XG4gICAgICAgIHJldHVybiBwMSB8fCBwMiB8fCBwMyB8fCBwNDtcbiAgICB9KSk7XG59XG5cbmZ1bmN0aW9uIHJlZ2V4RXNjYXBlKHMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbn1cblxudmFyIHRva2VucyA9IHt9O1xuXG5mdW5jdGlvbiBhZGRQYXJzZVRva2VuICh0b2tlbiwgY2FsbGJhY2spIHtcbiAgICB2YXIgaSwgZnVuYyA9IGNhbGxiYWNrO1xuICAgIGlmICh0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRva2VuID0gW3Rva2VuXTtcbiAgICB9XG4gICAgaWYgKGlzTnVtYmVyKGNhbGxiYWNrKSkge1xuICAgICAgICBmdW5jID0gZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICAgICAgYXJyYXlbY2FsbGJhY2tdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdG9rZW5zW3Rva2VuW2ldXSA9IGZ1bmM7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRXZWVrUGFyc2VUb2tlbiAodG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICBjb25maWcuX3cgPSBjb25maWcuX3cgfHwge307XG4gICAgICAgIGNhbGxiYWNrKGlucHV0LCBjb25maWcuX3csIGNvbmZpZywgdG9rZW4pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgaW5wdXQsIGNvbmZpZykge1xuICAgIGlmIChpbnB1dCAhPSBudWxsICYmIGhhc093blByb3AodG9rZW5zLCB0b2tlbikpIHtcbiAgICAgICAgdG9rZW5zW3Rva2VuXShpbnB1dCwgY29uZmlnLl9hLCBjb25maWcsIHRva2VuKTtcbiAgICB9XG59XG5cbnZhciBZRUFSID0gMDtcbnZhciBNT05USCA9IDE7XG52YXIgREFURSA9IDI7XG52YXIgSE9VUiA9IDM7XG52YXIgTUlOVVRFID0gNDtcbnZhciBTRUNPTkQgPSA1O1xudmFyIE1JTExJU0VDT05EID0gNjtcbnZhciBXRUVLID0gNztcbnZhciBXRUVLREFZID0gODtcblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbignWScsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgeSA9IHRoaXMueWVhcigpO1xuICAgIHJldHVybiB5IDw9IDk5OTkgPyAnJyArIHkgOiAnKycgKyB5O1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKDAsIFsnWVknLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnllYXIoKSAlIDEwMDtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVknLCAgIDRdLCAgICAgICAwLCAneWVhcicpO1xuYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZWScsICA1XSwgICAgICAgMCwgJ3llYXInKTtcbmFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVlZJywgNiwgdHJ1ZV0sIDAsICd5ZWFyJyk7XG5cbi8vIEFMSUFTRVNcblxuYWRkVW5pdEFsaWFzKCd5ZWFyJywgJ3knKTtcblxuLy8gUFJJT1JJVElFU1xuXG5hZGRVbml0UHJpb3JpdHkoJ3llYXInLCAxKTtcblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCdZJywgICAgICBtYXRjaFNpZ25lZCk7XG5hZGRSZWdleFRva2VuKCdZWScsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG5hZGRSZWdleFRva2VuKCdZWVlZJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG5hZGRSZWdleFRva2VuKCdZWVlZWScsICBtYXRjaDF0bzYsIG1hdGNoNik7XG5hZGRSZWdleFRva2VuKCdZWVlZWVknLCBtYXRjaDF0bzYsIG1hdGNoNik7XG5cbmFkZFBhcnNlVG9rZW4oWydZWVlZWScsICdZWVlZWVknXSwgWUVBUik7XG5hZGRQYXJzZVRva2VuKCdZWVlZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgIGFycmF5W1lFQVJdID0gaW5wdXQubGVuZ3RoID09PSAyID8gaG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpIDogdG9JbnQoaW5wdXQpO1xufSk7XG5hZGRQYXJzZVRva2VuKCdZWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICBhcnJheVtZRUFSXSA9IGhvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbn0pO1xuYWRkUGFyc2VUb2tlbignWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICBhcnJheVtZRUFSXSA9IHBhcnNlSW50KGlucHV0LCAxMCk7XG59KTtcblxuLy8gSEVMUEVSU1xuXG5mdW5jdGlvbiBkYXlzSW5ZZWFyKHllYXIpIHtcbiAgICByZXR1cm4gaXNMZWFwWWVhcih5ZWFyKSA/IDM2NiA6IDM2NTtcbn1cblxuZnVuY3Rpb24gaXNMZWFwWWVhcih5ZWFyKSB7XG4gICAgcmV0dXJuICh5ZWFyICUgNCA9PT0gMCAmJiB5ZWFyICUgMTAwICE9PSAwKSB8fCB5ZWFyICUgNDAwID09PSAwO1xufVxuXG4vLyBIT09LU1xuXG5ob29rcy5wYXJzZVR3b0RpZ2l0WWVhciA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIHJldHVybiB0b0ludChpbnB1dCkgKyAodG9JbnQoaW5wdXQpID4gNjggPyAxOTAwIDogMjAwMCk7XG59O1xuXG4vLyBNT01FTlRTXG5cbnZhciBnZXRTZXRZZWFyID0gbWFrZUdldFNldCgnRnVsbFllYXInLCB0cnVlKTtcblxuZnVuY3Rpb24gZ2V0SXNMZWFwWWVhciAoKSB7XG4gICAgcmV0dXJuIGlzTGVhcFllYXIodGhpcy55ZWFyKCkpO1xufVxuXG5mdW5jdGlvbiBtYWtlR2V0U2V0ICh1bml0LCBrZWVwVGltZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHNldCQxKHRoaXMsIHVuaXQsIHZhbHVlKTtcbiAgICAgICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCBrZWVwVGltZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnZXQodGhpcywgdW5pdCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBnZXQgKG1vbSwgdW5pdCkge1xuICAgIHJldHVybiBtb20uaXNWYWxpZCgpID9cbiAgICAgICAgbW9tLl9kWydnZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKCkgOiBOYU47XG59XG5cbmZ1bmN0aW9uIHNldCQxIChtb20sIHVuaXQsIHZhbHVlKSB7XG4gICAgaWYgKG1vbS5pc1ZhbGlkKCkgJiYgIWlzTmFOKHZhbHVlKSkge1xuICAgICAgICBpZiAodW5pdCA9PT0gJ0Z1bGxZZWFyJyAmJiBpc0xlYXBZZWFyKG1vbS55ZWFyKCkpICYmIG1vbS5tb250aCgpID09PSAxICYmIG1vbS5kYXRlKCkgPT09IDI5KSB7XG4gICAgICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0odmFsdWUsIG1vbS5tb250aCgpLCBkYXlzSW5Nb250aCh2YWx1ZSwgbW9tLm1vbnRoKCkpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIE1PTUVOVFNcblxuZnVuY3Rpb24gc3RyaW5nR2V0ICh1bml0cykge1xuICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgIGlmIChpc0Z1bmN0aW9uKHRoaXNbdW5pdHNdKSkge1xuICAgICAgICByZXR1cm4gdGhpc1t1bml0c10oKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cblxuZnVuY3Rpb24gc3RyaW5nU2V0ICh1bml0cywgdmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHVuaXRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKHVuaXRzKTtcbiAgICAgICAgdmFyIHByaW9yaXRpemVkID0gZ2V0UHJpb3JpdGl6ZWRVbml0cyh1bml0cyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJpb3JpdGl6ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXNbcHJpb3JpdGl6ZWRbaV0udW5pdF0odW5pdHNbcHJpb3JpdGl6ZWRbaV0udW5pdF0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHRoaXNbdW5pdHNdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHNdKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gbW9kKG4sIHgpIHtcbiAgICByZXR1cm4gKChuICUgeCkgKyB4KSAlIHg7XG59XG5cbnZhciBpbmRleE9mO1xuXG5pZiAoQXJyYXkucHJvdG90eXBlLmluZGV4T2YpIHtcbiAgICBpbmRleE9mID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2Y7XG59IGVsc2Uge1xuICAgIGluZGV4T2YgPSBmdW5jdGlvbiAobykge1xuICAgICAgICAvLyBJIGtub3dcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAodGhpc1tpXSA9PT0gbykge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCkge1xuICAgIGlmIChpc05hTih5ZWFyKSB8fCBpc05hTihtb250aCkpIHtcbiAgICAgICAgcmV0dXJuIE5hTjtcbiAgICB9XG4gICAgdmFyIG1vZE1vbnRoID0gbW9kKG1vbnRoLCAxMik7XG4gICAgeWVhciArPSAobW9udGggLSBtb2RNb250aCkgLyAxMjtcbiAgICByZXR1cm4gbW9kTW9udGggPT09IDEgPyAoaXNMZWFwWWVhcih5ZWFyKSA/IDI5IDogMjgpIDogKDMxIC0gbW9kTW9udGggJSA3ICUgMik7XG59XG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oJ00nLCBbJ01NJywgMl0sICdNbycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5tb250aCgpICsgMTtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbignTU1NJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHNTaG9ydCh0aGlzLCBmb3JtYXQpO1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKCdNTU1NJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHModGhpcywgZm9ybWF0KTtcbn0pO1xuXG4vLyBBTElBU0VTXG5cbmFkZFVuaXRBbGlhcygnbW9udGgnLCAnTScpO1xuXG4vLyBQUklPUklUWVxuXG5hZGRVbml0UHJpb3JpdHkoJ21vbnRoJywgOCk7XG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbignTScsICAgIG1hdGNoMXRvMik7XG5hZGRSZWdleFRva2VuKCdNTScsICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuYWRkUmVnZXhUb2tlbignTU1NJywgIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgcmV0dXJuIGxvY2FsZS5tb250aHNTaG9ydFJlZ2V4KGlzU3RyaWN0KTtcbn0pO1xuYWRkUmVnZXhUb2tlbignTU1NTScsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgcmV0dXJuIGxvY2FsZS5tb250aHNSZWdleChpc1N0cmljdCk7XG59KTtcblxuYWRkUGFyc2VUb2tlbihbJ00nLCAnTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgIGFycmF5W01PTlRIXSA9IHRvSW50KGlucHV0KSAtIDE7XG59KTtcblxuYWRkUGFyc2VUb2tlbihbJ01NTScsICdNTU1NJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICB2YXIgbW9udGggPSBjb25maWcuX2xvY2FsZS5tb250aHNQYXJzZShpbnB1dCwgdG9rZW4sIGNvbmZpZy5fc3RyaWN0KTtcbiAgICAvLyBpZiB3ZSBkaWRuJ3QgZmluZCBhIG1vbnRoIG5hbWUsIG1hcmsgdGhlIGRhdGUgYXMgaW52YWxpZC5cbiAgICBpZiAobW9udGggIT0gbnVsbCkge1xuICAgICAgICBhcnJheVtNT05USF0gPSBtb250aDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkTW9udGggPSBpbnB1dDtcbiAgICB9XG59KTtcblxuLy8gTE9DQUxFU1xuXG52YXIgTU9OVEhTX0lOX0ZPUk1BVCA9IC9EW29EXT8oXFxbW15cXFtcXF1dKlxcXXxcXHMpK01NTU0/LztcbnZhciBkZWZhdWx0TG9jYWxlTW9udGhzID0gJ0phbnVhcnlfRmVicnVhcnlfTWFyY2hfQXByaWxfTWF5X0p1bmVfSnVseV9BdWd1c3RfU2VwdGVtYmVyX09jdG9iZXJfTm92ZW1iZXJfRGVjZW1iZXInLnNwbGl0KCdfJyk7XG5mdW5jdGlvbiBsb2NhbGVNb250aHMgKG0sIGZvcm1hdCkge1xuICAgIGlmICghbSkge1xuICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl9tb250aHMpID8gdGhpcy5fbW9udGhzIDpcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1snc3RhbmRhbG9uZSddO1xuICAgIH1cbiAgICByZXR1cm4gaXNBcnJheSh0aGlzLl9tb250aHMpID8gdGhpcy5fbW9udGhzW20ubW9udGgoKV0gOlxuICAgICAgICB0aGlzLl9tb250aHNbKHRoaXMuX21vbnRocy5pc0Zvcm1hdCB8fCBNT05USFNfSU5fRk9STUFUKS50ZXN0KGZvcm1hdCkgPyAnZm9ybWF0JyA6ICdzdGFuZGFsb25lJ11bbS5tb250aCgpXTtcbn1cblxudmFyIGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydCA9ICdKYW5fRmViX01hcl9BcHJfTWF5X0p1bl9KdWxfQXVnX1NlcF9PY3RfTm92X0RlYycuc3BsaXQoJ18nKTtcbmZ1bmN0aW9uIGxvY2FsZU1vbnRoc1Nob3J0IChtLCBmb3JtYXQpIHtcbiAgICBpZiAoIW0pIHtcbiAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzU2hvcnQpID8gdGhpcy5fbW9udGhzU2hvcnQgOlxuICAgICAgICAgICAgdGhpcy5fbW9udGhzU2hvcnRbJ3N0YW5kYWxvbmUnXTtcbiAgICB9XG4gICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzU2hvcnQpID8gdGhpcy5fbW9udGhzU2hvcnRbbS5tb250aCgpXSA6XG4gICAgICAgIHRoaXMuX21vbnRoc1Nob3J0W01PTlRIU19JTl9GT1JNQVQudGVzdChmb3JtYXQpID8gJ2Zvcm1hdCcgOiAnc3RhbmRhbG9uZSddW20ubW9udGgoKV07XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVN0cmljdFBhcnNlKG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICB2YXIgaSwgaWksIG1vbSwgbGxjID0gbW9udGhOYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAvLyB0aGlzIGlzIG5vdCB1c2VkXG4gICAgICAgIHRoaXMuX21vbnRoc1BhcnNlID0gW107XG4gICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgKytpKSB7XG4gICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0gPSB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0gPSB0aGlzLm1vbnRocyhtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0cmljdCkge1xuICAgICAgICBpZiAoZm9ybWF0ID09PSAnTU1NJykge1xuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9sb25nTW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ01NTScpIHtcbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0TW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbG9uZ01vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX2xvbmdNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydE1vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9jYWxlTW9udGhzUGFyc2UgKG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgIGlmICh0aGlzLl9tb250aHNQYXJzZUV4YWN0KSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVTdHJpY3RQYXJzZS5jYWxsKHRoaXMsIG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fbW9udGhzUGFyc2UpIHtcbiAgICAgICAgdGhpcy5fbW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlID0gW107XG4gICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2UgPSBbXTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBhZGQgc29ydGluZ1xuICAgIC8vIFNvcnRpbmcgbWFrZXMgc3VyZSBpZiBvbmUgbW9udGggKG9yIGFiYnIpIGlzIGEgcHJlZml4IG9mIGFub3RoZXJcbiAgICAvLyBzZWUgc29ydGluZyBpbiBjb21wdXRlTW9udGhzUGFyc2VcbiAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCBpXSk7XG4gICAgICAgIGlmIChzdHJpY3QgJiYgIXRoaXMuX2xvbmdNb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3RyaWN0ICYmICF0aGlzLl9tb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKSArICd8XicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpO1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdNTU1NJyAmJiB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NJyAmJiB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCAmJiB0aGlzLl9tb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBNT01FTlRTXG5cbmZ1bmN0aW9uIHNldE1vbnRoIChtb20sIHZhbHVlKSB7XG4gICAgdmFyIGRheU9mTW9udGg7XG5cbiAgICBpZiAoIW1vbS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgLy8gTm8gb3BcbiAgICAgICAgcmV0dXJuIG1vbTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoL15cXGQrJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdG9JbnQodmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBtb20ubG9jYWxlRGF0YSgpLm1vbnRoc1BhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgIC8vIFRPRE86IEFub3RoZXIgc2lsZW50IGZhaWx1cmU/XG4gICAgICAgICAgICBpZiAoIWlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb207XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkYXlPZk1vbnRoID0gTWF0aC5taW4obW9tLmRhdGUoKSwgZGF5c0luTW9udGgobW9tLnllYXIoKSwgdmFsdWUpKTtcbiAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgJ01vbnRoJ10odmFsdWUsIGRheU9mTW9udGgpO1xuICAgIHJldHVybiBtb207XG59XG5cbmZ1bmN0aW9uIGdldFNldE1vbnRoICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgIHNldE1vbnRoKHRoaXMsIHZhbHVlKTtcbiAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZ2V0KHRoaXMsICdNb250aCcpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGF5c0luTW9udGggKCkge1xuICAgIHJldHVybiBkYXlzSW5Nb250aCh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpKTtcbn1cblxudmFyIGRlZmF1bHRNb250aHNTaG9ydFJlZ2V4ID0gbWF0Y2hXb3JkO1xuZnVuY3Rpb24gbW9udGhzU2hvcnRSZWdleCAoaXNTdHJpY3QpIHtcbiAgICBpZiAodGhpcy5fbW9udGhzUGFyc2VFeGFjdCkge1xuICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNSZWdleCcpKSB7XG4gICAgICAgICAgICBjb21wdXRlTW9udGhzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1Nob3J0UmVnZXg7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNTaG9ydFJlZ2V4JykpIHtcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1Nob3J0UmVnZXggPSBkZWZhdWx0TW9udGhzU2hvcnRSZWdleDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleCAmJiBpc1N0cmljdCA/XG4gICAgICAgICAgICB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4IDogdGhpcy5fbW9udGhzU2hvcnRSZWdleDtcbiAgICB9XG59XG5cbnZhciBkZWZhdWx0TW9udGhzUmVnZXggPSBtYXRjaFdvcmQ7XG5mdW5jdGlvbiBtb250aHNSZWdleCAoaXNTdHJpY3QpIHtcbiAgICBpZiAodGhpcy5fbW9udGhzUGFyc2VFeGFjdCkge1xuICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNSZWdleCcpKSB7XG4gICAgICAgICAgICBjb21wdXRlTW9udGhzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTdHJpY3RSZWdleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNSZWdleDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1JlZ2V4JykpIHtcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1JlZ2V4ID0gZGVmYXVsdE1vbnRoc1JlZ2V4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTdHJpY3RSZWdleCAmJiBpc1N0cmljdCA/XG4gICAgICAgICAgICB0aGlzLl9tb250aHNTdHJpY3RSZWdleCA6IHRoaXMuX21vbnRoc1JlZ2V4O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29tcHV0ZU1vbnRoc1BhcnNlICgpIHtcbiAgICBmdW5jdGlvbiBjbXBMZW5SZXYoYSwgYikge1xuICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcbiAgICB9XG5cbiAgICB2YXIgc2hvcnRQaWVjZXMgPSBbXSwgbG9uZ1BpZWNlcyA9IFtdLCBtaXhlZFBpZWNlcyA9IFtdLFxuICAgICAgICBpLCBtb207XG4gICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICBzaG9ydFBpZWNlcy5wdXNoKHRoaXMubW9udGhzU2hvcnQobW9tLCAnJykpO1xuICAgICAgICBsb25nUGllY2VzLnB1c2godGhpcy5tb250aHMobW9tLCAnJykpO1xuICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHRoaXMubW9udGhzKG1vbSwgJycpKTtcbiAgICAgICAgbWl4ZWRQaWVjZXMucHVzaCh0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpKTtcbiAgICB9XG4gICAgLy8gU29ydGluZyBtYWtlcyBzdXJlIGlmIG9uZSBtb250aCAob3IgYWJicikgaXMgYSBwcmVmaXggb2YgYW5vdGhlciBpdFxuICAgIC8vIHdpbGwgbWF0Y2ggdGhlIGxvbmdlciBwaWVjZS5cbiAgICBzaG9ydFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgbG9uZ1BpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgbWl4ZWRQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgIHNob3J0UGllY2VzW2ldID0gcmVnZXhFc2NhcGUoc2hvcnRQaWVjZXNbaV0pO1xuICAgICAgICBsb25nUGllY2VzW2ldID0gcmVnZXhFc2NhcGUobG9uZ1BpZWNlc1tpXSk7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCAyNDsgaSsrKSB7XG4gICAgICAgIG1peGVkUGllY2VzW2ldID0gcmVnZXhFc2NhcGUobWl4ZWRQaWVjZXNbaV0pO1xuICAgIH1cblxuICAgIHRoaXMuX21vbnRoc1JlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbWl4ZWRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgIHRoaXMuX21vbnRoc1Nob3J0UmVnZXggPSB0aGlzLl9tb250aHNSZWdleDtcbiAgICB0aGlzLl9tb250aHNTdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIGxvbmdQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgIHRoaXMuX21vbnRoc1Nob3J0U3RyaWN0UmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBzaG9ydFBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZURhdGUgKHksIG0sIGQsIGgsIE0sIHMsIG1zKSB7XG4gICAgLy8gY2FuJ3QganVzdCBhcHBseSgpIHRvIGNyZWF0ZSBhIGRhdGU6XG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xLzE4MTM0OFxuICAgIHZhciBkYXRlID0gbmV3IERhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpO1xuXG4gICAgLy8gdGhlIGRhdGUgY29uc3RydWN0b3IgcmVtYXBzIHllYXJzIDAtOTkgdG8gMTkwMC0xOTk5XG4gICAgaWYgKHkgPCAxMDAgJiYgeSA+PSAwICYmIGlzRmluaXRlKGRhdGUuZ2V0RnVsbFllYXIoKSkpIHtcbiAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih5KTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVVUQ0RhdGUgKHkpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDLmFwcGx5KG51bGwsIGFyZ3VtZW50cykpO1xuXG4gICAgLy8gdGhlIERhdGUuVVRDIGZ1bmN0aW9uIHJlbWFwcyB5ZWFycyAwLTk5IHRvIDE5MDAtMTk5OVxuICAgIGlmICh5IDwgMTAwICYmIHkgPj0gMCAmJiBpc0Zpbml0ZShkYXRlLmdldFVUQ0Z1bGxZZWFyKCkpKSB7XG4gICAgICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoeSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRlO1xufVxuXG4vLyBzdGFydC1vZi1maXJzdC13ZWVrIC0gc3RhcnQtb2YteWVhclxuZnVuY3Rpb24gZmlyc3RXZWVrT2Zmc2V0KHllYXIsIGRvdywgZG95KSB7XG4gICAgdmFyIC8vIGZpcnN0LXdlZWsgZGF5IC0tIHdoaWNoIGphbnVhcnkgaXMgYWx3YXlzIGluIHRoZSBmaXJzdCB3ZWVrICg0IGZvciBpc28sIDEgZm9yIG90aGVyKVxuICAgICAgICBmd2QgPSA3ICsgZG93IC0gZG95LFxuICAgICAgICAvLyBmaXJzdC13ZWVrIGRheSBsb2NhbCB3ZWVrZGF5IC0tIHdoaWNoIGxvY2FsIHdlZWtkYXkgaXMgZndkXG4gICAgICAgIGZ3ZGx3ID0gKDcgKyBjcmVhdGVVVENEYXRlKHllYXIsIDAsIGZ3ZCkuZ2V0VVRDRGF5KCkgLSBkb3cpICUgNztcblxuICAgIHJldHVybiAtZndkbHcgKyBmd2QgLSAxO1xufVxuXG4vLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JU09fd2Vla19kYXRlI0NhbGN1bGF0aW5nX2FfZGF0ZV9naXZlbl90aGVfeWVhci4yQ193ZWVrX251bWJlcl9hbmRfd2Vla2RheVxuZnVuY3Rpb24gZGF5T2ZZZWFyRnJvbVdlZWtzKHllYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KSB7XG4gICAgdmFyIGxvY2FsV2Vla2RheSA9ICg3ICsgd2Vla2RheSAtIGRvdykgJSA3LFxuICAgICAgICB3ZWVrT2Zmc2V0ID0gZmlyc3RXZWVrT2Zmc2V0KHllYXIsIGRvdywgZG95KSxcbiAgICAgICAgZGF5T2ZZZWFyID0gMSArIDcgKiAod2VlayAtIDEpICsgbG9jYWxXZWVrZGF5ICsgd2Vla09mZnNldCxcbiAgICAgICAgcmVzWWVhciwgcmVzRGF5T2ZZZWFyO1xuXG4gICAgaWYgKGRheU9mWWVhciA8PSAwKSB7XG4gICAgICAgIHJlc1llYXIgPSB5ZWFyIC0gMTtcbiAgICAgICAgcmVzRGF5T2ZZZWFyID0gZGF5c0luWWVhcihyZXNZZWFyKSArIGRheU9mWWVhcjtcbiAgICB9IGVsc2UgaWYgKGRheU9mWWVhciA+IGRheXNJblllYXIoeWVhcikpIHtcbiAgICAgICAgcmVzWWVhciA9IHllYXIgKyAxO1xuICAgICAgICByZXNEYXlPZlllYXIgPSBkYXlPZlllYXIgLSBkYXlzSW5ZZWFyKHllYXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc1llYXIgPSB5ZWFyO1xuICAgICAgICByZXNEYXlPZlllYXIgPSBkYXlPZlllYXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgeWVhcjogcmVzWWVhcixcbiAgICAgICAgZGF5T2ZZZWFyOiByZXNEYXlPZlllYXJcbiAgICB9O1xufVxuXG5mdW5jdGlvbiB3ZWVrT2ZZZWFyKG1vbSwgZG93LCBkb3kpIHtcbiAgICB2YXIgd2Vla09mZnNldCA9IGZpcnN0V2Vla09mZnNldChtb20ueWVhcigpLCBkb3csIGRveSksXG4gICAgICAgIHdlZWsgPSBNYXRoLmZsb29yKChtb20uZGF5T2ZZZWFyKCkgLSB3ZWVrT2Zmc2V0IC0gMSkgLyA3KSArIDEsXG4gICAgICAgIHJlc1dlZWssIHJlc1llYXI7XG5cbiAgICBpZiAod2VlayA8IDEpIHtcbiAgICAgICAgcmVzWWVhciA9IG1vbS55ZWFyKCkgLSAxO1xuICAgICAgICByZXNXZWVrID0gd2VlayArIHdlZWtzSW5ZZWFyKHJlc1llYXIsIGRvdywgZG95KTtcbiAgICB9IGVsc2UgaWYgKHdlZWsgPiB3ZWVrc0luWWVhcihtb20ueWVhcigpLCBkb3csIGRveSkpIHtcbiAgICAgICAgcmVzV2VlayA9IHdlZWsgLSB3ZWVrc0luWWVhcihtb20ueWVhcigpLCBkb3csIGRveSk7XG4gICAgICAgIHJlc1llYXIgPSBtb20ueWVhcigpICsgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXNZZWFyID0gbW9tLnllYXIoKTtcbiAgICAgICAgcmVzV2VlayA9IHdlZWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgd2VlazogcmVzV2VlayxcbiAgICAgICAgeWVhcjogcmVzWWVhclxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHdlZWtzSW5ZZWFyKHllYXIsIGRvdywgZG95KSB7XG4gICAgdmFyIHdlZWtPZmZzZXQgPSBmaXJzdFdlZWtPZmZzZXQoeWVhciwgZG93LCBkb3kpLFxuICAgICAgICB3ZWVrT2Zmc2V0TmV4dCA9IGZpcnN0V2Vla09mZnNldCh5ZWFyICsgMSwgZG93LCBkb3kpO1xuICAgIHJldHVybiAoZGF5c0luWWVhcih5ZWFyKSAtIHdlZWtPZmZzZXQgKyB3ZWVrT2Zmc2V0TmV4dCkgLyA3O1xufVxuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKCd3JywgWyd3dycsIDJdLCAnd28nLCAnd2VlaycpO1xuYWRkRm9ybWF0VG9rZW4oJ1cnLCBbJ1dXJywgMl0sICdXbycsICdpc29XZWVrJyk7XG5cbi8vIEFMSUFTRVNcblxuYWRkVW5pdEFsaWFzKCd3ZWVrJywgJ3cnKTtcbmFkZFVuaXRBbGlhcygnaXNvV2VlaycsICdXJyk7XG5cbi8vIFBSSU9SSVRJRVNcblxuYWRkVW5pdFByaW9yaXR5KCd3ZWVrJywgNSk7XG5hZGRVbml0UHJpb3JpdHkoJ2lzb1dlZWsnLCA1KTtcblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCd3JywgIG1hdGNoMXRvMik7XG5hZGRSZWdleFRva2VuKCd3dycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbmFkZFJlZ2V4VG9rZW4oJ1cnLCAgbWF0Y2gxdG8yKTtcbmFkZFJlZ2V4VG9rZW4oJ1dXJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuXG5hZGRXZWVrUGFyc2VUb2tlbihbJ3cnLCAnd3cnLCAnVycsICdXVyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICB3ZWVrW3Rva2VuLnN1YnN0cigwLCAxKV0gPSB0b0ludChpbnB1dCk7XG59KTtcblxuLy8gSEVMUEVSU1xuXG4vLyBMT0NBTEVTXG5cbmZ1bmN0aW9uIGxvY2FsZVdlZWsgKG1vbSkge1xuICAgIHJldHVybiB3ZWVrT2ZZZWFyKG1vbSwgdGhpcy5fd2Vlay5kb3csIHRoaXMuX3dlZWsuZG95KS53ZWVrO1xufVxuXG52YXIgZGVmYXVsdExvY2FsZVdlZWsgPSB7XG4gICAgZG93IDogMCwgLy8gU3VuZGF5IGlzIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAgZG95IDogNiAgLy8gVGhlIHdlZWsgdGhhdCBjb250YWlucyBKYW4gMXN0IGlzIHRoZSBmaXJzdCB3ZWVrIG9mIHRoZSB5ZWFyLlxufTtcblxuZnVuY3Rpb24gbG9jYWxlRmlyc3REYXlPZldlZWsgKCkge1xuICAgIHJldHVybiB0aGlzLl93ZWVrLmRvdztcbn1cblxuZnVuY3Rpb24gbG9jYWxlRmlyc3REYXlPZlllYXIgKCkge1xuICAgIHJldHVybiB0aGlzLl93ZWVrLmRveTtcbn1cblxuLy8gTU9NRU5UU1xuXG5mdW5jdGlvbiBnZXRTZXRXZWVrIChpbnB1dCkge1xuICAgIHZhciB3ZWVrID0gdGhpcy5sb2NhbGVEYXRhKCkud2Vlayh0aGlzKTtcbiAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG59XG5cbmZ1bmN0aW9uIGdldFNldElTT1dlZWsgKGlucHV0KSB7XG4gICAgdmFyIHdlZWsgPSB3ZWVrT2ZZZWFyKHRoaXMsIDEsIDQpLndlZWs7XG4gICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xufVxuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKCdkJywgMCwgJ2RvJywgJ2RheScpO1xuXG5hZGRGb3JtYXRUb2tlbignZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzTWluKHRoaXMsIGZvcm1hdCk7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oJ2RkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNTaG9ydCh0aGlzLCBmb3JtYXQpO1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKCdkZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5cyh0aGlzLCBmb3JtYXQpO1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKCdlJywgMCwgMCwgJ3dlZWtkYXknKTtcbmFkZEZvcm1hdFRva2VuKCdFJywgMCwgMCwgJ2lzb1dlZWtkYXknKTtcblxuLy8gQUxJQVNFU1xuXG5hZGRVbml0QWxpYXMoJ2RheScsICdkJyk7XG5hZGRVbml0QWxpYXMoJ3dlZWtkYXknLCAnZScpO1xuYWRkVW5pdEFsaWFzKCdpc29XZWVrZGF5JywgJ0UnKTtcblxuLy8gUFJJT1JJVFlcbmFkZFVuaXRQcmlvcml0eSgnZGF5JywgMTEpO1xuYWRkVW5pdFByaW9yaXR5KCd3ZWVrZGF5JywgMTEpO1xuYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrZGF5JywgMTEpO1xuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ2QnLCAgICBtYXRjaDF0bzIpO1xuYWRkUmVnZXhUb2tlbignZScsICAgIG1hdGNoMXRvMik7XG5hZGRSZWdleFRva2VuKCdFJywgICAgbWF0Y2gxdG8yKTtcbmFkZFJlZ2V4VG9rZW4oJ2RkJywgICBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgIHJldHVybiBsb2NhbGUud2Vla2RheXNNaW5SZWdleChpc1N0cmljdCk7XG59KTtcbmFkZFJlZ2V4VG9rZW4oJ2RkZCcsICAgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzU2hvcnRSZWdleChpc1N0cmljdCk7XG59KTtcbmFkZFJlZ2V4VG9rZW4oJ2RkZGQnLCAgIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgcmV0dXJuIGxvY2FsZS53ZWVrZGF5c1JlZ2V4KGlzU3RyaWN0KTtcbn0pO1xuXG5hZGRXZWVrUGFyc2VUb2tlbihbJ2RkJywgJ2RkZCcsICdkZGRkJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgIHZhciB3ZWVrZGF5ID0gY29uZmlnLl9sb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCwgdG9rZW4sIGNvbmZpZy5fc3RyaWN0KTtcbiAgICAvLyBpZiB3ZSBkaWRuJ3QgZ2V0IGEgd2Vla2RheSBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWRcbiAgICBpZiAod2Vla2RheSAhPSBudWxsKSB7XG4gICAgICAgIHdlZWsuZCA9IHdlZWtkYXk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZFdlZWtkYXkgPSBpbnB1dDtcbiAgICB9XG59KTtcblxuYWRkV2Vla1BhcnNlVG9rZW4oWydkJywgJ2UnLCAnRSddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICB3ZWVrW3Rva2VuXSA9IHRvSW50KGlucHV0KTtcbn0pO1xuXG4vLyBIRUxQRVJTXG5cbmZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cblxuICAgIGlmICghaXNOYU4oaW5wdXQpKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChpbnB1dCwgMTApO1xuICAgIH1cblxuICAgIGlucHV0ID0gbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VJc29XZWVrZGF5KGlucHV0LCBsb2NhbGUpIHtcbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpICUgNyB8fCA3O1xuICAgIH1cbiAgICByZXR1cm4gaXNOYU4oaW5wdXQpID8gbnVsbCA6IGlucHV0O1xufVxuXG4vLyBMT0NBTEVTXG5cbnZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXMgPSAnU3VuZGF5X01vbmRheV9UdWVzZGF5X1dlZG5lc2RheV9UaHVyc2RheV9GcmlkYXlfU2F0dXJkYXknLnNwbGl0KCdfJyk7XG5mdW5jdGlvbiBsb2NhbGVXZWVrZGF5cyAobSwgZm9ybWF0KSB7XG4gICAgaWYgKCFtKSB7XG4gICAgICAgIHJldHVybiBpc0FycmF5KHRoaXMuX3dlZWtkYXlzKSA/IHRoaXMuX3dlZWtkYXlzIDpcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzWydzdGFuZGFsb25lJ107XG4gICAgfVxuICAgIHJldHVybiBpc0FycmF5KHRoaXMuX3dlZWtkYXlzKSA/IHRoaXMuX3dlZWtkYXlzW20uZGF5KCldIDpcbiAgICAgICAgdGhpcy5fd2Vla2RheXNbdGhpcy5fd2Vla2RheXMuaXNGb3JtYXQudGVzdChmb3JtYXQpID8gJ2Zvcm1hdCcgOiAnc3RhbmRhbG9uZSddW20uZGF5KCldO1xufVxuXG52YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQgPSAnU3VuX01vbl9UdWVfV2VkX1RodV9GcmlfU2F0Jy5zcGxpdCgnXycpO1xuZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNTaG9ydCAobSkge1xuICAgIHJldHVybiAobSkgPyB0aGlzLl93ZWVrZGF5c1Nob3J0W20uZGF5KCldIDogdGhpcy5fd2Vla2RheXNTaG9ydDtcbn1cblxudmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c01pbiA9ICdTdV9Nb19UdV9XZV9UaF9Gcl9TYScuc3BsaXQoJ18nKTtcbmZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzTWluIChtKSB7XG4gICAgcmV0dXJuIChtKSA/IHRoaXMuX3dlZWtkYXlzTWluW20uZGF5KCldIDogdGhpcy5fd2Vla2RheXNNaW47XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVN0cmljdFBhcnNlJDEod2Vla2RheU5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgdmFyIGksIGlpLCBtb20sIGxsYyA9IHdlZWtkYXlOYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlKSB7XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgdGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2UgPSBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgKytpKSB7XG4gICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlW2ldID0gdGhpcy53ZWVrZGF5c01pbihtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlW2ldID0gdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldID0gdGhpcy53ZWVrZGF5cyhtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0cmljdCkge1xuICAgICAgICBpZiAoZm9ybWF0ID09PSAnZGRkZCcpIHtcbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3dlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2RkZCcpIHtcbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9taW5XZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3JtYXQgPT09ICdkZGRkJykge1xuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnZGRkJykge1xuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3dlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9taW5XZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3dlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNQYXJzZSAod2Vla2RheU5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVTdHJpY3RQYXJzZSQxLmNhbGwodGhpcywgd2Vla2RheU5hbWUsIGZvcm1hdCwgc3RyaWN0KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2UpIHtcbiAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICB0aGlzLl9mdWxsV2Vla2RheXNQYXJzZSA9IFtdO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG5cbiAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9mdWxsV2Vla2RheXNQYXJzZVtpXSkge1xuICAgICAgICAgICAgdGhpcy5fZnVsbFdlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMud2Vla2RheXMobW9tLCAnJykucmVwbGFjZSgnLicsICdcXC4/JykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKS5yZXBsYWNlKCcuJywgJ1xcLj8nKSArICckJywgJ2knKTtcbiAgICAgICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMud2Vla2RheXNNaW4obW9tLCAnJykucmVwbGFjZSgnLicsICdcXC4/JykgKyAnJCcsICdpJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlW2ldKSB7XG4gICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMud2Vla2RheXMobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNNaW4obW9tLCAnJyk7XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnZGRkZCcgJiYgdGhpcy5fZnVsbFdlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9IGVsc2UgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdkZGQnICYmIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ2RkJyAmJiB0aGlzLl9taW5XZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfSBlbHNlIGlmICghc3RyaWN0ICYmIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBNT01FTlRTXG5cbmZ1bmN0aW9uIGdldFNldERheU9mV2VlayAoaW5wdXQpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICB9XG4gICAgdmFyIGRheSA9IHRoaXMuX2lzVVRDID8gdGhpcy5fZC5nZXRVVENEYXkoKSA6IHRoaXMuX2QuZ2V0RGF5KCk7XG4gICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgaW5wdXQgPSBwYXJzZVdlZWtkYXkoaW5wdXQsIHRoaXMubG9jYWxlRGF0YSgpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKGlucHV0IC0gZGF5LCAnZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBkYXk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRTZXRMb2NhbGVEYXlPZldlZWsgKGlucHV0KSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCA/IHRoaXMgOiBOYU47XG4gICAgfVxuICAgIHZhciB3ZWVrZGF5ID0gKHRoaXMuZGF5KCkgKyA3IC0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93KSAlIDc7XG4gICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrZGF5IDogdGhpcy5hZGQoaW5wdXQgLSB3ZWVrZGF5LCAnZCcpO1xufVxuXG5mdW5jdGlvbiBnZXRTZXRJU09EYXlPZldlZWsgKGlucHV0KSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCA/IHRoaXMgOiBOYU47XG4gICAgfVxuXG4gICAgLy8gYmVoYXZlcyB0aGUgc2FtZSBhcyBtb21lbnQjZGF5IGV4Y2VwdFxuICAgIC8vIGFzIGEgZ2V0dGVyLCByZXR1cm5zIDcgaW5zdGVhZCBvZiAwICgxLTcgcmFuZ2UgaW5zdGVhZCBvZiAwLTYpXG4gICAgLy8gYXMgYSBzZXR0ZXIsIHN1bmRheSBzaG91bGQgYmVsb25nIHRvIHRoZSBwcmV2aW91cyB3ZWVrLlxuXG4gICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgdmFyIHdlZWtkYXkgPSBwYXJzZUlzb1dlZWtkYXkoaW5wdXQsIHRoaXMubG9jYWxlRGF0YSgpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF5KHRoaXMuZGF5KCkgJSA3ID8gd2Vla2RheSA6IHdlZWtkYXkgLSA3KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXkoKSB8fCA3O1xuICAgIH1cbn1cblxudmFyIGRlZmF1bHRXZWVrZGF5c1JlZ2V4ID0gbWF0Y2hXb3JkO1xuZnVuY3Rpb24gd2Vla2RheXNSZWdleCAoaXNTdHJpY3QpIHtcbiAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzUmVnZXgnKSkge1xuICAgICAgICAgICAgY29tcHV0ZVdlZWtkYXlzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzUmVnZXg7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUmVnZXggPSBkZWZhdWx0V2Vla2RheXNSZWdleDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTdHJpY3RSZWdleCAmJiBpc1N0cmljdCA/XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4IDogdGhpcy5fd2Vla2RheXNSZWdleDtcbiAgICB9XG59XG5cbnZhciBkZWZhdWx0V2Vla2RheXNTaG9ydFJlZ2V4ID0gbWF0Y2hXb3JkO1xuZnVuY3Rpb24gd2Vla2RheXNTaG9ydFJlZ2V4IChpc1N0cmljdCkge1xuICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlRXhhY3QpIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICBjb21wdXRlV2Vla2RheXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1Nob3J0UmVnZXgnKSkge1xuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNTaG9ydFJlZ2V4ID0gZGVmYXVsdFdlZWtkYXlzU2hvcnRSZWdleDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFN0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleCA6IHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleDtcbiAgICB9XG59XG5cbnZhciBkZWZhdWx0V2Vla2RheXNNaW5SZWdleCA9IG1hdGNoV29yZDtcbmZ1bmN0aW9uIHdlZWtkYXlzTWluUmVnZXggKGlzU3RyaWN0KSB7XG4gICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgIGNvbXB1dGVXZWVrZGF5c1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNNaW5TdHJpY3RSZWdleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblJlZ2V4O1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNNaW5SZWdleCcpKSB7XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c01pblJlZ2V4ID0gZGVmYXVsdFdlZWtkYXlzTWluUmVnZXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNNaW5TdHJpY3RSZWdleCA6IHRoaXMuX3dlZWtkYXlzTWluUmVnZXg7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIGNvbXB1dGVXZWVrZGF5c1BhcnNlICgpIHtcbiAgICBmdW5jdGlvbiBjbXBMZW5SZXYoYSwgYikge1xuICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcbiAgICB9XG5cbiAgICB2YXIgbWluUGllY2VzID0gW10sIHNob3J0UGllY2VzID0gW10sIGxvbmdQaWVjZXMgPSBbXSwgbWl4ZWRQaWVjZXMgPSBbXSxcbiAgICAgICAgaSwgbW9tLCBtaW5wLCBzaG9ydHAsIGxvbmdwO1xuICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgbWlucCA9IHRoaXMud2Vla2RheXNNaW4obW9tLCAnJyk7XG4gICAgICAgIHNob3J0cCA9IHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKTtcbiAgICAgICAgbG9uZ3AgPSB0aGlzLndlZWtkYXlzKG1vbSwgJycpO1xuICAgICAgICBtaW5QaWVjZXMucHVzaChtaW5wKTtcbiAgICAgICAgc2hvcnRQaWVjZXMucHVzaChzaG9ydHApO1xuICAgICAgICBsb25nUGllY2VzLnB1c2gobG9uZ3ApO1xuICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKG1pbnApO1xuICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHNob3J0cCk7XG4gICAgICAgIG1peGVkUGllY2VzLnB1c2gobG9uZ3ApO1xuICAgIH1cbiAgICAvLyBTb3J0aW5nIG1ha2VzIHN1cmUgaWYgb25lIHdlZWtkYXkgKG9yIGFiYnIpIGlzIGEgcHJlZml4IG9mIGFub3RoZXIgaXRcbiAgICAvLyB3aWxsIG1hdGNoIHRoZSBsb25nZXIgcGllY2UuXG4gICAgbWluUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICBzaG9ydFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgbG9uZ1BpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgbWl4ZWRQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgc2hvcnRQaWVjZXNbaV0gPSByZWdleEVzY2FwZShzaG9ydFBpZWNlc1tpXSk7XG4gICAgICAgIGxvbmdQaWVjZXNbaV0gPSByZWdleEVzY2FwZShsb25nUGllY2VzW2ldKTtcbiAgICAgICAgbWl4ZWRQaWVjZXNbaV0gPSByZWdleEVzY2FwZShtaXhlZFBpZWNlc1tpXSk7XG4gICAgfVxuXG4gICAgdGhpcy5fd2Vla2RheXNSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIG1peGVkUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXggPSB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuICAgIHRoaXMuX3dlZWtkYXlzTWluUmVnZXggPSB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuXG4gICAgdGhpcy5fd2Vla2RheXNTdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIGxvbmdQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIHNob3J0UGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbWluUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbn1cblxuLy8gRk9STUFUVElOR1xuXG5mdW5jdGlvbiBoRm9ybWF0KCkge1xuICAgIHJldHVybiB0aGlzLmhvdXJzKCkgJSAxMiB8fCAxMjtcbn1cblxuZnVuY3Rpb24ga0Zvcm1hdCgpIHtcbiAgICByZXR1cm4gdGhpcy5ob3VycygpIHx8IDI0O1xufVxuXG5hZGRGb3JtYXRUb2tlbignSCcsIFsnSEgnLCAyXSwgMCwgJ2hvdXInKTtcbmFkZEZvcm1hdFRva2VuKCdoJywgWydoaCcsIDJdLCAwLCBoRm9ybWF0KTtcbmFkZEZvcm1hdFRva2VuKCdrJywgWydraycsIDJdLCAwLCBrRm9ybWF0KTtcblxuYWRkRm9ybWF0VG9rZW4oJ2htbScsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJycgKyBoRm9ybWF0LmFwcGx5KHRoaXMpICsgemVyb0ZpbGwodGhpcy5taW51dGVzKCksIDIpO1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKCdobW1zcycsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJycgKyBoRm9ybWF0LmFwcGx5KHRoaXMpICsgemVyb0ZpbGwodGhpcy5taW51dGVzKCksIDIpICtcbiAgICAgICAgemVyb0ZpbGwodGhpcy5zZWNvbmRzKCksIDIpO1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKCdIbW0nLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICcnICsgdGhpcy5ob3VycygpICsgemVyb0ZpbGwodGhpcy5taW51dGVzKCksIDIpO1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKCdIbW1zcycsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJycgKyB0aGlzLmhvdXJzKCkgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMikgK1xuICAgICAgICB6ZXJvRmlsbCh0aGlzLnNlY29uZHMoKSwgMik7XG59KTtcblxuZnVuY3Rpb24gbWVyaWRpZW0gKHRva2VuLCBsb3dlcmNhc2UpIHtcbiAgICBhZGRGb3JtYXRUb2tlbih0b2tlbiwgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubWVyaWRpZW0odGhpcy5ob3VycygpLCB0aGlzLm1pbnV0ZXMoKSwgbG93ZXJjYXNlKTtcbiAgICB9KTtcbn1cblxubWVyaWRpZW0oJ2EnLCB0cnVlKTtcbm1lcmlkaWVtKCdBJywgZmFsc2UpO1xuXG4vLyBBTElBU0VTXG5cbmFkZFVuaXRBbGlhcygnaG91cicsICdoJyk7XG5cbi8vIFBSSU9SSVRZXG5hZGRVbml0UHJpb3JpdHkoJ2hvdXInLCAxMyk7XG5cbi8vIFBBUlNJTkdcblxuZnVuY3Rpb24gbWF0Y2hNZXJpZGllbSAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgIHJldHVybiBsb2NhbGUuX21lcmlkaWVtUGFyc2U7XG59XG5cbmFkZFJlZ2V4VG9rZW4oJ2EnLCAgbWF0Y2hNZXJpZGllbSk7XG5hZGRSZWdleFRva2VuKCdBJywgIG1hdGNoTWVyaWRpZW0pO1xuYWRkUmVnZXhUb2tlbignSCcsICBtYXRjaDF0bzIpO1xuYWRkUmVnZXhUb2tlbignaCcsICBtYXRjaDF0bzIpO1xuYWRkUmVnZXhUb2tlbignaycsICBtYXRjaDF0bzIpO1xuYWRkUmVnZXhUb2tlbignSEgnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5hZGRSZWdleFRva2VuKCdoaCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbmFkZFJlZ2V4VG9rZW4oJ2trJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuXG5hZGRSZWdleFRva2VuKCdobW0nLCBtYXRjaDN0bzQpO1xuYWRkUmVnZXhUb2tlbignaG1tc3MnLCBtYXRjaDV0bzYpO1xuYWRkUmVnZXhUb2tlbignSG1tJywgbWF0Y2gzdG80KTtcbmFkZFJlZ2V4VG9rZW4oJ0htbXNzJywgbWF0Y2g1dG82KTtcblxuYWRkUGFyc2VUb2tlbihbJ0gnLCAnSEgnXSwgSE9VUik7XG5hZGRQYXJzZVRva2VuKFsnaycsICdrayddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICB2YXIga0lucHV0ID0gdG9JbnQoaW5wdXQpO1xuICAgIGFycmF5W0hPVVJdID0ga0lucHV0ID09PSAyNCA/IDAgOiBrSW5wdXQ7XG59KTtcbmFkZFBhcnNlVG9rZW4oWydhJywgJ0EnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgY29uZmlnLl9pc1BtID0gY29uZmlnLl9sb2NhbGUuaXNQTShpbnB1dCk7XG4gICAgY29uZmlnLl9tZXJpZGllbSA9IGlucHV0O1xufSk7XG5hZGRQYXJzZVRva2VuKFsnaCcsICdoaCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0KTtcbiAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdHJ1ZTtcbn0pO1xuYWRkUGFyc2VUb2tlbignaG1tJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgdmFyIHBvcyA9IGlucHV0Lmxlbmd0aCAtIDI7XG4gICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dC5zdWJzdHIoMCwgcG9zKSk7XG4gICAgYXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MpKTtcbiAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdHJ1ZTtcbn0pO1xuYWRkUGFyc2VUb2tlbignaG1tc3MnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICB2YXIgcG9zMSA9IGlucHV0Lmxlbmd0aCAtIDQ7XG4gICAgdmFyIHBvczIgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQuc3Vic3RyKDAsIHBvczEpKTtcbiAgICBhcnJheVtNSU5VVEVdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczEsIDIpKTtcbiAgICBhcnJheVtTRUNPTkRdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczIpKTtcbiAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdHJ1ZTtcbn0pO1xuYWRkUGFyc2VUb2tlbignSG1tJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgdmFyIHBvcyA9IGlucHV0Lmxlbmd0aCAtIDI7XG4gICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dC5zdWJzdHIoMCwgcG9zKSk7XG4gICAgYXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MpKTtcbn0pO1xuYWRkUGFyc2VUb2tlbignSG1tc3MnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICB2YXIgcG9zMSA9IGlucHV0Lmxlbmd0aCAtIDQ7XG4gICAgdmFyIHBvczIgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQuc3Vic3RyKDAsIHBvczEpKTtcbiAgICBhcnJheVtNSU5VVEVdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczEsIDIpKTtcbiAgICBhcnJheVtTRUNPTkRdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczIpKTtcbn0pO1xuXG4vLyBMT0NBTEVTXG5cbmZ1bmN0aW9uIGxvY2FsZUlzUE0gKGlucHV0KSB7XG4gICAgLy8gSUU4IFF1aXJrcyBNb2RlICYgSUU3IFN0YW5kYXJkcyBNb2RlIGRvIG5vdCBhbGxvdyBhY2Nlc3Npbmcgc3RyaW5ncyBsaWtlIGFycmF5c1xuICAgIC8vIFVzaW5nIGNoYXJBdCBzaG91bGQgYmUgbW9yZSBjb21wYXRpYmxlLlxuICAgIHJldHVybiAoKGlucHV0ICsgJycpLnRvTG93ZXJDYXNlKCkuY2hhckF0KDApID09PSAncCcpO1xufVxuXG52YXIgZGVmYXVsdExvY2FsZU1lcmlkaWVtUGFyc2UgPSAvW2FwXVxcLj9tP1xcLj8vaTtcbmZ1bmN0aW9uIGxvY2FsZU1lcmlkaWVtIChob3VycywgbWludXRlcywgaXNMb3dlcikge1xuICAgIGlmIChob3VycyA+IDExKSB7XG4gICAgICAgIHJldHVybiBpc0xvd2VyID8gJ3BtJyA6ICdQTSc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAnYW0nIDogJ0FNJztcbiAgICB9XG59XG5cblxuLy8gTU9NRU5UU1xuXG4vLyBTZXR0aW5nIHRoZSBob3VyIHNob3VsZCBrZWVwIHRoZSB0aW1lLCBiZWNhdXNlIHRoZSB1c2VyIGV4cGxpY2l0bHlcbi8vIHNwZWNpZmllZCB3aGljaCBob3VyIGhlIHdhbnRzLiBTbyB0cnlpbmcgdG8gbWFpbnRhaW4gdGhlIHNhbWUgaG91ciAoaW5cbi8vIGEgbmV3IHRpbWV6b25lKSBtYWtlcyBzZW5zZS4gQWRkaW5nL3N1YnRyYWN0aW5nIGhvdXJzIGRvZXMgbm90IGZvbGxvd1xuLy8gdGhpcyBydWxlLlxudmFyIGdldFNldEhvdXIgPSBtYWtlR2V0U2V0KCdIb3VycycsIHRydWUpO1xuXG52YXIgYmFzZUNvbmZpZyA9IHtcbiAgICBjYWxlbmRhcjogZGVmYXVsdENhbGVuZGFyLFxuICAgIGxvbmdEYXRlRm9ybWF0OiBkZWZhdWx0TG9uZ0RhdGVGb3JtYXQsXG4gICAgaW52YWxpZERhdGU6IGRlZmF1bHRJbnZhbGlkRGF0ZSxcbiAgICBvcmRpbmFsOiBkZWZhdWx0T3JkaW5hbCxcbiAgICBkYXlPZk1vbnRoT3JkaW5hbFBhcnNlOiBkZWZhdWx0RGF5T2ZNb250aE9yZGluYWxQYXJzZSxcbiAgICByZWxhdGl2ZVRpbWU6IGRlZmF1bHRSZWxhdGl2ZVRpbWUsXG5cbiAgICBtb250aHM6IGRlZmF1bHRMb2NhbGVNb250aHMsXG4gICAgbW9udGhzU2hvcnQ6IGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydCxcblxuICAgIHdlZWs6IGRlZmF1bHRMb2NhbGVXZWVrLFxuXG4gICAgd2Vla2RheXM6IGRlZmF1bHRMb2NhbGVXZWVrZGF5cyxcbiAgICB3ZWVrZGF5c01pbjogZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluLFxuICAgIHdlZWtkYXlzU2hvcnQ6IGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0LFxuXG4gICAgbWVyaWRpZW1QYXJzZTogZGVmYXVsdExvY2FsZU1lcmlkaWVtUGFyc2Vcbn07XG5cbi8vIGludGVybmFsIHN0b3JhZ2UgZm9yIGxvY2FsZSBjb25maWcgZmlsZXNcbnZhciBsb2NhbGVzID0ge307XG52YXIgbG9jYWxlRmFtaWxpZXMgPSB7fTtcbnZhciBnbG9iYWxMb2NhbGU7XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUxvY2FsZShrZXkpIHtcbiAgICByZXR1cm4ga2V5ID8ga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnXycsICctJykgOiBrZXk7XG59XG5cbi8vIHBpY2sgdGhlIGxvY2FsZSBmcm9tIHRoZSBhcnJheVxuLy8gdHJ5IFsnZW4tYXUnLCAnZW4tZ2InXSBhcyAnZW4tYXUnLCAnZW4tZ2InLCAnZW4nLCBhcyBpbiBtb3ZlIHRocm91Z2ggdGhlIGxpc3QgdHJ5aW5nIGVhY2hcbi8vIHN1YnN0cmluZyBmcm9tIG1vc3Qgc3BlY2lmaWMgdG8gbGVhc3QsIGJ1dCBtb3ZlIHRvIHRoZSBuZXh0IGFycmF5IGl0ZW0gaWYgaXQncyBhIG1vcmUgc3BlY2lmaWMgdmFyaWFudCB0aGFuIHRoZSBjdXJyZW50IHJvb3RcbmZ1bmN0aW9uIGNob29zZUxvY2FsZShuYW1lcykge1xuICAgIHZhciBpID0gMCwgaiwgbmV4dCwgbG9jYWxlLCBzcGxpdDtcblxuICAgIHdoaWxlIChpIDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgIHNwbGl0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2ldKS5zcGxpdCgnLScpO1xuICAgICAgICBqID0gc3BsaXQubGVuZ3RoO1xuICAgICAgICBuZXh0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2kgKyAxXSk7XG4gICAgICAgIG5leHQgPSBuZXh0ID8gbmV4dC5zcGxpdCgnLScpIDogbnVsbDtcbiAgICAgICAgd2hpbGUgKGogPiAwKSB7XG4gICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKHNwbGl0LnNsaWNlKDAsIGopLmpvaW4oJy0nKSk7XG4gICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQubGVuZ3RoID49IGogJiYgY29tcGFyZUFycmF5cyhzcGxpdCwgbmV4dCwgdHJ1ZSkgPj0gaiAtIDEpIHtcbiAgICAgICAgICAgICAgICAvL3RoZSBuZXh0IGFycmF5IGl0ZW0gaXMgYmV0dGVyIHRoYW4gYSBzaGFsbG93ZXIgc3Vic3RyaW5nIG9mIHRoaXMgb25lXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqLS07XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gZ2xvYmFsTG9jYWxlO1xufVxuXG5mdW5jdGlvbiBsb2FkTG9jYWxlKG5hbWUpIHtcbiAgICB2YXIgb2xkTG9jYWxlID0gbnVsbDtcbiAgICAvLyBUT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZWdpc3RlciBhbmQgbG9hZCBhbGwgdGhlIGxvY2FsZXMgaW4gTm9kZVxuICAgIGlmICghbG9jYWxlc1tuYW1lXSAmJiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpICYmXG4gICAgICAgICAgICBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG9sZExvY2FsZSA9IGdsb2JhbExvY2FsZS5fYWJicjtcbiAgICAgICAgICAgIHZhciBhbGlhc2VkUmVxdWlyZSA9IHJlcXVpcmU7XG4gICAgICAgICAgICBhbGlhc2VkUmVxdWlyZSgnLi9sb2NhbGUvJyArIG5hbWUpO1xuICAgICAgICAgICAgZ2V0U2V0R2xvYmFsTG9jYWxlKG9sZExvY2FsZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xufVxuXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsb2NhbGUgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbG9jYWxlLiAgSWZcbi8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnQgZ2xvYmFsXG4vLyBsb2NhbGUga2V5LlxuZnVuY3Rpb24gZ2V0U2V0R2xvYmFsTG9jYWxlIChrZXksIHZhbHVlcykge1xuICAgIHZhciBkYXRhO1xuICAgIGlmIChrZXkpIHtcbiAgICAgICAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlcykpIHtcbiAgICAgICAgICAgIGRhdGEgPSBnZXRMb2NhbGUoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEgPSBkZWZpbmVMb2NhbGUoa2V5LCB2YWx1ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIC8vIG1vbWVudC5kdXJhdGlvbi5fbG9jYWxlID0gbW9tZW50Ll9sb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgZ2xvYmFsTG9jYWxlID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICgodHlwZW9mIGNvbnNvbGUgIT09ICAndW5kZWZpbmVkJykgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICAgICAgLy93YXJuIHVzZXIgaWYgYXJndW1lbnRzIGFyZSBwYXNzZWQgYnV0IHRoZSBsb2NhbGUgY291bGQgbm90IGJlIHNldFxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignTG9jYWxlICcgKyBrZXkgKyAgJyBub3QgZm91bmQuIERpZCB5b3UgZm9yZ2V0IHRvIGxvYWQgaXQ/Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZ2xvYmFsTG9jYWxlLl9hYmJyO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVMb2NhbGUgKG5hbWUsIGNvbmZpZykge1xuICAgIGlmIChjb25maWcgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGxvY2FsZSwgcGFyZW50Q29uZmlnID0gYmFzZUNvbmZpZztcbiAgICAgICAgY29uZmlnLmFiYnIgPSBuYW1lO1xuICAgICAgICBpZiAobG9jYWxlc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBkZXByZWNhdGVTaW1wbGUoJ2RlZmluZUxvY2FsZU92ZXJyaWRlJyxcbiAgICAgICAgICAgICAgICAgICAgJ3VzZSBtb21lbnQudXBkYXRlTG9jYWxlKGxvY2FsZU5hbWUsIGNvbmZpZykgdG8gY2hhbmdlICcgK1xuICAgICAgICAgICAgICAgICAgICAnYW4gZXhpc3RpbmcgbG9jYWxlLiBtb21lbnQuZGVmaW5lTG9jYWxlKGxvY2FsZU5hbWUsICcgK1xuICAgICAgICAgICAgICAgICAgICAnY29uZmlnKSBzaG91bGQgb25seSBiZSB1c2VkIGZvciBjcmVhdGluZyBhIG5ldyBsb2NhbGUgJyArXG4gICAgICAgICAgICAgICAgICAgICdTZWUgaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9kZWZpbmUtbG9jYWxlLyBmb3IgbW9yZSBpbmZvLicpO1xuICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gbG9jYWxlc1tuYW1lXS5fY29uZmlnO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5wYXJlbnRMb2NhbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGxvY2FsZXNbY29uZmlnLnBhcmVudExvY2FsZV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IGxvY2FsZXNbY29uZmlnLnBhcmVudExvY2FsZV0uX2NvbmZpZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShjb25maWcucGFyZW50TG9jYWxlKTtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gbG9jYWxlLl9jb25maWc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFsb2NhbGVGYW1pbGllc1tjb25maWcucGFyZW50TG9jYWxlXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxlRmFtaWxpZXNbY29uZmlnLnBhcmVudExvY2FsZV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsb2NhbGVGYW1pbGllc1tjb25maWcucGFyZW50TG9jYWxlXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxvY2FsZXNbbmFtZV0gPSBuZXcgTG9jYWxlKG1lcmdlQ29uZmlncyhwYXJlbnRDb25maWcsIGNvbmZpZykpO1xuXG4gICAgICAgIGlmIChsb2NhbGVGYW1pbGllc1tuYW1lXSkge1xuICAgICAgICAgICAgbG9jYWxlRmFtaWxpZXNbbmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgIGRlZmluZUxvY2FsZSh4Lm5hbWUsIHguY29uZmlnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYmFja3dhcmRzIGNvbXBhdCBmb3Igbm93OiBhbHNvIHNldCB0aGUgbG9jYWxlXG4gICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBzZXQgdGhlIGxvY2FsZSBBRlRFUiBhbGwgY2hpbGQgbG9jYWxlcyBoYXZlIGJlZW5cbiAgICAgICAgLy8gY3JlYXRlZCwgc28gd2Ugd29uJ3QgZW5kIHVwIHdpdGggdGhlIGNoaWxkIGxvY2FsZSBzZXQuXG4gICAgICAgIGdldFNldEdsb2JhbExvY2FsZShuYW1lKTtcblxuXG4gICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHVzZWZ1bCBmb3IgdGVzdGluZ1xuICAgICAgICBkZWxldGUgbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMb2NhbGUobmFtZSwgY29uZmlnKSB7XG4gICAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgICAgIHZhciBsb2NhbGUsIHRtcExvY2FsZSwgcGFyZW50Q29uZmlnID0gYmFzZUNvbmZpZztcbiAgICAgICAgLy8gTUVSR0VcbiAgICAgICAgdG1wTG9jYWxlID0gbG9hZExvY2FsZShuYW1lKTtcbiAgICAgICAgaWYgKHRtcExvY2FsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBwYXJlbnRDb25maWcgPSB0bXBMb2NhbGUuX2NvbmZpZztcbiAgICAgICAgfVxuICAgICAgICBjb25maWcgPSBtZXJnZUNvbmZpZ3MocGFyZW50Q29uZmlnLCBjb25maWcpO1xuICAgICAgICBsb2NhbGUgPSBuZXcgTG9jYWxlKGNvbmZpZyk7XG4gICAgICAgIGxvY2FsZS5wYXJlbnRMb2NhbGUgPSBsb2NhbGVzW25hbWVdO1xuICAgICAgICBsb2NhbGVzW25hbWVdID0gbG9jYWxlO1xuXG4gICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICBnZXRTZXRHbG9iYWxMb2NhbGUobmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcGFzcyBudWxsIGZvciBjb25maWcgdG8gdW51cGRhdGUsIHVzZWZ1bCBmb3IgdGVzdHNcbiAgICAgICAgaWYgKGxvY2FsZXNbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGxvY2FsZXNbbmFtZV0ucGFyZW50TG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbG9jYWxlc1tuYW1lXS5wYXJlbnRMb2NhbGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxvY2FsZXNbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xufVxuXG4vLyByZXR1cm5zIGxvY2FsZSBkYXRhXG5mdW5jdGlvbiBnZXRMb2NhbGUgKGtleSkge1xuICAgIHZhciBsb2NhbGU7XG5cbiAgICBpZiAoa2V5ICYmIGtleS5fbG9jYWxlICYmIGtleS5fbG9jYWxlLl9hYmJyKSB7XG4gICAgICAgIGtleSA9IGtleS5fbG9jYWxlLl9hYmJyO1xuICAgIH1cblxuICAgIGlmICgha2V5KSB7XG4gICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGU7XG4gICAgfVxuXG4gICAgaWYgKCFpc0FycmF5KGtleSkpIHtcbiAgICAgICAgLy9zaG9ydC1jaXJjdWl0IGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKGtleSk7XG4gICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgIH1cbiAgICAgICAga2V5ID0gW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNob29zZUxvY2FsZShrZXkpO1xufVxuXG5mdW5jdGlvbiBsaXN0TG9jYWxlcygpIHtcbiAgICByZXR1cm4ga2V5cyhsb2NhbGVzKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tPdmVyZmxvdyAobSkge1xuICAgIHZhciBvdmVyZmxvdztcbiAgICB2YXIgYSA9IG0uX2E7XG5cbiAgICBpZiAoYSAmJiBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPT09IC0yKSB7XG4gICAgICAgIG92ZXJmbG93ID1cbiAgICAgICAgICAgIGFbTU9OVEhdICAgICAgIDwgMCB8fCBhW01PTlRIXSAgICAgICA+IDExICA/IE1PTlRIIDpcbiAgICAgICAgICAgIGFbREFURV0gICAgICAgIDwgMSB8fCBhW0RBVEVdICAgICAgICA+IGRheXNJbk1vbnRoKGFbWUVBUl0sIGFbTU9OVEhdKSA/IERBVEUgOlxuICAgICAgICAgICAgYVtIT1VSXSAgICAgICAgPCAwIHx8IGFbSE9VUl0gICAgICAgID4gMjQgfHwgKGFbSE9VUl0gPT09IDI0ICYmIChhW01JTlVURV0gIT09IDAgfHwgYVtTRUNPTkRdICE9PSAwIHx8IGFbTUlMTElTRUNPTkRdICE9PSAwKSkgPyBIT1VSIDpcbiAgICAgICAgICAgIGFbTUlOVVRFXSAgICAgIDwgMCB8fCBhW01JTlVURV0gICAgICA+IDU5ICA/IE1JTlVURSA6XG4gICAgICAgICAgICBhW1NFQ09ORF0gICAgICA8IDAgfHwgYVtTRUNPTkRdICAgICAgPiA1OSAgPyBTRUNPTkQgOlxuICAgICAgICAgICAgYVtNSUxMSVNFQ09ORF0gPCAwIHx8IGFbTUlMTElTRUNPTkRdID4gOTk5ID8gTUlMTElTRUNPTkQgOlxuICAgICAgICAgICAgLTE7XG5cbiAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dEYXlPZlllYXIgJiYgKG92ZXJmbG93IDwgWUVBUiB8fCBvdmVyZmxvdyA+IERBVEUpKSB7XG4gICAgICAgICAgICBvdmVyZmxvdyA9IERBVEU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dXZWVrcyAmJiBvdmVyZmxvdyA9PT0gLTEpIHtcbiAgICAgICAgICAgIG92ZXJmbG93ID0gV0VFSztcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2V0UGFyc2luZ0ZsYWdzKG0pLl9vdmVyZmxvd1dlZWtkYXkgJiYgb3ZlcmZsb3cgPT09IC0xKSB7XG4gICAgICAgICAgICBvdmVyZmxvdyA9IFdFRUtEQVk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPSBvdmVyZmxvdztcbiAgICB9XG5cbiAgICByZXR1cm4gbTtcbn1cblxuLy8gUGljayB0aGUgZmlyc3QgZGVmaW5lZCBvZiB0d28gb3IgdGhyZWUgYXJndW1lbnRzLlxuZnVuY3Rpb24gZGVmYXVsdHMoYSwgYiwgYykge1xuICAgIGlmIChhICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIGlmIChiICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGI7XG4gICAgfVxuICAgIHJldHVybiBjO1xufVxuXG5mdW5jdGlvbiBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZykge1xuICAgIC8vIGhvb2tzIGlzIGFjdHVhbGx5IHRoZSBleHBvcnRlZCBtb21lbnQgb2JqZWN0XG4gICAgdmFyIG5vd1ZhbHVlID0gbmV3IERhdGUoaG9va3Mubm93KCkpO1xuICAgIGlmIChjb25maWcuX3VzZVVUQykge1xuICAgICAgICByZXR1cm4gW25vd1ZhbHVlLmdldFVUQ0Z1bGxZZWFyKCksIG5vd1ZhbHVlLmdldFVUQ01vbnRoKCksIG5vd1ZhbHVlLmdldFVUQ0RhdGUoKV07XG4gICAgfVxuICAgIHJldHVybiBbbm93VmFsdWUuZ2V0RnVsbFllYXIoKSwgbm93VmFsdWUuZ2V0TW9udGgoKSwgbm93VmFsdWUuZ2V0RGF0ZSgpXTtcbn1cblxuLy8gY29udmVydCBhbiBhcnJheSB0byBhIGRhdGUuXG4vLyB0aGUgYXJyYXkgc2hvdWxkIG1pcnJvciB0aGUgcGFyYW1ldGVycyBiZWxvd1xuLy8gbm90ZTogYWxsIHZhbHVlcyBwYXN0IHRoZSB5ZWFyIGFyZSBvcHRpb25hbCBhbmQgd2lsbCBkZWZhdWx0IHRvIHRoZSBsb3dlc3QgcG9zc2libGUgdmFsdWUuXG4vLyBbeWVhciwgbW9udGgsIGRheSAsIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaXNlY29uZF1cbmZ1bmN0aW9uIGNvbmZpZ0Zyb21BcnJheSAoY29uZmlnKSB7XG4gICAgdmFyIGksIGRhdGUsIGlucHV0ID0gW10sIGN1cnJlbnREYXRlLCBleHBlY3RlZFdlZWtkYXksIHllYXJUb1VzZTtcblxuICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGN1cnJlbnREYXRlID0gY3VycmVudERhdGVBcnJheShjb25maWcpO1xuXG4gICAgLy9jb21wdXRlIGRheSBvZiB0aGUgeWVhciBmcm9tIHdlZWtzIGFuZCB3ZWVrZGF5c1xuICAgIGlmIChjb25maWcuX3cgJiYgY29uZmlnLl9hW0RBVEVdID09IG51bGwgJiYgY29uZmlnLl9hW01PTlRIXSA9PSBudWxsKSB7XG4gICAgICAgIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpO1xuICAgIH1cblxuICAgIC8vaWYgdGhlIGRheSBvZiB0aGUgeWVhciBpcyBzZXQsIGZpZ3VyZSBvdXQgd2hhdCBpdCBpc1xuICAgIGlmIChjb25maWcuX2RheU9mWWVhciAhPSBudWxsKSB7XG4gICAgICAgIHllYXJUb1VzZSA9IGRlZmF1bHRzKGNvbmZpZy5fYVtZRUFSXSwgY3VycmVudERhdGVbWUVBUl0pO1xuXG4gICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhciA+IGRheXNJblllYXIoeWVhclRvVXNlKSB8fCBjb25maWcuX2RheU9mWWVhciA9PT0gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuX292ZXJmbG93RGF5T2ZZZWFyID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGUgPSBjcmVhdGVVVENEYXRlKHllYXJUb1VzZSwgMCwgY29uZmlnLl9kYXlPZlllYXIpO1xuICAgICAgICBjb25maWcuX2FbTU9OVEhdID0gZGF0ZS5nZXRVVENNb250aCgpO1xuICAgICAgICBjb25maWcuX2FbREFURV0gPSBkYXRlLmdldFVUQ0RhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IHRvIGN1cnJlbnQgZGF0ZS5cbiAgICAvLyAqIGlmIG5vIHllYXIsIG1vbnRoLCBkYXkgb2YgbW9udGggYXJlIGdpdmVuLCBkZWZhdWx0IHRvIHRvZGF5XG4gICAgLy8gKiBpZiBkYXkgb2YgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgbW9udGggYW5kIHllYXJcbiAgICAvLyAqIGlmIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG9ubHkgeWVhclxuICAgIC8vICogaWYgeWVhciBpcyBnaXZlbiwgZG9uJ3QgZGVmYXVsdCBhbnl0aGluZ1xuICAgIGZvciAoaSA9IDA7IGkgPCAzICYmIGNvbmZpZy5fYVtpXSA9PSBudWxsOyArK2kpIHtcbiAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSBjdXJyZW50RGF0ZVtpXTtcbiAgICB9XG5cbiAgICAvLyBaZXJvIG91dCB3aGF0ZXZlciB3YXMgbm90IGRlZmF1bHRlZCwgaW5jbHVkaW5nIHRpbWVcbiAgICBmb3IgKDsgaSA8IDc7IGkrKykge1xuICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IChjb25maWcuX2FbaV0gPT0gbnVsbCkgPyAoaSA9PT0gMiA/IDEgOiAwKSA6IGNvbmZpZy5fYVtpXTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgMjQ6MDA6MDAuMDAwXG4gICAgaWYgKGNvbmZpZy5fYVtIT1VSXSA9PT0gMjQgJiZcbiAgICAgICAgICAgIGNvbmZpZy5fYVtNSU5VVEVdID09PSAwICYmXG4gICAgICAgICAgICBjb25maWcuX2FbU0VDT05EXSA9PT0gMCAmJlxuICAgICAgICAgICAgY29uZmlnLl9hW01JTExJU0VDT05EXSA9PT0gMCkge1xuICAgICAgICBjb25maWcuX25leHREYXkgPSB0cnVlO1xuICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAwO1xuICAgIH1cblxuICAgIGNvbmZpZy5fZCA9IChjb25maWcuX3VzZVVUQyA/IGNyZWF0ZVVUQ0RhdGUgOiBjcmVhdGVEYXRlKS5hcHBseShudWxsLCBpbnB1dCk7XG4gICAgZXhwZWN0ZWRXZWVrZGF5ID0gY29uZmlnLl91c2VVVEMgPyBjb25maWcuX2QuZ2V0VVRDRGF5KCkgOiBjb25maWcuX2QuZ2V0RGF5KCk7XG5cbiAgICAvLyBBcHBseSB0aW1lem9uZSBvZmZzZXQgZnJvbSBpbnB1dC4gVGhlIGFjdHVhbCB1dGNPZmZzZXQgY2FuIGJlIGNoYW5nZWRcbiAgICAvLyB3aXRoIHBhcnNlWm9uZS5cbiAgICBpZiAoY29uZmlnLl90em0gIT0gbnVsbCkge1xuICAgICAgICBjb25maWcuX2Quc2V0VVRDTWludXRlcyhjb25maWcuX2QuZ2V0VVRDTWludXRlcygpIC0gY29uZmlnLl90em0pO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuX25leHREYXkpIHtcbiAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMjQ7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgZm9yIG1pc21hdGNoaW5nIGRheSBvZiB3ZWVrXG4gICAgaWYgKGNvbmZpZy5fdyAmJiB0eXBlb2YgY29uZmlnLl93LmQgIT09ICd1bmRlZmluZWQnICYmIGNvbmZpZy5fdy5kICE9PSBleHBlY3RlZFdlZWtkYXkpIHtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykud2Vla2RheU1pc21hdGNoID0gdHJ1ZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpIHtcbiAgICB2YXIgdywgd2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95LCB0ZW1wLCB3ZWVrZGF5T3ZlcmZsb3c7XG5cbiAgICB3ID0gY29uZmlnLl93O1xuICAgIGlmICh3LkdHICE9IG51bGwgfHwgdy5XICE9IG51bGwgfHwgdy5FICE9IG51bGwpIHtcbiAgICAgICAgZG93ID0gMTtcbiAgICAgICAgZG95ID0gNDtcblxuICAgICAgICAvLyBUT0RPOiBXZSBuZWVkIHRvIHRha2UgdGhlIGN1cnJlbnQgaXNvV2Vla1llYXIsIGJ1dCB0aGF0IGRlcGVuZHMgb25cbiAgICAgICAgLy8gaG93IHdlIGludGVycHJldCBub3cgKGxvY2FsLCB1dGMsIGZpeGVkIG9mZnNldCkuIFNvIGNyZWF0ZVxuICAgICAgICAvLyBhIG5vdyB2ZXJzaW9uIG9mIGN1cnJlbnQgY29uZmlnICh0YWtlIGxvY2FsL3V0Yy9vZmZzZXQgZmxhZ3MsIGFuZFxuICAgICAgICAvLyBjcmVhdGUgbm93KS5cbiAgICAgICAgd2Vla1llYXIgPSBkZWZhdWx0cyh3LkdHLCBjb25maWcuX2FbWUVBUl0sIHdlZWtPZlllYXIoY3JlYXRlTG9jYWwoKSwgMSwgNCkueWVhcik7XG4gICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LlcsIDEpO1xuICAgICAgICB3ZWVrZGF5ID0gZGVmYXVsdHMody5FLCAxKTtcbiAgICAgICAgaWYgKHdlZWtkYXkgPCAxIHx8IHdlZWtkYXkgPiA3KSB7XG4gICAgICAgICAgICB3ZWVrZGF5T3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZG93ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG93O1xuICAgICAgICBkb3kgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3k7XG5cbiAgICAgICAgdmFyIGN1cldlZWsgPSB3ZWVrT2ZZZWFyKGNyZWF0ZUxvY2FsKCksIGRvdywgZG95KTtcblxuICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKHcuZ2csIGNvbmZpZy5fYVtZRUFSXSwgY3VyV2Vlay55ZWFyKTtcblxuICAgICAgICAvLyBEZWZhdWx0IHRvIGN1cnJlbnQgd2Vlay5cbiAgICAgICAgd2VlayA9IGRlZmF1bHRzKHcudywgY3VyV2Vlay53ZWVrKTtcblxuICAgICAgICBpZiAody5kICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIHdlZWtkYXkgLS0gbG93IGRheSBudW1iZXJzIGFyZSBjb25zaWRlcmVkIG5leHQgd2Vla1xuICAgICAgICAgICAgd2Vla2RheSA9IHcuZDtcbiAgICAgICAgICAgIGlmICh3ZWVrZGF5IDwgMCB8fCB3ZWVrZGF5ID4gNikge1xuICAgICAgICAgICAgICAgIHdlZWtkYXlPdmVyZmxvdyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAody5lICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIGxvY2FsIHdlZWtkYXkgLS0gY291bnRpbmcgc3RhcnRzIGZyb20gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgd2Vla2RheSA9IHcuZSArIGRvdztcbiAgICAgICAgICAgIGlmICh3LmUgPCAwIHx8IHcuZSA+IDYpIHtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5T3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICB3ZWVrZGF5ID0gZG93O1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh3ZWVrIDwgMSB8fCB3ZWVrID4gd2Vla3NJblllYXIod2Vla1llYXIsIGRvdywgZG95KSkge1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5fb3ZlcmZsb3dXZWVrcyA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh3ZWVrZGF5T3ZlcmZsb3cgIT0gbnVsbCkge1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5fb3ZlcmZsb3dXZWVrZGF5ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0ZW1wID0gZGF5T2ZZZWFyRnJvbVdlZWtzKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSk7XG4gICAgICAgIGNvbmZpZy5fYVtZRUFSXSA9IHRlbXAueWVhcjtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0ZW1wLmRheU9mWWVhcjtcbiAgICB9XG59XG5cbi8vIGlzbyA4NjAxIHJlZ2V4XG4vLyAwMDAwLTAwLTAwIDAwMDAtVzAwIG9yIDAwMDAtVzAwLTAgKyBUICsgMDAgb3IgMDA6MDAgb3IgMDA6MDA6MDAgb3IgMDA6MDA6MDAuMDAwICsgKzAwOjAwIG9yICswMDAwIG9yICswMClcbnZhciBleHRlbmRlZElzb1JlZ2V4ID0gL15cXHMqKCg/OlsrLV1cXGR7Nn18XFxkezR9KS0oPzpcXGRcXGQtXFxkXFxkfFdcXGRcXGQtXFxkfFdcXGRcXGR8XFxkXFxkXFxkfFxcZFxcZCkpKD86KFR8ICkoXFxkXFxkKD86OlxcZFxcZCg/OjpcXGRcXGQoPzpbLixdXFxkKyk/KT8pPykoW1xcK1xcLV1cXGRcXGQoPzo6P1xcZFxcZCk/fFxccypaKT8pPyQvO1xudmFyIGJhc2ljSXNvUmVnZXggPSAvXlxccyooKD86WystXVxcZHs2fXxcXGR7NH0pKD86XFxkXFxkXFxkXFxkfFdcXGRcXGRcXGR8V1xcZFxcZHxcXGRcXGRcXGR8XFxkXFxkKSkoPzooVHwgKShcXGRcXGQoPzpcXGRcXGQoPzpcXGRcXGQoPzpbLixdXFxkKyk/KT8pPykoW1xcK1xcLV1cXGRcXGQoPzo6P1xcZFxcZCk/fFxccypaKT8pPyQvO1xuXG52YXIgdHpSZWdleCA9IC9afFsrLV1cXGRcXGQoPzo6P1xcZFxcZCk/LztcblxudmFyIGlzb0RhdGVzID0gW1xuICAgIFsnWVlZWVlZLU1NLUREJywgL1srLV1cXGR7Nn0tXFxkXFxkLVxcZFxcZC9dLFxuICAgIFsnWVlZWS1NTS1ERCcsIC9cXGR7NH0tXFxkXFxkLVxcZFxcZC9dLFxuICAgIFsnR0dHRy1bV11XVy1FJywgL1xcZHs0fS1XXFxkXFxkLVxcZC9dLFxuICAgIFsnR0dHRy1bV11XVycsIC9cXGR7NH0tV1xcZFxcZC8sIGZhbHNlXSxcbiAgICBbJ1lZWVktREREJywgL1xcZHs0fS1cXGR7M30vXSxcbiAgICBbJ1lZWVktTU0nLCAvXFxkezR9LVxcZFxcZC8sIGZhbHNlXSxcbiAgICBbJ1lZWVlZWU1NREQnLCAvWystXVxcZHsxMH0vXSxcbiAgICBbJ1lZWVlNTUREJywgL1xcZHs4fS9dLFxuICAgIC8vIFlZWVlNTSBpcyBOT1QgYWxsb3dlZCBieSB0aGUgc3RhbmRhcmRcbiAgICBbJ0dHR0dbV11XV0UnLCAvXFxkezR9V1xcZHszfS9dLFxuICAgIFsnR0dHR1tXXVdXJywgL1xcZHs0fVdcXGR7Mn0vLCBmYWxzZV0sXG4gICAgWydZWVlZREREJywgL1xcZHs3fS9dXG5dO1xuXG4vLyBpc28gdGltZSBmb3JtYXRzIGFuZCByZWdleGVzXG52YXIgaXNvVGltZXMgPSBbXG4gICAgWydISDptbTpzcy5TU1NTJywgL1xcZFxcZDpcXGRcXGQ6XFxkXFxkXFwuXFxkKy9dLFxuICAgIFsnSEg6bW06c3MsU1NTUycsIC9cXGRcXGQ6XFxkXFxkOlxcZFxcZCxcXGQrL10sXG4gICAgWydISDptbTpzcycsIC9cXGRcXGQ6XFxkXFxkOlxcZFxcZC9dLFxuICAgIFsnSEg6bW0nLCAvXFxkXFxkOlxcZFxcZC9dLFxuICAgIFsnSEhtbXNzLlNTU1MnLCAvXFxkXFxkXFxkXFxkXFxkXFxkXFwuXFxkKy9dLFxuICAgIFsnSEhtbXNzLFNTU1MnLCAvXFxkXFxkXFxkXFxkXFxkXFxkLFxcZCsvXSxcbiAgICBbJ0hIbW1zcycsIC9cXGRcXGRcXGRcXGRcXGRcXGQvXSxcbiAgICBbJ0hIbW0nLCAvXFxkXFxkXFxkXFxkL10sXG4gICAgWydISCcsIC9cXGRcXGQvXVxuXTtcblxudmFyIGFzcE5ldEpzb25SZWdleCA9IC9eXFwvP0RhdGVcXCgoXFwtP1xcZCspL2k7XG5cbi8vIGRhdGUgZnJvbSBpc28gZm9ybWF0XG5mdW5jdGlvbiBjb25maWdGcm9tSVNPKGNvbmZpZykge1xuICAgIHZhciBpLCBsLFxuICAgICAgICBzdHJpbmcgPSBjb25maWcuX2ksXG4gICAgICAgIG1hdGNoID0gZXh0ZW5kZWRJc29SZWdleC5leGVjKHN0cmluZykgfHwgYmFzaWNJc29SZWdleC5leGVjKHN0cmluZyksXG4gICAgICAgIGFsbG93VGltZSwgZGF0ZUZvcm1hdCwgdGltZUZvcm1hdCwgdHpGb3JtYXQ7XG5cbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaXNvID0gdHJ1ZTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvRGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaXNvRGF0ZXNbaV1bMV0uZXhlYyhtYXRjaFsxXSkpIHtcbiAgICAgICAgICAgICAgICBkYXRlRm9ybWF0ID0gaXNvRGF0ZXNbaV1bMF07XG4gICAgICAgICAgICAgICAgYWxsb3dUaW1lID0gaXNvRGF0ZXNbaV1bMl0gIT09IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRlRm9ybWF0ID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFszXSkge1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb1RpbWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29UaW1lc1tpXVsxXS5leGVjKG1hdGNoWzNdKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaFsyXSBzaG91bGQgYmUgJ1QnIG9yIHNwYWNlXG4gICAgICAgICAgICAgICAgICAgIHRpbWVGb3JtYXQgPSAobWF0Y2hbMl0gfHwgJyAnKSArIGlzb1RpbWVzW2ldWzBdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGltZUZvcm1hdCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghYWxsb3dUaW1lICYmIHRpbWVGb3JtYXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoWzRdKSB7XG4gICAgICAgICAgICBpZiAodHpSZWdleC5leGVjKG1hdGNoWzRdKSkge1xuICAgICAgICAgICAgICAgIHR6Rm9ybWF0ID0gJ1onO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uZmlnLl9mID0gZGF0ZUZvcm1hdCArICh0aW1lRm9ybWF0IHx8ICcnKSArICh0ekZvcm1hdCB8fCAnJyk7XG4gICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICB9XG59XG5cbi8vIFJGQyAyODIyIHJlZ2V4OiBGb3IgZGV0YWlscyBzZWUgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzI4MjIjc2VjdGlvbi0zLjNcbnZhciByZmMyODIyID0gL14oPzooTW9ufFR1ZXxXZWR8VGh1fEZyaXxTYXR8U3VuKSw/XFxzKT8oXFxkezEsMn0pXFxzKEphbnxGZWJ8TWFyfEFwcnxNYXl8SnVufEp1bHxBdWd8U2VwfE9jdHxOb3Z8RGVjKVxccyhcXGR7Miw0fSlcXHMoXFxkXFxkKTooXFxkXFxkKSg/OjooXFxkXFxkKSk/XFxzKD86KFVUfEdNVHxbRUNNUF1bU0RdVCl8KFtael0pfChbKy1dXFxkezR9KSkkLztcblxuZnVuY3Rpb24gZXh0cmFjdEZyb21SRkMyODIyU3RyaW5ncyh5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyLCBob3VyU3RyLCBtaW51dGVTdHIsIHNlY29uZFN0cikge1xuICAgIHZhciByZXN1bHQgPSBbXG4gICAgICAgIHVudHJ1bmNhdGVZZWFyKHllYXJTdHIpLFxuICAgICAgICBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQuaW5kZXhPZihtb250aFN0ciksXG4gICAgICAgIHBhcnNlSW50KGRheVN0ciwgMTApLFxuICAgICAgICBwYXJzZUludChob3VyU3RyLCAxMCksXG4gICAgICAgIHBhcnNlSW50KG1pbnV0ZVN0ciwgMTApXG4gICAgXTtcblxuICAgIGlmIChzZWNvbmRTdHIpIHtcbiAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VJbnQoc2Vjb25kU3RyLCAxMCkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHVudHJ1bmNhdGVZZWFyKHllYXJTdHIpIHtcbiAgICB2YXIgeWVhciA9IHBhcnNlSW50KHllYXJTdHIsIDEwKTtcbiAgICBpZiAoeWVhciA8PSA0OSkge1xuICAgICAgICByZXR1cm4gMjAwMCArIHllYXI7XG4gICAgfSBlbHNlIGlmICh5ZWFyIDw9IDk5OSkge1xuICAgICAgICByZXR1cm4gMTkwMCArIHllYXI7XG4gICAgfVxuICAgIHJldHVybiB5ZWFyO1xufVxuXG5mdW5jdGlvbiBwcmVwcm9jZXNzUkZDMjgyMihzKSB7XG4gICAgLy8gUmVtb3ZlIGNvbW1lbnRzIGFuZCBmb2xkaW5nIHdoaXRlc3BhY2UgYW5kIHJlcGxhY2UgbXVsdGlwbGUtc3BhY2VzIHdpdGggYSBzaW5nbGUgc3BhY2VcbiAgICByZXR1cm4gcy5yZXBsYWNlKC9cXChbXildKlxcKXxbXFxuXFx0XS9nLCAnICcpLnJlcGxhY2UoLyhcXHNcXHMrKS9nLCAnICcpLnRyaW0oKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tXZWVrZGF5KHdlZWtkYXlTdHIsIHBhcnNlZElucHV0LCBjb25maWcpIHtcbiAgICBpZiAod2Vla2RheVN0cikge1xuICAgICAgICAvLyBUT0RPOiBSZXBsYWNlIHRoZSB2YW5pbGxhIEpTIERhdGUgb2JqZWN0IHdpdGggYW4gaW5kZXBlbnRlbnQgZGF5LW9mLXdlZWsgY2hlY2suXG4gICAgICAgIHZhciB3ZWVrZGF5UHJvdmlkZWQgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydC5pbmRleE9mKHdlZWtkYXlTdHIpLFxuICAgICAgICAgICAgd2Vla2RheUFjdHVhbCA9IG5ldyBEYXRlKHBhcnNlZElucHV0WzBdLCBwYXJzZWRJbnB1dFsxXSwgcGFyc2VkSW5wdXRbMl0pLmdldERheSgpO1xuICAgICAgICBpZiAod2Vla2RheVByb3ZpZGVkICE9PSB3ZWVrZGF5QWN0dWFsKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS53ZWVrZGF5TWlzbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbnZhciBvYnNPZmZzZXRzID0ge1xuICAgIFVUOiAwLFxuICAgIEdNVDogMCxcbiAgICBFRFQ6IC00ICogNjAsXG4gICAgRVNUOiAtNSAqIDYwLFxuICAgIENEVDogLTUgKiA2MCxcbiAgICBDU1Q6IC02ICogNjAsXG4gICAgTURUOiAtNiAqIDYwLFxuICAgIE1TVDogLTcgKiA2MCxcbiAgICBQRFQ6IC03ICogNjAsXG4gICAgUFNUOiAtOCAqIDYwXG59O1xuXG5mdW5jdGlvbiBjYWxjdWxhdGVPZmZzZXQob2JzT2Zmc2V0LCBtaWxpdGFyeU9mZnNldCwgbnVtT2Zmc2V0KSB7XG4gICAgaWYgKG9ic09mZnNldCkge1xuICAgICAgICByZXR1cm4gb2JzT2Zmc2V0c1tvYnNPZmZzZXRdO1xuICAgIH0gZWxzZSBpZiAobWlsaXRhcnlPZmZzZXQpIHtcbiAgICAgICAgLy8gdGhlIG9ubHkgYWxsb3dlZCBtaWxpdGFyeSB0eiBpcyBaXG4gICAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBobSA9IHBhcnNlSW50KG51bU9mZnNldCwgMTApO1xuICAgICAgICB2YXIgbSA9IGhtICUgMTAwLCBoID0gKGhtIC0gbSkgLyAxMDA7XG4gICAgICAgIHJldHVybiBoICogNjAgKyBtO1xuICAgIH1cbn1cblxuLy8gZGF0ZSBhbmQgdGltZSBmcm9tIHJlZiAyODIyIGZvcm1hdFxuZnVuY3Rpb24gY29uZmlnRnJvbVJGQzI4MjIoY29uZmlnKSB7XG4gICAgdmFyIG1hdGNoID0gcmZjMjgyMi5leGVjKHByZXByb2Nlc3NSRkMyODIyKGNvbmZpZy5faSkpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgICB2YXIgcGFyc2VkQXJyYXkgPSBleHRyYWN0RnJvbVJGQzI4MjJTdHJpbmdzKG1hdGNoWzRdLCBtYXRjaFszXSwgbWF0Y2hbMl0sIG1hdGNoWzVdLCBtYXRjaFs2XSwgbWF0Y2hbN10pO1xuICAgICAgICBpZiAoIWNoZWNrV2Vla2RheShtYXRjaFsxXSwgcGFyc2VkQXJyYXksIGNvbmZpZykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5fYSA9IHBhcnNlZEFycmF5O1xuICAgICAgICBjb25maWcuX3R6bSA9IGNhbGN1bGF0ZU9mZnNldChtYXRjaFs4XSwgbWF0Y2hbOV0sIG1hdGNoWzEwXSk7XG5cbiAgICAgICAgY29uZmlnLl9kID0gY3JlYXRlVVRDRGF0ZS5hcHBseShudWxsLCBjb25maWcuX2EpO1xuICAgICAgICBjb25maWcuX2Quc2V0VVRDTWludXRlcyhjb25maWcuX2QuZ2V0VVRDTWludXRlcygpIC0gY29uZmlnLl90em0pO1xuXG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnJmYzI4MjIgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgIH1cbn1cblxuLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXQgb3IgZmFsbGJhY2tcbmZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKSB7XG4gICAgdmFyIG1hdGNoZWQgPSBhc3BOZXRKc29uUmVnZXguZXhlYyhjb25maWcuX2kpO1xuXG4gICAgaWYgKG1hdGNoZWQgIT09IG51bGwpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK21hdGNoZWRbMV0pO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uZmlnRnJvbUlTTyhjb25maWcpO1xuICAgIGlmIChjb25maWcuX2lzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGRlbGV0ZSBjb25maWcuX2lzVmFsaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbmZpZ0Zyb21SRkMyODIyKGNvbmZpZyk7XG4gICAgaWYgKGNvbmZpZy5faXNWYWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRmluYWwgYXR0ZW1wdCwgdXNlIElucHV0IEZhbGxiYWNrXG4gICAgaG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbn1cblxuaG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2sgPSBkZXByZWNhdGUoXG4gICAgJ3ZhbHVlIHByb3ZpZGVkIGlzIG5vdCBpbiBhIHJlY29nbml6ZWQgUkZDMjgyMiBvciBJU08gZm9ybWF0LiBtb21lbnQgY29uc3RydWN0aW9uIGZhbGxzIGJhY2sgdG8ganMgRGF0ZSgpLCAnICtcbiAgICAnd2hpY2ggaXMgbm90IHJlbGlhYmxlIGFjcm9zcyBhbGwgYnJvd3NlcnMgYW5kIHZlcnNpb25zLiBOb24gUkZDMjgyMi9JU08gZGF0ZSBmb3JtYXRzIGFyZSAnICtcbiAgICAnZGlzY291cmFnZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBhbiB1cGNvbWluZyBtYWpvciByZWxlYXNlLiBQbGVhc2UgcmVmZXIgdG8gJyArXG4gICAgJ2h0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvanMtZGF0ZS8gZm9yIG1vcmUgaW5mby4nLFxuICAgIGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoY29uZmlnLl9pICsgKGNvbmZpZy5fdXNlVVRDID8gJyBVVEMnIDogJycpKTtcbiAgICB9XG4pO1xuXG4vLyBjb25zdGFudCB0aGF0IHJlZmVycyB0byB0aGUgSVNPIHN0YW5kYXJkXG5ob29rcy5JU09fODYwMSA9IGZ1bmN0aW9uICgpIHt9O1xuXG4vLyBjb25zdGFudCB0aGF0IHJlZmVycyB0byB0aGUgUkZDIDI4MjIgZm9ybVxuaG9va3MuUkZDXzI4MjIgPSBmdW5jdGlvbiAoKSB7fTtcblxuLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgZm9ybWF0IHN0cmluZ1xuZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpIHtcbiAgICAvLyBUT0RPOiBNb3ZlIHRoaXMgdG8gYW5vdGhlciBwYXJ0IG9mIHRoZSBjcmVhdGlvbiBmbG93IHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwc1xuICAgIGlmIChjb25maWcuX2YgPT09IGhvb2tzLklTT184NjAxKSB7XG4gICAgICAgIGNvbmZpZ0Zyb21JU08oY29uZmlnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY29uZmlnLl9mID09PSBob29rcy5SRkNfMjgyMikge1xuICAgICAgICBjb25maWdGcm9tUkZDMjgyMihjb25maWcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbmZpZy5fYSA9IFtdO1xuICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gdHJ1ZTtcblxuICAgIC8vIFRoaXMgYXJyYXkgaXMgdXNlZCB0byBtYWtlIGEgRGF0ZSwgZWl0aGVyIHdpdGggYG5ldyBEYXRlYCBvciBgRGF0ZS5VVENgXG4gICAgdmFyIHN0cmluZyA9ICcnICsgY29uZmlnLl9pLFxuICAgICAgICBpLCBwYXJzZWRJbnB1dCwgdG9rZW5zLCB0b2tlbiwgc2tpcHBlZCxcbiAgICAgICAgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCA9IDA7XG5cbiAgICB0b2tlbnMgPSBleHBhbmRGb3JtYXQoY29uZmlnLl9mLCBjb25maWcuX2xvY2FsZSkubWF0Y2goZm9ybWF0dGluZ1Rva2VucykgfHwgW107XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICBwYXJzZWRJbnB1dCA9IChzdHJpbmcubWF0Y2goZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKSB8fCBbXSlbMF07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0b2tlbicsIHRva2VuLCAncGFyc2VkSW5wdXQnLCBwYXJzZWRJbnB1dCxcbiAgICAgICAgLy8gICAgICAgICAncmVnZXgnLCBnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykpO1xuICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgIHNraXBwZWQgPSBzdHJpbmcuc3Vic3RyKDAsIHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSk7XG4gICAgICAgICAgICBpZiAoc2tpcHBlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkSW5wdXQucHVzaChza2lwcGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5zbGljZShzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkgKyBwYXJzZWRJbnB1dC5sZW5ndGgpO1xuICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCArPSBwYXJzZWRJbnB1dC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZG9uJ3QgcGFyc2UgaWYgaXQncyBub3QgYSBrbm93biB0b2tlblxuICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbdG9rZW5dKSB7XG4gICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5lbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIHBhcnNlZElucHV0LCBjb25maWcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbmZpZy5fc3RyaWN0ICYmICFwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWRkIHJlbWFpbmluZyB1bnBhcnNlZCBpbnB1dCBsZW5ndGggdG8gdGhlIHN0cmluZ1xuICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmNoYXJzTGVmdE92ZXIgPSBzdHJpbmdMZW5ndGggLSB0b3RhbFBhcnNlZElucHV0TGVuZ3RoO1xuICAgIGlmIChzdHJpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRJbnB1dC5wdXNoKHN0cmluZyk7XG4gICAgfVxuXG4gICAgLy8gY2xlYXIgXzEyaCBmbGFnIGlmIGhvdXIgaXMgPD0gMTJcbiAgICBpZiAoY29uZmlnLl9hW0hPVVJdIDw9IDEyICYmXG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPT09IHRydWUgJiZcbiAgICAgICAgY29uZmlnLl9hW0hPVVJdID4gMCkge1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnBhcnNlZERhdGVQYXJ0cyA9IGNvbmZpZy5fYS5zbGljZSgwKTtcbiAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5tZXJpZGllbSA9IGNvbmZpZy5fbWVyaWRpZW07XG4gICAgLy8gaGFuZGxlIG1lcmlkaWVtXG4gICAgY29uZmlnLl9hW0hPVVJdID0gbWVyaWRpZW1GaXhXcmFwKGNvbmZpZy5fbG9jYWxlLCBjb25maWcuX2FbSE9VUl0sIGNvbmZpZy5fbWVyaWRpZW0pO1xuXG4gICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgY2hlY2tPdmVyZmxvdyhjb25maWcpO1xufVxuXG5cbmZ1bmN0aW9uIG1lcmlkaWVtRml4V3JhcCAobG9jYWxlLCBob3VyLCBtZXJpZGllbSkge1xuICAgIHZhciBpc1BtO1xuXG4gICAgaWYgKG1lcmlkaWVtID09IG51bGwpIHtcbiAgICAgICAgLy8gbm90aGluZyB0byBkb1xuICAgICAgICByZXR1cm4gaG91cjtcbiAgICB9XG4gICAgaWYgKGxvY2FsZS5tZXJpZGllbUhvdXIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLm1lcmlkaWVtSG91cihob3VyLCBtZXJpZGllbSk7XG4gICAgfSBlbHNlIGlmIChsb2NhbGUuaXNQTSAhPSBudWxsKSB7XG4gICAgICAgIC8vIEZhbGxiYWNrXG4gICAgICAgIGlzUG0gPSBsb2NhbGUuaXNQTShtZXJpZGllbSk7XG4gICAgICAgIGlmIChpc1BtICYmIGhvdXIgPCAxMikge1xuICAgICAgICAgICAgaG91ciArPSAxMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzUG0gJiYgaG91ciA9PT0gMTIpIHtcbiAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBob3VyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRoaXMgaXMgbm90IHN1cHBvc2VkIHRvIGhhcHBlblxuICAgICAgICByZXR1cm4gaG91cjtcbiAgICB9XG59XG5cbi8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGFycmF5IG9mIGZvcm1hdCBzdHJpbmdzXG5mdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKSB7XG4gICAgdmFyIHRlbXBDb25maWcsXG4gICAgICAgIGJlc3RNb21lbnQsXG5cbiAgICAgICAgc2NvcmVUb0JlYXQsXG4gICAgICAgIGksXG4gICAgICAgIGN1cnJlbnRTY29yZTtcblxuICAgIGlmIChjb25maWcuX2YubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRGb3JtYXQgPSB0cnVlO1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGNvbmZpZy5fZi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjdXJyZW50U2NvcmUgPSAwO1xuICAgICAgICB0ZW1wQ29uZmlnID0gY29weUNvbmZpZyh7fSwgY29uZmlnKTtcbiAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRlbXBDb25maWcuX3VzZVVUQyA9IGNvbmZpZy5fdXNlVVRDO1xuICAgICAgICB9XG4gICAgICAgIHRlbXBDb25maWcuX2YgPSBjb25maWcuX2ZbaV07XG4gICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQodGVtcENvbmZpZyk7XG5cbiAgICAgICAgaWYgKCFpc1ZhbGlkKHRlbXBDb25maWcpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGFueSBpbnB1dCB0aGF0IHdhcyBub3QgcGFyc2VkIGFkZCBhIHBlbmFsdHkgZm9yIHRoYXQgZm9ybWF0XG4gICAgICAgIGN1cnJlbnRTY29yZSArPSBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykuY2hhcnNMZWZ0T3ZlcjtcblxuICAgICAgICAvL29yIHRva2Vuc1xuICAgICAgICBjdXJyZW50U2NvcmUgKz0gZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLnVudXNlZFRva2Vucy5sZW5ndGggKiAxMDtcblxuICAgICAgICBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykuc2NvcmUgPSBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgaWYgKHNjb3JlVG9CZWF0ID09IG51bGwgfHwgY3VycmVudFNjb3JlIDwgc2NvcmVUb0JlYXQpIHtcbiAgICAgICAgICAgIHNjb3JlVG9CZWF0ID0gY3VycmVudFNjb3JlO1xuICAgICAgICAgICAgYmVzdE1vbWVudCA9IHRlbXBDb25maWc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHRlbmQoY29uZmlnLCBiZXN0TW9tZW50IHx8IHRlbXBDb25maWcpO1xufVxuXG5mdW5jdGlvbiBjb25maWdGcm9tT2JqZWN0KGNvbmZpZykge1xuICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBpID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoY29uZmlnLl9pKTtcbiAgICBjb25maWcuX2EgPSBtYXAoW2kueWVhciwgaS5tb250aCwgaS5kYXkgfHwgaS5kYXRlLCBpLmhvdXIsIGkubWludXRlLCBpLnNlY29uZCwgaS5taWxsaXNlY29uZF0sIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiAmJiBwYXJzZUludChvYmosIDEwKTtcbiAgICB9KTtcblxuICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGcm9tQ29uZmlnIChjb25maWcpIHtcbiAgICB2YXIgcmVzID0gbmV3IE1vbWVudChjaGVja092ZXJmbG93KHByZXBhcmVDb25maWcoY29uZmlnKSkpO1xuICAgIGlmIChyZXMuX25leHREYXkpIHtcbiAgICAgICAgLy8gQWRkaW5nIGlzIHNtYXJ0IGVub3VnaCBhcm91bmQgRFNUXG4gICAgICAgIHJlcy5hZGQoMSwgJ2QnKTtcbiAgICAgICAgcmVzLl9uZXh0RGF5ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVDb25maWcgKGNvbmZpZykge1xuICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSxcbiAgICAgICAgZm9ybWF0ID0gY29uZmlnLl9mO1xuXG4gICAgY29uZmlnLl9sb2NhbGUgPSBjb25maWcuX2xvY2FsZSB8fCBnZXRMb2NhbGUoY29uZmlnLl9sKTtcblxuICAgIGlmIChpbnB1dCA9PT0gbnVsbCB8fCAoZm9ybWF0ID09PSB1bmRlZmluZWQgJiYgaW5wdXQgPT09ICcnKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlSW52YWxpZCh7bnVsbElucHV0OiB0cnVlfSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uZmlnLl9pID0gaW5wdXQgPSBjb25maWcuX2xvY2FsZS5wcmVwYXJzZShpbnB1dCk7XG4gICAgfVxuXG4gICAgaWYgKGlzTW9tZW50KGlucHV0KSkge1xuICAgICAgICByZXR1cm4gbmV3IE1vbWVudChjaGVja092ZXJmbG93KGlucHV0KSk7XG4gICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IGlucHV0O1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShmb3JtYXQpKSB7XG4gICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRBcnJheShjb25maWcpO1xuICAgIH0gZWxzZSBpZiAoZm9ybWF0KSB7XG4gICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICB9ICBlbHNlIHtcbiAgICAgICAgY29uZmlnRnJvbUlucHV0KGNvbmZpZyk7XG4gICAgfVxuXG4gICAgaWYgKCFpc1ZhbGlkKGNvbmZpZykpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnO1xufVxuXG5mdW5jdGlvbiBjb25maWdGcm9tSW5wdXQoY29uZmlnKSB7XG4gICAgdmFyIGlucHV0ID0gY29uZmlnLl9pO1xuICAgIGlmIChpc1VuZGVmaW5lZChpbnB1dCkpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaG9va3Mubm93KCkpO1xuICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dC52YWx1ZU9mKCkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25maWdGcm9tU3RyaW5nKGNvbmZpZyk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgICAgICBjb25maWcuX2EgPSBtYXAoaW5wdXQuc2xpY2UoMCksIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChvYmosIDEwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoaW5wdXQpKSB7XG4gICAgICAgIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKTtcbiAgICB9IGVsc2UgaWYgKGlzTnVtYmVyKGlucHV0KSkge1xuICAgICAgICAvLyBmcm9tIG1pbGxpc2Vjb25kc1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxvY2FsT3JVVEMgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBpc1VUQykge1xuICAgIHZhciBjID0ge307XG5cbiAgICBpZiAobG9jYWxlID09PSB0cnVlIHx8IGxvY2FsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgc3RyaWN0ID0gbG9jYWxlO1xuICAgICAgICBsb2NhbGUgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKChpc09iamVjdChpbnB1dCkgJiYgaXNPYmplY3RFbXB0eShpbnB1dCkpIHx8XG4gICAgICAgICAgICAoaXNBcnJheShpbnB1dCkgJiYgaW5wdXQubGVuZ3RoID09PSAwKSkge1xuICAgICAgICBpbnB1dCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gb2JqZWN0IGNvbnN0cnVjdGlvbiBtdXN0IGJlIGRvbmUgdGhpcyB3YXkuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MjNcbiAgICBjLl9pc0FNb21lbnRPYmplY3QgPSB0cnVlO1xuICAgIGMuX3VzZVVUQyA9IGMuX2lzVVRDID0gaXNVVEM7XG4gICAgYy5fbCA9IGxvY2FsZTtcbiAgICBjLl9pID0gaW5wdXQ7XG4gICAgYy5fZiA9IGZvcm1hdDtcbiAgICBjLl9zdHJpY3QgPSBzdHJpY3Q7XG5cbiAgICByZXR1cm4gY3JlYXRlRnJvbUNvbmZpZyhjKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTG9jYWwgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgcmV0dXJuIGNyZWF0ZUxvY2FsT3JVVEMoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIGZhbHNlKTtcbn1cblxudmFyIHByb3RvdHlwZU1pbiA9IGRlcHJlY2F0ZShcbiAgICAnbW9tZW50KCkubWluIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWF4IGluc3RlYWQuIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvbWluLW1heC8nLFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpICYmIG90aGVyLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG90aGVyIDwgdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVJbnZhbGlkKCk7XG4gICAgICAgIH1cbiAgICB9XG4pO1xuXG52YXIgcHJvdG90eXBlTWF4ID0gZGVwcmVjYXRlKFxuICAgICdtb21lbnQoKS5tYXggaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5taW4gaW5zdGVhZC4gaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9taW4tbWF4LycsXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkgJiYgb3RoZXIuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gb3RoZXIgPiB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUludmFsaWQoKTtcbiAgICAgICAgfVxuICAgIH1cbik7XG5cbi8vIFBpY2sgYSBtb21lbnQgbSBmcm9tIG1vbWVudHMgc28gdGhhdCBtW2ZuXShvdGhlcikgaXMgdHJ1ZSBmb3IgYWxsXG4vLyBvdGhlci4gVGhpcyByZWxpZXMgb24gdGhlIGZ1bmN0aW9uIGZuIHRvIGJlIHRyYW5zaXRpdmUuXG4vL1xuLy8gbW9tZW50cyBzaG91bGQgZWl0aGVyIGJlIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzIG9yIGFuIGFycmF5LCB3aG9zZVxuLy8gZmlyc3QgZWxlbWVudCBpcyBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cy5cbmZ1bmN0aW9uIHBpY2tCeShmbiwgbW9tZW50cykge1xuICAgIHZhciByZXMsIGk7XG4gICAgaWYgKG1vbWVudHMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkobW9tZW50c1swXSkpIHtcbiAgICAgICAgbW9tZW50cyA9IG1vbWVudHNbMF07XG4gICAgfVxuICAgIGlmICghbW9tZW50cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsKCk7XG4gICAgfVxuICAgIHJlcyA9IG1vbWVudHNbMF07XG4gICAgZm9yIChpID0gMTsgaSA8IG1vbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKCFtb21lbnRzW2ldLmlzVmFsaWQoKSB8fCBtb21lbnRzW2ldW2ZuXShyZXMpKSB7XG4gICAgICAgICAgICByZXMgPSBtb21lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFRPRE86IFVzZSBbXS5zb3J0IGluc3RlYWQ/XG5mdW5jdGlvbiBtaW4gKCkge1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgcmV0dXJuIHBpY2tCeSgnaXNCZWZvcmUnLCBhcmdzKTtcbn1cblxuZnVuY3Rpb24gbWF4ICgpIHtcbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgIHJldHVybiBwaWNrQnkoJ2lzQWZ0ZXInLCBhcmdzKTtcbn1cblxudmFyIG5vdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gRGF0ZS5ub3cgPyBEYXRlLm5vdygpIDogKyhuZXcgRGF0ZSgpKTtcbn07XG5cbnZhciBvcmRlcmluZyA9IFsneWVhcicsICdxdWFydGVyJywgJ21vbnRoJywgJ3dlZWsnLCAnZGF5JywgJ2hvdXInLCAnbWludXRlJywgJ3NlY29uZCcsICdtaWxsaXNlY29uZCddO1xuXG5mdW5jdGlvbiBpc0R1cmF0aW9uVmFsaWQobSkge1xuICAgIGZvciAodmFyIGtleSBpbiBtKSB7XG4gICAgICAgIGlmICghKGluZGV4T2YuY2FsbChvcmRlcmluZywga2V5KSAhPT0gLTEgJiYgKG1ba2V5XSA9PSBudWxsIHx8ICFpc05hTihtW2tleV0pKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciB1bml0SGFzRGVjaW1hbCA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3JkZXJpbmcubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKG1bb3JkZXJpbmdbaV1dKSB7XG4gICAgICAgICAgICBpZiAodW5pdEhhc0RlY2ltYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIG9ubHkgYWxsb3cgbm9uLWludGVnZXJzIGZvciBzbWFsbGVzdCB1bml0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFyc2VGbG9hdChtW29yZGVyaW5nW2ldXSkgIT09IHRvSW50KG1bb3JkZXJpbmdbaV1dKSkge1xuICAgICAgICAgICAgICAgIHVuaXRIYXNEZWNpbWFsID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkJDEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzVmFsaWQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUludmFsaWQkMSgpIHtcbiAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24oTmFOKTtcbn1cblxuZnVuY3Rpb24gRHVyYXRpb24gKGR1cmF0aW9uKSB7XG4gICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGR1cmF0aW9uKSxcbiAgICAgICAgeWVhcnMgPSBub3JtYWxpemVkSW5wdXQueWVhciB8fCAwLFxuICAgICAgICBxdWFydGVycyA9IG5vcm1hbGl6ZWRJbnB1dC5xdWFydGVyIHx8IDAsXG4gICAgICAgIG1vbnRocyA9IG5vcm1hbGl6ZWRJbnB1dC5tb250aCB8fCAwLFxuICAgICAgICB3ZWVrcyA9IG5vcm1hbGl6ZWRJbnB1dC53ZWVrIHx8IDAsXG4gICAgICAgIGRheXMgPSBub3JtYWxpemVkSW5wdXQuZGF5IHx8IDAsXG4gICAgICAgIGhvdXJzID0gbm9ybWFsaXplZElucHV0LmhvdXIgfHwgMCxcbiAgICAgICAgbWludXRlcyA9IG5vcm1hbGl6ZWRJbnB1dC5taW51dGUgfHwgMCxcbiAgICAgICAgc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQgfHwgMCxcbiAgICAgICAgbWlsbGlzZWNvbmRzID0gbm9ybWFsaXplZElucHV0Lm1pbGxpc2Vjb25kIHx8IDA7XG5cbiAgICB0aGlzLl9pc1ZhbGlkID0gaXNEdXJhdGlvblZhbGlkKG5vcm1hbGl6ZWRJbnB1dCk7XG5cbiAgICAvLyByZXByZXNlbnRhdGlvbiBmb3IgZGF0ZUFkZFJlbW92ZVxuICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9ICttaWxsaXNlY29uZHMgK1xuICAgICAgICBzZWNvbmRzICogMWUzICsgLy8gMTAwMFxuICAgICAgICBtaW51dGVzICogNmU0ICsgLy8gMTAwMCAqIDYwXG4gICAgICAgIGhvdXJzICogMTAwMCAqIDYwICogNjA7IC8vdXNpbmcgMTAwMCAqIDYwICogNjAgaW5zdGVhZCBvZiAzNmU1IHRvIGF2b2lkIGZsb2F0aW5nIHBvaW50IHJvdW5kaW5nIGVycm9ycyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMjk3OFxuICAgIC8vIEJlY2F1c2Ugb2YgZGF0ZUFkZFJlbW92ZSB0cmVhdHMgMjQgaG91cnMgYXMgZGlmZmVyZW50IGZyb20gYVxuICAgIC8vIGRheSB3aGVuIHdvcmtpbmcgYXJvdW5kIERTVCwgd2UgbmVlZCB0byBzdG9yZSB0aGVtIHNlcGFyYXRlbHlcbiAgICB0aGlzLl9kYXlzID0gK2RheXMgK1xuICAgICAgICB3ZWVrcyAqIDc7XG4gICAgLy8gSXQgaXMgaW1wb3NzaWJsZSB0byB0cmFuc2xhdGUgbW9udGhzIGludG8gZGF5cyB3aXRob3V0IGtub3dpbmdcbiAgICAvLyB3aGljaCBtb250aHMgeW91IGFyZSBhcmUgdGFsa2luZyBhYm91dCwgc28gd2UgaGF2ZSB0byBzdG9yZVxuICAgIC8vIGl0IHNlcGFyYXRlbHkuXG4gICAgdGhpcy5fbW9udGhzID0gK21vbnRocyArXG4gICAgICAgIHF1YXJ0ZXJzICogMyArXG4gICAgICAgIHllYXJzICogMTI7XG5cbiAgICB0aGlzLl9kYXRhID0ge307XG5cbiAgICB0aGlzLl9sb2NhbGUgPSBnZXRMb2NhbGUoKTtcblxuICAgIHRoaXMuX2J1YmJsZSgpO1xufVxuXG5mdW5jdGlvbiBpc0R1cmF0aW9uIChvYmopIHtcbiAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRHVyYXRpb247XG59XG5cbmZ1bmN0aW9uIGFic1JvdW5kIChudW1iZXIpIHtcbiAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCgtMSAqIG51bWJlcikgKiAtMTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChudW1iZXIpO1xuICAgIH1cbn1cblxuLy8gRk9STUFUVElOR1xuXG5mdW5jdGlvbiBvZmZzZXQgKHRva2VuLCBzZXBhcmF0b3IpIHtcbiAgICBhZGRGb3JtYXRUb2tlbih0b2tlbiwgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy51dGNPZmZzZXQoKTtcbiAgICAgICAgdmFyIHNpZ24gPSAnKyc7XG4gICAgICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAtb2Zmc2V0O1xuICAgICAgICAgICAgc2lnbiA9ICctJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2lnbiArIHplcm9GaWxsKH5+KG9mZnNldCAvIDYwKSwgMikgKyBzZXBhcmF0b3IgKyB6ZXJvRmlsbCh+fihvZmZzZXQpICUgNjAsIDIpO1xuICAgIH0pO1xufVxuXG5vZmZzZXQoJ1onLCAnOicpO1xub2Zmc2V0KCdaWicsICcnKTtcblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCdaJywgIG1hdGNoU2hvcnRPZmZzZXQpO1xuYWRkUmVnZXhUb2tlbignWlonLCBtYXRjaFNob3J0T2Zmc2V0KTtcbmFkZFBhcnNlVG9rZW4oWydaJywgJ1paJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgIGNvbmZpZy5fdXNlVVRDID0gdHJ1ZTtcbiAgICBjb25maWcuX3R6bSA9IG9mZnNldEZyb21TdHJpbmcobWF0Y2hTaG9ydE9mZnNldCwgaW5wdXQpO1xufSk7XG5cbi8vIEhFTFBFUlNcblxuLy8gdGltZXpvbmUgY2h1bmtlclxuLy8gJysxMDowMCcgPiBbJzEwJywgICcwMCddXG4vLyAnLTE1MzAnICA+IFsnLTE1JywgJzMwJ11cbnZhciBjaHVua09mZnNldCA9IC8oW1xcK1xcLV18XFxkXFxkKS9naTtcblxuZnVuY3Rpb24gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaGVyLCBzdHJpbmcpIHtcbiAgICB2YXIgbWF0Y2hlcyA9IChzdHJpbmcgfHwgJycpLm1hdGNoKG1hdGNoZXIpO1xuXG4gICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGNodW5rICAgPSBtYXRjaGVzW21hdGNoZXMubGVuZ3RoIC0gMV0gfHwgW107XG4gICAgdmFyIHBhcnRzICAgPSAoY2h1bmsgKyAnJykubWF0Y2goY2h1bmtPZmZzZXQpIHx8IFsnLScsIDAsIDBdO1xuICAgIHZhciBtaW51dGVzID0gKyhwYXJ0c1sxXSAqIDYwKSArIHRvSW50KHBhcnRzWzJdKTtcblxuICAgIHJldHVybiBtaW51dGVzID09PSAwID9cbiAgICAgIDAgOlxuICAgICAgcGFydHNbMF0gPT09ICcrJyA/IG1pbnV0ZXMgOiAtbWludXRlcztcbn1cblxuLy8gUmV0dXJuIGEgbW9tZW50IGZyb20gaW5wdXQsIHRoYXQgaXMgbG9jYWwvdXRjL3pvbmUgZXF1aXZhbGVudCB0byBtb2RlbC5cbmZ1bmN0aW9uIGNsb25lV2l0aE9mZnNldChpbnB1dCwgbW9kZWwpIHtcbiAgICB2YXIgcmVzLCBkaWZmO1xuICAgIGlmIChtb2RlbC5faXNVVEMpIHtcbiAgICAgICAgcmVzID0gbW9kZWwuY2xvbmUoKTtcbiAgICAgICAgZGlmZiA9IChpc01vbWVudChpbnB1dCkgfHwgaXNEYXRlKGlucHV0KSA/IGlucHV0LnZhbHVlT2YoKSA6IGNyZWF0ZUxvY2FsKGlucHV0KS52YWx1ZU9mKCkpIC0gcmVzLnZhbHVlT2YoKTtcbiAgICAgICAgLy8gVXNlIGxvdy1sZXZlbCBhcGksIGJlY2F1c2UgdGhpcyBmbiBpcyBsb3ctbGV2ZWwgYXBpLlxuICAgICAgICByZXMuX2Quc2V0VGltZShyZXMuX2QudmFsdWVPZigpICsgZGlmZik7XG4gICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldChyZXMsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWwoaW5wdXQpLmxvY2FsKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXREYXRlT2Zmc2V0IChtKSB7XG4gICAgLy8gT24gRmlyZWZveC4yNCBEYXRlI2dldFRpbWV6b25lT2Zmc2V0IHJldHVybnMgYSBmbG9hdGluZyBwb2ludC5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9wdWxsLzE4NzFcbiAgICByZXR1cm4gLU1hdGgucm91bmQobS5fZC5nZXRUaW1lem9uZU9mZnNldCgpIC8gMTUpICogMTU7XG59XG5cbi8vIEhPT0tTXG5cbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXIgYSBtb21lbnQgaXMgbXV0YXRlZC5cbi8vIEl0IGlzIGludGVuZGVkIHRvIGtlZXAgdGhlIG9mZnNldCBpbiBzeW5jIHdpdGggdGhlIHRpbWV6b25lLlxuaG9va3MudXBkYXRlT2Zmc2V0ID0gZnVuY3Rpb24gKCkge307XG5cbi8vIE1PTUVOVFNcblxuLy8ga2VlcExvY2FsVGltZSA9IHRydWUgbWVhbnMgb25seSBjaGFuZ2UgdGhlIHRpbWV6b25lLCB3aXRob3V0XG4vLyBhZmZlY3RpbmcgdGhlIGxvY2FsIGhvdXIuIFNvIDU6MzE6MjYgKzAzMDAgLS1bdXRjT2Zmc2V0KDIsIHRydWUpXS0tPlxuLy8gNTozMToyNiArMDIwMCBJdCBpcyBwb3NzaWJsZSB0aGF0IDU6MzE6MjYgZG9lc24ndCBleGlzdCB3aXRoIG9mZnNldFxuLy8gKzAyMDAsIHNvIHdlIGFkanVzdCB0aGUgdGltZSBhcyBuZWVkZWQsIHRvIGJlIHZhbGlkLlxuLy9cbi8vIEtlZXBpbmcgdGhlIHRpbWUgYWN0dWFsbHkgYWRkcy9zdWJ0cmFjdHMgKG9uZSBob3VyKVxuLy8gZnJvbSB0aGUgYWN0dWFsIHJlcHJlc2VudGVkIHRpbWUuIFRoYXQgaXMgd2h5IHdlIGNhbGwgdXBkYXRlT2Zmc2V0XG4vLyBhIHNlY29uZCB0aW1lLiBJbiBjYXNlIGl0IHdhbnRzIHVzIHRvIGNoYW5nZSB0aGUgb2Zmc2V0IGFnYWluXG4vLyBfY2hhbmdlSW5Qcm9ncmVzcyA9PSB0cnVlIGNhc2UsIHRoZW4gd2UgaGF2ZSB0byBhZGp1c3QsIGJlY2F1c2Vcbi8vIHRoZXJlIGlzIG5vIHN1Y2ggdGltZSBpbiB0aGUgZ2l2ZW4gdGltZXpvbmUuXG5mdW5jdGlvbiBnZXRTZXRPZmZzZXQgKGlucHV0LCBrZWVwTG9jYWxUaW1lLCBrZWVwTWludXRlcykge1xuICAgIHZhciBvZmZzZXQgPSB0aGlzLl9vZmZzZXQgfHwgMCxcbiAgICAgICAgbG9jYWxBZGp1c3Q7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCA/IHRoaXMgOiBOYU47XG4gICAgfVxuICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IG9mZnNldEZyb21TdHJpbmcobWF0Y2hTaG9ydE9mZnNldCwgaW5wdXQpO1xuICAgICAgICAgICAgaWYgKGlucHV0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoaW5wdXQpIDwgMTYgJiYgIWtlZXBNaW51dGVzKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0ICogNjA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9pc1VUQyAmJiBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICBsb2NhbEFkanVzdCA9IGdldERhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gaW5wdXQ7XG4gICAgICAgIHRoaXMuX2lzVVRDID0gdHJ1ZTtcbiAgICAgICAgaWYgKGxvY2FsQWRqdXN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKGxvY2FsQWRqdXN0LCAnbScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvZmZzZXQgIT09IGlucHV0KSB7XG4gICAgICAgICAgICBpZiAoIWtlZXBMb2NhbFRpbWUgfHwgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgIGFkZFN1YnRyYWN0KHRoaXMsIGNyZWF0ZUR1cmF0aW9uKGlucHV0IC0gb2Zmc2V0LCAnbScpLCAxLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/IG9mZnNldCA6IGdldERhdGVPZmZzZXQodGhpcyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRTZXRab25lIChpbnB1dCwga2VlcExvY2FsVGltZSkge1xuICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IC1pbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXRjT2Zmc2V0KGlucHV0LCBrZWVwTG9jYWxUaW1lKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gLXRoaXMudXRjT2Zmc2V0KCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZXRPZmZzZXRUb1VUQyAoa2VlcExvY2FsVGltZSkge1xuICAgIHJldHVybiB0aGlzLnV0Y09mZnNldCgwLCBrZWVwTG9jYWxUaW1lKTtcbn1cblxuZnVuY3Rpb24gc2V0T2Zmc2V0VG9Mb2NhbCAoa2VlcExvY2FsVGltZSkge1xuICAgIGlmICh0aGlzLl9pc1VUQykge1xuICAgICAgICB0aGlzLnV0Y09mZnNldCgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICAgICAgdGhpcy5faXNVVEMgPSBmYWxzZTtcblxuICAgICAgICBpZiAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgdGhpcy5zdWJ0cmFjdChnZXREYXRlT2Zmc2V0KHRoaXMpLCAnbScpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBzZXRPZmZzZXRUb1BhcnNlZE9mZnNldCAoKSB7XG4gICAgaWYgKHRoaXMuX3R6bSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMudXRjT2Zmc2V0KHRoaXMuX3R6bSwgZmFsc2UsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuX2kgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhciB0Wm9uZSA9IG9mZnNldEZyb21TdHJpbmcobWF0Y2hPZmZzZXQsIHRoaXMuX2kpO1xuICAgICAgICBpZiAodFpvbmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQodFpvbmUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoMCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIGhhc0FsaWduZWRIb3VyT2Zmc2V0IChpbnB1dCkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpbnB1dCA9IGlucHV0ID8gY3JlYXRlTG9jYWwoaW5wdXQpLnV0Y09mZnNldCgpIDogMDtcblxuICAgIHJldHVybiAodGhpcy51dGNPZmZzZXQoKSAtIGlucHV0KSAlIDYwID09PSAwO1xufVxuXG5mdW5jdGlvbiBpc0RheWxpZ2h0U2F2aW5nVGltZSAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy51dGNPZmZzZXQoKSA+IHRoaXMuY2xvbmUoKS5tb250aCgwKS51dGNPZmZzZXQoKSB8fFxuICAgICAgICB0aGlzLnV0Y09mZnNldCgpID4gdGhpcy5jbG9uZSgpLm1vbnRoKDUpLnV0Y09mZnNldCgpXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkICgpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX2lzRFNUU2hpZnRlZCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRFNUU2hpZnRlZDtcbiAgICB9XG5cbiAgICB2YXIgYyA9IHt9O1xuXG4gICAgY29weUNvbmZpZyhjLCB0aGlzKTtcbiAgICBjID0gcHJlcGFyZUNvbmZpZyhjKTtcblxuICAgIGlmIChjLl9hKSB7XG4gICAgICAgIHZhciBvdGhlciA9IGMuX2lzVVRDID8gY3JlYXRlVVRDKGMuX2EpIDogY3JlYXRlTG9jYWwoYy5fYSk7XG4gICAgICAgIHRoaXMuX2lzRFNUU2hpZnRlZCA9IHRoaXMuaXNWYWxpZCgpICYmXG4gICAgICAgICAgICBjb21wYXJlQXJyYXlzKGMuX2EsIG90aGVyLnRvQXJyYXkoKSkgPiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2lzRFNUU2hpZnRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9pc0RTVFNoaWZ0ZWQ7XG59XG5cbmZ1bmN0aW9uIGlzTG9jYWwgKCkge1xuICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/ICF0aGlzLl9pc1VUQyA6IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1V0Y09mZnNldCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy5faXNVVEMgOiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNVdGMgKCkge1xuICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMuX2lzVVRDICYmIHRoaXMuX29mZnNldCA9PT0gMCA6IGZhbHNlO1xufVxuXG4vLyBBU1AuTkVUIGpzb24gZGF0ZSBmb3JtYXQgcmVnZXhcbnZhciBhc3BOZXRSZWdleCA9IC9eKFxcLXxcXCspPyg/OihcXGQqKVsuIF0pPyhcXGQrKVxcOihcXGQrKSg/OlxcOihcXGQrKShcXC5cXGQqKT8pPyQvO1xuXG4vLyBmcm9tIGh0dHA6Ly9kb2NzLmNsb3N1cmUtbGlicmFyeS5nb29nbGVjb2RlLmNvbS9naXQvY2xvc3VyZV9nb29nX2RhdGVfZGF0ZS5qcy5zb3VyY2UuaHRtbFxuLy8gc29tZXdoYXQgbW9yZSBpbiBsaW5lIHdpdGggNC40LjMuMiAyMDA0IHNwZWMsIGJ1dCBhbGxvd3MgZGVjaW1hbCBhbnl3aGVyZVxuLy8gYW5kIGZ1cnRoZXIgbW9kaWZpZWQgdG8gYWxsb3cgZm9yIHN0cmluZ3MgY29udGFpbmluZyBib3RoIHdlZWsgYW5kIGRheVxudmFyIGlzb1JlZ2V4ID0gL14oLXxcXCspP1AoPzooWy0rXT9bMC05LC5dKilZKT8oPzooWy0rXT9bMC05LC5dKilNKT8oPzooWy0rXT9bMC05LC5dKilXKT8oPzooWy0rXT9bMC05LC5dKilEKT8oPzpUKD86KFstK10/WzAtOSwuXSopSCk/KD86KFstK10/WzAtOSwuXSopTSk/KD86KFstK10/WzAtOSwuXSopUyk/KT8kLztcblxuZnVuY3Rpb24gY3JlYXRlRHVyYXRpb24gKGlucHV0LCBrZXkpIHtcbiAgICB2YXIgZHVyYXRpb24gPSBpbnB1dCxcbiAgICAgICAgLy8gbWF0Y2hpbmcgYWdhaW5zdCByZWdleHAgaXMgZXhwZW5zaXZlLCBkbyBpdCBvbiBkZW1hbmRcbiAgICAgICAgbWF0Y2ggPSBudWxsLFxuICAgICAgICBzaWduLFxuICAgICAgICByZXQsXG4gICAgICAgIGRpZmZSZXM7XG5cbiAgICBpZiAoaXNEdXJhdGlvbihpbnB1dCkpIHtcbiAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICBtcyA6IGlucHV0Ll9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICBkICA6IGlucHV0Ll9kYXlzLFxuICAgICAgICAgICAgTSAgOiBpbnB1dC5fbW9udGhzXG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmIChpc051bWJlcihpbnB1dCkpIHtcbiAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgZHVyYXRpb25ba2V5XSA9IGlucHV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZHVyYXRpb24ubWlsbGlzZWNvbmRzID0gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCEhKG1hdGNoID0gYXNwTmV0UmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09ICctJykgPyAtMSA6IDE7XG4gICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgeSAgOiAwLFxuICAgICAgICAgICAgZCAgOiB0b0ludChtYXRjaFtEQVRFXSkgICAgICAgICAgICAgICAgICAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgaCAgOiB0b0ludChtYXRjaFtIT1VSXSkgICAgICAgICAgICAgICAgICAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgbSAgOiB0b0ludChtYXRjaFtNSU5VVEVdKSAgICAgICAgICAgICAgICAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgcyAgOiB0b0ludChtYXRjaFtTRUNPTkRdKSAgICAgICAgICAgICAgICAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgbXMgOiB0b0ludChhYnNSb3VuZChtYXRjaFtNSUxMSVNFQ09ORF0gKiAxMDAwKSkgKiBzaWduIC8vIHRoZSBtaWxsaXNlY29uZCBkZWNpbWFsIHBvaW50IGlzIGluY2x1ZGVkIGluIHRoZSBtYXRjaFxuICAgICAgICB9O1xuICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBpc29SZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogKG1hdGNoWzFdID09PSAnKycpID8gMSA6IDE7XG4gICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgeSA6IHBhcnNlSXNvKG1hdGNoWzJdLCBzaWduKSxcbiAgICAgICAgICAgIE0gOiBwYXJzZUlzbyhtYXRjaFszXSwgc2lnbiksXG4gICAgICAgICAgICB3IDogcGFyc2VJc28obWF0Y2hbNF0sIHNpZ24pLFxuICAgICAgICAgICAgZCA6IHBhcnNlSXNvKG1hdGNoWzVdLCBzaWduKSxcbiAgICAgICAgICAgIGggOiBwYXJzZUlzbyhtYXRjaFs2XSwgc2lnbiksXG4gICAgICAgICAgICBtIDogcGFyc2VJc28obWF0Y2hbN10sIHNpZ24pLFxuICAgICAgICAgICAgcyA6IHBhcnNlSXNvKG1hdGNoWzhdLCBzaWduKVxuICAgICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gPT0gbnVsbCkgey8vIGNoZWNrcyBmb3IgbnVsbCBvciB1bmRlZmluZWRcbiAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ29iamVjdCcgJiYgKCdmcm9tJyBpbiBkdXJhdGlvbiB8fCAndG8nIGluIGR1cmF0aW9uKSkge1xuICAgICAgICBkaWZmUmVzID0gbW9tZW50c0RpZmZlcmVuY2UoY3JlYXRlTG9jYWwoZHVyYXRpb24uZnJvbSksIGNyZWF0ZUxvY2FsKGR1cmF0aW9uLnRvKSk7XG5cbiAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgZHVyYXRpb24ubXMgPSBkaWZmUmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgZHVyYXRpb24uTSA9IGRpZmZSZXMubW9udGhzO1xuICAgIH1cblxuICAgIHJldCA9IG5ldyBEdXJhdGlvbihkdXJhdGlvbik7XG5cbiAgICBpZiAoaXNEdXJhdGlvbihpbnB1dCkgJiYgaGFzT3duUHJvcChpbnB1dCwgJ19sb2NhbGUnKSkge1xuICAgICAgICByZXQuX2xvY2FsZSA9IGlucHV0Ll9sb2NhbGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn1cblxuY3JlYXRlRHVyYXRpb24uZm4gPSBEdXJhdGlvbi5wcm90b3R5cGU7XG5jcmVhdGVEdXJhdGlvbi5pbnZhbGlkID0gY3JlYXRlSW52YWxpZCQxO1xuXG5mdW5jdGlvbiBwYXJzZUlzbyAoaW5wLCBzaWduKSB7XG4gICAgLy8gV2UnZCBub3JtYWxseSB1c2Ugfn5pbnAgZm9yIHRoaXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IGl0IGFsc29cbiAgICAvLyBjb252ZXJ0cyBmbG9hdHMgdG8gaW50cy5cbiAgICAvLyBpbnAgbWF5IGJlIHVuZGVmaW5lZCwgc28gY2FyZWZ1bCBjYWxsaW5nIHJlcGxhY2Ugb24gaXQuXG4gICAgdmFyIHJlcyA9IGlucCAmJiBwYXJzZUZsb2F0KGlucC5yZXBsYWNlKCcsJywgJy4nKSk7XG4gICAgLy8gYXBwbHkgc2lnbiB3aGlsZSB3ZSdyZSBhdCBpdFxuICAgIHJldHVybiAoaXNOYU4ocmVzKSA/IDAgOiByZXMpICogc2lnbjtcbn1cblxuZnVuY3Rpb24gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcikge1xuICAgIHZhciByZXMgPSB7bWlsbGlzZWNvbmRzOiAwLCBtb250aHM6IDB9O1xuXG4gICAgcmVzLm1vbnRocyA9IG90aGVyLm1vbnRoKCkgLSBiYXNlLm1vbnRoKCkgK1xuICAgICAgICAob3RoZXIueWVhcigpIC0gYmFzZS55ZWFyKCkpICogMTI7XG4gICAgaWYgKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKS5pc0FmdGVyKG90aGVyKSkge1xuICAgICAgICAtLXJlcy5tb250aHM7XG4gICAgfVxuXG4gICAgcmVzLm1pbGxpc2Vjb25kcyA9ICtvdGhlciAtICsoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpKTtcblxuICAgIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIG1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgdmFyIHJlcztcbiAgICBpZiAoIShiYXNlLmlzVmFsaWQoKSAmJiBvdGhlci5pc1ZhbGlkKCkpKSB7XG4gICAgICAgIHJldHVybiB7bWlsbGlzZWNvbmRzOiAwLCBtb250aHM6IDB9O1xuICAgIH1cblxuICAgIG90aGVyID0gY2xvbmVXaXRoT2Zmc2V0KG90aGVyLCBiYXNlKTtcbiAgICBpZiAoYmFzZS5pc0JlZm9yZShvdGhlcikpIHtcbiAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShvdGhlciwgYmFzZSk7XG4gICAgICAgIHJlcy5taWxsaXNlY29uZHMgPSAtcmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgcmVzLm1vbnRocyA9IC1yZXMubW9udGhzO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFRPRE86IHJlbW92ZSAnbmFtZScgYXJnIGFmdGVyIGRlcHJlY2F0aW9uIGlzIHJlbW92ZWRcbmZ1bmN0aW9uIGNyZWF0ZUFkZGVyKGRpcmVjdGlvbiwgbmFtZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAodmFsLCBwZXJpb2QpIHtcbiAgICAgICAgdmFyIGR1ciwgdG1wO1xuICAgICAgICAvL2ludmVydCB0aGUgYXJndW1lbnRzLCBidXQgY29tcGxhaW4gYWJvdXQgaXRcbiAgICAgICAgaWYgKHBlcmlvZCAhPT0gbnVsbCAmJiAhaXNOYU4oK3BlcmlvZCkpIHtcbiAgICAgICAgICAgIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCAnbW9tZW50KCkuJyArIG5hbWUgICsgJyhwZXJpb2QsIG51bWJlcikgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBtb21lbnQoKS4nICsgbmFtZSArICcobnVtYmVyLCBwZXJpb2QpLiAnICtcbiAgICAgICAgICAgICdTZWUgaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9hZGQtaW52ZXJ0ZWQtcGFyYW0vIGZvciBtb3JlIGluZm8uJyk7XG4gICAgICAgICAgICB0bXAgPSB2YWw7IHZhbCA9IHBlcmlvZDsgcGVyaW9kID0gdG1wO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFsID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyArdmFsIDogdmFsO1xuICAgICAgICBkdXIgPSBjcmVhdGVEdXJhdGlvbih2YWwsIHBlcmlvZCk7XG4gICAgICAgIGFkZFN1YnRyYWN0KHRoaXMsIGR1ciwgZGlyZWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYWRkU3VidHJhY3QgKG1vbSwgZHVyYXRpb24sIGlzQWRkaW5nLCB1cGRhdGVPZmZzZXQpIHtcbiAgICB2YXIgbWlsbGlzZWNvbmRzID0gZHVyYXRpb24uX21pbGxpc2Vjb25kcyxcbiAgICAgICAgZGF5cyA9IGFic1JvdW5kKGR1cmF0aW9uLl9kYXlzKSxcbiAgICAgICAgbW9udGhzID0gYWJzUm91bmQoZHVyYXRpb24uX21vbnRocyk7XG5cbiAgICBpZiAoIW1vbS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgLy8gTm8gb3BcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHVwZGF0ZU9mZnNldCA9IHVwZGF0ZU9mZnNldCA9PSBudWxsID8gdHJ1ZSA6IHVwZGF0ZU9mZnNldDtcblxuICAgIGlmIChtb250aHMpIHtcbiAgICAgICAgc2V0TW9udGgobW9tLCBnZXQobW9tLCAnTW9udGgnKSArIG1vbnRocyAqIGlzQWRkaW5nKTtcbiAgICB9XG4gICAgaWYgKGRheXMpIHtcbiAgICAgICAgc2V0JDEobW9tLCAnRGF0ZScsIGdldChtb20sICdEYXRlJykgKyBkYXlzICogaXNBZGRpbmcpO1xuICAgIH1cbiAgICBpZiAobWlsbGlzZWNvbmRzKSB7XG4gICAgICAgIG1vbS5fZC5zZXRUaW1lKG1vbS5fZC52YWx1ZU9mKCkgKyBtaWxsaXNlY29uZHMgKiBpc0FkZGluZyk7XG4gICAgfVxuICAgIGlmICh1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KG1vbSwgZGF5cyB8fCBtb250aHMpO1xuICAgIH1cbn1cblxudmFyIGFkZCAgICAgID0gY3JlYXRlQWRkZXIoMSwgJ2FkZCcpO1xudmFyIHN1YnRyYWN0ID0gY3JlYXRlQWRkZXIoLTEsICdzdWJ0cmFjdCcpO1xuXG5mdW5jdGlvbiBnZXRDYWxlbmRhckZvcm1hdChteU1vbWVudCwgbm93KSB7XG4gICAgdmFyIGRpZmYgPSBteU1vbWVudC5kaWZmKG5vdywgJ2RheXMnLCB0cnVlKTtcbiAgICByZXR1cm4gZGlmZiA8IC02ID8gJ3NhbWVFbHNlJyA6XG4gICAgICAgICAgICBkaWZmIDwgLTEgPyAnbGFzdFdlZWsnIDpcbiAgICAgICAgICAgIGRpZmYgPCAwID8gJ2xhc3REYXknIDpcbiAgICAgICAgICAgIGRpZmYgPCAxID8gJ3NhbWVEYXknIDpcbiAgICAgICAgICAgIGRpZmYgPCAyID8gJ25leHREYXknIDpcbiAgICAgICAgICAgIGRpZmYgPCA3ID8gJ25leHRXZWVrJyA6ICdzYW1lRWxzZSc7XG59XG5cbmZ1bmN0aW9uIGNhbGVuZGFyJDEgKHRpbWUsIGZvcm1hdHMpIHtcbiAgICAvLyBXZSB3YW50IHRvIGNvbXBhcmUgdGhlIHN0YXJ0IG9mIHRvZGF5LCB2cyB0aGlzLlxuICAgIC8vIEdldHRpbmcgc3RhcnQtb2YtdG9kYXkgZGVwZW5kcyBvbiB3aGV0aGVyIHdlJ3JlIGxvY2FsL3V0Yy9vZmZzZXQgb3Igbm90LlxuICAgIHZhciBub3cgPSB0aW1lIHx8IGNyZWF0ZUxvY2FsKCksXG4gICAgICAgIHNvZCA9IGNsb25lV2l0aE9mZnNldChub3csIHRoaXMpLnN0YXJ0T2YoJ2RheScpLFxuICAgICAgICBmb3JtYXQgPSBob29rcy5jYWxlbmRhckZvcm1hdCh0aGlzLCBzb2QpIHx8ICdzYW1lRWxzZSc7XG5cbiAgICB2YXIgb3V0cHV0ID0gZm9ybWF0cyAmJiAoaXNGdW5jdGlvbihmb3JtYXRzW2Zvcm1hdF0pID8gZm9ybWF0c1tmb3JtYXRdLmNhbGwodGhpcywgbm93KSA6IGZvcm1hdHNbZm9ybWF0XSk7XG5cbiAgICByZXR1cm4gdGhpcy5mb3JtYXQob3V0cHV0IHx8IHRoaXMubG9jYWxlRGF0YSgpLmNhbGVuZGFyKGZvcm1hdCwgdGhpcywgY3JlYXRlTG9jYWwobm93KSkpO1xufVxuXG5mdW5jdGlvbiBjbG9uZSAoKSB7XG4gICAgcmV0dXJuIG5ldyBNb21lbnQodGhpcyk7XG59XG5cbmZ1bmN0aW9uIGlzQWZ0ZXIgKGlucHV0LCB1bml0cykge1xuICAgIHZhciBsb2NhbElucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBjcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgaWYgKCEodGhpcy5pc1ZhbGlkKCkgJiYgbG9jYWxJbnB1dC5pc1ZhbGlkKCkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyghaXNVbmRlZmluZWQodW5pdHMpID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVPZigpID4gbG9jYWxJbnB1dC52YWx1ZU9mKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsSW5wdXQudmFsdWVPZigpIDwgdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpLnZhbHVlT2YoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzQmVmb3JlIChpbnB1dCwgdW5pdHMpIHtcbiAgICB2YXIgbG9jYWxJbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgIGlmICghKHRoaXMuaXNWYWxpZCgpICYmIGxvY2FsSW5wdXQuaXNWYWxpZCgpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHMoIWlzVW5kZWZpbmVkKHVuaXRzKSA/IHVuaXRzIDogJ21pbGxpc2Vjb25kJyk7XG4gICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKSA8IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpLnZhbHVlT2YoKSA8IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNCZXR3ZWVuIChmcm9tLCB0bywgdW5pdHMsIGluY2x1c2l2aXR5KSB7XG4gICAgaW5jbHVzaXZpdHkgPSBpbmNsdXNpdml0eSB8fCAnKCknO1xuICAgIHJldHVybiAoaW5jbHVzaXZpdHlbMF0gPT09ICcoJyA/IHRoaXMuaXNBZnRlcihmcm9tLCB1bml0cykgOiAhdGhpcy5pc0JlZm9yZShmcm9tLCB1bml0cykpICYmXG4gICAgICAgIChpbmNsdXNpdml0eVsxXSA9PT0gJyknID8gdGhpcy5pc0JlZm9yZSh0bywgdW5pdHMpIDogIXRoaXMuaXNBZnRlcih0bywgdW5pdHMpKTtcbn1cblxuZnVuY3Rpb24gaXNTYW1lIChpbnB1dCwgdW5pdHMpIHtcbiAgICB2YXIgbG9jYWxJbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogY3JlYXRlTG9jYWwoaW5wdXQpLFxuICAgICAgICBpbnB1dE1zO1xuICAgIGlmICghKHRoaXMuaXNWYWxpZCgpICYmIGxvY2FsSW5wdXQuaXNWYWxpZCgpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMgfHwgJ21pbGxpc2Vjb25kJyk7XG4gICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKSA9PT0gbG9jYWxJbnB1dC52YWx1ZU9mKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRNcyA9IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpLnZhbHVlT2YoKSA8PSBpbnB1dE1zICYmIGlucHV0TXMgPD0gdGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKS52YWx1ZU9mKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc1NhbWVPckFmdGVyIChpbnB1dCwgdW5pdHMpIHtcbiAgICByZXR1cm4gdGhpcy5pc1NhbWUoaW5wdXQsIHVuaXRzKSB8fCB0aGlzLmlzQWZ0ZXIoaW5wdXQsdW5pdHMpO1xufVxuXG5mdW5jdGlvbiBpc1NhbWVPckJlZm9yZSAoaW5wdXQsIHVuaXRzKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNTYW1lKGlucHV0LCB1bml0cykgfHwgdGhpcy5pc0JlZm9yZShpbnB1dCx1bml0cyk7XG59XG5cbmZ1bmN0aW9uIGRpZmYgKGlucHV0LCB1bml0cywgYXNGbG9hdCkge1xuICAgIHZhciB0aGF0LFxuICAgICAgICB6b25lRGVsdGEsXG4gICAgICAgIG91dHB1dDtcblxuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIE5hTjtcbiAgICB9XG5cbiAgICB0aGF0ID0gY2xvbmVXaXRoT2Zmc2V0KGlucHV0LCB0aGlzKTtcblxuICAgIGlmICghdGhhdC5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIE5hTjtcbiAgICB9XG5cbiAgICB6b25lRGVsdGEgPSAodGhhdC51dGNPZmZzZXQoKSAtIHRoaXMudXRjT2Zmc2V0KCkpICogNmU0O1xuXG4gICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgIGNhc2UgJ3llYXInOiBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCkgLyAxMjsgYnJlYWs7XG4gICAgICAgIGNhc2UgJ21vbnRoJzogb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpOyBicmVhaztcbiAgICAgICAgY2FzZSAncXVhcnRlcic6IG91dHB1dCA9IG1vbnRoRGlmZih0aGlzLCB0aGF0KSAvIDM7IGJyZWFrO1xuICAgICAgICBjYXNlICdzZWNvbmQnOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQpIC8gMWUzOyBicmVhazsgLy8gMTAwMFxuICAgICAgICBjYXNlICdtaW51dGUnOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQpIC8gNmU0OyBicmVhazsgLy8gMTAwMCAqIDYwXG4gICAgICAgIGNhc2UgJ2hvdXInOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQpIC8gMzZlNTsgYnJlYWs7IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgIGNhc2UgJ2RheSc6IG91dHB1dCA9ICh0aGlzIC0gdGhhdCAtIHpvbmVEZWx0YSkgLyA4NjRlNTsgYnJlYWs7IC8vIDEwMDAgKiA2MCAqIDYwICogMjQsIG5lZ2F0ZSBkc3RcbiAgICAgICAgY2FzZSAnd2Vlayc6IG91dHB1dCA9ICh0aGlzIC0gdGhhdCAtIHpvbmVEZWx0YSkgLyA2MDQ4ZTU7IGJyZWFrOyAvLyAxMDAwICogNjAgKiA2MCAqIDI0ICogNywgbmVnYXRlIGRzdFxuICAgICAgICBkZWZhdWx0OiBvdXRwdXQgPSB0aGlzIC0gdGhhdDtcbiAgICB9XG5cbiAgICByZXR1cm4gYXNGbG9hdCA/IG91dHB1dCA6IGFic0Zsb29yKG91dHB1dCk7XG59XG5cbmZ1bmN0aW9uIG1vbnRoRGlmZiAoYSwgYikge1xuICAgIC8vIGRpZmZlcmVuY2UgaW4gbW9udGhzXG4gICAgdmFyIHdob2xlTW9udGhEaWZmID0gKChiLnllYXIoKSAtIGEueWVhcigpKSAqIDEyKSArIChiLm1vbnRoKCkgLSBhLm1vbnRoKCkpLFxuICAgICAgICAvLyBiIGlzIGluIChhbmNob3IgLSAxIG1vbnRoLCBhbmNob3IgKyAxIG1vbnRoKVxuICAgICAgICBhbmNob3IgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmLCAnbW9udGhzJyksXG4gICAgICAgIGFuY2hvcjIsIGFkanVzdDtcblxuICAgIGlmIChiIC0gYW5jaG9yIDwgMCkge1xuICAgICAgICBhbmNob3IyID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiAtIDEsICdtb250aHMnKTtcbiAgICAgICAgLy8gbGluZWFyIGFjcm9zcyB0aGUgbW9udGhcbiAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvciAtIGFuY2hvcjIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGFuY2hvcjIgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmICsgMSwgJ21vbnRocycpO1xuICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICBhZGp1c3QgPSAoYiAtIGFuY2hvcikgLyAoYW5jaG9yMiAtIGFuY2hvcik7XG4gICAgfVxuXG4gICAgLy9jaGVjayBmb3IgbmVnYXRpdmUgemVybywgcmV0dXJuIHplcm8gaWYgbmVnYXRpdmUgemVyb1xuICAgIHJldHVybiAtKHdob2xlTW9udGhEaWZmICsgYWRqdXN0KSB8fCAwO1xufVxuXG5ob29rcy5kZWZhdWx0Rm9ybWF0ID0gJ1lZWVktTU0tRERUSEg6bW06c3NaJztcbmhvb2tzLmRlZmF1bHRGb3JtYXRVdGMgPSAnWVlZWS1NTS1ERFRISDptbTpzc1taXSc7XG5cbmZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvY2FsZSgnZW4nKS5mb3JtYXQoJ2RkZCBNTU0gREQgWVlZWSBISDptbTpzcyBbR01UXVpaJyk7XG59XG5cbmZ1bmN0aW9uIHRvSVNPU3RyaW5nKGtlZXBPZmZzZXQpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgdXRjID0ga2VlcE9mZnNldCAhPT0gdHJ1ZTtcbiAgICB2YXIgbSA9IHV0YyA/IHRoaXMuY2xvbmUoKS51dGMoKSA6IHRoaXM7XG4gICAgaWYgKG0ueWVhcigpIDwgMCB8fCBtLnllYXIoKSA+IDk5OTkpIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCB1dGMgPyAnWVlZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyA6ICdZWVlZWVktTU0tRERbVF1ISDptbTpzcy5TU1NaJyk7XG4gICAgfVxuICAgIGlmIChpc0Z1bmN0aW9uKERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nKSkge1xuICAgICAgICAvLyBuYXRpdmUgaW1wbGVtZW50YXRpb24gaXMgfjUweCBmYXN0ZXIsIHVzZSBpdCB3aGVuIHdlIGNhblxuICAgICAgICBpZiAodXRjKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b0RhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMudmFsdWVPZigpICsgdGhpcy51dGNPZmZzZXQoKSAqIDYwICogMTAwMCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKCdaJywgZm9ybWF0TW9tZW50KG0sICdaJykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgdXRjID8gJ1lZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nIDogJ1lZWVktTU0tRERbVF1ISDptbTpzcy5TU1NaJyk7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgcmVwcmVzZW50YXRpb24gb2YgYSBtb21lbnQgdGhhdCBjYW5cbiAqIGFsc28gYmUgZXZhbHVhdGVkIHRvIGdldCBhIG5ldyBtb21lbnQgd2hpY2ggaXMgdGhlIHNhbWVcbiAqXG4gKiBAbGluayBodHRwczovL25vZGVqcy5vcmcvZGlzdC9sYXRlc3QvZG9jcy9hcGkvdXRpbC5odG1sI3V0aWxfY3VzdG9tX2luc3BlY3RfZnVuY3Rpb25fb25fb2JqZWN0c1xuICovXG5mdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiAnbW9tZW50LmludmFsaWQoLyogJyArIHRoaXMuX2kgKyAnICovKSc7XG4gICAgfVxuICAgIHZhciBmdW5jID0gJ21vbWVudCc7XG4gICAgdmFyIHpvbmUgPSAnJztcbiAgICBpZiAoIXRoaXMuaXNMb2NhbCgpKSB7XG4gICAgICAgIGZ1bmMgPSB0aGlzLnV0Y09mZnNldCgpID09PSAwID8gJ21vbWVudC51dGMnIDogJ21vbWVudC5wYXJzZVpvbmUnO1xuICAgICAgICB6b25lID0gJ1onO1xuICAgIH1cbiAgICB2YXIgcHJlZml4ID0gJ1snICsgZnVuYyArICcoXCJdJztcbiAgICB2YXIgeWVhciA9ICgwIDw9IHRoaXMueWVhcigpICYmIHRoaXMueWVhcigpIDw9IDk5OTkpID8gJ1lZWVknIDogJ1lZWVlZWSc7XG4gICAgdmFyIGRhdGV0aW1lID0gJy1NTS1ERFtUXUhIOm1tOnNzLlNTUyc7XG4gICAgdmFyIHN1ZmZpeCA9IHpvbmUgKyAnW1wiKV0nO1xuXG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0KHByZWZpeCArIHllYXIgKyBkYXRldGltZSArIHN1ZmZpeCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdCAoaW5wdXRTdHJpbmcpIHtcbiAgICBpZiAoIWlucHV0U3RyaW5nKSB7XG4gICAgICAgIGlucHV0U3RyaW5nID0gdGhpcy5pc1V0YygpID8gaG9va3MuZGVmYXVsdEZvcm1hdFV0YyA6IGhvb2tzLmRlZmF1bHRGb3JtYXQ7XG4gICAgfVxuICAgIHZhciBvdXRwdXQgPSBmb3JtYXRNb21lbnQodGhpcywgaW5wdXRTdHJpbmcpO1xuICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5wb3N0Zm9ybWF0KG91dHB1dCk7XG59XG5cbmZ1bmN0aW9uIGZyb20gKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICBpZiAodGhpcy5pc1ZhbGlkKCkgJiZcbiAgICAgICAgICAgICgoaXNNb21lbnQodGltZSkgJiYgdGltZS5pc1ZhbGlkKCkpIHx8XG4gICAgICAgICAgICAgY3JlYXRlTG9jYWwodGltZSkuaXNWYWxpZCgpKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24oe3RvOiB0aGlzLCBmcm9tOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZyb21Ob3cgKHdpdGhvdXRTdWZmaXgpIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tKGNyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xufVxuXG5mdW5jdGlvbiB0byAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgIGlmICh0aGlzLmlzVmFsaWQoKSAmJlxuICAgICAgICAgICAgKChpc01vbWVudCh0aW1lKSAmJiB0aW1lLmlzVmFsaWQoKSkgfHxcbiAgICAgICAgICAgICBjcmVhdGVMb2NhbCh0aW1lKS5pc1ZhbGlkKCkpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVEdXJhdGlvbih7ZnJvbTogdGhpcywgdG86IHRpbWV9KS5sb2NhbGUodGhpcy5sb2NhbGUoKSkuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdG9Ob3cgKHdpdGhvdXRTdWZmaXgpIHtcbiAgICByZXR1cm4gdGhpcy50byhjcmVhdGVMb2NhbCgpLCB3aXRob3V0U3VmZml4KTtcbn1cblxuLy8gSWYgcGFzc2VkIGEgbG9jYWxlIGtleSwgaXQgd2lsbCBzZXQgdGhlIGxvY2FsZSBmb3IgdGhpc1xuLy8gaW5zdGFuY2UuICBPdGhlcndpc2UsIGl0IHdpbGwgcmV0dXJuIHRoZSBsb2NhbGUgY29uZmlndXJhdGlvblxuLy8gdmFyaWFibGVzIGZvciB0aGlzIGluc3RhbmNlLlxuZnVuY3Rpb24gbG9jYWxlIChrZXkpIHtcbiAgICB2YXIgbmV3TG9jYWxlRGF0YTtcblxuICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlLl9hYmJyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0xvY2FsZURhdGEgPSBnZXRMb2NhbGUoa2V5KTtcbiAgICAgICAgaWYgKG5ld0xvY2FsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gbmV3TG9jYWxlRGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbnZhciBsYW5nID0gZGVwcmVjYXRlKFxuICAgICdtb21lbnQoKS5sYW5nKCkgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCwgdXNlIG1vbWVudCgpLmxvY2FsZURhdGEoKSB0byBnZXQgdGhlIGxhbmd1YWdlIGNvbmZpZ3VyYXRpb24uIFVzZSBtb21lbnQoKS5sb2NhbGUoKSB0byBjaGFuZ2UgbGFuZ3VhZ2VzLicsXG4gICAgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZShrZXkpO1xuICAgICAgICB9XG4gICAgfVxuKTtcblxuZnVuY3Rpb24gbG9jYWxlRGF0YSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbn1cblxuZnVuY3Rpb24gc3RhcnRPZiAodW5pdHMpIHtcbiAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAvLyB0aGUgZm9sbG93aW5nIHN3aXRjaCBpbnRlbnRpb25hbGx5IG9taXRzIGJyZWFrIGtleXdvcmRzXG4gICAgLy8gdG8gdXRpbGl6ZSBmYWxsaW5nIHRocm91Z2ggdGhlIGNhc2VzLlxuICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgICAgICB0aGlzLm1vbnRoKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgdGhpcy5kYXRlKDEpO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgY2FzZSAnaXNvV2Vlayc6XG4gICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgICAgdGhpcy5ob3VycygwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICB0aGlzLm1pbnV0ZXMoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgICAgICAgICB0aGlzLnNlY29uZHMoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgICB0aGlzLm1pbGxpc2Vjb25kcygwKTtcbiAgICB9XG5cbiAgICAvLyB3ZWVrcyBhcmUgYSBzcGVjaWFsIGNhc2VcbiAgICBpZiAodW5pdHMgPT09ICd3ZWVrJykge1xuICAgICAgICB0aGlzLndlZWtkYXkoMCk7XG4gICAgfVxuICAgIGlmICh1bml0cyA9PT0gJ2lzb1dlZWsnKSB7XG4gICAgICAgIHRoaXMuaXNvV2Vla2RheSgxKTtcbiAgICB9XG5cbiAgICAvLyBxdWFydGVycyBhcmUgYWxzbyBzcGVjaWFsXG4gICAgaWYgKHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgdGhpcy5tb250aChNYXRoLmZsb29yKHRoaXMubW9udGgoKSAvIDMpICogMyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIGVuZE9mICh1bml0cykge1xuICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgIGlmICh1bml0cyA9PT0gdW5kZWZpbmVkIHx8IHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vICdkYXRlJyBpcyBhbiBhbGlhcyBmb3IgJ2RheScsIHNvIGl0IHNob3VsZCBiZSBjb25zaWRlcmVkIGFzIHN1Y2guXG4gICAgaWYgKHVuaXRzID09PSAnZGF0ZScpIHtcbiAgICAgICAgdW5pdHMgPSAnZGF5JztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGFydE9mKHVuaXRzKS5hZGQoMSwgKHVuaXRzID09PSAnaXNvV2VlaycgPyAnd2VlaycgOiB1bml0cykpLnN1YnRyYWN0KDEsICdtcycpO1xufVxuXG5mdW5jdGlvbiB2YWx1ZU9mICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZC52YWx1ZU9mKCkgLSAoKHRoaXMuX29mZnNldCB8fCAwKSAqIDYwMDAwKTtcbn1cblxuZnVuY3Rpb24gdW5peCAoKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy52YWx1ZU9mKCkgLyAxMDAwKTtcbn1cblxuZnVuY3Rpb24gdG9EYXRlICgpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodGhpcy52YWx1ZU9mKCkpO1xufVxuXG5mdW5jdGlvbiB0b0FycmF5ICgpIHtcbiAgICB2YXIgbSA9IHRoaXM7XG4gICAgcmV0dXJuIFttLnllYXIoKSwgbS5tb250aCgpLCBtLmRhdGUoKSwgbS5ob3VyKCksIG0ubWludXRlKCksIG0uc2Vjb25kKCksIG0ubWlsbGlzZWNvbmQoKV07XG59XG5cbmZ1bmN0aW9uIHRvT2JqZWN0ICgpIHtcbiAgICB2YXIgbSA9IHRoaXM7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgeWVhcnM6IG0ueWVhcigpLFxuICAgICAgICBtb250aHM6IG0ubW9udGgoKSxcbiAgICAgICAgZGF0ZTogbS5kYXRlKCksXG4gICAgICAgIGhvdXJzOiBtLmhvdXJzKCksXG4gICAgICAgIG1pbnV0ZXM6IG0ubWludXRlcygpLFxuICAgICAgICBzZWNvbmRzOiBtLnNlY29uZHMoKSxcbiAgICAgICAgbWlsbGlzZWNvbmRzOiBtLm1pbGxpc2Vjb25kcygpXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgICAvLyBuZXcgRGF0ZShOYU4pLnRvSlNPTigpID09PSBudWxsXG4gICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy50b0lTT1N0cmluZygpIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZCQyICgpIHtcbiAgICByZXR1cm4gaXNWYWxpZCh0aGlzKTtcbn1cblxuZnVuY3Rpb24gcGFyc2luZ0ZsYWdzICgpIHtcbiAgICByZXR1cm4gZXh0ZW5kKHt9LCBnZXRQYXJzaW5nRmxhZ3ModGhpcykpO1xufVxuXG5mdW5jdGlvbiBpbnZhbGlkQXQgKCkge1xuICAgIHJldHVybiBnZXRQYXJzaW5nRmxhZ3ModGhpcykub3ZlcmZsb3c7XG59XG5cbmZ1bmN0aW9uIGNyZWF0aW9uRGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpbnB1dDogdGhpcy5faSxcbiAgICAgICAgZm9ybWF0OiB0aGlzLl9mLFxuICAgICAgICBsb2NhbGU6IHRoaXMuX2xvY2FsZSxcbiAgICAgICAgaXNVVEM6IHRoaXMuX2lzVVRDLFxuICAgICAgICBzdHJpY3Q6IHRoaXMuX3N0cmljdFxuICAgIH07XG59XG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oMCwgWydnZycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMud2Vla1llYXIoKSAlIDEwMDtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbigwLCBbJ0dHJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pc29XZWVrWWVhcigpICUgMTAwO1xufSk7XG5cbmZ1bmN0aW9uIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4gKHRva2VuLCBnZXR0ZXIpIHtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbdG9rZW4sIHRva2VuLmxlbmd0aF0sIDAsIGdldHRlcik7XG59XG5cbmFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2cnLCAgICAgJ3dlZWtZZWFyJyk7XG5hZGRXZWVrWWVhckZvcm1hdFRva2VuKCdnZ2dnZycsICAgICd3ZWVrWWVhcicpO1xuYWRkV2Vla1llYXJGb3JtYXRUb2tlbignR0dHRycsICAnaXNvV2Vla1llYXInKTtcbmFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ0dHR0dHJywgJ2lzb1dlZWtZZWFyJyk7XG5cbi8vIEFMSUFTRVNcblxuYWRkVW5pdEFsaWFzKCd3ZWVrWWVhcicsICdnZycpO1xuYWRkVW5pdEFsaWFzKCdpc29XZWVrWWVhcicsICdHRycpO1xuXG4vLyBQUklPUklUWVxuXG5hZGRVbml0UHJpb3JpdHkoJ3dlZWtZZWFyJywgMSk7XG5hZGRVbml0UHJpb3JpdHkoJ2lzb1dlZWtZZWFyJywgMSk7XG5cblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCdHJywgICAgICBtYXRjaFNpZ25lZCk7XG5hZGRSZWdleFRva2VuKCdnJywgICAgICBtYXRjaFNpZ25lZCk7XG5hZGRSZWdleFRva2VuKCdHRycsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG5hZGRSZWdleFRva2VuKCdnZycsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG5hZGRSZWdleFRva2VuKCdHR0dHJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG5hZGRSZWdleFRva2VuKCdnZ2dnJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG5hZGRSZWdleFRva2VuKCdHR0dHRycsICBtYXRjaDF0bzYsIG1hdGNoNik7XG5hZGRSZWdleFRva2VuKCdnZ2dnZycsICBtYXRjaDF0bzYsIG1hdGNoNik7XG5cbmFkZFdlZWtQYXJzZVRva2VuKFsnZ2dnZycsICdnZ2dnZycsICdHR0dHJywgJ0dHR0dHJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgIHdlZWtbdG9rZW4uc3Vic3RyKDAsIDIpXSA9IHRvSW50KGlucHV0KTtcbn0pO1xuXG5hZGRXZWVrUGFyc2VUb2tlbihbJ2dnJywgJ0dHJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgIHdlZWtbdG9rZW5dID0gaG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xufSk7XG5cbi8vIE1PTUVOVFNcblxuZnVuY3Rpb24gZ2V0U2V0V2Vla1llYXIgKGlucHV0KSB7XG4gICAgcmV0dXJuIGdldFNldFdlZWtZZWFySGVscGVyLmNhbGwodGhpcyxcbiAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgdGhpcy53ZWVrKCksXG4gICAgICAgICAgICB0aGlzLndlZWtkYXkoKSxcbiAgICAgICAgICAgIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdyxcbiAgICAgICAgICAgIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRveSk7XG59XG5cbmZ1bmN0aW9uIGdldFNldElTT1dlZWtZZWFyIChpbnB1dCkge1xuICAgIHJldHVybiBnZXRTZXRXZWVrWWVhckhlbHBlci5jYWxsKHRoaXMsXG4gICAgICAgICAgICBpbnB1dCwgdGhpcy5pc29XZWVrKCksIHRoaXMuaXNvV2Vla2RheSgpLCAxLCA0KTtcbn1cblxuZnVuY3Rpb24gZ2V0SVNPV2Vla3NJblllYXIgKCkge1xuICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgMSwgNCk7XG59XG5cbmZ1bmN0aW9uIGdldFdlZWtzSW5ZZWFyICgpIHtcbiAgICB2YXIgd2Vla0luZm8gPSB0aGlzLmxvY2FsZURhdGEoKS5fd2VlaztcbiAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIHdlZWtJbmZvLmRvdywgd2Vla0luZm8uZG95KTtcbn1cblxuZnVuY3Rpb24gZ2V0U2V0V2Vla1llYXJIZWxwZXIoaW5wdXQsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KSB7XG4gICAgdmFyIHdlZWtzVGFyZ2V0O1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKHRoaXMsIGRvdywgZG95KS55ZWFyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdlZWtzVGFyZ2V0ID0gd2Vla3NJblllYXIoaW5wdXQsIGRvdywgZG95KTtcbiAgICAgICAgaWYgKHdlZWsgPiB3ZWVrc1RhcmdldCkge1xuICAgICAgICAgICAgd2VlayA9IHdlZWtzVGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXRXZWVrQWxsLmNhbGwodGhpcywgaW5wdXQsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldFdlZWtBbGwod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KSB7XG4gICAgdmFyIGRheU9mWWVhckRhdGEgPSBkYXlPZlllYXJGcm9tV2Vla3Mod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KSxcbiAgICAgICAgZGF0ZSA9IGNyZWF0ZVVUQ0RhdGUoZGF5T2ZZZWFyRGF0YS55ZWFyLCAwLCBkYXlPZlllYXJEYXRhLmRheU9mWWVhcik7XG5cbiAgICB0aGlzLnllYXIoZGF0ZS5nZXRVVENGdWxsWWVhcigpKTtcbiAgICB0aGlzLm1vbnRoKGRhdGUuZ2V0VVRDTW9udGgoKSk7XG4gICAgdGhpcy5kYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpKTtcbiAgICByZXR1cm4gdGhpcztcbn1cblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbignUScsIDAsICdRbycsICdxdWFydGVyJyk7XG5cbi8vIEFMSUFTRVNcblxuYWRkVW5pdEFsaWFzKCdxdWFydGVyJywgJ1EnKTtcblxuLy8gUFJJT1JJVFlcblxuYWRkVW5pdFByaW9yaXR5KCdxdWFydGVyJywgNyk7XG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbignUScsIG1hdGNoMSk7XG5hZGRQYXJzZVRva2VuKCdRJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgIGFycmF5W01PTlRIXSA9ICh0b0ludChpbnB1dCkgLSAxKSAqIDM7XG59KTtcblxuLy8gTU9NRU5UU1xuXG5mdW5jdGlvbiBnZXRTZXRRdWFydGVyIChpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gTWF0aC5jZWlsKCh0aGlzLm1vbnRoKCkgKyAxKSAvIDMpIDogdGhpcy5tb250aCgoaW5wdXQgLSAxKSAqIDMgKyB0aGlzLm1vbnRoKCkgJSAzKTtcbn1cblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbignRCcsIFsnREQnLCAyXSwgJ0RvJywgJ2RhdGUnKTtcblxuLy8gQUxJQVNFU1xuXG5hZGRVbml0QWxpYXMoJ2RhdGUnLCAnRCcpO1xuXG4vLyBQUklPUk9JVFlcbmFkZFVuaXRQcmlvcml0eSgnZGF0ZScsIDkpO1xuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ0QnLCAgbWF0Y2gxdG8yKTtcbmFkZFJlZ2V4VG9rZW4oJ0REJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuYWRkUmVnZXhUb2tlbignRG8nLCBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgIC8vIFRPRE86IFJlbW92ZSBcIm9yZGluYWxQYXJzZVwiIGZhbGxiYWNrIGluIG5leHQgbWFqb3IgcmVsZWFzZS5cbiAgICByZXR1cm4gaXNTdHJpY3QgP1xuICAgICAgKGxvY2FsZS5fZGF5T2ZNb250aE9yZGluYWxQYXJzZSB8fCBsb2NhbGUuX29yZGluYWxQYXJzZSkgOlxuICAgICAgbG9jYWxlLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlTGVuaWVudDtcbn0pO1xuXG5hZGRQYXJzZVRva2VuKFsnRCcsICdERCddLCBEQVRFKTtcbmFkZFBhcnNlVG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgIGFycmF5W0RBVEVdID0gdG9JbnQoaW5wdXQubWF0Y2gobWF0Y2gxdG8yKVswXSk7XG59KTtcblxuLy8gTU9NRU5UU1xuXG52YXIgZ2V0U2V0RGF5T2ZNb250aCA9IG1ha2VHZXRTZXQoJ0RhdGUnLCB0cnVlKTtcblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbignREREJywgWydEREREJywgM10sICdERERvJywgJ2RheU9mWWVhcicpO1xuXG4vLyBBTElBU0VTXG5cbmFkZFVuaXRBbGlhcygnZGF5T2ZZZWFyJywgJ0RERCcpO1xuXG4vLyBQUklPUklUWVxuYWRkVW5pdFByaW9yaXR5KCdkYXlPZlllYXInLCA0KTtcblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCdEREQnLCAgbWF0Y2gxdG8zKTtcbmFkZFJlZ2V4VG9rZW4oJ0REREQnLCBtYXRjaDMpO1xuYWRkUGFyc2VUb2tlbihbJ0RERCcsICdEREREJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdG9JbnQoaW5wdXQpO1xufSk7XG5cbi8vIEhFTFBFUlNcblxuLy8gTU9NRU5UU1xuXG5mdW5jdGlvbiBnZXRTZXREYXlPZlllYXIgKGlucHV0KSB7XG4gICAgdmFyIGRheU9mWWVhciA9IE1hdGgucm91bmQoKHRoaXMuY2xvbmUoKS5zdGFydE9mKCdkYXknKSAtIHRoaXMuY2xvbmUoKS5zdGFydE9mKCd5ZWFyJykpIC8gODY0ZTUpICsgMTtcbiAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IGRheU9mWWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIGRheU9mWWVhciksICdkJyk7XG59XG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oJ20nLCBbJ21tJywgMl0sIDAsICdtaW51dGUnKTtcblxuLy8gQUxJQVNFU1xuXG5hZGRVbml0QWxpYXMoJ21pbnV0ZScsICdtJyk7XG5cbi8vIFBSSU9SSVRZXG5cbmFkZFVuaXRQcmlvcml0eSgnbWludXRlJywgMTQpO1xuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ20nLCAgbWF0Y2gxdG8yKTtcbmFkZFJlZ2V4VG9rZW4oJ21tJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuYWRkUGFyc2VUb2tlbihbJ20nLCAnbW0nXSwgTUlOVVRFKTtcblxuLy8gTU9NRU5UU1xuXG52YXIgZ2V0U2V0TWludXRlID0gbWFrZUdldFNldCgnTWludXRlcycsIGZhbHNlKTtcblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbigncycsIFsnc3MnLCAyXSwgMCwgJ3NlY29uZCcpO1xuXG4vLyBBTElBU0VTXG5cbmFkZFVuaXRBbGlhcygnc2Vjb25kJywgJ3MnKTtcblxuLy8gUFJJT1JJVFlcblxuYWRkVW5pdFByaW9yaXR5KCdzZWNvbmQnLCAxNSk7XG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbigncycsICBtYXRjaDF0bzIpO1xuYWRkUmVnZXhUb2tlbignc3MnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5hZGRQYXJzZVRva2VuKFsncycsICdzcyddLCBTRUNPTkQpO1xuXG4vLyBNT01FTlRTXG5cbnZhciBnZXRTZXRTZWNvbmQgPSBtYWtlR2V0U2V0KCdTZWNvbmRzJywgZmFsc2UpO1xuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKCdTJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMDApO1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKDAsIFsnU1MnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMCk7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oMCwgWydTU1MnLCAzXSwgMCwgJ21pbGxpc2Vjb25kJyk7XG5hZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1MnLCA0XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDtcbn0pO1xuYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTUycsIDVdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDtcbn0pO1xuYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1MnLCA2XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwO1xufSk7XG5hZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1MnLCA3XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDtcbn0pO1xuYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTUycsIDhdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwMDtcbn0pO1xuYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTU1MnLCA5XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDAwO1xufSk7XG5cblxuLy8gQUxJQVNFU1xuXG5hZGRVbml0QWxpYXMoJ21pbGxpc2Vjb25kJywgJ21zJyk7XG5cbi8vIFBSSU9SSVRZXG5cbmFkZFVuaXRQcmlvcml0eSgnbWlsbGlzZWNvbmQnLCAxNik7XG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbignUycsICAgIG1hdGNoMXRvMywgbWF0Y2gxKTtcbmFkZFJlZ2V4VG9rZW4oJ1NTJywgICBtYXRjaDF0bzMsIG1hdGNoMik7XG5hZGRSZWdleFRva2VuKCdTU1MnLCAgbWF0Y2gxdG8zLCBtYXRjaDMpO1xuXG52YXIgdG9rZW47XG5mb3IgKHRva2VuID0gJ1NTU1MnOyB0b2tlbi5sZW5ndGggPD0gOTsgdG9rZW4gKz0gJ1MnKSB7XG4gICAgYWRkUmVnZXhUb2tlbih0b2tlbiwgbWF0Y2hVbnNpZ25lZCk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTXMoaW5wdXQsIGFycmF5KSB7XG4gICAgYXJyYXlbTUlMTElTRUNPTkRdID0gdG9JbnQoKCcwLicgKyBpbnB1dCkgKiAxMDAwKTtcbn1cblxuZm9yICh0b2tlbiA9ICdTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgIGFkZFBhcnNlVG9rZW4odG9rZW4sIHBhcnNlTXMpO1xufVxuLy8gTU9NRU5UU1xuXG52YXIgZ2V0U2V0TWlsbGlzZWNvbmQgPSBtYWtlR2V0U2V0KCdNaWxsaXNlY29uZHMnLCBmYWxzZSk7XG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oJ3onLCAgMCwgMCwgJ3pvbmVBYmJyJyk7XG5hZGRGb3JtYXRUb2tlbignenonLCAwLCAwLCAnem9uZU5hbWUnKTtcblxuLy8gTU9NRU5UU1xuXG5mdW5jdGlvbiBnZXRab25lQWJiciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ1VUQycgOiAnJztcbn1cblxuZnVuY3Rpb24gZ2V0Wm9uZU5hbWUgKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdDb29yZGluYXRlZCBVbml2ZXJzYWwgVGltZScgOiAnJztcbn1cblxudmFyIHByb3RvID0gTW9tZW50LnByb3RvdHlwZTtcblxucHJvdG8uYWRkICAgICAgICAgICAgICAgPSBhZGQ7XG5wcm90by5jYWxlbmRhciAgICAgICAgICA9IGNhbGVuZGFyJDE7XG5wcm90by5jbG9uZSAgICAgICAgICAgICA9IGNsb25lO1xucHJvdG8uZGlmZiAgICAgICAgICAgICAgPSBkaWZmO1xucHJvdG8uZW5kT2YgICAgICAgICAgICAgPSBlbmRPZjtcbnByb3RvLmZvcm1hdCAgICAgICAgICAgID0gZm9ybWF0O1xucHJvdG8uZnJvbSAgICAgICAgICAgICAgPSBmcm9tO1xucHJvdG8uZnJvbU5vdyAgICAgICAgICAgPSBmcm9tTm93O1xucHJvdG8udG8gICAgICAgICAgICAgICAgPSB0bztcbnByb3RvLnRvTm93ICAgICAgICAgICAgID0gdG9Ob3c7XG5wcm90by5nZXQgICAgICAgICAgICAgICA9IHN0cmluZ0dldDtcbnByb3RvLmludmFsaWRBdCAgICAgICAgID0gaW52YWxpZEF0O1xucHJvdG8uaXNBZnRlciAgICAgICAgICAgPSBpc0FmdGVyO1xucHJvdG8uaXNCZWZvcmUgICAgICAgICAgPSBpc0JlZm9yZTtcbnByb3RvLmlzQmV0d2VlbiAgICAgICAgID0gaXNCZXR3ZWVuO1xucHJvdG8uaXNTYW1lICAgICAgICAgICAgPSBpc1NhbWU7XG5wcm90by5pc1NhbWVPckFmdGVyICAgICA9IGlzU2FtZU9yQWZ0ZXI7XG5wcm90by5pc1NhbWVPckJlZm9yZSAgICA9IGlzU2FtZU9yQmVmb3JlO1xucHJvdG8uaXNWYWxpZCAgICAgICAgICAgPSBpc1ZhbGlkJDI7XG5wcm90by5sYW5nICAgICAgICAgICAgICA9IGxhbmc7XG5wcm90by5sb2NhbGUgICAgICAgICAgICA9IGxvY2FsZTtcbnByb3RvLmxvY2FsZURhdGEgICAgICAgID0gbG9jYWxlRGF0YTtcbnByb3RvLm1heCAgICAgICAgICAgICAgID0gcHJvdG90eXBlTWF4O1xucHJvdG8ubWluICAgICAgICAgICAgICAgPSBwcm90b3R5cGVNaW47XG5wcm90by5wYXJzaW5nRmxhZ3MgICAgICA9IHBhcnNpbmdGbGFncztcbnByb3RvLnNldCAgICAgICAgICAgICAgID0gc3RyaW5nU2V0O1xucHJvdG8uc3RhcnRPZiAgICAgICAgICAgPSBzdGFydE9mO1xucHJvdG8uc3VidHJhY3QgICAgICAgICAgPSBzdWJ0cmFjdDtcbnByb3RvLnRvQXJyYXkgICAgICAgICAgID0gdG9BcnJheTtcbnByb3RvLnRvT2JqZWN0ICAgICAgICAgID0gdG9PYmplY3Q7XG5wcm90by50b0RhdGUgICAgICAgICAgICA9IHRvRGF0ZTtcbnByb3RvLnRvSVNPU3RyaW5nICAgICAgID0gdG9JU09TdHJpbmc7XG5wcm90by5pbnNwZWN0ICAgICAgICAgICA9IGluc3BlY3Q7XG5wcm90by50b0pTT04gICAgICAgICAgICA9IHRvSlNPTjtcbnByb3RvLnRvU3RyaW5nICAgICAgICAgID0gdG9TdHJpbmc7XG5wcm90by51bml4ICAgICAgICAgICAgICA9IHVuaXg7XG5wcm90by52YWx1ZU9mICAgICAgICAgICA9IHZhbHVlT2Y7XG5wcm90by5jcmVhdGlvbkRhdGEgICAgICA9IGNyZWF0aW9uRGF0YTtcbnByb3RvLnllYXIgICAgICAgPSBnZXRTZXRZZWFyO1xucHJvdG8uaXNMZWFwWWVhciA9IGdldElzTGVhcFllYXI7XG5wcm90by53ZWVrWWVhciAgICA9IGdldFNldFdlZWtZZWFyO1xucHJvdG8uaXNvV2Vla1llYXIgPSBnZXRTZXRJU09XZWVrWWVhcjtcbnByb3RvLnF1YXJ0ZXIgPSBwcm90by5xdWFydGVycyA9IGdldFNldFF1YXJ0ZXI7XG5wcm90by5tb250aCAgICAgICA9IGdldFNldE1vbnRoO1xucHJvdG8uZGF5c0luTW9udGggPSBnZXREYXlzSW5Nb250aDtcbnByb3RvLndlZWsgICAgICAgICAgID0gcHJvdG8ud2Vla3MgICAgICAgID0gZ2V0U2V0V2VlaztcbnByb3RvLmlzb1dlZWsgICAgICAgID0gcHJvdG8uaXNvV2Vla3MgICAgID0gZ2V0U2V0SVNPV2VlaztcbnByb3RvLndlZWtzSW5ZZWFyICAgID0gZ2V0V2Vla3NJblllYXI7XG5wcm90by5pc29XZWVrc0luWWVhciA9IGdldElTT1dlZWtzSW5ZZWFyO1xucHJvdG8uZGF0ZSAgICAgICA9IGdldFNldERheU9mTW9udGg7XG5wcm90by5kYXkgICAgICAgID0gcHJvdG8uZGF5cyAgICAgICAgICAgICA9IGdldFNldERheU9mV2VlaztcbnByb3RvLndlZWtkYXkgICAgPSBnZXRTZXRMb2NhbGVEYXlPZldlZWs7XG5wcm90by5pc29XZWVrZGF5ID0gZ2V0U2V0SVNPRGF5T2ZXZWVrO1xucHJvdG8uZGF5T2ZZZWFyICA9IGdldFNldERheU9mWWVhcjtcbnByb3RvLmhvdXIgPSBwcm90by5ob3VycyA9IGdldFNldEhvdXI7XG5wcm90by5taW51dGUgPSBwcm90by5taW51dGVzID0gZ2V0U2V0TWludXRlO1xucHJvdG8uc2Vjb25kID0gcHJvdG8uc2Vjb25kcyA9IGdldFNldFNlY29uZDtcbnByb3RvLm1pbGxpc2Vjb25kID0gcHJvdG8ubWlsbGlzZWNvbmRzID0gZ2V0U2V0TWlsbGlzZWNvbmQ7XG5wcm90by51dGNPZmZzZXQgICAgICAgICAgICA9IGdldFNldE9mZnNldDtcbnByb3RvLnV0YyAgICAgICAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9VVEM7XG5wcm90by5sb2NhbCAgICAgICAgICAgICAgICA9IHNldE9mZnNldFRvTG9jYWw7XG5wcm90by5wYXJzZVpvbmUgICAgICAgICAgICA9IHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0O1xucHJvdG8uaGFzQWxpZ25lZEhvdXJPZmZzZXQgPSBoYXNBbGlnbmVkSG91ck9mZnNldDtcbnByb3RvLmlzRFNUICAgICAgICAgICAgICAgID0gaXNEYXlsaWdodFNhdmluZ1RpbWU7XG5wcm90by5pc0xvY2FsICAgICAgICAgICAgICA9IGlzTG9jYWw7XG5wcm90by5pc1V0Y09mZnNldCAgICAgICAgICA9IGlzVXRjT2Zmc2V0O1xucHJvdG8uaXNVdGMgICAgICAgICAgICAgICAgPSBpc1V0YztcbnByb3RvLmlzVVRDICAgICAgICAgICAgICAgID0gaXNVdGM7XG5wcm90by56b25lQWJiciA9IGdldFpvbmVBYmJyO1xucHJvdG8uem9uZU5hbWUgPSBnZXRab25lTmFtZTtcbnByb3RvLmRhdGVzICA9IGRlcHJlY2F0ZSgnZGF0ZXMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIGRhdGUgaW5zdGVhZC4nLCBnZXRTZXREYXlPZk1vbnRoKTtcbnByb3RvLm1vbnRocyA9IGRlcHJlY2F0ZSgnbW9udGhzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb250aCBpbnN0ZWFkJywgZ2V0U2V0TW9udGgpO1xucHJvdG8ueWVhcnMgID0gZGVwcmVjYXRlKCd5ZWFycyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgeWVhciBpbnN0ZWFkJywgZ2V0U2V0WWVhcik7XG5wcm90by56b25lICAgPSBkZXByZWNhdGUoJ21vbWVudCgpLnpvbmUgaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudCgpLnV0Y09mZnNldCBpbnN0ZWFkLiBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL3pvbmUvJywgZ2V0U2V0Wm9uZSk7XG5wcm90by5pc0RTVFNoaWZ0ZWQgPSBkZXByZWNhdGUoJ2lzRFNUU2hpZnRlZCBpcyBkZXByZWNhdGVkLiBTZWUgaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9kc3Qtc2hpZnRlZC8gZm9yIG1vcmUgaW5mb3JtYXRpb24nLCBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQpO1xuXG5mdW5jdGlvbiBjcmVhdGVVbml4IChpbnB1dCkge1xuICAgIHJldHVybiBjcmVhdGVMb2NhbChpbnB1dCAqIDEwMDApO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJblpvbmUgKCkge1xuICAgIHJldHVybiBjcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpLnBhcnNlWm9uZSgpO1xufVxuXG5mdW5jdGlvbiBwcmVQYXJzZVBvc3RGb3JtYXQgKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmc7XG59XG5cbnZhciBwcm90byQxID0gTG9jYWxlLnByb3RvdHlwZTtcblxucHJvdG8kMS5jYWxlbmRhciAgICAgICAgPSBjYWxlbmRhcjtcbnByb3RvJDEubG9uZ0RhdGVGb3JtYXQgID0gbG9uZ0RhdGVGb3JtYXQ7XG5wcm90byQxLmludmFsaWREYXRlICAgICA9IGludmFsaWREYXRlO1xucHJvdG8kMS5vcmRpbmFsICAgICAgICAgPSBvcmRpbmFsO1xucHJvdG8kMS5wcmVwYXJzZSAgICAgICAgPSBwcmVQYXJzZVBvc3RGb3JtYXQ7XG5wcm90byQxLnBvc3Rmb3JtYXQgICAgICA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbnByb3RvJDEucmVsYXRpdmVUaW1lICAgID0gcmVsYXRpdmVUaW1lO1xucHJvdG8kMS5wYXN0RnV0dXJlICAgICAgPSBwYXN0RnV0dXJlO1xucHJvdG8kMS5zZXQgICAgICAgICAgICAgPSBzZXQ7XG5cbnByb3RvJDEubW9udGhzICAgICAgICAgICAgPSAgICAgICAgbG9jYWxlTW9udGhzO1xucHJvdG8kMS5tb250aHNTaG9ydCAgICAgICA9ICAgICAgICBsb2NhbGVNb250aHNTaG9ydDtcbnByb3RvJDEubW9udGhzUGFyc2UgICAgICAgPSAgICAgICAgbG9jYWxlTW9udGhzUGFyc2U7XG5wcm90byQxLm1vbnRoc1JlZ2V4ICAgICAgID0gbW9udGhzUmVnZXg7XG5wcm90byQxLm1vbnRoc1Nob3J0UmVnZXggID0gbW9udGhzU2hvcnRSZWdleDtcbnByb3RvJDEud2VlayA9IGxvY2FsZVdlZWs7XG5wcm90byQxLmZpcnN0RGF5T2ZZZWFyID0gbG9jYWxlRmlyc3REYXlPZlllYXI7XG5wcm90byQxLmZpcnN0RGF5T2ZXZWVrID0gbG9jYWxlRmlyc3REYXlPZldlZWs7XG5cbnByb3RvJDEud2Vla2RheXMgICAgICAgPSAgICAgICAgbG9jYWxlV2Vla2RheXM7XG5wcm90byQxLndlZWtkYXlzTWluICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzTWluO1xucHJvdG8kMS53ZWVrZGF5c1Nob3J0ICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c1Nob3J0O1xucHJvdG8kMS53ZWVrZGF5c1BhcnNlICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c1BhcnNlO1xuXG5wcm90byQxLndlZWtkYXlzUmVnZXggICAgICAgPSAgICAgICAgd2Vla2RheXNSZWdleDtcbnByb3RvJDEud2Vla2RheXNTaG9ydFJlZ2V4ICA9ICAgICAgICB3ZWVrZGF5c1Nob3J0UmVnZXg7XG5wcm90byQxLndlZWtkYXlzTWluUmVnZXggICAgPSAgICAgICAgd2Vla2RheXNNaW5SZWdleDtcblxucHJvdG8kMS5pc1BNID0gbG9jYWxlSXNQTTtcbnByb3RvJDEubWVyaWRpZW0gPSBsb2NhbGVNZXJpZGllbTtcblxuZnVuY3Rpb24gZ2V0JDEgKGZvcm1hdCwgaW5kZXgsIGZpZWxkLCBzZXR0ZXIpIHtcbiAgICB2YXIgbG9jYWxlID0gZ2V0TG9jYWxlKCk7XG4gICAgdmFyIHV0YyA9IGNyZWF0ZVVUQygpLnNldChzZXR0ZXIsIGluZGV4KTtcbiAgICByZXR1cm4gbG9jYWxlW2ZpZWxkXSh1dGMsIGZvcm1hdCk7XG59XG5cbmZ1bmN0aW9uIGxpc3RNb250aHNJbXBsIChmb3JtYXQsIGluZGV4LCBmaWVsZCkge1xuICAgIGlmIChpc051bWJlcihmb3JtYXQpKSB7XG4gICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuXG4gICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGdldCQxKGZvcm1hdCwgaW5kZXgsIGZpZWxkLCAnbW9udGgnKTtcbiAgICB9XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgb3V0W2ldID0gZ2V0JDEoZm9ybWF0LCBpLCBmaWVsZCwgJ21vbnRoJyk7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG5cbi8vICgpXG4vLyAoNSlcbi8vIChmbXQsIDUpXG4vLyAoZm10KVxuLy8gKHRydWUpXG4vLyAodHJ1ZSwgNSlcbi8vICh0cnVlLCBmbXQsIDUpXG4vLyAodHJ1ZSwgZm10KVxuZnVuY3Rpb24gbGlzdFdlZWtkYXlzSW1wbCAobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCBmaWVsZCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxlU29ydGVkID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgaWYgKGlzTnVtYmVyKGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1hdCA9IGxvY2FsZVNvcnRlZDtcbiAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgIGxvY2FsZVNvcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChpc051bWJlcihmb3JtYXQpKSB7XG4gICAgICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAnJztcbiAgICB9XG5cbiAgICB2YXIgbG9jYWxlID0gZ2V0TG9jYWxlKCksXG4gICAgICAgIHNoaWZ0ID0gbG9jYWxlU29ydGVkID8gbG9jYWxlLl93ZWVrLmRvdyA6IDA7XG5cbiAgICBpZiAoaW5kZXggIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZ2V0JDEoZm9ybWF0LCAoaW5kZXggKyBzaGlmdCkgJSA3LCBmaWVsZCwgJ2RheScpO1xuICAgIH1cblxuICAgIHZhciBpO1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgIG91dFtpXSA9IGdldCQxKGZvcm1hdCwgKGkgKyBzaGlmdCkgJSA3LCBmaWVsZCwgJ2RheScpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBsaXN0TW9udGhzIChmb3JtYXQsIGluZGV4KSB7XG4gICAgcmV0dXJuIGxpc3RNb250aHNJbXBsKGZvcm1hdCwgaW5kZXgsICdtb250aHMnKTtcbn1cblxuZnVuY3Rpb24gbGlzdE1vbnRoc1Nob3J0IChmb3JtYXQsIGluZGV4KSB7XG4gICAgcmV0dXJuIGxpc3RNb250aHNJbXBsKGZvcm1hdCwgaW5kZXgsICdtb250aHNTaG9ydCcpO1xufVxuXG5mdW5jdGlvbiBsaXN0V2Vla2RheXMgKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCkge1xuICAgIHJldHVybiBsaXN0V2Vla2RheXNJbXBsKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzJyk7XG59XG5cbmZ1bmN0aW9uIGxpc3RXZWVrZGF5c1Nob3J0IChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgpIHtcbiAgICByZXR1cm4gbGlzdFdlZWtkYXlzSW1wbChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5c1Nob3J0Jyk7XG59XG5cbmZ1bmN0aW9uIGxpc3RXZWVrZGF5c01pbiAobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4KSB7XG4gICAgcmV0dXJuIGxpc3RXZWVrZGF5c0ltcGwobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNNaW4nKTtcbn1cblxuZ2V0U2V0R2xvYmFsTG9jYWxlKCdlbicsIHtcbiAgICBkYXlPZk1vbnRoT3JkaW5hbFBhcnNlOiAvXFxkezEsMn0odGh8c3R8bmR8cmQpLyxcbiAgICBvcmRpbmFsIDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICB2YXIgYiA9IG51bWJlciAlIDEwLFxuICAgICAgICAgICAgb3V0cHV0ID0gKHRvSW50KG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyAndGgnIDpcbiAgICAgICAgICAgIChiID09PSAxKSA/ICdzdCcgOlxuICAgICAgICAgICAgKGIgPT09IDIpID8gJ25kJyA6XG4gICAgICAgICAgICAoYiA9PT0gMykgPyAncmQnIDogJ3RoJztcbiAgICAgICAgcmV0dXJuIG51bWJlciArIG91dHB1dDtcbiAgICB9XG59KTtcblxuLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuXG5ob29rcy5sYW5nID0gZGVwcmVjYXRlKCdtb21lbnQubGFuZyBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZSBpbnN0ZWFkLicsIGdldFNldEdsb2JhbExvY2FsZSk7XG5ob29rcy5sYW5nRGF0YSA9IGRlcHJlY2F0ZSgnbW9tZW50LmxhbmdEYXRhIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlRGF0YSBpbnN0ZWFkLicsIGdldExvY2FsZSk7XG5cbnZhciBtYXRoQWJzID0gTWF0aC5hYnM7XG5cbmZ1bmN0aW9uIGFicyAoKSB7XG4gICAgdmFyIGRhdGEgICAgICAgICAgID0gdGhpcy5fZGF0YTtcblxuICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9IG1hdGhBYnModGhpcy5fbWlsbGlzZWNvbmRzKTtcbiAgICB0aGlzLl9kYXlzICAgICAgICAgPSBtYXRoQWJzKHRoaXMuX2RheXMpO1xuICAgIHRoaXMuX21vbnRocyAgICAgICA9IG1hdGhBYnModGhpcy5fbW9udGhzKTtcblxuICAgIGRhdGEubWlsbGlzZWNvbmRzICA9IG1hdGhBYnMoZGF0YS5taWxsaXNlY29uZHMpO1xuICAgIGRhdGEuc2Vjb25kcyAgICAgICA9IG1hdGhBYnMoZGF0YS5zZWNvbmRzKTtcbiAgICBkYXRhLm1pbnV0ZXMgICAgICAgPSBtYXRoQWJzKGRhdGEubWludXRlcyk7XG4gICAgZGF0YS5ob3VycyAgICAgICAgID0gbWF0aEFicyhkYXRhLmhvdXJzKTtcbiAgICBkYXRhLm1vbnRocyAgICAgICAgPSBtYXRoQWJzKGRhdGEubW9udGhzKTtcbiAgICBkYXRhLnllYXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEueWVhcnMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIGFkZFN1YnRyYWN0JDEgKGR1cmF0aW9uLCBpbnB1dCwgdmFsdWUsIGRpcmVjdGlvbikge1xuICAgIHZhciBvdGhlciA9IGNyZWF0ZUR1cmF0aW9uKGlucHV0LCB2YWx1ZSk7XG5cbiAgICBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzICs9IGRpcmVjdGlvbiAqIG90aGVyLl9taWxsaXNlY29uZHM7XG4gICAgZHVyYXRpb24uX2RheXMgICAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fZGF5cztcbiAgICBkdXJhdGlvbi5fbW9udGhzICAgICAgICs9IGRpcmVjdGlvbiAqIG90aGVyLl9tb250aHM7XG5cbiAgICByZXR1cm4gZHVyYXRpb24uX2J1YmJsZSgpO1xufVxuXG4vLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBhZGQoMSwgJ3MnKSBvciBhZGQoZHVyYXRpb24pXG5mdW5jdGlvbiBhZGQkMSAoaW5wdXQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGFkZFN1YnRyYWN0JDEodGhpcywgaW5wdXQsIHZhbHVlLCAxKTtcbn1cblxuLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgc3VidHJhY3QoMSwgJ3MnKSBvciBzdWJ0cmFjdChkdXJhdGlvbilcbmZ1bmN0aW9uIHN1YnRyYWN0JDEgKGlucHV0LCB2YWx1ZSkge1xuICAgIHJldHVybiBhZGRTdWJ0cmFjdCQxKHRoaXMsIGlucHV0LCB2YWx1ZSwgLTEpO1xufVxuXG5mdW5jdGlvbiBhYnNDZWlsIChudW1iZXIpIHtcbiAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwobnVtYmVyKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJ1YmJsZSAoKSB7XG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMuX21pbGxpc2Vjb25kcztcbiAgICB2YXIgZGF5cyAgICAgICAgID0gdGhpcy5fZGF5cztcbiAgICB2YXIgbW9udGhzICAgICAgID0gdGhpcy5fbW9udGhzO1xuICAgIHZhciBkYXRhICAgICAgICAgPSB0aGlzLl9kYXRhO1xuICAgIHZhciBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgeWVhcnMsIG1vbnRoc0Zyb21EYXlzO1xuXG4gICAgLy8gaWYgd2UgaGF2ZSBhIG1peCBvZiBwb3NpdGl2ZSBhbmQgbmVnYXRpdmUgdmFsdWVzLCBidWJibGUgZG93biBmaXJzdFxuICAgIC8vIGNoZWNrOiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMjE2NlxuICAgIGlmICghKChtaWxsaXNlY29uZHMgPj0gMCAmJiBkYXlzID49IDAgJiYgbW9udGhzID49IDApIHx8XG4gICAgICAgICAgICAobWlsbGlzZWNvbmRzIDw9IDAgJiYgZGF5cyA8PSAwICYmIG1vbnRocyA8PSAwKSkpIHtcbiAgICAgICAgbWlsbGlzZWNvbmRzICs9IGFic0NlaWwobW9udGhzVG9EYXlzKG1vbnRocykgKyBkYXlzKSAqIDg2NGU1O1xuICAgICAgICBkYXlzID0gMDtcbiAgICAgICAgbW9udGhzID0gMDtcbiAgICB9XG5cbiAgICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgYnViYmxlcyB1cCB2YWx1ZXMsIHNlZSB0aGUgdGVzdHMgZm9yXG4gICAgLy8gZXhhbXBsZXMgb2Ygd2hhdCB0aGF0IG1lYW5zLlxuICAgIGRhdGEubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzICUgMTAwMDtcblxuICAgIHNlY29uZHMgICAgICAgICAgID0gYWJzRmxvb3IobWlsbGlzZWNvbmRzIC8gMTAwMCk7XG4gICAgZGF0YS5zZWNvbmRzICAgICAgPSBzZWNvbmRzICUgNjA7XG5cbiAgICBtaW51dGVzICAgICAgICAgICA9IGFic0Zsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgZGF0YS5taW51dGVzICAgICAgPSBtaW51dGVzICUgNjA7XG5cbiAgICBob3VycyAgICAgICAgICAgICA9IGFic0Zsb29yKG1pbnV0ZXMgLyA2MCk7XG4gICAgZGF0YS5ob3VycyAgICAgICAgPSBob3VycyAlIDI0O1xuXG4gICAgZGF5cyArPSBhYnNGbG9vcihob3VycyAvIDI0KTtcblxuICAgIC8vIGNvbnZlcnQgZGF5cyB0byBtb250aHNcbiAgICBtb250aHNGcm9tRGF5cyA9IGFic0Zsb29yKGRheXNUb01vbnRocyhkYXlzKSk7XG4gICAgbW9udGhzICs9IG1vbnRoc0Zyb21EYXlzO1xuICAgIGRheXMgLT0gYWJzQ2VpbChtb250aHNUb0RheXMobW9udGhzRnJvbURheXMpKTtcblxuICAgIC8vIDEyIG1vbnRocyAtPiAxIHllYXJcbiAgICB5ZWFycyA9IGFic0Zsb29yKG1vbnRocyAvIDEyKTtcbiAgICBtb250aHMgJT0gMTI7XG5cbiAgICBkYXRhLmRheXMgICA9IGRheXM7XG4gICAgZGF0YS5tb250aHMgPSBtb250aHM7XG4gICAgZGF0YS55ZWFycyAgPSB5ZWFycztcblxuICAgIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBkYXlzVG9Nb250aHMgKGRheXMpIHtcbiAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxNDYwOTcgZGF5cyAodGFraW5nIGludG8gYWNjb3VudCBsZWFwIHllYXIgcnVsZXMpXG4gICAgLy8gNDAwIHllYXJzIGhhdmUgMTIgbW9udGhzID09PSA0ODAwXG4gICAgcmV0dXJuIGRheXMgKiA0ODAwIC8gMTQ2MDk3O1xufVxuXG5mdW5jdGlvbiBtb250aHNUb0RheXMgKG1vbnRocykge1xuICAgIC8vIHRoZSByZXZlcnNlIG9mIGRheXNUb01vbnRoc1xuICAgIHJldHVybiBtb250aHMgKiAxNDYwOTcgLyA0ODAwO1xufVxuXG5mdW5jdGlvbiBhcyAodW5pdHMpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiBOYU47XG4gICAgfVxuICAgIHZhciBkYXlzO1xuICAgIHZhciBtb250aHM7XG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMuX21pbGxpc2Vjb25kcztcblxuICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgaWYgKHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgZGF5cyAgID0gdGhpcy5fZGF5cyAgICsgbWlsbGlzZWNvbmRzIC8gODY0ZTU7XG4gICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyArIGRheXNUb01vbnRocyhkYXlzKTtcbiAgICAgICAgcmV0dXJuIHVuaXRzID09PSAnbW9udGgnID8gbW9udGhzIDogbW9udGhzIC8gMTI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaGFuZGxlIG1pbGxpc2Vjb25kcyBzZXBhcmF0ZWx5IGJlY2F1c2Ugb2YgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgKGlzc3VlICMxODY3KVxuICAgICAgICBkYXlzID0gdGhpcy5fZGF5cyArIE1hdGgucm91bmQobW9udGhzVG9EYXlzKHRoaXMuX21vbnRocykpO1xuICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICBjYXNlICd3ZWVrJyAgIDogcmV0dXJuIGRheXMgLyA3ICAgICArIG1pbGxpc2Vjb25kcyAvIDYwNDhlNTtcbiAgICAgICAgICAgIGNhc2UgJ2RheScgICAgOiByZXR1cm4gZGF5cyAgICAgICAgICsgbWlsbGlzZWNvbmRzIC8gODY0ZTU7XG4gICAgICAgICAgICBjYXNlICdob3VyJyAgIDogcmV0dXJuIGRheXMgKiAyNCAgICArIG1pbGxpc2Vjb25kcyAvIDM2ZTU7XG4gICAgICAgICAgICBjYXNlICdtaW51dGUnIDogcmV0dXJuIGRheXMgKiAxNDQwICArIG1pbGxpc2Vjb25kcyAvIDZlNDtcbiAgICAgICAgICAgIGNhc2UgJ3NlY29uZCcgOiByZXR1cm4gZGF5cyAqIDg2NDAwICsgbWlsbGlzZWNvbmRzIC8gMTAwMDtcbiAgICAgICAgICAgIC8vIE1hdGguZmxvb3IgcHJldmVudHMgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgaGVyZVxuICAgICAgICAgICAgY2FzZSAnbWlsbGlzZWNvbmQnOiByZXR1cm4gTWF0aC5mbG9vcihkYXlzICogODY0ZTUpICsgbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHVuaXQgJyArIHVuaXRzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gVE9ETzogVXNlIHRoaXMuYXMoJ21zJyk/XG5mdW5jdGlvbiB2YWx1ZU9mJDEgKCkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIE5hTjtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzICtcbiAgICAgICAgdGhpcy5fZGF5cyAqIDg2NGU1ICtcbiAgICAgICAgKHRoaXMuX21vbnRocyAlIDEyKSAqIDI1OTJlNiArXG4gICAgICAgIHRvSW50KHRoaXMuX21vbnRocyAvIDEyKSAqIDMxNTM2ZTZcbiAgICApO1xufVxuXG5mdW5jdGlvbiBtYWtlQXMgKGFsaWFzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoYWxpYXMpO1xuICAgIH07XG59XG5cbnZhciBhc01pbGxpc2Vjb25kcyA9IG1ha2VBcygnbXMnKTtcbnZhciBhc1NlY29uZHMgICAgICA9IG1ha2VBcygncycpO1xudmFyIGFzTWludXRlcyAgICAgID0gbWFrZUFzKCdtJyk7XG52YXIgYXNIb3VycyAgICAgICAgPSBtYWtlQXMoJ2gnKTtcbnZhciBhc0RheXMgICAgICAgICA9IG1ha2VBcygnZCcpO1xudmFyIGFzV2Vla3MgICAgICAgID0gbWFrZUFzKCd3Jyk7XG52YXIgYXNNb250aHMgICAgICAgPSBtYWtlQXMoJ00nKTtcbnZhciBhc1llYXJzICAgICAgICA9IG1ha2VBcygneScpO1xuXG5mdW5jdGlvbiBjbG9uZSQxICgpIHtcbiAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24odGhpcyk7XG59XG5cbmZ1bmN0aW9uIGdldCQyICh1bml0cykge1xuICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXNbdW5pdHMgKyAncyddKCkgOiBOYU47XG59XG5cbmZ1bmN0aW9uIG1ha2VHZXR0ZXIobmFtZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMuX2RhdGFbbmFtZV0gOiBOYU47XG4gICAgfTtcbn1cblxudmFyIG1pbGxpc2Vjb25kcyA9IG1ha2VHZXR0ZXIoJ21pbGxpc2Vjb25kcycpO1xudmFyIHNlY29uZHMgICAgICA9IG1ha2VHZXR0ZXIoJ3NlY29uZHMnKTtcbnZhciBtaW51dGVzICAgICAgPSBtYWtlR2V0dGVyKCdtaW51dGVzJyk7XG52YXIgaG91cnMgICAgICAgID0gbWFrZUdldHRlcignaG91cnMnKTtcbnZhciBkYXlzICAgICAgICAgPSBtYWtlR2V0dGVyKCdkYXlzJyk7XG52YXIgbW9udGhzICAgICAgID0gbWFrZUdldHRlcignbW9udGhzJyk7XG52YXIgeWVhcnMgICAgICAgID0gbWFrZUdldHRlcigneWVhcnMnKTtcblxuZnVuY3Rpb24gd2Vla3MgKCkge1xuICAgIHJldHVybiBhYnNGbG9vcih0aGlzLmRheXMoKSAvIDcpO1xufVxuXG52YXIgcm91bmQgPSBNYXRoLnJvdW5kO1xudmFyIHRocmVzaG9sZHMgPSB7XG4gICAgc3M6IDQ0LCAgICAgICAgIC8vIGEgZmV3IHNlY29uZHMgdG8gc2Vjb25kc1xuICAgIHMgOiA0NSwgICAgICAgICAvLyBzZWNvbmRzIHRvIG1pbnV0ZVxuICAgIG0gOiA0NSwgICAgICAgICAvLyBtaW51dGVzIHRvIGhvdXJcbiAgICBoIDogMjIsICAgICAgICAgLy8gaG91cnMgdG8gZGF5XG4gICAgZCA6IDI2LCAgICAgICAgIC8vIGRheXMgdG8gbW9udGhcbiAgICBNIDogMTEgICAgICAgICAgLy8gbW9udGhzIHRvIHllYXJcbn07XG5cbi8vIGhlbHBlciBmdW5jdGlvbiBmb3IgbW9tZW50LmZuLmZyb20sIG1vbWVudC5mbi5mcm9tTm93LCBhbmQgbW9tZW50LmR1cmF0aW9uLmZuLmh1bWFuaXplXG5mdW5jdGlvbiBzdWJzdGl0dXRlVGltZUFnbyhzdHJpbmcsIG51bWJlciwgd2l0aG91dFN1ZmZpeCwgaXNGdXR1cmUsIGxvY2FsZSkge1xuICAgIHJldHVybiBsb2NhbGUucmVsYXRpdmVUaW1lKG51bWJlciB8fCAxLCAhIXdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpO1xufVxuXG5mdW5jdGlvbiByZWxhdGl2ZVRpbWUkMSAocG9zTmVnRHVyYXRpb24sIHdpdGhvdXRTdWZmaXgsIGxvY2FsZSkge1xuICAgIHZhciBkdXJhdGlvbiA9IGNyZWF0ZUR1cmF0aW9uKHBvc05lZ0R1cmF0aW9uKS5hYnMoKTtcbiAgICB2YXIgc2Vjb25kcyAgPSByb3VuZChkdXJhdGlvbi5hcygncycpKTtcbiAgICB2YXIgbWludXRlcyAgPSByb3VuZChkdXJhdGlvbi5hcygnbScpKTtcbiAgICB2YXIgaG91cnMgICAgPSByb3VuZChkdXJhdGlvbi5hcygnaCcpKTtcbiAgICB2YXIgZGF5cyAgICAgPSByb3VuZChkdXJhdGlvbi5hcygnZCcpKTtcbiAgICB2YXIgbW9udGhzICAgPSByb3VuZChkdXJhdGlvbi5hcygnTScpKTtcbiAgICB2YXIgeWVhcnMgICAgPSByb3VuZChkdXJhdGlvbi5hcygneScpKTtcblxuICAgIHZhciBhID0gc2Vjb25kcyA8PSB0aHJlc2hvbGRzLnNzICYmIFsncycsIHNlY29uZHNdICB8fFxuICAgICAgICAgICAgc2Vjb25kcyA8IHRocmVzaG9sZHMucyAgICYmIFsnc3MnLCBzZWNvbmRzXSB8fFxuICAgICAgICAgICAgbWludXRlcyA8PSAxICAgICAgICAgICAgICYmIFsnbSddICAgICAgICAgICB8fFxuICAgICAgICAgICAgbWludXRlcyA8IHRocmVzaG9sZHMubSAgICYmIFsnbW0nLCBtaW51dGVzXSB8fFxuICAgICAgICAgICAgaG91cnMgICA8PSAxICAgICAgICAgICAgICYmIFsnaCddICAgICAgICAgICB8fFxuICAgICAgICAgICAgaG91cnMgICA8IHRocmVzaG9sZHMuaCAgICYmIFsnaGgnLCBob3Vyc10gICB8fFxuICAgICAgICAgICAgZGF5cyAgICA8PSAxICAgICAgICAgICAgICYmIFsnZCddICAgICAgICAgICB8fFxuICAgICAgICAgICAgZGF5cyAgICA8IHRocmVzaG9sZHMuZCAgICYmIFsnZGQnLCBkYXlzXSAgICB8fFxuICAgICAgICAgICAgbW9udGhzICA8PSAxICAgICAgICAgICAgICYmIFsnTSddICAgICAgICAgICB8fFxuICAgICAgICAgICAgbW9udGhzICA8IHRocmVzaG9sZHMuTSAgICYmIFsnTU0nLCBtb250aHNdICB8fFxuICAgICAgICAgICAgeWVhcnMgICA8PSAxICAgICAgICAgICAgICYmIFsneSddICAgICAgICAgICB8fCBbJ3l5JywgeWVhcnNdO1xuXG4gICAgYVsyXSA9IHdpdGhvdXRTdWZmaXg7XG4gICAgYVszXSA9ICtwb3NOZWdEdXJhdGlvbiA+IDA7XG4gICAgYVs0XSA9IGxvY2FsZTtcbiAgICByZXR1cm4gc3Vic3RpdHV0ZVRpbWVBZ28uYXBwbHkobnVsbCwgYSk7XG59XG5cbi8vIFRoaXMgZnVuY3Rpb24gYWxsb3dzIHlvdSB0byBzZXQgdGhlIHJvdW5kaW5nIGZ1bmN0aW9uIGZvciByZWxhdGl2ZSB0aW1lIHN0cmluZ3NcbmZ1bmN0aW9uIGdldFNldFJlbGF0aXZlVGltZVJvdW5kaW5nIChyb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgaWYgKHJvdW5kaW5nRnVuY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gcm91bmQ7XG4gICAgfVxuICAgIGlmICh0eXBlb2Yocm91bmRpbmdGdW5jdGlvbikgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcm91bmQgPSByb3VuZGluZ0Z1bmN0aW9uO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0IGEgdGhyZXNob2xkIGZvciByZWxhdGl2ZSB0aW1lIHN0cmluZ3NcbmZ1bmN0aW9uIGdldFNldFJlbGF0aXZlVGltZVRocmVzaG9sZCAodGhyZXNob2xkLCBsaW1pdCkge1xuICAgIGlmICh0aHJlc2hvbGRzW3RocmVzaG9sZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChsaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aHJlc2hvbGRzW3RocmVzaG9sZF07XG4gICAgfVxuICAgIHRocmVzaG9sZHNbdGhyZXNob2xkXSA9IGxpbWl0O1xuICAgIGlmICh0aHJlc2hvbGQgPT09ICdzJykge1xuICAgICAgICB0aHJlc2hvbGRzLnNzID0gbGltaXQgLSAxO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaHVtYW5pemUgKHdpdGhTdWZmaXgpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgIH1cblxuICAgIHZhciBsb2NhbGUgPSB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICB2YXIgb3V0cHV0ID0gcmVsYXRpdmVUaW1lJDEodGhpcywgIXdpdGhTdWZmaXgsIGxvY2FsZSk7XG5cbiAgICBpZiAod2l0aFN1ZmZpeCkge1xuICAgICAgICBvdXRwdXQgPSBsb2NhbGUucGFzdEZ1dHVyZSgrdGhpcywgb3V0cHV0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbG9jYWxlLnBvc3Rmb3JtYXQob3V0cHV0KTtcbn1cblxudmFyIGFicyQxID0gTWF0aC5hYnM7XG5cbmZ1bmN0aW9uIHNpZ24oeCkge1xuICAgIHJldHVybiAoKHggPiAwKSAtICh4IDwgMCkpIHx8ICt4O1xufVxuXG5mdW5jdGlvbiB0b0lTT1N0cmluZyQxKCkge1xuICAgIC8vIGZvciBJU08gc3RyaW5ncyB3ZSBkbyBub3QgdXNlIHRoZSBub3JtYWwgYnViYmxpbmcgcnVsZXM6XG4gICAgLy8gICogbWlsbGlzZWNvbmRzIGJ1YmJsZSB1cCB1bnRpbCB0aGV5IGJlY29tZSBob3Vyc1xuICAgIC8vICAqIGRheXMgZG8gbm90IGJ1YmJsZSBhdCBhbGxcbiAgICAvLyAgKiBtb250aHMgYnViYmxlIHVwIHVudGlsIHRoZXkgYmVjb21lIHllYXJzXG4gICAgLy8gVGhpcyBpcyBiZWNhdXNlIHRoZXJlIGlzIG5vIGNvbnRleHQtZnJlZSBjb252ZXJzaW9uIGJldHdlZW4gaG91cnMgYW5kIGRheXNcbiAgICAvLyAodGhpbmsgb2YgY2xvY2sgY2hhbmdlcylcbiAgICAvLyBhbmQgYWxzbyBub3QgYmV0d2VlbiBkYXlzIGFuZCBtb250aHMgKDI4LTMxIGRheXMgcGVyIG1vbnRoKVxuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgfVxuXG4gICAgdmFyIHNlY29uZHMgPSBhYnMkMSh0aGlzLl9taWxsaXNlY29uZHMpIC8gMTAwMDtcbiAgICB2YXIgZGF5cyAgICAgICAgID0gYWJzJDEodGhpcy5fZGF5cyk7XG4gICAgdmFyIG1vbnRocyAgICAgICA9IGFicyQxKHRoaXMuX21vbnRocyk7XG4gICAgdmFyIG1pbnV0ZXMsIGhvdXJzLCB5ZWFycztcblxuICAgIC8vIDM2MDAgc2Vjb25kcyAtPiA2MCBtaW51dGVzIC0+IDEgaG91clxuICAgIG1pbnV0ZXMgICAgICAgICAgID0gYWJzRmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICBob3VycyAgICAgICAgICAgICA9IGFic0Zsb29yKG1pbnV0ZXMgLyA2MCk7XG4gICAgc2Vjb25kcyAlPSA2MDtcbiAgICBtaW51dGVzICU9IDYwO1xuXG4gICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgIHllYXJzICA9IGFic0Zsb29yKG1vbnRocyAvIDEyKTtcbiAgICBtb250aHMgJT0gMTI7XG5cblxuICAgIC8vIGluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9kb3JkaWxsZS9tb21lbnQtaXNvZHVyYXRpb24vYmxvYi9tYXN0ZXIvbW9tZW50Lmlzb2R1cmF0aW9uLmpzXG4gICAgdmFyIFkgPSB5ZWFycztcbiAgICB2YXIgTSA9IG1vbnRocztcbiAgICB2YXIgRCA9IGRheXM7XG4gICAgdmFyIGggPSBob3VycztcbiAgICB2YXIgbSA9IG1pbnV0ZXM7XG4gICAgdmFyIHMgPSBzZWNvbmRzID8gc2Vjb25kcy50b0ZpeGVkKDMpLnJlcGxhY2UoL1xcLj8wKyQvLCAnJykgOiAnJztcbiAgICB2YXIgdG90YWwgPSB0aGlzLmFzU2Vjb25kcygpO1xuXG4gICAgaWYgKCF0b3RhbCkge1xuICAgICAgICAvLyB0aGlzIGlzIHRoZSBzYW1lIGFzIEMjJ3MgKE5vZGEpIGFuZCBweXRob24gKGlzb2RhdGUpLi4uXG4gICAgICAgIC8vIGJ1dCBub3Qgb3RoZXIgSlMgKGdvb2cuZGF0ZSlcbiAgICAgICAgcmV0dXJuICdQMEQnO1xuICAgIH1cblxuICAgIHZhciB0b3RhbFNpZ24gPSB0b3RhbCA8IDAgPyAnLScgOiAnJztcbiAgICB2YXIgeW1TaWduID0gc2lnbih0aGlzLl9tb250aHMpICE9PSBzaWduKHRvdGFsKSA/ICctJyA6ICcnO1xuICAgIHZhciBkYXlzU2lnbiA9IHNpZ24odGhpcy5fZGF5cykgIT09IHNpZ24odG90YWwpID8gJy0nIDogJyc7XG4gICAgdmFyIGhtc1NpZ24gPSBzaWduKHRoaXMuX21pbGxpc2Vjb25kcykgIT09IHNpZ24odG90YWwpID8gJy0nIDogJyc7XG5cbiAgICByZXR1cm4gdG90YWxTaWduICsgJ1AnICtcbiAgICAgICAgKFkgPyB5bVNpZ24gKyBZICsgJ1knIDogJycpICtcbiAgICAgICAgKE0gPyB5bVNpZ24gKyBNICsgJ00nIDogJycpICtcbiAgICAgICAgKEQgPyBkYXlzU2lnbiArIEQgKyAnRCcgOiAnJykgK1xuICAgICAgICAoKGggfHwgbSB8fCBzKSA/ICdUJyA6ICcnKSArXG4gICAgICAgIChoID8gaG1zU2lnbiArIGggKyAnSCcgOiAnJykgK1xuICAgICAgICAobSA/IGhtc1NpZ24gKyBtICsgJ00nIDogJycpICtcbiAgICAgICAgKHMgPyBobXNTaWduICsgcyArICdTJyA6ICcnKTtcbn1cblxudmFyIHByb3RvJDIgPSBEdXJhdGlvbi5wcm90b3R5cGU7XG5cbnByb3RvJDIuaXNWYWxpZCAgICAgICAgPSBpc1ZhbGlkJDE7XG5wcm90byQyLmFicyAgICAgICAgICAgID0gYWJzO1xucHJvdG8kMi5hZGQgICAgICAgICAgICA9IGFkZCQxO1xucHJvdG8kMi5zdWJ0cmFjdCAgICAgICA9IHN1YnRyYWN0JDE7XG5wcm90byQyLmFzICAgICAgICAgICAgID0gYXM7XG5wcm90byQyLmFzTWlsbGlzZWNvbmRzID0gYXNNaWxsaXNlY29uZHM7XG5wcm90byQyLmFzU2Vjb25kcyAgICAgID0gYXNTZWNvbmRzO1xucHJvdG8kMi5hc01pbnV0ZXMgICAgICA9IGFzTWludXRlcztcbnByb3RvJDIuYXNIb3VycyAgICAgICAgPSBhc0hvdXJzO1xucHJvdG8kMi5hc0RheXMgICAgICAgICA9IGFzRGF5cztcbnByb3RvJDIuYXNXZWVrcyAgICAgICAgPSBhc1dlZWtzO1xucHJvdG8kMi5hc01vbnRocyAgICAgICA9IGFzTW9udGhzO1xucHJvdG8kMi5hc1llYXJzICAgICAgICA9IGFzWWVhcnM7XG5wcm90byQyLnZhbHVlT2YgICAgICAgID0gdmFsdWVPZiQxO1xucHJvdG8kMi5fYnViYmxlICAgICAgICA9IGJ1YmJsZTtcbnByb3RvJDIuY2xvbmUgICAgICAgICAgPSBjbG9uZSQxO1xucHJvdG8kMi5nZXQgICAgICAgICAgICA9IGdldCQyO1xucHJvdG8kMi5taWxsaXNlY29uZHMgICA9IG1pbGxpc2Vjb25kcztcbnByb3RvJDIuc2Vjb25kcyAgICAgICAgPSBzZWNvbmRzO1xucHJvdG8kMi5taW51dGVzICAgICAgICA9IG1pbnV0ZXM7XG5wcm90byQyLmhvdXJzICAgICAgICAgID0gaG91cnM7XG5wcm90byQyLmRheXMgICAgICAgICAgID0gZGF5cztcbnByb3RvJDIud2Vla3MgICAgICAgICAgPSB3ZWVrcztcbnByb3RvJDIubW9udGhzICAgICAgICAgPSBtb250aHM7XG5wcm90byQyLnllYXJzICAgICAgICAgID0geWVhcnM7XG5wcm90byQyLmh1bWFuaXplICAgICAgID0gaHVtYW5pemU7XG5wcm90byQyLnRvSVNPU3RyaW5nICAgID0gdG9JU09TdHJpbmckMTtcbnByb3RvJDIudG9TdHJpbmcgICAgICAgPSB0b0lTT1N0cmluZyQxO1xucHJvdG8kMi50b0pTT04gICAgICAgICA9IHRvSVNPU3RyaW5nJDE7XG5wcm90byQyLmxvY2FsZSAgICAgICAgID0gbG9jYWxlO1xucHJvdG8kMi5sb2NhbGVEYXRhICAgICA9IGxvY2FsZURhdGE7XG5cbnByb3RvJDIudG9Jc29TdHJpbmcgPSBkZXByZWNhdGUoJ3RvSXNvU3RyaW5nKCkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0b0lTT1N0cmluZygpIGluc3RlYWQgKG5vdGljZSB0aGUgY2FwaXRhbHMpJywgdG9JU09TdHJpbmckMSk7XG5wcm90byQyLmxhbmcgPSBsYW5nO1xuXG4vLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oJ1gnLCAwLCAwLCAndW5peCcpO1xuYWRkRm9ybWF0VG9rZW4oJ3gnLCAwLCAwLCAndmFsdWVPZicpO1xuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ3gnLCBtYXRjaFNpZ25lZCk7XG5hZGRSZWdleFRva2VuKCdYJywgbWF0Y2hUaW1lc3RhbXApO1xuYWRkUGFyc2VUb2tlbignWCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHBhcnNlRmxvYXQoaW5wdXQsIDEwKSAqIDEwMDApO1xufSk7XG5hZGRQYXJzZVRva2VuKCd4JywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgY29uZmlnLl9kID0gbmV3IERhdGUodG9JbnQoaW5wdXQpKTtcbn0pO1xuXG4vLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cblxuaG9va3MudmVyc2lvbiA9ICcyLjIxLjAnO1xuXG5zZXRIb29rQ2FsbGJhY2soY3JlYXRlTG9jYWwpO1xuXG5ob29rcy5mbiAgICAgICAgICAgICAgICAgICAgPSBwcm90bztcbmhvb2tzLm1pbiAgICAgICAgICAgICAgICAgICA9IG1pbjtcbmhvb2tzLm1heCAgICAgICAgICAgICAgICAgICA9IG1heDtcbmhvb2tzLm5vdyAgICAgICAgICAgICAgICAgICA9IG5vdztcbmhvb2tzLnV0YyAgICAgICAgICAgICAgICAgICA9IGNyZWF0ZVVUQztcbmhvb2tzLnVuaXggICAgICAgICAgICAgICAgICA9IGNyZWF0ZVVuaXg7XG5ob29rcy5tb250aHMgICAgICAgICAgICAgICAgPSBsaXN0TW9udGhzO1xuaG9va3MuaXNEYXRlICAgICAgICAgICAgICAgID0gaXNEYXRlO1xuaG9va3MubG9jYWxlICAgICAgICAgICAgICAgID0gZ2V0U2V0R2xvYmFsTG9jYWxlO1xuaG9va3MuaW52YWxpZCAgICAgICAgICAgICAgID0gY3JlYXRlSW52YWxpZDtcbmhvb2tzLmR1cmF0aW9uICAgICAgICAgICAgICA9IGNyZWF0ZUR1cmF0aW9uO1xuaG9va3MuaXNNb21lbnQgICAgICAgICAgICAgID0gaXNNb21lbnQ7XG5ob29rcy53ZWVrZGF5cyAgICAgICAgICAgICAgPSBsaXN0V2Vla2RheXM7XG5ob29rcy5wYXJzZVpvbmUgICAgICAgICAgICAgPSBjcmVhdGVJblpvbmU7XG5ob29rcy5sb2NhbGVEYXRhICAgICAgICAgICAgPSBnZXRMb2NhbGU7XG5ob29rcy5pc0R1cmF0aW9uICAgICAgICAgICAgPSBpc0R1cmF0aW9uO1xuaG9va3MubW9udGhzU2hvcnQgICAgICAgICAgID0gbGlzdE1vbnRoc1Nob3J0O1xuaG9va3Mud2Vla2RheXNNaW4gICAgICAgICAgID0gbGlzdFdlZWtkYXlzTWluO1xuaG9va3MuZGVmaW5lTG9jYWxlICAgICAgICAgID0gZGVmaW5lTG9jYWxlO1xuaG9va3MudXBkYXRlTG9jYWxlICAgICAgICAgID0gdXBkYXRlTG9jYWxlO1xuaG9va3MubG9jYWxlcyAgICAgICAgICAgICAgID0gbGlzdExvY2FsZXM7XG5ob29rcy53ZWVrZGF5c1Nob3J0ICAgICAgICAgPSBsaXN0V2Vla2RheXNTaG9ydDtcbmhvb2tzLm5vcm1hbGl6ZVVuaXRzICAgICAgICA9IG5vcm1hbGl6ZVVuaXRzO1xuaG9va3MucmVsYXRpdmVUaW1lUm91bmRpbmcgID0gZ2V0U2V0UmVsYXRpdmVUaW1lUm91bmRpbmc7XG5ob29rcy5yZWxhdGl2ZVRpbWVUaHJlc2hvbGQgPSBnZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQ7XG5ob29rcy5jYWxlbmRhckZvcm1hdCAgICAgICAgPSBnZXRDYWxlbmRhckZvcm1hdDtcbmhvb2tzLnByb3RvdHlwZSAgICAgICAgICAgICA9IHByb3RvO1xuXG4vLyBjdXJyZW50bHkgSFRNTDUgaW5wdXQgdHlwZSBvbmx5IHN1cHBvcnRzIDI0LWhvdXIgZm9ybWF0c1xuaG9va3MuSFRNTDVfRk1UID0ge1xuICAgIERBVEVUSU1FX0xPQ0FMOiAnWVlZWS1NTS1ERFRISDptbScsICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwiZGF0ZXRpbWUtbG9jYWxcIiAvPlxuICAgIERBVEVUSU1FX0xPQ0FMX1NFQ09ORFM6ICdZWVlZLU1NLUREVEhIOm1tOnNzJywgIC8vIDxpbnB1dCB0eXBlPVwiZGF0ZXRpbWUtbG9jYWxcIiBzdGVwPVwiMVwiIC8+XG4gICAgREFURVRJTUVfTE9DQUxfTVM6ICdZWVlZLU1NLUREVEhIOm1tOnNzLlNTUycsICAgLy8gPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIHN0ZXA9XCIwLjAwMVwiIC8+XG4gICAgREFURTogJ1lZWVktTU0tREQnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJkYXRlXCIgLz5cbiAgICBUSU1FOiAnSEg6bW0nLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cInRpbWVcIiAvPlxuICAgIFRJTUVfU0VDT05EUzogJ0hIOm1tOnNzJywgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwidGltZVwiIHN0ZXA9XCIxXCIgLz5cbiAgICBUSU1FX01TOiAnSEg6bW06c3MuU1NTJywgICAgICAgICAgICAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cInRpbWVcIiBzdGVwPVwiMC4wMDFcIiAvPlxuICAgIFdFRUs6ICdZWVlZLVtXXVdXJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwid2Vla1wiIC8+XG4gICAgTU9OVEg6ICdZWVlZLU1NJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJtb250aFwiIC8+XG59O1xuXG5yZXR1cm4gaG9va3M7XG5cbn0pKSk7XG4iLCJjb25zdCBwcmVmaXggPSAnbWMtYXV0by1jb21wbGV0ZSc7XG5cbmNsYXNzIEF1dG9Db21wbGV0ZSB7XG4gIGNvbnN0cnVjdG9yKGRvbSwgb3B0aW9ucykge1xuICAgIHRoaXMuYXV0b0NvbXBsZXRlID0gJChkb20pO1xuXG4gICAgdGhpcy50ZXh0Q29udGFpbmVyRG9tID0gdGhpcy5hdXRvQ29tcGxldGUuZmluZChgLiR7cHJlZml4fS10ZXh0LWNvbnRhaW5lcmApO1xuICAgIHRoaXMudGV4dElucHV0RG9tID0gdGhpcy50ZXh0Q29udGFpbmVyRG9tLmZpbmQoYC4ke3ByZWZpeH0tdGV4dGApO1xuICAgIHRoaXMudmFsdWVJbnB1dERvbSA9IHRoaXMudGV4dENvbnRhaW5lckRvbS5maW5kKGAuJHtwcmVmaXh9LXZhbHVlYCk7XG5cbiAgICB0aGlzLm9wdGlvbkNvbnRhaW5lckRvbSA9IHRoaXMuYXV0b0NvbXBsZXRlLmZpbmQoYC4ke3ByZWZpeH0tb3B0aW9uLWNvbnRhaW5lcmApO1xuICAgIHRoaXMub3B0aW9uRG9tcyA9IHRoaXMuYXV0b0NvbXBsZXRlLmZpbmQoYC4ke3ByZWZpeH0tb3B0aW9uYCk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PntcbiAgICAgIHRoaXMuYXV0b0NvbXBsZXRlLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG4gICAgfSwgZmFsc2UpXG5cbiAgICB0aGlzLmFkZExpc3RlbmVycygpO1xuXG4gICAgdGhpcy5rZXl3b3JkID0gJyc7XG4gIH1cblxuICBoYW5kbGVUb2dnbGUoZSkge1xuICAgIHRoaXMuYXV0b0NvbXBsZXRlLnRvZ2dsZUNsYXNzKCdzaG93Jyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaGFuZGxlSW5wdXQoZSkge1xuICAgIGxldCB2YWx1ZSA9ICQoZS50YXJnZXQpLnZhbCgpO1xuICAgIHRoaXMudmFsdWVJbnB1dERvbS52YWwodmFsdWUpO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5hdXRvQ29tcGxldGUudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfVxuICAgIHRoaXMua2V5d29yZCA9IHZhbHVlO1xuICAgIHRoaXMucmVuZGVyT3B0aW9ucygpO1xuICB9XG5cbiAgaGFuZGxlU2VsZWN0KGUpIHtcbiAgICBsZXQgdmFsdWUgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXZhbHVlJyk7XG4gICAgbGV0IHRleHQgPSAkKGUudGFyZ2V0KS50ZXh0KCk7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmF1dG9Db21wbGV0ZS5yZW1vdmVDbGFzcygnc2hvdycpO1xuICAgICAgdGhpcy50ZXh0SW5wdXREb20udmFsKHRleHQpO1xuICAgICAgdGhpcy52YWx1ZUlucHV0RG9tLnZhbCh2YWx1ZSk7XG4gICAgICB0aGlzLnZhbHVlSW5wdXREb20udHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICB0aGlzLmF1dG9Db21wbGV0ZS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9XG4gICAgdGhpcy5rZXl3b3JkID0gdmFsdWU7XG4gICAgdGhpcy5yZW5kZXJPcHRpb25zKCk7XG4gIH1cblxuICByZW5kZXJPcHRpb25zKCkge1xuICAgIGxldCBvcHRpb25Eb21zID0gJC5ncmVwKHRoaXMub3B0aW9uRG9tcywgaXRlbSA9PiB7XG4gICAgICByZXR1cm4gJChpdGVtKS50ZXh0KCkubWF0Y2godGhpcy5rZXl3b3JkKTtcbiAgICB9KTtcbiAgICB0aGlzLm9wdGlvbkNvbnRhaW5lckRvbS5odG1sKG9wdGlvbkRvbXMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFkZExpc3RlbmVycygpIHtcbiAgICB0aGlzLnRleHRJbnB1dERvbS5vbignaW5wdXQnLCB0aGlzLmhhbmRsZUlucHV0LmJpbmQodGhpcykpO1xuICAgIHRoaXMudGV4dENvbnRhaW5lckRvbS5vbignY2xpY2snLCB0aGlzLmhhbmRsZVRvZ2dsZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLm9wdGlvbkNvbnRhaW5lckRvbS5vbignY2xpY2snLCB0aGlzLmhhbmRsZVNlbGVjdC5iaW5kKHRoaXMpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dG9Db21wbGV0ZTtcbiIsImNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuY29uc3QgbGFuZ3MgPSByZXF1aXJlKCcuL2xhbmdzJyk7XG5jb25zdCBwcmVmaXggPSAnbWMtY2FsZW5kYXInO1xuXG5jb25zdCBjYWxlbmRhcnMgPSAkKGAuJHtwcmVmaXh9YCk7XG5cbmZ1bmN0aW9uIGdldFBvcEh0bWwob3B0aW9ucykge1xuICBsZXQgZGF5TmFtZXMgPSBsYW5nc1tvcHRpb25zLmxhbmddLmRheU5hbWVzO1xuICBsZXQgY29uZmlybU5hbWUgPSBsYW5nc1tvcHRpb25zLmxhbmddLmNvbmZpcm1OYW1lO1xuICByZXR1cm4gYDxkaXYgY2xhc3M9XCJtYy1jYWxlbmRhci1wb3BcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWMtY2FsZW5kYXItcG9wLWhlYWRlclwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtYy1jYWxlbmRhci1wb3AtYm9keVwiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1jLWNhbGVuZGFyLXBvcC1jYWxlbmRhclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWMtY2FsZW5kYXItcG9wLWNhbGVuZGFyLXdlZWtzXCI+XG4gICAgICAgICAgJHtkYXlOYW1lcy5tYXAoaXRlbSA9PiBgPHNwYW4+JHtpdGVtfTwvc3Bhbj5gKS5qb2luKCcnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYy1jYWxlbmRhci1wb3AtY2FsZW5kYXItZGF5c1wiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwibWMtY2FsZW5kYXItcG9wLXRpbWVcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibWMtY2FsZW5kYXItcG9wLWZvb3RlclwiPlxuICAgICAgPGE+JHtjb25maXJtTmFtZX08L2E+XG4gICAgPC9kaXY+XG4gIDwvZGl2PmBcbn1cblxuY2xhc3MgQ2FsZW5kYXIge1xuICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgbGFuZzogJ3poJyxcbiAgICBzdGFydERheTogMSxcbiAgfVxuICBjb25zdHJ1Y3Rvcihkb20sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBDYWxlbmRhci5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdGhpcy5jYWxlbmRhckRvbSA9ICQoZG9tKTtcbiAgICB0aGlzLnBvcERvbSA9ICQoZ2V0UG9wSHRtbChcbiAgICAgIHRoaXMub3B0aW9uc1xuICAgICkpO1xuICAgIHRoaXMuY2FsZW5kYXJEb20uYXBwZW5kKHRoaXMucG9wRG9tKTtcbiAgICB0aGlzLmNhbGVuZGFySGVhZGVyRG9tID0gdGhpcy5wb3BEb20uZmluZChgLiR7cHJlZml4fS1wb3AtaGVhZGVyYCk7XG4gICAgdGhpcy5jYWxlbmRhckRheXNEb20gPSB0aGlzLnBvcERvbS5maW5kKGAuJHtwcmVmaXh9LXBvcC1jYWxlbmRhci1kYXlzYCk7XG4gICAgdGhpcy50aW1lRG9tID0gdGhpcy5wb3BEb20uZmluZChgLiR7cHJlZml4fS1wb3AtdGltZWApO1xuXG4gICAgdGhpcy5ub3cgPSBuZXcgbW9tZW50KCk7XG4gICAgdGhpcy5tb250aCA9IG5ldyBtb21lbnQoKTtcblxuICAgIHRoaXMuc2VsZWN0ZWREYXRlID0gbmV3IG1vbWVudCgpO1xuICAgIHRoaXMuc2VsZWN0ZWRUaW1lID0gbmV3IG1vbWVudCgpO1xuXG4gICAgdGhpcy5yZW5kZXJNb250aCgpO1xuICAgIHRoaXMucmVuZGVyRGF0ZSgpO1xuICAgIHRoaXMucmVuZGVyVGltZSgpO1xuXG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIGhhbmRsZVRvZ2dsZShlKSB7XG4gICAgJCh0aGlzLmNhbGVuZGFyRG9tKS50b2dnbGVDbGFzcygnc2hvdycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZUNvbmZpcm0oKSB7XG4gICAgbGV0IHZhbHVlID0gYCR7dGhpcy5zZWxlY3RlZERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJyl9ICR7dGhpcy5zZWxlY3RlZFRpbWUuZm9ybWF0KCdISDptbScpfWBcbiAgICB0aGlzLmNhbGVuZGFyRG9tLmZpbmQoYC4ke3ByZWZpeH0tdGV4dGApLnZhbCh2YWx1ZSk7XG4gICAgdGhpcy5jYWxlbmRhckRvbS5maW5kKGAuJHtwcmVmaXh9LXRleHRgKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAkKHRoaXMuY2FsZW5kYXJEb20pLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJlTW9udGgoZSkge1xuICAgIGxldCBjb250ZXh0ID0gZS5kYXRhLmNvbnRleHQ7XG4gICAgY29udGV4dC5tb250aCA9IGNvbnRleHQubW9udGguc3VidHJhY3QoMSwgJ21vbnRoJyk7XG4gICAgY29udGV4dC5yZW5kZXJNb250aCgpO1xuICAgIGNvbnRleHQucmVuZGVyRGF0ZSgpO1xuICB9XG5cbiAgbmV4dE1vbnRoKGUpIHtcbiAgICBsZXQgY29udGV4dCA9IGUuZGF0YS5jb250ZXh0O1xuICAgIGNvbnRleHQubW9udGggPSBjb250ZXh0Lm1vbnRoLmFkZCgxLCAnbW9udGgnKTtcbiAgICBjb250ZXh0LnJlbmRlck1vbnRoKCk7XG4gICAgY29udGV4dC5yZW5kZXJEYXRlKCk7XG4gIH1cblxuICBwcmVIb3VyKGUpIHtcbiAgICBsZXQgY29udGV4dCA9IGUuZGF0YS5jb250ZXh0O1xuICAgIGNvbnRleHQuc2VsZWN0ZWRUaW1lLnN1YnRyYWN0KDEsICdob3VycycpXG4gICAgY29udGV4dC5yZW5kZXJUaW1lKCk7XG4gIH1cblxuICBuZXh0SG91cihlKSB7XG4gICAgbGV0IGNvbnRleHQgPSBlLmRhdGEuY29udGV4dDtcbiAgICBjb250ZXh0LnNlbGVjdGVkVGltZS5hZGQoMSwgJ2hvdXJzJyk7XG4gICAgY29udGV4dC5yZW5kZXJUaW1lKCk7XG4gIH1cblxuICBwcmVNaW51dGUoZSkge1xuICAgIGxldCBjb250ZXh0ID0gZS5kYXRhLmNvbnRleHQ7XG4gICAgY29udGV4dC5zZWxlY3RlZFRpbWUuc3VidHJhY3QoMSwgJ21pbnV0ZXMnKTtcbiAgICBjb250ZXh0LnJlbmRlclRpbWUoKTtcbiAgfVxuXG4gIG5leHRNaW51dGUoZSkge1xuICAgIGxldCBjb250ZXh0ID0gZS5kYXRhLmNvbnRleHQ7XG4gICAgY29udGV4dC5zZWxlY3RlZFRpbWUuYWRkKDEsICdtaW51dGVzJyk7XG4gICAgY29udGV4dC5yZW5kZXJUaW1lKCk7XG4gIH1cblxuICBoYW5kbGVTZWxlY3REYXRlKGUpIHtcbiAgICBsZXQgY29udGV4dCA9IGUuZGF0YS5jb250ZXh0O1xuICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xuICAgICAgY29udGV4dC5zZWxlY3RlZERhdGUgPSBuZXcgbW9tZW50KCQodGhpcykuYXR0cignZGF0YS1kYXRlJykpO1xuICAgICAgY29udGV4dC5yZW5kZXJEYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgYWRkTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuY2FsZW5kYXJEb20ub24oJ2NsaWNrJywgYC4ke3ByZWZpeH0tdGV4dC1jb250YWluZXJgLCB0aGlzLmhhbmRsZVRvZ2dsZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnBvcERvbS5vbignY2xpY2snLCBgLiR7cHJlZml4fS1wb3AtZm9vdGVyYCwgdGhpcy5oYW5kbGVDb25maXJtLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5jYWxlbmRhckRheXNEb20ub24oJ2NsaWNrJywgJ3NwYW4nLCB7XG4gICAgICBjb250ZXh0OiB0aGlzXG4gICAgfSx0aGlzLmhhbmRsZVNlbGVjdERhdGUpO1xuXG4gICAgdGhpcy5jYWxlbmRhckhlYWRlckRvbS5vbignY2xpY2snLCBgLnByZS1idG5gLCB7XG4gICAgICBjb250ZXh0OiB0aGlzXG4gICAgfSwgdGhpcy5wcmVNb250aCk7XG5cbiAgICB0aGlzLmNhbGVuZGFySGVhZGVyRG9tLm9uKCdjbGljaycsIGAubmV4dC1idG5gLCB7XG4gICAgICBjb250ZXh0OiB0aGlzXG4gICAgfSwgdGhpcy5uZXh0TW9udGgpO1xuXG4gICAgdGhpcy50aW1lRG9tLm9uKCdjbGljaycsIGAuJHtwcmVmaXh9LXBvcC10aW1lLWhvdXItbGVmdGAsIHtcbiAgICAgIGNvbnRleHQ6IHRoaXNcbiAgICB9LCB0aGlzLnByZUhvdXIpO1xuXG4gICAgdGhpcy50aW1lRG9tLm9uKCdjbGljaycsIGAuJHtwcmVmaXh9LXBvcC10aW1lLWhvdXItcmlnaHRgLCB7XG4gICAgICBjb250ZXh0OiB0aGlzXG4gICAgfSwgdGhpcy5uZXh0SG91cik7XG5cbiAgICB0aGlzLnRpbWVEb20ub24oJ2NsaWNrJywgYC4ke3ByZWZpeH0tcG9wLXRpbWUtbWludXRlLWxlZnRgLCB7XG4gICAgICBjb250ZXh0OiB0aGlzXG4gICAgfSwgdGhpcy5wcmVNaW51dGUpO1xuXG4gICAgdGhpcy50aW1lRG9tLm9uKCdjbGljaycsIGAuJHtwcmVmaXh9LXBvcC10aW1lLW1pbnV0ZS1yaWdodGAsIHtcbiAgICAgIGNvbnRleHQ6IHRoaXNcbiAgICB9LCB0aGlzLm5leHRNaW51dGUpO1xuICB9XG5cbiAgcmVuZGVyTW9udGgoKSB7XG4gICAgbGV0IG1vbnRoID0gIHRoaXMubW9udGguZm9ybWF0KGxhbmdzW3RoaXMub3B0aW9ucy5sYW5nXS5tb250aEZvcm1hdClcbiAgICB0aGlzLmNhbGVuZGFySGVhZGVyRG9tLmh0bWwoYFxuICAgICAgPHNwYW4gY2xhc3M9XCJwcmUtYnRuXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJtb250aFwiPlxuICAgICAgICAke21vbnRofVxuICAgICAgPC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJuZXh0LWJ0blwiPjwvc3Bhbj5cbiAgICBgKVxuICB9XG5cbiAgcmVuZGVyRGF0ZSgpIHtcbiAgICBsZXQgc3RhcnREYXRlID0gdGhpcy5tb250aC5jbG9uZSgpLnN0YXJ0T2YoJ21vbnRoJyk7XG4gICAgbGV0IGVuZERhdGUgPSB0aGlzLm1vbnRoLmNsb25lKCkuZW5kT2YoJ21vbnRoJyk7XG4gICAgbGV0IHN0YXJ0V2Vla2RheSA9IHN0YXJ0RGF0ZS53ZWVrZGF5KCk7XG4gICAgbGV0IGVuZFdlZWtkYXkgPSBlbmREYXRlLndlZWtkYXkoKTtcbiAgICBsZXQgdG9kYXlEYXRlID0gdGhpcy5ub3cuZGF0ZSgpO1xuXG4gICAgbGV0IG1vbnRoTGVuID0gZW5kRGF0ZS5kYXRlKCk7XG5cbiAgICBsZXQgZGF0ZUxpc3QgPSBbXTtcbiAgICBsZXQgdGVtcFN0YXJ0ID0gc3RhcnREYXRlLmNsb25lKCk7XG4gICAgbGV0IHRlbXBFbmQgPSBlbmREYXRlLmNsb25lKCk7XG4gICAgbGV0IHRlbXBNb250aCA9IHRoaXMubW9udGguY2xvbmUoKTtcblxuICAgIGlmIChzdGFydFdlZWtkYXkgPiAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0V2Vla2RheSA7aSsrKSB7XG4gICAgICAgIGRhdGVMaXN0LnVuc2hpZnQodGVtcFN0YXJ0LnN1YnRyYWN0KDEsICdkYXlzJykuZm9ybWF0KCdZWVlZLU1NLUREJykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvcihsZXQgaSA9IDE7IGkgPD0gbW9udGhMZW4gO2krKykge1xuICAgICAgZGF0ZUxpc3QucHVzaCh0ZW1wTW9udGguZGF0ZShpKS5mb3JtYXQoJ1lZWVktTU0tREQnKSk7XG4gICAgfVxuXG4gICAgaWYgKGVuZFdlZWtkYXkgPCA2KSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IDcgLSBlbmRXZWVrZGF5IDtpKyspIHtcbiAgICAgICAgZGF0ZUxpc3QucHVzaCh0ZW1wRW5kLmFkZCgxLCAnZGF5cycpLmZvcm1hdCgnWVlZWS1NTS1ERCcpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgaHRtbCA9IGRhdGVMaXN0Lm1hcChpdGVtID0+IHtcbiAgICAgIGlmIChuZXcgbW9tZW50KGl0ZW0pLmlzQmVmb3JlKHN0YXJ0RGF0ZSkgfHwgbmV3IG1vbWVudChpdGVtKS5pc0FmdGVyKGVuZERhdGUpKSB7XG4gICAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCJkaXNhYmxlZFwiIGRhdGEtZGF0ZT1cIiR7aXRlbX1cIj48aT4ke25ldyBtb21lbnQoaXRlbSkuZGF0ZSgpfTwvaT48L3NwYW4+YFxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkRGF0ZSAmJiBpdGVtID09PSB0aGlzLnNlbGVjdGVkRGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSkge1xuICAgICAgICByZXR1cm4gYDxzcGFuIGNsYXNzPVwic2VsZWN0ZWRcIiBkYXRhLWRhdGU9XCIke2l0ZW19XCI+PGk+JHtuZXcgbW9tZW50KGl0ZW0pLmRhdGUoKX08L2k+PC9zcGFuPmBcbiAgICAgIH0gZWxzZSBpZiAoaXRlbSA9PT0gdGhpcy5ub3cuZm9ybWF0KCdZWVlZLU1NLUREJykpIHtcbiAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInRvZGF5XCIgZGF0YS1kYXRlPVwiJHtpdGVtfVwiPjxpPiR7bmV3IG1vbWVudChpdGVtKS5kYXRlKCl9PC9pPjwvc3Bhbj5gXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYDxzcGFuIGRhdGEtZGF0ZT1cIiR7aXRlbX1cIj48aT4ke25ldyBtb21lbnQoaXRlbSkuZGF0ZSgpfTwvaT48L3NwYW4+YFxuICAgICAgfVxuICAgIH0pLmpvaW4oJycpO1xuXG4gICAgdGhpcy5jYWxlbmRhckRheXNEb20uaHRtbChodG1sKVxuICB9XG5cbiAgcmVuZGVyVGltZSgpIHtcbiAgICB0aGlzLnRpbWVEb20uaHRtbChgXG4gICAgICAke2xhbmdzW3RoaXMub3B0aW9ucy5sYW5nXS50aW1lTmFtZX1cbiAgICAgIDxzcGFuIGNsYXNzPVwibWMtY2FsZW5kYXItcG9wLXRpbWUtaG91ci1sZWZ0XCI+PC9zcGFuPlxuICAgICAgJHt0aGlzLnNlbGVjdGVkVGltZS5mb3JtYXQoJ0hIJyl9XG4gICAgICA8c3BhbiBjbGFzcz1cIm1jLWNhbGVuZGFyLXBvcC10aW1lLWhvdXItcmlnaHRcIj48L3NwYW4+XG4gICAgICA6XG4gICAgICA8c3BhbiBjbGFzcz1cIm1jLWNhbGVuZGFyLXBvcC10aW1lLW1pbnV0ZS1sZWZ0XCI+PC9zcGFuPlxuICAgICAgJHt0aGlzLnNlbGVjdGVkVGltZS5mb3JtYXQoJ21tJyl9XG4gICAgICA8c3BhbiBjbGFzcz1cIm1jLWNhbGVuZGFyLXBvcC10aW1lLW1pbnV0ZS1yaWdodFwiPjwvc3Bhbj5cbiAgICBgKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FsZW5kYXI7XG4iLCJjb25zdCBsYW5ncyA9IHtcbiAgemg6IHtcbiAgICBtb250aEZvcm1hdDogJ1lZWVnlubRNTeaciCcsXG4gICAgY29uZmlybU5hbWU6ICfnoa7lrponLFxuICAgIHRpbWVOYW1lOiAn5pe26Ze0JyxcbiAgICBkYXlOYW1lczogWyfml6UnLCAn5LiAJywgJ+S6jCcsICfkuIknLCAn5ZubJywgJ+S6lCcsICflha0nXSxcblxuICB9LFxuICBlbjoge1xuICAgIG1vbnRoRm9ybWF0OiAnTU1NTSBZWVlZJyxcbiAgICBjb25maXJtTmFtZTogJ2NvbmZpcm0nLFxuICAgIHRpbWVOYW1lOiAndGltZScsXG4gICAgZGF5TmFtZXM6IFsnU3VuJywgJ01vbicsICdUdWUnLCAnV2VkJywgJ1RodScsICdGcmknLCAnU2F0J10sXG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gbGFuZ3M7XG4iLCJjb25zdCBCYXNlID0gIHJlcXVpcmUoJy4vYmFzZScpO1xuXG5jb25zdCBwcmVmaXggPSAnbWMtZGlhbG9nLWFjdGlvbnNoZWV0JztcblxuY2xhc3MgQWN0aW9uU2hlZXQgZXh0ZW5kcyBCYXNlIHtcbiAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGNvbnRlbnRIVE1MOiAnVGhpcyBpcyBjb250ZW50IScsXG4gICAgZHVyYXRpb246IDIwMDAsXG4gICAgdXNlTWFzazogZmFsc2VcbiAgfVxuICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICBzdXBlcigpO1xuICAgICQuZXh0ZW5kKHRoaXMsIEFjdGlvblNoZWV0LmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgKz0gYCAke3ByZWZpeH1gO1xuXG4gICAgY29uc3QgeyBidXR0b25zIH0gPSBvcHRpb25zXG4gICAgbGV0IGJ1dHRvbnNIdG1sID0gYnV0dG9ucy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4gYDxzcGFuIGNsYXNzPVwiYnV0dG9uXCIgZGF0YS1pbmRleD0ke2luZGV4fT4ke2l0ZW0udGV4dH08L3NwYW4+YFxuICAgIH0pLmpvaW4oJycpO1xuICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IGJ1dHRvbnNIdG1sO1xuICAgIHRoaXMuY29udGVudCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctY29udGVudC10ZXh0Jyk7XG5cbiAgICAkKHRoaXMuY29udGFpbmVyKS5vbignY2xpY2snLCAnLmJ1dHRvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHsgaW5kZXggfSA9ICQodGhpcykuZGF0YSgpO1xuICAgICAgaWYgKGJ1dHRvbnNbaW5kZXhdICYmIGJ1dHRvbnNbaW5kZXhdLm9uQ2xpY2spIHtcbiAgICAgICAgYnV0dG9uc1tpbmRleF0ub25DbGljayhidXR0b25zW2luZGV4XSlcbiAgICAgICAgc2VsZi5oaWRlKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIGhpZGUgPSAoKSA9PiB7XG4gICAgc3VwZXIuaGlkZSgpO1xuICAgICQoJy5tYy1kaWFsb2ctbWFzaycpLm9mZignY2xpY2snLCB0aGlzLmhpZGUpXG4gIH1cblxuICBzaG93ID0gKCkgPT4ge1xuICAgIGlmKCF0aGlzLm1vdW50ZWQpIHRoaXMubW91bnQoKTtcbiAgICBzdXBlci5zaG93KCk7XG4gICAgJCgnLm1jLWRpYWxvZy1tYXNrJykub24oJ2NsaWNrJywgdGhpcy5oaWRlKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uU2hlZXQ7XG4iLCJjb25zdCBHZW5lcmFsID0gcmVxdWlyZSgnLi9nZW5lcmFsJyk7XG5cbmxldCBwcmVmaXggPSAnbWMtZGlhbG9nLWFsZXJ0JztcblxuY2xhc3MgQWxlcnREaWFsb2cgZXh0ZW5kcyBHZW5lcmFsIHtcbiAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGNvbnRlbnRIVE1MOiAnVGhpcyBpcyBjb250ZW50IScsXG4gICAgYnV0dG9uVGV4dDogJ2NvbmZpcm0nLFxuICAgIGxhbmc6ICd6aCcsXG4gICAgb25Db25maXJtOiBmdW5jdGlvbiAoKSB7dGhpcy5oaWRlKCl9XG4gIH1cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gICAgJC5leHRlbmQodGhpcywgQWxlcnREaWFsb2cuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTmFtZSArPSBgICR7cHJlZml4fWA7XG4gICAgdGhpcy5idXR0b25Hcm91cC5pbm5lckhUTUwgPSBgPGJ1dHRvbj4ke3RoaXMuYnV0dG9uVGV4dH08L2J1dHRvbj5gO1xuICAgIHRoaXMuYnV0dG9uID0gdGhpcy5idXR0b25Hcm91cC5xdWVyeVNlbGVjdG9yKCdidXR0b24nKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgaWYoZS50YXJnZXQgPT09IHRoaXMuYnV0dG9uKXtcbiAgICAgICAgdGhpcy5vbkNvbmZpcm0uY2FsbCh0aGlzLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSwgZmFsc2UpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBbGVydERpYWxvZztcbiIsImNvbnN0IE1hc2sgPSByZXF1aXJlKCcuL21hc2snKTtcbmNvbnN0IHVuaXF1ZUlkID0gcmVxdWlyZSgnLi91dGlscycpLnVuaXF1ZUlkO1xuXG5jb25zdCBwcmVmaXggPSAnbWMtZGlhbG9nJztcblxuY2xhc3MgQmFzZSB7XG4gIHN0YXRpYyBtYXNrID0gbmV3IE1hc2soKVxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmlkID0gdW5pcXVlSWQoKTtcbiAgICB0aGlzLmlzRGlzcGxheSA9IGZhbHNlO1xuICAgIHRoaXMudXNlTWFzayA9IHRydWU7IC8vIOaYr+WQpuS9v+eUqOmBrue9qVxuICAgIHRoaXMubW91bnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NOYW1lID0gcHJlZml4ICsgYCAke29wdGlvbnMuY2xhc3NOYW1lIHx8ICcnfWA7XG4gICAgdGhpcy5jb250YWluZXIuc2V0QXR0cmlidXRlKCdkaWFsb2ctaWQnLCB0aGlzLmlkKVxuICAgIHRoaXMuY2xhc3NMaXN0ID0gdGhpcy5jb250YWluZXIuY2xhc3NMaXN0O1xuICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sIGZhbHNlKVxuICB9XG4gIG1vdW50KCkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICAgIHRoaXMubW91bnRlZCA9IHRydWU7XG4gIH1cbiAgc2hvdygpIHtcbiAgICBpZighdGhpcy5tb3VudGVkKSB0aGlzLm1vdW50KCk7XG4gICAgaWYodGhpcy51c2VNYXNrKSBCYXNlLm1hc2suc2hvdygpO1xuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5jbGFzc0xpc3QuYWRkKCdpbicpLCAwKTtcbiAgICB0aGlzLmlzRGlzcGxheSA9IHRydWU7XG4gIH1cbiAgaGlkZSgpIHtcbiAgICBpZih0aGlzLnVzZU1hc2spIEJhc2UubWFzay5oaWRlKCk7XG4gICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdpbicpXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnLCAzMDApXG4gICAgdGhpcy5pc0Rpc3BsYXkgPSBmYWxzZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7XG4iLCJjb25zdCBHZW5lcmFsID0gcmVxdWlyZSgnLi9nZW5lcmFsJyk7XG5cbmNvbnN0IHByZWZpeCA9ICdtYy1kaWFsb2ctY29tcGxleCc7XG5cbmNsYXNzIENvbXBsZXggZXh0ZW5kcyBHZW5lcmFsIHtcbiAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGNvbnRlbnRIVE1MOiAnVGhpcyBpcyBjb250ZW50IScsXG4gICAgYnV0dG9uczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjYW5jZWwnLFxuICAgICAgICB0ZXh0OiAnY2FuY2VsJyxcbiAgICAgICAgb25DbGljazogZnVuY3Rpb24gKCkge3RoaXMuaGlkZSgpfSxcbiAgICAgIH1cbiAgICBdXG4gIH1cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgJC5leHRlbmQodGhpcywgQ29tcGxleC5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NOYW1lICs9IGAgJHtwcmVmaXh9YDtcbiAgICB0aGlzLmJ1dHRvbkdyb3VwLmlubmVySFRNTCA9IHRoaXMuYnV0dG9ucy5tYXAoYnV0dG9uID0+IHtcbiAgICAgIHJldHVybiBgPGJ1dHRvbiBjbGFzcz1cImNvbXBsZXgtYnRuICR7YnV0dG9uLmNsYXNzTmFtZSB8fCAnJ31cIj4ke2J1dHRvbi50ZXh0fTwvYnV0dG9uPmBcbiAgICB9KS5qb2luKCcnKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgbGV0IHRhcmdldCA9ICQoZS50YXJnZXQpO1xuICAgICAgaWYgKHRhcmdldC5oYXNDbGFzcygnY29tcGxleC1idG4nKSkge1xuICAgICAgICBsZXQgaW5kZXggPSB0YXJnZXQuaW5kZXgoKTtcbiAgICAgICAgbGV0IG9uQ2xpY2sgPSB0aGlzLmJ1dHRvbnNbaW5kZXhdICYmIHRoaXMuYnV0dG9uc1tpbmRleF0ub25DbGljaztcbiAgICAgICAgaWYgKG9uQ2xpY2spIHtcbiAgICAgICAgICBvbkNsaWNrLmNhbGwodGhpcywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIGZhbHNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBsZXg7XG4iLCJjb25zdCBHZW5lcmFsID0gcmVxdWlyZSgnLi9nZW5lcmFsJyk7XG5cbmNvbnN0IHByZWZpeCA9ICdtYy1kaWFsb2ctY29uZmlybSc7XG5cbmNsYXNzIENvbmZpcm1EaWFsb2cgZXh0ZW5kcyBHZW5lcmFsIHtcbiAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGNvbnRlbnRIVE1MOiAnVGhpcyBpcyBjb250ZW50IScsXG4gICAgY29uZmlybUJ1dHRvblRleHQ6ICdjb25maXJtJyxcbiAgICBjYW5jZWxCdXR0b25UZXh0OiAnY2FuY2VsJyxcbiAgICBsYW5nOiAnemgnLFxuICAgIG9uQ29uZmlybTogZnVuY3Rpb24gKCkge3RoaXMuaGlkZSgpfSxcbiAgICBvbkNhbmNlbDogZnVuY3Rpb24gKCkge3RoaXMuaGlkZSgpfVxuICB9XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICAkLmV4dGVuZCh0aGlzLCBDb25maXJtRGlhbG9nLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgKz0gYCAke3ByZWZpeH1gO1xuICAgIHRoaXMuYnV0dG9uR3JvdXAuaW5uZXJIVE1MID0gYFxuICAgICAgPGJ1dHRvbiBjbGFzcz1cImNhbmNlbC1idG5cIj4ke3RoaXMuY2FuY2VsQnV0dG9uVGV4dH08L2J1dHRvbj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJjb25maXJtLWJ0blwiPiR7dGhpcy5jb25maXJtQnV0dG9uVGV4dH08L2J1dHRvbj5cbiAgICBgO1xuICAgIHRoaXMuY29uZmlybUJ0biA9IHRoaXMuYnV0dG9uR3JvdXAucXVlcnlTZWxlY3RvcignLmNvbmZpcm0tYnRuJyk7XG4gICAgdGhpcy5jYW5jZWxCdG4gPSB0aGlzLmJ1dHRvbkdyb3VwLnF1ZXJ5U2VsZWN0b3IoJy5jYW5jZWwtYnRuJyk7XG4gICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgIGlmKGUudGFyZ2V0ID09PSB0aGlzLmNvbmZpcm1CdG4pe1xuICAgICAgICB0aGlzLm9uQ29uZmlybS5jYWxsKHRoaXMsICgpID0+IHtcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfSlcbiAgICAgIH1lbHNlIGlmKGUudGFyZ2V0ID09PSB0aGlzLmNhbmNlbEJ0bil7XG4gICAgICAgIHRoaXMub25DYW5jZWwuY2FsbCh0aGlzLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSwgZmFsc2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlybURpYWxvZztcbiIsImNvbnN0IEJhc2UgPSAgcmVxdWlyZSgnLi9iYXNlJyk7XG5cbmNvbnN0IHByZWZpeCA9ICdtYy1kaWFsb2ctZ2VuZXJhbCc7XG5cbmNvbnN0IHRtcGwgPSBgXG4gIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPjxwIGNsYXNzPVwiZGlhbG9nLWNvbnRlbnQtdGV4dFwiPjwvcD48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImRpYWxvZy1idXR0b24tZ3JvdXBcIj48L2Rpdj5cbmA7XG5cbmNsYXNzIEdlbmVyYWwgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NOYW1lICs9IGAgJHtwcmVmaXh9YDtcbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSB0bXBsO1xuICAgIHRoaXMuY29udGVudCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctY29udGVudC10ZXh0Jyk7XG4gICAgdGhpcy5idXR0b25Hcm91cCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctYnV0dG9uLWdyb3VwJyk7XG4gIH1cbiAgc2hvdyhvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmNvbnRlbnRIVE1MID0gb3B0aW9ucy5jb250ZW50SFRNTCB8fCB0aGlzLmNvbnRlbnRIVE1MO1xuICAgIHRoaXMuY29udGVudC5pbm5lckhUTUwgPSB0aGlzLmNvbnRlbnRIVE1MO1xuICAgIHN1cGVyLnNob3coKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmVyYWw7XG4iLCJcbm1vZHVsZS5leHBvcnRzID0ge1xuICBsb2FkaW5nOiB7XG4gICAgZW46IHtcbiAgICAgIGxvYWRpbmdUZXh0OiAnbG9hZGluZy4uLidcbiAgICB9LFxuICAgIHpoOiB7XG4gICAgICBsb2FkaW5nVGV4dDogJ+WKoOi9veS4rS4uLidcbiAgICB9XG4gIH0sXG4gIGNvbmZpcm06IHtcbiAgICBlbjoge1xuICAgICAgY2FuY2VsTmFtZTogJ2NhbmNlbCcsXG4gICAgICBjb25maXJtTmFtZTogJ2NvbmZpcm0nXG4gICAgfSxcbiAgICB6aDoge1xuICAgICAgY2FuY2VsTmFtZTogJ+WPlua2iCcsXG4gICAgICBjb25maXJtTmFtZTogJ+ehruiupCdcbiAgICB9XG4gIH0sXG4gIGFsZXJ0OiB7XG4gICAgZW46IHtcbiAgICAgIGNvbmZpcm1OYW1lOiAnY29uZmlybSdcbiAgICB9LFxuICAgIHpoOiB7XG4gICAgICBjb25maXJtTmFtZTogJ+ehruiupCdcbiAgICB9XG4gIH1cbn1cbiIsImNvbnN0IEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKTtcbmNvbnN0IGFwcGVuZFRvU2VsZWN0b3IgPSByZXF1aXJlKCcuL3V0aWxzJykuYXBwZW5kVG9TZWxlY3RvcjtcbmNvbnN0IGxhbmdzID0gcmVxdWlyZSgnLi9sYW5ncycpLmxvYWRpbmc7XG5jb25zdCBwcmVmaXggPSAnbWMtZGlhbG9nLWxvYWRpbmcnO1xuXG5jbGFzcyBMb2FkaW5nIGV4dGVuZHMgQmFzZSB7XG4gIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICB1c2VNYXNrOiBmYWxzZSxcbiAgICBjb3VudDogMTIsXG4gICAgbGFuZzogJ3poJ1xuICB9XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xuICAgIHN1cGVyKCk7XG4gICAgJC5leHRlbmQodGhpcywgTG9hZGluZy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb3VudDsgaSsrKSB7XG4gICAgICBodG1sICs9ICc8aT48L2k+JztcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgKz0gYCAke3ByZWZpeH1gO1xuICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IGBcbiAgICAgICR7aHRtbH1cbiAgICAgIDxwPiR7bGFuZ3NbdGhpcy5sYW5nXS5sb2FkaW5nVGV4dH08L3A+XG4gICAgYDtcblxuICB9XG5cbiAgc2hvdyhvcHRpb25zID0ge30pIHtcbiAgICBpZighdGhpcy5tb3VudGVkKSB0aGlzLm1vdW50KCk7XG4gICAgc3VwZXIuc2hvdygpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGluZztcbiIsImNvbnN0IHVuaXF1ZUlkID0gcmVxdWlyZSgnLi91dGlscycpLnVuaXF1ZUlkO1xuXG5jb25zdCBwcmVmaXggPSAnbWMtZGlhbG9nLW1hc2snO1xuXG5jbGFzcyBNYXNrIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHtcbiAgICAgIHpJbmRleDogOSxcbiAgICAgIG9wYWNpdHk6IC44XG4gICAgfSwgb3B0aW9ucy5tYXNrKTtcbiAgICB0aGlzLmlkID0gdW5pcXVlSWQoKTtcbiAgICB0aGlzLm1vdW50ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTmFtZSA9IHByZWZpeDtcbiAgICB0aGlzLmNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ21hc2staWQnLCB0aGlzLmlkKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSwgZmFsc2UpO1xuICB9XG4gIG1vdW50KCkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICAgIHRoaXMubW91bnRlZCA9IHRydWU7XG4gIH1cbiAgc2hvdygpIHtcbiAgICBpZighdGhpcy5tb3VudGVkKSB0aGlzLm1vdW50KCk7XG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdpbicpLCAwKTtcbiAgICB0aGlzLmlzRGlzcGxheSA9IHRydWU7XG4gIH1cbiAgaGlkZSgpIHtcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdpbicpXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnLCAzMDApO1xuICAgIHRoaXMuaXNEaXNwbGF5ID0gZmFsc2U7XG4gIH1cbiAgb24oZXZlbnRUeXBlLCBmdW4pIHtcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZnVuLCBmYWxzZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXNrO1xuIiwiY29uc3QgQmFzZSA9ICByZXF1aXJlKCcuL2Jhc2UnKTtcblxuY29uc3QgcHJlZml4ID0gJ21jLWRpYWxvZy10aXAnO1xuXG5jbGFzcyBUaXAgZXh0ZW5kcyBCYXNlIHtcbiAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGNvbnRlbnRIVE1MOiAnVGhpcyBpcyBjb250ZW50IScsXG4gICAgZHVyYXRpb246IDIwMDAsXG4gICAgdXNlTWFzazogZmFsc2VcbiAgfVxuICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICBzdXBlcigpO1xuICAgICQuZXh0ZW5kKHRoaXMsIFRpcC5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NOYW1lICs9IGAgJHtwcmVmaXh9YDtcbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSAnPHAgY2xhc3M9XCJkaWFsb2ctY29udGVudC10ZXh0XCI+PC9wPic7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLmRpYWxvZy1jb250ZW50LXRleHQnKTtcbiAgfVxuICBzaG93KG9wdGlvbnMgPSB7fSkge1xuICAgIGlmKCF0aGlzLm1vdW50ZWQpIHRoaXMubW91bnQoKTtcbiAgICB0aGlzLmNvbnRlbnRIVE1MID0gb3B0aW9ucy5jb250ZW50SFRNTCB8fCB0aGlzLmNvbnRlbnRIVE1MO1xuICAgIHRoaXMuY29udGVudC5pbm5lckhUTUwgPSB0aGlzLmNvbnRlbnRIVE1MO1xuICAgIHN1cGVyLnNob3coKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcklkKTtcbiAgICB0aGlzLnRpbWVySWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH0sIG9wdGlvbnMuZHVyYXRpb24gfHwgdGhpcy5kdXJhdGlvbilcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpcDtcbiIsImNvbnN0IEJhc2UgPSAgcmVxdWlyZSgnLi9iYXNlJyk7XG5jb25zdCBhcHBlbmRUb1NlbGVjdG9yID0gcmVxdWlyZSgnLi91dGlscycpLmFwcGVuZFRvU2VsZWN0b3I7XG5cbmNvbnN0IHByZWZpeCA9ICdtYy1kaWFsb2ctdG9hc3QnO1xuXG5jbGFzcyBUb2FzdCBleHRlbmRzIEJhc2Uge1xuICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgY29udGVudEhUTUw6ICdUaGlzIGlzIGNvbnRlbnQhJyxcbiAgICBkdXJhdGlvbjogMjAwMCxcbiAgICB1c2VNYXNrOiBmYWxzZVxuICB9XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xuICAgIHN1cGVyKCk7XG4gICAgJC5leHRlbmQodGhpcywgVG9hc3QuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTmFtZSArPSBgICR7cHJlZml4fWA7XG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gJzxwIGNsYXNzPVwiZGlhbG9nLWNvbnRlbnQtdGV4dFwiPjwvcD4nO1xuICAgIHRoaXMuY29udGVudCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctY29udGVudC10ZXh0Jyk7XG4gIH1cbiAgc2hvdyhvcHRpb25zID0ge30pIHtcbiAgICBpZighdGhpcy5tb3VudGVkKSB0aGlzLm1vdW50KCk7XG4gICAgdGhpcy5jb250ZW50SFRNTCA9IG9wdGlvbnMuY29udGVudEhUTUwgfHwgdGhpcy5jb250ZW50SFRNTDtcbiAgICB0aGlzLmNvbnRlbnQuaW5uZXJIVE1MID0gdGhpcy5jb250ZW50SFRNTDtcbiAgICBzdXBlci5zaG93KCk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXJJZCk7XG4gICAgdGhpcy50aW1lcklkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9LCBvcHRpb25zLmR1cmF0aW9uIHx8IHRoaXMuZHVyYXRpb24pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUb2FzdDtcbiIsIi8qKlxuICog55Sf5oiQ5ZSv5LiAOOS9jUlEXG4gKiBAdHlwZSB7W3R5cGVdfVxuICovXG5leHBvcnRzLnVuaXF1ZUlkID0gKGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgaWRzID0gW107XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGlkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoLTgpO1xuICAgIGlmKGlkcy5pbmRleE9mKGlkKSA8IDApe1xuICAgICAgaWRzLnB1c2goaWQpO1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH1lbHNle1xuICAgICAgcmV0dXJuIHVuaXF1ZUlkKClcbiAgICB9XG4gIH07XG59KSgpO1xuXG4vKipcbiAqIOWwhuS4gOS4quWtl+espuS4sua3u+WKoOWIsOaJgOaciemAieaLqeWZqOWQjlxuICogQHBhcmFtICB7W3R5cGVdfSBzdHlsZSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IHN0ciAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gYmxvb24gICBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0cy5hcHBlbmRUb1NlbGVjdG9yID0gZnVuY3Rpb24gKHN0eWxlLCBzdHIsIHRvVGFpbCkge1xuICBpZih0eXBlb2Ygc3R5bGUgPT09ICdzdHJpbmcnKXtcbiAgICBsZXQgcmVnID0gL1tefV0rW1xcc10qPyg/PVxccypcXHtbXFxzXFxTXSopL2dtO1xuICAgIGlmKHRvVGFpbCl7XG4gICAgICByZXR1cm4gc3R5bGUucmVwbGFjZShyZWcsIG1hdGNoID0+IGAke21hdGNoLnRyaW0oKX0ke3N0cn1gKVxuICAgIH1cbiAgICByZXR1cm4gc3R5bGUucmVwbGFjZShyZWcsIG1hdGNoID0+IGAke3N0cn0ke21hdGNoLnRyaW0oKX1gKVxuICB9ZWxzZXtcbiAgICB0aHJvdyAncGxlYXNlIHBhc3MgaW4gc3R5bGUgc2hlZXQgc3RyaW5nJ1xuICB9XG59XG5cbi8qKlxuICog5bCG5LiA5Liq5a2X56ym5LiyXG4gKiBAcGFyYW0gIHtbdHlwZV19IHN0eWxlIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gc3RyICAgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydHMucHJlQXBwZW5kVG9TZWxlY3RvciA9IGZ1bmN0aW9uIChzdHlsZSwgc3RyKSB7XG4gIGlmKHR5cGVvZiBzdHlsZSA9PT0gJ3N0cmluZycpe1xuICAgIGxldCByZWcgPSAvW159XStbXFxzXSo/KD89XFxzKlxce1tcXHNcXFNdKikvZ207XG4gICAgcmV0dXJuIHN0eWxlLnJlcGxhY2UocmVnLCBtYXRjaCA9PiBtYXRjaC50cmltKCkgKyBgWyR7c3RyfV1gKVxuICB9ZWxzZXtcbiAgICB0aHJvdyAncGxlYXNlIHBhc3MgaW4gc3R5bGUgc2hlZXQgc3RyaW5nJ1xuICB9XG59XG4iLCJjb25zdCBwcmVmaXggPSAnbWMtaW1hZ2UtdXBsb2FkZXInO1xuXG5jb25zdCBpbWFnZVVwbG9hZGVycyA9ICQoYC4ke3ByZWZpeH1gKTtcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9XG5cbmNsYXNzIEltYWdlVXBsb2FkZXIge1xuICBjb25zdHJ1Y3Rvcihkb20sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuaW1hZ2VVcGxvYWRlciA9ICQoZG9tKTtcblxuICAgIHRoaXMucGljdHVyZUxpc3QgPSB0aGlzLmltYWdlVXBsb2FkZXIuZmluZChgLiR7cHJlZml4fS1saXN0YCk7XG4gICAgdGhpcy5wbGFjZWhvbGRlckRvbSA9IHRoaXMuaW1hZ2VVcGxvYWRlci5maW5kKGAuJHtwcmVmaXh9LXBsYWNlaG9sZGVyYCk7XG4gICAgdGhpcy5pbnB1dERvbSA9ICQoJzxpbnB1dCB0eXBlPVwiZmlsZVwiPicpO1xuXG4gICAgdGhpcy5pdGVtRG9tcyA9IFtdO1xuICAgIHRoaXMuZmlsZUxpc3QgPSBbXTtcblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5vcHRpb25zLm9uQ2hhbmdlID0gdGhpcy5vcHRpb25zLm9uQ2hhbmdlIHx8IG5vb3A7XG4gICAgdGhpcy5vcHRpb25zLm9uUHJldmlldyA9IHRoaXMub3B0aW9ucy5vblByZXZpZXcgfHwgbm9vcDtcbiAgICB0aGlzLm9wdGlvbnMub25SZW1vdmUgPSB0aGlzLm9wdGlvbnMub25SZW1vdmUgfHwgbm9vcDtcblxuICAgIHRoaXMucmVuZGVyVGh1bWJuYWlsKCk7XG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHBpY2tJbWFnZSgpIHtcbiAgICB0aGlzLmlucHV0RG9tLmF0dHIoe1xuICAgICAgYWNjZXB0OiAnaW1hZ2UvKicsXG4gICAgfSk7XG4gICAgdGhpcy5pbnB1dERvbS5yZW1vdmVBdHRyKCdjYXB0dXJlJylcbiAgICB0aGlzLmlucHV0RG9tLnRyaWdnZXIoJ2NsaWNrJyk7XG4gIH1cblxuICBwaWNrRmlsZSgpIHtcbiAgICB0aGlzLmlucHV0RG9tXG4gICAgICAucmVtb3ZlQXR0cignYWNjZXB0JylcbiAgICAgIC5yZW1vdmVBdHRyKCdjYXB0dXJlJyk7XG4gICAgdGhpcy5pbnB1dERvbS50cmlnZ2VyKCdjbGljaycpO1xuICB9XG5cbiAgcGlja1dpdGhDYW1lcmEoKSB7XG4gICAgdGhpcy5pbnB1dERvbS5hdHRyKHtcbiAgICAgIGFjY2VwdDogJ2ltYWdlLyonLFxuICAgICAgY2FwdHVyZTogJ2NhbWVyYSdcbiAgICB9KTtcbiAgICB0aGlzLmlucHV0RG9tLnRyaWdnZXIoJ2NsaWNrJyk7XG4gIH1cblxuICByZWFkVGh1bWJuYWlsKGZpbGUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBlID0+IHtcbiAgICAgICAgcmVzb2x2ZShlLnRhcmdldC5yZXN1bHQpO1xuICAgICAgfVxuICAgICAgcmVhZGVyLm9uZXJyb3IgPSByZWplY3Q7XG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlclRodW1ibmFpbCgpIHtcbiAgICB0aGlzLnBpY3R1cmVMaXN0Lmh0bWwoXG4gICAgICB0aGlzLml0ZW1Eb21zLmNvbmNhdCgkKGA8c3BhbiBjbGFzcz1cIiR7cHJlZml4fS1wbGFjZWhvbGRlclwiPjwvc3Bhbj5gKSlcbiAgICApO1xuICB9XG5cbiAgaGFuZGxlSW5wdXRDaGFuZ2UoZSkge1xuICAgIGxldCBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF07XG4gICAgaWYgKGZpbGUpIHtcbiAgICAgIHRoaXMucmVhZFRodW1ibmFpbChmaWxlKVxuICAgICAgICAudGhlbihkYXRhID0+IHtcblxuICAgICAgICAgIGxldCB1cEZpbGVPYmplY3QgPSB7XG4gICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgdGh1bWJuYWlsOiBkYXRhLFxuICAgICAgICAgICAgc3RhdHVzOiAndXBsb2FkaW5nJyxcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaXNJbWFnZSA9IC9eaW1hZ2VcXC8uKi8udGVzdChmaWxlLnR5cGUpXG5cbiAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmZpbGVMaXN0Lmxlbmd0aDtcblxuICAgICAgICAgIHRoaXMuZmlsZUxpc3QgPSB0aGlzLmZpbGVMaXN0LmNvbmNhdCh1cEZpbGVPYmplY3QpO1xuXG4gICAgICAgICAgbGV0IHRodW1ibmFpbERvbSA9ICQoYDxzcGFuIGNsYXNzPVwiJHtwcmVmaXh9LWl0ZW1cIj5cbiAgICAgICAgICAgICAgJHtpc0ltYWdlP2A8aW1nIHNyYz1cIiR7dXBGaWxlT2JqZWN0LnRodW1ibmFpbH1cIiBhbHQ9XCJcIj5gOmA8c3BhbiBjbGFzcz0ke3ByZWZpeH0tZmlsZS1wbGFjZWhvbGRlcj48L3NwYW4+YH1cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCIke3ByZWZpeH0tcGVyY2VudGFnZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCIke3ByZWZpeH0tZmFpbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPGk+PC9pPlxuICAgICAgICAgICAgPC9zcGFuPmApO1xuXG4gICAgICAgICAgdGhpcy5pdGVtRG9tcyA9IHRoaXMuaXRlbURvbXMuY29uY2F0KHRodW1ibmFpbERvbSk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJUaHVtYm5haWwoKTtcbiAgICAgICAgICB0aGlzLnVwbG9hZEZpbGUodXBGaWxlT2JqZWN0LCB0aHVtYm5haWxEb20pO1xuICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdXBsb2FkRmlsZSh1cEZpbGVPYmplY3QsIHRodW1ibmFpbERvbSkge1xuICAgIGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZGF0YS5hcHBlbmQoXCJmaWxlXCIsIHVwRmlsZU9iamVjdC5maWxlKVxuXG4gICAgY29uc3QgaGFuZGxlUHJvZ3Jlc3MgPSAoZSkgPT4ge1xuICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICB0aHVtYm5haWxEb20uZmluZChgLiR7cHJlZml4fS1wZXJjZW50YWdlYCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB0aHVtYm5haWxEb20uZmluZChgLiR7cHJlZml4fS1wZXJjZW50YWdlYCkuaHRtbChNYXRoLnJvdW5kKGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMCkgKyBcIiVcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlVXBsb2FkU3VjY2VzcyA9IChlKSA9PiB7XG4gICAgICB1cEZpbGVPYmplY3Quc3RhdHVzID0gJ2RvbmUnO1xuICAgICAgdGh1bWJuYWlsRG9tLmZpbmQoYC4ke3ByZWZpeH0tcGVyY2VudGFnZWApLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgIHRoaXMub3B0aW9ucy5vbkNoYW5nZSh0aGlzLmZpbGVMaXN0KTtcbiAgICB9XG5cbiAgICBjb25zdCBoYW5kbGVVcGxvYWRGYWlsID0gKGUpID0+IHtcbiAgICAgIHVwRmlsZU9iamVjdC5zdGF0dXMgPSAnZXJyb3InO1xuICAgICAgdGh1bWJuYWlsRG9tLmZpbmQoYC4ke3ByZWZpeH0tZmFpbGApLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgIHRodW1ibmFpbERvbS5maW5kKGAuJHtwcmVmaXh9LXBlcmNlbnRhZ2VgKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICB0aGlzLm9wdGlvbnMub25DaGFuZ2UodGhpcy5maWxlTGlzdCk7XG4gICAgfVxuXG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgIHVybDogdGhpcy5vcHRpb25zLmFjdGlvbiB8fCAnJyxcbiAgICAgIGRhdGEsXG4gICAgICB4aHI6ICgpID0+IHtcbuOAgOOAgOOAgOOAgCBsZXQgeGhyID0gJC5hamF4U2V0dGluZ3MueGhyKCk7XG4gICAgICAgIHVwRmlsZU9iamVjdC54aHIgPSB4aHI7XG7jgIDjgIDjgIDjgIAgaWYoeGhyLnVwbG9hZCkge1xuICAgICAgICAgIHhoci5vbmVycm9yID0gaGFuZGxlVXBsb2FkRmFpbDtcbiAgICAgICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBoYW5kbGVQcm9ncmVzcztcbiAg44CA44CA44CAIH1cbiAgICAgICAgcmV0dXJuIHhocjtcbiAgICDjgIB9LFxuICAgICAgc3VjY2VzczogKGRhdGEsIHN0YXR1cywgeGhyKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmp1ZGdlciAhPT0gJ2Z1bmN0aW9uJyB8fCB0aGlzLm9wdGlvbnMuanVkZ2VyKGRhdGEpKSB7XG4gICAgICAgICAgdXBGaWxlT2JqZWN0LnJlc3BvbnNlRGF0YSA9IGRhdGE7XG4gICAgICAgICAgaGFuZGxlVXBsb2FkU3VjY2VzcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhhbmRsZVVwbG9hZEZhaWwoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVycm9yOiAoeGhyLCBlcnJvclR5cGUsIGVycm9yKSA9PiB7XG4gICAgICAgIGhhbmRsZVVwbG9hZEZhaWwoKTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlUmVtb3ZlSXRlbShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgbGV0IGNvbnRleHQgPSBlLmRhdGEuY29udGV4dDtcbiAgICBsZXQgaW5kZXggPSAkKHRoaXMpLnBhcmVudChgLiR7cHJlZml4fS1pdGVtYCkuaW5kZXgoKTtcbiAgICBsZXQgZmlsZSA9IGNvbnRleHQuZmlsZUxpc3RbaW5kZXhdO1xuICAgIGxldCBiZWZvcmVSZW1vdmUgPSBjb250ZXh0Lm9wdGlvbnMuYmVmb3JlUmVtb3ZlO1xuICAgIGxldCByZW1vdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnRleHQuZmlsZUxpc3RbaW5kZXhdLnhoci5hYm9ydCgpO1xuICAgICAgY29udGV4dC5pdGVtRG9tcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgY29udGV4dC5maWxlTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgY29udGV4dC5vcHRpb25zLm9uQ2hhbmdlKGNvbnRleHQuZmlsZUxpc3QpO1xuICAgICAgY29udGV4dC5vcHRpb25zLm9uUmVtb3ZlKGZpbGUsIGluZGV4LCBjb250ZXh0LmZpbGVMaXN0KVxuICAgICAgY29udGV4dC5yZW5kZXJUaHVtYm5haWwoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBiZWZvcmVSZW1vdmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGJlZm9yZVJlbW92ZShmaWxlLCBpbmRleCwgY29udGV4dC5maWxlTGlzdCwgcmVtb3ZlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZW1vdmUoKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVByZXZpZXcoZSkge1xuICAgIGxldCBjb250ZXh0ID0gZS5kYXRhLmNvbnRleHQ7XG4gICAgbGV0IGluZGV4ID0gJCh0aGlzKS5pbmRleCgpO1xuICAgIGNvbnRleHQub3B0aW9ucy5vblByZXZpZXcoY29udGV4dC5maWxlTGlzdCwgaW5kZXgpO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmN1c3RvbVRyaWdnZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuaW1hZ2VVcGxvYWRlci5vbignY2xpY2snLCBgLiR7cHJlZml4fS1wbGFjZWhvbGRlcmAsIG9wdGlvbnMuY3VzdG9tVHJpZ2dlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW1hZ2VVcGxvYWRlci5vbignY2xpY2snLCBgLiR7cHJlZml4fS1wbGFjZWhvbGRlcmAsIHRoaXMuaGFuZGxlUGljay5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgdGhpcy5pbWFnZVVwbG9hZGVyLm9uKCdjaGFuZ2UnLCBgLiR7cHJlZml4fS1pbnB1dGAsIHRoaXMuaGFuZGxlSW5wdXRDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5pbWFnZVVwbG9hZGVyLm9uKCdjbGljaycsIGAuJHtwcmVmaXh9LWl0ZW1gLHtcbiAgICAgIGNvbnRleHQ6IHRoaXNcbiAgICB9LCB0aGlzLmhhbmRsZVByZXZpZXcpO1xuXG4gICAgdGhpcy5pbWFnZVVwbG9hZGVyLm9uKCdjbGljaycsIGBpYCwge1xuICAgICAgY29udGV4dDogdGhpc1xuICAgIH0sIHRoaXMuaGFuZGxlUmVtb3ZlSXRlbSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZVVwbG9hZGVyO1xuXG4vLyAkLmVhY2goaW1hZ2VVcGxvYWRlcnMsIChpbmRleCwgaW1hZ2VVcGxvYWRlcikgPT4ge1xuLy8gICBuZXcgSW1hZ2VVcGxvYWRlcihpbWFnZVVwbG9hZGVyKS5pbml0KClcbi8vIH0pXG4iLCIvKiFcbiAqIG1vYmlsZVNlbGVjdC5qc1xuICogKGMpIDIwMTctcHJlc2VudCBvbmx5aG9tXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuXHRmdW5jdGlvbiBnZXRDbGFzcyhkb20sc3RyaW5nKSB7XG5cdFx0cmV0dXJuIGRvbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHN0cmluZyk7XG5cdH1cblx0Ly/mnoTpgKDlmahcblx0ZnVuY3Rpb24gTW9iaWxlU2VsZWN0KGNvbmZpZykge1xuXHRcdHRoaXMubW9iaWxlU2VsZWN0O1xuXHRcdHRoaXMud2hlZWxzRGF0YSA9IGNvbmZpZy53aGVlbHM7XG5cdFx0dGhpcy5qc29uVHlwZSA9ICBmYWxzZTtcblx0XHR0aGlzLmNhc2NhZGVKc29uRGF0YSA9IFtdO1xuXHRcdHRoaXMuZGlzcGxheUpzb24gPSBbXTtcblx0XHR0aGlzLmN1clZhbHVlID0gW107XG5cdFx0dGhpcy5jdXJJbmRleEFyciA9IFtdO1xuXHRcdHRoaXMuY2FzY2FkZSA9IGZhbHNlO1xuXHRcdHRoaXMuc3RhcnRZO1xuXHRcdHRoaXMubW92ZUVuZFk7XG5cdFx0dGhpcy5tb3ZlWTtcblx0XHR0aGlzLm9sZE1vdmVZO1xuXHRcdHRoaXMub2Zmc2V0ID0gMDtcblx0XHR0aGlzLm9mZnNldFN1bSA9IDA7XG5cdFx0dGhpcy5vdmVyc2l6ZUJvcmRlcjtcblx0XHR0aGlzLmN1ckRpc3RhbmNlID0gW107XG5cdFx0dGhpcy5jbGlja1N0YXR1cyA9IGZhbHNlO1xuXHRcdHRoaXMuaXNQQyA9IHRydWU7XG5cdFx0dGhpcy5pbml0KGNvbmZpZyk7XG5cdH1cblx0TW9iaWxlU2VsZWN0LnByb3RvdHlwZSA9IHtcblx0XHRjb25zdHJ1Y3RvcjogTW9iaWxlU2VsZWN0LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKGNvbmZpZyl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0aWYoY29uZmlnLndoZWVsc1swXS5kYXRhLmxlbmd0aD09MCl7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ21vYmlsZVNlbGVjdCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgaW5zdGFsbGVkLCBidXQgdGhlIGRhdGEgaXMgZW1wdHkgYW5kIGNhbm5vdCBiZSBpbml0aWFsaXplZC4nKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0X3RoaXMua2V5TWFwID0gY29uZmlnLmtleU1hcCA/IGNvbmZpZy5rZXlNYXAgOiB7aWQ6J2lkJywgdmFsdWU6J3ZhbHVlJywgY2hpbGRzOidjaGlsZHMnfTtcblx0XHRcdF90aGlzLmNoZWNrRGF0YVR5cGUoKTtcblx0XHRcdF90aGlzLnJlbmRlcldoZWVscyhfdGhpcy53aGVlbHNEYXRhLCBjb25maWcuY2FuY2VsQnRuVGV4dCwgY29uZmlnLmVuc3VyZUJ0blRleHQpO1xuXHRcdFx0X3RoaXMudHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29uZmlnLnRyaWdnZXIpO1xuXHRcdFx0aWYoIV90aGlzLnRyaWdnZXIpe1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdtb2JpbGVTZWxlY3QgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGluc3RhbGxlZCwgYnV0IG5vIHRyaWdnZXIgZm91bmQgb24geW91ciBwYWdlLicpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRfdGhpcy53aGVlbCA9IGdldENsYXNzKF90aGlzLm1vYmlsZVNlbGVjdCwnd2hlZWwnKTtcblx0XHRcdF90aGlzLnNsaWRlciA9IGdldENsYXNzKF90aGlzLm1vYmlsZVNlbGVjdCwnc2VsZWN0Q29udGFpbmVyJyk7XG5cdFx0XHRfdGhpcy53aGVlbHMgPSBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLndoZWVscycpO1xuXHRcdFx0X3RoaXMubGlIZWlnaHQgPSBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignbGknKS5vZmZzZXRIZWlnaHQ7XG5cdFx0XHRfdGhpcy5lbnN1cmVCdG4gPSBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLmVuc3VyZScpO1xuXHRcdFx0X3RoaXMuY2FuY2VsQnRuID0gX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy5jYW5jZWwnKTtcblx0XHRcdF90aGlzLmdyYXlMYXllciA9IF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcuZ3JheUxheWVyJyk7XG5cdFx0XHRfdGhpcy5wb3BVcCA9IF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcuY29udGVudCcpO1xuXHRcdFx0X3RoaXMuY2FsbGJhY2sgPSBjb25maWcuY2FsbGJhY2sgfHwgZnVuY3Rpb24oKXt9O1xuXHRcdFx0X3RoaXMuY2FuY2VsID0gY29uZmlnLmNhbmNlbCB8fCBmdW5jdGlvbigpe307XG5cdFx0XHRfdGhpcy50cmFuc2l0aW9uRW5kID0gY29uZmlnLnRyYW5zaXRpb25FbmQgfHwgZnVuY3Rpb24oKXt9O1xuXHRcdFx0X3RoaXMub25TaG93ID0gY29uZmlnLm9uU2hvdyB8fCBmdW5jdGlvbigpe307XG5cdFx0XHRfdGhpcy5vbkhpZGUgPSBjb25maWcub25IaWRlIHx8IGZ1bmN0aW9uKCl7fTtcblx0XHRcdF90aGlzLmluaXRQb3NpdGlvbiA9IGNvbmZpZy5wb3NpdGlvbiB8fCBbXTtcblx0XHRcdF90aGlzLnRpdGxlVGV4dCA9IGNvbmZpZy50aXRsZSB8fCAnJztcblx0XHRcdF90aGlzLmNvbm5lY3RvciA9IGNvbmZpZy5jb25uZWN0b3IgfHwgJyAnO1xuXHRcdFx0X3RoaXMudHJpZ2dlckRpc3BsYXlEYXRhID0gISh0eXBlb2YoY29uZmlnLnRyaWdnZXJEaXNwbGF5RGF0YSk9PSd1bmRlZmluZWQnKSA/IGNvbmZpZy50cmlnZ2VyRGlzcGxheURhdGEgOiB0cnVlO1xuXHRcdFx0X3RoaXMudHJpZ2dlci5zdHlsZS5jdXJzb3I9J3BvaW50ZXInO1xuXHRcdFx0X3RoaXMuc2V0U3R5bGUoY29uZmlnKTtcblx0XHRcdF90aGlzLnNldFRpdGxlKF90aGlzLnRpdGxlVGV4dCk7XG5cdFx0XHRfdGhpcy5jaGVja0lzUEMoKTtcblx0XHRcdF90aGlzLmNoZWNrQ2FzY2FkZSgpO1xuXHRcdFx0X3RoaXMuYWRkTGlzdGVuZXJBbGwoKTtcblxuXHRcdFx0aWYgKF90aGlzLmNhc2NhZGUpIHtcblx0XHRcdFx0X3RoaXMuaW5pdENhc2NhZGUoKTtcblx0XHRcdH1cblx0XHRcdC8v5a6a5L2NIOWIneWni+S9jee9rlxuXHRcdFx0aWYoX3RoaXMuaW5pdFBvc2l0aW9uLmxlbmd0aCA8IF90aGlzLnNsaWRlci5sZW5ndGgpe1xuXHRcdFx0XHR2YXIgZGlmZiA9IF90aGlzLnNsaWRlci5sZW5ndGggLSBfdGhpcy5pbml0UG9zaXRpb24ubGVuZ3RoO1xuXHRcdFx0XHRmb3IodmFyIGk9MDsgaTxkaWZmOyBpKyspe1xuXHRcdFx0XHRcdF90aGlzLmluaXRQb3NpdGlvbi5wdXNoKDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdF90aGlzLnNldEN1ckRpc3RhbmNlKF90aGlzLmluaXRQb3NpdGlvbik7XG5cblxuXHRcdFx0Ly/mjInpkq7nm5HlkKxcblx0XHRcdF90aGlzLmNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24oKXtcblx0XHRcdFx0X3RoaXMuaGlkZSgpO1xuXHRcdFx0XHRfdGhpcy5jYW5jZWwoX3RoaXMuY3VySW5kZXhBcnIsIF90aGlzLmN1clZhbHVlKTtcblx0XHQgICAgfSk7XG5cblx0XHQgICAgX3RoaXMuZW5zdXJlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbigpe1xuXHRcdFx0XHRfdGhpcy5oaWRlKCk7XG5cdFx0XHQgICAgaWYoIV90aGlzLmxpSGVpZ2h0KSB7XG5cdFx0XHQgICAgICAgIF90aGlzLmxpSGVpZ2h0ID0gIF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCdsaScpLm9mZnNldEhlaWdodDtcblx0XHRcdCAgICB9XG5cdFx0XHRcdHZhciB0ZW1wVmFsdWUgPScnO1xuXHRcdCAgICBcdGZvcih2YXIgaT0wOyBpPF90aGlzLndoZWVsLmxlbmd0aDsgaSsrKXtcblx0XHQgICAgXHRcdGk9PV90aGlzLndoZWVsLmxlbmd0aC0xID8gdGVtcFZhbHVlICs9IF90aGlzLmdldElubmVySHRtbChpKSA6IHRlbXBWYWx1ZSArPSBfdGhpcy5nZXRJbm5lckh0bWwoaSkgKyBfdGhpcy5jb25uZWN0b3I7XG5cdFx0ICAgIFx0fVxuXHRcdCAgICBcdGlmKF90aGlzLnRyaWdnZXJEaXNwbGF5RGF0YSl7XG5cdFx0ICAgIFx0XHRfdGhpcy50cmlnZ2VyLmlubmVySFRNTCA9IHRlbXBWYWx1ZTtcblx0XHQgICAgXHR9XG5cdFx0ICAgIFx0X3RoaXMuY3VySW5kZXhBcnIgPSBfdGhpcy5nZXRJbmRleEFycigpO1xuXHRcdCAgICBcdF90aGlzLmN1clZhbHVlID0gX3RoaXMuZ2V0Q3VyVmFsdWUoKTtcblx0XHQgICAgXHRfdGhpcy5jYWxsYmFjayhfdGhpcy5jdXJJbmRleEFyciwgX3RoaXMuY3VyVmFsdWUpO1xuXHRcdCAgICB9KTtcblxuXHRcdCAgICBfdGhpcy50cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbigpe1xuXHRcdCAgICBcdF90aGlzLnNob3coKTtcblx0XHQgICAgfSk7XG5cdFx0ICAgIF90aGlzLmdyYXlMYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24oKXtcblx0XHRcdFx0X3RoaXMuaGlkZSgpO1xuXHRcdFx0XHRfdGhpcy5jYW5jZWwoX3RoaXMuY3VySW5kZXhBcnIsIF90aGlzLmN1clZhbHVlKTtcblx0XHQgICAgfSk7XG5cdFx0ICAgIF90aGlzLnBvcFVwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbigpe1xuXHRcdCAgICBcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdCAgICB9KTtcblxuXHRcdFx0X3RoaXMuZml4Um93U3R5bGUoKTsgLy/kv67mraPliJfmlbBcblx0XHR9LFxuXG5cdFx0c2V0VGl0bGU6IGZ1bmN0aW9uKHN0cmluZyl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0X3RoaXMudGl0bGVUZXh0ID0gc3RyaW5nO1xuXHRcdFx0X3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpLmlubmVySFRNTCA9IF90aGlzLnRpdGxlVGV4dDtcblx0XHR9LFxuXG5cdFx0c2V0U3R5bGU6IGZ1bmN0aW9uKGNvbmZpZyl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0aWYoY29uZmlnLmVuc3VyZUJ0bkNvbG9yKXtcblx0XHRcdFx0X3RoaXMuZW5zdXJlQnRuLnN0eWxlLmNvbG9yID0gY29uZmlnLmVuc3VyZUJ0bkNvbG9yO1xuXHRcdFx0fVxuXHRcdFx0aWYoY29uZmlnLmNhbmNlbEJ0bkNvbG9yKXtcblx0XHRcdFx0X3RoaXMuY2FuY2VsQnRuLnN0eWxlLmNvbG9yID0gY29uZmlnLmNhbmNlbEJ0bkNvbG9yO1xuXHRcdFx0fVxuXHRcdFx0aWYoY29uZmlnLnRpdGxlQ29sb3Ipe1xuXHRcdFx0XHRfdGhpcy50aXRsZSA9IF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKTtcblx0XHRcdFx0X3RoaXMudGl0bGUuc3R5bGUuY29sb3IgPSBjb25maWcudGl0bGVDb2xvcjtcblx0XHRcdH1cblx0XHRcdGlmKGNvbmZpZy50ZXh0Q29sb3Ipe1xuXHRcdFx0XHRfdGhpcy5wYW5lbCA9IF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcucGFuZWwnKTtcblx0XHRcdFx0X3RoaXMucGFuZWwuc3R5bGUuY29sb3IgPSBjb25maWcudGV4dENvbG9yO1xuXHRcdFx0fVxuXHRcdFx0aWYoY29uZmlnLnRpdGxlQmdDb2xvcil7XG5cdFx0XHRcdF90aGlzLmJ0bkJhciA9IF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcuYnRuQmFyJyk7XG5cdFx0XHRcdF90aGlzLmJ0bkJhci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb25maWcudGl0bGVCZ0NvbG9yO1xuXHRcdFx0fVxuXHRcdFx0aWYoY29uZmlnLmJnQ29sb3Ipe1xuXHRcdFx0XHRfdGhpcy5wYW5lbCA9IF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcucGFuZWwnKTtcblx0XHRcdFx0X3RoaXMuc2hhZG93TWFzayA9IF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcuc2hhZG93TWFzaycpO1xuXHRcdFx0XHRfdGhpcy5wYW5lbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb25maWcuYmdDb2xvcjtcblx0XHRcdFx0X3RoaXMuc2hhZG93TWFzay5zdHlsZS5iYWNrZ3JvdW5kID0gJ2xpbmVhci1ncmFkaWVudCh0byBib3R0b20sICcrIGNvbmZpZy5iZ0NvbG9yICsgJywgcmdiYSgyNTUsIDI1NSwgMjU1LCAwKSwgJysgY29uZmlnLmJnQ29sb3IgKyAnKSc7XG5cdFx0XHR9XG5cdFx0XHRpZighaXNOYU4oY29uZmlnLm1hc2tPcGFjaXR5KSl7XG5cdFx0XHRcdF90aGlzLmdyYXlNYXNrID0gX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy5ncmF5TGF5ZXInKTtcblx0XHRcdFx0X3RoaXMuZ3JheU1hc2suc3R5bGUuYmFja2dyb3VuZCA9ICdyZ2JhKDAsIDAsIDAsICcrIGNvbmZpZy5tYXNrT3BhY2l0eSArJyknO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRjaGVja0lzUEM6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0dmFyIHNVc2VyQWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR2YXIgYklzSXBhZCA9IHNVc2VyQWdlbnQubWF0Y2goL2lwYWQvaSkgPT0gXCJpcGFkXCI7XG5cdFx0XHR2YXIgYklzSXBob25lT3MgPSBzVXNlckFnZW50Lm1hdGNoKC9pcGhvbmUgb3MvaSkgPT0gXCJpcGhvbmUgb3NcIjtcblx0XHRcdHZhciBiSXNNaWRwID0gc1VzZXJBZ2VudC5tYXRjaCgvbWlkcC9pKSA9PSBcIm1pZHBcIjtcblx0XHRcdHZhciBiSXNVYzcgPSBzVXNlckFnZW50Lm1hdGNoKC9ydjoxLjIuMy40L2kpID09IFwicnY6MS4yLjMuNFwiO1xuXHRcdFx0dmFyIGJJc1VjID0gc1VzZXJBZ2VudC5tYXRjaCgvdWN3ZWIvaSkgPT0gXCJ1Y3dlYlwiO1xuXHRcdFx0dmFyIGJJc0FuZHJvaWQgPSBzVXNlckFnZW50Lm1hdGNoKC9hbmRyb2lkL2kpID09IFwiYW5kcm9pZFwiO1xuXHRcdFx0dmFyIGJJc0NFID0gc1VzZXJBZ2VudC5tYXRjaCgvd2luZG93cyBjZS9pKSA9PSBcIndpbmRvd3MgY2VcIjtcblx0XHRcdHZhciBiSXNXTSA9IHNVc2VyQWdlbnQubWF0Y2goL3dpbmRvd3MgbW9iaWxlL2kpID09IFwid2luZG93cyBtb2JpbGVcIjtcblx0XHRcdGlmICgoYklzSXBhZCB8fCBiSXNJcGhvbmVPcyB8fCBiSXNNaWRwIHx8IGJJc1VjNyB8fCBiSXNVYyB8fCBiSXNBbmRyb2lkIHx8IGJJc0NFIHx8IGJJc1dNKSkge1xuXHRcdFx0ICAgIF90aGlzLmlzUEMgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9LFxuXG4gXHRcdHNob3c6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLm1vYmlsZVNlbGVjdC5jbGFzc0xpc3QuYWRkKCdtb2JpbGVTZWxlY3Qtc2hvdycpO1xuXHRcdFx0aWYgKHR5cGVvZiB0aGlzLm9uU2hvdyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR0aGlzLm9uU2hvdyh0aGlzKTtcblx0XHRcdH1cbiAgXHRcdH0sXG5cblx0ICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5tb2JpbGVTZWxlY3QuY2xhc3NMaXN0LnJlbW92ZSgnbW9iaWxlU2VsZWN0LXNob3cnKTtcblx0XHRcdGlmICh0eXBlb2YgdGhpcy5vbkhpZGUgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0dGhpcy5vbkhpZGUodGhpcyk7XG5cdFx0XHR9XG5cdCAgICB9LFxuXG5cdFx0cmVuZGVyV2hlZWxzOiBmdW5jdGlvbih3aGVlbHNEYXRhLCBjYW5jZWxCdG5UZXh0LCBlbnN1cmVCdG5UZXh0KXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHR2YXIgY2FuY2VsVGV4dCA9IGNhbmNlbEJ0blRleHQgPyBjYW5jZWxCdG5UZXh0IDogJ+WPlua2iCc7XG5cdFx0XHR2YXIgZW5zdXJlVGV4dCA9IGVuc3VyZUJ0blRleHQgPyBlbnN1cmVCdG5UZXh0IDogJ+ehruiupCc7XG5cdFx0XHRfdGhpcy5tb2JpbGVTZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0X3RoaXMubW9iaWxlU2VsZWN0LmNsYXNzTmFtZSA9IFwibW9iaWxlU2VsZWN0XCI7XG5cdFx0XHRfdGhpcy5tb2JpbGVTZWxlY3QuaW5uZXJIVE1MID1cblx0XHQgICAgXHQnPGRpdiBjbGFzcz1cImdyYXlMYXllclwiPjwvZGl2PicrXG5cdFx0ICAgICAgICAnPGRpdiBjbGFzcz1cImNvbnRlbnRcIj4nK1xuXHRcdCAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYnRuQmFyXCI+Jytcblx0XHQgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmaXhXaWR0aFwiPicrXG5cdFx0ICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNhbmNlbFwiPicrIGNhbmNlbFRleHQgKyc8L2Rpdj4nK1xuXHRcdCAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ0aXRsZVwiPjwvZGl2PicrXG5cdFx0ICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImVuc3VyZVwiPicrIGVuc3VyZVRleHQgKyc8L2Rpdj4nK1xuXHRcdCAgICAgICAgICAgICAgICAnPC9kaXY+Jytcblx0XHQgICAgICAgICAgICAnPC9kaXY+Jytcblx0XHQgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBhbmVsXCI+Jytcblx0XHQgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmaXhXaWR0aFwiPicrXG5cdFx0ICAgICAgICAgICAgICAgIFx0JzxkaXYgY2xhc3M9XCJ3aGVlbHNcIj4nK1xuXHRcdFx0ICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuXHRcdCAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJzZWxlY3RMaW5lXCI+PC9kaXY+Jytcblx0XHQgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic2hhZG93TWFza1wiPjwvZGl2PicrXG5cdFx0ICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuXHRcdCAgICAgICAgICAgICc8L2Rpdj4nK1xuXHRcdCAgICAgICAgJzwvZGl2Pic7XG5cdFx0ICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoX3RoaXMubW9iaWxlU2VsZWN0KTtcblxuXHRcdFx0Ly/moLnmja7mlbDmja7plb/luqbmnaXmuLLmn5NcblxuXHRcdFx0dmFyIHRlbXBIVE1MPScnO1xuXHRcdFx0Zm9yKHZhciBpPTA7IGk8d2hlZWxzRGF0YS5sZW5ndGg7IGkrKyl7XG5cdFx0XHQvL+WIl1xuXHRcdFx0XHR0ZW1wSFRNTCArPSAnPGRpdiBjbGFzcz1cIndoZWVsXCI+PHVsIGNsYXNzPVwic2VsZWN0Q29udGFpbmVyXCI+Jztcblx0XHRcdFx0aWYoX3RoaXMuanNvblR5cGUpe1xuXHRcdFx0XHRcdGZvcih2YXIgaj0wOyBqPHdoZWVsc0RhdGFbaV0uZGF0YS5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdFx0Ly/ooYxcblx0XHRcdFx0XHRcdHRlbXBIVE1MICs9ICc8bGkgZGF0YS1pZD1cIicrd2hlZWxzRGF0YVtpXS5kYXRhW2pdW190aGlzLmtleU1hcC5pZF0rJ1wiPicrd2hlZWxzRGF0YVtpXS5kYXRhW2pdW190aGlzLmtleU1hcC52YWx1ZV0rJzwvbGk+Jztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGZvcih2YXIgaj0wOyBqPHdoZWVsc0RhdGFbaV0uZGF0YS5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdFx0Ly/ooYxcblx0XHRcdFx0XHRcdHRlbXBIVE1MICs9ICc8bGk+Jyt3aGVlbHNEYXRhW2ldLmRhdGFbal0rJzwvbGk+Jztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dGVtcEhUTUwgKz0gJzwvdWw+PC9kaXY+Jztcblx0XHRcdH1cblx0XHRcdF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcud2hlZWxzJykuaW5uZXJIVE1MID0gdGVtcEhUTUw7XG5cdFx0fSxcblxuXHRcdGFkZExpc3RlbmVyQWxsOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdGZvcih2YXIgaT0wOyBpPF90aGlzLnNsaWRlci5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdC8v5omL5Yq/55uR5ZCsXG5cdFx0XHRcdChmdW5jdGlvbiAoaSkge1xuXHRcdFx0XHRcdF90aGlzLmFkZExpc3RlbmVyV2hlZWwoX3RoaXMud2hlZWxbaV0sIGkpO1xuXHRcdFx0XHR9KShpKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0YWRkTGlzdGVuZXJXaGVlbDogZnVuY3Rpb24odGhlV2hlZWwsIGluZGV4KXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHR0aGVXaGVlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRfdGhpcy50b3VjaChldmVudCwgdGhpcy5maXJzdENoaWxkLCBpbmRleCk7XG5cdFx0XHR9LGZhbHNlKTtcblx0XHRcdHRoZVdoZWVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRfdGhpcy50b3VjaChldmVudCwgdGhpcy5maXJzdENoaWxkLCBpbmRleCk7XG5cdFx0XHR9LGZhbHNlKTtcblx0XHRcdHRoZVdoZWVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0X3RoaXMudG91Y2goZXZlbnQsIHRoaXMuZmlyc3RDaGlsZCwgaW5kZXgpO1xuXHRcdFx0fSxmYWxzZSk7XG5cblx0XHRcdGlmKF90aGlzLmlzUEMpe1xuXHRcdFx0XHQvL+WmguaenOaYr1BD56uv5YiZ5YaN5aKe5Yqg5ouW5ou955uR5ZCsIOaWueS+v+iwg+ivlVxuXHRcdFx0XHR0aGVXaGVlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0X3RoaXMuZHJhZ0NsaWNrKGV2ZW50LCB0aGlzLmZpcnN0Q2hpbGQsIGluZGV4KTtcblx0XHRcdFx0fSxmYWxzZSk7XG5cdFx0XHRcdHRoZVdoZWVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRfdGhpcy5kcmFnQ2xpY2soZXZlbnQsIHRoaXMuZmlyc3RDaGlsZCwgaW5kZXgpO1xuXHRcdFx0XHR9LGZhbHNlKTtcblx0XHRcdFx0dGhlV2hlZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRfdGhpcy5kcmFnQ2xpY2soZXZlbnQsIHRoaXMuZmlyc3RDaGlsZCwgaW5kZXgpO1xuXHRcdFx0XHR9LHRydWUpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRjaGVja0RhdGFUeXBlOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdGlmKHR5cGVvZihfdGhpcy53aGVlbHNEYXRhWzBdLmRhdGFbMF0pPT0nb2JqZWN0Jyl7XG5cdFx0XHRcdF90aGlzLmpzb25UeXBlID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Y2hlY2tDYXNjYWRlOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdGlmKF90aGlzLmpzb25UeXBlKXtcblx0XHRcdFx0dmFyIG5vZGUgPSBfdGhpcy53aGVlbHNEYXRhWzBdLmRhdGE7XG5cdFx0XHRcdGZvcih2YXIgaT0wOyBpPG5vZGUubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdGlmKF90aGlzLmtleU1hcC5jaGlsZHMgaW4gbm9kZVtpXSAmJiBub2RlW2ldW190aGlzLmtleU1hcC5jaGlsZHNdLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRcdFx0X3RoaXMuY2FzY2FkZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRfdGhpcy5jYXNjYWRlSnNvbkRhdGEgPSBfdGhpcy53aGVlbHNEYXRhWzBdLmRhdGE7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNle1xuXHRcdFx0XHRfdGhpcy5jYXNjYWRlID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGdlbmVyYXRlQXJyRGF0YTogZnVuY3Rpb24gKHRhcmdldEFycikge1xuXHRcdFx0dmFyIHRlbXBBcnIgPSBbXTtcblx0XHRcdHZhciBrZXlNYXBfaWQgPSB0aGlzLmtleU1hcC5pZDtcblx0XHRcdHZhciBrZXlNYXBfdmFsdWUgPSB0aGlzLmtleU1hcC52YWx1ZTtcblx0XHRcdGZvcih2YXIgaT0wOyBpPHRhcmdldEFyci5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdHZhciB0ZW1wT2JqID0ge307XG5cdFx0XHRcdHRlbXBPYmpba2V5TWFwX2lkXSA9IHRhcmdldEFycltpXVt0aGlzLmtleU1hcC5pZF07XG5cdFx0XHRcdHRlbXBPYmpba2V5TWFwX3ZhbHVlXSA9IHRhcmdldEFycltpXVt0aGlzLmtleU1hcC52YWx1ZV07XG5cdFx0XHRcdHRlbXBBcnIucHVzaCh0ZW1wT2JqKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0ZW1wQXJyO1xuXHRcdH0sXG5cblx0XHRpbml0Q2FzY2FkZTogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRfdGhpcy5kaXNwbGF5SnNvbi5wdXNoKF90aGlzLmdlbmVyYXRlQXJyRGF0YShfdGhpcy5jYXNjYWRlSnNvbkRhdGEpKTtcblx0XHRcdGlmKF90aGlzLmluaXRQb3NpdGlvbi5sZW5ndGg+MCl7XG5cdFx0XHRcdF90aGlzLmluaXREZWVwQ291bnQgPSAwO1xuXHRcdFx0XHRfdGhpcy5pbml0Q2hlY2tBcnJEZWVwKF90aGlzLmNhc2NhZGVKc29uRGF0YVtfdGhpcy5pbml0UG9zaXRpb25bMF1dKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRfdGhpcy5jaGVja0FyckRlZXAoX3RoaXMuY2FzY2FkZUpzb25EYXRhWzBdKTtcblx0XHRcdH1cblx0XHRcdF90aGlzLnJlUmVuZGVyV2hlZWxzKCk7XG5cdFx0fSxcblxuXHRcdGluaXRDaGVja0FyckRlZXA6IGZ1bmN0aW9uIChwYXJlbnQpIHtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRpZihwYXJlbnQpe1xuXHRcdFx0XHRpZiAoX3RoaXMua2V5TWFwLmNoaWxkcyBpbiBwYXJlbnQgJiYgcGFyZW50W190aGlzLmtleU1hcC5jaGlsZHNdLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRfdGhpcy5kaXNwbGF5SnNvbi5wdXNoKF90aGlzLmdlbmVyYXRlQXJyRGF0YShwYXJlbnRbX3RoaXMua2V5TWFwLmNoaWxkc10pKTtcblx0XHRcdFx0XHRfdGhpcy5pbml0RGVlcENvdW50Kys7XG5cdFx0XHRcdFx0dmFyIG5leHROb2RlID0gcGFyZW50W190aGlzLmtleU1hcC5jaGlsZHNdW190aGlzLmluaXRQb3NpdGlvbltfdGhpcy5pbml0RGVlcENvdW50XV07XG5cdFx0XHRcdFx0aWYobmV4dE5vZGUpe1xuXHRcdFx0XHRcdFx0X3RoaXMuaW5pdENoZWNrQXJyRGVlcChuZXh0Tm9kZSk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRfdGhpcy5jaGVja0FyckRlZXAocGFyZW50W190aGlzLmtleU1hcC5jaGlsZHNdWzBdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Y2hlY2tBcnJEZWVwOiBmdW5jdGlvbiAocGFyZW50KSB7XG5cdFx0XHQvL+ajgOa1i+WtkOiKgueCuea3seW6piAg5L+u5pS5IGRpc3BsYXlKc29uXG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0aWYocGFyZW50KXtcblx0XHRcdFx0aWYgKF90aGlzLmtleU1hcC5jaGlsZHMgaW4gcGFyZW50ICYmIHBhcmVudFtfdGhpcy5rZXlNYXAuY2hpbGRzXS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0X3RoaXMuZGlzcGxheUpzb24ucHVzaChfdGhpcy5nZW5lcmF0ZUFyckRhdGEocGFyZW50W190aGlzLmtleU1hcC5jaGlsZHNdKSk7IC8v55Sf5oiQ5a2Q6IqC54K55pWw57uEXG5cdFx0XHRcdFx0X3RoaXMuY2hlY2tBcnJEZWVwKHBhcmVudFtfdGhpcy5rZXlNYXAuY2hpbGRzXVswXSk7Ly/mo4DmtYvkuIvkuIDkuKrlrZDoioLngrlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRjaGVja1JhbmdlOiBmdW5jdGlvbihpbmRleCwgcG9zSW5kZXhBcnIpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdHZhciBkZWxldGVOdW0gPSBfdGhpcy5kaXNwbGF5SnNvbi5sZW5ndGgtMS1pbmRleDtcblx0XHRcdGZvcih2YXIgaT0wOyBpPGRlbGV0ZU51bTsgaSsrKXtcblx0XHRcdFx0X3RoaXMuZGlzcGxheUpzb24ucG9wKCk7IC8v5L+u5pS5IGRpc3BsYXlKc29uXG5cdFx0XHR9XG5cdFx0XHR2YXIgcmVzdWx0Tm9kZTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IGluZGV4OyBpKyspe1xuXHRcdFx0XHRpZiAoaSA9PSAwKVxuXHRcdFx0XHRcdHJlc3VsdE5vZGUgPSBfdGhpcy5jYXNjYWRlSnNvbkRhdGFbcG9zSW5kZXhBcnJbMF1dO1xuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRyZXN1bHROb2RlID0gcmVzdWx0Tm9kZVtfdGhpcy5rZXlNYXAuY2hpbGRzXVtwb3NJbmRleEFycltpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdF90aGlzLmNoZWNrQXJyRGVlcChyZXN1bHROb2RlKTtcblx0XHRcdC8vY29uc29sZS5sb2coX3RoaXMuZGlzcGxheUpzb24pO1xuXHRcdFx0X3RoaXMucmVSZW5kZXJXaGVlbHMoKTtcblx0XHRcdF90aGlzLmZpeFJvd1N0eWxlKCk7XG5cdFx0XHRfdGhpcy5zZXRDdXJEaXN0YW5jZShfdGhpcy5yZXNldFBvc2l0aW9uKGluZGV4LCBwb3NJbmRleEFycikpO1xuXHRcdH0sXG5cblx0XHRyZXNldFBvc2l0aW9uOiBmdW5jdGlvbihpbmRleCwgcG9zSW5kZXhBcnIpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdHZhciB0ZW1wUG9zQXJyID0gcG9zSW5kZXhBcnI7XG5cdFx0XHR2YXIgdGVtcENvdW50O1xuXHRcdFx0aWYoX3RoaXMuc2xpZGVyLmxlbmd0aCA+IHBvc0luZGV4QXJyLmxlbmd0aCl7XG5cdFx0XHRcdHRlbXBDb3VudCA9IF90aGlzLnNsaWRlci5sZW5ndGggLSBwb3NJbmRleEFyci5sZW5ndGg7XG5cdFx0XHRcdGZvcih2YXIgaT0wOyBpPHRlbXBDb3VudDsgaSsrKXtcblx0XHRcdFx0XHR0ZW1wUG9zQXJyLnB1c2goMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNlIGlmKF90aGlzLnNsaWRlci5sZW5ndGggPCBwb3NJbmRleEFyci5sZW5ndGgpe1xuXHRcdFx0XHR0ZW1wQ291bnQgPSBwb3NJbmRleEFyci5sZW5ndGggLSBfdGhpcy5zbGlkZXIubGVuZ3RoO1xuXHRcdFx0XHRmb3IodmFyIGk9MDsgaTx0ZW1wQ291bnQ7IGkrKyl7XG5cdFx0XHRcdFx0dGVtcFBvc0Fyci5wb3AoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Zm9yKHZhciBpPWluZGV4KzE7IGk8IHRlbXBQb3NBcnIubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHR0ZW1wUG9zQXJyW2ldID0gMDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0ZW1wUG9zQXJyO1xuXHRcdH0sXG5cdFx0cmVSZW5kZXJXaGVlbHM6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0Ly/liKDpmaTlpJrkvZnnmoR3aGVlbFxuXHRcdFx0aWYoX3RoaXMud2hlZWwubGVuZ3RoID4gX3RoaXMuZGlzcGxheUpzb24ubGVuZ3RoKXtcblx0XHRcdFx0dmFyIGNvdW50ID0gX3RoaXMud2hlZWwubGVuZ3RoIC0gX3RoaXMuZGlzcGxheUpzb24ubGVuZ3RoO1xuXHRcdFx0XHRmb3IodmFyIGk9MDsgaTxjb3VudDsgaSsrKXtcblx0XHRcdFx0XHRfdGhpcy53aGVlbHMucmVtb3ZlQ2hpbGQoX3RoaXMud2hlZWxbX3RoaXMud2hlZWwubGVuZ3RoLTFdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Zm9yKHZhciBpPTA7IGk8X3RoaXMuZGlzcGxheUpzb24ubGVuZ3RoOyBpKyspe1xuXHRcdFx0Ly/liJdcblx0XHRcdFx0KGZ1bmN0aW9uIChpKSB7XG5cdFx0XHRcdFx0dmFyIHRlbXBIVE1MPScnO1xuXHRcdFx0XHRcdGlmKF90aGlzLndoZWVsW2ldKXtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ+aPkuWFpUxpJyk7XG5cdFx0XHRcdFx0XHRmb3IodmFyIGo9MDsgajxfdGhpcy5kaXNwbGF5SnNvbltpXS5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdFx0XHQvL+ihjFxuXHRcdFx0XHRcdFx0XHR0ZW1wSFRNTCArPSAnPGxpIGRhdGEtaWQ9XCInK190aGlzLmRpc3BsYXlKc29uW2ldW2pdW190aGlzLmtleU1hcC5pZF0rJ1wiPicrX3RoaXMuZGlzcGxheUpzb25baV1bal1bX3RoaXMua2V5TWFwLnZhbHVlXSsnPC9saT4nO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0X3RoaXMuc2xpZGVyW2ldLmlubmVySFRNTCA9IHRlbXBIVE1MO1xuXG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHR2YXIgdGVtcFdoZWVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdFx0XHRcdHRlbXBXaGVlbC5jbGFzc05hbWUgPSBcIndoZWVsXCI7XG5cdFx0XHRcdFx0XHR0ZW1wSFRNTCA9ICc8dWwgY2xhc3M9XCJzZWxlY3RDb250YWluZXJcIj4nO1xuXHRcdFx0XHRcdFx0Zm9yKHZhciBqPTA7IGo8X3RoaXMuZGlzcGxheUpzb25baV0ubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHRcdFx0Ly/ooYxcblx0XHRcdFx0XHRcdFx0dGVtcEhUTUwgKz0gJzxsaSBkYXRhLWlkPVwiJytfdGhpcy5kaXNwbGF5SnNvbltpXVtqXVtfdGhpcy5rZXlNYXAuaWRdKydcIj4nK190aGlzLmRpc3BsYXlKc29uW2ldW2pdW190aGlzLmtleU1hcC52YWx1ZV0rJzwvbGk+Jztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRlbXBIVE1MICs9ICc8L3VsPic7XG5cdFx0XHRcdFx0XHR0ZW1wV2hlZWwuaW5uZXJIVE1MID0gdGVtcEhUTUw7XG5cblx0XHRcdFx0XHRcdF90aGlzLmFkZExpc3RlbmVyV2hlZWwodGVtcFdoZWVsLCBpKTtcblx0XHRcdFx0ICAgIFx0X3RoaXMud2hlZWxzLmFwcGVuZENoaWxkKHRlbXBXaGVlbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vX3RoaXMuwrcoaSk7XG5cdFx0XHRcdH0pKGkpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR1cGRhdGVXaGVlbHM6ZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0aWYoX3RoaXMuY2FzY2FkZSl7XG5cdFx0XHRcdF90aGlzLmNhc2NhZGVKc29uRGF0YSA9IGRhdGE7XG5cdFx0XHRcdF90aGlzLmRpc3BsYXlKc29uID0gW107XG5cdFx0XHRcdF90aGlzLmluaXRDYXNjYWRlKCk7XG5cdFx0XHRcdGlmKF90aGlzLmluaXRQb3NpdGlvbi5sZW5ndGggPCBfdGhpcy5zbGlkZXIubGVuZ3RoKXtcblx0XHRcdFx0XHR2YXIgZGlmZiA9IF90aGlzLnNsaWRlci5sZW5ndGggLSBfdGhpcy5pbml0UG9zaXRpb24ubGVuZ3RoO1xuXHRcdFx0XHRcdGZvcih2YXIgaT0wOyBpPGRpZmY7IGkrKyl7XG5cdFx0XHRcdFx0XHRfdGhpcy5pbml0UG9zaXRpb24ucHVzaCgwKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0X3RoaXMuc2V0Q3VyRGlzdGFuY2UoX3RoaXMuaW5pdFBvc2l0aW9uKTtcblx0XHRcdFx0X3RoaXMuZml4Um93U3R5bGUoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0dXBkYXRlV2hlZWw6IGZ1bmN0aW9uKHNsaWRlckluZGV4LCBkYXRhKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHR2YXIgdGVtcEhUTUw9Jyc7XG5cdCAgICBcdGlmKF90aGlzLmNhc2NhZGUpe1xuXHQgICAgXHRcdGNvbnNvbGUuZXJyb3IoJ+e6p+iBlOagvOW8j+S4jeaUr+aMgXVwZGF0ZVdoZWVsKCks6K+35L2/55SodXBkYXRlV2hlZWxzKCnmm7TmlrDmlbTkuKrmlbDmja7mupAnKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHQgICAgXHR9XG5cdCAgICBcdGVsc2UgaWYoX3RoaXMuanNvblR5cGUpe1xuXHRcdFx0XHRmb3IodmFyIGo9MDsgajxkYXRhLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0XHR0ZW1wSFRNTCArPSAnPGxpIGRhdGEtaWQ9XCInK2RhdGFbal1bX3RoaXMua2V5TWFwLmlkXSsnXCI+JytkYXRhW2pdW190aGlzLmtleU1hcC52YWx1ZV0rJzwvbGk+Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRfdGhpcy53aGVlbHNEYXRhW3NsaWRlckluZGV4XSA9IHtkYXRhOiBkYXRhfTtcblx0ICAgIFx0fWVsc2V7XG5cdFx0XHRcdGZvcih2YXIgaj0wOyBqPGRhdGEubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHRcdHRlbXBIVE1MICs9ICc8bGk+JytkYXRhW2pdKyc8L2xpPic7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3RoaXMud2hlZWxzRGF0YVtzbGlkZXJJbmRleF0gPSBkYXRhO1xuXHQgICAgXHR9XG5cdFx0XHRfdGhpcy5zbGlkZXJbc2xpZGVySW5kZXhdLmlubmVySFRNTCA9IHRlbXBIVE1MO1xuXHRcdH0sXG5cblx0XHRmaXhSb3dTdHlsZTogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHR2YXIgd2lkdGggPSAoMTAwL190aGlzLndoZWVsLmxlbmd0aCkudG9GaXhlZCgyKTtcblx0XHRcdGZvcih2YXIgaT0wOyBpPF90aGlzLndoZWVsLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0X3RoaXMud2hlZWxbaV0uc3R5bGUud2lkdGggPSB3aWR0aCsnJSc7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHQgICAgZ2V0SW5kZXg6IGZ1bmN0aW9uKGRpc3RhbmNlKXtcblx0ICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCgoMip0aGlzLmxpSGVpZ2h0LWRpc3RhbmNlKS90aGlzLmxpSGVpZ2h0KTtcblx0ICAgIH0sXG5cblx0ICAgIGdldEluZGV4QXJyOiBmdW5jdGlvbigpe1xuXHQgICAgXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHQgICAgXHR2YXIgdGVtcCA9IFtdO1xuXHQgICAgXHRmb3IodmFyIGk9MDsgaTxfdGhpcy5jdXJEaXN0YW5jZS5sZW5ndGg7IGkrKyl7XG5cdCAgICBcdFx0dGVtcC5wdXNoKF90aGlzLmdldEluZGV4KF90aGlzLmN1ckRpc3RhbmNlW2ldKSk7XG5cdCAgICBcdH1cblx0ICAgIFx0cmV0dXJuIHRlbXA7XG5cdCAgICB9LFxuXG5cdCAgICBnZXRDdXJWYWx1ZTogZnVuY3Rpb24oKXtcblx0ICAgIFx0dmFyIF90aGlzID0gdGhpcztcblx0ICAgIFx0dmFyIHRlbXAgPSBbXTtcblx0ICAgIFx0dmFyIHBvc2l0aW9uQXJyID0gX3RoaXMuZ2V0SW5kZXhBcnIoKTtcblx0ICAgIFx0aWYoX3RoaXMuY2FzY2FkZSl7XG5cdFx0ICAgIFx0Zm9yKHZhciBpPTA7IGk8X3RoaXMud2hlZWwubGVuZ3RoOyBpKyspe1xuXHRcdCAgICBcdFx0dGVtcC5wdXNoKF90aGlzLmRpc3BsYXlKc29uW2ldW3Bvc2l0aW9uQXJyW2ldXSk7XG5cdFx0ICAgIFx0fVxuXHQgICAgXHR9XG5cdCAgICBcdGVsc2UgaWYoX3RoaXMuanNvblR5cGUpe1xuXHRcdCAgICBcdGZvcih2YXIgaT0wOyBpPF90aGlzLmN1ckRpc3RhbmNlLmxlbmd0aDsgaSsrKXtcblx0XHQgICAgXHRcdHRlbXAucHVzaChfdGhpcy53aGVlbHNEYXRhW2ldLmRhdGFbX3RoaXMuZ2V0SW5kZXgoX3RoaXMuY3VyRGlzdGFuY2VbaV0pXSk7XG5cdFx0ICAgIFx0fVxuXHQgICAgXHR9ZWxzZXtcblx0XHQgICAgXHRmb3IodmFyIGk9MDsgaTxfdGhpcy5jdXJEaXN0YW5jZS5sZW5ndGg7IGkrKyl7XG5cdFx0ICAgIFx0XHR0ZW1wLnB1c2goX3RoaXMuZ2V0SW5uZXJIdG1sKGkpKTtcblx0XHQgICAgXHR9XG5cdCAgICBcdH1cblx0ICAgIFx0cmV0dXJuIHRlbXA7XG5cdCAgICB9LFxuXG5cdCAgICBnZXRWYWx1ZTogZnVuY3Rpb24oKXtcblx0ICAgIFx0cmV0dXJuIHRoaXMuY3VyVmFsdWU7XG5cdCAgICB9LFxuXG5cdCAgICBjYWxjRGlzdGFuY2U6IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdHJldHVybiAyKnRoaXMubGlIZWlnaHQtaW5kZXgqdGhpcy5saUhlaWdodDtcblx0ICAgIH0sXG5cblx0ICAgIHNldEN1ckRpc3RhbmNlOiBmdW5jdGlvbihpbmRleEFycil7XG5cdCAgICBcdHZhciBfdGhpcyA9IHRoaXM7XG5cdCAgICBcdHZhciB0ZW1wID0gW107XG5cdCAgICBcdGZvcih2YXIgaT0wOyBpPF90aGlzLnNsaWRlci5sZW5ndGg7IGkrKyl7XG5cdCAgICBcdFx0dGVtcC5wdXNoKF90aGlzLmNhbGNEaXN0YW5jZShpbmRleEFycltpXSkpO1xuXHQgICAgXHRcdF90aGlzLm1vdmVQb3NpdGlvbihfdGhpcy5zbGlkZXJbaV0sdGVtcFtpXSk7XG5cdCAgICBcdH1cblx0ICAgIFx0X3RoaXMuY3VyRGlzdGFuY2UgPSB0ZW1wO1xuXHQgICAgfSxcblxuXHQgICAgZml4UG9zaXRpb246IGZ1bmN0aW9uKGRpc3RhbmNlKXtcblx0ICAgICAgICByZXR1cm4gLSh0aGlzLmdldEluZGV4KGRpc3RhbmNlKS0yKSp0aGlzLmxpSGVpZ2h0O1xuXHQgICAgfSxcblxuXHQgICAgbW92ZVBvc2l0aW9uOiBmdW5jdGlvbih0aGVTbGlkZXIsIGRpc3RhbmNlKXtcblx0ICAgICAgICB0aGVTbGlkZXIuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gJ3RyYW5zbGF0ZTNkKDAsJyArIGRpc3RhbmNlICsgJ3B4LCAwKSc7XG5cdCAgICAgICAgdGhlU2xpZGVyLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgwLCcgKyBkaXN0YW5jZSArICdweCwgMCknO1xuXHQgICAgfSxcblxuXHQgICAgbG9jYXRlUG9zaXRpb246IGZ1bmN0aW9uKGluZGV4LCBwb3NJbmRleCl7XG5cdCAgICBcdHZhciBfdGhpcyA9IHRoaXM7XG4gIFx0ICAgIFx0dGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSB0aGlzLmNhbGNEaXN0YW5jZShwb3NJbmRleCk7XG4gIFx0ICAgIFx0dGhpcy5tb3ZlUG9zaXRpb24odGhpcy5zbGlkZXJbaW5kZXhdLHRoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblx0ICAgICAgICBpZihfdGhpcy5jYXNjYWRlKXtcblx0XHQgICAgXHRfdGhpcy5jaGVja1JhbmdlKGluZGV4LCBfdGhpcy5nZXRJbmRleEFycigpKTtcblx0XHRcdH1cblx0ICAgIH0sXG5cblx0ICAgIHVwZGF0ZUN1ckRpc3RhbmNlOiBmdW5jdGlvbih0aGVTbGlkZXIsIGluZGV4KXtcblx0ICAgICAgICBpZih0aGVTbGlkZXIuc3R5bGUudHJhbnNmb3JtKXtcblx0XHRcdFx0dGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSBwYXJzZUludCh0aGVTbGlkZXIuc3R5bGUudHJhbnNmb3JtLnNwbGl0KCcsJylbMV0pO1xuXHQgICAgICAgIH1lbHNle1xuXHRcdFx0XHR0aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IHBhcnNlSW50KHRoZVNsaWRlci5zdHlsZS53ZWJraXRUcmFuc2Zvcm0uc3BsaXQoJywnKVsxXSk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgZ2V0RGlzdGFuY2U6ZnVuY3Rpb24odGhlU2xpZGVyKXtcblx0ICAgIFx0aWYodGhlU2xpZGVyLnN0eWxlLnRyYW5zZm9ybSl7XG5cdCAgICBcdFx0cmV0dXJuIHBhcnNlSW50KHRoZVNsaWRlci5zdHlsZS50cmFuc2Zvcm0uc3BsaXQoJywnKVsxXSk7XG5cdCAgICBcdH1lbHNle1xuXHQgICAgXHRcdHJldHVybiBwYXJzZUludCh0aGVTbGlkZXIuc3R5bGUud2Via2l0VHJhbnNmb3JtLnNwbGl0KCcsJylbMV0pO1xuXHQgICAgXHR9XG5cdCAgICB9LFxuXG5cdCAgICBnZXRJbm5lckh0bWw6IGZ1bmN0aW9uKHNsaWRlckluZGV4KXtcblx0ICAgIFx0dmFyIF90aGlzID0gdGhpcztcblx0ICAgIFx0dmFyIGluZGV4ID0gX3RoaXMuZ2V0SW5kZXgoX3RoaXMuY3VyRGlzdGFuY2Vbc2xpZGVySW5kZXhdKTtcblx0ICAgIFx0cmV0dXJuIF90aGlzLnNsaWRlcltzbGlkZXJJbmRleF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJylbaW5kZXhdLmlubmVySFRNTDtcblx0ICAgIH0sXG5cblx0ICAgIHRvdWNoOiBmdW5jdGlvbihldmVudCwgdGhlU2xpZGVyLCBpbmRleCl7XG5cdCAgICBcdHZhciBfdGhpcyA9IHRoaXM7XG5cdCAgICBcdGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuXHQgICAgXHRzd2l0Y2goZXZlbnQudHlwZSl7XG5cdCAgICBcdFx0Y2FzZSBcInRvdWNoc3RhcnRcIjpcblx0XHRcdCAgICAgICAgX3RoaXMuc3RhcnRZID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZO1xuXHRcdFx0ICAgICAgICBfdGhpcy5zdGFydFkgPSBwYXJzZUludChfdGhpcy5zdGFydFkpO1xuXHRcdFx0ICAgICAgICBfdGhpcy5vbGRNb3ZlWSA9IF90aGlzLnN0YXJ0WTtcblx0ICAgIFx0XHRcdGJyZWFrO1xuXG5cdCAgICBcdFx0Y2FzZSBcInRvdWNoZW5kXCI6XG5cblx0XHRcdCAgICAgICAgX3RoaXMubW92ZUVuZFkgPSBwYXJzZUludChldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZKTtcblx0XHRcdCAgICAgICAgX3RoaXMub2Zmc2V0U3VtID0gX3RoaXMubW92ZUVuZFkgLSBfdGhpcy5zdGFydFk7XG5cdFx0XHRcdFx0X3RoaXMub3ZlcnNpemVCb3JkZXIgPSAtKHRoZVNsaWRlci5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKS5sZW5ndGgtMykqX3RoaXMubGlIZWlnaHQ7XG5cblx0XHRcdFx0XHRpZihfdGhpcy5vZmZzZXRTdW0gPT0gMCl7XG5cdFx0XHRcdFx0XHQvL29mZnNldFN1beS4ujAs55u45b2T5LqO54K55Ye75LqL5Lu2XG5cdFx0XHRcdFx0XHQvLyAwIDEgWzJdIDMgNFxuXHRcdFx0XHRcdFx0dmFyIGNsaWNrT2ZmZXROdW0gPSBwYXJzZUludCgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCAtIF90aGlzLm1vdmVFbmRZKS80MCk7XG5cdFx0XHRcdFx0XHRpZihjbGlja09mZmV0TnVtIT0yKXtcblx0XHRcdFx0XHRcdFx0dmFyIG9mZnNldCA9IGNsaWNrT2ZmZXROdW0gLSAyO1xuXHRcdFx0XHRcdFx0XHR2YXIgbmV3RGlzdGFuY2UgPSBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gKyAob2Zmc2V0Kl90aGlzLmxpSGVpZ2h0KTtcblx0XHRcdFx0XHRcdFx0aWYoKG5ld0Rpc3RhbmNlIDw9IDIqX3RoaXMubGlIZWlnaHQpICYmIChuZXdEaXN0YW5jZSA+PSBfdGhpcy5vdmVyc2l6ZUJvcmRlcikgKXtcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSBuZXdEaXN0YW5jZTtcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy5tb3ZlUG9zaXRpb24odGhlU2xpZGVyLCBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXHRcdFx0XHRcdFx0XHRcdF90aGlzLnRyYW5zaXRpb25FbmQoX3RoaXMuZ2V0SW5kZXhBcnIoKSxfdGhpcy5nZXRDdXJWYWx1ZSgpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0Ly/kv67mraPkvY3nva5cblx0XHRcdFx0XHRcdF90aGlzLnVwZGF0ZUN1ckRpc3RhbmNlKHRoZVNsaWRlciwgaW5kZXgpO1xuXHRcdFx0XHRcdFx0X3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gX3RoaXMuZml4UG9zaXRpb24oX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblx0XHRcdFx0XHRcdF90aGlzLm1vdmVQb3NpdGlvbih0aGVTbGlkZXIsIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cblx0XHRcdFx0ICAgICAgICAvL+WPjeW8uVxuXHRcdFx0XHQgICAgICAgIGlmKF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSArIF90aGlzLm9mZnNldFN1bSA+IDIqX3RoaXMubGlIZWlnaHQpe1xuXHRcdFx0XHQgICAgICAgICAgICBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSAyKl90aGlzLmxpSGVpZ2h0O1xuXHRcdFx0XHQgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCAgICAgICAgICAgICAgICBfdGhpcy5tb3ZlUG9zaXRpb24odGhlU2xpZGVyLCBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXHRcdFx0XHQgICAgICAgICAgICB9LCAxMDApO1xuXG5cdFx0XHRcdCAgICAgICAgfWVsc2UgaWYoX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdICsgX3RoaXMub2Zmc2V0U3VtIDwgX3RoaXMub3ZlcnNpemVCb3JkZXIpe1xuXHRcdFx0XHQgICAgICAgICAgICBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSBfdGhpcy5vdmVyc2l6ZUJvcmRlcjtcblx0XHRcdFx0ICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQgICAgICAgICAgICAgICAgX3RoaXMubW92ZVBvc2l0aW9uKHRoZVNsaWRlciwgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblx0XHRcdFx0ICAgICAgICAgICAgfSwgMTAwKTtcblx0XHRcdFx0ICAgICAgICB9XG5cdFx0XHRcdFx0XHRfdGhpcy50cmFuc2l0aW9uRW5kKF90aGlzLmdldEluZGV4QXJyKCksX3RoaXMuZ2V0Q3VyVmFsdWUoKSk7XG5cdFx0XHRcdFx0fVxuXG4gXHRcdFx0ICAgICAgICBpZihfdGhpcy5jYXNjYWRlKXtcblx0XHRcdFx0ICAgICAgICBfdGhpcy5jaGVja1JhbmdlKGluZGV4LCBfdGhpcy5nZXRJbmRleEFycigpKTtcblx0XHRcdFx0ICAgIH1cblxuXHQgICAgXHRcdFx0YnJlYWs7XG5cblx0ICAgIFx0XHRjYXNlIFwidG91Y2htb3ZlXCI6XG5cdFx0XHQgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQgICAgICAgIF90aGlzLm1vdmVZID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZO1xuXHRcdFx0ICAgICAgICBfdGhpcy5vZmZzZXQgPSBfdGhpcy5tb3ZlWSAtIF90aGlzLm9sZE1vdmVZO1xuXG5cdFx0XHQgICAgICAgIF90aGlzLnVwZGF0ZUN1ckRpc3RhbmNlKHRoZVNsaWRlciwgaW5kZXgpO1xuXHRcdFx0ICAgICAgICBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gKyBfdGhpcy5vZmZzZXQ7XG5cdFx0XHQgICAgICAgIF90aGlzLm1vdmVQb3NpdGlvbih0aGVTbGlkZXIsIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cdFx0XHQgICAgICAgIF90aGlzLm9sZE1vdmVZID0gX3RoaXMubW92ZVk7XG5cdCAgICBcdFx0XHRicmVhaztcblx0ICAgIFx0fVxuXHQgICAgfSxcblxuXHQgICAgZHJhZ0NsaWNrOiBmdW5jdGlvbihldmVudCwgdGhlU2xpZGVyLCBpbmRleCl7XG5cdCAgICBcdHZhciBfdGhpcyA9IHRoaXM7XG5cdCAgICBcdGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuXHQgICAgXHRzd2l0Y2goZXZlbnQudHlwZSl7XG5cdCAgICBcdFx0Y2FzZSBcIm1vdXNlZG93blwiOlxuXHRcdFx0ICAgICAgICBfdGhpcy5zdGFydFkgPSBldmVudC5jbGllbnRZO1xuXHRcdFx0ICAgICAgICBfdGhpcy5vbGRNb3ZlWSA9IF90aGlzLnN0YXJ0WTtcblx0XHRcdCAgICAgICAgX3RoaXMuY2xpY2tTdGF0dXMgPSB0cnVlO1xuXHQgICAgXHRcdFx0YnJlYWs7XG5cblx0ICAgIFx0XHRjYXNlIFwibW91c2V1cFwiOlxuXG5cdFx0XHQgICAgICAgIF90aGlzLm1vdmVFbmRZID0gZXZlbnQuY2xpZW50WTtcblx0XHRcdCAgICAgICAgX3RoaXMub2Zmc2V0U3VtID0gX3RoaXMubW92ZUVuZFkgLSBfdGhpcy5zdGFydFk7XG5cdFx0XHRcdFx0X3RoaXMub3ZlcnNpemVCb3JkZXIgPSAtKHRoZVNsaWRlci5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKS5sZW5ndGgtMykqX3RoaXMubGlIZWlnaHQ7XG5cblx0XHRcdFx0XHRpZihfdGhpcy5vZmZzZXRTdW0gPT0gMCl7XG5cdFx0XHRcdFx0XHR2YXIgY2xpY2tPZmZldE51bSA9IHBhcnNlSW50KChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC0gX3RoaXMubW92ZUVuZFkpLzQwKTtcblx0XHRcdFx0XHRcdGlmKGNsaWNrT2ZmZXROdW0hPTIpe1xuXHRcdFx0XHRcdFx0XHR2YXIgb2Zmc2V0ID0gY2xpY2tPZmZldE51bSAtIDI7XG5cdFx0XHRcdFx0XHRcdHZhciBuZXdEaXN0YW5jZSA9IF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSArIChvZmZzZXQqX3RoaXMubGlIZWlnaHQpO1xuXHRcdFx0XHRcdFx0XHRpZigobmV3RGlzdGFuY2UgPD0gMipfdGhpcy5saUhlaWdodCkgJiYgKG5ld0Rpc3RhbmNlID49IF90aGlzLm92ZXJzaXplQm9yZGVyKSApe1xuXHRcdFx0XHRcdFx0XHRcdF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IG5ld0Rpc3RhbmNlO1xuXHRcdFx0XHRcdFx0XHRcdF90aGlzLm1vdmVQb3NpdGlvbih0aGVTbGlkZXIsIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMudHJhbnNpdGlvbkVuZChfdGhpcy5nZXRJbmRleEFycigpLF90aGlzLmdldEN1clZhbHVlKCkpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHQvL+S/ruato+S9jee9rlxuXHRcdFx0XHRcdFx0X3RoaXMudXBkYXRlQ3VyRGlzdGFuY2UodGhlU2xpZGVyLCBpbmRleCk7XG5cdFx0XHRcdFx0XHRfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSBfdGhpcy5maXhQb3NpdGlvbihfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVBvc2l0aW9uKHRoZVNsaWRlciwgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblxuXHRcdFx0XHRcdFx0Ly/lj43lvLlcblx0XHRcdFx0XHRcdGlmKF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSArIF90aGlzLm9mZnNldFN1bSA+IDIqX3RoaXMubGlIZWlnaHQpe1xuXHRcdFx0XHRcdFx0ICAgIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IDIqX3RoaXMubGlIZWlnaHQ7XG5cdFx0XHRcdFx0XHQgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0ICAgICAgICBfdGhpcy5tb3ZlUG9zaXRpb24odGhlU2xpZGVyLCBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXHRcdFx0XHRcdFx0ICAgIH0sIDEwMCk7XG5cblx0XHRcdFx0XHRcdH1lbHNlIGlmKF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSArIF90aGlzLm9mZnNldFN1bSA8IF90aGlzLm92ZXJzaXplQm9yZGVyKXtcblx0XHRcdFx0XHRcdCAgICBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSBfdGhpcy5vdmVyc2l6ZUJvcmRlcjtcblx0XHRcdFx0XHRcdCAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQgICAgICAgIF90aGlzLm1vdmVQb3NpdGlvbih0aGVTbGlkZXIsIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cdFx0XHRcdFx0XHQgICAgfSwgMTAwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdF90aGlzLnRyYW5zaXRpb25FbmQoX3RoaXMuZ2V0SW5kZXhBcnIoKSxfdGhpcy5nZXRDdXJWYWx1ZSgpKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0ICAgICAgICBfdGhpcy5jbGlja1N0YXR1cyA9IGZhbHNlO1xuIFx0XHRcdCAgICAgICAgaWYoX3RoaXMuY2FzY2FkZSl7XG5cdFx0XHRcdCAgICAgICAgX3RoaXMuY2hlY2tSYW5nZShpbmRleCwgX3RoaXMuZ2V0SW5kZXhBcnIoKSk7XG5cdFx0XHQgICAgXHR9XG5cdCAgICBcdFx0XHRicmVhaztcblxuXHQgICAgXHRcdGNhc2UgXCJtb3VzZW1vdmVcIjpcblx0XHRcdCAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdCAgICAgICAgaWYoX3RoaXMuY2xpY2tTdGF0dXMpe1xuXHRcdFx0XHQgICAgICAgIF90aGlzLm1vdmVZID0gZXZlbnQuY2xpZW50WTtcblx0XHRcdFx0ICAgICAgICBfdGhpcy5vZmZzZXQgPSBfdGhpcy5tb3ZlWSAtIF90aGlzLm9sZE1vdmVZO1xuXHRcdFx0XHQgICAgICAgIF90aGlzLnVwZGF0ZUN1ckRpc3RhbmNlKHRoZVNsaWRlciwgaW5kZXgpO1xuXHRcdFx0XHQgICAgICAgIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSArIF90aGlzLm9mZnNldDtcblx0XHRcdFx0ICAgICAgICBfdGhpcy5tb3ZlUG9zaXRpb24odGhlU2xpZGVyLCBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXHRcdFx0XHQgICAgICAgIF90aGlzLm9sZE1vdmVZID0gX3RoaXMubW92ZVk7XG5cdFx0XHQgICAgICAgIH1cblx0ICAgIFx0XHRcdGJyZWFrO1xuXHQgICAgXHR9XG5cdCAgICB9XG5cblx0fTtcblxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT0gXCJvYmplY3RcIikge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gTW9iaWxlU2VsZWN0O1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBNb2JpbGVTZWxlY3Q7XG5cdFx0fSlcblx0fSBlbHNlIHtcblx0XHR3aW5kb3cuTW9iaWxlU2VsZWN0ID0gTW9iaWxlU2VsZWN0O1xuXHR9XG59KSgpO1xuIiwiY29uc3QgcHJlZml4ID0gJ21jLXNlbGVjdCc7XG5cbmNvbnN0IHNlbGVjdHMgPSAkKGAuJHtwcmVmaXh9YCk7XG5cbmNsYXNzIFNlbGVjdCB7XG4gIGNvbnN0cnVjdG9yKGRvbSwgb3B0aW9ucykge1xuICAgIHRoaXMuc2VsZWN0ID0gJChkb20pO1xuXG4gICAgdGhpcy50ZXh0Q29udGFpbmVyRG9tID0gdGhpcy5zZWxlY3QuZmluZChgLiR7cHJlZml4fS10ZXh0LWNvbnRhaW5lcmApO1xuICAgIHRoaXMudGV4dERvbSA9IHRoaXMudGV4dENvbnRhaW5lckRvbS5maW5kKGAuJHtwcmVmaXh9LXRleHRgKTtcbiAgICB0aGlzLnZhbHVlSW5wdXREb20gPSB0aGlzLnRleHRDb250YWluZXJEb20uZmluZChgLiR7cHJlZml4fS12YWx1ZWApO1xuXG4gICAgdGhpcy5vcHRpb25Db250YWluZXIgPSB0aGlzLnNlbGVjdC5maW5kKGAuJHtwcmVmaXh9LW9wdGlvbi1jb250YWluZXJgKTtcbiAgICB0aGlzLm9wdGlvbkNvbnRhaW5lckhlaWdodCA9IHRoaXMub3B0aW9uQ29udGFpbmVyWzBdLnNjcm9sbEhlaWdodDtcblxuICAgIGlmICghb3B0aW9ucy52YWx1ZSkge1xuICAgICAgdGhpcy50ZXh0RG9tLmFkZENsYXNzKCdwbGFjZWhvbGRlcicpO1xuICAgICAgdGhpcy50ZXh0RG9tLnRleHQodGhpcy50ZXh0RG9tLmF0dHIoJ3BsYWNlaG9sZGVyJykpO1xuICAgIH1cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PntcbiAgICAgIHRoaXMuc2VsZWN0LnJlbW92ZUNsYXNzKCdzaG93Jyk7XG4gICAgfSwgZmFsc2UpXG5cbiAgICB0aGlzLmFkZExpc3RlbmVycygpXG4gIH1cblxuICBoYW5kbGVUb2dnbGUoZSkge1xuICAgIGlmICh0aGlzLnNlbGVjdC5oYXNDbGFzcygnc2hvdycpKSB7XG4gICAgICB0aGlzLnNlbGVjdC5yZW1vdmVDbGFzcygnc2hvdycpO1xuICAgICAgdGhpcy5vcHRpb25Db250YWluZXIuaGVpZ2h0KDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdC5hZGRDbGFzcygnc2hvdycpO1xuICAgICAgdGhpcy5vcHRpb25Db250YWluZXIuaGVpZ2h0KHRoaXMub3B0aW9uQ29udGFpbmVySGVpZ2h0KTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaGFuZGxlU2VsZWN0KGUpIHtcbiAgICBsZXQgdmFsdWUgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXZhbHVlJyk7XG4gICAgbGV0IHRleHQgPSAkKGUudGFyZ2V0KS50ZXh0KCk7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmhhbmRsZVRvZ2dsZSgpXG4gICAgICAkKHRoaXMudGV4dERvbSkucmVtb3ZlQ2xhc3MoJ3BsYWNlaG9sZGVyJylcbiAgICAgIHRoaXMudGV4dERvbS50ZXh0KHRleHQpO1xuICAgICAgdGhpcy52YWx1ZUlucHV0RG9tLnZhbCh2YWx1ZSk7XG4gICAgICB0aGlzLnNlbGVjdC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgIHRoaXMudmFsdWVJbnB1dERvbS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKCkge1xuICAgIHRoaXMudGV4dENvbnRhaW5lckRvbS5vbignY2xpY2snLCB0aGlzLmhhbmRsZVRvZ2dsZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLm9wdGlvbkNvbnRhaW5lci5vbignY2xpY2snLCB0aGlzLmhhbmRsZVNlbGVjdC5iaW5kKHRoaXMpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdDtcbiIsImNvbnN0IHByZWZpeCA9ICdtYy10YWInO1xuXG5jb25zdCB0YWJzID0gJChgLiR7cHJlZml4fS1ncm91cGApO1xuXG5cbmNsYXNzIFRhYiB7XG4gIGNvbnN0cnVjdG9yKGRvbSwgb3B0aW9ucyA9e30pIHtcbiAgICB0aGlzLnRhYkRvbSA9ICQoZG9tKTtcbiAgICB0aGlzLmJ0bkdyb3VwRG9tID0gdGhpcy50YWJEb20uZmluZChgLiR7cHJlZml4fS1idG5zYCk7XG4gICAgdGhpcy5idG5Eb21zID0gdGhpcy50YWJEb20uZmluZChgLiR7cHJlZml4fS1idG5gKTtcbiAgICB0aGlzLnBhbmVsRG9tcyA9IHRoaXMudGFiRG9tLmZpbmQoYC4ke3ByZWZpeH0tcGFuZWxgKTtcblxuICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG4gIH1cblxuICBhY3RpdmUoaW5kZXgpIHtcbiAgICB0aGlzLmJ0bkRvbXMuZXEoaW5kZXgpLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICB0aGlzLnBhbmVsRG9tcy5lcShpbmRleCkuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2tCdG4oZSkge1xuICAgIGxldCBpbmRleCA9ICQoZS50YXJnZXQpLmluZGV4KCk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMuYWN0aXZlKGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBhZGRMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5idG5Hcm91cERvbS5vbignY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrQnRuLmJpbmQodGhpcykpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUYWI7XG4iLCJjb25zdCBUYWIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdGFiJyk7XG5jb25zdCBTZWxlY3QgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvc2VsZWN0Jyk7XG5jb25zdCBBdXRvQ29tcGxldGUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYXV0b0NvbXBsZXRlJyk7XG5jb25zdCBDYWxlbmRhciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jYWxlbmRhcicpO1xuY29uc3QgSW1hZ2VVcGxvYWRlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9pbWFnZVVwbG9hZGVyJyk7XG5jb25zdCBNb2JpbGVTZWxlY3QgPSByZXF1aXJlKCAnLi9jb21wb25lbnRzL21vYmlsZS1zZWxlY3QnKTtcbmNvbnN0IEFsZXJ0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2RpYWxvZy9hbGVydCcpO1xuY29uc3QgQ29uZmlybSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kaWFsb2cvY29uZmlybScpO1xuY29uc3QgQ29tcGxleCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kaWFsb2cvY29tcGxleCcpO1xuY29uc3QgVG9hc3QgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGlhbG9nL3RvYXN0Jyk7XG5jb25zdCBUaXAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGlhbG9nL3RpcCcpO1xuY29uc3QgQWN0aW9uU2hlZXQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGlhbG9nL2FjdGlvblNoZWV0Jyk7XG5jb25zdCBMb2FkaW5nID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2RpYWxvZy9sb2FkaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBBbGVydCxcbiAgQ29uZmlybSxcbiAgQ29tcGxleCxcbiAgVG9hc3QsXG4gIExvYWRpbmcsXG4gIFRpcCxcbiAgQWN0aW9uU2hlZXQsXG5cbiAgVGFiLFxuICBTZWxlY3QsXG4gIEF1dG9Db21wbGV0ZSxcbiAgQ2FsZW5kYXIsXG4gIEltYWdlVXBsb2FkZXIsXG4gIE1vYmlsZVNlbGVjdCxcbn1cblxuIl19
