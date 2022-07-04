const { ethers } = require("ethers");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/internal/helpers");
const { getConfigValue } = require('../migrations/config.js')

// Helper method for fetching environment variables from .env
function getEnvVariable(key, defaultValue) {
	if (process.env[key]) {
		return process.env[key];
	}
	if (!defaultValue) {
		throw `${key} is not defined and no default value was provided`;
	}
	return defaultValue;
}

// Helper method for fetching a connection provider to the Ethereum network
function getProvider() {
	const network = getEnvVariable("NETWORK", "hpx");
	let provider;

    if (network == "hpx") {
		provider = new ethers.providers.JsonRpcProvider({
			url: getEnvVariable("HPX_JSON_RPC_URL")
		});
	} else if (network == "rinkeby") {
		provider = ethers.getDefaultProvider("rinkeby", {
			alchemy: getEnvVariable("RINKEBY_ALCHEMY_KEY"),
		});
	} else if (network == "ropsten") {
		provider = ethers.getDefaultProvider("ropsten", {
			alchemy: getEnvVariable("ROPSTEN_ALCHEMY_KEY"),
		});
	}

	return provider;
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getAccount() {
	return new ethers.Wallet(getEnvVariable("ACCOUNT_PRIVATE_KEY"), getProvider());
}

// Helper method for fetching a contract instance at a given address
function getContract(hre, contractName) {
	const cName = getContractName(contractName);
	return getContractAt(hre, cName, getEnvVariable("CONTRACT_ADDRESS_"+cName), getAccount());
}

function getContractWyvernRegistry(hre, network) {
	return getContractAt(hre, 'WyvernRegistry', getConfigValue(network, 'WyvernRegistry'), getAccount());
}

// Helper method for fetching a current contract name
function getContractName(contractName) {
	return contractName || getEnvVariable("CURR_CONTRACT_NAME");
}

function csvToJSON(csv_string){
    const rows = csv_string.split("\r\n");
    const jsonArray = [];
    const header = rows[0].split(",");
    
    for(let i = 1; i < rows.length; i++) {
        let obj = {};
        let row = rows[i].split(",");

        for(let j=0; j < header.length; j++){
            obj[header[j]] = row[j];
        }

        jsonArray.push(obj);
    }

    return jsonArray;
    // 문자열 형태의 JSON으로 반환할 경우, 아래 코드 사용
    // return JSON.stringify(jsonArray);
}

module.exports = {
	getAccount,
	getContract,
	getContractWyvernRegistry,
	getContractName,
	getEnvVariable,
	getProvider,
	csvToJSON
}