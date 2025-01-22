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
import { useState } from 'react';
import { Button } from '../ui/button';

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
  handleGenerateCommand
}: IFullScreenTableProps) => {
  const { t } = useTranslation();
  const [userInput, setUserInput] = useState<string>("");

  return (
    <div className={isFullScreen ? 'fixed inset-0 z-50 bg-white overflow-y-auto flex flex-col' : ''}>
      <div className='w-full flex items-center justify-center gap-5'>
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

        <Button onClick={handleGenerateCommand}>
          {t('generate')}
        </Button>

        <IoIosClose
          className="absolute top-2 right-2 cursor-pointer text-2xl"
          onClick={toggleFullScreen}
        />
      </div>


      <div className="flex-1 overflow-auto">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              {tableData[0].map((header, index) => (
                <TableCell
                  key={index}
                  className="px-4 py-2 font-semibold bg-gray-200 text-center"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
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
      </div>

      {rowsPerPage !== "all" && (
        <Pagination className="mt-4">
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
  );
};

export default FullScreenTableModal;
