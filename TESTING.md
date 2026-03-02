# HandsOnLive Testing Guide

## Test Suite Overview

This document outlines the testing strategy for HandsOnLive.

## Test Structure

```
backend/src/__tests__/
├── services.test.ts      # Backend service tests
├── agents.test.ts        # Agent tests
└── websocket.test.ts     # WebSocket tests

frontend/src/__tests__/
├── frontend.test.ts      # Frontend integration tests
├── components.test.ts     # Component tests
└── hooks.test.ts         # Hook tests
```

## Running Tests

### Backend Tests

```bash
cd backend
npm test
npm run test:watch
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:watch
npm run test:coverage
```

### All Tests

```bash
npm run test:all
```

## Test Categories

### Unit Tests

- **RAGService**: Knowledge base search, embedding generation
- **ToolCallingService**: Tool execution, error handling
- **AROverlayService**: Visual guidance generation
- **AgentMemoryService**: Session persistence, feedback storage

### Integration Tests

- Complete workflow testing
- Service integration
- Error scenario handling

### E2E Tests

- Video streaming workflow
- Audio recording workflow
- WebSocket communication
- AR overlay display

## Coverage Goals

- Backend: >80% coverage
- Frontend: >75% coverage
- Critical paths: >90% coverage

## CI/CD Integration

Tests run automatically on:
- Pull request creation
- Push to main branch
- Deployment

## Manual Testing Checklist

### Phase 1 MVP
- [ ] Video streaming works
- [ ] Audio streaming works
- [ ] WebSocket connection stable
- [ ] AI feedback displays correctly
- [ ] Demo mode functional

### Phase 2 Features
- [ ] RAG search returns relevant results
- [ ] Agent memory persists sessions
- [ ] Tool calling executes correctly
- [ ] Multi-skill support works

### Phase 3 Features
- [ ] AR overlays display correctly
- [ ] Error handling works
- [ ] Deployment script executes
- [ ] Health checks pass

## Performance Testing

- Video streaming latency: <200ms
- Audio streaming latency: <200ms
- WebSocket message latency: <100ms
- API response time: <500ms

## Load Testing

- Concurrent users: 100+
- Sessions per minute: 50+
- Video frames per second: 30
- Audio chunks per second: 10
