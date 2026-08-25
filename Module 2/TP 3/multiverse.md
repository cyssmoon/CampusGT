# 🌌 Multiverse - Database Design (Yasmin Luna Estanga style)

**Course:** Generación T (Streambe) - TP Class 15: Design the Database of Multiverse [cite: 3]  
**Author:** Yasmin Luna Estanga [cite: 3]  
**Type:** Conceptual Model without SQL (Markdown format for GitHub) [cite: 3]

---

## 1. Identified Entities

From the problem statement, five entities are identified [cite: 3]. `Character` and `Power` relate in both directions (multiple powers per character and multiple characters per power), so this N:M relationship is resolved using a junction table [cite: 3].

| Entity | Description / Why it exists? |
| :--- | :--- |
| **Universe** | Groups characters by their fictional origin (anime, movie, video game, comic) [cite: 3]. |
| **Character** | Central entity: registers the basic data of each character [cite: 3]. |
| **DangerLevel** | Catalog of levels (Low, Medium, High, Critical) to classify characters consistently [cite: 3]. |
| **Power** | Catalog of abilities that one or more characters can possess [cite: 3]. |
| **Character_Power** | Junction table resolving the N:M relationship between Character and Power [cite: 3]. |

---

## 2. Attributes, Data Types, and Primary Keys

### **Universe**
| Attribute | Type | Key |
| :--- | :--- | :--- |
| `id_universe` | INTEGER | PK [cite: 3] |
| `name` | TEXT | — |
| `type` | TEXT (anime / movie / video game / comic) | — [cite: 3] |

### **Character**
| Attribute | Type | Key |
| :--- | :--- | :--- |
| `id_character` | INTEGER | PK [cite: 3] |
| `name` | TEXT | — |
| `description` | TEXT | — |
| `id_universe` | INTEGER | FK -> Universe [cite: 3] |
| `id_level` | INTEGER | FK -> DangerLevel [cite: 3] |

### **DangerLevel**
| Attribute | Type | Key |
| :--- | :--- | :--- |
| `id_level` | INTEGER | PK [cite: 3] |
| `name` | TEXT (Low / Medium / High / Critical) | — [cite: 3] |

### **Power**
| Attribute | Type | Key |
| :--- | :--- | :--- |
| `id_power` | INTEGER | PK [cite: 3] |
| `name` | TEXT | — |
| `description` | TEXT | — [cite: 3] |

### **Character_Power (Junction Table)**
| Attribute | Type | Key |
| :--- | :--- | :--- |
| `id_character` | INTEGER | Composite PK / FK -> Character [cite: 3] |
| `id_power` | INTEGER | Composite PK / FK -> Power [cite: 3] |

*Note: It has no extra attributes because it only registers which character has which power; if in the future we wanted to store, for example, the age at which they acquired that power, then adding an attribute would make sense [cite: 3].*

---

## 3. Entity Relationships

| Relationship | Cardinality | How it is resolved |
| :--- | :--- | :--- |
| **Universe ── Character** | 1:N | Character stores `id_universe` as an FK (one universe has many characters; each character belongs to a single universe) [cite: 3]. |
| **DangerLevel ── Character** | 1:N | Character stores `id_level` as an FK (each character has a single level; one level groups many characters) [cite: 3]. |
| **Character ── Power** | N:M | Resolved with the `Character_Power` table, whose PK is the combination `(id_character, id_power)` [cite: 3]. |

---

## 4. Verification Against Business Questions

| Question | How the model answers it |
| :--- | :--- |
| **What characters belong to this universe?** | Filter `Character` by `id_universe` [cite: 3]. |
| **What powers does this character have?** | Join `Character` → `Character_Power` → `Power`, filtering by `id_character` [cite: 3]. |
| **What characters have a specific power?** | Join `Power` → `Character_Power` → `Character`, filtering by `id_power` [cite: 3]. |
| **Who are the most dangerous characters?** | Join `Character` → `DangerLevel`, filtering/sorting by the highest threat level [cite: 3]. |

---

## 5. Self-Review (Checklist)

* **Are we repeating information?** No: universe, level, and power live in their own tables and are referenced via FKs, rather than repeating in every row of `Character` [cite: 3].
* **Did we put multiple values inside a single field?** No: multiple powers of a character are not jammed into a single text field, but rather stored in separate rows of `Character_Power` [cite: 3].
* **Are there data points that should be separated?** Yes, and they already are: Danger Level and Power are independent catalogs, not loose attributes in `Character` [cite: 3].
* **Can we answer the four business questions with this model?** Yes, as detailed in section 4 [cite: 3].

---
*Based on the conceptual model design by Yasmin Luna Estanga (Generación T / Streambe).* [cite: 3]
