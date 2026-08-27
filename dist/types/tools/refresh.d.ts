import Client from "@/Client";
export declare function resetAutoRefresh(client: Client): void;
export declare function registerAutoRefresh(client: Client, threshold: number, refreshFunc: () => Promise<any>, reauthenticateFunc: () => Promise<any>): void;
