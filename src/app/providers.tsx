'use client'

import { ThemeProvider } from 'next-themes'
import {ClerkProvider} from "@clerk/nextjs";
import {AntdRegistry} from "@ant-design/nextjs-registry";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <AntdRegistry>
      <ClerkProvider>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </ClerkProvider>
      </AntdRegistry>
  )
}
