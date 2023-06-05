// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";


contract Inflation is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
  
    string public yoyInflation;
    address public oracleId;
    string public jobId;
    uint256 public fee;

  // Please refer to
  // https://github.com/truflation/quickstart/blob/main/network.md
  // for oracle address. job id, and fee for a given network

    constructor(
        address oracleId_,
        string memory jobId_,
        uint256 fee_,
        address token_
    ) ConfirmedOwner(msg.sender) {
        setChainlinkToken(token_);
        oracleId = oracleId_;
        jobId = jobId_;
        fee = fee_;
    }

    int256 public inflationWei;
    function requestInflationWei() public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            bytes32(bytes(jobId)),
            address(this),
            this.fulfillInflationWei.selector
        );
            req.add("service", "truflation/current");
            req.add("keypath", "yearOverYearInflation");
            req.add("abi", "int256");
            req.add("multiplier", "1000000000000000000");
            req.add("refundTo",
            Strings.toHexString(uint160(msg.sender), 20));

        return sendChainlinkRequestTo(oracleId, req, fee);
    }

    function fulfillInflationWei(
        bytes32 _requestId,
        bytes memory _inflation
    ) public recordChainlinkFulfillment(_requestId) {
        inflationWei = toInt256(_inflation);
    }

    function toInt256(bytes memory _bytes) internal pure
        returns (int256 value) {
        assembly {
            value := mload(add(_bytes, 0x20))
        }
    }
}