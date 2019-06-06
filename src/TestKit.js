const path = require('path')
const utils = require('./utils')
const constants = require('./constants')
const VSelector = require('./VSelector')
const expects = require('./bom/expects')
const waitFors = require('./bom/waitFors')
const location = require('./bom/location')

browser = null
page = null

utils.screenshotSavePath = path.join(process.cwd(), 'screenshot')

function TestKit(selector) {
    if (!selector) {
        throw new Error('[TestKit] selector is required')
    }
    return new VSelector(selector)
}

TestKit.constants = constants
TestKit.browser = null
TestKit.setBrowser = async (b) => {
    browser = TestKit.browser = b

    await TestKit.setCurrentPage((await browser.pages())[0])

    initPage()

    browser.on('targetcreated', (target) => {
        ;(async () => {
            await initPage(await target.page())
        })()
    })
}
TestKit.setScreenshotSavePath = (savePath) => {
    utils.screenshotSavePath = savePath
}

function initPage(p) {
    // TODO: 可能会比较慢，导致 $Z undifined，需要一个机制去告知用例执行时机
    ;(p ? p : page).on('console', (msg) => {
        const jsh = msg.args()
        for (let x of jsh) {
            const text = x.toString().replace(/JSHandle\:/g, '')
            if (text.indexOf('[test]') === 0) {
                console.log(` ${text.replace(/\[test\]/g, '')} `.bgYellow)
            }
        }
    })
    ;(p ? p : page).on('load', async (response) => {
        await page.addScriptTag({
            path: path.join(__dirname, '../browser/$Z.js')
        })
    })
}

TestKit.reload = async (opts) => {
    const res = await TestKit.page.reload(opts)
    await page.waitForFunction('window.$Z')
    return res
}

TestKit.title = async () => {
    return await page.title()
}

TestKit.page = null
TestKit.setCurrentPage = async (p) => {
    page = TestKit.page = p
}

TestKit.findTarget = utils.findTarget
TestKit.closeTarget = utils.closeTarget
TestKit.location = location

TestKit.delay = (ms) => {
    return new Promise((r, rj) => {
        setTimeout(() => {
            r()
        }, ms || 1000)
    })
}

utils.defineFreezedProps(TestKit, { waitFor: waitFors, expect: expects })

Object.freeze(TestKit.waitFor)

module.exports = TestKit
