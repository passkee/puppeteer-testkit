const target = require('./target');
const location = require('./location');

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

	// 完整url分解参数
	location: async (baseUrl, params, silent) => {
		const lct = await location();
		if (lct.baseUrl !== baseUrl) {
			if (!silent) {
				throw new Error(`expect location: ${baseUrl} but got ${lct.baseUrl}`);
			}
			return false;
		}
		if (params && Object.keys(params).length) {
			const search = lct.search;
			const ok = Object.keys(params).every((key) => search[key] === params[key]);
			if (!ok) {
				if (!silent) {
					throw new Error(
						`expect location search: ${JSON.stringify(params)} but got ${JSON.stringify(search)}`
					);
				}
				return false;
			}
		}
		return true;
	}
};
module.exports.location.hash = async (hash, hashParams, silent) => {
	let ok;
	const lct = await location();
	if (lct.hash === hash) {
		if (hashParams && Object.keys(hashParams).length) {
			const search = lct.hashSearch;
			ok = Object.keys(hashParams).every((key) => search[key] === hashParams[key]);
		} else {
			ok = true;
		}
	}
	if (!ok) {
		if (!silent) {
			throw new Error(`expect location hash: ${hash} ${hashParams ? JSON.stringify(hashParams) : ''} but false`);
		}
		return false;
	}
	return true;
};
