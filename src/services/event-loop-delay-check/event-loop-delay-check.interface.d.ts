export declare module IEventLoopDelayCheck {
    export interface Service {
        start(options?: IEventLoopDelayCheckServiceStartOptions): void;
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

    export interface StartOptions {
        minDelay?: number;
        sampleInterval?: number;
    }
}
