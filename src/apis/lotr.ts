import { BaseError, ServiceError } from "../utils/errors"
import { stringify } from 'query-string';

/**
 * Client Configuration
 */
export interface LotrClientConfig {
    baseUrl: string
}

/**
 * Request options for the Lotr API
 */
export interface LotrClientOptions {
    // Pagination options
    limit?: number,
    page?: number,
    offset?: number,
    // Sort options
    sortKey?: string,
    sortOrder?: 'asc' | 'desc'
    // Todo: Add Filtering
}

/**
 * Client for the LOTR API
 */
export class LotrClient {
    private token;
    readonly config
    /**
     * Constructor
     * @param config Client config
     * @param token Auth Token
     */
    constructor(config: LotrClientConfig, token: string) {
        this.config = config
        this.token = token
    }

    /**
     * List of all movies, including the "The Lord of the Rings" and the "The Hobbit" trilogies
     * @param opts 
     * @returns 
     */
    async getAllMovies(opts?: LotrClientOptions) {
        const res = await this.fetch_(this.config.baseUrl, `movie?${stringify(opts)}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${this.token}`,
                'content-type': 'application/json',
            }
        });
        /** Extract Relevant information */
        const { docs, total } = res.respBody as { docs: unknown[]; total: number }
        return { docs, total }
    }

    /**
     * Request one specific movie
     * @param movieId 
     * @param opts 
     * @returns 
     */
    async getMovieById(movieId: string) {
        const res = await this.fetch_(this.config.baseUrl, `movie/${movieId}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${this.token}`,
                'content-type': 'application/json',
            }
        });

        /** Extract Relevant information */
        const { docs, total } = res.respBody as { docs: unknown[]; total: number }
        return { docs, total }
    }


    /**
     * Request all movie quotes for one specific movie 
     * (only working for the LotR trilogy)
     * @param movieId 
     * @param opts 
     * @returns 
     */
    async getQuotesFromMovie(movieId: string, opts?: LotrClientOptions) {
        const res = await this.fetch_(this.config.baseUrl, `movie/${movieId}/quote?${stringify(opts)}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${this.token}`,
                'content-type': 'application/json',
            }
        });
        /** Extract Relevant information */
        const { docs, total } = res.respBody as { docs: unknown[]; total: number }
        return { docs, total }
    }

    /**
     * Fetch Helper. 
     * Includes error management
     * @param baseUrl BaseUrl for the service
     * @param path Endpoint route
     * @param options 
     * @returns 
     */
    protected async fetch_(
        baseUrl: string,
        path: string,
        options: { method: string; body?: string; headers?: any }
    ): Promise<{
        respCode: number;
        respBody: unknown | unknown[];
        respHeaders: Record<string, unknown>;
    }> {
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

        // Output variables
        let respCode = 0;
        let respBody = null;
        let respHeaders: Headers = null;

        // Debugging
        const startTs = new Date();
        try {
            const res = await fetch(new URL(path, baseUrl).href, options);
            console.info(`Outbound Request: ${method} ${res.url} ${res.status}`);

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
                    resp: { respCode, respBody, respHeaders },
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
