export interface IEventLoopCheckService {
    start(options?: StartOptions): void;
    stop(): void;
    /**
     * @returns {number} delay in milliseconds
     */
    getEventLoopDelay(): number;

    /**
     * @returns {number} percentage of event loop utilization
     */
    getEventLoopUtilizations(): number;
}

export interface IEventLoopCheckServiceStartOptions {
    minDelay?: number;
    sampleInterval?: number;
}
