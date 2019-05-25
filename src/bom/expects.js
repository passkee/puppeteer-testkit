const target = require('./target');
const location = require('./location');
const utils = require('../utils');
const location = require('./location');

module.exports = {
	title: async (title, silent) => {
		const titl = await page.title();
		if (title !== titl) {
			if (!silent) {
				throw new Error(`expected title: ${title} but got ${titl}`);
			}
		}
		return true;
	},
	target: async (targetUrlSubstr, silent) => {
		const res = !!await target.findTarget(targetUrlSubstr);
		if (!res) {
			if (!silent) {
				throw new Error(`expected target: ${targetUrlSubstr} but false`);
			}
		}
		return true;
	},

	//
	location: async (urlOrPathOrHash, silent) => {
		const lct = await location();
		const url = utils.parseUrl(urlOrPathOrHash, lct.href);
		return utils.compareUrl(url.href, lct.href, silent);
	}
};
