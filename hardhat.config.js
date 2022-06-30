require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

const { HPX_JSON_RPC_URL } = process.env;

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
};