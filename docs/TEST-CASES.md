# TaskFlow QA Automation - Test Cases

## 1. Purpose

This document catalogs the functional UI and REST API scenarios covered by the TaskFlow QA Automation project.

**Application Under Test:** UPEX Dojo  

**Framework:** Playwright with TypeScript  

**Execution:** Local environment and GitHub Actions

### Status Definitions

- **Automated:** An automation test is implemented for the scenario.

- **Pending verification:** The scenario needs to be checked against the current test files and results.

- **Not run:** No execution result has been recorded for the current test cycle.

> The catalog describes intended coverage. Confirm each case against the current implementation before treating it as verified. Record actual results from test reports rather than assuming a pass.

## 2. UI Test Cases

| Test ID | Scenario | Preconditions | Expected Result | Automation Status |

|---|---|---|---|---|

| UI-001 | Login and access the dashboard | Authorized test account is configured | User can authenticate and reach the expected dashboard | Automated - verify exact assertion |

| UI-002 | Dashboard task-management controls | User has access to the dashboard | Relevant controls are visible and behave as expected | Automated - verify exact assertion |

| UI-003 | Open the task creation form | User can access task management | Task creation form opens successfully | Automated - verify exact assertion |

| UI-004 | Create a task with valid data | User is authenticated; valid task data is available | Task is created and the resulting UI reflects the change | Automated - verify exact assertion |

| UI-005 | Reject an empty task title | Task creation form is open | Empty title is rejected with appropriate validation | Automated - verify exact assertion |

| UI-006 | Cancel task creation | Task creation form is open | Form closes or cancels without creating the task | Automated - verify exact assertion |

| UI-007 | Delete a task | User can access a task eligible for deletion | Selected task is removed from the relevant list or view | Automated - verify exact assertion |

## 3. API Test Cases

| Test ID | Scenario | Preconditions | Expected Result | Automation Status |

|---|---|---|---|---|

| API-001 | Access authenticated profile | Valid authentication configuration | Profile request returns the expected successful response | Automated - verify exact assertion |

| API-002 | Retrieve task list | API endpoint is available and authentication is configured as required | Response has the expected status and task-list structure | Automated - verify exact assertion |

| API-003 | Create a task | Valid task data and required authorization are available | API accepts the request and returns the expected created task | Automated - verify exact assertion |

| API-004 | Retrieve a task | A valid task identifier is available | API returns the expected task details | Automated - verify exact assertion |

| API-005 | Update task details | A valid task exists and update data is valid | API returns the expected result and updated values | Automated - verify exact assertion |

| API-006 | Change task status | A valid task exists and the requested status is supported | API accepts the status change and returns the expected result | Automated - verify exact assertion |

| API-007 | Delete a test-created task | A task created by the test is available | API returns the expected deletion response and the task is no longer retrievable when applicable | Automated - verify exact assertion |

| API-008 | Reject an unauthenticated request | Request is sent without required authentication | API rejects the request with the expected authorization response | Automated - verify exact assertion |

| API-009 | Reject an invalid task title | Invalid title data is supplied | API rejects invalid input according to the application contract | Automated - verify exact assertion |

| API-010 | Reject an invalid task status | Unsupported status is supplied | API rejects the request according to the application contract | Automated - verify exact assertion |

| API-011 | Handle an unknown task ID | A nonexistent task identifier is used | API returns the expected not-found or documented error response | Automated - verify exact assertion |

## 4. Execution Record

Update this section for each meaningful test cycle.

| Field | Record |

|---|---|

| Execution date | Fill in the actual date |

| Git commit | Record the tested commit hash |

| Environment | Local or GitHub Actions |

| UI results | Record passed, failed, and skipped counts |

| API results | Record passed, failed, and skipped counts |

| Failed test IDs | List actual failures, or enter None |

| Report location | Local HTML report or GitHub Actions artifact |

| Notes | Record environment issues, defects, and follow-up work |

## 5. Defect Reporting Guidelines

For a failed scenario, capture:

1\. Test ID and test name.

2\. Environment, browser, and commit hash.

3\. Preconditions and test data, excluding secrets.

4\. Reproduction steps.

5\. Expected result.

6\. Actual result.

7\. Relevant screenshot, trace, or API response.

8\. Severity and priority, based on impact and urgency.

9\. Current status and retest outcome.

Do not classify an application defect solely from a failed automated assertion. First investigate whether the failure came from the application, test data, authentication, network, browser, or test implementation.

## 6. Coverage Notes

- UI cases should be checked against the actual UI spec files.

- API cases should be checked against the actual API spec file.

- The current README reports 27 UI tests and 11 API tests. These are test counts, not necessarily the number of distinct scenarios in this catalog.

- UI test counts may differ depending on whether counts represent unique test definitions or executions across multiple browsers.

- Add or revise cases when new functionality, boundary conditions, or defects are discovered.

---
**Project:** TaskFlow QA Automation  

**Repository:** https://github.com/cjdaprogrammer/taskflow-qa-automation
