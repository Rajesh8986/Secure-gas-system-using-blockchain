// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureGasSystem {
    
    address public owner;

    // IoT Device Structure
    struct IoTDevice {
        address deviceAddress;
        string deviceID;
        string location;
        bool isRegistered;
    }
    
    // Prediction Structure
    struct PredictionData {
        uint256 gasAmount; // Predicted gas amount in units
        uint256 timestamp;
        string riskLevel;
    }
    
    // Transaction Structure
    struct GasTransaction {
        address user;
        uint256 amount;
        uint256 timestamp;
        bool isSettled;
    }
    
    // Mapping for registered IoT Devices
    mapping(address => IoTDevice) public devices;
    // Mapping for user gas data and predictions
    mapping(address => uint256) public gasUsage;
    mapping(address => PredictionData) public predictions;
    // Array of transactions
    GasTransaction[] public transactions;

    // Events
    event DeviceRegistered(address indexed device, string deviceID, string location);
    event GasDataSubmitted(address indexed device, uint256 gasAmount, uint256 timestamp);
    event PredictionAdded(address indexed device, uint256 gasAmount, string riskLevel, uint256 timestamp);
    event TransactionRecorded(address indexed user, uint256 amount, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this");
        _;
    }

    modifier onlyRegisteredDevice() {
        require(devices[msg.sender].isRegistered, "Device not registered");
        _;
    }

    // Register IoT Device by the owner
    function registerDevice(address _deviceAddress, string memory _deviceID, string memory _location) public onlyOwner {
        devices[_deviceAddress] = IoTDevice(_deviceAddress, _deviceID, _location, true);
        emit DeviceRegistered(_deviceAddress, _deviceID, _location);
    }

    // Submit gas usage data by IoT Device
    function submitGasData(uint256 _gasAmount) public onlyRegisteredDevice {
        gasUsage[msg.sender] += _gasAmount;
        emit GasDataSubmitted(msg.sender, _gasAmount, block.timestamp);
    }

    // Add Prediction data by AI Model
    function addPrediction(uint256 _gasAmount, string memory _riskLevel) public onlyRegisteredDevice {
        predictions[msg.sender] = PredictionData(_gasAmount, block.timestamp, _riskLevel);
        emit PredictionAdded(msg.sender, _gasAmount, _riskLevel, block.timestamp);
    }

    // Record a transaction for gas usage or payment
    function recordTransaction(address _user, uint256 _amount) public onlyOwner {
        transactions.push(GasTransaction(_user, _amount, block.timestamp, false));
        emit TransactionRecorded(_user, _amount, block.timestamp);
    }

    // Mark a transaction as settled
    function settleTransaction(uint256 _transactionId) public onlyOwner {
        require(_transactionId < transactions.length, "Invalid transaction ID");
        transactions[_transactionId].isSettled = true;
    }

    // Get a user's gas usage
    function getGasUsage(address _user) public view returns (uint256) {
        return gasUsage[_user];
    }

    // Get prediction data for a device
    function getPrediction(address _device) public view returns (uint256, string memory, uint256) {
        PredictionData memory prediction = predictions[_device];
        return (prediction.gasAmount, prediction.riskLevel, prediction.timestamp);
    }

    // Get total transactions
    function getTotalTransactions() public view returns (uint256) {
        return transactions.length;
    }

    // Get transaction details by ID
    function getTransaction(uint256 _transactionId) public view returns (address, uint256, uint256, bool) {
        require(_transactionId < transactions.length, "Invalid transaction ID");
        GasTransaction memory transaction = transactions[_transactionId];
        return (transaction.user, transaction.amount, transaction.timestamp, transaction.isSettled);
    }
}
