// app/dashboard/[projectId]/page.tsx
'use client'
import { useEffect, useState } from 'react'
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

export default function ProjectPage({ params }: { params: { projectId: string } }) {
  const { projectId } = params
  const { user } = useUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Table and chart states
  const [tableData, setTableData] = useState<string[][] | null>(null)
  const [graphData, setGraphData] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState<'table' | 'chart'>('table')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState<number | 'all'>(5)
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const projectRef = doc(db, 'projects', projectId)
        const projectSnap = await getDoc(projectRef)

        if (!projectSnap.exists()) throw new Error('Project not found')
        
        const projectData = projectSnap.data()
        if (projectData.ownerId !== user?.id) throw new Error('Unauthorized access')

        // Set table and chart data from project document
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
  }, [projectId, user?.id])

  // Pagination calculations
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

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <Toaster />
      <main className="flex flex-col items-center justify-evenly w-full max-w-3xl mx-auto h-full max-h-full">
        {tableData && !isFullScreen && (
          <Tabs value={currentTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-xs">
              <TabsTrigger value="table" onClick={() => setCurrentTab('table')}>
                Table
              </TabsTrigger>
              <TabsTrigger value="chart" onClick={() => setCurrentTab('chart')}>
                Chart
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <div className="relative max-h-[300px] w-full overflow-auto">
                <Button 
                  className="absolute right-0 top-0 mb-2 z-10" 
                  variant="ghost" 
                  onClick={() => setIsFullScreen(true)}
                >
                  <FaExpandAlt className="mr-2" /> Expand Table
                </Button>
                <Table className="min-w-full">
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
              </div>
              
              {rowsPerPage !== "all" && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </TabsContent>

            <TabsContent value="chart">
              {graphData && (
                <div className="flex justify-center items-center">
                  <Image
                    src={graphData}
                    alt="Project chart"
                    width={800}
                    height={600}
                    className="rounded-lg border"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {isFullScreen && tableData && (
          <FullScreenTableModal
            tableData={tableData}
            paginatedData={paginatedData ?? []}
            totalPages={totalPages}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            setCurrentPage={setCurrentPage}
            toggleFullScreen={() => setIsFullScreen(!isFullScreen)}
            isFullScreen={isFullScreen}
            graphData={graphData}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            userInput=''
            setUserInput={() => {}}
            handleGenerateCommand={() => {}}
            handleClearTable={() => {}}
            loading={false}
          />
        )}
      </main>
    </div>
  )
}