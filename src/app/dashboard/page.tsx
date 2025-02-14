import DashboardNav from '@/components/DashboardNav';

export default function DashboardLayout(
    // {
    //    children,
    // }: {
    //     children: React.ReactNode
    // }
) {
    return (
        <div>
            <DashboardNav />
            <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6">
                todo: dashboard content
            </main>
        </div>
    );
}