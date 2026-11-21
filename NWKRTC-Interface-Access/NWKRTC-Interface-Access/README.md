# NWKRTC Interface & Access — Yashoda

**Contributor:** Yashoda  
**Area:** Interface & Access  
**Project:** NWKRTC BusTrack

## Contribution files
This package contains the app shell, styling, shared UI components, passenger information pages, driver interface, admin screens and the authentication context:
- `src/App.jsx`, `src/main.jsx`, `src/App.css`, `src/index.css`
- `src/context/AuthContext.jsx`
- shared components under `src/components/`
- passenger pages under `src/pages/`
- admin pages under `src/pages/admin/`

## Interface and access behaviour visible in this source
- The app uses React Router routes for passenger pages, `/driver`, and the `/admin` module with nested admin pages.
- `ModuleSwitcher` determines the current app area from the URL.
- The passenger navbar and footer are shown only in the passenger area.
- `AuthContext` handles sign-in state and role profile data.
- `LoginForm` provides the admin username and driver ID login interface.
- Driver screens show assigned trips and provide trip actions such as start, delay, report issue and complete.
- Admin pages provide dashboard, bus, driver, route, schedule, trip, report and notification interfaces.

## Integration note
This is a selected UI/access contribution, not a complete standalone app. Some pages import data and Firebase helpers that are maintained in the other contribution folders. To run the full application, integrate all contributions into the main project and use the root project's `package.json` and Vite configuration.

## Suggested GitHub commit
`Add passenger, driver and admin interfaces with role access`

## Validation status
The files were copied from the supplied project ZIP. No new UI or authentication tests were run while preparing this package.
