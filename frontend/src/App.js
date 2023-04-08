import "./App.css";
import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import { ReadContracts, WriteContracts } from "./Blockchain/polygon";

const App = () => {
  const [account, setAccount] = useState(null);
  const [currentFlagHolder, setCurrentFlagHolder] = useState(null);

  useEffect(() => {
    readCurrentHolder();
    // console.log(signer);
  }, []);

  const contractTest = async () => {
    if (window.ethereum) {
      console.log(account);
    }
  };

  const captureFlag = async () => {
    try {
      if (window.ethereum) {
        console.log("Triggered");
        const tx = await WriteContracts.captureTheFlag();
        await tx.wait(1);
        console.log(tx);
        alert(`Transaction successful! Tx Hash: ${tx.hash}`);
      }
    } catch (error) {
      console.log(error);
      alert(`Transaction failed! Error: ${error}`);
    }
  };

  const readCurrentHolder = async () => {
    try {
      if (window.ethereum) {
        const currentHolder = await ReadContracts.currentHolder();
        console.log(currentHolder);
        setCurrentFlagHolder(currentHolder);
      }
    } catch (error) {
      console.log(error);
      alert(`Transaction failed! Error: ${error}`);
    }
  };

  const ConnectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    }
  };

  return (
    <div>
      {!account ? (
        <button onClick={ConnectWallet}>Connect Wallet</button>
      ) : (
        <p>{account}</p>
      )}
      <button onClick={contractTest}>Test Contract Integration</button>
      <button onClick={captureFlag}>Caputre Flag</button>
      <h1>Current Holder</h1>
      <p>{currentFlagHolder}</p>
      HIIIIIIIII
    </div>
  );
};

export default App;
