import { useState } from "react";
import { useEth } from "./contexts/EthContext";
import "./styles.css";

function MainComp() {
  const { state: { contract, accounts } } = useEth();

  const [deviceData, setDeviceData] = useState({
    deviceAddress: "",
    deviceID: "",
    location: "",
  });

  const [gasData, setGasData] = useState({
    gasAmount: "",
  });

  const [predictionData, setPredictionData] = useState({
    gasAmount: "",
    riskLevel: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [gasUsage, setGasUsage] = useState([]);
  const [predictions, setPredictions] = useState([]);

  const fetchTransactions = async () => {
    try {
      let transactionList = [];
      const transactionCount = await contract.methods.getTotalTransactions().call();
      for (let i = 0; i < transactionCount; i++) {
        const transaction = await contract.methods.getTransaction(i).call();
        transactionList.push(transaction);
      }
      setTransactions(transactionList);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchGasUsage = async () => {
    try {
      let usageList = [];
      for (let i = 0; i < accounts.length; i++) {
        const usage = await contract.methods.getGasUsage(accounts[i]).call();
        usageList.push({ account: accounts[i], usage });
      }
      setGasUsage(usageList);
    } catch (error) {
      console.error("Error fetching gas usage:", error);
    }
  };

  const fetchPredictions = async () => {
    try {
      let predictionList = [];
      for (let i = 0; i < accounts.length; i++) {
        const prediction = await contract.methods.getPrediction(accounts[i]).call();
        predictionList.push({ account: accounts[i], prediction });
      }
      setPredictions(predictionList);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  const handleRegisterDevice = async () => {
    const { deviceAddress, deviceID, location } = deviceData;
    try {
      await contract.methods.registerDevice(deviceAddress, deviceID, location).send({ from: accounts[0] });
      alert("Device registered successfully!");
    } catch (error) {
      console.error("Error registering device:", error);
    }
  };

  const handleSubmitGasData = async () => {
    const { gasAmount } = gasData;
    try {
      await contract.methods.submitGasData(gasAmount).send({ from: accounts[0] });
      alert("Gas data submitted successfully!");
    } catch (error) {
      console.error("Error submitting gas data:", error);
    }
  };

  const handleAddPrediction = async () => {
    const { gasAmount, riskLevel } = predictionData;
    try {
      await contract.methods.addPrediction(gasAmount, riskLevel).send({ from: accounts[0] });
      alert("Prediction added successfully!");
    } catch (error) {
      console.error("Error adding prediction:", error);
    }
  };

  return (
    <div id="App">
      <div className="container">
        <h1 className="title">Secure Gas System</h1>

        {/* Register Device Form */}
        <div className="form-container">
          <h2>Register IoT Device</h2>
          <input placeholder="Device Address" onChange={(e) => setDeviceData({ ...deviceData, deviceAddress: e.target.value })} />
          <input placeholder="Device ID" onChange={(e) => setDeviceData({ ...deviceData, deviceID: e.target.value })} />
          <input placeholder="Location" onChange={(e) => setDeviceData({ ...deviceData, location: e.target.value })} />
          <button className="btn" onClick={handleRegisterDevice}>Register Device</button>
        </div>

        {/* Submit Gas Data Form */}
        <div className="form-container">
          <h2>Submit Gas Data</h2>
          <input placeholder="Gas Amount" onChange={(e) => setGasData({ ...gasData, gasAmount: e.target.value })} />
          <button className="btn" onClick={handleSubmitGasData}>Submit Gas Data</button>
        </div>

        {/* Add Prediction Form */}
        <div className="form-container">
          <h2>Add Prediction</h2>
          <input placeholder="Predicted Gas Amount" onChange={(e) => setPredictionData({ ...predictionData, gasAmount: e.target.value })} />
          <input placeholder="Risk Level" onChange={(e) => setPredictionData({ ...predictionData, riskLevel: e.target.value })} />
          <button className="btn" onClick={handleAddPrediction}>Add Prediction</button>
        </div>

        {/* View Transactions */}
        <div className="section">
          <h2>Transactions</h2>
          <button className="btn" onClick={fetchTransactions}>View Transactions</button>
          <ul>
            {transactions.map((transaction, index) => (
              <li key={index}>
                User: {transaction[0]}, Amount: {transaction[1]}, Timestamp: {transaction[2]}, Settled: {transaction[3] ? 'Yes' : 'No'}
              </li>
            ))}
          </ul>
        </div>

        {/* View Gas Usage */}
        <div className="section">
          <h2>Gas Usage</h2>
          <button className="btn" onClick={fetchGasUsage}>View Gas Usage</button>
          <ul>
            {gasUsage.map((usage, index) => (
              <li key={index}>
                Account: {usage.account}, Gas Used: {usage.usage}
              </li>
            ))}
          </ul>
        </div>

        {/* View Predictions */}
        <div className="section">
          <h2>Predictions</h2>
          <button className="btn" onClick={fetchPredictions}>View Predictions</button>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>
                Account: {prediction.account}, Predicted Gas: {prediction.prediction[0]}, Risk Level: {prediction.prediction[1]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MainComp;
