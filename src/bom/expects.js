const target = require('./target')
const location = require('./location')

module.exports = {
    title: async (title, silent) => {
        const titl = await page.title()
        if (title !== titl) {
            if (!silent) {
                throw new Error(`expected title: ${title} but got ${titl}`)
            }
        }
        return true
    },
    target: async (targetUrlSubstr, silent) => {
        const res = !!(await target.findTarget(targetUrlSubstr))
        if (!res) {
            if (!silent) {
                throw new Error(`expected target: ${targetUrlSubstr} but false`)
            }
        }
        return true
    },

    // 完整url分解参数
    location: async (baseUrl, params, silent) => {
        const lct = await location()
        if (lct.baseUrl !== baseUrl) {
            if (!silent) {
                throw new Error(
                    `expected location: ${baseUrl} but got ${lct.baseUrl}`
                )
            }
            return false
        }
        if (params && Object.keys(params).length) {
            const search = lct.search
            const ok = Object.keys(params).every(
                (key) => search[key] === params[key]
            )
            if (!ok) {
                if (!silent) {
                    throw new Error(
                        `expected location search: ${JSON.stringify(
                            params
                        )} but got ${JSON.stringify(search)}`
                    )
                }
                return false
            }
        }
        return true
    }
}
module.exports.location.hash = async (hash, hashParams, silent) => {
    let ok
    const lct = await location()
    if (lct.hash === hash) {
        if (hashParams && Object.keys(hashParams).length) {
            const search = lct.hashSearch
            ok = Object.keys(hashParams).every(
                (key) => search[key] === hashParams[key]
            )
        } else {
            ok = true
        }
    }
    if (!ok) {
        if (!silent) {
            throw new Error(
                `expected location hash: ${hash} ${
                    hashParams ? JSON.stringify(hashParams) : ''
                } but false`
            )
        }
        return false
    }
    return true
}
