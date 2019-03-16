import React from "react";
import styled from "styled-components";
import posed from "react-pose";
import Spinner from "react-spinkit";
import ExternalLink from "./ExternalLink";

export const Steps = {
  WAITING: 0,
  DEPLOYING: 1,
  BROADCASTING: 2,
  DEPLOYED: 3
};

const StyledDiv = styled.div`
  border: 1px solid black;
  margin: 20px;
  width: 70%;
  max-width: 50rem;
  padding: 1rem;
  font-family: "Lucida Console", Monaco, monospace;
  font-size: 1rem;
  text-align: left;
`;

const PosedMessage = posed.div({
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1 }
});

const ClippedMessage = styled(PosedMessage)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProgressMessage = ({ visible, children }) => {
  return (
    visible && (
      <ClippedMessage initialPose="hidden" pose="visible">
        {children}
      </ClippedMessage>
    )
  );
};

const StyledSpinner = styled(Spinner)`
  padding: 1rem;
  text-align: center;
`;

const StatusBox = ({
  currentStep,
  cancelled,
  transactionHash,
  etherscanGetter,
  contractAddress,
  ownerAddress
}) => (
  <StyledDiv key="status">
    <ProgressMessage visible={currentStep >= Steps.DEPLOYING}>
      Deploying ERC20 contract...
    </ProgressMessage>
    <ProgressMessage visible={currentStep >= Steps.DEPLOYING}>
      Asking for contract creation transaction signature and gas payment...
    </ProgressMessage>
    <ProgressMessage visible={currentStep >= Steps.BROADCASTING}>
      Broadcasting contract creation to the network...
    </ProgressMessage>
    <ProgressMessage visible={currentStep >= Steps.BROADCASTING}>
      Transaction broadcast: <strong>{transactionHash}</strong> [
      <ExternalLink
        href={etherscanGetter && etherscanGetter.getTxURL(transactionHash)}
      >
        see on etherescan
      </ExternalLink>
      ]
    </ProgressMessage>
    <ProgressMessage visible={currentStep >= Steps.BROADCASTING}>
      Waiting for transaction confirmation...
    </ProgressMessage>
    <ProgressMessage visible={currentStep >= Steps.DEPLOYED}>
      <span role="img" aria-label="kudos">
        🎉🎉🎉
      </span>
      <strong>FINISHED!!!</strong>
    </ProgressMessage>
    <ProgressMessage visible={currentStep >= Steps.DEPLOYED}>
      Contract has been created at: <strong>{contractAddress}</strong>{" "}
      &lt;&lt;&lt; THIS IS YOUR ERC20 CONTRACT, GIVE THIS ADDRESS TO YOUR
      USERS!!! [
      <ExternalLink
        href={
          contractAddress &&
          etherscanGetter &&
          etherscanGetter.getAddressURL(contractAddress)
        }
      >
        see on etherescan
      </ExternalLink>
      ]
    </ProgressMessage>
    <ProgressMessage visible={currentStep >= Steps.DEPLOYED}>
      Issued tokens address: <strong>{ownerAddress}</strong> &lt;&lt;&lt; THIS
      IS THE INITIAL OWNER OF ALL ISSUED TOKENS!!! [
      <ExternalLink
        href={
          ownerAddress &&
          etherscanGetter &&
          etherscanGetter.getAddressURL(ownerAddress)
        }
      >
        see on etherescan
      </ExternalLink>
      ]
    </ProgressMessage>
    <ProgressMessage visible={currentStep >= Steps.DEPLOYED}>
      [
      <ExternalLink
        href={
          contractAddress &&
          etherscanGetter &&
          etherscanGetter.getTokenURL(contractAddress)
        }
      >
        INSPECT ON TOKEN TRACKER
      </ExternalLink>
      ]
    </ProgressMessage>
    {!cancelled &&
      currentStep >= Steps.DEPLOYING &&
      currentStep < Steps.DEPLOYED && <StyledSpinner name="three-bounce" />}
    <ProgressMessage visible={cancelled}>
      <span role="img" aria-label="cancelled">
        ❌
      </span>{" "}
      <strong>
        Operation cancelled{" "}
        <span role="img" aria-label="sad">
          ☹️
        </span>
      </strong>
    </ProgressMessage>
  </StyledDiv>
);

export default StatusBox;
