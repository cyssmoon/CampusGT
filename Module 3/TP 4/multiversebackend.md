---

# Designing the Backend for Multiverse

**Author:** Yasmin Luna Estanga

**Program:** Generación T (Streambe)

**Starting Point:** Data model from Class 15 TP (*Universe, Character, DangerLevel, Power, CharacterPower*)

---

## 1. Brief Description of the Application

*Multiverse* is a catalog of fictional characters (from anime, comics, movies, and video games). Each character belongs to a universe, has a danger level, and can possess one or more powers. The frontend allows users to explore the catalog, filter by universe/power/level, view character details, and register new characters.

---

## 2. Identified Entities and Features

* **Entities (Already defined in the database TP):** Universe, Character, DangerLevel, Power, CharacterPower (N:M junction table).


* **Main Frontend Features:**
* Character listing with filters (universe, level, power).


* Character detail card (data + universe + level + powers).


* Character creation form, with selection for universe, level, and powers.


* Creation/editing forms for universes and powers (catalogs).




* **Data Fields:** Name, description, universe, danger level, list of powers.


* **Business Rules:** A character cannot exist without a valid universe and level; a power can be shared across multiple characters, but cannot be duplicated on the same character (composite Primary Key).


* **Current Persistence (Pure Frontend):** None real. Previously lived in JavaScript state (in-memory arrays) or at most in `LocalStorage`, which does not support sharing data between users or handling N:M relationships. This is precisely what drives the logic shift to the backend.



---

## 3. Responsibilities: Frontend vs. Backend

| Frontend | Backend |
| --- | --- |
| Render lists, cards, and character detail views

 | Real persistence (Database)

 |
| Forms and their "UX validation" (empty fields, immediate feedback)

 | "Meaningful" business validation (Does this universe exist? Does this level exist?)

 |
| Visual state (active filters, open modals, loading indicators)

 | Integrity rules: Prevent creating a character with a non-existent foreign key (FK)

 |
| API calls and response handling

 | Data access (queries, joins, writing operations)

 |

---

## 4. Proposed Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| **GET** | `/api/personajes` | Lists all characters (optional query filters: `?universo`, `?nivel=`, `?poder=`)

 |
| **GET** | `/api/personajes/:id` | Character detail view including universe, level, and powers

 |
| **POST** | `/api/personajes` | Creates a character *(implemented in this TP)*<br> |
| **PUT** | `/api/personajes/:id` | Edits a character

 |
| **DELETE** | `/api/personajes/:id` | Deletes a character

 |
| **GET** | `/api/universos` | Lists universes

 |
| **POST** | `/api/universos` | Creates a universe

 |
| **GET** | `/api/poderes` | Lists powers

 |
| **POST** | `/api/poderes` | Creates a power

 |
| **GET** | `/api/niveles` | Lists danger levels (fixed catalog)

 |

---

## 5. Chosen Architecture and Justification

* **Pattern:** Controller $\rightarrow$ Service $\rightarrow$ Repository.


* **Justification:** I chose to separate into these three layers because each has a distinct responsibility, allowing changes in one without touching the others:


* The **Controller** only translates HTTP logic (receives requests, calls the Service, returns JSON).


* The **Service** centralizes business rules (what is valid and what is not).


* The **Repository** is the only component aware of the database existence and how it is queried.


* *Example:* If tomorrow I switch from SQLite to MySQL, I only rewrite the Repository; the Service and Controller remain untouched.





---

## 6. A Questioned AI Decision

When asking the AI to help design the character creation validation, its initial suggestion was: *If the sent `id_universo` or `id_nivel` do not exist, automatically assign a "generic" value (e.g., the first universe in the table) instead of rejecting the request, arguing that this way "creation never fails and the UX is smoother."*

I rejected this suggestion because:

* It breaks data integrity: A character would be associated with a universe the user never chose, without anyone noticing.


* It hides real frontend errors (a poorly configured `id_universo`) instead of surfacing them, making debugging much harder later on.


* "Never failing" is not the same as "working properly"—sometimes failing with a clear message is the correct behavior.



**Final Decision:** Reject the operation with a `400 Bad Request` and an explicit message (`"A universe with id X does not exist."`) when the universe or level ID does not exist. This is implemented in `src/services/personajeService.js`.

---

## 7. Implemented Backend Feature

* **Feature:** Character creation (`POST /api/personajes`), enforcing business rules:


* Name is mandatory and cannot be empty.


* Universe ID and danger level ID are mandatory and must exist in their respective catalogs (see section 6).


* If powers are sent (array of IDs), all must exist in the powers catalog; they are assigned via the `CharacterPower` junction table.




* Also implemented `GET /api/personajes/:id`, which builds the complete character record (character + universe + level + powers) by joining tables—necessary to visually verify that creation worked correctly.



**File Structure:**

```text
multiverse-backend/
├── server.js
└── src/
    ├── db/
    │   └── connection.js          # (node:sqlite) + schema & test data
    ├── repositories/
    │   └── personajeRepository.js
    ├── services/
    │   └── personajeService.js    # business rules
    ├── controllers/
    │   └── personajeController.js
    └── routes/
        └── router.js

```

*Technical Note:* To run the example without internet dependencies or external package installations, `node:sqlite` (built into Node 22) was used instead of an external library like `mysql2`. The Controller-Service-Repository architecture is identical to what would be used with MySQL; only the contents of the Repository would change.

---

## 8. Evidence of Functionality

The server was started (`node server.js`) and endpoints were tested using `curl`:

* **Valid creation (`POST /api/personajes` with Wonder Woman):**

```json
// Request
{
  "nombre": "Wonder Woman",
  "descripcion": "Amazona de Themyscira",
  "id_universo": 1,
  "id_nivel": 4,
  "poderes": [1, 2]
}

// Response (201 Created)
{
  "id_personaje": 2,
  "nombre": "Wonder Woman",
  "descripcion": "Amazona de Themyscira",
  "id_universo": 1,
  "universo_nombre": "DC Comics",
  "id_nivel": 4,
  "nivel_nombre": "Critico",
  "poderes": [
    { "id_poder": 1, "nombre": "Vuelo", "descripcion": "Capacidad de volar sin ayuda externa" },
    { "id_poder": 2, "nombre": "Super fuerza", "descripcion": "Fuerza muy superior a la humana" }
  ]
}

```


* **Business validation working — POST with non-existent `id_universo`:**

```json
// Request: {"nombre": "Personaje Fantasma", "id_universo": 999, "id_nivel": 1}
// Response (400 Bad Request)
{ "error": "No existe un universo con id 999." }

```


* **Mandatory field validation — POST without a name:**

```json
// Response (400 Bad Request)
{ "error": "El nombre del personaje es obligatorio." }

```


* **Verification via `GET /api/personajes/2`:** Returns precisely the data of the newly created Wonder Woman, with universe, level, and powers correctly joined—confirming that writing and reading operations are consistent.



All four cases were executed in a live server run (not hand-crafted mock data); the complete code is available in the attached `multiverse-backend.zip` file.
