const { MouseButton } = require('../constants')

module.exports = async (selector, offset = {}, button) => {
    offset = Object.assign(
        {
            x: 0,
            y: 0
        },
        offset
    )
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
        box.y + (offset.y ? offset.y : box.height / 2),
        {
            steps: 10
        }
    )
    await page.waitFor(100)
    await page.mouse.up({ button: MouseButton[button] || 'left' })
}
