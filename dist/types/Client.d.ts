import { BaseAuthStore } from "@/stores/BaseAuthStore";
import { SettingsService } from "@/services/SettingsService";
import { RecordService } from "@/services/RecordService";
import { CollectionService } from "@/services/CollectionService";
import { LogService } from "@/services/LogService";
import { RealtimeService } from "@/services/RealtimeService";
import { HealthService } from "@/services/HealthService";
import { FileService } from "@/services/FileService";
import { BackupService } from "@/services/BackupService";
import { CronService } from "@/services/CronService";
import { SQLService } from "@/services/SQLService";
import { BatchService } from "@/services/BatchService";
import { RecordModel } from "@/tools/dtos";
import { SendOptions, FileOptions } from "@/tools/options";
export interface BeforeSendResult {
    [key: string]: any;
    url?: string;
    options?: {
        [key: string]: any;
    };
}
/**
 * LS Pocket JS Client.
 */
export default class LSPocket {
    /**
     * The base LS Pocket backend url address (eg. 'http://127.0.0.1.8090').
     */
    baseURL: string;
    /**
     * Legacy getter alias for baseURL.
     * @deprecated Please replace with baseURL.
     */
    get baseUrl(): string;
    /**
     * Legacy setter alias for baseURL.
     * @deprecated Please replace with baseURL.
     */
    set baseUrl(v: string);
    /**
     * Hook that get triggered right before sending the fetch request,
     * allowing you to inspect and modify the url and request options.
     *
     * For list of the possible options check https://developer.mozilla.org/en-US/docs/Web/API/fetch#options
     *
     * You can return a non-empty result object `{ url, options }` to replace the url and request options entirely.
     *
     * Example:
     * ```js
     * const pb = new LSPocket("https://example.com")
     *
     * pb.beforeSend = function (url, options) {
     *     options.headers = Object.assign({}, options.headers, {
     *         'X-Custom-Header': 'example',
     *     })
     *
     *     return { url, options }
     * }
     *
     * // use the created client as usual...
     * ```
     */
    beforeSend?: (url: string, options: SendOptions) => BeforeSendResult | Promise<BeforeSendResult>;
    /**
     * Hook that get triggered after successfully sending the fetch request,
     * allowing you to inspect/modify the response object and its parsed data.
     *
     * Returns the new Promise resolved `data` that will be returned to the client.
     *
     * Example:
     * ```js
     * const pb = new LSPocket("https://example.com")
     *
     * pb.afterSend = function (response, data, options) {
     *     if (response.status != 200) {
     *         throw new ClientResponseError({
     *             url:      response.url,
     *             status:   response.status,
     *             response: { ... },
     *         })
     *     }
     *
     *     return data;
     * }
     *
     * // use the created client as usual...
     * ```
     */
    afterSend?: ((response: Response, data: any) => any) & ((response: Response, data: any, options: SendOptions) => any);
    /**
     * Optional language code (default to `en-US`) that will be sent
     * with the requests to the server as `Accept-Language` header.
     */
    lang: string;
    /**
     * A replaceable instance of the local auth store service.
     */
    authStore: BaseAuthStore;
    /**
     * An instance of the service that handles the **Settings APIs**.
     */
    readonly settings: SettingsService;
    /**
     * An instance of the service that handles the **Collection APIs**.
     */
    readonly collections: CollectionService;
    /**
     * An instance of the service that handles the **File APIs**.
     */
    readonly files: FileService;
    /**
     * An instance of the service that handles the **Log APIs**.
     */
    readonly logs: LogService;
    /**
     * An instance of the service that handles the **Realtime APIs**.
     */
    readonly realtime: RealtimeService;
    /**
     * An instance of the service that handles the **Health APIs**.
     */
    readonly health: HealthService;
    /**
     * An instance of the service that handles the **Backup APIs**.
     */
    readonly backups: BackupService;
    /**
     * An instance of the service that handles the **Cron APIs**.
     */
    readonly crons: CronService;
    /**
     * An instance of the service that handles the **SQL APIs**.
     */
    readonly sql: SQLService;
    private cancelControllers;
    private recordServices;
    private enableAutoCancellation;
    constructor(baseURL?: string, authStore?: BaseAuthStore | null, lang?: string);
    /**
     * @deprecated
     * With PocketBase v0.23.0 admins are converted to a regular auth
     * collection named "_superusers", aka. you can use directly collection("_superusers").
     */
    get admins(): RecordService;
    /**
     * Creates a new batch handler for sending multiple transactional
     * create/update/upsert/delete collection requests in one network call.
     *
     * Example:
     * ```js
     * const batch = pb.createBatch();
     *
     * batch.collection("example1").create({ ... })
     * batch.collection("example2").update("RECORD_ID", { ... })
     * batch.collection("example3").delete("RECORD_ID")
     * batch.collection("example4").upsert({ ... })
     *
     * await batch.send()
     * ```
     */
    createBatch(): BatchService;
    /**
     * Returns the RecordService associated to the specified collection.
     */
    collection<M = RecordModel>(idOrName: string): RecordService<M>;
    /**
     * Globally enable or disable auto cancellation for pending duplicated requests.
     */
    autoCancellation(enable: boolean): LSPocket;
    /**
     * Cancels single request by its cancellation key.
     */
    cancelRequest(requestKey: string): LSPocket;
    /**
     * Cancels all pending requests.
     */
    cancelAllRequests(): LSPocket;
    /**
     * Constructs a filter expression with placeholders populated from a parameters object.
     *
     * Placeholder parameters are defined with the `{:paramName}` notation.
     *
     * The following parameter values are supported:
     *
     * - `string`
     * - `number`
     * - `boolean`
     * - `null`
     * - `undefined` (stringified as "null")
     * - `Date` object (_stringified into the LS Pocket datetime format_)
     * - everything else is converted to a string using `JSON.stringify()`
     *
     * Example:
     *
     * ```js
     * pb.collection("example").getFirstListItem(pb.filter(
     *    'title ~ {:title} && created >= {:created}',
     *    { title: "example", created: new Date()}
     * ))
     * ```
     */
    filter(raw: string, params?: {
        [key: string]: any;
    }): string;
    /**
     * @deprecated Please use `pb.files.getURL()`.
     */
    getFileUrl(record: {
        [key: string]: any;
    }, filename: string, queryParams?: FileOptions): string;
    /**
     * @deprecated Please use `pb.buildURL()`.
     */
    buildUrl(path: string): string;
    /**
     * Builds a full client url by safely concatenating the provided path.
     */
    buildURL(path: string): string;
    /**
     * Sends an api http request.
     *
     * @throws {ClientResponseError}
     */
    send<T = any>(path: string, options: SendOptions): Promise<T>;
    /**
     * Shallow copy the provided object and takes care to initialize
     * any options required to preserve the backward compatability.
     *
     * @param  {SendOptions} options
     * @return {SendOptions}
     */
    private initSendOptions;
    /**
     * Extracts the header with the provided name in case-insensitive manner.
     * Returns `null` if no header matching the name is found.
     */
    private getHeader;
}
