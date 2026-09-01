import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { Type } from '@nestjs/common';
import request, { CallbackHandler } from 'supertest';
import './suppertest.helper.js';
import { SupertestConfig } from '../types/supertest-config.type.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { Server } from 'node:http';

export abstract class BaseTestHelper {
    public app: NestExpressApplication;
    public moduleFixture: TestingModule;
    private testHelperModules: { [_: string]: any } = {};
    private httpService: Server;

    abstract getTestModuleBuilder(): TestingModuleBuilder;
    abstract getSupertestConfig(): SupertestConfig;

    async beforeNestStart(): Promise<void> {
        // Do something before nest start
    }

    async initialize(overrideBuilder?: (builder: TestingModuleBuilder) => TestingModuleBuilder): Promise<void> {
        let moduleBuilder = this.getTestModuleBuilder();
        if (overrideBuilder) {
            moduleBuilder = overrideBuilder(moduleBuilder);
        }
        this.moduleFixture = await moduleBuilder.compile();
        this.app = this.moduleFixture.createNestApplication();
        await this.beforeNestStart();
        await this.app.init();
        this.httpService = this.app.getHttpServer();
    }

    getTestHelperModule<T>(testHelperModule: new (t: BaseTestHelper) => T): T {
        if (!this.testHelperModules[testHelperModule.name]) {
            this.testHelperModules[testHelperModule.name] = new testHelperModule(this);
        }
        return this.testHelperModules[testHelperModule.name];
    }

    async close(): Promise<void> {
        this.app.flushLogs();
        const { vi } = await import('vitest');
        vi.restoreAllMocks();
        await this.beforeCloseApp();
        await this.app.close();
        this.app = null;
        if (global.gc) {
            global.gc();
        }
    }

    async beforeCloseApp(): Promise<void> {
        // Do something before close app
    }

    getService<T>(service: Type<T>): Promise<T> {
        return this.moduleFixture.resolve(service);
    }

    private applySupertestConfig(request: request.Test): request.Test {
        request.config = this.getSupertestConfig();
        return request;
    }

    private buildRequest(test: request.Test, callback?: CallbackHandler): request.Test {
        const configuredTest = this.applySupertestConfig(test);
        return callback ? configuredTest.end(callback) : configuredTest;
    }

    get(url: string, callback?: CallbackHandler): request.Test {
        return this.buildRequest(request(this.httpService).get(url), callback);
    }

    post(url: string, callback?: CallbackHandler): request.Test {
        return this.buildRequest(request(this.httpService).post(url), callback);
    }

    put(url: string, callback?: CallbackHandler): request.Test {
        return this.buildRequest(request(this.httpService).put(url), callback);
    }

    patch(url: string, callback?: CallbackHandler): request.Test {
        return this.buildRequest(request(this.httpService).patch(url), callback);
    }

    delete(url: string, callback?: CallbackHandler): request.Test {
        return this.buildRequest(request(this.httpService).delete(url), callback);
    }

    async invisibleInDatabase(entity: any, condition: any): Promise<void> {
        if (typeof condition === 'string') {
            condition = { id: condition };
        }
        if (await entity.getRepository().findOneBy(condition)) {
            throw new Error(`${JSON.stringify(condition)}  visible in database`);
        }
    }

    async visibleInDatabase(entity: any, condition: any): Promise<void> {
        if (typeof condition === 'string') {
            condition = { id: condition };
        }
        if (!(await entity.getRepository().findOneBy(condition))) {
            throw new Error(`${JSON.stringify(condition)} invisible in database`);
        }
    }
}
