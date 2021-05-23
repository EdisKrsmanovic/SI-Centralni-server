const faDefintionRepository = require('../repositories/faDefintionRepository')


exports.createFaDefintion = function createFaDefintion(faDefintion, cb) {
    faDefintionRepository.addFaDefintion(faDefintion, cb);
}

exports.deleteFaDefintion = function deleteFaDefintion(id, cb) {
    return faDefintionRepository.removeFaDefintion(id, cb);
}

exports.editFaDefintion = function editFaDefintion(faDefinition, cb) {
    return faDefintionRepository.updateFaDefintion(faDefinition, cb);
}

exports.readFaDefinitions = function readFaDefinitions(cb) {
    return faDefintionRepository.getFaDefinitions(cb);
}
