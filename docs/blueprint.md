# **App Name**: ExpenseFlow

## Core Features:

- User Authentication and Roles: Secure user authentication with role-based access control (Admin, Manager, Employee). Auto-creation of Company and Admin user on first sign-up, fetching countries and currencies data using the 'https://restcountries.com/v3.1/all?fields=name,currencies' API.
- Expense Submission: Employees can submit expense claims with details such as amount (in different currencies), category, description, and date.
- Multi-Level Approval Workflow: Define sequential approval workflows (e.g., Manager -> Finance -> Director). Expense moves to the next approver only after the current one approves or rejects.
- Conditional Approval Rules: Set up conditional approval rules based on percentage (e.g., 60% of approvers) or specific approvers (e.g., CFO approval). Combine both flows (multiple approvers + conditional rules).
- OCR for Receipt Auto-Read: Tool for using OCR technology to automatically extract information (amount, date, description, expense lines, expense type, name of restaurant) from receipt scans to auto-fill expense claim fields.
- Currency Conversion: Convert expense amounts from foreign currencies to the company's base currency using the 'https://api.exchangerate-api.com/v4/latest/{BASE_CURRENCY}' API.
- Reporting and Analytics: Generate reports on expense data, including summaries, trends, and compliance metrics. Provide customizable filters and visualizations to analyze spending patterns.

## Style Guidelines:

- Primary color: Deep blue (#1E3A8A), evoking trust and reliability in financial processes.
- Background color: Light gray (#F9FAFB), providing a neutral, clean backdrop to emphasize content.
- Accent color: Vibrant teal (#00BFA6), used for interactive elements and calls to action, symbolizing efficiency.
- Body and headline font: 'Inter' (sans-serif) for a clean, modern, and easily readable interface.
- Code font: 'Source Code Pro' for displaying API endpoints or code snippets.
- Use minimalist, professional icons to represent expense categories and actions.
- Subtle transition animations to enhance user experience during expense submission and approval processes.