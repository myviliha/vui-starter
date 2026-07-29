"use client";

import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@viliha/vui-ui/input-otp";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import {
  InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator,
} from "@viliha/vui-ui/input-otp";

export function Example() {
  const [value, setValue] = React.useState("");
  return (
    <InputOTP maxLength={6} value={value} onChange={setValue}>
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
  );
}`;

export default function Page() {
  const [value, setValue] = React.useState("");
  return (
    <article>
      <ComponentDocHeader slug="input-otp" />

      <ComponentPreview code={usage}>
        <InputOTP maxLength={6} value={value} onChange={setValue}>
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
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="input-otp" />

      <H2>Usage</H2>
      <P>
        Group slots however you like and drop an <code>InputOTPSeparator</code>{" "}
        between groups. The caret animation ships in theme.css.
      </P>
      <CodeBlock title="input-otp-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="input-otp" />
    </article>
  );
}
