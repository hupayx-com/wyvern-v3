require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("./scripts/deploy.js");

const { HPX_JSON_RPC_URL } = process.env;
console.log(HPX_JSON_RPC_URL);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "hpx",
  networks: {
   hpx: {
     url: `${HPX_JSON_RPC_URL}`
   }
  }
};