import React from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
  text-align: left;

  ul {
    list-style-type: none;
    margin: 0rem;
  }

  ul > li:before {
    content: "✅ ";
    margin-left: -1.5rem;
  }
`;

const Instructions = () => (
  <StyledDiv>
    <ul>
      <li>Fill the information bellow</li>
      <li>Press "Create Token!" and pay for the gas</li>
      <li>Wait for the contract to be created on the blockchain</li>
      <li>
        Profit!{" "}
        <span role="img" aria-label="unicorn">
          🦄
        </span>
      </li>
    </ul>
  </StyledDiv>
);

export default Instructions;
