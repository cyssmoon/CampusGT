# 🌌 Multiverse - Database Design

Official repository for the database model design of **Multiverse**, an application designed to register characters from fictional universes (anime, movies, video games, comics, etc.)[cite: 1].

---

## 📋 Project Description

The goal of this project is to design a robust relational database capable of managing a multiverse of characters, keeping track of their basic information, their universe of origin, their abilities/powers, and their danger level[cite: 1].

---

## 🔍 Key Business Questions

The system must be able to efficiently answer the following operational queries[cite: 1]:
1. **Which characters belong to this universe?**
2. **Which characters possess a specific power?**
3. **What powers does this character have?**
4. **Who are the most dangerous characters?**

---

## 📐 Entity-Relationship Model (ERM)

### 1. Entities and Attributes

#### **`universe`**
Represents the origin or franchise to which the character belongs (e.g., *Dragon Ball*, *Marvel Universe*, *Star Wars*, etc.).
* `id_universe` (INT, Primary Key, Auto-increment) - Unique identifier for the universe.
* `name` (VARCHAR(100), NOT NULL) - Name of the fictional universe.
* `category` (VARCHAR(50), NOT NULL) - Medium type (Anime, Movie, Video game, Comic, etc.).
* `creator` (VARCHAR(100)) - Author, studio, or creator company.

#### **`danger_level`**
Standardized classification of the threat level a character represents.
* `id_level` (INT, Primary Key, Auto-increment) - Identifier for the danger level.
* `name` (VARCHAR(50), NOT NULL) - Name of the classification (e.g., *Low*, *Moderate*, *High*, *Catastrophic*, *God Level*).
* `description` (TEXT) - Details of the criteria defining this threat level.

#### **`character`**
Stores the basic information of each entity inhabiting the multiverse[cite: 1].
* `id_character` (INT, Primary Key, Auto-increment) - Unique identifier for the character.
* `name` (VARCHAR(100), NOT NULL) - Character's name.
* `alias` (VARCHAR(100)) - Nickname or hero/villain name (e.g., *Spider-Man*, *Prince of all Saiyans*).
* `biography` (TEXT) - Short bio or history of the character.
* `appearance_year` (INT) - Year of official first appearance.
* `id_universe` (INT, Foreign Key -> `universe.id_universe`) - Universe the character belongs to[cite: 1].
* `id_level` (INT, Foreign Key -> `danger_level.id_level`) - Assigned danger level[cite: 1].

#### **`power`**
Catalog of abilities, skills, or special powers that characters can possess[cite: 1].
* `id_power` (INT, Primary Key, Auto-increment) - Unique identifier for the power.
* `name` (VARCHAR(100), NOT NULL) - Name of the power (e.g., *Flight*, *Super strength*, *Kamehameha*, *Time control*).
* `description` (TEXT) - Explanation of what the power consists of.

---

### 2. Junction Table (N:M Relationship)

Since **a character can have multiple powers** and **the same power can appear in multiple characters**, a many-to-many (N:M) relationship is established[cite: 1], resolved through a junction table:

#### **`character_power`**
Relates characters to their respective powers.
* `id_character` (INT, Foreign Key -> `character.id_character`) - Part of the composite key.
* `id_power` (INT, Foreign Key -> `power.id_power`) - Part of the composite key.
* **Composite Primary Key:** `(id_character, id_power)`
* `mastery_level` (VARCHAR(50)) - *Optional attribute:* Level of mastery the character has over that specific power (e.g., *Beginner*, *Master*).

---

## 🔗 Relationship Cardinalities

* **`universe` (1) ──< (N) `character`**: A universe can have many characters, but a character belongs to a single universe[cite: 1].
* **`danger_level` (1) ──< (N) `character`**: A danger level applies to many characters, but each character has a single primary level assigned.
* **`character` (N) ──> (M) `power`**: Many-to-many relationship resolved through `character_power`[cite: 1].

---

## 💡 Solving Business Questions

1. **Which characters belong to this universe?**
   * *Logical query:* Filter the `character` table where `id_universe` matches the queried universe, performing a `JOIN` with the `universe` table.
2. **Which characters possess a specific power?**
   * *Logical query:* Perform a `JOIN` among `character`, `character_power`, and `power`, filtering by the specific `id_power` or power name.
3. **What powers does this character have?**
   * *Logical query:* Query the `character_power` table joined with `power`, filtering by the corresponding `id_character`.
4. **Who are the most dangerous characters?**
   * *Logical query:* Order records in the `character` table using a `JOIN` with `danger_level` according to the hierarchy or severity of the threat level.

---
*Design developed for the **Multiverse** technical challenge.*
