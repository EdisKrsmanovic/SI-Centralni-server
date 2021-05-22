const faDefintionRepository = require('../repositories/faDefintionRepository')


exports.createFaDefintion = function createFaDefintion(faDefintion) {
    return faDefintionRepository.addFaDefintion(faDefintion);
}

exports.deleteFaDefintion = function deleteFaDefintion(Naziv) {
    return faDefintionRepository.removeFaDefintion(Naziv);
}

exports.editFaDefintion = function editFaDefintion(faDefintion) {
    return faDefintionRepository.updateFaDefintion(faDefintion);
}

exports.readFaDefintions = function readFaDefintions() {
    return faDefintionRepository.getFaDefintions();
}