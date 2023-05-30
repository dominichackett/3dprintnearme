//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import './IPublicLock.sol';
import './PrintNearMeToken.sol';




contract CreateObject is Ownable {


    PrintNearMeToken public PNMT;
    IPublicLock public lock;

        
    
    uint objectCount;
   

    struct NewObject {
        uint id;
        address creator;
        string objectName;
        string objectDetails;
        string location;
        string status;
        
    }


    mapping (string => NewObject) public objectList;

    constructor(address _PNMTAddress) {
        PNMT = PrintNearMeToken(_PNMTAddress);
    }

    event ObjectCreation(
        uint indexed id,
        address indexed creator,
        string indexed name,
        string details,
        string location
    );



    event PrintResult(

        uint indexed id,
        address indexed requestor,
        address indexed printer,
        string  name,
        string  status,
        string  location
    );

    function setPrintNearMeTokenAddress(address _PNMTAddress) public  onlyOwner {
        PNMT = PrintNearMeToken(_PNMTAddress);
    
    }

    function setLockAddress(address _lockAddress) public  onlyOwner {
        lock = IPublicLock(_lockAddress);
    
    }

    function mintNewObject(string memory uri, string memory _objectName, string memory _objectDetails, string memory _location) public {

        require(lock.balanceOf(msg.sender) > 0, 'Not a Member');
        objectCount = objectCount + 1;
        objectList[_objectName] = NewObject(objectCount, msg.sender,_objectName, _objectDetails, _location, "Created");        
        PNMT.safeMint( msg.sender, objectCount, uri);    

    }






}