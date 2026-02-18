# Origin Energy – UI Automation (Playwright + TypeScript)

End-to-end Playwright automation for the Origin Energy pricing flow, built with the Page Object Model pattern.

---

## Features

- **Multi-browser support** – runs against Chromium, Firefox, and WebKit out of the box
- **Docker support** – convenience scripts to build and run tests in a container via Docker Compose
- **Dual reporting** – built-in Playwright HTML report and Allure report
- **Page Object Model** – clean separation of test logic and page interactions

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20.20 |
| npm | ≥ 10.8 |
| Docker (if needs to run using docker) | ≥ 28.5 |

---

## Setup & Run

| Step | npm | Docker Compose |
|------|-----|----------------|
| **Install dependencies** | `npm install` | — |
| **Install browsers** | `npm run install:browsers` | — |
| **Run tests (headless)** | `npm test` | macOS/Linux: `./run-tests-compose.sh`<br>Windows: `docker compose up --build --abort-on-container-exit` |
| **Run tests (headed)** | `npm run test:headed` | — |
| **Teardown** | — | `docker compose down --remove-orphans` |


> **If you are using Rancher Desktop:** Use the same Docker commands — just ensure **dockerd** is selected as the container runtime in settings if docker commands fail.

---

## Reports

| Report | npm | Docker Compose |
|--------|-----|----------------|
| **Playwright HTML** | `npm run test:report` | `npm run test:report` |
| **Allure reports** | `npm run allure:serve` | `npm run allure:serve`|

---

## Allure Report Interface (Screenshot/video capturing enabled for failures. Enabled for the below successful test runs for illustration purposes.)
<img width="1920" height="1039" alt="Screenshot 2026-02-20 at 02 44 04" src="https://github.com/user-attachments/assets/efcbe0c4-ed68-42a4-b506-999141539089" />

<img width="1920" height="1039" alt="Screenshot 2026-02-20 at 02 43 56" src="https://github.com/user-attachments/assets/446f991f-f19a-4f44-bcdd-8727e537a737" />

