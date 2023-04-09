import "./App.css";
import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import { ReadContracts, WriteContracts } from "./Blockchain/polygon";

const App = () => {
  const [account, setAccount] = useState(null);
  const [currentFlagHolder, setCurrentFlagHolder] = useState({
    previousHolder: "",
    currentHolder: "",
  });

  useEffect(() => {
    HandleCaptureEmittedEvent();
    console.log(currentFlagHolder);
  }, [currentFlagHolder]);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0]);
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const captureFlag = async () => {
    const captureButton = document.querySelector(".capture-button");
    try {
      if (window.ethereum) {
        if (!account) {
          alert("Please connect your wallet first");
          return;
        }
        console.log("Triggering transaction...");

        console.log(WriteContracts);

        // show loading animation
        captureButton.disabled = true;
        captureButton.innerHTML = "Capturing";

        const tx = await WriteContracts.captureTheFlag();
        await tx.wait(1);
        console.log(tx);

        // hide loading animation and show success message
        captureButton.disabled = false;
        captureButton.innerHTML = "CAPTURE THE FLAG";
        alert(`Transaction successful! Tx Hash: ${tx.hash}`);
        HandleCaptureEmittedEvent();
      }
    } catch (error) {
      console.log(error);

      // hide loading animation and show error message
      captureButton.disabled = false;
      captureButton.innerHTML = "CAPTURE THE FLAG";
      alert(`Transaction failed! Error: ${error}`);
    }
  };

  const ConnectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      setAccount(accounts[0]);
    }
  };

  const DisconnectWallet = async () => {
    if (window.ethereum) {
      if (account) {
        setAccount(null);
      }
    }
  };

  const HandleCaptureEmittedEvent = async () => {
    if (window.ethereum) {
      const catchEmit = WriteContracts.on(
        "FlagCaptured",
        (previousHolder, currentHolder) => {
          setCurrentFlagHolder({ previousHolder, currentHolder });
          console.log(previousHolder, currentHolder);
        }
      );

      console.log(catchEmit);
    }
  };

  return (
    <div className="App">
      <header>
        <p>
          <span>
            <h1>CAPTURE THE FLAG</h1>
          </span>
          <br />
          Gas Station Network (Gasless Transaction)
        </p>

        <button
          className="connect-button"
          onClick={account ? DisconnectWallet : ConnectWallet}
        >
          {account ? `Disconnect` : "Connect"}
        </button>
      </header>
      <main>
        <p className="ac">{account ? `Connected Address: ${account}` : ""}</p>
        <button className="capture-button" onClick={captureFlag}>
          CAPTURE THE FLAG
        </button>
        <table className="flag-table">
          <thead>
            <tr>
              <th>Previous Holder</th>
              <th>Current Holder</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {currentFlagHolder ? currentFlagHolder.previousHolder : ""}
              </td>
              <td>
                {currentFlagHolder ? currentFlagHolder.currentHolder : ""}
              </td>
            </tr>
          </tbody>
        </table>
        <i>Note: This contract is using accept everything paymaster</i>
      </main>
      <footer>
        <p>
          <a
            href="https://docs.opengsn.org/networks/polygon/mumbai.html"
            target="_blank"
          >
            Gas Station Network
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
