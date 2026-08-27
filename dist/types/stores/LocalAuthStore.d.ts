import { BaseAuthStore, AuthRecord } from "@/stores/BaseAuthStore";
/**
 * The default token store for browsers with auto fallback
 * to runtime/memory if local storage is undefined (e.g. in node env).
 */
export declare class LocalAuthStore extends BaseAuthStore {
    private storageFallback;
    private storageKey;
    constructor(storageKey?: string);
    /**
     * @inheritdoc
     */
    get token(): string;
    /**
     * @inheritdoc
     */
    get record(): AuthRecord;
    /**
     * @deprecated use `record` instead.
     */
    get model(): AuthRecord;
    /**
     * @inheritdoc
     */
    save(token: string, record?: AuthRecord): void;
    /**
     * @inheritdoc
     */
    clear(): void;
    /**
     * Retrieves `key` from the browser's local storage
     * (or runtime/memory if local storage is undefined).
     */
    private _storageGet;
    /**
     * Stores a new data in the browser's local storage
     * (or runtime/memory if local storage is undefined).
     */
    private _storageSet;
    /**
     * Removes `key` from the browser's local storage and the runtime/memory.
     */
    private _storageRemove;
    /**
     * Updates the current store state on localStorage change.
     */
    private _bindStorageEvent;
}
