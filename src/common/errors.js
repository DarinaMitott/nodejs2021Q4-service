
class LoginFailedError extends Error {
    constructor(props) {
        super(props);
        this.name = 'LoginFailedError';
    }

}


class UserNotFoundError extends Error {
    constructor(props) {
        super(props);
        this.name = 'UserNotFoundError';
    }
}

module.exports = {
    LoginFailedError,
    UserNotFoundError,
}
