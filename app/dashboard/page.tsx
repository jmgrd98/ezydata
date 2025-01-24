'use client';

import React, { useState, useRef, useEffect } from 'react';
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
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from "@/translation";
import FullScreenTableModal from '@/components/FullscreenTableModal/FullScreenTableModal';
import { FaExpandAlt } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

export default function Home() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const [tableData, setTableData] = useState<string[][] | null>(null);
  const [originalTableData, setOriginalTableData] = useState<string[][] | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number | 'all'>(5);
  const [fadeIn, setFadeIn] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [graphData, setGraphData] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'table' | 'chart'>("table");

  let parsedGraphData: { name: string; value: number }[] | null = null;

  if (graphData) {
    try {
      parsedGraphData = JSON.parse(graphData); // Parse graphData
    } catch (error) {
      console.error("Error parsing graph data:", error);
    }
  }


  const totalPages =
    tableData && tableData.length > 0
      ? rowsPerPage === 'all'
        ? 1
        : Math.ceil((tableData.length - 1) / rowsPerPage)
      : 0;

  const paginatedData =
    rowsPerPage === 'all'
      ? tableData?.slice(1)
      : tableData?.slice((currentPage - 1) * rowsPerPage + 1, currentPage * rowsPerPage + 1);

  useEffect(() => {
    detectLanguage();
  }, []);

  useEffect(() => {
    console.log('PARSED', parsedGraphData)
  }, [parsedGraphData])

  const detectLanguage = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      const countryCode = data.country_code;
      const languageMap: Record<string, string> = {
        US: "en",
        BR: "pt",
        // Add more mappings as needed
      };
  
      const language = languageMap[countryCode] || "en";
      i18n.changeLanguage(language);
    } catch (error) {
      console.error("Error detecting location:", error);
    }
  };

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      try {
        setLoading(true);
        const text = await file.text();
        const rows = text.split('\n').map((row) => row.split(','));
        setOriginalTableData(rows);
        setTableData(rows);
        setCurrentPage(1);
        setTimeout(() => setFadeIn(true), 100);
      } catch (error) {
        console.error(t('error.readFile'), error);
        setTableData(null);
        setOriginalTableData(null);
      } finally {
        setLoading(false);
      }
    } else {
      console.error(t('error.invalidFileType'));
      setTableData(null);
      setOriginalTableData(null);
    }
  };

  const handleGenerateCommand = async () => {
  if (!tableData) {
    toast({
      title: t('toast.noDatasetTitle'),
      description: t('toast.noDatasetDesc'),
      duration: 5000,
    });
    return;
  }

  if (!userInput) {
    toast({
      title: t('toast.noPromptTitle'),
      description: t('toast.noPromptDesc'),
      duration: 5000,
    });
    return;
  }

  setLoading(true);

  try {
    const csvData = tableData.map((row) => row.join(',')).join('\n');

    // Determine the endpoint based on keywords
    const isChartRequest = /chart|graph|plot|visualize/i.test(userInput);
    // const endpoint = isChartRequest
    //   ? 'http://localhost:8000/generate-chart/'
    //   : 'http://localhost:8000/process-command/';
    const endpoint = isChartRequest
    ? 'https://aida-backend.onrender.com/generate-chart/'
    : 'https://aida-backend.onrender.com/process-command/';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv_data: csvData, instruction: userInput }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail);
    }

    const result = await response.json();

    if (result.type === "table") {
      setCurrentTab('table');
      const parsedData = JSON.parse(result.data);
      if (parsedData?.columns && parsedData?.data) {
        const updatedTableData = [parsedData.columns, ...parsedData.data];
        setTableData(updatedTableData);
      } else {
        throw new Error(t('error.unexpectedResponse'));
      }
    } else if (result.type === "graph") {
      setCurrentTab('chart')
      const graphData = result.graph;
      setGraphData(`data:image/png;base64,${graphData}`);
    } else {
      throw new Error(t('error.unexpectedResponse'));
    }
  } catch (error) {
    console.error('Error generating pandas command:', error);
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : t('error.unexpected'),
      duration: 5000,
    });
  } finally {
    setLoading(false);
  }
};


  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleClearTable = () => {
    setUserInput("");
    setTableData(originalTableData);
    setCurrentPage(1);
    setFadeIn(false);
    
    setTimeout(() => setFadeIn(true), 100);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div className="flex flex-col items-center justify-center p-4 h-full">
        <Toaster />
        <main className="flex flex-col items-center justify-evenly w-full max-w-3xl mx-auto h-full max-h-full">

          <div className='flex flex-col items-center'>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />

            <Button size="xl" onClick={triggerFileUpload}>
              {t('upload')}
            </Button>

            <div
                className={`text-center flex flex-col items-center transition-opacity duration-700 ease-in-out ${
                  fadeIn ? 'opacity-100' : 'opacity-0'
                }`}
              >
              <Textarea
                placeholder={t('textareaPlaceholder')}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="mt-4 border border-gray-300 rounded p-2 w-full max-w-md"
              />

              <div className="flex items-center justify-center m-4 gap-4">
                <Button onClick={handleGenerateCommand} disabled={loading}>
                  {t('generate')}
                </Button>

                <Button variant="destructive" onClick={handleClearTable}>
                  {t('clear')}
                </Button>

                <Select onValueChange={(value) => setRowsPerPage(value === 'all' ? 'all' : parseInt(value))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('rowsPerPage')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="all">{t('all')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
      </div>

          {loading ? (
            <Loader />
          ) : tableData && !isFullScreen && !graphData ? (
            <>
              <div className="flex flex-col relative max-h-[300px] overflow-y-scroll no-scrollbar">
                <Button className='place-self-end mb-2' variant={'ghost'} onClick={toggleFullScreen}>{t('expandTable')}<FaExpandAlt /> </Button>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-gray-200'>
                      {tableData[0].map((header, index) => (
                        <TableCell key={index} className="font-semibold">
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData?.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div>
                {rowsPerPage !== "all" && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                  {currentPage > 4 && totalPages > 10 && <PaginationEllipsis />}
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
                    <PaginationLink href="#" onClick={() => setCurrentPage(totalPages)}>
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
          </>
          ) : graphData && (
            <>
            <Tabs value={currentTab} defaultValue="chart">
              <TabsList>
                <TabsTrigger onClick={() => setCurrentTab('table')} value="table">{t('table')}</TabsTrigger>
                <TabsTrigger onClick={() => setCurrentTab('chart')} value="chart">{t('chart')}</TabsTrigger>
              </TabsList>

              <TabsContent onChange={() => setCurrentTab('table')} value="table">
                <div className="flex flex-col relative max-h-[300px] overflow-y-scroll no-scrollbar">
                  <Button className="place-self-end mb-2" variant={'ghost'} onClick={toggleFullScreen}>
                    {t('expandTable')}<FaExpandAlt />
                  </Button>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-200">
                        {tableData![0].map((header, index) => (
                          <TableCell key={index} className="font-semibold">
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData?.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  {rowsPerPage !== "all" && (
                    <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                      {currentPage > 4 && totalPages > 10 && <PaginationEllipsis />}
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
                        <PaginationLink href="#" onClick={() => setCurrentPage(totalPages)}>
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
              </TabsContent>

              <TabsContent onChange={() => setCurrentTab('chart')} value="chart">
                {graphData && (
                  <div className="flex justify-center items-center">
                    <Image
                      src={graphData}
                      alt={t('generatedGraph')}
                      width={800}
                      height={600}
                      priority
                    />

                  {/* <Card className="flex flex-col">
                        <CardHeader className="items-center pb-0">
                          <CardTitle>Pie Chart - Donut with Text</CardTitle>
                          <CardDescription>January - June 2024</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0">
                          <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square max-h-[250px]"
                          >
                            <PieChart>
                              <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                              />
                              <Pie
                                data={parsedGraphData}
                                dataKey="visitors"
                                nameKey="browser"
                                innerRadius={60}
                                strokeWidth={5}
                              >
                                <Label
                                  content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                      return (
                                        <text
                                          x={viewBox.cx}
                                          y={viewBox.cy}
                                          textAnchor="middle"
                                          dominantBaseline="middle"
                                        >
                                          <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                          >
                                            teste
                                          </tspan>
                                          <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                          >
                                            Visitors
                                          </tspan>
                                        </text>
                                      )
                                    }
                                  }}
                                />
                              </Pie>
                            </PieChart>
                          </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 text-sm">
                          <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                          </div>
                          <div className="leading-none text-muted-foreground">
                            Showing total visitors for the last 6 months
                          </div>
                        </CardFooter>
                      </Card> */}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}


          {isFullScreen && tableData && (
            <FullScreenTableModal
              handleGenerateCommand={handleGenerateCommand}
              tableData={tableData}
              paginatedData={paginatedData ?? []}
              totalPages={totalPages}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              setCurrentPage={setCurrentPage}
              toggleFullScreen={toggleFullScreen}
              isFullScreen={isFullScreen}
              userInput={userInput}
              setUserInput={setUserInput}
              loading={loading}
              handleClearTable={handleClearTable}
              graphData={graphData}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
          )}

        </main>
      </div>
    </I18nextProvider>
  );
}
