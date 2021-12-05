class TaskNotFoundError extends Error {
    constructor(props) {
        super(props);
        this.name = 'TaskNotFoundError';
    }
}

module.exports = TaskNotFoundError;
