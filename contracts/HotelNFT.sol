// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HotelNFT
 * @dev ERC-721 NFTコントラクト - ホテル予約NFTを管理
 */
contract HotelNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // NFTのメタデータ構造
    struct HotelMetadata {
        string name;
        string region;
        string prefecture;
        string area;
        string addressLine;
        string description;
        string imageUrl;
        uint256 priceEth; // Wei単位
        uint256 priceJpy;
        uint256 purchaseDeadline; // Unix timestamp
        uint256 nights;
        bool isConfirmed;
        bool hasMeals;
        uint256 guests;
        uint256 checkInDate; // Unix timestamp
        uint256 checkOutDate; // Unix timestamp
        string[] amenities;
    }

    // トークンID => メタデータ
    mapping(uint256 => HotelMetadata) public hotelMetadata;
    
    // トークンID => 販売中かどうか
    mapping(uint256 => bool) public isForSale;

    event HotelNFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name
    );

    event HotelNFTSold(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 price
    );

    constructor(address initialOwner) ERC721("HotelNFT", "HOTEL") Ownable(initialOwner) {}

    /**
     * @dev 新しいホテルNFTをミント
     * @param to ミント先のアドレス
     * @param metadata ホテルのメタデータ
     * @param tokenURI NFTのメタデータURI
     */
    function mintHotelNFT(
        address to,
        HotelMetadata memory metadata,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        ++_tokenIds;
        uint256 newTokenId = _tokenIds;

        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        hotelMetadata[newTokenId] = metadata;
        isForSale[newTokenId] = true;

        emit HotelNFTMinted(newTokenId, to, metadata.name);
        return newTokenId;
    }

    /**
     * @dev NFTを購入
     * @param tokenId 購入するNFTのトークンID
     */
    function purchaseNFT(uint256 tokenId) public payable {
        require(isForSale[tokenId], "NFT is not for sale");
        require(msg.value >= hotelMetadata[tokenId].priceEth, "Insufficient payment");
        require(block.timestamp <= hotelMetadata[tokenId].purchaseDeadline, "Purchase deadline has passed");

        address seller = ownerOf(tokenId);
        isForSale[tokenId] = false;

        // 売主に支払いを送金
        (bool sent, ) = payable(seller).call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        // NFTを転送
        _transfer(seller, msg.sender, tokenId);

        emit HotelNFTSold(tokenId, seller, msg.sender, msg.value);
    }

    /**
     * @dev NFTの販売状態を変更
     * @param tokenId トークンID
     * @param forSale 販売中かどうか
     */
    function setForSale(uint256 tokenId, bool forSale) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        isForSale[tokenId] = forSale;
    }

    /**
     * @dev トークンIDのメタデータを取得
     * @param tokenId トークンID
     */
    function getHotelMetadata(uint256 tokenId) public view returns (HotelMetadata memory) {
        // ownerOfを使用してトークンが存在するかチェック（存在しない場合は自動的にrevert）
        ownerOf(tokenId);
        return hotelMetadata[tokenId];
    }

    /**
     * @dev 販売中のNFTの総数を取得
     */
    function getTotalSupply() public view returns (uint256) {
        return _tokenIds;
    }

    /**
     * @dev 販売中のNFTのトークンIDリストを取得（簡易版）
     * 注意: ガス効率のため、実際の実装では別の方法を検討してください
     */
    function getAllTokenIds() public view returns (uint256[] memory) {
        uint256 total = _tokenIds;
        uint256[] memory tokenIds = new uint256[](total);
        for (uint256 i = 1; i <= total; i++) {
            tokenIds[i - 1] = i;
        }
        return tokenIds;
    }
}

