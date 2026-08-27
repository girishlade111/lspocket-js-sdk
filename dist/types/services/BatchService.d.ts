import { BaseService } from "@/services/BaseService";
import { SendOptions, RecordOptions } from "@/tools/options";
export interface BatchRequest {
    method: string;
    url: string;
    json?: {
        [key: string]: any;
    };
    files?: {
        [key: string]: Array<any>;
    };
    headers?: {
        [key: string]: string;
    };
}
export interface BatchRequestResult {
    status: number;
    body: any;
}
export declare class BatchService extends BaseService {
    private requests;
    private subs;
    /**
     * Starts constructing a batch request entry for the specified collection.
     */
    collection(collectionIdOrName: string): SubBatchService;
    /**
     * Sends the batch requests.
     *
     * @throws {ClientResponseError}
     */
    send(options?: SendOptions): Promise<Array<BatchRequestResult>>;
}
export declare class SubBatchService {
    private requests;
    private readonly collectionIdOrName;
    constructor(requests: Array<BatchRequest>, collectionIdOrName: string);
    /**
     * Registers a record upsert request into the current batch queue.
     *
     * The request will be executed as update if `bodyParams` have a valid existing record `id` value, otherwise - create.
     */
    upsert(bodyParams?: {
        [key: string]: any;
    } | FormData, options?: RecordOptions): void;
    /**
     * Registers a record create request into the current batch queue.
     */
    create(bodyParams?: {
        [key: string]: any;
    } | FormData, options?: RecordOptions): void;
    /**
     * Registers a record update request into the current batch queue.
     */
    update(id: string, bodyParams?: {
        [key: string]: any;
    } | FormData, options?: RecordOptions): void;
    /**
     * Registers a record delete request into the current batch queue.
     */
    delete(id: string, options?: SendOptions): void;
    private prepareRequest;
}
