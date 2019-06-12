/***
 *  让元素失去焦点
 * */
module.exports = async (selector, offsetY) => {
    const el = await page.$(selector)
    const box = await el.boundingBox()

    if (!el || !box) {
        throw '[puppeteer-testkit] element not visible or deleted fro document'
    }
    await page.mouse.click(box.x + box.width / 2, box.y - (offsetY || 2))
}
