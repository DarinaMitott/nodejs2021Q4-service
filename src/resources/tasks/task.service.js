const taskRepo = require('./task.memory.repository');

const unassignUser = (userId) => taskRepo.unassignUser(userId)


module.exports = {
    unassignUser,
}
