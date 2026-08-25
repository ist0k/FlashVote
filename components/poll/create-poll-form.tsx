"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createPollAction } from "@/app/actions/polls";
import { POLL_MAX_OPTIONS, POLL_MIN_OPTIONS } from "@/lib/constants";
import { EXPIRY_CHOICES } from "@/lib/validation";

interface OptionField {
  id: number;
  value: string;
}

let nextOptionId = 2;

function createEmptyOption(): OptionField {
  nextOptionId += 1;
  return { id: nextOptionId, value: "" };
}

export function CreatePollForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<OptionField[]>([
    { id: 0, value: "" },
    { id: 1, value: "" },
  ]);
  const [expiryValue, setExpiryValue] = useState<string>("none");

  function updateOption(id: number, value: string) {
    setOptions((current) =>
      current.map((option) => (option.id === id ? { ...option, value } : option)),
    );
  }

  function removeOption(id: number) {
    setOptions((current) =>
      current.length <= POLL_MIN_OPTIONS
        ? current
        : current.filter((option) => option.id !== id),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const choice =
      EXPIRY_CHOICES.find((choice) => String(choice.value) === expiryValue) ??
      EXPIRY_CHOICES[0];

    startTransition(async () => {
      const result = await createPollAction({
        question,
        options: options.map((option) => option.value),
        expiresInSeconds: choice.value,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      router.push(`/p/${result.data.slug}`);
    });
  }

  const filledOptions = options.map((option) => option.value.trim());
  const canSubmit =
    !isPending &&
    question.trim().length > 0 &&
    filledOptions.every((value) => value.length > 0) &&
    new Set(filledOptions).size === filledOptions.length;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          name="question"
          placeholder="What should we have for lunch?"
          rows={2}
          maxLength={500}
          required
          autoComplete="off"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          aria-describedby="question-hint"
        />
        <p id="question-hint" className="text-xs text-muted-foreground">
          {question.length}/500 characters
        </p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">Answer options</legend>
        <div className="flex flex-col gap-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <Input
                value={option.value}
                onChange={(event) => updateOption(option.id, event.target.value)}
                placeholder={`Option ${index + 1}`}
                maxLength={200}
                required
                autoComplete="off"
                aria-label={`Option ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOption(option.id)}
                disabled={options.length <= POLL_MIN_OPTIONS}
                aria-label={`Remove option ${index + 1}`}
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
        </div>
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOptions((current) => [...current, createEmptyOption()])}
            disabled={options.length >= POLL_MAX_OPTIONS}
          >
            <PlusIcon data-icon="inline-start" />
            Add option
          </Button>
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="expiry">Poll expiration</Label>
        <Select name="expiry" value={expiryValue} onValueChange={setExpiryValue}>
          <SelectTrigger id="expiry" className="w-full sm:w-56">
            <SelectValue placeholder="Select expiry" />
          </SelectTrigger>
          <SelectContent>
            {EXPIRY_CHOICES.map((choice) => (
              <SelectItem key={String(choice.value)} value={String(choice.value)}>
                {choice.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" size="lg" disabled={!canSubmit}>
        {isPending ? "Creating…" : "Create poll"}
      </Button>
    </form>
  );
}
