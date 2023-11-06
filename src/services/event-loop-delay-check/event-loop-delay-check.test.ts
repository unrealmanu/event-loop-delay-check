import sleep from 'atomic-sleep';
import { EventLoopDelayCheckService } from './event-loop-delay-check.service';
import { IEventLoopDelayCheck } from './event-loop-delay-check.interface';

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
        const delay = service.getEventLoopDelay();

        setTimeout(() => {
            expect(delay).toBe(0);
            done();
        }, 10);
    });

    it('should be expect event loop is delayed over 500ms', (done) => {
        service.start(options);

        sleep(2000);

        setTimeout(() => {
            const delay = service.getEventLoopDelay();
            expect(delay).toBeGreaterThan(maxDelay);
            done();
        }, 100);
    });
});
