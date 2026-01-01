# Phase 4: Persistence and Intelligence

## 1. Phase Goal
Ensure user data survives browser refreshes and implement "smart" features like Task Recurrence.

## 2. Description
This phase connects the application state to `localStorage` and implements the logic required for tasks that repeat (Daily, Weekly, Monthly).

## 3. Planned Features
*   LocalStorage synchronization.
*   Recurrence selector in Task Modal.
*   Completion logic handling for recurring tasks.

## 4. Functional Requirements
*   **FR-4.1:** System shall save the task list to LocalStorage on every change.
*   **FR-4.2:** System shall load the task list from LocalStorage on initialization.
*   **FR-4.3:** When a recurring task is completed, the system shall NOT delete it but mark it done, AND generate a clone of the task with the due date advanced by the recurrence interval.

## 5. Non-Functional Requirements
*   Persistence operations must be side-effect free (using `useEffect`).
*   Recurrence logic must handle month boundaries correctly.

## 6. Acceptance Criteria
*   Reloading the page retains all tasks.
*   Completing a "Daily" task creates a new task due tomorrow.
