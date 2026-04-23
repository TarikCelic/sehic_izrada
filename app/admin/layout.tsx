import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import {Toaster} from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminLayoutClient>
        {children}
    </AdminLayoutClient>;
}