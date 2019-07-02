import { TestKit } from '@/typings/TestKit'
const $: TestKit = require('../index')
import path from 'path'
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
    'scrollTop',
    'visible',
    'exist',
    'length'
]
// // 有参数
const props1 = {
    css: 'position',
    attr: 'id',
    prop: 'nodeName',
    data: 'null',
    is: 'div',
    hasClass: 'login_box'
}
// // 选择器
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
// 没时间，只好这样简单校验下
export default () => {
    it('VSelector.prototype.screenshot', async () => {
        await $('body').screenshot('VSelector.prototype.screenshot.png')
    })

    it('VSelector.prototype.upload', async () => {
        await $('#input-file').upload([path.join(__dirname, './data/1.jpeg')])
        await $('#input-file').waitFor.val($.constants.NOT_EMPTY)
    })

    it('VSelector.prototype.hover', async () => {
        await $('#input-text').hover()
        await $('#input-text').waitFor.css('border-color', 'rgb(255, 0, 0)')
    })

    it('VSelector.prototype.click', async () => {
        await $('#input-bottom1').click()
        await $('#input-bottom1').screenshot('VSelector.prototype.click.png')
    })

    it('VSelector.prototype.mouseMove', async () => {
        await $('#input-bottom1').focus()
        await $('#input-bottom1').blur()
        await $('#input-bottom1').mousemove({ y: 10, x: 10 })
        await $('#input-bottom1').screenshot(
            'VSelector.prototype.mouseMove.png'
        )
    })

    it('VSelector.prototype.mouseDown', async () => {
        await $('#input-bottom2').focus()
        await $('#input-bottom1').blur()
        await $('#input-bottom2').mousedown()
        await $('#input-bottom2').screenshot(
            'VSelector.prototype.mouseDown.png'
        )
    })

    it('VSelector.prototype.mouseUp', async () => {
        await $('#input-bottom3').focus()
        await $('#input-bottom1').blur()
        await $('#input-bottom3').mouseup()
        await $('#input-bottom3').screenshot('VSelector.prototype.mouseUp.png')
    })

    it('VSelector.prototype.mouseDown.right', async () => {
        await $('#input-bottom3').focus()
        await $('#input-bottom1').blur()
        await $('#input-bottom3').mousedown.right()
    })

    it('VSelector.prototype.mouseUp.middle', async () => {
        await $('#input-bottom3').focus()
        await $('#input-bottom1').blur()
        await $('#input-bottom3').mouseup.middle()
    })

    it('VSelector.prototype.type', async () => {
        await $('#input-text').type('123')
        await $('#input-text').type('456')
        await $('#input-text').waitFor.val('123456')
    })

    props0
        .filter((item) => ['val'].indexOf(item) === -1)
        .forEach((method) => {
            it(`VSelector.prototype.${method}()`, async () => {
                console.log(await $('#for-ppt-test')[method]())
            })
        })

    Object.keys(props1).forEach((method) => {
        it(`VSelector.${method}(${props1[method]})`, async () => {
            console.log(await $('#for-ppt-test')[method](props1[method]))
        })
    })

    selectors.forEach((method) => {
        it(`VSelector.${method}(div)`, async () => {
            const res = await $('#for-ppt-test')[method]('div')
            console.log(res.selectors[1].type)
        })
    })
}
