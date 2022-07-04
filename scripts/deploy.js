const { task } = require("hardhat/config");
const { getAccount, getContract, getContractWyvernRegistry, getContractName, getEnvVariable } = require("./helpers");
const { setConfig } = require('../migrations/config.js')

task("check-balance", "Prints out the balance of your account")
.setAction(async function (taskArgs, hre) {
	const [deployer] = await ethers.getSigners();
	console.log(`Account balance: ${(await deployer.getBalance()).toString()}`);
});

task("deploy", "Deploys the smart contract")
.addOptionalParam("name", "The contract name to create")
.addOptionalParam("param", "The parameter of contract constructor to create")
.setAction(async function (taskArgs, hre) {
	console.log(`Task deploy start. The contract name is ` + getContractName(taskArgs.name));

	let account = getAccount(taskArgs.name);
	let deployed;
	const contractFactory = await hre.ethers.getContractFactory(getContractName(taskArgs.name), account);
	
	if (!taskArgs.param) {
		deployed = await contractFactory.deploy(taskArgs.param);
	} else {
		deployed = await contractFactory.deploy();
	}
	
	console.log(`Contract deployed to address: ${deployed.address}`);
});

task("deployByJson", "Deploys the smart contract")
.addOptionalParam("name", "The contract name to create")
.addOptionalParam("param", "The parameter of contract constructor to create")
.setAction(async function (taskArgs, hre) {
	console.log(`Task deploy start. The contract name is ` + getContractName(taskArgs.name));

    const fs = require("fs");
	var data = fs.readFileSync(`./build/contracts/${taskArgs.name}.json`, 'utf8');
	var obj = JSON.parse(data);

	let account = getAccount(taskArgs.name);
	let deployed;
	const contractFactory = await hre.ethers.getContractFactory(obj.abi, obj.bytecode, account);
	const network = getEnvVariable("NETWORK", "hpx");
	
	if (taskArgs.name == 'WyvernExchange') {
		const chainIds = {
			development: 50,
			coverage: 50,
			hpx: 2023,
			rinkeby: 4,
			mumbai: 80001,
			main: 1
		};
		const personalSignPrefixes = {
			default: "\x19Ethereum Signed Message:\n",
			hpx: "\x19Hupayx Signed Message:\n",
			klaytn: "\x19Klaytn Signed Message:\n",
			baobab: "\x19Klaytn Signed Message:\n"
		};
		const personalSignPrefix = personalSignPrefixes[network] || personalSignPrefixes['default'];

		deployed = await contractFactory.deploy(chainIds[network], ['0x7B6252aF2154DcCe40Fd17EDff7428F6eba3c0B9', '0x7B6252aF2154DcCe40Fd17EDff7428F6eba3c0B9'], Buffer.from(personalSignPrefix,'binary'))

		const contract = await getContractWyvernRegistry(hre, network);
		const txResponse = await contract.grantInitialAuthentication(deployed.address);

		console.log(`Transaction Hash: ${txResponse.hash}`);
	} else if (!!taskArgs.param) {
		deployed = await contractFactory.deploy(taskArgs.param);
	} else {
		deployed = await contractFactory.deploy();
	}

	if (network !== 'development') {
		setConfig('deployed.' + network + '.' + taskArgs.name, deployed.address)
	}
	
	console.log(`Contract deployed to address: ${deployed.address}`);
});