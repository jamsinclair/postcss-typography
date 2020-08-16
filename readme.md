# postcss-typography2

A postcss plugin for [**typography.js**](https://github.com/KyleAMathews/typography.js)

Forked from [BarryThePenguin/postcss-typography](https://github.com/BarryThePenguin/postcss-typography)
- Updates dependency versions
- Reports warning when `@typography` rule not present in your css
- Adds support for using rhythm() in your css


## Installation

```bash
npm install postcss-typography2
```

## Usage

Add to your `postcss.config.js`

```javascript
const typography = require('postcss-typography2');
const Alton = require('typography-theme-alton').default;

module.exports = {
  plugins: [
    typography(Alton);
  ]
}
```

Or manually with:

```javascript
const postcss = require('postcss');
const typography = require('postcss-typography2');
const Alton = require('typography-theme-alton').default;

const result = postcss([plugin(Alton)]).process(input);
```

Next in your CSS add the `@typography` “at-rule”

```css
@typography;
```

The plugin will replace this with the final typography css rules. You can include overrides here as well.

```css
@typography {
  h1,h2,h3 {
    color: blue;
  }
}
```

Rhythm units can also be used throughout your css:

```css
.text {
  margin: rhythm(1.5) 0;
}
```

The plugin will replace this with the calculated result

```css
.text {
  margin: 2.9rem 0;
}
```

## API

### `typography([options])`

### `options`

Options to pass through to the [typography api](https://github.com/KyleAMathews/typography.js#api)

You will likely be passing a Typography theme, [there are over 30 available!](https://github.com/KyleAMathews/typography.js#published-typographyjs-themes)
```
```

### `@typography`

This plugin will replace the `@typography` “at-rule” with the output of
typography.js.  Any declarations within the at-rule block will be merged with
the final css output.

### `rhythm(unit)`

This plugin will replace `rhythm()` functions with the calculated rhythm unit based
on your typography.js config. Only basic math arithmetic is allowed: division, multiplication, add and subtract. CSS custom properties and variables (sass, less etc.) will not be parsed.

## License

[MIT](LICENSE) © Jamie Sinclair

