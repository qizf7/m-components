(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mc = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
/*!
 * Compressor.js v1.0.5
 * https://fengyuanchen.github.io/compressorjs
 *
 * Copyright 2018-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2019-01-23T10:53:08.724Z
 */

'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var canvasToBlob = createCommonjsModule(function (module) {
    if (typeof window === 'undefined') {
      return;
    }

  (function (window) {

    var CanvasPrototype = window.HTMLCanvasElement && window.HTMLCanvasElement.prototype;

    var hasBlobConstructor = window.Blob && function () {
      try {
        return Boolean(new Blob());
      } catch (e) {
        return false;
      }
    }();

    var hasArrayBufferViewSupport = hasBlobConstructor && window.Uint8Array && function () {
      try {
        return new Blob([new Uint8Array(100)]).size === 100;
      } catch (e) {
        return false;
      }
    }();

    var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
    var dataURIPattern = /^data:((.*?)(;charset=.*?)?)(;base64)?,/;

    var dataURLtoBlob = (hasBlobConstructor || BlobBuilder) && window.atob && window.ArrayBuffer && window.Uint8Array && function (dataURI) {
      var matches, mediaType, isBase64, dataString, byteString, arrayBuffer, intArray, i, bb; // Parse the dataURI components as per RFC 2397

      matches = dataURI.match(dataURIPattern);

      if (!matches) {
        throw new Error('invalid data URI');
      } // Default to text/plain;charset=US-ASCII


      mediaType = matches[2] ? matches[1] : 'text/plain' + (matches[3] || ';charset=US-ASCII');
      isBase64 = !!matches[4];
      dataString = dataURI.slice(matches[0].length);

      if (isBase64) {
        // Convert base64 to raw binary data held in a string:
        byteString = atob(dataString);
      } else {
        // Convert base64/URLEncoded data component to raw binary:
        byteString = decodeURIComponent(dataString);
      } // Write the bytes of the string to an ArrayBuffer:


      arrayBuffer = new ArrayBuffer(byteString.length);
      intArray = new Uint8Array(arrayBuffer);

      for (i = 0; i < byteString.length; i += 1) {
        intArray[i] = byteString.charCodeAt(i);
      } // Write the ArrayBuffer (or ArrayBufferView) to a blob:


      if (hasBlobConstructor) {
        return new Blob([hasArrayBufferViewSupport ? intArray : arrayBuffer], {
          type: mediaType
        });
      }

      bb = new BlobBuilder();
      bb.append(arrayBuffer);
      return bb.getBlob(mediaType);
    };

    if (window.HTMLCanvasElement && !CanvasPrototype.toBlob) {
      if (CanvasPrototype.mozGetAsFile) {
        CanvasPrototype.toBlob = function (callback, type, quality) {
          var self = this;
          setTimeout(function () {
            if (quality && CanvasPrototype.toDataURL && dataURLtoBlob) {
              callback(dataURLtoBlob(self.toDataURL(type, quality)));
            } else {
              callback(self.mozGetAsFile('blob', type));
            }
          });
        };
      } else if (CanvasPrototype.toDataURL && dataURLtoBlob) {
        CanvasPrototype.toBlob = function (callback, type, quality) {
          var self = this;
          setTimeout(function () {
            callback(dataURLtoBlob(self.toDataURL(type, quality)));
          });
        };
      }
    }

    if (module.exports) {
      module.exports = dataURLtoBlob;
    } else {
      window.dataURLtoBlob = dataURLtoBlob;
    }
  })(window);
});

var isBlob = function isBlob(input) {
  if (typeof Blob === 'undefined') {
    return false;
  }

  return input instanceof Blob || Object.prototype.toString.call(input) === '[object Blob]';
};

var DEFAULTS = {
  /**
   * Indicates if output the original image instead of the compressed one
   * when the size of the compressed image is greater than the original one's
   * @type {boolean}
   */
  strict: true,

  /**
   * Indicates if read the image's Exif Orientation information,
   * and then rotate or flip the image automatically.
   * @type {boolean}
   */
  checkOrientation: true,

  /**
   * The max width of the output image.
   * @type {number}
   */
  maxWidth: Infinity,

  /**
   * The max height of the output image.
   * @type {number}
   */
  maxHeight: Infinity,

  /**
   * The min width of the output image.
   * @type {number}
   */
  minWidth: 0,

  /**
   * The min height of the output image.
   * @type {number}
   */
  minHeight: 0,

  /**
   * The width of the output image.
   * If not specified, the natural width of the source image will be used.
   * @type {number}
   */
  width: undefined,

  /**
   * The height of the output image.
   * If not specified, the natural height of the source image will be used.
   * @type {number}
   */
  height: undefined,

  /**
   * The quality of the output image.
   * It must be a number between `0` and `1`,
   * and only available for `image/jpeg` and `image/webp` images.
   * Check out {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob canvas.toBlob}.
   * @type {number}
   */
  quality: 0.8,

  /**
   * The mime type of the output image.
   * By default, the original mime type of the source image file will be used.
   * @type {string}
   */
  mimeType: 'auto',

  /**
   * PNG files over this value (5 MB by default) will be converted to JPEGs.
   * To disable this, just set the value to `Infinity`.
   * @type {number}
   */
  convertSize: 5000000,

  /**
   * The hook function to execute before draw the image into the canvas for compression.
   * @type {Function}
   * @param {CanvasRenderingContext2D} context - The 2d rendering context of the canvas.
   * @param {HTMLCanvasElement} canvas - The canvas for compression.
   * @example
   * function (context, canvas) {
   *   context.fillStyle = '#fff';
   * }
   */
  beforeDraw: null,

  /**
   * The hook function to execute after drew the image into the canvas for compression.
   * @type {Function}
   * @param {CanvasRenderingContext2D} context - The 2d rendering context of the canvas.
   * @param {HTMLCanvasElement} canvas - The canvas for compression.
   * @example
   * function (context, canvas) {
   *   context.filter = 'grayscale(100%)';
   * }
   */
  drew: null,

  /**
   * The hook function to execute when success to compress the image.
   * @type {Function}
   * @param {File} file - The compressed image File object.
   * @example
   * function (file) {
   *   console.log(file);
   * }
   */
  success: null,

  /**
   * The hook function to execute when fail to compress the image.
   * @type {Function}
   * @param {Error} err - An Error object.
   * @example
   * function (err) {
   *   console.log(err.message);
   * }
   */
  error: null
};

var IN_BROWSER = typeof window !== 'undefined';
var WINDOW = IN_BROWSER ? window : {};

var slice = Array.prototype.slice;
/**
 * Convert array-like or iterable object to an array.
 * @param {*} value - The value to convert.
 * @returns {Array} Returns a new array.
 */

function toArray(value) {
  return Array.from ? Array.from(value) : slice.call(value);
}
var REGEXP_IMAGE_TYPE = /^image\/.+$/;
/**
 * Check if the given value is a mime type of image.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given is a mime type of image, else `false`.
 */

function isImageType(value) {
  return REGEXP_IMAGE_TYPE.test(value);
}
/**
 * Convert image type to extension.
 * @param {string} value - The image type to convert.
 * @returns {boolean} Returns the image extension.
 */

function imageTypeToExtension(value) {
  var extension = isImageType(value) ? value.substr(6) : '';

  if (extension === 'jpeg') {
    extension = 'jpg';
  }

  return ".".concat(extension);
}
var fromCharCode = String.fromCharCode;
/**
 * Get string from char code in data view.
 * @param {DataView} dataView - The data view for read.
 * @param {number} start - The start index.
 * @param {number} length - The read length.
 * @returns {string} The read result.
 */

function getStringFromCharCode(dataView, start, length) {
  var str = '';
  var i;
  length += start;

  for (i = start; i < length; i += 1) {
    str += fromCharCode(dataView.getUint8(i));
  }

  return str;
}
var btoa = WINDOW.btoa;
/**
 * Transform array buffer to Data URL.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to transform.
 * @param {string} mimeType - The mime type of the Data URL.
 * @returns {string} The result Data URL.
 */

function arrayBufferToDataURL(arrayBuffer, mimeType) {
  var chunks = [];
  var chunkSize = 8192;
  var uint8 = new Uint8Array(arrayBuffer);

  while (uint8.length > 0) {
    // XXX: Babel's `toConsumableArray` helper will throw error in IE or Safari 9
    // eslint-disable-next-line prefer-spread
    chunks.push(fromCharCode.apply(null, toArray(uint8.subarray(0, chunkSize))));
    uint8 = uint8.subarray(chunkSize);
  }

  return "data:".concat(mimeType, ";base64,").concat(btoa(chunks.join('')));
}
/**
 * Get orientation value from given array buffer.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
 * @returns {number} The read orientation value.
 */

function resetAndGetOrientation(arrayBuffer) {
  var dataView = new DataView(arrayBuffer);
  var orientation; // Ignores range error when the image does not have correct Exif information

  try {
    var littleEndian;
    var app1Start;
    var ifdStart; // Only handle JPEG image (start by 0xFFD8)

    if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
      var length = dataView.byteLength;
      var offset = 2;

      while (offset + 1 < length) {
        if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
          app1Start = offset;
          break;
        }

        offset += 1;
      }
    }

    if (app1Start) {
      var exifIDCode = app1Start + 4;
      var tiffOffset = app1Start + 10;

      if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
        var endianness = dataView.getUint16(tiffOffset);
        littleEndian = endianness === 0x4949;

        if (littleEndian || endianness === 0x4D4D
        /* bigEndian */
        ) {
            if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
              var firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

              if (firstIFDOffset >= 0x00000008) {
                ifdStart = tiffOffset + firstIFDOffset;
              }
            }
          }
      }
    }

    if (ifdStart) {
      var _length = dataView.getUint16(ifdStart, littleEndian);

      var _offset;

      var i;

      for (i = 0; i < _length; i += 1) {
        _offset = ifdStart + i * 12 + 2;

        if (dataView.getUint16(_offset, littleEndian) === 0x0112
        /* Orientation */
        ) {
            // 8 is the offset of the current tag's value
            _offset += 8; // Get the original orientation value

            orientation = dataView.getUint16(_offset, littleEndian); // Override the orientation with its default value

            dataView.setUint16(_offset, 1, littleEndian);
            break;
          }
      }
    }
  } catch (e) {
    orientation = 1;
  }

  return orientation;
}
/**
 * Parse Exif Orientation value.
 * @param {number} orientation - The orientation to parse.
 * @returns {Object} The parsed result.
 */

function parseOrientation(orientation) {
  var rotate = 0;
  var scaleX = 1;
  var scaleY = 1;

  switch (orientation) {
    // Flip horizontal
    case 2:
      scaleX = -1;
      break;
    // Rotate left 180°

    case 3:
      rotate = -180;
      break;
    // Flip vertical

    case 4:
      scaleY = -1;
      break;
    // Flip vertical and rotate right 90°

    case 5:
      rotate = 90;
      scaleY = -1;
      break;
    // Rotate right 90°

    case 6:
      rotate = 90;
      break;
    // Flip horizontal and rotate right 90°

    case 7:
      rotate = 90;
      scaleX = -1;
      break;
    // Rotate left 90°

    case 8:
      rotate = -90;
      break;

    default:
  }

  return {
    rotate: rotate,
    scaleX: scaleX,
    scaleY: scaleY
  };
}
var REGEXP_DECIMALS = /\.\d*(?:0|9){12}\d*$/;
/**
 * Normalize decimal number.
 * Check out {@link http://0.30000000000000004.com/}
 * @param {number} value - The value to normalize.
 * @param {number} [times=100000000000] - The times for normalizing.
 * @returns {number} Returns the normalized number.
 */

function normalizeDecimalNumber(value) {
  var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100000000000;
  return REGEXP_DECIMALS.test(value) ? Math.round(value * times) / times : value;
}

var ArrayBuffer$1 = WINDOW.ArrayBuffer,
    FileReader = WINDOW.FileReader;
var URL = WINDOW.URL || WINDOW.webkitURL;
var REGEXP_EXTENSION = /\.\w+$/;
var AnotherCompressor = WINDOW.Compressor;
/**
 * Creates a new image compressor.
 * @class
 */

var Compressor =
/*#__PURE__*/
function () {
  /**
   * The constructor of Compressor.
   * @param {File|Blob} file - The target image file for compressing.
   * @param {Object} [options] - The options for compressing.
   */
  function Compressor(file, options) {
    _classCallCheck(this, Compressor);

    this.file = file;
    this.image = new Image();
    this.options = _objectSpread({}, DEFAULTS, options);
    this.aborted = false;
    this.result = null;
    this.init();
  }

  _createClass(Compressor, [{
    key: "init",
    value: function init() {
      var _this = this;

      var file = this.file,
          options = this.options;

      if (!isBlob(file)) {
        this.fail(new Error('The first argument must be a File or Blob object.'));
        return;
      }

      var mimeType = file.type;

      if (!isImageType(mimeType)) {
        this.fail(new Error('The first argument must be an image File or Blob object.'));
        return;
      }

      if (!URL || !FileReader) {
        this.fail(new Error('The current browser does not support image compression.'));
        return;
      }

      if (!ArrayBuffer$1) {
        options.checkOrientation = false;
      }

      if (URL && !options.checkOrientation) {
        this.load({
          url: URL.createObjectURL(file)
        });
      } else {
        var reader = new FileReader();
        var checkOrientation = options.checkOrientation && mimeType === 'image/jpeg';
        this.reader = reader;

        reader.onload = function (_ref) {
          var target = _ref.target;
          var result = target.result;
          var data = {};

          if (checkOrientation) {
            // Reset the orientation value to its default value 1
            // as some iOS browsers will render image with its orientation
            var orientation = resetAndGetOrientation(result);

            if (orientation > 1 || !URL) {
              // Generate a new URL which has the default orientation value
              data.url = arrayBufferToDataURL(result, mimeType);

              if (orientation > 1) {
                _extends(data, parseOrientation(orientation));
              }
            } else {
              data.url = URL.createObjectURL(file);
            }
          } else {
            data.url = result;
          }

          _this.load(data);
        };

        reader.onabort = function () {
          _this.fail(new Error('Aborted to read the image with FileReader.'));
        };

        reader.onerror = function () {
          _this.fail(new Error('Failed to read the image with FileReader.'));
        };

        reader.onloadend = function () {
          _this.reader = null;
        };

        if (checkOrientation) {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsDataURL(file);
        }
      }
    }
  }, {
    key: "load",
    value: function load(data) {
      var _this2 = this;

      var file = this.file,
          image = this.image;

      image.onload = function () {
        _this2.draw(_objectSpread({}, data, {
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        }));
      };

      image.onabort = function () {
        _this2.fail(new Error('Aborted to load the image.'));
      };

      image.onerror = function () {
        _this2.fail(new Error('Failed to load the image.'));
      };

      image.alt = file.name;
      image.src = data.url;
    }
  }, {
    key: "draw",
    value: function draw(_ref2) {
      var _this3 = this;

      var naturalWidth = _ref2.naturalWidth,
          naturalHeight = _ref2.naturalHeight,
          _ref2$rotate = _ref2.rotate,
          rotate = _ref2$rotate === void 0 ? 0 : _ref2$rotate,
          _ref2$scaleX = _ref2.scaleX,
          scaleX = _ref2$scaleX === void 0 ? 1 : _ref2$scaleX,
          _ref2$scaleY = _ref2.scaleY,
          scaleY = _ref2$scaleY === void 0 ? 1 : _ref2$scaleY;
      var file = this.file,
          image = this.image,
          options = this.options;
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var aspectRatio = naturalWidth / naturalHeight;
      var is90DegreesRotated = Math.abs(rotate) % 180 === 90;
      var maxWidth = Math.max(options.maxWidth, 0) || Infinity;
      var maxHeight = Math.max(options.maxHeight, 0) || Infinity;
      var minWidth = Math.max(options.minWidth, 0) || 0;
      var minHeight = Math.max(options.minHeight, 0) || 0;
      var width = Math.max(options.width, 0) || naturalWidth;
      var height = Math.max(options.height, 0) || naturalHeight;

      if (is90DegreesRotated) {
        var _ref3 = [maxHeight, maxWidth];
        maxWidth = _ref3[0];
        maxHeight = _ref3[1];
        var _ref4 = [minHeight, minWidth];
        minWidth = _ref4[0];
        minHeight = _ref4[1];
        var _ref5 = [height, width];
        width = _ref5[0];
        height = _ref5[1];
      }

      if (maxWidth < Infinity && maxHeight < Infinity) {
        if (maxHeight * aspectRatio > maxWidth) {
          maxHeight = maxWidth / aspectRatio;
        } else {
          maxWidth = maxHeight * aspectRatio;
        }
      } else if (maxWidth < Infinity) {
        maxHeight = maxWidth / aspectRatio;
      } else if (maxHeight < Infinity) {
        maxWidth = maxHeight * aspectRatio;
      }

      if (minWidth > 0 && minHeight > 0) {
        if (minHeight * aspectRatio > minWidth) {
          minHeight = minWidth / aspectRatio;
        } else {
          minWidth = minHeight * aspectRatio;
        }
      } else if (minWidth > 0) {
        minHeight = minWidth / aspectRatio;
      } else if (minHeight > 0) {
        minWidth = minHeight * aspectRatio;
      }

      if (height * aspectRatio > width) {
        height = width / aspectRatio;
      } else {
        width = height * aspectRatio;
      }

      width = Math.floor(normalizeDecimalNumber(Math.min(Math.max(width, minWidth), maxWidth)));
      height = Math.floor(normalizeDecimalNumber(Math.min(Math.max(height, minHeight), maxHeight)));
      var destX = -width / 2;
      var destY = -height / 2;
      var destWidth = width;
      var destHeight = height;

      if (is90DegreesRotated) {
        var _ref6 = [height, width];
        width = _ref6[0];
        height = _ref6[1];
      }

      canvas.width = width;
      canvas.height = height;

      if (!isImageType(options.mimeType)) {
        options.mimeType = file.type;
      }

      var fillStyle = 'transparent'; // Converts PNG files over the `convertSize` to JPEGs.

      if (file.size > options.convertSize && options.mimeType === 'image/png') {
        fillStyle = '#fff';
        options.mimeType = 'image/jpeg';
      } // Override the default fill color (#000, black)


      context.fillStyle = fillStyle;
      context.fillRect(0, 0, width, height);

      if (options.beforeDraw) {
        options.beforeDraw.call(this, context, canvas);
      }

      if (this.aborted) {
        return;
      }

      context.save();
      context.translate(width / 2, height / 2);
      context.rotate(rotate * Math.PI / 180);
      context.scale(scaleX, scaleY);
      context.drawImage(image, destX, destY, destWidth, destHeight);
      context.restore();

      if (options.drew) {
        options.drew.call(this, context, canvas);
      }

      if (this.aborted) {
        return;
      }

      var done = function done(result) {
        if (!_this3.aborted) {
          _this3.done({
            naturalWidth: naturalWidth,
            naturalHeight: naturalHeight,
            result: result
          });
        }
      };

      if (canvas.toBlob) {
        canvas.toBlob(done, options.mimeType, options.quality);
      } else {
        done(canvasToBlob(canvas.toDataURL(options.mimeType, options.quality)));
      }
    }
  }, {
    key: "done",
    value: function done(_ref7) {
      var naturalWidth = _ref7.naturalWidth,
          naturalHeight = _ref7.naturalHeight,
          result = _ref7.result;
      var file = this.file,
          image = this.image,
          options = this.options;

      if (URL && !options.checkOrientation) {
        URL.revokeObjectURL(image.src);
      }

      if (result) {
        // Returns original file if the result is greater than it and without size related options
        if (options.strict && result.size > file.size && options.mimeType === file.type && !(options.width > naturalWidth || options.height > naturalHeight || options.minWidth > naturalWidth || options.minHeight > naturalHeight)) {
          result = file;
        } else {
          var date = new Date();
          result.lastModified = date.getTime();
          result.lastModifiedDate = date;
          result.name = file.name; // Convert the extension to match its type

          if (result.name && result.type !== file.type) {
            result.name = result.name.replace(REGEXP_EXTENSION, imageTypeToExtension(result.type));
          }
        }
      } else {
        // Returns original file if the result is null in some cases.
        result = file;
      }

      this.result = result;

      if (options.success) {
        options.success.call(this, result);
      }
    }
  }, {
    key: "fail",
    value: function fail(err) {
      var options = this.options;

      if (options.error) {
        options.error.call(this, err);
      } else {
        throw err;
      }
    }
  }, {
    key: "abort",
    value: function abort() {
      if (!this.aborted) {
        this.aborted = true;

        if (this.reader) {
          this.reader.abort();
        } else if (!this.image.complete) {
          this.image.onload = null;
          this.image.onabort();
        } else {
          this.fail(new Error('The compression process has been aborted.'));
        }
      }
    }
    /**
     * Get the no conflict compressor class.
     * @returns {Compressor} The compressor class.
     */

  }], [{
    key: "noConflict",
    value: function noConflict() {
      window.Compressor = AnotherCompressor;
      return Compressor;
    }
    /**
     * Change the default options.
     * @param {Object} options - The new default options.
     */

  }, {
    key: "setDefaults",
    value: function setDefaults(options) {
      _extends(DEFAULTS, options);
    }
  }]);

  return Compressor;
}();

module.exports = Compressor;

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./langs":5,"moment":2}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./base":8}],7:[function(require,module,exports){
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

},{"./general":11}],8:[function(require,module,exports){
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

},{"./mask":14,"./utils":17}],9:[function(require,module,exports){
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

},{"./general":11}],10:[function(require,module,exports){
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

},{"./general":11}],11:[function(require,module,exports){
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

},{"./base":8}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./base":8,"./langs":12,"./utils":17}],14:[function(require,module,exports){
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

},{"./utils":17}],15:[function(require,module,exports){
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

},{"./base":8}],16:[function(require,module,exports){
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

},{"./base":8,"./utils":17}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compressor = require('compressorjs');
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
    this.options.beforeUpload = this.options.beforeUpload || noop;
    this.options.afterUpload = this.options.afterUpload || noop;
    this.options.uploadFileKey = this.options.uploadFileKey || 'file';
    this.options.maxLen = this.options.maxLen || 3;

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
      if (this.itemDoms.length === this.options.maxLen) {
        this.pictureList.html(this.itemDoms);
      } else {
        this.pictureList.html(this.itemDoms.concat($('<span class="' + prefix + '-placeholder"></span>')));
      }
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
    key: 'doUpload',
    value: function doUpload(upFileObject, thumbnailDom) {
      var _this2 = this;

      var data = new FormData();
      data.append(this.options.uploadFileKey, upFileObject.file, upFileObject.file.name);

      var getExtraParams = this.options.getExtraParams;
      if (typeof getExtraParams === 'function') {
        var extraParams = getExtraParams();
        for (var key in extraParams) {
          if (extraParams.hasOwnProperty(key)) {
            var element = extraParams[key];
            data.append(key, element);
          }
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
          _this2.options.afterUpload();
          if (typeof _this2.options.judger !== 'function' || _this2.options.judger(data)) {
            upFileObject.responseData = data;
            handleUploadSuccess();
          } else {
            handleUploadFail();
          }
        },
        error: function error(xhr, errorType, _error) {
          _this2.options.afterUpload();
          handleUploadFail();
        }
      });
    }
  }, {
    key: 'uploadFile',
    value: function uploadFile(upFileObject, thumbnailDom) {
      var _this3 = this;

      if (typeof this.options.beforeUpload === 'function') {
        upFileObject = this.options.beforeUpload(upFileObject);
      }

      if (this.options.compressor) {
        new Compressor(upFileObject.file, _extends({
          quality: 0.6
        }, this.options.compressor, {
          success: function success(result) {
            upFileObject.file = result;
            _this3.doUpload(upFileObject, thumbnailDom);
          },
          error: function error(err) {
            console.log(err.message);
          }
        }));
      } else {
        this.doUpload(upFileObject, thumbnailDom);
      }
    }
  }, {
    key: 'handleRemoveItem',
    value: function handleRemoveItem(e) {
      e.preventDefault();
      e.stopPropagation();
      var context = e.data.context;
      var index = $(this).parent('.' + prefix + '-item').index();
      context.removeItem(index);
    }
  }, {
    key: 'removeItem',
    value: function removeItem(index) {
      var _this4 = this;

      var beforeRemove = this.options.beforeRemove;
      var file = this.fileList[index];
      var remove = function remove() {
        _this4.fileList[index].xhr.abort();
        _this4.itemDoms.splice(index, 1);
        _this4.fileList.splice(index, 1);
        _this4.options.onChange(_this4.fileList);
        _this4.options.onRemove(file, index, _this4.fileList);
        _this4.renderThumbnail();
      };
      if (typeof beforeRemove === 'function') {
        beforeRemove(file, index, this.fileList, remove);
      } else {
        remove();
      }
    }
  }, {
    key: 'clearItem',
    value: function clearItem() {
      for (var index = 0; index < this.fileList.length; index++) {
        this.fileList[index].xhr.abort();
      }
      this.itemDoms = [];
      this.fileList = [];
      this.renderThumbnail();
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

},{"compressorjs":1}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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
        this.tabDom.trigger('tab:change', index);
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

},{}],22:[function(require,module,exports){
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

},{"./components/autoComplete":3,"./components/calendar":4,"./components/dialog/actionSheet":6,"./components/dialog/alert":7,"./components/dialog/complex":9,"./components/dialog/confirm":10,"./components/dialog/loading":13,"./components/dialog/tip":15,"./components/dialog/toast":16,"./components/imageUploader":18,"./components/mobile-select":19,"./components/select":20,"./components/tab":21}]},{},[22])(22)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29tcHJlc3NvcmpzL2Rpc3QvY29tcHJlc3Nvci5jb21tb24uanMiLCJub2RlX21vZHVsZXMvbW9tZW50L21vbWVudC5qcyIsInNyYy9jb21wb25lbnRzL2F1dG9Db21wbGV0ZS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2NhbGVuZGFyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvY2FsZW5kYXIvbGFuZ3MuanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvYWN0aW9uU2hlZXQuanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvYWxlcnQuanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvYmFzZS5qcyIsInNyYy9jb21wb25lbnRzL2RpYWxvZy9jb21wbGV4LmpzIiwic3JjL2NvbXBvbmVudHMvZGlhbG9nL2NvbmZpcm0uanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvZ2VuZXJhbC5qcyIsInNyYy9jb21wb25lbnRzL2RpYWxvZy9sYW5ncy5qcyIsInNyYy9jb21wb25lbnRzL2RpYWxvZy9sb2FkaW5nLmpzIiwic3JjL2NvbXBvbmVudHMvZGlhbG9nL21hc2suanMiLCJzcmMvY29tcG9uZW50cy9kaWFsb2cvdGlwLmpzIiwic3JjL2NvbXBvbmVudHMvZGlhbG9nL3RvYXN0LmpzIiwic3JjL2NvbXBvbmVudHMvZGlhbG9nL3V0aWxzLmpzIiwic3JjL2NvbXBvbmVudHMvaW1hZ2VVcGxvYWRlci9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL21vYmlsZS1zZWxlY3QvbW9iaWxlLXNlbGVjdC5qcyIsInNyYy9jb21wb25lbnRzL3NlbGVjdC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL3RhYi9pbmRleC5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzU1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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UyxDQUFiLEVBQWdCO0FBQ2QsYUFBSyxNQUFMLENBQVksT0FBWixDQUFvQixZQUFwQixFQUFrQyxLQUFsQztBQUNBLGFBQUssTUFBTCxDQUFZLEtBQVo7QUFDRDtBQUNGOzs7bUNBRWM7QUFDYixXQUFLLFdBQUwsQ0FBaUIsRUFBakIsQ0FBb0IsT0FBcEIsRUFBNkIsS0FBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLElBQXpCLENBQTdCO0FBQ0Q7Ozs7OztBQUdILE9BQU8sT0FBUCxHQUFpQixHQUFqQjs7Ozs7QUNqQ0EsSUFBTSxNQUFNLFFBQVEsa0JBQVIsQ0FBWjtBQUNBLElBQU0sU0FBUyxRQUFRLHFCQUFSLENBQWY7QUFDQSxJQUFNLGVBQWUsUUFBUSwyQkFBUixDQUFyQjtBQUNBLElBQU0sV0FBVyxRQUFRLHVCQUFSLENBQWpCO0FBQ0EsSUFBTSxnQkFBZ0IsUUFBUSw0QkFBUixDQUF0QjtBQUNBLElBQU0sZUFBZSxRQUFTLDRCQUFULENBQXJCO0FBQ0EsSUFBTSxRQUFRLFFBQVEsMkJBQVIsQ0FBZDtBQUNBLElBQU0sVUFBVSxRQUFRLDZCQUFSLENBQWhCO0FBQ0EsSUFBTSxVQUFVLFFBQVEsNkJBQVIsQ0FBaEI7QUFDQSxJQUFNLFFBQVEsUUFBUSwyQkFBUixDQUFkO0FBQ0EsSUFBTSxNQUFNLFFBQVEseUJBQVIsQ0FBWjtBQUNBLElBQU0sY0FBYyxRQUFRLGlDQUFSLENBQXBCO0FBQ0EsSUFBTSxVQUFVLFFBQVEsNkJBQVIsQ0FBaEI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsY0FEZTtBQUVmLGtCQUZlO0FBR2Ysa0JBSGU7QUFJZixjQUplO0FBS2Ysa0JBTGU7QUFNZixVQU5lO0FBT2YsMEJBUGU7O0FBU2YsVUFUZTtBQVVmLGdCQVZlO0FBV2YsNEJBWGU7QUFZZixvQkFaZTtBQWFmLDhCQWJlO0FBY2Y7QUFkZSxDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiLyohXG4gKiBDb21wcmVzc29yLmpzIHYxLjAuNVxuICogaHR0cHM6Ly9mZW5neXVhbmNoZW4uZ2l0aHViLmlvL2NvbXByZXNzb3Jqc1xuICpcbiAqIENvcHlyaWdodCAyMDE4LXByZXNlbnQgQ2hlbiBGZW5neXVhblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKlxuICogRGF0ZTogMjAxOS0wMS0yM1QxMDo1MzowOC43MjRaXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9O1xuICAgIHZhciBvd25LZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcblxuICAgIGlmICh0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb3duS2V5cyA9IG93bktleXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlKS5maWx0ZXIoZnVuY3Rpb24gKHN5bSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHN5bSkuZW51bWVyYWJsZTtcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBvd25LZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb21tb25qc01vZHVsZShmbiwgbW9kdWxlKSB7XG5cdHJldHVybiBtb2R1bGUgPSB7IGV4cG9ydHM6IHt9IH0sIGZuKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMpLCBtb2R1bGUuZXhwb3J0cztcbn1cblxudmFyIGNhbnZhc1RvQmxvYiA9IGNyZWF0ZUNvbW1vbmpzTW9kdWxlKGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgKGZ1bmN0aW9uICh3aW5kb3cpIHtcblxuICAgIHZhciBDYW52YXNQcm90b3R5cGUgPSB3aW5kb3cuSFRNTENhbnZhc0VsZW1lbnQgJiYgd2luZG93LkhUTUxDYW52YXNFbGVtZW50LnByb3RvdHlwZTtcblxuICAgIHZhciBoYXNCbG9iQ29uc3RydWN0b3IgPSB3aW5kb3cuQmxvYiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gQm9vbGVhbihuZXcgQmxvYigpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0oKTtcblxuICAgIHZhciBoYXNBcnJheUJ1ZmZlclZpZXdTdXBwb3J0ID0gaGFzQmxvYkNvbnN0cnVjdG9yICYmIHdpbmRvdy5VaW50OEFycmF5ICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBuZXcgQmxvYihbbmV3IFVpbnQ4QXJyYXkoMTAwKV0pLnNpemUgPT09IDEwMDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0oKTtcblxuICAgIHZhciBCbG9iQnVpbGRlciA9IHdpbmRvdy5CbG9iQnVpbGRlciB8fCB3aW5kb3cuV2ViS2l0QmxvYkJ1aWxkZXIgfHwgd2luZG93Lk1vekJsb2JCdWlsZGVyIHx8IHdpbmRvdy5NU0Jsb2JCdWlsZGVyO1xuICAgIHZhciBkYXRhVVJJUGF0dGVybiA9IC9eZGF0YTooKC4qPykoO2NoYXJzZXQ9Lio/KT8pKDtiYXNlNjQpPywvO1xuXG4gICAgdmFyIGRhdGFVUkx0b0Jsb2IgPSAoaGFzQmxvYkNvbnN0cnVjdG9yIHx8IEJsb2JCdWlsZGVyKSAmJiB3aW5kb3cuYXRvYiAmJiB3aW5kb3cuQXJyYXlCdWZmZXIgJiYgd2luZG93LlVpbnQ4QXJyYXkgJiYgZnVuY3Rpb24gKGRhdGFVUkkpIHtcbiAgICAgIHZhciBtYXRjaGVzLCBtZWRpYVR5cGUsIGlzQmFzZTY0LCBkYXRhU3RyaW5nLCBieXRlU3RyaW5nLCBhcnJheUJ1ZmZlciwgaW50QXJyYXksIGksIGJiOyAvLyBQYXJzZSB0aGUgZGF0YVVSSSBjb21wb25lbnRzIGFzIHBlciBSRkMgMjM5N1xuXG4gICAgICBtYXRjaGVzID0gZGF0YVVSSS5tYXRjaChkYXRhVVJJUGF0dGVybik7XG5cbiAgICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGF0YSBVUkknKTtcbiAgICAgIH0gLy8gRGVmYXVsdCB0byB0ZXh0L3BsYWluO2NoYXJzZXQ9VVMtQVNDSUlcblxuXG4gICAgICBtZWRpYVR5cGUgPSBtYXRjaGVzWzJdID8gbWF0Y2hlc1sxXSA6ICd0ZXh0L3BsYWluJyArIChtYXRjaGVzWzNdIHx8ICc7Y2hhcnNldD1VUy1BU0NJSScpO1xuICAgICAgaXNCYXNlNjQgPSAhIW1hdGNoZXNbNF07XG4gICAgICBkYXRhU3RyaW5nID0gZGF0YVVSSS5zbGljZShtYXRjaGVzWzBdLmxlbmd0aCk7XG5cbiAgICAgIGlmIChpc0Jhc2U2NCkge1xuICAgICAgICAvLyBDb252ZXJ0IGJhc2U2NCB0byByYXcgYmluYXJ5IGRhdGEgaGVsZCBpbiBhIHN0cmluZzpcbiAgICAgICAgYnl0ZVN0cmluZyA9IGF0b2IoZGF0YVN0cmluZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDb252ZXJ0IGJhc2U2NC9VUkxFbmNvZGVkIGRhdGEgY29tcG9uZW50IHRvIHJhdyBiaW5hcnk6XG4gICAgICAgIGJ5dGVTdHJpbmcgPSBkZWNvZGVVUklDb21wb25lbnQoZGF0YVN0cmluZyk7XG4gICAgICB9IC8vIFdyaXRlIHRoZSBieXRlcyBvZiB0aGUgc3RyaW5nIHRvIGFuIEFycmF5QnVmZmVyOlxuXG5cbiAgICAgIGFycmF5QnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVTdHJpbmcubGVuZ3RoKTtcbiAgICAgIGludEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYnl0ZVN0cmluZy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpbnRBcnJheVtpXSA9IGJ5dGVTdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgICAgIH0gLy8gV3JpdGUgdGhlIEFycmF5QnVmZmVyIChvciBBcnJheUJ1ZmZlclZpZXcpIHRvIGEgYmxvYjpcblxuXG4gICAgICBpZiAoaGFzQmxvYkNvbnN0cnVjdG9yKSB7XG4gICAgICAgIHJldHVybiBuZXcgQmxvYihbaGFzQXJyYXlCdWZmZXJWaWV3U3VwcG9ydCA/IGludEFycmF5IDogYXJyYXlCdWZmZXJdLCB7XG4gICAgICAgICAgdHlwZTogbWVkaWFUeXBlXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBiYiA9IG5ldyBCbG9iQnVpbGRlcigpO1xuICAgICAgYmIuYXBwZW5kKGFycmF5QnVmZmVyKTtcbiAgICAgIHJldHVybiBiYi5nZXRCbG9iKG1lZGlhVHlwZSk7XG4gICAgfTtcblxuICAgIGlmICh3aW5kb3cuSFRNTENhbnZhc0VsZW1lbnQgJiYgIUNhbnZhc1Byb3RvdHlwZS50b0Jsb2IpIHtcbiAgICAgIGlmIChDYW52YXNQcm90b3R5cGUubW96R2V0QXNGaWxlKSB7XG4gICAgICAgIENhbnZhc1Byb3RvdHlwZS50b0Jsb2IgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocXVhbGl0eSAmJiBDYW52YXNQcm90b3R5cGUudG9EYXRhVVJMICYmIGRhdGFVUkx0b0Jsb2IpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YVVSTHRvQmxvYihzZWxmLnRvRGF0YVVSTCh0eXBlLCBxdWFsaXR5KSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soc2VsZi5tb3pHZXRBc0ZpbGUoJ2Jsb2InLCB0eXBlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKENhbnZhc1Byb3RvdHlwZS50b0RhdGFVUkwgJiYgZGF0YVVSTHRvQmxvYikge1xuICAgICAgICBDYW52YXNQcm90b3R5cGUudG9CbG9iID0gZnVuY3Rpb24gKGNhbGxiYWNrLCB0eXBlLCBxdWFsaXR5KSB7XG4gICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2FsbGJhY2soZGF0YVVSTHRvQmxvYihzZWxmLnRvRGF0YVVSTCh0eXBlLCBxdWFsaXR5KSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb2R1bGUuZXhwb3J0cykge1xuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkYXRhVVJMdG9CbG9iO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuZGF0YVVSTHRvQmxvYiA9IGRhdGFVUkx0b0Jsb2I7XG4gICAgfVxuICB9KSh3aW5kb3cpO1xufSk7XG5cbnZhciBpc0Jsb2IgPSBmdW5jdGlvbiBpc0Jsb2IoaW5wdXQpIHtcbiAgaWYgKHR5cGVvZiBCbG9iID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBpbnB1dCBpbnN0YW5jZW9mIEJsb2IgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgQmxvYl0nO1xufTtcblxudmFyIERFRkFVTFRTID0ge1xuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIG91dHB1dCB0aGUgb3JpZ2luYWwgaW1hZ2UgaW5zdGVhZCBvZiB0aGUgY29tcHJlc3NlZCBvbmVcbiAgICogd2hlbiB0aGUgc2l6ZSBvZiB0aGUgY29tcHJlc3NlZCBpbWFnZSBpcyBncmVhdGVyIHRoYW4gdGhlIG9yaWdpbmFsIG9uZSdzXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgc3RyaWN0OiB0cnVlLFxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgcmVhZCB0aGUgaW1hZ2UncyBFeGlmIE9yaWVudGF0aW9uIGluZm9ybWF0aW9uLFxuICAgKiBhbmQgdGhlbiByb3RhdGUgb3IgZmxpcCB0aGUgaW1hZ2UgYXV0b21hdGljYWxseS5cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBjaGVja09yaWVudGF0aW9uOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBUaGUgbWF4IHdpZHRoIG9mIHRoZSBvdXRwdXQgaW1hZ2UuXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBtYXhXaWR0aDogSW5maW5pdHksXG5cbiAgLyoqXG4gICAqIFRoZSBtYXggaGVpZ2h0IG9mIHRoZSBvdXRwdXQgaW1hZ2UuXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBtYXhIZWlnaHQ6IEluZmluaXR5LFxuXG4gIC8qKlxuICAgKiBUaGUgbWluIHdpZHRoIG9mIHRoZSBvdXRwdXQgaW1hZ2UuXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBtaW5XaWR0aDogMCxcblxuICAvKipcbiAgICogVGhlIG1pbiBoZWlnaHQgb2YgdGhlIG91dHB1dCBpbWFnZS5cbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIG1pbkhlaWdodDogMCxcblxuICAvKipcbiAgICogVGhlIHdpZHRoIG9mIHRoZSBvdXRwdXQgaW1hZ2UuXG4gICAqIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBuYXR1cmFsIHdpZHRoIG9mIHRoZSBzb3VyY2UgaW1hZ2Ugd2lsbCBiZSB1c2VkLlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgd2lkdGg6IHVuZGVmaW5lZCxcblxuICAvKipcbiAgICogVGhlIGhlaWdodCBvZiB0aGUgb3V0cHV0IGltYWdlLlxuICAgKiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgbmF0dXJhbCBoZWlnaHQgb2YgdGhlIHNvdXJjZSBpbWFnZSB3aWxsIGJlIHVzZWQuXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBoZWlnaHQ6IHVuZGVmaW5lZCxcblxuICAvKipcbiAgICogVGhlIHF1YWxpdHkgb2YgdGhlIG91dHB1dCBpbWFnZS5cbiAgICogSXQgbXVzdCBiZSBhIG51bWJlciBiZXR3ZWVuIGAwYCBhbmQgYDFgLFxuICAgKiBhbmQgb25seSBhdmFpbGFibGUgZm9yIGBpbWFnZS9qcGVnYCBhbmQgYGltYWdlL3dlYnBgIGltYWdlcy5cbiAgICogQ2hlY2sgb3V0IHtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSFRNTENhbnZhc0VsZW1lbnQvdG9CbG9iIGNhbnZhcy50b0Jsb2J9LlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgcXVhbGl0eTogMC44LFxuXG4gIC8qKlxuICAgKiBUaGUgbWltZSB0eXBlIG9mIHRoZSBvdXRwdXQgaW1hZ2UuXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSBvcmlnaW5hbCBtaW1lIHR5cGUgb2YgdGhlIHNvdXJjZSBpbWFnZSBmaWxlIHdpbGwgYmUgdXNlZC5cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIG1pbWVUeXBlOiAnYXV0bycsXG5cbiAgLyoqXG4gICAqIFBORyBmaWxlcyBvdmVyIHRoaXMgdmFsdWUgKDUgTUIgYnkgZGVmYXVsdCkgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gSlBFR3MuXG4gICAqIFRvIGRpc2FibGUgdGhpcywganVzdCBzZXQgdGhlIHZhbHVlIHRvIGBJbmZpbml0eWAuXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBjb252ZXJ0U2l6ZTogNTAwMDAwMCxcblxuICAvKipcbiAgICogVGhlIGhvb2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSBiZWZvcmUgZHJhdyB0aGUgaW1hZ2UgaW50byB0aGUgY2FudmFzIGZvciBjb21wcmVzc2lvbi5cbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY29udGV4dCAtIFRoZSAyZCByZW5kZXJpbmcgY29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXMgLSBUaGUgY2FudmFzIGZvciBjb21wcmVzc2lvbi5cbiAgICogQGV4YW1wbGVcbiAgICogZnVuY3Rpb24gKGNvbnRleHQsIGNhbnZhcykge1xuICAgKiAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyNmZmYnO1xuICAgKiB9XG4gICAqL1xuICBiZWZvcmVEcmF3OiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaGUgaG9vayBmdW5jdGlvbiB0byBleGVjdXRlIGFmdGVyIGRyZXcgdGhlIGltYWdlIGludG8gdGhlIGNhbnZhcyBmb3IgY29tcHJlc3Npb24uXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGNvbnRleHQgLSBUaGUgMmQgcmVuZGVyaW5nIGNvbnRleHQgb2YgdGhlIGNhbnZhcy5cbiAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudH0gY2FudmFzIC0gVGhlIGNhbnZhcyBmb3IgY29tcHJlc3Npb24uXG4gICAqIEBleGFtcGxlXG4gICAqIGZ1bmN0aW9uIChjb250ZXh0LCBjYW52YXMpIHtcbiAgICogICBjb250ZXh0LmZpbHRlciA9ICdncmF5c2NhbGUoMTAwJSknO1xuICAgKiB9XG4gICAqL1xuICBkcmV3OiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaGUgaG9vayBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gc3VjY2VzcyB0byBjb21wcmVzcyB0aGUgaW1hZ2UuXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICogQHBhcmFtIHtGaWxlfSBmaWxlIC0gVGhlIGNvbXByZXNzZWQgaW1hZ2UgRmlsZSBvYmplY3QuXG4gICAqIEBleGFtcGxlXG4gICAqIGZ1bmN0aW9uIChmaWxlKSB7XG4gICAqICAgY29uc29sZS5sb2coZmlsZSk7XG4gICAqIH1cbiAgICovXG4gIHN1Y2Nlc3M6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRoZSBob29rIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiBmYWlsIHRvIGNvbXByZXNzIHRoZSBpbWFnZS5cbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKiBAcGFyYW0ge0Vycm9yfSBlcnIgLSBBbiBFcnJvciBvYmplY3QuXG4gICAqIEBleGFtcGxlXG4gICAqIGZ1bmN0aW9uIChlcnIpIHtcbiAgICogICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAqIH1cbiAgICovXG4gIGVycm9yOiBudWxsXG59O1xuXG52YXIgSU5fQlJPV1NFUiA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xudmFyIFdJTkRPVyA9IElOX0JST1dTRVIgPyB3aW5kb3cgOiB7fTtcblxudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5LWxpa2Ugb3IgaXRlcmFibGUgb2JqZWN0IHRvIGFuIGFycmF5LlxuICogQHBhcmFtIHsqfSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5LlxuICovXG5cbmZ1bmN0aW9uIHRvQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20gPyBBcnJheS5mcm9tKHZhbHVlKSA6IHNsaWNlLmNhbGwodmFsdWUpO1xufVxudmFyIFJFR0VYUF9JTUFHRV9UWVBFID0gL15pbWFnZVxcLy4rJC87XG4vKipcbiAqIENoZWNrIGlmIHRoZSBnaXZlbiB2YWx1ZSBpcyBhIG1pbWUgdHlwZSBvZiBpbWFnZS5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGdpdmVuIGlzIGEgbWltZSB0eXBlIG9mIGltYWdlLCBlbHNlIGBmYWxzZWAuXG4gKi9cblxuZnVuY3Rpb24gaXNJbWFnZVR5cGUodmFsdWUpIHtcbiAgcmV0dXJuIFJFR0VYUF9JTUFHRV9UWVBFLnRlc3QodmFsdWUpO1xufVxuLyoqXG4gKiBDb252ZXJ0IGltYWdlIHR5cGUgdG8gZXh0ZW5zaW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gVGhlIGltYWdlIHR5cGUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRoZSBpbWFnZSBleHRlbnNpb24uXG4gKi9cblxuZnVuY3Rpb24gaW1hZ2VUeXBlVG9FeHRlbnNpb24odmFsdWUpIHtcbiAgdmFyIGV4dGVuc2lvbiA9IGlzSW1hZ2VUeXBlKHZhbHVlKSA/IHZhbHVlLnN1YnN0cig2KSA6ICcnO1xuXG4gIGlmIChleHRlbnNpb24gPT09ICdqcGVnJykge1xuICAgIGV4dGVuc2lvbiA9ICdqcGcnO1xuICB9XG5cbiAgcmV0dXJuIFwiLlwiLmNvbmNhdChleHRlbnNpb24pO1xufVxudmFyIGZyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG4vKipcbiAqIEdldCBzdHJpbmcgZnJvbSBjaGFyIGNvZGUgaW4gZGF0YSB2aWV3LlxuICogQHBhcmFtIHtEYXRhVmlld30gZGF0YVZpZXcgLSBUaGUgZGF0YSB2aWV3IGZvciByZWFkLlxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IC0gVGhlIHN0YXJ0IGluZGV4LlxuICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSByZWFkIGxlbmd0aC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSByZWFkIHJlc3VsdC5cbiAqL1xuXG5mdW5jdGlvbiBnZXRTdHJpbmdGcm9tQ2hhckNvZGUoZGF0YVZpZXcsIHN0YXJ0LCBsZW5ndGgpIHtcbiAgdmFyIHN0ciA9ICcnO1xuICB2YXIgaTtcbiAgbGVuZ3RoICs9IHN0YXJ0O1xuXG4gIGZvciAoaSA9IHN0YXJ0OyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBzdHIgKz0gZnJvbUNoYXJDb2RlKGRhdGFWaWV3LmdldFVpbnQ4KGkpKTtcbiAgfVxuXG4gIHJldHVybiBzdHI7XG59XG52YXIgYnRvYSA9IFdJTkRPVy5idG9hO1xuLyoqXG4gKiBUcmFuc2Zvcm0gYXJyYXkgYnVmZmVyIHRvIERhdGEgVVJMLlxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXlCdWZmZXIgLSBUaGUgYXJyYXkgYnVmZmVyIHRvIHRyYW5zZm9ybS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBtaW1lVHlwZSAtIFRoZSBtaW1lIHR5cGUgb2YgdGhlIERhdGEgVVJMLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHJlc3VsdCBEYXRhIFVSTC5cbiAqL1xuXG5mdW5jdGlvbiBhcnJheUJ1ZmZlclRvRGF0YVVSTChhcnJheUJ1ZmZlciwgbWltZVR5cGUpIHtcbiAgdmFyIGNodW5rcyA9IFtdO1xuICB2YXIgY2h1bmtTaXplID0gODE5MjtcbiAgdmFyIHVpbnQ4ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xuXG4gIHdoaWxlICh1aW50OC5sZW5ndGggPiAwKSB7XG4gICAgLy8gWFhYOiBCYWJlbCdzIGB0b0NvbnN1bWFibGVBcnJheWAgaGVscGVyIHdpbGwgdGhyb3cgZXJyb3IgaW4gSUUgb3IgU2FmYXJpIDlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLXNwcmVhZFxuICAgIGNodW5rcy5wdXNoKGZyb21DaGFyQ29kZS5hcHBseShudWxsLCB0b0FycmF5KHVpbnQ4LnN1YmFycmF5KDAsIGNodW5rU2l6ZSkpKSk7XG4gICAgdWludDggPSB1aW50OC5zdWJhcnJheShjaHVua1NpemUpO1xuICB9XG5cbiAgcmV0dXJuIFwiZGF0YTpcIi5jb25jYXQobWltZVR5cGUsIFwiO2Jhc2U2NCxcIikuY29uY2F0KGJ0b2EoY2h1bmtzLmpvaW4oJycpKSk7XG59XG4vKipcbiAqIEdldCBvcmllbnRhdGlvbiB2YWx1ZSBmcm9tIGdpdmVuIGFycmF5IGJ1ZmZlci5cbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGFycmF5QnVmZmVyIC0gVGhlIGFycmF5IGJ1ZmZlciB0byByZWFkLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIHJlYWQgb3JpZW50YXRpb24gdmFsdWUuXG4gKi9cblxuZnVuY3Rpb24gcmVzZXRBbmRHZXRPcmllbnRhdGlvbihhcnJheUJ1ZmZlcikge1xuICB2YXIgZGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpO1xuICB2YXIgb3JpZW50YXRpb247IC8vIElnbm9yZXMgcmFuZ2UgZXJyb3Igd2hlbiB0aGUgaW1hZ2UgZG9lcyBub3QgaGF2ZSBjb3JyZWN0IEV4aWYgaW5mb3JtYXRpb25cblxuICB0cnkge1xuICAgIHZhciBsaXR0bGVFbmRpYW47XG4gICAgdmFyIGFwcDFTdGFydDtcbiAgICB2YXIgaWZkU3RhcnQ7IC8vIE9ubHkgaGFuZGxlIEpQRUcgaW1hZ2UgKHN0YXJ0IGJ5IDB4RkZEOClcblxuICAgIGlmIChkYXRhVmlldy5nZXRVaW50OCgwKSA9PT0gMHhGRiAmJiBkYXRhVmlldy5nZXRVaW50OCgxKSA9PT0gMHhEOCkge1xuICAgICAgdmFyIGxlbmd0aCA9IGRhdGFWaWV3LmJ5dGVMZW5ndGg7XG4gICAgICB2YXIgb2Zmc2V0ID0gMjtcblxuICAgICAgd2hpbGUgKG9mZnNldCArIDEgPCBsZW5ndGgpIHtcbiAgICAgICAgaWYgKGRhdGFWaWV3LmdldFVpbnQ4KG9mZnNldCkgPT09IDB4RkYgJiYgZGF0YVZpZXcuZ2V0VWludDgob2Zmc2V0ICsgMSkgPT09IDB4RTEpIHtcbiAgICAgICAgICBhcHAxU3RhcnQgPSBvZmZzZXQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBvZmZzZXQgKz0gMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXBwMVN0YXJ0KSB7XG4gICAgICB2YXIgZXhpZklEQ29kZSA9IGFwcDFTdGFydCArIDQ7XG4gICAgICB2YXIgdGlmZk9mZnNldCA9IGFwcDFTdGFydCArIDEwO1xuXG4gICAgICBpZiAoZ2V0U3RyaW5nRnJvbUNoYXJDb2RlKGRhdGFWaWV3LCBleGlmSURDb2RlLCA0KSA9PT0gJ0V4aWYnKSB7XG4gICAgICAgIHZhciBlbmRpYW5uZXNzID0gZGF0YVZpZXcuZ2V0VWludDE2KHRpZmZPZmZzZXQpO1xuICAgICAgICBsaXR0bGVFbmRpYW4gPSBlbmRpYW5uZXNzID09PSAweDQ5NDk7XG5cbiAgICAgICAgaWYgKGxpdHRsZUVuZGlhbiB8fCBlbmRpYW5uZXNzID09PSAweDRENERcbiAgICAgICAgLyogYmlnRW5kaWFuICovXG4gICAgICAgICkge1xuICAgICAgICAgICAgaWYgKGRhdGFWaWV3LmdldFVpbnQxNih0aWZmT2Zmc2V0ICsgMiwgbGl0dGxlRW5kaWFuKSA9PT0gMHgwMDJBKSB7XG4gICAgICAgICAgICAgIHZhciBmaXJzdElGRE9mZnNldCA9IGRhdGFWaWV3LmdldFVpbnQzMih0aWZmT2Zmc2V0ICsgNCwgbGl0dGxlRW5kaWFuKTtcblxuICAgICAgICAgICAgICBpZiAoZmlyc3RJRkRPZmZzZXQgPj0gMHgwMDAwMDAwOCkge1xuICAgICAgICAgICAgICAgIGlmZFN0YXJ0ID0gdGlmZk9mZnNldCArIGZpcnN0SUZET2Zmc2V0O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpZmRTdGFydCkge1xuICAgICAgdmFyIF9sZW5ndGggPSBkYXRhVmlldy5nZXRVaW50MTYoaWZkU3RhcnQsIGxpdHRsZUVuZGlhbik7XG5cbiAgICAgIHZhciBfb2Zmc2V0O1xuXG4gICAgICB2YXIgaTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IF9sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBfb2Zmc2V0ID0gaWZkU3RhcnQgKyBpICogMTIgKyAyO1xuXG4gICAgICAgIGlmIChkYXRhVmlldy5nZXRVaW50MTYoX29mZnNldCwgbGl0dGxlRW5kaWFuKSA9PT0gMHgwMTEyXG4gICAgICAgIC8qIE9yaWVudGF0aW9uICovXG4gICAgICAgICkge1xuICAgICAgICAgICAgLy8gOCBpcyB0aGUgb2Zmc2V0IG9mIHRoZSBjdXJyZW50IHRhZydzIHZhbHVlXG4gICAgICAgICAgICBfb2Zmc2V0ICs9IDg7IC8vIEdldCB0aGUgb3JpZ2luYWwgb3JpZW50YXRpb24gdmFsdWVcblxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSBkYXRhVmlldy5nZXRVaW50MTYoX29mZnNldCwgbGl0dGxlRW5kaWFuKTsgLy8gT3ZlcnJpZGUgdGhlIG9yaWVudGF0aW9uIHdpdGggaXRzIGRlZmF1bHQgdmFsdWVcblxuICAgICAgICAgICAgZGF0YVZpZXcuc2V0VWludDE2KF9vZmZzZXQsIDEsIGxpdHRsZUVuZGlhbik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgb3JpZW50YXRpb24gPSAxO1xuICB9XG5cbiAgcmV0dXJuIG9yaWVudGF0aW9uO1xufVxuLyoqXG4gKiBQYXJzZSBFeGlmIE9yaWVudGF0aW9uIHZhbHVlLlxuICogQHBhcmFtIHtudW1iZXJ9IG9yaWVudGF0aW9uIC0gVGhlIG9yaWVudGF0aW9uIHRvIHBhcnNlLlxuICogQHJldHVybnMge09iamVjdH0gVGhlIHBhcnNlZCByZXN1bHQuXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VPcmllbnRhdGlvbihvcmllbnRhdGlvbikge1xuICB2YXIgcm90YXRlID0gMDtcbiAgdmFyIHNjYWxlWCA9IDE7XG4gIHZhciBzY2FsZVkgPSAxO1xuXG4gIHN3aXRjaCAob3JpZW50YXRpb24pIHtcbiAgICAvLyBGbGlwIGhvcml6b250YWxcbiAgICBjYXNlIDI6XG4gICAgICBzY2FsZVggPSAtMTtcbiAgICAgIGJyZWFrO1xuICAgIC8vIFJvdGF0ZSBsZWZ0IDE4MMKwXG5cbiAgICBjYXNlIDM6XG4gICAgICByb3RhdGUgPSAtMTgwO1xuICAgICAgYnJlYWs7XG4gICAgLy8gRmxpcCB2ZXJ0aWNhbFxuXG4gICAgY2FzZSA0OlxuICAgICAgc2NhbGVZID0gLTE7XG4gICAgICBicmVhaztcbiAgICAvLyBGbGlwIHZlcnRpY2FsIGFuZCByb3RhdGUgcmlnaHQgOTDCsFxuXG4gICAgY2FzZSA1OlxuICAgICAgcm90YXRlID0gOTA7XG4gICAgICBzY2FsZVkgPSAtMTtcbiAgICAgIGJyZWFrO1xuICAgIC8vIFJvdGF0ZSByaWdodCA5MMKwXG5cbiAgICBjYXNlIDY6XG4gICAgICByb3RhdGUgPSA5MDtcbiAgICAgIGJyZWFrO1xuICAgIC8vIEZsaXAgaG9yaXpvbnRhbCBhbmQgcm90YXRlIHJpZ2h0IDkwwrBcblxuICAgIGNhc2UgNzpcbiAgICAgIHJvdGF0ZSA9IDkwO1xuICAgICAgc2NhbGVYID0gLTE7XG4gICAgICBicmVhaztcbiAgICAvLyBSb3RhdGUgbGVmdCA5MMKwXG5cbiAgICBjYXNlIDg6XG4gICAgICByb3RhdGUgPSAtOTA7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHJvdGF0ZTogcm90YXRlLFxuICAgIHNjYWxlWDogc2NhbGVYLFxuICAgIHNjYWxlWTogc2NhbGVZXG4gIH07XG59XG52YXIgUkVHRVhQX0RFQ0lNQUxTID0gL1xcLlxcZCooPzowfDkpezEyfVxcZCokLztcbi8qKlxuICogTm9ybWFsaXplIGRlY2ltYWwgbnVtYmVyLlxuICogQ2hlY2sgb3V0IHtAbGluayBodHRwOi8vMC4zMDAwMDAwMDAwMDAwMDAwNC5jb20vfVxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gVGhlIHZhbHVlIHRvIG5vcm1hbGl6ZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZXM9MTAwMDAwMDAwMDAwXSAtIFRoZSB0aW1lcyBmb3Igbm9ybWFsaXppbmcuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBub3JtYWxpemVkIG51bWJlci5cbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemVEZWNpbWFsTnVtYmVyKHZhbHVlKSB7XG4gIHZhciB0aW1lcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMTAwMDAwMDAwMDAwO1xuICByZXR1cm4gUkVHRVhQX0RFQ0lNQUxTLnRlc3QodmFsdWUpID8gTWF0aC5yb3VuZCh2YWx1ZSAqIHRpbWVzKSAvIHRpbWVzIDogdmFsdWU7XG59XG5cbnZhciBBcnJheUJ1ZmZlciQxID0gV0lORE9XLkFycmF5QnVmZmVyLFxuICAgIEZpbGVSZWFkZXIgPSBXSU5ET1cuRmlsZVJlYWRlcjtcbnZhciBVUkwgPSBXSU5ET1cuVVJMIHx8IFdJTkRPVy53ZWJraXRVUkw7XG52YXIgUkVHRVhQX0VYVEVOU0lPTiA9IC9cXC5cXHcrJC87XG52YXIgQW5vdGhlckNvbXByZXNzb3IgPSBXSU5ET1cuQ29tcHJlc3Nvcjtcbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBpbWFnZSBjb21wcmVzc29yLlxuICogQGNsYXNzXG4gKi9cblxudmFyIENvbXByZXNzb3IgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICAvKipcbiAgICogVGhlIGNvbnN0cnVjdG9yIG9mIENvbXByZXNzb3IuXG4gICAqIEBwYXJhbSB7RmlsZXxCbG9ifSBmaWxlIC0gVGhlIHRhcmdldCBpbWFnZSBmaWxlIGZvciBjb21wcmVzc2luZy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIFRoZSBvcHRpb25zIGZvciBjb21wcmVzc2luZy5cbiAgICovXG4gIGZ1bmN0aW9uIENvbXByZXNzb3IoZmlsZSwgb3B0aW9ucykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb21wcmVzc29yKTtcblxuICAgIHRoaXMuZmlsZSA9IGZpbGU7XG4gICAgdGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgIHRoaXMub3B0aW9ucyA9IF9vYmplY3RTcHJlYWQoe30sIERFRkFVTFRTLCBvcHRpb25zKTtcbiAgICB0aGlzLmFib3J0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnJlc3VsdCA9IG51bGw7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ29tcHJlc3NvciwgW3tcbiAgICBrZXk6IFwiaW5pdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGZpbGUgPSB0aGlzLmZpbGUsXG4gICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgaWYgKCFpc0Jsb2IoZmlsZSkpIHtcbiAgICAgICAgdGhpcy5mYWlsKG5ldyBFcnJvcignVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBGaWxlIG9yIEJsb2Igb2JqZWN0LicpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWltZVR5cGUgPSBmaWxlLnR5cGU7XG5cbiAgICAgIGlmICghaXNJbWFnZVR5cGUobWltZVR5cGUpKSB7XG4gICAgICAgIHRoaXMuZmFpbChuZXcgRXJyb3IoJ1RoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGFuIGltYWdlIEZpbGUgb3IgQmxvYiBvYmplY3QuJykpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghVVJMIHx8ICFGaWxlUmVhZGVyKSB7XG4gICAgICAgIHRoaXMuZmFpbChuZXcgRXJyb3IoJ1RoZSBjdXJyZW50IGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBpbWFnZSBjb21wcmVzc2lvbi4nKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFBcnJheUJ1ZmZlciQxKSB7XG4gICAgICAgIG9wdGlvbnMuY2hlY2tPcmllbnRhdGlvbiA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoVVJMICYmICFvcHRpb25zLmNoZWNrT3JpZW50YXRpb24pIHtcbiAgICAgICAgdGhpcy5sb2FkKHtcbiAgICAgICAgICB1cmw6IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgdmFyIGNoZWNrT3JpZW50YXRpb24gPSBvcHRpb25zLmNoZWNrT3JpZW50YXRpb24gJiYgbWltZVR5cGUgPT09ICdpbWFnZS9qcGVnJztcbiAgICAgICAgdGhpcy5yZWFkZXIgPSByZWFkZXI7XG5cbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICAgICAgdmFyIHRhcmdldCA9IF9yZWYudGFyZ2V0O1xuICAgICAgICAgIHZhciByZXN1bHQgPSB0YXJnZXQucmVzdWx0O1xuICAgICAgICAgIHZhciBkYXRhID0ge307XG5cbiAgICAgICAgICBpZiAoY2hlY2tPcmllbnRhdGlvbikge1xuICAgICAgICAgICAgLy8gUmVzZXQgdGhlIG9yaWVudGF0aW9uIHZhbHVlIHRvIGl0cyBkZWZhdWx0IHZhbHVlIDFcbiAgICAgICAgICAgIC8vIGFzIHNvbWUgaU9TIGJyb3dzZXJzIHdpbGwgcmVuZGVyIGltYWdlIHdpdGggaXRzIG9yaWVudGF0aW9uXG4gICAgICAgICAgICB2YXIgb3JpZW50YXRpb24gPSByZXNldEFuZEdldE9yaWVudGF0aW9uKHJlc3VsdCk7XG5cbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA+IDEgfHwgIVVSTCkge1xuICAgICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIG5ldyBVUkwgd2hpY2ggaGFzIHRoZSBkZWZhdWx0IG9yaWVudGF0aW9uIHZhbHVlXG4gICAgICAgICAgICAgIGRhdGEudXJsID0gYXJyYXlCdWZmZXJUb0RhdGFVUkwocmVzdWx0LCBtaW1lVHlwZSk7XG5cbiAgICAgICAgICAgICAgaWYgKG9yaWVudGF0aW9uID4gMSkge1xuICAgICAgICAgICAgICAgIF9leHRlbmRzKGRhdGEsIHBhcnNlT3JpZW50YXRpb24ob3JpZW50YXRpb24pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZGF0YS51cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLnVybCA9IHJlc3VsdDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfdGhpcy5sb2FkKGRhdGEpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlYWRlci5vbmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzLmZhaWwobmV3IEVycm9yKCdBYm9ydGVkIHRvIHJlYWQgdGhlIGltYWdlIHdpdGggRmlsZVJlYWRlci4nKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX3RoaXMuZmFpbChuZXcgRXJyb3IoJ0ZhaWxlZCB0byByZWFkIHRoZSBpbWFnZSB3aXRoIEZpbGVSZWFkZXIuJykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlYWRlci5vbmxvYWRlbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX3RoaXMucmVhZGVyID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoY2hlY2tPcmllbnRhdGlvbikge1xuICAgICAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihmaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxvYWQoZGF0YSkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHZhciBmaWxlID0gdGhpcy5maWxlLFxuICAgICAgICAgIGltYWdlID0gdGhpcy5pbWFnZTtcblxuICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpczIuZHJhdyhfb2JqZWN0U3ByZWFkKHt9LCBkYXRhLCB7XG4gICAgICAgICAgbmF0dXJhbFdpZHRoOiBpbWFnZS5uYXR1cmFsV2lkdGgsXG4gICAgICAgICAgbmF0dXJhbEhlaWdodDogaW1hZ2UubmF0dXJhbEhlaWdodFxuICAgICAgICB9KSk7XG4gICAgICB9O1xuXG4gICAgICBpbWFnZS5vbmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpczIuZmFpbChuZXcgRXJyb3IoJ0Fib3J0ZWQgdG8gbG9hZCB0aGUgaW1hZ2UuJykpO1xuICAgICAgfTtcblxuICAgICAgaW1hZ2Uub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMyLmZhaWwobmV3IEVycm9yKCdGYWlsZWQgdG8gbG9hZCB0aGUgaW1hZ2UuJykpO1xuICAgICAgfTtcblxuICAgICAgaW1hZ2UuYWx0ID0gZmlsZS5uYW1lO1xuICAgICAgaW1hZ2Uuc3JjID0gZGF0YS51cmw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRyYXdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZHJhdyhfcmVmMikge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIHZhciBuYXR1cmFsV2lkdGggPSBfcmVmMi5uYXR1cmFsV2lkdGgsXG4gICAgICAgICAgbmF0dXJhbEhlaWdodCA9IF9yZWYyLm5hdHVyYWxIZWlnaHQsXG4gICAgICAgICAgX3JlZjIkcm90YXRlID0gX3JlZjIucm90YXRlLFxuICAgICAgICAgIHJvdGF0ZSA9IF9yZWYyJHJvdGF0ZSA9PT0gdm9pZCAwID8gMCA6IF9yZWYyJHJvdGF0ZSxcbiAgICAgICAgICBfcmVmMiRzY2FsZVggPSBfcmVmMi5zY2FsZVgsXG4gICAgICAgICAgc2NhbGVYID0gX3JlZjIkc2NhbGVYID09PSB2b2lkIDAgPyAxIDogX3JlZjIkc2NhbGVYLFxuICAgICAgICAgIF9yZWYyJHNjYWxlWSA9IF9yZWYyLnNjYWxlWSxcbiAgICAgICAgICBzY2FsZVkgPSBfcmVmMiRzY2FsZVkgPT09IHZvaWQgMCA/IDEgOiBfcmVmMiRzY2FsZVk7XG4gICAgICB2YXIgZmlsZSA9IHRoaXMuZmlsZSxcbiAgICAgICAgICBpbWFnZSA9IHRoaXMuaW1hZ2UsXG4gICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICB2YXIgYXNwZWN0UmF0aW8gPSBuYXR1cmFsV2lkdGggLyBuYXR1cmFsSGVpZ2h0O1xuICAgICAgdmFyIGlzOTBEZWdyZWVzUm90YXRlZCA9IE1hdGguYWJzKHJvdGF0ZSkgJSAxODAgPT09IDkwO1xuICAgICAgdmFyIG1heFdpZHRoID0gTWF0aC5tYXgob3B0aW9ucy5tYXhXaWR0aCwgMCkgfHwgSW5maW5pdHk7XG4gICAgICB2YXIgbWF4SGVpZ2h0ID0gTWF0aC5tYXgob3B0aW9ucy5tYXhIZWlnaHQsIDApIHx8IEluZmluaXR5O1xuICAgICAgdmFyIG1pbldpZHRoID0gTWF0aC5tYXgob3B0aW9ucy5taW5XaWR0aCwgMCkgfHwgMDtcbiAgICAgIHZhciBtaW5IZWlnaHQgPSBNYXRoLm1heChvcHRpb25zLm1pbkhlaWdodCwgMCkgfHwgMDtcbiAgICAgIHZhciB3aWR0aCA9IE1hdGgubWF4KG9wdGlvbnMud2lkdGgsIDApIHx8IG5hdHVyYWxXaWR0aDtcbiAgICAgIHZhciBoZWlnaHQgPSBNYXRoLm1heChvcHRpb25zLmhlaWdodCwgMCkgfHwgbmF0dXJhbEhlaWdodDtcblxuICAgICAgaWYgKGlzOTBEZWdyZWVzUm90YXRlZCkge1xuICAgICAgICB2YXIgX3JlZjMgPSBbbWF4SGVpZ2h0LCBtYXhXaWR0aF07XG4gICAgICAgIG1heFdpZHRoID0gX3JlZjNbMF07XG4gICAgICAgIG1heEhlaWdodCA9IF9yZWYzWzFdO1xuICAgICAgICB2YXIgX3JlZjQgPSBbbWluSGVpZ2h0LCBtaW5XaWR0aF07XG4gICAgICAgIG1pbldpZHRoID0gX3JlZjRbMF07XG4gICAgICAgIG1pbkhlaWdodCA9IF9yZWY0WzFdO1xuICAgICAgICB2YXIgX3JlZjUgPSBbaGVpZ2h0LCB3aWR0aF07XG4gICAgICAgIHdpZHRoID0gX3JlZjVbMF07XG4gICAgICAgIGhlaWdodCA9IF9yZWY1WzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAobWF4V2lkdGggPCBJbmZpbml0eSAmJiBtYXhIZWlnaHQgPCBJbmZpbml0eSkge1xuICAgICAgICBpZiAobWF4SGVpZ2h0ICogYXNwZWN0UmF0aW8gPiBtYXhXaWR0aCkge1xuICAgICAgICAgIG1heEhlaWdodCA9IG1heFdpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWF4V2lkdGggPSBtYXhIZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChtYXhXaWR0aCA8IEluZmluaXR5KSB7XG4gICAgICAgIG1heEhlaWdodCA9IG1heFdpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICB9IGVsc2UgaWYgKG1heEhlaWdodCA8IEluZmluaXR5KSB7XG4gICAgICAgIG1heFdpZHRoID0gbWF4SGVpZ2h0ICogYXNwZWN0UmF0aW87XG4gICAgICB9XG5cbiAgICAgIGlmIChtaW5XaWR0aCA+IDAgJiYgbWluSGVpZ2h0ID4gMCkge1xuICAgICAgICBpZiAobWluSGVpZ2h0ICogYXNwZWN0UmF0aW8gPiBtaW5XaWR0aCkge1xuICAgICAgICAgIG1pbkhlaWdodCA9IG1pbldpZHRoIC8gYXNwZWN0UmF0aW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWluV2lkdGggPSBtaW5IZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChtaW5XaWR0aCA+IDApIHtcbiAgICAgICAgbWluSGVpZ2h0ID0gbWluV2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICAgIH0gZWxzZSBpZiAobWluSGVpZ2h0ID4gMCkge1xuICAgICAgICBtaW5XaWR0aCA9IG1pbkhlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGVpZ2h0ICogYXNwZWN0UmF0aW8gPiB3aWR0aCkge1xuICAgICAgICBoZWlnaHQgPSB3aWR0aCAvIGFzcGVjdFJhdGlvO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2lkdGggPSBoZWlnaHQgKiBhc3BlY3RSYXRpbztcbiAgICAgIH1cblxuICAgICAgd2lkdGggPSBNYXRoLmZsb29yKG5vcm1hbGl6ZURlY2ltYWxOdW1iZXIoTWF0aC5taW4oTWF0aC5tYXgod2lkdGgsIG1pbldpZHRoKSwgbWF4V2lkdGgpKSk7XG4gICAgICBoZWlnaHQgPSBNYXRoLmZsb29yKG5vcm1hbGl6ZURlY2ltYWxOdW1iZXIoTWF0aC5taW4oTWF0aC5tYXgoaGVpZ2h0LCBtaW5IZWlnaHQpLCBtYXhIZWlnaHQpKSk7XG4gICAgICB2YXIgZGVzdFggPSAtd2lkdGggLyAyO1xuICAgICAgdmFyIGRlc3RZID0gLWhlaWdodCAvIDI7XG4gICAgICB2YXIgZGVzdFdpZHRoID0gd2lkdGg7XG4gICAgICB2YXIgZGVzdEhlaWdodCA9IGhlaWdodDtcblxuICAgICAgaWYgKGlzOTBEZWdyZWVzUm90YXRlZCkge1xuICAgICAgICB2YXIgX3JlZjYgPSBbaGVpZ2h0LCB3aWR0aF07XG4gICAgICAgIHdpZHRoID0gX3JlZjZbMF07XG4gICAgICAgIGhlaWdodCA9IF9yZWY2WzFdO1xuICAgICAgfVxuXG4gICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgIGlmICghaXNJbWFnZVR5cGUob3B0aW9ucy5taW1lVHlwZSkpIHtcbiAgICAgICAgb3B0aW9ucy5taW1lVHlwZSA9IGZpbGUudHlwZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZpbGxTdHlsZSA9ICd0cmFuc3BhcmVudCc7IC8vIENvbnZlcnRzIFBORyBmaWxlcyBvdmVyIHRoZSBgY29udmVydFNpemVgIHRvIEpQRUdzLlxuXG4gICAgICBpZiAoZmlsZS5zaXplID4gb3B0aW9ucy5jb252ZXJ0U2l6ZSAmJiBvcHRpb25zLm1pbWVUeXBlID09PSAnaW1hZ2UvcG5nJykge1xuICAgICAgICBmaWxsU3R5bGUgPSAnI2ZmZic7XG4gICAgICAgIG9wdGlvbnMubWltZVR5cGUgPSAnaW1hZ2UvanBlZyc7XG4gICAgICB9IC8vIE92ZXJyaWRlIHRoZSBkZWZhdWx0IGZpbGwgY29sb3IgKCMwMDAsIGJsYWNrKVxuXG5cbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZmlsbFN0eWxlO1xuICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgaWYgKG9wdGlvbnMuYmVmb3JlRHJhdykge1xuICAgICAgICBvcHRpb25zLmJlZm9yZURyYXcuY2FsbCh0aGlzLCBjb250ZXh0LCBjYW52YXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5hYm9ydGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5zYXZlKCk7XG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZSh3aWR0aCAvIDIsIGhlaWdodCAvIDIpO1xuICAgICAgY29udGV4dC5yb3RhdGUocm90YXRlICogTWF0aC5QSSAvIDE4MCk7XG4gICAgICBjb250ZXh0LnNjYWxlKHNjYWxlWCwgc2NhbGVZKTtcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCBkZXN0WCwgZGVzdFksIGRlc3RXaWR0aCwgZGVzdEhlaWdodCk7XG4gICAgICBjb250ZXh0LnJlc3RvcmUoKTtcblxuICAgICAgaWYgKG9wdGlvbnMuZHJldykge1xuICAgICAgICBvcHRpb25zLmRyZXcuY2FsbCh0aGlzLCBjb250ZXh0LCBjYW52YXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5hYm9ydGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGRvbmUgPSBmdW5jdGlvbiBkb25lKHJlc3VsdCkge1xuICAgICAgICBpZiAoIV90aGlzMy5hYm9ydGVkKSB7XG4gICAgICAgICAgX3RoaXMzLmRvbmUoe1xuICAgICAgICAgICAgbmF0dXJhbFdpZHRoOiBuYXR1cmFsV2lkdGgsXG4gICAgICAgICAgICBuYXR1cmFsSGVpZ2h0OiBuYXR1cmFsSGVpZ2h0LFxuICAgICAgICAgICAgcmVzdWx0OiByZXN1bHRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKGNhbnZhcy50b0Jsb2IpIHtcbiAgICAgICAgY2FudmFzLnRvQmxvYihkb25lLCBvcHRpb25zLm1pbWVUeXBlLCBvcHRpb25zLnF1YWxpdHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9uZShjYW52YXNUb0Jsb2IoY2FudmFzLnRvRGF0YVVSTChvcHRpb25zLm1pbWVUeXBlLCBvcHRpb25zLnF1YWxpdHkpKSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRvbmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZG9uZShfcmVmNykge1xuICAgICAgdmFyIG5hdHVyYWxXaWR0aCA9IF9yZWY3Lm5hdHVyYWxXaWR0aCxcbiAgICAgICAgICBuYXR1cmFsSGVpZ2h0ID0gX3JlZjcubmF0dXJhbEhlaWdodCxcbiAgICAgICAgICByZXN1bHQgPSBfcmVmNy5yZXN1bHQ7XG4gICAgICB2YXIgZmlsZSA9IHRoaXMuZmlsZSxcbiAgICAgICAgICBpbWFnZSA9IHRoaXMuaW1hZ2UsXG4gICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgaWYgKFVSTCAmJiAhb3B0aW9ucy5jaGVja09yaWVudGF0aW9uKSB7XG4gICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwoaW1hZ2Uuc3JjKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAvLyBSZXR1cm5zIG9yaWdpbmFsIGZpbGUgaWYgdGhlIHJlc3VsdCBpcyBncmVhdGVyIHRoYW4gaXQgYW5kIHdpdGhvdXQgc2l6ZSByZWxhdGVkIG9wdGlvbnNcbiAgICAgICAgaWYgKG9wdGlvbnMuc3RyaWN0ICYmIHJlc3VsdC5zaXplID4gZmlsZS5zaXplICYmIG9wdGlvbnMubWltZVR5cGUgPT09IGZpbGUudHlwZSAmJiAhKG9wdGlvbnMud2lkdGggPiBuYXR1cmFsV2lkdGggfHwgb3B0aW9ucy5oZWlnaHQgPiBuYXR1cmFsSGVpZ2h0IHx8IG9wdGlvbnMubWluV2lkdGggPiBuYXR1cmFsV2lkdGggfHwgb3B0aW9ucy5taW5IZWlnaHQgPiBuYXR1cmFsSGVpZ2h0KSkge1xuICAgICAgICAgIHJlc3VsdCA9IGZpbGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIHJlc3VsdC5sYXN0TW9kaWZpZWQgPSBkYXRlLmdldFRpbWUoKTtcbiAgICAgICAgICByZXN1bHQubGFzdE1vZGlmaWVkRGF0ZSA9IGRhdGU7XG4gICAgICAgICAgcmVzdWx0Lm5hbWUgPSBmaWxlLm5hbWU7IC8vIENvbnZlcnQgdGhlIGV4dGVuc2lvbiB0byBtYXRjaCBpdHMgdHlwZVxuXG4gICAgICAgICAgaWYgKHJlc3VsdC5uYW1lICYmIHJlc3VsdC50eXBlICE9PSBmaWxlLnR5cGUpIHtcbiAgICAgICAgICAgIHJlc3VsdC5uYW1lID0gcmVzdWx0Lm5hbWUucmVwbGFjZShSRUdFWFBfRVhURU5TSU9OLCBpbWFnZVR5cGVUb0V4dGVuc2lvbihyZXN1bHQudHlwZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUmV0dXJucyBvcmlnaW5hbCBmaWxlIGlmIHRoZSByZXN1bHQgaXMgbnVsbCBpbiBzb21lIGNhc2VzLlxuICAgICAgICByZXN1bHQgPSBmaWxlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlc3VsdCA9IHJlc3VsdDtcblxuICAgICAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuY2FsbCh0aGlzLCByZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJmYWlsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZhaWwoZXJyKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgaWYgKG9wdGlvbnMuZXJyb3IpIHtcbiAgICAgICAgb3B0aW9ucy5lcnJvci5jYWxsKHRoaXMsIGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFib3J0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFib3J0KCkge1xuICAgICAgaWYgKCF0aGlzLmFib3J0ZWQpIHtcbiAgICAgICAgdGhpcy5hYm9ydGVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAodGhpcy5yZWFkZXIpIHtcbiAgICAgICAgICB0aGlzLnJlYWRlci5hYm9ydCgpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmltYWdlLmNvbXBsZXRlKSB7XG4gICAgICAgICAgdGhpcy5pbWFnZS5vbmxvYWQgPSBudWxsO1xuICAgICAgICAgIHRoaXMuaW1hZ2Uub25hYm9ydCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZmFpbChuZXcgRXJyb3IoJ1RoZSBjb21wcmVzc2lvbiBwcm9jZXNzIGhhcyBiZWVuIGFib3J0ZWQuJykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbm8gY29uZmxpY3QgY29tcHJlc3NvciBjbGFzcy5cbiAgICAgKiBAcmV0dXJucyB7Q29tcHJlc3Nvcn0gVGhlIGNvbXByZXNzb3IgY2xhc3MuXG4gICAgICovXG5cbiAgfV0sIFt7XG4gICAga2V5OiBcIm5vQ29uZmxpY3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbm9Db25mbGljdCgpIHtcbiAgICAgIHdpbmRvdy5Db21wcmVzc29yID0gQW5vdGhlckNvbXByZXNzb3I7XG4gICAgICByZXR1cm4gQ29tcHJlc3NvcjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBkZWZhdWx0IG9wdGlvbnMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgbmV3IGRlZmF1bHQgb3B0aW9ucy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInNldERlZmF1bHRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldERlZmF1bHRzKG9wdGlvbnMpIHtcbiAgICAgIF9leHRlbmRzKERFRkFVTFRTLCBvcHRpb25zKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ29tcHJlc3Nvcjtcbn0oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wcmVzc29yO1xuIiwiLy8hIG1vbWVudC5qc1xuXG47KGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgICBnbG9iYWwubW9tZW50ID0gZmFjdG9yeSgpXG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxudmFyIGhvb2tDYWxsYmFjaztcblxuZnVuY3Rpb24gaG9va3MgKCkge1xuICAgIHJldHVybiBob29rQ2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbn1cblxuLy8gVGhpcyBpcyBkb25lIHRvIHJlZ2lzdGVyIHRoZSBtZXRob2QgY2FsbGVkIHdpdGggbW9tZW50KClcbi8vIHdpdGhvdXQgY3JlYXRpbmcgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuZnVuY3Rpb24gc2V0SG9va0NhbGxiYWNrIChjYWxsYmFjaykge1xuICAgIGhvb2tDYWxsYmFjayA9IGNhbGxiYWNrO1xufVxuXG5mdW5jdGlvbiBpc0FycmF5KGlucHV0KSB7XG4gICAgcmV0dXJuIGlucHV0IGluc3RhbmNlb2YgQXJyYXkgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoaW5wdXQpIHtcbiAgICAvLyBJRTggd2lsbCB0cmVhdCB1bmRlZmluZWQgYW5kIG51bGwgYXMgb2JqZWN0IGlmIGl0IHdhc24ndCBmb3JcbiAgICAvLyBpbnB1dCAhPSBudWxsXG4gICAgcmV0dXJuIGlucHV0ICE9IG51bGwgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0RW1wdHkob2JqKSB7XG4gICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKSB7XG4gICAgICAgIHJldHVybiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5sZW5ndGggPT09IDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBrO1xuICAgICAgICBmb3IgKGsgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoaW5wdXQpIHtcbiAgICByZXR1cm4gaW5wdXQgPT09IHZvaWQgMDtcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoaW5wdXQpIHtcbiAgICByZXR1cm4gdHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJyB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBOdW1iZXJdJztcbn1cblxuZnVuY3Rpb24gaXNEYXRlKGlucHV0KSB7XG4gICAgcmV0dXJuIGlucHV0IGluc3RhbmNlb2YgRGF0ZSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbmZ1bmN0aW9uIG1hcChhcnIsIGZuKSB7XG4gICAgdmFyIHJlcyA9IFtdLCBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcmVzLnB1c2goZm4oYXJyW2ldLCBpKSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIGhhc093blByb3AoYSwgYikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSwgYik7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZChhLCBiKSB7XG4gICAgZm9yICh2YXIgaSBpbiBiKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsIGkpKSB7XG4gICAgICAgICAgICBhW2ldID0gYltpXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNPd25Qcm9wKGIsICd0b1N0cmluZycpKSB7XG4gICAgICAgIGEudG9TdHJpbmcgPSBiLnRvU3RyaW5nO1xuICAgIH1cblxuICAgIGlmIChoYXNPd25Qcm9wKGIsICd2YWx1ZU9mJykpIHtcbiAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgIH1cblxuICAgIHJldHVybiBhO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVVVEMgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgcmV0dXJuIGNyZWF0ZUxvY2FsT3JVVEMoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIHRydWUpLnV0YygpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0UGFyc2luZ0ZsYWdzKCkge1xuICAgIC8vIFdlIG5lZWQgdG8gZGVlcCBjbG9uZSB0aGlzIG9iamVjdC5cbiAgICByZXR1cm4ge1xuICAgICAgICBlbXB0eSAgICAgICAgICAgOiBmYWxzZSxcbiAgICAgICAgdW51c2VkVG9rZW5zICAgIDogW10sXG4gICAgICAgIHVudXNlZElucHV0ICAgICA6IFtdLFxuICAgICAgICBvdmVyZmxvdyAgICAgICAgOiAtMixcbiAgICAgICAgY2hhcnNMZWZ0T3ZlciAgIDogMCxcbiAgICAgICAgbnVsbElucHV0ICAgICAgIDogZmFsc2UsXG4gICAgICAgIGludmFsaWRNb250aCAgICA6IG51bGwsXG4gICAgICAgIGludmFsaWRGb3JtYXQgICA6IGZhbHNlLFxuICAgICAgICB1c2VySW52YWxpZGF0ZWQgOiBmYWxzZSxcbiAgICAgICAgaXNvICAgICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgIHBhcnNlZERhdGVQYXJ0cyA6IFtdLFxuICAgICAgICBtZXJpZGllbSAgICAgICAgOiBudWxsLFxuICAgICAgICByZmMyODIyICAgICAgICAgOiBmYWxzZSxcbiAgICAgICAgd2Vla2RheU1pc21hdGNoIDogZmFsc2VcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBnZXRQYXJzaW5nRmxhZ3MobSkge1xuICAgIGlmIChtLl9wZiA9PSBudWxsKSB7XG4gICAgICAgIG0uX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuICAgIH1cbiAgICByZXR1cm4gbS5fcGY7XG59XG5cbnZhciBzb21lO1xuaWYgKEFycmF5LnByb3RvdHlwZS5zb21lKSB7XG4gICAgc29tZSA9IEFycmF5LnByb3RvdHlwZS5zb21lO1xufSBlbHNlIHtcbiAgICBzb21lID0gZnVuY3Rpb24gKGZ1bikge1xuICAgICAgICB2YXIgdCA9IE9iamVjdCh0aGlzKTtcbiAgICAgICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHQgJiYgZnVuLmNhbGwodGhpcywgdFtpXSwgaSwgdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkKG0pIHtcbiAgICBpZiAobS5faXNWYWxpZCA9PSBudWxsKSB7XG4gICAgICAgIHZhciBmbGFncyA9IGdldFBhcnNpbmdGbGFncyhtKTtcbiAgICAgICAgdmFyIHBhcnNlZFBhcnRzID0gc29tZS5jYWxsKGZsYWdzLnBhcnNlZERhdGVQYXJ0cywgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpICE9IG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgaXNOb3dWYWxpZCA9ICFpc05hTihtLl9kLmdldFRpbWUoKSkgJiZcbiAgICAgICAgICAgIGZsYWdzLm92ZXJmbG93IDwgMCAmJlxuICAgICAgICAgICAgIWZsYWdzLmVtcHR5ICYmXG4gICAgICAgICAgICAhZmxhZ3MuaW52YWxpZE1vbnRoICYmXG4gICAgICAgICAgICAhZmxhZ3MuaW52YWxpZFdlZWtkYXkgJiZcbiAgICAgICAgICAgICFmbGFncy53ZWVrZGF5TWlzbWF0Y2ggJiZcbiAgICAgICAgICAgICFmbGFncy5udWxsSW5wdXQgJiZcbiAgICAgICAgICAgICFmbGFncy5pbnZhbGlkRm9ybWF0ICYmXG4gICAgICAgICAgICAhZmxhZ3MudXNlckludmFsaWRhdGVkICYmXG4gICAgICAgICAgICAoIWZsYWdzLm1lcmlkaWVtIHx8IChmbGFncy5tZXJpZGllbSAmJiBwYXJzZWRQYXJ0cykpO1xuXG4gICAgICAgIGlmIChtLl9zdHJpY3QpIHtcbiAgICAgICAgICAgIGlzTm93VmFsaWQgPSBpc05vd1ZhbGlkICYmXG4gICAgICAgICAgICAgICAgZmxhZ3MuY2hhcnNMZWZ0T3ZlciA9PT0gMCAmJlxuICAgICAgICAgICAgICAgIGZsYWdzLnVudXNlZFRva2Vucy5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAgICAgICBmbGFncy5iaWdIb3VyID09PSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmlzRnJvemVuID09IG51bGwgfHwgIU9iamVjdC5pc0Zyb3plbihtKSkge1xuICAgICAgICAgICAgbS5faXNWYWxpZCA9IGlzTm93VmFsaWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaXNOb3dWYWxpZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbS5faXNWYWxpZDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSW52YWxpZCAoZmxhZ3MpIHtcbiAgICB2YXIgbSA9IGNyZWF0ZVVUQyhOYU4pO1xuICAgIGlmIChmbGFncyAhPSBudWxsKSB7XG4gICAgICAgIGV4dGVuZChnZXRQYXJzaW5nRmxhZ3MobSksIGZsYWdzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhtKS51c2VySW52YWxpZGF0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBtO1xufVxuXG4vLyBQbHVnaW5zIHRoYXQgYWRkIHByb3BlcnRpZXMgc2hvdWxkIGFsc28gYWRkIHRoZSBrZXkgaGVyZSAobnVsbCB2YWx1ZSksXG4vLyBzbyB3ZSBjYW4gcHJvcGVybHkgY2xvbmUgb3Vyc2VsdmVzLlxudmFyIG1vbWVudFByb3BlcnRpZXMgPSBob29rcy5tb21lbnRQcm9wZXJ0aWVzID0gW107XG5cbmZ1bmN0aW9uIGNvcHlDb25maWcodG8sIGZyb20pIHtcbiAgICB2YXIgaSwgcHJvcCwgdmFsO1xuXG4gICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9pc0FNb21lbnRPYmplY3QpKSB7XG4gICAgICAgIHRvLl9pc0FNb21lbnRPYmplY3QgPSBmcm9tLl9pc0FNb21lbnRPYmplY3Q7XG4gICAgfVxuICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5faSkpIHtcbiAgICAgICAgdG8uX2kgPSBmcm9tLl9pO1xuICAgIH1cbiAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2YpKSB7XG4gICAgICAgIHRvLl9mID0gZnJvbS5fZjtcbiAgICB9XG4gICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9sKSkge1xuICAgICAgICB0by5fbCA9IGZyb20uX2w7XG4gICAgfVxuICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fc3RyaWN0KSkge1xuICAgICAgICB0by5fc3RyaWN0ID0gZnJvbS5fc3RyaWN0O1xuICAgIH1cbiAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX3R6bSkpIHtcbiAgICAgICAgdG8uX3R6bSA9IGZyb20uX3R6bTtcbiAgICB9XG4gICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9pc1VUQykpIHtcbiAgICAgICAgdG8uX2lzVVRDID0gZnJvbS5faXNVVEM7XG4gICAgfVxuICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fb2Zmc2V0KSkge1xuICAgICAgICB0by5fb2Zmc2V0ID0gZnJvbS5fb2Zmc2V0O1xuICAgIH1cbiAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX3BmKSkge1xuICAgICAgICB0by5fcGYgPSBnZXRQYXJzaW5nRmxhZ3MoZnJvbSk7XG4gICAgfVxuICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fbG9jYWxlKSkge1xuICAgICAgICB0by5fbG9jYWxlID0gZnJvbS5fbG9jYWxlO1xuICAgIH1cblxuICAgIGlmIChtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG1vbWVudFByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHByb3AgPSBtb21lbnRQcm9wZXJ0aWVzW2ldO1xuICAgICAgICAgICAgdmFsID0gZnJvbVtwcm9wXTtcbiAgICAgICAgICAgIGlmICghaXNVbmRlZmluZWQodmFsKSkge1xuICAgICAgICAgICAgICAgIHRvW3Byb3BdID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvO1xufVxuXG52YXIgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG4vLyBNb21lbnQgcHJvdG90eXBlIG9iamVjdFxuZnVuY3Rpb24gTW9tZW50KGNvbmZpZykge1xuICAgIGNvcHlDb25maWcodGhpcywgY29uZmlnKTtcbiAgICB0aGlzLl9kID0gbmV3IERhdGUoY29uZmlnLl9kICE9IG51bGwgPyBjb25maWcuX2QuZ2V0VGltZSgpIDogTmFOKTtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHRoaXMuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICAgIH1cbiAgICAvLyBQcmV2ZW50IGluZmluaXRlIGxvb3AgaW4gY2FzZSB1cGRhdGVPZmZzZXQgY3JlYXRlcyBuZXcgbW9tZW50XG4gICAgLy8gb2JqZWN0cy5cbiAgICBpZiAodXBkYXRlSW5Qcm9ncmVzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNNb21lbnQgKG9iaikge1xuICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBNb21lbnQgfHwgKG9iaiAhPSBudWxsICYmIG9iai5faXNBTW9tZW50T2JqZWN0ICE9IG51bGwpO1xufVxuXG5mdW5jdGlvbiBhYnNGbG9vciAobnVtYmVyKSB7XG4gICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgLy8gLTAgLT4gMFxuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcikgfHwgMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdG9JbnQoYXJndW1lbnRGb3JDb2VyY2lvbikge1xuICAgIHZhciBjb2VyY2VkTnVtYmVyID0gK2FyZ3VtZW50Rm9yQ29lcmNpb24sXG4gICAgICAgIHZhbHVlID0gMDtcblxuICAgIGlmIChjb2VyY2VkTnVtYmVyICE9PSAwICYmIGlzRmluaXRlKGNvZXJjZWROdW1iZXIpKSB7XG4gICAgICAgIHZhbHVlID0gYWJzRmxvb3IoY29lcmNlZE51bWJlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xufVxuXG4vLyBjb21wYXJlIHR3byBhcnJheXMsIHJldHVybiB0aGUgbnVtYmVyIG9mIGRpZmZlcmVuY2VzXG5mdW5jdGlvbiBjb21wYXJlQXJyYXlzKGFycmF5MSwgYXJyYXkyLCBkb250Q29udmVydCkge1xuICAgIHZhciBsZW4gPSBNYXRoLm1pbihhcnJheTEubGVuZ3RoLCBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgbGVuZ3RoRGlmZiA9IE1hdGguYWJzKGFycmF5MS5sZW5ndGggLSBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgZGlmZnMgPSAwLFxuICAgICAgICBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoKGRvbnRDb252ZXJ0ICYmIGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB8fFxuICAgICAgICAgICAgKCFkb250Q29udmVydCAmJiB0b0ludChhcnJheTFbaV0pICE9PSB0b0ludChhcnJheTJbaV0pKSkge1xuICAgICAgICAgICAgZGlmZnMrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGlmZnMgKyBsZW5ndGhEaWZmO1xufVxuXG5mdW5jdGlvbiB3YXJuKG1zZykge1xuICAgIGlmIChob29rcy5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPT09IGZhbHNlICYmXG4gICAgICAgICAgICAodHlwZW9mIGNvbnNvbGUgIT09ICAndW5kZWZpbmVkJykgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignRGVwcmVjYXRpb24gd2FybmluZzogJyArIG1zZyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZXByZWNhdGUobXNnLCBmbikge1xuICAgIHZhciBmaXJzdFRpbWUgPSB0cnVlO1xuXG4gICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChob29rcy5kZXByZWNhdGlvbkhhbmRsZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyKG51bGwsIG1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgICAgIHZhciBhcmc7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGFyZyA9ICcnO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2ldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBhcmcgKz0gJ1xcblsnICsgaSArICddICc7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBhcmd1bWVudHNbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyArPSBrZXkgKyAnOiAnICsgYXJndW1lbnRzWzBdW2tleV0gKyAnLCAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy5zbGljZSgwLCAtMik7IC8vIFJlbW92ZSB0cmFpbGluZyBjb21tYSBhbmQgc3BhY2VcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFyZ3MucHVzaChhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2Fybihtc2cgKyAnXFxuQXJndW1lbnRzOiAnICsgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncykuam9pbignJykgKyAnXFxuJyArIChuZXcgRXJyb3IoKSkuc3RhY2spO1xuICAgICAgICAgICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSwgZm4pO1xufVxuXG52YXIgZGVwcmVjYXRpb25zID0ge307XG5cbmZ1bmN0aW9uIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCBtc2cpIHtcbiAgICBpZiAoaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyICE9IG51bGwpIHtcbiAgICAgICAgaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyKG5hbWUsIG1zZyk7XG4gICAgfVxuICAgIGlmICghZGVwcmVjYXRpb25zW25hbWVdKSB7XG4gICAgICAgIHdhcm4obXNnKTtcbiAgICAgICAgZGVwcmVjYXRpb25zW25hbWVdID0gdHJ1ZTtcbiAgICB9XG59XG5cbmhvb2tzLnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9IGZhbHNlO1xuaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyID0gbnVsbDtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dCBpbnN0YW5jZW9mIEZ1bmN0aW9uIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbmZ1bmN0aW9uIHNldCAoY29uZmlnKSB7XG4gICAgdmFyIHByb3AsIGk7XG4gICAgZm9yIChpIGluIGNvbmZpZykge1xuICAgICAgICBwcm9wID0gY29uZmlnW2ldO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihwcm9wKSkge1xuICAgICAgICAgICAgdGhpc1tpXSA9IHByb3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzWydfJyArIGldID0gcHJvcDtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gICAgLy8gTGVuaWVudCBvcmRpbmFsIHBhcnNpbmcgYWNjZXB0cyBqdXN0IGEgbnVtYmVyIGluIGFkZGl0aW9uIHRvXG4gICAgLy8gbnVtYmVyICsgKHBvc3NpYmx5KSBzdHVmZiBjb21pbmcgZnJvbSBfZGF5T2ZNb250aE9yZGluYWxQYXJzZS5cbiAgICAvLyBUT0RPOiBSZW1vdmUgXCJvcmRpbmFsUGFyc2VcIiBmYWxsYmFjayBpbiBuZXh0IG1ham9yIHJlbGVhc2UuXG4gICAgdGhpcy5fZGF5T2ZNb250aE9yZGluYWxQYXJzZUxlbmllbnQgPSBuZXcgUmVnRXhwKFxuICAgICAgICAodGhpcy5fZGF5T2ZNb250aE9yZGluYWxQYXJzZS5zb3VyY2UgfHwgdGhpcy5fb3JkaW5hbFBhcnNlLnNvdXJjZSkgK1xuICAgICAgICAgICAgJ3wnICsgKC9cXGR7MSwyfS8pLnNvdXJjZSk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlQ29uZmlncyhwYXJlbnRDb25maWcsIGNoaWxkQ29uZmlnKSB7XG4gICAgdmFyIHJlcyA9IGV4dGVuZCh7fSwgcGFyZW50Q29uZmlnKSwgcHJvcDtcbiAgICBmb3IgKHByb3AgaW4gY2hpbGRDb25maWcpIHtcbiAgICAgICAgaWYgKGhhc093blByb3AoY2hpbGRDb25maWcsIHByb3ApKSB7XG4gICAgICAgICAgICBpZiAoaXNPYmplY3QocGFyZW50Q29uZmlnW3Byb3BdKSAmJiBpc09iamVjdChjaGlsZENvbmZpZ1twcm9wXSkpIHtcbiAgICAgICAgICAgICAgICByZXNbcHJvcF0gPSB7fTtcbiAgICAgICAgICAgICAgICBleHRlbmQocmVzW3Byb3BdLCBwYXJlbnRDb25maWdbcHJvcF0pO1xuICAgICAgICAgICAgICAgIGV4dGVuZChyZXNbcHJvcF0sIGNoaWxkQ29uZmlnW3Byb3BdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGRDb25maWdbcHJvcF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlc1twcm9wXSA9IGNoaWxkQ29uZmlnW3Byb3BdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAocHJvcCBpbiBwYXJlbnRDb25maWcpIHtcbiAgICAgICAgaWYgKGhhc093blByb3AocGFyZW50Q29uZmlnLCBwcm9wKSAmJlxuICAgICAgICAgICAgICAgICFoYXNPd25Qcm9wKGNoaWxkQ29uZmlnLCBwcm9wKSAmJlxuICAgICAgICAgICAgICAgIGlzT2JqZWN0KHBhcmVudENvbmZpZ1twcm9wXSkpIHtcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSBjaGFuZ2VzIHRvIHByb3BlcnRpZXMgZG9uJ3QgbW9kaWZ5IHBhcmVudCBjb25maWdcbiAgICAgICAgICAgIHJlc1twcm9wXSA9IGV4dGVuZCh7fSwgcmVzW3Byb3BdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBMb2NhbGUoY29uZmlnKSB7XG4gICAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuc2V0KGNvbmZpZyk7XG4gICAgfVxufVxuXG52YXIga2V5cztcblxuaWYgKE9iamVjdC5rZXlzKSB7XG4gICAga2V5cyA9IE9iamVjdC5rZXlzO1xufSBlbHNlIHtcbiAgICBrZXlzID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICB2YXIgaSwgcmVzID0gW107XG4gICAgICAgIGZvciAoaSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKG9iaiwgaSkpIHtcbiAgICAgICAgICAgICAgICByZXMucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH07XG59XG5cbnZhciBkZWZhdWx0Q2FsZW5kYXIgPSB7XG4gICAgc2FtZURheSA6ICdbVG9kYXkgYXRdIExUJyxcbiAgICBuZXh0RGF5IDogJ1tUb21vcnJvdyBhdF0gTFQnLFxuICAgIG5leHRXZWVrIDogJ2RkZGQgW2F0XSBMVCcsXG4gICAgbGFzdERheSA6ICdbWWVzdGVyZGF5IGF0XSBMVCcsXG4gICAgbGFzdFdlZWsgOiAnW0xhc3RdIGRkZGQgW2F0XSBMVCcsXG4gICAgc2FtZUVsc2UgOiAnTCdcbn07XG5cbmZ1bmN0aW9uIGNhbGVuZGFyIChrZXksIG1vbSwgbm93KSB7XG4gICAgdmFyIG91dHB1dCA9IHRoaXMuX2NhbGVuZGFyW2tleV0gfHwgdGhpcy5fY2FsZW5kYXJbJ3NhbWVFbHNlJ107XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24ob3V0cHV0KSA/IG91dHB1dC5jYWxsKG1vbSwgbm93KSA6IG91dHB1dDtcbn1cblxudmFyIGRlZmF1bHRMb25nRGF0ZUZvcm1hdCA9IHtcbiAgICBMVFMgIDogJ2g6bW06c3MgQScsXG4gICAgTFQgICA6ICdoOm1tIEEnLFxuICAgIEwgICAgOiAnTU0vREQvWVlZWScsXG4gICAgTEwgICA6ICdNTU1NIEQsIFlZWVknLFxuICAgIExMTCAgOiAnTU1NTSBELCBZWVlZIGg6bW0gQScsXG4gICAgTExMTCA6ICdkZGRkLCBNTU1NIEQsIFlZWVkgaDptbSBBJ1xufTtcblxuZnVuY3Rpb24gbG9uZ0RhdGVGb3JtYXQgKGtleSkge1xuICAgIHZhciBmb3JtYXQgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldLFxuICAgICAgICBmb3JtYXRVcHBlciA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXTtcblxuICAgIGlmIChmb3JtYXQgfHwgIWZvcm1hdFVwcGVyKSB7XG4gICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgfVxuXG4gICAgdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSA9IGZvcm1hdFVwcGVyLnJlcGxhY2UoL01NTU18TU18RER8ZGRkZC9nLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHJldHVybiB2YWwuc2xpY2UoMSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XTtcbn1cblxudmFyIGRlZmF1bHRJbnZhbGlkRGF0ZSA9ICdJbnZhbGlkIGRhdGUnO1xuXG5mdW5jdGlvbiBpbnZhbGlkRGF0ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ludmFsaWREYXRlO1xufVxuXG52YXIgZGVmYXVsdE9yZGluYWwgPSAnJWQnO1xudmFyIGRlZmF1bHREYXlPZk1vbnRoT3JkaW5hbFBhcnNlID0gL1xcZHsxLDJ9LztcblxuZnVuY3Rpb24gb3JkaW5hbCAobnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yZGluYWwucmVwbGFjZSgnJWQnLCBudW1iZXIpO1xufVxuXG52YXIgZGVmYXVsdFJlbGF0aXZlVGltZSA9IHtcbiAgICBmdXR1cmUgOiAnaW4gJXMnLFxuICAgIHBhc3QgICA6ICclcyBhZ28nLFxuICAgIHMgIDogJ2EgZmV3IHNlY29uZHMnLFxuICAgIHNzIDogJyVkIHNlY29uZHMnLFxuICAgIG0gIDogJ2EgbWludXRlJyxcbiAgICBtbSA6ICclZCBtaW51dGVzJyxcbiAgICBoICA6ICdhbiBob3VyJyxcbiAgICBoaCA6ICclZCBob3VycycsXG4gICAgZCAgOiAnYSBkYXknLFxuICAgIGRkIDogJyVkIGRheXMnLFxuICAgIE0gIDogJ2EgbW9udGgnLFxuICAgIE1NIDogJyVkIG1vbnRocycsXG4gICAgeSAgOiAnYSB5ZWFyJyxcbiAgICB5eSA6ICclZCB5ZWFycydcbn07XG5cbmZ1bmN0aW9uIHJlbGF0aXZlVGltZSAobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSB7XG4gICAgdmFyIG91dHB1dCA9IHRoaXMuX3JlbGF0aXZlVGltZVtzdHJpbmddO1xuICAgIHJldHVybiAoaXNGdW5jdGlvbihvdXRwdXQpKSA/XG4gICAgICAgIG91dHB1dChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIDpcbiAgICAgICAgb3V0cHV0LnJlcGxhY2UoLyVkL2ksIG51bWJlcik7XG59XG5cbmZ1bmN0aW9uIHBhc3RGdXR1cmUgKGRpZmYsIG91dHB1dCkge1xuICAgIHZhciBmb3JtYXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbZGlmZiA+IDAgPyAnZnV0dXJlJyA6ICdwYXN0J107XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24oZm9ybWF0KSA/IGZvcm1hdChvdXRwdXQpIDogZm9ybWF0LnJlcGxhY2UoLyVzL2ksIG91dHB1dCk7XG59XG5cbnZhciBhbGlhc2VzID0ge307XG5cbmZ1bmN0aW9uIGFkZFVuaXRBbGlhcyAodW5pdCwgc2hvcnRoYW5kKSB7XG4gICAgdmFyIGxvd2VyQ2FzZSA9IHVuaXQudG9Mb3dlckNhc2UoKTtcbiAgICBhbGlhc2VzW2xvd2VyQ2FzZV0gPSBhbGlhc2VzW2xvd2VyQ2FzZSArICdzJ10gPSBhbGlhc2VzW3Nob3J0aGFuZF0gPSB1bml0O1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVVbml0cyh1bml0cykge1xuICAgIHJldHVybiB0eXBlb2YgdW5pdHMgPT09ICdzdHJpbmcnID8gYWxpYXNlc1t1bml0c10gfHwgYWxpYXNlc1t1bml0cy50b0xvd2VyQ2FzZSgpXSA6IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplT2JqZWN0VW5pdHMoaW5wdXRPYmplY3QpIHtcbiAgICB2YXIgbm9ybWFsaXplZElucHV0ID0ge30sXG4gICAgICAgIG5vcm1hbGl6ZWRQcm9wLFxuICAgICAgICBwcm9wO1xuXG4gICAgZm9yIChwcm9wIGluIGlucHV0T2JqZWN0KSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGlucHV0T2JqZWN0LCBwcm9wKSkge1xuICAgICAgICAgICAgbm9ybWFsaXplZFByb3AgPSBub3JtYWxpemVVbml0cyhwcm9wKTtcbiAgICAgICAgICAgIGlmIChub3JtYWxpemVkUHJvcCkge1xuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dFtub3JtYWxpemVkUHJvcF0gPSBpbnB1dE9iamVjdFtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub3JtYWxpemVkSW5wdXQ7XG59XG5cbnZhciBwcmlvcml0aWVzID0ge307XG5cbmZ1bmN0aW9uIGFkZFVuaXRQcmlvcml0eSh1bml0LCBwcmlvcml0eSkge1xuICAgIHByaW9yaXRpZXNbdW5pdF0gPSBwcmlvcml0eTtcbn1cblxuZnVuY3Rpb24gZ2V0UHJpb3JpdGl6ZWRVbml0cyh1bml0c09iaikge1xuICAgIHZhciB1bml0cyA9IFtdO1xuICAgIGZvciAodmFyIHUgaW4gdW5pdHNPYmopIHtcbiAgICAgICAgdW5pdHMucHVzaCh7dW5pdDogdSwgcHJpb3JpdHk6IHByaW9yaXRpZXNbdV19KTtcbiAgICB9XG4gICAgdW5pdHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5wcmlvcml0eSAtIGIucHJpb3JpdHk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHVuaXRzO1xufVxuXG5mdW5jdGlvbiB6ZXJvRmlsbChudW1iZXIsIHRhcmdldExlbmd0aCwgZm9yY2VTaWduKSB7XG4gICAgdmFyIGFic051bWJlciA9ICcnICsgTWF0aC5hYnMobnVtYmVyKSxcbiAgICAgICAgemVyb3NUb0ZpbGwgPSB0YXJnZXRMZW5ndGggLSBhYnNOdW1iZXIubGVuZ3RoLFxuICAgICAgICBzaWduID0gbnVtYmVyID49IDA7XG4gICAgcmV0dXJuIChzaWduID8gKGZvcmNlU2lnbiA/ICcrJyA6ICcnKSA6ICctJykgK1xuICAgICAgICBNYXRoLnBvdygxMCwgTWF0aC5tYXgoMCwgemVyb3NUb0ZpbGwpKS50b1N0cmluZygpLnN1YnN0cigxKSArIGFic051bWJlcjtcbn1cblxudmFyIGZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oW0hoXW1tKHNzKT98TW98TU0/TT9NP3xEb3xERERvfEREP0Q/RD98ZGRkP2Q/fGRvP3x3W298d10/fFdbb3xXXT98UW8/fFlZWVlZWXxZWVlZWXxZWVlZfFlZfGdnKGdnZz8pP3xHRyhHR0c/KT98ZXxFfGF8QXxoaD98SEg/fGtrP3xtbT98c3M/fFN7MSw5fXx4fFh8eno/fFpaP3wuKS9nO1xuXG52YXIgbG9jYWxGb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KExUU3xMVHxMTD9MP0w/fGx7MSw0fSkvZztcblxudmFyIGZvcm1hdEZ1bmN0aW9ucyA9IHt9O1xuXG52YXIgZm9ybWF0VG9rZW5GdW5jdGlvbnMgPSB7fTtcblxuLy8gdG9rZW46ICAgICdNJ1xuLy8gcGFkZGVkOiAgIFsnTU0nLCAyXVxuLy8gb3JkaW5hbDogICdNbydcbi8vIGNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7IHRoaXMubW9udGgoKSArIDEgfVxuZnVuY3Rpb24gYWRkRm9ybWF0VG9rZW4gKHRva2VuLCBwYWRkZWQsIG9yZGluYWwsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGZ1bmMgPSBjYWxsYmFjaztcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICBmdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbY2FsbGJhY2tdKCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICh0b2tlbikge1xuICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0gPSBmdW5jO1xuICAgIH1cbiAgICBpZiAocGFkZGVkKSB7XG4gICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3BhZGRlZFswXV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gemVyb0ZpbGwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBwYWRkZWRbMV0sIHBhZGRlZFsyXSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmIChvcmRpbmFsKSB7XG4gICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW29yZGluYWxdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm9yZGluYWwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCB0b2tlbik7XG4gICAgICAgIH07XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGlucHV0KSB7XG4gICAgaWYgKGlucHV0Lm1hdGNoKC9cXFtbXFxzXFxTXS8pKSB7XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpO1xuICAgIH1cbiAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXFxcXC9nLCAnJyk7XG59XG5cbmZ1bmN0aW9uIG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpIHtcbiAgICB2YXIgYXJyYXkgPSBmb3JtYXQubWF0Y2goZm9ybWF0dGluZ1Rva2VucyksIGksIGxlbmd0aDtcblxuICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV0pIHtcbiAgICAgICAgICAgIGFycmF5W2ldID0gZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJyYXlbaV0gPSByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGFycmF5W2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAobW9tKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSAnJywgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gaXNGdW5jdGlvbihhcnJheVtpXSkgPyBhcnJheVtpXS5jYWxsKG1vbSwgZm9ybWF0KSA6IGFycmF5W2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbn1cblxuLy8gZm9ybWF0IGRhdGUgdXNpbmcgbmF0aXZlIGRhdGUgb2JqZWN0XG5mdW5jdGlvbiBmb3JtYXRNb21lbnQobSwgZm9ybWF0KSB7XG4gICAgaWYgKCFtLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gbS5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICB9XG5cbiAgICBmb3JtYXQgPSBleHBhbmRGb3JtYXQoZm9ybWF0LCBtLmxvY2FsZURhdGEoKSk7XG4gICAgZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0gPSBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSB8fCBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KTtcblxuICAgIHJldHVybiBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XShtKTtcbn1cblxuZnVuY3Rpb24gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbG9jYWxlKSB7XG4gICAgdmFyIGkgPSA1O1xuXG4gICAgZnVuY3Rpb24gcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUubG9uZ0RhdGVGb3JtYXQoaW5wdXQpIHx8IGlucHV0O1xuICAgIH1cblxuICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlIChpID49IDAgJiYgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLnRlc3QoZm9ybWF0KSkge1xuICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShsb2NhbEZvcm1hdHRpbmdUb2tlbnMsIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2Vucyk7XG4gICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgICAgICBpIC09IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcm1hdDtcbn1cblxudmFyIG1hdGNoMSAgICAgICAgID0gL1xcZC87ICAgICAgICAgICAgLy8gICAgICAgMCAtIDlcbnZhciBtYXRjaDIgICAgICAgICA9IC9cXGRcXGQvOyAgICAgICAgICAvLyAgICAgIDAwIC0gOTlcbnZhciBtYXRjaDMgICAgICAgICA9IC9cXGR7M30vOyAgICAgICAgIC8vICAgICAwMDAgLSA5OTlcbnZhciBtYXRjaDQgICAgICAgICA9IC9cXGR7NH0vOyAgICAgICAgIC8vICAgIDAwMDAgLSA5OTk5XG52YXIgbWF0Y2g2ICAgICAgICAgPSAvWystXT9cXGR7Nn0vOyAgICAvLyAtOTk5OTk5IC0gOTk5OTk5XG52YXIgbWF0Y2gxdG8yICAgICAgPSAvXFxkXFxkPy87ICAgICAgICAgLy8gICAgICAgMCAtIDk5XG52YXIgbWF0Y2gzdG80ICAgICAgPSAvXFxkXFxkXFxkXFxkPy87ICAgICAvLyAgICAgOTk5IC0gOTk5OVxudmFyIG1hdGNoNXRvNiAgICAgID0gL1xcZFxcZFxcZFxcZFxcZFxcZD8vOyAvLyAgIDk5OTk5IC0gOTk5OTk5XG52YXIgbWF0Y2gxdG8zICAgICAgPSAvXFxkezEsM30vOyAgICAgICAvLyAgICAgICAwIC0gOTk5XG52YXIgbWF0Y2gxdG80ICAgICAgPSAvXFxkezEsNH0vOyAgICAgICAvLyAgICAgICAwIC0gOTk5OVxudmFyIG1hdGNoMXRvNiAgICAgID0gL1srLV0/XFxkezEsNn0vOyAgLy8gLTk5OTk5OSAtIDk5OTk5OVxuXG52YXIgbWF0Y2hVbnNpZ25lZCAgPSAvXFxkKy87ICAgICAgICAgICAvLyAgICAgICAwIC0gaW5mXG52YXIgbWF0Y2hTaWduZWQgICAgPSAvWystXT9cXGQrLzsgICAgICAvLyAgICAtaW5mIC0gaW5mXG5cbnZhciBtYXRjaE9mZnNldCAgICA9IC9afFsrLV1cXGRcXGQ6P1xcZFxcZC9naTsgLy8gKzAwOjAwIC0wMDowMCArMDAwMCAtMDAwMCBvciBaXG52YXIgbWF0Y2hTaG9ydE9mZnNldCA9IC9afFsrLV1cXGRcXGQoPzo6P1xcZFxcZCk/L2dpOyAvLyArMDAgLTAwICswMDowMCAtMDA6MDAgKzAwMDAgLTAwMDAgb3IgWlxuXG52YXIgbWF0Y2hUaW1lc3RhbXAgPSAvWystXT9cXGQrKFxcLlxcZHsxLDN9KT8vOyAvLyAxMjM0NTY3ODkgMTIzNDU2Nzg5LjEyM1xuXG4vLyBhbnkgd29yZCAob3IgdHdvKSBjaGFyYWN0ZXJzIG9yIG51bWJlcnMgaW5jbHVkaW5nIHR3by90aHJlZSB3b3JkIG1vbnRoIGluIGFyYWJpYy5cbi8vIGluY2x1ZGVzIHNjb3R0aXNoIGdhZWxpYyB0d28gd29yZCBhbmQgaHlwaGVuYXRlZCBtb250aHNcbnZhciBtYXRjaFdvcmQgPSAvWzAtOV17MCwyNTZ9WydhLXpcXHUwMEEwLVxcdTA1RkZcXHUwNzAwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGMDdcXHVGRjEwLVxcdUZGRUZdezEsMjU2fXxbXFx1MDYwMC1cXHUwNkZGXFwvXXsxLDI1Nn0oXFxzKj9bXFx1MDYwMC1cXHUwNkZGXXsxLDI1Nn0pezEsMn0vaTtcblxudmFyIHJlZ2V4ZXMgPSB7fTtcblxuZnVuY3Rpb24gYWRkUmVnZXhUb2tlbiAodG9rZW4sIHJlZ2V4LCBzdHJpY3RSZWdleCkge1xuICAgIHJlZ2V4ZXNbdG9rZW5dID0gaXNGdW5jdGlvbihyZWdleCkgPyByZWdleCA6IGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlRGF0YSkge1xuICAgICAgICByZXR1cm4gKGlzU3RyaWN0ICYmIHN0cmljdFJlZ2V4KSA/IHN0cmljdFJlZ2V4IDogcmVnZXg7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0UGFyc2VSZWdleEZvclRva2VuICh0b2tlbiwgY29uZmlnKSB7XG4gICAgaWYgKCFoYXNPd25Qcm9wKHJlZ2V4ZXMsIHRva2VuKSkge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cCh1bmVzY2FwZUZvcm1hdCh0b2tlbikpO1xuICAgIH1cblxuICAgIHJldHVybiByZWdleGVzW3Rva2VuXShjb25maWcuX3N0cmljdCwgY29uZmlnLl9sb2NhbGUpO1xufVxuXG4vLyBDb2RlIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNTYxNDkzL2lzLXRoZXJlLWEtcmVnZXhwLWVzY2FwZS1mdW5jdGlvbi1pbi1qYXZhc2NyaXB0XG5mdW5jdGlvbiB1bmVzY2FwZUZvcm1hdChzKSB7XG4gICAgcmV0dXJuIHJlZ2V4RXNjYXBlKHMucmVwbGFjZSgnXFxcXCcsICcnKS5yZXBsYWNlKC9cXFxcKFxcWyl8XFxcXChcXF0pfFxcWyhbXlxcXVxcW10qKVxcXXxcXFxcKC4pL2csIGZ1bmN0aW9uIChtYXRjaGVkLCBwMSwgcDIsIHAzLCBwNCkge1xuICAgICAgICByZXR1cm4gcDEgfHwgcDIgfHwgcDMgfHwgcDQ7XG4gICAgfSkpO1xufVxuXG5mdW5jdGlvbiByZWdleEVzY2FwZShzKSB7XG4gICAgcmV0dXJuIHMucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG59XG5cbnZhciB0b2tlbnMgPSB7fTtcblxuZnVuY3Rpb24gYWRkUGFyc2VUb2tlbiAodG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgdmFyIGksIGZ1bmMgPSBjYWxsYmFjaztcbiAgICBpZiAodHlwZW9mIHRva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICB0b2tlbiA9IFt0b2tlbl07XG4gICAgfVxuICAgIGlmIChpc051bWJlcihjYWxsYmFjaykpIHtcbiAgICAgICAgZnVuYyA9IGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgICAgIGFycmF5W2NhbGxiYWNrXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IHRva2VuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRva2Vuc1t0b2tlbltpXV0gPSBmdW5jO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkV2Vla1BhcnNlVG9rZW4gKHRva2VuLCBjYWxsYmFjaykge1xuICAgIGFkZFBhcnNlVG9rZW4odG9rZW4sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICBjYWxsYmFjayhpbnB1dCwgY29uZmlnLl93LCBjb25maWcsIHRva2VuKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIGlucHV0LCBjb25maWcpIHtcbiAgICBpZiAoaW5wdXQgIT0gbnVsbCAmJiBoYXNPd25Qcm9wKHRva2VucywgdG9rZW4pKSB7XG4gICAgICAgIHRva2Vuc1t0b2tlbl0oaW5wdXQsIGNvbmZpZy5fYSwgY29uZmlnLCB0b2tlbik7XG4gICAgfVxufVxuXG52YXIgWUVBUiA9IDA7XG52YXIgTU9OVEggPSAxO1xudmFyIERBVEUgPSAyO1xudmFyIEhPVVIgPSAzO1xudmFyIE1JTlVURSA9IDQ7XG52YXIgU0VDT05EID0gNTtcbnZhciBNSUxMSVNFQ09ORCA9IDY7XG52YXIgV0VFSyA9IDc7XG52YXIgV0VFS0RBWSA9IDg7XG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oJ1knLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHkgPSB0aGlzLnllYXIoKTtcbiAgICByZXR1cm4geSA8PSA5OTk5ID8gJycgKyB5IDogJysnICsgeTtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbigwLCBbJ1lZJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy55ZWFyKCkgJSAxMDA7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZJywgICA0XSwgICAgICAgMCwgJ3llYXInKTtcbmFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVknLCAgNV0sICAgICAgIDAsICd5ZWFyJyk7XG5hZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVlZWScsIDYsIHRydWVdLCAwLCAneWVhcicpO1xuXG4vLyBBTElBU0VTXG5cbmFkZFVuaXRBbGlhcygneWVhcicsICd5Jyk7XG5cbi8vIFBSSU9SSVRJRVNcblxuYWRkVW5pdFByaW9yaXR5KCd5ZWFyJywgMSk7XG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbignWScsICAgICAgbWF0Y2hTaWduZWQpO1xuYWRkUmVnZXhUb2tlbignWVknLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuYWRkUmVnZXhUb2tlbignWVlZWScsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuYWRkUmVnZXhUb2tlbignWVlZWVknLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuYWRkUmVnZXhUb2tlbignWVlZWVlZJywgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG5hZGRQYXJzZVRva2VuKFsnWVlZWVknLCAnWVlZWVlZJ10sIFlFQVIpO1xuYWRkUGFyc2VUb2tlbignWVlZWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICBhcnJheVtZRUFSXSA9IGlucHV0Lmxlbmd0aCA9PT0gMiA/IGhvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KSA6IHRvSW50KGlucHV0KTtcbn0pO1xuYWRkUGFyc2VUb2tlbignWVknLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgYXJyYXlbWUVBUl0gPSBob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG59KTtcbmFkZFBhcnNlVG9rZW4oJ1knLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgYXJyYXlbWUVBUl0gPSBwYXJzZUludChpbnB1dCwgMTApO1xufSk7XG5cbi8vIEhFTFBFUlNcblxuZnVuY3Rpb24gZGF5c0luWWVhcih5ZWFyKSB7XG4gICAgcmV0dXJuIGlzTGVhcFllYXIoeWVhcikgPyAzNjYgOiAzNjU7XG59XG5cbmZ1bmN0aW9uIGlzTGVhcFllYXIoeWVhcikge1xuICAgIHJldHVybiAoeWVhciAlIDQgPT09IDAgJiYgeWVhciAlIDEwMCAhPT0gMCkgfHwgeWVhciAlIDQwMCA9PT0gMDtcbn1cblxuLy8gSE9PS1NcblxuaG9va3MucGFyc2VUd29EaWdpdFllYXIgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICByZXR1cm4gdG9JbnQoaW5wdXQpICsgKHRvSW50KGlucHV0KSA+IDY4ID8gMTkwMCA6IDIwMDApO1xufTtcblxuLy8gTU9NRU5UU1xuXG52YXIgZ2V0U2V0WWVhciA9IG1ha2VHZXRTZXQoJ0Z1bGxZZWFyJywgdHJ1ZSk7XG5cbmZ1bmN0aW9uIGdldElzTGVhcFllYXIgKCkge1xuICAgIHJldHVybiBpc0xlYXBZZWFyKHRoaXMueWVhcigpKTtcbn1cblxuZnVuY3Rpb24gbWFrZUdldFNldCAodW5pdCwga2VlcFRpbWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzZXQkMSh0aGlzLCB1bml0LCB2YWx1ZSk7XG4gICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcywga2VlcFRpbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0KHRoaXMsIHVuaXQpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0IChtb20sIHVuaXQpIHtcbiAgICByZXR1cm4gbW9tLmlzVmFsaWQoKSA/XG4gICAgICAgIG1vbS5fZFsnZ2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSgpIDogTmFOO1xufVxuXG5mdW5jdGlvbiBzZXQkMSAobW9tLCB1bml0LCB2YWx1ZSkge1xuICAgIGlmIChtb20uaXNWYWxpZCgpICYmICFpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgaWYgKHVuaXQgPT09ICdGdWxsWWVhcicgJiYgaXNMZWFwWWVhcihtb20ueWVhcigpKSAmJiBtb20ubW9udGgoKSA9PT0gMSAmJiBtb20uZGF0ZSgpID09PSAyOSkge1xuICAgICAgICAgICAgbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKHZhbHVlLCBtb20ubW9udGgoKSwgZGF5c0luTW9udGgodmFsdWUsIG1vbS5tb250aCgpKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0odmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBNT01FTlRTXG5cbmZ1bmN0aW9uIHN0cmluZ0dldCAodW5pdHMpIHtcbiAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICBpZiAoaXNGdW5jdGlvbih0aGlzW3VuaXRzXSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHNdKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuXG5cbmZ1bmN0aW9uIHN0cmluZ1NldCAodW5pdHMsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB1bml0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVPYmplY3RVbml0cyh1bml0cyk7XG4gICAgICAgIHZhciBwcmlvcml0aXplZCA9IGdldFByaW9yaXRpemVkVW5pdHModW5pdHMpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByaW9yaXRpemVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzW3ByaW9yaXRpemVkW2ldLnVuaXRdKHVuaXRzW3ByaW9yaXRpemVkW2ldLnVuaXRdKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbih0aGlzW3VuaXRzXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIG1vZChuLCB4KSB7XG4gICAgcmV0dXJuICgobiAlIHgpICsgeCkgJSB4O1xufVxuXG52YXIgaW5kZXhPZjtcblxuaWYgKEFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG4gICAgaW5kZXhPZiA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mO1xufSBlbHNlIHtcbiAgICBpbmRleE9mID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgLy8gSSBrbm93XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKHRoaXNbaV0gPT09IG8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZGF5c0luTW9udGgoeWVhciwgbW9udGgpIHtcbiAgICBpZiAoaXNOYU4oeWVhcikgfHwgaXNOYU4obW9udGgpKSB7XG4gICAgICAgIHJldHVybiBOYU47XG4gICAgfVxuICAgIHZhciBtb2RNb250aCA9IG1vZChtb250aCwgMTIpO1xuICAgIHllYXIgKz0gKG1vbnRoIC0gbW9kTW9udGgpIC8gMTI7XG4gICAgcmV0dXJuIG1vZE1vbnRoID09PSAxID8gKGlzTGVhcFllYXIoeWVhcikgPyAyOSA6IDI4KSA6ICgzMSAtIG1vZE1vbnRoICUgNyAlIDIpO1xufVxuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKCdNJywgWydNTScsIDJdLCAnTW8nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9udGgoKSArIDE7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oJ01NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzU2hvcnQodGhpcywgZm9ybWF0KTtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbignTU1NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzKHRoaXMsIGZvcm1hdCk7XG59KTtcblxuLy8gQUxJQVNFU1xuXG5hZGRVbml0QWxpYXMoJ21vbnRoJywgJ00nKTtcblxuLy8gUFJJT1JJVFlcblxuYWRkVW5pdFByaW9yaXR5KCdtb250aCcsIDgpO1xuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ00nLCAgICBtYXRjaDF0bzIpO1xuYWRkUmVnZXhUb2tlbignTU0nLCAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbmFkZFJlZ2V4VG9rZW4oJ01NTScsICBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgIHJldHVybiBsb2NhbGUubW9udGhzU2hvcnRSZWdleChpc1N0cmljdCk7XG59KTtcbmFkZFJlZ2V4VG9rZW4oJ01NTU0nLCBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgIHJldHVybiBsb2NhbGUubW9udGhzUmVnZXgoaXNTdHJpY3QpO1xufSk7XG5cbmFkZFBhcnNlVG9rZW4oWydNJywgJ01NJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICBhcnJheVtNT05USF0gPSB0b0ludChpbnB1dCkgLSAxO1xufSk7XG5cbmFkZFBhcnNlVG9rZW4oWydNTU0nLCAnTU1NTSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcsIHRva2VuKSB7XG4gICAgdmFyIG1vbnRoID0gY29uZmlnLl9sb2NhbGUubW9udGhzUGFyc2UoaW5wdXQsIHRva2VuLCBjb25maWcuX3N0cmljdCk7XG4gICAgLy8gaWYgd2UgZGlkbid0IGZpbmQgYSBtb250aCBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWQuXG4gICAgaWYgKG1vbnRoICE9IG51bGwpIHtcbiAgICAgICAgYXJyYXlbTU9OVEhdID0gbW9udGg7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZE1vbnRoID0gaW5wdXQ7XG4gICAgfVxufSk7XG5cbi8vIExPQ0FMRVNcblxudmFyIE1PTlRIU19JTl9GT1JNQVQgPSAvRFtvRF0/KFxcW1teXFxbXFxdXSpcXF18XFxzKStNTU1NPy87XG52YXIgZGVmYXVsdExvY2FsZU1vbnRocyA9ICdKYW51YXJ5X0ZlYnJ1YXJ5X01hcmNoX0FwcmlsX01heV9KdW5lX0p1bHlfQXVndXN0X1NlcHRlbWJlcl9PY3RvYmVyX05vdmVtYmVyX0RlY2VtYmVyJy5zcGxpdCgnXycpO1xuZnVuY3Rpb24gbG9jYWxlTW9udGhzIChtLCBmb3JtYXQpIHtcbiAgICBpZiAoIW0pIHtcbiAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzKSA/IHRoaXMuX21vbnRocyA6XG4gICAgICAgICAgICB0aGlzLl9tb250aHNbJ3N0YW5kYWxvbmUnXTtcbiAgICB9XG4gICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzKSA/IHRoaXMuX21vbnRoc1ttLm1vbnRoKCldIDpcbiAgICAgICAgdGhpcy5fbW9udGhzWyh0aGlzLl9tb250aHMuaXNGb3JtYXQgfHwgTU9OVEhTX0lOX0ZPUk1BVCkudGVzdChmb3JtYXQpID8gJ2Zvcm1hdCcgOiAnc3RhbmRhbG9uZSddW20ubW9udGgoKV07XG59XG5cbnZhciBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQgPSAnSmFuX0ZlYl9NYXJfQXByX01heV9KdW5fSnVsX0F1Z19TZXBfT2N0X05vdl9EZWMnLnNwbGl0KCdfJyk7XG5mdW5jdGlvbiBsb2NhbGVNb250aHNTaG9ydCAobSwgZm9ybWF0KSB7XG4gICAgaWYgKCFtKSB7XG4gICAgICAgIHJldHVybiBpc0FycmF5KHRoaXMuX21vbnRoc1Nob3J0KSA/IHRoaXMuX21vbnRoc1Nob3J0IDpcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1Nob3J0WydzdGFuZGFsb25lJ107XG4gICAgfVxuICAgIHJldHVybiBpc0FycmF5KHRoaXMuX21vbnRoc1Nob3J0KSA/IHRoaXMuX21vbnRoc1Nob3J0W20ubW9udGgoKV0gOlxuICAgICAgICB0aGlzLl9tb250aHNTaG9ydFtNT05USFNfSU5fRk9STUFULnRlc3QoZm9ybWF0KSA/ICdmb3JtYXQnIDogJ3N0YW5kYWxvbmUnXVttLm1vbnRoKCldO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTdHJpY3RQYXJzZShtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgdmFyIGksIGlpLCBtb20sIGxsYyA9IG1vbnRoTmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgIGlmICghdGhpcy5fbW9udGhzUGFyc2UpIHtcbiAgICAgICAgLy8gdGhpcyBpcyBub3QgdXNlZFxuICAgICAgICB0aGlzLl9tb250aHNQYXJzZSA9IFtdO1xuICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7ICsraSkge1xuICAgICAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCBpXSk7XG4gICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldID0gdGhpcy5tb250aHNTaG9ydChtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldID0gdGhpcy5tb250aHMobW9tLCAnJykudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ01NTScpIHtcbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0TW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbG9uZ01vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3JtYXQgPT09ICdNTU0nKSB7XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydE1vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX2xvbmdNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9sb25nTW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxvY2FsZU1vbnRoc1BhcnNlIChtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICBpZiAodGhpcy5fbW9udGhzUGFyc2VFeGFjdCkge1xuICAgICAgICByZXR1cm4gaGFuZGxlU3RyaWN0UGFyc2UuY2FsbCh0aGlzLCBtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX21vbnRoc1BhcnNlKSB7XG4gICAgICAgIHRoaXMuX21vbnRoc1BhcnNlID0gW107XG4gICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlID0gW107XG4gICAgfVxuXG4gICAgLy8gVE9ETzogYWRkIHNvcnRpbmdcbiAgICAvLyBTb3J0aW5nIG1ha2VzIHN1cmUgaWYgb25lIG1vbnRoIChvciBhYmJyKSBpcyBhIHByZWZpeCBvZiBhbm90aGVyXG4gICAgLy8gc2VlIHNvcnRpbmcgaW4gY29tcHV0ZU1vbnRoc1BhcnNlXG4gICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykucmVwbGFjZSgnLicsICcnKSArICckJywgJ2knKTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJykucmVwbGFjZSgnLicsICcnKSArICckJywgJ2knKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXN0cmljdCAmJiAhdGhpcy5fbW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykgKyAnfF4nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKTtcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NTScgJiYgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ01NTScgJiYgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9IGVsc2UgaWYgKCFzdHJpY3QgJiYgdGhpcy5fbW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gTU9NRU5UU1xuXG5mdW5jdGlvbiBzZXRNb250aCAobW9tLCB2YWx1ZSkge1xuICAgIHZhciBkYXlPZk1vbnRoO1xuXG4gICAgaWYgKCFtb20uaXNWYWxpZCgpKSB7XG4gICAgICAgIC8vIE5vIG9wXG4gICAgICAgIHJldHVybiBtb207XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKC9eXFxkKyQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRvSW50KHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gbW9tLmxvY2FsZURhdGEoKS5tb250aHNQYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAvLyBUT0RPOiBBbm90aGVyIHNpbGVudCBmYWlsdXJlP1xuICAgICAgICAgICAgaWYgKCFpc051bWJlcih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGF5T2ZNb250aCA9IE1hdGgubWluKG1vbS5kYXRlKCksIGRheXNJbk1vbnRoKG1vbS55ZWFyKCksIHZhbHVlKSk7XG4gICAgbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArICdNb250aCddKHZhbHVlLCBkYXlPZk1vbnRoKTtcbiAgICByZXR1cm4gbW9tO1xufVxuXG5mdW5jdGlvbiBnZXRTZXRNb250aCAodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICBzZXRNb250aCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGdldCh0aGlzLCAnTW9udGgnKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldERheXNJbk1vbnRoICgpIHtcbiAgICByZXR1cm4gZGF5c0luTW9udGgodGhpcy55ZWFyKCksIHRoaXMubW9udGgoKSk7XG59XG5cbnZhciBkZWZhdWx0TW9udGhzU2hvcnRSZWdleCA9IG1hdGNoV29yZDtcbmZ1bmN0aW9uIG1vbnRoc1Nob3J0UmVnZXggKGlzU3RyaWN0KSB7XG4gICAgaWYgKHRoaXMuX21vbnRoc1BhcnNlRXhhY3QpIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfbW9udGhzUmVnZXgnKSkge1xuICAgICAgICAgICAgY29tcHV0ZU1vbnRoc1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFJlZ2V4O1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfbW9udGhzU2hvcnRSZWdleCcpKSB7XG4gICAgICAgICAgICB0aGlzLl9tb250aHNTaG9ydFJlZ2V4ID0gZGVmYXVsdE1vbnRoc1Nob3J0UmVnZXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1Nob3J0U3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleCA6IHRoaXMuX21vbnRoc1Nob3J0UmVnZXg7XG4gICAgfVxufVxuXG52YXIgZGVmYXVsdE1vbnRoc1JlZ2V4ID0gbWF0Y2hXb3JkO1xuZnVuY3Rpb24gbW9udGhzUmVnZXggKGlzU3RyaWN0KSB7XG4gICAgaWYgKHRoaXMuX21vbnRoc1BhcnNlRXhhY3QpIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfbW9udGhzUmVnZXgnKSkge1xuICAgICAgICAgICAgY29tcHV0ZU1vbnRoc1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU3RyaWN0UmVnZXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzUmVnZXg7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNSZWdleCcpKSB7XG4gICAgICAgICAgICB0aGlzLl9tb250aHNSZWdleCA9IGRlZmF1bHRNb250aHNSZWdleDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzU3RyaWN0UmVnZXggOiB0aGlzLl9tb250aHNSZWdleDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVNb250aHNQYXJzZSAoKSB7XG4gICAgZnVuY3Rpb24gY21wTGVuUmV2KGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG4gICAgfVxuXG4gICAgdmFyIHNob3J0UGllY2VzID0gW10sIGxvbmdQaWVjZXMgPSBbXSwgbWl4ZWRQaWVjZXMgPSBbXSxcbiAgICAgICAgaSwgbW9tO1xuICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIGldKTtcbiAgICAgICAgc2hvcnRQaWVjZXMucHVzaCh0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpKTtcbiAgICAgICAgbG9uZ1BpZWNlcy5wdXNoKHRoaXMubW9udGhzKG1vbSwgJycpKTtcbiAgICAgICAgbWl4ZWRQaWVjZXMucHVzaCh0aGlzLm1vbnRocyhtb20sICcnKSk7XG4gICAgICAgIG1peGVkUGllY2VzLnB1c2godGhpcy5tb250aHNTaG9ydChtb20sICcnKSk7XG4gICAgfVxuICAgIC8vIFNvcnRpbmcgbWFrZXMgc3VyZSBpZiBvbmUgbW9udGggKG9yIGFiYnIpIGlzIGEgcHJlZml4IG9mIGFub3RoZXIgaXRcbiAgICAvLyB3aWxsIG1hdGNoIHRoZSBsb25nZXIgcGllY2UuXG4gICAgc2hvcnRQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgIGxvbmdQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgIG1peGVkUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICBzaG9ydFBpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKHNob3J0UGllY2VzW2ldKTtcbiAgICAgICAgbG9uZ1BpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKGxvbmdQaWVjZXNbaV0pO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgMjQ7IGkrKykge1xuICAgICAgICBtaXhlZFBpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKG1peGVkUGllY2VzW2ldKTtcbiAgICB9XG5cbiAgICB0aGlzLl9tb250aHNSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIG1peGVkUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICB0aGlzLl9tb250aHNTaG9ydFJlZ2V4ID0gdGhpcy5fbW9udGhzUmVnZXg7XG4gICAgdGhpcy5fbW9udGhzU3RyaWN0UmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBsb25nUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgc2hvcnRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVEYXRlICh5LCBtLCBkLCBoLCBNLCBzLCBtcykge1xuICAgIC8vIGNhbid0IGp1c3QgYXBwbHkoKSB0byBjcmVhdGUgYSBkYXRlOlxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcS8xODEzNDhcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHksIG0sIGQsIGgsIE0sIHMsIG1zKTtcblxuICAgIC8vIHRoZSBkYXRlIGNvbnN0cnVjdG9yIHJlbWFwcyB5ZWFycyAwLTk5IHRvIDE5MDAtMTk5OVxuICAgIGlmICh5IDwgMTAwICYmIHkgPj0gMCAmJiBpc0Zpbml0ZShkYXRlLmdldEZ1bGxZZWFyKCkpKSB7XG4gICAgICAgIGRhdGUuc2V0RnVsbFllYXIoeSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVVVENEYXRlICh5KSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQy5hcHBseShudWxsLCBhcmd1bWVudHMpKTtcblxuICAgIC8vIHRoZSBEYXRlLlVUQyBmdW5jdGlvbiByZW1hcHMgeWVhcnMgMC05OSB0byAxOTAwLTE5OTlcbiAgICBpZiAoeSA8IDEwMCAmJiB5ID49IDAgJiYgaXNGaW5pdGUoZGF0ZS5nZXRVVENGdWxsWWVhcigpKSkge1xuICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKHkpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0ZTtcbn1cblxuLy8gc3RhcnQtb2YtZmlyc3Qtd2VlayAtIHN0YXJ0LW9mLXllYXJcbmZ1bmN0aW9uIGZpcnN0V2Vla09mZnNldCh5ZWFyLCBkb3csIGRveSkge1xuICAgIHZhciAvLyBmaXJzdC13ZWVrIGRheSAtLSB3aGljaCBqYW51YXJ5IGlzIGFsd2F5cyBpbiB0aGUgZmlyc3Qgd2VlayAoNCBmb3IgaXNvLCAxIGZvciBvdGhlcilcbiAgICAgICAgZndkID0gNyArIGRvdyAtIGRveSxcbiAgICAgICAgLy8gZmlyc3Qtd2VlayBkYXkgbG9jYWwgd2Vla2RheSAtLSB3aGljaCBsb2NhbCB3ZWVrZGF5IGlzIGZ3ZFxuICAgICAgICBmd2RsdyA9ICg3ICsgY3JlYXRlVVRDRGF0ZSh5ZWFyLCAwLCBmd2QpLmdldFVUQ0RheSgpIC0gZG93KSAlIDc7XG5cbiAgICByZXR1cm4gLWZ3ZGx3ICsgZndkIC0gMTtcbn1cblxuLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZSNDYWxjdWxhdGluZ19hX2RhdGVfZ2l2ZW5fdGhlX3llYXIuMkNfd2Vla19udW1iZXJfYW5kX3dlZWtkYXlcbmZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrcyh5ZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSkge1xuICAgIHZhciBsb2NhbFdlZWtkYXkgPSAoNyArIHdlZWtkYXkgLSBkb3cpICUgNyxcbiAgICAgICAgd2Vla09mZnNldCA9IGZpcnN0V2Vla09mZnNldCh5ZWFyLCBkb3csIGRveSksXG4gICAgICAgIGRheU9mWWVhciA9IDEgKyA3ICogKHdlZWsgLSAxKSArIGxvY2FsV2Vla2RheSArIHdlZWtPZmZzZXQsXG4gICAgICAgIHJlc1llYXIsIHJlc0RheU9mWWVhcjtcblxuICAgIGlmIChkYXlPZlllYXIgPD0gMCkge1xuICAgICAgICByZXNZZWFyID0geWVhciAtIDE7XG4gICAgICAgIHJlc0RheU9mWWVhciA9IGRheXNJblllYXIocmVzWWVhcikgKyBkYXlPZlllYXI7XG4gICAgfSBlbHNlIGlmIChkYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXIpKSB7XG4gICAgICAgIHJlc1llYXIgPSB5ZWFyICsgMTtcbiAgICAgICAgcmVzRGF5T2ZZZWFyID0gZGF5T2ZZZWFyIC0gZGF5c0luWWVhcih5ZWFyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXNZZWFyID0geWVhcjtcbiAgICAgICAgcmVzRGF5T2ZZZWFyID0gZGF5T2ZZZWFyO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHllYXI6IHJlc1llYXIsXG4gICAgICAgIGRheU9mWWVhcjogcmVzRGF5T2ZZZWFyXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gd2Vla09mWWVhcihtb20sIGRvdywgZG95KSB7XG4gICAgdmFyIHdlZWtPZmZzZXQgPSBmaXJzdFdlZWtPZmZzZXQobW9tLnllYXIoKSwgZG93LCBkb3kpLFxuICAgICAgICB3ZWVrID0gTWF0aC5mbG9vcigobW9tLmRheU9mWWVhcigpIC0gd2Vla09mZnNldCAtIDEpIC8gNykgKyAxLFxuICAgICAgICByZXNXZWVrLCByZXNZZWFyO1xuXG4gICAgaWYgKHdlZWsgPCAxKSB7XG4gICAgICAgIHJlc1llYXIgPSBtb20ueWVhcigpIC0gMTtcbiAgICAgICAgcmVzV2VlayA9IHdlZWsgKyB3ZWVrc0luWWVhcihyZXNZZWFyLCBkb3csIGRveSk7XG4gICAgfSBlbHNlIGlmICh3ZWVrID4gd2Vla3NJblllYXIobW9tLnllYXIoKSwgZG93LCBkb3kpKSB7XG4gICAgICAgIHJlc1dlZWsgPSB3ZWVrIC0gd2Vla3NJblllYXIobW9tLnllYXIoKSwgZG93LCBkb3kpO1xuICAgICAgICByZXNZZWFyID0gbW9tLnllYXIoKSArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzWWVhciA9IG1vbS55ZWFyKCk7XG4gICAgICAgIHJlc1dlZWsgPSB3ZWVrO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHdlZWs6IHJlc1dlZWssXG4gICAgICAgIHllYXI6IHJlc1llYXJcbiAgICB9O1xufVxuXG5mdW5jdGlvbiB3ZWVrc0luWWVhcih5ZWFyLCBkb3csIGRveSkge1xuICAgIHZhciB3ZWVrT2Zmc2V0ID0gZmlyc3RXZWVrT2Zmc2V0KHllYXIsIGRvdywgZG95KSxcbiAgICAgICAgd2Vla09mZnNldE5leHQgPSBmaXJzdFdlZWtPZmZzZXQoeWVhciArIDEsIGRvdywgZG95KTtcbiAgICByZXR1cm4gKGRheXNJblllYXIoeWVhcikgLSB3ZWVrT2Zmc2V0ICsgd2Vla09mZnNldE5leHQpIC8gNztcbn1cblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbigndycsIFsnd3cnLCAyXSwgJ3dvJywgJ3dlZWsnKTtcbmFkZEZvcm1hdFRva2VuKCdXJywgWydXVycsIDJdLCAnV28nLCAnaXNvV2VlaycpO1xuXG4vLyBBTElBU0VTXG5cbmFkZFVuaXRBbGlhcygnd2VlaycsICd3Jyk7XG5hZGRVbml0QWxpYXMoJ2lzb1dlZWsnLCAnVycpO1xuXG4vLyBQUklPUklUSUVTXG5cbmFkZFVuaXRQcmlvcml0eSgnd2VlaycsIDUpO1xuYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrJywgNSk7XG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbigndycsICBtYXRjaDF0bzIpO1xuYWRkUmVnZXhUb2tlbignd3cnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5hZGRSZWdleFRva2VuKCdXJywgIG1hdGNoMXRvMik7XG5hZGRSZWdleFRva2VuKCdXVycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuYWRkV2Vla1BhcnNlVG9rZW4oWyd3JywgJ3d3JywgJ1cnLCAnV1cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMSldID0gdG9JbnQoaW5wdXQpO1xufSk7XG5cbi8vIEhFTFBFUlNcblxuLy8gTE9DQUxFU1xuXG5mdW5jdGlvbiBsb2NhbGVXZWVrIChtb20pIHtcbiAgICByZXR1cm4gd2Vla09mWWVhcihtb20sIHRoaXMuX3dlZWsuZG93LCB0aGlzLl93ZWVrLmRveSkud2Vlaztcbn1cblxudmFyIGRlZmF1bHRMb2NhbGVXZWVrID0ge1xuICAgIGRvdyA6IDAsIC8vIFN1bmRheSBpcyB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgIGRveSA6IDYgIC8vIFRoZSB3ZWVrIHRoYXQgY29udGFpbnMgSmFuIDFzdCBpcyB0aGUgZmlyc3Qgd2VlayBvZiB0aGUgeWVhci5cbn07XG5cbmZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZXZWVrICgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2Vlay5kb3c7XG59XG5cbmZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZZZWFyICgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2Vlay5kb3k7XG59XG5cbi8vIE1PTUVOVFNcblxuZnVuY3Rpb24gZ2V0U2V0V2VlayAoaW5wdXQpIHtcbiAgICB2YXIgd2VlayA9IHRoaXMubG9jYWxlRGF0YSgpLndlZWsodGhpcyk7XG4gICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xufVxuXG5mdW5jdGlvbiBnZXRTZXRJU09XZWVrIChpbnB1dCkge1xuICAgIHZhciB3ZWVrID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS53ZWVrO1xuICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbn1cblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbignZCcsIDAsICdkbycsICdkYXknKTtcblxuYWRkRm9ybWF0VG9rZW4oJ2RkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c01pbih0aGlzLCBmb3JtYXQpO1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKCdkZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzU2hvcnQodGhpcywgZm9ybWF0KTtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbignZGRkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXModGhpcywgZm9ybWF0KTtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbignZScsIDAsIDAsICd3ZWVrZGF5Jyk7XG5hZGRGb3JtYXRUb2tlbignRScsIDAsIDAsICdpc29XZWVrZGF5Jyk7XG5cbi8vIEFMSUFTRVNcblxuYWRkVW5pdEFsaWFzKCdkYXknLCAnZCcpO1xuYWRkVW5pdEFsaWFzKCd3ZWVrZGF5JywgJ2UnKTtcbmFkZFVuaXRBbGlhcygnaXNvV2Vla2RheScsICdFJyk7XG5cbi8vIFBSSU9SSVRZXG5hZGRVbml0UHJpb3JpdHkoJ2RheScsIDExKTtcbmFkZFVuaXRQcmlvcml0eSgnd2Vla2RheScsIDExKTtcbmFkZFVuaXRQcmlvcml0eSgnaXNvV2Vla2RheScsIDExKTtcblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCdkJywgICAgbWF0Y2gxdG8yKTtcbmFkZFJlZ2V4VG9rZW4oJ2UnLCAgICBtYXRjaDF0bzIpO1xuYWRkUmVnZXhUb2tlbignRScsICAgIG1hdGNoMXRvMik7XG5hZGRSZWdleFRva2VuKCdkZCcsICAgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzTWluUmVnZXgoaXNTdHJpY3QpO1xufSk7XG5hZGRSZWdleFRva2VuKCdkZGQnLCAgIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgcmV0dXJuIGxvY2FsZS53ZWVrZGF5c1Nob3J0UmVnZXgoaXNTdHJpY3QpO1xufSk7XG5hZGRSZWdleFRva2VuKCdkZGRkJywgICBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgIHJldHVybiBsb2NhbGUud2Vla2RheXNSZWdleChpc1N0cmljdCk7XG59KTtcblxuYWRkV2Vla1BhcnNlVG9rZW4oWydkZCcsICdkZGQnLCAnZGRkZCddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICB2YXIgd2Vla2RheSA9IGNvbmZpZy5fbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQsIHRva2VuLCBjb25maWcuX3N0cmljdCk7XG4gICAgLy8gaWYgd2UgZGlkbid0IGdldCBhIHdlZWtkYXkgbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkXG4gICAgaWYgKHdlZWtkYXkgIT0gbnVsbCkge1xuICAgICAgICB3ZWVrLmQgPSB3ZWVrZGF5O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRXZWVrZGF5ID0gaW5wdXQ7XG4gICAgfVxufSk7XG5cbmFkZFdlZWtQYXJzZVRva2VuKFsnZCcsICdlJywgJ0UnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgd2Vla1t0b2tlbl0gPSB0b0ludChpbnB1dCk7XG59KTtcblxuLy8gSEVMUEVSU1xuXG5mdW5jdGlvbiBwYXJzZVdlZWtkYXkoaW5wdXQsIGxvY2FsZSkge1xuICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG5cbiAgICBpZiAoIWlzTmFOKGlucHV0KSkge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQoaW5wdXQsIDEwKTtcbiAgICB9XG5cbiAgICBpbnB1dCA9IGxvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHBhcnNlSXNvV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KSAlIDcgfHwgNztcbiAgICB9XG4gICAgcmV0dXJuIGlzTmFOKGlucHV0KSA/IG51bGwgOiBpbnB1dDtcbn1cblxuLy8gTE9DQUxFU1xuXG52YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzID0gJ1N1bmRheV9Nb25kYXlfVHVlc2RheV9XZWRuZXNkYXlfVGh1cnNkYXlfRnJpZGF5X1NhdHVyZGF5Jy5zcGxpdCgnXycpO1xuZnVuY3Rpb24gbG9jYWxlV2Vla2RheXMgKG0sIGZvcm1hdCkge1xuICAgIGlmICghbSkge1xuICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl93ZWVrZGF5cykgPyB0aGlzLl93ZWVrZGF5cyA6XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1snc3RhbmRhbG9uZSddO1xuICAgIH1cbiAgICByZXR1cm4gaXNBcnJheSh0aGlzLl93ZWVrZGF5cykgPyB0aGlzLl93ZWVrZGF5c1ttLmRheSgpXSA6XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzW3RoaXMuX3dlZWtkYXlzLmlzRm9ybWF0LnRlc3QoZm9ybWF0KSA/ICdmb3JtYXQnIDogJ3N0YW5kYWxvbmUnXVttLmRheSgpXTtcbn1cblxudmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0ID0gJ1N1bl9Nb25fVHVlX1dlZF9UaHVfRnJpX1NhdCcuc3BsaXQoJ18nKTtcbmZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzU2hvcnQgKG0pIHtcbiAgICByZXR1cm4gKG0pID8gdGhpcy5fd2Vla2RheXNTaG9ydFttLmRheSgpXSA6IHRoaXMuX3dlZWtkYXlzU2hvcnQ7XG59XG5cbnZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXNNaW4gPSAnU3VfTW9fVHVfV2VfVGhfRnJfU2EnLnNwbGl0KCdfJyk7XG5mdW5jdGlvbiBsb2NhbGVXZWVrZGF5c01pbiAobSkge1xuICAgIHJldHVybiAobSkgPyB0aGlzLl93ZWVrZGF5c01pblttLmRheSgpXSA6IHRoaXMuX3dlZWtkYXlzTWluO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTdHJpY3RQYXJzZSQxKHdlZWtkYXlOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgIHZhciBpLCBpaSwgbW9tLCBsbGMgPSB3ZWVrZGF5TmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgIGlmICghdGhpcy5fd2Vla2RheXNQYXJzZSkge1xuICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlID0gW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7ICsraSkge1xuICAgICAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgdGhpcy5fbWluV2Vla2RheXNQYXJzZVtpXSA9IHRoaXMud2Vla2RheXNNaW4obW9tLCAnJykudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZVtpXSA9IHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZVtpXSA9IHRoaXMud2Vla2RheXMobW9tLCAnJykudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ2RkZGQnKSB7XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl93ZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQgPT09ICdkZGQnKSB7XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm9ybWF0ID09PSAnZGRkZCcpIHtcbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3dlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX21pbldlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2RkZCcpIHtcbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl93ZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX21pbldlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl93ZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzUGFyc2UgKHdlZWtkYXlOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICByZXR1cm4gaGFuZGxlU3RyaWN0UGFyc2UkMS5jYWxsKHRoaXMsIHdlZWtkYXlOYW1lLCBmb3JtYXQsIHN0cmljdCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlKSB7XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgdGhpcy5fbWluV2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgdGhpcy5fZnVsbFdlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuXG4gICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgaWYgKHN0cmljdCAmJiAhdGhpcy5fZnVsbFdlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2Z1bGxXZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnXFwuPycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLndlZWtkYXlzU2hvcnQobW9tLCAnJykucmVwbGFjZSgnLicsICdcXC4/JykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnXFwuPycpICsgJyQnLCAnaScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fd2Vla2RheXNQYXJzZVtpXSkge1xuICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ2RkZGQnICYmIHRoaXMuX2Z1bGxXZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnZGRkJyAmJiB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9IGVsc2UgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdkZCcgJiYgdGhpcy5fbWluV2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCAmJiB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gTU9NRU5UU1xuXG5mdW5jdGlvbiBnZXRTZXREYXlPZldlZWsgKGlucHV0KSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCA/IHRoaXMgOiBOYU47XG4gICAgfVxuICAgIHZhciBkYXkgPSB0aGlzLl9pc1VUQyA/IHRoaXMuX2QuZ2V0VVRDRGF5KCkgOiB0aGlzLl9kLmdldERheSgpO1xuICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgIGlucHV0ID0gcGFyc2VXZWVrZGF5KGlucHV0LCB0aGlzLmxvY2FsZURhdGEoKSk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChpbnB1dCAtIGRheSwgJ2QnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZGF5O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrIChpbnB1dCkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgIH1cbiAgICB2YXIgd2Vla2RheSA9ICh0aGlzLmRheSgpICsgNyAtIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdykgJSA3O1xuICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2Vla2RheSA6IHRoaXMuYWRkKGlucHV0IC0gd2Vla2RheSwgJ2QnKTtcbn1cblxuZnVuY3Rpb24gZ2V0U2V0SVNPRGF5T2ZXZWVrIChpbnB1dCkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgIH1cblxuICAgIC8vIGJlaGF2ZXMgdGhlIHNhbWUgYXMgbW9tZW50I2RheSBleGNlcHRcbiAgICAvLyBhcyBhIGdldHRlciwgcmV0dXJucyA3IGluc3RlYWQgb2YgMCAoMS03IHJhbmdlIGluc3RlYWQgb2YgMC02KVxuICAgIC8vIGFzIGEgc2V0dGVyLCBzdW5kYXkgc2hvdWxkIGJlbG9uZyB0byB0aGUgcHJldmlvdXMgd2Vlay5cblxuICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgIHZhciB3ZWVrZGF5ID0gcGFyc2VJc29XZWVrZGF5KGlucHV0LCB0aGlzLmxvY2FsZURhdGEoKSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRheSh0aGlzLmRheSgpICUgNyA/IHdlZWtkYXkgOiB3ZWVrZGF5IC0gNyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF5KCkgfHwgNztcbiAgICB9XG59XG5cbnZhciBkZWZhdWx0V2Vla2RheXNSZWdleCA9IG1hdGNoV29yZDtcbmZ1bmN0aW9uIHdlZWtkYXlzUmVnZXggKGlzU3RyaWN0KSB7XG4gICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgIGNvbXB1dGVXZWVrZGF5c1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTdHJpY3RSZWdleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1JlZ2V4ID0gZGVmYXVsdFdlZWtkYXlzUmVnZXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNTdHJpY3RSZWdleCA6IHRoaXMuX3dlZWtkYXlzUmVnZXg7XG4gICAgfVxufVxuXG52YXIgZGVmYXVsdFdlZWtkYXlzU2hvcnRSZWdleCA9IG1hdGNoV29yZDtcbmZ1bmN0aW9uIHdlZWtkYXlzU2hvcnRSZWdleCAoaXNTdHJpY3QpIHtcbiAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzUmVnZXgnKSkge1xuICAgICAgICAgICAgY29tcHV0ZVdlZWtkYXlzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0U3RyaWN0UmVnZXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFJlZ2V4O1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNTaG9ydFJlZ2V4JykpIHtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleCA9IGRlZmF1bHRXZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleCAmJiBpc1N0cmljdCA/XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1Nob3J0U3RyaWN0UmVnZXggOiB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgfVxufVxuXG52YXIgZGVmYXVsdFdlZWtkYXlzTWluUmVnZXggPSBtYXRjaFdvcmQ7XG5mdW5jdGlvbiB3ZWVrZGF5c01pblJlZ2V4IChpc1N0cmljdCkge1xuICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlRXhhY3QpIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICBjb21wdXRlV2Vla2RheXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNNaW5SZWdleDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzTWluUmVnZXgnKSkge1xuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNNaW5SZWdleCA9IGRlZmF1bHRXZWVrZGF5c01pblJlZ2V4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXggOiB0aGlzLl93ZWVrZGF5c01pblJlZ2V4O1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBjb21wdXRlV2Vla2RheXNQYXJzZSAoKSB7XG4gICAgZnVuY3Rpb24gY21wTGVuUmV2KGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG4gICAgfVxuXG4gICAgdmFyIG1pblBpZWNlcyA9IFtdLCBzaG9ydFBpZWNlcyA9IFtdLCBsb25nUGllY2VzID0gW10sIG1peGVkUGllY2VzID0gW10sXG4gICAgICAgIGksIG1vbSwgbWlucCwgc2hvcnRwLCBsb25ncDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgIG1pbnAgPSB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICBzaG9ydHAgPSB0aGlzLndlZWtkYXlzU2hvcnQobW9tLCAnJyk7XG4gICAgICAgIGxvbmdwID0gdGhpcy53ZWVrZGF5cyhtb20sICcnKTtcbiAgICAgICAgbWluUGllY2VzLnB1c2gobWlucCk7XG4gICAgICAgIHNob3J0UGllY2VzLnB1c2goc2hvcnRwKTtcbiAgICAgICAgbG9uZ1BpZWNlcy5wdXNoKGxvbmdwKTtcbiAgICAgICAgbWl4ZWRQaWVjZXMucHVzaChtaW5wKTtcbiAgICAgICAgbWl4ZWRQaWVjZXMucHVzaChzaG9ydHApO1xuICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKGxvbmdwKTtcbiAgICB9XG4gICAgLy8gU29ydGluZyBtYWtlcyBzdXJlIGlmIG9uZSB3ZWVrZGF5IChvciBhYmJyKSBpcyBhIHByZWZpeCBvZiBhbm90aGVyIGl0XG4gICAgLy8gd2lsbCBtYXRjaCB0aGUgbG9uZ2VyIHBpZWNlLlxuICAgIG1pblBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgc2hvcnRQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgIGxvbmdQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgIG1peGVkUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgIHNob3J0UGllY2VzW2ldID0gcmVnZXhFc2NhcGUoc2hvcnRQaWVjZXNbaV0pO1xuICAgICAgICBsb25nUGllY2VzW2ldID0gcmVnZXhFc2NhcGUobG9uZ1BpZWNlc1tpXSk7XG4gICAgICAgIG1peGVkUGllY2VzW2ldID0gcmVnZXhFc2NhcGUobWl4ZWRQaWVjZXNbaV0pO1xuICAgIH1cblxuICAgIHRoaXMuX3dlZWtkYXlzUmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBtaXhlZFBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgdGhpcy5fd2Vla2RheXNTaG9ydFJlZ2V4ID0gdGhpcy5fd2Vla2RheXNSZWdleDtcbiAgICB0aGlzLl93ZWVrZGF5c01pblJlZ2V4ID0gdGhpcy5fd2Vla2RheXNSZWdleDtcblxuICAgIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBsb25nUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICB0aGlzLl93ZWVrZGF5c1Nob3J0U3RyaWN0UmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBzaG9ydFBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgdGhpcy5fd2Vla2RheXNNaW5TdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIG1pblBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG59XG5cbi8vIEZPUk1BVFRJTkdcblxuZnVuY3Rpb24gaEZvcm1hdCgpIHtcbiAgICByZXR1cm4gdGhpcy5ob3VycygpICUgMTIgfHwgMTI7XG59XG5cbmZ1bmN0aW9uIGtGb3JtYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaG91cnMoKSB8fCAyNDtcbn1cblxuYWRkRm9ybWF0VG9rZW4oJ0gnLCBbJ0hIJywgMl0sIDAsICdob3VyJyk7XG5hZGRGb3JtYXRUb2tlbignaCcsIFsnaGgnLCAyXSwgMCwgaEZvcm1hdCk7XG5hZGRGb3JtYXRUb2tlbignaycsIFsna2snLCAyXSwgMCwga0Zvcm1hdCk7XG5cbmFkZEZvcm1hdFRva2VuKCdobW0nLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICcnICsgaEZvcm1hdC5hcHBseSh0aGlzKSArIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKTtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbignaG1tc3MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICcnICsgaEZvcm1hdC5hcHBseSh0aGlzKSArIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKSArXG4gICAgICAgIHplcm9GaWxsKHRoaXMuc2Vjb25kcygpLCAyKTtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbignSG1tJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnJyArIHRoaXMuaG91cnMoKSArIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKTtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbignSG1tc3MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICcnICsgdGhpcy5ob3VycygpICsgemVyb0ZpbGwodGhpcy5taW51dGVzKCksIDIpICtcbiAgICAgICAgemVyb0ZpbGwodGhpcy5zZWNvbmRzKCksIDIpO1xufSk7XG5cbmZ1bmN0aW9uIG1lcmlkaWVtICh0b2tlbiwgbG93ZXJjYXNlKSB7XG4gICAgYWRkRm9ybWF0VG9rZW4odG9rZW4sIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1lcmlkaWVtKHRoaXMuaG91cnMoKSwgdGhpcy5taW51dGVzKCksIGxvd2VyY2FzZSk7XG4gICAgfSk7XG59XG5cbm1lcmlkaWVtKCdhJywgdHJ1ZSk7XG5tZXJpZGllbSgnQScsIGZhbHNlKTtcblxuLy8gQUxJQVNFU1xuXG5hZGRVbml0QWxpYXMoJ2hvdXInLCAnaCcpO1xuXG4vLyBQUklPUklUWVxuYWRkVW5pdFByaW9yaXR5KCdob3VyJywgMTMpO1xuXG4vLyBQQVJTSU5HXG5cbmZ1bmN0aW9uIG1hdGNoTWVyaWRpZW0gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICByZXR1cm4gbG9jYWxlLl9tZXJpZGllbVBhcnNlO1xufVxuXG5hZGRSZWdleFRva2VuKCdhJywgIG1hdGNoTWVyaWRpZW0pO1xuYWRkUmVnZXhUb2tlbignQScsICBtYXRjaE1lcmlkaWVtKTtcbmFkZFJlZ2V4VG9rZW4oJ0gnLCAgbWF0Y2gxdG8yKTtcbmFkZFJlZ2V4VG9rZW4oJ2gnLCAgbWF0Y2gxdG8yKTtcbmFkZFJlZ2V4VG9rZW4oJ2snLCAgbWF0Y2gxdG8yKTtcbmFkZFJlZ2V4VG9rZW4oJ0hIJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuYWRkUmVnZXhUb2tlbignaGgnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5hZGRSZWdleFRva2VuKCdraycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuYWRkUmVnZXhUb2tlbignaG1tJywgbWF0Y2gzdG80KTtcbmFkZFJlZ2V4VG9rZW4oJ2htbXNzJywgbWF0Y2g1dG82KTtcbmFkZFJlZ2V4VG9rZW4oJ0htbScsIG1hdGNoM3RvNCk7XG5hZGRSZWdleFRva2VuKCdIbW1zcycsIG1hdGNoNXRvNik7XG5cbmFkZFBhcnNlVG9rZW4oWydIJywgJ0hIJ10sIEhPVVIpO1xuYWRkUGFyc2VUb2tlbihbJ2snLCAna2snXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgdmFyIGtJbnB1dCA9IHRvSW50KGlucHV0KTtcbiAgICBhcnJheVtIT1VSXSA9IGtJbnB1dCA9PT0gMjQgPyAwIDoga0lucHV0O1xufSk7XG5hZGRQYXJzZVRva2VuKFsnYScsICdBJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgIGNvbmZpZy5faXNQbSA9IGNvbmZpZy5fbG9jYWxlLmlzUE0oaW5wdXQpO1xuICAgIGNvbmZpZy5fbWVyaWRpZW0gPSBpbnB1dDtcbn0pO1xuYWRkUGFyc2VUb2tlbihbJ2gnLCAnaGgnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dCk7XG4gICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHRydWU7XG59KTtcbmFkZFBhcnNlVG9rZW4oJ2htbScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgIHZhciBwb3MgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQuc3Vic3RyKDAsIHBvcykpO1xuICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zKSk7XG4gICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHRydWU7XG59KTtcbmFkZFBhcnNlVG9rZW4oJ2htbXNzJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgdmFyIHBvczEgPSBpbnB1dC5sZW5ndGggLSA0O1xuICAgIHZhciBwb3MyID0gaW5wdXQubGVuZ3RoIC0gMjtcbiAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MxKSk7XG4gICAgYXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MxLCAyKSk7XG4gICAgYXJyYXlbU0VDT05EXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MyKSk7XG4gICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHRydWU7XG59KTtcbmFkZFBhcnNlVG9rZW4oJ0htbScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgIHZhciBwb3MgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQuc3Vic3RyKDAsIHBvcykpO1xuICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zKSk7XG59KTtcbmFkZFBhcnNlVG9rZW4oJ0htbXNzJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgdmFyIHBvczEgPSBpbnB1dC5sZW5ndGggLSA0O1xuICAgIHZhciBwb3MyID0gaW5wdXQubGVuZ3RoIC0gMjtcbiAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MxKSk7XG4gICAgYXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MxLCAyKSk7XG4gICAgYXJyYXlbU0VDT05EXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MyKSk7XG59KTtcblxuLy8gTE9DQUxFU1xuXG5mdW5jdGlvbiBsb2NhbGVJc1BNIChpbnB1dCkge1xuICAgIC8vIElFOCBRdWlya3MgTW9kZSAmIElFNyBTdGFuZGFyZHMgTW9kZSBkbyBub3QgYWxsb3cgYWNjZXNzaW5nIHN0cmluZ3MgbGlrZSBhcnJheXNcbiAgICAvLyBVc2luZyBjaGFyQXQgc2hvdWxkIGJlIG1vcmUgY29tcGF0aWJsZS5cbiAgICByZXR1cm4gKChpbnB1dCArICcnKS50b0xvd2VyQ2FzZSgpLmNoYXJBdCgwKSA9PT0gJ3AnKTtcbn1cblxudmFyIGRlZmF1bHRMb2NhbGVNZXJpZGllbVBhcnNlID0gL1thcF1cXC4/bT9cXC4/L2k7XG5mdW5jdGlvbiBsb2NhbGVNZXJpZGllbSAoaG91cnMsIG1pbnV0ZXMsIGlzTG93ZXIpIHtcbiAgICBpZiAoaG91cnMgPiAxMSkge1xuICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdwbScgOiAnUE0nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpc0xvd2VyID8gJ2FtJyA6ICdBTSc7XG4gICAgfVxufVxuXG5cbi8vIE1PTUVOVFNcblxuLy8gU2V0dGluZyB0aGUgaG91ciBzaG91bGQga2VlcCB0aGUgdGltZSwgYmVjYXVzZSB0aGUgdXNlciBleHBsaWNpdGx5XG4vLyBzcGVjaWZpZWQgd2hpY2ggaG91ciBoZSB3YW50cy4gU28gdHJ5aW5nIHRvIG1haW50YWluIHRoZSBzYW1lIGhvdXIgKGluXG4vLyBhIG5ldyB0aW1lem9uZSkgbWFrZXMgc2Vuc2UuIEFkZGluZy9zdWJ0cmFjdGluZyBob3VycyBkb2VzIG5vdCBmb2xsb3dcbi8vIHRoaXMgcnVsZS5cbnZhciBnZXRTZXRIb3VyID0gbWFrZUdldFNldCgnSG91cnMnLCB0cnVlKTtcblxudmFyIGJhc2VDb25maWcgPSB7XG4gICAgY2FsZW5kYXI6IGRlZmF1bHRDYWxlbmRhcixcbiAgICBsb25nRGF0ZUZvcm1hdDogZGVmYXVsdExvbmdEYXRlRm9ybWF0LFxuICAgIGludmFsaWREYXRlOiBkZWZhdWx0SW52YWxpZERhdGUsXG4gICAgb3JkaW5hbDogZGVmYXVsdE9yZGluYWwsXG4gICAgZGF5T2ZNb250aE9yZGluYWxQYXJzZTogZGVmYXVsdERheU9mTW9udGhPcmRpbmFsUGFyc2UsXG4gICAgcmVsYXRpdmVUaW1lOiBkZWZhdWx0UmVsYXRpdmVUaW1lLFxuXG4gICAgbW9udGhzOiBkZWZhdWx0TG9jYWxlTW9udGhzLFxuICAgIG1vbnRoc1Nob3J0OiBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQsXG5cbiAgICB3ZWVrOiBkZWZhdWx0TG9jYWxlV2VlayxcblxuICAgIHdlZWtkYXlzOiBkZWZhdWx0TG9jYWxlV2Vla2RheXMsXG4gICAgd2Vla2RheXNNaW46IGRlZmF1bHRMb2NhbGVXZWVrZGF5c01pbixcbiAgICB3ZWVrZGF5c1Nob3J0OiBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydCxcblxuICAgIG1lcmlkaWVtUGFyc2U6IGRlZmF1bHRMb2NhbGVNZXJpZGllbVBhcnNlXG59O1xuXG4vLyBpbnRlcm5hbCBzdG9yYWdlIGZvciBsb2NhbGUgY29uZmlnIGZpbGVzXG52YXIgbG9jYWxlcyA9IHt9O1xudmFyIGxvY2FsZUZhbWlsaWVzID0ge307XG52YXIgZ2xvYmFsTG9jYWxlO1xuXG5mdW5jdGlvbiBub3JtYWxpemVMb2NhbGUoa2V5KSB7XG4gICAgcmV0dXJuIGtleSA/IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ18nLCAnLScpIDoga2V5O1xufVxuXG4vLyBwaWNrIHRoZSBsb2NhbGUgZnJvbSB0aGUgYXJyYXlcbi8vIHRyeSBbJ2VuLWF1JywgJ2VuLWdiJ10gYXMgJ2VuLWF1JywgJ2VuLWdiJywgJ2VuJywgYXMgaW4gbW92ZSB0aHJvdWdoIHRoZSBsaXN0IHRyeWluZyBlYWNoXG4vLyBzdWJzdHJpbmcgZnJvbSBtb3N0IHNwZWNpZmljIHRvIGxlYXN0LCBidXQgbW92ZSB0byB0aGUgbmV4dCBhcnJheSBpdGVtIGlmIGl0J3MgYSBtb3JlIHNwZWNpZmljIHZhcmlhbnQgdGhhbiB0aGUgY3VycmVudCByb290XG5mdW5jdGlvbiBjaG9vc2VMb2NhbGUobmFtZXMpIHtcbiAgICB2YXIgaSA9IDAsIGosIG5leHQsIGxvY2FsZSwgc3BsaXQ7XG5cbiAgICB3aGlsZSAoaSA8IG5hbWVzLmxlbmd0aCkge1xuICAgICAgICBzcGxpdCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpXSkuc3BsaXQoJy0nKTtcbiAgICAgICAgaiA9IHNwbGl0Lmxlbmd0aDtcbiAgICAgICAgbmV4dCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpICsgMV0pO1xuICAgICAgICBuZXh0ID0gbmV4dCA/IG5leHQuc3BsaXQoJy0nKSA6IG51bGw7XG4gICAgICAgIHdoaWxlIChqID4gMCkge1xuICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShzcGxpdC5zbGljZSgwLCBqKS5qb2luKCctJykpO1xuICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0Lmxlbmd0aCA+PSBqICYmIGNvbXBhcmVBcnJheXMoc3BsaXQsIG5leHQsIHRydWUpID49IGogLSAxKSB7XG4gICAgICAgICAgICAgICAgLy90aGUgbmV4dCBhcnJheSBpdGVtIGlzIGJldHRlciB0aGFuIGEgc2hhbGxvd2VyIHN1YnN0cmluZyBvZiB0aGlzIG9uZVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgai0tO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGdsb2JhbExvY2FsZTtcbn1cblxuZnVuY3Rpb24gbG9hZExvY2FsZShuYW1lKSB7XG4gICAgdmFyIG9sZExvY2FsZSA9IG51bGw7XG4gICAgLy8gVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVnaXN0ZXIgYW5kIGxvYWQgYWxsIHRoZSBsb2NhbGVzIGluIE5vZGVcbiAgICBpZiAoIWxvY2FsZXNbbmFtZV0gJiYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSAmJlxuICAgICAgICAgICAgbW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBvbGRMb2NhbGUgPSBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgICAgICAgICB2YXIgYWxpYXNlZFJlcXVpcmUgPSByZXF1aXJlO1xuICAgICAgICAgICAgYWxpYXNlZFJlcXVpcmUoJy4vbG9jYWxlLycgKyBuYW1lKTtcbiAgICAgICAgICAgIGdldFNldEdsb2JhbExvY2FsZShvbGRMb2NhbGUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cbiAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbn1cblxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGxvYWQgbG9jYWxlIGFuZCB0aGVuIHNldCB0aGUgZ2xvYmFsIGxvY2FsZS4gIElmXG4vLyBubyBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiwgaXQgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZSBjdXJyZW50IGdsb2JhbFxuLy8gbG9jYWxlIGtleS5cbmZ1bmN0aW9uIGdldFNldEdsb2JhbExvY2FsZSAoa2V5LCB2YWx1ZXMpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBpZiAoa2V5KSB7XG4gICAgICAgIGlmIChpc1VuZGVmaW5lZCh2YWx1ZXMpKSB7XG4gICAgICAgICAgICBkYXRhID0gZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkYXRhID0gZGVmaW5lTG9jYWxlKGtleSwgdmFsdWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAvLyBtb21lbnQuZHVyYXRpb24uX2xvY2FsZSA9IG1vbWVudC5fbG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgIGdsb2JhbExvY2FsZSA9IGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiBjb25zb2xlICE9PSAgJ3VuZGVmaW5lZCcpICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgICAgIC8vd2FybiB1c2VyIGlmIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGJ1dCB0aGUgbG9jYWxlIGNvdWxkIG5vdCBiZSBzZXRcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0xvY2FsZSAnICsga2V5ICsgICcgbm90IGZvdW5kLiBEaWQgeW91IGZvcmdldCB0byBsb2FkIGl0PycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGdsb2JhbExvY2FsZS5fYWJicjtcbn1cblxuZnVuY3Rpb24gZGVmaW5lTG9jYWxlIChuYW1lLCBjb25maWcpIHtcbiAgICBpZiAoY29uZmlnICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBsb2NhbGUsIHBhcmVudENvbmZpZyA9IGJhc2VDb25maWc7XG4gICAgICAgIGNvbmZpZy5hYmJyID0gbmFtZTtcbiAgICAgICAgaWYgKGxvY2FsZXNbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgZGVwcmVjYXRlU2ltcGxlKCdkZWZpbmVMb2NhbGVPdmVycmlkZScsXG4gICAgICAgICAgICAgICAgICAgICd1c2UgbW9tZW50LnVwZGF0ZUxvY2FsZShsb2NhbGVOYW1lLCBjb25maWcpIHRvIGNoYW5nZSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2FuIGV4aXN0aW5nIGxvY2FsZS4gbW9tZW50LmRlZmluZUxvY2FsZShsb2NhbGVOYW1lLCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZykgc2hvdWxkIG9ubHkgYmUgdXNlZCBmb3IgY3JlYXRpbmcgYSBuZXcgbG9jYWxlICcgK1xuICAgICAgICAgICAgICAgICAgICAnU2VlIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvZGVmaW5lLWxvY2FsZS8gZm9yIG1vcmUgaW5mby4nKTtcbiAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IGxvY2FsZXNbbmFtZV0uX2NvbmZpZztcbiAgICAgICAgfSBlbHNlIGlmIChjb25maWcucGFyZW50TG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChsb2NhbGVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRDb25maWcgPSBsb2NhbGVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdLl9jb25maWc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoY29uZmlnLnBhcmVudExvY2FsZSk7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IGxvY2FsZS5fY29uZmlnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbG9jYWxlRmFtaWxpZXNbY29uZmlnLnBhcmVudExvY2FsZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZUZhbWlsaWVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbG9jYWxlRmFtaWxpZXNbY29uZmlnLnBhcmVudExvY2FsZV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsb2NhbGVzW25hbWVdID0gbmV3IExvY2FsZShtZXJnZUNvbmZpZ3MocGFyZW50Q29uZmlnLCBjb25maWcpKTtcblxuICAgICAgICBpZiAobG9jYWxlRmFtaWxpZXNbbmFtZV0pIHtcbiAgICAgICAgICAgIGxvY2FsZUZhbWlsaWVzW25hbWVdLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICBkZWZpbmVMb2NhbGUoeC5uYW1lLCB4LmNvbmZpZyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAvLyBtYWtlIHN1cmUgd2Ugc2V0IHRoZSBsb2NhbGUgQUZURVIgYWxsIGNoaWxkIGxvY2FsZXMgaGF2ZSBiZWVuXG4gICAgICAgIC8vIGNyZWF0ZWQsIHNvIHdlIHdvbid0IGVuZCB1cCB3aXRoIHRoZSBjaGlsZCBsb2NhbGUgc2V0LlxuICAgICAgICBnZXRTZXRHbG9iYWxMb2NhbGUobmFtZSk7XG5cblxuICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyB1c2VmdWwgZm9yIHRlc3RpbmdcbiAgICAgICAgZGVsZXRlIGxvY2FsZXNbbmFtZV07XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTG9jYWxlKG5hbWUsIGNvbmZpZykge1xuICAgIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgICAgICB2YXIgbG9jYWxlLCB0bXBMb2NhbGUsIHBhcmVudENvbmZpZyA9IGJhc2VDb25maWc7XG4gICAgICAgIC8vIE1FUkdFXG4gICAgICAgIHRtcExvY2FsZSA9IGxvYWRMb2NhbGUobmFtZSk7XG4gICAgICAgIGlmICh0bXBMb2NhbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gdG1wTG9jYWxlLl9jb25maWc7XG4gICAgICAgIH1cbiAgICAgICAgY29uZmlnID0gbWVyZ2VDb25maWdzKHBhcmVudENvbmZpZywgY29uZmlnKTtcbiAgICAgICAgbG9jYWxlID0gbmV3IExvY2FsZShjb25maWcpO1xuICAgICAgICBsb2NhbGUucGFyZW50TG9jYWxlID0gbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgbG9jYWxlc1tuYW1lXSA9IGxvY2FsZTtcblxuICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0IGZvciBub3c6IGFsc28gc2V0IHRoZSBsb2NhbGVcbiAgICAgICAgZ2V0U2V0R2xvYmFsTG9jYWxlKG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHBhc3MgbnVsbCBmb3IgY29uZmlnIHRvIHVudXBkYXRlLCB1c2VmdWwgZm9yIHRlc3RzXG4gICAgICAgIGlmIChsb2NhbGVzW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChsb2NhbGVzW25hbWVdLnBhcmVudExvY2FsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IGxvY2FsZXNbbmFtZV0ucGFyZW50TG9jYWxlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsb2NhbGVzW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbn1cblxuLy8gcmV0dXJucyBsb2NhbGUgZGF0YVxuZnVuY3Rpb24gZ2V0TG9jYWxlIChrZXkpIHtcbiAgICB2YXIgbG9jYWxlO1xuXG4gICAgaWYgKGtleSAmJiBrZXkuX2xvY2FsZSAmJiBrZXkuX2xvY2FsZS5fYWJicikge1xuICAgICAgICBrZXkgPSBrZXkuX2xvY2FsZS5fYWJicjtcbiAgICB9XG5cbiAgICBpZiAoIWtleSkge1xuICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlO1xuICAgIH1cblxuICAgIGlmICghaXNBcnJheShrZXkpKSB7XG4gICAgICAgIC8vc2hvcnQtY2lyY3VpdCBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShrZXkpO1xuICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICB9XG4gICAgICAgIGtleSA9IFtrZXldO1xuICAgIH1cblxuICAgIHJldHVybiBjaG9vc2VMb2NhbGUoa2V5KTtcbn1cblxuZnVuY3Rpb24gbGlzdExvY2FsZXMoKSB7XG4gICAgcmV0dXJuIGtleXMobG9jYWxlcyk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrT3ZlcmZsb3cgKG0pIHtcbiAgICB2YXIgb3ZlcmZsb3c7XG4gICAgdmFyIGEgPSBtLl9hO1xuXG4gICAgaWYgKGEgJiYgZ2V0UGFyc2luZ0ZsYWdzKG0pLm92ZXJmbG93ID09PSAtMikge1xuICAgICAgICBvdmVyZmxvdyA9XG4gICAgICAgICAgICBhW01PTlRIXSAgICAgICA8IDAgfHwgYVtNT05USF0gICAgICAgPiAxMSAgPyBNT05USCA6XG4gICAgICAgICAgICBhW0RBVEVdICAgICAgICA8IDEgfHwgYVtEQVRFXSAgICAgICAgPiBkYXlzSW5Nb250aChhW1lFQVJdLCBhW01PTlRIXSkgPyBEQVRFIDpcbiAgICAgICAgICAgIGFbSE9VUl0gICAgICAgIDwgMCB8fCBhW0hPVVJdICAgICAgICA+IDI0IHx8IChhW0hPVVJdID09PSAyNCAmJiAoYVtNSU5VVEVdICE9PSAwIHx8IGFbU0VDT05EXSAhPT0gMCB8fCBhW01JTExJU0VDT05EXSAhPT0gMCkpID8gSE9VUiA6XG4gICAgICAgICAgICBhW01JTlVURV0gICAgICA8IDAgfHwgYVtNSU5VVEVdICAgICAgPiA1OSAgPyBNSU5VVEUgOlxuICAgICAgICAgICAgYVtTRUNPTkRdICAgICAgPCAwIHx8IGFbU0VDT05EXSAgICAgID4gNTkgID8gU0VDT05EIDpcbiAgICAgICAgICAgIGFbTUlMTElTRUNPTkRdIDwgMCB8fCBhW01JTExJU0VDT05EXSA+IDk5OSA/IE1JTExJU0VDT05EIDpcbiAgICAgICAgICAgIC0xO1xuXG4gICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MobSkuX292ZXJmbG93RGF5T2ZZZWFyICYmIChvdmVyZmxvdyA8IFlFQVIgfHwgb3ZlcmZsb3cgPiBEQVRFKSkge1xuICAgICAgICAgICAgb3ZlcmZsb3cgPSBEQVRFO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MobSkuX292ZXJmbG93V2Vla3MgJiYgb3ZlcmZsb3cgPT09IC0xKSB7XG4gICAgICAgICAgICBvdmVyZmxvdyA9IFdFRUs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dXZWVrZGF5ICYmIG92ZXJmbG93ID09PSAtMSkge1xuICAgICAgICAgICAgb3ZlcmZsb3cgPSBXRUVLREFZO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLm92ZXJmbG93ID0gb3ZlcmZsb3c7XG4gICAgfVxuXG4gICAgcmV0dXJuIG07XG59XG5cbi8vIFBpY2sgdGhlIGZpcnN0IGRlZmluZWQgb2YgdHdvIG9yIHRocmVlIGFyZ3VtZW50cy5cbmZ1bmN0aW9uIGRlZmF1bHRzKGEsIGIsIGMpIHtcbiAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBpZiAoYiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBiO1xuICAgIH1cbiAgICByZXR1cm4gYztcbn1cblxuZnVuY3Rpb24gY3VycmVudERhdGVBcnJheShjb25maWcpIHtcbiAgICAvLyBob29rcyBpcyBhY3R1YWxseSB0aGUgZXhwb3J0ZWQgbW9tZW50IG9iamVjdFxuICAgIHZhciBub3dWYWx1ZSA9IG5ldyBEYXRlKGhvb2tzLm5vdygpKTtcbiAgICBpZiAoY29uZmlnLl91c2VVVEMpIHtcbiAgICAgICAgcmV0dXJuIFtub3dWYWx1ZS5nZXRVVENGdWxsWWVhcigpLCBub3dWYWx1ZS5nZXRVVENNb250aCgpLCBub3dWYWx1ZS5nZXRVVENEYXRlKCldO1xuICAgIH1cbiAgICByZXR1cm4gW25vd1ZhbHVlLmdldEZ1bGxZZWFyKCksIG5vd1ZhbHVlLmdldE1vbnRoKCksIG5vd1ZhbHVlLmdldERhdGUoKV07XG59XG5cbi8vIGNvbnZlcnQgYW4gYXJyYXkgdG8gYSBkYXRlLlxuLy8gdGhlIGFycmF5IHNob3VsZCBtaXJyb3IgdGhlIHBhcmFtZXRlcnMgYmVsb3dcbi8vIG5vdGU6IGFsbCB2YWx1ZXMgcGFzdCB0aGUgeWVhciBhcmUgb3B0aW9uYWwgYW5kIHdpbGwgZGVmYXVsdCB0byB0aGUgbG93ZXN0IHBvc3NpYmxlIHZhbHVlLlxuLy8gW3llYXIsIG1vbnRoLCBkYXkgLCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmRdXG5mdW5jdGlvbiBjb25maWdGcm9tQXJyYXkgKGNvbmZpZykge1xuICAgIHZhciBpLCBkYXRlLCBpbnB1dCA9IFtdLCBjdXJyZW50RGF0ZSwgZXhwZWN0ZWRXZWVrZGF5LCB5ZWFyVG9Vc2U7XG5cbiAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKTtcblxuICAgIC8vY29tcHV0ZSBkYXkgb2YgdGhlIHllYXIgZnJvbSB3ZWVrcyBhbmQgd2Vla2RheXNcbiAgICBpZiAoY29uZmlnLl93ICYmIGNvbmZpZy5fYVtEQVRFXSA9PSBudWxsICYmIGNvbmZpZy5fYVtNT05USF0gPT0gbnVsbCkge1xuICAgICAgICBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKTtcbiAgICB9XG5cbiAgICAvL2lmIHRoZSBkYXkgb2YgdGhlIHllYXIgaXMgc2V0LCBmaWd1cmUgb3V0IHdoYXQgaXQgaXNcbiAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIgIT0gbnVsbCkge1xuICAgICAgICB5ZWFyVG9Vc2UgPSBkZWZhdWx0cyhjb25maWcuX2FbWUVBUl0sIGN1cnJlbnREYXRlW1lFQVJdKTtcblxuICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXJUb1VzZSkgfHwgY29uZmlnLl9kYXlPZlllYXIgPT09IDApIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLl9vdmVyZmxvd0RheU9mWWVhciA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBkYXRlID0gY3JlYXRlVVRDRGF0ZSh5ZWFyVG9Vc2UsIDAsIGNvbmZpZy5fZGF5T2ZZZWFyKTtcbiAgICAgICAgY29uZmlnLl9hW01PTlRIXSA9IGRhdGUuZ2V0VVRDTW9udGgoKTtcbiAgICAgICAgY29uZmlnLl9hW0RBVEVdID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IGRhdGUuXG4gICAgLy8gKiBpZiBubyB5ZWFyLCBtb250aCwgZGF5IG9mIG1vbnRoIGFyZSBnaXZlbiwgZGVmYXVsdCB0byB0b2RheVxuICAgIC8vICogaWYgZGF5IG9mIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG1vbnRoIGFuZCB5ZWFyXG4gICAgLy8gKiBpZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBvbmx5IHllYXJcbiAgICAvLyAqIGlmIHllYXIgaXMgZ2l2ZW4sIGRvbid0IGRlZmF1bHQgYW55dGhpbmdcbiAgICBmb3IgKGkgPSAwOyBpIDwgMyAmJiBjb25maWcuX2FbaV0gPT0gbnVsbDsgKytpKSB7XG4gICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gY3VycmVudERhdGVbaV07XG4gICAgfVxuXG4gICAgLy8gWmVybyBvdXQgd2hhdGV2ZXIgd2FzIG5vdCBkZWZhdWx0ZWQsIGluY2x1ZGluZyB0aW1lXG4gICAgZm9yICg7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSAoY29uZmlnLl9hW2ldID09IG51bGwpID8gKGkgPT09IDIgPyAxIDogMCkgOiBjb25maWcuX2FbaV07XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIDI0OjAwOjAwLjAwMFxuICAgIGlmIChjb25maWcuX2FbSE9VUl0gPT09IDI0ICYmXG4gICAgICAgICAgICBjb25maWcuX2FbTUlOVVRFXSA9PT0gMCAmJlxuICAgICAgICAgICAgY29uZmlnLl9hW1NFQ09ORF0gPT09IDAgJiZcbiAgICAgICAgICAgIGNvbmZpZy5fYVtNSUxMSVNFQ09ORF0gPT09IDApIHtcbiAgICAgICAgY29uZmlnLl9uZXh0RGF5ID0gdHJ1ZTtcbiAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMDtcbiAgICB9XG5cbiAgICBjb25maWcuX2QgPSAoY29uZmlnLl91c2VVVEMgPyBjcmVhdGVVVENEYXRlIDogY3JlYXRlRGF0ZSkuYXBwbHkobnVsbCwgaW5wdXQpO1xuICAgIGV4cGVjdGVkV2Vla2RheSA9IGNvbmZpZy5fdXNlVVRDID8gY29uZmlnLl9kLmdldFVUQ0RheSgpIDogY29uZmlnLl9kLmdldERheSgpO1xuXG4gICAgLy8gQXBwbHkgdGltZXpvbmUgb2Zmc2V0IGZyb20gaW5wdXQuIFRoZSBhY3R1YWwgdXRjT2Zmc2V0IGNhbiBiZSBjaGFuZ2VkXG4gICAgLy8gd2l0aCBwYXJzZVpvbmUuXG4gICAgaWYgKGNvbmZpZy5fdHptICE9IG51bGwpIHtcbiAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSAtIGNvbmZpZy5fdHptKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLl9uZXh0RGF5KSB7XG4gICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDI0O1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGZvciBtaXNtYXRjaGluZyBkYXkgb2Ygd2Vla1xuICAgIGlmIChjb25maWcuX3cgJiYgdHlwZW9mIGNvbmZpZy5fdy5kICE9PSAndW5kZWZpbmVkJyAmJiBjb25maWcuX3cuZCAhPT0gZXhwZWN0ZWRXZWVrZGF5KSB7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLndlZWtkYXlNaXNtYXRjaCA9IHRydWU7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKSB7XG4gICAgdmFyIHcsIHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSwgdGVtcCwgd2Vla2RheU92ZXJmbG93O1xuXG4gICAgdyA9IGNvbmZpZy5fdztcbiAgICBpZiAody5HRyAhPSBudWxsIHx8IHcuVyAhPSBudWxsIHx8IHcuRSAhPSBudWxsKSB7XG4gICAgICAgIGRvdyA9IDE7XG4gICAgICAgIGRveSA9IDQ7XG5cbiAgICAgICAgLy8gVE9ETzogV2UgbmVlZCB0byB0YWtlIHRoZSBjdXJyZW50IGlzb1dlZWtZZWFyLCBidXQgdGhhdCBkZXBlbmRzIG9uXG4gICAgICAgIC8vIGhvdyB3ZSBpbnRlcnByZXQgbm93IChsb2NhbCwgdXRjLCBmaXhlZCBvZmZzZXQpLiBTbyBjcmVhdGVcbiAgICAgICAgLy8gYSBub3cgdmVyc2lvbiBvZiBjdXJyZW50IGNvbmZpZyAodGFrZSBsb2NhbC91dGMvb2Zmc2V0IGZsYWdzLCBhbmRcbiAgICAgICAgLy8gY3JlYXRlIG5vdykuXG4gICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5HRywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKGNyZWF0ZUxvY2FsKCksIDEsIDQpLnllYXIpO1xuICAgICAgICB3ZWVrID0gZGVmYXVsdHMody5XLCAxKTtcbiAgICAgICAgd2Vla2RheSA9IGRlZmF1bHRzKHcuRSwgMSk7XG4gICAgICAgIGlmICh3ZWVrZGF5IDwgMSB8fCB3ZWVrZGF5ID4gNykge1xuICAgICAgICAgICAgd2Vla2RheU92ZXJmbG93ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGRvdyA9IGNvbmZpZy5fbG9jYWxlLl93ZWVrLmRvdztcbiAgICAgICAgZG95ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG95O1xuXG4gICAgICAgIHZhciBjdXJXZWVrID0gd2Vla09mWWVhcihjcmVhdGVMb2NhbCgpLCBkb3csIGRveSk7XG5cbiAgICAgICAgd2Vla1llYXIgPSBkZWZhdWx0cyh3LmdnLCBjb25maWcuX2FbWUVBUl0sIGN1cldlZWsueWVhcik7XG5cbiAgICAgICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IHdlZWsuXG4gICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LncsIGN1cldlZWsud2Vlayk7XG5cbiAgICAgICAgaWYgKHcuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyB3ZWVrZGF5IC0tIGxvdyBkYXkgbnVtYmVycyBhcmUgY29uc2lkZXJlZCBuZXh0IHdlZWtcbiAgICAgICAgICAgIHdlZWtkYXkgPSB3LmQ7XG4gICAgICAgICAgICBpZiAod2Vla2RheSA8IDAgfHwgd2Vla2RheSA+IDYpIHtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5T3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHcuZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBsb2NhbCB3ZWVrZGF5IC0tIGNvdW50aW5nIHN0YXJ0cyBmcm9tIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgIHdlZWtkYXkgPSB3LmUgKyBkb3c7XG4gICAgICAgICAgICBpZiAody5lIDwgMCB8fCB3LmUgPiA2KSB7XG4gICAgICAgICAgICAgICAgd2Vla2RheU92ZXJmbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgd2Vla2RheSA9IGRvdztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAod2VlayA8IDEgfHwgd2VlayA+IHdlZWtzSW5ZZWFyKHdlZWtZZWFyLCBkb3csIGRveSkpIHtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuX292ZXJmbG93V2Vla3MgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAod2Vla2RheU92ZXJmbG93ICE9IG51bGwpIHtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuX292ZXJmbG93V2Vla2RheSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGVtcCA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpO1xuICAgICAgICBjb25maWcuX2FbWUVBUl0gPSB0ZW1wLnllYXI7XG4gICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdGVtcC5kYXlPZlllYXI7XG4gICAgfVxufVxuXG4vLyBpc28gODYwMSByZWdleFxuLy8gMDAwMC0wMC0wMCAwMDAwLVcwMCBvciAwMDAwLVcwMC0wICsgVCArIDAwIG9yIDAwOjAwIG9yIDAwOjAwOjAwIG9yIDAwOjAwOjAwLjAwMCArICswMDowMCBvciArMDAwMCBvciArMDApXG52YXIgZXh0ZW5kZWRJc29SZWdleCA9IC9eXFxzKigoPzpbKy1dXFxkezZ9fFxcZHs0fSktKD86XFxkXFxkLVxcZFxcZHxXXFxkXFxkLVxcZHxXXFxkXFxkfFxcZFxcZFxcZHxcXGRcXGQpKSg/OihUfCApKFxcZFxcZCg/OjpcXGRcXGQoPzo6XFxkXFxkKD86Wy4sXVxcZCspPyk/KT8pKFtcXCtcXC1dXFxkXFxkKD86Oj9cXGRcXGQpP3xcXHMqWik/KT8kLztcbnZhciBiYXNpY0lzb1JlZ2V4ID0gL15cXHMqKCg/OlsrLV1cXGR7Nn18XFxkezR9KSg/OlxcZFxcZFxcZFxcZHxXXFxkXFxkXFxkfFdcXGRcXGR8XFxkXFxkXFxkfFxcZFxcZCkpKD86KFR8ICkoXFxkXFxkKD86XFxkXFxkKD86XFxkXFxkKD86Wy4sXVxcZCspPyk/KT8pKFtcXCtcXC1dXFxkXFxkKD86Oj9cXGRcXGQpP3xcXHMqWik/KT8kLztcblxudmFyIHR6UmVnZXggPSAvWnxbKy1dXFxkXFxkKD86Oj9cXGRcXGQpPy87XG5cbnZhciBpc29EYXRlcyA9IFtcbiAgICBbJ1lZWVlZWS1NTS1ERCcsIC9bKy1dXFxkezZ9LVxcZFxcZC1cXGRcXGQvXSxcbiAgICBbJ1lZWVktTU0tREQnLCAvXFxkezR9LVxcZFxcZC1cXGRcXGQvXSxcbiAgICBbJ0dHR0ctW1ddV1ctRScsIC9cXGR7NH0tV1xcZFxcZC1cXGQvXSxcbiAgICBbJ0dHR0ctW1ddV1cnLCAvXFxkezR9LVdcXGRcXGQvLCBmYWxzZV0sXG4gICAgWydZWVlZLURERCcsIC9cXGR7NH0tXFxkezN9L10sXG4gICAgWydZWVlZLU1NJywgL1xcZHs0fS1cXGRcXGQvLCBmYWxzZV0sXG4gICAgWydZWVlZWVlNTUREJywgL1srLV1cXGR7MTB9L10sXG4gICAgWydZWVlZTU1ERCcsIC9cXGR7OH0vXSxcbiAgICAvLyBZWVlZTU0gaXMgTk9UIGFsbG93ZWQgYnkgdGhlIHN0YW5kYXJkXG4gICAgWydHR0dHW1ddV1dFJywgL1xcZHs0fVdcXGR7M30vXSxcbiAgICBbJ0dHR0dbV11XVycsIC9cXGR7NH1XXFxkezJ9LywgZmFsc2VdLFxuICAgIFsnWVlZWURERCcsIC9cXGR7N30vXVxuXTtcblxuLy8gaXNvIHRpbWUgZm9ybWF0cyBhbmQgcmVnZXhlc1xudmFyIGlzb1RpbWVzID0gW1xuICAgIFsnSEg6bW06c3MuU1NTUycsIC9cXGRcXGQ6XFxkXFxkOlxcZFxcZFxcLlxcZCsvXSxcbiAgICBbJ0hIOm1tOnNzLFNTU1MnLCAvXFxkXFxkOlxcZFxcZDpcXGRcXGQsXFxkKy9dLFxuICAgIFsnSEg6bW06c3MnLCAvXFxkXFxkOlxcZFxcZDpcXGRcXGQvXSxcbiAgICBbJ0hIOm1tJywgL1xcZFxcZDpcXGRcXGQvXSxcbiAgICBbJ0hIbW1zcy5TU1NTJywgL1xcZFxcZFxcZFxcZFxcZFxcZFxcLlxcZCsvXSxcbiAgICBbJ0hIbW1zcyxTU1NTJywgL1xcZFxcZFxcZFxcZFxcZFxcZCxcXGQrL10sXG4gICAgWydISG1tc3MnLCAvXFxkXFxkXFxkXFxkXFxkXFxkL10sXG4gICAgWydISG1tJywgL1xcZFxcZFxcZFxcZC9dLFxuICAgIFsnSEgnLCAvXFxkXFxkL11cbl07XG5cbnZhciBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKFxcLT9cXGQrKS9pO1xuXG4vLyBkYXRlIGZyb20gaXNvIGZvcm1hdFxuZnVuY3Rpb24gY29uZmlnRnJvbUlTTyhjb25maWcpIHtcbiAgICB2YXIgaSwgbCxcbiAgICAgICAgc3RyaW5nID0gY29uZmlnLl9pLFxuICAgICAgICBtYXRjaCA9IGV4dGVuZGVkSXNvUmVnZXguZXhlYyhzdHJpbmcpIHx8IGJhc2ljSXNvUmVnZXguZXhlYyhzdHJpbmcpLFxuICAgICAgICBhbGxvd1RpbWUsIGRhdGVGb3JtYXQsIHRpbWVGb3JtYXQsIHR6Rm9ybWF0O1xuXG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmlzbyA9IHRydWU7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb0RhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKGlzb0RhdGVzW2ldWzFdLmV4ZWMobWF0Y2hbMV0pKSB7XG4gICAgICAgICAgICAgICAgZGF0ZUZvcm1hdCA9IGlzb0RhdGVzW2ldWzBdO1xuICAgICAgICAgICAgICAgIGFsbG93VGltZSA9IGlzb0RhdGVzW2ldWzJdICE9PSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0ZUZvcm1hdCA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbM10pIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29UaW1lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvVGltZXNbaV1bMV0uZXhlYyhtYXRjaFszXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hbMl0gc2hvdWxkIGJlICdUJyBvciBzcGFjZVxuICAgICAgICAgICAgICAgICAgICB0aW1lRm9ybWF0ID0gKG1hdGNoWzJdIHx8ICcgJykgKyBpc29UaW1lc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRpbWVGb3JtYXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWFsbG93VGltZSAmJiB0aW1lRm9ybWF0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFs0XSkge1xuICAgICAgICAgICAgaWYgKHR6UmVnZXguZXhlYyhtYXRjaFs0XSkpIHtcbiAgICAgICAgICAgICAgICB0ekZvcm1hdCA9ICdaJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbmZpZy5fZiA9IGRhdGVGb3JtYXQgKyAodGltZUZvcm1hdCB8fCAnJykgKyAodHpGb3JtYXQgfHwgJycpO1xuICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgfVxufVxuXG4vLyBSRkMgMjgyMiByZWdleDogRm9yIGRldGFpbHMgc2VlIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMyODIyI3NlY3Rpb24tMy4zXG52YXIgcmZjMjgyMiA9IC9eKD86KE1vbnxUdWV8V2VkfFRodXxGcml8U2F0fFN1biksP1xccyk/KFxcZHsxLDJ9KVxccyhKYW58RmVifE1hcnxBcHJ8TWF5fEp1bnxKdWx8QXVnfFNlcHxPY3R8Tm92fERlYylcXHMoXFxkezIsNH0pXFxzKFxcZFxcZCk6KFxcZFxcZCkoPzo6KFxcZFxcZCkpP1xccyg/OihVVHxHTVR8W0VDTVBdW1NEXVQpfChbWnpdKXwoWystXVxcZHs0fSkpJC87XG5cbmZ1bmN0aW9uIGV4dHJhY3RGcm9tUkZDMjgyMlN0cmluZ3MoeWVhclN0ciwgbW9udGhTdHIsIGRheVN0ciwgaG91clN0ciwgbWludXRlU3RyLCBzZWNvbmRTdHIpIHtcbiAgICB2YXIgcmVzdWx0ID0gW1xuICAgICAgICB1bnRydW5jYXRlWWVhcih5ZWFyU3RyKSxcbiAgICAgICAgZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0LmluZGV4T2YobW9udGhTdHIpLFxuICAgICAgICBwYXJzZUludChkYXlTdHIsIDEwKSxcbiAgICAgICAgcGFyc2VJbnQoaG91clN0ciwgMTApLFxuICAgICAgICBwYXJzZUludChtaW51dGVTdHIsIDEwKVxuICAgIF07XG5cbiAgICBpZiAoc2Vjb25kU3RyKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHBhcnNlSW50KHNlY29uZFN0ciwgMTApKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB1bnRydW5jYXRlWWVhcih5ZWFyU3RyKSB7XG4gICAgdmFyIHllYXIgPSBwYXJzZUludCh5ZWFyU3RyLCAxMCk7XG4gICAgaWYgKHllYXIgPD0gNDkpIHtcbiAgICAgICAgcmV0dXJuIDIwMDAgKyB5ZWFyO1xuICAgIH0gZWxzZSBpZiAoeWVhciA8PSA5OTkpIHtcbiAgICAgICAgcmV0dXJuIDE5MDAgKyB5ZWFyO1xuICAgIH1cbiAgICByZXR1cm4geWVhcjtcbn1cblxuZnVuY3Rpb24gcHJlcHJvY2Vzc1JGQzI4MjIocykge1xuICAgIC8vIFJlbW92ZSBjb21tZW50cyBhbmQgZm9sZGluZyB3aGl0ZXNwYWNlIGFuZCByZXBsYWNlIG11bHRpcGxlLXNwYWNlcyB3aXRoIGEgc2luZ2xlIHNwYWNlXG4gICAgcmV0dXJuIHMucmVwbGFjZSgvXFwoW14pXSpcXCl8W1xcblxcdF0vZywgJyAnKS5yZXBsYWNlKC8oXFxzXFxzKykvZywgJyAnKS50cmltKCk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrV2Vla2RheSh3ZWVrZGF5U3RyLCBwYXJzZWRJbnB1dCwgY29uZmlnKSB7XG4gICAgaWYgKHdlZWtkYXlTdHIpIHtcbiAgICAgICAgLy8gVE9ETzogUmVwbGFjZSB0aGUgdmFuaWxsYSBKUyBEYXRlIG9iamVjdCB3aXRoIGFuIGluZGVwZW50ZW50IGRheS1vZi13ZWVrIGNoZWNrLlxuICAgICAgICB2YXIgd2Vla2RheVByb3ZpZGVkID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQuaW5kZXhPZih3ZWVrZGF5U3RyKSxcbiAgICAgICAgICAgIHdlZWtkYXlBY3R1YWwgPSBuZXcgRGF0ZShwYXJzZWRJbnB1dFswXSwgcGFyc2VkSW5wdXRbMV0sIHBhcnNlZElucHV0WzJdKS5nZXREYXkoKTtcbiAgICAgICAgaWYgKHdlZWtkYXlQcm92aWRlZCAhPT0gd2Vla2RheUFjdHVhbCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykud2Vla2RheU1pc21hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG52YXIgb2JzT2Zmc2V0cyA9IHtcbiAgICBVVDogMCxcbiAgICBHTVQ6IDAsXG4gICAgRURUOiAtNCAqIDYwLFxuICAgIEVTVDogLTUgKiA2MCxcbiAgICBDRFQ6IC01ICogNjAsXG4gICAgQ1NUOiAtNiAqIDYwLFxuICAgIE1EVDogLTYgKiA2MCxcbiAgICBNU1Q6IC03ICogNjAsXG4gICAgUERUOiAtNyAqIDYwLFxuICAgIFBTVDogLTggKiA2MFxufTtcblxuZnVuY3Rpb24gY2FsY3VsYXRlT2Zmc2V0KG9ic09mZnNldCwgbWlsaXRhcnlPZmZzZXQsIG51bU9mZnNldCkge1xuICAgIGlmIChvYnNPZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIG9ic09mZnNldHNbb2JzT2Zmc2V0XTtcbiAgICB9IGVsc2UgaWYgKG1pbGl0YXJ5T2Zmc2V0KSB7XG4gICAgICAgIC8vIHRoZSBvbmx5IGFsbG93ZWQgbWlsaXRhcnkgdHogaXMgWlxuICAgICAgICByZXR1cm4gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaG0gPSBwYXJzZUludChudW1PZmZzZXQsIDEwKTtcbiAgICAgICAgdmFyIG0gPSBobSAlIDEwMCwgaCA9IChobSAtIG0pIC8gMTAwO1xuICAgICAgICByZXR1cm4gaCAqIDYwICsgbTtcbiAgICB9XG59XG5cbi8vIGRhdGUgYW5kIHRpbWUgZnJvbSByZWYgMjgyMiBmb3JtYXRcbmZ1bmN0aW9uIGNvbmZpZ0Zyb21SRkMyODIyKGNvbmZpZykge1xuICAgIHZhciBtYXRjaCA9IHJmYzI4MjIuZXhlYyhwcmVwcm9jZXNzUkZDMjgyMihjb25maWcuX2kpKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgdmFyIHBhcnNlZEFycmF5ID0gZXh0cmFjdEZyb21SRkMyODIyU3RyaW5ncyhtYXRjaFs0XSwgbWF0Y2hbM10sIG1hdGNoWzJdLCBtYXRjaFs1XSwgbWF0Y2hbNl0sIG1hdGNoWzddKTtcbiAgICAgICAgaWYgKCFjaGVja1dlZWtkYXkobWF0Y2hbMV0sIHBhcnNlZEFycmF5LCBjb25maWcpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2EgPSBwYXJzZWRBcnJheTtcbiAgICAgICAgY29uZmlnLl90em0gPSBjYWxjdWxhdGVPZmZzZXQobWF0Y2hbOF0sIG1hdGNoWzldLCBtYXRjaFsxMF0pO1xuXG4gICAgICAgIGNvbmZpZy5fZCA9IGNyZWF0ZVVUQ0RhdGUuYXBwbHkobnVsbCwgY29uZmlnLl9hKTtcbiAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSAtIGNvbmZpZy5fdHptKTtcblxuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5yZmMyODIyID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICB9XG59XG5cbi8vIGRhdGUgZnJvbSBpc28gZm9ybWF0IG9yIGZhbGxiYWNrXG5mdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nKGNvbmZpZykge1xuICAgIHZhciBtYXRjaGVkID0gYXNwTmV0SnNvblJlZ2V4LmV4ZWMoY29uZmlnLl9pKTtcblxuICAgIGlmIChtYXRjaGVkICE9PSBudWxsKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCttYXRjaGVkWzFdKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbmZpZ0Zyb21JU08oY29uZmlnKTtcbiAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICBkZWxldGUgY29uZmlnLl9pc1ZhbGlkO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25maWdGcm9tUkZDMjgyMihjb25maWcpO1xuICAgIGlmIChjb25maWcuX2lzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGRlbGV0ZSBjb25maWcuX2lzVmFsaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEZpbmFsIGF0dGVtcHQsIHVzZSBJbnB1dCBGYWxsYmFja1xuICAgIGhvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG59XG5cbmhvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrID0gZGVwcmVjYXRlKFxuICAgICd2YWx1ZSBwcm92aWRlZCBpcyBub3QgaW4gYSByZWNvZ25pemVkIFJGQzI4MjIgb3IgSVNPIGZvcm1hdC4gbW9tZW50IGNvbnN0cnVjdGlvbiBmYWxscyBiYWNrIHRvIGpzIERhdGUoKSwgJyArXG4gICAgJ3doaWNoIGlzIG5vdCByZWxpYWJsZSBhY3Jvc3MgYWxsIGJyb3dzZXJzIGFuZCB2ZXJzaW9ucy4gTm9uIFJGQzI4MjIvSVNPIGRhdGUgZm9ybWF0cyBhcmUgJyArXG4gICAgJ2Rpc2NvdXJhZ2VkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gYW4gdXBjb21pbmcgbWFqb3IgcmVsZWFzZS4gUGxlYXNlIHJlZmVyIHRvICcgK1xuICAgICdodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL2pzLWRhdGUvIGZvciBtb3JlIGluZm8uJyxcbiAgICBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5faSArIChjb25maWcuX3VzZVVUQyA/ICcgVVRDJyA6ICcnKSk7XG4gICAgfVxuKTtcblxuLy8gY29uc3RhbnQgdGhhdCByZWZlcnMgdG8gdGhlIElTTyBzdGFuZGFyZFxuaG9va3MuSVNPXzg2MDEgPSBmdW5jdGlvbiAoKSB7fTtcblxuLy8gY29uc3RhbnQgdGhhdCByZWZlcnMgdG8gdGhlIFJGQyAyODIyIGZvcm1cbmhvb2tzLlJGQ18yODIyID0gZnVuY3Rpb24gKCkge307XG5cbi8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGZvcm1hdCBzdHJpbmdcbmZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKSB7XG4gICAgLy8gVE9ETzogTW92ZSB0aGlzIHRvIGFub3RoZXIgcGFydCBvZiB0aGUgY3JlYXRpb24gZmxvdyB0byBwcmV2ZW50IGNpcmN1bGFyIGRlcHNcbiAgICBpZiAoY29uZmlnLl9mID09PSBob29rcy5JU09fODYwMSkge1xuICAgICAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy5fZiA9PT0gaG9va3MuUkZDXzI4MjIpIHtcbiAgICAgICAgY29uZmlnRnJvbVJGQzI4MjIoY29uZmlnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25maWcuX2EgPSBbXTtcbiAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5lbXB0eSA9IHRydWU7XG5cbiAgICAvLyBUaGlzIGFycmF5IGlzIHVzZWQgdG8gbWFrZSBhIERhdGUsIGVpdGhlciB3aXRoIGBuZXcgRGF0ZWAgb3IgYERhdGUuVVRDYFxuICAgIHZhciBzdHJpbmcgPSAnJyArIGNvbmZpZy5faSxcbiAgICAgICAgaSwgcGFyc2VkSW5wdXQsIHRva2VucywgdG9rZW4sIHNraXBwZWQsXG4gICAgICAgIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG4gICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggPSAwO1xuXG4gICAgdG9rZW5zID0gZXhwYW5kRm9ybWF0KGNvbmZpZy5fZiwgY29uZmlnLl9sb2NhbGUpLm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpIHx8IFtdO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgcGFyc2VkSW5wdXQgPSAoc3RyaW5nLm1hdGNoKGdldFBhcnNlUmVnZXhGb3JUb2tlbih0b2tlbiwgY29uZmlnKSkgfHwgW10pWzBdO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygndG9rZW4nLCB0b2tlbiwgJ3BhcnNlZElucHV0JywgcGFyc2VkSW5wdXQsXG4gICAgICAgIC8vICAgICAgICAgJ3JlZ2V4JywgZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKTtcbiAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICBza2lwcGVkID0gc3RyaW5nLnN1YnN0cigwLCBzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkpO1xuICAgICAgICAgICAgaWYgKHNraXBwZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZElucHV0LnB1c2goc2tpcHBlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2Uoc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpICsgcGFyc2VkSW5wdXQubGVuZ3RoKTtcbiAgICAgICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggKz0gcGFyc2VkSW5wdXQubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRvbid0IHBhcnNlIGlmIGl0J3Mgbm90IGEga25vd24gdG9rZW5cbiAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSkge1xuICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBwYXJzZWRJbnB1dCwgY29uZmlnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb25maWcuX3N0cmljdCAmJiAhcGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFkZCByZW1haW5pbmcgdW5wYXJzZWQgaW5wdXQgbGVuZ3RoIHRvIHRoZSBzdHJpbmdcbiAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5jaGFyc0xlZnRPdmVyID0gc3RyaW5nTGVuZ3RoIC0gdG90YWxQYXJzZWRJbnB1dExlbmd0aDtcbiAgICBpZiAoc3RyaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkSW5wdXQucHVzaChzdHJpbmcpO1xuICAgIH1cblxuICAgIC8vIGNsZWFyIF8xMmggZmxhZyBpZiBob3VyIGlzIDw9IDEyXG4gICAgaWYgKGNvbmZpZy5fYVtIT1VSXSA8PSAxMiAmJlxuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID09PSB0cnVlICYmXG4gICAgICAgIGNvbmZpZy5fYVtIT1VSXSA+IDApIHtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5wYXJzZWREYXRlUGFydHMgPSBjb25maWcuX2Euc2xpY2UoMCk7XG4gICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykubWVyaWRpZW0gPSBjb25maWcuX21lcmlkaWVtO1xuICAgIC8vIGhhbmRsZSBtZXJpZGllbVxuICAgIGNvbmZpZy5fYVtIT1VSXSA9IG1lcmlkaWVtRml4V3JhcChjb25maWcuX2xvY2FsZSwgY29uZmlnLl9hW0hPVVJdLCBjb25maWcuX21lcmlkaWVtKTtcblxuICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbn1cblxuXG5mdW5jdGlvbiBtZXJpZGllbUZpeFdyYXAgKGxvY2FsZSwgaG91ciwgbWVyaWRpZW0pIHtcbiAgICB2YXIgaXNQbTtcblxuICAgIGlmIChtZXJpZGllbSA9PSBudWxsKSB7XG4gICAgICAgIC8vIG5vdGhpbmcgdG8gZG9cbiAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgfVxuICAgIGlmIChsb2NhbGUubWVyaWRpZW1Ib3VyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5tZXJpZGllbUhvdXIoaG91ciwgbWVyaWRpZW0pO1xuICAgIH0gZWxzZSBpZiAobG9jYWxlLmlzUE0gIT0gbnVsbCkge1xuICAgICAgICAvLyBGYWxsYmFja1xuICAgICAgICBpc1BtID0gbG9jYWxlLmlzUE0obWVyaWRpZW0pO1xuICAgICAgICBpZiAoaXNQbSAmJiBob3VyIDwgMTIpIHtcbiAgICAgICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1BtICYmIGhvdXIgPT09IDEyKSB7XG4gICAgICAgICAgICBob3VyID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaG91cjtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0aGlzIGlzIG5vdCBzdXBwb3NlZCB0byBoYXBwZW5cbiAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgfVxufVxuXG4vLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBhcnJheSBvZiBmb3JtYXQgc3RyaW5nc1xuZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZykge1xuICAgIHZhciB0ZW1wQ29uZmlnLFxuICAgICAgICBiZXN0TW9tZW50LFxuXG4gICAgICAgIHNjb3JlVG9CZWF0LFxuICAgICAgICBpLFxuICAgICAgICBjdXJyZW50U2NvcmU7XG5cbiAgICBpZiAoY29uZmlnLl9mLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkRm9ybWF0ID0gdHJ1ZTtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoTmFOKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBjb25maWcuX2YubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY3VycmVudFNjb3JlID0gMDtcbiAgICAgICAgdGVtcENvbmZpZyA9IGNvcHlDb25maWcoe30sIGNvbmZpZyk7XG4gICAgICAgIGlmIChjb25maWcuX3VzZVVUQyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0ZW1wQ29uZmlnLl91c2VVVEMgPSBjb25maWcuX3VzZVVUQztcbiAgICAgICAgfVxuICAgICAgICB0ZW1wQ29uZmlnLl9mID0gY29uZmlnLl9mW2ldO1xuICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KHRlbXBDb25maWcpO1xuXG4gICAgICAgIGlmICghaXNWYWxpZCh0ZW1wQ29uZmlnKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBhbnkgaW5wdXQgdGhhdCB3YXMgbm90IHBhcnNlZCBhZGQgYSBwZW5hbHR5IGZvciB0aGF0IGZvcm1hdFxuICAgICAgICBjdXJyZW50U2NvcmUgKz0gZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLmNoYXJzTGVmdE92ZXI7XG5cbiAgICAgICAgLy9vciB0b2tlbnNcbiAgICAgICAgY3VycmVudFNjb3JlICs9IGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS51bnVzZWRUb2tlbnMubGVuZ3RoICogMTA7XG5cbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLnNjb3JlID0gY3VycmVudFNjb3JlO1xuXG4gICAgICAgIGlmIChzY29yZVRvQmVhdCA9PSBudWxsIHx8IGN1cnJlbnRTY29yZSA8IHNjb3JlVG9CZWF0KSB7XG4gICAgICAgICAgICBzY29yZVRvQmVhdCA9IGN1cnJlbnRTY29yZTtcbiAgICAgICAgICAgIGJlc3RNb21lbnQgPSB0ZW1wQ29uZmlnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXh0ZW5kKGNvbmZpZywgYmVzdE1vbWVudCB8fCB0ZW1wQ29uZmlnKTtcbn1cblxuZnVuY3Rpb24gY29uZmlnRnJvbU9iamVjdChjb25maWcpIHtcbiAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaSA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGNvbmZpZy5faSk7XG4gICAgY29uZmlnLl9hID0gbWFwKFtpLnllYXIsIGkubW9udGgsIGkuZGF5IHx8IGkuZGF0ZSwgaS5ob3VyLCBpLm1pbnV0ZSwgaS5zZWNvbmQsIGkubWlsbGlzZWNvbmRdLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogJiYgcGFyc2VJbnQob2JqLCAxMCk7XG4gICAgfSk7XG5cbiAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRnJvbUNvbmZpZyAoY29uZmlnKSB7XG4gICAgdmFyIHJlcyA9IG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhwcmVwYXJlQ29uZmlnKGNvbmZpZykpKTtcbiAgICBpZiAocmVzLl9uZXh0RGF5KSB7XG4gICAgICAgIC8vIEFkZGluZyBpcyBzbWFydCBlbm91Z2ggYXJvdW5kIERTVFxuICAgICAgICByZXMuYWRkKDEsICdkJyk7XG4gICAgICAgIHJlcy5fbmV4dERheSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlQ29uZmlnIChjb25maWcpIHtcbiAgICB2YXIgaW5wdXQgPSBjb25maWcuX2ksXG4gICAgICAgIGZvcm1hdCA9IGNvbmZpZy5fZjtcblxuICAgIGNvbmZpZy5fbG9jYWxlID0gY29uZmlnLl9sb2NhbGUgfHwgZ2V0TG9jYWxlKGNvbmZpZy5fbCk7XG5cbiAgICBpZiAoaW5wdXQgPT09IG51bGwgfHwgKGZvcm1hdCA9PT0gdW5kZWZpbmVkICYmIGlucHV0ID09PSAnJykpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUludmFsaWQoe251bGxJbnB1dDogdHJ1ZX0pO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbmZpZy5faSA9IGlucHV0ID0gY29uZmlnLl9sb2NhbGUucHJlcGFyc2UoaW5wdXQpO1xuICAgIH1cblxuICAgIGlmIChpc01vbWVudChpbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhpbnB1dCkpO1xuICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICBjb25maWcuX2QgPSBpbnB1dDtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkoZm9ybWF0KSkge1xuICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKTtcbiAgICB9IGVsc2UgaWYgKGZvcm1hdCkge1xuICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgfSAgZWxzZSB7XG4gICAgICAgIGNvbmZpZ0Zyb21JbnB1dChjb25maWcpO1xuICAgIH1cblxuICAgIGlmICghaXNWYWxpZChjb25maWcpKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbmZpZztcbn1cblxuZnVuY3Rpb24gY29uZmlnRnJvbUlucHV0KGNvbmZpZykge1xuICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faTtcbiAgICBpZiAoaXNVbmRlZmluZWQoaW5wdXQpKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGhvb2tzLm5vdygpKTtcbiAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQudmFsdWVPZigpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uZmlnRnJvbVN0cmluZyhjb25maWcpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICAgICAgY29uZmlnLl9hID0gbWFwKGlucHV0LnNsaWNlKDApLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQob2JqLCAxMCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGlucHV0KSkge1xuICAgICAgICBjb25maWdGcm9tT2JqZWN0KGNvbmZpZyk7XG4gICAgfSBlbHNlIGlmIChpc051bWJlcihpbnB1dCkpIHtcbiAgICAgICAgLy8gZnJvbSBtaWxsaXNlY29uZHNcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGhvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVMb2NhbE9yVVRDIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgaXNVVEMpIHtcbiAgICB2YXIgYyA9IHt9O1xuXG4gICAgaWYgKGxvY2FsZSA9PT0gdHJ1ZSB8fCBsb2NhbGUgPT09IGZhbHNlKSB7XG4gICAgICAgIHN0cmljdCA9IGxvY2FsZTtcbiAgICAgICAgbG9jYWxlID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICgoaXNPYmplY3QoaW5wdXQpICYmIGlzT2JqZWN0RW1wdHkoaW5wdXQpKSB8fFxuICAgICAgICAgICAgKGlzQXJyYXkoaW5wdXQpICYmIGlucHV0Lmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgaW5wdXQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDIzXG4gICAgYy5faXNBTW9tZW50T2JqZWN0ID0gdHJ1ZTtcbiAgICBjLl91c2VVVEMgPSBjLl9pc1VUQyA9IGlzVVRDO1xuICAgIGMuX2wgPSBsb2NhbGU7XG4gICAgYy5faSA9IGlucHV0O1xuICAgIGMuX2YgPSBmb3JtYXQ7XG4gICAgYy5fc3RyaWN0ID0gc3RyaWN0O1xuXG4gICAgcmV0dXJuIGNyZWF0ZUZyb21Db25maWcoYyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxvY2FsIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgIHJldHVybiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBmYWxzZSk7XG59XG5cbnZhciBwcm90b3R5cGVNaW4gPSBkZXByZWNhdGUoXG4gICAgJ21vbWVudCgpLm1pbiBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1heCBpbnN0ZWFkLiBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL21pbi1tYXgvJyxcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvdGhlciA9IGNyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSAmJiBvdGhlci5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvdGhlciA8IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlSW52YWxpZCgpO1xuICAgICAgICB9XG4gICAgfVxuKTtcblxudmFyIHByb3RvdHlwZU1heCA9IGRlcHJlY2F0ZShcbiAgICAnbW9tZW50KCkubWF4IGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWluIGluc3RlYWQuIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvbWluLW1heC8nLFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpICYmIG90aGVyLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG90aGVyID4gdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVJbnZhbGlkKCk7XG4gICAgICAgIH1cbiAgICB9XG4pO1xuXG4vLyBQaWNrIGEgbW9tZW50IG0gZnJvbSBtb21lbnRzIHNvIHRoYXQgbVtmbl0ob3RoZXIpIGlzIHRydWUgZm9yIGFsbFxuLy8gb3RoZXIuIFRoaXMgcmVsaWVzIG9uIHRoZSBmdW5jdGlvbiBmbiB0byBiZSB0cmFuc2l0aXZlLlxuLy9cbi8vIG1vbWVudHMgc2hvdWxkIGVpdGhlciBiZSBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cyBvciBhbiBhcnJheSwgd2hvc2Vcbi8vIGZpcnN0IGVsZW1lbnQgaXMgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMuXG5mdW5jdGlvbiBwaWNrQnkoZm4sIG1vbWVudHMpIHtcbiAgICB2YXIgcmVzLCBpO1xuICAgIGlmIChtb21lbnRzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KG1vbWVudHNbMF0pKSB7XG4gICAgICAgIG1vbWVudHMgPSBtb21lbnRzWzBdO1xuICAgIH1cbiAgICBpZiAoIW1vbWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbCgpO1xuICAgIH1cbiAgICByZXMgPSBtb21lbnRzWzBdO1xuICAgIGZvciAoaSA9IDE7IGkgPCBtb21lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmICghbW9tZW50c1tpXS5pc1ZhbGlkKCkgfHwgbW9tZW50c1tpXVtmbl0ocmVzKSkge1xuICAgICAgICAgICAgcmVzID0gbW9tZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBUT0RPOiBVc2UgW10uc29ydCBpbnN0ZWFkP1xuZnVuY3Rpb24gbWluICgpIHtcbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgIHJldHVybiBwaWNrQnkoJ2lzQmVmb3JlJywgYXJncyk7XG59XG5cbmZ1bmN0aW9uIG1heCAoKSB7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICByZXR1cm4gcGlja0J5KCdpc0FmdGVyJywgYXJncyk7XG59XG5cbnZhciBub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIERhdGUubm93ID8gRGF0ZS5ub3coKSA6ICsobmV3IERhdGUoKSk7XG59O1xuXG52YXIgb3JkZXJpbmcgPSBbJ3llYXInLCAncXVhcnRlcicsICdtb250aCcsICd3ZWVrJywgJ2RheScsICdob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnLCAnbWlsbGlzZWNvbmQnXTtcblxuZnVuY3Rpb24gaXNEdXJhdGlvblZhbGlkKG0pIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gbSkge1xuICAgICAgICBpZiAoIShpbmRleE9mLmNhbGwob3JkZXJpbmcsIGtleSkgIT09IC0xICYmIChtW2tleV0gPT0gbnVsbCB8fCAhaXNOYU4obVtrZXldKSkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdW5pdEhhc0RlY2ltYWwgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9yZGVyaW5nLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmIChtW29yZGVyaW5nW2ldXSkge1xuICAgICAgICAgICAgaWYgKHVuaXRIYXNEZWNpbWFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBvbmx5IGFsbG93IG5vbi1pbnRlZ2VycyBmb3Igc21hbGxlc3QgdW5pdFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQobVtvcmRlcmluZ1tpXV0pICE9PSB0b0ludChtW29yZGVyaW5nW2ldXSkpIHtcbiAgICAgICAgICAgICAgICB1bml0SGFzRGVjaW1hbCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZCQxKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1ZhbGlkO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJbnZhbGlkJDEoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUR1cmF0aW9uKE5hTik7XG59XG5cbmZ1bmN0aW9uIER1cmF0aW9uIChkdXJhdGlvbikge1xuICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSBub3JtYWxpemVPYmplY3RVbml0cyhkdXJhdGlvbiksXG4gICAgICAgIHllYXJzID0gbm9ybWFsaXplZElucHV0LnllYXIgfHwgMCxcbiAgICAgICAgcXVhcnRlcnMgPSBub3JtYWxpemVkSW5wdXQucXVhcnRlciB8fCAwLFxuICAgICAgICBtb250aHMgPSBub3JtYWxpemVkSW5wdXQubW9udGggfHwgMCxcbiAgICAgICAgd2Vla3MgPSBub3JtYWxpemVkSW5wdXQud2VlayB8fCAwLFxuICAgICAgICBkYXlzID0gbm9ybWFsaXplZElucHV0LmRheSB8fCAwLFxuICAgICAgICBob3VycyA9IG5vcm1hbGl6ZWRJbnB1dC5ob3VyIHx8IDAsXG4gICAgICAgIG1pbnV0ZXMgPSBub3JtYWxpemVkSW5wdXQubWludXRlIHx8IDAsXG4gICAgICAgIHNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQuc2Vjb25kIHx8IDAsXG4gICAgICAgIG1pbGxpc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5taWxsaXNlY29uZCB8fCAwO1xuXG4gICAgdGhpcy5faXNWYWxpZCA9IGlzRHVyYXRpb25WYWxpZChub3JtYWxpemVkSW5wdXQpO1xuXG4gICAgLy8gcmVwcmVzZW50YXRpb24gZm9yIGRhdGVBZGRSZW1vdmVcbiAgICB0aGlzLl9taWxsaXNlY29uZHMgPSArbWlsbGlzZWNvbmRzICtcbiAgICAgICAgc2Vjb25kcyAqIDFlMyArIC8vIDEwMDBcbiAgICAgICAgbWludXRlcyAqIDZlNCArIC8vIDEwMDAgKiA2MFxuICAgICAgICBob3VycyAqIDEwMDAgKiA2MCAqIDYwOyAvL3VzaW5nIDEwMDAgKiA2MCAqIDYwIGluc3RlYWQgb2YgMzZlNSB0byBhdm9pZCBmbG9hdGluZyBwb2ludCByb3VuZGluZyBlcnJvcnMgaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzI5NzhcbiAgICAvLyBCZWNhdXNlIG9mIGRhdGVBZGRSZW1vdmUgdHJlYXRzIDI0IGhvdXJzIGFzIGRpZmZlcmVudCBmcm9tIGFcbiAgICAvLyBkYXkgd2hlbiB3b3JraW5nIGFyb3VuZCBEU1QsIHdlIG5lZWQgdG8gc3RvcmUgdGhlbSBzZXBhcmF0ZWx5XG4gICAgdGhpcy5fZGF5cyA9ICtkYXlzICtcbiAgICAgICAgd2Vla3MgKiA3O1xuICAgIC8vIEl0IGlzIGltcG9zc2libGUgdG8gdHJhbnNsYXRlIG1vbnRocyBpbnRvIGRheXMgd2l0aG91dCBrbm93aW5nXG4gICAgLy8gd2hpY2ggbW9udGhzIHlvdSBhcmUgYXJlIHRhbGtpbmcgYWJvdXQsIHNvIHdlIGhhdmUgdG8gc3RvcmVcbiAgICAvLyBpdCBzZXBhcmF0ZWx5LlxuICAgIHRoaXMuX21vbnRocyA9ICttb250aHMgK1xuICAgICAgICBxdWFydGVycyAqIDMgK1xuICAgICAgICB5ZWFycyAqIDEyO1xuXG4gICAgdGhpcy5fZGF0YSA9IHt9O1xuXG4gICAgdGhpcy5fbG9jYWxlID0gZ2V0TG9jYWxlKCk7XG5cbiAgICB0aGlzLl9idWJibGUoKTtcbn1cblxuZnVuY3Rpb24gaXNEdXJhdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIER1cmF0aW9uO1xufVxuXG5mdW5jdGlvbiBhYnNSb3VuZCAobnVtYmVyKSB7XG4gICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoLTEgKiBudW1iZXIpICogLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQobnVtYmVyKTtcbiAgICB9XG59XG5cbi8vIEZPUk1BVFRJTkdcblxuZnVuY3Rpb24gb2Zmc2V0ICh0b2tlbiwgc2VwYXJhdG9yKSB7XG4gICAgYWRkRm9ybWF0VG9rZW4odG9rZW4sIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudXRjT2Zmc2V0KCk7XG4gICAgICAgIHZhciBzaWduID0gJysnO1xuICAgICAgICBpZiAob2Zmc2V0IDwgMCkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gLW9mZnNldDtcbiAgICAgICAgICAgIHNpZ24gPSAnLSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNpZ24gKyB6ZXJvRmlsbCh+fihvZmZzZXQgLyA2MCksIDIpICsgc2VwYXJhdG9yICsgemVyb0ZpbGwofn4ob2Zmc2V0KSAlIDYwLCAyKTtcbiAgICB9KTtcbn1cblxub2Zmc2V0KCdaJywgJzonKTtcbm9mZnNldCgnWlonLCAnJyk7XG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbignWicsICBtYXRjaFNob3J0T2Zmc2V0KTtcbmFkZFJlZ2V4VG9rZW4oJ1paJywgbWF0Y2hTaG9ydE9mZnNldCk7XG5hZGRQYXJzZVRva2VuKFsnWicsICdaWiddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICBjb25maWcuX3VzZVVUQyA9IHRydWU7XG4gICAgY29uZmlnLl90em0gPSBvZmZzZXRGcm9tU3RyaW5nKG1hdGNoU2hvcnRPZmZzZXQsIGlucHV0KTtcbn0pO1xuXG4vLyBIRUxQRVJTXG5cbi8vIHRpbWV6b25lIGNodW5rZXJcbi8vICcrMTA6MDAnID4gWycxMCcsICAnMDAnXVxuLy8gJy0xNTMwJyAgPiBbJy0xNScsICczMCddXG52YXIgY2h1bmtPZmZzZXQgPSAvKFtcXCtcXC1dfFxcZFxcZCkvZ2k7XG5cbmZ1bmN0aW9uIG9mZnNldEZyb21TdHJpbmcobWF0Y2hlciwgc3RyaW5nKSB7XG4gICAgdmFyIG1hdGNoZXMgPSAoc3RyaW5nIHx8ICcnKS5tYXRjaChtYXRjaGVyKTtcblxuICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBjaHVuayAgID0gbWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdIHx8IFtdO1xuICAgIHZhciBwYXJ0cyAgID0gKGNodW5rICsgJycpLm1hdGNoKGNodW5rT2Zmc2V0KSB8fCBbJy0nLCAwLCAwXTtcbiAgICB2YXIgbWludXRlcyA9ICsocGFydHNbMV0gKiA2MCkgKyB0b0ludChwYXJ0c1syXSk7XG5cbiAgICByZXR1cm4gbWludXRlcyA9PT0gMCA/XG4gICAgICAwIDpcbiAgICAgIHBhcnRzWzBdID09PSAnKycgPyBtaW51dGVzIDogLW1pbnV0ZXM7XG59XG5cbi8vIFJldHVybiBhIG1vbWVudCBmcm9tIGlucHV0LCB0aGF0IGlzIGxvY2FsL3V0Yy96b25lIGVxdWl2YWxlbnQgdG8gbW9kZWwuXG5mdW5jdGlvbiBjbG9uZVdpdGhPZmZzZXQoaW5wdXQsIG1vZGVsKSB7XG4gICAgdmFyIHJlcywgZGlmZjtcbiAgICBpZiAobW9kZWwuX2lzVVRDKSB7XG4gICAgICAgIHJlcyA9IG1vZGVsLmNsb25lKCk7XG4gICAgICAgIGRpZmYgPSAoaXNNb21lbnQoaW5wdXQpIHx8IGlzRGF0ZShpbnB1dCkgPyBpbnB1dC52YWx1ZU9mKCkgOiBjcmVhdGVMb2NhbChpbnB1dCkudmFsdWVPZigpKSAtIHJlcy52YWx1ZU9mKCk7XG4gICAgICAgIC8vIFVzZSBsb3ctbGV2ZWwgYXBpLCBiZWNhdXNlIHRoaXMgZm4gaXMgbG93LWxldmVsIGFwaS5cbiAgICAgICAgcmVzLl9kLnNldFRpbWUocmVzLl9kLnZhbHVlT2YoKSArIGRpZmYpO1xuICAgICAgICBob29rcy51cGRhdGVPZmZzZXQocmVzLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsKGlucHV0KS5sb2NhbCgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGF0ZU9mZnNldCAobSkge1xuICAgIC8vIE9uIEZpcmVmb3guMjQgRGF0ZSNnZXRUaW1lem9uZU9mZnNldCByZXR1cm5zIGEgZmxvYXRpbmcgcG9pbnQuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvcHVsbC8xODcxXG4gICAgcmV0dXJuIC1NYXRoLnJvdW5kKG0uX2QuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDE1KSAqIDE1O1xufVxuXG4vLyBIT09LU1xuXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIGEgbW9tZW50IGlzIG11dGF0ZWQuXG4vLyBJdCBpcyBpbnRlbmRlZCB0byBrZWVwIHRoZSBvZmZzZXQgaW4gc3luYyB3aXRoIHRoZSB0aW1lem9uZS5cbmhvb2tzLnVwZGF0ZU9mZnNldCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4vLyBNT01FTlRTXG5cbi8vIGtlZXBMb2NhbFRpbWUgPSB0cnVlIG1lYW5zIG9ubHkgY2hhbmdlIHRoZSB0aW1lem9uZSwgd2l0aG91dFxuLy8gYWZmZWN0aW5nIHRoZSBsb2NhbCBob3VyLiBTbyA1OjMxOjI2ICswMzAwIC0tW3V0Y09mZnNldCgyLCB0cnVlKV0tLT5cbi8vIDU6MzE6MjYgKzAyMDAgSXQgaXMgcG9zc2libGUgdGhhdCA1OjMxOjI2IGRvZXNuJ3QgZXhpc3Qgd2l0aCBvZmZzZXRcbi8vICswMjAwLCBzbyB3ZSBhZGp1c3QgdGhlIHRpbWUgYXMgbmVlZGVkLCB0byBiZSB2YWxpZC5cbi8vXG4vLyBLZWVwaW5nIHRoZSB0aW1lIGFjdHVhbGx5IGFkZHMvc3VidHJhY3RzIChvbmUgaG91cilcbi8vIGZyb20gdGhlIGFjdHVhbCByZXByZXNlbnRlZCB0aW1lLiBUaGF0IGlzIHdoeSB3ZSBjYWxsIHVwZGF0ZU9mZnNldFxuLy8gYSBzZWNvbmQgdGltZS4gSW4gY2FzZSBpdCB3YW50cyB1cyB0byBjaGFuZ2UgdGhlIG9mZnNldCBhZ2FpblxuLy8gX2NoYW5nZUluUHJvZ3Jlc3MgPT0gdHJ1ZSBjYXNlLCB0aGVuIHdlIGhhdmUgdG8gYWRqdXN0LCBiZWNhdXNlXG4vLyB0aGVyZSBpcyBubyBzdWNoIHRpbWUgaW4gdGhlIGdpdmVuIHRpbWV6b25lLlxuZnVuY3Rpb24gZ2V0U2V0T2Zmc2V0IChpbnB1dCwga2VlcExvY2FsVGltZSwga2VlcE1pbnV0ZXMpIHtcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fb2Zmc2V0IHx8IDAsXG4gICAgICAgIGxvY2FsQWRqdXN0O1xuICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgIH1cbiAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaW5wdXQgPSBvZmZzZXRGcm9tU3RyaW5nKG1hdGNoU2hvcnRPZmZzZXQsIGlucHV0KTtcbiAgICAgICAgICAgIGlmIChpbnB1dCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGlucHV0KSA8IDE2ICYmICFrZWVwTWludXRlcykge1xuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dCAqIDYwO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5faXNVVEMgJiYga2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgbG9jYWxBZGp1c3QgPSBnZXREYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX29mZnNldCA9IGlucHV0O1xuICAgICAgICB0aGlzLl9pc1VUQyA9IHRydWU7XG4gICAgICAgIGlmIChsb2NhbEFkanVzdCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmFkZChsb2NhbEFkanVzdCwgJ20nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2Zmc2V0ICE9PSBpbnB1dCkge1xuICAgICAgICAgICAgaWYgKCFrZWVwTG9jYWxUaW1lIHx8IHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICBhZGRTdWJ0cmFjdCh0aGlzLCBjcmVhdGVEdXJhdGlvbihpbnB1dCAtIG9mZnNldCwgJ20nKSwgMSwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyBvZmZzZXQgOiBnZXREYXRlT2Zmc2V0KHRoaXMpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2V0Wm9uZSAoaW5wdXQsIGtlZXBMb2NhbFRpbWUpIHtcbiAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaW5wdXQgPSAtaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnV0Y09mZnNldChpbnB1dCwga2VlcExvY2FsVGltZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIC10aGlzLnV0Y09mZnNldCgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2V0T2Zmc2V0VG9VVEMgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICByZXR1cm4gdGhpcy51dGNPZmZzZXQoMCwga2VlcExvY2FsVGltZSk7XG59XG5cbmZ1bmN0aW9uIHNldE9mZnNldFRvTG9jYWwgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICBpZiAodGhpcy5faXNVVEMpIHtcbiAgICAgICAgdGhpcy51dGNPZmZzZXQoMCwga2VlcExvY2FsVGltZSk7XG4gICAgICAgIHRoaXMuX2lzVVRDID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgIHRoaXMuc3VidHJhY3QoZ2V0RGF0ZU9mZnNldCh0aGlzKSwgJ20nKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQgKCkge1xuICAgIGlmICh0aGlzLl90em0gIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnV0Y09mZnNldCh0aGlzLl90em0sIGZhbHNlLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLl9pID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgdFpvbmUgPSBvZmZzZXRGcm9tU3RyaW5nKG1hdGNoT2Zmc2V0LCB0aGlzLl9pKTtcbiAgICAgICAgaWYgKHRab25lICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KHRab25lKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KDAsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBoYXNBbGlnbmVkSG91ck9mZnNldCAoaW5wdXQpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaW5wdXQgPSBpbnB1dCA/IGNyZWF0ZUxvY2FsKGlucHV0KS51dGNPZmZzZXQoKSA6IDA7XG5cbiAgICByZXR1cm4gKHRoaXMudXRjT2Zmc2V0KCkgLSBpbnB1dCkgJSA2MCA9PT0gMDtcbn1cblxuZnVuY3Rpb24gaXNEYXlsaWdodFNhdmluZ1RpbWUgKCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoMCkudXRjT2Zmc2V0KCkgfHxcbiAgICAgICAgdGhpcy51dGNPZmZzZXQoKSA+IHRoaXMuY2xvbmUoKS5tb250aCg1KS51dGNPZmZzZXQoKVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lU2hpZnRlZCAoKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9pc0RTVFNoaWZ0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0RTVFNoaWZ0ZWQ7XG4gICAgfVxuXG4gICAgdmFyIGMgPSB7fTtcblxuICAgIGNvcHlDb25maWcoYywgdGhpcyk7XG4gICAgYyA9IHByZXBhcmVDb25maWcoYyk7XG5cbiAgICBpZiAoYy5fYSkge1xuICAgICAgICB2YXIgb3RoZXIgPSBjLl9pc1VUQyA/IGNyZWF0ZVVUQyhjLl9hKSA6IGNyZWF0ZUxvY2FsKGMuX2EpO1xuICAgICAgICB0aGlzLl9pc0RTVFNoaWZ0ZWQgPSB0aGlzLmlzVmFsaWQoKSAmJlxuICAgICAgICAgICAgY29tcGFyZUFycmF5cyhjLl9hLCBvdGhlci50b0FycmF5KCkpID4gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9pc0RTVFNoaWZ0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5faXNEU1RTaGlmdGVkO1xufVxuXG5mdW5jdGlvbiBpc0xvY2FsICgpIHtcbiAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyAhdGhpcy5faXNVVEMgOiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNVdGNPZmZzZXQgKCkge1xuICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMuX2lzVVRDIDogZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzVXRjICgpIHtcbiAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzLl9pc1VUQyAmJiB0aGlzLl9vZmZzZXQgPT09IDAgOiBmYWxzZTtcbn1cblxuLy8gQVNQLk5FVCBqc29uIGRhdGUgZm9ybWF0IHJlZ2V4XG52YXIgYXNwTmV0UmVnZXggPSAvXihcXC18XFwrKT8oPzooXFxkKilbLiBdKT8oXFxkKylcXDooXFxkKykoPzpcXDooXFxkKykoXFwuXFxkKik/KT8kLztcblxuLy8gZnJvbSBodHRwOi8vZG9jcy5jbG9zdXJlLWxpYnJhcnkuZ29vZ2xlY29kZS5jb20vZ2l0L2Nsb3N1cmVfZ29vZ19kYXRlX2RhdGUuanMuc291cmNlLmh0bWxcbi8vIHNvbWV3aGF0IG1vcmUgaW4gbGluZSB3aXRoIDQuNC4zLjIgMjAwNCBzcGVjLCBidXQgYWxsb3dzIGRlY2ltYWwgYW55d2hlcmVcbi8vIGFuZCBmdXJ0aGVyIG1vZGlmaWVkIHRvIGFsbG93IGZvciBzdHJpbmdzIGNvbnRhaW5pbmcgYm90aCB3ZWVrIGFuZCBkYXlcbnZhciBpc29SZWdleCA9IC9eKC18XFwrKT9QKD86KFstK10/WzAtOSwuXSopWSk/KD86KFstK10/WzAtOSwuXSopTSk/KD86KFstK10/WzAtOSwuXSopVyk/KD86KFstK10/WzAtOSwuXSopRCk/KD86VCg/OihbLStdP1swLTksLl0qKUgpPyg/OihbLStdP1swLTksLl0qKU0pPyg/OihbLStdP1swLTksLl0qKVMpPyk/JC87XG5cbmZ1bmN0aW9uIGNyZWF0ZUR1cmF0aW9uIChpbnB1dCwga2V5KSB7XG4gICAgdmFyIGR1cmF0aW9uID0gaW5wdXQsXG4gICAgICAgIC8vIG1hdGNoaW5nIGFnYWluc3QgcmVnZXhwIGlzIGV4cGVuc2l2ZSwgZG8gaXQgb24gZGVtYW5kXG4gICAgICAgIG1hdGNoID0gbnVsbCxcbiAgICAgICAgc2lnbixcbiAgICAgICAgcmV0LFxuICAgICAgICBkaWZmUmVzO1xuXG4gICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpKSB7XG4gICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgbXMgOiBpbnB1dC5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgZCAgOiBpbnB1dC5fZGF5cyxcbiAgICAgICAgICAgIE0gIDogaW5wdXQuX21vbnRoc1xuICAgICAgICB9O1xuICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIoaW5wdXQpKSB7XG4gICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uW2tleV0gPSBpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGR1cmF0aW9uLm1pbGxpc2Vjb25kcyA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGFzcE5ldFJlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSAnLScpID8gLTEgOiAxO1xuICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgIHkgIDogMCxcbiAgICAgICAgICAgIGQgIDogdG9JbnQobWF0Y2hbREFURV0pICAgICAgICAgICAgICAgICAgICAgICAgICogc2lnbixcbiAgICAgICAgICAgIGggIDogdG9JbnQobWF0Y2hbSE9VUl0pICAgICAgICAgICAgICAgICAgICAgICAgICogc2lnbixcbiAgICAgICAgICAgIG0gIDogdG9JbnQobWF0Y2hbTUlOVVRFXSkgICAgICAgICAgICAgICAgICAgICAgICogc2lnbixcbiAgICAgICAgICAgIHMgIDogdG9JbnQobWF0Y2hbU0VDT05EXSkgICAgICAgICAgICAgICAgICAgICAgICogc2lnbixcbiAgICAgICAgICAgIG1zIDogdG9JbnQoYWJzUm91bmQobWF0Y2hbTUlMTElTRUNPTkRdICogMTAwMCkpICogc2lnbiAvLyB0aGUgbWlsbGlzZWNvbmQgZGVjaW1hbCBwb2ludCBpcyBpbmNsdWRlZCBpbiB0aGUgbWF0Y2hcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKCEhKG1hdGNoID0gaXNvUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09ICctJykgPyAtMSA6IChtYXRjaFsxXSA9PT0gJysnKSA/IDEgOiAxO1xuICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgIHkgOiBwYXJzZUlzbyhtYXRjaFsyXSwgc2lnbiksXG4gICAgICAgICAgICBNIDogcGFyc2VJc28obWF0Y2hbM10sIHNpZ24pLFxuICAgICAgICAgICAgdyA6IHBhcnNlSXNvKG1hdGNoWzRdLCBzaWduKSxcbiAgICAgICAgICAgIGQgOiBwYXJzZUlzbyhtYXRjaFs1XSwgc2lnbiksXG4gICAgICAgICAgICBoIDogcGFyc2VJc28obWF0Y2hbNl0sIHNpZ24pLFxuICAgICAgICAgICAgbSA6IHBhcnNlSXNvKG1hdGNoWzddLCBzaWduKSxcbiAgICAgICAgICAgIHMgOiBwYXJzZUlzbyhtYXRjaFs4XSwgc2lnbilcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGR1cmF0aW9uID09IG51bGwpIHsvLyBjaGVja3MgZm9yIG51bGwgb3IgdW5kZWZpbmVkXG4gICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZHVyYXRpb24gPT09ICdvYmplY3QnICYmICgnZnJvbScgaW4gZHVyYXRpb24gfHwgJ3RvJyBpbiBkdXJhdGlvbikpIHtcbiAgICAgICAgZGlmZlJlcyA9IG1vbWVudHNEaWZmZXJlbmNlKGNyZWF0ZUxvY2FsKGR1cmF0aW9uLmZyb20pLCBjcmVhdGVMb2NhbChkdXJhdGlvbi50bykpO1xuXG4gICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgIGR1cmF0aW9uLm1zID0gZGlmZlJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgIGR1cmF0aW9uLk0gPSBkaWZmUmVzLm1vbnRocztcbiAgICB9XG5cbiAgICByZXQgPSBuZXcgRHVyYXRpb24oZHVyYXRpb24pO1xuXG4gICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpICYmIGhhc093blByb3AoaW5wdXQsICdfbG9jYWxlJykpIHtcbiAgICAgICAgcmV0Ll9sb2NhbGUgPSBpbnB1dC5fbG9jYWxlO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59XG5cbmNyZWF0ZUR1cmF0aW9uLmZuID0gRHVyYXRpb24ucHJvdG90eXBlO1xuY3JlYXRlRHVyYXRpb24uaW52YWxpZCA9IGNyZWF0ZUludmFsaWQkMTtcblxuZnVuY3Rpb24gcGFyc2VJc28gKGlucCwgc2lnbikge1xuICAgIC8vIFdlJ2Qgbm9ybWFsbHkgdXNlIH5+aW5wIGZvciB0aGlzLCBidXQgdW5mb3J0dW5hdGVseSBpdCBhbHNvXG4gICAgLy8gY29udmVydHMgZmxvYXRzIHRvIGludHMuXG4gICAgLy8gaW5wIG1heSBiZSB1bmRlZmluZWQsIHNvIGNhcmVmdWwgY2FsbGluZyByZXBsYWNlIG9uIGl0LlxuICAgIHZhciByZXMgPSBpbnAgJiYgcGFyc2VGbG9hdChpbnAucmVwbGFjZSgnLCcsICcuJykpO1xuICAgIC8vIGFwcGx5IHNpZ24gd2hpbGUgd2UncmUgYXQgaXRcbiAgICByZXR1cm4gKGlzTmFOKHJlcykgPyAwIDogcmVzKSAqIHNpZ247XG59XG5cbmZ1bmN0aW9uIHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICB2YXIgcmVzID0ge21pbGxpc2Vjb25kczogMCwgbW9udGhzOiAwfTtcblxuICAgIHJlcy5tb250aHMgPSBvdGhlci5tb250aCgpIC0gYmFzZS5tb250aCgpICtcbiAgICAgICAgKG90aGVyLnllYXIoKSAtIGJhc2UueWVhcigpKSAqIDEyO1xuICAgIGlmIChiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykuaXNBZnRlcihvdGhlcikpIHtcbiAgICAgICAgLS1yZXMubW9udGhzO1xuICAgIH1cblxuICAgIHJlcy5taWxsaXNlY29uZHMgPSArb3RoZXIgLSArKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKSk7XG5cbiAgICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBtb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcikge1xuICAgIHZhciByZXM7XG4gICAgaWYgKCEoYmFzZS5pc1ZhbGlkKCkgJiYgb3RoZXIuaXNWYWxpZCgpKSkge1xuICAgICAgICByZXR1cm4ge21pbGxpc2Vjb25kczogMCwgbW9udGhzOiAwfTtcbiAgICB9XG5cbiAgICBvdGhlciA9IGNsb25lV2l0aE9mZnNldChvdGhlciwgYmFzZSk7XG4gICAgaWYgKGJhc2UuaXNCZWZvcmUob3RoZXIpKSB7XG4gICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2Uob3RoZXIsIGJhc2UpO1xuICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gLXJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgIHJlcy5tb250aHMgPSAtcmVzLm1vbnRocztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBUT0RPOiByZW1vdmUgJ25hbWUnIGFyZyBhZnRlciBkZXByZWNhdGlvbiBpcyByZW1vdmVkXG5mdW5jdGlvbiBjcmVhdGVBZGRlcihkaXJlY3Rpb24sIG5hbWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHZhbCwgcGVyaW9kKSB7XG4gICAgICAgIHZhciBkdXIsIHRtcDtcbiAgICAgICAgLy9pbnZlcnQgdGhlIGFyZ3VtZW50cywgYnV0IGNvbXBsYWluIGFib3V0IGl0XG4gICAgICAgIGlmIChwZXJpb2QgIT09IG51bGwgJiYgIWlzTmFOKCtwZXJpb2QpKSB7XG4gICAgICAgICAgICBkZXByZWNhdGVTaW1wbGUobmFtZSwgJ21vbWVudCgpLicgKyBuYW1lICArICcocGVyaW9kLCBudW1iZXIpIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgbW9tZW50KCkuJyArIG5hbWUgKyAnKG51bWJlciwgcGVyaW9kKS4gJyArXG4gICAgICAgICAgICAnU2VlIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvYWRkLWludmVydGVkLXBhcmFtLyBmb3IgbW9yZSBpbmZvLicpO1xuICAgICAgICAgICAgdG1wID0gdmFsOyB2YWwgPSBwZXJpb2Q7IHBlcmlvZCA9IHRtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbCA9IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gK3ZhbCA6IHZhbDtcbiAgICAgICAgZHVyID0gY3JlYXRlRHVyYXRpb24odmFsLCBwZXJpb2QpO1xuICAgICAgICBhZGRTdWJ0cmFjdCh0aGlzLCBkdXIsIGRpcmVjdGlvbik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFkZFN1YnRyYWN0IChtb20sIGR1cmF0aW9uLCBpc0FkZGluZywgdXBkYXRlT2Zmc2V0KSB7XG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IGR1cmF0aW9uLl9taWxsaXNlY29uZHMsXG4gICAgICAgIGRheXMgPSBhYnNSb3VuZChkdXJhdGlvbi5fZGF5cyksXG4gICAgICAgIG1vbnRocyA9IGFic1JvdW5kKGR1cmF0aW9uLl9tb250aHMpO1xuXG4gICAgaWYgKCFtb20uaXNWYWxpZCgpKSB7XG4gICAgICAgIC8vIE5vIG9wXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB1cGRhdGVPZmZzZXQgPSB1cGRhdGVPZmZzZXQgPT0gbnVsbCA/IHRydWUgOiB1cGRhdGVPZmZzZXQ7XG5cbiAgICBpZiAobW9udGhzKSB7XG4gICAgICAgIHNldE1vbnRoKG1vbSwgZ2V0KG1vbSwgJ01vbnRoJykgKyBtb250aHMgKiBpc0FkZGluZyk7XG4gICAgfVxuICAgIGlmIChkYXlzKSB7XG4gICAgICAgIHNldCQxKG1vbSwgJ0RhdGUnLCBnZXQobW9tLCAnRGF0ZScpICsgZGF5cyAqIGlzQWRkaW5nKTtcbiAgICB9XG4gICAgaWYgKG1pbGxpc2Vjb25kcykge1xuICAgICAgICBtb20uX2Quc2V0VGltZShtb20uX2QudmFsdWVPZigpICsgbWlsbGlzZWNvbmRzICogaXNBZGRpbmcpO1xuICAgIH1cbiAgICBpZiAodXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldChtb20sIGRheXMgfHwgbW9udGhzKTtcbiAgICB9XG59XG5cbnZhciBhZGQgICAgICA9IGNyZWF0ZUFkZGVyKDEsICdhZGQnKTtcbnZhciBzdWJ0cmFjdCA9IGNyZWF0ZUFkZGVyKC0xLCAnc3VidHJhY3QnKTtcblxuZnVuY3Rpb24gZ2V0Q2FsZW5kYXJGb3JtYXQobXlNb21lbnQsIG5vdykge1xuICAgIHZhciBkaWZmID0gbXlNb21lbnQuZGlmZihub3csICdkYXlzJywgdHJ1ZSk7XG4gICAgcmV0dXJuIGRpZmYgPCAtNiA/ICdzYW1lRWxzZScgOlxuICAgICAgICAgICAgZGlmZiA8IC0xID8gJ2xhc3RXZWVrJyA6XG4gICAgICAgICAgICBkaWZmIDwgMCA/ICdsYXN0RGF5JyA6XG4gICAgICAgICAgICBkaWZmIDwgMSA/ICdzYW1lRGF5JyA6XG4gICAgICAgICAgICBkaWZmIDwgMiA/ICduZXh0RGF5JyA6XG4gICAgICAgICAgICBkaWZmIDwgNyA/ICduZXh0V2VlaycgOiAnc2FtZUVsc2UnO1xufVxuXG5mdW5jdGlvbiBjYWxlbmRhciQxICh0aW1lLCBmb3JtYXRzKSB7XG4gICAgLy8gV2Ugd2FudCB0byBjb21wYXJlIHRoZSBzdGFydCBvZiB0b2RheSwgdnMgdGhpcy5cbiAgICAvLyBHZXR0aW5nIHN0YXJ0LW9mLXRvZGF5IGRlcGVuZHMgb24gd2hldGhlciB3ZSdyZSBsb2NhbC91dGMvb2Zmc2V0IG9yIG5vdC5cbiAgICB2YXIgbm93ID0gdGltZSB8fCBjcmVhdGVMb2NhbCgpLFxuICAgICAgICBzb2QgPSBjbG9uZVdpdGhPZmZzZXQobm93LCB0aGlzKS5zdGFydE9mKCdkYXknKSxcbiAgICAgICAgZm9ybWF0ID0gaG9va3MuY2FsZW5kYXJGb3JtYXQodGhpcywgc29kKSB8fCAnc2FtZUVsc2UnO1xuXG4gICAgdmFyIG91dHB1dCA9IGZvcm1hdHMgJiYgKGlzRnVuY3Rpb24oZm9ybWF0c1tmb3JtYXRdKSA/IGZvcm1hdHNbZm9ybWF0XS5jYWxsKHRoaXMsIG5vdykgOiBmb3JtYXRzW2Zvcm1hdF0pO1xuXG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0KG91dHB1dCB8fCB0aGlzLmxvY2FsZURhdGEoKS5jYWxlbmRhcihmb3JtYXQsIHRoaXMsIGNyZWF0ZUxvY2FsKG5vdykpKTtcbn1cblxuZnVuY3Rpb24gY2xvbmUgKCkge1xuICAgIHJldHVybiBuZXcgTW9tZW50KHRoaXMpO1xufVxuXG5mdW5jdGlvbiBpc0FmdGVyIChpbnB1dCwgdW5pdHMpIHtcbiAgICB2YXIgbG9jYWxJbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgIGlmICghKHRoaXMuaXNWYWxpZCgpICYmIGxvY2FsSW5wdXQuaXNWYWxpZCgpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHMoIWlzVW5kZWZpbmVkKHVuaXRzKSA/IHVuaXRzIDogJ21pbGxpc2Vjb25kJyk7XG4gICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKSA+IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsb2NhbElucHV0LnZhbHVlT2YoKSA8IHRoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKS52YWx1ZU9mKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc0JlZm9yZSAoaW5wdXQsIHVuaXRzKSB7XG4gICAgdmFyIGxvY2FsSW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGNyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICBpZiAoISh0aGlzLmlzVmFsaWQoKSAmJiBsb2NhbElucHV0LmlzVmFsaWQoKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKCFpc1VuZGVmaW5lZCh1bml0cykgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCkgPCBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKS52YWx1ZU9mKCkgPCBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzQmV0d2VlbiAoZnJvbSwgdG8sIHVuaXRzLCBpbmNsdXNpdml0eSkge1xuICAgIGluY2x1c2l2aXR5ID0gaW5jbHVzaXZpdHkgfHwgJygpJztcbiAgICByZXR1cm4gKGluY2x1c2l2aXR5WzBdID09PSAnKCcgPyB0aGlzLmlzQWZ0ZXIoZnJvbSwgdW5pdHMpIDogIXRoaXMuaXNCZWZvcmUoZnJvbSwgdW5pdHMpKSAmJlxuICAgICAgICAoaW5jbHVzaXZpdHlbMV0gPT09ICcpJyA/IHRoaXMuaXNCZWZvcmUodG8sIHVuaXRzKSA6ICF0aGlzLmlzQWZ0ZXIodG8sIHVuaXRzKSk7XG59XG5cbmZ1bmN0aW9uIGlzU2FtZSAoaW5wdXQsIHVuaXRzKSB7XG4gICAgdmFyIGxvY2FsSW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGNyZWF0ZUxvY2FsKGlucHV0KSxcbiAgICAgICAgaW5wdXRNcztcbiAgICBpZiAoISh0aGlzLmlzVmFsaWQoKSAmJiBsb2NhbElucHV0LmlzVmFsaWQoKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzIHx8ICdtaWxsaXNlY29uZCcpO1xuICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCkgPT09IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0TXMgPSBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKS52YWx1ZU9mKCkgPD0gaW5wdXRNcyAmJiBpbnB1dE1zIDw9IHRoaXMuY2xvbmUoKS5lbmRPZih1bml0cykudmFsdWVPZigpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNTYW1lT3JBZnRlciAoaW5wdXQsIHVuaXRzKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNTYW1lKGlucHV0LCB1bml0cykgfHwgdGhpcy5pc0FmdGVyKGlucHV0LHVuaXRzKTtcbn1cblxuZnVuY3Rpb24gaXNTYW1lT3JCZWZvcmUgKGlucHV0LCB1bml0cykge1xuICAgIHJldHVybiB0aGlzLmlzU2FtZShpbnB1dCwgdW5pdHMpIHx8IHRoaXMuaXNCZWZvcmUoaW5wdXQsdW5pdHMpO1xufVxuXG5mdW5jdGlvbiBkaWZmIChpbnB1dCwgdW5pdHMsIGFzRmxvYXQpIHtcbiAgICB2YXIgdGhhdCxcbiAgICAgICAgem9uZURlbHRhLFxuICAgICAgICBvdXRwdXQ7XG5cbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiBOYU47XG4gICAgfVxuXG4gICAgdGhhdCA9IGNsb25lV2l0aE9mZnNldChpbnB1dCwgdGhpcyk7XG5cbiAgICBpZiAoIXRoYXQuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiBOYU47XG4gICAgfVxuXG4gICAgem9uZURlbHRhID0gKHRoYXQudXRjT2Zmc2V0KCkgLSB0aGlzLnV0Y09mZnNldCgpKSAqIDZlNDtcblxuICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICBjYXNlICd5ZWFyJzogb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpIC8gMTI7IGJyZWFrO1xuICAgICAgICBjYXNlICdtb250aCc6IG91dHB1dCA9IG1vbnRoRGlmZih0aGlzLCB0aGF0KTsgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3F1YXJ0ZXInOiBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCkgLyAzOyBicmVhaztcbiAgICAgICAgY2FzZSAnc2Vjb25kJzogb3V0cHV0ID0gKHRoaXMgLSB0aGF0KSAvIDFlMzsgYnJlYWs7IC8vIDEwMDBcbiAgICAgICAgY2FzZSAnbWludXRlJzogb3V0cHV0ID0gKHRoaXMgLSB0aGF0KSAvIDZlNDsgYnJlYWs7IC8vIDEwMDAgKiA2MFxuICAgICAgICBjYXNlICdob3VyJzogb3V0cHV0ID0gKHRoaXMgLSB0aGF0KSAvIDM2ZTU7IGJyZWFrOyAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICBjYXNlICdkYXknOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQgLSB6b25lRGVsdGEpIC8gODY0ZTU7IGJyZWFrOyAvLyAxMDAwICogNjAgKiA2MCAqIDI0LCBuZWdhdGUgZHN0XG4gICAgICAgIGNhc2UgJ3dlZWsnOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQgLSB6b25lRGVsdGEpIC8gNjA0OGU1OyBicmVhazsgLy8gMTAwMCAqIDYwICogNjAgKiAyNCAqIDcsIG5lZ2F0ZSBkc3RcbiAgICAgICAgZGVmYXVsdDogb3V0cHV0ID0gdGhpcyAtIHRoYXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFzRmxvYXQgPyBvdXRwdXQgOiBhYnNGbG9vcihvdXRwdXQpO1xufVxuXG5mdW5jdGlvbiBtb250aERpZmYgKGEsIGIpIHtcbiAgICAvLyBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICAgIHZhciB3aG9sZU1vbnRoRGlmZiA9ICgoYi55ZWFyKCkgLSBhLnllYXIoKSkgKiAxMikgKyAoYi5tb250aCgpIC0gYS5tb250aCgpKSxcbiAgICAgICAgLy8gYiBpcyBpbiAoYW5jaG9yIC0gMSBtb250aCwgYW5jaG9yICsgMSBtb250aClcbiAgICAgICAgYW5jaG9yID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiwgJ21vbnRocycpLFxuICAgICAgICBhbmNob3IyLCBhZGp1c3Q7XG5cbiAgICBpZiAoYiAtIGFuY2hvciA8IDApIHtcbiAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgLSAxLCAnbW9udGhzJyk7XG4gICAgICAgIC8vIGxpbmVhciBhY3Jvc3MgdGhlIG1vbnRoXG4gICAgICAgIGFkanVzdCA9IChiIC0gYW5jaG9yKSAvIChhbmNob3IgLSBhbmNob3IyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBhbmNob3IyID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiArIDEsICdtb250aHMnKTtcbiAgICAgICAgLy8gbGluZWFyIGFjcm9zcyB0aGUgbW9udGhcbiAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvcjIgLSBhbmNob3IpO1xuICAgIH1cblxuICAgIC8vY2hlY2sgZm9yIG5lZ2F0aXZlIHplcm8sIHJldHVybiB6ZXJvIGlmIG5lZ2F0aXZlIHplcm9cbiAgICByZXR1cm4gLSh3aG9sZU1vbnRoRGlmZiArIGFkanVzdCkgfHwgMDtcbn1cblxuaG9va3MuZGVmYXVsdEZvcm1hdCA9ICdZWVlZLU1NLUREVEhIOm1tOnNzWic7XG5ob29rcy5kZWZhdWx0Rm9ybWF0VXRjID0gJ1lZWVktTU0tRERUSEg6bW06c3NbWl0nO1xuXG5mdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb2NhbGUoJ2VuJykuZm9ybWF0KCdkZGQgTU1NIEREIFlZWVkgSEg6bW06c3MgW0dNVF1aWicpO1xufVxuXG5mdW5jdGlvbiB0b0lTT1N0cmluZyhrZWVwT2Zmc2V0KSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIHV0YyA9IGtlZXBPZmZzZXQgIT09IHRydWU7XG4gICAgdmFyIG0gPSB1dGMgPyB0aGlzLmNsb25lKCkudXRjKCkgOiB0aGlzO1xuICAgIGlmIChtLnllYXIoKSA8IDAgfHwgbS55ZWFyKCkgPiA5OTk5KSB7XG4gICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgdXRjID8gJ1lZWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScgOiAnWVlZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTWicpO1xuICAgIH1cbiAgICBpZiAoaXNGdW5jdGlvbihEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZykpIHtcbiAgICAgICAgLy8gbmF0aXZlIGltcGxlbWVudGF0aW9uIGlzIH41MHggZmFzdGVyLCB1c2UgaXQgd2hlbiB3ZSBjYW5cbiAgICAgICAgaWYgKHV0Yykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9EYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLnZhbHVlT2YoKSArIHRoaXMudXRjT2Zmc2V0KCkgKiA2MCAqIDEwMDApLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnWicsIGZvcm1hdE1vbWVudChtLCAnWicpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sIHV0YyA/ICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyA6ICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTWicpO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHJlcHJlc2VudGF0aW9uIG9mIGEgbW9tZW50IHRoYXQgY2FuXG4gKiBhbHNvIGJlIGV2YWx1YXRlZCB0byBnZXQgYSBuZXcgbW9tZW50IHdoaWNoIGlzIHRoZSBzYW1lXG4gKlxuICogQGxpbmsgaHR0cHM6Ly9ub2RlanMub3JnL2Rpc3QvbGF0ZXN0L2RvY3MvYXBpL3V0aWwuaHRtbCN1dGlsX2N1c3RvbV9pbnNwZWN0X2Z1bmN0aW9uX29uX29iamVjdHNcbiAqL1xuZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gJ21vbWVudC5pbnZhbGlkKC8qICcgKyB0aGlzLl9pICsgJyAqLyknO1xuICAgIH1cbiAgICB2YXIgZnVuYyA9ICdtb21lbnQnO1xuICAgIHZhciB6b25lID0gJyc7XG4gICAgaWYgKCF0aGlzLmlzTG9jYWwoKSkge1xuICAgICAgICBmdW5jID0gdGhpcy51dGNPZmZzZXQoKSA9PT0gMCA/ICdtb21lbnQudXRjJyA6ICdtb21lbnQucGFyc2Vab25lJztcbiAgICAgICAgem9uZSA9ICdaJztcbiAgICB9XG4gICAgdmFyIHByZWZpeCA9ICdbJyArIGZ1bmMgKyAnKFwiXSc7XG4gICAgdmFyIHllYXIgPSAoMCA8PSB0aGlzLnllYXIoKSAmJiB0aGlzLnllYXIoKSA8PSA5OTk5KSA/ICdZWVlZJyA6ICdZWVlZWVknO1xuICAgIHZhciBkYXRldGltZSA9ICctTU0tRERbVF1ISDptbTpzcy5TU1MnO1xuICAgIHZhciBzdWZmaXggPSB6b25lICsgJ1tcIildJztcblxuICAgIHJldHVybiB0aGlzLmZvcm1hdChwcmVmaXggKyB5ZWFyICsgZGF0ZXRpbWUgKyBzdWZmaXgpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXQgKGlucHV0U3RyaW5nKSB7XG4gICAgaWYgKCFpbnB1dFN0cmluZykge1xuICAgICAgICBpbnB1dFN0cmluZyA9IHRoaXMuaXNVdGMoKSA/IGhvb2tzLmRlZmF1bHRGb3JtYXRVdGMgOiBob29rcy5kZWZhdWx0Rm9ybWF0O1xuICAgIH1cbiAgICB2YXIgb3V0cHV0ID0gZm9ybWF0TW9tZW50KHRoaXMsIGlucHV0U3RyaW5nKTtcbiAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkucG9zdGZvcm1hdChvdXRwdXQpO1xufVxuXG5mdW5jdGlvbiBmcm9tICh0aW1lLCB3aXRob3V0U3VmZml4KSB7XG4gICAgaWYgKHRoaXMuaXNWYWxpZCgpICYmXG4gICAgICAgICAgICAoKGlzTW9tZW50KHRpbWUpICYmIHRpbWUuaXNWYWxpZCgpKSB8fFxuICAgICAgICAgICAgIGNyZWF0ZUxvY2FsKHRpbWUpLmlzVmFsaWQoKSkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUR1cmF0aW9uKHt0bzogdGhpcywgZnJvbTogdGltZX0pLmxvY2FsZSh0aGlzLmxvY2FsZSgpKS5odW1hbml6ZSghd2l0aG91dFN1ZmZpeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmcm9tTm93ICh3aXRob3V0U3VmZml4KSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbShjcmVhdGVMb2NhbCgpLCB3aXRob3V0U3VmZml4KTtcbn1cblxuZnVuY3Rpb24gdG8gKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICBpZiAodGhpcy5pc1ZhbGlkKCkgJiZcbiAgICAgICAgICAgICgoaXNNb21lbnQodGltZSkgJiYgdGltZS5pc1ZhbGlkKCkpIHx8XG4gICAgICAgICAgICAgY3JlYXRlTG9jYWwodGltZSkuaXNWYWxpZCgpKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24oe2Zyb206IHRoaXMsIHRvOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRvTm93ICh3aXRob3V0U3VmZml4KSB7XG4gICAgcmV0dXJuIHRoaXMudG8oY3JlYXRlTG9jYWwoKSwgd2l0aG91dFN1ZmZpeCk7XG59XG5cbi8vIElmIHBhc3NlZCBhIGxvY2FsZSBrZXksIGl0IHdpbGwgc2V0IHRoZSBsb2NhbGUgZm9yIHRoaXNcbi8vIGluc3RhbmNlLiAgT3RoZXJ3aXNlLCBpdCB3aWxsIHJldHVybiB0aGUgbG9jYWxlIGNvbmZpZ3VyYXRpb25cbi8vIHZhcmlhYmxlcyBmb3IgdGhpcyBpbnN0YW5jZS5cbmZ1bmN0aW9uIGxvY2FsZSAoa2V5KSB7XG4gICAgdmFyIG5ld0xvY2FsZURhdGE7XG5cbiAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZS5fYWJicjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXdMb2NhbGVEYXRhID0gZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgIGlmIChuZXdMb2NhbGVEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IG5ld0xvY2FsZURhdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG52YXIgbGFuZyA9IGRlcHJlY2F0ZShcbiAgICAnbW9tZW50KCkubGFuZygpIGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQsIHVzZSBtb21lbnQoKS5sb2NhbGVEYXRhKCkgdG8gZ2V0IHRoZSBsYW5ndWFnZSBjb25maWd1cmF0aW9uLiBVc2UgbW9tZW50KCkubG9jYWxlKCkgdG8gY2hhbmdlIGxhbmd1YWdlcy4nLFxuICAgIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGUoa2V5KTtcbiAgICAgICAgfVxuICAgIH1cbik7XG5cbmZ1bmN0aW9uIGxvY2FsZURhdGEgKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0T2YgKHVuaXRzKSB7XG4gICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgLy8gdGhlIGZvbGxvd2luZyBzd2l0Y2ggaW50ZW50aW9uYWxseSBvbWl0cyBicmVhayBrZXl3b3Jkc1xuICAgIC8vIHRvIHV0aWxpemUgZmFsbGluZyB0aHJvdWdoIHRoZSBjYXNlcy5cbiAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICAgICAgdGhpcy5tb250aCgwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgICAgIHRoaXMuZGF0ZSgxKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgIGNhc2UgJ2lzb1dlZWsnOlxuICAgICAgICBjYXNlICdkYXknOlxuICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICAgIHRoaXMuaG91cnMoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ2hvdXInOlxuICAgICAgICAgICAgdGhpcy5taW51dGVzKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdtaW51dGUnOlxuICAgICAgICAgICAgdGhpcy5zZWNvbmRzKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdzZWNvbmQnOlxuICAgICAgICAgICAgdGhpcy5taWxsaXNlY29uZHMoMCk7XG4gICAgfVxuXG4gICAgLy8gd2Vla3MgYXJlIGEgc3BlY2lhbCBjYXNlXG4gICAgaWYgKHVuaXRzID09PSAnd2VlaycpIHtcbiAgICAgICAgdGhpcy53ZWVrZGF5KDApO1xuICAgIH1cbiAgICBpZiAodW5pdHMgPT09ICdpc29XZWVrJykge1xuICAgICAgICB0aGlzLmlzb1dlZWtkYXkoMSk7XG4gICAgfVxuXG4gICAgLy8gcXVhcnRlcnMgYXJlIGFsc28gc3BlY2lhbFxuICAgIGlmICh1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgIHRoaXMubW9udGgoTWF0aC5mbG9vcih0aGlzLm1vbnRoKCkgLyAzKSAqIDMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBlbmRPZiAodW5pdHMpIHtcbiAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICBpZiAodW5pdHMgPT09IHVuZGVmaW5lZCB8fCB1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyAnZGF0ZScgaXMgYW4gYWxpYXMgZm9yICdkYXknLCBzbyBpdCBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyBzdWNoLlxuICAgIGlmICh1bml0cyA9PT0gJ2RhdGUnKSB7XG4gICAgICAgIHVuaXRzID0gJ2RheSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RhcnRPZih1bml0cykuYWRkKDEsICh1bml0cyA9PT0gJ2lzb1dlZWsnID8gJ3dlZWsnIDogdW5pdHMpKS5zdWJ0cmFjdCgxLCAnbXMnKTtcbn1cblxuZnVuY3Rpb24gdmFsdWVPZiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2QudmFsdWVPZigpIC0gKCh0aGlzLl9vZmZzZXQgfHwgMCkgKiA2MDAwMCk7XG59XG5cbmZ1bmN0aW9uIHVuaXggKCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMudmFsdWVPZigpIC8gMTAwMCk7XG59XG5cbmZ1bmN0aW9uIHRvRGF0ZSAoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMudmFsdWVPZigpKTtcbn1cblxuZnVuY3Rpb24gdG9BcnJheSAoKSB7XG4gICAgdmFyIG0gPSB0aGlzO1xuICAgIHJldHVybiBbbS55ZWFyKCksIG0ubW9udGgoKSwgbS5kYXRlKCksIG0uaG91cigpLCBtLm1pbnV0ZSgpLCBtLnNlY29uZCgpLCBtLm1pbGxpc2Vjb25kKCldO1xufVxuXG5mdW5jdGlvbiB0b09iamVjdCAoKSB7XG4gICAgdmFyIG0gPSB0aGlzO1xuICAgIHJldHVybiB7XG4gICAgICAgIHllYXJzOiBtLnllYXIoKSxcbiAgICAgICAgbW9udGhzOiBtLm1vbnRoKCksXG4gICAgICAgIGRhdGU6IG0uZGF0ZSgpLFxuICAgICAgICBob3VyczogbS5ob3VycygpLFxuICAgICAgICBtaW51dGVzOiBtLm1pbnV0ZXMoKSxcbiAgICAgICAgc2Vjb25kczogbS5zZWNvbmRzKCksXG4gICAgICAgIG1pbGxpc2Vjb25kczogbS5taWxsaXNlY29uZHMoKVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gICAgLy8gbmV3IERhdGUoTmFOKS50b0pTT04oKSA9PT0gbnVsbFxuICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMudG9JU09TdHJpbmcoKSA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWQkMiAoKSB7XG4gICAgcmV0dXJuIGlzVmFsaWQodGhpcyk7XG59XG5cbmZ1bmN0aW9uIHBhcnNpbmdGbGFncyAoKSB7XG4gICAgcmV0dXJuIGV4dGVuZCh7fSwgZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpKTtcbn1cblxuZnVuY3Rpb24gaW52YWxpZEF0ICgpIHtcbiAgICByZXR1cm4gZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpLm92ZXJmbG93O1xufVxuXG5mdW5jdGlvbiBjcmVhdGlvbkRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5wdXQ6IHRoaXMuX2ksXG4gICAgICAgIGZvcm1hdDogdGhpcy5fZixcbiAgICAgICAgbG9jYWxlOiB0aGlzLl9sb2NhbGUsXG4gICAgICAgIGlzVVRDOiB0aGlzLl9pc1VUQyxcbiAgICAgICAgc3RyaWN0OiB0aGlzLl9zdHJpY3RcbiAgICB9O1xufVxuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKDAsIFsnZ2cnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLndlZWtZZWFyKCkgJSAxMDA7XG59KTtcblxuYWRkRm9ybWF0VG9rZW4oMCwgWydHRycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNvV2Vla1llYXIoKSAlIDEwMDtcbn0pO1xuXG5mdW5jdGlvbiBhZGRXZWVrWWVhckZvcm1hdFRva2VuICh0b2tlbiwgZ2V0dGVyKSB7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgW3Rva2VuLCB0b2tlbi5sZW5ndGhdLCAwLCBnZXR0ZXIpO1xufVxuXG5hZGRXZWVrWWVhckZvcm1hdFRva2VuKCdnZ2dnJywgICAgICd3ZWVrWWVhcicpO1xuYWRkV2Vla1llYXJGb3JtYXRUb2tlbignZ2dnZ2cnLCAgICAnd2Vla1llYXInKTtcbmFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ0dHR0cnLCAgJ2lzb1dlZWtZZWFyJyk7XG5hZGRXZWVrWWVhckZvcm1hdFRva2VuKCdHR0dHRycsICdpc29XZWVrWWVhcicpO1xuXG4vLyBBTElBU0VTXG5cbmFkZFVuaXRBbGlhcygnd2Vla1llYXInLCAnZ2cnKTtcbmFkZFVuaXRBbGlhcygnaXNvV2Vla1llYXInLCAnR0cnKTtcblxuLy8gUFJJT1JJVFlcblxuYWRkVW5pdFByaW9yaXR5KCd3ZWVrWWVhcicsIDEpO1xuYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrWWVhcicsIDEpO1xuXG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbignRycsICAgICAgbWF0Y2hTaWduZWQpO1xuYWRkUmVnZXhUb2tlbignZycsICAgICAgbWF0Y2hTaWduZWQpO1xuYWRkUmVnZXhUb2tlbignR0cnLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuYWRkUmVnZXhUb2tlbignZ2cnLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuYWRkUmVnZXhUb2tlbignR0dHRycsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuYWRkUmVnZXhUb2tlbignZ2dnZycsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuYWRkUmVnZXhUb2tlbignR0dHR0cnLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuYWRkUmVnZXhUb2tlbignZ2dnZ2cnLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG5hZGRXZWVrUGFyc2VUb2tlbihbJ2dnZ2cnLCAnZ2dnZ2cnLCAnR0dHRycsICdHR0dHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICB3ZWVrW3Rva2VuLnN1YnN0cigwLCAyKV0gPSB0b0ludChpbnB1dCk7XG59KTtcblxuYWRkV2Vla1BhcnNlVG9rZW4oWydnZycsICdHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICB3ZWVrW3Rva2VuXSA9IGhvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbn0pO1xuXG4vLyBNT01FTlRTXG5cbmZ1bmN0aW9uIGdldFNldFdlZWtZZWFyIChpbnB1dCkge1xuICAgIHJldHVybiBnZXRTZXRXZWVrWWVhckhlbHBlci5jYWxsKHRoaXMsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIHRoaXMud2VlaygpLFxuICAgICAgICAgICAgdGhpcy53ZWVrZGF5KCksXG4gICAgICAgICAgICB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3csXG4gICAgICAgICAgICB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3kpO1xufVxuXG5mdW5jdGlvbiBnZXRTZXRJU09XZWVrWWVhciAoaW5wdXQpIHtcbiAgICByZXR1cm4gZ2V0U2V0V2Vla1llYXJIZWxwZXIuY2FsbCh0aGlzLFxuICAgICAgICAgICAgaW5wdXQsIHRoaXMuaXNvV2VlaygpLCB0aGlzLmlzb1dlZWtkYXkoKSwgMSwgNCk7XG59XG5cbmZ1bmN0aW9uIGdldElTT1dlZWtzSW5ZZWFyICgpIHtcbiAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIDEsIDQpO1xufVxuXG5mdW5jdGlvbiBnZXRXZWVrc0luWWVhciAoKSB7XG4gICAgdmFyIHdlZWtJbmZvID0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWs7XG4gICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG59XG5cbmZ1bmN0aW9uIGdldFNldFdlZWtZZWFySGVscGVyKGlucHV0LCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSkge1xuICAgIHZhciB3ZWVrc1RhcmdldDtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcih0aGlzLCBkb3csIGRveSkueWVhcjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3ZWVrc1RhcmdldCA9IHdlZWtzSW5ZZWFyKGlucHV0LCBkb3csIGRveSk7XG4gICAgICAgIGlmICh3ZWVrID4gd2Vla3NUYXJnZXQpIHtcbiAgICAgICAgICAgIHdlZWsgPSB3ZWVrc1RhcmdldDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0V2Vla0FsbC5jYWxsKHRoaXMsIGlucHV0LCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZXRXZWVrQWxsKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSkge1xuICAgIHZhciBkYXlPZlllYXJEYXRhID0gZGF5T2ZZZWFyRnJvbVdlZWtzKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSksXG4gICAgICAgIGRhdGUgPSBjcmVhdGVVVENEYXRlKGRheU9mWWVhckRhdGEueWVhciwgMCwgZGF5T2ZZZWFyRGF0YS5kYXlPZlllYXIpO1xuXG4gICAgdGhpcy55ZWFyKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSk7XG4gICAgdGhpcy5tb250aChkYXRlLmdldFVUQ01vbnRoKCkpO1xuICAgIHRoaXMuZGF0ZShkYXRlLmdldFVUQ0RhdGUoKSk7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oJ1EnLCAwLCAnUW8nLCAncXVhcnRlcicpO1xuXG4vLyBBTElBU0VTXG5cbmFkZFVuaXRBbGlhcygncXVhcnRlcicsICdRJyk7XG5cbi8vIFBSSU9SSVRZXG5cbmFkZFVuaXRQcmlvcml0eSgncXVhcnRlcicsIDcpO1xuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ1EnLCBtYXRjaDEpO1xuYWRkUGFyc2VUb2tlbignUScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICBhcnJheVtNT05USF0gPSAodG9JbnQoaW5wdXQpIC0gMSkgKiAzO1xufSk7XG5cbi8vIE1PTUVOVFNcblxuZnVuY3Rpb24gZ2V0U2V0UXVhcnRlciAoaW5wdXQpIHtcbiAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IE1hdGguY2VpbCgodGhpcy5tb250aCgpICsgMSkgLyAzKSA6IHRoaXMubW9udGgoKGlucHV0IC0gMSkgKiAzICsgdGhpcy5tb250aCgpICUgMyk7XG59XG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oJ0QnLCBbJ0REJywgMl0sICdEbycsICdkYXRlJyk7XG5cbi8vIEFMSUFTRVNcblxuYWRkVW5pdEFsaWFzKCdkYXRlJywgJ0QnKTtcblxuLy8gUFJJT1JPSVRZXG5hZGRVbml0UHJpb3JpdHkoJ2RhdGUnLCA5KTtcblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCdEJywgIG1hdGNoMXRvMik7XG5hZGRSZWdleFRva2VuKCdERCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbmFkZFJlZ2V4VG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAvLyBUT0RPOiBSZW1vdmUgXCJvcmRpbmFsUGFyc2VcIiBmYWxsYmFjayBpbiBuZXh0IG1ham9yIHJlbGVhc2UuXG4gICAgcmV0dXJuIGlzU3RyaWN0ID9cbiAgICAgIChsb2NhbGUuX2RheU9mTW9udGhPcmRpbmFsUGFyc2UgfHwgbG9jYWxlLl9vcmRpbmFsUGFyc2UpIDpcbiAgICAgIGxvY2FsZS5fZGF5T2ZNb250aE9yZGluYWxQYXJzZUxlbmllbnQ7XG59KTtcblxuYWRkUGFyc2VUb2tlbihbJ0QnLCAnREQnXSwgREFURSk7XG5hZGRQYXJzZVRva2VuKCdEbycsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICBhcnJheVtEQVRFXSA9IHRvSW50KGlucHV0Lm1hdGNoKG1hdGNoMXRvMilbMF0pO1xufSk7XG5cbi8vIE1PTUVOVFNcblxudmFyIGdldFNldERheU9mTW9udGggPSBtYWtlR2V0U2V0KCdEYXRlJywgdHJ1ZSk7XG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oJ0RERCcsIFsnRERERCcsIDNdLCAnREREbycsICdkYXlPZlllYXInKTtcblxuLy8gQUxJQVNFU1xuXG5hZGRVbml0QWxpYXMoJ2RheU9mWWVhcicsICdEREQnKTtcblxuLy8gUFJJT1JJVFlcbmFkZFVuaXRQcmlvcml0eSgnZGF5T2ZZZWFyJywgNCk7XG5cbi8vIFBBUlNJTkdcblxuYWRkUmVnZXhUb2tlbignREREJywgIG1hdGNoMXRvMyk7XG5hZGRSZWdleFRva2VuKCdEREREJywgbWF0Y2gzKTtcbmFkZFBhcnNlVG9rZW4oWydEREQnLCAnRERERCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICBjb25maWcuX2RheU9mWWVhciA9IHRvSW50KGlucHV0KTtcbn0pO1xuXG4vLyBIRUxQRVJTXG5cbi8vIE1PTUVOVFNcblxuZnVuY3Rpb24gZ2V0U2V0RGF5T2ZZZWFyIChpbnB1dCkge1xuICAgIHZhciBkYXlPZlllYXIgPSBNYXRoLnJvdW5kKCh0aGlzLmNsb25lKCkuc3RhcnRPZignZGF5JykgLSB0aGlzLmNsb25lKCkuc3RhcnRPZigneWVhcicpKSAvIDg2NGU1KSArIDE7XG4gICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyBkYXlPZlllYXIgOiB0aGlzLmFkZCgoaW5wdXQgLSBkYXlPZlllYXIpLCAnZCcpO1xufVxuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKCdtJywgWydtbScsIDJdLCAwLCAnbWludXRlJyk7XG5cbi8vIEFMSUFTRVNcblxuYWRkVW5pdEFsaWFzKCdtaW51dGUnLCAnbScpO1xuXG4vLyBQUklPUklUWVxuXG5hZGRVbml0UHJpb3JpdHkoJ21pbnV0ZScsIDE0KTtcblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCdtJywgIG1hdGNoMXRvMik7XG5hZGRSZWdleFRva2VuKCdtbScsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbmFkZFBhcnNlVG9rZW4oWydtJywgJ21tJ10sIE1JTlVURSk7XG5cbi8vIE1PTUVOVFNcblxudmFyIGdldFNldE1pbnV0ZSA9IG1ha2VHZXRTZXQoJ01pbnV0ZXMnLCBmYWxzZSk7XG5cbi8vIEZPUk1BVFRJTkdcblxuYWRkRm9ybWF0VG9rZW4oJ3MnLCBbJ3NzJywgMl0sIDAsICdzZWNvbmQnKTtcblxuLy8gQUxJQVNFU1xuXG5hZGRVbml0QWxpYXMoJ3NlY29uZCcsICdzJyk7XG5cbi8vIFBSSU9SSVRZXG5cbmFkZFVuaXRQcmlvcml0eSgnc2Vjb25kJywgMTUpO1xuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ3MnLCAgbWF0Y2gxdG8yKTtcbmFkZFJlZ2V4VG9rZW4oJ3NzJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuYWRkUGFyc2VUb2tlbihbJ3MnLCAnc3MnXSwgU0VDT05EKTtcblxuLy8gTU9NRU5UU1xuXG52YXIgZ2V0U2V0U2Vjb25kID0gbWFrZUdldFNldCgnU2Vjb25kcycsIGZhbHNlKTtcblxuLy8gRk9STUFUVElOR1xuXG5hZGRGb3JtYXRUb2tlbignUycsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTAwKTtcbn0pO1xuXG5hZGRGb3JtYXRUb2tlbigwLCBbJ1NTJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTApO1xufSk7XG5cbmFkZEZvcm1hdFRva2VuKDAsIFsnU1NTJywgM10sIDAsICdtaWxsaXNlY29uZCcpO1xuYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTJywgNF0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTA7XG59KTtcbmFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1MnLCA1XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDA7XG59KTtcbmFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTJywgNl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDtcbn0pO1xuYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTJywgN10sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDA7XG59KTtcbmFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTU1MnLCA4XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDA7XG59KTtcbmFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTU1NTJywgOV0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDAwMDtcbn0pO1xuXG5cbi8vIEFMSUFTRVNcblxuYWRkVW5pdEFsaWFzKCdtaWxsaXNlY29uZCcsICdtcycpO1xuXG4vLyBQUklPUklUWVxuXG5hZGRVbml0UHJpb3JpdHkoJ21pbGxpc2Vjb25kJywgMTYpO1xuXG4vLyBQQVJTSU5HXG5cbmFkZFJlZ2V4VG9rZW4oJ1MnLCAgICBtYXRjaDF0bzMsIG1hdGNoMSk7XG5hZGRSZWdleFRva2VuKCdTUycsICAgbWF0Y2gxdG8zLCBtYXRjaDIpO1xuYWRkUmVnZXhUb2tlbignU1NTJywgIG1hdGNoMXRvMywgbWF0Y2gzKTtcblxudmFyIHRva2VuO1xuZm9yICh0b2tlbiA9ICdTU1NTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgIGFkZFJlZ2V4VG9rZW4odG9rZW4sIG1hdGNoVW5zaWduZWQpO1xufVxuXG5mdW5jdGlvbiBwYXJzZU1zKGlucHV0LCBhcnJheSkge1xuICAgIGFycmF5W01JTExJU0VDT05EXSA9IHRvSW50KCgnMC4nICsgaW5wdXQpICogMTAwMCk7XG59XG5cbmZvciAodG9rZW4gPSAnUyc7IHRva2VuLmxlbmd0aCA8PSA5OyB0b2tlbiArPSAnUycpIHtcbiAgICBhZGRQYXJzZVRva2VuKHRva2VuLCBwYXJzZU1zKTtcbn1cbi8vIE1PTUVOVFNcblxudmFyIGdldFNldE1pbGxpc2Vjb25kID0gbWFrZUdldFNldCgnTWlsbGlzZWNvbmRzJywgZmFsc2UpO1xuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKCd6JywgIDAsIDAsICd6b25lQWJicicpO1xuYWRkRm9ybWF0VG9rZW4oJ3p6JywgMCwgMCwgJ3pvbmVOYW1lJyk7XG5cbi8vIE1PTUVOVFNcblxuZnVuY3Rpb24gZ2V0Wm9uZUFiYnIgKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdVVEMnIDogJyc7XG59XG5cbmZ1bmN0aW9uIGdldFpvbmVOYW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnIDogJyc7XG59XG5cbnZhciBwcm90byA9IE1vbWVudC5wcm90b3R5cGU7XG5cbnByb3RvLmFkZCAgICAgICAgICAgICAgID0gYWRkO1xucHJvdG8uY2FsZW5kYXIgICAgICAgICAgPSBjYWxlbmRhciQxO1xucHJvdG8uY2xvbmUgICAgICAgICAgICAgPSBjbG9uZTtcbnByb3RvLmRpZmYgICAgICAgICAgICAgID0gZGlmZjtcbnByb3RvLmVuZE9mICAgICAgICAgICAgID0gZW5kT2Y7XG5wcm90by5mb3JtYXQgICAgICAgICAgICA9IGZvcm1hdDtcbnByb3RvLmZyb20gICAgICAgICAgICAgID0gZnJvbTtcbnByb3RvLmZyb21Ob3cgICAgICAgICAgID0gZnJvbU5vdztcbnByb3RvLnRvICAgICAgICAgICAgICAgID0gdG87XG5wcm90by50b05vdyAgICAgICAgICAgICA9IHRvTm93O1xucHJvdG8uZ2V0ICAgICAgICAgICAgICAgPSBzdHJpbmdHZXQ7XG5wcm90by5pbnZhbGlkQXQgICAgICAgICA9IGludmFsaWRBdDtcbnByb3RvLmlzQWZ0ZXIgICAgICAgICAgID0gaXNBZnRlcjtcbnByb3RvLmlzQmVmb3JlICAgICAgICAgID0gaXNCZWZvcmU7XG5wcm90by5pc0JldHdlZW4gICAgICAgICA9IGlzQmV0d2VlbjtcbnByb3RvLmlzU2FtZSAgICAgICAgICAgID0gaXNTYW1lO1xucHJvdG8uaXNTYW1lT3JBZnRlciAgICAgPSBpc1NhbWVPckFmdGVyO1xucHJvdG8uaXNTYW1lT3JCZWZvcmUgICAgPSBpc1NhbWVPckJlZm9yZTtcbnByb3RvLmlzVmFsaWQgICAgICAgICAgID0gaXNWYWxpZCQyO1xucHJvdG8ubGFuZyAgICAgICAgICAgICAgPSBsYW5nO1xucHJvdG8ubG9jYWxlICAgICAgICAgICAgPSBsb2NhbGU7XG5wcm90by5sb2NhbGVEYXRhICAgICAgICA9IGxvY2FsZURhdGE7XG5wcm90by5tYXggICAgICAgICAgICAgICA9IHByb3RvdHlwZU1heDtcbnByb3RvLm1pbiAgICAgICAgICAgICAgID0gcHJvdG90eXBlTWluO1xucHJvdG8ucGFyc2luZ0ZsYWdzICAgICAgPSBwYXJzaW5nRmxhZ3M7XG5wcm90by5zZXQgICAgICAgICAgICAgICA9IHN0cmluZ1NldDtcbnByb3RvLnN0YXJ0T2YgICAgICAgICAgID0gc3RhcnRPZjtcbnByb3RvLnN1YnRyYWN0ICAgICAgICAgID0gc3VidHJhY3Q7XG5wcm90by50b0FycmF5ICAgICAgICAgICA9IHRvQXJyYXk7XG5wcm90by50b09iamVjdCAgICAgICAgICA9IHRvT2JqZWN0O1xucHJvdG8udG9EYXRlICAgICAgICAgICAgPSB0b0RhdGU7XG5wcm90by50b0lTT1N0cmluZyAgICAgICA9IHRvSVNPU3RyaW5nO1xucHJvdG8uaW5zcGVjdCAgICAgICAgICAgPSBpbnNwZWN0O1xucHJvdG8udG9KU09OICAgICAgICAgICAgPSB0b0pTT047XG5wcm90by50b1N0cmluZyAgICAgICAgICA9IHRvU3RyaW5nO1xucHJvdG8udW5peCAgICAgICAgICAgICAgPSB1bml4O1xucHJvdG8udmFsdWVPZiAgICAgICAgICAgPSB2YWx1ZU9mO1xucHJvdG8uY3JlYXRpb25EYXRhICAgICAgPSBjcmVhdGlvbkRhdGE7XG5wcm90by55ZWFyICAgICAgID0gZ2V0U2V0WWVhcjtcbnByb3RvLmlzTGVhcFllYXIgPSBnZXRJc0xlYXBZZWFyO1xucHJvdG8ud2Vla1llYXIgICAgPSBnZXRTZXRXZWVrWWVhcjtcbnByb3RvLmlzb1dlZWtZZWFyID0gZ2V0U2V0SVNPV2Vla1llYXI7XG5wcm90by5xdWFydGVyID0gcHJvdG8ucXVhcnRlcnMgPSBnZXRTZXRRdWFydGVyO1xucHJvdG8ubW9udGggICAgICAgPSBnZXRTZXRNb250aDtcbnByb3RvLmRheXNJbk1vbnRoID0gZ2V0RGF5c0luTW9udGg7XG5wcm90by53ZWVrICAgICAgICAgICA9IHByb3RvLndlZWtzICAgICAgICA9IGdldFNldFdlZWs7XG5wcm90by5pc29XZWVrICAgICAgICA9IHByb3RvLmlzb1dlZWtzICAgICA9IGdldFNldElTT1dlZWs7XG5wcm90by53ZWVrc0luWWVhciAgICA9IGdldFdlZWtzSW5ZZWFyO1xucHJvdG8uaXNvV2Vla3NJblllYXIgPSBnZXRJU09XZWVrc0luWWVhcjtcbnByb3RvLmRhdGUgICAgICAgPSBnZXRTZXREYXlPZk1vbnRoO1xucHJvdG8uZGF5ICAgICAgICA9IHByb3RvLmRheXMgICAgICAgICAgICAgPSBnZXRTZXREYXlPZldlZWs7XG5wcm90by53ZWVrZGF5ICAgID0gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrO1xucHJvdG8uaXNvV2Vla2RheSA9IGdldFNldElTT0RheU9mV2VlaztcbnByb3RvLmRheU9mWWVhciAgPSBnZXRTZXREYXlPZlllYXI7XG5wcm90by5ob3VyID0gcHJvdG8uaG91cnMgPSBnZXRTZXRIb3VyO1xucHJvdG8ubWludXRlID0gcHJvdG8ubWludXRlcyA9IGdldFNldE1pbnV0ZTtcbnByb3RvLnNlY29uZCA9IHByb3RvLnNlY29uZHMgPSBnZXRTZXRTZWNvbmQ7XG5wcm90by5taWxsaXNlY29uZCA9IHByb3RvLm1pbGxpc2Vjb25kcyA9IGdldFNldE1pbGxpc2Vjb25kO1xucHJvdG8udXRjT2Zmc2V0ICAgICAgICAgICAgPSBnZXRTZXRPZmZzZXQ7XG5wcm90by51dGMgICAgICAgICAgICAgICAgICA9IHNldE9mZnNldFRvVVRDO1xucHJvdG8ubG9jYWwgICAgICAgICAgICAgICAgPSBzZXRPZmZzZXRUb0xvY2FsO1xucHJvdG8ucGFyc2Vab25lICAgICAgICAgICAgPSBzZXRPZmZzZXRUb1BhcnNlZE9mZnNldDtcbnByb3RvLmhhc0FsaWduZWRIb3VyT2Zmc2V0ID0gaGFzQWxpZ25lZEhvdXJPZmZzZXQ7XG5wcm90by5pc0RTVCAgICAgICAgICAgICAgICA9IGlzRGF5bGlnaHRTYXZpbmdUaW1lO1xucHJvdG8uaXNMb2NhbCAgICAgICAgICAgICAgPSBpc0xvY2FsO1xucHJvdG8uaXNVdGNPZmZzZXQgICAgICAgICAgPSBpc1V0Y09mZnNldDtcbnByb3RvLmlzVXRjICAgICAgICAgICAgICAgID0gaXNVdGM7XG5wcm90by5pc1VUQyAgICAgICAgICAgICAgICA9IGlzVXRjO1xucHJvdG8uem9uZUFiYnIgPSBnZXRab25lQWJicjtcbnByb3RvLnpvbmVOYW1lID0gZ2V0Wm9uZU5hbWU7XG5wcm90by5kYXRlcyAgPSBkZXByZWNhdGUoJ2RhdGVzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBkYXRlIGluc3RlYWQuJywgZ2V0U2V0RGF5T2ZNb250aCk7XG5wcm90by5tb250aHMgPSBkZXByZWNhdGUoJ21vbnRocyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgbW9udGggaW5zdGVhZCcsIGdldFNldE1vbnRoKTtcbnByb3RvLnllYXJzICA9IGRlcHJlY2F0ZSgneWVhcnMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIHllYXIgaW5zdGVhZCcsIGdldFNldFllYXIpO1xucHJvdG8uem9uZSAgID0gZGVwcmVjYXRlKCdtb21lbnQoKS56b25lIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQoKS51dGNPZmZzZXQgaW5zdGVhZC4gaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy96b25lLycsIGdldFNldFpvbmUpO1xucHJvdG8uaXNEU1RTaGlmdGVkID0gZGVwcmVjYXRlKCdpc0RTVFNoaWZ0ZWQgaXMgZGVwcmVjYXRlZC4gU2VlIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvZHN0LXNoaWZ0ZWQvIGZvciBtb3JlIGluZm9ybWF0aW9uJywgaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkKTtcblxuZnVuY3Rpb24gY3JlYXRlVW5peCAoaW5wdXQpIHtcbiAgICByZXR1cm4gY3JlYXRlTG9jYWwoaW5wdXQgKiAxMDAwKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSW5ab25lICgpIHtcbiAgICByZXR1cm4gY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5wYXJzZVpvbmUoKTtcbn1cblxuZnVuY3Rpb24gcHJlUGFyc2VQb3N0Rm9ybWF0IChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nO1xufVxuXG52YXIgcHJvdG8kMSA9IExvY2FsZS5wcm90b3R5cGU7XG5cbnByb3RvJDEuY2FsZW5kYXIgICAgICAgID0gY2FsZW5kYXI7XG5wcm90byQxLmxvbmdEYXRlRm9ybWF0ICA9IGxvbmdEYXRlRm9ybWF0O1xucHJvdG8kMS5pbnZhbGlkRGF0ZSAgICAgPSBpbnZhbGlkRGF0ZTtcbnByb3RvJDEub3JkaW5hbCAgICAgICAgID0gb3JkaW5hbDtcbnByb3RvJDEucHJlcGFyc2UgICAgICAgID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xucHJvdG8kMS5wb3N0Zm9ybWF0ICAgICAgPSBwcmVQYXJzZVBvc3RGb3JtYXQ7XG5wcm90byQxLnJlbGF0aXZlVGltZSAgICA9IHJlbGF0aXZlVGltZTtcbnByb3RvJDEucGFzdEZ1dHVyZSAgICAgID0gcGFzdEZ1dHVyZTtcbnByb3RvJDEuc2V0ICAgICAgICAgICAgID0gc2V0O1xuXG5wcm90byQxLm1vbnRocyAgICAgICAgICAgID0gICAgICAgIGxvY2FsZU1vbnRocztcbnByb3RvJDEubW9udGhzU2hvcnQgICAgICAgPSAgICAgICAgbG9jYWxlTW9udGhzU2hvcnQ7XG5wcm90byQxLm1vbnRoc1BhcnNlICAgICAgID0gICAgICAgIGxvY2FsZU1vbnRoc1BhcnNlO1xucHJvdG8kMS5tb250aHNSZWdleCAgICAgICA9IG1vbnRoc1JlZ2V4O1xucHJvdG8kMS5tb250aHNTaG9ydFJlZ2V4ICA9IG1vbnRoc1Nob3J0UmVnZXg7XG5wcm90byQxLndlZWsgPSBsb2NhbGVXZWVrO1xucHJvdG8kMS5maXJzdERheU9mWWVhciA9IGxvY2FsZUZpcnN0RGF5T2ZZZWFyO1xucHJvdG8kMS5maXJzdERheU9mV2VlayA9IGxvY2FsZUZpcnN0RGF5T2ZXZWVrO1xuXG5wcm90byQxLndlZWtkYXlzICAgICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzO1xucHJvdG8kMS53ZWVrZGF5c01pbiAgICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c01pbjtcbnByb3RvJDEud2Vla2RheXNTaG9ydCAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNTaG9ydDtcbnByb3RvJDEud2Vla2RheXNQYXJzZSAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNQYXJzZTtcblxucHJvdG8kMS53ZWVrZGF5c1JlZ2V4ICAgICAgID0gICAgICAgIHdlZWtkYXlzUmVnZXg7XG5wcm90byQxLndlZWtkYXlzU2hvcnRSZWdleCAgPSAgICAgICAgd2Vla2RheXNTaG9ydFJlZ2V4O1xucHJvdG8kMS53ZWVrZGF5c01pblJlZ2V4ICAgID0gICAgICAgIHdlZWtkYXlzTWluUmVnZXg7XG5cbnByb3RvJDEuaXNQTSA9IGxvY2FsZUlzUE07XG5wcm90byQxLm1lcmlkaWVtID0gbG9jYWxlTWVyaWRpZW07XG5cbmZ1bmN0aW9uIGdldCQxIChmb3JtYXQsIGluZGV4LCBmaWVsZCwgc2V0dGVyKSB7XG4gICAgdmFyIGxvY2FsZSA9IGdldExvY2FsZSgpO1xuICAgIHZhciB1dGMgPSBjcmVhdGVVVEMoKS5zZXQoc2V0dGVyLCBpbmRleCk7XG4gICAgcmV0dXJuIGxvY2FsZVtmaWVsZF0odXRjLCBmb3JtYXQpO1xufVxuXG5mdW5jdGlvbiBsaXN0TW9udGhzSW1wbCAoZm9ybWF0LCBpbmRleCwgZmllbGQpIHtcbiAgICBpZiAoaXNOdW1iZXIoZm9ybWF0KSkge1xuICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAnJztcblxuICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBnZXQkMShmb3JtYXQsIGluZGV4LCBmaWVsZCwgJ21vbnRoJyk7XG4gICAgfVxuXG4gICAgdmFyIGk7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgIG91dFtpXSA9IGdldCQxKGZvcm1hdCwgaSwgZmllbGQsICdtb250aCcpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuXG4vLyAoKVxuLy8gKDUpXG4vLyAoZm10LCA1KVxuLy8gKGZtdClcbi8vICh0cnVlKVxuLy8gKHRydWUsIDUpXG4vLyAodHJ1ZSwgZm10LCA1KVxuLy8gKHRydWUsIGZtdClcbmZ1bmN0aW9uIGxpc3RXZWVrZGF5c0ltcGwgKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgZmllbGQpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsZVNvcnRlZCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIGlmIChpc051bWJlcihmb3JtYXQpKSB7XG4gICAgICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtYXQgPSBsb2NhbGVTb3J0ZWQ7XG4gICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICBsb2NhbGVTb3J0ZWQgPSBmYWxzZTtcblxuICAgICAgICBpZiAoaXNOdW1iZXIoZm9ybWF0KSkge1xuICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJyc7XG4gICAgfVxuXG4gICAgdmFyIGxvY2FsZSA9IGdldExvY2FsZSgpLFxuICAgICAgICBzaGlmdCA9IGxvY2FsZVNvcnRlZCA/IGxvY2FsZS5fd2Vlay5kb3cgOiAwO1xuXG4gICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGdldCQxKGZvcm1hdCwgKGluZGV4ICsgc2hpZnQpICUgNywgZmllbGQsICdkYXknKTtcbiAgICB9XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICBvdXRbaV0gPSBnZXQkMShmb3JtYXQsIChpICsgc2hpZnQpICUgNywgZmllbGQsICdkYXknKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gbGlzdE1vbnRocyAoZm9ybWF0LCBpbmRleCkge1xuICAgIHJldHVybiBsaXN0TW9udGhzSW1wbChmb3JtYXQsIGluZGV4LCAnbW9udGhzJyk7XG59XG5cbmZ1bmN0aW9uIGxpc3RNb250aHNTaG9ydCAoZm9ybWF0LCBpbmRleCkge1xuICAgIHJldHVybiBsaXN0TW9udGhzSW1wbChmb3JtYXQsIGluZGV4LCAnbW9udGhzU2hvcnQnKTtcbn1cblxuZnVuY3Rpb24gbGlzdFdlZWtkYXlzIChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgpIHtcbiAgICByZXR1cm4gbGlzdFdlZWtkYXlzSW1wbChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5cycpO1xufVxuXG5mdW5jdGlvbiBsaXN0V2Vla2RheXNTaG9ydCAobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4KSB7XG4gICAgcmV0dXJuIGxpc3RXZWVrZGF5c0ltcGwobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNTaG9ydCcpO1xufVxuXG5mdW5jdGlvbiBsaXN0V2Vla2RheXNNaW4gKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCkge1xuICAgIHJldHVybiBsaXN0V2Vla2RheXNJbXBsKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzTWluJyk7XG59XG5cbmdldFNldEdsb2JhbExvY2FsZSgnZW4nLCB7XG4gICAgZGF5T2ZNb250aE9yZGluYWxQYXJzZTogL1xcZHsxLDJ9KHRofHN0fG5kfHJkKS8sXG4gICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgdmFyIGIgPSBudW1iZXIgJSAxMCxcbiAgICAgICAgICAgIG91dHB1dCA9ICh0b0ludChudW1iZXIgJSAxMDAgLyAxMCkgPT09IDEpID8gJ3RoJyA6XG4gICAgICAgICAgICAoYiA9PT0gMSkgPyAnc3QnIDpcbiAgICAgICAgICAgIChiID09PSAyKSA/ICduZCcgOlxuICAgICAgICAgICAgKGIgPT09IDMpID8gJ3JkJyA6ICd0aCc7XG4gICAgICAgIHJldHVybiBudW1iZXIgKyBvdXRwdXQ7XG4gICAgfVxufSk7XG5cbi8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuaG9va3MubGFuZyA9IGRlcHJlY2F0ZSgnbW9tZW50LmxhbmcgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGUgaW5zdGVhZC4nLCBnZXRTZXRHbG9iYWxMb2NhbGUpO1xuaG9va3MubGFuZ0RhdGEgPSBkZXByZWNhdGUoJ21vbWVudC5sYW5nRGF0YSBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZURhdGEgaW5zdGVhZC4nLCBnZXRMb2NhbGUpO1xuXG52YXIgbWF0aEFicyA9IE1hdGguYWJzO1xuXG5mdW5jdGlvbiBhYnMgKCkge1xuICAgIHZhciBkYXRhICAgICAgICAgICA9IHRoaXMuX2RhdGE7XG5cbiAgICB0aGlzLl9taWxsaXNlY29uZHMgPSBtYXRoQWJzKHRoaXMuX21pbGxpc2Vjb25kcyk7XG4gICAgdGhpcy5fZGF5cyAgICAgICAgID0gbWF0aEFicyh0aGlzLl9kYXlzKTtcbiAgICB0aGlzLl9tb250aHMgICAgICAgPSBtYXRoQWJzKHRoaXMuX21vbnRocyk7XG5cbiAgICBkYXRhLm1pbGxpc2Vjb25kcyAgPSBtYXRoQWJzKGRhdGEubWlsbGlzZWNvbmRzKTtcbiAgICBkYXRhLnNlY29uZHMgICAgICAgPSBtYXRoQWJzKGRhdGEuc2Vjb25kcyk7XG4gICAgZGF0YS5taW51dGVzICAgICAgID0gbWF0aEFicyhkYXRhLm1pbnV0ZXMpO1xuICAgIGRhdGEuaG91cnMgICAgICAgICA9IG1hdGhBYnMoZGF0YS5ob3Vycyk7XG4gICAgZGF0YS5tb250aHMgICAgICAgID0gbWF0aEFicyhkYXRhLm1vbnRocyk7XG4gICAgZGF0YS55ZWFycyAgICAgICAgID0gbWF0aEFicyhkYXRhLnllYXJzKTtcblxuICAgIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBhZGRTdWJ0cmFjdCQxIChkdXJhdGlvbiwgaW5wdXQsIHZhbHVlLCBkaXJlY3Rpb24pIHtcbiAgICB2YXIgb3RoZXIgPSBjcmVhdGVEdXJhdGlvbihpbnB1dCwgdmFsdWUpO1xuXG4gICAgZHVyYXRpb24uX21pbGxpc2Vjb25kcyArPSBkaXJlY3Rpb24gKiBvdGhlci5fbWlsbGlzZWNvbmRzO1xuICAgIGR1cmF0aW9uLl9kYXlzICAgICAgICAgKz0gZGlyZWN0aW9uICogb3RoZXIuX2RheXM7XG4gICAgZHVyYXRpb24uX21vbnRocyAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fbW9udGhzO1xuXG4gICAgcmV0dXJuIGR1cmF0aW9uLl9idWJibGUoKTtcbn1cblxuLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgYWRkKDEsICdzJykgb3IgYWRkKGR1cmF0aW9uKVxuZnVuY3Rpb24gYWRkJDEgKGlucHV0LCB2YWx1ZSkge1xuICAgIHJldHVybiBhZGRTdWJ0cmFjdCQxKHRoaXMsIGlucHV0LCB2YWx1ZSwgMSk7XG59XG5cbi8vIHN1cHBvcnRzIG9ubHkgMi4wLXN0eWxlIHN1YnRyYWN0KDEsICdzJykgb3Igc3VidHJhY3QoZHVyYXRpb24pXG5mdW5jdGlvbiBzdWJ0cmFjdCQxIChpbnB1dCwgdmFsdWUpIHtcbiAgICByZXR1cm4gYWRkU3VidHJhY3QkMSh0aGlzLCBpbnB1dCwgdmFsdWUsIC0xKTtcbn1cblxuZnVuY3Rpb24gYWJzQ2VpbCAobnVtYmVyKSB7XG4gICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBidWJibGUgKCkge1xuICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHM7XG4gICAgdmFyIGRheXMgICAgICAgICA9IHRoaXMuX2RheXM7XG4gICAgdmFyIG1vbnRocyAgICAgICA9IHRoaXMuX21vbnRocztcbiAgICB2YXIgZGF0YSAgICAgICAgID0gdGhpcy5fZGF0YTtcbiAgICB2YXIgc2Vjb25kcywgbWludXRlcywgaG91cnMsIHllYXJzLCBtb250aHNGcm9tRGF5cztcblxuICAgIC8vIGlmIHdlIGhhdmUgYSBtaXggb2YgcG9zaXRpdmUgYW5kIG5lZ2F0aXZlIHZhbHVlcywgYnViYmxlIGRvd24gZmlyc3RcbiAgICAvLyBjaGVjazogaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzIxNjZcbiAgICBpZiAoISgobWlsbGlzZWNvbmRzID49IDAgJiYgZGF5cyA+PSAwICYmIG1vbnRocyA+PSAwKSB8fFxuICAgICAgICAgICAgKG1pbGxpc2Vjb25kcyA8PSAwICYmIGRheXMgPD0gMCAmJiBtb250aHMgPD0gMCkpKSB7XG4gICAgICAgIG1pbGxpc2Vjb25kcyArPSBhYnNDZWlsKG1vbnRoc1RvRGF5cyhtb250aHMpICsgZGF5cykgKiA4NjRlNTtcbiAgICAgICAgZGF5cyA9IDA7XG4gICAgICAgIG1vbnRocyA9IDA7XG4gICAgfVxuXG4gICAgLy8gVGhlIGZvbGxvd2luZyBjb2RlIGJ1YmJsZXMgdXAgdmFsdWVzLCBzZWUgdGhlIHRlc3RzIGZvclxuICAgIC8vIGV4YW1wbGVzIG9mIHdoYXQgdGhhdCBtZWFucy5cbiAgICBkYXRhLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcyAlIDEwMDA7XG5cbiAgICBzZWNvbmRzICAgICAgICAgICA9IGFic0Zsb29yKG1pbGxpc2Vjb25kcyAvIDEwMDApO1xuICAgIGRhdGEuc2Vjb25kcyAgICAgID0gc2Vjb25kcyAlIDYwO1xuXG4gICAgbWludXRlcyAgICAgICAgICAgPSBhYnNGbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGRhdGEubWludXRlcyAgICAgID0gbWludXRlcyAlIDYwO1xuXG4gICAgaG91cnMgICAgICAgICAgICAgPSBhYnNGbG9vcihtaW51dGVzIC8gNjApO1xuICAgIGRhdGEuaG91cnMgICAgICAgID0gaG91cnMgJSAyNDtcblxuICAgIGRheXMgKz0gYWJzRmxvb3IoaG91cnMgLyAyNCk7XG5cbiAgICAvLyBjb252ZXJ0IGRheXMgdG8gbW9udGhzXG4gICAgbW9udGhzRnJvbURheXMgPSBhYnNGbG9vcihkYXlzVG9Nb250aHMoZGF5cykpO1xuICAgIG1vbnRocyArPSBtb250aHNGcm9tRGF5cztcbiAgICBkYXlzIC09IGFic0NlaWwobW9udGhzVG9EYXlzKG1vbnRoc0Zyb21EYXlzKSk7XG5cbiAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgeWVhcnMgPSBhYnNGbG9vcihtb250aHMgLyAxMik7XG4gICAgbW9udGhzICU9IDEyO1xuXG4gICAgZGF0YS5kYXlzICAgPSBkYXlzO1xuICAgIGRhdGEubW9udGhzID0gbW9udGhzO1xuICAgIGRhdGEueWVhcnMgID0geWVhcnM7XG5cbiAgICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gZGF5c1RvTW9udGhzIChkYXlzKSB7XG4gICAgLy8gNDAwIHllYXJzIGhhdmUgMTQ2MDk3IGRheXMgKHRha2luZyBpbnRvIGFjY291bnQgbGVhcCB5ZWFyIHJ1bGVzKVxuICAgIC8vIDQwMCB5ZWFycyBoYXZlIDEyIG1vbnRocyA9PT0gNDgwMFxuICAgIHJldHVybiBkYXlzICogNDgwMCAvIDE0NjA5Nztcbn1cblxuZnVuY3Rpb24gbW9udGhzVG9EYXlzIChtb250aHMpIHtcbiAgICAvLyB0aGUgcmV2ZXJzZSBvZiBkYXlzVG9Nb250aHNcbiAgICByZXR1cm4gbW9udGhzICogMTQ2MDk3IC8gNDgwMDtcbn1cblxuZnVuY3Rpb24gYXMgKHVuaXRzKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gTmFOO1xuICAgIH1cbiAgICB2YXIgZGF5cztcbiAgICB2YXIgbW9udGhzO1xuICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHM7XG5cbiAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcblxuICAgIGlmICh1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgIGRheXMgICA9IHRoaXMuX2RheXMgICArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICBtb250aHMgPSB0aGlzLl9tb250aHMgKyBkYXlzVG9Nb250aHMoZGF5cyk7XG4gICAgICAgIHJldHVybiB1bml0cyA9PT0gJ21vbnRoJyA/IG1vbnRocyA6IG1vbnRocyAvIDEyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGhhbmRsZSBtaWxsaXNlY29uZHMgc2VwYXJhdGVseSBiZWNhdXNlIG9mIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIChpc3N1ZSAjMTg2NylcbiAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyBNYXRoLnJvdW5kKG1vbnRoc1RvRGF5cyh0aGlzLl9tb250aHMpKTtcbiAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgY2FzZSAnd2VlaycgICA6IHJldHVybiBkYXlzIC8gNyAgICAgKyBtaWxsaXNlY29uZHMgLyA2MDQ4ZTU7XG4gICAgICAgICAgICBjYXNlICdkYXknICAgIDogcmV0dXJuIGRheXMgICAgICAgICArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgY2FzZSAnaG91cicgICA6IHJldHVybiBkYXlzICogMjQgICAgKyBtaWxsaXNlY29uZHMgLyAzNmU1O1xuICAgICAgICAgICAgY2FzZSAnbWludXRlJyA6IHJldHVybiBkYXlzICogMTQ0MCAgKyBtaWxsaXNlY29uZHMgLyA2ZTQ7XG4gICAgICAgICAgICBjYXNlICdzZWNvbmQnIDogcmV0dXJuIGRheXMgKiA4NjQwMCArIG1pbGxpc2Vjb25kcyAvIDEwMDA7XG4gICAgICAgICAgICAvLyBNYXRoLmZsb29yIHByZXZlbnRzIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIGhlcmVcbiAgICAgICAgICAgIGNhc2UgJ21pbGxpc2Vjb25kJzogcmV0dXJuIE1hdGguZmxvb3IoZGF5cyAqIDg2NGU1KSArIG1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignVW5rbm93biB1bml0ICcgKyB1bml0cyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIFRPRE86IFVzZSB0aGlzLmFzKCdtcycpP1xuZnVuY3Rpb24gdmFsdWVPZiQxICgpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiBOYU47XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyArXG4gICAgICAgIHRoaXMuX2RheXMgKiA4NjRlNSArXG4gICAgICAgICh0aGlzLl9tb250aHMgJSAxMikgKiAyNTkyZTYgK1xuICAgICAgICB0b0ludCh0aGlzLl9tb250aHMgLyAxMikgKiAzMTUzNmU2XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gbWFrZUFzIChhbGlhcykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKGFsaWFzKTtcbiAgICB9O1xufVxuXG52YXIgYXNNaWxsaXNlY29uZHMgPSBtYWtlQXMoJ21zJyk7XG52YXIgYXNTZWNvbmRzICAgICAgPSBtYWtlQXMoJ3MnKTtcbnZhciBhc01pbnV0ZXMgICAgICA9IG1ha2VBcygnbScpO1xudmFyIGFzSG91cnMgICAgICAgID0gbWFrZUFzKCdoJyk7XG52YXIgYXNEYXlzICAgICAgICAgPSBtYWtlQXMoJ2QnKTtcbnZhciBhc1dlZWtzICAgICAgICA9IG1ha2VBcygndycpO1xudmFyIGFzTW9udGhzICAgICAgID0gbWFrZUFzKCdNJyk7XG52YXIgYXNZZWFycyAgICAgICAgPSBtYWtlQXMoJ3knKTtcblxuZnVuY3Rpb24gY2xvbmUkMSAoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUR1cmF0aW9uKHRoaXMpO1xufVxuXG5mdW5jdGlvbiBnZXQkMiAodW5pdHMpIHtcbiAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzW3VuaXRzICsgJ3MnXSgpIDogTmFOO1xufVxuXG5mdW5jdGlvbiBtYWtlR2V0dGVyKG5hbWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzLl9kYXRhW25hbWVdIDogTmFOO1xuICAgIH07XG59XG5cbnZhciBtaWxsaXNlY29uZHMgPSBtYWtlR2V0dGVyKCdtaWxsaXNlY29uZHMnKTtcbnZhciBzZWNvbmRzICAgICAgPSBtYWtlR2V0dGVyKCdzZWNvbmRzJyk7XG52YXIgbWludXRlcyAgICAgID0gbWFrZUdldHRlcignbWludXRlcycpO1xudmFyIGhvdXJzICAgICAgICA9IG1ha2VHZXR0ZXIoJ2hvdXJzJyk7XG52YXIgZGF5cyAgICAgICAgID0gbWFrZUdldHRlcignZGF5cycpO1xudmFyIG1vbnRocyAgICAgICA9IG1ha2VHZXR0ZXIoJ21vbnRocycpO1xudmFyIHllYXJzICAgICAgICA9IG1ha2VHZXR0ZXIoJ3llYXJzJyk7XG5cbmZ1bmN0aW9uIHdlZWtzICgpIHtcbiAgICByZXR1cm4gYWJzRmxvb3IodGhpcy5kYXlzKCkgLyA3KTtcbn1cblxudmFyIHJvdW5kID0gTWF0aC5yb3VuZDtcbnZhciB0aHJlc2hvbGRzID0ge1xuICAgIHNzOiA0NCwgICAgICAgICAvLyBhIGZldyBzZWNvbmRzIHRvIHNlY29uZHNcbiAgICBzIDogNDUsICAgICAgICAgLy8gc2Vjb25kcyB0byBtaW51dGVcbiAgICBtIDogNDUsICAgICAgICAgLy8gbWludXRlcyB0byBob3VyXG4gICAgaCA6IDIyLCAgICAgICAgIC8vIGhvdXJzIHRvIGRheVxuICAgIGQgOiAyNiwgICAgICAgICAvLyBkYXlzIHRvIG1vbnRoXG4gICAgTSA6IDExICAgICAgICAgIC8vIG1vbnRocyB0byB5ZWFyXG59O1xuXG4vLyBoZWxwZXIgZnVuY3Rpb24gZm9yIG1vbWVudC5mbi5mcm9tLCBtb21lbnQuZm4uZnJvbU5vdywgYW5kIG1vbWVudC5kdXJhdGlvbi5mbi5odW1hbml6ZVxuZnVuY3Rpb24gc3Vic3RpdHV0ZVRpbWVBZ28oc3RyaW5nLCBudW1iZXIsIHdpdGhvdXRTdWZmaXgsIGlzRnV0dXJlLCBsb2NhbGUpIHtcbiAgICByZXR1cm4gbG9jYWxlLnJlbGF0aXZlVGltZShudW1iZXIgfHwgMSwgISF3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKTtcbn1cblxuZnVuY3Rpb24gcmVsYXRpdmVUaW1lJDEgKHBvc05lZ0R1cmF0aW9uLCB3aXRob3V0U3VmZml4LCBsb2NhbGUpIHtcbiAgICB2YXIgZHVyYXRpb24gPSBjcmVhdGVEdXJhdGlvbihwb3NOZWdEdXJhdGlvbikuYWJzKCk7XG4gICAgdmFyIHNlY29uZHMgID0gcm91bmQoZHVyYXRpb24uYXMoJ3MnKSk7XG4gICAgdmFyIG1pbnV0ZXMgID0gcm91bmQoZHVyYXRpb24uYXMoJ20nKSk7XG4gICAgdmFyIGhvdXJzICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ2gnKSk7XG4gICAgdmFyIGRheXMgICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ2QnKSk7XG4gICAgdmFyIG1vbnRocyAgID0gcm91bmQoZHVyYXRpb24uYXMoJ00nKSk7XG4gICAgdmFyIHllYXJzICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ3knKSk7XG5cbiAgICB2YXIgYSA9IHNlY29uZHMgPD0gdGhyZXNob2xkcy5zcyAmJiBbJ3MnLCBzZWNvbmRzXSAgfHxcbiAgICAgICAgICAgIHNlY29uZHMgPCB0aHJlc2hvbGRzLnMgICAmJiBbJ3NzJywgc2Vjb25kc10gfHxcbiAgICAgICAgICAgIG1pbnV0ZXMgPD0gMSAgICAgICAgICAgICAmJiBbJ20nXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgIG1pbnV0ZXMgPCB0aHJlc2hvbGRzLm0gICAmJiBbJ21tJywgbWludXRlc10gfHxcbiAgICAgICAgICAgIGhvdXJzICAgPD0gMSAgICAgICAgICAgICAmJiBbJ2gnXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgIGhvdXJzICAgPCB0aHJlc2hvbGRzLmggICAmJiBbJ2hoJywgaG91cnNdICAgfHxcbiAgICAgICAgICAgIGRheXMgICAgPD0gMSAgICAgICAgICAgICAmJiBbJ2QnXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgIGRheXMgICAgPCB0aHJlc2hvbGRzLmQgICAmJiBbJ2RkJywgZGF5c10gICAgfHxcbiAgICAgICAgICAgIG1vbnRocyAgPD0gMSAgICAgICAgICAgICAmJiBbJ00nXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgIG1vbnRocyAgPCB0aHJlc2hvbGRzLk0gICAmJiBbJ01NJywgbW9udGhzXSAgfHxcbiAgICAgICAgICAgIHllYXJzICAgPD0gMSAgICAgICAgICAgICAmJiBbJ3knXSAgICAgICAgICAgfHwgWyd5eScsIHllYXJzXTtcblxuICAgIGFbMl0gPSB3aXRob3V0U3VmZml4O1xuICAgIGFbM10gPSArcG9zTmVnRHVyYXRpb24gPiAwO1xuICAgIGFbNF0gPSBsb2NhbGU7XG4gICAgcmV0dXJuIHN1YnN0aXR1dGVUaW1lQWdvLmFwcGx5KG51bGwsIGEpO1xufVxuXG4vLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0IHRoZSByb3VuZGluZyBmdW5jdGlvbiBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG5mdW5jdGlvbiBnZXRTZXRSZWxhdGl2ZVRpbWVSb3VuZGluZyAocm91bmRpbmdGdW5jdGlvbikge1xuICAgIGlmIChyb3VuZGluZ0Z1bmN0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHJvdW5kO1xuICAgIH1cbiAgICBpZiAodHlwZW9mKHJvdW5kaW5nRnVuY3Rpb24pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJvdW5kID0gcm91bmRpbmdGdW5jdGlvbjtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCBhIHRocmVzaG9sZCBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG5mdW5jdGlvbiBnZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQgKHRocmVzaG9sZCwgbGltaXQpIHtcbiAgICBpZiAodGhyZXNob2xkc1t0aHJlc2hvbGRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAobGltaXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhyZXNob2xkc1t0aHJlc2hvbGRdO1xuICAgIH1cbiAgICB0aHJlc2hvbGRzW3RocmVzaG9sZF0gPSBsaW1pdDtcbiAgICBpZiAodGhyZXNob2xkID09PSAncycpIHtcbiAgICAgICAgdGhyZXNob2xkcy5zcyA9IGxpbWl0IC0gMTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGh1bWFuaXplICh3aXRoU3VmZml4KSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICB9XG5cbiAgICB2YXIgbG9jYWxlID0gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgdmFyIG91dHB1dCA9IHJlbGF0aXZlVGltZSQxKHRoaXMsICF3aXRoU3VmZml4LCBsb2NhbGUpO1xuXG4gICAgaWYgKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgb3V0cHV0ID0gbG9jYWxlLnBhc3RGdXR1cmUoK3RoaXMsIG91dHB1dCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxvY2FsZS5wb3N0Zm9ybWF0KG91dHB1dCk7XG59XG5cbnZhciBhYnMkMSA9IE1hdGguYWJzO1xuXG5mdW5jdGlvbiBzaWduKHgpIHtcbiAgICByZXR1cm4gKCh4ID4gMCkgLSAoeCA8IDApKSB8fCAreDtcbn1cblxuZnVuY3Rpb24gdG9JU09TdHJpbmckMSgpIHtcbiAgICAvLyBmb3IgSVNPIHN0cmluZ3Mgd2UgZG8gbm90IHVzZSB0aGUgbm9ybWFsIGJ1YmJsaW5nIHJ1bGVzOlxuICAgIC8vICAqIG1pbGxpc2Vjb25kcyBidWJibGUgdXAgdW50aWwgdGhleSBiZWNvbWUgaG91cnNcbiAgICAvLyAgKiBkYXlzIGRvIG5vdCBidWJibGUgYXQgYWxsXG4gICAgLy8gICogbW9udGhzIGJ1YmJsZSB1cCB1bnRpbCB0aGV5IGJlY29tZSB5ZWFyc1xuICAgIC8vIFRoaXMgaXMgYmVjYXVzZSB0aGVyZSBpcyBubyBjb250ZXh0LWZyZWUgY29udmVyc2lvbiBiZXR3ZWVuIGhvdXJzIGFuZCBkYXlzXG4gICAgLy8gKHRoaW5rIG9mIGNsb2NrIGNoYW5nZXMpXG4gICAgLy8gYW5kIGFsc28gbm90IGJldHdlZW4gZGF5cyBhbmQgbW9udGhzICgyOC0zMSBkYXlzIHBlciBtb250aClcbiAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgIH1cblxuICAgIHZhciBzZWNvbmRzID0gYWJzJDEodGhpcy5fbWlsbGlzZWNvbmRzKSAvIDEwMDA7XG4gICAgdmFyIGRheXMgICAgICAgICA9IGFicyQxKHRoaXMuX2RheXMpO1xuICAgIHZhciBtb250aHMgICAgICAgPSBhYnMkMSh0aGlzLl9tb250aHMpO1xuICAgIHZhciBtaW51dGVzLCBob3VycywgeWVhcnM7XG5cbiAgICAvLyAzNjAwIHNlY29uZHMgLT4gNjAgbWludXRlcyAtPiAxIGhvdXJcbiAgICBtaW51dGVzICAgICAgICAgICA9IGFic0Zsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgaG91cnMgICAgICAgICAgICAgPSBhYnNGbG9vcihtaW51dGVzIC8gNjApO1xuICAgIHNlY29uZHMgJT0gNjA7XG4gICAgbWludXRlcyAlPSA2MDtcblxuICAgIC8vIDEyIG1vbnRocyAtPiAxIHllYXJcbiAgICB5ZWFycyAgPSBhYnNGbG9vcihtb250aHMgLyAxMik7XG4gICAgbW9udGhzICU9IDEyO1xuXG5cbiAgICAvLyBpbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vZG9yZGlsbGUvbW9tZW50LWlzb2R1cmF0aW9uL2Jsb2IvbWFzdGVyL21vbWVudC5pc29kdXJhdGlvbi5qc1xuICAgIHZhciBZID0geWVhcnM7XG4gICAgdmFyIE0gPSBtb250aHM7XG4gICAgdmFyIEQgPSBkYXlzO1xuICAgIHZhciBoID0gaG91cnM7XG4gICAgdmFyIG0gPSBtaW51dGVzO1xuICAgIHZhciBzID0gc2Vjb25kcyA/IHNlY29uZHMudG9GaXhlZCgzKS5yZXBsYWNlKC9cXC4/MCskLywgJycpIDogJyc7XG4gICAgdmFyIHRvdGFsID0gdGhpcy5hc1NlY29uZHMoKTtcblxuICAgIGlmICghdG90YWwpIHtcbiAgICAgICAgLy8gdGhpcyBpcyB0aGUgc2FtZSBhcyBDIydzIChOb2RhKSBhbmQgcHl0aG9uIChpc29kYXRlKS4uLlxuICAgICAgICAvLyBidXQgbm90IG90aGVyIEpTIChnb29nLmRhdGUpXG4gICAgICAgIHJldHVybiAnUDBEJztcbiAgICB9XG5cbiAgICB2YXIgdG90YWxTaWduID0gdG90YWwgPCAwID8gJy0nIDogJyc7XG4gICAgdmFyIHltU2lnbiA9IHNpZ24odGhpcy5fbW9udGhzKSAhPT0gc2lnbih0b3RhbCkgPyAnLScgOiAnJztcbiAgICB2YXIgZGF5c1NpZ24gPSBzaWduKHRoaXMuX2RheXMpICE9PSBzaWduKHRvdGFsKSA/ICctJyA6ICcnO1xuICAgIHZhciBobXNTaWduID0gc2lnbih0aGlzLl9taWxsaXNlY29uZHMpICE9PSBzaWduKHRvdGFsKSA/ICctJyA6ICcnO1xuXG4gICAgcmV0dXJuIHRvdGFsU2lnbiArICdQJyArXG4gICAgICAgIChZID8geW1TaWduICsgWSArICdZJyA6ICcnKSArXG4gICAgICAgIChNID8geW1TaWduICsgTSArICdNJyA6ICcnKSArXG4gICAgICAgIChEID8gZGF5c1NpZ24gKyBEICsgJ0QnIDogJycpICtcbiAgICAgICAgKChoIHx8IG0gfHwgcykgPyAnVCcgOiAnJykgK1xuICAgICAgICAoaCA/IGhtc1NpZ24gKyBoICsgJ0gnIDogJycpICtcbiAgICAgICAgKG0gPyBobXNTaWduICsgbSArICdNJyA6ICcnKSArXG4gICAgICAgIChzID8gaG1zU2lnbiArIHMgKyAnUycgOiAnJyk7XG59XG5cbnZhciBwcm90byQyID0gRHVyYXRpb24ucHJvdG90eXBlO1xuXG5wcm90byQyLmlzVmFsaWQgICAgICAgID0gaXNWYWxpZCQxO1xucHJvdG8kMi5hYnMgICAgICAgICAgICA9IGFicztcbnByb3RvJDIuYWRkICAgICAgICAgICAgPSBhZGQkMTtcbnByb3RvJDIuc3VidHJhY3QgICAgICAgPSBzdWJ0cmFjdCQxO1xucHJvdG8kMi5hcyAgICAgICAgICAgICA9IGFzO1xucHJvdG8kMi5hc01pbGxpc2Vjb25kcyA9IGFzTWlsbGlzZWNvbmRzO1xucHJvdG8kMi5hc1NlY29uZHMgICAgICA9IGFzU2Vjb25kcztcbnByb3RvJDIuYXNNaW51dGVzICAgICAgPSBhc01pbnV0ZXM7XG5wcm90byQyLmFzSG91cnMgICAgICAgID0gYXNIb3VycztcbnByb3RvJDIuYXNEYXlzICAgICAgICAgPSBhc0RheXM7XG5wcm90byQyLmFzV2Vla3MgICAgICAgID0gYXNXZWVrcztcbnByb3RvJDIuYXNNb250aHMgICAgICAgPSBhc01vbnRocztcbnByb3RvJDIuYXNZZWFycyAgICAgICAgPSBhc1llYXJzO1xucHJvdG8kMi52YWx1ZU9mICAgICAgICA9IHZhbHVlT2YkMTtcbnByb3RvJDIuX2J1YmJsZSAgICAgICAgPSBidWJibGU7XG5wcm90byQyLmNsb25lICAgICAgICAgID0gY2xvbmUkMTtcbnByb3RvJDIuZ2V0ICAgICAgICAgICAgPSBnZXQkMjtcbnByb3RvJDIubWlsbGlzZWNvbmRzICAgPSBtaWxsaXNlY29uZHM7XG5wcm90byQyLnNlY29uZHMgICAgICAgID0gc2Vjb25kcztcbnByb3RvJDIubWludXRlcyAgICAgICAgPSBtaW51dGVzO1xucHJvdG8kMi5ob3VycyAgICAgICAgICA9IGhvdXJzO1xucHJvdG8kMi5kYXlzICAgICAgICAgICA9IGRheXM7XG5wcm90byQyLndlZWtzICAgICAgICAgID0gd2Vla3M7XG5wcm90byQyLm1vbnRocyAgICAgICAgID0gbW9udGhzO1xucHJvdG8kMi55ZWFycyAgICAgICAgICA9IHllYXJzO1xucHJvdG8kMi5odW1hbml6ZSAgICAgICA9IGh1bWFuaXplO1xucHJvdG8kMi50b0lTT1N0cmluZyAgICA9IHRvSVNPU3RyaW5nJDE7XG5wcm90byQyLnRvU3RyaW5nICAgICAgID0gdG9JU09TdHJpbmckMTtcbnByb3RvJDIudG9KU09OICAgICAgICAgPSB0b0lTT1N0cmluZyQxO1xucHJvdG8kMi5sb2NhbGUgICAgICAgICA9IGxvY2FsZTtcbnByb3RvJDIubG9jYWxlRGF0YSAgICAgPSBsb2NhbGVEYXRhO1xuXG5wcm90byQyLnRvSXNvU3RyaW5nID0gZGVwcmVjYXRlKCd0b0lzb1N0cmluZygpIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdG9JU09TdHJpbmcoKSBpbnN0ZWFkIChub3RpY2UgdGhlIGNhcGl0YWxzKScsIHRvSVNPU3RyaW5nJDEpO1xucHJvdG8kMi5sYW5nID0gbGFuZztcblxuLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuXG4vLyBGT1JNQVRUSU5HXG5cbmFkZEZvcm1hdFRva2VuKCdYJywgMCwgMCwgJ3VuaXgnKTtcbmFkZEZvcm1hdFRva2VuKCd4JywgMCwgMCwgJ3ZhbHVlT2YnKTtcblxuLy8gUEFSU0lOR1xuXG5hZGRSZWdleFRva2VuKCd4JywgbWF0Y2hTaWduZWQpO1xuYWRkUmVnZXhUb2tlbignWCcsIG1hdGNoVGltZXN0YW1wKTtcbmFkZFBhcnNlVG9rZW4oJ1gnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGlucHV0LCAxMCkgKiAxMDAwKTtcbn0pO1xuYWRkUGFyc2VUb2tlbigneCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHRvSW50KGlucHV0KSk7XG59KTtcblxuLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuXG5cbmhvb2tzLnZlcnNpb24gPSAnMi4yMS4wJztcblxuc2V0SG9va0NhbGxiYWNrKGNyZWF0ZUxvY2FsKTtcblxuaG9va3MuZm4gICAgICAgICAgICAgICAgICAgID0gcHJvdG87XG5ob29rcy5taW4gICAgICAgICAgICAgICAgICAgPSBtaW47XG5ob29rcy5tYXggICAgICAgICAgICAgICAgICAgPSBtYXg7XG5ob29rcy5ub3cgICAgICAgICAgICAgICAgICAgPSBub3c7XG5ob29rcy51dGMgICAgICAgICAgICAgICAgICAgPSBjcmVhdGVVVEM7XG5ob29rcy51bml4ICAgICAgICAgICAgICAgICAgPSBjcmVhdGVVbml4O1xuaG9va3MubW9udGhzICAgICAgICAgICAgICAgID0gbGlzdE1vbnRocztcbmhvb2tzLmlzRGF0ZSAgICAgICAgICAgICAgICA9IGlzRGF0ZTtcbmhvb2tzLmxvY2FsZSAgICAgICAgICAgICAgICA9IGdldFNldEdsb2JhbExvY2FsZTtcbmhvb2tzLmludmFsaWQgICAgICAgICAgICAgICA9IGNyZWF0ZUludmFsaWQ7XG5ob29rcy5kdXJhdGlvbiAgICAgICAgICAgICAgPSBjcmVhdGVEdXJhdGlvbjtcbmhvb2tzLmlzTW9tZW50ICAgICAgICAgICAgICA9IGlzTW9tZW50O1xuaG9va3Mud2Vla2RheXMgICAgICAgICAgICAgID0gbGlzdFdlZWtkYXlzO1xuaG9va3MucGFyc2Vab25lICAgICAgICAgICAgID0gY3JlYXRlSW5ab25lO1xuaG9va3MubG9jYWxlRGF0YSAgICAgICAgICAgID0gZ2V0TG9jYWxlO1xuaG9va3MuaXNEdXJhdGlvbiAgICAgICAgICAgID0gaXNEdXJhdGlvbjtcbmhvb2tzLm1vbnRoc1Nob3J0ICAgICAgICAgICA9IGxpc3RNb250aHNTaG9ydDtcbmhvb2tzLndlZWtkYXlzTWluICAgICAgICAgICA9IGxpc3RXZWVrZGF5c01pbjtcbmhvb2tzLmRlZmluZUxvY2FsZSAgICAgICAgICA9IGRlZmluZUxvY2FsZTtcbmhvb2tzLnVwZGF0ZUxvY2FsZSAgICAgICAgICA9IHVwZGF0ZUxvY2FsZTtcbmhvb2tzLmxvY2FsZXMgICAgICAgICAgICAgICA9IGxpc3RMb2NhbGVzO1xuaG9va3Mud2Vla2RheXNTaG9ydCAgICAgICAgID0gbGlzdFdlZWtkYXlzU2hvcnQ7XG5ob29rcy5ub3JtYWxpemVVbml0cyAgICAgICAgPSBub3JtYWxpemVVbml0cztcbmhvb2tzLnJlbGF0aXZlVGltZVJvdW5kaW5nICA9IGdldFNldFJlbGF0aXZlVGltZVJvdW5kaW5nO1xuaG9va3MucmVsYXRpdmVUaW1lVGhyZXNob2xkID0gZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkO1xuaG9va3MuY2FsZW5kYXJGb3JtYXQgICAgICAgID0gZ2V0Q2FsZW5kYXJGb3JtYXQ7XG5ob29rcy5wcm90b3R5cGUgICAgICAgICAgICAgPSBwcm90bztcblxuLy8gY3VycmVudGx5IEhUTUw1IGlucHV0IHR5cGUgb25seSBzdXBwb3J0cyAyNC1ob3VyIGZvcm1hdHNcbmhvb2tzLkhUTUw1X0ZNVCA9IHtcbiAgICBEQVRFVElNRV9MT0NBTDogJ1lZWVktTU0tRERUSEg6bW0nLCAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cImRhdGV0aW1lLWxvY2FsXCIgLz5cbiAgICBEQVRFVElNRV9MT0NBTF9TRUNPTkRTOiAnWVlZWS1NTS1ERFRISDptbTpzcycsICAvLyA8aW5wdXQgdHlwZT1cImRhdGV0aW1lLWxvY2FsXCIgc3RlcD1cIjFcIiAvPlxuICAgIERBVEVUSU1FX0xPQ0FMX01TOiAnWVlZWS1NTS1ERFRISDptbTpzcy5TU1MnLCAgIC8vIDxpbnB1dCB0eXBlPVwiZGF0ZXRpbWUtbG9jYWxcIiBzdGVwPVwiMC4wMDFcIiAvPlxuICAgIERBVEU6ICdZWVlZLU1NLUREJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIC8+XG4gICAgVElNRTogJ0hIOm1tJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJ0aW1lXCIgLz5cbiAgICBUSU1FX1NFQ09ORFM6ICdISDptbTpzcycsICAgICAgICAgICAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cInRpbWVcIiBzdGVwPVwiMVwiIC8+XG4gICAgVElNRV9NUzogJ0hIOm1tOnNzLlNTUycsICAgICAgICAgICAgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJ0aW1lXCIgc3RlcD1cIjAuMDAxXCIgLz5cbiAgICBXRUVLOiAnWVlZWS1bV11XVycsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cIndlZWtcIiAvPlxuICAgIE1PTlRIOiAnWVlZWS1NTScgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwibW9udGhcIiAvPlxufTtcblxucmV0dXJuIGhvb2tzO1xuXG59KSkpO1xuIiwiY29uc3QgcHJlZml4ID0gJ21jLWF1dG8tY29tcGxldGUnO1xuXG5jbGFzcyBBdXRvQ29tcGxldGUge1xuICBjb25zdHJ1Y3Rvcihkb20sIG9wdGlvbnMpIHtcbiAgICB0aGlzLmF1dG9Db21wbGV0ZSA9ICQoZG9tKTtcblxuICAgIHRoaXMudGV4dENvbnRhaW5lckRvbSA9IHRoaXMuYXV0b0NvbXBsZXRlLmZpbmQoYC4ke3ByZWZpeH0tdGV4dC1jb250YWluZXJgKTtcbiAgICB0aGlzLnRleHRJbnB1dERvbSA9IHRoaXMudGV4dENvbnRhaW5lckRvbS5maW5kKGAuJHtwcmVmaXh9LXRleHRgKTtcbiAgICB0aGlzLnZhbHVlSW5wdXREb20gPSB0aGlzLnRleHRDb250YWluZXJEb20uZmluZChgLiR7cHJlZml4fS12YWx1ZWApO1xuXG4gICAgdGhpcy5vcHRpb25Db250YWluZXJEb20gPSB0aGlzLmF1dG9Db21wbGV0ZS5maW5kKGAuJHtwcmVmaXh9LW9wdGlvbi1jb250YWluZXJgKTtcbiAgICB0aGlzLm9wdGlvbkRvbXMgPSB0aGlzLmF1dG9Db21wbGV0ZS5maW5kKGAuJHtwcmVmaXh9LW9wdGlvbmApO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT57XG4gICAgICB0aGlzLmF1dG9Db21wbGV0ZS5yZW1vdmVDbGFzcygnc2hvdycpO1xuICAgIH0sIGZhbHNlKVxuXG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcblxuICAgIHRoaXMua2V5d29yZCA9ICcnO1xuICB9XG5cbiAgaGFuZGxlVG9nZ2xlKGUpIHtcbiAgICB0aGlzLmF1dG9Db21wbGV0ZS50b2dnbGVDbGFzcygnc2hvdycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZUlucHV0KGUpIHtcbiAgICBsZXQgdmFsdWUgPSAkKGUudGFyZ2V0KS52YWwoKTtcbiAgICB0aGlzLnZhbHVlSW5wdXREb20udmFsKHZhbHVlKTtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuYXV0b0NvbXBsZXRlLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH1cbiAgICB0aGlzLmtleXdvcmQgPSB2YWx1ZTtcbiAgICB0aGlzLnJlbmRlck9wdGlvbnMoKTtcbiAgfVxuXG4gIGhhbmRsZVNlbGVjdChlKSB7XG4gICAgbGV0IHZhbHVlID0gJChlLnRhcmdldCkuYXR0cignZGF0YS12YWx1ZScpO1xuICAgIGxldCB0ZXh0ID0gJChlLnRhcmdldCkudGV4dCgpO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5hdXRvQ29tcGxldGUucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgICAgIHRoaXMudGV4dElucHV0RG9tLnZhbCh0ZXh0KTtcbiAgICAgIHRoaXMudmFsdWVJbnB1dERvbS52YWwodmFsdWUpO1xuICAgICAgdGhpcy52YWx1ZUlucHV0RG9tLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgdGhpcy5hdXRvQ29tcGxldGUudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfVxuICAgIHRoaXMua2V5d29yZCA9IHZhbHVlO1xuICAgIHRoaXMucmVuZGVyT3B0aW9ucygpO1xuICB9XG5cbiAgcmVuZGVyT3B0aW9ucygpIHtcbiAgICBsZXQgb3B0aW9uRG9tcyA9ICQuZ3JlcCh0aGlzLm9wdGlvbkRvbXMsIGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuICQoaXRlbSkudGV4dCgpLm1hdGNoKHRoaXMua2V5d29yZCk7XG4gICAgfSk7XG4gICAgdGhpcy5vcHRpb25Db250YWluZXJEb20uaHRtbChvcHRpb25Eb21zKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhZGRMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy50ZXh0SW5wdXREb20ub24oJ2lucHV0JywgdGhpcy5oYW5kbGVJbnB1dC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnRleHRDb250YWluZXJEb20ub24oJ2NsaWNrJywgdGhpcy5oYW5kbGVUb2dnbGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5vcHRpb25Db250YWluZXJEb20ub24oJ2NsaWNrJywgdGhpcy5oYW5kbGVTZWxlY3QuYmluZCh0aGlzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRvQ29tcGxldGU7XG4iLCJjb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcbmNvbnN0IGxhbmdzID0gcmVxdWlyZSgnLi9sYW5ncycpO1xuY29uc3QgcHJlZml4ID0gJ21jLWNhbGVuZGFyJztcblxuY29uc3QgY2FsZW5kYXJzID0gJChgLiR7cHJlZml4fWApO1xuXG5mdW5jdGlvbiBnZXRQb3BIdG1sKG9wdGlvbnMpIHtcbiAgbGV0IGRheU5hbWVzID0gbGFuZ3Nbb3B0aW9ucy5sYW5nXS5kYXlOYW1lcztcbiAgbGV0IGNvbmZpcm1OYW1lID0gbGFuZ3Nbb3B0aW9ucy5sYW5nXS5jb25maXJtTmFtZTtcbiAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwibWMtY2FsZW5kYXItcG9wXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1jLWNhbGVuZGFyLXBvcC1oZWFkZXJcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibWMtY2FsZW5kYXItcG9wLWJvZHlcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYy1jYWxlbmRhci1wb3AtY2FsZW5kYXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1jLWNhbGVuZGFyLXBvcC1jYWxlbmRhci13ZWVrc1wiPlxuICAgICAgICAgICR7ZGF5TmFtZXMubWFwKGl0ZW0gPT4gYDxzcGFuPiR7aXRlbX08L3NwYW4+YCkuam9pbignJyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWMtY2FsZW5kYXItcG9wLWNhbGVuZGFyLWRheXNcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIm1jLWNhbGVuZGFyLXBvcC10aW1lXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1jLWNhbGVuZGFyLXBvcC1mb290ZXJcIj5cbiAgICAgIDxhPiR7Y29uZmlybU5hbWV9PC9hPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5gXG59XG5cbmNsYXNzIENhbGVuZGFyIHtcbiAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGxhbmc6ICd6aCcsXG4gICAgc3RhcnREYXk6IDEsXG4gIH1cbiAgY29uc3RydWN0b3IoZG9tLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQ2FsZW5kYXIuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHRoaXMuY2FsZW5kYXJEb20gPSAkKGRvbSk7XG4gICAgdGhpcy5wb3BEb20gPSAkKGdldFBvcEh0bWwoXG4gICAgICB0aGlzLm9wdGlvbnNcbiAgICApKTtcbiAgICB0aGlzLmNhbGVuZGFyRG9tLmFwcGVuZCh0aGlzLnBvcERvbSk7XG4gICAgdGhpcy5jYWxlbmRhckhlYWRlckRvbSA9IHRoaXMucG9wRG9tLmZpbmQoYC4ke3ByZWZpeH0tcG9wLWhlYWRlcmApO1xuICAgIHRoaXMuY2FsZW5kYXJEYXlzRG9tID0gdGhpcy5wb3BEb20uZmluZChgLiR7cHJlZml4fS1wb3AtY2FsZW5kYXItZGF5c2ApO1xuICAgIHRoaXMudGltZURvbSA9IHRoaXMucG9wRG9tLmZpbmQoYC4ke3ByZWZpeH0tcG9wLXRpbWVgKTtcblxuICAgIHRoaXMubm93ID0gbmV3IG1vbWVudCgpO1xuICAgIHRoaXMubW9udGggPSBuZXcgbW9tZW50KCk7XG5cbiAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IG5ldyBtb21lbnQoKTtcbiAgICB0aGlzLnNlbGVjdGVkVGltZSA9IG5ldyBtb21lbnQoKTtcblxuICAgIHRoaXMucmVuZGVyTW9udGgoKTtcbiAgICB0aGlzLnJlbmRlckRhdGUoKTtcbiAgICB0aGlzLnJlbmRlclRpbWUoKTtcblxuICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG4gIH1cblxuICBoYW5kbGVUb2dnbGUoZSkge1xuICAgICQodGhpcy5jYWxlbmRhckRvbSkudG9nZ2xlQ2xhc3MoJ3Nob3cnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoYW5kbGVDb25maXJtKCkge1xuICAgIGxldCB2YWx1ZSA9IGAke3RoaXMuc2VsZWN0ZWREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpfSAke3RoaXMuc2VsZWN0ZWRUaW1lLmZvcm1hdCgnSEg6bW0nKX1gXG4gICAgdGhpcy5jYWxlbmRhckRvbS5maW5kKGAuJHtwcmVmaXh9LXRleHRgKS52YWwodmFsdWUpO1xuICAgIHRoaXMuY2FsZW5kYXJEb20uZmluZChgLiR7cHJlZml4fS10ZXh0YCkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgJCh0aGlzLmNhbGVuZGFyRG9tKS5yZW1vdmVDbGFzcygnc2hvdycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByZU1vbnRoKGUpIHtcbiAgICBsZXQgY29udGV4dCA9IGUuZGF0YS5jb250ZXh0O1xuICAgIGNvbnRleHQubW9udGggPSBjb250ZXh0Lm1vbnRoLnN1YnRyYWN0KDEsICdtb250aCcpO1xuICAgIGNvbnRleHQucmVuZGVyTW9udGgoKTtcbiAgICBjb250ZXh0LnJlbmRlckRhdGUoKTtcbiAgfVxuXG4gIG5leHRNb250aChlKSB7XG4gICAgbGV0IGNvbnRleHQgPSBlLmRhdGEuY29udGV4dDtcbiAgICBjb250ZXh0Lm1vbnRoID0gY29udGV4dC5tb250aC5hZGQoMSwgJ21vbnRoJyk7XG4gICAgY29udGV4dC5yZW5kZXJNb250aCgpO1xuICAgIGNvbnRleHQucmVuZGVyRGF0ZSgpO1xuICB9XG5cbiAgcHJlSG91cihlKSB7XG4gICAgbGV0IGNvbnRleHQgPSBlLmRhdGEuY29udGV4dDtcbiAgICBjb250ZXh0LnNlbGVjdGVkVGltZS5zdWJ0cmFjdCgxLCAnaG91cnMnKVxuICAgIGNvbnRleHQucmVuZGVyVGltZSgpO1xuICB9XG5cbiAgbmV4dEhvdXIoZSkge1xuICAgIGxldCBjb250ZXh0ID0gZS5kYXRhLmNvbnRleHQ7XG4gICAgY29udGV4dC5zZWxlY3RlZFRpbWUuYWRkKDEsICdob3VycycpO1xuICAgIGNvbnRleHQucmVuZGVyVGltZSgpO1xuICB9XG5cbiAgcHJlTWludXRlKGUpIHtcbiAgICBsZXQgY29udGV4dCA9IGUuZGF0YS5jb250ZXh0O1xuICAgIGNvbnRleHQuc2VsZWN0ZWRUaW1lLnN1YnRyYWN0KDEsICdtaW51dGVzJyk7XG4gICAgY29udGV4dC5yZW5kZXJUaW1lKCk7XG4gIH1cblxuICBuZXh0TWludXRlKGUpIHtcbiAgICBsZXQgY29udGV4dCA9IGUuZGF0YS5jb250ZXh0O1xuICAgIGNvbnRleHQuc2VsZWN0ZWRUaW1lLmFkZCgxLCAnbWludXRlcycpO1xuICAgIGNvbnRleHQucmVuZGVyVGltZSgpO1xuICB9XG5cbiAgaGFuZGxlU2VsZWN0RGF0ZShlKSB7XG4gICAgbGV0IGNvbnRleHQgPSBlLmRhdGEuY29udGV4dDtcbiAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcbiAgICAgIGNvbnRleHQuc2VsZWN0ZWREYXRlID0gbmV3IG1vbWVudCgkKHRoaXMpLmF0dHIoJ2RhdGEtZGF0ZScpKTtcbiAgICAgIGNvbnRleHQucmVuZGVyRGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFkZExpc3RlbmVycygpIHtcbiAgICB0aGlzLmNhbGVuZGFyRG9tLm9uKCdjbGljaycsIGAuJHtwcmVmaXh9LXRleHQtY29udGFpbmVyYCwgdGhpcy5oYW5kbGVUb2dnbGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5wb3BEb20ub24oJ2NsaWNrJywgYC4ke3ByZWZpeH0tcG9wLWZvb3RlcmAsIHRoaXMuaGFuZGxlQ29uZmlybS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuY2FsZW5kYXJEYXlzRG9tLm9uKCdjbGljaycsICdzcGFuJywge1xuICAgICAgY29udGV4dDogdGhpc1xuICAgIH0sdGhpcy5oYW5kbGVTZWxlY3REYXRlKTtcblxuICAgIHRoaXMuY2FsZW5kYXJIZWFkZXJEb20ub24oJ2NsaWNrJywgYC5wcmUtYnRuYCwge1xuICAgICAgY29udGV4dDogdGhpc1xuICAgIH0sIHRoaXMucHJlTW9udGgpO1xuXG4gICAgdGhpcy5jYWxlbmRhckhlYWRlckRvbS5vbignY2xpY2snLCBgLm5leHQtYnRuYCwge1xuICAgICAgY29udGV4dDogdGhpc1xuICAgIH0sIHRoaXMubmV4dE1vbnRoKTtcblxuICAgIHRoaXMudGltZURvbS5vbignY2xpY2snLCBgLiR7cHJlZml4fS1wb3AtdGltZS1ob3VyLWxlZnRgLCB7XG4gICAgICBjb250ZXh0OiB0aGlzXG4gICAgfSwgdGhpcy5wcmVIb3VyKTtcblxuICAgIHRoaXMudGltZURvbS5vbignY2xpY2snLCBgLiR7cHJlZml4fS1wb3AtdGltZS1ob3VyLXJpZ2h0YCwge1xuICAgICAgY29udGV4dDogdGhpc1xuICAgIH0sIHRoaXMubmV4dEhvdXIpO1xuXG4gICAgdGhpcy50aW1lRG9tLm9uKCdjbGljaycsIGAuJHtwcmVmaXh9LXBvcC10aW1lLW1pbnV0ZS1sZWZ0YCwge1xuICAgICAgY29udGV4dDogdGhpc1xuICAgIH0sIHRoaXMucHJlTWludXRlKTtcblxuICAgIHRoaXMudGltZURvbS5vbignY2xpY2snLCBgLiR7cHJlZml4fS1wb3AtdGltZS1taW51dGUtcmlnaHRgLCB7XG4gICAgICBjb250ZXh0OiB0aGlzXG4gICAgfSwgdGhpcy5uZXh0TWludXRlKTtcbiAgfVxuXG4gIHJlbmRlck1vbnRoKCkge1xuICAgIGxldCBtb250aCA9ICB0aGlzLm1vbnRoLmZvcm1hdChsYW5nc1t0aGlzLm9wdGlvbnMubGFuZ10ubW9udGhGb3JtYXQpXG4gICAgdGhpcy5jYWxlbmRhckhlYWRlckRvbS5odG1sKGBcbiAgICAgIDxzcGFuIGNsYXNzPVwicHJlLWJ0blwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwibW9udGhcIj5cbiAgICAgICAgJHttb250aH1cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwibmV4dC1idG5cIj48L3NwYW4+XG4gICAgYClcbiAgfVxuXG4gIHJlbmRlckRhdGUoKSB7XG4gICAgbGV0IHN0YXJ0RGF0ZSA9IHRoaXMubW9udGguY2xvbmUoKS5zdGFydE9mKCdtb250aCcpO1xuICAgIGxldCBlbmREYXRlID0gdGhpcy5tb250aC5jbG9uZSgpLmVuZE9mKCdtb250aCcpO1xuICAgIGxldCBzdGFydFdlZWtkYXkgPSBzdGFydERhdGUud2Vla2RheSgpO1xuICAgIGxldCBlbmRXZWVrZGF5ID0gZW5kRGF0ZS53ZWVrZGF5KCk7XG4gICAgbGV0IHRvZGF5RGF0ZSA9IHRoaXMubm93LmRhdGUoKTtcblxuICAgIGxldCBtb250aExlbiA9IGVuZERhdGUuZGF0ZSgpO1xuXG4gICAgbGV0IGRhdGVMaXN0ID0gW107XG4gICAgbGV0IHRlbXBTdGFydCA9IHN0YXJ0RGF0ZS5jbG9uZSgpO1xuICAgIGxldCB0ZW1wRW5kID0gZW5kRGF0ZS5jbG9uZSgpO1xuICAgIGxldCB0ZW1wTW9udGggPSB0aGlzLm1vbnRoLmNsb25lKCk7XG5cbiAgICBpZiAoc3RhcnRXZWVrZGF5ID4gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydFdlZWtkYXkgO2krKykge1xuICAgICAgICBkYXRlTGlzdC51bnNoaWZ0KHRlbXBTdGFydC5zdWJ0cmFjdCgxLCAnZGF5cycpLmZvcm1hdCgnWVlZWS1NTS1ERCcpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IobGV0IGkgPSAxOyBpIDw9IG1vbnRoTGVuIDtpKyspIHtcbiAgICAgIGRhdGVMaXN0LnB1c2godGVtcE1vbnRoLmRhdGUoaSkuZm9ybWF0KCdZWVlZLU1NLUREJykpO1xuICAgIH1cblxuICAgIGlmIChlbmRXZWVrZGF5IDwgNikge1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCA3IC0gZW5kV2Vla2RheSA7aSsrKSB7XG4gICAgICAgIGRhdGVMaXN0LnB1c2godGVtcEVuZC5hZGQoMSwgJ2RheXMnKS5mb3JtYXQoJ1lZWVktTU0tREQnKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGh0bWwgPSBkYXRlTGlzdC5tYXAoaXRlbSA9PiB7XG4gICAgICBpZiAobmV3IG1vbWVudChpdGVtKS5pc0JlZm9yZShzdGFydERhdGUpIHx8IG5ldyBtb21lbnQoaXRlbSkuaXNBZnRlcihlbmREYXRlKSkge1xuICAgICAgICByZXR1cm4gYDxzcGFuIGNsYXNzPVwiZGlzYWJsZWRcIiBkYXRhLWRhdGU9XCIke2l0ZW19XCI+PGk+JHtuZXcgbW9tZW50KGl0ZW0pLmRhdGUoKX08L2k+PC9zcGFuPmBcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RlZERhdGUgJiYgaXRlbSA9PT0gdGhpcy5zZWxlY3RlZERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykpIHtcbiAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInNlbGVjdGVkXCIgZGF0YS1kYXRlPVwiJHtpdGVtfVwiPjxpPiR7bmV3IG1vbWVudChpdGVtKS5kYXRlKCl9PC9pPjwvc3Bhbj5gXG4gICAgICB9IGVsc2UgaWYgKGl0ZW0gPT09IHRoaXMubm93LmZvcm1hdCgnWVlZWS1NTS1ERCcpKSB7XG4gICAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCJ0b2RheVwiIGRhdGEtZGF0ZT1cIiR7aXRlbX1cIj48aT4ke25ldyBtb21lbnQoaXRlbSkuZGF0ZSgpfTwvaT48L3NwYW4+YFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGA8c3BhbiBkYXRhLWRhdGU9XCIke2l0ZW19XCI+PGk+JHtuZXcgbW9tZW50KGl0ZW0pLmRhdGUoKX08L2k+PC9zcGFuPmBcbiAgICAgIH1cbiAgICB9KS5qb2luKCcnKTtcblxuICAgIHRoaXMuY2FsZW5kYXJEYXlzRG9tLmh0bWwoaHRtbClcbiAgfVxuXG4gIHJlbmRlclRpbWUoKSB7XG4gICAgdGhpcy50aW1lRG9tLmh0bWwoYFxuICAgICAgJHtsYW5nc1t0aGlzLm9wdGlvbnMubGFuZ10udGltZU5hbWV9XG4gICAgICA8c3BhbiBjbGFzcz1cIm1jLWNhbGVuZGFyLXBvcC10aW1lLWhvdXItbGVmdFwiPjwvc3Bhbj5cbiAgICAgICR7dGhpcy5zZWxlY3RlZFRpbWUuZm9ybWF0KCdISCcpfVxuICAgICAgPHNwYW4gY2xhc3M9XCJtYy1jYWxlbmRhci1wb3AtdGltZS1ob3VyLXJpZ2h0XCI+PC9zcGFuPlxuICAgICAgOlxuICAgICAgPHNwYW4gY2xhc3M9XCJtYy1jYWxlbmRhci1wb3AtdGltZS1taW51dGUtbGVmdFwiPjwvc3Bhbj5cbiAgICAgICR7dGhpcy5zZWxlY3RlZFRpbWUuZm9ybWF0KCdtbScpfVxuICAgICAgPHNwYW4gY2xhc3M9XCJtYy1jYWxlbmRhci1wb3AtdGltZS1taW51dGUtcmlnaHRcIj48L3NwYW4+XG4gICAgYClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbGVuZGFyO1xuIiwiY29uc3QgbGFuZ3MgPSB7XG4gIHpoOiB7XG4gICAgbW9udGhGb3JtYXQ6ICdZWVlZ5bm0TU3mnIgnLFxuICAgIGNvbmZpcm1OYW1lOiAn56Gu5a6aJyxcbiAgICB0aW1lTmFtZTogJ+aXtumXtCcsXG4gICAgZGF5TmFtZXM6IFsn5pelJywgJ+S4gCcsICfkuownLCAn5LiJJywgJ+WbmycsICfkupQnLCAn5YWtJ10sXG5cbiAgfSxcbiAgZW46IHtcbiAgICBtb250aEZvcm1hdDogJ01NTU0gWVlZWScsXG4gICAgY29uZmlybU5hbWU6ICdjb25maXJtJyxcbiAgICB0aW1lTmFtZTogJ3RpbWUnLFxuICAgIGRheU5hbWVzOiBbJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCddLFxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGxhbmdzO1xuIiwiY29uc3QgQmFzZSA9ICByZXF1aXJlKCcuL2Jhc2UnKTtcblxuY29uc3QgcHJlZml4ID0gJ21jLWRpYWxvZy1hY3Rpb25zaGVldCc7XG5cbmNsYXNzIEFjdGlvblNoZWV0IGV4dGVuZHMgQmFzZSB7XG4gIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBjb250ZW50SFRNTDogJ1RoaXMgaXMgY29udGVudCEnLFxuICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgIHVzZU1hc2s6IGZhbHNlXG4gIH1cbiAgY29uc3RydWN0b3Iob3B0aW9ucyl7XG4gICAgc3VwZXIoKTtcbiAgICAkLmV4dGVuZCh0aGlzLCBBY3Rpb25TaGVldC5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NOYW1lICs9IGAgJHtwcmVmaXh9YDtcblxuICAgIGNvbnN0IHsgYnV0dG9ucyB9ID0gb3B0aW9uc1xuICAgIGxldCBidXR0b25zSHRtbCA9IGJ1dHRvbnMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cImJ1dHRvblwiIGRhdGEtaW5kZXg9JHtpbmRleH0+JHtpdGVtLnRleHR9PC9zcGFuPmBcbiAgICB9KS5qb2luKCcnKTtcbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBidXR0b25zSHRtbDtcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWNvbnRlbnQtdGV4dCcpO1xuXG4gICAgJCh0aGlzLmNvbnRhaW5lcikub24oJ2NsaWNrJywgJy5idXR0b24nLCBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB7IGluZGV4IH0gPSAkKHRoaXMpLmRhdGEoKTtcbiAgICAgIGlmIChidXR0b25zW2luZGV4XSAmJiBidXR0b25zW2luZGV4XS5vbkNsaWNrKSB7XG4gICAgICAgIGJ1dHRvbnNbaW5kZXhdLm9uQ2xpY2soYnV0dG9uc1tpbmRleF0pXG4gICAgICAgIHNlbGYuaGlkZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBoaWRlID0gKCkgPT4ge1xuICAgIHN1cGVyLmhpZGUoKTtcbiAgICAkKCcubWMtZGlhbG9nLW1hc2snKS5vZmYoJ2NsaWNrJywgdGhpcy5oaWRlKVxuICB9XG5cbiAgc2hvdyA9ICgpID0+IHtcbiAgICBpZighdGhpcy5tb3VudGVkKSB0aGlzLm1vdW50KCk7XG4gICAgc3VwZXIuc2hvdygpO1xuICAgICQoJy5tYy1kaWFsb2ctbWFzaycpLm9uKCdjbGljaycsIHRoaXMuaGlkZSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvblNoZWV0O1xuIiwiY29uc3QgR2VuZXJhbCA9IHJlcXVpcmUoJy4vZ2VuZXJhbCcpO1xuXG5sZXQgcHJlZml4ID0gJ21jLWRpYWxvZy1hbGVydCc7XG5cbmNsYXNzIEFsZXJ0RGlhbG9nIGV4dGVuZHMgR2VuZXJhbCB7XG4gIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBjb250ZW50SFRNTDogJ1RoaXMgaXMgY29udGVudCEnLFxuICAgIGJ1dHRvblRleHQ6ICdjb25maXJtJyxcbiAgICBsYW5nOiAnemgnLFxuICAgIG9uQ29uZmlybTogZnVuY3Rpb24gKCkge3RoaXMuaGlkZSgpfVxuICB9XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgICQuZXh0ZW5kKHRoaXMsIEFsZXJ0RGlhbG9nLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgKz0gYCAke3ByZWZpeH1gO1xuICAgIHRoaXMuYnV0dG9uR3JvdXAuaW5uZXJIVE1MID0gYDxidXR0b24+JHt0aGlzLmJ1dHRvblRleHR9PC9idXR0b24+YDtcbiAgICB0aGlzLmJ1dHRvbiA9IHRoaXMuYnV0dG9uR3JvdXAucXVlcnlTZWxlY3RvcignYnV0dG9uJyk7XG4gICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgIGlmKGUudGFyZ2V0ID09PSB0aGlzLmJ1dHRvbil7XG4gICAgICAgIHRoaXMub25Db25maXJtLmNhbGwodGhpcywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sIGZhbHNlKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWxlcnREaWFsb2c7XG4iLCJjb25zdCBNYXNrID0gcmVxdWlyZSgnLi9tYXNrJyk7XG5jb25zdCB1bmlxdWVJZCA9IHJlcXVpcmUoJy4vdXRpbHMnKS51bmlxdWVJZDtcblxuY29uc3QgcHJlZml4ID0gJ21jLWRpYWxvZyc7XG5cbmNsYXNzIEJhc2Uge1xuICBzdGF0aWMgbWFzayA9IG5ldyBNYXNrKClcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5pZCA9IHVuaXF1ZUlkKCk7XG4gICAgdGhpcy5pc0Rpc3BsYXkgPSBmYWxzZTtcbiAgICB0aGlzLnVzZU1hc2sgPSB0cnVlOyAvLyDmmK/lkKbkvb/nlKjpga7nvalcbiAgICB0aGlzLm1vdW50ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTmFtZSA9IHByZWZpeCArIGAgJHtvcHRpb25zLmNsYXNzTmFtZSB8fCAnJ31gO1xuICAgIHRoaXMuY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGlhbG9nLWlkJywgdGhpcy5pZClcbiAgICB0aGlzLmNsYXNzTGlzdCA9IHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdDtcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9LCBmYWxzZSlcbiAgfVxuICBtb3VudCgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgICB0aGlzLm1vdW50ZWQgPSB0cnVlO1xuICB9XG4gIHNob3coKSB7XG4gICAgaWYoIXRoaXMubW91bnRlZCkgdGhpcy5tb3VudCgpO1xuICAgIGlmKHRoaXMudXNlTWFzaykgQmFzZS5tYXNrLnNob3coKTtcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuY2xhc3NMaXN0LmFkZCgnaW4nKSwgMCk7XG4gICAgdGhpcy5pc0Rpc3BsYXkgPSB0cnVlO1xuICB9XG4gIGhpZGUoKSB7XG4gICAgaWYodGhpcy51c2VNYXNrKSBCYXNlLm1hc2suaGlkZSgpO1xuICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnaW4nKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJywgMzAwKVxuICAgIHRoaXMuaXNEaXNwbGF5ID0gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlO1xuIiwiY29uc3QgR2VuZXJhbCA9IHJlcXVpcmUoJy4vZ2VuZXJhbCcpO1xuXG5jb25zdCBwcmVmaXggPSAnbWMtZGlhbG9nLWNvbXBsZXgnO1xuXG5jbGFzcyBDb21wbGV4IGV4dGVuZHMgR2VuZXJhbCB7XG4gIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBjb250ZW50SFRNTDogJ1RoaXMgaXMgY29udGVudCEnLFxuICAgIGJ1dHRvbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2FuY2VsJyxcbiAgICAgICAgdGV4dDogJ2NhbmNlbCcsXG4gICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uICgpIHt0aGlzLmhpZGUoKX0sXG4gICAgICB9XG4gICAgXVxuICB9XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICQuZXh0ZW5kKHRoaXMsIENvbXBsZXguZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTmFtZSArPSBgICR7cHJlZml4fWA7XG4gICAgdGhpcy5idXR0b25Hcm91cC5pbm5lckhUTUwgPSB0aGlzLmJ1dHRvbnMubWFwKGJ1dHRvbiA9PiB7XG4gICAgICByZXR1cm4gYDxidXR0b24gY2xhc3M9XCJjb21wbGV4LWJ0biAke2J1dHRvbi5jbGFzc05hbWUgfHwgJyd9XCI+JHtidXR0b24udGV4dH08L2J1dHRvbj5gXG4gICAgfSkuam9pbignJyk7XG4gICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgIGxldCB0YXJnZXQgPSAkKGUudGFyZ2V0KTtcbiAgICAgIGlmICh0YXJnZXQuaGFzQ2xhc3MoJ2NvbXBsZXgtYnRuJykpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGFyZ2V0LmluZGV4KCk7XG4gICAgICAgIGxldCBvbkNsaWNrID0gdGhpcy5idXR0b25zW2luZGV4XSAmJiB0aGlzLmJ1dHRvbnNbaW5kZXhdLm9uQ2xpY2s7XG4gICAgICAgIGlmIChvbkNsaWNrKSB7XG4gICAgICAgICAgb25DbGljay5jYWxsKHRoaXMsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBmYWxzZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21wbGV4O1xuIiwiY29uc3QgR2VuZXJhbCA9IHJlcXVpcmUoJy4vZ2VuZXJhbCcpO1xuXG5jb25zdCBwcmVmaXggPSAnbWMtZGlhbG9nLWNvbmZpcm0nO1xuXG5jbGFzcyBDb25maXJtRGlhbG9nIGV4dGVuZHMgR2VuZXJhbCB7XG4gIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBjb250ZW50SFRNTDogJ1RoaXMgaXMgY29udGVudCEnLFxuICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnY29uZmlybScsXG4gICAgY2FuY2VsQnV0dG9uVGV4dDogJ2NhbmNlbCcsXG4gICAgbGFuZzogJ3poJyxcbiAgICBvbkNvbmZpcm06IGZ1bmN0aW9uICgpIHt0aGlzLmhpZGUoKX0sXG4gICAgb25DYW5jZWw6IGZ1bmN0aW9uICgpIHt0aGlzLmhpZGUoKX1cbiAgfVxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgJC5leHRlbmQodGhpcywgQ29uZmlybURpYWxvZy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NOYW1lICs9IGAgJHtwcmVmaXh9YDtcbiAgICB0aGlzLmJ1dHRvbkdyb3VwLmlubmVySFRNTCA9IGBcbiAgICAgIDxidXR0b24gY2xhc3M9XCJjYW5jZWwtYnRuXCI+JHt0aGlzLmNhbmNlbEJ1dHRvblRleHR9PC9idXR0b24+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwiY29uZmlybS1idG5cIj4ke3RoaXMuY29uZmlybUJ1dHRvblRleHR9PC9idXR0b24+XG4gICAgYDtcbiAgICB0aGlzLmNvbmZpcm1CdG4gPSB0aGlzLmJ1dHRvbkdyb3VwLnF1ZXJ5U2VsZWN0b3IoJy5jb25maXJtLWJ0bicpO1xuICAgIHRoaXMuY2FuY2VsQnRuID0gdGhpcy5idXR0b25Hcm91cC5xdWVyeVNlbGVjdG9yKCcuY2FuY2VsLWJ0bicpO1xuICAgIHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICBpZihlLnRhcmdldCA9PT0gdGhpcy5jb25maXJtQnRuKXtcbiAgICAgICAgdGhpcy5vbkNvbmZpcm0uY2FsbCh0aGlzLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH0pXG4gICAgICB9ZWxzZSBpZihlLnRhcmdldCA9PT0gdGhpcy5jYW5jZWxCdG4pe1xuICAgICAgICB0aGlzLm9uQ2FuY2VsLmNhbGwodGhpcywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sIGZhbHNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmZpcm1EaWFsb2c7XG4iLCJjb25zdCBCYXNlID0gIHJlcXVpcmUoJy4vYmFzZScpO1xuXG5jb25zdCBwcmVmaXggPSAnbWMtZGlhbG9nLWdlbmVyYWwnO1xuXG5jb25zdCB0bXBsID0gYFxuICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj48cCBjbGFzcz1cImRpYWxvZy1jb250ZW50LXRleHRcIj48L3A+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJkaWFsb2ctYnV0dG9uLWdyb3VwXCI+PC9kaXY+XG5gO1xuXG5jbGFzcyBHZW5lcmFsIGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTmFtZSArPSBgICR7cHJlZml4fWA7XG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gdG1wbDtcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWNvbnRlbnQtdGV4dCcpO1xuICAgIHRoaXMuYnV0dG9uR3JvdXAgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWJ1dHRvbi1ncm91cCcpO1xuICB9XG4gIHNob3cob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5jb250ZW50SFRNTCA9IG9wdGlvbnMuY29udGVudEhUTUwgfHwgdGhpcy5jb250ZW50SFRNTDtcbiAgICB0aGlzLmNvbnRlbnQuaW5uZXJIVE1MID0gdGhpcy5jb250ZW50SFRNTDtcbiAgICBzdXBlci5zaG93KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmFsO1xuIiwiXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbG9hZGluZzoge1xuICAgIGVuOiB7XG4gICAgICBsb2FkaW5nVGV4dDogJ2xvYWRpbmcuLi4nXG4gICAgfSxcbiAgICB6aDoge1xuICAgICAgbG9hZGluZ1RleHQ6ICfliqDovb3kuK0uLi4nXG4gICAgfVxuICB9LFxuICBjb25maXJtOiB7XG4gICAgZW46IHtcbiAgICAgIGNhbmNlbE5hbWU6ICdjYW5jZWwnLFxuICAgICAgY29uZmlybU5hbWU6ICdjb25maXJtJ1xuICAgIH0sXG4gICAgemg6IHtcbiAgICAgIGNhbmNlbE5hbWU6ICflj5bmtognLFxuICAgICAgY29uZmlybU5hbWU6ICfnoa7orqQnXG4gICAgfVxuICB9LFxuICBhbGVydDoge1xuICAgIGVuOiB7XG4gICAgICBjb25maXJtTmFtZTogJ2NvbmZpcm0nXG4gICAgfSxcbiAgICB6aDoge1xuICAgICAgY29uZmlybU5hbWU6ICfnoa7orqQnXG4gICAgfVxuICB9XG59XG4iLCJjb25zdCBCYXNlID0gcmVxdWlyZSgnLi9iYXNlJyk7XG5jb25zdCBhcHBlbmRUb1NlbGVjdG9yID0gcmVxdWlyZSgnLi91dGlscycpLmFwcGVuZFRvU2VsZWN0b3I7XG5jb25zdCBsYW5ncyA9IHJlcXVpcmUoJy4vbGFuZ3MnKS5sb2FkaW5nO1xuY29uc3QgcHJlZml4ID0gJ21jLWRpYWxvZy1sb2FkaW5nJztcblxuY2xhc3MgTG9hZGluZyBleHRlbmRzIEJhc2Uge1xuICBzdGF0aWMgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgdXNlTWFzazogZmFsc2UsXG4gICAgY291bnQ6IDEyLFxuICAgIGxhbmc6ICd6aCdcbiAgfVxuICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICBzdXBlcigpO1xuICAgICQuZXh0ZW5kKHRoaXMsIExvYWRpbmcuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgbGV0IGh0bWwgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY291bnQ7IGkrKykge1xuICAgICAgaHRtbCArPSAnPGk+PC9pPic7XG4gICAgfVxuXG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NOYW1lICs9IGAgJHtwcmVmaXh9YDtcbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBgXG4gICAgICAke2h0bWx9XG4gICAgICA8cD4ke2xhbmdzW3RoaXMubGFuZ10ubG9hZGluZ1RleHR9PC9wPlxuICAgIGA7XG5cbiAgfVxuXG4gIHNob3cob3B0aW9ucyA9IHt9KSB7XG4gICAgaWYoIXRoaXMubW91bnRlZCkgdGhpcy5tb3VudCgpO1xuICAgIHN1cGVyLnNob3coKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRpbmc7XG4iLCJjb25zdCB1bmlxdWVJZCA9IHJlcXVpcmUoJy4vdXRpbHMnKS51bmlxdWVJZDtcblxuY29uc3QgcHJlZml4ID0gJ21jLWRpYWxvZy1tYXNrJztcblxuY2xhc3MgTWFzayB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7XG4gICAgICB6SW5kZXg6IDksXG4gICAgICBvcGFjaXR5OiAuOFxuICAgIH0sIG9wdGlvbnMubWFzayk7XG4gICAgdGhpcy5pZCA9IHVuaXF1ZUlkKCk7XG4gICAgdGhpcy5tb3VudGVkID0gZmFsc2U7XG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgPSBwcmVmaXg7XG4gICAgdGhpcy5jb250YWluZXIuc2V0QXR0cmlidXRlKCdtYXNrLWlkJywgdGhpcy5pZCk7XG4gICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sIGZhbHNlKTtcbiAgfVxuICBtb3VudCgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgICB0aGlzLm1vdW50ZWQgPSB0cnVlO1xuICB9XG4gIHNob3coKSB7XG4gICAgaWYoIXRoaXMubW91bnRlZCkgdGhpcy5tb3VudCgpO1xuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaW4nKSwgMCk7XG4gICAgdGhpcy5pc0Rpc3BsYXkgPSB0cnVlO1xuICB9XG4gIGhpZGUoKSB7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaW4nKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJywgMzAwKTtcbiAgICB0aGlzLmlzRGlzcGxheSA9IGZhbHNlO1xuICB9XG4gIG9uKGV2ZW50VHlwZSwgZnVuKSB7XG4gICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGZ1biwgZmFsc2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWFzaztcbiIsImNvbnN0IEJhc2UgPSAgcmVxdWlyZSgnLi9iYXNlJyk7XG5cbmNvbnN0IHByZWZpeCA9ICdtYy1kaWFsb2ctdGlwJztcblxuY2xhc3MgVGlwIGV4dGVuZHMgQmFzZSB7XG4gIHN0YXRpYyBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBjb250ZW50SFRNTDogJ1RoaXMgaXMgY29udGVudCEnLFxuICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgIHVzZU1hc2s6IGZhbHNlXG4gIH1cbiAgY29uc3RydWN0b3Iob3B0aW9ucyl7XG4gICAgc3VwZXIoKTtcbiAgICAkLmV4dGVuZCh0aGlzLCBUaXAuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTmFtZSArPSBgICR7cHJlZml4fWA7XG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gJzxwIGNsYXNzPVwiZGlhbG9nLWNvbnRlbnQtdGV4dFwiPjwvcD4nO1xuICAgIHRoaXMuY29udGVudCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctY29udGVudC10ZXh0Jyk7XG4gIH1cbiAgc2hvdyhvcHRpb25zID0ge30pIHtcbiAgICBpZighdGhpcy5tb3VudGVkKSB0aGlzLm1vdW50KCk7XG4gICAgdGhpcy5jb250ZW50SFRNTCA9IG9wdGlvbnMuY29udGVudEhUTUwgfHwgdGhpcy5jb250ZW50SFRNTDtcbiAgICB0aGlzLmNvbnRlbnQuaW5uZXJIVE1MID0gdGhpcy5jb250ZW50SFRNTDtcbiAgICBzdXBlci5zaG93KCk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXJJZCk7XG4gICAgdGhpcy50aW1lcklkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9LCBvcHRpb25zLmR1cmF0aW9uIHx8IHRoaXMuZHVyYXRpb24pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaXA7XG4iLCJjb25zdCBCYXNlID0gIHJlcXVpcmUoJy4vYmFzZScpO1xuY29uc3QgYXBwZW5kVG9TZWxlY3RvciA9IHJlcXVpcmUoJy4vdXRpbHMnKS5hcHBlbmRUb1NlbGVjdG9yO1xuXG5jb25zdCBwcmVmaXggPSAnbWMtZGlhbG9nLXRvYXN0JztcblxuY2xhc3MgVG9hc3QgZXh0ZW5kcyBCYXNlIHtcbiAgc3RhdGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGNvbnRlbnRIVE1MOiAnVGhpcyBpcyBjb250ZW50IScsXG4gICAgZHVyYXRpb246IDIwMDAsXG4gICAgdXNlTWFzazogZmFsc2VcbiAgfVxuICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICBzdXBlcigpO1xuICAgICQuZXh0ZW5kKHRoaXMsIFRvYXN0LmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgKz0gYCAke3ByZWZpeH1gO1xuICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9ICc8cCBjbGFzcz1cImRpYWxvZy1jb250ZW50LXRleHRcIj48L3A+JztcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWNvbnRlbnQtdGV4dCcpO1xuICB9XG4gIHNob3cob3B0aW9ucyA9IHt9KSB7XG4gICAgaWYoIXRoaXMubW91bnRlZCkgdGhpcy5tb3VudCgpO1xuICAgIHRoaXMuY29udGVudEhUTUwgPSBvcHRpb25zLmNvbnRlbnRIVE1MIHx8IHRoaXMuY29udGVudEhUTUw7XG4gICAgdGhpcy5jb250ZW50LmlubmVySFRNTCA9IHRoaXMuY29udGVudEhUTUw7XG4gICAgc3VwZXIuc2hvdygpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVySWQpO1xuICAgIHRoaXMudGltZXJJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSwgb3B0aW9ucy5kdXJhdGlvbiB8fCB0aGlzLmR1cmF0aW9uKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVG9hc3Q7XG4iLCIvKipcbiAqIOeUn+aIkOWUr+S4gDjkvY1JRFxuICogQHR5cGUge1t0eXBlXX1cbiAqL1xuZXhwb3J0cy51bmlxdWVJZCA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGlkcyA9IFtdO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGxldCBpZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKC04KTtcbiAgICBpZihpZHMuaW5kZXhPZihpZCkgPCAwKXtcbiAgICAgIGlkcy5wdXNoKGlkKTtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9ZWxzZXtcbiAgICAgIHJldHVybiB1bmlxdWVJZCgpXG4gICAgfVxuICB9O1xufSkoKTtcblxuLyoqXG4gKiDlsIbkuIDkuKrlrZfnrKbkuLLmt7vliqDliLDmiYDmnInpgInmi6nlmajlkI5cbiAqIEBwYXJhbSAge1t0eXBlXX0gc3R5bGUgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBzdHIgICBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IGJsb29uICAgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydHMuYXBwZW5kVG9TZWxlY3RvciA9IGZ1bmN0aW9uIChzdHlsZSwgc3RyLCB0b1RhaWwpIHtcbiAgaWYodHlwZW9mIHN0eWxlID09PSAnc3RyaW5nJyl7XG4gICAgbGV0IHJlZyA9IC9bXn1dK1tcXHNdKj8oPz1cXHMqXFx7W1xcc1xcU10qKS9nbTtcbiAgICBpZih0b1RhaWwpe1xuICAgICAgcmV0dXJuIHN0eWxlLnJlcGxhY2UocmVnLCBtYXRjaCA9PiBgJHttYXRjaC50cmltKCl9JHtzdHJ9YClcbiAgICB9XG4gICAgcmV0dXJuIHN0eWxlLnJlcGxhY2UocmVnLCBtYXRjaCA9PiBgJHtzdHJ9JHttYXRjaC50cmltKCl9YClcbiAgfWVsc2V7XG4gICAgdGhyb3cgJ3BsZWFzZSBwYXNzIGluIHN0eWxlIHNoZWV0IHN0cmluZydcbiAgfVxufVxuXG4vKipcbiAqIOWwhuS4gOS4quWtl+espuS4slxuICogQHBhcmFtICB7W3R5cGVdfSBzdHlsZSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IHN0ciAgIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnRzLnByZUFwcGVuZFRvU2VsZWN0b3IgPSBmdW5jdGlvbiAoc3R5bGUsIHN0cikge1xuICBpZih0eXBlb2Ygc3R5bGUgPT09ICdzdHJpbmcnKXtcbiAgICBsZXQgcmVnID0gL1tefV0rW1xcc10qPyg/PVxccypcXHtbXFxzXFxTXSopL2dtO1xuICAgIHJldHVybiBzdHlsZS5yZXBsYWNlKHJlZywgbWF0Y2ggPT4gbWF0Y2gudHJpbSgpICsgYFske3N0cn1dYClcbiAgfWVsc2V7XG4gICAgdGhyb3cgJ3BsZWFzZSBwYXNzIGluIHN0eWxlIHNoZWV0IHN0cmluZydcbiAgfVxufVxuIiwiY29uc3QgQ29tcHJlc3NvciA9IHJlcXVpcmUoJ2NvbXByZXNzb3JqcycpO1xuY29uc3QgcHJlZml4ID0gJ21jLWltYWdlLXVwbG9hZGVyJztcblxuY29uc3QgaW1hZ2VVcGxvYWRlcnMgPSAkKGAuJHtwcmVmaXh9YCk7XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fVxuXG5jbGFzcyBJbWFnZVVwbG9hZGVyIHtcbiAgY29uc3RydWN0b3IoZG9tLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmltYWdlVXBsb2FkZXIgPSAkKGRvbSk7XG5cbiAgICB0aGlzLnBpY3R1cmVMaXN0ID0gdGhpcy5pbWFnZVVwbG9hZGVyLmZpbmQoYC4ke3ByZWZpeH0tbGlzdGApO1xuICAgIHRoaXMucGxhY2Vob2xkZXJEb20gPSB0aGlzLmltYWdlVXBsb2FkZXIuZmluZChgLiR7cHJlZml4fS1wbGFjZWhvbGRlcmApO1xuICAgIHRoaXMuaW5wdXREb20gPSAkKCc8aW5wdXQgdHlwZT1cImZpbGVcIj4nKTtcblxuICAgIHRoaXMuaXRlbURvbXMgPSBbXTtcbiAgICB0aGlzLmZpbGVMaXN0ID0gW107XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMub3B0aW9ucy5vbkNoYW5nZSA9IHRoaXMub3B0aW9ucy5vbkNoYW5nZSB8fCBub29wO1xuICAgIHRoaXMub3B0aW9ucy5vblByZXZpZXcgPSB0aGlzLm9wdGlvbnMub25QcmV2aWV3IHx8IG5vb3A7XG4gICAgdGhpcy5vcHRpb25zLm9uUmVtb3ZlID0gdGhpcy5vcHRpb25zLm9uUmVtb3ZlIHx8IG5vb3A7XG4gICAgdGhpcy5vcHRpb25zLmJlZm9yZVVwbG9hZCA9IHRoaXMub3B0aW9ucy5iZWZvcmVVcGxvYWQgfHwgbm9vcDtcbiAgICB0aGlzLm9wdGlvbnMuYWZ0ZXJVcGxvYWQgPSB0aGlzLm9wdGlvbnMuYWZ0ZXJVcGxvYWQgfHwgbm9vcDtcbiAgICB0aGlzLm9wdGlvbnMudXBsb2FkRmlsZUtleSA9IHRoaXMub3B0aW9ucy51cGxvYWRGaWxlS2V5IHx8ICdmaWxlJztcbiAgICB0aGlzLm9wdGlvbnMubWF4TGVuID0gdGhpcy5vcHRpb25zLm1heExlbiB8fCAzO1xuXG4gICAgdGhpcy5vcHRpb25zLmdldEV4dHJhUGFyYW1zID0gdGhpcy5vcHRpb25zLmdldEV4dHJhUGFyYW1zO1xuXG4gICAgdGhpcy5yZW5kZXJUaHVtYm5haWwoKTtcbiAgICB0aGlzLmFkZExpc3RlbmVycygpO1xuICB9XG5cbiAgcGlja0ltYWdlKCkge1xuICAgIHRoaXMuaW5wdXREb20uYXR0cih7XG4gICAgICBhY2NlcHQ6ICdpbWFnZS8qJyxcbiAgICB9KTtcbiAgICB0aGlzLmlucHV0RG9tLnJlbW92ZUF0dHIoJ2NhcHR1cmUnKVxuICAgIHRoaXMuaW5wdXREb20udHJpZ2dlcignY2xpY2snKTtcbiAgfVxuXG4gIHBpY2tGaWxlKCkge1xuICAgIHRoaXMuaW5wdXREb21cbiAgICAgIC5yZW1vdmVBdHRyKCdhY2NlcHQnKVxuICAgICAgLnJlbW92ZUF0dHIoJ2NhcHR1cmUnKTtcbiAgICB0aGlzLmlucHV0RG9tLnRyaWdnZXIoJ2NsaWNrJyk7XG4gIH1cblxuICBwaWNrV2l0aENhbWVyYSgpIHtcbiAgICB0aGlzLmlucHV0RG9tLmF0dHIoe1xuICAgICAgYWNjZXB0OiAnaW1hZ2UvKicsXG4gICAgICBjYXB0dXJlOiAnY2FtZXJhJ1xuICAgIH0pO1xuICAgIHRoaXMuaW5wdXREb20udHJpZ2dlcignY2xpY2snKTtcbiAgfVxuXG4gIHJlYWRUaHVtYm5haWwoZmlsZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGUgPT4ge1xuICAgICAgICByZXNvbHZlKGUudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9XG4gICAgICByZWFkZXIub25lcnJvciA9IHJlamVjdDtcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyVGh1bWJuYWlsKCkge1xuICAgIGlmICh0aGlzLml0ZW1Eb21zLmxlbmd0aCA9PT0gdGhpcy5vcHRpb25zLm1heExlbikge1xuICAgICAgdGhpcy5waWN0dXJlTGlzdC5odG1sKHRoaXMuaXRlbURvbXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBpY3R1cmVMaXN0Lmh0bWwoXG4gICAgICAgIHRoaXMuaXRlbURvbXMuY29uY2F0KCQoYDxzcGFuIGNsYXNzPVwiJHtwcmVmaXh9LXBsYWNlaG9sZGVyXCI+PC9zcGFuPmApKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVJbnB1dENoYW5nZShlKSB7XG4gICAgbGV0IGZpbGUgPSBlLnRhcmdldC5maWxlc1swXTtcbiAgICBpZiAoZmlsZSkge1xuICAgICAgdGhpcy5yZWFkVGh1bWJuYWlsKGZpbGUpXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xuXG4gICAgICAgICAgbGV0IHVwRmlsZU9iamVjdCA9IHtcbiAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICB0aHVtYm5haWw6IGRhdGEsXG4gICAgICAgICAgICBzdGF0dXM6ICd1cGxvYWRpbmcnLFxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBpc0ltYWdlID0gL15pbWFnZVxcLy4qLy50ZXN0KGZpbGUudHlwZSlcblxuICAgICAgICAgIHRoaXMuZmlsZUxpc3QgPSB0aGlzLmZpbGVMaXN0LmNvbmNhdCh1cEZpbGVPYmplY3QpO1xuXG4gICAgICAgICAgbGV0IHRodW1ibmFpbERvbSA9ICQoYDxzcGFuIGNsYXNzPVwiJHtwcmVmaXh9LWl0ZW1cIj5cbiAgICAgICAgICAgICAgJHtpc0ltYWdlP2A8aW1nIHNyYz1cIiR7dXBGaWxlT2JqZWN0LnRodW1ibmFpbH1cIiBhbHQ9XCJcIj5gOmA8c3BhbiBjbGFzcz0ke3ByZWZpeH0tZmlsZS1wbGFjZWhvbGRlcj48L3NwYW4+YH1cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCIke3ByZWZpeH0tcGVyY2VudGFnZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCIke3ByZWZpeH0tZmFpbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPGk+PC9pPlxuICAgICAgICAgICAgPC9zcGFuPmApO1xuXG4gICAgICAgICAgdGhpcy5pdGVtRG9tcyA9IHRoaXMuaXRlbURvbXMuY29uY2F0KHRodW1ibmFpbERvbSk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJUaHVtYm5haWwoKTtcbiAgICAgICAgICB0aGlzLnVwbG9hZEZpbGUodXBGaWxlT2JqZWN0LCB0aHVtYm5haWxEb20pO1xuICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZG9VcGxvYWQodXBGaWxlT2JqZWN0LCB0aHVtYm5haWxEb20pIHtcbiAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGRhdGEuYXBwZW5kKHRoaXMub3B0aW9ucy51cGxvYWRGaWxlS2V5LCB1cEZpbGVPYmplY3QuZmlsZSwgdXBGaWxlT2JqZWN0LmZpbGUubmFtZSlcblxuICAgIGNvbnN0IGdldEV4dHJhUGFyYW1zID0gdGhpcy5vcHRpb25zLmdldEV4dHJhUGFyYW1zO1xuICAgIGlmICh0eXBlb2YgZ2V0RXh0cmFQYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IGV4dHJhUGFyYW1zID0gZ2V0RXh0cmFQYXJhbXMoKTtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIGV4dHJhUGFyYW1zKSB7XG4gICAgICAgIGlmIChleHRyYVBhcmFtcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgY29uc3QgZWxlbWVudCA9IGV4dHJhUGFyYW1zW2tleV07XG4gICAgICAgICAgZGF0YS5hcHBlbmQoa2V5LCBlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsZVByb2dyZXNzID0gKGUpID0+IHtcbiAgICAgIGlmIChlLmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgdGh1bWJuYWlsRG9tLmZpbmQoYC4ke3ByZWZpeH0tcGVyY2VudGFnZWApLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgdGh1bWJuYWlsRG9tLmZpbmQoYC4ke3ByZWZpeH0tcGVyY2VudGFnZWApLmh0bWwoTWF0aC5yb3VuZChlLmxvYWRlZCAvIGUudG90YWwgKiAxMDApICsgXCIlXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsZVVwbG9hZFN1Y2Nlc3MgPSAoZSkgPT4ge1xuICAgICAgdXBGaWxlT2JqZWN0LnN0YXR1cyA9ICdkb25lJztcbiAgICAgIHRodW1ibmFpbERvbS5maW5kKGAuJHtwcmVmaXh9LXBlcmNlbnRhZ2VgKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICB0aGlzLm9wdGlvbnMub25DaGFuZ2UodGhpcy5maWxlTGlzdCk7XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlVXBsb2FkRmFpbCA9IChlKSA9PiB7XG4gICAgICB1cEZpbGVPYmplY3Quc3RhdHVzID0gJ2Vycm9yJztcbiAgICAgIHRodW1ibmFpbERvbS5maW5kKGAuJHtwcmVmaXh9LWZhaWxgKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICB0aHVtYm5haWxEb20uZmluZChgLiR7cHJlZml4fS1wZXJjZW50YWdlYCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgdGhpcy5vcHRpb25zLm9uQ2hhbmdlKHRoaXMuZmlsZUxpc3QpO1xuICAgIH1cblxuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICB1cmw6IHRoaXMub3B0aW9ucy5hY3Rpb24gfHwgJycsXG4gICAgICBkYXRhLFxuICAgICAgeGhyOiAoKSA9PiB7XG7jgIDjgIDjgIDjgIAgbGV0IHhociA9ICQuYWpheFNldHRpbmdzLnhocigpO1xuICAgICAgICB1cEZpbGVPYmplY3QueGhyID0geGhyO1xu44CA44CA44CA44CAIGlmKHhoci51cGxvYWQpIHtcbiAgICAgICAgICB4aHIub25lcnJvciA9IGhhbmRsZVVwbG9hZEZhaWw7XG4gICAgICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gaGFuZGxlUHJvZ3Jlc3M7XG4gIOOAgOOAgOOAgCB9XG4gICAgICAgIHJldHVybiB4aHI7XG4gICAg44CAfSxcbiAgICAgIHN1Y2Nlc3M6IChkYXRhLCBzdGF0dXMsIHhocikgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuYWZ0ZXJVcGxvYWQoKTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuanVkZ2VyICE9PSAnZnVuY3Rpb24nIHx8IHRoaXMub3B0aW9ucy5qdWRnZXIoZGF0YSkpIHtcbiAgICAgICAgICB1cEZpbGVPYmplY3QucmVzcG9uc2VEYXRhID0gZGF0YTtcbiAgICAgICAgICBoYW5kbGVVcGxvYWRTdWNjZXNzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGFuZGxlVXBsb2FkRmFpbCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXJyb3I6ICh4aHIsIGVycm9yVHlwZSwgZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmFmdGVyVXBsb2FkKCk7XG4gICAgICAgIGhhbmRsZVVwbG9hZEZhaWwoKTtcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIHVwbG9hZEZpbGUodXBGaWxlT2JqZWN0LCB0aHVtYm5haWxEb20pIHtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmJlZm9yZVVwbG9hZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdXBGaWxlT2JqZWN0ID0gdGhpcy5vcHRpb25zLmJlZm9yZVVwbG9hZCh1cEZpbGVPYmplY3QpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcHJlc3Nvcikge1xuICAgICAgbmV3IENvbXByZXNzb3IodXBGaWxlT2JqZWN0LmZpbGUsIHtcbiAgICAgICAgcXVhbGl0eTogMC42LFxuICAgICAgICAuLi50aGlzLm9wdGlvbnMuY29tcHJlc3NvcixcbiAgICAgICAgc3VjY2VzczogKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHVwRmlsZU9iamVjdC5maWxlID0gcmVzdWx0O1xuICAgICAgICAgIHRoaXMuZG9VcGxvYWQodXBGaWxlT2JqZWN0LCB0aHVtYm5haWxEb20pO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcihlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb1VwbG9hZCh1cEZpbGVPYmplY3QsIHRodW1ibmFpbERvbSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlUmVtb3ZlSXRlbShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgbGV0IGNvbnRleHQgPSBlLmRhdGEuY29udGV4dDtcbiAgICBsZXQgaW5kZXggPSAkKHRoaXMpLnBhcmVudChgLiR7cHJlZml4fS1pdGVtYCkuaW5kZXgoKTtcbiAgICBjb250ZXh0LnJlbW92ZUl0ZW0oaW5kZXgpO1xuICB9XG5cbiAgcmVtb3ZlSXRlbShpbmRleCkge1xuICAgIGxldCBiZWZvcmVSZW1vdmUgPSB0aGlzLm9wdGlvbnMuYmVmb3JlUmVtb3ZlO1xuICAgIGxldCBmaWxlID0gdGhpcy5maWxlTGlzdFtpbmRleF07XG4gICAgbGV0IHJlbW92ZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuZmlsZUxpc3RbaW5kZXhdLnhoci5hYm9ydCgpO1xuICAgICAgdGhpcy5pdGVtRG9tcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgdGhpcy5maWxlTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgdGhpcy5vcHRpb25zLm9uQ2hhbmdlKHRoaXMuZmlsZUxpc3QpO1xuICAgICAgdGhpcy5vcHRpb25zLm9uUmVtb3ZlKGZpbGUsIGluZGV4LCB0aGlzLmZpbGVMaXN0KVxuICAgICAgdGhpcy5yZW5kZXJUaHVtYm5haWwoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBiZWZvcmVSZW1vdmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGJlZm9yZVJlbW92ZShmaWxlLCBpbmRleCwgdGhpcy5maWxlTGlzdCwgcmVtb3ZlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZW1vdmUoKVxuICAgIH1cbiAgfVxuXG4gIGNsZWFySXRlbSgpIHtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5maWxlTGlzdC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHRoaXMuZmlsZUxpc3RbaW5kZXhdLnhoci5hYm9ydCgpO1xuICAgIH1cbiAgICB0aGlzLml0ZW1Eb21zID0gW107XG4gICAgdGhpcy5maWxlTGlzdCA9IFtdO1xuICAgIHRoaXMucmVuZGVyVGh1bWJuYWlsKCk7XG5cbiAgfVxuXG4gIGhhbmRsZVByZXZpZXcoZSkge1xuICAgIGxldCBjb250ZXh0ID0gZS5kYXRhLmNvbnRleHQ7XG4gICAgbGV0IGluZGV4ID0gJCh0aGlzKS5pbmRleCgpO1xuICAgIGNvbnRleHQub3B0aW9ucy5vblByZXZpZXcoY29udGV4dC5maWxlTGlzdCwgaW5kZXgpO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmN1c3RvbVRyaWdnZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuaW1hZ2VVcGxvYWRlci5vbignY2xpY2snLCBgLiR7cHJlZml4fS1wbGFjZWhvbGRlcmAsIG9wdGlvbnMuY3VzdG9tVHJpZ2dlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW1hZ2VVcGxvYWRlci5vbignY2xpY2snLCBgLiR7cHJlZml4fS1wbGFjZWhvbGRlcmAsIHRoaXMuaGFuZGxlUGljay5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgdGhpcy5pbnB1dERvbS5vbignY2hhbmdlJywgdGhpcy5oYW5kbGVJbnB1dENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmltYWdlVXBsb2FkZXIub24oJ2NsaWNrJywgYC4ke3ByZWZpeH0taXRlbWAse1xuICAgICAgY29udGV4dDogdGhpc1xuICAgIH0sIHRoaXMuaGFuZGxlUHJldmlldyk7XG5cbiAgICB0aGlzLmltYWdlVXBsb2FkZXIub24oJ2NsaWNrJywgYGlgLCB7XG4gICAgICBjb250ZXh0OiB0aGlzXG4gICAgfSwgdGhpcy5oYW5kbGVSZW1vdmVJdGVtKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlVXBsb2FkZXI7XG5cbi8vICQuZWFjaChpbWFnZVVwbG9hZGVycywgKGluZGV4LCBpbWFnZVVwbG9hZGVyKSA9PiB7XG4vLyAgIG5ldyBJbWFnZVVwbG9hZGVyKGltYWdlVXBsb2FkZXIpLmluaXQoKVxuLy8gfSlcbiIsIi8qIVxuICogbW9iaWxlU2VsZWN0LmpzXG4gKiAoYykgMjAxNy1wcmVzZW50IG9ubHlob21cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG5cdGZ1bmN0aW9uIGdldENsYXNzKGRvbSxzdHJpbmcpIHtcblx0XHRyZXR1cm4gZG9tLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoc3RyaW5nKTtcblx0fVxuXHQvL+aehOmAoOWZqFxuXHRmdW5jdGlvbiBNb2JpbGVTZWxlY3QoY29uZmlnKSB7XG5cdFx0dGhpcy5tb2JpbGVTZWxlY3Q7XG5cdFx0dGhpcy53aGVlbHNEYXRhID0gY29uZmlnLndoZWVscztcblx0XHR0aGlzLmpzb25UeXBlID0gIGZhbHNlO1xuXHRcdHRoaXMuY2FzY2FkZUpzb25EYXRhID0gW107XG5cdFx0dGhpcy5kaXNwbGF5SnNvbiA9IFtdO1xuXHRcdHRoaXMuY3VyVmFsdWUgPSBbXTtcblx0XHR0aGlzLmN1ckluZGV4QXJyID0gW107XG5cdFx0dGhpcy5jYXNjYWRlID0gZmFsc2U7XG5cdFx0dGhpcy5zdGFydFk7XG5cdFx0dGhpcy5tb3ZlRW5kWTtcblx0XHR0aGlzLm1vdmVZO1xuXHRcdHRoaXMub2xkTW92ZVk7XG5cdFx0dGhpcy5vZmZzZXQgPSAwO1xuXHRcdHRoaXMub2Zmc2V0U3VtID0gMDtcblx0XHR0aGlzLm92ZXJzaXplQm9yZGVyO1xuXHRcdHRoaXMuY3VyRGlzdGFuY2UgPSBbXTtcblx0XHR0aGlzLmNsaWNrU3RhdHVzID0gZmFsc2U7XG5cdFx0dGhpcy5pc1BDID0gdHJ1ZTtcblx0XHR0aGlzLmluaXQoY29uZmlnKTtcblx0fVxuXHRNb2JpbGVTZWxlY3QucHJvdG90eXBlID0ge1xuXHRcdGNvbnN0cnVjdG9yOiBNb2JpbGVTZWxlY3QsXG5cdFx0aW5pdDogZnVuY3Rpb24oY29uZmlnKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRpZihjb25maWcud2hlZWxzWzBdLmRhdGEubGVuZ3RoPT0wKXtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignbW9iaWxlU2VsZWN0IGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBpbnN0YWxsZWQsIGJ1dCB0aGUgZGF0YSBpcyBlbXB0eSBhbmQgY2Fubm90IGJlIGluaXRpYWxpemVkLicpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRfdGhpcy5rZXlNYXAgPSBjb25maWcua2V5TWFwID8gY29uZmlnLmtleU1hcCA6IHtpZDonaWQnLCB2YWx1ZTondmFsdWUnLCBjaGlsZHM6J2NoaWxkcyd9O1xuXHRcdFx0X3RoaXMuY2hlY2tEYXRhVHlwZSgpO1xuXHRcdFx0X3RoaXMucmVuZGVyV2hlZWxzKF90aGlzLndoZWVsc0RhdGEsIGNvbmZpZy5jYW5jZWxCdG5UZXh0LCBjb25maWcuZW5zdXJlQnRuVGV4dCk7XG5cdFx0XHRfdGhpcy50cmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb25maWcudHJpZ2dlcik7XG5cdFx0XHRpZighX3RoaXMudHJpZ2dlcil7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ21vYmlsZVNlbGVjdCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgaW5zdGFsbGVkLCBidXQgbm8gdHJpZ2dlciBmb3VuZCBvbiB5b3VyIHBhZ2UuJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdF90aGlzLndoZWVsID0gZ2V0Q2xhc3MoX3RoaXMubW9iaWxlU2VsZWN0LCd3aGVlbCcpO1xuXHRcdFx0X3RoaXMuc2xpZGVyID0gZ2V0Q2xhc3MoX3RoaXMubW9iaWxlU2VsZWN0LCdzZWxlY3RDb250YWluZXInKTtcblx0XHRcdF90aGlzLndoZWVscyA9IF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcud2hlZWxzJyk7XG5cdFx0XHRfdGhpcy5saUhlaWdodCA9IF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCdsaScpLm9mZnNldEhlaWdodDtcblx0XHRcdF90aGlzLmVuc3VyZUJ0biA9IF90aGlzLm1vYmlsZVNlbGVjdC5xdWVyeVNlbGVjdG9yKCcuZW5zdXJlJyk7XG5cdFx0XHRfdGhpcy5jYW5jZWxCdG4gPSBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLmNhbmNlbCcpO1xuXHRcdFx0X3RoaXMuZ3JheUxheWVyID0gX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy5ncmF5TGF5ZXInKTtcblx0XHRcdF90aGlzLnBvcFVwID0gX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50Jyk7XG5cdFx0XHRfdGhpcy5jYWxsYmFjayA9IGNvbmZpZy5jYWxsYmFjayB8fCBmdW5jdGlvbigpe307XG5cdFx0XHRfdGhpcy5jYW5jZWwgPSBjb25maWcuY2FuY2VsIHx8IGZ1bmN0aW9uKCl7fTtcblx0XHRcdF90aGlzLnRyYW5zaXRpb25FbmQgPSBjb25maWcudHJhbnNpdGlvbkVuZCB8fCBmdW5jdGlvbigpe307XG5cdFx0XHRfdGhpcy5vblNob3cgPSBjb25maWcub25TaG93IHx8IGZ1bmN0aW9uKCl7fTtcblx0XHRcdF90aGlzLm9uSGlkZSA9IGNvbmZpZy5vbkhpZGUgfHwgZnVuY3Rpb24oKXt9O1xuXHRcdFx0X3RoaXMuaW5pdFBvc2l0aW9uID0gY29uZmlnLnBvc2l0aW9uIHx8IFtdO1xuXHRcdFx0X3RoaXMudGl0bGVUZXh0ID0gY29uZmlnLnRpdGxlIHx8ICcnO1xuXHRcdFx0X3RoaXMuY29ubmVjdG9yID0gY29uZmlnLmNvbm5lY3RvciB8fCAnICc7XG5cdFx0XHRfdGhpcy50cmlnZ2VyRGlzcGxheURhdGEgPSAhKHR5cGVvZihjb25maWcudHJpZ2dlckRpc3BsYXlEYXRhKT09J3VuZGVmaW5lZCcpID8gY29uZmlnLnRyaWdnZXJEaXNwbGF5RGF0YSA6IHRydWU7XG5cdFx0XHRfdGhpcy50cmlnZ2VyLnN0eWxlLmN1cnNvcj0ncG9pbnRlcic7XG5cdFx0XHRfdGhpcy5zZXRTdHlsZShjb25maWcpO1xuXHRcdFx0X3RoaXMuc2V0VGl0bGUoX3RoaXMudGl0bGVUZXh0KTtcblx0XHRcdF90aGlzLmNoZWNrSXNQQygpO1xuXHRcdFx0X3RoaXMuY2hlY2tDYXNjYWRlKCk7XG5cdFx0XHRfdGhpcy5hZGRMaXN0ZW5lckFsbCgpO1xuXG5cdFx0XHRpZiAoX3RoaXMuY2FzY2FkZSkge1xuXHRcdFx0XHRfdGhpcy5pbml0Q2FzY2FkZSgpO1xuXHRcdFx0fVxuXHRcdFx0Ly/lrprkvY0g5Yid5aeL5L2N572uXG5cdFx0XHRpZihfdGhpcy5pbml0UG9zaXRpb24ubGVuZ3RoIDwgX3RoaXMuc2xpZGVyLmxlbmd0aCl7XG5cdFx0XHRcdHZhciBkaWZmID0gX3RoaXMuc2xpZGVyLmxlbmd0aCAtIF90aGlzLmluaXRQb3NpdGlvbi5sZW5ndGg7XG5cdFx0XHRcdGZvcih2YXIgaT0wOyBpPGRpZmY7IGkrKyl7XG5cdFx0XHRcdFx0X3RoaXMuaW5pdFBvc2l0aW9uLnB1c2goMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0X3RoaXMuc2V0Q3VyRGlzdGFuY2UoX3RoaXMuaW5pdFBvc2l0aW9uKTtcblxuXG5cdFx0XHQvL+aMiemSruebkeWQrFxuXHRcdFx0X3RoaXMuY2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbigpe1xuXHRcdFx0XHRfdGhpcy5oaWRlKCk7XG5cdFx0XHRcdF90aGlzLmNhbmNlbChfdGhpcy5jdXJJbmRleEFyciwgX3RoaXMuY3VyVmFsdWUpO1xuXHRcdCAgICB9KTtcblxuXHRcdCAgICBfdGhpcy5lbnN1cmVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdF90aGlzLmhpZGUoKTtcblx0XHRcdCAgICBpZighX3RoaXMubGlIZWlnaHQpIHtcblx0XHRcdCAgICAgICAgX3RoaXMubGlIZWlnaHQgPSAgX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJ2xpJykub2Zmc2V0SGVpZ2h0O1xuXHRcdFx0ICAgIH1cblx0XHRcdFx0dmFyIHRlbXBWYWx1ZSA9Jyc7XG5cdFx0ICAgIFx0Zm9yKHZhciBpPTA7IGk8X3RoaXMud2hlZWwubGVuZ3RoOyBpKyspe1xuXHRcdCAgICBcdFx0aT09X3RoaXMud2hlZWwubGVuZ3RoLTEgPyB0ZW1wVmFsdWUgKz0gX3RoaXMuZ2V0SW5uZXJIdG1sKGkpIDogdGVtcFZhbHVlICs9IF90aGlzLmdldElubmVySHRtbChpKSArIF90aGlzLmNvbm5lY3Rvcjtcblx0XHQgICAgXHR9XG5cdFx0ICAgIFx0aWYoX3RoaXMudHJpZ2dlckRpc3BsYXlEYXRhKXtcblx0XHQgICAgXHRcdF90aGlzLnRyaWdnZXIuaW5uZXJIVE1MID0gdGVtcFZhbHVlO1xuXHRcdCAgICBcdH1cblx0XHQgICAgXHRfdGhpcy5jdXJJbmRleEFyciA9IF90aGlzLmdldEluZGV4QXJyKCk7XG5cdFx0ICAgIFx0X3RoaXMuY3VyVmFsdWUgPSBfdGhpcy5nZXRDdXJWYWx1ZSgpO1xuXHRcdCAgICBcdF90aGlzLmNhbGxiYWNrKF90aGlzLmN1ckluZGV4QXJyLCBfdGhpcy5jdXJWYWx1ZSk7XG5cdFx0ICAgIH0pO1xuXG5cdFx0ICAgIF90aGlzLnRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uKCl7XG5cdFx0ICAgIFx0X3RoaXMuc2hvdygpO1xuXHRcdCAgICB9KTtcblx0XHQgICAgX3RoaXMuZ3JheUxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbigpe1xuXHRcdFx0XHRfdGhpcy5oaWRlKCk7XG5cdFx0XHRcdF90aGlzLmNhbmNlbChfdGhpcy5jdXJJbmRleEFyciwgX3RoaXMuY3VyVmFsdWUpO1xuXHRcdCAgICB9KTtcblx0XHQgICAgX3RoaXMucG9wVXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uKCl7XG5cdFx0ICAgIFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ICAgIH0pO1xuXG5cdFx0XHRfdGhpcy5maXhSb3dTdHlsZSgpOyAvL+S/ruato+WIl+aVsFxuXHRcdH0sXG5cblx0XHRzZXRUaXRsZTogZnVuY3Rpb24oc3RyaW5nKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRfdGhpcy50aXRsZVRleHQgPSBzdHJpbmc7XG5cdFx0XHRfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLnRpdGxlJykuaW5uZXJIVE1MID0gX3RoaXMudGl0bGVUZXh0O1xuXHRcdH0sXG5cblx0XHRzZXRTdHlsZTogZnVuY3Rpb24oY29uZmlnKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRpZihjb25maWcuZW5zdXJlQnRuQ29sb3Ipe1xuXHRcdFx0XHRfdGhpcy5lbnN1cmVCdG4uc3R5bGUuY29sb3IgPSBjb25maWcuZW5zdXJlQnRuQ29sb3I7XG5cdFx0XHR9XG5cdFx0XHRpZihjb25maWcuY2FuY2VsQnRuQ29sb3Ipe1xuXHRcdFx0XHRfdGhpcy5jYW5jZWxCdG4uc3R5bGUuY29sb3IgPSBjb25maWcuY2FuY2VsQnRuQ29sb3I7XG5cdFx0XHR9XG5cdFx0XHRpZihjb25maWcudGl0bGVDb2xvcil7XG5cdFx0XHRcdF90aGlzLnRpdGxlID0gX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpO1xuXHRcdFx0XHRfdGhpcy50aXRsZS5zdHlsZS5jb2xvciA9IGNvbmZpZy50aXRsZUNvbG9yO1xuXHRcdFx0fVxuXHRcdFx0aWYoY29uZmlnLnRleHRDb2xvcil7XG5cdFx0XHRcdF90aGlzLnBhbmVsID0gX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbCcpO1xuXHRcdFx0XHRfdGhpcy5wYW5lbC5zdHlsZS5jb2xvciA9IGNvbmZpZy50ZXh0Q29sb3I7XG5cdFx0XHR9XG5cdFx0XHRpZihjb25maWcudGl0bGVCZ0NvbG9yKXtcblx0XHRcdFx0X3RoaXMuYnRuQmFyID0gX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy5idG5CYXInKTtcblx0XHRcdFx0X3RoaXMuYnRuQmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbmZpZy50aXRsZUJnQ29sb3I7XG5cdFx0XHR9XG5cdFx0XHRpZihjb25maWcuYmdDb2xvcil7XG5cdFx0XHRcdF90aGlzLnBhbmVsID0gX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbCcpO1xuXHRcdFx0XHRfdGhpcy5zaGFkb3dNYXNrID0gX3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy5zaGFkb3dNYXNrJyk7XG5cdFx0XHRcdF90aGlzLnBhbmVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbmZpZy5iZ0NvbG9yO1xuXHRcdFx0XHRfdGhpcy5zaGFkb3dNYXNrLnN0eWxlLmJhY2tncm91bmQgPSAnbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgJysgY29uZmlnLmJnQ29sb3IgKyAnLCByZ2JhKDI1NSwgMjU1LCAyNTUsIDApLCAnKyBjb25maWcuYmdDb2xvciArICcpJztcblx0XHRcdH1cblx0XHRcdGlmKCFpc05hTihjb25maWcubWFza09wYWNpdHkpKXtcblx0XHRcdFx0X3RoaXMuZ3JheU1hc2sgPSBfdGhpcy5tb2JpbGVTZWxlY3QucXVlcnlTZWxlY3RvcignLmdyYXlMYXllcicpO1xuXHRcdFx0XHRfdGhpcy5ncmF5TWFzay5zdHlsZS5iYWNrZ3JvdW5kID0gJ3JnYmEoMCwgMCwgMCwgJysgY29uZmlnLm1hc2tPcGFjaXR5ICsnKSc7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGNoZWNrSXNQQzogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHR2YXIgc1VzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcblx0XHRcdHZhciBiSXNJcGFkID0gc1VzZXJBZ2VudC5tYXRjaCgvaXBhZC9pKSA9PSBcImlwYWRcIjtcblx0XHRcdHZhciBiSXNJcGhvbmVPcyA9IHNVc2VyQWdlbnQubWF0Y2goL2lwaG9uZSBvcy9pKSA9PSBcImlwaG9uZSBvc1wiO1xuXHRcdFx0dmFyIGJJc01pZHAgPSBzVXNlckFnZW50Lm1hdGNoKC9taWRwL2kpID09IFwibWlkcFwiO1xuXHRcdFx0dmFyIGJJc1VjNyA9IHNVc2VyQWdlbnQubWF0Y2goL3J2OjEuMi4zLjQvaSkgPT0gXCJydjoxLjIuMy40XCI7XG5cdFx0XHR2YXIgYklzVWMgPSBzVXNlckFnZW50Lm1hdGNoKC91Y3dlYi9pKSA9PSBcInVjd2ViXCI7XG5cdFx0XHR2YXIgYklzQW5kcm9pZCA9IHNVc2VyQWdlbnQubWF0Y2goL2FuZHJvaWQvaSkgPT0gXCJhbmRyb2lkXCI7XG5cdFx0XHR2YXIgYklzQ0UgPSBzVXNlckFnZW50Lm1hdGNoKC93aW5kb3dzIGNlL2kpID09IFwid2luZG93cyBjZVwiO1xuXHRcdFx0dmFyIGJJc1dNID0gc1VzZXJBZ2VudC5tYXRjaCgvd2luZG93cyBtb2JpbGUvaSkgPT0gXCJ3aW5kb3dzIG1vYmlsZVwiO1xuXHRcdFx0aWYgKChiSXNJcGFkIHx8IGJJc0lwaG9uZU9zIHx8IGJJc01pZHAgfHwgYklzVWM3IHx8IGJJc1VjIHx8IGJJc0FuZHJvaWQgfHwgYklzQ0UgfHwgYklzV00pKSB7XG5cdFx0XHQgICAgX3RoaXMuaXNQQyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0sXG5cbiBcdFx0c2hvdzogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMubW9iaWxlU2VsZWN0LmNsYXNzTGlzdC5hZGQoJ21vYmlsZVNlbGVjdC1zaG93Jyk7XG5cdFx0XHRpZiAodHlwZW9mIHRoaXMub25TaG93ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRoaXMub25TaG93KHRoaXMpO1xuXHRcdFx0fVxuICBcdFx0fSxcblxuXHQgICAgaGlkZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLm1vYmlsZVNlbGVjdC5jbGFzc0xpc3QucmVtb3ZlKCdtb2JpbGVTZWxlY3Qtc2hvdycpO1xuXHRcdFx0aWYgKHR5cGVvZiB0aGlzLm9uSGlkZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR0aGlzLm9uSGlkZSh0aGlzKTtcblx0XHRcdH1cblx0ICAgIH0sXG5cblx0XHRyZW5kZXJXaGVlbHM6IGZ1bmN0aW9uKHdoZWVsc0RhdGEsIGNhbmNlbEJ0blRleHQsIGVuc3VyZUJ0blRleHQpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdHZhciBjYW5jZWxUZXh0ID0gY2FuY2VsQnRuVGV4dCA/IGNhbmNlbEJ0blRleHQgOiAn5Y+W5raIJztcblx0XHRcdHZhciBlbnN1cmVUZXh0ID0gZW5zdXJlQnRuVGV4dCA/IGVuc3VyZUJ0blRleHQgOiAn56Gu6K6kJztcblx0XHRcdF90aGlzLm1vYmlsZVNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRfdGhpcy5tb2JpbGVTZWxlY3QuY2xhc3NOYW1lID0gXCJtb2JpbGVTZWxlY3RcIjtcblx0XHRcdF90aGlzLm1vYmlsZVNlbGVjdC5pbm5lckhUTUwgPVxuXHRcdCAgICBcdCc8ZGl2IGNsYXNzPVwiZ3JheUxheWVyXCI+PC9kaXY+Jytcblx0XHQgICAgICAgICc8ZGl2IGNsYXNzPVwiY29udGVudFwiPicrXG5cdFx0ICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJidG5CYXJcIj4nK1xuXHRcdCAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZpeFdpZHRoXCI+Jytcblx0XHQgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FuY2VsXCI+JysgY2FuY2VsVGV4dCArJzwvZGl2PicrXG5cdFx0ICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInRpdGxlXCI+PC9kaXY+Jytcblx0XHQgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZW5zdXJlXCI+JysgZW5zdXJlVGV4dCArJzwvZGl2PicrXG5cdFx0ICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuXHRcdCAgICAgICAgICAgICc8L2Rpdj4nK1xuXHRcdCAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicGFuZWxcIj4nK1xuXHRcdCAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZpeFdpZHRoXCI+Jytcblx0XHQgICAgICAgICAgICAgICAgXHQnPGRpdiBjbGFzcz1cIndoZWVsc1wiPicrXG5cdFx0XHQgICAgICAgICAgICAgICAgJzwvZGl2PicrXG5cdFx0ICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNlbGVjdExpbmVcIj48L2Rpdj4nK1xuXHRcdCAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJzaGFkb3dNYXNrXCI+PC9kaXY+Jytcblx0XHQgICAgICAgICAgICAgICAgJzwvZGl2PicrXG5cdFx0ICAgICAgICAgICAgJzwvZGl2PicrXG5cdFx0ICAgICAgICAnPC9kaXY+Jztcblx0XHQgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChfdGhpcy5tb2JpbGVTZWxlY3QpO1xuXG5cdFx0XHQvL+agueaNruaVsOaNrumVv+W6puadpea4suafk1xuXG5cdFx0XHR2YXIgdGVtcEhUTUw9Jyc7XG5cdFx0XHRmb3IodmFyIGk9MDsgaTx3aGVlbHNEYXRhLmxlbmd0aDsgaSsrKXtcblx0XHRcdC8v5YiXXG5cdFx0XHRcdHRlbXBIVE1MICs9ICc8ZGl2IGNsYXNzPVwid2hlZWxcIj48dWwgY2xhc3M9XCJzZWxlY3RDb250YWluZXJcIj4nO1xuXHRcdFx0XHRpZihfdGhpcy5qc29uVHlwZSl7XG5cdFx0XHRcdFx0Zm9yKHZhciBqPTA7IGo8d2hlZWxzRGF0YVtpXS5kYXRhLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0XHQvL+ihjFxuXHRcdFx0XHRcdFx0dGVtcEhUTUwgKz0gJzxsaSBkYXRhLWlkPVwiJyt3aGVlbHNEYXRhW2ldLmRhdGFbal1bX3RoaXMua2V5TWFwLmlkXSsnXCI+Jyt3aGVlbHNEYXRhW2ldLmRhdGFbal1bX3RoaXMua2V5TWFwLnZhbHVlXSsnPC9saT4nO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0Zm9yKHZhciBqPTA7IGo8d2hlZWxzRGF0YVtpXS5kYXRhLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0XHQvL+ihjFxuXHRcdFx0XHRcdFx0dGVtcEhUTUwgKz0gJzxsaT4nK3doZWVsc0RhdGFbaV0uZGF0YVtqXSsnPC9saT4nO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0ZW1wSFRNTCArPSAnPC91bD48L2Rpdj4nO1xuXHRcdFx0fVxuXHRcdFx0X3RoaXMubW9iaWxlU2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJy53aGVlbHMnKS5pbm5lckhUTUwgPSB0ZW1wSFRNTDtcblx0XHR9LFxuXG5cdFx0YWRkTGlzdGVuZXJBbGw6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0Zm9yKHZhciBpPTA7IGk8X3RoaXMuc2xpZGVyLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0Ly/miYvlir/nm5HlkKxcblx0XHRcdFx0KGZ1bmN0aW9uIChpKSB7XG5cdFx0XHRcdFx0X3RoaXMuYWRkTGlzdGVuZXJXaGVlbChfdGhpcy53aGVlbFtpXSwgaSk7XG5cdFx0XHRcdH0pKGkpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRhZGRMaXN0ZW5lcldoZWVsOiBmdW5jdGlvbih0aGVXaGVlbCwgaW5kZXgpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdHRoZVdoZWVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdF90aGlzLnRvdWNoKGV2ZW50LCB0aGlzLmZpcnN0Q2hpbGQsIGluZGV4KTtcblx0XHRcdH0sZmFsc2UpO1xuXHRcdFx0dGhlV2hlZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdF90aGlzLnRvdWNoKGV2ZW50LCB0aGlzLmZpcnN0Q2hpbGQsIGluZGV4KTtcblx0XHRcdH0sZmFsc2UpO1xuXHRcdFx0dGhlV2hlZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRfdGhpcy50b3VjaChldmVudCwgdGhpcy5maXJzdENoaWxkLCBpbmRleCk7XG5cdFx0XHR9LGZhbHNlKTtcblxuXHRcdFx0aWYoX3RoaXMuaXNQQyl7XG5cdFx0XHRcdC8v5aaC5p6c5pivUEPnq6/liJnlho3lop7liqDmi5bmi73nm5HlkKwg5pa55L6/6LCD6K+VXG5cdFx0XHRcdHRoZVdoZWVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRfdGhpcy5kcmFnQ2xpY2soZXZlbnQsIHRoaXMuZmlyc3RDaGlsZCwgaW5kZXgpO1xuXHRcdFx0XHR9LGZhbHNlKTtcblx0XHRcdFx0dGhlV2hlZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdF90aGlzLmRyYWdDbGljayhldmVudCwgdGhpcy5maXJzdENoaWxkLCBpbmRleCk7XG5cdFx0XHRcdH0sZmFsc2UpO1xuXHRcdFx0XHR0aGVXaGVlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdF90aGlzLmRyYWdDbGljayhldmVudCwgdGhpcy5maXJzdENoaWxkLCBpbmRleCk7XG5cdFx0XHRcdH0sdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGNoZWNrRGF0YVR5cGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0aWYodHlwZW9mKF90aGlzLndoZWVsc0RhdGFbMF0uZGF0YVswXSk9PSdvYmplY3QnKXtcblx0XHRcdFx0X3RoaXMuanNvblR5cGUgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRjaGVja0Nhc2NhZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0aWYoX3RoaXMuanNvblR5cGUpe1xuXHRcdFx0XHR2YXIgbm9kZSA9IF90aGlzLndoZWVsc0RhdGFbMF0uZGF0YTtcblx0XHRcdFx0Zm9yKHZhciBpPTA7IGk8bm9kZS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0aWYoX3RoaXMua2V5TWFwLmNoaWxkcyBpbiBub2RlW2ldICYmIG5vZGVbaV1bX3RoaXMua2V5TWFwLmNoaWxkc10ubGVuZ3RoID4gMCl7XG5cdFx0XHRcdFx0XHRfdGhpcy5jYXNjYWRlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdF90aGlzLmNhc2NhZGVKc29uRGF0YSA9IF90aGlzLndoZWVsc0RhdGFbMF0uZGF0YTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdF90aGlzLmNhc2NhZGUgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Z2VuZXJhdGVBcnJEYXRhOiBmdW5jdGlvbiAodGFyZ2V0QXJyKSB7XG5cdFx0XHR2YXIgdGVtcEFyciA9IFtdO1xuXHRcdFx0dmFyIGtleU1hcF9pZCA9IHRoaXMua2V5TWFwLmlkO1xuXHRcdFx0dmFyIGtleU1hcF92YWx1ZSA9IHRoaXMua2V5TWFwLnZhbHVlO1xuXHRcdFx0Zm9yKHZhciBpPTA7IGk8dGFyZ2V0QXJyLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0dmFyIHRlbXBPYmogPSB7fTtcblx0XHRcdFx0dGVtcE9ialtrZXlNYXBfaWRdID0gdGFyZ2V0QXJyW2ldW3RoaXMua2V5TWFwLmlkXTtcblx0XHRcdFx0dGVtcE9ialtrZXlNYXBfdmFsdWVdID0gdGFyZ2V0QXJyW2ldW3RoaXMua2V5TWFwLnZhbHVlXTtcblx0XHRcdFx0dGVtcEFyci5wdXNoKHRlbXBPYmopO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRlbXBBcnI7XG5cdFx0fSxcblxuXHRcdGluaXRDYXNjYWRlOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdF90aGlzLmRpc3BsYXlKc29uLnB1c2goX3RoaXMuZ2VuZXJhdGVBcnJEYXRhKF90aGlzLmNhc2NhZGVKc29uRGF0YSkpO1xuXHRcdFx0aWYoX3RoaXMuaW5pdFBvc2l0aW9uLmxlbmd0aD4wKXtcblx0XHRcdFx0X3RoaXMuaW5pdERlZXBDb3VudCA9IDA7XG5cdFx0XHRcdF90aGlzLmluaXRDaGVja0FyckRlZXAoX3RoaXMuY2FzY2FkZUpzb25EYXRhW190aGlzLmluaXRQb3NpdGlvblswXV0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdF90aGlzLmNoZWNrQXJyRGVlcChfdGhpcy5jYXNjYWRlSnNvbkRhdGFbMF0pO1xuXHRcdFx0fVxuXHRcdFx0X3RoaXMucmVSZW5kZXJXaGVlbHMoKTtcblx0XHR9LFxuXG5cdFx0aW5pdENoZWNrQXJyRGVlcDogZnVuY3Rpb24gKHBhcmVudCkge1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdGlmKHBhcmVudCl7XG5cdFx0XHRcdGlmIChfdGhpcy5rZXlNYXAuY2hpbGRzIGluIHBhcmVudCAmJiBwYXJlbnRbX3RoaXMua2V5TWFwLmNoaWxkc10ubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdF90aGlzLmRpc3BsYXlKc29uLnB1c2goX3RoaXMuZ2VuZXJhdGVBcnJEYXRhKHBhcmVudFtfdGhpcy5rZXlNYXAuY2hpbGRzXSkpO1xuXHRcdFx0XHRcdF90aGlzLmluaXREZWVwQ291bnQrKztcblx0XHRcdFx0XHR2YXIgbmV4dE5vZGUgPSBwYXJlbnRbX3RoaXMua2V5TWFwLmNoaWxkc11bX3RoaXMuaW5pdFBvc2l0aW9uW190aGlzLmluaXREZWVwQ291bnRdXTtcblx0XHRcdFx0XHRpZihuZXh0Tm9kZSl7XG5cdFx0XHRcdFx0XHRfdGhpcy5pbml0Q2hlY2tBcnJEZWVwKG5leHROb2RlKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdF90aGlzLmNoZWNrQXJyRGVlcChwYXJlbnRbX3RoaXMua2V5TWFwLmNoaWxkc11bMF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRjaGVja0FyckRlZXA6IGZ1bmN0aW9uIChwYXJlbnQpIHtcblx0XHRcdC8v5qOA5rWL5a2Q6IqC54K55rex5bqmICDkv67mlLkgZGlzcGxheUpzb25cblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRpZihwYXJlbnQpe1xuXHRcdFx0XHRpZiAoX3RoaXMua2V5TWFwLmNoaWxkcyBpbiBwYXJlbnQgJiYgcGFyZW50W190aGlzLmtleU1hcC5jaGlsZHNdLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRfdGhpcy5kaXNwbGF5SnNvbi5wdXNoKF90aGlzLmdlbmVyYXRlQXJyRGF0YShwYXJlbnRbX3RoaXMua2V5TWFwLmNoaWxkc10pKTsgLy/nlJ/miJDlrZDoioLngrnmlbDnu4Rcblx0XHRcdFx0XHRfdGhpcy5jaGVja0FyckRlZXAocGFyZW50W190aGlzLmtleU1hcC5jaGlsZHNdWzBdKTsvL+ajgOa1i+S4i+S4gOS4quWtkOiKgueCuVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGNoZWNrUmFuZ2U6IGZ1bmN0aW9uKGluZGV4LCBwb3NJbmRleEFycil7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0dmFyIGRlbGV0ZU51bSA9IF90aGlzLmRpc3BsYXlKc29uLmxlbmd0aC0xLWluZGV4O1xuXHRcdFx0Zm9yKHZhciBpPTA7IGk8ZGVsZXRlTnVtOyBpKyspe1xuXHRcdFx0XHRfdGhpcy5kaXNwbGF5SnNvbi5wb3AoKTsgLy/kv67mlLkgZGlzcGxheUpzb25cblx0XHRcdH1cblx0XHRcdHZhciByZXN1bHROb2RlO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gaW5kZXg7IGkrKyl7XG5cdFx0XHRcdGlmIChpID09IDApXG5cdFx0XHRcdFx0cmVzdWx0Tm9kZSA9IF90aGlzLmNhc2NhZGVKc29uRGF0YVtwb3NJbmRleEFyclswXV07XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJlc3VsdE5vZGUgPSByZXN1bHROb2RlW190aGlzLmtleU1hcC5jaGlsZHNdW3Bvc0luZGV4QXJyW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0X3RoaXMuY2hlY2tBcnJEZWVwKHJlc3VsdE5vZGUpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhfdGhpcy5kaXNwbGF5SnNvbik7XG5cdFx0XHRfdGhpcy5yZVJlbmRlcldoZWVscygpO1xuXHRcdFx0X3RoaXMuZml4Um93U3R5bGUoKTtcblx0XHRcdF90aGlzLnNldEN1ckRpc3RhbmNlKF90aGlzLnJlc2V0UG9zaXRpb24oaW5kZXgsIHBvc0luZGV4QXJyKSk7XG5cdFx0fSxcblxuXHRcdHJlc2V0UG9zaXRpb246IGZ1bmN0aW9uKGluZGV4LCBwb3NJbmRleEFycil7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0dmFyIHRlbXBQb3NBcnIgPSBwb3NJbmRleEFycjtcblx0XHRcdHZhciB0ZW1wQ291bnQ7XG5cdFx0XHRpZihfdGhpcy5zbGlkZXIubGVuZ3RoID4gcG9zSW5kZXhBcnIubGVuZ3RoKXtcblx0XHRcdFx0dGVtcENvdW50ID0gX3RoaXMuc2xpZGVyLmxlbmd0aCAtIHBvc0luZGV4QXJyLmxlbmd0aDtcblx0XHRcdFx0Zm9yKHZhciBpPTA7IGk8dGVtcENvdW50OyBpKyspe1xuXHRcdFx0XHRcdHRlbXBQb3NBcnIucHVzaCgwKTtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2UgaWYoX3RoaXMuc2xpZGVyLmxlbmd0aCA8IHBvc0luZGV4QXJyLmxlbmd0aCl7XG5cdFx0XHRcdHRlbXBDb3VudCA9IHBvc0luZGV4QXJyLmxlbmd0aCAtIF90aGlzLnNsaWRlci5sZW5ndGg7XG5cdFx0XHRcdGZvcih2YXIgaT0wOyBpPHRlbXBDb3VudDsgaSsrKXtcblx0XHRcdFx0XHR0ZW1wUG9zQXJyLnBvcCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRmb3IodmFyIGk9aW5kZXgrMTsgaTwgdGVtcFBvc0Fyci5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdHRlbXBQb3NBcnJbaV0gPSAwO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRlbXBQb3NBcnI7XG5cdFx0fSxcblx0XHRyZVJlbmRlcldoZWVsczogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHQvL+WIoOmZpOWkmuS9meeahHdoZWVsXG5cdFx0XHRpZihfdGhpcy53aGVlbC5sZW5ndGggPiBfdGhpcy5kaXNwbGF5SnNvbi5sZW5ndGgpe1xuXHRcdFx0XHR2YXIgY291bnQgPSBfdGhpcy53aGVlbC5sZW5ndGggLSBfdGhpcy5kaXNwbGF5SnNvbi5sZW5ndGg7XG5cdFx0XHRcdGZvcih2YXIgaT0wOyBpPGNvdW50OyBpKyspe1xuXHRcdFx0XHRcdF90aGlzLndoZWVscy5yZW1vdmVDaGlsZChfdGhpcy53aGVlbFtfdGhpcy53aGVlbC5sZW5ndGgtMV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRmb3IodmFyIGk9MDsgaTxfdGhpcy5kaXNwbGF5SnNvbi5sZW5ndGg7IGkrKyl7XG5cdFx0XHQvL+WIl1xuXHRcdFx0XHQoZnVuY3Rpb24gKGkpIHtcblx0XHRcdFx0XHR2YXIgdGVtcEhUTUw9Jyc7XG5cdFx0XHRcdFx0aWYoX3RoaXMud2hlZWxbaV0pe1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygn5o+S5YWlTGknKTtcblx0XHRcdFx0XHRcdGZvcih2YXIgaj0wOyBqPF90aGlzLmRpc3BsYXlKc29uW2ldLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0XHRcdC8v6KGMXG5cdFx0XHRcdFx0XHRcdHRlbXBIVE1MICs9ICc8bGkgZGF0YS1pZD1cIicrX3RoaXMuZGlzcGxheUpzb25baV1bal1bX3RoaXMua2V5TWFwLmlkXSsnXCI+JytfdGhpcy5kaXNwbGF5SnNvbltpXVtqXVtfdGhpcy5rZXlNYXAudmFsdWVdKyc8L2xpPic7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRfdGhpcy5zbGlkZXJbaV0uaW5uZXJIVE1MID0gdGVtcEhUTUw7XG5cblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHZhciB0ZW1wV2hlZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0XHRcdFx0dGVtcFdoZWVsLmNsYXNzTmFtZSA9IFwid2hlZWxcIjtcblx0XHRcdFx0XHRcdHRlbXBIVE1MID0gJzx1bCBjbGFzcz1cInNlbGVjdENvbnRhaW5lclwiPic7XG5cdFx0XHRcdFx0XHRmb3IodmFyIGo9MDsgajxfdGhpcy5kaXNwbGF5SnNvbltpXS5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdFx0XHQvL+ihjFxuXHRcdFx0XHRcdFx0XHR0ZW1wSFRNTCArPSAnPGxpIGRhdGEtaWQ9XCInK190aGlzLmRpc3BsYXlKc29uW2ldW2pdW190aGlzLmtleU1hcC5pZF0rJ1wiPicrX3RoaXMuZGlzcGxheUpzb25baV1bal1bX3RoaXMua2V5TWFwLnZhbHVlXSsnPC9saT4nO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGVtcEhUTUwgKz0gJzwvdWw+Jztcblx0XHRcdFx0XHRcdHRlbXBXaGVlbC5pbm5lckhUTUwgPSB0ZW1wSFRNTDtcblxuXHRcdFx0XHRcdFx0X3RoaXMuYWRkTGlzdGVuZXJXaGVlbCh0ZW1wV2hlZWwsIGkpO1xuXHRcdFx0XHQgICAgXHRfdGhpcy53aGVlbHMuYXBwZW5kQ2hpbGQodGVtcFdoZWVsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9fdGhpcy7CtyhpKTtcblx0XHRcdFx0fSkoaSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHVwZGF0ZVdoZWVsczpmdW5jdGlvbihkYXRhKXtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHRpZihfdGhpcy5jYXNjYWRlKXtcblx0XHRcdFx0X3RoaXMuY2FzY2FkZUpzb25EYXRhID0gZGF0YTtcblx0XHRcdFx0X3RoaXMuZGlzcGxheUpzb24gPSBbXTtcblx0XHRcdFx0X3RoaXMuaW5pdENhc2NhZGUoKTtcblx0XHRcdFx0aWYoX3RoaXMuaW5pdFBvc2l0aW9uLmxlbmd0aCA8IF90aGlzLnNsaWRlci5sZW5ndGgpe1xuXHRcdFx0XHRcdHZhciBkaWZmID0gX3RoaXMuc2xpZGVyLmxlbmd0aCAtIF90aGlzLmluaXRQb3NpdGlvbi5sZW5ndGg7XG5cdFx0XHRcdFx0Zm9yKHZhciBpPTA7IGk8ZGlmZjsgaSsrKXtcblx0XHRcdFx0XHRcdF90aGlzLmluaXRQb3NpdGlvbi5wdXNoKDApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRfdGhpcy5zZXRDdXJEaXN0YW5jZShfdGhpcy5pbml0UG9zaXRpb24pO1xuXHRcdFx0XHRfdGhpcy5maXhSb3dTdHlsZSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR1cGRhdGVXaGVlbDogZnVuY3Rpb24oc2xpZGVySW5kZXgsIGRhdGEpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdHZhciB0ZW1wSFRNTD0nJztcblx0ICAgIFx0aWYoX3RoaXMuY2FzY2FkZSl7XG5cdCAgICBcdFx0Y29uc29sZS5lcnJvcign57qn6IGU5qC85byP5LiN5pSv5oyBdXBkYXRlV2hlZWwoKSzor7fkvb/nlKh1cGRhdGVXaGVlbHMoKeabtOaWsOaVtOS4quaVsOaNrua6kCcpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdCAgICBcdH1cblx0ICAgIFx0ZWxzZSBpZihfdGhpcy5qc29uVHlwZSl7XG5cdFx0XHRcdGZvcih2YXIgaj0wOyBqPGRhdGEubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHRcdHRlbXBIVE1MICs9ICc8bGkgZGF0YS1pZD1cIicrZGF0YVtqXVtfdGhpcy5rZXlNYXAuaWRdKydcIj4nK2RhdGFbal1bX3RoaXMua2V5TWFwLnZhbHVlXSsnPC9saT4nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF90aGlzLndoZWVsc0RhdGFbc2xpZGVySW5kZXhdID0ge2RhdGE6IGRhdGF9O1xuXHQgICAgXHR9ZWxzZXtcblx0XHRcdFx0Zm9yKHZhciBqPTA7IGo8ZGF0YS5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdFx0dGVtcEhUTUwgKz0gJzxsaT4nK2RhdGFbal0rJzwvbGk+Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRfdGhpcy53aGVlbHNEYXRhW3NsaWRlckluZGV4XSA9IGRhdGE7XG5cdCAgICBcdH1cblx0XHRcdF90aGlzLnNsaWRlcltzbGlkZXJJbmRleF0uaW5uZXJIVE1MID0gdGVtcEhUTUw7XG5cdFx0fSxcblxuXHRcdGZpeFJvd1N0eWxlOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdHZhciB3aWR0aCA9ICgxMDAvX3RoaXMud2hlZWwubGVuZ3RoKS50b0ZpeGVkKDIpO1xuXHRcdFx0Zm9yKHZhciBpPTA7IGk8X3RoaXMud2hlZWwubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRfdGhpcy53aGVlbFtpXS5zdHlsZS53aWR0aCA9IHdpZHRoKyclJztcblx0XHRcdH1cblx0XHR9LFxuXG5cdCAgICBnZXRJbmRleDogZnVuY3Rpb24oZGlzdGFuY2Upe1xuXHQgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKCgyKnRoaXMubGlIZWlnaHQtZGlzdGFuY2UpL3RoaXMubGlIZWlnaHQpO1xuXHQgICAgfSxcblxuXHQgICAgZ2V0SW5kZXhBcnI6IGZ1bmN0aW9uKCl7XG5cdCAgICBcdHZhciBfdGhpcyA9IHRoaXM7XG5cdCAgICBcdHZhciB0ZW1wID0gW107XG5cdCAgICBcdGZvcih2YXIgaT0wOyBpPF90aGlzLmN1ckRpc3RhbmNlLmxlbmd0aDsgaSsrKXtcblx0ICAgIFx0XHR0ZW1wLnB1c2goX3RoaXMuZ2V0SW5kZXgoX3RoaXMuY3VyRGlzdGFuY2VbaV0pKTtcblx0ICAgIFx0fVxuXHQgICAgXHRyZXR1cm4gdGVtcDtcblx0ICAgIH0sXG5cblx0ICAgIGdldEN1clZhbHVlOiBmdW5jdGlvbigpe1xuXHQgICAgXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHQgICAgXHR2YXIgdGVtcCA9IFtdO1xuXHQgICAgXHR2YXIgcG9zaXRpb25BcnIgPSBfdGhpcy5nZXRJbmRleEFycigpO1xuXHQgICAgXHRpZihfdGhpcy5jYXNjYWRlKXtcblx0XHQgICAgXHRmb3IodmFyIGk9MDsgaTxfdGhpcy53aGVlbC5sZW5ndGg7IGkrKyl7XG5cdFx0ICAgIFx0XHR0ZW1wLnB1c2goX3RoaXMuZGlzcGxheUpzb25baV1bcG9zaXRpb25BcnJbaV1dKTtcblx0XHQgICAgXHR9XG5cdCAgICBcdH1cblx0ICAgIFx0ZWxzZSBpZihfdGhpcy5qc29uVHlwZSl7XG5cdFx0ICAgIFx0Zm9yKHZhciBpPTA7IGk8X3RoaXMuY3VyRGlzdGFuY2UubGVuZ3RoOyBpKyspe1xuXHRcdCAgICBcdFx0dGVtcC5wdXNoKF90aGlzLndoZWVsc0RhdGFbaV0uZGF0YVtfdGhpcy5nZXRJbmRleChfdGhpcy5jdXJEaXN0YW5jZVtpXSldKTtcblx0XHQgICAgXHR9XG5cdCAgICBcdH1lbHNle1xuXHRcdCAgICBcdGZvcih2YXIgaT0wOyBpPF90aGlzLmN1ckRpc3RhbmNlLmxlbmd0aDsgaSsrKXtcblx0XHQgICAgXHRcdHRlbXAucHVzaChfdGhpcy5nZXRJbm5lckh0bWwoaSkpO1xuXHRcdCAgICBcdH1cblx0ICAgIFx0fVxuXHQgICAgXHRyZXR1cm4gdGVtcDtcblx0ICAgIH0sXG5cblx0ICAgIGdldFZhbHVlOiBmdW5jdGlvbigpe1xuXHQgICAgXHRyZXR1cm4gdGhpcy5jdXJWYWx1ZTtcblx0ICAgIH0sXG5cblx0ICAgIGNhbGNEaXN0YW5jZTogZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0cmV0dXJuIDIqdGhpcy5saUhlaWdodC1pbmRleCp0aGlzLmxpSGVpZ2h0O1xuXHQgICAgfSxcblxuXHQgICAgc2V0Q3VyRGlzdGFuY2U6IGZ1bmN0aW9uKGluZGV4QXJyKXtcblx0ICAgIFx0dmFyIF90aGlzID0gdGhpcztcblx0ICAgIFx0dmFyIHRlbXAgPSBbXTtcblx0ICAgIFx0Zm9yKHZhciBpPTA7IGk8X3RoaXMuc2xpZGVyLmxlbmd0aDsgaSsrKXtcblx0ICAgIFx0XHR0ZW1wLnB1c2goX3RoaXMuY2FsY0Rpc3RhbmNlKGluZGV4QXJyW2ldKSk7XG5cdCAgICBcdFx0X3RoaXMubW92ZVBvc2l0aW9uKF90aGlzLnNsaWRlcltpXSx0ZW1wW2ldKTtcblx0ICAgIFx0fVxuXHQgICAgXHRfdGhpcy5jdXJEaXN0YW5jZSA9IHRlbXA7XG5cdCAgICB9LFxuXG5cdCAgICBmaXhQb3NpdGlvbjogZnVuY3Rpb24oZGlzdGFuY2Upe1xuXHQgICAgICAgIHJldHVybiAtKHRoaXMuZ2V0SW5kZXgoZGlzdGFuY2UpLTIpKnRoaXMubGlIZWlnaHQ7XG5cdCAgICB9LFxuXG5cdCAgICBtb3ZlUG9zaXRpb246IGZ1bmN0aW9uKHRoZVNsaWRlciwgZGlzdGFuY2Upe1xuXHQgICAgICAgIHRoZVNsaWRlci5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoMCwnICsgZGlzdGFuY2UgKyAncHgsIDApJztcblx0ICAgICAgICB0aGVTbGlkZXIuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZTNkKDAsJyArIGRpc3RhbmNlICsgJ3B4LCAwKSc7XG5cdCAgICB9LFxuXG5cdCAgICBsb2NhdGVQb3NpdGlvbjogZnVuY3Rpb24oaW5kZXgsIHBvc0luZGV4KXtcblx0ICAgIFx0dmFyIF90aGlzID0gdGhpcztcbiAgXHQgICAgXHR0aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IHRoaXMuY2FsY0Rpc3RhbmNlKHBvc0luZGV4KTtcbiAgXHQgICAgXHR0aGlzLm1vdmVQb3NpdGlvbih0aGlzLnNsaWRlcltpbmRleF0sdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXHQgICAgICAgIGlmKF90aGlzLmNhc2NhZGUpe1xuXHRcdCAgICBcdF90aGlzLmNoZWNrUmFuZ2UoaW5kZXgsIF90aGlzLmdldEluZGV4QXJyKCkpO1xuXHRcdFx0fVxuXHQgICAgfSxcblxuXHQgICAgdXBkYXRlQ3VyRGlzdGFuY2U6IGZ1bmN0aW9uKHRoZVNsaWRlciwgaW5kZXgpe1xuXHQgICAgICAgIGlmKHRoZVNsaWRlci5zdHlsZS50cmFuc2Zvcm0pe1xuXHRcdFx0XHR0aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IHBhcnNlSW50KHRoZVNsaWRlci5zdHlsZS50cmFuc2Zvcm0uc3BsaXQoJywnKVsxXSk7XG5cdCAgICAgICAgfWVsc2V7XG5cdFx0XHRcdHRoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gcGFyc2VJbnQodGhlU2xpZGVyLnN0eWxlLndlYmtpdFRyYW5zZm9ybS5zcGxpdCgnLCcpWzFdKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBnZXREaXN0YW5jZTpmdW5jdGlvbih0aGVTbGlkZXIpe1xuXHQgICAgXHRpZih0aGVTbGlkZXIuc3R5bGUudHJhbnNmb3JtKXtcblx0ICAgIFx0XHRyZXR1cm4gcGFyc2VJbnQodGhlU2xpZGVyLnN0eWxlLnRyYW5zZm9ybS5zcGxpdCgnLCcpWzFdKTtcblx0ICAgIFx0fWVsc2V7XG5cdCAgICBcdFx0cmV0dXJuIHBhcnNlSW50KHRoZVNsaWRlci5zdHlsZS53ZWJraXRUcmFuc2Zvcm0uc3BsaXQoJywnKVsxXSk7XG5cdCAgICBcdH1cblx0ICAgIH0sXG5cblx0ICAgIGdldElubmVySHRtbDogZnVuY3Rpb24oc2xpZGVySW5kZXgpe1xuXHQgICAgXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHQgICAgXHR2YXIgaW5kZXggPSBfdGhpcy5nZXRJbmRleChfdGhpcy5jdXJEaXN0YW5jZVtzbGlkZXJJbmRleF0pO1xuXHQgICAgXHRyZXR1cm4gX3RoaXMuc2xpZGVyW3NsaWRlckluZGV4XS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKVtpbmRleF0uaW5uZXJIVE1MO1xuXHQgICAgfSxcblxuXHQgICAgdG91Y2g6IGZ1bmN0aW9uKGV2ZW50LCB0aGVTbGlkZXIsIGluZGV4KXtcblx0ICAgIFx0dmFyIF90aGlzID0gdGhpcztcblx0ICAgIFx0ZXZlbnQgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XG5cdCAgICBcdHN3aXRjaChldmVudC50eXBlKXtcblx0ICAgIFx0XHRjYXNlIFwidG91Y2hzdGFydFwiOlxuXHRcdFx0ICAgICAgICBfdGhpcy5zdGFydFkgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFk7XG5cdFx0XHQgICAgICAgIF90aGlzLnN0YXJ0WSA9IHBhcnNlSW50KF90aGlzLnN0YXJ0WSk7XG5cdFx0XHQgICAgICAgIF90aGlzLm9sZE1vdmVZID0gX3RoaXMuc3RhcnRZO1xuXHQgICAgXHRcdFx0YnJlYWs7XG5cblx0ICAgIFx0XHRjYXNlIFwidG91Y2hlbmRcIjpcblxuXHRcdFx0ICAgICAgICBfdGhpcy5tb3ZlRW5kWSA9IHBhcnNlSW50KGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkpO1xuXHRcdFx0ICAgICAgICBfdGhpcy5vZmZzZXRTdW0gPSBfdGhpcy5tb3ZlRW5kWSAtIF90aGlzLnN0YXJ0WTtcblx0XHRcdFx0XHRfdGhpcy5vdmVyc2l6ZUJvcmRlciA9IC0odGhlU2xpZGVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpLmxlbmd0aC0zKSpfdGhpcy5saUhlaWdodDtcblxuXHRcdFx0XHRcdGlmKF90aGlzLm9mZnNldFN1bSA9PSAwKXtcblx0XHRcdFx0XHRcdC8vb2Zmc2V0U3Vt5Li6MCznm7jlvZPkuo7ngrnlh7vkuovku7Zcblx0XHRcdFx0XHRcdC8vIDAgMSBbMl0gMyA0XG5cdFx0XHRcdFx0XHR2YXIgY2xpY2tPZmZldE51bSA9IHBhcnNlSW50KChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC0gX3RoaXMubW92ZUVuZFkpLzQwKTtcblx0XHRcdFx0XHRcdGlmKGNsaWNrT2ZmZXROdW0hPTIpe1xuXHRcdFx0XHRcdFx0XHR2YXIgb2Zmc2V0ID0gY2xpY2tPZmZldE51bSAtIDI7XG5cdFx0XHRcdFx0XHRcdHZhciBuZXdEaXN0YW5jZSA9IF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSArIChvZmZzZXQqX3RoaXMubGlIZWlnaHQpO1xuXHRcdFx0XHRcdFx0XHRpZigobmV3RGlzdGFuY2UgPD0gMipfdGhpcy5saUhlaWdodCkgJiYgKG5ld0Rpc3RhbmNlID49IF90aGlzLm92ZXJzaXplQm9yZGVyKSApe1xuXHRcdFx0XHRcdFx0XHRcdF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IG5ld0Rpc3RhbmNlO1xuXHRcdFx0XHRcdFx0XHRcdF90aGlzLm1vdmVQb3NpdGlvbih0aGVTbGlkZXIsIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMudHJhbnNpdGlvbkVuZChfdGhpcy5nZXRJbmRleEFycigpLF90aGlzLmdldEN1clZhbHVlKCkpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHQvL+S/ruato+S9jee9rlxuXHRcdFx0XHRcdFx0X3RoaXMudXBkYXRlQ3VyRGlzdGFuY2UodGhlU2xpZGVyLCBpbmRleCk7XG5cdFx0XHRcdFx0XHRfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gPSBfdGhpcy5maXhQb3NpdGlvbihfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXHRcdFx0XHRcdFx0X3RoaXMubW92ZVBvc2l0aW9uKHRoZVNsaWRlciwgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblxuXHRcdFx0XHQgICAgICAgIC8v5Y+N5by5XG5cdFx0XHRcdCAgICAgICAgaWYoX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdICsgX3RoaXMub2Zmc2V0U3VtID4gMipfdGhpcy5saUhlaWdodCl7XG5cdFx0XHRcdCAgICAgICAgICAgIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IDIqX3RoaXMubGlIZWlnaHQ7XG5cdFx0XHRcdCAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0ICAgICAgICAgICAgICAgIF90aGlzLm1vdmVQb3NpdGlvbih0aGVTbGlkZXIsIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cdFx0XHRcdCAgICAgICAgICAgIH0sIDEwMCk7XG5cblx0XHRcdFx0ICAgICAgICB9ZWxzZSBpZihfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0gKyBfdGhpcy5vZmZzZXRTdW0gPCBfdGhpcy5vdmVyc2l6ZUJvcmRlcil7XG5cdFx0XHRcdCAgICAgICAgICAgIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IF90aGlzLm92ZXJzaXplQm9yZGVyO1xuXHRcdFx0XHQgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCAgICAgICAgICAgICAgICBfdGhpcy5tb3ZlUG9zaXRpb24odGhlU2xpZGVyLCBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXHRcdFx0XHQgICAgICAgICAgICB9LCAxMDApO1xuXHRcdFx0XHQgICAgICAgIH1cblx0XHRcdFx0XHRcdF90aGlzLnRyYW5zaXRpb25FbmQoX3RoaXMuZ2V0SW5kZXhBcnIoKSxfdGhpcy5nZXRDdXJWYWx1ZSgpKTtcblx0XHRcdFx0XHR9XG5cbiBcdFx0XHQgICAgICAgIGlmKF90aGlzLmNhc2NhZGUpe1xuXHRcdFx0XHQgICAgICAgIF90aGlzLmNoZWNrUmFuZ2UoaW5kZXgsIF90aGlzLmdldEluZGV4QXJyKCkpO1xuXHRcdFx0XHQgICAgfVxuXG5cdCAgICBcdFx0XHRicmVhaztcblxuXHQgICAgXHRcdGNhc2UgXCJ0b3VjaG1vdmVcIjpcblx0XHRcdCAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdCAgICAgICAgX3RoaXMubW92ZVkgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFk7XG5cdFx0XHQgICAgICAgIF90aGlzLm9mZnNldCA9IF90aGlzLm1vdmVZIC0gX3RoaXMub2xkTW92ZVk7XG5cblx0XHRcdCAgICAgICAgX3RoaXMudXBkYXRlQ3VyRGlzdGFuY2UodGhlU2xpZGVyLCBpbmRleCk7XG5cdFx0XHQgICAgICAgIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSArIF90aGlzLm9mZnNldDtcblx0XHRcdCAgICAgICAgX3RoaXMubW92ZVBvc2l0aW9uKHRoZVNsaWRlciwgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblx0XHRcdCAgICAgICAgX3RoaXMub2xkTW92ZVkgPSBfdGhpcy5tb3ZlWTtcblx0ICAgIFx0XHRcdGJyZWFrO1xuXHQgICAgXHR9XG5cdCAgICB9LFxuXG5cdCAgICBkcmFnQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50LCB0aGVTbGlkZXIsIGluZGV4KXtcblx0ICAgIFx0dmFyIF90aGlzID0gdGhpcztcblx0ICAgIFx0ZXZlbnQgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XG5cdCAgICBcdHN3aXRjaChldmVudC50eXBlKXtcblx0ICAgIFx0XHRjYXNlIFwibW91c2Vkb3duXCI6XG5cdFx0XHQgICAgICAgIF90aGlzLnN0YXJ0WSA9IGV2ZW50LmNsaWVudFk7XG5cdFx0XHQgICAgICAgIF90aGlzLm9sZE1vdmVZID0gX3RoaXMuc3RhcnRZO1xuXHRcdFx0ICAgICAgICBfdGhpcy5jbGlja1N0YXR1cyA9IHRydWU7XG5cdCAgICBcdFx0XHRicmVhaztcblxuXHQgICAgXHRcdGNhc2UgXCJtb3VzZXVwXCI6XG5cblx0XHRcdCAgICAgICAgX3RoaXMubW92ZUVuZFkgPSBldmVudC5jbGllbnRZO1xuXHRcdFx0ICAgICAgICBfdGhpcy5vZmZzZXRTdW0gPSBfdGhpcy5tb3ZlRW5kWSAtIF90aGlzLnN0YXJ0WTtcblx0XHRcdFx0XHRfdGhpcy5vdmVyc2l6ZUJvcmRlciA9IC0odGhlU2xpZGVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpLmxlbmd0aC0zKSpfdGhpcy5saUhlaWdodDtcblxuXHRcdFx0XHRcdGlmKF90aGlzLm9mZnNldFN1bSA9PSAwKXtcblx0XHRcdFx0XHRcdHZhciBjbGlja09mZmV0TnVtID0gcGFyc2VJbnQoKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLSBfdGhpcy5tb3ZlRW5kWSkvNDApO1xuXHRcdFx0XHRcdFx0aWYoY2xpY2tPZmZldE51bSE9Mil7XG5cdFx0XHRcdFx0XHRcdHZhciBvZmZzZXQgPSBjbGlja09mZmV0TnVtIC0gMjtcblx0XHRcdFx0XHRcdFx0dmFyIG5ld0Rpc3RhbmNlID0gX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdICsgKG9mZnNldCpfdGhpcy5saUhlaWdodCk7XG5cdFx0XHRcdFx0XHRcdGlmKChuZXdEaXN0YW5jZSA8PSAyKl90aGlzLmxpSGVpZ2h0KSAmJiAobmV3RGlzdGFuY2UgPj0gX3RoaXMub3ZlcnNpemVCb3JkZXIpICl7XG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gbmV3RGlzdGFuY2U7XG5cdFx0XHRcdFx0XHRcdFx0X3RoaXMubW92ZVBvc2l0aW9uKHRoZVNsaWRlciwgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblx0XHRcdFx0XHRcdFx0XHRfdGhpcy50cmFuc2l0aW9uRW5kKF90aGlzLmdldEluZGV4QXJyKCksX3RoaXMuZ2V0Q3VyVmFsdWUoKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdC8v5L+u5q2j5L2N572uXG5cdFx0XHRcdFx0XHRfdGhpcy51cGRhdGVDdXJEaXN0YW5jZSh0aGVTbGlkZXIsIGluZGV4KTtcblx0XHRcdFx0XHRcdF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IF90aGlzLmZpeFBvc2l0aW9uKF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cdFx0XHRcdFx0XHRfdGhpcy5tb3ZlUG9zaXRpb24odGhlU2xpZGVyLCBfdGhpcy5jdXJEaXN0YW5jZVtpbmRleF0pO1xuXG5cdFx0XHRcdFx0XHQvL+WPjeW8uVxuXHRcdFx0XHRcdFx0aWYoX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdICsgX3RoaXMub2Zmc2V0U3VtID4gMipfdGhpcy5saUhlaWdodCl7XG5cdFx0XHRcdFx0XHQgICAgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gMipfdGhpcy5saUhlaWdodDtcblx0XHRcdFx0XHRcdCAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQgICAgICAgIF90aGlzLm1vdmVQb3NpdGlvbih0aGVTbGlkZXIsIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cdFx0XHRcdFx0XHQgICAgfSwgMTAwKTtcblxuXHRcdFx0XHRcdFx0fWVsc2UgaWYoX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdICsgX3RoaXMub2Zmc2V0U3VtIDwgX3RoaXMub3ZlcnNpemVCb3JkZXIpe1xuXHRcdFx0XHRcdFx0ICAgIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSA9IF90aGlzLm92ZXJzaXplQm9yZGVyO1xuXHRcdFx0XHRcdFx0ICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdCAgICAgICAgX3RoaXMubW92ZVBvc2l0aW9uKHRoZVNsaWRlciwgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdKTtcblx0XHRcdFx0XHRcdCAgICB9LCAxMDApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0X3RoaXMudHJhbnNpdGlvbkVuZChfdGhpcy5nZXRJbmRleEFycigpLF90aGlzLmdldEN1clZhbHVlKCkpO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHQgICAgICAgIF90aGlzLmNsaWNrU3RhdHVzID0gZmFsc2U7XG4gXHRcdFx0ICAgICAgICBpZihfdGhpcy5jYXNjYWRlKXtcblx0XHRcdFx0ICAgICAgICBfdGhpcy5jaGVja1JhbmdlKGluZGV4LCBfdGhpcy5nZXRJbmRleEFycigpKTtcblx0XHRcdCAgICBcdH1cblx0ICAgIFx0XHRcdGJyZWFrO1xuXG5cdCAgICBcdFx0Y2FzZSBcIm1vdXNlbW92ZVwiOlxuXHRcdFx0ICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ICAgICAgICBpZihfdGhpcy5jbGlja1N0YXR1cyl7XG5cdFx0XHRcdCAgICAgICAgX3RoaXMubW92ZVkgPSBldmVudC5jbGllbnRZO1xuXHRcdFx0XHQgICAgICAgIF90aGlzLm9mZnNldCA9IF90aGlzLm1vdmVZIC0gX3RoaXMub2xkTW92ZVk7XG5cdFx0XHRcdCAgICAgICAgX3RoaXMudXBkYXRlQ3VyRGlzdGFuY2UodGhlU2xpZGVyLCBpbmRleCk7XG5cdFx0XHRcdCAgICAgICAgX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdID0gX3RoaXMuY3VyRGlzdGFuY2VbaW5kZXhdICsgX3RoaXMub2Zmc2V0O1xuXHRcdFx0XHQgICAgICAgIF90aGlzLm1vdmVQb3NpdGlvbih0aGVTbGlkZXIsIF90aGlzLmN1ckRpc3RhbmNlW2luZGV4XSk7XG5cdFx0XHRcdCAgICAgICAgX3RoaXMub2xkTW92ZVkgPSBfdGhpcy5tb3ZlWTtcblx0XHRcdCAgICAgICAgfVxuXHQgICAgXHRcdFx0YnJlYWs7XG5cdCAgICBcdH1cblx0ICAgIH1cblxuXHR9O1xuXG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PSBcIm9iamVjdFwiKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBNb2JpbGVTZWxlY3Q7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIE1vYmlsZVNlbGVjdDtcblx0XHR9KVxuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5Nb2JpbGVTZWxlY3QgPSBNb2JpbGVTZWxlY3Q7XG5cdH1cbn0pKCk7XG4iLCJjb25zdCBwcmVmaXggPSAnbWMtc2VsZWN0JztcblxuY29uc3Qgc2VsZWN0cyA9ICQoYC4ke3ByZWZpeH1gKTtcblxuY2xhc3MgU2VsZWN0IHtcbiAgY29uc3RydWN0b3IoZG9tLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zZWxlY3QgPSAkKGRvbSk7XG5cbiAgICB0aGlzLnRleHRDb250YWluZXJEb20gPSB0aGlzLnNlbGVjdC5maW5kKGAuJHtwcmVmaXh9LXRleHQtY29udGFpbmVyYCk7XG4gICAgdGhpcy50ZXh0RG9tID0gdGhpcy50ZXh0Q29udGFpbmVyRG9tLmZpbmQoYC4ke3ByZWZpeH0tdGV4dGApO1xuICAgIHRoaXMudmFsdWVJbnB1dERvbSA9IHRoaXMudGV4dENvbnRhaW5lckRvbS5maW5kKGAuJHtwcmVmaXh9LXZhbHVlYCk7XG5cbiAgICB0aGlzLm9wdGlvbkNvbnRhaW5lciA9IHRoaXMuc2VsZWN0LmZpbmQoYC4ke3ByZWZpeH0tb3B0aW9uLWNvbnRhaW5lcmApO1xuICAgIHRoaXMub3B0aW9uQ29udGFpbmVySGVpZ2h0ID0gdGhpcy5vcHRpb25Db250YWluZXJbMF0uc2Nyb2xsSGVpZ2h0O1xuXG4gICAgaWYgKCFvcHRpb25zLnZhbHVlKSB7XG4gICAgICB0aGlzLnRleHREb20uYWRkQ2xhc3MoJ3BsYWNlaG9sZGVyJyk7XG4gICAgICB0aGlzLnRleHREb20udGV4dCh0aGlzLnRleHREb20uYXR0cigncGxhY2Vob2xkZXInKSk7XG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+e1xuICAgICAgdGhpcy5zZWxlY3QucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgICB9LCBmYWxzZSlcblxuICAgIHRoaXMuYWRkTGlzdGVuZXJzKClcbiAgfVxuXG4gIGhhbmRsZVRvZ2dsZShlKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0Lmhhc0NsYXNzKCdzaG93JykpIHtcbiAgICAgIHRoaXMuc2VsZWN0LnJlbW92ZUNsYXNzKCdzaG93Jyk7XG4gICAgICB0aGlzLm9wdGlvbkNvbnRhaW5lci5oZWlnaHQoMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0LmFkZENsYXNzKCdzaG93Jyk7XG4gICAgICB0aGlzLm9wdGlvbkNvbnRhaW5lci5oZWlnaHQodGhpcy5vcHRpb25Db250YWluZXJIZWlnaHQpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoYW5kbGVTZWxlY3QoZSkge1xuICAgIGxldCB2YWx1ZSA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcbiAgICBsZXQgdGV4dCA9ICQoZS50YXJnZXQpLnRleHQoKTtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuaGFuZGxlVG9nZ2xlKClcbiAgICAgICQodGhpcy50ZXh0RG9tKS5yZW1vdmVDbGFzcygncGxhY2Vob2xkZXInKVxuICAgICAgdGhpcy50ZXh0RG9tLnRleHQodGV4dCk7XG4gICAgICB0aGlzLnZhbHVlSW5wdXREb20udmFsKHZhbHVlKTtcbiAgICAgIHRoaXMuc2VsZWN0LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgdGhpcy52YWx1ZUlucHV0RG9tLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhZGRMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy50ZXh0Q29udGFpbmVyRG9tLm9uKCdjbGljaycsIHRoaXMuaGFuZGxlVG9nZ2xlLmJpbmQodGhpcykpO1xuICAgIHRoaXMub3B0aW9uQ29udGFpbmVyLm9uKCdjbGljaycsIHRoaXMuaGFuZGxlU2VsZWN0LmJpbmQodGhpcykpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0O1xuIiwiY29uc3QgcHJlZml4ID0gJ21jLXRhYic7XG5cbmNvbnN0IHRhYnMgPSAkKGAuJHtwcmVmaXh9LWdyb3VwYCk7XG5cblxuY2xhc3MgVGFiIHtcbiAgY29uc3RydWN0b3IoZG9tLCBvcHRpb25zID17fSkge1xuICAgIHRoaXMudGFiRG9tID0gJChkb20pO1xuICAgIHRoaXMuYnRuR3JvdXBEb20gPSB0aGlzLnRhYkRvbS5maW5kKGAuJHtwcmVmaXh9LWJ0bnNgKTtcbiAgICB0aGlzLmJ0bkRvbXMgPSB0aGlzLnRhYkRvbS5maW5kKGAuJHtwcmVmaXh9LWJ0bmApO1xuICAgIHRoaXMucGFuZWxEb21zID0gdGhpcy50YWJEb20uZmluZChgLiR7cHJlZml4fS1wYW5lbGApO1xuXG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIGFjdGl2ZShpbmRleCkge1xuICAgIHRoaXMuYnRuRG9tcy5lcShpbmRleCkuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIHRoaXMucGFuZWxEb21zLmVxKGluZGV4KS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gIH1cblxuICBoYW5kbGVDbGlja0J0bihlKSB7XG4gICAgbGV0IGluZGV4ID0gJChlLnRhcmdldCkuaW5kZXgoKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy50YWJEb20udHJpZ2dlcigndGFiOmNoYW5nZScsIGluZGV4KTtcbiAgICAgIHRoaXMuYWN0aXZlKGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBhZGRMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5idG5Hcm91cERvbS5vbignY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrQnRuLmJpbmQodGhpcykpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUYWI7XG4iLCJjb25zdCBUYWIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdGFiJyk7XG5jb25zdCBTZWxlY3QgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvc2VsZWN0Jyk7XG5jb25zdCBBdXRvQ29tcGxldGUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYXV0b0NvbXBsZXRlJyk7XG5jb25zdCBDYWxlbmRhciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jYWxlbmRhcicpO1xuY29uc3QgSW1hZ2VVcGxvYWRlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9pbWFnZVVwbG9hZGVyJyk7XG5jb25zdCBNb2JpbGVTZWxlY3QgPSByZXF1aXJlKCAnLi9jb21wb25lbnRzL21vYmlsZS1zZWxlY3QnKTtcbmNvbnN0IEFsZXJ0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2RpYWxvZy9hbGVydCcpO1xuY29uc3QgQ29uZmlybSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kaWFsb2cvY29uZmlybScpO1xuY29uc3QgQ29tcGxleCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kaWFsb2cvY29tcGxleCcpO1xuY29uc3QgVG9hc3QgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGlhbG9nL3RvYXN0Jyk7XG5jb25zdCBUaXAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGlhbG9nL3RpcCcpO1xuY29uc3QgQWN0aW9uU2hlZXQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGlhbG9nL2FjdGlvblNoZWV0Jyk7XG5jb25zdCBMb2FkaW5nID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2RpYWxvZy9sb2FkaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBBbGVydCxcbiAgQ29uZmlybSxcbiAgQ29tcGxleCxcbiAgVG9hc3QsXG4gIExvYWRpbmcsXG4gIFRpcCxcbiAgQWN0aW9uU2hlZXQsXG5cbiAgVGFiLFxuICBTZWxlY3QsXG4gIEF1dG9Db21wbGV0ZSxcbiAgQ2FsZW5kYXIsXG4gIEltYWdlVXBsb2FkZXIsXG4gIE1vYmlsZVNlbGVjdCxcbn1cblxuIl19
