import { BaseService } from "@/services/BaseService";
import { ListResult, LogModel } from "@/tools/dtos";
import { CommonOptions, ListOptions, LogStatsOptions } from "@/tools/options";
export interface HourlyStats {
    total: number;
    date: string;
}
export declare class LogService extends BaseService {
    /**
     * Returns paginated logs list.
     *
     * @throws {ClientResponseError}
     */
    getList(page?: number, perPage?: number, options?: ListOptions): Promise<ListResult<LogModel>>;
    /**
     * Returns a single log by its id.
     *
     * If `id` is empty it will throw a 404 error.
     *
     * @throws {ClientResponseError}
     */
    getOne(id: string, options?: CommonOptions): Promise<LogModel>;
    /**
     * Returns logs statistics.
     *
     * @throws {ClientResponseError}
     */
    getStats(options?: LogStatsOptions): Promise<Array<HourlyStats>>;
    /**
     * Deletes all logs.
     *
     * @throws {ClientResponseError}
     */
    truncate(options?: CommonOptions): Promise<true>;
}
