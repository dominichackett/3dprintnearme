//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
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

    constructor(address _PATAddress, address _PNMTAddress) {
        PAT= PrintApprovalToken(_PATAddress);
        PNMT = PrintNearMeToken(_PNMTAddress);
    }

    function printObject( uint _tokenId, string memory _printerName, uint _count) public {

        if(PNMT.ownerOf(_tokenId) == msg.sender){

            sendToPrint(_tokenId, _printerName, _count);

        } else {       
        
            require(PAT.balanceOf(msg.sender, _tokenId) > _count, 'Less Apporval Tokens than requested');
            sendToPrint(_tokenId, _printerName, _count);
            PAT.burn(msg.sender, _tokenId, _count);
        
        }

    }

 

    function addprinter(string memory _name, string memory _printDetails, string memory _location, string memory _feeCurrency, uint _status, uint _amount) public {

        require(printerList[_name].printOwner == address(0));
        printerList[_name] = Printer(msg.sender,_printDetails, _location, _status , _feeCurrency, _amount);

    }  


    function sendToPrint( uint _tokenId, string memory printerName, uint _count) public {

        require(printerList[printerName].printOwner != address(0));
        require(printerList[printerName].status == 1);       

    }

}