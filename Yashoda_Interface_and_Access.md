# Contribution Report – Interface & Access

**Student:** Yashoda  
**Project:** NWKRTC BusTrack  
**Assigned area:** Interface & Access

## Responsibilities
- Build and maintain the application's user interface.
- Organise passenger, driver and admin screens.
- Provide navigation between application sections.
- Implement the login interface and role-based app flow.
- Keep the screens clear and usable for each type of user.

## Work included in this contribution
- `src/App.jsx`, `src/main.jsx`, `src/App.css` and `src/index.css` – application entry point, routing and styling.
- `src/context/AuthContext.jsx` – authentication state and user-role handling.
- `src/components/` – shared components such as navigation, login form, cards, status badges and module switching.
- `src/pages/` – passenger information pages and driver interface.
- `src/pages/admin/` – admin dashboard and management screens for buses, drivers, routes, schedules, trips, reports and notifications.

## Responsibility during the project
I am responsible for the presentation and navigation of the passenger, driver and admin modules, and for connecting the user interface to the application's authentication flow.

## Note
The interface role checks are not a replacement for Firebase database security rules. The selected files depend on shared Firebase and data files from the main project.
