'use client'

import { useRef, useState } from 'react';

export default function Home() {
  const [tableData, setTableData] = useState<string[][] | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      try {
        const text = await file.text();
        const rows = text.split('\n').map((row) => row.split(','));
        setTableData(rows);
      } catch (error) {
        console.error('Error reading file:', error);
        setTableData(null);
      }
    } else {
      console.error('Invalid file type. Only CSV files are allowed.');
      setTableData(null);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateCommand = async () => {
    if (!userInput || !tableData) {
      console.error("No input or dataset provided.");
      return;
    }
  
    try {
      const csvData = tableData.map(row => row.join(",")).join("\n");
      console.log("CSV Data:", csvData);
      console.log("User Command:", userInput);
  
      const response = await fetch("http://localhost:8000/process-command/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv_data: csvData, instruction: userInput }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail);
      }
  
      const result = await response.json();
      console.log('RESULT', result);
  
      // Parse the data field to an object
      const parsedData = JSON.parse(result.data);
  
      if (parsedData?.columns && parsedData?.data) {
        const updatedTableData = parsedData;
        setTableData([updatedTableData.columns, ...updatedTableData.data]);
      } else {
        throw new Error('Unexpected response format');
      }
  
    } catch (error) {
      console.error("Error generating pandas command:", error);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Upload and Visualize CSV Data</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={triggerFileUpload}
      >
        Upload dataset
      </button>

      <textarea
        placeholder="Describe how you want to manipulate the dataset..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="mt-4 border border-gray-300 rounded p-2 w-full max-w-md"
      />

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={handleGenerateCommand}
      >
        Generate pandas command
      </button>

      {tableData ? (
        <table className="table-auto border-collapse border border-gray-500 mt-4">
          <thead>
            <tr>
              {tableData[0].map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-500 px-4 py-2 bg-gray-200 font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-gray-500 px-4 py-2 text-center"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 mt-4">No data to display. Please upload a CSV file.</p>
      )}
    </div>
  );
}
