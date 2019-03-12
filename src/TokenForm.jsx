import React from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import styled from "styled-components";

const StyledDiv = styled.div`
  border: 3px solid #ececec;
  border-radius: 8px;
  text-align: left;
  margin: 1rem;
  padding: 1rem;
`;

const CreateTokenButton = styled.button`
  background-image: linear-gradient(
    to bottom right,
    red,
    orange,
    yellow,
    green,
    blue,
    indigo,
    violet
  );
  font-family: "Lucida Console", Monaco, monospace;
  font-weight: bold;
  font-size: 1rem;
  margin: 1rem;
`;

const TokenForm = ({ onSubmit, disabled }) => {
  const handleSubmit = (event, errors, values) => {
    if (errors.length === 0) {
      onSubmit(values);
    }
  };

  return (
    <StyledDiv>
      <AvForm onSubmit={handleSubmit}>
        <AvField
          name="tokenName"
          label="Token name"
          placeholder="Enter token name"
          helpMessage="E.g. TestCoin"
          type="text"
          errorMessage="Token name must contain between 1 and 20 letters, numbers or spaces"
          validate={{
            required: { value: true },
            pattern: { value: "^[a-zA-Z0-9 ]{1,20}$" },
            minLength: { value: 1 },
            maxLength: { value: 20 }
          }}
          disabled={disabled}
        />
        <AvField
          name="tokenSymbol"
          label="Token symbol"
          placeholder="Enter token symbol"
          helpMessage="E.g. TEST"
          type="text"
          errorMessage="Token symbol must contain between 2 and 10 letters or numbers"
          validate={{
            required: { value: true },
            pattern: { value: "^[a-zA-Z0-9]{2,10}$" },
            minLength: { value: 2 },
            maxLength: { value: 10 }
          }}
          disabled={disabled}
        />
        <AvField
          name="initialAmount"
          label="Initial amount"
          placeholder="Enter amount of initialy issued tokens"
          type="number"
          errorMessage="Amount must be an integer number between 1 and 1000000"
          validate={{
            number: { value: true },
            required: { value: true },
            min: { value: 1 },
            max: { value: 1000000 },
            pattern: { value: "^[0-9]{1,7}$" }
          }}
          disabled={disabled}
        />
        <CreateTokenButton key="create" type="submit" disabled={disabled}>
          Create Token!{" "}
          <span role="img" aria-label="to the moon">
            🚀🌙
          </span>
        </CreateTokenButton>
      </AvForm>
    </StyledDiv>
  );
};

export default TokenForm;
