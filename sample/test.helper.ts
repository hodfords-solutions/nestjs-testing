import { BaseTestHelper, SupertestConfig } from '@hodfords/nestjs-testing';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from './app.module.js';

export class TestHelper extends BaseTestHelper {
    getSupertestConfig(): SupertestConfig {
        return {
            isUseBearerAuth: true,
            authenticationHeader: 'Authorization',
            workspaceHeader: 'x-workspace-id'
        };
    }

    getTestModuleBuilder(): TestingModuleBuilder {
        return Test.createTestingModule({
            imports: [AppModule]
        });
    }
}
