const constants = require('../constants');
const qs = require('qs');
const url = require('url');

class TimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeoutError';
	}
}

class ExpectError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ExpectError';
	}
}

const utils = {
	compareUrl: (urlOrPathOrHash, basetUrl, silent) => {
		const base = utils.parseUrl(basetUrl, basetUrl);
		const urlObj = utils.parseUrl(urlOrPathOrHash, basetUrl);
		if (urlObj.protocol !== base.protocol) {
			if (!silent) {
				throw new Error(`expected protocol ${urlObj.protocol}, but found ${base.protocol}`);
			}
			return false;
		}
		if (urlObj.host !== base.host) {
			if (!silent) {
				throw new Error(`expected host ${urlObj.host}, but found ${base.host}`);
			}
			return false;
		}
		if (urlObj.pathname !== base.pathname) {
			if (!silent) {
				throw new Error(`expected pathname ${urlObj.pathname}, but found ${base.pathname}`);
			}
			return false;
		}
		const params = urlObj.search;
		if (params && Object.keys(params).length) {
			const search = base.search;
			if (!Object.keys(params).every((key) => search[key] === params[key])) {
				if (!silent) {
					throw new Error(
						`expected search map ${JSON.stringify(params)}, but found ${JSON.stringify(search)}`
					);
				}
				return false;
			}
		}
		if (urlObj.hash) {
			if (urlObj.hash !== base.hash) {
				if (!silent) {
					throw new Error(`expected hash ${urlObj.hash}, but found ${base.hash}`);
				}
				return false;
			}
			const hashQuery = urlObj.hashQuery;
			if (hashQuery && Object.keys(hashQuery).length) {
				const tHashQuery = base.hashQuery;
				if (!Object.keys(hashQuery).every((key) => tHashQuery[key] === hashQuery[key])) {
					if (!silent) {
						throw new Error(
							`expected hash query map ${JSON.stringify(hashQuery)}, but found ${JSON.stringify(
								tHashQuery
							)}`
						);
					}
					return false;
				}
			}
		}

		return true;
	},
	parseUrl(uri, contextUrl) {
		const context = url.parse(contextUrl);
		if (uri[0] === '#') {
			uri = context.baseUrl + uri;
		} else if (!/^[a-z]+?\:?\/\//.test(uri)) {
			uri = context.protocol + '//' + context.host + (uri[0] === '/' ? uri : '/' + uri);
		} else if (/^\/\//.test(uri)) {
			uri = context.protocol + uri;
		}

		const urlObj = url.parse(uri);
		if (urlObj.query) {
			urlObj.search = urlObj.query ? qs.parse(urlObj.query) : {};
		} else {
			urlObj.search = {};
		}
		if (urlObj.hash) {
			const hash = urlObj.hash.split('?');
			urlObj.hash = hash[0];
			urlObj.hashQuery = hash[1] ? qs.parse(hash[1]) : {};
		} else {
			urlObj.hashQuery = {};
		}

		urlObj.baseUrl = urlObj.protocol + '//' + urlObj.host + urlObj.pathname;

		return urlObj;
	},
	defineFreezedProps(context, obj) {
		for (const x in obj) {
			if (obj.hasOwnProperty(x)) {
				Object.defineProperty(context, x, {
					value: obj[x],
					configurable: false,
					writable: false
				});
			}
		}
	},

	async converToDomSelector(selectors) {
		const marks = await page.$eval(
			'body',
			(el, selectors) => {
				return $Z.getMarks($Z.$select(selectors));
			},
			selectors
		);
		return marks.map((item) => `[test-ppt-mark="${item}"]`).join(',');
	},
	async converToString(selectors) {
		return selectors.map((item) => `${item.type}(${item.params})`).join('.');
	},
	async waitFor(fotIt, opts, errorMsg) {
		opts = Object.assign({ timeout: 1000, delay: 100 }, opts);
		return await new Promise((r, rj) => {
			let time = opts.timeout;
			(async () => {
				if (await fotIt()) {
					return r();
				} else {
					check();
				}
			})();

			function check() {
				setTimeout(async () => {
					time -= opts.delay;
					if (!await fotIt()) {
						if (time > 0) {
							check();
						} else {
							rj(
								new TimeoutError(
									errorMsg.replace(/\(\#\)/g, `(timeout: ${opts.timeout}, delay: ${opts.delay})`)
								)
							);
						}
					} else {
						r();
					}
				}, opts.delay);
			}
		});
	},
	equat(value, target) {
		if (typeof target === undefined) throw new Error('target is required');
		switch (target) {
			case constants.UNDEFINED:
				return typeof value === 'undefined';
			case constants.NULL:
				return value === null;
			case constants.EMPTY:
				return typeof value === 'undefined' && value === null && value === '';
			case constants.NOT_EMPTY:
				return typeof value !== 'undefined' && value !== null && value !== '';
			default:
				return value === target;
		}
	},
	TimeoutError,
	ExpectError,
	assignSelectors() {
		const vselector = [];

		Array.prototype.slice.call(arguments).forEach((item) => {
			item &&
				item.forEach((itt) => {
					vselector.push({
						type: itt.type,
						params: itt.params
					});
				});
		});
		return vselector;
	},

	apply(func, args, context) {
		switch (args.length) {
			case 0:
				return context ? func.call(context) : func();
			case 1:
				return context ? func.call(context, args[0]) : func(args[0]);
			case 2:
				return context ? func.call(context, args[0], args[1]) : func(args[0], args[1]);
			case 3:
				return context ? func.call(context, args[0], args[1], args[2]) : func(args[0], args[1], args[2]);
			case 4:
				return context
					? func.call(context, args[0], args[1], args[2], args[3])
					: func(args[0], args[1], args[2], args[3]);
			case 5:
				return context
					? func.call(context, args[0], args[1], args[2], args[3], args[4])
					: func(args[0], args[1], args[2], args[3], args[4]);
			default:
				return func.apply(context || this, args);
		}
	},

	async visible(selector) {
		return await page.$eval(
			'body',
			(el, selector) => {
				const elem = $Z(selector)[0];
				return elem && !!(elem.offsetHeight || elem.offsetTop);
			},
			selector
		);
	},
	async exist(selector) {
		return await page.$eval(
			'body',
			(el, selector) => {
				return !!$Z(selector).length;
			},
			selector
		);
	}
};
module.exports = utils;
