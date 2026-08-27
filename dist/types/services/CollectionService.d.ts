import { CrudService } from "@/services/CrudService";
import { CommonOptions } from "@/tools/options";
import { CollectionModel, ConfigurableOAuth2Provider } from "@/tools/dtos";
export declare class CollectionService extends CrudService<CollectionModel> {
    /**
     * @inheritdoc
     */
    get baseCrudPath(): string;
    /**
     * Imports the provided collections.
     *
     * If `deleteMissing` is `true`, all local collections and their fields,
     * that are not present in the imported configuration, WILL BE DELETED
     * (including their related records data)!
     *
     * @throws {ClientResponseError}
     */
    import(collections: Array<CollectionModel>, deleteMissing?: boolean, options?: CommonOptions): Promise<true>;
    /**
     * Deletes all records associated with the specified collection.
     *
     * @throws {ClientResponseError}
     */
    truncate(collectionIdOrName: string, options?: CommonOptions): Promise<true>;
    /**
     * Returns type indexed map with scaffolded collection models
     * populated with their default field values.
     *
     * @throws {ClientResponseError}
     */
    getScaffolds(options?: CommonOptions): Promise<{
        [key: string]: CollectionModel;
    }>;
    /**
     * Returns a list with all configurable OAuth2 providers.
     *
     * @throws {ClientResponseError}
     */
    getAllOAuth2Providers(options?: CommonOptions): Promise<Array<ConfigurableOAuth2Provider>>;
    /**
     * Executes the specified view query and returns a sample of the resulting records.
     *
     * @throws {ClientResponseError}
     */
    dryRunViewQuery(query: string, options?: CommonOptions): Promise<Array<{
        [key: string]: any;
    }>>;
}
