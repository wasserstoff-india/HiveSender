'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import hive from "@hiveio/hive-js";
import TransferReceipt from './transfer';
export default function Home() {
  const [file, setFile] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [sender, setSender] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const updateTransfers = (newTransfer) => {
    setTransfers((prevTransfers) => [...prevTransfers, newTransfer]);
  };

  const processCSV = (data) => {
    data.forEach(row => {
      if (row && row.length > 0) {
        const username = row[0];
        sendHive(username);
        for(let i = 0; i < 10000000; i++);
      }
    });
  };

  const handleProcessFile = () => {
    if (!file) {
      alert('Please select a CSV file.');
      return;
    }

    setIsProcessing(true);

    Papa.parse(file, {
      complete: (results) => {
        processCSV(results.data);
        setIsProcessing(false);
      },
      header: false
    });
  };

  async function isValidAccount(username) {
    try {
      await hive.api.getAccounts([accountId], (err, result) => {
        if (err) {
          throw err;
        }
        if (result.length === 0) {
          throw new Error("Account not found");
        }
        const account = result[0];
        if (account.name !== username) {
          throw new Error("Account not found");
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async function sendHive(username) {
    // Implement your sendHive logic here
    if (!isValidAccount(username)) {
      updateTransfers({
        username,
        status: 'Invalid',
      })
    }
    else{
      const transfer = await hive.broadcast.transfer(
        privateKey,
        sender,
        username,
        "0.001 HIVE",
        "Support DeFi on Hive! Your vote counts, vote now - https://peakd.com/me/proposals/291"
      );
      updateTransfers({
        username,
        status: 'Sent',
      });
    }
  }

  return (
    <div>
      <h1>CSV File Sender</h1>
      <div
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100vw',
            height: '60vh',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
          }
        }
      >
        <label htmlFor="input">Enter Username</label>
        <input
          type="text"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="Enter sender username"
        />
        <label htmlFor="input">Enter Secret Key</label>
        <input
          type="password"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="Enter sender private key"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".csv"
        />
        <button onClick={handleProcessFile} disabled={isProcessing}>
          {isProcessing ? 'Sending...' : 'Send'}
        </button>
      </div>
      <TransferReceipt transfers={transfers} />
    </div>
  );
}