//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import './IPublicLock.sol';
import './PrintApprovalToken.sol';
import './PrintNearMeToken.sol';




contract PrintObject is Ownable, ReentrancyGuard {

    PrintApprovalToken public PAT;
    PrintNearMeToken public PNMT;
            
    
    struct Printer {
        address printOwner;
        string printerDetails;
        string location;
        uint status;
        string feeCurrency;
        
    }

    mapping (string => Printer) public printerList;
    mapping(string => address) public tokenList;
    mapping(address => mapping(string => uint)) public balances;
    constructor(address _PATAddress, address _PNMTAddress) {
        PAT= PrintApprovalToken(_PATAddress);
        PNMT = PrintNearMeToken(_PNMTAddress);
    }

    event Withdrawls(
        address indexed user,
        string indexed currency,
        uint256 amount        
    );

    event ObjectPrinted(
        address indexed user,
        uint indexed tokenId,
        string indexed printerName,
        uint256 amount,
        string currency       
    );

    function printObject( uint _tokenId, string memory _printerName, string memory _currency,uint cost) payable public {

         require(printerList[_printerName].printOwner != address(0),"Printer doesn't exist");
        require(printerList[_printerName].status == 1,"Printer isn't active");   
        require(PNMT.ownerOf(_tokenId) == msg.sender || PAT.balanceOf(msg.sender, _tokenId) > 0,"Not authorized to print this object");
        if(PNMT.ownerOf(_tokenId) == msg.sender){


        } else {       
        
            PAT.burn(msg.sender, _tokenId, 1);
        
        }

        require(keccak256(abi.encodePacked((_currency))) ==keccak256(abi.encodePacked((printerList[_printerName].feeCurrency))) , "Currency needs to same as Listed Currency");
        balances[printerList[_printerName].printOwner][_currency] += cost ;

        if (keccak256(abi.encodePacked((_currency))) == keccak256(abi.encodePacked(('matic')))) {

             require( msg.value  >= cost, "Insufficient Amount");

        } else {        
            require(getBalanceOfToken(tokenList[_currency], msg.sender) > cost,"Insufficient Balance");
            IERC20(tokenList[_currency]).transferFrom(msg.sender, address(this), cost);
        }

        emit ObjectPrinted(msg.sender,_tokenId, _printerName, cost, _currency );
        
        
    }

    function getBalanceOfToken(address _address, address _user) public view returns (uint) {
        return IERC20(_address).balanceOf(_user);
    }

 

    function addprinter(string memory _name, string memory _printDetails, string memory _location, string memory _feeCurrency, uint _status) public {

        require(printerList[_name].printOwner == address(0),'Printer already exisit.');
        require(tokenList[_feeCurrency] != address(0), 'The Fee Currency not whitelisted');
        printerList[_name] = Printer(msg.sender,_printDetails, _location, _status , _feeCurrency);

    }  


    

    function withdrawProceeds(string memory _currency, uint _amount) external nonReentrant {

        require(balances[msg.sender][_currency] >= _amount, "Not enough balance for User");
        balances[msg.sender][_currency] -= _amount;

        if (keccak256(abi.encodePacked((_currency))) == keccak256(abi.encodePacked(('matic')))) {

            require(address(this).balance > _amount, "Not enough balance in contract");
            
            (bool success, ) = payable(msg.sender).call{value: _amount}("");
            require(success, "Transfer failed");

        } else {

            require(getBalanceOfToken(tokenList[_currency], address(this)) > _amount, "Not enough balance in contract");
            
            IERC20(tokenList[_currency]).transfer(msg.sender, _amount);

        }
        emit Withdrawls(msg.sender , _currency, _amount);

    }

    function addsupportedCurrencies(string memory _name, address _tokenContract) public onlyOwner {
        tokenList[_name] = _tokenContract;
    }

}