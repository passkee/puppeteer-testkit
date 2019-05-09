/***
 *  让元素失去焦点
 * */
module.exports = async (offset) => {
    offset = Object.assign(
        {
            x: 0,
            y: 0
        },
        offset
    )
    await page.mouse.click(offset.x, offset.y)
}
