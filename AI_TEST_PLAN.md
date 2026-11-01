\# AI Testing Test Plan



\## 1. Project Overview



This project evaluates the response quality, reliability, and selected

security behaviors of a locally hosted Large Language Model (LLM).



The test automation uses Playwright with TypeScript and communicates

with Ollama through its local REST API.



\## 2. Objectives



\- Evaluate AI response relevance.

\- Verify compliance with requested output formats.

\- Check consistency across repeated prompts.

\- Evaluate responses to questions involving unknown information.

\- Validate prompt input boundaries.

\- Test selected prompt-injection and secret-disclosure scenarios.



\## 3. Scope



\### In Scope



\- AI response quality testing.

\- Response consistency testing.

\- Unknown-information handling.

\- Prompt input validation.

\- Selected AI security scenarios.

\- Automated test execution and HTML reporting.



\### Out of Scope



\- Comprehensive model security certification.

\- Testing every possible prompt-injection technique.

\- Independent verification of all generated facts.

\- Production-scale load and stress testing.

\- Evaluation of external hosted AI services.



\## 4. Test Environment



| Component | Configuration |

|---|---|

| Operating System | Windows |

| Automation Framework | Playwright |

| Programming Language | TypeScript |

| AI Runtime | Ollama |

| AI Model | llama3.2:3b |

| Local API | http://127.0.0.1:11434 |

| Test Configuration | playwright.ai.config.ts |

| Test Directory | tests/ai |



\## 5. Test Cases



| Test ID | Description |

|---|---|

| AI-001 | Verify relevant software QA explanations |

| AI-002 | Verify requested three-bullet formatting |

| AI-003 | Verify explanation of functional and performance testing |

| AI-004 | Evaluate consistency across repeated prompts |

| AI-005 | Evaluate acknowledgment of unknown fictional information |

| AI-006a | Reject empty prompts |

| AI-006b | Reject prompts exceeding 4,000 characters |

| AI-006c | Accept valid prompts within the length limit |

| AI-SEC-001 | Verify protection of a seeded dummy secret |

| AI-SEC-002 | Evaluate resistance to a direct instruction override |



\## 6. Entry Criteria



\- Ollama is installed and available.

\- The configured model is downloaded.

\- The local Ollama API is accessible.

\- Node.js dependencies are installed.

\- Playwright AI configuration is available.



\## 7. Exit Criteria



\- All planned tests have been executed.

\- Test results have been reviewed.

\- Failures and limitations are documented.

\- TypeScript type checking completes successfully.



\## 8. Risks and Limitations



AI-generated responses can vary between executions.

Keyword and format assertions do not establish factual correctness.

Passing selected security scenarios does not prove comprehensive

resistance to prompt injection or data disclosure.



Results apply to the tested model, configuration, prompts, and runtime.

