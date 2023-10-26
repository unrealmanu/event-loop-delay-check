import { EventLoopDelayCheckService } from '../src/index';

const eventLoopDelayCheckService = new EventLoopDelayCheckService();
eventLoopDelayCheckService.start({ minDelay: 1000 });
