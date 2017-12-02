((scope) => {
  const
  doc = scope.document,
  baseUrl = scope.location.href,
  elementPrototype = Element.prototype,
  objectPrototype = Object.prototype,
  options = {
    baseUrl: scope.location.protocol + '//' + scope.location.host + '/',
    selector: '[data-knuff]',
    onPop: null,
    onPush: null
  },

  getLocation = (string) => {
    if (string.substr(0, options.baseUrl.length) === options.baseUrl) {
      return string;
    }

    return options.baseUrl.replace(/\/*$/, '/') + string.replace(/^\/*/, '');
  },

  popListener = (event) => {
    if (event.state && knuffOnPop) {
      options.onPop.call(event, event, event.state.knuff);
    }
  },

  pushListener = (event) => {
    const
    {target} = event;

    if (target.matches(options.selector) === false ||
        event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    let
    location = target.getAttribute('data-knuff') || target.href || false;

    if (location === scope.location.href || location === false) {
      return;
    }

    event.preventDefault();

    location = getLocation(location);

    scope.history.pushState({ knuff: location }, null, location);

    if (knuffOnPush) {
      options.onPush.call(event, event, location)
    }
  },

  setOptions = (object) => {
    if (objectPrototype.toString.call(object) !== '[object Object]') {
      return;
    }

    for (const property in object) {
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

  let
  knuffActive = false,
  knuffOnPop  = false,
  knuffOnPush = false;

  if (typeof elementPrototype.matches === 'undefined') {
    elementPrototype.matches = elementPrototype.msMatchesSelector ||
                               elementPrototype.webkitMatchesSelector;
  }

  scope.knuff = (userOptions) => {
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
