import { useTranslation } from 'react-i18next';
import {
  Pagination,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationContent,
  PaginationLink,
} from '../ui/pagination';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoIosClose } from 'react-icons/io';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Loader } from '@/components/Loader/Loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Image from 'next/image';
import { IoSend } from 'react-icons/io5';
import { IoMic, IoMicOff } from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import i18n from '@/translation';

interface IFullScreenTableProps {
  tableData: string[][];
  toggleFullScreen: () => void;
  isFullScreen: boolean;
  currentPage: number;
  rowsPerPage: number | "all";
  setRowsPerPage: (value: number | "all") => void;
  totalPages: number;
  paginatedData: string[][];
  setCurrentPage: (page: number) => void;
  handleGenerateCommand: () => void;
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  handleClearTable: () => void;
  graphData: string | null;
  currentTab: 'table' | 'chart';
  setCurrentTab: React.Dispatch<React.SetStateAction<'table' | 'chart'>>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const FullScreenTableModal = ({
  tableData,
  paginatedData,
  totalPages,
  rowsPerPage,
  setRowsPerPage,
  isFullScreen,
  toggleFullScreen,
  setCurrentPage,
  currentPage,
  handleGenerateCommand,
  userInput,
  setUserInput,
  loading,
  handleClearTable,
  graphData,
  currentTab,
  setCurrentTab,
  handleKeyPress
}: IFullScreenTableProps) => {
  const { t } = useTranslation();

  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [recognitionError, setRecognitionError] = useState('');

  const tableDataRef = useRef<string[][] | null>(null);
    useEffect(() => {
      tableDataRef.current = tableData;
    }, [tableData]);

  useEffect(() => {
      if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = i18n.language;
    
          recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
              .map(result => result[0])
              .map(result => result.transcript)
              .join('');
            setUserInput(prev => (prev + ' ' + transcript));
          };
    
          recognition.onerror = (event) => {
            console.log('event.error:', event.error);
            setRecognitionError(`Speech recognition error: ${event.error}`);
          };
    
          setRecognition(recognition);
        } else {
          setRecognitionError('Speech recognition not supported in this browser');
          console.error(recognitionError);
        }
      }
    }, []);


  const toggleSpeechRecognition = () => {
      if (!recognition) return;
      
      if (!isRecording) {

          recognition.start();
        setIsRecording(true);
      } else {
        recognition.stop();
        setIsRecording(false);
      }
    };
    recognition?.addEventListener('end', () => {
      setIsRecording(false);
    });

  return (
    <div className={isFullScreen ? 'w-full fixed inset-0 z-50 bg-white overflow-y-auto flex flex-col' : ''}>
      <div className="w-full flex-1 flex justify-center items-center overflow-auto">
        {loading ? (
          <Loader />
        ) : tableData && tableData.length > 0 && !graphData ? (
          <div className="w-full h-full mx-5 flex flex-col relative max-h-[500px] overflow-y-scroll no-scrollbar">
            {!isFullScreen && (
              <Button
                className="place-self-end mb-2"
                variant={"ghost"}
                onClick={toggleFullScreen}
              >
                {t('expandTable')}
              </Button>
            )}
            <Table className='w-full'>
              <TableHeader>
                <TableRow className="bg-gray-200">
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
        ) : graphData ? (
          <Tabs value={currentTab} className="w-full h-full px-4">
            <TabsList>
              <TabsTrigger onClick={() => setCurrentTab('table')} value="table">{t('table')}</TabsTrigger>
              <TabsTrigger onClick={() => setCurrentTab('chart')} value="chart">{t('chart')}</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="w-full h-full mt-4">
              <div className="w-full h-full flex flex-col relative max-h-[500px] overflow-y-scroll no-scrollbar">
                <Table className='w-full'>
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
            </TabsContent>

            <TabsContent value="chart" className="w-full h-full mt-4">
              <div className="flex justify-center items-center h-full w-full">
                <Image
                  src={graphData}
                  alt={t('generatedGraph')}
                  width={800}
                  height={600}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div>{t('noData')}</div>
        )}
      </div>

      <div className="w-full flex items-center justify-center gap-5 p-4 border-t">
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

        <div className='w-full flex items-center justify-center gap-5'>
          <Textarea
            placeholder={t('textareaPlaceholder')}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="mt-4 border border-gray-300 rounded p-2 w-full max-w-3xl"
            onKeyDown={handleKeyPress}
          />
         <div className="flex items-center gap-2">
          {loading ? <Loader /> : <IoSend className='cursor-pointer' onClick={handleGenerateCommand} />}
          <button
             type="button"
             onClick={toggleSpeechRecognition}
             disabled={!recognition || loading}
             className={`p-2 rounded-full ${
               isRecording ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
             }`}
           >
             {isRecording ? <IoMicOff size={20} /> : <IoMic size={20} />}
           </button>
         </div>
        </div>

        <Button variant="destructive" onClick={handleClearTable} disabled={loading}>
          {t('clear')}
        </Button>

        <IoIosClose
          className="absolute top-2 right-2 cursor-pointer text-2xl"
          onClick={toggleFullScreen}
        />
      </div>
    </div>
  );
};

export default FullScreenTableModal;