import React, { useState, useEffect, useRef } from "react";
import logo from "./technology.jpg";
import "./App.css";
import Web3 from "web3";
import StandardERC20Token from "./contracts/StandardERC20Token.json";
import GithubCorner from "react-github-corner";
import { PoseGroup } from "react-pose";
import YadaBlock from "./YadaBlock";
import Instructions from "./Instructions";
import TokenForm from "./TokenForm";
import StatusBox, { Steps } from "./StatusBox";
import Footer from "./Footer";
import styled from "styled-components";

const StartButton = styled.button`
  background-image: linear-gradient(to bottom right, green, yellow);
  margin: 1rem;
`;

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
      `https://${networkPrefix}etherscan.io/address/${address}`,
    getTokenURL: address =>
      `https://${networkPrefix}etherscan.io/token/${address}`
  };
};

const App = () => {
  const [web3, setWeb3] = useState();
  const [defaultAccount, setDefaultAccount] = useState();
  const [etherscanGetter, setEtherscanGetter] = useState();
  const [currentStep, setCurrentStep] = useState(Steps.WAITING);
  const [cancelled, setCancelled] = useState(false);
  const [data, setData] = useState();
  const [transactionHash, setTransactionHash] = useState();
  const [contract, setContract] = useState();

  const initializeWeb3 = async () => {
    try {
      // Ensure accounts are unlocked
      await Web3.givenProvider.enable();
    } catch (err) {
      // User didn't approve access for accounts
      console.log("User has cancelled account access permission");
    }

    const _web3 = new Web3(Web3.givenProvider, null, web3Options);
    const accounts = await _web3.eth.getAccounts();
    setDefaultAccount(accounts[0]);
    const networkId = await _web3.eth.net.getId();
    setEtherscanGetter(getEtherscanURL(networkId));
    setWeb3(_web3);
  };

  const handleTokenCreation = async values => {
    setCurrentStep(Steps.DEPLOYING);

    const _data = {
      name: values.tokenName.trim(),
      symbol: values.tokenSymbol.trim(),
      decimals: 18,
      initialSupply: values.initialAmount.toString() + "0".repeat(18),
      ownerAddress: values.initialOwner
    };
    setData(_data);

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
            _data.name,
            _data.symbol,
            _data.decimals,
            _data.ownerAddress,
            _data.initialSupply
          ]
        })
        .send({ from: defaultAccount })
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
      <GithubCorner href="https://github.com/wmitsuda/create-token-dapp" />
      <header className="App-header">
        <h1>create-token-dapp</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <YadaBlock key="yada" />
        <Instructions key="info" />
        {web3 ? (
          <TokenForm
            key="form"
            onSubmit={handleTokenCreation}
            disabled={currentStep > Steps.WAITING}
            initialOwner={defaultAccount}
          />
        ) : (
          <StartButton key="begin" onClick={initializeWeb3}>
            Begin!
          </StartButton>
        )}
        <PoseGroup>
          {currentStep >= Steps.DEPLOYING && (
            <React.Fragment key="status">
              <StatusBox
                currentStep={currentStep}
                cancelled={cancelled}
                transactionHash={transactionHash}
                etherscanGetter={etherscanGetter}
                contractAddress={contract && contract.options.address}
                ownerAddress={data && data.ownerAddress}
              />
              <div ref={lastRef} />
            </React.Fragment>
          )}
        </PoseGroup>
      </header>

      <hr />
      <Footer />
    </div>
  );
};

export default App;
