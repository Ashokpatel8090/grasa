"use client";

import { usePathname } from "next/navigation";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function ChatbotWrapper() {
  const pathname = usePathname();

  // hide on these routes
  const hiddenRoutes = ["/cart", "/checkout"];

  const shouldHide = hiddenRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (shouldHide) return null;

  return <ChatbotWidget />;
}