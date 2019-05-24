const utils = require('../utils');
const location = require('./location');
const qs = require('qs');
const expects = require('./expects');
module.exports = {
	target: async (targetUrlSubstr, options) => {
		await utils.waitFor(
			async () => {
				return expects.target(targetUrlSubstr, true);
			},
			options,
			`waiting for target: ${targetUrlSubstr} but timeout (#)`
		);
	},

	// 完整url分解参数
	location: async (baseUrl, params, options) => {
		await utils.waitFor(
			async () => {
				return expects.location(baseUrl, params, true);
			},
			options,
			`waiting for location: ${baseUrl} ${JSON.stringify(params)},  but timeout (#)`
		);
	},
	// 完整url分解参数
	request: async (baseUrl, postData, options) => {
		await page.waitForRequest((request) => {
			const urlObj = utils.parseUrl(request.url());
			const postData = qs.parse(request.postData());
			if (baseUrl === urlObj.baseUrl) {
				if (data && Object.keys(data).length) {
					const search = { ...urlObj.search, ...postData };
					return Object.keys(data).every((key) => search[key] === data[key]);
				} else {
					return true;
				}
			}
		}, options || { timeout: 2000 });
	},
	// 完整url分解参数
	response: async (baseUrl, options) => {
		await page.waitForResponse((response) => {
			const urlObj = utils.parseUrl(response.url());
			if (baseUrl === urlObj.baseUrl && response.status() === 200) {
				return true;
			}
		}, options || { timeout: 2000 });
	},

	delay: (ms) => {
		return new Promise((r, rj) => {
			setTimeout(() => {
				r();
			}, ms || 100);
		});
	},

	fn: async (cb, options) => {
		await utils.waitFor(
			async () => {
				return await cb();
			},
			options,
			`waiting for callback return true but timeout (#)`
		);
	}
};
module.exports.location.hash = async (hash, hashParams, options) => {
	await utils.waitFor(
		async () => {
			return expects.location.hash(hash, hashParams, true);
		},
		options,
		`waiting for location hash: ${hash} ${JSON.stringify(hashParams)},  but timeout (#)`
	);
};
