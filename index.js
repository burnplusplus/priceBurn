const express = require("express");
const request = require("request");
const app = express();
const port = 8080;
const Moralis = require("moralis").default;
const cors = require("cors");
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const abi = require("./abi.json");

require("dotenv").config({ path: ".env" });

app.use(cors());
app.use(express.json());

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const BSC_API_KEY = process.env.BSC_API_KEY;

async function getEthPrice() {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: "0xe6282d11442d33865907C8029ad362B6B203C3a2",
      chain: "0x38",
    });

    console.log(`ETH price: ${response.price}`);
  } catch (e) {
    console.log(`Something went wrong: ${e}`);
  }
}

app.get("/getethprice", async (req, res) => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: "0xe6282d11442d33865907C8029ad362B6B203C3a2",
      chain: "0x38",
    });

    return res.status(200).json(response);
  } catch (e) {
    console.log(`Something went wrong: ${e}`);
    return res.status(400).json();
  }
});

app.get("/address", async (req, res) => {
  try {
    const { query } = req;
    const chain = "0x38";

    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      address: query.address,
      chain: 0x38,
    });

    return res.status(200).json(response);
  } catch (e) {
    console.log(`Something went wrong: ${e}`);
    return res.status(400).json();
  }
});



app.get("/contract-price", async (req, res) => {
  try {
    const token_contract_address = "0xda2c0cdf7d764f8c587380cadf7129e5ecb7efb7";
    const url = `https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${token_contract_address}&apikey=${BSC_API_KEY}`;

    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const total_supply = parseInt(JSON.parse(body).result);
        const price = 10; // Defina o preço do contrato aqui

        const contractInfo = {
          contractAddress: token_contract_address,
          totalSupply: total_supply,
          price: price,
        };

        return res.status(200).json(contractInfo);
      } else {
        return res.status(500).json({ error: "Failed to fetch contract information" });
      }
    });
  } catch (e) {
    console.log(`Something went wrong: ${e}`);
    return res.status(400).json();
  }
});



Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(async () => {
  const chain = EvmChain.BSC;
  const address = "0x4951B6Cac448EE3732921DEbF5018C2AA074264a";
  const functionName = "stakingTokenBalance";

  stakingBalance = await Moralis.EvmApi.utils.runContractFunction({
    address,
    functionName,
    abi,
    chain,
  });

  console.log(`Staking balance: ${stakingBalance.result}`);

  app.listen(port, "0.0.0.0", () => {
    console.log(`Listening for API Calls`);
  });
});
