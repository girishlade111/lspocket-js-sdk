import { BaseService } from "@/services/BaseService";
import { ListResult } from "@/tools/dtos";
import { CommonOptions, ListOptions, FullListOptions } from "@/tools/options";
export declare abstract class CrudService<M> extends BaseService {
    /**
     * Base path for the crud actions (without trailing slash, eg. '/admins').
     */
    abstract get baseCrudPath(): string;
    /**
     * Response data decoder.
     */
    decode<T = M>(data: {
        [key: string]: any;
    }): T;
    /**
     * Returns a promise with all list items batch fetched at once
     * (by default 1000 items per request; to change it set the `batch` query param).
     *
     * You can use the generic T to supply a wrapper type of the crud model.
     *
     * @throws {ClientResponseError}
     */
    getFullList<T = M>(options?: FullListOptions): Promise<Array<T>>;
    /**
     * Legacy version of getFullList with explicitly specified batch size.
     */
    getFullList<T = M>(batch?: number, options?: ListOptions): Promise<Array<T>>;
    /**
     * Returns paginated items list.
     *
     * You can use the generic T to supply a wrapper type of the crud model.
     *
     * @throws {ClientResponseError}
     */
    getList<T = M>(page?: number, perPage?: number, options?: ListOptions): Promise<ListResult<T>>;
    /**
     * Returns the first found item by the specified filter.
     *
     * Internally it calls `getList(1, 1, { filter, skipTotal })` and
     * returns the first found item.
     *
     * You can use the generic T to supply a wrapper type of the crud model.
     *
     * For consistency with `getOne`, this method will throw a 404
     * ClientResponseError if no item was found.
     *
     * @throws {ClientResponseError}
     */
    getFirstListItem<T = M>(filter: string, options?: CommonOptions): Promise<T>;
    /**
     * Returns single item by its id.
     *
     * You can use the generic T to supply a wrapper type of the crud model.
     *
     * If `id` is empty it will throw a 404 error.
     *
     * @throws {ClientResponseError}
     */
    getOne<T = M>(id: string, options?: CommonOptions): Promise<T>;
    /**
     * Creates a new item.
     *
     * You can use the generic T to supply a wrapper type of the crud model.
     *
     * @throws {ClientResponseError}
     */
    create<T = M>(bodyParams?: {
        [key: string]: any;
    } | FormData, options?: CommonOptions): Promise<T>;
    /**
     * Updates an existing item by its id.
     *
     * You can use the generic T to supply a wrapper type of the crud model.
     *
     * @throws {ClientResponseError}
     */
    update<T = M>(id: string, bodyParams?: {
        [key: string]: any;
    } | FormData, options?: CommonOptions): Promise<T>;
    /**
     * Deletes an existing item by its id.
     *
     * @throws {ClientResponseError}
     */
    delete(id: string, options?: CommonOptions): Promise<boolean>;
    /**
     * Returns a promise with all list items batch fetched at once.
     */
    protected _getFullList<T = M>(batchSize?: number, options?: ListOptions): Promise<Array<T>>;
}
