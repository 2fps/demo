/**
 * Koa unless middleware. Attach to any middleware and configure it to prevent/permit the
 * middleware in question to be executed.
 *
 * @module koa-unless
 */

'use strict';
var url = require('url');
// 请求方式
var methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT'];
// 存储 method: [url1, url2 ...]
var map = {};

/** Creates a wrapper middleware that verifies if the original middleware should be skipped. */
module.exports = function (options) {
  var originalMiddleware = this;

  // If a custom function was passed directly, creates a new object literal that holds it as a property called custom.
  var opts = typeof options === 'function' ? { custom: options } : options;
  opts.useOriginalUrl = (typeof opts.useOriginalUrl === 'undefined') ? true : opts.useOriginalUrl;

  filterUnless(map, options);
  // console.log('map', map);

  // Returns the middleware that wraps the original one.
  return function (ctx, next) {
    var requestedUrl = url.parse((opts.useOriginalUrl ? ctx.originalUrl : ctx.url) || '', true);

    // any match means 'skip original middleware'
    if (matchesCustom(ctx, opts) || matchesPathAndMethod(requestedUrl, ctx.method, opts) || 
      matchesExtension(requestedUrl, opts)) {
      return next();
    }

    return originalMiddleware(ctx, next);
  };
};

/**
 * Returns boolean indicating whether the custom function returns true.
 *
 * @param ctx - Koa context
 * @param opts - unless configuration
 * @returns {boolean}
 */
function matchesCustom(ctx, opts) {
  if (opts.custom) {
    return opts.custom(ctx);
  }
  return false;
}

/**
 * Returns boolean indicating whether the requestUrl matches against the paths configured.
 *
 * @param requestedUrl - url requested by user
 * @param opts - unless configuration
 * @returns {boolean}
 */
function matchesPath(requestedUrl, opts) {
  var paths = !opts.path || Array.isArray(opts.path) ? 
    (Object.prototype.toString.call(opts.path[0]) === '[object Object]' ? getParams(opts.path, 'url') : opts.path) : 
    [opts.path];

  if (paths) {
    return paths.some(function (p) {
        return (typeof p === 'string' && p === requestedUrl.pathname) ||
          (p instanceof RegExp && !!p.exec(requestedUrl.pathname));
      });
  }

  return false;
}

/**
 * Returns boolean indicating whether the requestUrl ends with the configured extensions.
 *
 * @param requestedUrl - url requested by user
 * @param opts - unless configuration
 * @returns {boolean}
 */
function matchesExtension(requestedUrl, opts) {
  var exts = !opts.ext || Array.isArray(opts.ext) ?
    opts.ext : [opts.ext];

  if (exts) {
    return exts.some(function(ext) {
      return requestedUrl.pathname.substr(ext.length * -1) === ext;
    });
  }
}

/**
 * Returns boolean indicating whether the request method matches the configured methods.
 *
 * @param method - method used (GET, POST, ...)
 * @param opts - unless configuration
 * @returns {boolean}
 */
function matchesMethod(method, opts) {
  var methods = !opts.method || Array.isArray(opts.method) ?
    (Object.prototype.toString.call(opts.path[0]) === '[object Object]' ? getParams(opts.path, 'method') : opts.method) : 
    [opts.method];

  if (methods) {
    return !!~methods.indexOf(method);
  }
}
/**
 * 处理当前请求url和method是否符合unless中的配置
 * @param {Object} requestedUrl 请求url相关信息
 * @param {String} method       请求方式 
 */
function matchesPathAndMethod(requestedUrl, method) {
  var path = requestedUrl.pathname,
    mets = map[ method.toLowerCase() ];
  if (!mets) {
    // 没这个方法
    return false;
  }

  if (!mets.length) {
    // 长度是0，证明所有请求都可以
    return true;
  }

  return mets.some(function (p) {
    return (typeof p === 'string' && p === path) ||
      (p instanceof RegExp && !!p.exec(path));
  });
}

/**
 * 将用户写的unless配置转到map数据中
 * @param {Object} map 需要存储到的空对象
 * @param {Object} opts 填写的unless配置
 */
function filterUnless(map, opts) {
  // 处理不写外层method时，默认支持所有请求方式
  var mes = opts.method ? opts.method : methods;

  if (Array.isArray(opts.path)) {
    opts.path.forEach((item) => {
      var method = [],
        url = '';
      if (Object.prototype.toString.call(item) === '[object Object]') {
        // path中的是对象的，则查找他的path和method
        url = item.url;
        method = item.method || mes;
      } else {
        // 单个字符串或正则
        url = item;
        method = mes;
      }
      // 记录
      record(map, method, url);
    });
  } else if (Array.isArray(opts.method)) {
    // 没有path，检测下是否有method
    opts.method.forEach((met) => {
      map[ met.toLowerCase() ] = [];
    });
  }
}
// 将 key: ulr1记录到map中
function record(map, method, url) {
  method.forEach((met) => {
    if (!map[ met.toLowerCase() ]) {
      // 无值时，需要先创建空数组
      map[ met.toLowerCase() ] = [];
    }
    map[ met.toLowerCase() ].push(url);
  });
}