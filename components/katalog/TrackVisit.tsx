"use client";
import { useEffect } from "react";
import { incrementVisitors } from "@/lib/katalog/actions";

export default function TrackVisit({ productId }: { productId: string }) {
  useEffect(() => {
    incrementVisitors(productId);
  }, []);

  return null;
}
