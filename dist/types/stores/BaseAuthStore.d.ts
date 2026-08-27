import { SerializeOptions } from "@/tools/cookie";
import { RecordModel } from "@/tools/dtos";
export type AuthRecord = RecordModel | null;
export type AuthModel = AuthRecord;
export type OnStoreChangeFunc = (token: string, record: AuthRecord) => void;
/**
 * Base AuthStore class that stores the auth state in runtime memory (aka. only for the duration of the store instane).
 *
 * Usually you wouldn't use it directly and instead use the builtin LocalAuthStore, AsyncAuthStore
 * or extend it with your own custom implementation.
 */
export declare class BaseAuthStore {
    protected baseToken: string;
    protected baseModel: AuthRecord;
    private _onChangeCallbacks;
    /**
     * Retrieves the stored token (if any).
     */
    get token(): string;
    /**
     * Retrieves the stored model data (if any).
     */
    get record(): AuthRecord;
    /**
     * @deprecated use `record` instead.
     */
    get model(): AuthRecord;
    /**
     * Loosely checks if the store has valid token (aka. existing and unexpired exp claim).
     */
    get isValid(): boolean;
    /**
     * Loosely checks whether the currently loaded store state is for superuser.
     *
     * Alternatively you can also compare directly `pb.authStore.record?.collectionName`.
     */
    get isSuperuser(): boolean;
    /**
     * @deprecated use `isSuperuser` instead or simply check the record.collectionName property.
     */
    get isAdmin(): boolean;
    /**
     * @deprecated use `!isSuperuser` instead or simply check the record.collectionName property.
     */
    get isAuthRecord(): boolean;
    /**
     * Saves the provided new token and model data in the auth store.
     */
    save(token: string, record?: AuthRecord): void;
    /**
     * Removes the stored token and model data form the auth store.
     */
    clear(): void;
    /**
     * Parses the provided cookie string and updates the store state
     * with the cookie's token and model data.
     *
     * NB! This function doesn't validate the token or its data.
     * Note: You should prefer saving the parsed cookie via the
     * LS Pocket API because it has the proper server-side security checks in place,
     * but if you are using the store `isValid` state for permission controls
     * in a node server (eg. SSR), then it is recommended to call `authRefresh()`
     * after loading the cookie to ensure an up-to-date token and model state.
     * For example:
     *
     * ```js
     * pb.authStore.loadFromCookie("cookie string...");
     *
     * try {
     *     // get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
     *     pb.authStore.isValid && await pb.collection('users').authRefresh();
     * } catch (_) {
     *     // clear the auth store on failed refresh
     *     pb.authStore.clear();
     * }
     * ```
     */
    loadFromCookie(cookie: string, key?: string): void;
    /**
     * Exports the current store state as cookie string.
     *
     * By default the following optional attributes are added:
     * - Secure
     * - HttpOnly
     * - SameSite=Strict
     * - Path=/
     * - Expires={the token expiration date}
     *
     * NB! If the generated cookie exceeds 4096 bytes, this method will
     * strip the model data to the bare minimum to try to fit within the
     * recommended size in https://www.rfc-editor.org/rfc/rfc6265#section-6.1.
     */
    exportToCookie(options?: SerializeOptions, key?: string): string;
    /**
     * Register a callback function that will be called on store change.
     *
     * You can set the `fireImmediately` argument to true in order to invoke
     * the provided callback right after registration.
     *
     * Returns a removal function that you could call to "unsubscribe" from the changes.
     */
    onChange(callback: OnStoreChangeFunc, fireImmediately?: boolean): () => void;
    protected triggerChange(): void;
}
