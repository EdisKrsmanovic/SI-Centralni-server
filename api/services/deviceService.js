const fadeviceRepository = require('../repositories/deviceRepository')

exports.readActiveNotActiveFadevice = function readActiveNotActiveFadevice(cb) {
    fadeviceRepository.getActiveNotActiveFadevice(cb);
}