const utils = require('../utils')

module.exports = async () => {
    const href = await page.evaluate(() => {
        return location.href
    })
    return utils.parseUrl(href, href)
}
