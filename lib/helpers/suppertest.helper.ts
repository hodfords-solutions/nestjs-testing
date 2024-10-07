import request from 'supertest';
import superagent from 'superagent';
import { get, has } from 'lodash';
import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SupertestConfig } from '../types/supertest-config.type';

const test = (request as any).Test;
const msgError = 'Response do not contains key';

declare module 'supertest' {
    interface Test extends superagent.SuperAgentRequest {
        config: SupertestConfig;

        authenticate(token: string): this;

        setHeader(key: string, value: string): this;

        has(keys: string | string[]): this;

        notHas(keys: string | string[]): this;

        assertValue(key: string, value): this;

        isOk(): this;

        isAuthError(): this;

        isValidateError(): this;

        isForbiddenError(): this;

        isBadRequestError(): this;

        isNoContent(): this;

        isNotFound(): this;

        isCreated(): this;

        isPreconditionFailed(): this;

        isPagination(dataKey?: string): this;
    }
}

test.prototype.authenticate = function (value: string): Test {
    if (this.config.isUseBearerAuth) {
        return this.set('Authorization', `Bearer ${value}`);
    }

    return this.set(this.config.authenticationHeader, value);
};

test.prototype.setHeader = function (key: string, value: any): Test {
    return this.set(key, value);
};

test.prototype.isOk = function (): Test {
    return this.expect(HttpStatus.OK);
};

test.prototype.isNotFound = function (): Test {
    return this.expect(HttpStatus.NOT_FOUND);
};

test.prototype.isAuthError = function (): Test {
    return this.expect(HttpStatus.UNAUTHORIZED);
};

test.prototype.isValidateError = function (): Test {
    return this.expect(HttpStatus.UNPROCESSABLE_ENTITY);
};

test.prototype.isForbiddenError = function (): Test {
    return this.expect(HttpStatus.FORBIDDEN);
};

test.prototype.isBadRequestError = function (): Test {
    return this.expect(HttpStatus.BAD_REQUEST);
};

test.prototype.isNoContent = function (): Test {
    return this.expect(HttpStatus.NO_CONTENT);
};

test.prototype.isCreated = function (): Test {
    return this.expect(HttpStatus.CREATED);
};

test.prototype.isPreconditionFailed = function (): Test {
    return this.expect(HttpStatus.PRECONDITION_FAILED);
};

test.prototype.isPagination = function (dataKey?: string): Test {
    const paginationKeys = ['total', 'lastPage', 'perPage', 'currentPage'];
    if (dataKey) {
        return this.expect(function (res) {
            for (const key of paginationKeys) {
                if (!has(res.body[dataKey], key)) {
                    throw new Error(`${msgError} ${key}`);
                }
            }
        });
    } else {
        return this.has(paginationKeys);
    }
};

test.prototype.has = function (keys: string | string[]): Test {
    return this.expect(function (res) {
        if (typeof keys === 'string') {
            if (!has(res.body, keys)) {
                throw new Error(`${msgError} ${keys}`);
            }
        } else {
            for (const key of keys) {
                if (!has(res.body, key)) {
                    throw new Error(`${msgError} ${key}`);
                }
            }
        }
    });
};

test.prototype.notHas = function (keys: string | string[]): Test {
    return this.expect(function (res) {
        if (typeof keys === 'string') {
            if (has(res.body, keys)) {
                throw new Error('Response contains key ' + keys);
            }
        } else {
            for (const key of keys) {
                if (has(res.body, key)) {
                    throw new Error('Response contains key ' + key);
                }
            }
        }
    });
};

test.prototype.assertValue = function (key: string, value: any): Test {
    return this.expect(function (res) {
        const body = res.body;
        if (get(body, key) !== value) {
            throw new Error(`${key} not equal ${value}. Value is ${get(body, key)}`);
        }
    });
};
