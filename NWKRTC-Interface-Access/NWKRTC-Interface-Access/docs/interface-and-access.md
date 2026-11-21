# Interface and Access Notes

## App areas
The route structure in `src/App.jsx` separates the application into:
- Passenger: `/`, `/search`, `/live`, `/about`, `/routes`, `/contact`
- Driver: `/driver`
- Admin: `/admin` with nested management pages

## Session behaviour
The app observes the current route area and authentication profile. When a signed-in user moves to the passenger area, or the profile role does not match the current area, the app calls `logout()`.

## Login
`LoginForm.jsx` presents different labels for admin and driver login. It validates that the ID/username and password are present before calling the AuthContext login method. It displays friendly messages for common Firebase authentication errors.

## Role access
`AuthContext.jsx` is responsible for Firebase authentication state and user profile/role handling. The Firebase Realtime Database rules are maintained separately in the Data & Integrity contribution; UI checks must not be treated as a substitute for server-side database security rules.
