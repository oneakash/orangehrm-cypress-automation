
# OrangeHRM User Management — Cypress E2E Automation

Automated end-to-end test suite for the OrangeHRM Admin User Management workflow built with **Cypress** and **TypeScript** using the **Page Object Model (POM)** pattern.

## Tech Stack & Versions

- **Cypress:** `16.3.0` (latest stable)
- **Language:** TypeScript (`5.9.x`)
- **Node.js:** `22.x` or `24.x` or `26.x` (required by Cypress 16)
- **Design Pattern:** Page Object Model (POM) with custom commands and dynamic test data generation

## Automated Scenario

1. Navigate to `https://opensource-demo.orangehrmlive.com/`
2. Authenticate using Admin credentials loaded securely via `cypress.env.json` and `cy.env()`
3. Navigate to the **Admin** module
4. Create a new system user with a dynamically generated unique username and active employee selection
5. Search for the created user by **Username** and verify the search result row
6. Open the matched user record and verify all saved fields (**User Role**, **Employee Name**, **Status**, **Username**) match the creation payload

## Setup Steps

1. Clone the repository and install dependencies:
```bash
   npm install

```

2. Create your local environment file from the example template:
```bash
cp cypress.env.example.json cypress.env.json

```


3. Update `cypress.env.json` with the OrangeHRM demo Admin credentials:
```json
{
  "adminUsername": "Admin",
  "adminPassword": "admin123"
}

```


4. *(Optional)* Verify TypeScript types:
```bash
npm run typecheck

```



## How to Run Tests

* **Headless mode (default Electron browser):**
```bash
npm run cy:run

```


* **Headless mode in Chrome:**
```bash
npm run cy:run:chrome

```


* **Headed mode in Chrome:**
```bash
npm run cy:run:headed

```


* **Interactive Cypress Test Runner:**
```bash
npm run cy:open

```
