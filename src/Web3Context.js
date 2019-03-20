import { createContext, useContext } from "react";

const Web3Context = createContext();

const useWeb3 = () => useContext(Web3Context);

export { Web3Context, useWeb3 };
