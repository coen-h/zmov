import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "home - zmov",
};

export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}