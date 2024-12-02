# Getting Started with PawSpace

## Installation

```bash
# Clone the repository
git clone https://github.com/your-org/pawspace.git
cd pawspace

# Install dependencies
npm install
```

## Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the following variables in `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`

## Running the Application

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.
