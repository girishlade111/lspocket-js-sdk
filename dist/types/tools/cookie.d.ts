/**
 * -------------------------------------------------------------------
 * Simple cookie parse and serialize utilities mostly based on the
 * node module https://github.com/jshttp/cookie.
 * -------------------------------------------------------------------
 */
export interface ParseOptions {
    decode?: (val: string) => string;
}
/**
 * Parses the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 */
export declare function cookieParse(str: string, options?: ParseOptions): {
    [key: string]: any;
};
export interface SerializeOptions {
    encode?: (val: string | number | boolean) => string;
    maxAge?: number;
    domain?: string;
    path?: string;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    priority?: string;
    sameSite?: boolean | string;
}
/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * ```js
 * cookieSerialize('foo', 'bar', { httpOnly: true }) // "foo=bar; httpOnly"
 * ```
 */
export declare function cookieSerialize(name: string, val: string, options?: SerializeOptions): string;
