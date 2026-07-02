# 🌌 Star Wars Explorer
> An educational web app that consumes SWAPI to explore characters, planets, and starships from the Star Wars universe.

---

## 📁 Structure

```
starwars/
├── index.html
├── style.css
└── app.js
```

---

## ✨ Features

- 🧭 Tab navigation (Characters / Planets / Starships)
- 🔍 Search bar with real-time local filtering
- 🌍 Homeworld resolution using `Promise.all` (no `await` in loops)
- 💾 In-memory cache to avoid unnecessary re-fetches
- ⚠️ Error handling with a retry button
- 📱 Responsive design inspired by the Star Wars universe

---

## 🌐 API Used

| API | Endpoint | Docs |
|-----|----------|------|
| SWAPI | `https://swapi.info/api` | [swapi.info](https://swapi.info) |

> ⚠️ `swapi.info` is used instead of `swapi.dev` as the latter is currently down.

---

## 🚀 How to Run

Open `index.html` directly in your browser, or use **Live Server** in VS Code.

---

## 🛠️ Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
