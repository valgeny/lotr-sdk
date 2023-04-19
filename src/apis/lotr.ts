import AbortController from "abort-controller";
import { BaseError, ServiceError } from "../utils/errors"

export interface LotrClientConfig {
    baseUrl: string
}

export class LotrClient {
    private token;
    readonly config
    constructor(config: LotrClientConfig, token: string) {
        this.config = config
        this.token = token

    }


    async getAllMovies(opt: { limit: number, page: number, offset: number }) {
        let data
        const res = await this.fetch_(this.config.baseUrl, 'movie', {
            method: 'GET',
            headers: {
                authorization: `Bearer ${this.token}`,
                'content-type': 'application/json',
            }
        });
        console.log(res)
        return data
    }

    async getMovieById(movieId: string) {

    }

    async getQuotesFromMovie(movieId: string) {

    }

    async fetch_(
        baseUrl: string,
        path: string,
        options: { method: string; body?: string; headers?: any}
    ): Promise<any> {
        // Retrieve parameters
        const { method, body, headers } = options;

        // Merge options
        Object.assign(options,
            { method: method || 'GET' },
            { body: body || undefined },
            {
                /* Note: keys must be lowercase */
                headers: Object.assign(
                    {
                        credentials: 'include',
                        cache: 'no-cache',
                        'content-type': 'application/json',
                    },
                    Object.keys(headers).reduce((acc: Record<string, string>, key: string) => ({ ...acc, [key.toLowerCase()]: headers[key] }), {})
                )
            },
        )

        console.debug('Options', options)

        // Output variables
        let respCode = 0;
        let respBody = null;
        let respHeaders: Headers = null;

        // Debugging
        const startTs = new Date();
        try {
            const res = await fetch(new URL(path, baseUrl).href, options);
            console.info(`Outbound Request: ${method} ${res.url} ${res.status}`);
            console.log(res)
            // Extract Response
            respCode = res.status;
            if (respCode < 300) {
                respBody = await res.json();
                respHeaders = res.headers;
            } else if (respCode < 400) {
                respBody = null;
                respHeaders = res.headers;
            } else {
                respBody = await res.text();
                respHeaders = res.headers;
                throw new ServiceError('Http request failed with status:', null, {
                    req: { baseUrl, path, options },
                    resp: { respCode, respBody, respHeaders: Object.keys(respHeaders).reduce((a, x) => ({ ...a, [x]: respHeaders.get(x) }), {}) },
                    time: { startTs, endTs: new Date(), timeoutTs: null },
                });
            }
        } catch (e) {
            if (e instanceof ServiceError) {
                respCode = 0;
                throw e;
            } else if (e.name === 'AbortError') {
                respCode = -1;
                throw new BaseError('timeout-error', 'Timeout while trying to reach services', e, {
                    req: { baseUrl, path, options },
                    resp: undefined,
                    time: { startTs, endTs: null, timeoutTs: new Date() },
                });
            } else {
                respCode = 0;
                throw new BaseError('network-error', 'Error while trying to reach services', e, {
                    req: { baseUrl, path, options },
                    resp: undefined,
                    time: { startTs, endTs: new Date(), timeoutTs: null },
                });
            }
        }

        return {
            respCode,
            respBody,
            respHeaders: Object.keys(respHeaders).reduce((a, x) => ({ ...a, [x]: respHeaders.get(x) }), {}),
        };
    }
}
