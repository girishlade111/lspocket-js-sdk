import Client from "@/Client";
import { UnsubscribeFunc } from "@/services/RealtimeService";
import { CrudService } from "@/services/CrudService";
import { ListResult, RecordModel } from "@/tools/dtos";
import { CommonOptions, RecordFullListOptions, RecordListOptions, RecordOptions, SendOptions, RecordSubscribeOptions } from "@/tools/options";
export interface RecordAuthResponse<T = RecordModel> {
    /**
     * The signed LS Pocket auth record.
     */
    record: T;
    /**
     * The LS Pocket record auth token.
     *
     * If you are looking for the OAuth2 access and refresh tokens
     * they are available under the `meta.accessToken` and `meta.refreshToken` props.
     */
    token: string;
    /**
     * Auth meta data usually filled when OAuth2 is used.
     */
    meta?: {
        [key: string]: any;
    };
}
export interface AuthProviderInfo {
    name: string;
    displayName: string;
    state: string;
    authURL: string;
    codeVerifier: string;
    codeChallenge: string;
    codeChallengeMethod: string;
}
export interface AuthMethodsList {
    mfa: {
        enabled: boolean;
        duration: number;
    };
    otp: {
        enabled: boolean;
        duration: number;
    };
    password: {
        enabled: boolean;
        identityFields: Array<string>;
    };
    oauth2: {
        enabled: boolean;
        providers: Array<AuthProviderInfo>;
    };
}
export interface RecordSubscription<T = RecordModel> {
    action: string;
    record: T;
}
export type OAuth2UrlCallback = (url: string) => void | Promise<void>;
export interface OAuth2AuthConfig extends SendOptions {
    provider: string;
    scopes?: Array<string>;
    createData?: {
        [key: string]: any;
    };
    urlCallback?: OAuth2UrlCallback;
    query?: RecordOptions;
}
export interface OTPResponse {
    otpId: string;
}
export declare class RecordService<M = RecordModel> extends CrudService<M> {
    readonly collectionIdOrName: string;
    constructor(client: Client, collectionIdOrName: string);
    /**
     * @inheritdoc
     */
    get baseCrudPath(): string;
    /**
     * Returns the current collection service base path.
     */
    get baseCollectionPath(): string;
    /**
     * Returns whether the current service collection is superusers.
     */
    get isSuperusers(): boolean;
    /**
     * Subscribe to realtime changes to the specified topic ("*" or record id).
     *
     * If `topic` is the wildcard "*", then this method will subscribe to
     * any record changes in the collection.
     *
     * If `topic` is a record id, then this method will subscribe only
     * to changes of the specified record id.
     *
     * It's OK to subscribe multiple times to the same topic.
     * You can use the returned `UnsubscribeFunc` to remove only a single subscription.
     * Or use `unsubscribe(topic)` if you want to remove all subscriptions attached to the topic.
     */
    subscribe<T = M>(topic: string, callback: (data: RecordSubscription<T>) => void, options?: RecordSubscribeOptions): Promise<UnsubscribeFunc>;
    /**
     * Unsubscribe from all subscriptions of the specified topic
     * ("*" or record id).
     *
     * If `topic` is not set, then this method will unsubscribe from
     * all subscriptions associated to the current collection.
     */
    unsubscribe(topic?: string): Promise<void>;
    /**
     * @inheritdoc
     */
    getFullList<T = M>(options?: RecordFullListOptions): Promise<Array<T>>;
    /**
     * @inheritdoc
     */
    getFullList<T = M>(batch?: number, options?: RecordListOptions): Promise<Array<T>>;
    /**
     * @inheritdoc
     */
    getList<T = M>(page?: number, perPage?: number, options?: RecordListOptions): Promise<ListResult<T>>;
    /**
     * @inheritdoc
     */
    getFirstListItem<T = M>(filter: string, options?: RecordListOptions): Promise<T>;
    /**
     * @inheritdoc
     */
    getOne<T = M>(id: string, options?: RecordOptions): Promise<T>;
    /**
     * @inheritdoc
     */
    create<T = M>(bodyParams?: {
        [key: string]: any;
    } | FormData, options?: RecordOptions): Promise<T>;
    /**
     * @inheritdoc
     *
     * If the current `client.authStore.record` matches with the updated id, then
     * on success the `client.authStore.record` will be updated with the new response record fields.
     */
    update<T = M>(id: string, bodyParams?: {
        [key: string]: any;
    } | FormData, options?: RecordOptions): Promise<T>;
    /**
     * @inheritdoc
     *
     * If the current `client.authStore.record` matches with the deleted id,
     * then on success the `client.authStore` will be cleared.
     */
    delete(id: string, options?: CommonOptions): Promise<boolean>;
    /**
     * Prepare successful collection authorization response.
     */
    protected authResponse<T = M>(responseData: any): RecordAuthResponse<T>;
    /**
     * Returns all available collection auth methods.
     *
     * @throws {ClientResponseError}
     */
    listAuthMethods(options?: CommonOptions): Promise<AuthMethodsList>;
    /**
     * Authenticate a single auth collection record via its username/email and password.
     *
     * On success, this method also automatically updates
     * the client's AuthStore data and returns:
     * - the authentication token
     * - the authenticated record model
     *
     * @throws {ClientResponseError}
     */
    authWithPassword<T = M>(usernameOrEmail: string, password: string, options?: RecordOptions): Promise<RecordAuthResponse<T>>;
    /**
     * Authenticate a single auth collection record with OAuth2 code.
     *
     * If you don't have an OAuth2 code you may also want to check `authWithOAuth2` method.
     *
     * On success, this method also automatically updates
     * the client's AuthStore data and returns:
     * - the authentication token
     * - the authenticated record model
     * - the OAuth2 account data (eg. name, email, avatar, etc.)
     *
     * @throws {ClientResponseError}
     */
    authWithOAuth2Code<T = M>(provider: string, code: string, codeVerifier: string, redirectURL: string, createData?: {
        [key: string]: any;
    }, options?: RecordOptions): Promise<RecordAuthResponse<T>>;
    /**
     * @deprecated
     * Consider using authWithOAuth2Code(provider, code, codeVerifier, redirectURL, createdData, options?).
     */
    authWithOAuth2Code<T = M>(provider: string, code: string, codeVerifier: string, redirectURL: string, createData?: {
        [key: string]: any;
    }, body?: any, query?: any): Promise<RecordAuthResponse<T>>;
    /**
     * @deprecated This form of authWithOAuth2 is deprecated.
     *
     * Please use `authWithOAuth2Code()` OR its simplified realtime version
     * as shown in https://pocketbase.io/docs/authentication/#oauth2-integration.
     */
    authWithOAuth2<T = M>(provider: string, code: string, codeVerifier: string, redirectURL: string, createData?: {
        [key: string]: any;
    }, bodyParams?: {
        [key: string]: any;
    }, queryParams?: RecordOptions): Promise<RecordAuthResponse<T>>;
    /**
     * Authenticate a single auth collection record with OAuth2
     * **without custom redirects, deeplinks or even page reload**.
     *
     * This method initializes a one-off realtime subscription and will
     * open a popup window with the OAuth2 vendor page to authenticate.
     * Once the external OAuth2 sign-in/sign-up flow is completed, the popup
     * window will be automatically closed and the OAuth2 data sent back
     * to the user through the previously established realtime connection.
     *
     * You can specify an optional `urlCallback` prop to customize
     * the default url `window.open` behavior.
     *
     * On success, this method also automatically updates
     * the client's AuthStore data and returns:
     * - the authentication token
     * - the authenticated record model
     * - the OAuth2 account data (eg. name, email, avatar, etc.)
     *
     * Example:
     *
     * ```js
     * const authData = await pb.collection("users").authWithOAuth2({
     *     provider: "google",
     * })
     * ```
     *
     * Note1: When creating the OAuth2 app in the provider dashboard
     * you have to configure `https://yourdomain.com/api/oauth2-redirect`
     * as redirect URL.
     *
     * Note2: Safari may block the default `urlCallback` popup because
     * it doesn't allow `window.open` calls as part of an `async` click functions.
     * To workaround this you can either change your click handler to not be marked as `async`
     * OR manually call `window.open` before your `async` function and use the
     * window reference in your own custom `urlCallback` (see https://github.com/pocketbase/pocketbase/discussions/2429#discussioncomment-5943061).
     * For example:
     * ```js
     * <button id="btn">Login with Gitlab</button>
     * ...
     * document.getElementById("btn").addEventListener("click", () => {
     *     pb.collection("users").authWithOAuth2({
     *         provider: "gitlab",
     *     }).then((authData) => {
     *         console.log(authData)
     *     }).catch((err) => {
     *         console.log(err, err.originalError);
     *     });
     * })
     * ```
     *
     * @throws {ClientResponseError}
     */
    authWithOAuth2<T = M>(options: OAuth2AuthConfig): Promise<RecordAuthResponse<T>>;
    /**
     * Refreshes the current authenticated record instance and
     * returns a new token and record data.
     *
     * On success this method also automatically updates the client's AuthStore.
     *
     * @throws {ClientResponseError}
     */
    authRefresh<T = M>(options?: RecordOptions): Promise<RecordAuthResponse<T>>;
    /**
     * @deprecated
     * Consider using authRefresh(options?).
     */
    authRefresh<T = M>(body?: any, query?: any): Promise<RecordAuthResponse<T>>;
    /**
     * Sends auth record password reset request.
     *
     * @throws {ClientResponseError}
     */
    requestPasswordReset(email: string, options?: CommonOptions): Promise<boolean>;
    /**
     * @deprecated
     * Consider using requestPasswordReset(email, options?).
     */
    requestPasswordReset(email: string, body?: any, query?: any): Promise<boolean>;
    /**
     * Confirms auth record password reset request.
     *
     * @throws {ClientResponseError}
     */
    confirmPasswordReset(passwordResetToken: string, password: string, passwordConfirm: string, options?: CommonOptions): Promise<boolean>;
    /**
     * @deprecated
     * Consider using confirmPasswordReset(passwordResetToken, password, passwordConfirm, options?).
     */
    confirmPasswordReset(passwordResetToken: string, password: string, passwordConfirm: string, body?: any, query?: any): Promise<boolean>;
    /**
     * Sends auth record verification email request.
     *
     * @throws {ClientResponseError}
     */
    requestVerification(email: string, options?: CommonOptions): Promise<boolean>;
    /**
     * @deprecated
     * Consider using requestVerification(email, options?).
     */
    requestVerification(email: string, body?: any, query?: any): Promise<boolean>;
    /**
     * Confirms auth record email verification request.
     *
     * If the current `client.authStore.record` matches with the auth record from the token,
     * then on success the `client.authStore.record.verified` will be updated to `true`.
     *
     * @throws {ClientResponseError}
     */
    confirmVerification(verificationToken: string, options?: CommonOptions): Promise<boolean>;
    /**
     * @deprecated
     * Consider using confirmVerification(verificationToken, options?).
     */
    confirmVerification(verificationToken: string, body?: any, query?: any): Promise<boolean>;
    /**
     * Sends an email change request to the authenticated record model.
     *
     * @throws {ClientResponseError}
     */
    requestEmailChange(newEmail: string, options?: CommonOptions): Promise<boolean>;
    /**
     * @deprecated
     * Consider using requestEmailChange(newEmail, options?).
     */
    requestEmailChange(newEmail: string, body?: any, query?: any): Promise<boolean>;
    /**
     * Confirms auth record's new email address.
     *
     * If the current `client.authStore.record` matches with the auth record from the token,
     * then on success the `client.authStore` will be cleared.
     *
     * @throws {ClientResponseError}
     */
    confirmEmailChange(emailChangeToken: string, password: string, options?: CommonOptions): Promise<boolean>;
    /**
     * @deprecated
     * Consider using confirmEmailChange(emailChangeToken, password, options?).
     */
    confirmEmailChange(emailChangeToken: string, password: string, body?: any, query?: any): Promise<boolean>;
    /**
     * @deprecated use collection("_externalAuths").*
     *
     * Lists all linked external auth providers for the specified auth record.
     *
     * @throws {ClientResponseError}
     */
    listExternalAuths(recordId: string, options?: CommonOptions): Promise<Array<RecordModel>>;
    /**
     * @deprecated use collection("_externalAuths").*
     *
     * Unlink a single external auth provider from the specified auth record.
     *
     * @throws {ClientResponseError}
     */
    unlinkExternalAuth(recordId: string, provider: string, options?: CommonOptions): Promise<boolean>;
    /**
     * Sends auth record OTP to the provided email.
     *
     * @throws {ClientResponseError}
     */
    requestOTP(email: string, options?: CommonOptions): Promise<OTPResponse>;
    /**
     * Authenticate a single auth collection record via OTP.
     *
     * On success, this method also automatically updates
     * the client's AuthStore data and returns:
     * - the authentication token
     * - the authenticated record model
     *
     * @throws {ClientResponseError}
     */
    authWithOTP<T = M>(otpId: string, password: string, options?: CommonOptions): Promise<RecordAuthResponse<T>>;
    /**
     * Impersonate authenticates with the specified recordId and
     * returns a new client with the received auth token in a memory store.
     *
     * If `duration` is 0 the generated auth token will fallback
     * to the default collection auth token duration.
     *
     * This action currently requires superusers privileges.
     *
     * @throws {ClientResponseError}
     */
    impersonate(recordId: string, duration: number, options?: CommonOptions): Promise<Client>;
    private _replaceQueryParams;
}
