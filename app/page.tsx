'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useRef, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/Loader/Loader';

export default function Home() {
  const { toast } = useToast();

  const [tableData, setTableData] = useState<string[][] | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      try {
        setLoading(true);
        const text = await file.text();
        const rows = text.split('\n').map((row) => row.split(','));
        setTableData(rows);
      } catch (error) {
        console.error('Error reading file:', error);
        setTableData(null);
      } finally {
        setLoading(false);
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
    if (!tableData) {
      toast({
        title: "No dataset provided.",
        description: "Please upload a CSV file.",
        duration: 5000,
      });
      return;
    }

    if (!userInput) {
      toast({
        title: "No prompt provided.",
        description: "Please write a prompt.",
        duration: 5000,
      });
      return;
    }

    setLoading(true);

    try {
      const csvData = tableData.map(row => row.join(",")).join("\n");

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

      const parsedData = JSON.parse(result.data);

      if (parsedData?.columns && parsedData?.data) {
        const updatedTableData = parsedData;
        setTableData([updatedTableData.columns, ...updatedTableData.data]);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error: any) {
      console.error("Error generating pandas command:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearTable = () => {
    setUserInput("");
    setTableData(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Upload and Visualize CSV Data</h1>

      <Input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />

      <Button onClick={triggerFileUpload}>
        Upload dataset
      </Button>

      <Textarea
        placeholder="Describe how you want to manipulate the dataset..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="mt-4 border border-gray-300 rounded p-2 w-full max-w-md"
      />

      <div className="flex items-center justify-center m-4 gap-4">
        <Button onClick={handleGenerateCommand}>
          Generate pandas command
        </Button>

        <Button variant="destructive" onClick={handleClearTable}>
          Clear Table
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : tableData ? (
        <Table className="mt-4 w-full max-w-full table-auto border-collapse">
          <TableHeader>
            <TableRow>
              {tableData[0].map((header, index) => (
                <TableCell key={index} className="px-4 py-2 font-semibold bg-gray-200 text-center">
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.slice(1).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="px-4 py-2 text-center">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-gray-600 mt-4">No data to display. Please upload a CSV file.</p>
      )}
    </div>
  );
}
