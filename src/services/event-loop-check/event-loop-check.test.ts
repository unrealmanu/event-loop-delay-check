import { spawnSync } from 'node:child_process';
import { IEventLoopCheckService, IEventLoopCheckServiceStartOptions } from './event-loop-check.interface';
import { EventLoopDelayCheckService } from './event-loop-check.service';

describe('EventLoopDelay', () => {
    let service: IEventLoopCheckService;
    const options: IEventLoopCheckServiceStartOptions = { minDelay: 500 };
    const maxDelay = 500;

    beforeEach(() => {
        jest.setTimeout(10_000);
        service = new EventLoopDelayCheckService();
        service.start(options);
    });

    it('should be expect event loop is not delayed', (done) => {
        const delayInMs = service.getEventLoopDelay();

        setImmediate(() => {
            expect(delayInMs).toBe(0);
            done();
        });
    });

    it('should be expect event loop is delayed over 500ms', (done) => {
        spawnSync('sleep', ['2']);

        setImmediate(() => {
            const delay = service.getEventLoopDelay();
            expect(delay).toBeGreaterThan(maxDelay);
            done();
        });
    });

    it('should be expect event loop check is stopped', (done) => {
        expect(service['_checkTimeout']).toBeDefined();
        service.stop();
        setImmediate(() => {
            expect(service['_checkTimeout']).toEqual(expect.objectContaining({ _destroyed: true }));
            done();
        });
    });

    it('should be expect event loop utilization', () => {
        const utilization = service.getEventLoopUtilizations();
        expect(typeof utilization).toBe('number');
    });

    it('should be start with mindelay default value', () => {
        const service = new EventLoopDelayCheckService();
        service.start();
        expect(service['_minDelay']).toBe(500);
    });
});
