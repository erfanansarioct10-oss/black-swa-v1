# Feature Stress Testing Guide

> Location: `context/feature-stress-test/`

This directory contains structured, rigorous technical stress testing and security audit plan documents for features, APIs, database schemas, Server Actions, and business logic across the Black Swan International platform.

Every AI coding agent **MUST** follow the guidelines, security attack matrices, and specification template documented below whenever instructed to write a feature stress test plan.

---

## 1. Purpose of Feature Stress Testing

Feature stress testing plans serve as security, resilience, and vulnerability blueprints before and during code implementation. They ensure that:

- Every feature is battle-tested against **OWASP Web Application Top 10 (2026 Edition)** security vulnerabilities.
- **Supabase Row-Level Security (RLS)** policies, role-based authorization guards (Clerk RBAC), and multi-tenant data boundaries cannot be bypassed by malicious payload injection or privilege escalation attempts.
- Database operations, Server Actions, and API endpoints handle high-concurrency race conditions, transaction lock contention, and edge-case inputs without corruption or data leakage.
- Features are tested **strictly using terminal tools, CLI utilities, and custom Node.js/TypeScript execution scripts** (e.g., `pnpm exec`, `tsx`, `vitest`, `curl`, `pnpm exec supabase`). **No browser-based manual or automated UI testing is permitted.**

---

## 2. File Naming Convention

All feature stress test files inside `context/feature-stress-test/` **MUST** follow a two-digit sequential prefix aligned **1:1** with the corresponding implementation specification in `context/implementation-specs/`:

```text
context/feature-stress-test/
├── README.md
├── 01-fix-coderabbit-pr-review-findings.md
├── 02-homepage-brand-marquee-section.md
└── XX-[feature-name].md
```

- **Prefix:** `01-`, `02-`, `03-`, etc. (matching the implementation spec ID).
- **Format:** `.md` (Markdown).

---

## 3. OWASP Web Application Top 10 (2026 Edition) Reference Matrix

All stress test plans drafted by AI agents **MUST** explicitly audit the target feature surface against the OWASP 2026 Top 10 security risks:

| Risk Category | OWASP Vulnerability Title | Focus for Feature Stress Testing |
| --- | --- | --- |
| **A01:2026** | **Broken Access Control & RLS Bypass** | Direct Object References (IDOR), RLS policy evasion, unauthenticated Server Action execution, missing Clerk RBAC role guards. |
| **A02:2026** | **Cryptographic Failures & Token Invalidation** | Weak token validation, exposed secrets in server actions/responses, unencrypted sensitive payload transmission. |
| **A03:2026** | **Injection & Payload Abuse (SQLi/XSS/Command)** | SQL injection via raw queries/filters, Server Action Zod schema bypass, unescaped HTML output, command injection. |
| **A04:2026** | **Insecure Design & Architecture Flaws** | Flawed business logic flow, state machine manipulation, missing rate limits, unprotected public endpoints. |
| **A05:2026** | **Security Misconfiguration & Header Leaks** | Overly permissive RLS policies, verbose error stack trace leakage in production API responses, missing CORS restrictions. |
| **A06:2026** | **Vulnerable and Outdated Components** | Insecure package imports, vulnerable transitive dependencies, unsafe third-party library usage. |
| **A07:2026** | **Identification & Authentication Failures** | Session hijacking, missing multi-factor or Clerk session checks, cookie manipulation, token reuse. |
| **A08:2026** | **Software & Data Integrity Failures** | Unverified webhook signatures (e.g., Clerk/Resend webhooks), untrusted payload deserialization, cache poisoning. |
| **A09:2026** | **Security Logging & Monitoring Failures** | Silent failure swallowing, failure to log unauthorized access attempts, lack of audit trails for sensitive state changes. |
| **A10:2026** | **Server-Side Request Forgery (SSRF) & API Abuse** | Unrestricted outgoing HTTP requests in Server Actions/Webhooks, SSRF via user-supplied URLs, web scraping abuse. |

---

## 4. Mandatory Stress Test Plan Template

Every feature stress test file (`context/feature-stress-test/XX-[feature-name].md`) **MUST** include the following 7 sections:

````markdown
# Feature Stress Test Plan [ID]: [Feature or Task Title]

> **Stress Test ID:** [XX-kebab-case-title]  
> **Corresponding Spec:** [context/implementation-specs/XX-title.md]  
> **Status:** [Draft / Approved / In Progress / Verified Clean]  
> **Created Date:** [YYYY-MM-DD]

---

## Executive Summary & Feature Surface Map

Provide a high-level overview of the feature stress test scope, target components, APIs, database tables, and Server Actions being tested.

### Target Attack & Stress Surface

| Surface Type | Path / Target | Associated Roles / Auth Level |
| --- | --- | --- |
| **Server Action** | `app/actions/example-action.ts` | Admin Only (`org:admin`) |
| **Database Table** | `public.quotes` (Supabase DB) | Authenticated + RLS Policy |
| **API Route** | `app/api/v1/webhook/route.ts` | Public (Signed Webhook) |

---

## 1. OWASP Top 10 (2026) Security Audit & Attack Matrix

Audit the feature against relevant OWASP 2026 attack vectors:

| OWASP Vector | Specific Vulnerability Scenario | Expected Prevention / Defense | Test Script / CLI Command |
| --- | --- | --- | --- |
| **A01:2026 (Broken Access Control)** | User attempts to update quote owned by another org ID via Server Action payload. | Clerk RBAC check rejects invocation; Supabase RLS blocks DB row update. | `npx tsx scripts/stress/test-rbac-bypass.ts` |
| **A03:2026 (Injection)** | User passes SQL payload `' OR 1=1 --` into search query parameter. | Drizzle ORM parameterized queries neutralize input cleanly. | `npx tsx scripts/stress/test-sqli-payloads.ts` |
| **A10:2026 (SSRF)** | User submits malicious URL target in webhook config form. | URL validation restricts protocols to HTTPS and blocks private IPs (`127.0.0.1`, `10.0.0.0/8`). | `npx tsx scripts/stress/test-ssrf-validation.ts` |

---

## 2. Supabase RLS & Database Resilience Stress Suite

Detail database-level stress scenarios, schema enforcement tests, and RLS policy isolation checks:

### RLS Policy Isolation Tests
- **Test Scenario 1 (Cross-Tenant Access):** Attempt `SELECT`, `UPDATE`, and `DELETE` queries using unprivileged user JWT or service key mock.
- **Expected Result:** Supabase returns `0` rows or RLS policy violation exception.

### Database Lock Contention & Transaction Limits
- **Test Scenario 2 (Concurrent Writes):** Execute 50 parallel upsert queries against `public.quotes` within 1 second.
- **Expected Result:** Drizzle ORM transactions resolve sequentially without deadlocks or corrupted state.

---

## 3. Terminal & Script-Driven Automated Test Suite

List the exact script files and CLI commands used to run the stress test suite (strictly CLI/script-based):

```bash
# Execute unit & integration stress tests via Vitest
pnpm run test scripts/stress/XX-feature-stress.test.ts

# Execute standalone TypeScript stress runner via tsx
npx tsx scripts/stress/XX-feature-payload-fuzzing.ts

# Test API endpoints via curl/HTTP scripts
curl -i -X POST http://localhost:3000/api/v1/endpoint \
  -H "Content-Type: application/json" \
  -d '{"malicious_key": "<script>alert(1)</script>"}'
```

---

## 4. Concurrency, Race Conditions & State Mutation Stress Scenarios

Evaluate how the system handles simultaneous actions, double submission, and optimistic lock collisions:

| Stress Vector | Simulation Method | Success Criteria |
| --- | --- | --- |
| **Double-Submit Server Action** | `Promise.all([action(data), action(data)])` | First call succeeds; second call fails gracefully with idempotent result or duplicate key error. |
| **Race Condition on Status State** | Concurrent update calls setting status to `APPROVED` and `REJECTED` simultaneously. | DB transaction integrity maintained; final state matches valid transition rule. |

---

## 5. Boundary Data, Malicious Inputs & Payload Fuzzing Specs

Define extreme boundary cases and fuzzed inputs:

- **String Length Overflows:** 100,000+ character strings in form input fields.
- **Type Mismatches & Payload Tampering:** Passing arrays/objects where strings are expected, `null`/`undefined` injections, NaN values.
- **Special Characters & Unicode:** Null bytes (`\0`), right-to-left overrides, multi-byte emoji sequences, unescaped HTML/JS entities.

---

## 6. System Resilience & Failure Recovery

Verify system behavior during unexpected failures:

- **Database Disconnection / Timeout:** How Server Actions handle Supabase connection drops.
- **Third-Party API Outage:** How notifications degrade when Resend/Telegram APIs fail or timeout.
- **Graceful Error Handling:** Ensure users receive sanitized user-friendly error messages without disclosing server internals or stack traces.

---

## 7. Execution Workflow, Verification Commands & Definition of Done

To mark this stress test plan **Verified Clean**, all the following conditions must be met:

1. `pnpm run lint` executes with zero errors and zero warnings.
2. `pnpm run build` (or `pnpm run typecheck`) compiles cleanly without TypeScript errors.
3. All terminal/script-driven stress tests execute cleanly with zero vulnerability findings and zero unhandled exceptions:
   ```bash
   npx tsx scripts/stress/XX-[feature]-runner.ts
   ```
4. Zero Supabase RLS policy leaks or unhandled database lock exceptions detected.
````

---

## 5. Agent Workflow Integration

> [!IMPORTANT]
> **Mandatory Stress Test Execution Rule:** AI agents MUST draft `context/feature-stress-test/XX-[feature-name].md` alongside or immediately after writing the implementation specification. Stress tests MUST be executed using terminal CLI commands and TypeScript/Vitest scripts. AI agents MUST fix all security vulnerabilities, RLS leaks, or crash bugs uncovered during stress testing before declaring a feature complete.

### Standard Lifecycle Flow:

1. **Load Context:** Read `AGENTS.md`, `context/architecture.md`, `context/code-standards.md`, and relevant implementation specs.
2. **Draft Stress Test Spec:** Create `context/feature-stress-test/XX-[feature-name].md` using the 7-section template above.
3. **Register in Registry Index:** Add the new stress test plan to the registry table in `context/feature-stress-test/README.md` and update `context/progress-tracker.md`.
4. **Obtain Approval:** Present the stress test plan to the user alongside the implementation plan.
5. **Execute Script Suite:** Run terminal verification commands (e.g., `npx tsx scripts/stress/...`, `pnpm run test`).
6. **Remediate Findings:** Fix any failing security checks, RLS bypasses, or unexpected crashes in source code.
7. **Validate Clean Run:** Verify `pnpm run lint` and `pnpm run build` pass with zero errors.

---

## 6. Feature Stress Test Registry Index

| Stress Test ID | Title | Status | Target Surface |
| --- | --- | --- | --- |
| [01-fix-coderabbit-pr-review-findings](01-fix-coderabbit-pr-review-findings.md) | Fix CodeRabbit PR Review Findings Stress Audit | Draft | Layouts, Auth Guards, Forms |
| [02-homepage-brand-marquee-section](02-homepage-brand-marquee-section.md) | Homepage Dual-Row Brand Marquee Stress Test | Draft | Marquee Component & Animation Performance |
| [03-fix-coderabbit-marquee-and-catalog-review-findings](03-fix-coderabbit-marquee-and-catalog-review-findings.md) | Marquee & Catalog Findings Security & Stress Audit | Draft | Marquee & Catalog Utilities |
| [04-homepage-certifications-section](04-homepage-certifications-section.md) | Certifications Grid Boundary & Input Stress Test | Draft | Certification Data & Grid Rendering |
| [05-seo-compliance-and-technical-optimization](05-seo-compliance-and-technical-optimization.md) | SEO Metadata & Payload Stress Audit | Draft | OpenGraph Payload & Dynamic Head Tags |
| [06-homepage-featured-products-section](06-homepage-featured-products-section.md) | Featured Products Boundary & Payload Fuzzing | Draft | Product Catalog Data & Mock State |
| [07-homepage-popular-services-section](07-homepage-popular-services-section.md) | Popular Services Data Integrity Stress Test | Draft | Services Grid & Category Filters |
| [08-homepage-enterprise-advantage-section](08-homepage-enterprise-advantage-section.md) | Enterprise Advantage Trust Grid Fuzzing | Draft | Advantage Cards & Layout Props |
| [09-homepage-procurement-workflow-section](09-homepage-procurement-workflow-section.md) | Procurement Workflow Step State Stress Test | Draft | Workflow Step Data & State Controls |
| [10-homepage-customer-reviews-section](10-homepage-customer-reviews-section.md) | Customer Reviews Data Fuzzing & XSS Audit | Draft | Testimonials Data & HTML Escaping |
| [11-fix-coderabbit-latest-pr-review-findings](11-fix-coderabbit-latest-pr-review-findings.md) | Latest PR Findings Security & Input Stress Audit | Draft | Component Refactoring |
| [12-homepage-who-we-are-section](12-homepage-who-we-are-section.md) | Who We Are Brand Section Stress Test | Draft | Brand Narrative Data & Rendering |
| [13-about-us-page](13-about-us-page.md) | About Us Page Route Stress & Payload Audit | Draft | About Route & Sub-Components |
| [14-fix-coderabbit-about-page-findings](14-fix-coderabbit-about-page-findings.md) | About Page Findings Security Audit | Draft | Accessibility & Image Asset Payloads |
| [15-services-page-and-detail-blog-system](15-services-page-and-detail-blog-system.md) | Services Catalog & Blog Payload Stress Audit | Draft | Service Detail & Blog Route Payloads |
| [16-fix-coderabbit-services-page-findings](16-fix-coderabbit-services-page-findings.md) | Services System Cleanups Stress Audit | Draft | Service Filters & Utility Cleanups |
| [17-phase-3a-quote-database-schema-and-server-actions](17-phase-3a-quote-database-schema-and-server-actions.md) | Quote DB Schema & Server Actions Security & Stress Audit | Draft | Drizzle ORM, Supabase RLS, Quote Actions |
| [18-phase-3b-interactive-quote-cart-and-multi-step-rfq-wizard-ui](18-phase-3b-interactive-quote-cart-and-multi-step-rfq-wizard-ui.md) | Quote Cart & Multi-Step Wizard State Stress Test | Draft | Local Storage State & Wizard State Machines |
| [19-phase-3c-automated-notifications-and-integration-pipeline](19-phase-3c-automated-notifications-and-integration-pipeline.md) | Automated Notifications & Webhook Security Audit | Draft | Resend API, Telegram Webhook, Rate Limits |
| [20-phase-3d-public-quote-tracking-portal](20-phase-3d-public-quote-tracking-portal.md) | Public Quote Tracking IDOR & Rate Limit Audit | Draft | Public Tracking Route, IDOR Protection |
| [21-phase-3-refinements-and-bug-fixes](21-phase-3-refinements-and-bug-fixes.md) | Quote System Refinements Vulnerability Audit | Draft | Quote Portal Edge Cases & Input Validation |
| [22-supabase-rls-security-and-index-optimizations](22-supabase-rls-security-and-index-optimizations.md) | Supabase RLS Security & DB Stress Suite | Draft | PostgreSQL RLS Policies & Performance Indexes |
| [23-contact-and-service-inquiry-automated-notifications](23-contact-and-service-inquiry-automated-notifications.md) | Contact & Service Inquiry Rate Limit & Spam Stress Test | Draft | Form Server Actions, Notification Triggers |
| [24-pre-commit-audit-polish-and-code-deduplication](24-pre-commit-audit-polish-and-code-deduplication.md) | Pre-Commit Audit Security & Code Deduplication Audit | Draft | Server Actions, Utility Deduplication |
| [25-security-vulnerability-overrides](25-security-vulnerability-overrides.md) | Transitive Security Vulnerability Audit | Draft | `package.json` Overrides & Dependency Tree |
| [26-phase-4a-responsive-admin-layout-and-shell](26-phase-4a-responsive-admin-layout-and-shell.md) | Responsive Admin Shell & Layout Stress Test | Verified Clean | Admin Layout Shell & Navigation State |
| [27-phase-4a-clerk-role-authorization-guard](27-phase-4a-clerk-role-authorization-guard.md) | Clerk Role Authorization Guard Security & Privilege Escalation Audit | Verified Clean | `lib/admin-auth.ts`, Clerk RBAC Guard |
| [28-phase-4b-executive-metrics-and-activity-overview](28-phase-4b-executive-metrics-and-activity-overview.md) | Executive Metrics Dashboard Performance & Data Stress Test | Verified Clean | Dashboard Metrics Queries & Server Actions |
| [29-phase-4c-advanced-analytics-and-visualizations](29-phase-4c-advanced-analytics-and-visualizations.md) | Advanced Analytics & Visualization Payload Fuzzing | Verified Clean | Analytics Queries, SLA Calculation Stress |
| [30-fix-coderabbit-pr-review-findings](30-fix-coderabbit-pr-review-findings.md) | Fix CodeRabbit PR Review Findings (PR #11) Security Audit | Verified Clean | Security Middleware & Auth Routing |
| [31-fix-coderabbit-pr-review-findings](31-fix-coderabbit-pr-review-findings.md) | Fix CodeRabbit PR Review Findings (PR #12) Security Audit | Verified Clean | Middleware, Database Queries & Visualizations |
| [32-phase-4d-command-center-and-diagnostics](32-phase-4d-command-center-and-diagnostics.md) | Command Center Palette Search Fuzzing & Diagnostics Audit | Verified Clean | Quick Search Actions & System Diagnostics |
| [33-phase-5a-customer-and-account-management-core](33-phase-5a-customer-and-account-management-core.md) | Customer & Account Core RLS & Concurrency Stress Test | Verified Clean | Customer Directory, Profile DB Actions |
| [34-phase-5b-lead-management-and-inquiry-processing](34-phase-5b-lead-management-and-inquiry-processing.md) | Lead Management Pipeline RLS & State Transition Stress Test | Verified Clean | Lead Pipeline, Inquiry Server Actions |
