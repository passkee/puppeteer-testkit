// const utils = require('@/utils')
import 'colors'
import puppeteer from 'puppeteer'
import { TestKit } from '@/typings/TestKit'

import TK from './TestKit'
import $expect from './TestKit.expect'
import $waitFor from './TestKit.waitFor'
import VSelector from './VSelector'
import VSelectorExpect from './VSelector.expect'
import VSelectorWaitFor from './VSelector.waitFor'

const $: TestKit = require('../index')

describe('puppeteer-testkit', () => {
    before(async () => {
        let browser = await puppeteer.launch({
            headless: false
            //headless: true
            //devtools: true
        })

        let page = (await browser.pages())[0]

        await $.setBrowser(browser)

        await page.setViewport({
            width: 1366,
            height: 768
        })

        await page.goto(
            'https://registry.npm.taobao.org/passkee?param=1#/hash?hashparam=3'
        )

        await page.setContent(`<html><body><div id="for-ppt-test"
                                    attr="for-ppt-test"
                                    data-data="for-ppt-test"
                                    class="for-ppt-test"
                                    style="display:block;height: 100px; width: 100px; position: fixed; top: 100px; left:100px;">
                                        for-ppt-test
								</div>
								<input type="text" id="input-text" />
                                <input type="file" id="input-file" />
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br><br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br><br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br><br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br><br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>

                                <input type="text" id="input-bottom1" /> <br>
                                <br>
                                <input type="text" id="input-bottom2" /> <br>
                                <br>
                                <input type="text" id="input-bottom3" />

								</body></html>
                                <style>
                                body{background:#eee;}
									input:hover{
                                        border: 10px solid rgb(255, 0, 0);
                                        background-color:rgba(0,0,0,1)
									}
								</style>
                                `)
        await page.waitForSelector('#for-ppt-test')

        await page.waitFor(1000)
    })
    after(() => {
        //$.browser.close()
    })
    describe('TestKit', TK)
    describe('TestKit.expect', $expect)
    describe('TestKit.waitFor', $waitFor)
    describe('VSelector', VSelector)
    describe('VSelector.expect', VSelectorExpect)
    describe('VSelector.waitFor', VSelectorWaitFor)
})
