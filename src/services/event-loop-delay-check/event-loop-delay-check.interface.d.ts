export declare module IEventLoopDelayCheck {
    export interface Service {
        start(options: IEventLoopDelayCheckServiceStartOptions): void;
        stop(): void;
        getEventLoopDelay(): number;
    }

    export interface StartOptions {
        maxDelay?: number;
    }
}
