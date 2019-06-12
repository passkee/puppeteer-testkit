module.exports = async (selector, offset = {}) => {
    offset = Object.assign(
        {
            x: 0,
            y: 1
        },
        offset
    )
    await page.waitForSelector(selector)
    const el = await page.$(selector)
    const box = await el.boundingBox()
    if (!el || !box) {
        if (!offset.forDispose && !offset.forHidden) {
            throw new Error('element not visible or deleted fro document')
        } else {
            return
        }
    }

    await page.mouse.move(
        box.x + (offset.x ? offset.x : box.width / 2),
        box.y + (offset.y || 1)
    )
    await page.mouse.down()
}
