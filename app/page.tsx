'use client'

import React, { useEffect, useRef, useState } from 'react';
import OpenAI from "openai";

export default function Home() {
  const [tableData, setTableData] = useState<string[][] | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    console.log("OpenAI initialized");
  }, []);

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
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an assistant specialized in Python and pandas." },
          { role: "user", content: `Transform the following user request into a pandas command: "${userInput}"` },
        ],
      });
  
      let command = response.choices[0]?.message?.content;
      console.log('COMMAND', command);
  
      if (!command) {
        console.error("Failed to generate pandas command.");
        return;
      }
  
      // Extract the actual Python command
      const commandMatch = command.match(/```python\n([\s\S]*?)\n```/);
      if (commandMatch) {
        command = commandMatch[1].trim(); // Extract and clean the command
      } else {
        console.warn("No valid Python command block found.");
        return;
      }
  
      // Interpret the command and apply it to the dataset
      const newTableData = applyPandasCommandToTableData(command, tableData);
      if (newTableData) {
        setTableData(newTableData);
      } else {
        console.error("Failed to apply pandas command.");
      }
    } catch (error) {
      console.error("Error generating pandas command:", error);
    }
  };
  
  
  // Helper function to apply the pandas command to the table data
  const applyPandasCommandToTableData = (command: string, tableData: string[][]): string[][] | null => {
    try {
      if (command.startsWith("df.head(")) {
        // Extract the number of rows to display
        const match = command.match(/df\.head\((\d+)\)/);
        if (match) {
          const numRows = parseInt(match[1], 10);
          // Return the header and the first `numRows` rows
          return tableData.slice(0, numRows + 1); // +1 to include the header row
        }
      } else if (command.includes("df[['")) {
        // Column selection, e.g., df[['col1', 'col2']]
        const columnMatch = command.match(/df\[\[['"](.+?)['"]\]\]/);
        if (columnMatch) {
          const selectedColumns = columnMatch[1].split("','");
          const headers = tableData[0];
          const columnIndices = selectedColumns.map(col => headers.indexOf(col)).filter(idx => idx >= 0);
  
          if (columnIndices.length > 0) {
            return [
              columnIndices.map(idx => headers[idx]),
              ...tableData.slice(1).map(row => columnIndices.map(idx => row[idx])),
            ];
          }
        }
      } else if (command.includes("df[df['")) {
        // Filtering rows, e.g., df[df['col'] > value]
        const filterMatch = command.match(/df\[df\[['"](.+?)['"]\]\s*([<>=]+)\s*(.+?)\]/);
        if (filterMatch) {
          const [_, col, operator, value] = filterMatch;
          const headers = tableData[0];
          const colIndex = headers.indexOf(col);
  
          if (colIndex >= 0) {
            const filteredRows = tableData.slice(1).filter(row => {
              const cellValue = parseFloat(row[colIndex]);
              const filterValue = parseFloat(value);
              switch (operator) {
                case '>': return cellValue > filterValue;
                case '<': return cellValue < filterValue;
                case '>=': return cellValue >= filterValue;
                case '<=': return cellValue <= filterValue;
                case '==': return cellValue === filterValue;
                default: return false;
              }
            });
            return [headers, ...filteredRows];
          }
        }
      } else if (command.includes("df.sort_values(")) {
        // Sorting, e.g., df.sort_values(by='col')
        const sortMatch = command.match(/df\.sort_values\(by=['"](.+?)['"]\)/);
        if (sortMatch) {
          const [_, col] = sortMatch;
          const headers = tableData[0];
          const colIndex = headers.indexOf(col);
  
          if (colIndex >= 0) {
            const sortedRows = [...tableData.slice(1)].sort((a, b) =>
              a[colIndex].localeCompare(b[colIndex], undefined, { numeric: true })
            );
            return [headers, ...sortedRows];
          }
        }
      }
      console.warn("Unsupported pandas command.");
      return null;
    } catch (error) {
      console.error("Error applying pandas command:", error);
      return null;
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
