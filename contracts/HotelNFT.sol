// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract HotelNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;
    uint256 private constant PLATFORM_FEE_BPS = 500; 

    // 💡 修正箇所: amenitiesを削除 (構造体の末尾の配列がエンコーディングエラーの原因)
    struct HotelMetadata {
        string name;
        string region;
        string prefecture;
        string area;
        string addressLine;
        string description;
        string imageUrl;
        uint256 priceEth;
        uint256 priceJpy;
        uint256 purchaseDeadline;
        uint256 nights;
        bool isConfirmed;
        bool hasMeals;
        uint256 guests;
        uint256 checkInDate;
        uint256 checkOutDate;
    }

    mapping(uint256 => HotelMetadata) public hotelMetadata;
    mapping(uint256 => bool) public isForSale;
    mapping(uint256 => string[]) public tokenAmenities; // 💡 amenitiesの新しい保存場所

    event HotelNFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name
    );

    event HotelNFTSold(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 price,
        uint256 fee
    );
    
    constructor(address initialOwner) 
        ERC721("HotelNFT", "HOTEL") 
        Ownable(initialOwner) 
    {}

    /**
     * @dev 新しいホテルNFTをミント
     * 💡 修正箇所: amenities を引数として受け取る
     */
    function mintHotelNFT(
        address to,
        HotelMetadata memory metadata,
        string memory tokenURI,
        string[] memory amenities // 💡 構造体から分離
    ) public onlyOwner returns (uint256) {
        ++_tokenIds;
        uint256 newTokenId = _tokenIds;

        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        hotelMetadata[newTokenId] = metadata;
        tokenAmenities[newTokenId] = amenities; // 💡 新しいマッピングに保存
        isForSale[newTokenId] = false;

        emit HotelNFTMinted(newTokenId, to, metadata.name);
        return newTokenId;
    }

    // ... purchaseNFT, setForSale は省略 ...
    function purchaseNFT(uint256 tokenId) public payable nonReentrant {
        require(isForSale[tokenId], "NFT is not for sale");
        uint256 requiredPrice = hotelMetadata[tokenId].priceEth;
        require(msg.value >= requiredPrice, "Insufficient payment");
        require(block.timestamp <= hotelMetadata[tokenId].purchaseDeadline, "Purchase deadline has passed");

        address seller = ownerOf(tokenId);
        isForSale[tokenId] = false;

        uint256 platformFee = (msg.value * PLATFORM_FEE_BPS) / 10000;
        uint256 sellerPayout = msg.value - platformFee;

        (bool sellerSent, ) = payable(seller).call{value: sellerPayout}("");
        require(sellerSent, "Failed to send Ether to seller");
        
        (bool ownerSent, ) = payable(owner()).call{value: platformFee}("");
        require(ownerSent, "Failed to send fee to platform owner");

        _transfer(seller, msg.sender, tokenId);
        emit HotelNFTSold(tokenId, seller, msg.sender, msg.value, platformFee); 
    }

    // ... (他の関数は省略) ...
    function getHotelMetadata(uint256 tokenId) public view returns (HotelMetadata memory) {
        ownerOf(tokenId);
        return hotelMetadata[tokenId];
    }
    function setForSale(uint256 tokenId, bool forSale) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        isForSale[tokenId] = forSale;
    }
    
    // ... (getAllTokenIds, supportsInterface なども省略) ...
    function getTotalSupply() public view returns (uint256) {
        return _tokenIds;
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721URIStorage) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}