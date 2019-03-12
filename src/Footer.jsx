import React from "react";
import styled from "styled-components";
import ExternalLink from "./ExternalLink";

const FooterDiv = styled.div`
  margin: 10px;
`;

const Footer = () => (
  <FooterDiv>
    © 2019 - Willian Mitsuda -{" "}
    <ExternalLink href="https://blog.decentralizing.me">
      check my blog
    </ExternalLink>
  </FooterDiv>
);

export default Footer;
