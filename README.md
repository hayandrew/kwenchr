# Kwenchr 🍻

> **Get Your Drink On™** — The ultimate local drink special and event discovery platform.

Kwenchr is a modern Next.js web application designed to help users find and explore local bar events, drink specials, and happy hours. Users can search and filter events based on location/distance, date, and category tags, while promoters and venue hosts can create and manage their event listings.

---

## 🚀 Features

- **Location-Based Event Sorting**: Automatically calculates distance between the user's location and event venues to list the nearest specials first.
- **Interactive Date Picker**: Easily browse events scheduled for today or any specific calendar date.
- **Dynamic Category Filtering**: Filter by event tags, title, or description (e.g., Beer, Cocktails, Trivia, Live Music).
- **User Accounts & Authentication**: Session-based user sign-up, sign-in, and profile editing.
- **Promoter Dashboard**: Registered users can publish, edit, and manage their hosted events and bar specials.
- **Custom Vector Icon Font**: Automatic build script to bundle SVG icons into a custom lightweight webfont stylesheet.
- **Ad Integrations**: Pre-configured responsive banner and skyscraper ad components.
- **Comprehensive Testing Suite**: Fully tested code architecture including React components, Next.js page layouts, API routes, database utilities, and Mongoose schemas.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Database / ORM**: [Mongoose](https://mongoosejs.com/) / [MongoDB](https://www.mongodb.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icon Builder**: [svgtofont](https://github.com/jaywcjlove/svgtofont)
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)

---

## 📦 Getting Started

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

### 2. Install Dependencies

Clone the repository and install the project dependencies:

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory to store configuration variables. For local development:

```env
MONGODB_URI=mongodb://localhost/kwenchr
```

### 4. Seed the Database

Populate the database with initial dummy users and drink specials:

```bash
npm run seed
```

### 5. Build Custom Fonts (Optional)

If you modify or add any custom SVGs under `src/assets/icons/`, compile them into the webfont bundle:

```bash
npm run build:icons
```

### 6. Run the Development Server

Start the local server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 7. Run the Test Suite

Run unit and integration tests using Vitest:

```bash
npm run test
```

To run tests in watch mode for development:

```bash
npm run test:watch
```

---

## 📂 Project Structure

```text
kwenchr/
├── public/                 # Static assets (including compiled fonts)
├── scripts/                # Build and utility scripts (seeding, font compiler)
├── src/
│   ├── app/                # Next.js App Router and API routes (colocated with page/route tests)
│   │   ├── api/            # API Route Handlers (events, auth, profile)
│   │   ├── layout.js       # Main Root Layout
│   │   └── page.js         # Entry Home Route (MainDashboard)
│   ├── assets/             # Asset files
│   │   └── icons/          # Raw SVG icons (compiled to webfont)
│   ├── components/         # Reusable React components and unit tests
│   ├── data/               # Static/fallback mock data
│   ├── lib/                # Database connection, seeding utilities, and tests
│   ├── models/             # Mongoose schemas and model tests
│   └── styles/             # Application styles (globals.css, compiled fonts.css)
├── tests/                  # Test framework environment setup (setup.js)
├── eslint.config.mjs       # ESLint configuration
└── package.json            # Scripts and dependency lists
```

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
|:---|:---|
| `npm run dev` | Runs the app in development mode on `http://localhost:3000`. |
| `npm run build` | Builds the Next.js production application. |
| `npm run start` | Starts the production server. |
| `npm run lint` | Runs ESLint to check for code issues. |
| `npm run seed` | Runs the standalone Mongoose script to seed database collections. |
| `npm run build:icons` | Compiles raw SVGs from `src/assets/icons` into standard webfonts. |
| `npm run test` | Runs the Vitest test suite once. |
| `npm run test:watch` | Starts Vitest in interactive watch mode. |

