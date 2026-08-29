/*
 * Requests to the Clorian API are routed through the cors-anywhere proxy at
 * https://admln.icu/. That proxy rejects any request that does not carry one of
 * its required headers (`origin` / `x-requested-with`), and the browser refuses
 * to send some of the headers the bundle sets (`Referer` is a forbidden header
 * name), which makes the CORS preflight fail.
 *
 * This shim normalises the headers of every request addressed to the proxy:
 *  - adds `X-Requested-With: XMLHttpRequest` when it is missing;
 *  - drops forbidden headers the browser would reject anyway.
 *
 * It is loaded before the application bundle so that it wraps `fetch` and
 * `XMLHttpRequest` before any request is issued.
 */
(function () {
  'use strict';

  var PROXY_ORIGIN = 'https://admln.icu';
  var REQUESTED_WITH = 'X-Requested-With';
  // Header names the browser is not allowed to set from script; sending them
  // only produces a console warning and can break the preflight.
  var FORBIDDEN_HEADERS = ['referer', 'origin', 'host'];

  function isProxyUrl(url) {
    if (!url) {
      return false;
    }
    try {
      return new URL(String(url), window.location.href).origin === PROXY_ORIGIN;
    } catch (e) {
      return false;
    }
  }

  function normalizeHeaders(init) {
    var headers = new Headers((init && init.headers) || undefined);
    FORBIDDEN_HEADERS.forEach(function (name) {
      headers.delete(name);
    });
    if (!headers.has(REQUESTED_WITH)) {
      headers.set(REQUESTED_WITH, 'XMLHttpRequest');
    }
    return headers;
  }

  var originalFetch = window.fetch;
  if (typeof originalFetch === 'function') {
    window.fetch = function (input, init) {
      var url = input && typeof input === 'object' && 'url' in input ? input.url : input;
      if (!isProxyUrl(url)) {
        return originalFetch.apply(this, arguments);
      }
      if (input && typeof input === 'object' && 'url' in input) {
        var request = new Request(input, init);
        normalizeHeaders({ headers: request.headers }).forEach(function (value, name) {
          request.headers.set(name, value);
        });
        FORBIDDEN_HEADERS.forEach(function (name) {
          request.headers.delete(name);
        });
        return originalFetch.call(this, request);
      }
      var nextInit = Object.assign({}, init);
      nextInit.headers = normalizeHeaders(init);
      return originalFetch.call(this, input, nextInit);
    };
  }

  var XhrProto = window.XMLHttpRequest && window.XMLHttpRequest.prototype;
  if (XhrProto) {
    var originalOpen = XhrProto.open;
    var originalSetRequestHeader = XhrProto.setRequestHeader;
    var originalSend = XhrProto.send;

    XhrProto.open = function (method, url) {
      this.__isProxyRequest = isProxyUrl(url);
      this.__hasRequestedWith = false;
      return originalOpen.apply(this, arguments);
    };

    XhrProto.setRequestHeader = function (name, value) {
      if (this.__isProxyRequest) {
        if (FORBIDDEN_HEADERS.indexOf(String(name).toLowerCase()) !== -1) {
          return undefined;
        }
        if (String(name).toLowerCase() === REQUESTED_WITH.toLowerCase()) {
          this.__hasRequestedWith = true;
        }
      }
      return originalSetRequestHeader.apply(this, arguments);
    };

    XhrProto.send = function () {
      if (this.__isProxyRequest && !this.__hasRequestedWith) {
        this.__hasRequestedWith = true;
        originalSetRequestHeader.call(this, REQUESTED_WITH, 'XMLHttpRequest');
      }
      return originalSend.apply(this, arguments);
    };
  }
})();
