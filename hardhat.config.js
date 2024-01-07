require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv").config();

const { PRIVATE_KEY, GOERLI_URL } = process.env;
module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./app/src/artifacts",
  },
};
