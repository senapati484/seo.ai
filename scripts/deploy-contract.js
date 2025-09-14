/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/deploy-contract.js
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });
const { ethers } = require("ethers");
const fs = require("fs");
const solc = require("solc"); // We need to install and use solc to compile the contract

async function deployContract() {
  try {
    const rpcUrl =
      process.env.AVALANCHE_RPC_URL ||
      "https://api.avax-test.network/ext/bc/C/rpc";
    const privateKey = process.env.AVALANCHE_PRIVATE_KEY;

    if (!privateKey) {
      console.error("❌ AVALANCHE_PRIVATE_KEY is not set");
      return;
    }

    console.log("🚀 Deploying contract to Fuji Testnet...");

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Wallet balance:", ethers.formatEther(balance), "AVAX");

    if (balance === 0n) {
      console.log(
        "❌ Wallet has no funds. Get test AVAX from: https://faucet.avax.network/"
      );
      return;
    }

    // Contract source
    const contractSource = `
      // SPDX-License-Identifier: MIT
      pragma solidity ^0.8.0;
      
      contract ReportVerification {
          mapping(string => uint256) private reportTimestamps;
          
          event ReportStored(string indexed reportHash, uint256 timestamp);
          
          function storeReport(string memory _reportHash) public {
              require(reportTimestamps[_reportHash] == 0, "Report already stored");
              reportTimestamps[_reportHash] = block.timestamp;
              emit ReportStored(_reportHash, block.timestamp);
          }
          
          function verifyReport(string memory _reportHash) public view returns (uint256) {
              return reportTimestamps[_reportHash];
          }
      }
    `;

    // Compile the contract
    console.log("🔨 Compiling contract...");

    const input = {
      language: "Solidity",
      sources: {
        "ReportVerification.sol": {
          content: contractSource,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
      output.errors.forEach((error) =>
        console.error("❌ Compilation error:", error.formattedMessage)
      );
      throw new Error("Contract compilation failed");
    }

    const contractName = "ReportVerification";
    const contract = output.contracts["ReportVerification.sol"][contractName];
    const bytecode = contract.evm.bytecode.object;
    const abi = contract.abi;

    // Deploy the contract
    console.log("⏳ Deploying contract...");

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const deployedContract = await factory.deploy();

    console.log(
      "📝 Transaction hash:",
      deployedContract.deploymentTransaction().hash
    );
    console.log("⏳ Waiting for deployment to complete...");

    await deployedContract.waitForDeployment();

    const address = await deployedContract.getAddress();
    console.log("✅ Contract deployed to:", address);

    // Save to environment file
    const envFile = path.resolve(__dirname, "../.env.local");
    let envContent = fs.existsSync(envFile)
      ? fs.readFileSync(envFile, "utf8")
      : "";

    // Remove existing contract address
    envContent = envContent.replace(/AVALANCHE_CONTRACT_ADDRESS=.*\n/g, "");

    // Add new contract address
    envContent += `AVALANCHE_CONTRACT_ADDRESS=${address}\n`;

    fs.writeFileSync(envFile, envContent);
    console.log("📁 Updated .env.local with new contract address");
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
  }
}

// Install solc first if not already installed
if (!require.resolve("solc")) {
  console.log("❌ Please install solc first: npm install solc");
  process.exit(1);
}

deployContract();
