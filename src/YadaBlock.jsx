import React, { useState } from "react";
import styled from "styled-components";
import TechnicalYadaYada from "./TechnicalYadaYada";

const ToggleYadaYada = styled.button`
  background-image: linear-gradient(to bottom right, orange, yellow);
  font-family: "Lucida Console", Monaco, monospace;
  font-weight: bold;
  font-size: 1rem;
  margin: 1rem;
`;

const YadaBlock = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <ToggleYadaYada key="toggleYada" onClick={() => setShowHelp(!showHelp)}>
        {showHelp ? "Hide Technical Yadayada" : "Show Technical Yadayada"}
      </ToggleYadaYada>
      {showHelp && <TechnicalYadaYada key="help" />}
    </>
  );
};

export default YadaBlock;
