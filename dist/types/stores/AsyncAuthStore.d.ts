import { BaseAuthStore, AuthRecord } from "@/stores/BaseAuthStore";
export type AsyncSaveFunc = (serializedPayload: string) => Promise<void>;
export type AsyncClearFunc = () => Promise<void>;
/**
 * AsyncAuthStore is a helper auth store implementation
 * that could be used with any external async persistent layer
 * (key-value db, local file, etc.).
 *
 * Here is an example with the React Native AsyncStorage package:
 *
 * ```
 * import AsyncStorage from "@react-native-async-storage/async-storage";
 * import LSPocket, { AsyncAuthStore } from "lspocket";
 *
 * const store = new AsyncAuthStore({
 *     save:    async (serialized) => AsyncStorage.setItem("pb_auth", serialized),
 *     initial: AsyncStorage.getItem("pb_auth"),
 * });
 *
 * const pb = new LSPocket("https://example.com", store)
 * ```
 */
export declare class AsyncAuthStore extends BaseAuthStore {
    private saveFunc;
    private clearFunc?;
    private queue;
    constructor(config: {
        save: AsyncSaveFunc;
        clear?: AsyncClearFunc;
        initial?: string | Promise<any>;
    });
    /**
     * @inheritdoc
     */
    save(token: string, record?: AuthRecord): void;
    /**
     * @inheritdoc
     */
    clear(): void;
    /**
     * Initializes the auth store state.
     */
    private _loadInitial;
    /**
     * Appends an async function to the queue.
     */
    private _enqueue;
    /**
     * Starts the queue processing.
     */
    private _dequeue;
}
