import { BaseService } from "@/services/BaseService";
import { CommonOptions, FileOptions } from "@/tools/options";
export declare class FileService extends BaseService {
    /**
     * @deprecated Please replace with `pb.files.getURL()`.
     */
    getUrl(record: {
        [key: string]: any;
    }, filename: string, queryParams?: FileOptions): string;
    /**
     * Builds and returns an absolute record file url for the provided filename.
     */
    getURL(record: {
        [key: string]: any;
    }, filename: string, queryParams?: FileOptions): string;
    /**
     * Requests a new private file access token for the current auth model.
     *
     * @throws {ClientResponseError}
     */
    getToken(options?: CommonOptions): Promise<string>;
}
