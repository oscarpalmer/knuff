/*!
 * Knuff, v0.7.0 - pushstate and popstate-events, but without the "hassle"!
 * https://github.com/oscarpalmer/knuff
 * (c) Oscar Palmér, 2019, MIT @license
 */
// eslint-disable-next-line no-unused-vars
const knuff = (function knuff() {
  // Reference to document window
  const win = window;
  // Document object for document window
  const doc = win.document;
  // Initial base URL for document window
  const baseUrl = win.location.href;

  // Reference for smarter Element and Object functions
  const elementPrototype = Element.prototype;
  const objectPrototype = Object.prototype;

  // Tiny polyfill for the 'matches'-method
  if (elementPrototype.matches == null) {
    elementPrototype.matches = elementPrototype.msMatchesSelector
                               || elementPrototype.webkitMatchesSelector;
  }

  /**
   * State variables and options for Knuff.
   */
  const Knuff = {
    // Does a popstate-callback exist?
    hasPop: false,
    // Does a pushstate-callback exist?
    hasPush: false,
    // Is Knuff active?
    isActive: false,
    options: {
      // Base URL for Knuff
      baseUrl: `${win.location.protocol}//${win.location.host}/`,
      // Base selector for Knuff
      selector: '[data-knuff]',
      // No popstate-callback by default
      onPop: null,
      // No pushstate-callback by default
      onPush: null,
    },
  };

  /**
   * Collection of utility methods.
   */
  const Utils = {
    /**
     * Get the absolute location for a reference string.
     * @param {String} string Reference string
     * @return {String} An absolute location reference
     */
    getLocation(location) {
      // Reference is already absolute
      if (location.substr(0, Knuff.options.baseUrl.length) === Knuff.options.baseUrl) {
        return location;
      }

      // Sanitise the base URL
      const base = Knuff.options.baseUrl.replace(/\/*$/, '/');
      // Sanitise the path
      const path = location.replace(/^\/*/, '');

      // Concatenate and return the base URL and the path
      return `${base}${path}`;
    },

    /**
     * Override the default options with ones supplied by the user.
     * @param {Object} options An options object
     */
    setOptions(options) {
      // The object is bad, or not an actual object, so let's skip it
      if (options == null
          || objectPrototype.toString.call(options) !== '[object Object]') {
        return;
      }

      // For all items in the object…
      Object.keys(options).forEach((key) => {
        // … overwrite matching values in Knuff's options
        Knuff.options[key] = options[key];
      });

      // If a callback was added for 'popstate'-calls…
      if (options.onPop != null
          && typeof options.onPop === 'function') {
        // … set its existence variable to true
        Knuff.hasPop = true;
      }

      // If a callback was added for 'pushstate'-calls…
      if (options.onPush != null
          && typeof options.onPush === 'function') {
        // … set its existence variable to true
        Knuff.hasPush = true;
      }
    },
  };

  /**
   * Collection of event methods.
   */
  const Events = {
    /**
     * Event handler for 'popstate' events.
     * @param {Event} event A popstate event
     */
    onPop(event) {
      // The state property and a user defined callback exists…
      if (event.state && Knuff.hasPop) {
        // … so let's call it with the correct parameters
        Knuff.options.onPop.call(event, event, event.state.knuff);
      }
    },
    /**
     * Event handler for 'pushstate' events.
     * @param {Event} event A pushstate event
     */
    onPush(event) {
      // Get the event target
      const { target } = event;

      // The target doesn't match the user defined selector,
      // or it does, but the click was supplemented by a modifier key,
      // so let's ignore it
      if (target.matches(Knuff.options.selector) === false
          || event.altKey
          || event.ctrlKey
          || event.metaKey
          || event.shiftKey) {
        return;
      }

      // Get the location for the push
      let location = target.getAttribute('data-knuff') || target.href || false;

      // Don't do anything if the location is the same, or if none is available
      if (location === win.location.href
          || location === false) {
        return;
      }

      // The event matches our criteria, so let's cancel built-in events
      event.preventDefault();

      // Get the absolute version of the location
      location = Utils.getLocation(location);

      // Push the location to the browser's history
      win.history.pushState({ knuff: location }, null, location);

      // Call the user defined callback if it exists
      if (Knuff.hasPush) {
        Knuff.options.onPush.call(event, event, location);
      }
    },
  };

  /**
   * Method for initialising Knuff.
   * @param {Object} options Object of options
   */
  return (options) => {
    // If Knuff is already active,
    // it should not be possible to active it again
    if (Knuff.isActive) {
      return;
    }

    // Set Knuff to be active
    Knuff.isActive = true;

    // Override the default options
    Utils.setOptions(options);

    // Add Knuff's 'popstate' handler to the 'scope'
    win.addEventListener('popstate', Events.onPop);

    // Add knuff's 'pushstate' handler to the document of 'scope'
    doc.addEventListener('click', Events.onPush);

    // Define the original URL in the browser's history
    win.history.replaceState({ knuff: baseUrl }, null, baseUrl);
  };
}());
