
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
        const res = await fetch(`${this.config.baseUrl}/movies`. {
            method: 'GET' ,
            headers: { 
                authorization: `Bearer ${this.token}`,
                'content-type': 'application/json',
            }
        });
        if (res.ok) {
            data = await res.json();
            console.log(data);
        }
        return data
    }

    async getMovieById(movieId: string) {

    }

    async getQuotesFromMovie(movieId: string) {

    }


}