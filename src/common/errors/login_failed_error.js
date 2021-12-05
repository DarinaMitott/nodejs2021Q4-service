
class LoginFailedError extends Error {
    constructor(props) {
        super(props);
        this.name = 'LoginFailedError';
    }

}

module.exports = LoginFailedError;
