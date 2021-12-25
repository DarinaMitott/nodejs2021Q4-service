export class PageNotFoundError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'PageNotFoundError'
    }
}