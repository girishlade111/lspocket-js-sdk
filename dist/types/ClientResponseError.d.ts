/**
 * ClientResponseError is a custom Error class that is intended to wrap
 * and normalize any error thrown by `Client.send()`.
 */
export declare class ClientResponseError extends Error {
    url: string;
    status: number;
    response: {
        [key: string]: any;
    };
    isAbort: boolean;
    originalError: any;
    constructor(errData?: any);
    /**
     * Alias for `this.response` for backward compatibility.
     */
    get data(): {
        [key: string]: any;
    };
    /**
     * Make a POJO's copy of the current error class instance.
     * @see https://github.com/vuex-orm/vuex-orm/issues/255
     */
    toJSON(): this;
}
