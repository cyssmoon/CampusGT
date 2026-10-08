
# Mini-Activity: Measure Your Reviewer

**Module 3 – Individual Work** | *Generación T* (30 Minutes)

## 📌 Context

You have a functioning code reviewer subagent. The core question for this activity is whether it is actually effective—and the answer needs to be a **number**, not just a feeling or impression.

---

## 🚀 Step-by-Step Instructions

### Step 1: Select 5 Files from Your Project
Do not choose files at random. Include both types:
* **3 or 4 files** with known issues/vulnerabilities that you already identified.
* **1 or 2 files** that are clean/healthy, as far as you know.

> 💡 *Note: Clean files are the most critical part of this test—they show whether your reviewer knows when to remain silent. If you test five broken files, any reviewer will score 5 out of 5.*

---

### Step 2: Fill Out the Table Before Running the Agent
Complete the first two columns of the evaluation table **before** executing the subagent. 

*(If you document your expectations after seeing the results, you are not measuring—you are just convincing yourself).*

| File | What I Expect It to Find | Found? (Run 1) | Found? (Run 2) |
| :--- | :--- | :---: | :---: |
| `path/to/file1.ext` | *Describe expected issue or "None (Clean File)"* | ❌ / ✅ | ❌ / ✅ |
| `path/to/file2.ext` | *Describe expected issue or "None (Clean File)"* | ❌ / ✅ | ❌ / ✅ |
| `path/to/file3.ext` | *Describe expected issue or "None (Clean File)"* | ❌ / ✅ | ❌ / ✅ |
| `path/to/file4.ext` | *Describe expected issue or "None (Clean File)"* | ❌ / ✅ | ❌ / ✅ |
| `path/to/file5.ext` | *Describe expected issue or "None (Clean File)"* | ❌ / ✅ | ❌ / ✅ |

---

### Step 3: Run and Count (Initial Benchmark)
1. Open a **brand new chat** and feed the five files one by one to the reviewer. 
   *(Do not mention your expected results in the prompt, or you will bias the agent).*
2. Complete the third column (**Found? - Run 1**) in your table.
3. Calculate your baseline metric:

$$\text{Initial Score} = \mathbf{X} \text{ out of } 5$$

*(This score isn't inherently good or bad—it is simply your starting baseline).*

---

### Step 4: Change ONE Thing and Re-measure
1. Identify the output issue that bothered you the most.
2. Modify **a single line** in your reviewer configuration file.
3. Open **another brand new chat** and run the exact same five files again.
4. Complete the fourth column (**Found? - Run 2**) in your table.
5. Calculate your updated metric:

$$\text{Post-Change Score} = \mathbf{Y} \text{ out of } 5$$

---

## 📥 Deliverables

Submit the following items:

1. **Completed Table:** Showing results for both test runs (Run 1 and Run 2).
2. **Change Log:** A brief 2-line description explaining **what** single line you changed in the reviewer file and **why**.
3. **Metric Analysis:** State whether your score went up, down, or stayed the same, and describe the specific case/file that changed behavior.

> ⚠️ *Important: If your score went down, do not hide it! Submit the actual result. Discovering that a seemingly obvious improvement actually degraded performance is the key learning objective of this exercise.*
