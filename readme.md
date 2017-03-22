# phototitle [![Build Status](https://travis-ci.org/handball10/phototitle.svg?branch=master)](https://travis-ci.org/handball10/phototitle)

> Generate image description files


## Install

```
$ npm install --save phototitle
```


## Usage

```js
const phototitle = require('phototitle');

phototitle('unicorns');
//=> 'unicorns & rainbows'
```


## API

### phototitle(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## CLI

```
$ npm install --global phototitle
```

```
$ phototitle --help

  Usage
    phototitle [input]

  Options
    --foo  Lorem ipsum [Default: false]

  Examples
    $ phototitle
    unicorns & rainbows
    $ phototitle ponies
    ponies & rainbows
```


## License

MIT © [florianguembel](https://github.com/handball10/phototitle)
