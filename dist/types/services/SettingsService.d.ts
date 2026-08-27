import { BaseService } from "@/services/BaseService";
import { CommonOptions } from "@/tools/options";
interface appleClientSecret {
    secret: string;
}
export declare class SettingsService extends BaseService {
    /**
     * Fetch all available app settings.
     *
     * @throws {ClientResponseError}
     */
    getAll(options?: CommonOptions): Promise<{
        [key: string]: any;
    }>;
    /**
     * Bulk updates app settings.
     *
     * @throws {ClientResponseError}
     */
    update(bodyParams?: {
        [key: string]: any;
    } | FormData, options?: CommonOptions): Promise<{
        [key: string]: any;
    }>;
    /**
     * Performs a S3 filesystem connection test.
     *
     * The currently supported `filesystem` are "storage" and "backups".
     *
     * @throws {ClientResponseError}
     */
    testS3(filesystem?: string, options?: CommonOptions): Promise<boolean>;
    /**
     * Sends a test email.
     *
     * The possible `emailTemplate` values are:
     * - verification
     * - password-reset
     * - email-change
     *
     * @throws {ClientResponseError}
     */
    testEmail(collectionIdOrName: string, toEmail: string, emailTemplate: string, options?: CommonOptions): Promise<boolean>;
    /**
     * Generates a new Apple OAuth2 client secret.
     *
     * @throws {ClientResponseError}
     */
    generateAppleClientSecret(clientId: string, teamId: string, keyId: string, privateKey: string, duration: number, options?: CommonOptions): Promise<appleClientSecret>;
}
export {};
