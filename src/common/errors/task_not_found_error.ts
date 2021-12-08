export class TaskNotFoundError extends Error {
    constructor() {
        super();
        this.name = 'TaskNotFoundError';
    }
}

