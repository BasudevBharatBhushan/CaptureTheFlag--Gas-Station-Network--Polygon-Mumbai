import { ethers, BigNumber } from "ethers";
import CaptureTheFlag from "../artifacts/contracts/CaptureTheFlag.sol/CaptureTheFlag.json";

import { RelayProvider } from "@opengsn/provider";

const paymasterAddress = "0xc5d5d8f0ea82888e35fb573ba9403cde1c87c45b";

const CAPTURE_THE_FLAG_CONTRACT_ADDRESS =
  "0x8bf1aa01c29b283fb5a036ce687f36c8ae7f0901";

const gsnProvider = await RelayProvider.newProvider({
  provider: window.ethereum,
  config: {
    paymasterAddress,
  },
}).init();

export const provider = new ethers.providers.Web3Provider(gsnProvider);
export const signer = provider.getSigner();

console.log(signer._address);

export const ReadContracts = new ethers.Contract(
  CAPTURE_THE_FLAG_CONTRACT_ADDRESS,
  CaptureTheFlag.abi,
  provider
);

export const WriteContracts = new ethers.Contract(
  CAPTURE_THE_FLAG_CONTRACT_ADDRESS,
  CaptureTheFlag.abi,
  signer
);
