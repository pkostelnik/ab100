const labSlugs = [
  'lab-01-qualify-the-process-and-grounding-data.md',
  'lab-02-choose-the-platform-and-agent-boundaries.md',
  'lab-03-build-the-value-case-and-ai-operating-model.md',
  'lab-04-design-the-core-agent-grounding-and-prompt-contracts.md',
  'lab-05-design-multi-agent-mcp-and-computer-use-extensibility.md',
  'lab-06-map-dynamics-365-power-platform-and-microsoft-365-integration.md',
  'lab-07-create-the-evaluation-telemetry-and-tuning-plan.md',
  'lab-08-design-alm-environments-and-operational-ownership.md',
  'lab-09-complete-the-security-responsible-ai-and-governance-record.md'
];
const labs = [
  ['Qualify the process and grounding data', 'For the Contoso Service Resolution Accelerator, decide which service process is in scope and whether the available records are fit to ground answers.', 'Use-case record, data-readiness register', ['process', 'grounding', 'data readiness'], 'plan'],
  ['Choose the platform and agent boundaries', 'Select the Microsoft platform path and draw the agent boundary so the Contoso Service Resolution Accelerator stays inside a clear operating envelope.', 'Platform decision record, agent-boundary map', ['platform', 'agent boundary'], 'plan'],
  ['Build the value case and AI operating model', 'Build the ROI story and operating model that justify funding and running the Contoso Service Resolution Accelerator.', 'ROI model, AI strategy charter', ['ROI', 'operating model'], 'plan'],
  ['Design the core agent, grounding, and prompt contracts', 'Specify the core agent, grounding sources, and prompt contracts the Contoso Service Resolution Accelerator will use in production conversations.', 'Agent-design record, prompt-library contract', ['agent design', 'prompts', 'grounding'], 'design'],
  ['Design multi-agent, MCP, and Computer Use extensibility', 'Plan how specialist agents, MCP tools, and Computer Use extend the Contoso Service Resolution Accelerator without blurring ownership.', 'Extensibility map', ['multi-agent', 'MCP', 'Computer Use'], 'design'],
  ['Map Dynamics 365, Power Platform, and Microsoft 365 integration', 'Map Dynamics 365, Power Platform, and Microsoft 365 touchpoints and the data contracts the Contoso Service Resolution Accelerator depends on.', 'Integration map, data contracts', ['Dynamics 365', 'Power Platform', 'Microsoft 365'], 'design'],
  ['Create the evaluation, telemetry, and tuning plan', 'Define how the Contoso Service Resolution Accelerator will be evaluated, observed, and tuned after first release.', 'Evaluation plan, telemetry scorecard', ['evaluation', 'telemetry'], 'deploy'],
  ['Design ALM, environments, and operational ownership', 'Design environments, ALM movement, and who owns day-two operations for the Contoso Service Resolution Accelerator.', 'ALM record, RACI', ['ALM', 'RACI'], 'deploy'],
  ['Complete the security, Responsible AI, and governance record', 'Close the security, Responsible AI, and governance record so the Contoso Service Resolution Accelerator can be approved to run.', 'Security/governance record, final ADR', ['security', 'Responsible AI', 'governance'], 'deploy']
].map((item, index) => ({
  id: `lab-${String(index + 1).padStart(2, '0')}`,
  number: index + 1,
  title: item[0],
  summary: item[1],
  artifacts: item[2].split(', '),
  concepts: item[3],
  domain: item[4],
  sourceUrl: `https://github.com/tertiarycourses/C1756-AB-100-Microsoft-Certified-Agentic-AI-Business-Solutions-Architect/blob/main/labs/${labSlugs[index]}`,
  sourceType: 'Tertiary Courses C1756 Courseware',
  verificationStatus: 'Courseware-derived; verify against Microsoft Learn',
  checklist: [
    `Read the lab brief: ${item[0]}`,
    'Make the design decision for this stage',
    'Record the named evidence',
    'Save the checkpoint'
  ]
}));
