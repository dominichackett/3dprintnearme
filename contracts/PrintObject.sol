//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import './IPublicLock.sol';
import './PrintApprovalToken.sol';
import './PrintNearMeToken.sol';




contract PrintObject is Ownable {

    PrintApprovalToken public PAT;
    PrintNearMeToken public PNMT;
            
    
    struct Printer {
        address printOwner;
        string printerDetails;
        string location;
        uint status;
        string feeCurrency;
        uint cost;
        
    }

    mapping (string => Printer) public printerList;
    mapping(string => address) public tokenList;
    mapping(address => mapping(string => uint)) public balances;
    constructor(address _PATAddress, address _PNMTAddress) {
        PAT= PrintApprovalToken(_PATAddress);
        PNMT = PrintNearMeToken(_PNMTAddress);
    }

    function printObject( uint _tokenId, string memory _printerName, string memory _currency) public {

        if(PNMT.ownerOf(_tokenId) == msg.sender){

            sendToPrint(_tokenId, _printerName, 1);

        } else {       
        
            require(PAT.balanceOf(msg.sender, _tokenId) > 0, 'Less Apporval Tokens than requested');
            sendToPrint(_tokenId, _printerName, 1);
            PAT.burn(msg.sender, _tokenId, 1);
        
        }

        require(keccak256(abi.encodePacked((_currency))) ==keccak256(abi.encodePacked((printerList[_printerName].feeCurrency))) , "Currency needs to same as Listed Currency");

        if (keccak256(abi.encodePacked((_currency))) == keccak256(abi.encodePacked(('matic')))) {

            require(address(this).balance > printerList[_printerName].cost, "Not enough balance in contract");            
            (bool success, ) = payable(msg.sender).call{value: printerList[_printerName].cost}("");
            require(success, "Transfer failed");
        } else {        
            require(getBalanceOfToken(tokenList[_currency], msg.sender) > printerList[_printerName].cost,"Insufficient Balance");
            IERC20(tokenList[_currency]).transferFrom(msg.sender, address(this), printerList[_printerName].cost);
        }
        
        
    }

    function getBalanceOfToken(address _address, address _user) public view returns (uint) {
        return IERC20(_address).balanceOf(_user);
    }

 

    function addprinter(string memory _name, string memory _printDetails, string memory _location, string memory _feeCurrency, uint _status, uint _amount) public {

        require(printerList[_name].printOwner == address(0));
        require(tokenList[_feeCurrency] != address(0), 'The Fee Currency not whitelisted');
        printerList[_name] = Printer(msg.sender,_printDetails, _location, _status , _feeCurrency, _amount);

    }  


    function sendToPrint( uint _tokenId, string memory printerName, uint _count) public {

        require(printerList[printerName].printOwner != address(0));
        require(printerList[printerName].status == 1);       

    }

}