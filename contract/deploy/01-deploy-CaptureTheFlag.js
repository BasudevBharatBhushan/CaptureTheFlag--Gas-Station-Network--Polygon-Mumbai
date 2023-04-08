const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const developmentChains = ["hardhat", "localhost"]
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("--------------------------------------------------------------------")

    const forwarderAddress = process.env.FORWARDER_CONTRACT_ADDRESS

    const CaptureTheFlag = await deploy("CaptureTheFlag", {
        from: deployer,
        args: [forwarderAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
}

module.exports.tags = ["all", "main"]
