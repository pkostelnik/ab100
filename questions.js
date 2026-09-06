// Unofficial English practice. IDs are authored, not derived from array order.
// Evidence keys reference documents read on 2026-09-06; see docs/content-coverage.md.
const questionSources = {
  scope: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100',
  strategy: 'https://learn.microsoft.com/azure/cloud-adoption-framework/ai/strategy',
  blueprint: 'https://learn.microsoft.com/dynamics365/guidance/implementation-guide/success-by-design',
  grounding: 'https://learn.microsoft.com/en-us/training/modules/analyze-requirements-ai-powered-business-solutions/3-review-data-grounding-accuracy-relevance-timeliness-cleanliness-availability',
  data: 'https://learn.microsoft.com/en-us/training/modules/analyze-requirements-ai-powered-business-solutions/4-organize-business-solution-data-available-other-ai-systems',
  value: 'https://learn.microsoft.com/microsoft-copilot-studio/guidance/agent-business-value-tell-value-story',
  roi: 'https://learn.microsoft.com/azure/migrate/concepts-business-case-calculation?view=migrate',
  sales: 'https://learn.microsoft.com/dynamics365/sales/extend-copilot-chat',
  salesSetup: 'https://learn.microsoft.com/microsoft-sales-copilot/set-up-sales-chat',
  service: 'https://learn.microsoft.com/en-us/microsoft-copilot-service/about-microsoft-copilot-for-service',
  payables: 'https://learn.microsoft.com/dynamics365/business-central/payables-agent',
  help: 'https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/copilot/extend-copilot-generative-help',
  fnoData: 'https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/copilot/chat-with-fno-data',
  orchestration: 'https://learn.microsoft.com/microsoft-copilot-studio/guidance/generative-orchestration',
  autonomous: 'https://learn.microsoft.com/microsoft-copilot-studio/guidance/autonomous-agents',
  language: 'https://learn.microsoft.com/microsoft-copilot-studio/guidance/language-understanding',
  tools: 'https://learn.microsoft.com/microsoft-copilot-studio/guidance/agent-tools',
  ai: 'https://learn.microsoft.com/microsoft-copilot-studio/guidance/ai-capabilities',
  mcp: 'https://learn.microsoft.com/microsoft-copilot-studio/mcp-add-existing-server-to-agent',
  a2a: 'https://learn.microsoft.com/microsoft-copilot-studio/add-agent-agent-to-agent',
  reasoning: 'https://learn.microsoft.com/microsoft-copilot-studio/authoring-reasoning-models',
  voice: 'https://learn.microsoft.com/microsoft-copilot-studio/voice-realtime-voice-agents',
  pages: 'https://learn.microsoft.com/power-apps/maker/model-driven-apps/generative-page-external-tools',
  pagesAlm: 'https://learn.microsoft.com/power-apps/maker/model-driven-apps/generative-pages',
  feed: 'https://learn.microsoft.com/power-apps/user/supervise-agents-with-agent-feed',
  wa: 'https://learn.microsoft.com/power-platform/well-architected/pillars',
  foundryTools: 'https://learn.microsoft.com/azure/ai-services/what-are-ai-services',
  documents: 'https://learn.microsoft.com/azure/ai-services/content-understanding/choosing-right-ai-tool',
  fineTune: 'https://learn.microsoft.com/azure/foundry/openai/concepts/fine-tuning-considerations',
  lifecycle: 'https://learn.microsoft.com/azure/foundry/agents/concepts/development-lifecycle',
  evaluation: 'https://learn.microsoft.com/microsoft-copilot-studio/analytics-agent-evaluation-intro',
  alm: 'https://learn.microsoft.com/microsoft-copilot-studio/guidance/alm',
  almScope: 'https://learn.microsoft.com/en-us/training/modules/design-alm-process-ai-powered-business-solutions/',
  unifiedAlm: 'https://learn.microsoft.com/power-platform/admin/unified-experience/tutorial-build-pipeline-azure-devops',
  modelAlm: 'https://learn.microsoft.com/en-us/training/modules/design-alm-process-ai-powered-business-solutions/5-design-alm-process-custom-ai-models',
  flows: 'https://learn.microsoft.com/microsoft-copilot-studio/flows-overview',
  router: 'https://learn.microsoft.com/azure/foundry/openai/how-to/evaluate-model-router',
  security: 'https://learn.microsoft.com/en-us/training/modules/design-responsible-ai-security-governance-risk-management-compliance/5-analyze-solution-ai-vulnerabilities-mitigations-prompt-manipulation',
  access: 'https://learn.microsoft.com/en-us/training/modules/design-responsible-ai-security-governance-risk-management-compliance/8-design-access-controls-ground-data-model-tune',
  audit: 'https://learn.microsoft.com/en-us/training/modules/design-responsible-ai-security-governance-risk-management-compliance/9-design-audit-trails-changes-models-data',
  residency: 'https://learn.microsoft.com/en-us/power-platform/admin/geographical-availability-copilot',
  governance: 'https://learn.microsoft.com/en-us/training/modules/design-responsible-ai-security-governance-risk-management-compliance/7-validate-data-residency-movement-compliance'
};

const practice = ({ evidence, ...record }) => ({
  official: false,
  sourceType: 'Unofficial practice, Learn-aligned',
  verification: 'Documentation-reviewed; scenario judgment, not a product execution test',
  verifiedOn: '2026-09-06',
  format: 'single',
  ...record,
  source: questionSources[evidence]
});
const c1756 = slug => `https://github.com/tertiarycourses/C1756-AB-100-Microsoft-Certified-Agentic-AI-Business-Solutions-Architect/blob/main/labs/${slug}`;

const questions = [
  practice({
    id: 1, revision: 2, topic: 'Foundry & Extensibility', labIds: ['lab-05', 'lab-07'], evidence: 'lifecycle',
    question: 'A catalog model passes public benchmarks but has not processed the insurer\'s claims. What evidence should authorize its first customer-facing release?',
    options: [
      'A comparison of model size and public benchmark rankings.',
      'A deployment test confirming regional quota and endpoint access.',
      'A license review covering commercial use and supplier support.',
      'A claims evaluation covering task quality, safety, and latency.'
    ], answer: 3,
    explanation: 'D tests the actual workload before release. Public benchmarks help shortlist models, endpoint tests establish connectivity, and licensing establishes usage rights. None of A, B, or C establishes that the model handles this insurer\'s claims safely and accurately.'
  }),
  practice({
    id: 2, revision: 2, topic: 'Copilot Studio Agents', labIds: ['lab-04'], evidence: 'autonomous',
    question: 'A representative requests case summaries during calls. A separate helper must classify incoming invoice emails overnight. Which initiation design meets both requirements?',
    options: [
      'Use scheduled runs for summaries and conversational turns for invoices.',
      'Use user-triggered summaries and event-triggered invoice processing.',
      'Use email triggers for both, with representatives emailing case IDs.',
      'Use conversation triggers for both, with invoices queued until sign-in.'
    ], answer: 1,
    explanation: 'B preserves interactive assistance for calls and unattended event handling for invoices. A reverses those needs. C adds an unnecessary email step during calls. D cannot process the overnight backlog without a user. The event agent still needs scoped permissions and an explicit authority limit.'
  }),
  practice({
    id: 3, revision: 2, topic: 'Copilot in Dynamics 365', labIds: ['lab-04', 'lab-06'], evidence: 'sales',
    question: 'In Dynamics 365 Sales, sellers use "coverage gap" for a custom opportunity column. Copilot retrieves a different column. What is the most targeted correction?',
    options: [
      'Define the business phrase and its column mapping in the glossary and synonyms.',
      'Add a prompt-guide suggestion asking sellers to restate the request.',
      'Add a knowledge article describing how the sales team uses the phrase.',
      'Change the opportunity summary layout to highlight the custom column.'
    ], answer: 0,
    explanation: 'A addresses the semantic mapping used to interpret business terms. A prompt suggestion changes discoverability, an article explains the term without necessarily fixing column selection, and a summary layout changes presentation rather than query interpretation.'
  }),
  practice({
    id: 4, revision: 2, topic: 'Ecosystem Integration', labIds: ['lab-02', 'lab-05'], evidence: 'strategy', format: 'matching',
    question: 'A portfolio contains four distinct needs. Match each implementation choice to the strongest justification, rather than using one platform for everything.',
    options: ['Prebuilt Dynamics 365 capability', 'Custom Copilot Studio agent', 'MCP tool integration', 'Fine-tuned language model'],
    matchLabels: [
      'A. A product workflow already covers the required business task',
      'B. A low-code conversation must coordinate custom business steps',
      'C. Several agents need a shared, discoverable external tool contract',
      'D. Labeled examples address a persistent task-specific behavior gap'
    ], matches: { 0: 'A', 1: 'B', 2: 'C', 3: 'D' }, answer: 0,
    explanation: 'Prebuilt functionality avoids unnecessary custom work; Studio authors process-specific agents; MCP standardizes access to tools; fine-tuning changes learned behavior. Tool access is not model training, and a model alone does not supply a business workflow. MCP also needs a supported reachable endpoint, authentication where required, and policy review.'
  }),
  practice({
    id: 5, revision: 2, topic: 'Monitor & Tune', labIds: ['lab-07'], evidence: 'value',
    question: 'A standard conversational Studio agent is live. The owner needs resolution, escalation, abandonment, and CSAT trends before building custom reports. Where should they start?',
    options: [
      'Power Platform capacity reports for credits and environment usage.',
      'Application Insights dependency traces for connector response times.',
      'Copilot Studio conversational analytics for session outcomes.',
      'Dataverse audit history for changes to case and customer records.'
    ], answer: 2,
    explanation: 'C supplies the requested conversation outcomes and survey results. Capacity reports measure consumption, dependency traces diagnose execution, and Dataverse audits show record changes. They complement conversation analytics but do not replace its outcome definitions. Autonomous runs have a different set of health metrics.'
  }),
  practice({
    id: 6, revision: 2, topic: 'Copilot in Dynamics 365', labIds: ['lab-06'], evidence: 'payables',
    question: 'Business Central Payables Agent creates a vendor from invoice OCR, but the vendor is blocked. The supervisor wants processing to continue. What is the appropriate next step?',
    options: [
      'Have the supervisor confirm extracted invoice fields and resume the task.',
      'Complete stakeholder vendor checks before an authorized user unblocks it.',
      'Clear the vendor block after matching its name to the invoice attachment.',
      'Complete invoice approval and treat it as approval of the new vendor.'
    ], answer: 1,
    explanation: 'B preserves the separate vendor-validation boundary. A validates invoice extraction, not vendor approval. C relies on the same unverified source used to create the vendor. D conflates approval of a transaction with approval of the counterparty. The agent creates new vendors blocked and does not supply vendor approval; required checks can include independent bank-detail verification.'
  }),
  practice({
    id: 7, revision: 2, topic: 'Responsible AI & Security', labIds: ['lab-09', 'lab-07'], evidence: 'security',
    question: 'A risk committee already receives cost and uptime reports. It asks whether customer-facing agent behavior remains safe after updates. Which additional scorecard best answers that question?',
    options: [
      'Harmful-output rates, subgroup quality gaps, and mitigation status.',
      'Token consumption, average session duration, and license utilization.',
      'API availability, dependency response time, and successful deployments.',
      'User adoption, prompt-library reuse, and training-course completion.'
    ], answer: 0,
    explanation: 'A directly examines behavioral harm and the response to it. B is financial usage, C is infrastructure and release health, and D is adoption. All can matter operationally, but none of those three establishes safe behavior or equitable performance after a model or prompt change.'
  }),
  practice({
    id: 8, revision: 2, topic: 'ALM & Environments', labIds: ['lab-08'], evidence: 'unifiedAlm',
    question: 'One release includes a Studio agent and an X++ pricing extension. Which packaging decision avoids treating unlike deployment artifacts as interchangeable?',
    options: [
      'Transport both as a Dataverse solution with a common connection reference.',
      'Use the compiled X++ runtime package alone to carry the Studio components.',
      'Export the agent separately and rebuild the pricing change in each target.',
      'Use a solution for Studio and the F&O ALM path for the X++ extension.'
    ], answer: 3,
    explanation: 'D preserves the distinct build artifacts: Studio solution components and compiled X++ output. A Dataverse solution alone does not replace an X++ build, and rebuilding targets loses reproducibility. In unified environments, a Power Platform unified package CAN contain both X++ output and Dataverse solutions for coordinated deployment. Separate artifact lifecycles do not require permanently separate release packages.'
  }),
  practice({
    id: 9, revision: 2, topic: 'ALM & Environments', labIds: ['lab-08'], evidence: 'lifecycle',
    question: 'A Studio solution calls a Foundry specialist. Either pipeline can deploy successfully on its own, but the new tool schema breaks the other side. What release control is missing?',
    options: [
      'A common version label assigned after each independent pipeline completes.',
      'A shared deployment identity with contributor access on both platforms.',
      'A compatibility gate for the paired agent and tool-contract versions.',
      'A single repository containing every platform\'s generated deployment logs.'
    ], answer: 2,
    explanation: 'C checks the integration that independent pipeline success misses. Version labels and shared logs improve traceability but do not verify compatibility. A shared privileged identity broadens access without correcting the schema mismatch. Keep platform-specific pipelines and evaluate their composed behavior before promotion.'
  }),
  practice({
    id: 10, revision: 2, topic: 'Copilot in Dynamics 365', labIds: ['lab-04', 'lab-06'], evidence: 'voice',
    question: 'A Contact Center voice pilot works for clear speech but cuts off callers during pauses and cannot handle keypad input. Which change should precede wider rollout?',
    options: [
      'Tune turn-taking and silence handling, then test DTMF and handoff.',
      'Tune speech recognition vocabulary and retain the current turn-end settings.',
      'Keep the chat settings and add more written example utterances.',
      'Switch the underlying model and retain the current telephony settings.'
    ], answer: 0,
    explanation: 'A targets turn-taking and keypad behavior directly. Vocabulary tuning addresses recognition errors rather than when a turn ends. Written examples omit audio conditions, and changing the model alone leaves channel settings untested. Real-time-agent documentation lists DTMF, barge-in, and voice activity detection; availability still requires separate checks.'
  }),
  practice({
    id: 11, revision: 2, topic: 'Responsible AI & Security', labIds: ['lab-09'], evidence: 'governance',
    question: 'Contracts have Purview sensitivity labels. A sponsor assumes this guarantees that all inference and logs stay in the environment\'s region. Which assessment is sound?',
    options: [
      'Confirm label inheritance, then accept the environment region as sufficient.',
      'Review endpoint regions only; protected documents cannot affect log residency.',
      'Confirm the storage geography and use it as the boundary for inference review.',
      'Map inference, routing, and log locations independently of Purview classification.'
    ], answer: 3,
    explanation: 'D separates data governance from service placement. A establishes labeling, B omits logs and other processors, and C confuses storage geography with inference location. Purview labeling and supported DLP controls do not choose every model endpoint or disable flex routing. Review environment settings, feature-specific terms, inference deployment, connectors, and telemetry destinations.'
  }),
  practice({
    id: 12, revision: 2, topic: 'AI Strategy & CAF', labIds: ['lab-02'], evidence: 'blueprint',
    question: 'The enterprise is defining AI adoption priorities while a Dynamics implementation needs solution-risk reviews. How should CAF and Success by Design be assigned?',
    options: [
      'CAF owns Dynamics design reviews; Success by Design owns cloud landing zones.',
      'CAF guides adoption; Success by Design guides Dynamics implementation reviews.',
      'CAF owns both workstreams; Success by Design is reserved for post-launch support.',
      'Success by Design owns both; CAF is reserved for infrastructure-only migrations.'
    ], answer: 1,
    explanation: 'B uses the frameworks at their intended levels. CAF covers AI strategy, planning, readiness, governance, security, and management. Success by Design adds Dynamics implementation guidance and risk reviews. Neither replaces the other, and Success by Design is not only a support framework.'
  }),
  practice({
    id: 13, revision: 2, topic: 'Requirements & Grounding', labIds: ['lab-01', 'lab-04'], evidence: 'data',
    question: 'Three agents answer current case-status questions from weekly CSV exports. Dataverse already owns the live cases. Which design best removes stale operational answers?',
    options: [
      'Consolidate the weekly exports into one shared retrieval index.',
      'Fine-tune the response model with every weekly case-status export.',
      'Read authorized case status from the operational system when requested.',
      'Add export dates to prompts and let users infer whether status changed.'
    ], answer: 2,
    explanation: 'C aligns volatile status with the authoritative operational source and its access controls. A reduces duplication but preserves weekly staleness. B embeds changing facts in weights. D discloses staleness without meeting the current-status requirement. Retrieval and live tools should be chosen according to freshness needs.'
  }),
  practice({
    id: 14, revision: 2, topic: 'ROI & Build-Buy-Extend', labIds: ['lab-03'], evidence: 'value',
    question: 'A business case counts license savings but omits adoption training, evaluation, and ongoing knowledge maintenance. What is the material correction?',
    options: [
      'Compare lifecycle costs and realized benefits over a stated time horizon.',
      'Compare subscription totals for the first year using current list prices.',
      'Compare token spend per successful model call during the pilot period.',
      'Compare the number of automated steps against the original process map.'
    ], answer: 0,
    explanation: 'A includes costs of changing and operating the process, not merely buying software. B retains the original omission; C measures only one variable cost; D is an activity proxy rather than economic value. State adoption and realization assumptions so later reviews can compare benefits against a baseline.'
  }),
  practice({
    id: 15, revision: 2, topic: 'Copilot Studio Agents', labIds: ['lab-04'], evidence: 'orchestration',
    question: 'Employees ask to check a policy and update a ticket in one turn. The standard-harness agent currently selects only one classic topic. Which design supports flexible composition?',
    options: [
      'Add a composite trigger phrase for each possible pair of requests.',
      'Use a custom CLU intent for every permutation of policy and ticket.',
      'Chain a fixed policy topic into a ticket topic for every recognized request.',
      'Use generative orchestration over clearly described topics and tools.'
    ], answer: 3,
    explanation: 'D lets the planner compose reusable capabilities for multiple intents. A and B enumerate combinations and become costly to maintain. C is a valid fixed workflow, but forces the same sequence rather than selecting steps for each request. Generative planning still needs deterministic authorization and confirmation for consequential writes.'
  }),
  practice({
    id: 16, revision: 2, topic: 'Copilot Studio Agents', labIds: ['lab-04'], evidence: 'language', format: 'matching',
    question: 'Match the language-understanding approach to each existing agent\'s constraint. These are selection tradeoffs, not claims that one approach is universally superior.',
    options: ['Built-in classic NLU', 'Custom Azure CLU integration', 'Generative orchestration'],
    matchLabels: [
      'A. Compose several tools and knowledge lookups from one utterance',
      'B. Maintain a trained specialist intent model linked to Studio topics',
      'C. Route a small stable set of intents using authored trigger phrases'
    ], matches: { 0: 'C', 1: 'B', 2: 'A' }, answer: 0,
    explanation: 'Classic NLU fits the small deterministic routing problem. Existing CLU integrations provide custom intents and entities but require synchronization with Studio topics. Generative orchestration composes multi-intent plans. CLU is not a substitute for a generative planner; confirm current CLU lifecycle and language support before new investment.'
  }),
  practice({
    id: 17, revision: 2, topic: 'Requirements & Grounding', labIds: ['lab-01'], evidence: 'grounding',
    question: 'A complete policy export is six months old, and its access-control metadata is missing. The pilot will answer real employees. What is the first readiness decision?',
    options: [
      'Accept the export after a subject expert checks ten representative answers.',
      'Establish current policy versions and retrieval permissions before employee use.',
      'Use the export with citations so employees can identify obsolete guidance.',
      'Limit responses to short summaries until the access metadata is restored.'
    ], answer: 1,
    explanation: 'B addresses both timeliness and availability under the correct permissions. A small accuracy sample does not establish either. Citations and short summaries can still disclose unauthorized or obsolete information. The pilot may instead use synthetic or separately approved material while the real-source gaps are resolved.'
  }),
  practice({
    id: 18, revision: 2, topic: 'ROI & Build-Buy-Extend', labIds: ['lab-02', 'lab-03'], evidence: 'strategy',
    question: 'A prebuilt service assistant covers all required workflows except a warranty lookup that a supported connector can supply. The team has low-code skills and a six-week deadline. Which path fits best?',
    options: [
      'Build a new hosted agent to preserve control over the whole runtime.',
      'Buy the assistant and ask users to perform every warranty lookup separately.',
      'Extend the prebuilt assistant with the governed warranty lookup.',
      'Train a dedicated warranty model and replace the prebuilt assistant.'
    ], answer: 2,
    explanation: 'C closes a bounded integration gap without rebuilding working functionality. A adds engineering and operational scope; B leaves a stated requirement unmet; D confuses access to warranty facts with a need to change model behavior. The connector still needs authorization, error handling, and fit testing.'
  }),
  practice({
    id: 19, revision: 2, topic: 'Foundry & Extensibility', labIds: ['lab-02', 'lab-05'], evidence: 'fineTune', format: 'multiple',
    question: 'A team is deciding whether to fine-tune. Which TWO findings provide the strongest justification for an evaluated customization experiment?',
    options: [
      'A stable classification task still fails after prompt tuning, with labeled examples available.',
      'A compact model could meet a measured latency target using representative training examples.',
      'Daily policy changes are missing from answers, with a maintained retrieval source available.',
      'Answers lack newly published terminology, but improve when definitions are retrieved.'
    ], answer: [0, 1],
    explanation: 'A targets a persistent learned-behavior gap; B targets measurable specialization and efficiency. C calls for current retrieval, not memorization of changing policy. D already improves with retrieved definitions, so it does not yet establish a need to change weights. Fine-tuning adds training, hosting, and maintenance costs and must beat a baseline on held-out data.'
  }),
  practice({
    id: 20, revision: 2, topic: 'AI Strategy & CAF', labIds: ['lab-03', 'lab-04'], evidence: 'tools',
    question: 'Six teams share a prompt that extracts incident details. Local edits have changed its schema without notice. What should the prompt-library standard introduce?',
    options: [
      'A shared examples document that every team can modify independently.',
      'A central prompt copy whose current text is loaded at runtime by all teams.',
      'A style guide that permits each team to choose its own output fields.',
      'Versioned contracts, named owners, and regression evidence for changes.'
    ], answer: 3,
    explanation: 'D makes prompt behavior a governed dependency with explicit change control. Shared examples alone do not version the contract. Loading the latest text everywhere can propagate breaking changes instantly. A style guide cannot protect schema consumers. Studio prompts support sharing and ALM; those capabilities need an operating policy.'
  }),
  practice({
    id: 21, revision: 2, topic: 'Ecosystem Integration', labIds: ['lab-02', 'lab-06'], evidence: 'strategy',
    question: 'Employees need a SharePoint policy helper inside Microsoft 365 Copilot. There are no custom workflow or runtime requirements. What is the lowest-complexity starting architecture?',
    options: [
      'A declarative Copilot agent grounded in the approved SharePoint content.',
      'A hosted Foundry agent with a separate chat client and replicated index.',
      'A custom model trained on the policies and exposed through a Teams tab.',
      'A desktop automation agent that searches SharePoint through the browser.'
    ], answer: 0,
    explanation: 'A uses the existing experience and permission-aware knowledge path. B may suit custom runtime needs but introduces unnecessary hosting and replication here. C is a poor update strategy for policy facts. D automates a UI where native knowledge integration exists. Microsoft 365 agents can also have tools; they are not categorically read-only.'
  }),
  practice({
    id: 22, revision: 2, topic: 'Foundry & Extensibility', labIds: ['lab-05'], evidence: 'tools',
    question: 'A pilot must complete forms across supplier portals with no APIs. Layout changes break existing selectors, and the next action depends on visible warning banners. Preview use is approved for synthetic data. Which alternative best targets that limitation?',
    options: [
      'Re-record selector-based desktop flows for each current portal layout.',
      'Use fixed screen coordinates with a separate macro for each portal.',
      'Computer Use with a provisioned machine and bounded action permissions.',
      'Run the existing desktop flows behind an MCP tool with the same selectors.'
    ], answer: 2,
    explanation: 'C can interpret visual state and is worth testing against the observed selector failures. A repairs only the current layouts; B is more sensitive to layout movement; D changes the interface to the automation without changing its brittle implementation. Computer Use is not guaranteed to succeed: test completion, recovery, permissions, and machine support before any wider use.'
  }),
  practice({
    id: 23, revision: 2, topic: 'Foundry & Extensibility', labIds: ['lab-05'], evidence: 'mcp',
    question: 'A diagnostic utility exposes MCP only over stdio on an engineer\'s laptop. A cloud-hosted Studio standard-harness agent must use it. What is required before connection?',
    options: [
      'Deploy the stdio server in a container and publish its service port unchanged.',
      'Host or bridge it to reachable Streamable HTTP and review auth and policy.',
      'Put an HTTPS reverse proxy before stdio without adapting its MCP transport.',
      'Add an authenticated legacy SSE adapter and expose its remote endpoint.'
    ], answer: 1,
    explanation: 'B supplies a compatible endpoint reachable by the cloud service. Containerizing a stdio process does not create an HTTP listener; a reverse proxy alone cannot translate stdio into MCP Streamable HTTP. An SSE adapter is a real legacy pattern, but the cited Studio standard-harness page says SSE is no longer supported after August 2025. Authentication, connector data policies, and production hosting still need review.'
  }),
  practice({
    id: 24, revision: 2, topic: 'Foundry & Extensibility', labIds: ['lab-05'], evidence: 'a2a',
    question: 'A diagnostic specialist already implements A2A and owns a multi-turn workflow. Studio should delegate without recreating that workflow or building a protocol adapter. Which connection matches that contract?',
    options: [
      'A custom HTTP wrapper implementing conversation state around the specialist.',
      'A Studio child agent that reimplements the specialist\'s diagnostic steps.',
      'An MCP adapter exposing each diagnostic step as a separate callable tool.',
      'An authenticated A2A task connection with agreed context and delegation boundaries.'
    ], answer: 3,
    explanation: 'D uses the existing delegation contract. A and C are implementable integration designs but require the custom adapter excluded by the stem. B duplicates a workflow that already has an owner. Review shared history, identities, task boundaries, and trace correlation; choosing A2A does not make those responsibilities disappear.'
  }),
  practice({
    id: 25, revision: 2, topic: 'ROI & Build-Buy-Extend', labIds: ['lab-03', 'lab-05'], evidence: 'router',
    question: 'Simple classifications and complex claim analyses all use the same expensive model. Which proposed optimization should the architect evaluate?',
    options: [
      'Route by task requirements and compare quality, cost, and tail latency.',
      'Send every task to the cheapest model and increase retrieval depth.',
      'Cache every answer by prompt text without considering user identity.',
      'Shorten all model responses until monthly spending meets the budget.'
    ], answer: 0,
    explanation: 'A evaluates model routing against workload-specific acceptance criteria. B can sacrifice complex-task quality; C can leak user-specific responses or return stale facts; D may remove essential information while leaving model selection inefficient. Routing is not a guarantee that the smallest model is always sufficient.'
  }),
  practice({
    id: 26, revision: 2, topic: 'Testing & Evaluation', labIds: ['lab-07', 'lab-04'], evidence: 'grounding',
    question: 'An agent identifies refund questions correctly but cites a policy for the wrong country. Where should the next investigation focus?',
    options: [
      'The topic trigger phrases used to recognize the refund intent.',
      'The number of retrieved passages and whether a larger top-k is needed.',
      'The retrieval filters and policy metadata used to select evidence.',
      'The response prompt\'s citation formatting and source-title instructions.'
    ], answer: 2,
    explanation: 'C targets jurisdiction selection in retrieval. A revisits an intent already recognized correctly. B may retrieve more policies but does not ensure the right country. D changes citation presentation rather than source applicability. Inspect retrieval results before changing generation; a real citation can still support the wrong policy.'
  }),
  practice({
    id: 27, revision: 2, topic: 'Testing & Evaluation', labIds: ['lab-07', 'lab-06'], evidence: 'scope',
    question: 'A service agent checks Finance invoice status before resolving a Customer Service case. Both individual connectors pass tests. Which additional test exposes cross-app failure?',
    options: [
      'Replay successful invoice lookups using a Finance administrator account.',
      'Run resolution with denied invoice access and verify no false completion.',
      'Compare the two connectors\' schemas without invoking the case workflow.',
      'Run case-summary tests with invoice status supplied as fixed prompt text.'
    ], answer: 1,
    explanation: 'B exercises identity, integration failure, and final business outcome across both applications. A tests only a privileged happy path. C is a useful contract check but omits execution. D bypasses the integration. The study guide requires end-to-end multi-app scenarios; this failure case is an authored example, not a Microsoft test case.'
  }),
  practice({
    id: 28, revision: 2, topic: 'ALM & Environments', labIds: ['lab-08'], evidence: 'alm',
    question: 'Makers are ready to move a Studio prototype into a departmental production service. Which environment strategy supports reproducible releases?',
    options: [
      'Separate development, test, and production with solution-based promotion.',
      'One environment with separate agent names and shared production connections.',
      'Separate environments with manual topic recreation for each release.',
      'A developer environment with restricted sharing and weekly exports.'
    ], answer: 0,
    explanation: 'A provides isolation and a repeatable transport mechanism. Naming conventions in one environment do not isolate changes or data. Manual recreation introduces drift. A developer environment is not the intended production host. Bind environment-specific values and connections, and verify settings that are not solution-aware after deployment.'
  }),
  practice({
    id: 29, revision: 2, topic: 'Responsible AI & Security', labIds: ['lab-09'], evidence: 'access',
    question: 'The conversational identity can read policy documents. Makers propose granting it write access to the same corpus so it can correct its own mistakes. What design is safer?',
    options: [
      'Allow writes when the agent reports high confidence in its correction.',
      'Allow writes only during a scheduled low-traffic maintenance window.',
      'Allow writes but retain an editable transcript of the original document.',
      'Separate corpus stewardship from retrieval and require reviewed changes.'
    ], answer: 3,
    explanation: 'D separates consumption from the authority to change evidence. Confidence and quiet hours do not establish correctness or authorization. An editable transcript is neither a trustworthy audit trail nor a review gate. Use least-privilege steward roles and a controlled ingestion path for approved corrections.'
  }),
  practice({
    id: 30, revision: 2, topic: 'Responsible AI & Security', labIds: ['lab-09'], evidence: 'security',
    question: 'A red-team prompt persuades an agent to attempt a refund above its business limit. Which mitigation should enforce the limit even if the model follows the attack?',
    options: [
      'Repeat the refund limit in the greeting and each topic description.',
      'Reduce model temperature and request an explanation before tool use.',
      'Enforce authorization and amount limits in the refund execution path.',
      'Detect the phrase "ignore instructions" and block only matching prompts.'
    ], answer: 2,
    explanation: 'C places the hard boundary outside model compliance. Clear instructions, generation settings, and attack detection can complement it but cannot enforce all business permissions. Phrase blocking misses paraphrases and indirect attacks. Test denied operations and log attempts without granting the model extra authority.'
  }),
  practice({
    id: 31, revision: 2, topic: 'Monitor & Tune', labIds: ['lab-07'], evidence: 'lifecycle',
    question: 'After a prompt release, the agent calls the same lookup four times per request instead of once. Quality is unchanged but cost rises. What tuning action best matches the evidence?',
    options: [
      'Trace duplicate calls to planner steps, revise instructions, and rerun the baseline.',
      'Cache lookup results so repeated calls return without reaching the source.',
      'Reduce connector retries before checking whether the repeated calls are retries.',
      'Merge the lookup into another tool and deploy without replaying earlier cases.'
    ], answer: 0,
    explanation: 'A first distinguishes planner behavior from tool failures and verifies the correction. B may reduce source load but leaves redundant orchestration. C assumes retry behavior without evidence. D changes a contract without regression checks. Compare the same workload across versions and verify that necessary lookups remain.'
  }),
  practice({
    id: 32, revision: 2, topic: 'Monitor & Tune', labIds: ['lab-07', 'lab-01'], evidence: 'value',
    question: 'Users report that renewal answers cite last year\'s policy, but the aggregate satisfaction score remains high. What backlog item should be prioritized?',
    options: [
      'Revise the satisfaction survey to ask specifically about renewal wording.',
      'Trace reported cases to source versions and repair the refresh process.',
      'Add renewal phrases to the intent model while retaining the current corpus.',
      'Tune the response style so citations appear less prominently to the user.'
    ], answer: 1,
    explanation: 'B turns specific feedback into a reproducible freshness investigation. Better surveys can gather evidence but do not repair the reported source. Intent phrases do not update policy facts, and de-emphasizing citations hides the problem. Add the affected cases to regression evaluation after the fix.'
  }),
  practice({
    id: 33, revision: 2, topic: 'Copilot in Dynamics 365', labIds: ['lab-06'], evidence: 'help',
    question: 'Finance users need approved PDF procedure manuals in the existing in-app help experience. Which sequence matches the documented extension path?',
    options: [
      'Upload the PDFs to a new standalone agent and share it with Finance users.',
      'Upload to the F&O agent in the maker\'s default environment and publish.',
      'Upload to the linked F&O agent and test it, leaving publication unchanged.',
      'In the linked environment, upload to the F&O agent; wait for Ready, test, publish.'
    ], answer: 3,
    explanation: 'D targets the in-app agent in the associated Dataverse environment and completes the processing, testing, and publication steps. A creates a separate experience. B targets the wrong environment unless it happens to be the associated one. C validates draft behavior but does not release it. Other source types may need a custom topic; structured-data chat has separate limitations.'
  }),
  practice({
    id: 34, revision: 2, topic: 'Copilot in Dynamics 365', labIds: ['lab-04', 'lab-06'], evidence: 'sales',
    question: 'A Dynamics 365 Sales Copilot customization must quote current prices from an authenticated REST API with no ready-made connector. Which integration should the team design?',
    options: [
      'A knowledge-source file containing a nightly export of pricing results.',
      'A scheduled flow that synchronizes API prices to Dataverse once per day.',
      'A custom connector action with typed inputs and scoped authentication.',
      'A desktop flow that reads the pricing portal through a seller\'s UI session.'
    ], answer: 2,
    explanation: 'C uses the available authenticated API directly. A and B are plausible replication strategies but can miss price changes between refreshes. D can read a portal but adds machine/session dependencies where a supported API exists. The cited Sales custom-topic experience is preview; verify eligibility, licensing, permissions, and error handling before production use.'
  }),
  practice({
    id: 35, revision: 2, topic: 'Testing & Evaluation', labIds: ['lab-07', 'lab-05'], evidence: 'fineTune', format: 'multiple',
    question: 'A tuned classifier improves training accuracy. Which TWO checks are essential before deciding whether it replaces the production model?',
    options: [
      'Score the training examples again using the production evaluation rubric.',
      'Compare training-set loss across epochs to select the lowest-loss run.',
      'Score held-out, representative cases against the production baseline.',
      'Evaluate harmful failures and performance on important task subgroups.'
    ], answer: [2, 3],
    explanation: 'C tests generalization and relative value; D checks consequential failures hidden by averages. A reuses examples seen in training and cannot establish generalization. B helps select training runs but may reward overfitting. Release criteria should also cover operational requirements such as latency and cost; training accuracy alone is insufficient.'
  }),
  practice({
    id: 36, revision: 2, topic: 'AI Strategy & CAF', labIds: ['lab-02', 'lab-09'], evidence: 'governance', format: 'matching',
    question: 'A steering group assigns responsibilities across adoption, delivery, and security. Match each framework or product family to its principal role.',
    options: ['Microsoft Purview', 'Success by Design', 'Microsoft Defender', 'Cloud Adoption Framework'],
    matchLabels: [
      'A. Enterprise cloud and AI adoption strategy and readiness',
      'B. Dynamics implementation reviews and solution-risk guidance',
      'C. Data classification, supported DLP policies, and compliance evidence',
      'D. Threat detection and protection across supported workloads'
    ], matches: { 0: 'C', 1: 'B', 2: 'D', 3: 'A' }, answer: 0,
    explanation: 'The assignments distinguish strategy, implementation, data governance, and threat protection. Purview is not an inference-region selector; residency still needs service and routing controls. Defender coverage depends on the deployed product and workload. CAF and Success by Design are complementary guidance, not runtime security products.'
  }),
  practice({
    id: 37, revision: 2, topic: 'Responsible AI & Security', labIds: ['lab-09', 'lab-04'], evidence: 'autonomous', format: 'multiple',
    question: 'An invoice agent starts from inbound mail and can propose payments. Which TWO controls address both untrusted triggering and consequential execution?',
    options: [
      'Validate the incoming event and constrain which invoices enter the workflow.',
      'Increase the model\'s confidence threshold for recognizing vendor names.',
      'Retain all mailbox attachments indefinitely for possible future diagnosis.',
      'Require the designated payment authority before any funds are released.'
    ], answer: [0, 3],
    explanation: 'A reduces spoofed or out-of-scope triggers; D enforces human authority over payment. A confidence threshold cannot authenticate mail or authorize funds. Indefinite retention is not trigger validation and may conflict with data policy. These are design controls for the hypothetical agent, not a claim that Payables Agent supplies payment approval flows.'
  }),
  practice({
    id: 38, revision: 2, topic: 'Requirements & Grounding', labIds: ['lab-01'], evidence: 'data',
    question: 'A forecasting team needs years of cases for analysis, while a service agent needs current case status. How should the shared data estate serve both without overloading the transactional app?',
    options: [
      'Point both workloads at unrestricted full-table operational queries.',
      'Use governed analytical data for forecasting and live access for status.',
      'Move both workloads onto the monthly analytical snapshot for consistency.',
      'Create a separate editable case spreadsheet for each consuming team.'
    ], answer: 1,
    explanation: 'B separates analytical and operational access patterns while retaining ownership and governed lineage. A risks transactional performance and excess access. C cannot meet live-status freshness. D creates competing sources of truth. Shared governance does not mean every workload must use the same physical store or refresh cadence.'
  }),
  practice({
    id: 39, revision: 2, topic: 'AI Strategy & CAF', labIds: ['lab-02', 'lab-03'], evidence: 'strategy',
    question: 'A sponsor describes an agentic-first program as "put chat on every form." Which initial deliverable would instead make the program accountable to business outcomes?',
    options: [
      'A rollout calendar listing every form and its intended chat launch date.',
      'A reusable visual component that gives each form the same chat interface.',
      'A ranked process portfolio with outcome baselines and accountable owners.',
      'A catalog of candidate models sorted by their maximum context windows.'
    ], answer: 2,
    explanation: 'C starts with measurable business problems and ownership before interface or model choices. A and B can support delivery once a use case is justified. D helps technical selection later. Chat placement is not evidence that a business process benefits from an agent or that the organization can govern it.'
  }),
  practice({
    id: 40, revision: 2, topic: 'AI Strategy & CAF', labIds: ['lab-02'], evidence: 'strategy',
    question: 'A company has many AI experiments but no support capability or secure environment baseline. CAF planning identifies one valuable pilot. What should follow before scaling it?',
    options: [
      'Complete departmental pilot plans and defer shared operations until expansion.',
      'Reserve model capacity and treat quota availability as the scaling readiness gate.',
      'Promote the prototype and fund governance after usage establishes demand.',
      'Establish readiness, security, governance, and operational responsibilities.'
    ], answer: 3,
    explanation: 'D closes the stated operational and security readiness gaps. A organizes pilots but defers shared support. B secures capacity, not operational readiness. C promotes before establishing governance. CAF treats governance, security, and management as continuing responsibilities rather than launch paperwork.'
  }),
  practice({
    id: 41, revision: 2, topic: 'Requirements & Grounding', labIds: ['lab-01'], evidence: 'strategy',
    question: 'A request asks for AI to calculate contractual late fees from a fixed formula. Inputs are structured and the same inputs must always produce the same amount. What should own the calculation?',
    options: [
      'A generative prompt with the formula and several worked examples.',
      'A deterministic business rule, with AI limited to explanation if useful.',
      'A fine-tuned model trained on all previously assessed late fees.',
      'A reasoning agent that chooses a calculation method for each invoice.'
    ], answer: 1,
    explanation: 'B meets the repeatability requirement without unnecessary model uncertainty. Examples and training do not turn language generation into a guaranteed calculator. Choosing a method per invoice violates the fixed contract. AI can explain a computed fee, but the authoritative amount should come from validated business logic.'
  }),
  practice({
    id: 42, revision: 2, topic: 'Requirements & Grounding', labIds: ['lab-01', 'lab-04'], evidence: 'grounding',
    question: 'Search retrieves the right maintenance manuals, but OCR split table rows and repeated page headers obscure torque values. Which preparation change addresses this failure?',
    options: [
      'Preserve table structure and remove repeated noise before indexing.',
      'Increase the number of retrieved pages without changing their parsing.',
      'Increase chunk overlap while retaining the current OCR text representation.',
      'Switch embedding models and rebuild the index from the same parsed text.'
    ], answer: 0,
    explanation: 'A repairs the damaged evidence representation. B retrieves more of the same damaged material. C can preserve context across chunk boundaries but cannot restore lost table relationships. D changes retrieval encoding rather than parsing. Validate torque values against the originals and retain provenance before testing retrieval again.'
  }),
  practice({
    id: 43, revision: 2, topic: 'Requirements & Grounding', labIds: ['lab-01', 'lab-06'], evidence: 'data',
    question: 'Two authorized agents consume a customer-data API. A schema change silently changes "balance" from euros to cents. What data contract should prevent this class of error?',
    options: [
      'A JSON type schema that declares balance numeric but leaves units implicit.',
      'A longer field description added only to the agents\' system prompts.',
      'A versioned schema defining units, meaning, owners, and compatibility.',
      'A consumer-side heuristic that divides unusually large balances by one hundred.'
    ], answer: 2,
    explanation: 'C makes semantics and compatibility explicit at the producer-consumer boundary. A validates type but accepts both euros and cents. B can drift from the API contract. D confuses legitimately large balances with a unit change. Current records can still be wrong for the consumer when their meaning changes silently.'
  }),
  practice({
    id: 44, revision: 2, topic: 'Copilot Studio Agents', labIds: ['lab-04', 'lab-08'], evidence: 'wa',
    question: 'An intelligent Power Apps workload is fast and secure but difficult to use and has no recovery runbook. How should a Power Platform Well-Architected review assess it?',
    options: [
      'Accept the design because security and performance are the release pillars.',
      'Apply Azure\'s cost pillar in place of usability to complete the assessment.',
      'Review only the model, since the surrounding app is already on Power Platform.',
      'Assess all five pillars, including usability, recovery, and operational ownership.'
    ], answer: 3,
    explanation: 'D includes Reliability, Security, Operational Excellence, Performance Efficiency, and Experience Optimization. Recovery and usability are workload concerns even when platform services work. Power Platform has Experience Optimization, not a standalone Cost Optimization pillar. The review covers the app, people, and operations as well as the model.'
  }),
  practice({
    id: 45, revision: 2, topic: 'AI Strategy & CAF', labIds: ['lab-02', 'lab-05'], evidence: 'a2a',
    question: 'HR and procurement specialists have separate owners, release schedules, and permitted data. An employee front door must delegate without merging those responsibilities. What boundary belongs in the architecture?',
    options: [
      'One shared administrator identity and one combined specialist prompt.',
      'Explicit delegation contracts with separate permissions and ownership.',
      'A shared conversation log used as the only state store for all agents.',
      'Identical tool permissions so any specialist can finish any delegated task.'
    ], answer: 1,
    explanation: 'B preserves specialist responsibilities while allowing coordination. Shared administration and identical permissions erase least-privilege boundaries. A common log is useful for correlation only when access is controlled; it is not a task-ownership contract. Validate what context crosses each boundary and which agent owns completion or escalation.'
  }),
  practice({
    id: 46, revision: 2, topic: 'Ecosystem Integration', labIds: ['lab-04', 'lab-06'], evidence: 'pages',
    question: 'Developers need an AI-generated model-driven app page over Dataverse. They require local TypeScript/React review and deployment through the supported solution workflow, without operating a separate web host. Which approach fits?',
    options: [
      'Create a generative page with AI code tools, then review and deploy it.',
      'Build a Power Fx custom page in the designer and include it in a solution.',
      'Generate a standalone React app and embed its hosted URL in the app.',
      'Generate a React web resource and manage its page integration manually.'
    ], answer: 0,
    explanation: 'A meets the requested authoring and deployment contract. B is a legitimate low-code custom-page approach but not local TypeScript/React authoring. C requires a separate host. D can deliver custom UI but leaves page integration to the team rather than using the supported generative-page workflow. Review the generated code, Dataverse access, accessibility, and behavior before publishing.'
  }),
  practice({
    id: 47, revision: 2, topic: 'AI Strategy & CAF', labIds: ['lab-03'], evidence: 'strategy',
    question: 'Every department invents its own risk rubric and support model. The AI Center of Excellence must improve consistency without becoming the owner of every business process. Which model fits?',
    options: [
      'Centralize every prompt edit and business approval in the CoE delivery team.',
      'Leave all standards local and collect only quarterly adoption statistics.',
      'Publish shared controls and evaluation standards with local accountable owners.',
      'Standardize on one model and let its supplier own operational risk decisions.'
    ], answer: 2,
    explanation: 'C combines common governance with business accountability. A creates an unnecessary central delivery bottleneck, B preserves inconsistent controls, and D mistakes technical standardization for risk ownership. The CoE should support reuse, enablement, review, and escalation rather than remove responsibility from process owners.'
  }),
  practice({
    id: 48, revision: 2, topic: 'ROI & Build-Buy-Extend', labIds: ['lab-03'], evidence: 'roi',
    question: 'An agent handles 12,000 eligible cases yearly and saves 6 minutes on each. Labor is valued at $40/hour and all saved time is realized as value. Year-one implementation plus operating cost is $32,000. Using (benefit - cost) / cost, what is year-one ROI?',
    options: ['$48,000 benefit; 150% ROI.', '$16,000 benefit; 50% ROI.', '$48,000 benefit; 33.3% ROI.', '$48,000 benefit; 50% ROI.'], answer: 3,
    explanation: 'D: 12,000 x 6 / 60 = 1,200 hours; 1,200 x $40 = $48,000. Net benefit is $16,000, so ROI is $16,000 / $32,000 = 50%. A divides gross benefit by cost, B calls net benefit gross benefit, and C divides net benefit by gross benefit. These are hypothetical values, not product savings claims.'
  }),
  practice({
    id: 49, revision: 2, topic: 'ROI & Build-Buy-Extend', labIds: ['lab-03'], evidence: 'roi',
    question: 'Implementation costs $60,000 upfront. From month one, an agent realizes $15,000 in monthly benefit and costs $5,000 monthly to operate. Ignoring discounting and taxes, when is simple payback?',
    options: ['At month 4, using $15,000 monthly benefit.', 'At month 6, using $10,000 monthly net benefit.', 'At month 12, using $5,000 monthly operating cost.', 'At month 3, using $20,000 monthly combined value.'], answer: 1,
    explanation: 'B: monthly net benefit is $15,000 - $5,000 = $10,000; $60,000 / $10,000 = six months. A ignores operating expense, C treats expense as benefit, and D adds cost instead of subtracting it. A delayed adoption ramp would change this result, but the stem explicitly assumes immediate realization.'
  }),
  practice({
    id: 50, revision: 2, topic: 'ROI & Build-Buy-Extend', labIds: ['lab-03'], evidence: 'roi',
    question: 'A proposed router sends 8,000 simple requests at $0.01 each and 2,000 complex requests at $0.06 each. Routing adds $20 monthly. All-direct traffic would cost $0.06 per request. Quality is held equal. What is the monthly saving?',
    options: ['$380 saved: $600 baseline less $220 routed cost.', '$400 saved: $600 baseline less $200 routed cost.', '$480 saved: $600 baseline less $120 routed cost.', '$580 saved: $600 baseline less $20 routed cost.'], answer: 0,
    explanation: 'A: the baseline is 10,000 x $0.06 = $600. Routed inference costs $80 + $120, plus $20 overhead, totaling $220. B omits routing overhead, C omits simple requests and overhead, and D omits all inference. The prices and equal-quality assumption are fictional; a real router decision needs evaluation and current pricing.'
  }),
  practice({
    id: 51, revision: 2, topic: 'Ecosystem Integration', labIds: ['lab-04', 'lab-06'], evidence: 'feed',
    question: 'In an approved preview pilot, a model-driven app must show agent work awaiting human help separately from completed work. Which design matches the current agent feed?',
    options: [
      'Publish the agent to Teams and show its conversation transcript in the app.',
      'Write agent messages into the case timeline and mark each case as pending.',
      'Connect the supervised agent to Power Apps MCP and use its task-based agent feed.',
      'Enable the legacy activity feed and log all work as completed chat sessions.'
    ], answer: 2,
    explanation: 'C uses the documented supervision surface: the agent must use the Power Apps MCP server and be supervised in the app. Chat transcripts and case timelines are not the same task lifecycle; the older activity-based feed has been replaced. This is preview, English-only, and region-dependent. Users with Agent Task access can see feed items, so do not assume private per-user tasks.'
  }),
  practice({
    id: 52, revision: 2, topic: 'Foundry & Extensibility', labIds: ['lab-04', 'lab-05'], evidence: 'documents',
    question: 'An invoice workflow needs standard header and line-item extraction with field confidence scores. The team wants to evaluate a ready-made invoice schema before labeling data or maintaining custom extraction logic. What is the best baseline?',
    options: [
      'Train a custom document model using labeled invoices from each supplier.',
      'Combine a layout extractor with rules that map text spans into invoice fields.',
      'Build an OCR and language-model pipeline with a custom confidence estimator.',
      'Document Intelligence with a suitable prebuilt invoice model.'
    ], answer: 3,
    explanation: 'D gives the requested prebuilt baseline and field-confidence output. A can address specialized fields but requires labeling. B adds extraction-rule maintenance. C provides flexibility at the cost of custom orchestration and confidence calibration. Other managed analyzers may also merit evaluation; this choice is not a guarantee of accuracy on every supplier format.'
  }),
  practice({
    id: 53, revision: 2, topic: 'Copilot Studio Agents', labIds: ['lab-04'], evidence: 'tools',
    question: 'An agent must extract claimants and their repair shops into a fixed JSON schema from long reports. Ordinary conversational answers are inconsistent. Which component gives the most direct control?',
    options: [
      'A prompt action with explicit inputs, relationships, and output schema.',
      'A longer tool description asking the orchestrator to keep answers tidy.',
      'A response formatter that parses claimant and shop names from generated prose.',
      'A rule-based parser that pairs each claimant with the nearest shop mention.'
    ], answer: 0,
    explanation: 'A directly controls relationship extraction and the output contract at generation time. B gives only general formatting guidance. C can reshape prose but cannot reliably repair omitted or incorrect relationships. D assumes textual proximity implies ownership, which narrative reports need not follow. Validate JSON and handle missing or ambiguous relationships explicitly.'
  }),
  practice({
    id: 54, revision: 2, topic: 'Copilot Studio Agents', labIds: ['lab-04'], evidence: 'language',
    question: 'A user says "cancel it" after discussing both a service appointment and an order. The agent cannot determine which object is intended. Which fallback is appropriate?',
    options: [
      'Cancel the object mentioned most recently and offer an undo afterward.',
      'Ask which object they mean before invoking either cancellation tool.',
      'Search the knowledge base for a general cancellation policy and end.',
      'Route to an operator immediately without attempting a clarifying question.'
    ], answer: 1,
    explanation: 'B resolves a simple referent ambiguity without acting or requiring an operator. A guesses consent; C gives policy rather than resolving intent; D is a safe fallback if clarification fails but is premature here. Escalate when the user cannot clarify or policy requires human intervention.'
  }),
  practice({
    id: 55, revision: 2, topic: 'Copilot Studio Agents', labIds: ['lab-04'], evidence: 'ai',
    question: 'A canvas app captures an inspection and uses AI to draft a work order. The inspector remains accountable for the submitted order. Where should the generated result enter the process?',
    options: [
      'As a final submitted record once the prompt returns valid-looking text.',
      'As a separate chat message that is not linked to the inspection record.',
      'As a queued order submitted automatically unless the inspector rejects it.',
      'As an editable draft linked to the inspection and explicitly confirmed.'
    ], answer: 3,
    explanation: 'D preserves the inspector\'s explicit decision and the inspection link. A confuses output validity with approval. B loses process context. C treats inaction as approval rather than a confirmed submission. Use defined inputs, validation, and a controlled write action; generation should not implicitly authorize the order.'
  }),
  practice({
    id: 56, revision: 2, topic: 'Foundry & Extensibility', labIds: ['lab-04', 'lab-05'], evidence: 'foundryTools', format: 'multiple',
    question: 'A support solution needs interim transcripts while callers speak and category-specific harm-severity scores for the resulting text. It must use managed speech and safety capabilities. Which TWO configurations meet those requirements?',
    options: [
      'Use Speech batch transcription on uploaded recordings for the live captions.',
      'Use Content Safety text analysis with thresholds for each harm category.',
      'Use Speech real-time transcription to receive interim recognition results.',
      'Use a profanity blocklist as the sole source of the text\'s harm-severity score.'
    ], answer: [1, 2],
    explanation: 'B supplies category-level severity results; C provides live recognition including interim results. A is useful for asynchronous analysis of completed recordings but not live captions. D can catch listed terms but cannot substitute for contextual harm-category scoring. Validate language support, transcription errors, thresholds, and latency; moderation is not a guarantee of safety.'
  }),
  practice({
    id: 57, revision: 2, topic: 'Foundry & Extensibility', labIds: ['lab-05', 'lab-09'], evidence: 'reasoning',
    question: 'A standard-harness Studio pilot has one difficult supplier-comparison step and several simple lookups. Deep reasoning preview is approved for synthetic data. Which design controls latency and exposure?',
    options: [
      'Enable reasoning for every step to keep all model behavior consistent.',
      'Apply reasoning to the comparison step and measure its added latency.',
      'Use reasoning for each supplier lookup and a standard model for comparison.',
      'Split the comparison across several reasoning steps before measuring latency.'
    ], answer: 1,
    explanation: 'B places reasoning where the stated analytical difficulty lies and measures its cost. A applies it unnecessarily to routine work; C targets lookups rather than comparison; D assumes extra reasoning stages help before benchmarking them. The feature requires generative orchestration and reasoning enabled. It is preview with no residency commitment, so sensitive-data or production use needs a separate eligibility decision.'
  }),
  practice({
    id: 58, revision: 2, topic: 'Foundry & Extensibility', labIds: ['lab-05'], evidence: 'tools',
    question: 'A stable desktop form has reliable selectors and fixed rules. Processing speed matters, an RPA team owns it, and only GA features are allowed. What is the better starting point?',
    options: [
      'A Computer Use agent that interprets the form visually for each transaction.',
      'A new browser-automation script maintained outside the existing RPA team.',
      'A Power Automate desktop flow using the existing RPA operating model.',
      'An attended desktop flow requiring an operator to start every transaction.'
    ], answer: 2,
    explanation: 'C fits stable, high-volume, rule-based automation with an established team. The cited comparison recommends RPA for GA-only scenarios. A adds visual-model variability and an eligibility issue. B assumes a browser-accessible interface and creates a second support stack. D adds operator dependence to each transaction. Computer Use is not automatically preferable whenever an API is absent.'
  }),
  practice({
    id: 59, revision: 2, topic: 'Foundry & Extensibility', labIds: ['lab-05'], evidence: 'a2a',
    question: 'One Studio agent needs a current-stock lookup from a supplier\'s stable REST API. There is no shared tool catalog or specialist workflow requirement. Which initial integration has the least unnecessary infrastructure?',
    options: [
      'A custom connector or HTTP tool for the stock lookup.',
      'A custom A2A agent that wraps the stock API as a delegated task.',
      'A hosted MCP server that publishes the stock lookup for agent discovery.',
      'A scheduled API export feeding a searchable index of stock snapshots.'
    ], answer: 0,
    explanation: 'A meets the single-agent, stable-API need directly. B and C are implementable and may suit delegation or a shared catalog, but add hosting and lifecycle work not justified here. D introduces snapshot staleness. The point is proportional integration, not a claim that MCP or A2A could never wrap this API.'
  }),
  practice({
    id: 60, revision: 2, topic: 'Copilot in Dynamics 365', labIds: ['lab-06'], evidence: 'fnoData',
    question: 'An approved F&O structured-data chat preview must ground answers in inventory quantities that users are authorized to see. The team wants the supported structured knowledge-source path rather than document snapshots. What should it configure?',
    options: [
      'Export inventory reports nightly and upload them as agent knowledge files.',
      'Index warehouse dashboards as pages through a separate knowledge connector.',
      'Build an HTTP lookup topic instead of configuring a structured knowledge source.',
      'Configure supported F&O virtual entities or synchronized Dataverse tables.'
    ], answer: 3,
    explanation: 'D uses the documented structured-data chat preview path. A and B convert operational data into snapshots with their own freshness and access-control concerns. C is a valid custom integration option but not the requested knowledge-source configuration. Verify entity support and any synchronization latency; older help-and-guidance documentation has different virtual-entity limitations.'
  }),
  practice({
    id: 61, revision: 2, topic: 'Ecosystem Integration', labIds: ['lab-06'], evidence: 'salesSetup',
    question: 'Sales agent is installed, but sellers cannot query their new custom CRM table. Admins have not added it to Sales Chat configuration. What should be checked first?',
    options: [
      'Add the table to Forms settings and refresh the seller-facing form layout.',
      'Add terminology mappings while retaining the current Sales Chat table list.',
      'Configured CRM entities, search indexing, and the user\'s privileges.',
      'Reinstall the Sales agent app while retaining its environment configuration.'
    ], answer: 2,
    explanation: 'C addresses the missing query configuration, indexing, and permissions. Forms settings and Sales Chat configuration can be managed independently; adding a form is not sufficient. Terminology mappings improve interpretation but do not replace the required table configuration. Reinstalling the app leaves the missing environment settings unchanged.'
  }),
  practice({
    id: 62, revision: 2, topic: 'Ecosystem Integration', labIds: ['lab-04', 'lab-06'], evidence: 'tools',
    question: 'A Power Platform team needs one reusable summarization prompt in both a flow and an agent. It does not need another conversational persona. What should it manage as the reusable asset?',
    options: [
      'A separate agent for each caller with identical copied instructions.',
      'A library prompt with parameters, permissions, and solution lifecycle.',
      'Separate inline prompts in each caller with changes synchronized by convention.',
      'A custom model endpoint with a new wrapper service owned by the app team.'
    ], answer: 1,
    explanation: 'B manages the prompt as the reusable platform asset. A duplicates conversational agents unnecessarily. C relies on manual synchronization and risks drift. D can support specialized runtime needs but adds a service lifecycle absent from this requirement. AI hub/AI Builder and Studio UI names can change; validate the supported caller bindings and permissions.'
  }),
  practice({
    id: 63, revision: 2, topic: 'Ecosystem Integration', labIds: ['lab-06'], evidence: 'data',
    question: 'Customer Service and Finance both have a customer named Northwind, but their identifiers and legal-entity scopes differ. What should the integration contract establish before an agent joins records?',
    options: [
      'An authoritative identity mapping including legal entity and record ownership.',
      'A fuzzy-name rule that accepts the first matching customer in each app.',
      'A shared display-name convention with no change to the existing identifiers.',
      'A model instruction to choose the customer with the most recent activity.'
    ], answer: 0,
    explanation: 'A prevents a plausible but incorrect cross-app join. Names and recency are not stable identity keys, especially across legal entities. A display-name convention does not resolve ambiguous historical data. The contract should also state which system owns each field and how missing or conflicting mappings are handled.'
  }),
  practice({
    id: 64, revision: 2, topic: 'Monitor & Tune', labIds: ['lab-07'], evidence: 'value',
    question: 'Thousands of feedback comments make manual triage slow. The team wants AI-assisted discovery of recurring unmet requests, not just another volume chart. Which use of analytics fits?',
    options: [
      'Rank agents by total sessions and prioritize the most popular agent.',
      'Rank negative-sentiment scores and treat their order as the topic backlog.',
      'Summarize only positive reactions to establish successful topic patterns.',
      'Cluster question themes, inspect examples, and turn gaps into test cases.'
    ], answer: 3,
    explanation: 'D groups unmet requests into reviewable themes and regression cases. A ranks popularity, not gaps. B helps prioritize dissatisfaction but does not identify what capability is missing. C excludes the failures being investigated. Check feature availability and inspect clustered examples; AI-assigned themes are not proven root causes.'
  }),
  practice({
    id: 65, revision: 2, topic: 'Monitor & Tune', labIds: ['lab-07'], evidence: 'value',
    question: 'CSAT is 4.8/5, but only 2% of sessions have survey responses and escalated users rarely respond. What is the most defensible interpretation?',
    options: [
      'The agent meets its quality target because the average exceeds 4.5.',
      'Survey response rate can substitute for unresolved-session measurement.',
      'The respondents are satisfied; inspect nonresponse and outcome cohorts.',
      'The score is unusable, so remove CSAT from all operational reporting.'
    ], answer: 2,
    explanation: 'C respects what the measure actually samples. A generalizes a selected group to all users. B confuses participation with resolution. D discards useful but limited evidence. Compare resolution, escalation, abandonment, and sampled case quality alongside the survey rather than claiming causal or population-wide success.'
  }),
  practice({
    id: 66, revision: 2, topic: 'Monitor & Tune', labIds: ['lab-07'], evidence: 'lifecycle',
    question: 'Median response time is 2 seconds, but p95 rose from 8 to 25 seconds after a connector change. What should the operator investigate first?',
    options: [
      'Dependency spans and retries in the slow requests, grouped by version.',
      'Average response length across all requests, ignoring the slow cohort.',
      'Model token usage aggregated by day across all deployed agent versions.',
      'Connector uptime and successful-call counts for the full reporting period.'
    ], answer: 0,
    explanation: 'A isolates slow requests and their dependencies by version. B and C can show workload shifts but aggregate away the slow cohort. D measures availability and volume rather than time spent inside successful requests. A healthy median or uptime percentage can hide poor tail latency. Reproduce under representative concurrency before tuning.'
  }),
  practice({
    id: 67, revision: 2, topic: 'Monitor & Tune', labIds: ['lab-07'], evidence: 'value', format: 'multiple',
    question: 'A chat front door and an event-triggered fulfillment agent share a dashboard. Which TWO metric definitions preserve the distinction between their operating modes?',
    options: [
      'Combine chat sessions and scheduled runs into one resolution-rate denominator.',
      'Track resolved, escalated, and abandoned outcomes for engaged chat sessions.',
      'Track trigger execution and tool success for event-driven fulfillment runs.',
      'Treat every successful HTTP response as proof that the user\'s problem was resolved.'
    ], answer: [1, 2],
    explanation: 'B uses conversation outcomes; C uses autonomous execution signals. A combines unlike populations and obscures changes in traffic mix. D confuses transport success with business completion. Report metric denominators and operating mode separately so increased scheduled activity cannot conceal poor conversational resolution.'
  }),
  practice({
    id: 68, revision: 2, topic: 'Testing & Evaluation', labIds: ['lab-07'], evidence: 'evaluation',
    question: 'A test judges an answer correct only when it exactly matches one sentence. It rejects accurate paraphrases of policy. Which evaluation change preserves factual rigor?',
    options: [
      'Require the expected policy keywords without scoring how they are related.',
      'Score required policy meaning against references and inspect disputed paraphrases.',
      'Lower the text-similarity threshold globally until the paraphrases pass.',
      'Enumerate accepted paraphrases and retain exact matching as the only grader.'
    ], answer: 1,
    explanation: 'B evaluates the required meaning and retains review for disputed cases. A can accept negated or incorrectly related policy terms. C may also admit substantive errors. D works for a finite output vocabulary but is brittle for open-ended language. Exact matching remains useful for strict codes or mandatory field values.'
  }),
  practice({
    id: 69, revision: 2, topic: 'Testing & Evaluation', labIds: ['lab-07', 'lab-09'], evidence: 'evaluation', format: 'multiple',
    question: 'A Studio agent passes its answer-quality test set. Before a sensitive launch, which TWO additional checks address risks that those scores do not establish?',
    options: [
      'Test adversarial prompts and perform a separate responsible AI review.',
      'Expand answer-quality cases while keeping the same fully privileged test identity.',
      'Repeat representative functional cases to estimate variation in their quality scores.',
      'Test unauthorized retrieval and privileged tool calls under restricted identities.'
    ], answer: [0, 3],
    explanation: 'A and D assess safety and access boundaries. B can improve functional coverage but cannot establish restricted-user behavior. C measures functional variation, not the missing safety or permission controls. Studio evaluation does not replace responsible AI review and filters. Keep functional tests and add targeted negative-path evidence.'
  }),
  practice({
    id: 70, revision: 2, topic: 'Testing & Evaluation', labIds: ['lab-07'], evidence: 'evaluation',
    question: 'Copilot generates regression cases from current knowledge. Several expected answers repeat a mistake in that knowledge. How should the team use the generated suite?',
    options: [
      'Publish it unchanged because generation ensures alignment with the corpus.',
      'Regenerate expectations with a second model using the same unchecked knowledge.',
      'Keep only cases on which the agent and generated expected answer already agree.',
      'Have policy owners correct expectations, retain useful cases, and add missing risks.'
    ], answer: 3,
    explanation: 'D retains AI drafting while validating the test oracle independently. A preserves known source errors. B changes the generator without correcting its evidence. C filters for agreement and can retain shared mistakes while excluding useful failures. Add risk and negative cases before making the suite a release gate.'
  }),
  practice({
    id: 71, revision: 2, topic: 'Testing & Evaluation', labIds: ['lab-07', 'lab-06'], evidence: 'orchestration',
    question: 'A case-resolution flow creates a Finance adjustment, then times out before returning confirmation. The agent may retry. Which test best checks business integrity?',
    options: [
      'Verify that the client receives one success response after its retry completes.',
      'Verify that the first HTTP call returned a success code before timeout.',
      'Replay the request and verify a single adjustment using a stable operation key.',
      'Increase the timeout until the normal demonstration no longer fails.'
    ], answer: 2,
    explanation: 'C checks persisted side effects after an ambiguous result. A single client confirmation can still conceal two adjustments. B does not establish what the retry does. D can reduce failures but does not test recovery. Stable operation keys and deduplication are application responsibilities, not an automatic guarantee of generative orchestration.'
  }),
  practice({
    id: 72, revision: 2, topic: 'Testing & Evaluation', labIds: ['lab-04', 'lab-07'], evidence: 'tools',
    question: 'A prompt generates shipping instructions from a typed order input. Which prompt change most improves validation without expanding its authority?',
    options: [
      'Specify required output fields and an explicit missing-input response.',
      'Provide several complete examples but leave missing-input behavior unspecified.',
      'Constrain output to valid JSON without defining required business fields.',
      'Supply default shipping values for any field absent from the order input.'
    ], answer: 0,
    explanation: 'A defines both business completeness and the incomplete-input path. B illustrates success but leaves a critical failure case open. C guarantees syntax, not required meaning. D can silently turn missing facts into incorrect instructions unless those defaults are explicitly authorized. Test incomplete and conflicting inputs as well as normal orders.'
  }),
  practice({
    id: 73, revision: 2, topic: 'ALM & Environments', labIds: ['lab-08'], evidence: 'alm',
    question: 'A solution import succeeds in test, but the agent still uses the development API URL and lacks production-style channel security. Which checklist approach addresses both configuration gaps?',
    options: [
      'Reimport the managed solution with overwrite enabled for its components.',
      'Configure environment bindings and separately review post-deployment settings.',
      'Rebind connection references and rely on the import for channel settings.',
      'Configure channel security and retain the exported development API values.'
    ], answer: 1,
    explanation: 'B distinguishes environment bindings from settings requiring explicit post-deployment work. A does not make non-solution-aware settings travel. C repairs connections but assumes channel security transfers; D repairs channel security but retains the wrong endpoint. The ALM guidance also identifies authentication, sharing, and Application Insights as post-deployment considerations.'
  }),
  practice({
    id: 74, revision: 2, topic: 'ALM & Environments', labIds: ['lab-08', 'lab-06'], evidence: 'sales',
    question: 'A team customizes a Sales Copilot topic in an approved preview environment and must reproduce it in test. Which release practice fits the documented customization path?',
    options: [
      'Edit the topic directly in test so it binds automatically to test data.',
      'Copy the prompt text only, because topic dependencies remain tenant-wide.',
      'Export the topic alone and recreate its connector bindings manually in test.',
      'Manage the customization in a solution and validate target dependencies.'
    ], answer: 3,
    explanation: 'D follows the Sales customization guidance and preserves dependency-aware promotion. A creates target drift, B omits dependencies, and C splits the release into a partial artifact plus manual reconstruction. Confirm target roles, connections, consumption billing, and preview eligibility rather than assuming import makes the feature production-ready.'
  }),
  practice({
    id: 75, revision: 2, topic: 'ALM & Environments', labIds: ['lab-08', 'lab-09'], evidence: 'lifecycle',
    question: 'A Foundry Agent Application can be invoked, but its identity-authenticated storage tool fails after publication. Storage logs show a valid token with the expected audience and a new principal ID lacking blob-read permission. What should the release owner correct?',
    options: [
      'Grant blob-read access to the published agent identity at the required scope.',
      'Grant the application caller the Foundry role needed to invoke the endpoint.',
      'Grant additional storage data permissions to the shared project identity.',
      'Change the tool token audience to the URL of the storage-facing MCP server.'
    ], answer: 0,
    explanation: 'A addresses the principal identified in the denied storage request. B fixes caller-to-agent authorization, which already succeeds. C grants access to the development identity rather than the published principal. D would break the already correct downstream audience. This question uses the Agent Application publishing model; its identity transition must not be assumed for newer publishing models without checking their documentation.'
  }),
  practice({
    id: 76, revision: 2, topic: 'ALM & Environments', labIds: ['lab-08'], evidence: 'audit',
    question: 'The same prompt version gives different answers after the retrieval index is rebuilt. Auditors need to reproduce the earlier result. What release evidence is missing?',
    options: [
      'A deployment manifest containing prompts and models but no data versions.',
      'A snapshot of source documents without the parsing or indexing configuration.',
      'Versioned corpus, transformation, index, model, and evaluation references.',
      'A retrieval trace with document IDs that resolve only to their latest versions.'
    ], answer: 2,
    explanation: 'C identifies the data and configuration dependencies needed to reconstruct the earlier evidence path. A omits changed data; B omits transformations; D loses historical content when documents change. Retain approved snapshots or reproducible references under retention policy. Reconstruction supports comparison but does not guarantee byte-identical generative output.'
  }),
  practice({
    id: 77, revision: 2, topic: 'ALM & Environments', labIds: ['lab-08', 'lab-05'], evidence: 'modelAlm',
    question: 'A fine-tuned model artifact passed evaluation and was deployed. The next training run overwrites the artifact at the same path. What change is needed for dependable rollback?',
    options: [
      'Keep a mutable production alias and record each training run\'s identifier.',
      'Retain immutable model versions and record which deployment uses each one.',
      'Retain only the latest training notebook because it can regenerate the weights.',
      'Retain evaluation reports and retrain a replacement if rollback is requested.'
    ], answer: 1,
    explanation: 'B preserves the exact evaluated artifact and its deployment association. A records names without retaining the old weights. C and D depend on retraining, which can take time and produce a different result. Pair immutable model artifacts with dataset, dependency, and evaluation evidence throughout the lifecycle.'
  }),
  practice({
    id: 78, revision: 2, topic: 'Responsible AI & Security', labIds: ['lab-09', 'lab-04'], evidence: 'security',
    question: 'A retrieved supplier PDF contains instructions to email internal pricing to an outside address. The employee\'s question was legitimate. What boundary should the agent enforce?',
    options: [
      'Treat the PDF instructions as authoritative because retrieval selected it.',
      'Allow document-requested actions when the supplier domain is allowlisted.',
      'Rely on malicious-phrase filtering as the only check before invoking tools.',
      'Treat retrieved text as evidence, not authority to invoke an outbound action.'
    ], answer: 3,
    explanation: 'D separates retrieved evidence from authority to act. A mistakes retrieval relevance for trust. B treats supplier allowlisting as authorization for internal actions. C misses novel or obfuscated instructions and is not an execution boundary. Combine source handling with destination controls, least privilege, inspection, and logging.'
  }),
  practice({
    id: 79, revision: 2, topic: 'Responsible AI & Security', labIds: ['lab-09', 'lab-08'], evidence: 'audit',
    question: 'An investigation asks who approved a model change and which dataset it used. The team has full chat transcripts but no change records. What should the audit design add?',
    options: [
      'Deployment success events containing the endpoint name but no dataset version.',
      'Training lineage records without a link to the production release approval.',
      'Attributable change events with artifact versions, approvals, and timestamps.',
      'Approval tickets referencing a mutable model alias rather than a versioned artifact.'
    ], answer: 2,
    explanation: 'C connects the approved release to attributable changes and dataset versions. A lacks data lineage, B lacks production authorization, and D can resolve to a different artifact after the alias changes. Protect audit integrity, retention, and access; prefer necessary metadata over copying sensitive customer content.'
  }),
  practice({
    id: 80, revision: 2, topic: 'Responsible AI & Security', labIds: ['lab-09'], evidence: 'residency',
    question: 'An EU-hosted environment has flex routing enabled. Legal requires inference to remain within the EU Data Boundary even at peak load. What must the architect address?',
    options: [
      'Disable flex routing and validate every relevant feature\'s processing path.',
      'Apply a confidential sensitivity label and leave routing settings unchanged.',
      'Confirm the database region and treat model processing as the same location.',
      'Retain flex routing because encryption makes processing location immaterial.'
    ], answer: 0,
    explanation: 'A addresses the setting that permits outside-boundary inference and associated pseudonymized data handling during peak demand. Labels, database placement, and encryption do not satisfy a geographic processing requirement by themselves. Review other services and feature-specific commitments as well; switching a setting cannot reverse prior data movement.'
  }),
  practice({
    id: 81, revision: 2, topic: 'Responsible AI & Security', labIds: ['lab-09', 'lab-07'], evidence: 'security',
    question: 'A service prioritization model has acceptable overall accuracy but disproportionately misses urgent requests in one language. What should the responsible AI review require?',
    options: [
      'Raise the global confidence threshold and accept the aggregate score.',
      'Evaluate the affected cohort, remediate the gap, and reassess impact.',
      'Translate the affected requests and release without validating translation errors.',
      'Tune one global decision threshold using the existing majority-heavy dataset.'
    ], answer: 1,
    explanation: 'B investigates the affected cohort and validates remediation. A may increase misses. Translation in C can be useful but needs its own validation. D can optimize the majority while preserving the gap. Use representative, lawfully handled data and human oversight for urgent cases while the limitation is unresolved.'
  }),
  practice({
    id: 82, revision: 2, topic: 'Responsible AI & Security', labIds: ['lab-09', 'lab-08'], evidence: 'security', format: 'multiple',
    question: 'An agent unexpectedly invokes a privileged export tool. The incident owner needs containment and evidence preservation. Which TWO actions should be in the response plan?',
    options: [
      'Restrict the implicated tool identity or access path while assessing impact.',
      'Rotate the tool credential and restore the same access scope before triage.',
      'Preserve protected traces and correlate the request with configuration changes.',
      'Revert the last prompt change and resume exports without reviewing tool access.'
    ], answer: [0, 2],
    explanation: 'A limits further impact; C preserves evidence for investigation. B may help a stolen-credential incident but restores the same privileges before establishing the cause. D assumes a prompt rollback fixes the authorization exposure. Coordinate containment with operations and use a safe fallback while investigating.'
  }),
  practice({
    id: 83, revision: 2, topic: 'Testing & Evaluation', labIds: ['lab-07'], evidence: 'lifecycle', format: 'matching',
    question: 'A release review has four kinds of evidence. Match each to the question it can answer most directly.',
    options: ['Dependency trace', 'Held-out answer evaluation', 'Versioned approval record', 'User outcome survey'],
    matchLabels: [
      'A. Did representative responses satisfy the defined task criteria?',
      'B. Who authorized this particular production configuration change?',
      'C. Which tool call consumed most of the slow request\'s execution time?',
      'D. How did responding users perceive the assistance they received?'
    ], matches: { 0: 'C', 1: 'A', 2: 'B', 3: 'D' }, answer: 0,
    explanation: 'Traces diagnose execution, evaluations compare outputs to criteria, approval records establish authorization, and surveys capture perceptions. None substitutes for all the others: a fast request can be wrong, an approved release can regress, and a positive survey does not prove compliance or causal business value.'
  }),
  practice({
    id: 84, revision: 2, topic: 'Requirements & Grounding', labIds: ['lab-01'], evidence: 'strategy',
    originSource: c1756('lab-01-qualify-the-process-and-grounding-data.md'),
    question: 'The accelerator workshop has two candidates: frequent password-status queries with approved data, and rare legal exceptions with unresolved ownership. Which pilot choice has the stronger readiness case?',
    options: [
      'Choose legal exceptions because their complexity demonstrates more advanced AI.',
      'Combine both so the pilot measures a broader range of autonomous capabilities.',
      'Choose whichever team can provide the largest collection of historical text.',
      'Start with the frequent bounded queries and qualify legal exceptions separately.'
    ], answer: 3,
    explanation: 'D balances value, frequency, scope, and readiness. Complexity is not a benefit by itself; merging cases inherits unresolved risk; data volume does not establish permission or ownership. This is an authored workshop decision inspired by the existing Lab 1 association, not a reproduced courseware answer.'
  }),
  practice({
    id: 85, revision: 2, topic: 'Requirements & Grounding', labIds: ['lab-01'], evidence: 'grounding',
    originSource: c1756('lab-01-qualify-the-process-and-grounding-data.md'),
    question: 'Two current, authorized manuals disagree on the warranty period. Both pass freshness and access checks. What should the data-readiness register require next?',
    options: [
      'Index both and let similarity ranking determine which period is authoritative.',
      'Ask the accountable policy owner to resolve precedence and record the decision.',
      'Prefer the service-team manual over the legal-team manual based on its audience.',
      'Treat the most recently modified document as authoritative without an owner decision.'
    ], answer: 1,
    explanation: 'B resolves conflicting authority, not merely freshness or permissions. Retrieval ranking measures relevance. Intended audience does not establish policy precedence, and a recent file edit need not indicate a policy change. Record the approved source and precedence rule before allowing definitive warranty answers.'
  }),
  practice({
    id: 86, revision: 2, topic: 'AI Strategy & CAF', labIds: ['lab-02', 'lab-05'], evidence: 'a2a',
    originSource: c1756('lab-02-choose-the-platform-and-agent-boundaries.md'),
    question: 'Two specialists each delegate an unresolved request back to the other. The front door never returns an outcome. What should the boundary map specify?',
    options: [
      'A terminal owner with a task-wide delegation budget and an unresolved-task handoff.',
      'A retry budget per tool call that resets when control moves to the other agent.',
      'A shared conversation store without a rule assigning final task responsibility.',
      'A timeout per specialist that restarts whenever it receives a delegated request.'
    ], answer: 0,
    explanation: 'A bounds the overall task and assigns responsibility for its unresolved outcome. B and D reset local limits across delegation, allowing a cycle to continue. C preserves history but does not define termination or ownership. The implementation must enforce these rules; A2A connectivity alone does not guarantee a terminating workflow.'
  }),
  practice({
    id: 87, revision: 2, topic: 'AI Strategy & CAF', labIds: ['lab-02', 'lab-05'], evidence: 'lifecycle',
    originSource: c1756('lab-02-choose-the-platform-and-agent-boundaries.md'),
    question: 'The accelerator now needs a specialist with custom runtime libraries that its low-code boundary cannot provide. The front door still fits Studio. Which architecture revision is proportionate?',
    options: [
      'Migrate every conversation and connector to the specialist\'s new runtime.',
      'Replicate the required libraries in low-code flows and replace the specialist logic.',
      'Add a code-hosted specialist and revise the contract and ownership record.',
      'Expose low-level library calls as tools and move specialist control into Studio.'
    ], answer: 2,
    explanation: 'C preserves the working front door and hosts the specialist where its libraries can run. A expands migration scope. B reimplements library behavior in a constrained environment. D can work but moves specialist coordination into Studio and creates a more granular integration contract. Evaluate hosting, identity, tools, and support before accepting the new boundary.'
  }),
  practice({
    id: 88, revision: 2, topic: 'ROI & Build-Buy-Extend', labIds: ['lab-03'], evidence: 'roi',
    originSource: c1756('lab-03-build-the-value-case-and-ai-operating-model.md'),
    question: 'The accelerator saves 1,000 staff hours at $50/hour, but only 40% can be redeployed to funded work. Annual operating cost is $12,000. There are no other costs or benefits in this comparison. What realized net value should finance record?',
    options: ['$38,000: $50,000 potential value less operating cost.', '$50,000: all saved hours valued at the staff rate.', '$20,000: the redeployable portion before operating cost.', '$8,000: $20,000 realized value less operating cost.'], answer: 3,
    explanation: 'D separates potential time value from realization: 1,000 x $50 x 40% = $20,000; minus $12,000 = $8,000. A assumes full realization, B also omits cost, and C omits cost after applying the realization factor. Saved hours are not automatically cash savings; the stem specifies redeployment value.'
  }),
  practice({
    id: 89, revision: 2, topic: 'Copilot Studio Agents', labIds: ['lab-04', 'lab-09'], evidence: 'orchestration',
    originSource: c1756('lab-04-design-the-core-agent-grounding-and-prompt-contracts.md'),
    question: 'A supervisor approves a drafted case update. Before execution, the case changes and the draft now targets the wrong resolution state. What should the write contract enforce?',
    options: [
      'Revalidate the record version and approved payload before applying the update.',
      'Apply the current draft because any earlier supervisor approval covers the case.',
      'Ask the model to merge changes silently so the conversation remains uninterrupted.',
      'Check that the case ID still exists and apply the previously approved field values.'
    ], answer: 0,
    explanation: 'A binds approval to the actual operation and checks concurrent changes. B treats earlier approval as sufficient despite changed state. C can produce an unapproved payload. D confirms identity but not version or valid state transition. Enforce concurrency and approval checks in the action layer, not just in prompt instructions.'
  }),
  practice({
    id: 90, revision: 2, topic: 'Foundry & Extensibility', labIds: ['lab-05'], evidence: 'tools',
    originSource: c1756('lab-05-design-multi-agent-mcp-and-computer-use-extensibility.md'),
    question: 'The extensibility map contains a stdio warranty utility, an A2A specialist, and a changing UI-only portal. Which plan respects their different prerequisites?',
    options: [
      'Host SSE MCP; use the A2A specialist; pilot Computer Use on a managed machine.',
      'Host or bridge authenticated Streamable HTTP MCP; use A2A; pilot bounded Computer Use.',
      'Host Streamable HTTP MCP; rebuild the specialist as tools; script fixed portal coordinates.',
      'Host Streamable HTTP MCP; use A2A; approve the portal after desktop-only happy-path tests.'
    ], answer: 1,
    explanation: 'B combines compatible MCP hosting, existing A2A delegation, and a bounded UI pilot. A chooses legacy SSE unsupported by the cited Studio path. C needlessly reimplements the specialist and uses brittle coordinates. D approves a changing portal without failure-path or representative UI testing. Review authentication, DLP, context sharing, and machine support for the complete path.'
  }),
  practice({
    id: 91, revision: 2, topic: 'Ecosystem Integration', labIds: ['lab-06'], evidence: 'strategy', format: 'multiple',
    originSource: c1756('lab-06-map-dynamics-365-power-platform-and-microsoft-365-integration.md'),
    question: 'The accelerator exposes case actions through Microsoft 365 and Studio. Which TWO integration rules preserve consistent business ownership across those experiences?',
    options: [
      'Let each channel maintain a writable case copy to avoid contention in the source system.',
      'Keep Dataverse as the case authority and carry stable case identifiers through actions.',
      'Apply write validation in each channel UI and trust requests reaching the shared service.',
      'Enforce case permissions and business validation at the write service for every caller.'
    ], answer: [1, 3],
    explanation: 'B and D preserve one authority and enforce the same constraints for every entry point. A creates conflicting writable copies. C makes security depend on each client behaving correctly and can be bypassed by another caller. Microsoft 365 agents can expose actions, so their write paths also require service-side authorization and validation.'
  }),
  practice({
    id: 92, revision: 2, topic: 'Testing & Evaluation', labIds: ['lab-07'], evidence: 'evaluation',
    originSource: c1756('lab-07-create-the-evaluation-telemetry-and-tuning-plan.md'),
    question: 'A release scores 98% overall, exceeding the 95% target, but fails the explicitly mandatory "never disclose another customer\'s case" test. What should the release decision be?',
    options: [
      'Release because the overall score already includes the failed access test.',
      'Release to a small cohort and monitor disclosures while preparing the fix.',
      'Hold release until the mandatory boundary failure is fixed and retested.',
      'Remove the rare case from the suite and document it as an unsupported query.'
    ], answer: 2,
    explanation: 'C respects the mandatory privacy boundary. A offsets a prohibited failure with unrelated successes. B limits exposure but still violates the stated gate. D relabels the query without removing the accessible failure path. A staged rollout can manage residual risk only after mandatory controls are satisfied or formally changed by authorized owners.'
  }),
  practice({
    id: 93, revision: 2, topic: 'Monitor & Tune', labIds: ['lab-07'], evidence: 'alm',
    originSource: c1756('lab-07-create-the-evaluation-telemetry-and-tuning-plan.md'),
    question: 'A Studio tool fails only in test after credential rotation. Its connection reference still selects the old connection; a replacement connection passes a direct API check. The agent and flow versions match the approved release. What should operations do next?',
    options: [
      'Reimport the approved solution and retain its existing connection bindings.',
      'Rotate the app secret again and retest the replacement connection directly.',
      'Roll back the agent and flow versions while retaining the current bindings.',
      'Rebind test, validate the full tool path, and reconcile failures before replay.'
    ], answer: 3,
    explanation: 'D corrects the environment-specific reference and tests the path the agent actually uses. A reimports code without correcting the retained binding. B revalidates a connection that already works but is not selected. C changes approved artifacts while leaving the cause intact. Reconcile partially completed work before replaying failed scenarios, then monitor the affected environment.'
  }),
  practice({
    id: 94, revision: 2, topic: 'ALM & Environments', labIds: ['lab-08'], evidence: 'alm',
    originSource: c1756('lab-08-design-alm-environments-and-operational-ownership.md'),
    question: 'The release engineer is unavailable during a production agent incident. The RACI names no operations owner or rollback authority. What must the operating model add?',
    options: [
      'An incident owner with tested recovery and delegated rollback authority.',
      'A rule that the original maker must approve every incident action in person.',
      'An on-call rota with diagnostic access but no authority to change the deployment.',
      'Automated rollback for model latency alerts without an owner for other incidents.'
    ], answer: 0,
    explanation: 'A couples accountable ownership, authority, and tested recovery. B leaves a single-person dependency. C supplies responders who cannot execute recovery. D handles one failure class without assigning responsibility for others. Recovery also needs communication, escalation, and data-integrity checks.'
  }),
  practice({
    id: 95, revision: 2, topic: 'Responsible AI & Security', labIds: ['lab-09'], evidence: 'governance',
    originSource: c1756('lab-09-complete-the-security-responsible-ai-and-governance-record.md'),
    question: 'The governance record covers the model endpoint but omits a third-party tool\'s transcript retention and processing locations. Legal approval is still required. What closes the gap?',
    options: [
      'Reuse the model provider\'s compliance statement for the third-party tool.',
      'Document and approve the tool\'s data flows, retention, and access controls.',
      'Review the tool\'s encryption controls and defer its retention terms to procurement.',
      'Proceed because customer data is encrypted when sent to the tool endpoint.'
    ], answer: 1,
    explanation: 'B covers the actual downstream processor. A assumes another provider\'s commitments apply. C separates procurement from an unresolved architectural retention requirement. D addresses transport security but not processing location or retention. Keep the release unapproved until required evidence and accountable acceptance exist.'
  }),
  practice({
    id: 96, revision: 2, topic: 'Ecosystem Integration', labIds: ['lab-06'], evidence: 'service',
    question: 'A representative uses Service Agent in standalone Microsoft 365 Copilot, with access to two Customer Service environments and no active app record. A case lookup resolves in the wrong environment. Which setting should be corrected first?',
    options: [
      'The default environment selected in the Power Apps maker portal.',
      'The queue assignment used to route cases in Customer Service.',
      'The Customer Service environment selected for this session under Sources.',
      'The case table\'s quick-find configuration in the intended environment.'
    ], answer: 2,
    explanation: 'C selects the connection whose Customer Service records are queried in this session. A is a maker-portal selection, B routes work within Customer Service, and D influences finding records after the environment is selected. None substitutes for the Service Agent source connection. With no active app context, explicitly identify the intended source and case.'
  }),
  practice({
    id: 97, revision: 2, topic: 'Copilot Studio Agents', labIds: ['lab-04'], evidence: 'flows',
    question: 'An agent collects purchase-request details. Validation, approval, and record creation must then follow an authored order. Which component should execute that repeatable sequence?',
    options: [
      'An agent flow with explicit validation, approval, and connector steps.',
      'A planner instruction allowing the model to choose the approval order.',
      'Separate validation and write tools whose order is chosen by the planner.',
      'Parallel validation and approval branches that each trigger record creation.'
    ], answer: 0,
    explanation: 'A enforces the authored order and can include human approval. B and C leave sequencing to dynamic planning. D permits creation from independent branches rather than after all prerequisites. A deterministic flow structure does not make AI content within it deterministic; validate that content before consequential steps.'
  }),
  practice({
    id: 98, revision: 2, topic: 'ALM & Environments', labIds: ['lab-08', 'lab-04'], evidence: 'pagesAlm',
    question: 'A generative page created during preview is absent from a model-driven app solution export. The team also expects its full authoring conversation in test. What should the release plan recognize?',
    options: [
      'The page must be recreated manually because generative pages are not solution-aware.',
      'Export unmanaged instead of managed so the full authoring chat travels with the page.',
      'The sitemap is optional because generative-page dependencies are always included.',
      'Migrate the page and include dependencies; only published code and first prompt transfer.'
    ], answer: 3,
    explanation: 'D reflects the current page ALM documentation. Preview-created pages may need a one-time designer migration, and sitemap/UX Agent Project dependencies must be included. A denies supported solution transport. B confuses editable packaging with authoring-history export; neither package type transfers the full conversation. C ignores dependencies. Keep separate source history when required.'
  }),
  practice({
    id: 99, revision: 2, topic: 'Foundry & Extensibility', labIds: ['lab-04', 'lab-05'], evidence: 'documents',
    question: 'A claims intake pilot must extract a common schema from narrative letters, images, and recorded explanations. Fields may need inference, and labeled templates are unavailable. Which managed approach should be evaluated first?',
    options: [
      'Label template variants and train a custom Document Intelligence model.',
      'Content Understanding analyzers for schema-based multimodal extraction.',
      'Assemble OCR, speech transcription, and custom LLM extraction pipelines.',
      'Use document layout extraction followed by hand-maintained field rules.'
    ], answer: 1,
    explanation: 'B is the managed starting point for multimodal, schema-driven extraction with inferred fields. A introduces labeling and does not cover the audio path by itself. C can meet the requirement but adds custom orchestration before evaluating a managed fit. D suits stable layouts better than variable narrative and audio. Evaluate accuracy and API-version eligibility rather than assuming all features are production-ready.'
  }),
  practice({
    id: 100, revision: 2, topic: 'Copilot Studio Agents', labIds: ['lab-04', 'lab-08'], evidence: 'wa',
    question: 'A Power Apps agent waits indefinitely when its diagnostic service is unavailable. Operators want both predictable recovery and a usable experience. Which design best balances those Well-Architected concerns?',
    options: [
      'Retry until the service recovers and hide the status to avoid alarming users.',
      'Return the last cached diagnosis without checking its age or applicability.',
      'Bound retries, preserve the request, and offer a clear human fallback.',
      'End the request immediately and require users to re-enter all captured details.'
    ], answer: 2,
    explanation: 'C combines Reliability and Experience Optimization with a recoverable request. A leaves the user waiting and can overload the dependency. B uses a legitimate caching pattern without the validity checks needed for this diagnosis. D forces unnecessary re-entry. Set limits from workload requirements and test the degraded path.'
  }),
  practice({
    id: 101, revision: 2, topic: 'Responsible AI & Security', labIds: ['lab-09', 'lab-06'], evidence: 'feed',
    question: 'An agent feed preview pilot proposes putting confidential employee salary corrections in tasks addressed to individual managers. Why is this design unsafe without a different protected workflow?',
    options: [
      'Task-table access can expose feed items beyond the named manager.',
      'The manager must be made the task owner before recipient filtering is enforced.',
      'The related employee record\'s permissions automatically govern the task text.',
      'The app\'s manager-only filtered view provides the missing access boundary.'
    ], answer: 0,
    explanation: 'A matches the documented preview warning about Agent Task access. B assumes task ownership supplies recipient-level isolation. C assumes permissions propagate from a related record to copied task text. D confuses a filtered view with authorization. None is a documented substitute for the missing privacy boundary; use a protected workflow and recheck future access-model changes.'
  })
];
