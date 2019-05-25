const utils = require('../utils');

module.exports = async () => {
	const href = await page.evaluate(() => {
		return location.href;
	});
	console.log(utils.parseUrl(href, href));
	return utils.parseUrl(href, href);
};
