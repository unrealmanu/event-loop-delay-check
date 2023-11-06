import { spawnSync } from 'node:child_process';
import { IEventLoopDelayCheck } from './event-loop-delay-check.interface';
import { EventLoopDelayCheckService } from './event-loop-delay-check.service';

describe('EventLoopDelayCheck', () => {
    let service: IEventLoopDelayCheck.Service;
    const options: IEventLoopDelayCheck.StartOptions = { minDelay: 500 };
    const maxDelay = 500;

    beforeEach(() => {
        jest.setTimeout(10_000);
        service = new EventLoopDelayCheckService();
    });

    it('should be expect event loop is not delayed', (done) => {
        service.start(options);
        const delayInMs = service.getEventLoopDelay();

        setImmediate(() => {
            expect(delayInMs).toBe(0);
            done();
        });
    });

    it('should be expect event loop is delayed over 500ms', (done) => {
        service.start(options);

        spawnSync('sleep', ['2']);

        setImmediate(() => {
            const delay = service.getEventLoopDelay();
            expect(delay).toBeGreaterThan(maxDelay);
            done();
        });
    });
});
