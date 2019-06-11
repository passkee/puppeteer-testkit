const utils = require('../utils')
const path = require('path')
const fs = require('fs-extra')
const BlinkDiff = require('blink-diff')

module.exports = async (selector, name) => {
    const el = await page.$(selector)
    const box = await el.boundingBox()
    if (!el || !box) {
        throw new Error(
            '[puppeteer-testkit] element not visible or deleted fro document'
        )
    }
    console.log(box)

    const image = await page.screenshot({
        clip: box,
        encoding: 'binary' // base64 binary
    })

    if (!fs.existsSync(path.join(utils.screenshotSavePath, 'A', name))) {
        saveTo(name, 'A', image)
    } else {
        saveTo(name, 'B', image)
        saveTo(name, 'output', '')
        const res = await diff(name)
        console.log(res)
        if (!res.passed) {
            throw new Error(
                `to much differences between two screenshots, ${path.join(
                    utils.screenshotSavePath,
                    'A',
                    name
                ) +
                    ' & ' +
                    path.join(
                        utils.screenshotSavePath,
                        'B',
                        name
                    )}, the differences you can find out in ${path.join(
                    utils.screenshotSavePath,
                    'output',
                    name
                )}`
            )
        }
    }
}

function diff(name) {
    const AImage = path.join(utils.screenshotSavePath, 'A', name)
    const BImage = path.join(utils.screenshotSavePath, 'B', name)
    const OImage = path.join(utils.screenshotSavePath, 'output', name)

    return new Promise((r, rj) => {
        var bdiff = new BlinkDiff({
            imageAPath: AImage,
            imageBPath: BImage,
            thresholdType: BlinkDiff.THRESHOLD_PERCENT,
            threshold: 0.01,
            imageOutputPath: OImage
        })

        bdiff.run(function(error, result) {
            if (error) {
                rj(error)
            } else {
                r(
                    Object.assign(
                        {
                            passed: bdiff.hasPassed(result.code),
                            oPath: OImage,
                            aPath: AImage,
                            bPath: BImage
                        },
                        result
                    )
                )
            }
        })
    })
}

function saveTo(name, target, image) {
    const folder = path.join(utils.screenshotSavePath, target)
    if (!fs.existsSync(folder)) {
        fs.mkdirpSync(folder)
    }
    const paths = name.split('/')
    const fileName = paths.pop()
    const nameFolder = path.join(folder, paths.join('/'))
    if (!fs.existsSync(nameFolder)) {
        fs.mkdirpSync(nameFolder)
    }

    fs.writeFileSync(path.join(nameFolder, fileName), image)
}
