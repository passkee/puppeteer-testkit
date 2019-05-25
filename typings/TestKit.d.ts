import { VSelector } from './VSelector'
import { Page, Browser, Target, NavigationOptions, Response } from 'puppeteer'

export interface TestKit {
    (selector: string): VSelector

    constants: constants

    location(): Promise<LocationObject>

    waitFor: $WaitFor
    expect: $Expect

    reload(options?: NavigationOptions): Promise<Response>
    title(): Promise<string>

    findTarget(targetUrlSubstr: string): Promise<Target>
    closeTarget(targetUrlSubstr: string): Promise<Target>

    page: Page
    browser: Browser

    setBrowser(browser: any): Promise<void>
    setCurrentPage(page: any): Promise<void>
}
interface $Expect {
    title(title: string): Promise<void>
    target(urlSubstr: string, opened?: boolean): Promise<void>
    location: ExpectLocation
}

interface $WaitFor {
    title(title: string, options?: WaitForOptions): Promise<void>
    target(urlSubstr: string, options?: WaitForOptions): Promise<void>
    response(urlPathName: string, options?: TimeoutOption): Promise<void>
    request(
        urlPathName: string,
        params?: { [key: string]: string },
        options?: TimeoutOption
    ): Promise<void>
    delay(ms?: number): Promise<void>

    location: WaitForLocation

    fn(
        callback: () => Promise<boolean>,
        options?: WaitForOptions
    ): Promise<void>
}

interface WaitForLocation {
    (
        baseUrl,
        params?: { [key: string]: string },
        options?: WaitForOptions
    ): Promise<void>
    hash(
        hash: string,
        hashParams?: { [key: string]: string },
        options?: WaitForOptions
    ): Promise<void>
}

interface ExpectLocation {
    (baseUrl, params?: { [key: string]: string }): boolean
    hash(hash: string, hashParams?: { [key: string]: string })
    pathname(pathname: string)
    search(params: { [key: string]: string })
}

interface constants {
    UNDEFINED: Symbol
    NULL: Symbol
    EMPTY: Symbol
    NOT_EMPTY: Symbol
}

interface WaitForOptions {
    timeout?: number
    delay?: number
}
interface TimeoutOption {
    timeout: number
}

interface LocationObject {
    protocol: string | null
    host: string | null
    port: number | null
    hostname: string
    hash: string | null
    search: { [key: string]: string }
    query: string | null
    pathname: string | null
    path: string | null
    href: string | null
    hashSearch: { [key: string]: string }
}
