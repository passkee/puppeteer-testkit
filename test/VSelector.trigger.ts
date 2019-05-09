import { Domkit } from '@/typings/Domkit'
const $: Domkit = require('../index')

export default () => {
    // it(`focus`, async () => {
    //     await $('#target').focus()
    // })

    it(`click`, async () => {
        await $('#target').click()
    })

    it(`blur`, async () => {
        await $('#target').blur()
    })
}
