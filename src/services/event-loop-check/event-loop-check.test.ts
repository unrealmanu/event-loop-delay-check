import { spawnSync } from 'node:child_process';
import { IEventLoopCheck } from './event-loop-check.interface';
import { EventLoopDelayCheckService } from './event-loop-check.service';

describe('EventLoopDelay', () => {
    let service: IEventLoopCheck.Service;
    const options: IEventLoopCheck.StartOptions = { minDelay: 500 };
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
