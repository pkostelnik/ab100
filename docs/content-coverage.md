# Question Content Coverage and Review

Review date: 2026-09-06. Scope: work package 2 of the approved gauntlet-corrections plan; findings G03-G05, G15, G16. Only `questions.js` and this report are owned by this work package. No commits, pushes, application/i18n changes, test-file changes, or Markdown mirror regeneration.

## Outcome and Scope

- 101 English practice scenarios: 89 single-choice, 8 multiple-response, 4 matching.
- All 95 original numeric ID slots are retained. Every old record has rewritten answers and revision 2. Six supplemental scenarios have explicitly authored IDs 96-101 and revision 2, the content-package revision.
- 101/101 records received an authoring-agent editorial pass. Independent review subsequently rejected distractor plausibility in Q46, Q56, Q75, and Q93. The first pass therefore did not establish satisfactory distractor quality. A second full-bank plausibility scan and the revisions documented below respond to that feedback; independent acceptance of these revisions and psychometric validation remain outstanding.
- All 27 audited duplicate pairs were manually compared; the later member was replaced with a different decision or constraint. Additional overlaps outside the audit list were also addressed below.
- 101/101 records have `official: false` and `sourceType: 'Unofficial practice, Learn-aligned'`. No record claims Microsoft authorship, original exam content, or verified dump lineage.
- 41 distinct primary verification URLs are used across the 101 records. Each was fetched in full through Microsoft Learn MCP during the initial work-package review, following topic searches; the retrieved content was reviewed for relevance. The follow-up pass re-fetched selected pages and added supporting reads as documented below; it did not repeat all 41 fetches.
- No Azure, Dynamics, Power Apps, or Copilot Studio tenant was configured or exercised. Documentation review does not prove that a capability is enabled, licensed, supported in a particular tenant, or currently GA in every region.
- The July 22, 2026 AB-100 study-guide objective list was fetched and used as the coverage baseline. Questions assess selected architectural decisions within those objectives, not every feature or implementation procedure.

## Data Contract

`questions` remains a global lexical array, consumable by the existing classic-script application. Each record explicitly authors `id`, `revision`, `labIds`, question text, options, answer, explanation, topic, and an evidence key. `practice` supplies shared provenance/format defaults and resolves that key to `source`; it never derives an ID or lab mapping from position or topic. No question has a `domain` field.

`study-state.js` was read before authoring. Single answers are zero-based integers; multiple answers are arrays of unique zero-based indices; matching answers are keyed by stringified option index and map to the first letter of `matchLabels`. Matching records retain the legacy numeric `answer: 0`, but `matches` is their actual answer key. All keys were checked with `StudyState.validResponse(..., true)` and `StudyState.isCorrect`.

Revision 2 is important even when a correct letter stayed the same: the options and their meaning changed. The existing state module rejects revised legacy answers, archives incompatible versioned records during its save path, and invalidates exam references to older question revisions. This package did not modify that behavior or access the user's stored study data.

English text is the canonical input for the later localization work package. Stable IDs, option order, match letters, and revision values must be preserved when adding translations. Re-run editorial and length checks for each locale; English measurements do not establish German answer quality.

## Provenance Process

1. Start with the exam objective and a distinct business decision; do not rewrite a source assessment question.
2. Search Microsoft Learn, fetch the relevant documentation, and read the constraints as well as the capability description.
3. Author a new scenario and plausible alternatives in original wording. State hypothetical business constraints and numeric assumptions explicitly.
4. Use `source` for the primary verification URL, not for claimed authorship. `verifiedOn` records this documentation-review date, not a product test, historical origin verification, or permanent validity guarantee.
5. Add other source relationships only when supported. IDs 84-95 retain `originSource` URLs for the C1756 lab associations already present in the previous repository bank. Their revised text is unofficial Learn-aligned practice, not a quoted or verified upstream courseware assessment. Those upstream lab files were NOT re-fetched in this pass, and their exact current wording/lineage is not certified here.
6. The previous array name `dumpsbase` and default label `DumpsBase practice` did not establish item-level provenance. No dump site or proprietary exam was consulted. IDs 1-38 inherit local scenario slots, not verified DumpsBase lineage. No unsupported `adaptationSource` has been invented.
7. When documentation changes, reassess the claim, options, answer key, and explanation together. Advance the question revision for material changes; keep the stable ID unless the identity policy explicitly changes.

All scenario judgments remain the author's. In particular, Q27's study-guide citation verifies that cross-Dynamics end-to-end testing is in scope; it does not claim that Microsoft published the hypothetical failure test. Q71/Q89/Q86 use established design patterns for idempotency, approval binding, and bounded delegation; these must be implemented and tested by the solution, not assumed to be guaranteed by the platform.

## Technical Qualifications

| Concern | IDs | What the source review established |
| --- | --- | --- |
| Purview versus residency | 11, 36, 80, 95 | Classification, supported DLP, and compliance evidence are not endpoint placement or routing configuration. Validate inference, grounding, tools, logs, retention, and cross-service movement separately. |
| EU flex routing | 80 | Current admin guidance allows outside-EU-boundary inference and associated pseudonymized data handling under flex routing. A database region or encryption does not satisfy an inference-location requirement. Review feature-specific paths and disable flex routing for the stated constraint. |
| Local MCP utility | 23, 90 | Standard-harness Studio uses a reachable server URL and Streamable HTTP; a laptop stdio process is not directly launchable by the cloud service. Host/bridge securely, configure appropriate authentication, and apply connector data policies. The fetched page says SSE support ended after August 2025. |
| A2A versus ordinary tools | 24, 45, 59, 86, 90 | A2A requires a compatible agent endpoint; a plain REST lookup is not an A2A agent. Review history/context sharing, identity, authority, and task ownership. Lab 5 is explicit on all these records. |
| Agent feed | 51, 101 | Current documentation is preview, English-only, region-dependent, and requires Power Apps MCP plus app supervision. Task-table readers can see feed items; addressed tasks are not automatically private. |
| Generative pages | 46, 98 | Code-first TypeScript/React authoring is for model-driven apps and Dataverse data. Pages are solution-aware; older preview pages may need migration. Full authoring chat does not travel with the exported app. Generated code still needs review. |
| Well-Architected | 44, 100 | Power Platform pillars are Reliability, Security, Operational Excellence, Performance Efficiency, Experience Optimization. Do not substitute Azure's standalone Cost Optimization pillar. Recovery and usability need explicit design. |
| Deep reasoning | 57 | The specific standard-harness feature is preview; it requires generative orchestration and enabling reasoning, adds latency/credits, and makes no residency commitment. Scope the pilot to synthetic data and recheck production eligibility. |
| Voice | 10 | Real-time voice supports DTMF, barge-in, and voice activity detection; text-only tests are insufficient. Model, geography, digital-channel preview, authentication, and logging limitations vary. No blanket claim that every voice configuration has identical support. |
| Computer Use | 22, 58, 90 | A machine and supported operating environment are required. The guidance distinguishes prototype hosted machines from BYO production use and recommends RPA for GA-only, stable-selector workloads. Missing APIs alone do not force Computer Use. |
| Payables Agent | 6, 37 | Business Central agent can create a blocked vendor and draft invoices; vendor approval is outside that agent. The page explicitly lists approval flows as unsupported. Q37 is a hypothetical governed payment design, not a Payables Agent capability claim. |
| F&O knowledge | 33, 60 | File-based help-and-guidance extension and structured-data chat preview have different paths. Older help guidance says virtual entities are unsupported there; the newer structured-data chat page supports virtual entities or synchronized Dataverse data. The questions distinguish the experiences rather than flattening the difference. |
| F&O ALM | 8 | New unified-environment guidance supports a unified package containing compiled X++ output AND Dataverse solutions. Distinct artifacts/build paths do not imply that a combined deployment package is impossible. |
| Published Foundry identity | 75 | The question explicitly uses the Agent Application publishing model and evidence of a new principal lacking blob-read access. Project identity permissions do not automatically transfer in that model. Current identity documentation warns that the newer agent object model differs; do not generalize this transition to all publishing experiences. |
| Sales/Service branding and writes | 61, 91, 96 | Current Sales agent setup and Service Agent documentation describe configured CRM sources and permitted actions. Microsoft 365 agents are not categorically read-only. The Service URL redirected to current Customer Service documentation. |
| Evaluation limits | 35, 68, 69, 70, 92 | Functional answer evaluation does not replace responsible AI review, access tests, or content safety. An average does not override a mandatory privacy gate. Generated tests require curated expectations. |
| Model routing | 25, 50 | Select against task quality, cost, tail latency, and policy; routing is not a promise that the cheapest/smallest model is always correct. Q50's prices and equal-quality assumption are hypothetical. |

Source conflict handling: the Well-Architected intelligent-application landing URL redirected to the Studio guidance hub, so it was not used as proof of a specific pillar claim; the dedicated pillars page was used. The Foundry Tools overview still includes links to retired services in older examples; those examples were not treated as new-workload recommendations. The document-processing comparison distinguishes stable API guidance from a newer preview notice; Q52/Q99 avoid claiming universal GA availability. Feature names, dates, and permissions must be rechecked when these scenarios are next revised.

## Objective Coverage

Document keys below resolve to the verification register in the next section and to `questionSources` in `questions.js`. Labs are deliberate learning associations, not claims that the upstream lab contains that exact feature or question. Cross-area links are present only when the decision uses both learning areas. A row can assess part of a broad objective without being exhaustive.

### Plan

| Objective or assessed decision | Question IDs | Labs | Docs |
| --- | --- | --- | --- |
| Assess agents versus deterministic task automation | 2, 41, 84 | 01, 04 | strategy, autonomous |
| Analytics and decision-making workload selection | 38, 39, 41 | 01, 02, 03 | data, strategy |
| Grounding accuracy, relevance, timeliness, cleanliness, availability | 17, 26, 42, 85 | 01, 04, 07 | grounding |
| Organize data for other AI systems | 13, 38, 43, 63 | 01, 04, 06 | data |
| Apply CAF adoption process and readiness | 12, 39, 40 | 02, 03 | strategy, blueprint |
| Strategy, platform boundaries, rules, and constraints | 4, 18, 21, 45, 86, 87 | 02, 03, 05, 06 | strategy, a2a, lifecycle |
| Develop prebuilt-agent use cases | 6, 18, 61, 96 | 02, 03, 06 | payables, strategy, salesSetup, service |
| Multi-agent design across Microsoft platforms | 24, 45, 86, 87, 90 | 02, 05 | a2a, lifecycle, tools |
| Decide knowledge use and retrieval versus model behavior | 13, 17, 19, 21, 26 | 01, 02, 04, 05, 06, 07 | data, grounding, fineTune, strategy |
| Custom agents versus extending Microsoft 365 Copilot | 18, 21, 87 | 02, 03, 05, 06 | strategy, lifecycle |
| Custom models and specialized small-model use cases | 1, 19, 35, 77 | 02, 05, 07, 08 | lifecycle, fineTune, modelAlm |
| Prompt library guidelines and prompt engineering | 20, 53, 62, 72, 89 | 03, 04, 06, 07, 09 | tools, orchestration |
| AI Center of Excellence elements | 20, 47 | 03, 04 | tools, strategy |
| Multiple Dynamics apps and shared ownership | 27, 63, 71, 91 | 01, 06, 07 | scope, data, orchestration, strategy |
| ROI criteria and lifecycle TCO | 14, 48, 49, 88 | 03 | value, roi |
| Numeric ROI, simple payback, realized value | 48, 49, 50, 88 | 03 | roi |
| Build, buy, or extend | 4, 18, 21, 87 | 02, 03, 05, 06 | strategy, lifecycle |
| Model router quality/cost tradeoff | 25, 50 | 03, 05 | router, roi |

### Design

| Objective or assessed decision | Question IDs | Labs | Docs |
| --- | --- | --- | --- |
| Dynamics Sales business terms | 3 | 04, 06 | sales |
| Customize customer-experience Copilot | 34, 61, 74, 96 | 04, 06, 08 | sales, salesSetup, service |
| Sales connector design | 34 | 04, 06 | sales; supporting tools |
| Contact Center channel and voice behavior | 10 | 04, 06 | voice |
| Task versus autonomous agents | 2, 37 | 04, 09 | autonomous |
| Prompt/response agents and prompt actions | 53, 55, 62, 72 | 04, 06, 07 | tools, ai |
| Propose Foundry Tools | 52, 56, 99 | 04, 05 | documents, foundryTools |
| Code-first generative pages | 46, 98 | 04, 06, 08 | pages, pagesAlm |
| Agent feed supervision and privacy | 51, 101 | 04, 06, 09 | feed |
| Topics and fallback | 15, 16, 54 | 04 | orchestration, language |
| Data processing for grounding and models | 13, 19, 26, 42, 43, 99 | 01, 02, 04, 05, 06, 07 | data, grounding, fineTune, documents |
| AI components in a canvas-app process | 55 | 04 | ai |
| Power Platform Well-Architected | 44, 100 | 04, 08 | wa |
| Classic NLU, CLU, generative orchestration | 15, 16 | 04 | language, orchestration |
| Studio agents and agent flows | 2, 15, 53, 54, 89, 97 | 04, 09 | autonomous, orchestration, tools, language, flows |
| Foundry custom-model design | 1, 19, 35, 77 | 02, 05, 07, 08 | lifecycle, fineTune, modelAlm |
| Microsoft 365 agents and SharePoint/Teams integration | 21, 61, 91, 96 | 02, 06 | strategy, salesSetup, service |
| Studio extensibility and protocol choice | 22, 23, 24, 59, 90 | 05 | tools, mcp, a2a |
| Computer Use versus RPA | 22, 58, 90 | 05 | tools |
| Reasoning and voice-mode design | 10, 57 | 04, 05, 06, 09 | voice, reasoning |
| F&O AI and additional structured knowledge | 33, 60 | 06 | help, fnoData |
| Customer-experience/service prebuilt configuration | 3, 61, 96 | 04, 06 | sales, salesSetup, service |
| Microsoft 365 Sales/Service agents | 61, 91, 96 | 06 | salesSetup, strategy, service |
| Power Platform AI features / AI hub prompts | 53, 55, 62, 97 | 04, 06 | tools, ai, flows |
| Add knowledge to F&O in-app help | 33 | 06 | help |

### Deploy

| Objective or assessed decision | Question IDs | Labs | Docs |
| --- | --- | --- | --- |
| Monitoring process and tools | 5, 31, 64, 66, 67, 83 | 07 | value, lifecycle |
| Backlog and user feedback | 32, 64, 65 | 01, 07 | value |
| AI-assisted issue discovery and tuning | 31, 64, 93 | 07 | value, lifecycle, alm |
| Performance metrics and telemetry interpretation | 25, 31, 65, 66, 67, 93 | 03, 05, 07 | router, lifecycle, value, alm |
| Agent test criteria and quality versus safety | 26, 68, 69, 92 | 04, 07, 09 | grounding, evaluation |
| Custom-model validation | 1, 19, 35, 77 | 02, 05, 07, 08 | lifecycle, fineTune, modelAlm |
| Validate Copilot prompt best practices | 53, 70, 72, 89 | 04, 07, 09 | tools, evaluation, orchestration |
| Cross-Dynamics end-to-end tests | 27, 71 | 06, 07 | scope, orchestration |
| Copilot-generated test strategy | 64, 70 | 07 | value, evaluation |
| Data ALM and audit/reproducibility | 43, 76, 79 | 01, 06, 08, 09 | data, audit |
| Studio agent/connector/action ALM | 8, 9, 28, 73, 74, 94 | 06, 08 | unifiedAlm, lifecycle, alm, sales |
| Foundry Agent Service ALM | 1, 9, 75, 87 | 02, 05, 07, 08, 09 | lifecycle |
| Custom AI model ALM | 35, 76, 77, 79 | 05, 07, 08, 09 | fineTune, audit, modelAlm |
| Finance / Supply Chain AI ALM | 8, 9, 60, 76 | 06, 08 | unifiedAlm, lifecycle, fnoData, audit |
| Customer-experience/service AI ALM | 28, 73, 74, 94 | 06, 08 | alm, sales |
| Agent/model security and governance | 7, 11, 29, 30, 37, 69, 75, 82, 95, 101 | 04, 06, 07, 08, 09 | security, governance, access, autonomous, evaluation, lifecycle, feed |
| Direct and indirect prompt manipulation | 30, 78 | 04, 09 | security |
| Responsible AI principles and subgroup harm | 7, 35, 69, 81, 92 | 05, 07, 09 | security, fineTune, evaluation |
| Residency and movement compliance | 11, 57, 80, 95 | 05, 09 | governance, reasoning, residency |
| Grounding access and model-tuning controls | 17, 19, 29, 35, 69, 75, 89 | 01, 02, 04, 05, 07, 08, 09 | grounding, fineTune, access, evaluation, lifecycle, orchestration |
| Audit trails for model/data changes | 36, 76, 79, 82, 83 | 02, 07, 08, 09 | governance, audit, security, lifecycle |

Coverage limitations: supply-chain-specific prebuilt features, detailed Microsoft 365 Service deployment steps, AI hub administration, model-asset attack hardening, and tuning-role configuration have only partial architectural coverage here. They are not certified as comprehensively assessed. A citation to a module or inclusion in the matrix is not proof of complete objective mastery. Lab-derived area membership is Plan 28, Design 56, Deploy 46; these overlap and sum to 130, not 101. The bank is not an exam-weighted sampling implementation.

## Verification Register

These 41 primary URLs were fetched through Microsoft Learn MCP on the review date. Redirect destinations and product wording can change. Exact source-to-ID associations are available directly in the bank; the coverage matrix supplies their objective and lab context.

| Key | Verification document |
| --- | --- |
| scope | [AB-100 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100) |
| strategy | [CAF AI strategy](https://learn.microsoft.com/azure/cloud-adoption-framework/ai/strategy) |
| blueprint | [Success by Design](https://learn.microsoft.com/dynamics365/guidance/implementation-guide/success-by-design) |
| grounding | [Grounding data quality](https://learn.microsoft.com/en-us/training/modules/analyze-requirements-ai-powered-business-solutions/3-review-data-grounding-accuracy-relevance-timeliness-cleanliness-availability) |
| data | [Organize AI-ready data](https://learn.microsoft.com/en-us/training/modules/analyze-requirements-ai-powered-business-solutions/4-organize-business-solution-data-available-other-ai-systems) |
| value | [Agent value and analytics](https://learn.microsoft.com/microsoft-copilot-studio/guidance/agent-business-value-tell-value-story) |
| roi | [ROI/payback glossary](https://learn.microsoft.com/azure/migrate/concepts-business-case-calculation?view=migrate) |
| sales | [Customize Sales Copilot](https://learn.microsoft.com/dynamics365/sales/extend-copilot-chat) |
| salesSetup | [Sales agent setup](https://learn.microsoft.com/microsoft-sales-copilot/set-up-sales-chat) |
| service | [Service Agent; redirected documentation](https://learn.microsoft.com/en-us/microsoft-copilot-service/about-microsoft-copilot-for-service) |
| payables | [Payables Agent](https://learn.microsoft.com/dynamics365/business-central/payables-agent) |
| help | [F&O help knowledge extension](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/copilot/extend-copilot-generative-help) |
| fnoData | [F&O structured-data chat preview](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/copilot/chat-with-fno-data) |
| orchestration | [Generative orchestration](https://learn.microsoft.com/microsoft-copilot-studio/guidance/generative-orchestration) |
| autonomous | [Autonomous agent design](https://learn.microsoft.com/microsoft-copilot-studio/guidance/autonomous-agents) |
| language | [Language understanding](https://learn.microsoft.com/microsoft-copilot-studio/guidance/language-understanding) |
| tools | [Agent tools, prompts, MCP, RPA and Computer Use](https://learn.microsoft.com/microsoft-copilot-studio/guidance/agent-tools) |
| ai | [Studio AI capabilities](https://learn.microsoft.com/microsoft-copilot-studio/guidance/ai-capabilities) |
| mcp | [Existing MCP server connection](https://learn.microsoft.com/microsoft-copilot-studio/mcp-add-existing-server-to-agent) |
| a2a | [A2A connections](https://learn.microsoft.com/microsoft-copilot-studio/add-agent-agent-to-agent) |
| reasoning | [Deep reasoning preview](https://learn.microsoft.com/microsoft-copilot-studio/authoring-reasoning-models) |
| voice | [Real-time agents](https://learn.microsoft.com/microsoft-copilot-studio/voice-realtime-voice-agents) |
| pages | [Code-first generative pages](https://learn.microsoft.com/power-apps/maker/model-driven-apps/generative-page-external-tools) |
| pagesAlm | [Generative pages and solution transport](https://learn.microsoft.com/power-apps/maker/model-driven-apps/generative-pages) |
| feed | [Agent feed preview](https://learn.microsoft.com/power-apps/user/supervise-agents-with-agent-feed) |
| wa | [Power Platform Well-Architected pillars](https://learn.microsoft.com/power-platform/well-architected/pillars) |
| foundryTools | [Foundry Tools overview](https://learn.microsoft.com/azure/ai-services/what-are-ai-services) |
| documents | [Document-processing tool choice](https://learn.microsoft.com/azure/ai-services/content-understanding/choosing-right-ai-tool) |
| fineTune | [Fine-tuning considerations](https://learn.microsoft.com/azure/foundry/openai/concepts/fine-tuning-considerations) |
| lifecycle | [Foundry agent lifecycle](https://learn.microsoft.com/azure/foundry/agents/concepts/development-lifecycle) |
| evaluation | [Studio agent evaluation](https://learn.microsoft.com/microsoft-copilot-studio/analytics-agent-evaluation-intro) |
| alm | [Studio ALM](https://learn.microsoft.com/microsoft-copilot-studio/guidance/alm) |
| unifiedAlm | [Unified X++/Dataverse packaging](https://learn.microsoft.com/power-platform/admin/unified-experience/tutorial-build-pipeline-azure-devops) |
| modelAlm | [Custom-model ALM](https://learn.microsoft.com/en-us/training/modules/design-alm-process-ai-powered-business-solutions/5-design-alm-process-custom-ai-models) |
| flows | [Agent flows](https://learn.microsoft.com/microsoft-copilot-studio/flows-overview) |
| router | [Model-router evaluation](https://learn.microsoft.com/azure/foundry/openai/how-to/evaluate-model-router) |
| security | [AI vulnerabilities and mitigations](https://learn.microsoft.com/en-us/training/modules/design-responsible-ai-security-governance-risk-management-compliance/5-analyze-solution-ai-vulnerabilities-mitigations-prompt-manipulation) |
| access | [Grounding and tuning access controls](https://learn.microsoft.com/en-us/training/modules/design-responsible-ai-security-governance-risk-management-compliance/8-design-access-controls-ground-data-model-tune) |
| audit | [Model/data audit trails](https://learn.microsoft.com/en-us/training/modules/design-responsible-ai-security-governance-risk-management-compliance/9-design-audit-trails-changes-models-data) |
| residency | [Cross-region processing and flex routing](https://learn.microsoft.com/en-us/power-platform/admin/geographical-availability-copilot) |
| governance | [Residency validation and Purview role](https://learn.microsoft.com/en-us/training/modules/design-responsible-ai-security-governance-risk-management-compliance/7-validate-data-residency-movement-compliance) |

Supporting full-page reads included the requirements, responsible-AI, and ALM module landing pages; the Finance/Supply Chain ALM unit; autonomous-agent health; and the existing-CRM/CCaaS reference architecture. The ROI source supplies a generic formula, not Microsoft product prices or proof of the fictional savings. No live commercial prices were verified.

## Manual Duplicate Review

The gauntlet pairs refer to numeric IDs, not original source-code line numbers. Each row records the retained decision and the replacement decision. Renaming Contoso or prefixing a module name was not accepted as differentiation.

| Audited pair | Earlier member now assesses | Replaced later member now assesses |
| --- | --- | --- |
| 2 / 51 | User versus event initiation | Agent feed supervision prerequisites |
| 3 / 52 | Sales business-term mapping | Structured invoice extraction tool choice |
| 5 / 64 | Conversational outcome analytics | AI-assisted feedback themes into tests |
| 7 / 81 | Behavioral risk scorecard | Language-cohort harm hidden by averages |
| 8 / 74 | X++ versus solution artifacts, unified package qualification | Sales topic solution lifecycle |
| 12 / 44 | CAF versus Success by Design | Five Power Platform Well-Architected pillars |
| 14 / 48 | Lifecycle TCO framing | Numeric year-one ROI |
| 15 / 53 | Multi-intent planning | Structured prompt-action extraction |
| 17 / 42 | Staleness and missing permissions | OCR/table structure and ingestion noise |
| 18 / 49 | Extend a bounded prebuilt gap | Numeric simple payback |
| 19 / 56 | Fine-tuning justification | Speech and Content Safety service selection |
| 21 / 46 | SharePoint declarative helper | Code-first model-driven generative page |
| 22 / 58 | Variable UI Computer Use pilot | Stable-selector, GA-only RPA decision |
| 23 / 57 | Local MCP hosting and transport | Scoped deep reasoning with latency/residency caveat |
| 24 / 59 | Existing A2A specialist delegation | Plain REST tool does not justify A2A |
| 25 / 50 | Router acceptance criteria | Numeric routing cost and overhead |
| 26 / 68 | Wrong-jurisdiction retrieval | Semantic answer evaluation versus exact text |
| 27 / 71 | Cross-app denied access | Cross-app timeout/retry duplicate side effects |
| 28 / 73 | Environment separation and promotion | Bindings and non-solution-aware settings |
| 29 / 79 | Separate steward and retrieval permissions | Attributable change evidence and approvals |
| 30 / 78 | Direct attack versus action authorization | Indirect injection from retrieved evidence |
| 31 / 66 | Repeated tool calls after a prompt change | Tail-latency dependency investigation |
| 32 / 65 | Specific stale-policy feedback | CSAT selection/nonresponse bias |
| 33 / 60 | F&O file-based help extension | F&O structured-data chat preview |
| 35 / 69 | Custom-model generalization and harm gate | Functional evaluation is not safety/access proof |
| 36 / 83 | Framework/product responsibility matching | Trace/evaluation/approval/survey evidence matching |
| 37 / 82 | Event authenticity and payment authority | Incident containment and evidence preservation |

Additional editorial separation: Q13 is live status, Q38 is analytical versus operational access, and Q43 is schema/unit semantics. Q4 is portfolio component matching, Q40 is organizational readiness, Q45 is specialist ownership, Q86 is delegation-loop termination, and Q87 is a runtime-boundary change. Q17/Q85 separate freshness/ACL readiness from conflicting authorities. Q14/Q88 separate TCO scope from realized economic value. Q31/Q66/Q93 separate planning inefficiency, latency diagnosis, and an incorrect connection binding after credential rotation. Q7/Q81/Q92 separate risk reporting, subgroup remediation, and a hard release gate. Q23/Q24/Q90 retain concept reinforcement but Q90 requires a combined interface plan rather than repeating one protocol decision.

## Independent Review Follow-up

The reviewer identified a different weakness from answer-length leakage: several alternatives were category errors or unrelated actions, allowing answers without understanding the architecture. The second pass inspected all 101 records for this pattern. It did not use a numeric quality threshold as an editorial substitute.

| Flagged item | Revision and one-best-answer basis |
| --- | --- |
| Q46 | Competes against a real Power Fx custom page, hosted React app, and React web resource. Local TypeScript/React, supported generative-page deployment, and no separate host select the code-first generative page. The alternatives are not claimed to be nonexistent UI techniques. |
| Q56 | Competes between real-time and batch Speech transcription, and contextual Content Safety scoring versus a profanity blocklist. The stem requires interim live results and category-specific severity. Two correct configurations remain B/C. |
| Q75 | Distinguishes caller invocation roles, shared-project identity roles, published-principal blob access, and OAuth audience. Logs explicitly rule out invalid audience and caller invocation failure, making the published identity assignment the best correction. |
| Q93 | Distinguishes solution reimport, repeated secret rotation, artifact rollback, and the environment's connection-reference binding. The replacement connection already works directly and artifact versions are correct; the full agent path still selects the old connection. |

Other changed IDs in this pass: 6, 8, 10, 11, 15, 19, 22, 23, 24, 26, 31, 33, 34, 35, 40, 42, 43, 52, 53, 54, 55, 57, 58, 59, 60, 61, 62, 64, 66, 67, 68, 69, 70, 71, 72, 73, 74, 76, 77, 78, 79, 81, 82, 85, 86, 87, 89, 90, 91, 92, 94, 95, 96, 97, 98, 99, 100, 101. Changes replace implausible alternatives, refine constraints or terminology, and explain why the competing method is inferior for the stated requirement. Some alternatives are valid solutions under different constraints: MCP wrapping for a shared catalog, batch transcription for completed recordings, custom extraction for specialized schemas, or HTTP wrappers when custom state management is intended.

Examples of the wider scan: Q22 compares visual automation with selectors/coordinates and an MCP wrapper over unchanged RPA; Q52 compares prebuilt extraction with custom models, layout rules, and OCR/LLM pipelines; Q68 compares semantic grading with keywords, relaxed similarity, and enumerated paraphrases; Q76/Q79 compare incomplete but realistic evidence records; Q86 distinguishes task-wide budgets from local limits that reset; Q96 compares actual environment/source/search configuration scopes; Q101 distinguishes authorization from ownership, related-record permissions, and filtered views.

All existing IDs, correct-answer positions, formats, matching keys, and lab mappings remain unchanged. Revision stays 2 because these drafts have not been released. Q93 now points to the already-reviewed Studio ALM page for connection-reference guidance. No locale or application changes were made.

Follow-up Microsoft Learn research: searches and full-page reads reconfirmed [Foundry agent identities](https://learn.microsoft.com/azure/foundry/agents/concepts/agent-identity), [code-first generative pages](https://learn.microsoft.com/power-apps/maker/model-driven-apps/generative-page-external-tools), [Content Safety analysis](https://learn.microsoft.com/azure/ai-services/content-safety/overview), [Speech real-time versus batch](https://learn.microsoft.com/azure/ai-services/speech-service/speech-to-text), and [Studio ALM](https://learn.microsoft.com/microsoft-copilot-studio/guidance/alm). The identity, Speech, and Content Safety pages are supporting evidence beyond the primary-source register. Dates remain documentation-review dates, not live-service verification.

The first-pass claim that all alternatives were plausible was too strong. The revisions are an author response to independent findings, not a claim that the independent reviewer has accepted them. Learner discrimination, difficulty calibration, and remaining editorial defects cannot be established by passing schema checks.

## Measurements

Measured on final English strings using JavaScript UTF-16 `String.length`, the same basis as G03. Whitespace is normalized only for duplicates, not length. Measurements flag editorial risks; they do not prove quality or uniqueness.

| Measurement | Audited baseline | Revised bank |
| --- | --- | --- |
| Total | 95 | 101 |
| Single / multiple / matching | 83 / 8 / 4 | 89 / 8 / 4 |
| Correct option strictly longer than every distractor | 83/83 (100%) | 22/89 (24.72%) |
| Correct option strictly shorter than every distractor | Not recorded | 20/89 (22.47%) |
| Identical normalized unordered option-set pairs | 17 | 0 |
| Duplicate normalized stems | Exact stems were distinct | 0 |
| Single correct position A / B / C / D | Not recorded here | 23 / 22 / 22 / 22 |
| Multiple-response correct selections A / B / C / D | Not recorded here | 4 / 4 / 4 / 4 |
| Matching correct target A / B / C / D | Not recorded here | 4 / 4 / 4 / 3 (15 rows) |

Strict-longest IDs: 3, 11, 17, 24, 25, 31, 33, 41, 44, 47, 51, 63, 68, 70, 73, 75, 78, 84, 86, 93, 96, 98.

Each of those 22 was inspected in the follow-up for substantive extra detail. Retained wording specifies decision-relevant contracts, identity scope, verification, or recovery actions rather than generic reassurance. Length parity alone is not evidence of plausible alternatives, as the independent review demonstrated. No answer positions were shuffled in this follow-up; explanations were revised alongside alternatives.

For length ties, split credit equally across tied options. Expected single-choice correct counts by ascending length rank are 25.17, 22.67, 14.67, 26.50 out of 89. A longest-first strategy with random tie-breaking therefore yields 26.5/89 (29.78%), versus 25% uniform chance; shortest-first yields 25.17/89 (28.28%). The old deterministic 100% length leak is absent, but these finite-sample differences do not prove independence or item quality. Independent re-review and learner-response analysis remain outstanding, especially after translation.

Every multiple-response item asks for TWO choices. Correct pair distribution is AB:1, AC:1, AD:2, BC:2, BD:1, CD:1; no answer position is favored overall. Matching options are role names rather than competing answer prose, so their label lengths are not interpreted as single-choice leakage.

### Reproduce the Exact Duplicate and Length Measurement

Run the following JavaScript from the repository root with Node (for example, through `node` standard input). It only reads the bank and prints measurements. It is intentionally NOT a threshold-based content-quality test.

```js
const fs = require('node:fs');
const vm = require('node:vm');
const bank = vm.runInNewContext(fs.readFileSync('questions.js', 'utf8') + '; questions');
const normalize = text => text.toLowerCase().replace(/\s+/g, ' ').trim();
const groups = new Map();
for (const q of bank) {
  // Preserve multiplicity; ignore option ordering, case, and whitespace only.
  const key = JSON.stringify(q.options.map(normalize).sort());
  groups.set(key, [...(groups.get(key) || []), q.id]);
}
const duplicateGroups = [...groups.values()].filter(ids => ids.length > 1);
const duplicatePairs = duplicateGroups.flatMap(ids =>
  ids.flatMap((id, i) => ids.slice(i + 1).map(other => [id, other])));
const singles = bank.filter(q => q.format === 'single');
const longest = singles.filter(q => q.options.every((option, i) =>
  i === q.answer || q.options[q.answer].length > option.length));
const shortest = singles.filter(q => q.options.every((option, i) =>
  i === q.answer || q.options[q.answer].length < option.length));
const positions = [0, 0, 0, 0];
const lengthRanks = [0, 0, 0, 0];
for (const q of singles) {
  positions[q.answer]++;
  const size = q.options[q.answer].length;
  const below = q.options.filter(option => option.length < size).length;
  const equal = q.options.filter(option => option.length === size).length;
  for (let i = below; i < below + equal; i++) lengthRanks[i] += 1 / equal;
}
const multiplePositions = [0, 0, 0, 0];
for (const q of bank.filter(q => q.format === 'multiple')) {
  for (const answer of q.answer) multiplePositions[answer]++;
}
console.log({
  total: bank.length,
  duplicatePairs,
  duplicateStems: bank.length - new Set(bank.map(q => normalize(q.question))).size,
  singleCount: singles.length,
  strictlyLongestIds: longest.map(q => q.id),
  strictlyShortestIds: shortest.map(q => q.id),
  singleAnswerPositions: positions,
  multipleAnswerPositions: multiplePositions,
  tieSplitLengthRanks: lengthRanks
});
```

### Verification Performed

- `node --check questions.js`: passed.
- `node scripts/validate-content.mjs`: passed; that pre-existing validator is weak as documented in G17, so it was not treated as sufficient evidence.
- Read-only Node/VM contract checks: unique explicit numeric IDs; revision 2; no domain; false official flag; nonempty valid lab IDs; Learn HTTPS source; all 101 keys valid/correct under `StudyState`; authored ID/revision count matches record count.
- Read-only duplicate and option-length calculations: results above; no test files added.
- Numeric calculations manually recomputed: Q48 $48,000 benefit / $16,000 net / 50% ROI; Q49 six months; Q50 $600 baseline / $220 routed / $380 saving; Q88 $20,000 realized / $8,000 net.
- Diff whitespace validation for owned files: passed.

Not performed: independent SME review, learner trials, item discrimination/reliability analysis, translated-question validation, tenant-based feature verification, external courseware/dump lineage verification, browser UI tests, runtime regression suite changes, or regeneration of `AB100.md`. These remain separate from this content correction and must not be inferred from the counts or passing data checks.
