
class UserNotFoundError extends Error {
    constructor(props) {
        super(props);
        this.name = 'UserNotFoundError';
    }
}

module.exports = UserNotFoundError;
