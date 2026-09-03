# Software Engineering & AI-Assisted Development Course Summary

A comprehensive guide covering AI-assisted workflows, software architecture, version control, database design, testing practices, and Web APIs.

---

## 📋 Table of Contents
1. [AI-Assisted Development Workflows](#1-ai-assisted-development-workflows)
2. [Project Documentation & Specifications](#2-project-documentation--specifications)
3. [Version Control & Code Reviews](#3-version-control--code-reviews)
4. [Software Quality & Testing](#4-software-quality--testing)
5. [Database Architecture & Data Manipulation](#5-database-architecture--data-manipulation)
6. [Web Architecture & HTTP Protocol](#6-web-architecture--http-protocol)

---

## 1. AI-Assisted Development Workflows

When working alongside Large Language Models (LLMs) and AI agents in software engineering, maintaining control over the architecture and scope is critical.

* **Plan-First Approach:**
  * For complex features, avoid requesting raw code implementation immediately.
  * Require the AI to perform context analysis, detail a plan, list affected files, identify risks, and specify necessary tests prior to making modifications.
* **Scope Drift & Supervision:**
  * AI models may occasionally modify files outside the agreed implementation scope.
  * Developers act as supervisors: if an unexpected number of files are modified, halt execution, review the changes, and verify the root cause.

---

## 2. Project Documentation & Specifications

To ensure reproducible and context-aware responses from AI systems, projects rely on structured Markdown specification files:

* **`SPEC.md` (System Specifications):**
  * Defines **what** is being built, including functional requirements, domain rules, constraints, and target behavior.
* **`AGENTS.md` (Agent Instructions & Guardrails):**
  * Provides AI coding agents with technical guidelines, code style rules, framework preferences, and operational constraints within the repository.

---

## 3. Version Control & Code Reviews

Understanding and tracking source code modifications is essential when reviewing automated changes.

* **Code Diffs:**
  * A **diff** represents the line-by-line comparison between two versions of an asset, highlighting additions, deletions, and modifications.
* **Branch Strategy & Review:**
  * Always isolate AI-generated changes on separate feature branches before merging into main branches.

---

## 4. Software Quality & Testing

Ensuring reliability and maintainability throughout the development lifecycle.

* **Refactoring:**
  * Restructuring existing code without changing its external behavior to improve readability, reduce complexity, and optimize maintainability.
* **Unit Testing:**
  * Testing individual, isolated units of logic (functions, classes, or modules) to ensure each component functions as expected independently.

---

## 5. Database Architecture & Data Manipulation

Relational database fundamentals and operational safety when applying migrations or data updates.

* **Relational Schema & Foreign Keys:**
  * Foreign Keys establish relationships between distinct entities/tables, linking record identifiers from a child table to a parent table's primary key.
* **Safe Data Manipulation (`UPDATE` / `DELETE`):**
  * Before executing destructive SQL queries (especially generated ones), run an equivalent `SELECT` statement with the exact same `WHERE` clause to verify the set of affected records.

---

## 6. Web Architecture & HTTP Protocol

Client-server communication using RESTful API conventions and standard HTTP request methods.

* **HTTP Request Methods:**
  * **`GET`:** Retrieves resources/data without side effects.
  * **`POST`:** Submits payload data to create new resources.
  * **`PUT` / `PATCH`:** Updates existing resources (full or partial replacement).
  * **`DELETE`:** Removes targeted resources.
