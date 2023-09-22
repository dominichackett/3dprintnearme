//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import './PrintNearMeToken.sol';
import './interfaces/IAggregatorOracle.sol';
//Lighthouse Smart Contract : 0x6ec8722e6543fB5976a547434c8644b51e24785b




contract CreateObject is Ownable {


    PrintNearMeToken public PNMT;
    IAggregatorOracle public dealStatus;
      
    
    uint objectCount;
    struct NewObject {
        uint id;
        address creator;
        string objectName;
        string objectDetails;
        string location;
        string status;
        uint transactionId;
        
    }


    mapping (string => NewObject) public objectList;

    constructor(address _PNMTAddress, address _dealStatus) {
        PNMT = PrintNearMeToken(_PNMTAddress);
        dealStatus = IAggregatorOracle(_dealStatus);
    }

    event ObjectCreation(
        uint indexed id,
        address indexed creator,
        uint indexed transactionId,
        bytes cid,
        string objName,
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

    function mintNewObject(string memory uri, bytes memory _cid, string memory _objectName, string memory _objectDetails, string memory _location) public {

        objectCount = objectCount + 1;
               
        PNMT.safeMint( msg.sender, uri);    
        uint transactionId = dealStatus.submit(_cid);
        objectList[_objectName] = NewObject(objectCount, msg.sender,_objectName, _objectDetails, _location, "Created", transactionId);
        emit ObjectCreation(objectCount, msg.sender, transactionId, _cid,_objectName, _objectDetails, _location);

    }






}