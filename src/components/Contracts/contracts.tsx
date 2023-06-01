export const exchangeAddress='0x6314eFCa8588d09c874adA112EA755ae7a7c14a1'
export const exchangeABI = [ 'event Listed(address indexed owner,uint256 indexed tokenId,uint256 price,string currency)',
'event PrintApprovalTokenMinted(address indexed minter,uint256 indexed tokenId,uint256 quantity,string currency, uint256 amount)',
'event Withdrawls(address indexed user,string indexed currency,uint256 amount)',
'function addsupportedCurrencies(string memory _name, address _tokenContract) public',
'function setPrintNearMeTokenAddress(address _PNMTAddress) public',
'function setRTPricesAddress(address _priceRTAddress) public',
'function setPrintApprovalTokenAddress(address _PATAddress) public',
'function getPrice(string memory fst, string memory snd) public view returns(int256)',
'function listPrintNearMeToken(uint256 _tokenId, uint256 _price, string memory _currency) external',
'function buyPAT(string memory _currency ,  uint256 _tokenId) external payable',
'function getBalanceOfToken(address _address, address _user) public view returns (uint)',
'function withdrawProceeds(string memory _currency, uint _amount) external'
]

export const PATADDRESS = '0xf4683d08092FF8101FdaD71092c155a71D039840'
export const PATABI = ['function setURI(string memory newuri) public',
'function pause() public',
'function unpause() public',
'function mint(address account, uint256 id, uint256 amount, bytes memory data) public',
'function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public',
'function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal',
'function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl)returns (bool)',
'function approve(address _operator, uint256 _id, bool _approved) external']

export const PriceRTADDRESS = '0xE8a9eA3fA8fCf12E554dC2cD1D1bA6CAd0fD94d2'
export const PRICERTABI = ['function addPricefeed(string memory currency, AggregatorV3Interface pricefeedAddress) public',
'function getSpotPrice(string memory fst, string memory snd) public view returns (int256)']

export const createObjectAddress = '0xD5Bc29DF48CAAD9604423cbcE415B937BA47377E'
export const createObjectABI = ['event ObjectCreation(uint indexed id,address indexed creator,string indexed name,string details,string location)',
'event PrintResult(uint indexed id,address indexed requestor,address indexed printer,string  name,string  status,string  location)',
'function setPrintNearMeTokenAddress(address _PNMTAddress) public',
'function setLockAddress(address _lockAddress) public',
'function mintNewObject(string memory uri, string memory _objectName, string memory _objectDetails, string memory _location) public']

export const PNMTADDRESS = '0x447F9a48B5af0aA45e68083FA450cEd68ead5902'
export const PNMTABI = ['function setURI(string memory newuri) public',
'function pause() public',
'function unpause() public',
'function mint(address account, uint256 id, uint256 amount, bytes memory data) public',
'function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public',
'function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal',
'function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl)returns (bool)',
'function approve(address _operator, uint256 _id, bool _approved) external',
'function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory)']