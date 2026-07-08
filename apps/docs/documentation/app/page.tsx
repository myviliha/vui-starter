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
        <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground">
          Reference docs for the Rainbow monorepo
        </p>
      </div>
      <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reference table</CardTitle>
            <CardDescription>
              TanStack Table rendered with shadcn primitives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/reference">View reference</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stack</CardTitle>
            <CardDescription>What powers the monorepo.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="ml-4 list-disc text-sm">
              <li>Next.js 16 · React 19</li>
              <li>Tailwind CSS v4 · shadcn/ui</li>
              <li>TanStack Table</li>
              <li>NestJS · Fastify · DrizzleORM · PostgreSQL</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
