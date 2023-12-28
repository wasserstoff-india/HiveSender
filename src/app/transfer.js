import React, { useState, useEffect } from 'react';

const TransferReceipt = ({ transfers }) => {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    setReceipts(transfers);
  }, [transfers]);

  return (
    <div>
      <h2>Transfer Receipt</h2>
      <table>
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Username</th>
            <th>Sent Status</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((transfer, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{transfer.username}</td>
              <td>{transfer.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
};

export default TransferReceipt;