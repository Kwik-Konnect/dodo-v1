"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PortfolioItem } from "@/lib/types";

interface PortfolioSectionProps {
  portfolio: PortfolioItem[];
}

export function PortfolioSection({ portfolio }: PortfolioSectionProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  if (portfolio.length === 0) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {portfolio.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative aspect-square overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />
                <div className="absolute inset-0 flex items-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-sm font-medium text-white">
                    {item.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {selectedItem?.title || "Portfolio item"}
          </DialogTitle>
          {selectedItem && (
            <div>
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedItem.title}
                </h3>
                {selectedItem.description && (
                  <p className="mt-2 text-muted-foreground">
                    {selectedItem.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
