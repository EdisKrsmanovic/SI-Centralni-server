const userRepository = require('../repositories/userRepository')



exports.findUser = function findUser(email) {
    return userRepository.getUser(email);
}

exports.createUser = function createUser(user) {
    return userRepository.addUser(user);
}

exports.deleteUser = function deleteUser(email) {
    return userRepository.removeUser(email);
}

exports.editRole = function editRole(info) {
    return userRepository.updateUser(info);
}

exports.readUsers = function readUsers() {
    return userRepository.getUsers();
}