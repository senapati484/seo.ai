/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/check-contract.js
const path = require("path");
const fs = require("fs");

// Load environment variables manually to ensure we're getting the latest
const envPath = path.resolve(__dirname, "../.env.local");
console.log("Reading from:", envPath);

// Read the file directly
const envContent = fs.readFileSync(envPath, "utf8");
console.log("File content:", envContent);

// Parse the contract address manually
let contractAddress = null;
envContent.split("\n").forEach((line) => {
  if (line.startsWith("AVALANCHE_CONTRACT_ADDRESS=")) {
    contractAddress = line.split("=")[1].trim();
  }
});

console.log("Parsed contract address:", contractAddress);

if (!contractAddress) {
  console.error("❌ Could not find AVALANCHE_CONTRACT_ADDRESS in .env.local");
  process.exit(1);
}

const { ethers } = require("ethers");

async function checkContract() {
  try {
    const rpcUrl =
      process.env.AVALANCHE_RPC_URL ||
      "https://api.avax-test.network/ext/bc/C/rpc";

    console.log("🔍 Checking contract at:", contractAddress);
    console.log("🌐 Using RPC:", rpcUrl);

    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Check network
    const network = await provider.getNetwork();
    console.log(
      "📶 Network:",
      network.name,
      "(Chain ID:",
      network.chainId + ")"
    );

    // Check contract code
    const code = await provider.getCode(contractAddress);
    const hasCode = code && code !== "0x";

    console.log("📄 Contract code exists:", hasCode);
    console.log("📏 Code size:", code.length, "bytes");

    if (!hasCode) {
      console.log("❌ No contract found at this address");
      console.log("💡 Make sure:");
      console.log("   - The contract is deployed to the correct network");
      console.log("   - The address is correct");
      console.log("   - The deployment transaction was successful");

      // Check if the transaction was successful
      try {
        const txHash =
          "0x010dfad29f0dad45fd935198873eabbeb36abe66bf7f84485ae5eb508dd12bd5";
        const receipt = await provider.getTransactionReceipt(txHash);
        console.log(
          "📝 Deployment transaction status:",
          receipt ? "Success" : "Not found"
        );
        if (receipt) {
          console.log("   Block number:", receipt.blockNumber);
          console.log("   Contract address:", receipt.contractAddress);
        }
      } catch (txError) {
        console.log(
          "❌ Could not check deployment transaction:",
          txError.message
        );
      }
    } else {
      console.log("✅ Contract found!");
    }
  } catch (error) {
    console.error("❌ Error checking contract:", error.message);
  }
}

checkContract();
