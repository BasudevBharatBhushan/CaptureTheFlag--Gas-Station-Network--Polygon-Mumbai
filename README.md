# CaptureTheFlag--Gas-Station-Network--Polygon-Mumbai

## Contract Addresses

- CaptureTheFlag - [0x164e7eC02DCF25CF6c8a1DfEA5fB4e7f16b6c112](https://mumbai.polygonscan.com/address/0x164e7ec02dcf25cf6c8a1dfea5fb4e7f16b6c112)
- WhitelistPaymaster - [0xc5D5d8F0ea82888e35FB573Ba9403cDe1C87C45b](https://mumbai.polygonscan.com/address/0xc5D5d8F0ea82888e35FB573Ba9403cDe1C87C45b)

## Default Contracts Used (Polygon Mumbai)

- FORWARDER_CONTRACT_ADDRESS = [0xB2b5841DBeF766d4b521221732F9B618fCf34A87](https://mumbai.polygonscan.com/address/0xB2b5841DBeF766d4b521221732F9B618fCf34A87)
- RELAY_HUB_CONTRACT_ADDRESS = [0x3232f21A6E08312654270c78A773f00dd61d60f5](https://mumbai.polygonscan.com/address/0x3232f21A6E08312654270c78A773f00dd61d60f5)

## Transaction Hash of funding Relay Hub

Link - https://mumbai.polygonscan.com/tx/0xadf02fbecfd540e5a3653ff01d520a95c76dbb3845201c42cf64c9cba84b2e88

## Steps to convert your regular smart contract to GSN Smart Contract

Step 1: Install following dependencies

```
yarn add @opengsn/cli
yarn add @opengsn/contracts
yarn add @opengsn/paymasters
yarn add @opengsn/provider

```

Step 2: Update the IRelayHub.sol  
Visit node_modules/@opengsn/contracts/src/interfaces/IRelayHub.sol  
And updated the relayCall function

Correct

```
    function relayCall(
        string calldata domainSeparatorName,
        uint256 maxAcceptanceBudget,
        GsnTypes.RelayRequest calldata relayRequest,
        bytes calldata signature,
        bytes calldata approvalData
    )
```

Outdated

```
    function relayCall(
        uint256 maxAcceptanceBudget,
        GsnTypes.RelayRequest calldata relayRequest,
        bytes calldata signature,
        bytes calldata approvalData
    )
```

Step 2: Changes in Smart Contract

```
import "@opengsn/contracts/src/ERC2771Recipient.sol";
contract CaptureTheFlag is ERC2771Recipient {
        constructor(address forwarder) {
        _setTrustedForwarder(forwarder);
    }
    //Smart Contract Functions
}
```

- Relace msg.sender to \_msgSender & msg.value to \_msgValue

Step 3: If you want to setup a whitelist paymaster

- Create import.sol

```
/**
 * SPDX-License-Identifier:MIT
 */

pragma solidity ^0.8.7;

import "@opengsn/paymasters/contracts/WhitelistPaymaster.sol";
// import "@opengsn/contracts/src/RelayHub.sol";

```

Step 4: Setup .env file for Contract backend

```
MUMBAI_RPC_URL = <Your RPC URL>
PRIVATE_KEY = <Your Private Key>
FORWARDER_CONTRACT_ADDRESS = 0xB2b5841DBeF766d4b521221732F9B618fCf34A87
RELAY_HUB_CONTRACT_ADDRESS = 0x3232f21A6E08312654270c78A773f00dd61d60f5
POLYGON_API_KEY = <API Key to verify Contract>

```

Step 5: Deploy both the smart contract
eg. Given in the repo  
To Deploy run this command  
`yarn hardhat deploy --tags all --network mumbai`

Step 6: Verify the Smart Contracts
`yarn hardhat verify --network mumbai <Contract Address> "<Constructor Argument>"`

Step 7: Run the Following Script to Set Forwarder, WhitelistSender & Relay

```
const { ethers } = require("hardhat")
const IRelayHub = require("../artifacts/@opengsn/contracts/src/interfaces/IRelayHub.sol/IRelayHub.json")

async function main() {
    console.log("---------------------------------------------------")
    const whitelistPaymaster = await ethers.getContract("WhitelistPaymaster")

    // Set Forwarder
    const setForwarder = await whitelistPaymaster.setTrustedForwarder(
        process.env.FORWARDER_CONTRACT_ADDRESS
    )
    await setForwarder.wait(1)

    console.log(setForwarder)

    //Set Whitelist Configuration
    const setConfiguration = await whitelistPaymaster.setConfiguration(true, false, false, false)
    await setConfiguration.wait(1)

    console.log(setConfiguration)

    //Set Whitelist Sender
    const setWhitelistSender = await whitelistPaymaster.whitelistSender(
        "0x85b3dB26424a88e7C1319E40a6324d64Acf1fFA2",
        true
    )
    await setWhitelistSender.wait(1)
    console.log(setWhitelistSender)

    //Set Relay Hub
    const setRelayHub = await whitelistPaymaster.setRelayHub(process.env.RELAY_HUB_CONTRACT_ADDRESS)

    await setRelayHub.wait(1)

    console.log(setRelayHub)

    //Fund Relay Hub

    /*
        Fund the relay hub by visiting to this link
        Link - https://mumbai.polygonscan.com/address/0x3232f21A6E08312654270c78A773f00dd61d60f5#writeContract#F2
    */
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

```

Command to Run  
`yarn hardhat run scripts/setForwarder_N_Relay.js --network mumbai`

---

## Setup Provider to use in Frontend

Step 1: Add the following dependencies in package.json and run " `yarn` "

```
    "@opengsn/cli": "^3.0.0-beta.6",
    "@opengsn/contracts": "^3.0.0-beta.6",
    "@opengsn/provider": "^3.0.0-beta.6",
```

Step 2. Setup .env file for Frontend

```
REACT_APP_ACCEPT_EVERYTHING_PAYMASTER= 0x086c11bd5A61ac480b326916656a33c474d1E4d8
REACT_APP_CAPTURE_THE_FLAG_CONTRACT_ADDRESS = 0x8bf1aa01c29b283fb5a036ce687f36c8ae7f0901
REACT_APP_WHITELIST_PAYMASTER_ADDRESS = 0xc5d5d8f0ea82888e35fb573ba9403cde1c87c45b


```

Step 3: Setup GSN Provider

```
import { ethers, BigNumber } from "ethers";
import CaptureTheFlag from "../artifacts/contracts/CaptureTheFlag.sol/CaptureTheFlag.json";

import { RelayProvider } from "@opengsn/provider";

const WhitelistPaymasterAddress = process.env.WHITELIST_PAYMASTER_ADDRESS;
const AcceptEverythingPaymaster = process.env.ACCEPT_EVERYTHING_PAYMASTER;

const CAPTURE_THE_FLAG_CONTRACT_ADDRESS =
  process.env.CAPTURE_THE_FLAG_CONTRACT_ADDRESS;

const baseProvider = new ethers.providers.Web3Provider(window.ethereum);

const gsnConfig = {
  paymasterAddress: AcceptEverythingPaymaster,
  // paymasterAddress: WhitelistPaymasterAddress,
};

const gsnProvider = RelayProvider.newProvider({
  provider: window.ethereum,
  config: gsnConfig,
});
await gsnProvider.init();

const etherProvider = new ethers.providers.Web3Provider(gsnProvider);

export const signer = etherProvider.getSigner();

export const ReadContracts = new ethers.Contract(
  CAPTURE_THE_FLAG_CONTRACT_ADDRESS,
  CaptureTheFlag.abi,
  etherProvider
);

export const WriteContracts = new ethers.Contract(
  CAPTURE_THE_FLAG_CONTRACT_ADDRESS,
  CaptureTheFlag.abi,
  signer
);

```

Done You are good to go, you can now call gasless transaction using GSN

## Link to Important Documentation

1. [Getting Started with GSN] (https://docs.opengsn.org/javascript-client/getting-started.html#working-examples)
2. [GSN Architecture] (https://docs.opengsn.org/#architecture)
3. [GSN for Polygon Mumbai] (https://docs.opengsn.org/networks/polygon/mumbai.html)
