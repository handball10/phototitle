#!/usr/bin/env node
'use strict';
const meow = require('meow');
const phototitle = require('.');

const cli = meow(`
	Usage
	  $ phototitle [input]

	Options
	  --foo  Lorem ipsum [Default: false]

	Examples
	  $ phototitle
	  unicorns & rainbows
	  $ phototitle ponies
	  ponies & rainbows
`);

console.log(phototitle(cli.input[0] || 'unicorns'));
