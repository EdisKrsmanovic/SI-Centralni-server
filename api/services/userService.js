const userRepository = require('../repositories/userRepository')



exports.findUser = function findUser(email) {
    return userRepository.getUser(email);
}
