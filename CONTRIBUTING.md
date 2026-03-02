# Contributing to HandsOnLive

Thank you for your interest in contributing to HandsOnLive!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/julesindigo-web/handsonlive-gemini-live-agent-challenge-2026.git
   cd handsonlive-gemini-live-agent-challenge-2026
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp .env.example .env
   # Edit .env with your credentials

   # Frontend
   cp .env.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Run development servers**
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend (new terminal)
   cd frontend
   npm run dev
   ```

## Code Style

We use:
- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** for type safety

Run these before committing:
```bash
npm run lint
npm run format:check
npm run type-check
```

## Testing

Run tests before pushing:
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Commit Convention

We use semantic commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Maintenance tasks

Example:
```bash
git commit -m "feat: add AR overlay generation"
git commit -m "fix: resolve WebSocket connection timeout"
```

## Pull Request Process

1. Create a new branch from `main`
2. Make your changes
3. Run tests and ensure they pass
4. Commit with semantic messages
5. Push to your fork
6. Create a pull request
7. Wait for review

## Issue Reporting

When reporting issues, please include:
- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node version, etc.)

## Code of Conduct

Be respectful and constructive in all interactions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
