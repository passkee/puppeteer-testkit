const utils = require('../utils')
const location = require('./location')
const qs = require('qs')
const expects = require('./expects')
module.exports = {
    title: async (title, options) => {
        await utils.waitFor(
            async () => {
                return expects.title(title, true)
            },
            options,
            `waiting for title: ${title} but timeout (#)`
        )
    },
    target: async (targetUrlSubstr, options) => {
        await utils.waitFor(
            async () => {
                return expects.target(targetUrlSubstr, true)
            },
            options,
            `waiting for target: ${targetUrlSubstr} but timeout (#)`
        )
    },

    location: async (urlOrPathOrHash, options) => {
        await utils.waitFor(
            async () => {
                return expects.location(urlOrPathOrHash, true)
            },
            options,
            `waiting for url || Path || Hash: ${urlOrPathOrHash},  but timeout (#)`
        )
    },

    request: async (urlOrPath, postData, options) => {
        let data
        try {
            await page.waitForRequest((request) => {
                const urlObj = utils.parseUrl(request.url(), request.url())

                const urlFixed = utils.parseUrl(urlOrPath, urlObj.href)

                if (utils.compareUrl(urlFixed.href, urlObj.href, true)) {
                    if (postData) {
                        data = parseDataString(request.postData())

                        const pdata = parseDataString(postData)

                        if (Object.keys(pdata).length) {
                            return Object.keys(pdata).every(
                                (key) =>
                                    pdata[key] === data[key] ||
                                    JSON.stringify(pdata[key].toString()) ===
                                        JSON.stringify(data[key].toString())
                            )
                        } else {
                            return true
                        }
                    } else {
                        return true
                    }
                } else {
                    return false
                }
            }, options || { timeout: 2000 })
        } catch (e) {
            throw new utils.TimeoutError(
                `waiting for request of: ${urlOrPath} ${
                    postData ? ' and post data.' : ''
                },  but timeout. `
            )
        }
    },

    response: async (urlOrPath, options) => {
        try {
            await page.waitForResponse((response) => {
                const urlObj = utils.parseUrl(response.url(), response.url())
                const urlFixed = utils.parseUrl(urlOrPath, urlObj.href)
                return (
                    utils.compareUrl(urlFixed.href, urlObj.href, true) &&
                    response.status() === 200
                )
            }, options || { timeout: 2000 })
        } catch (e) {
            throw new utils.TimeoutError(
                `waiting for response of: ${urlOrPath},  but timeout`
            )
        }
    },

    fn: async (cb, options) => {
        await utils.waitFor(
            async () => {
                return await cb()
            },
            options,
            `waiting for callback return true but timeout (#)`
        )
    }
}

function parseDataString(data) {
    if (typeof data === 'object') return data
    if (/^[\[\{].*[\]\}]$/.test(data.trim())) return JSON.parse(data)
    if (typeof data === 'string') return qs.parse(data)
}
function stringifyData(data) {
    if (typeof data === 'object') return JSON.stringify(data)
    else return data.toString()
}
