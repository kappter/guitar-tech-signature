# Guitar Tech Signature API

Backend API server for the Guitar Tech Signature project, providing AI-powered guitarist evaluation and insights.

## Features

- **AI-Powered Insights**: Generate natural language insights about guitarist technique signatures
- **Guitarist Comparison**: Compare multiple guitarists based on technique profiles
- **Recommendations**: Get similar guitarist suggestions based on technique patterns
- **Caching**: In-memory caching to reduce API costs and improve performance
- **CORS Support**: Cross-origin requests enabled for frontend integration

## Setup

### Prerequisites

- Node.js 18+ or compatible version
- OpenAI API key

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env` file with your OpenAI API key:
```bash
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

### Running the Server

Development mode:
```bash
pnpm dev
```

Production mode:
```bash
pnpm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### POST /api/insight

Generate AI-powered insight for a guitarist.

**Request Body:**
```json
{
  "guitarist": "Jimi Hendrix",
  "distribution": {
    "Beginner": 5,
    "Intermediate": 3,
    "Advanced": 4
  },
  "topTechniques": ["Feedback Control", "Bends", "Vibrato"],
  "style": "Psychedelic Rock"
}
```

**Response:**
```json
{
  "insight": "AI-generated insight text...",
  "guitarist": "Jimi Hendrix",
  "distribution": { ... }
}
```

### POST /api/compare

Compare multiple guitarists.

**Request Body:**
```json
{
  "guitarists": [
    {
      "name": "Jimi Hendrix",
      "style": "Psychedelic Rock",
      "topTechniques": ["Feedback Control", "Bends", "Vibrato"]
    },
    {
      "name": "Eddie Van Halen",
      "style": "Hard Rock",
      "topTechniques": ["Tapping", "Tremolo Arm Techniques", "Hammer-Ons"]
    }
  ]
}
```

**Response:**
```json
{
  "comparison": "AI-generated comparison text...",
  "guitarists": ["Jimi Hendrix", "Eddie Van Halen"]
}
```

### POST /api/recommend

Get similar guitarist recommendations.

**Request Body:**
```json
{
  "guitarist": {
    "name": "David Gilmour",
    "topTechniques": ["Bends", "Vibrato", "Feedback Control"]
  },
  "allGuitarists": [
    { "name": "Jimi Hendrix", "style": "...", "topTechniques": [...] },
    ...
  ]
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "name": "Jimi Hendrix",
      "reason": "Similar emphasis on expressive bending and feedback control",
      "appeal": "Fans of Gilmour's emotional playing will appreciate Hendrix's innovative approach"
    }
  ],
  "forGuitarist": "David Gilmour"
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-11T10:00:00.000Z"
}
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`

### Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Set environment variables in Railway dashboard
4. Deploy automatically on push

### Self-Hosted

Run with PM2 or similar process manager:
```bash
pm2 start server.js --name guitar-tech-api
```

## Configuration

Environment variables:

- `OPENAI_API_KEY` (required): Your OpenAI API key
- `PORT` (optional): Server port (default: 3000)

## Caching

The API implements in-memory caching with a 1-hour TTL to reduce API costs and improve performance. Cache is automatically cleared on server restart.

## Error Handling

All endpoints include error handling and fallback responses. If the AI service is unavailable, fallback insights are provided.

## Security

- API key is never exposed to the frontend
- CORS is enabled for cross-origin requests
- Request validation on all endpoints
- Rate limiting recommended for production (not implemented in this version)

## License

Same as parent project
