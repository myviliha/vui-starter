"use client";

import * as React from "react";
import { MixIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";
import { Demo } from "@/app/_components/showcase";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ComponentsPage() {
  const [progress, setProgress] = React.useState(13);
  React.useEffect(() => {
    const t = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        <SetPageTitle title="Components" icon={MixIcon} />
        <Toaster />

        {/* Action header */}
        <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
          <Breadcrumbs />
          <span className="hidden truncate text-muted-foreground md:block">
            Unmodified shadcn/ui components — auto-themed by theme.css.
          </span>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4">
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              Every component below was added straight from the shadcn CLI
              (<code className="font-mono text-foreground">npx shadcn@latest add …</code>){" "}
              and rendered <strong className="text-foreground">unedited</strong>.
              They inherit Vui&apos;s colors, radius, fonts, borders and dark
              mode from <code className="font-mono text-foreground">theme.css</code>{" "}
              because they read the same design tokens. Add your own{" "}
              <code className="font-mono text-foreground">className</code> to
              override anything.
            </div>

            {/* ---- Overlays (Dialog first — the requested proof) ---- */}
            <Demo
              title="Dialog"
              desc="The proof: an unmodified shadcn dialog, themed by our tokens."
              code={`import { Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Invite teammate</DialogTitle>
      <DialogDescription>Send an invite by email.</DialogDescription>
    </DialogHeader>
    <Input placeholder="you@example.com" />
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      <Button>Send invite</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite teammate</DialogTitle>
                    <DialogDescription>Send an invite by email.</DialogDescription>
                  </DialogHeader>
                  <Input placeholder="you@example.com" />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Send invite</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Demo>

            <Demo title="Alert dialog" desc="Confirm destructive actions.">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently deletes the record.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Demo>

            <Demo title="Sheet" desc="Side panel / drawer.">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine the current view.</SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </Demo>

            <Demo title="Popover / Hover card / Tooltip">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Popover</Button>
                </PopoverTrigger>
                <PopoverContent>Anchored popover content.</PopoverContent>
              </Popover>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">Hover me</Button>
                </HoverCardTrigger>
                <HoverCardContent>Rich preview on hover.</HoverCardContent>
              </HoverCard>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary">Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>A short hint.</TooltipContent>
              </Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Demo>

            {/* ---- Buttons & toggles ---- */}
            <Demo
              title="Button"
              code={`<Button>Default</Button>
<Button variant="secondary" /><Button variant="destructive" />
<Button variant="outline" /><Button variant="ghost" /><Button variant="link" />`}
            >
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </Demo>

            <Demo title="Toggle / Toggle group">
              <Toggle aria-label="Bold">B</Toggle>
              <ToggleGroup type="single" defaultValue="left">
                <ToggleGroupItem value="left">Left</ToggleGroupItem>
                <ToggleGroupItem value="center">Center</ToggleGroupItem>
                <ToggleGroupItem value="right">Right</ToggleGroupItem>
              </ToggleGroup>
            </Demo>

            <Demo title="Toast (Sonner)">
              <Button
                variant="outline"
                onClick={() =>
                  toast("Saved", { description: "Your changes were saved." })
                }
              >
                Show toast
              </Button>
            </Demo>

            {/* ---- Display ---- */}
            <Demo title="Badge">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </Demo>

            <Demo title="Alert">
              <div className="w-full space-y-3">
                <Alert>
                  <AlertTitle>Heads up</AlertTitle>
                  <AlertDescription>This is an informational alert.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Something went wrong.</AlertDescription>
                </Alert>
              </div>
            </Demo>

            <Demo title="Card">
              <Card className="w-72">
                <CardHeader>
                  <CardTitle>Team plan</CardTitle>
                  <CardDescription>$29 / month</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Everything in Pro, plus shared workspaces.
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Upgrade</Button>
                </CardFooter>
              </Card>
            </Demo>

            <Demo title="Avatar / Separator / Skeleton / Progress">
              <Avatar>
                <AvatarFallback>SB</AvatarFallback>
              </Avatar>
              <Separator orientation="vertical" className="h-10" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Progress value={progress} className="w-40" />
            </Demo>

            <Demo title="Aspect ratio">
              <div className="w-64">
                <AspectRatio
                  ratio={16 / 9}
                  className="grid place-items-center rounded-md bg-muted text-sm text-muted-foreground"
                >
                  16 / 9
                </AspectRatio>
              </div>
            </Demo>

            <Demo title="Breadcrumb">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Profile</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Demo>

            {/* ---- Disclosure & navigation ---- */}
            <Demo title="Tabs">
              <Tabs defaultValue="account" className="w-80">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="text-sm text-muted-foreground">
                  Manage your account details.
                </TabsContent>
                <TabsContent value="password" className="text-sm text-muted-foreground">
                  Change your password.
                </TabsContent>
              </Tabs>
            </Demo>

            <Demo title="Accordion">
              <Accordion type="single" collapsible className="w-80">
                <AccordionItem value="a">
                  <AccordionTrigger>What is Vui Starter?</AccordionTrigger>
                  <AccordionContent>A token-driven admin theme.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="b">
                  <AccordionTrigger>Is it free?</AccordionTrigger>
                  <AccordionContent>Yes — MIT licensed.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </Demo>

            <Demo title="Collapsible">
              <Collapsible className="w-80 space-y-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline">Toggle details</Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="rounded-md border border-border p-3 text-sm text-muted-foreground">
                  Hidden content revealed on toggle.
                </CollapsibleContent>
              </Collapsible>
            </Demo>

            <Demo title="Scroll area">
              <ScrollArea className="h-28 w-64 rounded-md border border-border p-3 text-sm">
                {Array.from({ length: 12 }, (_, i) => (
                  <p key={i} className="py-1">
                    Row {i + 1}
                  </p>
                ))}
              </ScrollArea>
            </Demo>

            <Demo title="Command">
              <Command className="w-72 rounded-lg border border-border">
                <CommandInput placeholder="Type a command…" />
                <CommandList>
                  <CommandEmpty>No results.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>Calendar</CommandItem>
                    <CommandItem>Search</CommandItem>
                    <CommandItem>Settings</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </Demo>

            {/* ---- Form inputs (primitives) ---- */}
            <Demo title="Input / Textarea / Label">
              <div className="w-full max-w-sm space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="c-email">Email</Label>
                  <Input id="c-email" placeholder="you@example.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-note">Note</Label>
                  <Textarea id="c-note" placeholder="Write something…" />
                </div>
              </div>
            </Demo>

            <Demo title="Checkbox / Switch / Radio group">
              <label htmlFor="c-terms" className="flex items-center gap-2 text-sm">
                <Checkbox id="c-terms" defaultChecked /> Accept terms
              </label>
              <label htmlFor="c-notify" className="flex items-center gap-2 text-sm">
                <Switch id="c-notify" defaultChecked /> Notifications
              </label>
              <RadioGroup defaultValue="a" className="flex gap-4">
                <label htmlFor="c-opt-a" className="flex items-center gap-2 text-sm">
                  <RadioGroupItem id="c-opt-a" value="a" /> Option A
                </label>
                <label htmlFor="c-opt-b" className="flex items-center gap-2 text-sm">
                  <RadioGroupItem id="c-opt-b" value="b" /> Option B
                </label>
              </RadioGroup>
            </Demo>

            <Demo title="Select">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Pick a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </Demo>

            <Demo title="Slider">
              <Slider defaultValue={[40]} max={100} step={1} className="w-64" />
            </Demo>

            <Demo title="Input OTP">
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </Demo>

            {/* ---- Data ---- */}
            <Demo title="Table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Ada Lovelace</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell className="text-right">
                      <Badge>Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Alan Turing</TableCell>
                    <TableCell>Member</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">Invited</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Demo>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
