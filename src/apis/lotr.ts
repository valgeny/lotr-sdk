
interface LotrApiConfig {
    baseUrl: string
}

class LotrApi {
    private token;
    readonly config
    constructor(config: LotrApiConfig, token: string) {
        this.config = config
        this.token = token

    }


    async getAllMovies(opt: { limit: number, page: number, offset: number }) {
        const res = await fetch(`${this.config.baseUrl}/movies`);
        if (res.ok) {
            const data = await res.json();
            console.log(data);
        }
    }

    async getMovieById(movieId: string) {

    }

    async getQuotesFromMovie(movieId: string) {

    }


}