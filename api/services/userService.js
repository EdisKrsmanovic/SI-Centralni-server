const userRepository = require('../repositories/userRepository')



exports.findUser = function findUser(email, cb) {
    return userRepository.getUser(email, cb);
}

exports.createUser = function createUser(user, cb) {
    return userRepository.addUser(user, cb);
}

exports.deleteUser = function deleteUser(email, cb) {
    return userRepository.removeUser(email, cb);
}

exports.editRole = function editRole(info, cb) {
    return userRepository.updateUser(info, cb);
}

exports.readUsers = function readUsers(cb) {
    return userRepository.getUsers(cb);
}

exports.readUser = function readUser(id, cb) {
    return userRepository.getUserById(id, cb);
}

exports.editUser = function editUser(info, cb) {
    return userRepository.updateUserInfo(info, cb);
}

exports.editUserEmail = function editUserEmail(info,cb){
    return userRepository.updateUserEmail(info,cb);
}

exports.editUserPassword = function editUserPassword(info,cb){
    return userRepository.updateUserPassword(info,cb);
}