import { BaseTestHelper } from '@hodfords/nestjs-testing';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from './app.module';
import { SupertestConfig } from 'lib/types/supertest-config.type';

export class TestHelper extends BaseTestHelper {
    getSupertestConfig(): SupertestConfig {
        return {
            isUseBearerAuth: true,
            authenticationHeader: 'Authorization'
        };
    }

    getTestModuleBuilder(): TestingModuleBuilder {
        return Test.createTestingModule({
            imports: [AppModule]
        });
    }
}
