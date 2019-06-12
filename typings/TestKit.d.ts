import { VSelector } from './VSelector'
import { Page, Browser, Target, NavigationOptions, Response } from 'puppeteer'

export interface TestKit {
    (selector: string): VSelector

    constants: constants

    location(): Promise<LocationObject>

    waitFor: $WaitFor
    expect: $Expect

    delay(ms?: number): Promise<void>

    reload(options?: NavigationOptions): Promise<Response>
    title(): Promise<string>

    findTarget(targetUrlSubstr: string): Promise<Target>
    closeTarget(targetUrlSubstr: string): Promise<Target>

    page: Page
    browser: Browser

    setBrowser(browser: any): Promise<void>
    setCurrentPage(page: any): Promise<void>

    setScreenshotFolder(folderPath: string): Promise<void>
}
interface $Expect {
    title(title: string): Promise<void>
    target(urlSubstr: string, opened?: boolean): Promise<void>
    location(urlOrPathOrHash: string): Promise<void>
}

interface $WaitFor {
    title(title: string, options?: WaitForOptions): Promise<void>
    target(urlSubstr: string, options?: WaitForOptions): Promise<void>
    request(
        urlOrPath: string,
        postData?: string,
        options?: TimeoutOption
    ): Promise<void>
    response(urlOrPath: string, options?: TimeoutOption): Promise<void>

    location(urlOrPathOrHash: string, options?: TimeoutOption): Promise<void>

    fn(
        callback: () => Promise<boolean>,
        options?: WaitForOptions
    ): Promise<void>
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
    hashQuery: { [key: string]: string }
}
