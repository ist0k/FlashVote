"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckIcon,
  CopyIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { deletePollAction, setPollStatusAction } from "@/app/actions/polls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { PollStatus } from "@/lib/types/poll";

interface ManagePanelProps {
  slug: string;
  status: PollStatus;
}

export function ManagePanel({ slug, status }: ManagePanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const shareUrl = useMemo(
    () => `${window.location.origin}/p/${slug}`,
    [slug],
  );

  function copyLink() {
    void navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error("Could not copy the link."));
  }

  function changeStatus(next: PollStatus) {
    startTransition(async () => {
      const result = await setPollStatusAction(slug, next);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(next === "closed" ? "Poll closed" : "Poll reopened");
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deletePollAction(slug);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Poll deleted");
      router.push("/polls");
    });
  }

  return (
    <section
      aria-label="Owner controls"
      className="flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground sm:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading font-semibold">You own this poll</h2>
        <Badge variant={status === "open" ? "secondary" : "outline"}>
          {status === "open" ? "Accepting votes" : "Closed"}
        </Badge>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="shrink-0 self-center rounded-lg border bg-white p-2">
          <QRCodeSVG value={shareUrl} size={128} marginSize={1} aria-hidden />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Share this link or let participants scan the QR code.
          </p>
          <div className="flex items-center gap-2">
            <Input readOnly value={shareUrl} aria-label="Share link" onFocus={(event) => event.target.select()} />
            <Button
              variant="outline"
              size="icon"
              onClick={copyLink}
              disabled={isPending}
              aria-label={copied ? "Copied" : "Copy link"}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <a href={`mailto:?subject=Vote%20in%20my%20poll&body=${encodeURIComponent(shareUrl)}`}>
              Share by email
            </a>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t pt-4">
        <Button
          variant={status === "open" ? "destructive" : "default"}
          size="sm"
          disabled={isPending}
          onClick={() => changeStatus(status === "open" ? "closed" : "open")}
        >
          {status === "open" ? "Close poll" : "Reopen poll"}
        </Button>

        <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isPending}>
              <Trash2Icon data-icon="inline-start" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this poll?</DialogTitle>
              <DialogDescription>
                This permanently removes the question, options and all votes.
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" disabled={isPending} onClick={remove}>
                {isPending ? "Deleting…" : "Delete poll"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
