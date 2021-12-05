const tasks = [];

const unassignUser = async (userId) => {
    for (const task of tasks) {
        if (task.userId === userId) {
            task.userId = null;
        }
    }
}

module.exports = {
    unassignUser,
}
