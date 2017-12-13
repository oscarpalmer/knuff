((scope) => {
  //  Document for 'scope'
  const doc = scope.document;

  //  Base URL for 'scope'
  const baseUrl = scope.location.href;

  //  Reference for smarter Element functions
  const elementPrototype = Element.prototype;

  //  Reference for smarter Object functions
  const objectPrototype = Object.prototype;

  //  Default options for Knuff
  const options = {
    baseUrl: scope.location.protocol + '//' + scope.location.host + '/',
    selector: '[data-knuff]',
    onPop: null,
    onPush: null,
  };

  /**
   *  Get the absolute location for a reference string.
   *
   *  @param  {String} string - Reference string
   *  @return {String}          An absolute location reference
   */
  const getLocation = (string) => {
    //  Reference is already absolute
    if (string.substr(0, options.baseUrl.length) === options.baseUrl) {
      return string;
    }

    //  Prepend the base url to the string
    return options.baseUrl.replace(/\/*$/, '/') + string.replace(/^\/*/, '');
  };

  /**
   *  Event handler for 'popstate' events.
   *
   *  @param {Event} event - A popstate event
   */
  const popListener = (event) => {
    if (event.state && knuffOnPop) {
      //  The state property and a user defined callback exists
      options.onPop.call(event, event, event.state.knuff);
    }
  };

  /**
   *  Event handler for 'pushState' events.
   *
   *  @param {Event} event - pushState event
   */
  const pushListener = (event) => {
    //  Easy reference to event target
    const {target} = event;

    //  The target doesn't match the user defined selector,
    //  or it does, but the click was supplemented by a modifier key,
    //  so let's ignore it
    if (target.matches(options.selector) === false ||
        event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    //  Get the location for the push
    let location = target.getAttribute('data-knuff') || target.href || false;

    //  Don't do anything if the location is the same, or if none is available
    if (location === scope.location.href || location === false) {
      return;
    }

    //  The event matches our criteria, so let's cancel built-in events
    event.preventDefault();

    //  Get the absolute version of the location
    location = getLocation(location);

    //  Push the location to the browser's history
    scope.history.pushState({knuff: location}, null, location);

    //  Call the user defined callback if it exists
    if (knuffOnPush) {
      options.onPush.call(event, event, location);
    }
  };

  /**
   *  Override the default options with ones supplied by the user.
   *
   *  @param {Object} object - An options object
   */
  const setOptions = (object) => {
    //  'object' isn't a regular object, so no options are overridden
    if (objectPrototype.toString.call(object) !== '[object Object]') {
      return;
    }

    //  Override each default option where possible
    for (const property in object) {
      if (objectPrototype.hasOwnProperty.call(object, property)) {
        options[property] = object[property];
      }
    }

    //  Handy reference for calling the 'popstate' handler
    if (typeof options.onPop === 'function') {
      knuffOnPop = true;
    }

    //  Handy reference for calling the 'pushState' handler
    if (typeof options.onPush === 'function') {
      knuffOnPush = true;
    }
  };

  //  Knuff is not active, by default
  let knuffActive = false;

  //  Knuff does not have a 'popstate' handler, by default
  let knuffOnPop = false;

  //  Knuff does not have a 'pushState' handler, by default
  let knuffOnPush = false;

  //  Tiny polyfill for the 'matches' method
  if (typeof elementPrototype.matches === 'undefined') {
    elementPrototype.matches = elementPrototype.msMatchesSelector ||
                               elementPrototype.webkitMatchesSelector;
  }

  /**
   *  Global method to activate Knuff.
   *
   *  @param {Object} userOptions - Object of options
   */
  scope.knuff = (userOptions) => {
    //  If Knuff is already active,
    //  it should not be possible to active it again
    if (knuffActive) {
      return;
    }

    //  Set Knuff to be active
    knuffActive = true;

    //  Override the default options
    setOptions(userOptions);

    //  Add Knuff's 'popstate' handler to the 'scope'
    scope.addEventListener('popstate', popListener);

    //  Add knuff's 'pushState' handler to the document of 'scope'
    doc.addEventListener('click', pushListener);

    //  Define the original URL in the browser's history
    scope.history.replaceState({knuff: baseUrl}, null, baseUrl);
  };
})(window);
