import { redirect } from "next/navigation";

/** The app opens on the dashboard so visitors land straight on the demo. */
export default function RootPage() {
  redirect("/dashboard");
}
