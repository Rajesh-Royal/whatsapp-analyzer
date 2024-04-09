# How to add/update/disable auth providers

- Navigate to the `auth.config.ts` in the project root and disable/enable/add/update the auth provider as per your need.
- The `auth.ts` as project root contains all the Auth v5 configurations, like custom pages, events, callbacks etc.
- To Edit public and auth routes update `routes.ts` in the project root.
- The middleware settings are in the `middleware.ts` file in the project root.
- Auth pages are inside `app/auth/*` folder.
- Auth actions like `login`, `signup` are in the `actions/**` folder.
- Auth hooks inside `hooks/` folder can be used to get current user session details.
- All the DB realted controllers are inside `data/` folder.

## Key Features

- 🔐 Next-auth v5 (Auth.js)
- 🚀 Next.js 14 with server actions
- 🔑 Credentials Provider
- 🌐 OAuth Provider (Social login with Google & GitHub)
- 🔒 Forgot password functionality
- ✉️ Email verification
- 📱 Two factor verification
- 👥 User roles (Admin & User)
- 🔓 Login component (Opens in redirect or modal)
- 📝 Register component
- 🤔 Forgot password component
- ✅ Verification component
- ⚠️ Error component
- 🔘 Login button
- 🚪 Logout button
- 🚧 Role Gate
- 🔍 Exploring next.js middleware
- 📈 Extending & Exploring next-auth session
- 🔄 Exploring next-auth callbacks
- 👤 useCurrentUser hook
- 🛂 useRole hook
- 🧑 currentUser utility
- 👮 currentRole utility
- 🖥️ Example with server component
- 💻 Example with client component
- 👑 Render content for admins using RoleGate component
- 🛡️ Protect API Routes for admins only
- 🔐 Protect Server Actions for admins only
- 📧 Change email with new verification in Settings page
- 🔑 Change password with old password confirmation in Settings page
- 🔔 Enable/disable two-factor auth in Settings page
- 🔄 Change user role in Settings page (for development purposes only)

[VIDEO TUTORIAL](https://youtu.be/1MTyCvS05V4)
