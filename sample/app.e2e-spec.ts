import { afterAll, beforeAll, describe, it } from 'vitest';
import { TestHelper } from './test.helper.js';

describe('AppController (e2e)', () => {
    const testHelper = new TestHelper();

    beforeAll(async () => {
        await testHelper.initialize();
    });

    afterAll(async () => {
        await testHelper.close();
    });

    it('Get index success', async () => {
        return testHelper.get('/').isOk().expect('Hello World!');
    });
});
