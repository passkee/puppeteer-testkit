// const utils = require('@/utils')
import 'colors'
import puppeteer from 'puppeteer'
import { Domkit } from '@/typings/Domkit'

import $spec from './$'
import $expect from './$.expect'
import $waitFor from './$.waitFor'
import $Selector from './$Selector'
import $SelectorExpect from './$Selector.expect'
import $SelectorWaitFor from './$Selector.waitFor'
import VSelectorTrigger from './VSelector.trigger'

const $: Domkit = require('../index')

describe('puppeteer-domkit', () => {
    before(async () => {
        let browser = await puppeteer.launch({
            headless: false
            //devtools: true
        })

        let page = (await browser.pages())[0]

        await $.setBrowser(browser)

        await page.setViewport({
            width: 1366,
            height: 768
        })

        page.on('close', () => {
            $.browser.close()
        })

        await page.setContent(`<html><body>
                               
                                <div id="for-ppt-test"
                                    attr="for-ppt-test"
                                    data-data="for-ppt-test"
                                    class="for-ppt-test"
                                    style="display:block;height: 100px; width: 100px; position: fixed; top: 100px; left:100px;">
                                        for-ppt-test
                                </div>

                                <div style="height: 1000px; "></div>
                                
                                <form action="/example/html5/demo_form.asp" method="get" autocomplete="on">
                                First name:<input type="text" name="fname" /><br />
                                Last name: <input id="target" type="text" name="lname" style="border-radius: 20px;" /><br />
                                E-mail: <input type="email" name="email" autocomplete="off" /><br />
                                <input type="submit" />
                                </form>
                                
                                <p>请填写并提交此表单，然后重载页面，来查看自动完成功能是如何工作的。</p>
                                <p>请注意，表单的自动完成功能是打开的，而 e-mail 域是关闭的。</p>
                                
                                
                                

                                </body></html>
                                `)
        await page.waitForSelector('#for-ppt-test')

        await page.waitFor(1000)
    })
    after(() => {})
    describe('$', $spec)
    describe('$.expect', $expect)
    describe('$.waitFor', $waitFor)
    describe('$Selector', $Selector)
    describe('$Selector.expect', $SelectorExpect)
    describe('$Selector.waitFor', $SelectorWaitFor)
    describe.only('VSelector.trigger', VSelectorTrigger)
})
