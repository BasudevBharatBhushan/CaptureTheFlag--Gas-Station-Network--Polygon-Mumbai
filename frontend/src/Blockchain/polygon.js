import { ethers, BigNumber } from "ethers";
import CaptureTheFlag from "../artifacts/contracts/CaptureTheFlag.sol/CaptureTheFlag.json";

import { RelayProvider } from "@opengsn/provider";

const WhitelistPaymasterAddress =
  process.env.REACT_APP_WHITELIST_PAYMASTER_ADDRESS;
const AcceptEverythingPaymaster =
  process.env.REACT_APP_ACCEPT_EVERYTHING_PAYMASTER;

const CAPTURE_THE_FLAG_CONTRACT_ADDRESS =
  process.env.REACT_APP_CAPTURE_THE_FLAG_CONTRACT_ADDRESS;

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
