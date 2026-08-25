import { BarChart3Icon, QrCodeIcon, ZapIcon } from "lucide-react";

import { CreatePollForm } from "@/components/poll/create-poll-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FEATURES = [
  {
    icon: ZapIcon,
    title: "Instant",
    description: "No sign-up required — write a question and go.",
  },
  {
    icon: QrCodeIcon,
    title: "Shareable",
    description: "Send a link or let people scan the QR code.",
  },
  {
    icon: BarChart3Icon,
    title: "Live results",
    description: "Votes appear on the chart in real time.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Ask anything.
              <br />
              Watch the answers roll&nbsp;in&nbsp;live.
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              PollSync turns a question into a shareable poll with real-time
              results — no accounts, no friction.
            </p>
          </div>

          <ul className="flex flex-col gap-4" aria-label="Features">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Create a new poll</CardTitle>
            <CardDescription>
              You will get a share link and a QR code right away.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreatePollForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
