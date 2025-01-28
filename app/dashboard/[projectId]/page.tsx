// app/dashboard/[projectId]/page.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { db } from '@/firebase/db'
import { doc, getDoc } from 'firebase/firestore'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Loader } from '@/components/Loader/Loader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import FullScreenTableModal from '@/components/FullscreenTableModal/FullScreenTableModal'
import { FaExpandAlt } from "react-icons/fa"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Textarea } from '@/components/ui/textarea'
import { BsStars } from 'react-icons/bs'
import { IoMdRefresh } from 'react-icons/io'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslation } from 'react-i18next'
import { TiUpload } from 'react-icons/ti'
import { Input } from '@/components/ui/input'

interface IProjectPageProps {
  params: {
    projectId: string
  }
  
}

export default function ProjectPage({ params }: IProjectPageProps) {
  const { projectId } = params
  const { user } = useUser()
  const { toast } = useToast()
  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [tableData, setTableData] = useState<string[][] | null>(null)
  const [graphData, setGraphData] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState<'table' | 'chart'>('table')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState<number | 'all'>(5)
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [userInput, setUserInput] = useState<string>("");
  const [originalTableData, setOriginalTableData] = useState<string[][] | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const projectRef = doc(db, 'projects', projectId)
        const projectSnap = await getDoc(projectRef)

        if (!projectSnap.exists()) throw new Error('Project not found')
        
        const projectData = projectSnap.data()
        if (projectData.ownerId !== user?.id) throw new Error('Unauthorized access')

        if (projectData.table) {
          setTableData(JSON.parse(projectData.table))
        }
        if (projectData.chart) {
          setGraphData(projectData.chart)
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project')
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    if (projectId && user) fetchProject()
  }, [error, toast, user, projectId, user?.id]);

  const totalPages = tableData && tableData.length > 0 
    ? rowsPerPage === 'all' 
      ? 1 
      : Math.ceil((tableData.length - 1) / rowsPerPage)
    : 0

  const paginatedData = rowsPerPage === 'all'
    ? tableData?.slice(1)
    : tableData?.slice((currentPage - 1) * rowsPerPage + 1, currentPage * rowsPerPage + 1)

  if (loading) return <Loader />
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
    
      try {
        setLoading(true);
        const text = await file.text();
        console.log('Raw file content:', text);
  
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          const rows = text.split('\n').map((row) => row.split(','));
          setOriginalTableData(rows);
          setTableData(rows);
        }
        else if (file.type === 'application/json' || file.name.endsWith('.json')) {
          const trimmedText = text.trim();
          console.log('Trimmed JSON content:', trimmedText);
  
          if (!/^[\{\[]/.test(trimmedText)) {
            throw new Error(t('error.jsonInvalidStructure') + ' - ' + trimmedText.slice(0, 50) + '...');
          }
  
          try {
            const jsonData = JSON.parse(trimmedText);
            console.log('Parsed JSON:', jsonData);
            
            if (!Array.isArray(jsonData)) {
              throw new Error(t('error.jsonNotArray') + ` - Type received: ${typeof jsonData}`);
            }
            if (jsonData.length === 0) {
              throw new Error(t('error.jsonEmpty'));
            }
  
            const allKeys = jsonData.reduce((keys: string[], item) => {
              if (typeof item !== 'object' || item === null) {
                throw new Error(t('error.jsonInvalidObject') + ` - Item: ${JSON.stringify(item)}`);
              }
              Object.keys(item).forEach(key => {
                if (!keys.includes(key)) keys.push(key);
              });
              return keys;
            }, []);
  
            const rows = jsonData.map(obj => allKeys.map(key => 
              obj[key] !== undefined ? String(obj[key]) : ''
            ));
            
            const tableData = [allKeys, ...rows];
            setOriginalTableData(tableData);
            setTableData(tableData);
          } catch (parseError) {
            if (parseError instanceof SyntaxError) {
              console.log('Attempting CSV fallback...');
              try {
                const rows = text.split('\n').map((row) => row.split(','));
                setOriginalTableData(rows);
                setTableData(rows);
                toast({
                  title: t('notice.fileTypeFallback'),
                  description: t('notice.treatedAsCSV'),
                  duration: 3000,
                });
                return;
              } catch {
                throw new Error(t('error.bothParsingFailed'));
              }
            }
            throw parseError;
          }
        } else {
          throw new Error(t('error.invalidFileType'));
        }
  
        setCurrentPage(1);
        // setTimeout(() => setFadeIn(true), 100);
      } catch (error) {
        console.error('Full error details:', error);
        toast({
          title: t('error.readError'),
          description: error instanceof Error ? 
            `${error.message} (${file.name})` : 
            t('error.unexpected'),
          duration: 5000,
        });
        setTableData(null);
        setOriginalTableData(null);
      } finally {
        setLoading(false);
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
      
      const isChartRequest = /chart|graph|plot|visualize|gráfico|grafico/i.test(userInput);
      const endpoint = isChartRequest
        ? `${process.env.NEXT_PUBLIC_API_ROOT_URL}/generate-chart/`
        : `${process.env.NEXT_PUBLIC_API_ROOT_URL}/process-command/`;
  
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

      console.log('RESULT', result)
  
      if (result.type === "table") {
        setCurrentTab('table');
        const parsedData = JSON.parse(result.data);
        if (parsedData?.columns && parsedData?.data) {
          const updatedTableData = [parsedData.columns, ...parsedData.data];
          setTableData(updatedTableData);
        }
      } else if (result.type === "graph") {
        setCurrentTab('chart');
        setGraphData(`data:image/png;base64,${result.graph}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error generating command',
        description: error instanceof Error ? error.message : 'Unknown error',
        duration: 5000,
    });
    } finally {
      setLoading(false);
    }
  };

  const handleClearTable = () => {
    setUserInput("");
    setTableData(originalTableData);
    setCurrentPage(1);
  };

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  return (
    <div className="flex max-w-full flex-col items-center justify-center p-4 h-full">
      <Toaster />
      <main className="flex flex-col items-center justify-evenly w-full max-w-3xl mx-auto h-full max-h-full">
        <div
          className={`mx-5 text-center flex flex-col items-center transition-opacity duration-700 ease-in-out`}
        >
          <div className='flex flex-col items-center'>
            <Input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            {!tableData && <Button size="xl" onClick={triggerFileUpload}>
              <TiUpload width={40} height={40} />
              {t('upload')}
            </Button>}

            <div className="flex flex-col items-center">
              <Input
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              {!tableData && (
                <Button size="xl" onClick={triggerFileUpload}>
                  <TiUpload width={40} height={40} />
                  {t('upload')}
                </Button>
              )}
            </div>
          </div>
          </div>

          {loading ? (
            <Loader />
          ) : tableData && !isFullScreen && !graphData ? (
            <>
              <div className="relative max-h-[300px] w-full flex flex-col overflow-auto">
                <Button 
                  className='align-self-end w-fit mb-2 z-10' 
                  variant={'ghost'} 
                  onClick={toggleFullScreen}
                  aria-label={t('expandTable')}
                >
                  {t('expandTable')}<FaExpandAlt />
                </Button>
                <Table className="min-w-full">
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
                          <TableCell key={`${rowIndex}-${cellIndex}`}>{cell}</TableCell>
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
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger onClick={() => setCurrentTab('table')} value="table">{t('table')}</TabsTrigger>
                    <TabsTrigger onClick={() => setCurrentTab('chart')} value="chart">{t('chart')}</TabsTrigger>
                  </TabsList>
                  
                    <Button 
                      className='w-fit mb-2 z-10' 
                      variant={'ghost'} 
                      onClick={toggleFullScreen}
                      aria-label={t('expandTable')}
                    >
                      {t('expandTable')}<FaExpandAlt />
                    </Button>
                  
                </div>
                <TabsContent value='table'>
                    <Table className="min-w-full">
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

                <TabsContent value="chart">
                  {graphData && (
                    <div className="flex justify-center items-center">
                      <Image
                        src={graphData}
                        alt={t('generatedGraph')}
                        width={600}
                        height={400}
                        priority
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}

{tableData && (
                <div className="text-center flex flex-col items-center">
                  <Textarea
                    placeholder={t('textareaPlaceholder')}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="mt-4 border border-gray-300 rounded p-2 w-full max-w-md"
                  />

                  <div className="flex items-center justify-center m-4 gap-4">
                    <Button onClick={handleGenerateCommand} disabled={loading}>
                      <BsStars />
                      {t('generate')}
                    </Button>

                    <Button variant="destructive" onClick={handleClearTable}>
                      <IoMdRefresh />
                      {t('clear')}
                    </Button>

                    <Select
                      onValueChange={(value) => setRowsPerPage(value === 'all' ? 'all' : parseInt(value))}
                    >
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
  )
}