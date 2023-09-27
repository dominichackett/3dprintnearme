//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import './IPublicLock.sol';
import './PrintNearMeToken.sol';
import "https://github.com/bacalhau-project/lilypad-v0/blob/main/hardhat/contracts/LilypadEventsUpgradeable.sol";
import "https://github.com/bacalhau-project/lilypad-v0/blob/main/hardhat/contracts/LilypadCallerInterface.sol";
import "@openzeppelin/contracts/utils/Strings.sol";



contract CreateObject is Ownable,LilypadCallerInterface {


    PrintNearMeToken public PNMT;
    IPublicLock public lock;
    address public bridgeAddress; // Variable for interacting with the deployed LilypadEvents contract
    LilypadEventsUpgradeable bridge;
    uint256 public lilypadFee; //=30000000000000000;
      using Strings for uint256;
    event JobSubmitted(uint id,string error);

         
    
    uint objectCount;
   

    struct NewObject {
        uint id;
        address creator;
        string objectName;
        string objectDetails;
        string location;
        string status;
        
    }

   /** Define the Bacalhau Specification */
  string constant specStart = '{'
      '"Engine": "docker",'
      '"Verifier": "noop",'
      '"PublisherSpec": {"Type": "estuary"},'
      '"Docker": {'
      '"Image": "ghcr.io/dominichackett/myrepo/3dprintnearme:v1.0",'
      '"Parameters": ["calculate.js" "';

  string constant specEnd =
      '"]},'
      '"Network": {"Type": "HTTP"},'

      '"Resources": {"GPU": "0","Memory":"2GB"},'
      '"Outputs": [{"Name": "outputs", "Path": "/outputs"}],'
      '"Deal": {"Concurrency": 1}'
      '}';
    mapping (string => NewObject) public objectList;

    constructor(address _PNMTAddress,address _bridgeContractAddress) {
        PNMT = PrintNearMeToken(_PNMTAddress);
        bridgeAddress = _bridgeContractAddress;
        bridge = LilypadEventsUpgradeable(_bridgeContractAddress);
        uint fee = bridge.getLilypadFee(); // you can fetch the fee amount required for the contract to run also
        lilypadFee = fee;
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

    function mintNewObject(string memory uri, string memory _objectName, string memory _objectDetails, string memory _location) external payable {

        //require(lock.balanceOf(msg.sender) > 0, 'Not a Member');
        objectCount = objectCount + 1;
        objectList[_objectName] = NewObject(objectCount, msg.sender,_objectName, _objectDetails, _location, "Created");        
        PNMT.safeMint( msg.sender, objectCount, uri);    
        calculatePrintTime(objectCount);

    }

function calculatePrintTime(uint256 tokenId) internal 
{
       require(msg.value >= lilypadFee, "Not enough to run Lilypad job");
        // TODO: spec -> do proper json encoding, look out for quotes in _prompt
      string memory spec = string.concat(specStart, tokenId.toString(), specEnd);
      uint id = bridge.runLilypadJob{value: lilypadFee}(address(this), spec, uint8(LilypadResultType.ExitCode));
      require(id > 0, "job didn't return a value");
      emit JobSubmitted(id,"Job Id");
}

 /** LilypadCaller Interface Implementation */
  function lilypadFulfilled(address _from, uint _jobId,   
    LilypadResultType _resultType, string calldata _result)        
    external override {
    // Do something when the LilypadEvents contract returns    
    // results successfully
          emit JobSubmitted(0,_result);

  }
  
  function lilypadCancelled(address _from, uint _jobId, string 
    calldata _errorMsg) external override {
    // Do something if there's an error returned by the
    // LilypadEvents contract
          emit JobSubmitted(1,_errorMsg);

  }


}