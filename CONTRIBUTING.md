# Contributing to Semantic Compare App

Thank you for your interest in contributing to Semantic Compare App! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- A modern code editor (VS Code recommended)

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/semantic-compare-app.git
   cd semantic-compare-app
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Open your browser** to `http://localhost:3000`

### Project Structure

```
semantic-compare-app/
├── src/
│   ├── components/          # React components
│   │   ├── InfoTooltip.tsx  # Interactive help tooltips
│   │   └── ...
│   ├── lib/                 # Core logic and utilities
│   │   ├── api.ts          # Main comparison API
│   │   ├── parsers/        # Format-specific parsers
│   │   └── ...
│   ├── App.tsx             # Main application component
│   ├── App.css             # Global styles
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── docs/                   # Documentation
└── dist/                   # Built application (generated)
```

## 🛠️ Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is handled automatically
- **Naming**: Use descriptive, camelCase variable names
- **Comments**: Add JSDoc comments for public functions

### Component Guidelines

- **Functional Components**: Use React functional components with hooks
- **Props Interface**: Define TypeScript interfaces for all component props
- **CSS Modules**: Use CSS files for component-specific styles
- **Accessibility**: Ensure components are accessible (ARIA labels, keyboard navigation)

### Testing

- **Unit Tests**: Write tests for utility functions and core logic
- **Component Tests**: Test React components with React Testing Library
- **Integration Tests**: Test complete user workflows
- **Run Tests**: `npm test` to run the test suite

### Performance

- **Bundle Size**: Keep bundle size minimal
- **Lazy Loading**: Use dynamic imports for large dependencies
- **Memory Usage**: Avoid memory leaks in long-running operations
- **Optimization**: Profile and optimize performance-critical code

## 📝 Making Changes

### Branch Naming

- **Feature**: `feature/description-of-feature`
- **Bug Fix**: `fix/description-of-fix`
- **Documentation**: `docs/description-of-change`
- **Refactor**: `refactor/description-of-refactor`

### Commit Messages

Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(parser): add CSV format support`
- `fix(ui): resolve tooltip positioning issue`
- `docs(readme): update installation instructions`

### Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the guidelines above
3. **Test thoroughly** - ensure all tests pass
4. **Update documentation** if needed
5. **Submit a pull request** with:
   - Clear title and description
   - Screenshots for UI changes
   - Test results
   - Breaking change notes (if any)

## 🐛 Reporting Issues

### Bug Reports

Include:
- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Browser and version** information
- **Sample files** that demonstrate the issue (if applicable)

### Feature Requests

Include:
- **Use case description** - why is this needed?
- **Proposed solution** - how should it work?
- **Alternatives considered** - what other approaches were considered?
- **Additional context** - mockups, examples, etc.

## 🔧 Areas for Contribution

### High Priority
- **New Format Support**: Add parsers for additional file formats
- **Performance Optimization**: Improve comparison speed for large files
- **Accessibility**: Enhance keyboard navigation and screen reader support
- **Mobile Experience**: Improve touch interactions and responsive design

### Medium Priority
- **Advanced Options**: Add more comparison configuration options
- **Export Features**: Add ability to export diff results
- **Themes**: Add dark mode and custom themes
- **Internationalization**: Add support for multiple languages

### Documentation
- **API Documentation**: Improve and expand API docs
- **Tutorials**: Create step-by-step guides
- **Examples**: Add more real-world usage examples
- **Video Guides**: Create video tutorials

## 📚 Resources

- **React Documentation**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Vite Guide**: https://vitejs.dev/guide/
- **Testing Library**: https://testing-library.com/docs/react-testing-library/intro/

## 🎉 Recognition

Contributors will be:
- **Listed in README**: All contributors are acknowledged
- **GitHub Contributors**: Automatically tracked by GitHub
- **Release Notes**: Significant contributions mentioned in releases

## 📞 Getting Help

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Code Review**: Maintainers will provide feedback on pull requests

Thank you for contributing to Semantic Compare App! 🚀
