"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { CheckIcon, CopyIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { deletePollAction, setPollStatusAction } from "@/app/actions/polls";
import { useI18n } from "@/components/i18n-provider";
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
  const { dict } = useI18n();
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
        toast.success(dict.manage.toasts.linkCopied);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error(dict.manage.toasts.copyFailed));
  }

  function changeStatus(next: PollStatus) {
    startTransition(async () => {
      const result = await setPollStatusAction(slug, next);
      if (!result.ok) {
        toast.error(dict.form.errors.generic);
        return;
      }
      toast.success(
        next === "closed" ? dict.manage.toasts.closed : dict.manage.toasts.reopened,
      );
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deletePollAction(slug);
      if (!result.ok) {
        toast.error(dict.form.errors.generic);
        return;
      }
      toast.success(dict.manage.toasts.deleted);
      router.push("/polls");
    });
  }

  const emailHref = `mailto:?subject=${encodeURIComponent(
    dict.manage.emailSubject,
  )}&body=${encodeURIComponent(shareUrl)}`;

  return (
    <section
      aria-label={dict.manage.title}
      className="flex animate-in fade-in slide-in-from-bottom-2 flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground duration-500 sm:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading font-semibold">{dict.manage.title}</h2>
        <Badge variant={status === "open" ? "secondary" : "outline"}>
          {status === "open" ? dict.manage.badgeAccepting : dict.manage.badgeClosed}
        </Badge>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {/* Quiet zone of >=4 modules and a crisp render size so phone cameras
            recognize the code as a URL instead of falling back to text mode. */}
        <div className="shrink-0 self-center rounded-lg border bg-white p-3 shadow-sm">
          <QRCodeSVG value={shareUrl} size={176} marginSize={4} level="M" aria-hidden />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="text-sm text-muted-foreground">{dict.manage.qrCaption}</p>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={shareUrl}
              aria-label={dict.manage.shareLink}
              onFocus={(event) => event.target.select()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyLink}
              disabled={isPending}
              aria-label={copied ? dict.manage.copied : dict.manage.copyLink}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <a href={emailHref}>{dict.manage.emailShare}</a>
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
          {status === "open" ? dict.manage.closePoll : dict.manage.reopenPoll}
        </Button>

        <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isPending}>
              <Trash2Icon data-icon="inline-start" />
              {dict.manage.delete}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dict.manage.deleteTitle}</DialogTitle>
              <DialogDescription>{dict.manage.deleteDescription}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
                {dict.manage.cancel}
              </Button>
              <Button variant="destructive" disabled={isPending} onClick={remove}>
                {isPending ? dict.manage.deleting : dict.manage.confirmDelete}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
