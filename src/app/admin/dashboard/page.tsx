import PageLayout from "@/components/shared/page-layout";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminAddStocks from "./admin-add-stocks";

export const metadata = { title: "Stock Control" };
// export const runtime = "edge";

export default async function page() {
  const user = await getUser();
  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <PageLayout
      title="Stock Dashboard"
      description="Manage stock entries in the database">
      <AdminAddStocks />
    </PageLayout>
  );
}
