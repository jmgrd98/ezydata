'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/Loader/Loader';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';
import i18n from "@/translation";
import Flag from 'react-world-flags';


export default function Home() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const [tableData, setTableData] = useState<string[][] | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number | 'all'>(5);
  const [fadeIn, setFadeIn] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      try {
        setLoading(true);
        const text = await file.text();
        const rows = text.split('\n').map((row) => row.split(','));
        setTableData(rows);
        setCurrentPage(1);
        setTimeout(() => setFadeIn(true), 100);
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
    } catch (error) {
      const errorAsError = error as Error;
      console.error("Error generating pandas command:", errorAsError);
      toast({
        title: "Error",
        description: errorAsError.message || "An unexpected error occurred.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearTable = () => {
    setUserInput("");
    setTableData(null);
    setFadeIn(false);
    setCurrentPage(1);
  };

  const totalPages = tableData
    ? rowsPerPage === 'all'
      ? 1
      : Math.ceil((tableData.length - 1) / rowsPerPage)
    : 0;

  const paginatedData = tableData
    ? rowsPerPage === 'all'
      ? tableData.slice(1)
      : tableData.slice((currentPage - 1) * rowsPerPage + 1, currentPage * rowsPerPage + 1)
    : null;

  return (
    <I18nextProvider i18n={i18n}>
    <div className="flex flex-col items-center justify-center p-4 h-screen">
      <Toaster />
      <header className="w-full flex items-center justify-between">
        <p className="text-3xl font-bold">AIDA</p>
        <Select
          onValueChange={(value) => changeLanguage(value)}
          defaultValue={i18n.language}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="English" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">
              <span className="flex items-center gap-2">
                <Flag code="US" style={{ width: 20, height: 15 }} />
                <span>English</span>
              </span>
            </SelectItem>
            <SelectItem value="pt">
              <span className="flex items-center gap-2">
                <Flag code="BR" style={{ width: 20, height: 15 }} />
                <span>Português</span>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </header>


      <main  className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto h-full max-h-screen">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>

      <Input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />

      <Button size={'lg'} onClick={triggerFileUpload}>
        Upload dataset
      </Button>

      {tableData && (
        <div
            className={`text-center flex flex-col items-center transition-opacity duration-700 ease-in-out ${
              fadeIn ? 'opacity-100' : 'opacity-0'
            }`}
          >
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

            <Select onValueChange={(value) => setRowsPerPage(value === 'all' ? 'all' : parseInt(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      

      {loading ? (
        <Loader />
      ) : tableData ? (
        <div className={`text-center flex flex-col items-center transition-opacity duration-700 ease-in-out ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}>
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
              {paginatedData?.map((row, rowIndex) => (
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
          {rowsPerPage !== 'all' && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
                {/* Render first page */}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {/* Add ellipsis if needed */}
                {currentPage > 4 && totalPages > 10 && <PaginationEllipsis />}
                {/* Render dynamic page range */}
                {Array.from(
                  { length: Math.min(7, totalPages) },
                  (_, i) => currentPage - 3 + i
                )
                  .filter((page) => page > 1 && page < totalPages)
                  .map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage ? "font-bold" : ""}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                {currentPage < totalPages - 3 && totalPages > 10 && <PaginationEllipsis />}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      ) : (
        // <p className="text-gray-600 mt-4">No data to display. Please upload a CSV file.</p>
        <></>
      )}
      </main>
    </div>
    </I18nextProvider>
  );
}
