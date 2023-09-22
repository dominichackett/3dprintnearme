// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TablelandController} from "@tableland/evm/contracts/TablelandController.sol";
import {TablelandPolicy} from "@tableland/evm/contracts/TablelandPolicy.sol";
import {Policies} from "@tableland/evm/contracts/policies/Policies.sol";
contract UserProfileManager is TablelandController{
    // Struct to represent a user profile
    struct UserProfile {
        string uri; // URI for off-chain data
        bool isValue;
    }

    // Mapping to associate Ethereum addresses with user profiles
    mapping(address => UserProfile) public profiles;

    // Event to log profile creation or update
    event UserProfileUpdated(address indexed user, string uri);

    // Function to create or update a user profile
    function createOrUpdateProfile(string memory _uri) public {
        profiles[msg.sender].uri = _uri;
        profiles[msg.sender].isValue = true;
        emit UserProfileUpdated(msg.sender, _uri);
    }

    // Function to get the URI of a user's profile
    function getProfileURI(address _user) public view returns (string memory) {
        return profiles[_user].uri;
    }


    


     function getPolicy(
    address caller,
    uint256 
  ) public payable override returns (TablelandPolicy memory) {
    // Return allow-all policy

    if(  profiles[caller].isValue == true)
    return
      TablelandPolicy({
        allowInsert: true,
        allowUpdate: true,
        allowDelete: true,
        whereClause: "",
        withCheck: "",
        updatableColumns: new string[](0)
      });
  else
   return
      TablelandPolicy({
        allowInsert: false,
        allowUpdate: false,
        allowDelete: false,
        whereClause: "",
        withCheck: "",
        updatableColumns: new string[](0)
      });
  }
}
