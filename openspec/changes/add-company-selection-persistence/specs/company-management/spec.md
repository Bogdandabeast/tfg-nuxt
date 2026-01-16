## ADDED Requirements

### Requirement: Company Selection Persistence

The application SHALL remember the selected company across page reloads using localStorage.

#### Scenario: User selects company and reloads page

- **WHEN** user selects a company in the dashboard
- **THEN** the company ID is stored in localStorage
- **AND** upon page reload, the same company is automatically selected if it still exists

#### Scenario: Selected company is deleted

- **WHEN** the selected company is deleted
- **THEN** no company is selected on next load (user must choose again)
