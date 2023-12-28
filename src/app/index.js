import { useState } from 'react';

export default function Home() {
  const [sender, setSender] = useState('');
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!file) {
      alert('Please select a CSV file.');
      return;
    }

    setIsSending(true);

    const formData = new FormData();
    formData.append('sender', sender);
    formData.append('file', file);

    // Send the file to your API route
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('File uploaded successfully');
    } else {
      console.error('Upload failed');
    }

    setIsSending(false);
  };

  return (
    <div>
      <h1>CSV File Sender</h1>
      <input
        type="text"
        value={sender}
        onChange={(e) => setSender(e.target.value)}
        placeholder="Enter sender name"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept=".csv"
      />
      <button onClick={handleSend} disabled={isSending}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}