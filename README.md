# Event loop delay check

This project is to check whether there is a delay in the execution of the event loop activities

### Example
```typescript
const eventLoopDelayCheckService = new EventLoopDelayCheckService();
eventLoopDelayCheckService.start({ minDelay: 1000 });
```


### Command

For run test
```
yarn test:watch
```

For build
```
yarn build
```