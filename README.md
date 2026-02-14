A sophisticated video wall configuration calculator that determines optimal cabinet arrangements based on user-specified parameters. Built with Next.js 14, TypeScript, and enhanced with AI capabilities through WebMCP integration.

## 🎬 Demo & Documentation

- **📹 Live Demo**: [Add your deployed URL here]
- **🎥 Loom Walkthrough**: [Add your Loom video link here]


## ✨ Features

### Core Functionality
- **Flexible Input**: Choose any 2 parameters from Aspect Ratio, Height, Width, and Diagonal
- **Smart Calculation**: Automatically derives missing dimensions using Pythagorean theorem
- **Dual Results**: Provides both "closest lower" and "closest upper" cabinet configurations
- **Visual Grid**: Shows cabinet layout with exact row/column counts
- **Unit Conversion**: Supports millimeters, meters, feet, and inches with automatic conversion
- **Multiple Cabinet Types**: 16:9 (600×337.5mm) and 1:1 (500×500mm) cabinets

### AI Integration (WebMCP)
- **Embedded AI Agent**: Chat interface for natural language queries
- **Tool Integration**: AI can call calculator functions directly
- **Voice-Ready**: Prepared for voice mode interactions

##Enhancements that can be done: 
- **UI-Driven Automation**: Agent can directly control and interact with the calculator UI
- **No Third-Party Tools**: Eliminates security vulnerabilities from browser automation libraries like Playwright, Puppeteer, or Selenium
- **Native Integration**: Built-in understanding of application state and components without external dependencies

## 🧮 Technical Highlights

### Advanced Calculation Logic

#### 1. **Pythagorean Theorem for Dimension Derivation**
When users provide any two parameters, the system calculates missing dimensions:
```typescript
// Example: Given height and diagonal
width = sqrt(diagonal² - height²)
```

#### 2. **Continued Fraction Convergents for Aspect Ratio**
For non-standard aspect ratios, finds the best integer grid approximation:
```typescript
// Example: 2.35:1 → 7 columns × 3 rows (2.33:1)
```

#### 3. **Normalized Combined Scoring**
Balances dimensional accuracy and aspect ratio matching:
```typescript
score = |dimension_error| / target_dimension + |aspect_ratio_error| / target_aspect_ratio
```

#### 4. **Intelligent Classification**
- **Lower**: Largest grid that fits within target dimensions
- **Upper**: Smallest grid that meets/exceeds target
- **Edge Cases**: Handles exact matches correctly

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (100% type coverage)
- **UI**: shadcn/ui components
- **Styling**: Tailwind CSS
- **AI Integration**: WebMCP standard compliance
- **State Management**: React hooks
- **Validation**: Zod schemas

## 📁 Project Structure

```
godspeed-tech-assignment/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main calculator page
│   └── globals.css         # Global styles
├── components/
│   ├── CabinetSelector.tsx       # Cabinet type selection
│   ├── UnitSelector.tsx          # Unit conversion UI
│   ├── ParameterInputs.tsx       # Input parameter controls
│   ├── ResultsDisplay.tsx        # Results presentation
│   ├── GridDiagram.tsx           # Visual cabinet grid
│   ├── WebMCPProvider.tsx        # WebMCP root provider
│   ├── EmbeddedAgent.tsx         # AI agent widget
│   ├── VideoWallTools.tsx        # WebMCP tool registration
│   └── CryptoPolyfill.tsx        # Browser API polyfill
├── lib/
│   ├── calculator.ts       # Core calculation logic (300 lines)
│   ├── types.ts           # TypeScript interfaces
│   ├── constants.ts       # Cabinet specs, presets
│   └── units.ts           # Unit conversion utilities
└── docs/
    ├── SPEC_CHECKLIST.md          # Specification compliance
    ├── LOOM_SCRIPT.md             # Video recording script
    ├── LOOM_TALKING_POINTS.md     # Quick reference guide
    └── WEBMCP_IMPLEMENTATION_PLAN.md  # AI integration plan
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd godspeed-tech-assignment

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Optional: Enable AI Agent

Create a `.env.local` file:
```env
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-your-api-key
```

Restart the dev server to activate the embedded AI agent.

## 🧪 Testing the Calculator

### Example Test Cases

**Test 1: Standard 16:9 Wall**
- Cabinet: 16:9
- Unit: Inches
- Height: 100 in
- Width: 177 in
- Expected: Multiple valid grid configurations

**Test 2: Aspect Ratio Input**
- Cabinet: 16:9
- Aspect Ratio: 21:9 (2.333)
- Height: 2000 mm
- Expected: Grids approximating 21:9 ratio

**Test 3: Diagonal Calculation**
- Cabinet: 1:1
- Diagonal: 5000 mm
- Width: 3500 mm
- Expected: Derived height using Pythagorean theorem

**Test 4: AI Agent Query**
Ask the agent: "What's the configuration for a 16:9 wall that's 100 inches tall and 177 inches wide?"

## 📊 Algorithm Performance

- **Search Space**: O(n×m) where n,m are reasonable bounds around target
- **Scoring**: O(1) per configuration
- **Overall Complexity**: Linear in practice due to bounded search
- **Accuracy**: 0.01mm tolerance for floating-point comparisons

## 🤖 AI-Accelerated Development

This project was built in **8-10 hours** with AI assistance (Claude/Cursor), representing **50-60% time savings**:

| Area | Time Saved | AI Contribution |
|------|------------|-----------------|
| Mathematical Algorithms | 2-3h | Suggested Pythagorean theorem, continued fractions |
| Complex Logic | 3-4h | Refined scoring, edge case handling |
| Next.js + WebMCP | 2-3h | SSR patterns, polyfills, integration guidance |
| Type Safety | 1-2h | Interface design, generic types |
| Debugging | 2-3h | Logic tracing, edge case discovery |

## 🏗️ Architecture Decisions

### Why Pythagorean Theorem?
Provides mathematically exact solutions for dimension derivation, ensuring accuracy regardless of input combination.

### Why Continued Fractions?
Offers optimal rational approximations for arbitrary aspect ratios, finding the best integer grid without exhaustive search.

### Why Normalized Scoring?
Prevents bias toward either dimensional or aspect ratio accuracy by scaling both factors equally.

### Why WebMCP?
Demonstrates forward-thinking AI integration using W3C standards, making the calculator accessible through natural language.
https://webmcp.sh/

#### UI Automation Without Security Risks

The WebMCP agent provides a **secure alternative to traditional browser automation tools**:

**Security Advantages:**
- ❌ **No Playwright/Selenium Required**: Eliminates external automation dependencies that can introduce security vulnerabilities
- ✅ **Direct UI Control**: Agent operates within the application's security context
- ✅ **No Headless Browser Risks**: Avoids attack vectors associated with browser automation frameworks
- ✅ **Reduced Attack Surface**: Fewer third-party dependencies mean fewer potential security holes
- ✅ **Native DOM Access**: Safer than screen scraping or element detection methods

**Capabilities:**
- Automated testing without external tools
- Form filling and data entry automation
- Interactive user onboarding
- UI state inspection and debugging
- Guided tours and help systems

This approach provides a more **secure, integrated, and maintainable** solution compared to traditional browser automation frameworks while still enabling powerful UI-driven interactions.


