export default class HttpClientException extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly responseData: unknown
    ) {
        super();
        this.name = 'HttpClientException';
    }
}
