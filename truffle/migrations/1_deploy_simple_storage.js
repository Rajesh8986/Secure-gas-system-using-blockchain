const SecureGasSystem = artifacts.require("SecureGasSystem");

module.exports = function (deployer) {
  deployer.deploy(SecureGasSystem);
};
