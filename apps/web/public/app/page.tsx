import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Public App</h1>
        <p className="text-muted-foreground">
          Next.js · Shadcn UI · Tailwind CSS · TanStack Table
        </p>
      </div>
      <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data table demo</CardTitle>
            <CardDescription>
              TanStack Table example with shadcn UI primitives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/users">View users</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shared design system</CardTitle>
            <CardDescription>
              Reusable components live in <code>@myviliha/vui-ui</code> and are shared
              across every app in the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <code>packages/ui</code>
              <code>pnpm dev</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
