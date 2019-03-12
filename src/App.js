import React, { useState, useEffect, useRef } from "react";
import logo from "./technology.jpg";
import "./App.css";
import Web3 from "web3";
import StandardERC20Token from "./contracts/StandardERC20Token.json";
import { PoseGroup } from "react-pose";
import YadaBlock from "./YadaBlock";
import Instructions from "./Instructions";
import TokenForm from "./TokenForm";
import StatusBox, { Steps } from "./StatusBox";
import Footer from "./Footer";

const web3Options = {
  transactionConfirmationBlocks: 1
};

const getEtherscanURL = networkId => {
  let networkPrefix;
  if (networkId === 1) {
    networkPrefix = "";
  } else if (networkId === 3) {
    networkPrefix = "ropsten.";
  } else if (networkId === 4) {
    networkPrefix = "rinkeby.";
  } else if (networkId === 42) {
    networkPrefix = "kovan.";
  } else {
    return null;
  }

  return {
    getTxURL: transactionHash =>
      `https://${networkPrefix}etherscan.io/tx/${transactionHash}`,
    getAddressURL: address =>
      `https://${networkPrefix}etherscan.io/address/${address}`
  };
};

const App = () => {
  const [web3, setWeb3] = useState();
  const [etherscanGetter, setEtherscanGetter] = useState();
  const [currentStep, setCurrentStep] = useState(Steps.WAITING);
  const [cancelled, setCancelled] = useState(false);
  const [data, setData] = useState({});
  const [transactionHash, setTransactionHash] = useState();
  const [contract, setContract] = useState();

  // Initialize web3 and get the user account
  const handleTokenCreation = async values => {
    setCurrentStep(Steps.DEPLOYING);
    try {
      // Ensure accounts are unlocked
      await Web3.givenProvider.enable();

      const _web3 = new Web3(Web3.givenProvider, null, web3Options);
      const accounts = await _web3.eth.getAccounts();
      setData({
        ownerAddress: accounts[0],
        token: {
          name: values.tokenName,
          symbol: values.tokenSymbol,
          decimals: 18,
          initialSupply: values.initialAmount.toString() + "0".repeat(18)
        }
      });
      setWeb3(_web3);
      const networkId = await _web3.eth.net.getId();
      setEtherscanGetter(getEtherscanURL(networkId));
    } catch (err) {
      // User didn't approve access for accounts
      setCancelled(true);
      console.log("User has cancelled account access permission");
    }
  };

  // Deploy the token contract
  useEffect(() => {
    if (!web3) {
      return;
    }
    handleTokenDeployment();
    return;
  }, [web3]);

  const handleTokenDeployment = async () => {
    const erc20 = new web3.eth.Contract(
      StandardERC20Token.abi,
      null,
      web3Options
    );

    try {
      const contract = await erc20
        .deploy({
          data: StandardERC20Token.bytecode,
          arguments: [
            data.token.name,
            data.token.symbol,
            data.token.decimals,
            data.ownerAddress,
            data.token.initialSupply
          ]
        })
        .send({ from: data.ownerAddress })
        .on("transactionHash", transactionHash => {
          setTransactionHash(transactionHash);
          setCurrentStep(Steps.BROADCASTING);
        });
      setContract(contract);
      setCurrentStep(Steps.DEPLOYED);
    } catch (err) {
      // User didn't approve contract creation
      setCancelled(true);
      console.log("User has cancelled token creation");
    }
  };

  const lastRef = useRef(null);
  useEffect(() => {
    if (lastRef.current) {
      lastRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>create-token-dapp</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <PoseGroup>
          <YadaBlock key="yada" />
          <Instructions key="info" />
          <TokenForm
            key="form"
            onSubmit={handleTokenCreation}
            disabled={currentStep > Steps.WAITING}
          />
          {currentStep >= Steps.DEPLOYING && (
            <StatusBox
              key="status"
              currentStep={currentStep}
              cancelled={cancelled}
              transactionHash={transactionHash}
              etherscanGetter={etherscanGetter}
              contractAddress={contract && contract.address}
              ownerAddress={data.ownerAddress}
            />
          )}
        </PoseGroup>
      </header>

      <div ref={lastRef} />
      <hr />
      <Footer />
    </div>
  );
};

export default App;
