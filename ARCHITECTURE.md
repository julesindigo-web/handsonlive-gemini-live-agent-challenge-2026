# HandsOnLive Architecture Documentation

## System Overview

HandsOnLive is a real-time AI-powered skills mentor that uses Gemini Live API to provide hands-on coaching for practical skills through video and audio analysis.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js 15)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Components                                        │  │
│  │  - Learn Page (video streaming UI)                        │  │
│  │  - About Page (project info)                              │  │
│  │  - Agent Response Display                                 │  │
│  │  - AR Overlay Components                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Custom Hooks                                            │  │
│  │  - useMediaStream (camera/mic access)                    │  │
│  │  - useAudioRecorder (audio capture)                       │  │
│  │  - useWebSocket (real-time communication)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  WebSocket Client                                        │  │
│  │  - Video frame streaming (base64)                        │  │
│  │  - Audio chunk streaming                                │  │
│  │  - Interruption handling                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ WebSocket (ws://)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Express + Node.js)                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  WebSocket Server (ws)                                    │  │
│  │  - Connection management                                │  │
│  │  - Session handling                                      │  │
│  │  - Message routing                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  LiveHandler                                             │  │
│  │  - Session lifecycle management                          │  │
│  │  - Video frame processing                                │  │
│  │  - Audio chunk processing                                │  │
│  │  - AR overlay generation                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GeminiLiveAgent                                         │  │
│  │  - Video analysis                                        │  │
│  │  - Audio analysis                                        │  │
│  │  - RAG integration                                      │  │
│  │  - Tool calling                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│  Google Cloud    │  │    Firestore   │  │     Redis      │
│  Gemini API      │  │    Database   │  │   (Optional)   │
│                 │  │               │  │                │
│  - Gemini 2.0    │  │  - Sessions    │  │  - Session     │
│  - Imagen 3      │  │  - Messages    │  │    Cache       │
│  - Embeddings    │  │  - Feedback    │  │  - Rate Limit  │
└─────────────────┘  └─────────────────┘  └────────────────┘
```

## Component Details

### Frontend (Next.js 15)

**Pages:**
- `/` - Landing page with hero section and features
- `/learn` - Live coaching interface with video streaming
- `/about` - Project information and team details

**Core Services:**
- `useMediaStream`: Camera and microphone access with MediaDevices API
- `useAudioRecorder`: Audio capture using MediaRecorder API
- `useWebSocket`: WebSocket client for real-time communication

**UI Components:**
- Video player with AR overlay support
- Audio recording indicator
- Agent response display
- Skill and language selectors

### Backend (Express + Node.js)

**WebSocket Handler:**
- Manages WebSocket connections
- Routes messages to appropriate handlers
- Handles session lifecycle

**GeminiLiveAgent:**
- Processes video frames for visual analysis
- Processes audio chunks for speech analysis
- Integrates with RAG for knowledge retrieval
- Executes tool calls for external APIs

**Services:**

1. **RAGService**
   - Embeds documents using Gemini embeddings
   - Performs vector search with cosine similarity
   - Supports skill-specific knowledge bases

2. **AgentMemoryService**
   - Persists session messages to Firestore
   - Stores user feedback
   - Retrieves session context and history

3. **ToolCallingService**
   - Executes nutrition calculations
   - Retrieves recipe information
   - Performs unit conversions

4. **AROverlayService**
   - Generates visual guidance overlays
   - Creates step-by-step guides
   - Supports multiple languages

5. **ErrorHandler**
   - Categorizes errors (network, validation, auth, rate limit)
   - Implements retry logic
   - Provides user-friendly error messages

### Data Flow

**Video Streaming:**
1. Frontend captures video frames (30fps)
2. Encodes frames to base64
3. Sends via WebSocket to backend
4. Backend processes with GeminiLiveAgent
5. Returns AI feedback and AR overlays
6. Frontend displays results

**Audio Streaming:**
1. Frontend captures audio chunks
2. Encodes to base64
3. Sends via WebSocket to backend
4. Backend processes with GeminiLiveAgent
5. Returns AI response
6. Frontend displays text response

**RAG Integration:**
1. User asks question or performs action
2. RAGService searches knowledge base
3. Relevant documents retrieved
4. Context passed to Gemini model
5. Enhanced response generated

**Tool Calling:**
1. Gemini model identifies tool need
2. ToolCallingService executes tool
3. Results returned to model
4. Response formatted for user

### Database Schema

**Firestore Collections:**

```
sessions/
  ├── sessionId (document)
  │   ├── userId: string
  │   ├── skill: string
  │   ├── language: string
  │   ├── messages: Message[]
  │   │   ├── role: 'user' | 'agent'
  │   │   ├── content: string
  │   │   ├── timestamp: number
  │   ├── feedback: Feedback[]
  │   │   ├── helpful: number
  │   │   ├── accuracy: number
  │   │   ├── clarity: number
  │   ├── createdAt: number
  │   └── updatedAt: number
```

**Redis Cache:**
- Session data (TTL: 1 hour)
- Rate limiting (TTL: 15 minutes)
- User preferences (TTL: 24 hours)

### Performance Optimization

**Frontend:**
- Lazy loading for components
- Image optimization with Next.js Image
- Web Workers for video processing
- Debouncing for user inputs

**Backend:**
- Redis caching for frequent queries
- Connection pooling for Firestore
- Compression for WebSocket messages
- Async processing for heavy operations

### Security

**Authentication:**
- JWT token validation
- Session-based authentication
- Rate limiting per user

**Data Protection:**
- Encrypted WebSocket connections (WSS)
- Environment variable management
- Input validation and sanitization
- CORS configuration

**API Security:**
- API key rotation
- Request signing
- IP whitelisting (optional)

### Scalability

**Horizontal Scaling:**
- Stateless WebSocket handlers
- Load balancer support
- Redis for shared state
- Cloud Run auto-scaling

**Vertical Scaling:**
- Configurable memory/CPU limits
- Database connection pooling
- Optimized query patterns

### Monitoring

**Logging:**
- Structured logging with Winston
- Log levels: error, warn, info, debug
- Request/response logging
- Error tracking

**Metrics:**
- Session duration
- Frame processing time
- Audio chunk latency
- API response times
- Error rates

**Alerts:**
- High error rate
- Slow response times
- Connection failures
- Resource exhaustion

### Deployment

**Cloud Run Configuration:**
- Backend: 512Mi memory, 1 CPU
- Frontend: 512Mi memory, 1 CPU
- Min instances: 1
- Max instances: 10
- Auto-scaling enabled

**Environment Variables:**
- `GEMINI_API_KEY`: Gemini API access
- `GOOGLE_CLOUD_PROJECT`: GCP project ID
- `FIRESTORE_DATABASE`: Firestore database name
- `REDIS_HOST`: Redis host (optional)
- `REDIS_PORT`: Redis port (optional)

**CI/CD:**
- Automated testing on PR
- Deployment on merge to main
- Health checks on deploy
- Rollback on failure

## Technology Stack

**Frontend:**
- Next.js 15.2 (React framework)
- React 19 (UI library)
- TypeScript 5.5 (type safety)
- Tailwind CSS 4.0 (styling)
- shadcn/ui (components)
- Zustand (state management)
- TanStack Query (data fetching)

**Backend:**
- Express.js (web framework)
- Node.js (runtime)
- TypeScript 5.5 (type safety)
- ws (WebSocket)
- Winston (logging)

**AI/ML:**
- Gemini 2.0 Flash (multimodal AI)
- Imagen 3 (image generation)
- Gemini Embeddings (vector search)

**Database:**
- Firestore (primary database)
- Redis Memorystore (cache)

**Infrastructure:**
- Google Cloud Run (serverless)
- Google Cloud SDK (deployment)
- Cloud Logging (monitoring)
- Cloud Monitoring (metrics)

## Development Workflow

**Local Development:**
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

**Testing:**
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

**Deployment:**
```bash
# Automated deployment
./deploy.sh

# Manual deployment
gcloud run deploy [service-name] --source .
```

## Future Enhancements

**Phase 4 (Post-Competition):**
- Computer Use integration
- Imagen 3 video generation
- Real-time translation
- Social impact dashboard
- Mobile app (React Native)
- Advanced AR with MediaPipe
- Multi-user sessions
- Skill marketplace
