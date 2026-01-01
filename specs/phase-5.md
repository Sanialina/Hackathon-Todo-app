# Phase 5: Refinement and Organization

## 1. Phase Goal
Provide tools for the user to manage large lists of tasks efficiently through searching, filtering, and sorting.

## 2. Description
This phase adds a control bar to the UI allowing the user to view specific slices of their data.

## 3. Planned Features
*   Search Bar (text match).
*   Status Filter (All/Active/Completed).
*   Priority Filter.
*   Sort dropdown (Date Added, Priority, Due Date).

## 4. Functional Requirements
*   **FR-5.1:** User shall be able to type a search query to filter the visible list in real-time.
*   **FR-5.2:** User shall be able to filter by task completion status.
*   **FR-5.3:** User shall be able to sort the list. "Priority" sort puts High first. "Due Date" sort puts earliest first.

## 5. Non-Functional Requirements
*   Filtering logic must be efficient (avoid unnecessary re-renders).
*   Search should be case-insensitive.

## 6. Acceptance Criteria
*   Typing "Buy" shows only tasks with "Buy" in the title.
*   Sorting by Priority groups High priority tasks at the top.
*   Filters and Search can work simultaneously.
