# Guild Master - Implementation Plan

This plan outlines the technical steps to build the initial prototype of "Guild Master".

## Goal Description
Create a functional prototype of the "Guild Master" game loop. The prototype will allow players to:
1.  View adventurers approaching the counter.
2.  Inspect their details (Adventurer Card).
3.  View available quests (Quest Board).
4.  Assign or Reject quests.
5.  See the results of the day.

## User Review Required
> [!IMPORTANT]
> **Tech Stack**:
> *   **Javascript/Canvas**: Vanilla JS is EXCELLENT for 2D pixel art. We will use the HTML5 Canvas API which is fast and supports pixel manipulation natively.
> *   **Assets**: I will specificially generate "Pixel Art" style assets for you to use.
> *   **Visuals**: We will use CSS `image-rendering: pixelated` to ensure the game looks crisp and retro, not blurry, even when zoomed in.

## Proposed Changes

### Core Structure
#### [NEW] [index.html](file:///C:/Users/farha/Project_Tavern_Master/index.html)
- Main entry point. Contains the canvas/div structure for the game view.

#### [NEW] [style.css](file:///C:/Users/farha/Project_Tavern_Master/style.css)
- Styling for the "Desk View", the cards, and the mood/atmosphere.

#### [NEW] [script.js](file:///C:/Users/farha/Project_Tavern_Master/script.js)
- Main entry point for the JS logic. Handles the "Day Loop".

### Game Logic Details
#### [NEW] [src/adventurer.js](file:///C:/Users/farha/Project_Tavern_Master/src/adventurer.js)
- `Adventurer` class.
- Random generation logic (names, classes, flawed equipment, hidden traits).
- **Persistence**: Has an `id` to track them across days.
- **History**: Stores `injuries` (e.g., "missing_arm") and `trust_level`.

#### [NEW] [src/quest.js](file:///C:/Users/farha/Project_Tavern_Master/src/quest.js)
- `Quest` class.
- Difficulty calculation and compatibility tags (e.g., "Requires FireResist").

#### [NEW] [src/game_manager.js](file:///C:/Users/farha/Project_Tavern_Master/src/game_manager.js)
- Handles the state (Gold, Rep, Day Count).
- `adventureRegistry`: A Map to store persistent adventurers by ID.
- logic for `calculateOutcome(adventurer, quest)`.
- logic for `giftItem(adventurer, item)`: Updates adventurer stats/equipment.

## Verification Plan

### Automated Tests
- Since this is a vanilla JS project, we will use simple browser-based verification initially.
- We can add unit tests later if logic becomes complex.

### Manual Verification
1.  **Launch**: Open `index.html` in the browser.
2.  **Visual Check**: Verify the desk, the adventurer, and the quest board appear.
3.  **Interaction**: Click a Quest, drag to Adventurer, confirm the "Assign" action works.
4.  **Loop**: End the day (button) and verifying a new day starts with new adventurers.
