# OrangeHRM PIM UI tests

UI automation for the PIM (Personnel Information Management) module of the
[OrangeHRM demo](https://opensource-demo.orangehrmlive.com/), written with
Playwright and TypeScript.

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npx playwright install chromium
npm test
```

Other useful commands:

| Command | What it does |
| --- | --- |
| `npm run test:smoke` | Only tests tagged `@smoke` |
| `npm run test:regression` | Only tests tagged `@regression` |
| `npm run test:headed` | Runs with a visible browser |
| `npm run test:ui` | Opens Playwright's UI mode |
| `npm run report` | Opens the last HTML report |
| `npm run typecheck` | Type checks without running anything |

The demo credentials (`Admin` / `admin123`) and the base URL are defaults in
`src/config/env.ts`. To override them, copy `.env.example` to `.env`.

## What is covered

**Requested workflow** (`tests/pim/employee-workflow.spec.ts`): one test that
logs in, creates an employee, searches for them, opens the details, edits the
name, nationality, marital status and gender, then reloads the page and checks
the values were persisted (and that the list shows the new name).

**Additional PIM scenarios** (`tests/pim/employee-regression.spec.ts`), picked
because they protect the basic rules of the module:

1. Add employee requires first and last name.
2. Add employee rejects a duplicate Employee Id.
3. A deleted employee can no longer be found.
4. Searching for an unknown id shows "No Records Found".

I also added a small login spec (valid, invalid and empty credentials) since
everything else depends on it.

## Structure

```
src/
  api/        API helper used for seeding and cleaning up data
  config/     base URL, credentials, auth file path
  data/       test data builders
  fixtures/   Playwright fixtures that hand page objects to the tests
  pages/      page objects
tests/
  auth.setup.ts              logs in once and stores the session
  auth/login.spec.ts
  pim/employee-workflow.spec.ts
  pim/employee-regression.spec.ts
```

## Design choices

- **Page objects + fixtures.** Selectors live in `src/pages`, the specs only
  read like the user journey. Fixtures create the page objects, so tests ask
  for what they need instead of constructing it.
- **Locators.** Role, placeholder and label based locators wherever the app
  allows it. OrangeHRM has no test ids, so a few spots use its `oxd-*`
  classes; those are kept inside the page objects so a markup change is a
  one-file fix.
- **Login once.** A `setup` project logs in and stores the session
  (`.auth/`). The workflow and login specs opt out of it so the real login
  path is still exercised.
- **Test data.** Builders generate unique names and Employee Ids on every run.
  Tests never depend on records that already exist in the shared demo, and
  they can run in parallel. Searches use the Employee Id because it is unique.
- **Setup and cleanup through the API.** Tests that are not about creating an
  employee seed one through the app's REST endpoint, which is quicker and less
  flaky than clicking through the form. The `employeeApi` fixture removes
  everything the test created, also when the test fails.
- **Assertions.** Only web-first `expect` assertions, so there are no manual
  sleeps. Where the page fills fields in after loading, the page object waits
  for that explicitly.
- **Reporting.** HTML report always, GitHub annotations on CI. Traces are kept
  on the first retry and screenshots on failure.
- **Execution.** Tests are fully parallel. Tags (`@smoke`, `@regression`)
  allow running subsets. A GitHub Actions workflow is included.

## Things to know

- The public demo is shared and gets reset regularly, so it can be slow
  or occasionally unavailable. That is why there is one retry locally and two
  on CI.
- Seeding and cleanup use OrangeHRM's internal `/api/v2/pim/employees`
  endpoint. It is not a documented public API, so if it changes, only
  `src/api/employee.api.ts` needs updating.

## Extending

- A new page goes into `src/pages`, gets a fixture in `src/fixtures/index.ts`
  and is then available in every test.
- More browsers can be added as extra projects in `playwright.config.ts`.
- Other modules (Leave, Recruitment, ...) can get their own folder under
  `tests/` and reuse the same fixtures and login session.
