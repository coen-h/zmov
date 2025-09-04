import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "info - zmov",
};

export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}