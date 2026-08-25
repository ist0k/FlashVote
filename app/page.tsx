"use client";

import { BarChart3Icon, QrCodeIcon, ZapIcon } from "lucide-react";

import { CreatePollForm } from "@/components/poll/create-poll-form";
import { useI18n } from "@/components/i18n-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const { dict } = useI18n();

  const features = [
    { icon: ZapIcon, title: dict.landing.instant.title, text: dict.landing.instant.text },
    { icon: QrCodeIcon, title: dict.landing.shareable.title, text: dict.landing.shareable.text },
    { icon: BarChart3Icon, title: dict.landing.live.title, text: dict.landing.live.text },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {dict.landing.heading}
              <br />
              {dict.landing.headingAccent}
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">{dict.landing.subtitle}</p>
          </div>

          <ul className="flex flex-col gap-4" aria-label={dict.landing.featuresLabel}>
            {features.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-transform duration-200 group-hover:scale-110">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{dict.landing.cardTitle}</CardTitle>
            <CardDescription>{dict.landing.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <CreatePollForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
