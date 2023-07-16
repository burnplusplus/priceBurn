const express = require("express");
const app = express();
const port = 3001;
const Moralis = require("moralis").default;
const cors = require("cors");
const { EvmChain } = require("@moralisweb3/common-evm-utils");
require("dotenv").config({ path: ".env" });

app.use(cors());
app.use(express.json());

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

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


Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(async () => {
  const chain = EvmChain.BSC
  
  app.listen(port, "0.0.0.0", () => {
    console.log(`Listening for API Calls`);
  });
});









