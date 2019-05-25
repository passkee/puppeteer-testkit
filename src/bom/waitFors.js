const utils = require('../utils');
const location = require('./location');
const qs = require('qs');
const expects = require('./expects');
module.exports = {
	title: async (title, options) => {
		await utils.waitFor(
			async () => {
				return expects.title(title, true);
			},
			options,
			`waiting for title: ${title} but timeout (#)`
		);
	},
	target: async (targetUrlSubstr, options) => {
		await utils.waitFor(
			async () => {
				return expects.target(targetUrlSubstr, true);
			},
			options,
			`waiting for target: ${targetUrlSubstr} but timeout (#)`
		);
	},

	location: async (urlOrPathOrHash, options) => {
		await utils.waitFor(
			async () => {
				return expects.location(urlOrPathOrHash, true);
			},
			options,
			`waiting for url || Path || Hash: ${urlOrPathOrHash},  but timeout (#)`
		);
	},

	request: async (urlOrPath, postData, options) => {
		try {
			await page.waitForRequest((request) => {
				const urlObj = utils.parseUrl(request.url(), request.url());

				const urlFixed = utils.parseUrl(urlOrPath, urlObj.href);

				if (utils.compareUrl(urlFixed.href, urlObj.href, true)) {
					if (postData) {
						const data = qs.parse(request.postData());
						const pdata = qs.parse(postData);
						if (Object.keys(pdata).length) {
							return Object.keys(pdata).every(
								(key) => JSON.stringify(pdata[key]) === JSON.stringify(data[key])
							);
						} else {
							return true;
						}
					} else {
						return true;
					}
				} else {
					return false;
				}
			}, options || { timeout: 2000 });
		} catch (e) {
			throw new utils.TimeoutError(
				`waiting for request of: ${urlOrPath} ${postData ? ' and post data: ' + postData : ''},  but timeout`
			);
		}
	},

	response: async (urlOrPath, options) => {
		try {
			await page.waitForResponse((response) => {
				const urlObj = utils.parseUrl(response.url(), response.url());
				const urlFixed = utils.parseUrl(urlOrPath, urlObj.href);
				return utils.compareUrl(urlFixed.href, urlObj.href, true) && response.status() === 200;
			}, options || { timeout: 2000 });
		} catch (e) {
			throw new utils.TimeoutError(`waiting for response of: ${urlOrPath},  but timeout`);
		}
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
