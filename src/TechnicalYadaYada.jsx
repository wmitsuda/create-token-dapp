import React from "react";
import posed from "react-pose";
import styled from "styled-components";
import ExternalLink from "./ExternalLink";

const PosedDiv = posed.div({
  enter: { x: 0, opacity: 1, duration: 3000 },
  exit: { x: -1000, opacity: 0, duration: 10 }
});

const StyledDiv = styled(PosedDiv)`
  font-family: "Lucida Console", Monaco, monospace;
  font-size: 1rem;
  text-align: left;
  border: 2px solid black;
  border-radius: 5px;
  margin: 20px;
  padding: 10px;
  max-width: 800px;

  & > h3 {
    text-align: center;
    font-size: 1.25rem;
  }
  & > ul > li:before {
    content: "🛠";
    margin-left: -1.5rem;
  }
  & > ul {
    list-style-type: none;
  }
`;

const TechnicalYadaYada = props => (
  <div>
    <StyledDiv {...props}>
      <h3>Technical yadayada:</h3>
      <ul>
        <li>
          This Dapp will deploy an ERC20 smart contract on ethereum blockchain
          for you.
        </li>
        <li>
          The deployed ERC20 token contract is based on source code of
          openzeppelin-solidity 2.1.3, more precisely the ERC20 and the
          ERC20Detailed contracts.
        </li>
        <li>
          The total supply will be minted on contract constructor and assigned
          to the specified address (by default, the default account).
        </li>
        <li>
          The contract is <strong>NOT</strong> upgradable, it does{" "}
          <strong>NOT</strong> use openzeppelin-eth (yet).
        </li>
        <li>
          The contract source code can be seem{" "}
          <ExternalLink href="https://github.com/wmitsuda/erc20-token-contract">
            here
          </ExternalLink>
          .
        </li>
        <li>
          The token is generated with 18 decimals, no minters, no pausers.
        </li>
      </ul>
    </StyledDiv>
  </div>
);

export default TechnicalYadaYada;
