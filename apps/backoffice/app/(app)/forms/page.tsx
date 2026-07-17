"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";
import { Demo } from "@/app/_components/showcase";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";

const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "in", label: "India" },
  { value: "de", label: "Germany" },
  { value: "jp", label: "Japan" },
];

const schema = z.object({
  username: z.string().min(2, "At least 2 characters."),
  email: z.string().email("Enter a valid email."),
  bio: z.string().max(160, "160 characters max.").optional(),
  role: z.string().min(1, "Pick a role."),
  country: z.string().min(1, "Pick a country."),
  dob: z.date({ message: "Pick a date." }),
  plan: z.enum(["free", "pro", "team"], { message: "Choose a plan." }),
  volume: z.number().min(0).max(100),
  marketing: z.boolean(),
  terms: z.boolean().refine((v) => v, "You must accept the terms."),
  pin: z.string().length(6, "Enter all 6 digits."),
});

type FormValues = z.infer<typeof schema>;

export default function FormsPage() {
  const [comboOpen, setComboOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      role: "",
      country: "",
      plan: undefined,
      volume: 50,
      marketing: true,
      terms: false,
      pin: "",
    },
  });

  function onSubmit(values: FormValues) {
    toast("Form submitted", {
      description: (
        <pre className="mt-1 max-h-48 overflow-auto rounded bg-muted p-2 text-xs">
          {JSON.stringify(values, null, 2)}
        </pre>
      ),
    });
  }

  return (
    <div className="flex h-full flex-col">
      <SetPageTitle title="Forms" icon={Pencil2Icon} />
      <Toaster />

      {/* Action header */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
        <Breadcrumbs />
        <span className="hidden truncate text-muted-foreground md:block">
          shadcn/ui Form — react-hook-form + Zod, validated inline.
        </span>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            One <code className="font-mono text-foreground">Form</code> wiring
            every shadcn field type — input, textarea, select, combobox, date
            picker, radio, checkbox, switch, slider and OTP — with{" "}
            <strong className="text-foreground">Zod</strong> validation and
            inline <code className="font-mono text-foreground">FormMessage</code>{" "}
            errors. Submit with empty fields to see validation.
          </div>

          <Demo title="Everything form" desc="Fully validated, themed by tokens.">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid w-full grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="ada" {...field} />
                      </FormControl>
                      <FormDescription>Your public display name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about yourself" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="administrator">Administrator</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Country</FormLabel>
                      <Popover open={comboOpen} onOpenChange={setComboOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? COUNTRIES.find((c) => c.value === field.value)?.label
                                : "Select country"}
                              <ChevronsUpDown className="ml-2 size-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Search country…" />
                            <CommandList>
                              <CommandEmpty>No country found.</CommandEmpty>
                              <CommandGroup>
                                {COUNTRIES.map((c) => (
                                  <CommandItem
                                    key={c.value}
                                    value={c.label}
                                    onSelect={() => {
                                      form.setValue("country", c.value, {
                                        shouldValidate: true,
                                      });
                                      setComboOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 size-4",
                                        field.value === c.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {c.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Searchable combobox.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 size-4" />
                              {field.value ? format(field.value, "PPP") : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-6"
                        >
                          {["free", "pro", "team"].map((p) => (
                            <label key={p} className="flex items-center gap-2 text-sm capitalize">
                              <RadioGroupItem value={p} /> {p}
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="volume"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Volume — {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          max={100}
                          step={1}
                          onValueChange={(v) => field.onChange(v[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Verification code</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                          <InputOTPGroup>
                            {Array.from({ length: 6 }, (_, i) => (
                              <InputOTPSlot key={i} index={i} />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketing"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-border p-3 sm:col-span-2">
                      <div className="space-y-0.5">
                        <FormLabel>Marketing emails</FormLabel>
                        <FormDescription>Product news and offers.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2 sm:col-span-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Accept terms and conditions</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 sm:col-span-2">
                  <Button type="submit">Submit</Button>
                  <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </Demo>
        </div>
      </div>
    </div>
  );
}
