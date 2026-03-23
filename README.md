# TEST-C3

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

--- 

# Project Features

### Task Management (CRUD)
  Create new tasks, read details, update existing tasks, and delete tasks with confirmation. The app also keeps local storage in sync.'
  
### Routing
  Navigation is handled with Vue Router for dashboard, task listing, new task creation, and task detail pages.'
  
### State Management
  Pinia centralized store keep task and theme state so every component reads and updates consistent shared data across the entire website.
  
### UI and Responsiveness
  Whole layout is responsive across all devices with the help of tailwind break points
  
### Animations
  Smooth transitions for pages and cards with the help of gsap and css
  
### Composition API Usage
  Components use script setup, vue 3 composition APIs as instructed

### Component Architecture
  The app is organized into reusable components such as header, sidebar, task cards and forms

#### Performance Optimization
  Using computed filtering, lazy loads and slots for performance optimization
    
### UX Enhancements'
  Helpful confirmations, clear labels, visual status indicators
  
### Keyboard Navigation & Accessability
  Added keyboard navigation & accessability for the sake of ease usage