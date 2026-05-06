import Navbar from "@/app/components/Navbar/navbar";
import Sidebar from "@/app/components/Sidebar/sidebar";
import SearchBar from "@/app/components/Search/searchbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Content */}
            <div className="flex-1 flex flex-col">
                <Navbar />

                <SearchBar />


                <main className="p-6 bg-gray-100 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}