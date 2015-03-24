/* global require */
/* global console */
/* global __dirname */

'use strict';

var babel = require('babel'),
	fs = require('fs');

fs.readFile(__dirname + '/src/reactant.js', function(err, res) {
	if (err) {
		console.log(err);
	} else {
		['amd', 'umd', 'common', 'system'].forEach(function(fmt) {
			var opts = { modules: fmt },
				code = babel.transform(res, opts).code,
				path = __dirname + '/dist/reactant.' + fmt + '.js';
			fs.writeFileSync(path, code);
		});
	}
});
