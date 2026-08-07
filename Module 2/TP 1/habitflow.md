# HabitFlow
**Student:** Luna Estanga

## Problem
* **What problem does the application solve?** Many people want to build healthy habits (reading, exercising, drinking water, meditating, studying) but give up after a few days because they have no simple way to view their progress or stay motivated. Existing habit apps are often too complex, with too many features that end up going unused.
* **Who would use it?** People who want to organize their daily routine simply: students, professionals, or anyone looking to improve their personal discipline without relying on an app overloaded with features.
* **Why would it be useful?** Because it centralizes the habits a person wants to track in one place, visually shows progress (streaks, completion percentage), and helps maintain motivation with simple reminders, free from friction or unnecessary complexity.

## Features
1. Create a habit: name, frequency (daily/weekly), and category.
2. Mark the habit as completed for the corresponding day.
3. Edit an existing habit (change name, frequency, or category).
4. Delete a habit that is no longer being tracked.
5. View current streak (consecutive days completed) and historical maximum streak.
6. Filter habits by category or status (active/archived).
7. View simple statistics: weekly/monthly completion percentage per habit.

## Data
Each habit will have:
| Field | Type | Description |
| :--- | :--- | :--- |
| id | text/number | unique identifier |
| name | text | e.g., "Drink 2L of water" |
| category | text | e.g., Health, Study, Wellness |
| frequency | text | Daily / Weekly |
| creation_date | date | when the habit was created |
| active | boolean | whether it is being tracked or archived |
| current_streak | number | consecutive days completed |
| max_streak | number | best historical streak |

Each completion record (daily check) will have:
| Field | Type | Description |
| :--- | :--- | :--- |
| id | text/number | unique identifier |
| habit_id | text/number | reference to the habit |
| date | date | day it was marked |
| completed | boolean | true/false |

## SPEC
* **Objective:** Develop HabitFlow, a simple web application to create, track, and visualize the progress of daily or weekly personal habits.
* **User:** An individual who wants to organize and track their own habits, without the need for multiple accounts or collaborative features.
* **Features:** 
  - Create, edit, and delete habits. 
  - Mark daily completion for each habit. 
  - View current and maximum streaks per habit. 
  - Filter habits by category or status (active/archived). 
  - View a summary of weekly and monthly completion percentages.
* **Constraints:** 
  - The application must be single-user (no login/registration system for now). 
  - Data must persist locally (no backend required in this first version). 
  - The interface must be simple, minimalist, and mobile-friendly (mobile-first). 
  - The UI must not be overloaded with extra features outside the feature list.
* **Chosen Technology:** 
  - Frontend: React with Vite. 
  - Styles: Tailwind CSS. 
  - Persistence: localStorage (initial version), with the possibility of migrating to a database (e.g., SQLite or Supabase) in a second stage.

## Professional Prompt
I want to build a web application called "HabitFlow" for tracking daily and weekly personal habits.

**Technology to use:**
* React with Vite as the main framework.
* Tailwind CSS for styling.
* Data persistence in localStorage (no backend for now).

**Features it must have:**
1. Create a habit with a name, category, and frequency (daily or weekly).
2. Edit and delete existing habits.
3. Mark a habit as completed for the current day.
4. Calculate and display the current and maximum streak for each habit.
5. Filter habits by category or status (active/archived).
6. Show a summary with the weekly and monthly completion percentage per habit.

**How I expect the code to look:**
* React components organized by responsibility (e.g., HabitList, HabitForm, HabitCard, Stats), avoiding giant files with all the logic lumped together.
* Commented code in key parts (streak calculation, data persistence).
* Use of React hooks (useState, useEffect) for state management, without external state libraries.
* Clear folder structure: `/components`, `/hooks`, `/utils`.

**Important constraints:**
* Do not implement a login or multi-user system in this version.
* Do not use a backend or external database; everything must persist in localStorage.
* The interface must be simple and mobile-first, prioritizing clarity over the number of features.
* Do not add features outside the 6 listed above to keep the scope limited.

## Validation Challenge
Before accepting the AI-generated code, I will validate:
* **Does it work correctly?** Test creating, editing, deleting, and marking habits as completed, and verify that data persists upon page reload.
* **Does it calculate streaks correctly?** Verify manually with a simple case (e.g., 3 consecutive completed days) that the current and maximum streaks are calculated correctly.
* **Is it easy to understand?** Check that the code is organized into separate components rather than a single file with mixed logic.
* **Does it respect the expected structure?** Confirm that the indicated folder structure (`/components`, `/hooks`, `/utils`) was used and that no unnecessary dependencies (such as unrequested state libraries or backends) were added.
* **Is the interface clear?** Check that it can be used comfortably from a mobile phone and that there are no extra features complicating the experience.
* **Is there error handling?** Check what happens if someone tries to create a habit without a name, or if localStorage fails or is empty (it should show an empty state, not crash).
