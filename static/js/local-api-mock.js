/**
 * Local API emulation layer.
 *
 * This project ships as a static export of a React SPA that normally talks to a
 * remote ticketing backend (Clorian). To run the site fully locally, without any
 * real backend and without any real authentication, this script intercepts every
 * network request made to the (former) backend hosts and answers them
 * immediately with harmless, locally-generated data. This removes the infinite
 * loading spinner that used to appear while the app waited forever for a
 * network response, and it removes the need to actually log in: every
 * authentication/session call always "succeeds" with a fake local guest user.
 *
 * IMPORTANT: this must be loaded before the application bundle (main.*.js) so
 * that `window.fetch` is already patched by the time the app starts issuing
 * requests.
 */
(function () {
  "use strict";

  var nativeFetch = window.fetch ? window.fetch.bind(window) : null;

  // Hosts that used to belong to the remote backend. Any request to one of
  // these hosts (or to a relative "/api/..." path) is fully emulated locally.
  var MOCKED_HOST_PATTERNS = [
    /(^|\.)clorian\.com$/i,
    /execute-api[\w.-]*\.amazonaws\.com$/i,
  ];

  function isMockedUrl(url) {
    try {
      var parsed = new URL(url, window.location.href);
      if (parsed.origin === window.location.origin && /^\/api\//.test(parsed.pathname)) {
        return true;
      }
      return MOCKED_HOST_PATTERNS.some(function (re) {
        return re.test(parsed.hostname);
      });
    } catch (e) {
      return false;
    }
  }

  // Endpoints whose successful response is expected to be a JSON array.
  var ARRAY_ENDPOINTS = [
    /\/configuration(\?|$)/i,
    /\/language(\?|$)/i,
    /\/productCategories/i,
    /\/productInfos/i,
    /\/productTags/i,
    /\/regions/i,
    /\/forms(\?|$)/i,
    /\/promotions/i,
    /\/timeSlots/i,
    /\/paymentmethods/i,
    /\/paymentMethods/i,
    /\/events\/addons\/available/i,
    /\/analytics/i,
  ];

  function fakeGuestUser() {
    return {
      id: "local-guest",
      email: "guest@local.test",
      firstName: "Guest",
      lastName: "Local",
      loyalty: null,
    };
  }

  function fakeAuthPayload() {
    return {
      access_token: "local-mock-access-token",
      refresh_token: "local-mock-refresh-token",
      token_type: "bearer",
      expires_in: 3600,
      user: fakeGuestUser(),
    };
  }

  function fakePointOfSaleResponse() {
    var pos = window.pos || {};
    return {
      clients: [
        {
          id: pos.id != null ? pos.id : 0,
          name: pos.name || "local",
          salesGroups: [],
          products: [],
        },
      ],
    };
  }

  function buildMockBody(pathname, fullUrl) {
    if (/\/oauth\/(login|token)/i.test(pathname)) {
      return fakeAuthPayload();
    }
    if (/\/oauth\/me/i.test(pathname)) {
      return fakeGuestUser();
    }
    if (/\/pointOfSales\/me/i.test(pathname)) {
      return fakePointOfSaleResponse();
    }
    if (ARRAY_ENDPOINTS.some(function (re) { return re.test(fullUrl); })) {
      return [];
    }
    return {};
  }

  function mockResponse(url) {
    var parsed;
    try {
      parsed = new URL(url, window.location.href);
    } catch (e) {
      parsed = { pathname: url };
    }
    var body = buildMockBody(parsed.pathname || "", url);
    return new Response(JSON.stringify(body), {
      status: 200,
      statusText: "OK",
      headers: { "Content-Type": "application/json" },
    });
  }

  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url) || "";
    if (isMockedUrl(url)) {
      return Promise.resolve(mockResponse(url));
    }
    if (nativeFetch) {
      return nativeFetch(input, init);
    }
    return Promise.reject(new Error("fetch is not available"));
  };

  // Safety net: the app shows a full-screen "loading" overlay
  // (.overlay-noClorian / .overlay with display:block) while it waits for
  // its internal state to become ready. Since this is now a fully local,
  // backend-less build, that internal state machine can no longer be
  // guaranteed to reach "ready" for every screen/flow. To make sure the
  // site always finishes opening instead of getting stuck behind an
  // infinite spinner, force-hide any loading overlay that stays visible
  // for more than a couple of seconds.
  var OVERLAY_SELECTOR = ".overlay-noClorian, .overlay";
  var OVERLAY_GRACE_PERIOD_MS = 3000;
  var firstSeenAt = new Map();

  function sweepOverlays() {
    var now = Date.now();
    var overlays = document.querySelectorAll(OVERLAY_SELECTOR);
    for (var i = 0; i < overlays.length; i++) {
      var el = overlays[i];
      var isVisible = window.getComputedStyle(el).display !== "none";
      if (!isVisible) {
        firstSeenAt.delete(el);
        continue;
      }
      if (!firstSeenAt.has(el)) {
        firstSeenAt.set(el, now);
        continue;
      }
      if (now - firstSeenAt.get(el) > OVERLAY_GRACE_PERIOD_MS) {
        el.style.display = "none";
        el.setAttribute("aria-hidden", "true");
      }
    }
  }

  window.setInterval(sweepOverlays, 500);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sweepOverlays);
  } else {
    sweepOverlays();
  }
})();
