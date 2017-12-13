# Knuff

[![npm version](https://badge.fury.io/js/knuff.svg)](https://badge.fury.io/js/knuff)

`pushstate` and `popstate`-events, but without the &ldquo;hassle&rdquo;.

## Getting started

_Knuff_ is available via [npm](//npmjs.com/package/knuff) and [yarn](//yarnpkg.com/en/package/knuff), but it's just as easy to download [the script](dist/knuff.js) and including it in your document.

However you'd like to &ldquo;install&rdquo; the script, you'll need to add the `[data-knuff]`-attribute to your anchors and anchor-like elements; the attribute's value should be a URL – or part of one – but if left empty, _Knuff_ will try to find a `[href]`-attribute. If neither of these attributes have values, _Knuff_ will leave the element alone. Easy peasy! :sunglasses:

## Older browsers

_Knuff_ uses a few things introduced in later versions of [ECMAScript](//en.wikipedia.org/wiki/ECMAScript), so if you're unsure of what may or may not be supported, I'd recommend using [the script](dist/knuff.babel.js) compiled by [Babel](//babeljs.io/). :v:

## To-do

- Docs & demo

## License

[MIT Licensed](LICENSE). You're free to do pretty much whatever you'd like with _Knuff_. Enjoy! :blush:
