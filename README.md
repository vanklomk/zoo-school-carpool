# Zoo School Carpool

A React application for managing carpooling arrangements for zoo school activities.

## Environment Variables

This project requires the following environment variables to be set for the React app to connect to the Supabase backend:

- `REACT_APP_SUPABASE_URL` - The URL for your Supabase project
- `REACT_APP_SUPABASE_ANON_KEY` - The anonymous/public key for your Supabase project

### Setup

1. Copy `.env.example` to `.env.local`
2. Replace the placeholder values with your actual Supabase credentials
3. The `.env.local` file should never be committed to version control

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables as described above

3. Start the development server:
   ```bash
   npm start
   ```

The app will open at [http://localhost:3000](http://localhost:3000).

## Technologies Used

- React
- Tailwind CSS
- Supabase
- Lucide React (for icons)
