// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "usingtellor/contracts/UsingTellor.sol";

contract PriceRT is UsingTellor {
    

    // Input tellor oracle address
    constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) {}

    // FVM tellor oracle 0xb2CB696fE5244fB9004877e58dcB680cB86Ba444

    function getSpotPrice(string memory fst, string memory snd) public view returns(uint256) {

        bytes memory queryData = abi.encode("SpotPrice", abi.encode(fst, snd));
        bytes32 queryId = keccak256(queryData);
        uint256 spotPrice = readSpotPrice(queryId);
        return spotPrice;



    }

    function readSpotPrice(bytes32 queryId)
        internal view returns(uint256 spotPrice)
    {
        // Retrieve data at least 15 minutes old to allow time for disputes
        (bytes memory _value, uint256 _timestampRetrieved) =
            getDataBefore(queryId, block.timestamp - 15 minutes);
        // If timestampRetrieved is 0, no data was found
        if(_timestampRetrieved > 0) {
            // Check that the data is not too old
            if(block.timestamp - _timestampRetrieved < 24 hours) {
                // Use the helper function _sliceUint to parse the bytes to uint256
               spotPrice = _sliceUint(_value);
               
            }
        }
    }
}