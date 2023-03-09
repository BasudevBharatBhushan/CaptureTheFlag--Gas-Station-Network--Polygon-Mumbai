const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const developmentChains = ["hardhat", "localhost"]
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("--------------------------------------------------------------------")

    const CaptureTheFlag = await deploy("CaptureTheFlag", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
}

module.exports.tags = ["all", "main"]
