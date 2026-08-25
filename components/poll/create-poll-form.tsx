"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { PlusIcon, SparklesIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { createPollAction } from "@/app/actions/polls";
import { useI18n } from "@/components/i18n-provider";
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
import { POLL_MAX_OPTIONS, POLL_MIN_OPTIONS } from "@/lib/constants";

interface OptionField {
  id: number;
  value: string;
}

interface AnswerTemplate {
  labelKey: "templateYesNo" | "templateYesNoAbstain" | "templateAgree";
  values: ["yes", "no"] | ["yes", "no", "maybe"] | ["agree", "disagree"];
}

const TEMPLATES: AnswerTemplate[] = [
  { labelKey: "templateYesNo", values: ["yes", "no"] },
  { labelKey: "templateYesNoAbstain", values: ["yes", "no", "maybe"] },
  { labelKey: "templateAgree", values: ["agree", "disagree"] },
];

const TEMPLATE_VALUES: Record<string, { en: string; ru: string }> = {
  yes: { en: "Yes", ru: "Да" },
  no: { en: "No", ru: "Нет" },
  maybe: { en: "Maybe", ru: "Не знаю" },
  agree: { en: "Agree", ru: "Согласен" },
  disagree: { en: "Disagree", ru: "Не согласен" },
};

export function CreatePollForm() {
  const { dict, locale } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<OptionField[]>([
    { id: 0, value: "" },
    { id: 1, value: "" },
  ]);
  // null = no expiry, otherwise seconds until expiry.
  const [expirySeconds, setExpirySeconds] = useState<number | null>(null);

  const expiryChoices = useMemo(
    () => [
      { label: dict.form.expiryNever, value: null as number | null },
      { label: dict.form.expiryHour, value: 60 * 60 },
      { label: dict.form.expiryDay, value: 60 * 60 * 24 },
      { label: dict.form.expiryWeek, value: 60 * 60 * 24 * 7 },
    ],
    [dict],
  );

  function updateOption(id: number, value: string) {
    setOptions((current) =>
      current.map((option) => (option.id === id ? { ...option, value } : option)),
    );
  }

  function removeOption(id: number) {
    setOptions((current) =>
      current.length <= POLL_MIN_OPTIONS
        ? current
        : current
            .filter((option) => option.id !== id)
            .map((option, index) => ({ ...option, id: index })),
    );
  }

  function applyTemplate(template: AnswerTemplate) {
    setOptions(
      template.values.map((kind, index) => ({
        id: index,
        value: TEMPLATE_VALUES[kind][locale],
      })),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await createPollAction({
        question,
        options: options.map((option) => option.value),
        expiresInSeconds: expirySeconds,
      });

      if (!result.ok) {
        const { errors } = dict.form;
        const message =
          result.error in errors
            ? errors[result.error as keyof typeof errors]
            : errors.generic;
        toast.error(message);
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
        <Label htmlFor="question">{dict.form.question}</Label>
        <Textarea
          id="question"
          name="question"
          placeholder={dict.form.questionPlaceholder}
          rows={2}
          maxLength={500}
          required
          autoComplete="off"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          aria-describedby="question-hint"
        />
        <p id="question-hint" className="text-xs text-muted-foreground">
          {question.length}/500 {dict.form.questionHint}
        </p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">{dict.form.options}</legend>

        <div className="flex flex-col gap-1.5" role="group" aria-label={dict.form.templates}>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SparklesIcon className="size-3" aria-hidden />
            {dict.form.templates}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((template) => (
              <Button
                key={template.labelKey}
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full transition-transform duration-150 hover:-translate-y-px active:scale-95"
                onClick={() => applyTemplate(template)}
              >
                {dict.form[template.labelKey]}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {options.map((option, index) => (
            <div
              key={option.id}
              className="flex animate-in fade-in slide-in-from-top-1 items-center gap-2 duration-200"
            >
              <Input
                value={option.value}
                onChange={(event) => updateOption(option.id, event.target.value)}
                placeholder={`${dict.form.optionPlaceholder} ${index + 1}`}
                maxLength={200}
                required
                autoComplete="off"
                aria-label={`${dict.form.optionPlaceholder} ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOption(option.id)}
                disabled={options.length <= POLL_MIN_OPTIONS}
                aria-label={`${dict.form.removeOption} ${index + 1}`}
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
            onClick={() =>
              setOptions((current) =>
                [...current, { id: current.length, value: "" }].map((option, index) => ({
                  ...option,
                  id: index,
                })),
              )
            }
            disabled={options.length >= POLL_MAX_OPTIONS}
          >
            <PlusIcon data-icon="inline-start" />
            {dict.form.addOption}
          </Button>
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="expiry">{dict.form.expiry}</Label>
        <Select
          name="expiry"
          value={String(expirySeconds ?? "")}
          onValueChange={(value) =>
            setExpirySeconds(value === "" ? null : Number.parseInt(value, 10))
          }
        >
          <SelectTrigger id="expiry" className="w-full sm:w-56">
            <SelectValue placeholder={dict.form.expiry} />
          </SelectTrigger>
          <SelectContent>
            {expiryChoices.map(({ label, value }) => (
              <SelectItem key={String(value)} value={String(value ?? "")}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" size="lg" disabled={!canSubmit}>
        {isPending ? dict.form.submitting : dict.form.submit}
      </Button>
    </form>
  );
}
