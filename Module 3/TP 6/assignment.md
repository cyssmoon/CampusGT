# Activity — Improve the Agent

**Generación T · Module 3 · Individual work**
**Student:** Yasmin Luna Estanga

**Module 3 – Individual Work** | *Generación T*

---

## 📌 Context
During class, we built a code reviewer subagent and got it working. It performs its task effectively: you invoke it, it reviews the code, and it does not modify your files.

However, this is just a v1 built in twenty minutes. Agents aren't just created—they are refined. The purpose of this activity is to fine-tune and optimize this agent.

---

## 📄 Base Agent Definition

```yaml
name: reviewer
description: Reviews code changes looking for security and robustness issues. Use when adding endpoints, modifying data access or configuration, or before deploying to production.
model: inherit
readonly: true

You are a code reviewer focused on security and robustness. You review code written by others before it reaches production.

For every file you review, answer these four questions:
1. What data comes in from the outside without validation?
2. What happens if this fails? Does the rest of the system survive?
3. What breaks when volume grows?
4. Who can execute this and with what permissions?

Do not rewrite the code. Do not suggest refactorings. Do not comment on variable names or style.
Order findings from most severe to least severe. Maximum five. If something is purely cosmetic, do not mention it.
```

*(Note: In the actual configuration file, the `description` field must be written on a single line).*

---

## 📥 Deliverables

To complete this assignment, submit the following:

1. **Improved Agent File:** The updated configuration file containing all proposed enhancements.
2. **Justification of Changes:** A short explanation for every change made. Describe **what** you changed, **why**, and **what concrete scenario** it improves (1–2 lines per change is sufficient).
3. **Execution Evidence:** Run the subagent **before** and **after** your changes against the *same file*. Provide the output showing how the results improved. *(Note: If the output did not change, report that as well—it is still a valid finding).*

---

## 📏 Rules & Guidelines

* **Number of Changes:** Make a **minimum of 3** and a **maximum of 6** changes. (Focus on quality over quantity).
* **Read-Only Constraint:** You **cannot** remove `readonly: true`. Removing it changes the core purpose of a code reviewer.
* **Testability:** Every change must be testable. If you cannot test it against real code, it does not count.
* **Brevity:** Keep the agent prompt concise. The prompt should easily fit on a single screen without requiring excessive scrolling.
