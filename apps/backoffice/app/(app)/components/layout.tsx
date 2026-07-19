import { pageMeta } from "@/lib/seo";

// The page is a Client Component and can't export metadata, so it lives here.
export const metadata = pageMeta("/components");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
