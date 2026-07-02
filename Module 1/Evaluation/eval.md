# Evaluation Summary: AI-First and Agent Development

This document provides a summary of the key concepts covered in the Module 1 exam regarding AI-First mindset, agent architecture, and development methodologies.

## Key Concepts

*   **AI-First Mindset**: Designing processes where AI is an integral part from the beginning, rather than just a consultation tool or a human replacement.
*   **AI Hallucinations**: A phenomenon where a model generates false or invented information while presenting it as fact.
*   **Prompt Engineering (Best Practices)**: To achieve the best results, a prompt should include specific technical context (stacks, libraries), clear functionalities, design requirements, and operational constraints.
*   **RAG (Retrieval-Augmented Generation)**: A technique that allows AI to consult external and updated information as context before generating a response, reducing hallucinations.
*   **AI Ethics**: Using AI tools to create deceptive content (e.g., deepfakes) poses a significant ethical risk.
*   **Chatbots vs. Agents**: The fundamental difference lies in autonomy. An agent can analyze, plan, execute actions, and verify results independently.
*   **MCP (Model Context Protocol)**: A standard for connecting agents with external tools and services through a common framework.
*   **AGENTS.md**: A fundamental file for defining persistent rules, conventions, and instructions that guide an agent's behavior within a project.
*   **Plan Mode**: A recommended working mode for major refactors or complex features, where the action plan must be validated before execution.
*   **Skills (Agent Skills)**: Capabilities that allow an agent to interact with external tools (APIs, databases, file systems).
*   **Context Engineering**: The structured design of an agent's complete context (memory, rules, tools) to optimize its capabilities and responses.
*   **SDD (Spec Driven Development)**: A development methodology that prioritizes defining specifications and requirements before implementing code.

## Strategy in Production

When dealing with critical tasks (such as adding authentication to a live production system), the best strategy is:
1.  **Request an analysis**: Ask the AI for a project diagnosis.
2.  **Planning**: Obtain a detailed implementation plan.
3.  **Review**: Validate the proposal.
4.  **Execution**: Authorize the changes only after the review.
