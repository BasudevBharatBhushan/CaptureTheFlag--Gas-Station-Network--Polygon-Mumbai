import { ethers, BigNumber } from "ethers";
import CaptureTheFlag from "../artifacts/contracts/CaptureTheFlag.sol/CaptureTheFlag.json";

import { RelayProvider } from "@opengsn/provider";

const WhitelistPaymasterAddress = "0xc5d5d8f0ea82888e35fb573ba9403cde1c87c45b";
const AcceptEverythingPaymaster = "0x086c11bd5A61ac480b326916656a33c474d1E4d8";

const CAPTURE_THE_FLAG_CONTRACT_ADDRESS =
  "0x8bf1aa01c29b283fb5a036ce687f36c8ae7f0901";

// const gsnProvider = await RelayProvider.newProvider({
//   provider: window.ethereum,
//   config: {
//     WhitelistPaymasterAddress,
//   },
// });
// export const provider = new ethers.providers.Web3Provider(gsnProvider);

const gsnConfig = {
  paymasterAddress: WhitelistPaymasterAddress,
};

const gsnProvider = RelayProvider.newProvider({
  provider: window.ethereum,
  config: gsnConfig,
});
await gsnProvider.init();

const etherProvider = new ethers.providers.Web3Provider(gsnProvider);

export const signer = etherProvider.getSigner();

console.log(signer._address);

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

/*

Capture the Flag 
- 0x164e7eC02DCF25CF6c8a1DfEA5fB4e7f16b6c112
- 0x8bf1aa01c29b283fb5a036ce687f36c8ae7f0901

Whitelist Paymaster
- 

*/
