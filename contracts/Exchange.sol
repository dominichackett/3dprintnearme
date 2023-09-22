// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import './PrintNearMeToken.sol';
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./PriceRT.sol";
import "./PrintApprovalToken.sol";


error ItemNotForSale(uint256 tokenId);
error NotListed(uint256 tokenId);
error AlreadyListed(uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

contract Exchange is ERC721Holder, ReentrancyGuard, Ownable{    
    
    PrintNearMeToken public PNMT ; //PNMT;
    PriceRT public priceRT;
    PrintApprovalToken public PAT;


    struct ListObject{        
        address owner;
        uint mintedQuantity;
        uint price;
        string currency;
    }

    mapping(uint256 => ListObject) public listings;
    mapping(string => address) public tokenList;
    mapping(address => mapping(string => uint)) public balances;

    modifier notListed(uint256 tokenId)  {

      address owner = PNMT.ownerOf(tokenId);
        if (owner == address(this)) {
            revert AlreadyListed(tokenId);
        }
        _;
    }

    modifier isListed( uint256 tokenId) {
        address owner = PNMT.ownerOf(tokenId);
        if (owner != address(this)) {
            revert NotListed(tokenId);
        }
        _;
    }

    modifier isOwner(uint256 tokenId,   address spender ) {

        address owner = PNMT.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    event Listed(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 price,
        string currency
    );

    event PrintApprovalTokenMinted(
        address indexed minter,
        uint256 indexed tokenId,
        uint256 quantity,
        string currency,
        uint256 amount
    );

    event Withdrawls(
        address indexed user,
        string indexed currency,
        uint256 amount        
    );

    function addsupportedCurrencies(string memory _name, address _tokenContract) public onlyOwner {
        tokenList[_name] = _tokenContract;
    }

    function setPrintNearMeTokenAddress(address _PNMTAddress) public  onlyOwner {
        PNMT = PrintNearMeToken(_PNMTAddress);
    
    }

    function setRTPricesAddress(address _priceRTAddress) public  onlyOwner {
        priceRT = PriceRT(_priceRTAddress);
    
    }

    function setPrintApprovalTokenAddress(address _PATAddress) public  onlyOwner {
        PAT = PrintApprovalToken(_PATAddress);
    
    }

    function getPrice(string memory fst, string memory snd) public view returns(int256) {
        return priceRT.getSpotPrice(fst, snd);
    
    }


    function listPrintNearMeToken(uint256 _tokenId, uint256 _price, string memory _currency) external nonReentrant notListed(_tokenId) isOwner(_tokenId, msg.sender) {

        require(tokenList[_currency] != address(0), "Currency Not defined");   
        listings[_tokenId] = ListObject( msg.sender , 0, _price, _currency ); 
        PNMT.safeTransferFrom(msg.sender, address(this), _tokenId);

        emit Listed(msg.sender, _tokenId, _price, _currency );

    }

    function buyPAT(string memory _currency ,  uint256 _tokenId) external payable nonReentrant isListed(_tokenId) {

        
        //int256 objectPriceInUSD = int256(listings[_tokenId].price) * getPrice(listings[_tokenId].currency,'usd');
        //int256 currencyRatePerUSD = getPrice(_currency, 'usd');
       // uint256 amountToBePaid = uint256(objectPriceInUSD / currencyRatePerUSD) ; 
         uint256 amountToBePaid = listings[_tokenId].price;
        balances[listings[_tokenId].owner][_currency] += amountToBePaid ;
        
        // assumption: contract will be deployed on Polygon network

        if (keccak256(abi.encodePacked((_currency))) == keccak256(abi.encodePacked(('tfil')))) {

            require( msg.value  >= amountToBePaid , "Insufficient Amount");

        } else {

            require(getBalanceOfToken(tokenList[_currency], msg.sender) > amountToBePaid);
            IERC20(tokenList[_currency]).transferFrom(msg.sender, address(this), amountToBePaid);

        }

        PAT.mint(msg.sender, _tokenId, 1, '0x00');
        emit PrintApprovalTokenMinted(msg.sender, _tokenId, 1, _currency, amountToBePaid);
        

    }

    function getBalanceOfToken(address _address, address _user) public view returns (uint) {
        return IERC20(_address).balanceOf(_user);
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

}