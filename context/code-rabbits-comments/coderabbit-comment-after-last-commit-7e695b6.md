<!-- This is an auto-generated comment: summarize by coderabbit.ai -->
<!-- review_stack_entry_start -->

[![Review Change Stack](https://storage.googleapis.com/coderabbit_public_assets/review-stack-in-coderabbit-ui.svg)](https://app.coderabbit.ai/change-stack/erfanansarioct10-oss/black-swa-v1/pull/14?utm_source=github_walkthrough&utm_medium=github&utm_campaign=change_stack)

<!-- review_stack_entry_end -->
<!-- walkthrough_start -->

<details>
<summary>📝 Walkthrough</summary>

## Walkthrough

The pull request adds a protected admin portal with dashboards, analytics, command-center actions, customer management, lead management, database migrations, documentation, and stress-test suites.

### Changes

**Administrative platform**

| Layer / File(s)                                                                                                                                                                                                                 | Summary                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Authentication and responsive admin shell** <br> `lib/admin-auth.ts`, `proxy.ts`, `app/admin/layout.tsx`, `components/admin/*`, `components/providers/*`, `constants/admin-navigation.ts`                                     | Adds role-based admin authorization, redirect preservation, responsive navigation, persisted shell state, and unauthorized handling.                             |
| **Executive dashboard and analytics** <br> `app/admin/page.tsx`, `app/admin/analytics/page.tsx`, `components/admin/analytics/*`, `components/admin/pending-directives-alert.tsx`, `components/admin/recent-activity-stream.tsx` | Adds dashboard KPIs, activity streams, pending-directive alerts, date filtering, funnel metrics, SLA calculations, and analytics visualizations.                 |
| **Command center and inquiry operations** <br> `actions/admin.ts`, `components/admin/command-palette.tsx`, `components/admin/notification-drawer.tsx`, `app/admin/quotes/page.tsx`, `app/admin/inquiries/page.tsx`              | Adds authenticated search, notifications, quote self-assignment, inquiry status updates, and management views.                                                   |
| **Customer accounts and profiles** <br> `db/schema.ts`, `schemas/customer.ts`, `actions/customer.ts`, `app/admin/customers/*`, `components/admin/customers/*`                                                                   | Adds customer persistence, validation, statistics, directory filtering, profile pages, editing, notes, linked records, and archival.                             |
| **Lead pipeline and conversion** <br> `schemas/lead.ts`, `actions/lead.ts`, `app/admin/leads/*`, `components/admin/leads/*`                                                                                                     | Adds lead validation, statistics, filtering, CRUD actions, detail workflows, and lead-to-customer conversion with quote linking.                                 |
| **Database and delivery support** <br> `supabase/migrations/*`, `docs/database-schema.md`, `context/*`, `scripts/*`, `package.json`, `db/seed.mjs`, `supabase/seed.sql`                                                         | Adds customer, lead, and quote-stage migrations; updates schema and workflow documentation; removes demo seed data; and adds executable test suites and runners. |

**Estimated code review effort:** 5 (Critical) | ~120 minutes

**Possibly related PRs**

- [erfanansarioct10-oss/black-swa-v1#8](https://github.com/erfanansarioct10-oss/black-swa-v1/pull/8): Extends the earlier admin authentication and dashboard access surfaces.
- [erfanansarioct10-oss/black-swa-v1#12](https://github.com/erfanansarioct10-oss/black-swa-v1/pull/12): Extends the earlier admin analytics, authentication, navigation, and middleware work.
- [erfanansarioct10-oss/black-swa-v1#13](https://github.com/erfanansarioct10-oss/black-swa-v1/pull/13): Incorporates command-center changes and extends them with customer and lead management.

</details>

<!-- walkthrough_end -->
<!-- pre_merge_checks_walkthrough_start -->

<details>
<summary>🚥 Pre-merge checks | ✅ 3 | ❌ 2</summary>

### ❌ Failed checks (1 warning, 1 inconclusive)

|     Check name     | Status          | Explanation                                                                                                            | Resolution                                                                                     |
| :----------------: | :-------------- | :--------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| Docstring Coverage | ⚠️ Warning      | Docstring coverage is 5.41% which is insufficient. The required threshold is 80.00%.                                   | Write docstrings for the functions missing them to satisfy the coverage threshold.             |
|    Title check     | ❓ Inconclusive | The title references Phase 5B but does not describe the lead management, customer, database, and admin portal changes. | Use a concise descriptive title such as "Add Phase 5B lead management and inquiry processing". |

<details>
<summary>✅ Passed checks (3 passed)</summary>

|         Check name         | Status    | Explanation                                                              |
| :------------------------: | :-------- | :----------------------------------------------------------------------- |
|     Description Check      | ✅ Passed | Check skipped - CodeRabbit’s high-level summary is enabled.              |
|    Linked Issues check     | ✅ Passed | Check skipped because no linked issues were found for this pull request. |
| Out of Scope Changes check | ✅ Passed | Check skipped because no linked issues were found for this pull request. |

</details>

</details>

<!-- pre_merge_checks_walkthrough_end -->
<!-- finishing_touch_checkbox_start -->

<details>
<summary>✨ Finishing Touches 💡 1</summary>

<!-- finishing_touch_suggestion:docstrings -->
<details>
<summary>📝 Generate docstrings 💡</summary>

- [ ] <!-- {"checkboxId": "7962f53c-55bc-4827-bfbf-6a18da830691"} --> Create stacked PR
- [ ] <!-- {"checkboxId": "3e1879ae-f29b-4d0d-8e06-d12b7ba33d98"} --> Commit on current branch

</details>
<details>
<summary>🧪 Generate unit tests (beta)</summary>

- [ ] <!-- {"checkboxId": "f47ac10b-58cc-4372-a567-0e02b2c3d479", "radioGroupId": "utg-output-choice-group-unknown_comment_id"} -->   Create PR with unit tests
- [ ] <!-- {"checkboxId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8", "radioGroupId": "utg-output-choice-group-unknown_comment_id"} -->   Commit unit tests in branch `phase5b`

</details>

</details>

<!-- finishing_touch_checkbox_end -->
<!-- tips_start -->

---

<sub>Comment `@coderabbitai help` to get the list of available commands.</sub>

<!-- tips_end -->

**Actionable comments posted: 2**

> [!NOTE]
> Due to the large number of review comments, Critical severity comments were prioritized as inline comments.

<details>
<summary>🟠 Major comments (22)</summary><blockquote>

<details>
<summary>context/feature-stress-test/README.md-184-188 (1)</summary><blockquote>

`184-188`: _📐 Maintainability & Code Quality_ | _🟠 Major_ | _⚡ Quick win_

**Load all required project context before starting the workflow.**

Step 1 lists only `AGENTS.md`, `context/architecture.md`, `context/code-standards.md`, and relevant specifications. It omits the required seven-file context-loading order. Add `context/project-overview.md`, `context/ui-context.md`, `context/ai-workflow-rules.md`, `context/progress-tracker.md`, and `context/seo.md` in the required order before drafting or executing the stress test.

Based on learnings: Before modifying any project file, read `context/project-overview.md`, `context/architecture.md`, `context/code-standards.md`, `context/ui-context.md`, `context/ai-workflow-rules.md`, `context/progress-tracker.md`, and `context/seo.md` in order.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-stress-test/README.md` around lines 184 - 188, Update Step 1
of the stress-test workflow in the README to require reading the seven context
files in this exact order: project-overview, architecture, code-standards,
ui-context, ai-workflow-rules, progress-tracker, and seo, before any drafting,
execution, or project-file modification. Retain loading AGENTS.md and relevant
implementation specifications as required context without disrupting the
prescribed seven-file order.
```

</details>

<!-- cr-comment:v1:ffc4aa8ff188760fa24a181c -->

_Source: Learnings_

</blockquote></details>
<details>
<summary>context/implementation-specs/31-fix-coderabbit-pr-review-findings.md-52-55 (1)</summary><blockquote>

`52-55`: _🔒 Security & Privacy_ | _🟠 Major_ | _⚡ Quick win_

**Scope the middleware bypass to synthetic sessions only.**

The specification says that `ADMIN_DEV_BYPASS` applies only to unauthenticated synthetic sessions. However, Line 54 says to skip `isAdminSession` whenever `isDevBypass` is true. That also skips the middleware role check for signed-in non-admin users.

Gate the bypass on the synthetic-session condition, such as `isDevBypass && !userId`. Always enforce `isAdminSession` when Clerk returns a user ID.

<details>
<summary>Proposed specification correction</summary>

```diff
- Skip `isAdminSession` check only if `isDevBypass` is true.
+ Skip `isAdminSession` only when `isDevBypass && !userId`; otherwise enforce the role check.
```

</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/implementation-specs/31-fix-coderabbit-pr-review-findings.md` around
lines 52 - 55, Update the Step 1 middleware guidance in proxy.ts so the
isDevBypass exception applies only when no userId exists, using the combined
synthetic-session condition isDevBypass && !userId. Ensure isAdminSession is
always enforced when Clerk returns a user ID, while preserving the existing
development and environment checks.
```

</details>

<!-- cr-comment:v1:7a3240680712603f2da9a868 -->

</blockquote></details>
<details>
<summary>scripts/stress/run-phase5-stress-suite.ts-14-24 (1)</summary><blockquote>

`14-24`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _🏗️ Heavy lift_

**Run mutating stress tests only against an isolated database.**

This runner executes `scripts/stress/33-customer-management-stress.ts` (Lines 10-139) and `scripts/stress/34-lead-management-stress.ts` (Lines 10-163). Those tests create records, archive only the customer, and leave converted leads and related data behind. The runner has no environment guard or cleanup boundary. Require an explicit isolated stress-test database and reset or roll back test data before this command can run.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@scripts/stress/run-phase5-stress-suite.ts` around lines 14 - 24, Update the
phase 5 stress runner around runCustomerManagementStressTest and
runLeadManagementStressTest to require an explicit isolated stress-test database
before executing either mutating suite. Add a pre-run database reset or
transaction boundary and ensure test data is rolled back or removed after
execution, including when a test fails; abort without running tests when the
isolation configuration is missing.
```

</details>

<!-- cr-comment:v1:7409c2d5ba290845dc461215 -->

</blockquote></details>
<details>
<summary>context/feature-stress-test/34-phase-5b-lead-management-and-inquiry-processing.md-66-67 (1)</summary><blockquote>

`66-67`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Exercise the stated concurrent mutations.**

The plan requires `Promise.all(...)` conversion testing. `scripts/stress/34-lead-management-stress.ts` (Lines 10-163) performs the two conversions sequentially and performs only one manager assignment. It cannot verify duplicate-customer prevention or concurrent assignment behavior. Run both mutation pairs concurrently against the same lead before marking these scenarios verified.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In
`@context/feature-stress-test/34-phase-5b-lead-management-and-inquiry-processing.md`
around lines 66 - 67, Update the stress test’s lead conversion and manager
assignment scenarios to execute each mutation pair concurrently with Promise.all
against the same lead. In 34-lead-management-stress.ts, replace the sequential
convertLeadToCustomerAction calls with concurrent calls and issue two
simultaneous assignedManagerId updates, then retain assertions verifying no
duplicate customer rows, the final updatedAt behavior, and absence of locking or
deadlock errors.
```

</details>

<!-- cr-comment:v1:811634b4aecc024f06c97857 -->

</blockquote></details>
<details>
<summary>context/feature-stress-test/34-phase-5b-lead-management-and-inquiry-processing.md-39-39 (1)</summary><blockquote>

`39-39`: _🔒 Security & Privacy_ | _🟠 Major_ | _⚡ Quick win_

**Restrict the `leads` RLS policy to administrators.**

`TO authenticated` with `USING (true)` and `WITH CHECK (true)` grants every authenticated Supabase user full CRUD access to `public.leads`. `requireAdminAuth()` protects server actions only. Enforce a verified admin claim in RLS and test authenticated non-admin access, or describe the policy as authenticated-only.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In
`@context/feature-stress-test/34-phase-5b-lead-management-and-inquiry-processing.md`
at line 39, Update the leads RLS policy referenced by the A05:2026 entry to
restrict SELECT, INSERT, UPDATE, and DELETE to verified administrators using the
project’s established admin claim mechanism, rather than allowing all
authenticated users via unrestricted USING and WITH CHECK clauses. Extend the
associated stress test to verify authenticated non-admin access is denied; if
admin enforcement is not implemented, revise the documentation to accurately
state authenticated-only access.
```

</details>

<!-- cr-comment:v1:c533744104866fa279f0b3f8 -->

</blockquote></details>
<details>
<summary>scripts/stress/31-coderabbit-pr12-stress.ts-17-75 (1)</summary><blockquote>

`17-75`: _🎯 Functional Correctness_ | _🟠 Major_ | _🏗️ Heavy lift_

**Use production implementations in both stress tests.**

Both files implement the behavior under test inside the stress test. Production regressions cannot affect these results.

- `scripts/stress/31-coderabbit-pr12-stress.ts#L17-L75`: invoke the production auth guard and sender parsing behavior.
- `scripts/stress/30-coderabbit-pr11-stress.ts#L7-L40`: invoke the production redirect construction and sender parsing behavior.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@scripts/stress/31-coderabbit-pr12-stress.ts` around lines 17 - 75, Replace
the locally defined evaluateAuthGuard and stripOuterQuotesOnly implementations
in scripts/stress/31-coderabbit-pr12-stress.ts (lines 17-75) with calls to the
corresponding production auth-guard and sender-parsing symbols, preserving the
existing assertions. Apply the same change in
scripts/stress/30-coderabbit-pr11-stress.ts (lines 7-40): invoke the production
redirect-construction and sender-parsing implementations instead of duplicating
behavior in the stress test.
```

</details>

<!-- cr-comment:v1:69299ca4314f1553ee276d3d -->

</blockquote></details>
<details>
<summary>supabase/migrations/20260802000001_create_leads_table.sql-34-40 (1)</summary><blockquote>

`34-40`: _🔒 Security & Privacy_ | _🟠 Major_ | _⚡ Quick win_

**Restrict the `leads` RLS policy to administrators.** `TO authenticated USING (true) WITH CHECK (true)` grants full CRUD access to every Supabase authenticated role. Current code has no Supabase client and uses Drizzle with `DATABASE_URL`, but this does not protect direct Data API access. Remove this policy or enforce an explicit admin claim and restrict `anon`/`authenticated` table privileges.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@supabase/migrations/20260802000001_create_leads_table.sql` around lines 34 -
40, Restrict the leads RLS policy defined by "Allow authenticated read and write
access to leads" so ordinary authenticated users cannot access the table. Remove
the broad policy and revoke anon/authenticated table privileges, or replace it
with an explicit administrator-claim check in both USING and WITH CHECK while
preserving access only for administrators.
```

</details>

<!-- cr-comment:v1:fae01261483a981430a33fe3 -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>scripts/stress/34-lead-management-stress.ts-16-17 (1)</summary><blockquote>

`16-17`: _🔒 Security & Privacy_ | _🟠 Major_ | _⚡ Quick win_

**Restore the environment variable correctly when it was unset.**

If `ADMIN_DEV_BYPASS` is not set before the run, `origDevBypass` is `undefined`. Assigning `undefined` to a `process.env` property stores the string `"undefined"`, which is truthy. Any later code in the same process that tests the variable for truthiness keeps the admin bypass enabled. Delete the key instead.

<details>
<summary>🛡️ Proposed fix</summary>

```diff
   } finally {
-    process.env.ADMIN_DEV_BYPASS = origDevBypass;
+    if (origDevBypass === undefined) {
+      delete process.env.ADMIN_DEV_BYPASS;
+    } else {
+      process.env.ADMIN_DEV_BYPASS = origDevBypass;
+    }
   }
```

</details>

Also applies to: 155-157

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@scripts/stress/34-lead-management-stress.ts` around lines 16 - 17, Update the
environment restoration logic around origDevBypass in the stress test, including
the corresponding cleanup at the later referenced location: when the original
value is undefined, delete process.env.ADMIN_DEV_BYPASS instead of assigning
undefined; otherwise restore the saved value unchanged.
```

</details>

<!-- cr-comment:v1:7800674d532d423d3c72b89d -->

</blockquote></details>
<details>
<summary>components/admin/leads/lead-detail-client.tsx-44-81 (1)</summary><blockquote>

`44-81`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Check the action result before treating the update as successful.**

`updateLeadAction` returns `{ success: false, error }` on failure. It does not throw. The three handlers only catch thrown errors, so a failed update is silent: the select keeps the new value and the notes textarea keeps the unsaved text, while the database is unchanged. Inspect `res.success`, revert optimistic state, and show the error.

<details>
<summary>🐛 Proposed fix for `handleStatusChange`</summary>

```diff
   const handleStatusChange = async (newStatus: string) => {
+    const previous = status;
     setStatus(newStatus);
     setUpdatingStatus(true);
     try {
-      await updateLeadAction(lead.id, { id: lead.id, status: newStatus as LeadStatus });
-      router.refresh();
+      const res = await updateLeadAction(lead.id, { id: lead.id, status: newStatus as LeadStatus });
+      if (!res.success) {
+        setStatus(previous);
+        setErrorMsg(res.error ?? "Failed to update lead status");
+        return;
+      }
+      router.refresh();
     } catch (err) {
       console.error("[LeadDetailClient] Status update error:", err);
+      setStatus(previous);
+      setErrorMsg("Failed to update lead status");
     } finally {
       setUpdatingStatus(false);
     }
   };
```

</details>

Apply the same pattern to `handlePriorityChange` and `handleSaveNotes`, and add an `errorMsg` state with a visible message region.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@components/admin/leads/lead-detail-client.tsx` around lines 44 - 81, Update
handleStatusChange, handlePriorityChange, and handleSaveNotes to inspect the
updateLeadAction result and handle success:false responses, not only thrown
errors. Add errorMsg state and a visible message region; on failure, display the
returned error and revert status, priority, or notes to their prior values while
preserving loading-state cleanup.
```

</details>

<!-- cr-comment:v1:45c5193d9e104183b3b28bd6 -->

</blockquote></details>
<details>
<summary>actions/lead.ts-439-474 (1)</summary><blockquote>

`439-474`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _🏗️ Heavy lift_

**Wrap the conversion in a database transaction.**

`convertLeadToCustomerAction` performs an existence check, a customer insert, a lead update, and a quote update as four independent statements. Two problems follow.

1. TOCTOU race: two concurrent conversions for the same email both read no existing customer, then both insert. This creates duplicate customer accounts, which the spec's mitigation table explicitly tries to prevent.
2. Partial failure: if the lead update or the quote update fails, the customer row remains and the lead stays unconverted. There is no rollback.

The spec `context/implementation-specs/34-phase-5b-lead-management-and-inquiry-processing.md` line 104 states the conversion is atomic. The implementation is not.

<details>
<summary>🛡️ Proposed fix</summary>

```diff
-    const [existingCustomer] = await db
-      .select()
-      .from(customers)
-      .where(eq(sql`lower(${customers.primaryContactEmail})`, emailLower))
-      .limit(1);
-
-    let customerId = existingCustomer?.id;
-
-    if (!customerId) {
-      const [newCust] = await db
-        .insert(customers)
-        .values({ /* ... */ })
-        .returning({ id: customers.id });
-
-      customerId = newCust.id;
-    }
-
-    await db
-      .update(leads)
-      .set({ status: "converted", customerId, companyName: validated.organizationName, updatedAt: new Date() })
-      .where(eq(leads.id, lead.id));
-
-    await db
-      .update(quotes)
-      .set({ customerId, updatedAt: new Date() })
-      .where(and(eq(sql`lower(${quotes.email})`, emailLower), sql`${quotes.customerId} IS NULL`));
+    const customerId = await db.transaction(async (tx) => {
+      const [existingCustomer] = await tx
+        .select({ id: customers.id })
+        .from(customers)
+        .where(eq(sql`lower(${customers.primaryContactEmail})`, emailLower))
+        .limit(1);
+
+      let resolvedId = existingCustomer?.id;
+
+      if (!resolvedId) {
+        const [newCust] = await tx
+          .insert(customers)
+          .values({
+            organizationName: validated.organizationName,
+            organizationType: validated.organizationType,
+            primaryContactName: lead.contactName,
+            primaryContactEmail: emailLower,
+            primaryContactPhone: lead.phone || null,
+            taxRegistrationId: validated.taxRegistrationId || null,
+            leadSource: lead.leadSource,
+            status: "active",
+            notes: validated.notes || lead.notes || null,
+          })
+          .returning({ id: customers.id });
+        resolvedId = newCust.id;
+      }
+
+      await tx
+        .update(leads)
+        .set({ status: "converted", customerId: resolvedId, companyName: validated.organizationName, updatedAt: new Date() })
+        .where(eq(leads.id, lead.id));
+
+      await tx
+        .update(quotes)
+        .set({ customerId: resolvedId, updatedAt: new Date() })
+        .where(and(eq(sql`lower(${quotes.email})`, emailLower), sql`${quotes.customerId} IS NULL`));
+
+      return resolvedId;
+    });
```

</details>

To close the race fully, also add a unique index on `lower(primary_contact_email)` in the `customers` migration, then handle the conflict.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@actions/lead.ts` around lines 439 - 474, Wrap the complete
convertLeadToCustomerAction conversion flow—including the existing-customer
lookup, customer creation, lead update, and quote update—in a single database
transaction so all changes commit or roll back together. Add a unique index on
lower(customers.primaryContactEmail) in the customers migration, and handle the
resulting insert conflict by reusing the existing customer rather than creating
a duplicate.
```

</details>

<!-- cr-comment:v1:c7e7f8f14bd495eccca78273 -->

</blockquote></details>
<details>
<summary>components/admin/leads/lead-form-modal.tsx-31-42 (1)</summary><blockquote>

`31-42`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Reset the form state when `initialData` changes.**

`useState` reads `initialData` only on the first render. `LeadDetailClient` mounts this modal unconditionally at line 357 of `components/admin/leads/lead-detail-client.tsx`. After `router.refresh()` delivers updated lead data, or after a successful save, the form keeps the previous values. The operator can then submit stale data over newer data.

The simplest fix is to remount the modal per record from each caller.

<details>
<summary>🐛 Proposed fix in the callers</summary>

```diff
 // components/admin/leads/lead-detail-client.tsx
       <LeadFormModal
+        key={`${lead.id}-${lead.updatedAt.toISOString()}`}
         open={editModalOpen}
         onOpenChange={setEditModalOpen}
         initialData={formattedLeadListItem}
         onSuccess={() => router.refresh()}
       />
```

```diff
 // components/admin/leads/leads-table-container.tsx
         <LeadFormModal
+          key={selectedEditLead.id}
           open={editModalOpen}
```

</details>

An alternative is to derive the state inside `LeadFormModal` from an `initialData.id` sentinel and reset it during render.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@components/admin/leads/lead-form-modal.tsx` around lines 31 - 42, Ensure
LeadFormModal remounts when the edited lead changes by assigning a key derived
from initialData.id at each caller, including LeadDetailClient and any other
modal render sites. This will reinitialize the useState fields for each record
while preserving the existing form behavior.
```

</details>

<!-- cr-comment:v1:b6fdca1844b84b9b20fda6e5 -->

</blockquote></details>
<details>
<summary>db/schema.ts-43-48 (1)</summary><blockquote>

`43-48`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _🏗️ Heavy lift_

**Consider a unique index on `lower(primary_contact_email)`.**

`convertLeadToCustomerAction` in `actions/lead.ts` (lines 430-459) selects a customer by `lower(primaryContactEmail)` and inserts a new customer when none is found. `idx_customers_email` is not unique, so two concurrent conversions, or a conversion plus a manual create, can insert two customer accounts with the same contact email. The lead and quote linking then points at different accounts.

If duplicate contact emails are not a valid business state, make the expression index unique in both the Drizzle schema and `supabase/migrations/20260802000000_create_customers_table.sql`, and handle the conflict in the insert path.

<details>
<summary>🛠️ Proposed schema change</summary>

```diff
 }, (table) => [
-  index("idx_customers_email").on(sql`lower(${table.primaryContactEmail})`),
+  uniqueIndex("idx_customers_email").on(sql`lower(${table.primaryContactEmail})`),
   index("idx_customers_org_name").on(sql`lower(${table.organizationName})`),
```

Import `uniqueIndex` from `drizzle-orm/pg-core`.

</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@db/schema.ts` around lines 43 - 48, Make the customer email expression index
unique by replacing the existing idx_customers_email definition with a
uniqueIndex using lower(primaryContactEmail), and mirror this constraint in
supabase/migrations/20260802000000_create_customers_table.sql. Update
convertLeadToCustomerAction to handle unique-constraint conflicts during
insertion by reusing the existing customer rather than creating duplicate
accounts.
```

</details>

<!-- cr-comment:v1:f74401b4233f4c9a93a34699 -->

</blockquote></details>
<details>
<summary>supabase/migrations/20260802000000_create_customers_table.sql-4-22 (1)</summary><blockquote>

`4-22`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Add CHECK constraints for the enum-like text columns.**

`organization_type`, `status`, and `lead_source` are plain `text`. `db/schema.ts` declares TypeScript enums for the same columns at lines 18-39, but Drizzle enforces those only at compile time. The database accepts any string.

Reads then return values that the TypeScript types claim are impossible. `getCustomerStatsAction` and the status filters silently miss such rows, and `CUSTOMER_STATUSES.find(...)` falls back to the raw value in the UI.

Add CHECK constraints so the database enforces the same domain.

<details>
<summary>🛠️ Proposed constraints</summary>

```diff
 	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
 	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
 );
+
+ALTER TABLE "public"."customers"
+  ADD CONSTRAINT "customers_organization_type_check"
+  CHECK ("organization_type" IN ('hospital', 'clinic', 'broadcast_studio', 'media_network', 'enterprise'));
+
+ALTER TABLE "public"."customers"
+  ADD CONSTRAINT "customers_status_check"
+  CHECK ("status" IN ('active', 'lead', 'prospect', 'archived'));
+
+ALTER TABLE "public"."customers"
+  ADD CONSTRAINT "customers_lead_source_check"
+  CHECK ("lead_source" IS NULL OR "lead_source" IN ('website_rfq', 'direct_inquiry', 'referral', 'trade_show', 'outreach'));
```

</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@supabase/migrations/20260802000000_create_customers_table.sql` around lines 4
- 22, Add database CHECK constraints to the customers table for
organization_type, status, and lead_source, matching the allowed values defined
by the corresponding enums in db/schema.ts. Apply the constraints directly in
the CREATE TABLE definition and preserve the existing defaults and column
behavior.
```

</details>

<!-- cr-comment:v1:b4ff7625ce24f45a2d82bfa8 -->

_Source: Path instructions_

</blockquote></details>
<details>
<summary>supabase/migrations/20260802000000_create_customers_table.sql-48-53 (1)</summary><blockquote>

`48-53`: _🔒 Security & Privacy_ | _🟠 Major_ | _⚡ Quick win_

**Remove the unrestricted client policy**

The customer policy grants the Supabase `authenticated` role full read and write access to customer PII. The application uses Clerk and a direct Drizzle `DATABASE_URL` connection. Remove this policy, or grant access only through a configured server-side database role. Do not use `auth.jwt()` claims while Clerk-to-Supabase integration is disabled. Apply the same correction to the unrestricted `leads` policy.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@supabase/migrations/20260802000000_create_customers_table.sql` around lines
48 - 53, Remove the unrestricted authenticated policy on the customers table and
apply the same change to the leads policy. If access is required, grant it only
to the configured server-side database role; do not use auth.jwt() claims while
Clerk-to-Supabase integration is disabled.
```

</details>

<!-- cr-comment:v1:a919374d2e6376c7fac6de19 -->

_Source: Path instructions_

</blockquote></details>
<details>
<summary>app/admin/quotes/page.tsx-50-53 (1)</summary><blockquote>

`50-53`: _🎯 Functional Correctness_ | _🟠 Major_ | _🏗️ Heavy lift_

**The list caps at 50 records with no pagination.**

The header reports `{totalCount} Total RFQs`, but line 53 returns at most 50 rows and the page offers no offset control. When the table exceeds 50 quotes, older records become unreachable through this page. The page description states its purpose is to "Manage, assign, and track" requests, so operators need access to the full set.

Add page-based navigation using an `offset` search parameter, or add a reference search input that drives the existing `ref` filter.

Do you want me to generate the pagination implementation, or open a tracking issue?

Also applies to: 98-104

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@app/admin/quotes/page.tsx` around lines 50 - 53, The quotes query in the
admin page currently limits results to 50 without a way to reach older records.
Add page-based navigation driven by an offset search parameter, apply that
offset to the query alongside the existing limit, and provide controls to
navigate between pages while preserving the pending/total counts and current ref
filter.
```

</details>

<!-- cr-comment:v1:ed23e71509c951bbaee5b4bd -->

</blockquote></details>
<details>
<summary>scripts/stress/28-executive-metrics-stress.ts-26-46 (1)</summary><blockquote>

`26-46`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**The stress test does not exercise the production query shape.**

`app/admin/page.tsx` builds its counters with `count(*)` aggregates and orders the recent-record queries with `orderBy(desc(createdAt))`. This test instead selects `{ id }` rows and derives counts from `array.length`, and it omits `orderBy` on lines 44 and 45. Two consequences:

- The 2000ms threshold on line 49 measures a different workload. A `count(*)` aggregate and a full id scan have different cost profiles, so the timing result does not predict dashboard latency.
- Without `orderBy`, `latestQuotesRes` and `latestInquiriesRes` return an arbitrary six rows, so they are not the "latest" records the dashboard renders.

Also, the assertion on line 62 cannot fail. `pendingCount` is `Array.prototype.length`, which is always a non-negative number.

Mirror the production queries so the test validates the code path it targets.

<details>
<summary>🐛 Proposed fix</summary>

```diff
-import { and, eq, inArray, isNull } from "drizzle-orm";
+import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
```

```diff
-      db.select({ id: quotes.id }).from(quotes).where(eq(quotes.status, "pending")),
+      db.select({ count: sql<number>`count(*)` }).from(quotes).where(eq(quotes.status, "pending")),
```

```diff
-      db.select().from(quotes).limit(6),
-      db.select().from(contactInquiries).limit(6),
+      db.select().from(quotes).orderBy(desc(quotes.createdAt)).limit(6),
+      db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt)).limit(6),
```

Update the derivations on lines 55-60 to read `Number(res[0]?.count ?? 0)` after switching to aggregates.

</details>

Also applies to: 62-64

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@scripts/stress/28-executive-metrics-stress.ts` around lines 26 - 46, Update
the stress-test query batch and result handling to mirror the production
dashboard queries: use count(*) aggregates for each counter, add
orderBy(desc(createdAt)) to the recent quotes and inquiries queries, and derive
counts from Number(res[0]?.count ?? 0). Replace the non-failing non-negative
pendingCount assertion with a meaningful assertion that can detect an incorrect
result, while preserving the existing 2000ms timing check.
```

</details>

<!-- cr-comment:v1:984cbe7ba0056afa3e0a7c0e -->

</blockquote></details>
<details>
<summary>app/admin/analytics/page.tsx-70-77 (1)</summary><blockquote>

`70-77`: _🚀 Performance & Scalability_ | _🟠 Major_ | _🏗️ Heavy lift_

**Aggregate in SQL instead of loading every quote row into memory.**

`db.select().from(quotes).where(dateFilter)` selects all columns for all matching rows. For the `all` range, `dateFilter` is `undefined`, so the query returns the entire `quotes` table on every page render. The page then computes counts, budget buckets, funnel stages, SLA averages, and trend points in JavaScript. Cost grows linearly with table size, and the response time of the analytics page degrades with it.

Two consequences:

- Memory and CPU scale with total quote volume, with no upper bound.
- The row set includes `email`, `phone`, `lookupToken`, and `adminNotes`, none of which the page uses.

Move the aggregation into SQL with `count()`, `avg()`, and `group by`, or at minimum restrict the projection to the columns actually consumed: `status`, `budgetRange`, `createdAt`, `updatedAt`, `assignedAt`, `assignedManagerId`, `quotedAt`, `completedAt`.

<details>
<summary>♻️ Minimal first step: narrow the projection</summary>

```diff
     const filteredQuotes = await db
-      .select()
+      .select({
+        status: quotes.status,
+        budgetRange: quotes.budgetRange,
+        createdAt: quotes.createdAt,
+        updatedAt: quotes.updatedAt,
+        assignedAt: quotes.assignedAt,
+        assignedManagerId: quotes.assignedManagerId,
+        quotedAt: quotes.quotedAt,
+        completedAt: quotes.completedAt,
+      })
       .from(quotes)
       .where(dateFilter);
```

</details>

Also applies to: 186-192

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@app/admin/analytics/page.tsx` around lines 70 - 77, Update the analytics
query around filteredQuotes to avoid selecting every quote column: at minimum
project only status, budgetRange, createdAt, updatedAt, assignedAt,
assignedManagerId, quotedAt, and completedAt, which are the fields consumed by
the downstream counts, buckets, funnel, SLA, and trend calculations. Prefer
moving those aggregations into SQL using count(), avg(), and group by while
preserving the existing dateFilter behavior, including the unfiltered all range.
```

</details>

<!-- cr-comment:v1:0011492c4cf83d9b9763a03a -->

</blockquote></details>
<details>
<summary>app/admin/analytics/page.tsx-156-183 (1)</summary><blockquote>

`156-183`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _🏗️ Heavy lift_

**The SLA averages are fabricated, not measured.**

Three problems combine in this block:

1. `Math.max(diffHours, 0.5)`, `Math.max(diffHours, 1)`, and `Math.max(diffHours, 2)` apply an artificial floor. A quote assigned 10 minutes after submission is recorded as 30 minutes. The reported "Avg SLA Response" is therefore always inflated.
2. The floors also guarantee that each average is greater than 0 whenever the corresponding count is greater than 0. `ExecutiveThroughputCards` and `ConversionFunnelSla` both test `=== 0` to render "N/A", so the "N/A" state is only reachable when no rows qualify at all.
3. When `assignedAt`, `quotedAt`, or `completedAt` is `NULL`, the code substitutes `updatedAt`. `updatedAt` advances on any row change, including an admin note edit, so the substituted value is not the stage transition time. The stage timestamp columns exist in `db/schema.ts`; rows without them should be excluded from the average rather than estimated.

Compute the averages only from rows that carry the real stage timestamp.

<details>
<summary>🐛 Proposed fix</summary>

```diff
     filteredQuotes.forEach((q) => {
       const created = new Date(q.createdAt).getTime();

-      if (q.assignedAt || q.assignedManagerId || ["manager_assigned", "quoted", "completed"].includes(q.status)) {
-        const assignedTime = q.assignedAt ? new Date(q.assignedAt).getTime() : new Date(q.updatedAt).getTime();
-        const diffHours = (assignedTime - created) / (1000 * 60 * 60);
-        totalAssignmentHours += Math.max(diffHours, 0.5);
-        assignmentCount++;
-      }
-      if (q.quotedAt || ["quoted", "completed"].includes(q.status)) {
-        const quotedTime = q.quotedAt ? new Date(q.quotedAt).getTime() : new Date(q.updatedAt).getTime();
-        const diffHours = (quotedTime - created) / (1000 * 60 * 60);
-        totalQuotingHours += Math.max(diffHours, 1);
-        quotingCount++;
-      }
-      if (q.completedAt || q.status === "completed") {
-        const completedTime = q.completedAt ? new Date(q.completedAt).getTime() : new Date(q.updatedAt).getTime();
-        const diffHours = (completedTime - created) / (1000 * 60 * 60);
-        totalCompletionHours += Math.max(diffHours, 2);
-        completionCount++;
-      }
+      if (q.assignedAt) {
+        const diffHours = (new Date(q.assignedAt).getTime() - created) / (1000 * 60 * 60);
+        totalAssignmentHours += Math.max(diffHours, 0);
+        assignmentCount++;
+      }
+      if (q.quotedAt) {
+        const diffHours = (new Date(q.quotedAt).getTime() - created) / (1000 * 60 * 60);
+        totalQuotingHours += Math.max(diffHours, 0);
+        quotingCount++;
+      }
+      if (q.completedAt) {
+        const diffHours = (new Date(q.completedAt).getTime() - created) / (1000 * 60 * 60);
+        totalCompletionHours += Math.max(diffHours, 0);
+        completionCount++;
+      }
     });
```

</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@app/admin/analytics/page.tsx` around lines 156 - 183, Update the SLA
aggregation in the filteredQuotes loop to include a stage only when its real
timestamp exists: use assignedAt, quotedAt, or completedAt directly, remove all
Math.max floors, and never fall back to updatedAt. Exclude rows missing the
relevant stage timestamp from that stage’s count and total so slaBreakdown
averages reflect measured durations and can remain zero when no valid timestamps
exist.
```

</details>

<!-- cr-comment:v1:a993b394be3b8e9c315e41d6 -->

</blockquote></details>
<details>
<summary>components/admin/notification-drawer.tsx-77-103 (1)</summary><blockquote>

`77-103`: _🩺 Stability & Availability_ | _🟠 Major_ | _⚡ Quick win_

**Surface the server error message when an action fails.**

Both `handleAssignQuote` and `handleMarkInquiryInProgress` only refresh notifications when `res.success` is true. When `res.success` is false (for example, a second director loses the atomic assignment race in `assignQuoteToSelfAction`), the descriptive error message returned by the server (`"Quotation request was not found or has already been assigned."`) is discarded. The button simply stops loading with no visible difference from success, so the admin cannot tell whether the action worked.

<details>
<summary>🐛 Proposed fix (sketch)</summary>

```diff
   const handleAssignQuote = async (quoteId: string) => {
     setActioningId(quoteId);
     try {
       const res = await assignQuoteToSelfAction(quoteId);
       if (res.success) {
         await fetchNotifications();
+      } else {
+        toast.error(res.error ?? "Failed to assign quotation request.");
       }
     } catch (err) {
       console.error("Failed to assign quote:", err);
+      toast.error("Failed to assign quotation request.");
     } finally {
       setActioningId(null);
     }
   };
```

</details>

Apply the same pattern to `handleMarkInquiryInProgress`. Note: `totalUnread` displayed at lines 105 and 139-141 also has a data-accuracy issue traced to `actions/admin.ts`'s `getAdminNotificationsAction`; see the comment there.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@components/admin/notification-drawer.tsx` around lines 77 - 103, Update
handleAssignQuote and handleMarkInquiryInProgress to surface the server-provided
error when their action result has success false, while preserving notification
refresh on success and existing cleanup in finally. Use the descriptive message
from each response in the failure path so admins can distinguish failed actions
from successful ones; do not change the unrelated totalUnread behavior.
```

</details>

<!-- cr-comment:v1:b933a56d1165ba2af406b2f6 -->

</blockquote></details>
<details>
<summary>actions/admin.ts-57-71 (1)</summary><blockquote>

`57-71`: _🔒 Security & Privacy_ | _🟠 Major_ | _⚡ Quick win_

**Add the documented upper-bound length check to `adminSearchAction`.**

The function checks only `trimmed.length < 2` (line 64) before building `searchPattern` and querying the database. The project's own security stress-test spec (`context/feature-stress-test/32-phase-4d-command-center-and-diagnostics.md`, line 33) states the expected defense against A04:2026 Insecure Design is: "Query string trimmed; search skipped if length < 2 or length > 500." That upper bound does not exist in the code, so an arbitrarily long query string is still executed against two `ilike` queries.

Add the missing upper-bound check so behavior matches the documented control:

<details>
<summary>🐛 Proposed fix</summary>

```diff
     const trimmed = (query || "").trim();
-    if (!trimmed || trimmed.length < 2) {
+    if (!trimmed || trimmed.length < 2 || trimmed.length > 500) {
       return {
         success: true,
         data: { quotes: [], inquiries: [] },
       };
     }
```

</details>

Note that `scripts/stress/32-command-center-diagnostics-stress.ts` (lines 41-44) only asserts that a 600-character query returns `success: true`; it does not verify that the query is skipped, so it will not catch this gap. Update that assertion once the length check is added.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@actions/admin.ts` around lines 57 - 71, Update the validation in
adminSearchAction to return the existing empty successful response when
trimmed.length exceeds 500, alongside the current minimum-length check. Preserve
normal searching only for trimmed queries between 2 and 500 characters, and
update the stress test assertion for the 600-character query to verify the
search is skipped.
```

</details>

<!-- cr-comment:v1:5381be89e77c54c6c4496a61 -->

</blockquote></details>
<details>
<summary>actions/admin.ts-260-292 (1)</summary><blockquote>

`260-292`: _🗄️ Data Integrity & Integration_ | _🟠 Major_ | _⚡ Quick win_

**Validate `status` at runtime and confirm the inquiry exists before reporting success.**

Two gaps in `updateInquiryStatusAction`:

1. The `status` parameter is typed as a union at the TypeScript level only. Drizzle's `text(name, { enum: [...] })` config on `contactInquiries.status` "won't check runtime values" (per Drizzle's own column-type documentation), and this is a Server Action reachable with an arbitrary payload. An authenticated admin session (or a compromised one) can write any string into the `status` column, breaking the invariant that `getStatusBadge` in `app/admin/inquiries/page.tsx` (lines 63-76) relies on.
2. The update has no `.returning()` and no existence check, unlike `assignQuoteToSelfAction` above it. Calling this action with a non-existent `inquiryId` still reports `success: true`, silently masking typos or stale IDs.

<details>
<summary>🐛 Proposed fix</summary>

```diff
+const INQUIRY_STATUSES = ["new", "in_progress", "resolved", "archived"] as const;
+
 export async function updateInquiryStatusAction(
   inquiryId: string,
-  status: "new" | "in_progress" | "resolved" | "archived"
+  status: (typeof INQUIRY_STATUSES)[number]
 ): Promise<ActionResponse<{ message: string }>> {
   try {
     await requireAdminAuth();

-    await db
+    if (!INQUIRY_STATUSES.includes(status)) {
+      return { success: false, error: "Invalid inquiry status." };
+    }
+
+    const updated = await db
       .update(contactInquiries)
       .set({
         status,
         updatedAt: new Date(),
       })
-      .where(eq(contactInquiries.id, inquiryId));
+      .where(eq(contactInquiries.id, inquiryId))
+      .returning({ id: contactInquiries.id });
+
+    if (!updated || updated.length === 0) {
+      return {
+        success: false,
+        error: "Inquiry was not found.",
+      };
+    }
```

</details>

Note that `scripts/stress/32-command-center-diagnostics-stress.ts` (lines 72-80) currently asserts `success: true` for a non-existent `inquiryId`; that test needs updating once the existence check is added (see the corresponding note on that file).

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@actions/admin.ts` around lines 260 - 292, Update updateInquiryStatusAction to
validate the incoming status against the allowed runtime values before updating,
and use the update result’s returning/existence check to reject unknown
inquiryId values instead of reporting success. Preserve redirect handling and
return the existing success response only after a valid status is persisted for
an existing inquiry; update the related stress-test expectation for non-existent
IDs.
```

</details>

<!-- cr-comment:v1:6dfd894666b8b2c41d7dc7f2 -->

</blockquote></details>
<details>
<summary>actions/admin.ts-145-198 (1)</summary><blockquote>

`145-198`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_

**Fix the notification counts: they undercount once the backlog exceeds the query limits.**

`unassignedQuotes` and `newInquiries` are each capped with `.limit(10)` (lines 155, 161). `totalUnread`, `unassignedQuotesCount`, and `newInquiriesCount` (lines 193-196) are then derived from `.length` of these capped arrays, not from a real count of matching rows. If there are, for example, 15 unassigned quotes, `unassignedQuotesCount` reports 10, and `totalUnread` is capped at 20 even when the true backlog is larger. `components/admin/notification-drawer.tsx` (lines 105, 139-141) renders this `totalUnread` value directly in the bell badge and drawer header, so directors see an understated backlog once volume exceeds the per-category limit.

Use separate `count(*)` queries for the counts, matching the pattern already used in `app/admin/inquiries/page.tsx` (lines 51-52):

<details>
<summary>🐛 Proposed fix</summary>

```diff
-    const [unassignedQuotes, newInquiries] = await Promise.all([
+    const [unassignedQuotes, newInquiries, [unassignedQuotesTotal], [newInquiriesTotal]] = await Promise.all([
       db
         .select()
         .from(quotes)
         .where(and(eq(quotes.status, "pending"), isNull(quotes.assignedManagerId)))
         .orderBy(desc(quotes.createdAt))
         .limit(10),
       db
         .select()
         .from(contactInquiries)
         .where(eq(contactInquiries.status, "new"))
         .orderBy(desc(contactInquiries.createdAt))
         .limit(10),
+      db
+        .select({ count: sql<number>`count(*)` })
+        .from(quotes)
+        .where(and(eq(quotes.status, "pending"), isNull(quotes.assignedManagerId))),
+      db
+        .select({ count: sql<number>`count(*)` })
+        .from(contactInquiries)
+        .where(eq(contactInquiries.status, "new")),
     ]);
@@
-        totalUnread: combinedItems.length,
-        unassignedQuotesCount: quoteItemsMapped.length,
-        newInquiriesCount: inquiryItemsMapped.length,
+        totalUnread: Number(unassignedQuotesTotal?.count || 0) + Number(newInquiriesTotal?.count || 0),
+        unassignedQuotesCount: Number(unassignedQuotesTotal?.count || 0),
+        newInquiriesCount: Number(newInquiriesTotal?.count || 0),
```

</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@actions/admin.ts` around lines 145 - 198, Update getAdminNotificationsAction
to run separate count(*) queries for pending unassigned quotes and new inquiries
without the existing .limit(10) caps, while retaining the limited queries for
notification items. Derive unassignedQuotesCount and newInquiriesCount from
those count results, and calculate totalUnread from the uncapped counts rather
than the mapped array lengths.
```

</details>

<!-- cr-comment:v1:5d01b50a7d8f9bbaaec7b07b -->

</blockquote></details>

</blockquote></details>

---

<details>
<summary>ℹ️ Review info</summary>

<details>
<summary>⚙️ Run configuration</summary>

**Configuration used**: defaults

**Review profile**: CHILL

**Plan**: Pro Plus

**Run ID**: `0c651796-77ff-4f46-a8e3-04b3201336b2`

</details>

<details>
<summary>📥 Commits</summary>

Reviewing files that changed from the base of the PR and between 9609e76a150fd574ee9d1d65d323207260eed659 and 7e695b66e0eec1c724ee0075c25334405e63976b.

</details>

<details>
<summary>⛔ Files ignored due to path filters (1)</summary>

- `pnpm-lock.yaml` is excluded by `!**/pnpm-lock.yaml`

</details>

<details>
<summary>📒 Files selected for processing (91)</summary>

- `AGENTS.md`
- `actions/admin.ts`
- `actions/customer.ts`
- `actions/lead.ts`
- `app/admin/analytics/page.tsx`
- `app/admin/customers/[id]/page.tsx`
- `app/admin/customers/page.tsx`
- `app/admin/inquiries/page.tsx`
- `app/admin/layout.tsx`
- `app/admin/leads/[id]/page.tsx`
- `app/admin/leads/page.tsx`
- `app/admin/login/[[...login]]/page.tsx`
- `app/admin/page.tsx`
- `app/admin/quotes/page.tsx`
- `app/admin/unauthorized/page.tsx`
- `components/admin/admin-header.tsx`
- `components/admin/admin-mobile-nav.tsx`
- `components/admin/admin-sidebar.tsx`
- `components/admin/analytics/analytics-charts.tsx`
- `components/admin/analytics/analytics-filter-bar.tsx`
- `components/admin/analytics/conversion-funnel-sla.tsx`
- `components/admin/analytics/executive-throughput-cards.tsx`
- `components/admin/command-palette.tsx`
- `components/admin/customers/customer-form-modal.tsx`
- `components/admin/customers/customer-notes-editor.tsx`
- `components/admin/customers/customer-table.tsx`
- `components/admin/leads/convert-lead-modal.tsx`
- `components/admin/leads/lead-detail-client.tsx`
- `components/admin/leads/lead-filter-bar.tsx`
- `components/admin/leads/lead-form-modal.tsx`
- `components/admin/leads/lead-table.tsx`
- `components/admin/leads/leads-table-container.tsx`
- `components/admin/notification-drawer.tsx`
- `components/admin/pending-directives-alert.tsx`
- `components/admin/recent-activity-stream.tsx`
- `components/providers/admin-shell-provider.tsx`
- `constants/admin-navigation.ts`
- `context/ai-workflow-rules.md`
- `context/audit-reports/End-to-End System Audit Report.md`
- `context/code-rabbits-comments/coderabbit-comment-after-last-commit-51838c9.md`
- `context/code-rabbits-comments/coderabbit-comment-after-last-commit-7ed10c2.md`
- `context/code-rabbits-comments/coderabbit-comment-after-last-commit-8f37cec.md`
- `context/feature-stress-test/26-phase-4a-responsive-admin-layout-and-shell.md`
- `context/feature-stress-test/27-phase-4a-clerk-role-authorization-guard.md`
- `context/feature-stress-test/28-phase-4b-executive-metrics-and-activity-overview.md`
- `context/feature-stress-test/29-phase-4c-advanced-analytics-and-visualizations.md`
- `context/feature-stress-test/30-fix-coderabbit-pr-review-findings.md`
- `context/feature-stress-test/31-fix-coderabbit-pr-review-findings.md`
- `context/feature-stress-test/32-phase-4d-command-center-and-diagnostics.md`
- `context/feature-stress-test/33-phase-5a-customer-and-account-management-core.md`
- `context/feature-stress-test/34-phase-5b-lead-management-and-inquiry-processing.md`
- `context/feature-stress-test/README.md`
- `context/implementation-specs/26-phase-4a-responsive-admin-layout-and-shell.md`
- `context/implementation-specs/27-phase-4a-clerk-role-authorization-guard.md`
- `context/implementation-specs/28-phase-4b-executive-metrics-and-activity-overview.md`
- `context/implementation-specs/29-phase-4c-advanced-analytics-and-visualizations.md`
- `context/implementation-specs/30-fix-coderabbit-pr-review-findings.md`
- `context/implementation-specs/31-fix-coderabbit-pr-review-findings.md`
- `context/implementation-specs/32-phase-4d-command-center-and-diagnostics.md`
- `context/implementation-specs/33-phase-5a-customer-and-account-management-core.md`
- `context/implementation-specs/34-phase-5b-lead-management-and-inquiry-processing.md`
- `context/implementation-specs/README.md`
- `context/progress-tracker.md`
- `db/schema.ts`
- `db/seed.mjs`
- `docs/database-schema.md`
- `docs/feature-roadmap.md`
- `lib/admin-auth.ts`
- `lib/email.ts`
- `package.json`
- `proxy.ts`
- `schemas/customer.ts`
- `schemas/lead.ts`
- `scripts/stress/26-layout-shell-stress.ts`
- `scripts/stress/27-clerk-auth-guard-stress.ts`
- `scripts/stress/28-executive-metrics-stress.ts`
- `scripts/stress/29-analytics-visualizations-stress.ts`
- `scripts/stress/30-coderabbit-pr11-stress.ts`
- `scripts/stress/31-coderabbit-pr12-stress.ts`
- `scripts/stress/32-command-center-diagnostics-stress.ts`
- `scripts/stress/33-customer-management-stress.ts`
- `scripts/stress/34-lead-management-stress.ts`
- `scripts/stress/run-phase4-stress-suite.ts`
- `scripts/stress/run-phase5-stress-suite.ts`
- `scripts/test-phase4d.ts`
- `scripts/test-phase5a-customers.ts`
- `scripts/test-phase5b-leads.ts`
- `supabase/migrations/20260801000003_add_stage_timestamps_to_quotes.sql`
- `supabase/migrations/20260802000000_create_customers_table.sql`
- `supabase/migrations/20260802000001_create_leads_table.sql`
- `supabase/seed.sql`

</details>

<details>
<summary>💤 Files with no reviewable changes (1)</summary>

- context/audit-reports/End-to-End System Audit Report.md

</details>

</details>

<!-- This is an auto-generated comment by CodeRabbit for review status -->
