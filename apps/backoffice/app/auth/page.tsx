import { redirect } from "next/navigation";

/** The auth section lands on sign-in. */
export default function AuthIndex() {
  redirect("/auth/signin");
}
