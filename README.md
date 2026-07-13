# Emmanuel Opeolu — Student Portfolio & Academic Management Website

COS 106 (Introduction to Web Technologies) term project — a responsive,
multi page personal portfolio and academic planner built with plain
HTML, CSS, and JavaScript.

## Live Site

[View Live Website](https://makzosoft.github.io/emmanuel-portfolio/)

## Source Code

[View Source Code on GitHub](https://github.com/makzosoft/emmanuel-portfolio)

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Name, photo, welcome message, nav, brief bio |
| About Me | `about.html` | Education, career goals, skills, hobbies |
| Projects | `projects.html` | Three sample projects with screenshots and links |
| Academic Planner | `planner.html` | Interactive task list — add, complete, delete |
| Contact | `contact.html` | Contact form with client side validation |

## Project structure

```
portfolio/
├── index.html
├── about.html
├── projects.html
├── planner.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── main.js       (shared: mobile nav, hero animation)
│   ├── planner.js     (task add / complete / delete)
│   └── contact.js     (form validation)
└── images/
    ├── avatar-placeholder.svg   (unused once a real photo is in place)
    ├── profile-photo.jpg
    ├── campus-connect-demo.mp4
    ├── campus-connect-poster.jpg
    ├── grade-tracker-demo.mp4
    ├── grade-tracker-poster.jpg
    ├── weather-cli-demo.mp4
    └── weather-cli-poster.jpg
```

## Technical highlights

- Semantic HTML5: `header`, `nav`, `main`, `section`, `article`, `footer`
- A `<table>` for academic background, a `<form>` for contact, an embedded
  `<video>` for the project demo, and multiple lists and hyperlinks
- Fully responsive layout using CSS Flexbox and Grid, with a mobile
  hamburger nav under 640px
- CSS transitions and animations (hover states, cursor blink, task list
  entry animation) and a consistent dark, code editor inspired colour
  scheme
- JavaScript: event handling, DOM manipulation, array based state for
  the planner, and full form validation (required fields, email format,
  digits only phone number)
