"use client";

import { byteLength, LIMITS, type DappFormValues } from "@/lib/validators";
import { REGISTRY_DEPLOYED } from "@/lib/config";
import { useDappForm, type FormMode } from "@/hooks/use-dapp-form";
import { IconAlert } from "@/components/ui/icons";
import { FormField, FieldCounter, fieldProps, inputClass } from "./form/form-field";
import { CategoryPicker } from "./form/category-picker";
import { ContractField } from "./form/contract-field";
import { RepoField } from "./form/repo-field";
import { FormChecks } from "./form/form-checks";
import { FormSubmit } from "./form/form-submit";
import { ListingPreview } from "./form/listing-preview";
import { SuccessPanel } from "./form/success-panel";
import { LogoAvatar } from "./logo-avatar";

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-muted font-mono text-[11px] tracking-widest">{number}</span>
      <h2 className="text-lg">{title}</h2>
      <span className="bg-line h-px flex-1" aria-hidden />
    </div>
  );
}

export function DappForm({ mode, initial }: { mode: FormMode; initial?: DappFormValues }) {
  const s = useDappForm({ mode, initial });
  const { values } = s;

  if (s.tx.status === "success") {
    return <SuccessPanel editing={s.editing} name={values.name} />;
  }

  const pending = s.tx.status === "pending";

  return (
    <form
      onSubmit={s.submit}
      noValidate
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start"
    >
      <div className="grid gap-6">
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
          <section
            className="border-line bg-card rounded-2xl border p-5 sm:p-6"
            aria-labelledby="section-project"
          >
            <span id="section-project" className="sr-only">
              Project details
            </span>
            <SectionTitle number="01" title="Project" />

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

          <section
            className="border-line bg-card rounded-2xl border p-5 sm:p-6"
            aria-labelledby="section-contract"
          >
            <span id="section-contract" className="sr-only">
              Contract
            </span>
            <SectionTitle number="02" title="Contract" />
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

          <section
            className="border-line bg-card rounded-2xl border p-5 sm:p-6"
            aria-labelledby="section-links"
          >
            <span id="section-links" className="sr-only">
              Links
            </span>
            <SectionTitle number="03" title="Links" />
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
                  <LogoAvatar name={values.name || "?"} src={values.logoUrl} />
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

        <FormSubmit
          editing={s.editing}
          pending={pending}
          tx={s.tx}
          problems={s.problems.length}
          attempted={s.attempted}
          resetTx={s.resetTx}
        />
      </div>

      <aside className="grid gap-4 lg:sticky lg:top-24" aria-label="Listing preview and checks">
        <FormChecks items={s.checks} />
        <ListingPreview values={values} contractOk={s.contractOk} repoOk={s.repoOk} />
      </aside>
    </form>
  );
}
