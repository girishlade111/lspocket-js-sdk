import { BaseService } from "@/services/BaseService";
import { CommonOptions } from "@/tools/options";
export interface CronJob {
    id: string;
    expression: string;
}
export declare class CronService extends BaseService {
    /**
     * Returns list with all registered cron jobs.
     *
     * @throws {ClientResponseError}
     */
    getFullList(options?: CommonOptions): Promise<Array<CronJob>>;
    /**
     * Runs the specified cron job.
     *
     * @throws {ClientResponseError}
     */
    run(jobId: string, options?: CommonOptions): Promise<boolean>;
}
