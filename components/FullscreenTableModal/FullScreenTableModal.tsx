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
  setCurrentTab: React.Dispatch<React.SetStateAction<'table' | 'chart'>>
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
  setCurrentTab
}: IFullScreenTableProps) => {
  const { t } = useTranslation();

  return (
    <div className={isFullScreen ? 'fixed inset-0 z-50 bg-white overflow-y-auto flex flex-col' : ''}>
      <div className="w-full flex items-center justify-center gap-5">
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

        <Textarea
          placeholder={t('textareaPlaceholder')}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="mx-auto m-2 border border-gray-300 rounded p-2 w-full max-w-md"
        />

        <Button onClick={handleGenerateCommand} disabled={loading}>
          {t('generate')}
        </Button>

        <Button variant="destructive" onClick={handleClearTable} disabled={loading}>
          {t('clear')}
        </Button>

        <IoIosClose
          className="absolute top-2 right-2 cursor-pointer text-2xl"
          onClick={toggleFullScreen}
        />
      </div>

      <div className="w-full flex-1 flex justify-center items-center overflow-auto">
        {loading ? (
          <Loader />
        ) : tableData && tableData.length > 0 && !graphData ? (
          <div className="flex flex-col relative max-h-[300px] overflow-y-scroll no-scrollbar">
            {!isFullScreen && (
              <Button
                className="place-self-end mb-2"
                variant={"ghost"}
                onClick={toggleFullScreen}
              >
                {t('expandTable')}
              </Button>
            )}
            <Table>
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
          <Tabs value={currentTab} defaultValue="chart">
            <TabsList>
              <TabsTrigger onClick={() => setCurrentTab('table')} value="table">{t('table')}</TabsTrigger>
              <TabsTrigger onClick={() => setCurrentTab('chart')} value="chart">{t('chart')}</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <div className="flex flex-col relative max-h-[300px] overflow-y-scroll no-scrollbar">
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
            </TabsContent>

            <TabsContent value="chart">
              <div className="flex justify-center items-center">
                <Image
                  src={graphData}
                  alt={t('generatedGraph')}
                  width={600}
                  height={400}
                  priority
                />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div>{t('noData')}</div>
        )}
      </div>
    </div>
  );
};

export default FullScreenTableModal;
