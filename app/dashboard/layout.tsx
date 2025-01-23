import Navbar from "@/components/navbar/navbar";


const DashboardLayout = async ({ children }: {
    children: React.ReactNode
}) => {


  return (
    <div className="h-full relative">
      <main className="h-screen">
        <Navbar/>
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout