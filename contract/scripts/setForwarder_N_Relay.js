const { ethers } = require("hardhat")
const IRelayHub = require("../artifacts/@opengsn/contracts/src/interfaces/IRelayHub.sol/IRelayHub.json")

async function main() {
    console.log("---------------------------------------------------")
    const whitelistPaymaster = await ethers.getContract("WhitelistPaymaster")

    // const setForwarder = await whitelistPaymaster.setTrustedForwarder(
    //     process.env.FORWARDER_CONTRACT_ADDRESS
    // )
    // await setForwarder.wait(1)

    // console.log(setForwarder)

    // const setWhitelistSender = await whitelistPaymaster.whitelistSender(
    //     "0x85b3dB26424a88e7C1319E40a6324d64Acf1fFA2",
    //     true
    // )
    // await setWhitelistSender.wait(1)
    // console.log(setWhitelistSender)



    // const setRelayHub = await whitelistPaymaster.setRelayHub(
    //     "0x3232f21A6E08312654270c78A773f00dd61d60f5"
    // )

    // await setRelayHub.wait(1)

    // console.log(setRelayHub)

    

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
