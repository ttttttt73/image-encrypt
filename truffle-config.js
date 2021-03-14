const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "react-flask-app/src/contracts"),
  networks: {
    develop: {
      port: 9545,
      gas: 47000000
    }
  }
};
