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
  const [memo, setMemo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  const updateTransfers = (newTransfer) => {
    setTransfers((prevTransfers) => [...prevTransfers, newTransfer]);
  };

  const processCSV = async (data) => {
    for(let i=0;i<data.length;i++){
      let row = data[i];
      if (row && row.length > 0) {
        const username = row[0];
        sendHive(username);
        await sleep(2000);
      }
    };
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
      await hive.broadcast.transfer(
        privateKey,
        sender,
        username,
        "0.001 HIVE",
        memo
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
        <label htmlFor="input">Enter Memo / Message</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Enter message"
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