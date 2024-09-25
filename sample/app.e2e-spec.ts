import { TestHelper } from './test.helper';

describe('AppController (e2e)', () => {
    const testHelper = new TestHelper();

    beforeAll(async () => {
        await testHelper.initialize();
    });

    it('Get index success', async () => {
        return testHelper.get('/').isOk().expect('Hello World!2');
    });
});
