import React, { useState, useEffect, useRef } from "react";
import logo from "./technology.jpg";
import "./App.css";
import Web3 from "web3";
import { Web3Context } from "./Web3Context";
import StandardERC20Token from "./contracts/StandardERC20Token.json";
import GithubCorner from "react-github-corner";
import { PoseGroup } from "react-pose";
import YadaBlock from "./YadaBlock";
import Instructions from "./Instructions";
import TokenForm from "./TokenForm";
import StatusBox, { Steps } from "./StatusBox";
import Footer from "./Footer";
import styled from "styled-components";
import { ethers } from "ethers";

const StartButton = styled.button`
  background-image: linear-gradient(to bottom right, green, yellow);
  margin: 1rem;
`;

const web3Options = {
  transactionConfirmationBlocks: 1
};

const App = () => {
  const [web3, setWeb3] = useState();
  const [provider, setProvider] = useState();
  const [defaultAccount, setDefaultAccount] = useState();
  const [networkId, setNetworkId] = useState();
  const [currentStep, setCurrentStep] = useState(Steps.WAITING);
  const [cancelled, setCancelled] = useState(false);
  const [data, setData] = useState();
  const [transactionHash, setTransactionHash] = useState();
  const [contract, setContract] = useState();

  const initializeWeb3 = async () => {
    try {
      // Ensure accounts are unlocked
      const accounts = await Web3.givenProvider.enable();
      setDefaultAccount(accounts[0]);
    } catch (err) {
      // User didn't approve access for accounts
      console.log("User has cancelled account access permission");
    }

    const _web3 = new Web3(Web3.givenProvider, null, web3Options);
    setNetworkId(await _web3.eth.net.getId());
    const _provider = new ethers.providers.Web3Provider(Web3.givenProvider);
    setWeb3(_web3);
    setProvider(_provider);
  };

  const handleTokenCreation = async values => {
    setCurrentStep(Steps.DEPLOYING);

    // Initial owner may be a raw ethereum address or ENS name
    let initialOwner = values.initialOwner;
    if (!web3.utils.isAddress(initialOwner)) {
      initialOwner = await provider.resolveName(initialOwner);
    }

    const _data = {
      name: values.tokenName.trim(),
      symbol: values.tokenSymbol.trim(),
      decimals: 18,
      initialSupply: values.initialAmount.toString() + "0".repeat(18),
      ownerAddress: initialOwner
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
      console.log(
        "User has cancelled token creation or some unknown error happened..."
      );
      console.log(err);
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
          <Web3Context.Provider value={{ web3, provider }}>
            <TokenForm
              key="form"
              onSubmit={handleTokenCreation}
              disabled={currentStep > Steps.WAITING}
              initialOwner={defaultAccount}
            />
          </Web3Context.Provider>
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
                networkId={networkId}
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
