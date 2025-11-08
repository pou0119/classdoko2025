// src/lib/blockchain/hotelNFTABI.ts

export const hotelNFTABI = [
  {
    "inputs": [{"internalType": "address","name": "initialOwner","type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"},
      {"indexed": true,"internalType": "address","name": "owner","type": "address"},
      {"indexed": false,"internalType": "string","name": "name","type": "string"}
    ],
    "name": "HotelNFTMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"},
      {"indexed": true,"internalType": "address","name": "from","type": "address"},
      {"indexed": true,"internalType": "address","name": "to","type": "address"},
      {"indexed": false,"internalType": "uint256","name": "price","type": "uint256"},
      {"indexed": false,"internalType": "uint256","name": "fee","type": "uint256"}
    ],
    "name": "HotelNFTSold",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],
    "name": "getHotelMetadata",
    "outputs": [
      {
        "components": [
          {"internalType": "string","name": "name","type": "string"},
          {"internalType": "string","name": "region","type": "string"},
          {"internalType": "string","name": "prefecture","type": "string"},
          {"internalType": "string","name": "area","type": "string"},
          {"internalType": "string","name": "addressLine","type": "string"},
          {"internalType": "string","name": "description","type": "string"},
          {"internalType": "string","name": "imageUrl","type": "string"},
          {"internalType": "uint256","name": "priceEth","type": "uint256"},
          {"internalType": "uint256","name": "priceJpy","type": "uint256"},
          {"internalType": "uint256","name": "purchaseDeadline","type": "uint256"},
          {"internalType": "uint256","name": "nights","type": "uint256"},
          {"internalType": "bool","name": "isConfirmed","type": "bool"},
          {"internalType": "bool","name": "hasMeals","type": "bool"},
          {"internalType": "uint256","name": "guests","type": "uint256"},
          {"internalType": "uint256","name": "checkInDate","type": "uint256"},
          {"internalType": "uint256","name": "checkOutDate","type": "uint256"}
        ],
        "internalType": "struct HotelNFT.HotelMetadata","name": "","type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address","name": "","type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],
    "name": "purchaseNFT",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],
    "name": "tokenAmenities",
    "outputs": [{"internalType": "string","name": "","type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string","name": "","type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalSupply",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;