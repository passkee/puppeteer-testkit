const target = require('./target');
const location = require('./location');
const utils = require('../utils');
module.exports = {
	target: async (targetUrlSubstr, silent) => {
		const res = !!await target.findTarget(targetUrlSubstr);
		if (!res) {
			if (!silent) {
				throw new Error(`expect target: ${targetUrlSubstr} but false`);
			}
		}
		return true;
	},

	//
	location: async (urlOrPathOrHash, silent) => {
		const lct = await location();
		return utils.compareUrl(urlOrPathOrHash, lct.href, silent);
	}
};
