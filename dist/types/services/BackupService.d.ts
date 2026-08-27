import { BaseService } from "@/services/BaseService";
import { CommonOptions } from "@/tools/options";
export interface BackupFileInfo {
    key: string;
    size: number;
    modified: string;
}
export declare class BackupService extends BaseService {
    /**
     * Returns list with all available backup files.
     *
     * @throws {ClientResponseError}
     */
    getFullList(options?: CommonOptions): Promise<Array<BackupFileInfo>>;
    /**
     * Initializes a new backup.
     *
     * @throws {ClientResponseError}
     */
    create(basename: string, options?: CommonOptions): Promise<boolean>;
    /**
     * Uploads an existing backup file.
     *
     * Example:
     *
     * ```js
     * await pb.backups.upload({
     *     file: new Blob([...]),
     * });
     * ```
     *
     * @throws {ClientResponseError}
     */
    upload(bodyParams: {
        [key: string]: any;
    } | FormData, options?: CommonOptions): Promise<boolean>;
    /**
     * Deletes a single backup file.
     *
     * @throws {ClientResponseError}
     */
    delete(key: string, options?: CommonOptions): Promise<boolean>;
    /**
     * Initializes an app data restore from an existing backup.
     *
     * @throws {ClientResponseError}
     */
    restore(key: string, options?: CommonOptions): Promise<boolean>;
    /**
     * @deprecated Please use `getDownloadURL()`.
     */
    getDownloadUrl(token: string, key: string): string;
    /**
     * Builds a download url for a single existing backup using a
     * superuser file token and the backup file key.
     *
     * The file token can be generated via `pb.files.getToken()`.
     */
    getDownloadURL(token: string, key: string): string;
}
