export declare module IEventLoopCheck {
    export interface Service {
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

    export interface StartOptions {
        minDelay?: number;
        sampleInterval?: number;
    }
}
