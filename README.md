\# TaskFlow QA Automation



\[!\[TaskFlow QA Automation](https://github.com/cjdaprogrammer/taskflow-qa-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/cjdaprogrammer/taskflow-qa-automation/actions/workflows/playwright.yml)



An end-to-end QA automation portfolio project using \*\*Playwright, TypeScript, and GitHub Actions\*\* to validate UI workflows and REST API behavior for UPEX Dojo.



\## Project Overview



This project demonstrates practical software quality assurance skills through automated browser testing, API testing, cross-browser validation, and continuous integration.



\### Key Features



\- Cross-browser UI automation with Chromium, Firefox, and WebKit

\- REST API testing with Playwright's API testing capabilities

\- TypeScript static type checking

\- Reusable login helper and shared test utilities

\- Automated test execution through GitHub Actions

\- HTML test reports and failure artifacts

\- Secure test credentials managed through environment variables and GitHub repository secrets



\## Technology Stack



| Technology | Purpose |

|---|---|

| Playwright | Browser and API automation |

| TypeScript | Type-safe test development |

| Node.js | JavaScript runtime |

| npm | Dependency management |

| GitHub Actions | Continuous integration |

| Playwright HTML Reporter | Test execution reports |



\## Test Coverage



The current local baseline includes \*\*27 UI tests and 11 API tests\*\*.



\### UI Tests



\- Login and dashboard access

\- Dashboard task-management controls

\- Opening the task creation form

\- Creating a task with valid data

\- Rejecting an empty task title

\- Canceling task creation

\- Deleting a task



UI tests are configured to run against Chromium, Firefox, and WebKit.



\### API Tests



\- Authenticated profile access

\- Task-list response structure

\- Creating and retrieving tasks

\- Updating task details

\- Changing task status

\- Deleting a task created during the test

\- Rejecting unauthenticated requests

\- Validating invalid task titles and statuses

\- Handling unknown task IDs



\## Prerequisites



Install the following before running the project:



\- Node.js (LTS recommended)

\- npm

\- Git



You also need authorized UPEX Dojo test-account credentials for tests that require authentication.



\## Installation



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



\## Configuration



Create a local `.env` file if your project uses dotenv to load environment variables. Otherwise, configure these variables in your shell or test runner environment.



```dotenv

UPEX\_TEST\_EMAIL=your\_test\_email

UPEX\_TEST\_PASSWORD=your\_test\_password

```



Replace the example values with your authorized test-account credentials.



\*\*Security:\*\* Never commit `.env` files, passwords, access tokens, or other secrets to GitHub. The repository's GitHub Actions workflow reads `UPEX\_TEST\_EMAIL` and `UPEX\_TEST\_PASSWORD` from repository secrets.



\## Running Tests



\### TypeScript type checking



```bash

npm run typecheck

```



\### All UI tests



```bash

npm run test:ui

```



\### Chromium tests



```bash

npm run test:chromium

```



\### Firefox tests



```bash

npm run test:firefox

```



\### WebKit tests



```bash

npm run test:webkit

```



\### API tests



```bash

npm run test:api

```



\### Run the complete suite



```bash

npm run test:all

```



\### Open the HTML report



```bash

npm run test:report

```



On Windows PowerShell, use `npm.cmd` and `npx.cmd` if the PowerShell execution policy prevents the regular commands from running.



\## Continuous Integration



GitHub Actions automatically validates the project when code is pushed to `main` or `master`, when a pull request targets those branches, or when the workflow is started manually.



The workflow:



1\. Checks out the repository.

2\. Sets up Node.js.

3\. Installs project dependencies.

4\. Installs Playwright browsers.

5\. Checks TypeScript.

6\. Runs UI tests.

7\. Runs API tests.

8\. Uploads UI and API HTML reports as workflow artifacts.



Repository secrets must be configured for tests that require authentication.



\## Reports and Debugging



The project uses Playwright's HTML reporter to make test results easier to inspect.



When a test fails, Playwright can also capture diagnostic artifacts such as screenshots, videos, and traces, depending on the project configuration.



To open a trace locally:



```bash

npx playwright show-trace path/to/trace.zip

```



CI reports are available in the \*\*Artifacts\*\* section of the relevant GitHub Actions run, subject to successful artifact creation and upload.



\## Project Structure



```text

taskflow-qa-automation/

├── .github/

│   └── workflows/

│       └── playwright.yml

├── tests/

│   ├── ui/

│   └── api/

├── playwright.config.ts

├── playwright.api.config.ts

├── package.json

├── package-lock.json

├── tsconfig.json

├── .gitignore

└── README.md

```



The structure above illustrates the intended organization. Refer to the repository for the actual files and configuration.



\## Skills Demonstrated



\- Test planning and test-case design

\- UI functional and regression testing

\- REST API validation

\- Cross-browser testing

\- TypeScript test automation

\- Assertions and failure diagnostics

\- Environment-based test configuration

\- CI workflow configuration

\- Test reporting and defect investigation



\## Future Improvements



\- Expand negative and boundary-value test scenarios.

\- Improve test data isolation and cleanup.

\- Add documented test cases and sample defect reports.

\- Review accessibility and additional security-related test scenarios.

\- Continue improving CI reliability and test diagnostics.



\## Repository



\[View TaskFlow QA Automation on GitHub](https://github.com/cjdaprogrammer/taskflow-qa-automation)



\---



\*This is a QA automation portfolio project for learning and demonstration. Test results depend on the availability and behavior of the target application and the configured test environment.\*

