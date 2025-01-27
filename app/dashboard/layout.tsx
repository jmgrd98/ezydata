// LAYOUT
import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/Sidebar/Sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      <Sidebar />
      
      <div className="ml-64 h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout;