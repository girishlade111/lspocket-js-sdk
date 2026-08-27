import { BaseService } from "@/services/BaseService";
import { SendOptions } from "@/tools/options";
export type UnsubscribeFunc = () => Promise<void>;
export declare class RealtimeService extends BaseService {
    clientId: string;
    private eventSource;
    private subscriptions;
    private lastSentSubscriptions;
    private connectTimeoutId;
    private maxConnectTimeout;
    private reconnectTimeoutId;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private predefinedReconnectIntervals;
    private pendingConnects;
    private pendingSubmits;
    private isProcessingPendingSubmits;
    /**
     * Returns whether the realtime connection has been established.
     */
    get isConnected(): boolean;
    /**
     * An optional hook that is invoked when the realtime client disconnects
     * either when unsubscribing from all subscriptions or when the
     * connection was interrupted or closed by the server.
     *
     * The received argument could be used to determine whether the disconnect
     * is a result from unsubscribing (`activeSubscriptions.length == 0`)
     * or because of network/server error (`activeSubscriptions.length > 0`).
     *
     * If you want to listen for the opposite, aka. when the client connection is established,
     * subscribe to the `PB_CONNECT` event.
     */
    onDisconnect?: (activeSubscriptions: Array<string>) => void;
    /**
     * Register the subscription listener.
     *
     * You can subscribe multiple times to the same topic.
     *
     * If the SSE connection is not started yet,
     * this method will also initialize it.
     */
    subscribe(topic: string, callback: (data: any) => void, options?: SendOptions): Promise<UnsubscribeFunc>;
    /**
     * Unsubscribe from all subscription listeners with the specified topic.
     *
     * If `topic` is not provided, then this method will unsubscribe
     * from all active subscriptions.
     *
     * This method is no-op if there are no active subscriptions.
     *
     * The related sse connection will be autoclosed if after the
     * unsubscribe operation there are no active subscriptions left.
     */
    unsubscribe(topic?: string): Promise<void>;
    /**
     * Unsubscribe from all subscription listeners starting with the specified topic prefix.
     *
     * This method is no-op if there are no active subscriptions with the specified topic prefix.
     *
     * The related sse connection will be autoclosed if after the
     * unsubscribe operation there are no active subscriptions left.
     */
    unsubscribeByPrefix(keyPrefix: string): Promise<void>;
    /**
     * Unsubscribe from all subscriptions matching the specified topic and listener function.
     *
     * This method is no-op if there are no active subscription with
     * the specified topic and listener.
     *
     * The related sse connection will be autoclosed if after the
     * unsubscribe operation there are no active subscriptions left.
     */
    unsubscribeByTopicAndListener(topic: string, listener: EventListener): Promise<void>;
    private hasSubscriptionListeners;
    private submitSubscriptions;
    private finalizePendingSubscriptions;
    private getSubscriptionsCancelKey;
    private getSubscriptionsByTopic;
    private getNonEmptySubscriptionKeys;
    private hasUnsentSubscriptions;
    private sendSubscriptions;
    private addAllSubscriptionListeners;
    private removeAllSubscriptionListeners;
    private connect;
    private initConnect;
    private connectErrorHandler;
    private disconnect;
}
