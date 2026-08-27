import { BaseService } from "@/services/BaseService";
import { CommonOptions } from "@/tools/options";
export interface HealthCheckResponse {
    code: number;
    message: string;
    data: {
        [key: string]: any;
    };
}
export declare class HealthService extends BaseService {
    /**
     * Checks the health status of the api.
     *
     * @throws {ClientResponseError}
     */
    check(options?: CommonOptions): Promise<HealthCheckResponse>;
}
