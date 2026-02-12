# Guitar Tech Signature - AI Enhanced

**Guitar Tech Signature** is an exploratory web application that profiles guitarists based on the **distribution of playing techniques** that define their musical identity. This enhanced version includes **AI-powered evaluation** to generate intelligent insights about guitarist technique signatures.

## 🆕 What's New: AI Enhancement

This enhanced version adds intelligent analysis capabilities while maintaining the project's core philosophy of technique-focused, non-ranking evaluation.

### AI Features

**Intelligent Insights**: Instead of static descriptions, the app now generates contextual, AI-powered insights about each guitarist's technique signature. The AI analyzes technique distributions and creates natural language descriptions that capture what makes each guitarist unique.

**Dynamic Analysis**: The AI considers technique tier distribution (Beginner/Intermediate/Advanced), top techniques with confidence scores, musical style context, and technique category patterns to provide nuanced insights that go beyond simple statistics.

**Fallback System**: If the AI service is unavailable, the app seamlessly falls back to rule-based insights, ensuring the application always provides value to users.

## 🎸 Project Philosophy

Great guitarists are not defined by how many notes they play, but by **which techniques they rely on** and **how intentionally they use them**.

Many forms of mastery become invisible over time. Foundational techniques fade into muscle memory, expressive gestures are used sparingly but meaningfully, and advanced techniques often appear less frequently yet carry disproportionate impact. This project aims to surface those patterns through data, visualization, and intelligent analysis.

## 📊 Expanded Database

The enhanced version includes technique profiles for eleven legendary guitarists:

- **Adam Jones** (Tool) - Alternative Metal
- **Jimi Hendrix** - Psychedelic Rock
- **Eddie Van Halen** - Hard Rock
- **David Gilmour** (Pink Floyd) - Progressive Rock
- **Stevie Ray Vaughan** - Blues Rock
- **Steve Vai** - Instrumental Rock
- **Mark Knopfler** (Dire Straits) - Rock/Country
- **John Petrucci** (Dream Theater) - Progressive Metal
- **Jimmy Page** (Led Zeppelin) - Hard Rock
- **Eric Clapton** - Blues Rock
- **B.B. King** - Blues

Each guitarist has detailed technique data with confidence scores based on interviews, live performance analysis, and expert sources.

## 🏗 Architecture

### Frontend (Static Site)

The frontend is a vanilla JavaScript application with no framework dependencies:

- **HTML/CSS/JavaScript**: Clean, modern interface
- **Modular Design**: Separate modules for data loading, evaluation, visualization, and AI integration
- **Responsive**: Works on desktop and mobile devices
- **Progressive Enhancement**: Works without AI, enhanced with AI when available

### Backend (Node.js API)

A lightweight Express.js server provides AI capabilities:

- **OpenAI Integration**: Uses GPT-4.1-mini for intelligent analysis
- **Caching**: In-memory caching reduces API costs and improves performance
- **Error Handling**: Graceful fallbacks ensure reliability
- **CORS Support**: Enables cross-origin requests from the frontend

## 🚀 Getting Started

### Frontend Only (No AI)

Simply open `index.html` in a web browser. The app will work with rule-based fallback insights.

Or serve with a local server:
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

### With AI Features

1. **Set up the backend API**:
```bash
cd api
pnpm install
```

2. **Configure environment**:
Create `api/.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

3. **Start the API server**:
```bash
cd api
pnpm start
```

4. **Serve the frontend**:
```bash
# In the root directory
python -m http.server 8000
```

5. **Open the app**:
Visit `http://localhost:8000` in your browser

The frontend will automatically detect the API and enable AI features.

## 📁 Project Structure

```
guitar-tech-signature/
├── index.html              # Main HTML file
├── css/
│   ├── reset.css          # CSS reset
│   └── styles.css         # Main styles with animations
├── js/
│   ├── app.js             # Main application logic
│   ├── dataLoader.js      # CSV data loading
│   ├── evaluator.js       # Technique analysis
│   ├── visualizer.js      # Chart rendering
│   ├── aiEvaluator.js     # AI integration (NEW)
│   └── utils.js           # Utility functions
├── data/
│   ├── guitarists.csv     # Guitarist profiles (11 guitarists)
│   ├── techniques.csv     # 60+ technique definitions
│   └── sources.csv        # Technique observations (100+ entries)
├── api/                   # Backend API server (NEW)
│   ├── server.js          # Express server with AI
│   ├── package.json       # Dependencies
│   ├── .env              # Configuration (create this)
│   └── README.md         # API documentation
└── assets/
    └── icons/            # Favicon and icons
```

## 🔧 Technical Details

### Data Model

**Guitarists** have an ID, name, and style/genre.

**Techniques** include name, category (Foundational, Expressive, Textural, Harmonic, Rhythmic, Advanced), tier (Beginner, Intermediate, Advanced), contextual flag, and description.

**Sources** track guitarist name, technique used, source type (Guitar Tech Interview, Live Performance Analysis, Song Analysis), confidence score (0-1), and contextual notes.

### AI Integration

The AI evaluator module communicates with the backend API to generate insights. It includes retry logic for failed requests, caching for repeated queries, fallback to rule-based insights if API is unavailable, and loading states for better UX.

The backend API constructs prompts with technique distribution data, generates insights using OpenAI's GPT-4.1-mini, caches responses to reduce costs, and handles errors gracefully with fallbacks.

## 🎯 Future Enhancements

Potential additions to the AI-enhanced version:

**Guitarist Comparison Tool**: Side-by-side comparison of multiple guitarists with AI-generated analysis of similarities and differences.

**Recommendation Engine**: "If you like X, you might like Y" suggestions based on technique patterns.

**Learning Path Generator**: AI-suggested technique progression paths based on favorite guitarists.

**Technique Deep Dives**: Detailed AI-generated explanations of how specific guitarists use particular techniques.

**Community Contributions**: Allow users to submit technique observations with AI-assisted validation.

## 🔍 What This Project Is (and Is Not)

### This project **is**:
- A technique-centric lens for understanding guitarists
- A data-driven visualization of musical identity enhanced with AI
- An educational tool for musicians, students, and educators
- A foundation for comparing technique distributions, not skill hierarchies

### This project is **not**:
- A leaderboard or rating system
- A "shred" or speed comparison tool
- A genre-biased evaluation
- A judgment of musical worth

## 📝 Adding New Guitarists

To add a new guitarist to the database:

1. **Add to guitarists.csv**:
```csv
slash,Slash,Hard Rock
```

2. **Add technique observations to sources.csv**:
```csv
Slash,Bends,Live Performance Analysis,0.95,Signature blues-rock bends
Slash,Vibrato,Live Performance Analysis,0.9,Wide expressive vibrato
Slash,Alternate Picking,Guitar Tech Interview,0.85,Clean picking technique
...
```

Include 8-12 techniques with confidence scores based on reliable sources.

## 🌐 Deployment

### Frontend (GitHub Pages)

The frontend can be deployed to GitHub Pages as a static site:

```bash
git add .
git commit -m "AI-enhanced version"
git push origin main
```

Enable GitHub Pages in repository settings.

### Backend (Vercel/Railway)

Deploy the API to Vercel, Railway, or similar platforms:

**Vercel**:
```bash
cd api
vercel
```

**Railway**: Connect GitHub repo and deploy automatically.

Update `js/aiEvaluator.js` with your deployed API URL:
```javascript
const API_BASE_URL = 'https://your-api-domain.com';
```

## 📄 License

ISC

## 🙏 Acknowledgments

This project is built on the foundation of technique analysis and data-driven evaluation. The AI enhancement adds intelligent insights while respecting the core philosophy of technique-focused, non-ranking guitarist profiling.

Special thanks to the guitar community for technique breakdowns, interviews, and educational content that make this data collection possible.

---

**Guitar Tech Signature • Technique over theatrics • Now with AI-powered insights**
