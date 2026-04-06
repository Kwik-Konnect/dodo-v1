import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import type { Professional } from "@/lib/types";

interface AboutSectionProps {
  professional: Professional;
}

export function AboutSection({ professional }: AboutSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bio */}
        <p className="text-pretty leading-relaxed text-muted-foreground">
          {professional.bio}
        </p>

        {/* Skills */}
        <div>
          <h4 className="mb-3 font-medium text-foreground">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {professional.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="rounded-full px-3 py-1"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-start gap-3 rounded-xl bg-muted p-4">
          <CalendarDays className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h4 className="font-medium text-foreground">Availability</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {professional.availability}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
