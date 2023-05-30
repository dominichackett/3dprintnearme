/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceRT {
    //AggregatorV3Interface internal priceFeed;


    mapping(string => AggregatorV3Interface) public priceFeedList;

    /**
     * Network: Sepolia
     * Aggregator: BTC/USD
     * Address: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
     */
    constructor() {
        //priceFeed = AggregatorV3Interface(
        //    0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        //);
    }

    function addPricefeed(string memory currency, AggregatorV3Interface pricefeedAddress) public {
        priceFeedList[currency] = pricefeedAddress;

    }

    /**
     * Returns the latest price.
     */
    function getSpotPrice(string memory fst, string memory snd) public view returns (int256) {
        // prettier-ignore
        
        //priceFeed = AggregatorV3Interface(
        //    priceFeedList[fst]
        //);
        (
            /* uint80 roundID */,
            int fstPrice,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AggregatorV3Interface(
            priceFeedList[fst]).latestRoundData();

        //priceFeed = AggregatorV3Interface(
        //    priceFeedList[snd]
        //);
        (
            /* uint80 roundID */,
            int sndPrice,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AggregatorV3Interface(
            priceFeedList[snd]).latestRoundData();


        return fstPrice/sndPrice
;
    }
}
