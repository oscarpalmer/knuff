'use strict';

(function (scope) {
  var doc = scope.document;
  var baseUrl = scope.location.href;
  var elementPrototype = Element.prototype;
  var objectPrototype = Object.prototype;
  var options = {
    baseUrl: scope.location.protocol + '//' + scope.location.host + '/',
    selector: '[data-knuff]',
    onPop: null,
    onPush: null
  };

  var getLocation = function getLocation(string) {
    if (string.substr(0, options.baseUrl.length) === options.baseUrl) {
      return string;
    }

    return options.baseUrl.replace(/\/*$/, '/') + string.replace(/^\/*/, '');
  };

  var popListener = function popListener(event) {
    if (event.state && knuffOnPop) {
      options.onPop.call(event, event, event.state.knuff);
    }
  };

  var pushListener = function pushListener(event) {
    var target = event.target;


    if (target.matches(options.selector) === false || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    var location = target.getAttribute('data-knuff') || target.href || false;

    if (location === scope.location.href || location === false) {
      return;
    }

    event.preventDefault();

    location = getLocation(location);

    scope.history.pushState({ knuff: location }, null, location);

    if (knuffOnPush) {
      options.onPush.call(event, event, location);
    }
  };

  var setOptions = function setOptions(object) {
    if (objectPrototype.toString.call(object) !== '[object Object]') {
      return;
    }

    for (var property in object) {
      if (objectPrototype.hasOwnProperty.call(object, property)) {
        options[property] = object[property];
      }
    }

    if (typeof options.onPop === 'function') {
      knuffOnPop = true;
    }

    if (typeof options.onPush === 'function') {
      knuffOnPush = true;
    }
  };

  var knuffActive = false;
  var knuffOnPop = false;
  var knuffOnPush = false;

  if (typeof elementPrototype.matches === 'undefined') {
    elementPrototype.matches = elementPrototype.msMatchesSelector || elementPrototype.webkitMatchesSelector;
  }

  scope.knuff = function (userOptions) {
    if (knuffActive) {
      return;
    }

    knuffActive = true;

    setOptions(userOptions);

    scope.addEventListener('popstate', popListener);
    doc.addEventListener('click', pushListener);

    scope.history.replaceState({ knuff: baseUrl }, null, baseUrl);
  };
})(window);