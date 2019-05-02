const constants = require('../constants')

class TimeoutError extends Error {
    constructor(message) {
        super(message)
        this.name = 'TimeoutError'
    }
}

class ExpectError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ExpectError'
    }
}

module.exports = {
    async findTarget(url) {
        const targets = await browser.targets()
        return targets.find((it) => (it.url() || '').indexOf(url) > -1)
    },
    async closeTarget(url) {
        const target = await findTarget(url)
        if (target) {
            await (await target.page()).close()
        } else {
            throw new Error(`canot find target:${url}`)
        }
    },
    defineFreezedProps(context, obj) {
        for (const x in obj) {
            if (obj.hasOwnProperty(x)) {
                Object.defineProperty(context, x, {
                    value: obj[x],
                    configurable: false,
                    writable: false
                })
            }
        }
    },
    async converToDomSelector(selectors) {
        const marks = await page.$eval(
            'body',
            (el, selectors) => {
                return $Z.getMarks($Z.$select(selectors))
            },
            selectors
        )
        return marks.map((item) => `[test-ppt-mark="${item}"]`).join(',')
    },
    async converToString(selectors) {
        return selectors.map((item) => `${item.type}(${item.params})`).join('.')
    },
    async waitFor(fotIt, opts, errorMsg) {
        opts = Object.assign({ timeout: 1000, delay: 100 }, opts)
        return await new Promise((r, rj) => {
            let time = opts.timeout
            ;(async () => {
                if (await fotIt()) {
                    return r()
                } else {
                    check()
                }
            })()

            function check() {
                setTimeout(async () => {
                    time -= opts.delay
                    if (!(await fotIt())) {
                        if (time > 0) {
                            check()
                        } else {
                            rj(
                                new TimeoutError(
                                    errorMsg.replace(
                                        /\(\#\)/g,
                                        `(timeout: ${opts.timeout}, delay: ${
                                            opts.delay
                                        })`
                                    )
                                )
                            )
                        }
                    } else {
                        r()
                    }
                }, opts.delay)
            }
        })
    },
    equat(value, target) {
        if (typeof target === undefined) throw new Error('target is required')
        switch (target) {
            case constants.UNDEFINED:
                return typeof value === 'undefined'
            case constants.NULL:
                return value === null
            case constants.EMPTY:
                return (
                    typeof value === 'undefined' &&
                    value === null &&
                    value === ''
                )
            case constants.NOT_EMPTY:
                return (
                    typeof value !== 'undefined' &&
                    value !== null &&
                    value !== ''
                )
            default:
                return value === target
        }
    },
    TimeoutError,
    ExpectError,
    assignSelectors() {
        const vselector = []

        Array.prototype.slice.call(arguments).forEach((item) => {
            item &&
                item.forEach((itt) => {
                    vselector.push({
                        type: itt.type,
                        params: itt.params
                    })
                })
        })
        return vselector
    },
    async visible(selector) {
        return await page.$eval(
            'body',
            (el, selector) => {
                const elem = $Z(selector)[0]
                return elem && !!(elem.offsetHeight || elem.offsetTop)
            },
            selector
        )
    },
    async exist(selector) {
        return await page.$eval(
            'body',
            (el, selector) => {
                return !!$Z(selector).length
            },
            selector
        )
    }
}
