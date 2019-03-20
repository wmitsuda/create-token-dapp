import { createContext, useContext } from "react";

const Web3Context = createContext();

const useWeb3 = () => useContext(Web3Context);

const networkPrefixes = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  42: "kovan."
};

const getEtherscanURL = networkId => {
  let networkPrefix = networkPrefixes[networkId];
  if (!networkPrefix) {
    return null;
  }

  return {
    getTxURL: transactionHash =>
      `https://${networkPrefix}etherscan.io/tx/${transactionHash}`,
    getAddressURL: address =>
      `https://${networkPrefix}etherscan.io/address/${address}`,
    getTokenURL: address =>
      `https://${networkPrefix}etherscan.io/token/${address}`
  };
};

export { Web3Context, useWeb3, getEtherscanURL };
