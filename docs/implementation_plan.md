# Implementation Plan: Project Tavern Master Evolution

This document outlines the step-by-step roadmap to transform the prototype into the "Weekly Survival Strategy" game defined in the Deep Dive Concept.

---

## 1. Core Architecture Changes
We need to shift from "Infinite Generation" to "Stateful Management".

**New Systems Required:**
*   `TownManager.js`: Manages the pool of available adventurers in town (The "Deck").
*   `CycleManager.js`: Tracks Days (1-7), Weeks, and Quotas.
*   `VisitorSystem.js`: Handles special narrative NPCs (Widows, Guards) before the recruit loop.

---

## 2. Phased Rollout Plan

### **Phase 1: The Finite Town Pool (The Foundation)**
*Objective*: Stop infinite random adventurer spawning. Make the list of candidates finite and persistent for the week.
*   **Step 1.1 - Data Model**: Create `TownManager` class. On `init()`, generate 12 Adventurers and store them in `townRoster`.
*   **Step 1.2 - Visitor Queue**: Logic to shuffle `townRoster` and present a daily "Queue" of 4-5 visitors.
*   **Step 1.3 - Persistence**:
    *   If **Recruited**: Move from `TownRoster` to `GuildRoster`.
    *   If **Dismissed**: Return to `TownRoster` (Can appear again tomorrow).
    *   If **Rejected/Banned**: Remove from `TownRoster` permanently (Optional feature).
*   **Step 1.4 - UI Updates**: Add a "Town Census" counter (e.g., "7 Adventurers in town") to the HUD.
*   **Result**: You will notice "Garrett" coming back the next day if you didn't hire him.

### **Phase 2: The Weekly Cycle & Quota**
*Objective*: Add the "Lose Condition" and Time Pressure.
*   **Step 2.1 - Cycle Logic**: Track `CurrentDay` (1-7).
*   **Step 2.2 - Experience Quota**: Start of Week -> Generate Goal (e.g., "Pay 200G Taxes").
*   **Step 2.3 - End of Week**:
    *   If Gold >= Quota -> `Week++`, New Quota, Generate New Town Pool.
    *   If Gold < Quota -> Game Over Screen.
*   **Step 2.4 - UI Updates**: Update Top Bar to show "Day 2/7" and "Quota: 200G".

### **Phase 3: Morning Visitors (Narrative)**
*Objective*: Add "Yes, Your Grace" style dilemmas.
*   **Step 3.1 - Visitor Event System**: Before the "Recruit" phase starts, check for a Special Visitor.
*   **Step 3.2 - Dialog UI**: Create a new Overlay/Screen for Conversation (Portrait + Text + 2 Choices).
*   **Step 3.3 - Integration**:
    *   Widow: "My husband died." -> Give 50G / Kick Out.
    *   Guard: "Bribe me." -> Pay 20G / Refuse (Lose Rep).

### **Phase 4: RPG Progression (Veterancy)**
*Objective*: Make keeping heroes alive valuable.
*   **Step 4.1 - Leveling**: Add `XP` and `Level` to Adventurer data.
*   **Step 4.2 - Growth**: On Quest Success, gain XP. Level Up increases STR/DEX/INT.
*   **Step 4.3 - Visuals**: Add "Level Badge" to Roster Card.

---

## 3. Recommended "First Bite"
**Start with Phase 1 (The Finite Town Pool).**
It changes the fundamental feeling of the game from "Rolling Dice" to "Managing a Deck". It requires no major UI overhaul, just logic wiring in `index.html` and a new system file.

**Tasks:**
1.  Create `js/systems/Town.js`.
2.  Modify `index.html` to instantiate `TownManager`.
3.  Modify `Input.js` / `NextAdventurer` logic to pull from `TownManager` instead of `Generator`.
