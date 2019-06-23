const click = require('./triggers/click')
const mouseDown = require('./triggers/mouseDown')
const mouseUp = require('./triggers/mouseUp')
const mouseMove = require('./triggers/mouseMove')
const blur = require('./triggers/blur')
const input = require('./triggers/input')
const utils = require('./utils')
const screenshot = require('./screenshot')

const { MouseButton } = require('./constants')

const mTriggers = {
    click,
    mouseDown,
    mouseUp,
    mouseMove
}

function $(selector) {
    return new VSelector(selector)
}

class VSelector {
    constructor(selector) {
        if (selector instanceof Array) {
            this.selectors = JSON.parse(JSON.stringify(selector))
        } else if (typeof selector === 'string' && selector) {
            this.selectors = [{ type: '$', params: [selector] }]
        } else if (!selector) {
            throw new Error('selector cannot be empty')
        }
        this.domSelector = ''
        const waitFors = {}
        const expects = {}

        props0.forEach((item) => {
            waitFors[item] = async (value, options) => {
                await utils.waitFor(
                    async () => {
                        return utils.equat(
                            await $(this.selectors)[item](),
                            value
                        )
                    },
                    options,
                    `waiting for ${utils.converToString(
                        this.selectors
                    )}.${item}() to be '${value.toString()}' but timeout (#)`
                )
            }
        })

        props1.forEach((item) => {
            waitFors[item] = async (name, value, options) => {
                await utils.waitFor(
                    async () => {
                        return utils.equat(
                            await $(this.selectors)[item](name),
                            value
                        )
                    },
                    options,
                    `waiting for ${utils.converToString(
                        this.selectors
                    )}.${item}(${name}) to be '${value.toString()}' but timeout (#)`
                )
            }
        })

        waitFors.visible = async (value, options) => {
            await utils.waitFor(
                async () => {
                    return utils.equat(await this.visible(), value)
                },
                options,
                `waiting for ${utils.converToString(
                    this.selectors
                )}.visible() to be '${value.toString()}' but timeout (#)`
            )
        }

        waitFors.exist = async (value, options) => {
            await utils.waitFor(
                async () => {
                    return utils.equat(await this.exist(), value)
                },
                options,
                `waiting for ${utils.converToString(
                    this.selectors
                )}.exist() to be '${value.toString()}' but timeout (#)`
            )
        }

        waitFors.length = async (value, options) => {
            await utils.waitFor(
                async () => {
                    return utils.equat(await this.length(), value)
                },
                options,
                `waiting for ${utils.converToString(
                    this.selectors
                )}.length() to be '${value.toString()}' but timeout (#)`
            )
        }

        props0.forEach((item) => {
            expects[item] = async (value) => {
                if (!utils.equat(await $(this.selectors)[item](), value)) {
                    throw new utils.ExpectError(
                        `expect ${utils.converToString(
                            this.selectors
                        )}.${item}() to be '${value.toString()}' but false`
                    )
                }
            }
        })

        props1.forEach((item) => {
            expects[item] = async (name, value) => {
                if (!utils.equat(await $(this.selectors)[item](name), value)) {
                    throw new utils.ExpectError(
                        `expect ${utils.converToString(
                            this.selectors
                        )}.${item}(${name}) to be '${value.toString()}' but false`
                    )
                }
            }
        })

        expects.visible = async (value) => {
            if (!utils.equat(await this.visible(), value)) {
                throw new utils.ExpectError(
                    `expect ${utils.converToString(
                        this.selectors
                    )}.visible() to be '${value.toString()}' but false`
                )
            }
        }

        expects.exist = async (value) => {
            if (!utils.equat(await this.exist(), value)) {
                throw new utils.ExpectError(
                    `expect ${utils.converToString(
                        this.selectors
                    )}.exist() to be '${value.toString()}' but false`
                )
            }
        }

        expects.length = async (value) => {
            if (!utils.equat(await this.length(), value)) {
                throw new utils.ExpectError(
                    `expect ${utils.converToString(
                        this.selectors
                    )}.length() to be '${value.toString()}' but false`
                )
            }
        }

        const mouseTriggers = {
            // click: async (offset) => {
            //     this.domSelector = await utils.converToDomSelector(
            //         utils.assignSelectors(this.selectors, [
            //             { type: 'eq', params: [0] }
            //         ])
            //     )
            //     await click.call(this, this.domSelector, offset)
            //     return this
            // },
            // mouseDown: async (offset) => {
            //     this.domSelector = await utils.converToDomSelector(
            //         utils.assignSelectors(this.selectors, [
            //             { type: 'eq', params: [0] }
            //         ])
            //     )
            //     await mouseDown.call(this, this.domSelector, offset)
            //     return this
            // },
            // mouseMove: async (offset) => {
            //     this.domSelector = await utils.converToDomSelector(
            //         utils.assignSelectors(this.selectors, [
            //             { type: 'eq', params: [0] }
            //         ])
            //     )
            //     await mouseMove.call(this, this.domSelector, offset)
            //     return this
            // },
            // mouseUp: async (offset) => {
            //     this.domSelector = await utils.converToDomSelector(
            //         utils.assignSelectors(this.selectors, [
            //             { type: 'eq', params: [0] }
            //         ])
            //     )
            //     await mouseUp.call(this, this.domSelector, offset)
            //     return this
            // }
        }

        Object.keys(mTriggers).forEach((trigger) => {
            mouseTriggers[trigger] = async (offset) => {
                this.domSelector = await utils.converToDomSelector(
                    utils.assignSelectors(this.selectors, [
                        { type: 'eq', params: [0] }
                    ])
                )
                await mTriggers[trigger].call(this, this.domSelector, offset)
            }
            if (trigger !== 'mouseMove') {
                Object.keys(MouseButton).forEach((btn) => {
                    mouseTriggers[trigger][btn] = async (offset) => {
                        this.domSelector = await utils.converToDomSelector(
                            utils.assignSelectors(this.selectors, [
                                { type: 'eq', params: [0] }
                            ])
                        )
                        await mTriggers[trigger].call(
                            this,
                            this.domSelector,
                            offset,
                            btn
                        )
                    }
                })
            }
        })
        utils.defineFreezedProps(
            this,
            Object.assign(
                {
                    expect: expects,
                    waitFor: waitFors
                },
                mouseTriggers
            )
        )
    }

    async length() {
        return await page.evaluate((selectors) => {
            return $Z.$select(selectors).length
        }, this.selectors)
    }

    async blur(offsetY) {
        this.domSelector = await utils.converToDomSelector(
            utils.assignSelectors(this.selectors, [{ type: 'eq', params: [0] }])
        )
        await blur(this.domSelector, offsetY)
        return this
    }

    async focus() {
        this.domSelector = await utils.converToDomSelector(
            utils.assignSelectors(this.selectors, [{ type: 'eq', params: [0] }])
        )
        await page.focus(this.domSelector)
        return this
    }

    async input(content, autoBlur) {
        this.domSelector = await utils.converToDomSelector(
            utils.assignSelectors(this.selectors, [{ type: 'eq', params: [0] }])
        )
        await input(this.domSelector, content, autoBlur)
        return this
    }

    async type(content, autoBlur = true) {
        this.domSelector = await utils.converToDomSelector(
            utils.assignSelectors(this.selectors, [{ type: 'eq', params: [0] }])
        )
        await page.type(this.domSelector, content)
        if (autoBlur) {
            await blur(this.domSelector)
        }
    }

    async hover() {
        this.domSelector = await utils.converToDomSelector(
            utils.assignSelectors(this.selectors, [{ type: 'eq', params: [0] }])
        )
        await page.hover(this.domSelector)
    }

    async upload(filePaths) {
        this.domSelector = await utils.converToDomSelector(
            utils.assignSelectors(this.selectors, [{ type: 'eq', params: [0] }])
        )
        const isFileInput = await page.$eval(
            this.domSelector,
            (el) => el.tagName === 'INPUT' && el.type === 'file'
        )
        if (!isFileInput) {
            throw new Error(`[TestKit] the element should be file input`)
        }

        const el = await page.$(this.domSelector)
        await utils.apply(el.uploadFile, filePaths, el)
    }

    async screenshot(name) {
        this.domSelector = await utils.converToDomSelector(
            utils.assignSelectors(this.selectors, [{ type: 'eq', params: [0] }])
        )
        await screenshot(this.domSelector, name)
    }

    /* to dev
    async mouse() {}
    async press() {}
    async screenshot() {}
    */
}
// 没参数
const props0 = [
    'text',
    'html',
    'height',
    'width',
    'offset',
    'offsetParent',
    'position',
    'val',
    'index',
    'scrollTop'
]
// 有参数
const props1 = ['css', 'attr', 'prop', 'data', 'is', 'hasClass']
// 选择器
const selectors = [
    'has',
    'not',
    'parents',
    'parent',
    'children',
    'siblings',
    'prev',
    'next',
    'find',
    'eq',
    'first',
    'last'
]

VSelector.prototype.visible = async function() {
    return await utils.visible(await utils.converToDomSelector(this.selectors))
}

VSelector.prototype.exist = async function() {
    return await utils.exist(await utils.converToDomSelector(this.selectors))
}

// 选择器
selectors.forEach((item) => {
    VSelector.prototype[item] = function() {
        return new VSelector(
            utils.assignSelectors(this.selectors, [
                { type: item, params: Array.prototype.slice.call(arguments) }
            ])
        )
    }
})

// 无参数
props0.forEach((it) => {
    VSelector.prototype[it] = async function() {
        return await page.$eval(
            'body',
            (el, selectors, method) => {
                return $Z.$select(selectors)[method]()
            },
            this.selectors,
            it
        )
    }
})

// 一个参数
props1.forEach((it) => {
    VSelector.prototype[it] = async function(param) {
        return await page.$eval(
            'body',
            (el, selectors, param, method) => {
                return $Z.$select(selectors)[method](param)
            },
            this.selectors,
            param,
            it
        )
    }
})

module.exports = VSelector
