"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import type { Service } from "@/lib/types";

interface ServicesSectionProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

export function ServicesSection({ services, onSelectService }: ServicesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services & Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/20 p-4 transition-all hover:border-primary/30 hover:bg-muted/40"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{service.name}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {service.duration}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xl font-bold text-primary">
                {formatPrice(service.price)}
              </span>
              <Button
                size="sm"
                className="rounded-full"
                onClick={() => onSelectService(service)}
                disabled={true}
              >
                Book Now
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
