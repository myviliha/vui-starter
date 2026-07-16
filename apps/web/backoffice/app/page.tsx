import { redirect } from "next/navigation";

/** The app opens on the sign-in page. */
export default function RootPage() {
  redirect("/auth/signin");
}
