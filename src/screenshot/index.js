const utils = require('../utils')
const path = require('path')
const fs = require('fs-extra')

module.exports = async (selector, name) => {
    const el = await page.$(selector)
    const box = await el.boundingBox()
    if (!el || !box) {
        throw '[puppeteer-testkit] element not visible or deleted fro document'
    }
    console.log(box)

    const image = await page.screenshot({
        clip: box,
        encoding: 'binary' // base64 binary
    })

    let saveToPath = path.join(utils.screenshotSavePath, name)
    const paths = saveToPath.replace(/\\/g, '/').split('/')
    const fileName = paths.pop()
    saveToPath = saveToPath.substring(0, saveToPath.lastIndexOf(fileName))

    if (!fs.existsSync(saveToPath)) {
        fs.mkdirpSync(saveToPath)
    }

    await fs.writeFile(path.join(saveToPath, fileName), image)
}
