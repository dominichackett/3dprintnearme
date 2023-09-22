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
import "./MinerPass.sol";
import './interfaces/IAggregatorOracle.sol';
//Lighthouse Smart Contract : 0x6ec8722e6543fB5976a547434c8644b51e24785b


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
    MinerPass public MP;
    IAggregatorOracle public aggregator;


    struct ListObject{        
        address owner;
        uint mintedQuantity;
        uint price;
        string currency;
        uint royaltyPercent;
    }

    struct CidMap {
        uint tokenId;
        uint earnings;
    }

    struct tokenDetails {
        bytes cid;
        uint64 dealId;
        uint64 minerId;
    }

    mapping(uint => tokenDetails) public tokenDeals;
    mapping(bytes => CidMap) public cidMapping;
    mapping(uint64 => address) public minerAddress;
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

    function setMinerPassAddress(address _MPAddress) public  onlyOwner {
        MP = MinerPass(_MPAddress);
    
    }

    function setAggregatorAddress(address _aggregator) public  onlyOwner {
        aggregator = IAggregatorOracle(_aggregator);
    
    }

    function getPrice(string memory fst, string memory snd) public view returns(int256) {
       int256 spotPrice = int256(priceRT.getSpotPrice(fst, snd));
       return spotPrice;
    
    }

    function getDealDetails(bytes memory _cid , uint256 _tokenId) public  {

        uint64 _dealId;
        uint64 _minerId;

        IAggregatorOracle.Deal[] memory deals = aggregator.getActiveDeals(_cid);
        _dealId = deals[0].dealId;
        _minerId = deals[0].minerId;
        tokenDeals[_tokenId] = tokenDetails(_cid, _dealId, _minerId);


    }

    function addMinerAddress(uint64 _minerId) public {

        require(MP.balanceOf(msg.sender)> 0, "No Miner Pass");
        minerAddress[_minerId] = msg.sender;

    }


    function listPrintNearMeToken(uint256 _tokenId, uint256 _price, string memory _currency, uint _minerRoyalty) external nonReentrant notListed(_tokenId) isOwner(_tokenId, msg.sender) {

        require(tokenList[_currency] != address(0), "Currency Not defined");  
        require(tokenDeals[_tokenId].dealId !=0, "No Deal exist"); 
        listings[_tokenId] = ListObject( msg.sender , 0, _price, _currency , _minerRoyalty); 
        PNMT.safeTransferFrom(msg.sender, address(this), _tokenId);

        emit Listed(msg.sender, _tokenId, _price, _currency );

    }

    function buyPAT(string memory _currency ,  uint256 _tokenId) external payable nonReentrant isListed(_tokenId) {

        
        int256 objectPriceInUSD = int256(listings[_tokenId].price) * getPrice(listings[_tokenId].currency,'usd');
        int256 currencyRatePerUSD = getPrice(_currency, 'usd');
        uint256 amountToBePaid = uint256(objectPriceInUSD / currencyRatePerUSD); 
        
        balances[listings[_tokenId].owner][_currency] += amountToBePaid * (100 - listings[_tokenId].royaltyPercent) / 100 ;
        balances[minerAddress[tokenDeals[_tokenId].minerId]][_currency] += amountToBePaid * listings[_tokenId].royaltyPercent /100;
        cidMapping[tokenDeals[_tokenId].cid].earnings +=  amountToBePaid * listings[_tokenId].royaltyPercent /100;


        
        // assumption: contract will be deployed on Filecoin network

        if (keccak256(abi.encodePacked((_currency))) == keccak256(abi.encodePacked(('fil')))) {

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