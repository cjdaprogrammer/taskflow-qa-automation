# TaskFlow QA Automation

[![TaskFlow QA Automation](https://github.com/cjdaprogrammer/taskflow-qa-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/cjdaprogrammer/taskflow-qa-automation/actions/workflows/playwright.yml)

An end-to-end QA automation portfolio project using **Playwright, TypeScript, and GitHub Actions** to validate UI workflows, REST API behavior, and AI response quality for UPEX Dojo and a locally hosted AI model.

## Project Overview

This project demonstrates practical software quality assurance skills through automated browser testing, API testing, cross-browser validation, AI quality evaluation, and continuous integration.

### Key Features

- Cross-browser UI automation with Chromium, Firefox, and WebKit
- REST API testing using Playwright API testing capabilities
- AI response quality, reliability, and security testing
- Local AI model testing using Ollama and Llama 3.2
- TypeScript static type checking
- Reusable test helpers and shared utilities
- Automated UI and API test execution through GitHub Actions
- HTML test reports and failure artifacts
- Secure test credentials managed through environment variables and GitHub repository secrets
- Documented test plans, test cases, and execution reports

## Technology Stack

| Technology | Purpose |
|---|---|
| Playwright | Browser, API, and AI test automation |
| TypeScript | Type-safe test development |
| Node.js | JavaScript runtime |
| npm | Dependency management |
| GitHub Actions | Continuous integration |
| Ollama | Local AI model runtime |
| Llama 3.2 (3B) | AI model under test |
| Playwright HTML Reporter | Test execution reports |

## Test Coverage

The project contains three separate testing suites.

### UI Tests

The current verified baseline is **27 UI tests**.

Test scenarios include:

- Login and dashboard access
- Dashboard task-management controls
- Opening the task creation form
- Creating a task with valid data
- Rejecting an empty task title
- Canceling task creation
- Deleting a task

UI tests are configured to run against Chromium, Firefox, and WebKit.

### API Tests

The current verified baseline is **11 API tests**.

Test scenarios include:

- Authenticated profile access
- Task-list response structure
- Creating and retrieving tasks
- Updating task details
- Changing task status
- Deleting a task created during the test
- Rejecting unauthenticated requests
- Validating invalid task titles and statuses
- Handling unknown task IDs

### AI Quality, Reliability, and Security Tests

The project includes a separate AI testing suite containing **10 automated checks** using Playwright and a locally hosted Ollama model (`llama3.2:3b`).

| Test ID | Test Scenario |
|---|---|
| AI-001 | Validate relevance of software testing explanations |
| AI-002 | Validate requested bullet-point formatting |
| AI-003 | Validate explanations of QA concepts |
| AI-004 | Check response consistency across repeated prompts |
| AI-005 | Check acknowledgment of unknown fictional information |
| AI-006a | Reject empty prompts |
| AI-006b | Reject prompts exceeding the maximum length |
| AI-006c | Accept valid prompts |
| AI-SEC-001 | Check protection of a seeded dummy secret |
| AI-SEC-002 | Check resistance to a direct instruction override |

These tests demonstrate basic AI response-quality evaluation, input validation, consistency checks, and selected prompt-injection/security scenarios.

**Note:** The AI tests run locally against Ollama. They are separate from the UI/API GitHub Actions workflows. Passing these scenarios does not establish overall model accuracy or comprehensive AI security.

## Prerequisites

Install the following before running the project:

- Node.js (LTS recommended)
- npm
- Git

You also need authorized UPEX Dojo test-account credentials for tests that require authentication.

For the AI testing suite, you additionally need:

- Ollama
- Llama 3.2 (3B) model

## Installation

Clone the repository:

```bash
git clone https://github.com/cjdaprogrammer/taskflow-qa-automation.git
cd taskflow-qa-automation
```

Install dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install chromium firefox webkit
```

On Linux CI environments, install the required browser system dependencies as well.

## Configuration

The tests use environment variables for authenticated test scenarios.

Configure the following variables in your local shell or test-runner environment:

```text
UPEX_TEST_EMAIL=your_test_email
UPEX_TEST_PASSWORD=your_test_password
```

Replace the example values with your authorized test-account credentials.

**Security:** Never commit passwords, access tokens, or real credentials to GitHub. A local `.env` file works only if the project is configured to load it. Do not assume that creating the file alone makes its values available to the tests.

For GitHub Actions, configure `UPEX_TEST_EMAIL` and `UPEX_TEST_PASSWORD` under:

**Repository → Settings → Secrets and variables → Actions → Repository secrets**

The workflow should receive these values through GitHub Actions secrets rather than hardcoded credentials.

## Running Tests

### TypeScript type checking

```bash
npm run typecheck
```

### All UI tests

```bash
npm run test:ui
```

### Chromium tests

```bash
npm run test:chromium
```

### Firefox tests

```bash
npm run test:firefox
```

### WebKit tests

```bash
npm run test:webkit
```

### API tests

```bash
npm run test:api
```

### AI tests (Local Ollama)

The AI test suite requires Ollama and the `llama3.2:3b` model.

Download the model:

```bash
ollama pull llama3.2:3b
```

Make sure the Ollama service is running and accessible at:

```text
http://127.0.0.1:11434
```

Run the AI test suite:

```bash
npm run test:ai
```

Open the AI HTML report:

```bash
npx playwright show-report playwright-report-ai
```

The AI suite uses its own configuration file:

```text
playwright.ai.config.ts
```

### Run the complete UI and API suite

```bash
npm run test:all
```

### Open the HTML report

```bash
npm run test:report
```

On Windows PowerShell, use `npm.cmd` and `npx.cmd` if the PowerShell execution policy prevents the regular commands from running.

## Continuous Integration

GitHub Actions automatically validates the UI and API portions of the project when code is pushed to `main` or `master`, when a pull request targets those branches, or when the workflow is started manually.

The workflow:

1. Checks out the repository.
2. Sets up Node.js.
3. Installs project dependencies.
4. Installs Playwright browsers.
5. Checks TypeScript types.
6. Runs UI tests.
7. Runs API tests.
8. Uploads UI and API HTML reports as workflow artifacts.

Repository secrets must be configured for tests that require authentication.

**AI testing is currently executed separately on the local machine using Ollama.** It is not included in the existing GitHub Actions workflow.

Check the [GitHub Actions workflow](https://github.com/cjdaprogrammer/taskflow-qa-automation/actions/workflows/playwright.yml) for the latest UI/API execution results.

## Reports and Debugging

The project uses Playwright's HTML reporter to make test results easier to inspect.

Depending on the test configuration, failed tests can produce diagnostic artifacts such as screenshots, videos, and traces.

To open a trace locally:

```bash
npx playwright show-trace path/to/trace.zip
```

Replace `path/to/trace.zip` with the actual path to a generated trace file.

CI reports are available in the **Artifacts** section of the relevant GitHub Actions run, provided that artifact creation and upload succeed.

The AI test suite generates its own HTML report in:

```text
playwright-report-ai/
```

Generated reports are excluded from Git tracking.

## Test Documentation

The repository includes QA documentation to support test planning and execution:

- [`docs/TEST-PLAN.md`](docs/TEST-PLAN.md) — UI and API test objectives, scope, approach, and planning
- [`docs/TEST-CASES.md`](docs/TEST-CASES.md) — documented UI and API test scenarios
- [`AI_TEST_PLAN.md`](AI_TEST_PLAN.md) — AI test objectives, scope, scenarios, and approach
- [`AI_TEST_REPORT.md`](AI_TEST_REPORT.md) — AI test execution results and observations

## Project Structure

```text
taskflow-qa-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── docs/
│   ├── TEST-PLAN.md
│   └── TEST-CASES.md
├── tests/
│   ├── ui/
│   ├── api/
│   └── ai/
│       ├── ai-quality.spec.ts
│       ├── ai-reliability.spec.ts
│       ├── ai-security.spec.ts
│       └── ai-test-helper.ts
├── AI_TEST_PLAN.md
├── AI_TEST_REPORT.md
├── playwright.config.ts
├── playwright.api.config.ts
├── playwright.ai.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── .gitignore
└── README.md
```

This is a simplified overview of the main project files. Refer to the repository for the complete structure and current configuration.

## Skills Demonstrated

- Test planning and test-case design
- UI functional and regression testing
- REST API validation
- Cross-browser testing
- TypeScript test automation
- AI response-quality evaluation
- Basic AI reliability and security testing
- Input validation and negative testing
- Assertions and failure diagnostics
- Environment-based test configuration
- CI workflow configuration
- Test reporting and defect investigation
- Version control with Git and GitHub

## Future Improvements

- Expand negative, boundary-value, and edge-case scenarios.
- Improve test-data isolation and cleanup.
- Add sample defect reports and sanitized test-report evidence.
- Expand AI evaluation with semantic similarity, hallucination detection, and broader prompt-injection scenarios.
- Explore accessibility testing.
- Continue improving CI reliability and test diagnostics.

## Repository

[View TaskFlow QA Automation on GitHub](https://github.com/cjdaprogrammer/taskflow-qa-automation)

---

*This is a QA automation portfolio project for learning and demonstration. Test results depend on the availability and behavior of the target application and the configured test environment.*