"use client";

import { byteLength, LIMITS, validateField, type DappFormValues } from "@/lib/validators";
import { REGISTRY_DEPLOYED } from "@/lib/config";
import { cn } from "@/lib/utils";
import { useDappForm, type FormMode } from "@/hooks/use-dapp-form";
import { IconAlert, IconCheck } from "@/components/ui/icons";
import { FormField, FieldCounter, fieldProps, inputClass } from "./form/form-field";
import { CategoryPicker } from "./form/category-picker";
import { ContractField } from "./form/contract-field";
import { RepoField } from "./form/repo-field";
import { FormChecks } from "./form/form-checks";
import { FormSubmit } from "./form/form-submit";
import { ListingPreview } from "./form/listing-preview";
import { SuccessPanel } from "./form/success-panel";
import { LogoAvatar } from "./logo-avatar";

type StepState = "todo" | "done" | "attention";
type Step = { id: string; number: string; title: string; state: StepState };

function StepBadge({ number, state }: { number: string; state: StepState }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full font-mono text-[11px] transition-colors",
        state === "done" && "bg-success text-white",
        state === "attention" && "bg-pink text-white",
        state === "todo" && "border-line bg-panel text-muted border",
      )}
    >
      {state === "done" ? <IconCheck className="size-3.5" /> : number}
    </span>
  );
}

function SectionTitle({ step }: { step: Step }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <StepBadge number={step.number} state={step.state} />
      <h2 className="text-xl">{step.title}</h2>
      <span className="bg-line h-px flex-1" aria-hidden />
      {step.state === "done" && <span className="text-success font-mono text-[11px]">Done</span>}
    </div>
  );
}

/** Sticky progress rail: one link per section, coloured by how that section is doing. */
function StepRail({ steps }: { steps: Step[] }) {
  return (
    <nav
      aria-label="Form steps"
      className="border-line bg-card/95 sticky top-20 z-20 rounded-2xl border p-1.5 shadow-[0_12px_30px_-24px_rgb(0_0_0/0.4)] backdrop-blur"
    >
      <ol className="flex gap-1">
        {steps.map((st) => (
          <li key={st.id} className="flex-1">
            <a
              href={`#${st.id}`}
              className="hover:bg-panel flex items-center justify-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium transition-colors sm:justify-start sm:px-3"
            >
              <StepBadge number={st.number} state={st.state} />
              <span className="hidden sm:inline">{st.title}</span>
              <span className="sr-only">
                {st.state === "done"
                  ? " (done)"
                  : st.state === "attention"
                    ? " (needs attention)"
                    : ""}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

const valid = (values: DappFormValues, key: keyof DappFormValues) =>
  validateField(key, values[key]) === null;

const sectionClass = "border-line bg-card scroll-mt-40 rounded-3xl border p-5 sm:p-7";

export function DappForm({ mode, initial }: { mode: FormMode; initial?: DappFormValues }) {
  const s = useDappForm({ mode, initial });
  const { values } = s;

  if (s.tx.status === "success") {
    return <SuccessPanel editing={s.editing} name={values.name} />;
  }

  const pending = s.tx.status === "pending";

  // Section progress, derived from the same validation the submit uses (no extra state).
  const stepState = (keys: (keyof DappFormValues)[], extraOk = true): StepState =>
    keys.some((k) => s.errors[k])
      ? "attention"
      : keys.every((k) => valid(values, k)) && extraOk
        ? "done"
        : "todo";
  const project: Step = {
    id: "step-project",
    number: "01",
    title: "Project",
    state: stepState(["name", "tagline", "category"]),
  };
  const contract: Step = {
    id: "step-contract",
    number: "02",
    title: "Contract",
    state: s.contractProblem ? "attention" : stepState(["target"], s.editing || s.contractOk),
  };
  const links: Step = {
    id: "step-links",
    number: "03",
    title: "Links",
    state: stepState(["liveUrl", "repo", "logoUrl"], s.repoOk),
  };
  const passed = s.checks.filter((c) => c.state === "ok").length;

  return (
    <form
      onSubmit={s.submit}
      noValidate
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-x-8"
    >
      <div className="grid gap-6 lg:col-start-1">
        <StepRail steps={[project, contract, links]} />

        <p className="sr-only" aria-live="polite">
          {s.problems.length
            ? `${s.problems.length} problem${s.problems.length === 1 ? "" : "s"} need attention.`
            : ""}
        </p>

        {!REGISTRY_DEPLOYED && (
          <div className="border-line bg-peach/50 flex items-start gap-3 rounded-2xl border p-4 text-sm">
            <IconAlert className="text-brand-deep mt-0.5 size-4 shrink-0" />
            <p>
              <strong className="font-medium">Registry not deployed.</strong> Listings are disabled
              until the contract address is configured. You can still explore the form.
            </p>
          </div>
        )}

        {s.editNeedsAttention && (
          <div className="border-line bg-peach/50 flex items-start gap-3 rounded-2xl border p-4 text-sm">
            <IconAlert className="text-brand-deep mt-0.5 size-4 shrink-0" />
            <p>
              <strong className="font-medium">This listing needs a tidy-up.</strong> It was saved
              directly on-chain, so some fields don&apos;t meet the form rules. Fix the highlighted
              fields to save your changes.
            </p>
          </div>
        )}

        {s.attempted && s.problems.length > 0 && (
          <div
            id="form-errors"
            tabIndex={-1}
            role="alert"
            className="border-pink bg-pink-soft/60 focus-visible:ring-pink rounded-2xl border-2 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <h2 className="text-pink flex items-center gap-2 text-base">
              <IconAlert className="size-4" />
              There is a problem
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              {s.problems.map((problem) => (
                <li key={problem.key}>
                  <a
                    href={`#${problem.key}`}
                    className="text-pink underline underline-offset-2 hover:no-underline"
                  >
                    {problem.label}: {problem.message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <fieldset disabled={pending} className="m-0 grid min-w-0 gap-6 border-0 p-0">
          <section id={project.id} className={sectionClass} aria-labelledby="section-project">
            <span id="section-project" className="sr-only">
              Project details
            </span>
            <SectionTitle step={project} />

            <div className="grid gap-4">
              <FormField
                id="name"
                label="Name"
                error={s.errors.name}
                counter={<FieldCounter value={byteLength(values.name)} max={LIMITS.name} />}
                hint="Keep it short — it's the biggest text on your card."
              >
                <input
                  {...fieldProps("name", { error: s.errors.name, hasHint: !s.errors.name })}
                  className={inputClass}
                  value={values.name}
                  onChange={(e) => s.update("name", e.target.value)}
                  onBlur={() => s.markTouched("name")}
                  placeholder="Kit's Canvas"
                  autoComplete="off"
                  aria-required="true"
                />
              </FormField>

              <FormField
                id="tagline"
                label="Tagline"
                error={s.errors.tagline}
                counter={<FieldCounter value={byteLength(values.tagline)} max={LIMITS.tagline} />}
                hint="One line on what it does. 80 bytes is about 80 characters."
              >
                <input
                  {...fieldProps("tagline", {
                    error: s.errors.tagline,
                    hasHint: !s.errors.tagline,
                  })}
                  className={inputClass}
                  value={values.tagline}
                  onChange={(e) => s.update("tagline", e.target.value)}
                  onBlur={() => s.markTouched("tagline")}
                  placeholder="Draw, mint and remix on-chain art"
                />
              </FormField>

              <CategoryPicker value={values.category} onChange={(id) => s.update("category", id)} />
            </div>
          </section>

          <section id={contract.id} className={sectionClass} aria-labelledby="section-contract">
            <span id="section-contract" className="sr-only">
              Contract
            </span>
            <SectionTitle step={contract} />
            <ContractField
              value={values.target}
              onChange={(value) => s.update("target", value)}
              onBlur={() => s.markTouched("target")}
              error={s.errors.target}
              editing={s.editing}
              check={s.contractData}
              loading={s.contractLoading}
              unavailable={s.contractError}
            />
          </section>

          <section id={links.id} className={sectionClass} aria-labelledby="section-links">
            <span id="section-links" className="sr-only">
              Links
            </span>
            <SectionTitle step={links} />
            <div className="grid gap-4">
              <FormField
                id="liveUrl"
                label="Live URL"
                error={s.errors.liveUrl}
                hint="Where people can try it. Must start with https://."
              >
                <input
                  {...fieldProps("liveUrl", {
                    error: s.errors.liveUrl,
                    hasHint: !s.errors.liveUrl,
                  })}
                  className={inputClass}
                  value={values.liveUrl}
                  onChange={(e) => s.update("liveUrl", e.target.value.trim())}
                  onBlur={() => s.markTouched("liveUrl")}
                  placeholder="https://your-dapp.xyz"
                  inputMode="url"
                  autoComplete="url"
                  aria-required="true"
                />
              </FormField>

              <RepoField
                value={values.repo}
                onChange={(value) => s.update("repo", value)}
                onBlur={() => s.markTouched("repo")}
                error={s.errors.repo}
                result={s.repoData}
                loading={s.repoLoading}
              />

              <FormField
                id="logoUrl"
                label="Logo image URL (optional)"
                error={s.errors.logoUrl}
                hint="A square https:// image. We fall back to your initial."
              >
                <div className="flex items-center gap-3">
                  <LogoAvatar
                    name={values.name || "?"}
                    src={values.logoUrl}
                    className="size-12 shrink-0 rounded-2xl"
                  />
                  <input
                    {...fieldProps("logoUrl", {
                      error: s.errors.logoUrl,
                      hasHint: !s.errors.logoUrl,
                    })}
                    className={inputClass}
                    value={values.logoUrl}
                    onChange={(e) => s.update("logoUrl", e.target.value.trim())}
                    onBlur={() => s.markTouched("logoUrl")}
                    placeholder="https://…/logo.png"
                    inputMode="url"
                  />
                </div>
              </FormField>
            </div>
          </section>
        </fieldset>

        {/* Phones: the checks sit below the form, so keep a running tally within reach. */}
        <a
          href="#checks-title"
          className="bg-ink sticky bottom-3 z-20 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm text-white shadow-lg lg:hidden"
        >
          <span>
            <span className="font-mono tabular-nums">
              {passed}/{s.checks.length}
            </span>{" "}
            checks passed
          </span>
          <span className="text-peach font-medium">Review ↓</span>
        </a>
      </div>

      <aside
        className="grid gap-4 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        aria-label="Listing preview and checks"
      >
        <FormChecks items={s.checks} />
        <ListingPreview values={values} contractOk={s.contractOk} repoOk={s.repoOk} />
      </aside>

      <div className="lg:col-start-1">
        <FormSubmit
          editing={s.editing}
          pending={pending}
          tx={s.tx}
          problems={s.problems.length}
          attempted={s.attempted}
          resetTx={s.resetTx}
        />
      </div>
    </form>
  );
}
