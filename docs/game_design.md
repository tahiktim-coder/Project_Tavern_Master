# Game Design: "Guild Master" (Working Title)

## 1. Core Concept
A narrative simulation game where you play as a Guild Master in a fantasy world. Your job is to match adventurers with quests. The gameplay loop is inspired by *Papers, Please*, emphasizing observation, interrogation, and resource management over direct combat.

**The Twist:** You aren't the hero. You are the HR manager for heroes. And if you do your job poorly, people die, and their families come knocking.

## 2. The Game Loop ("Digging Deep")

The game takes place over a series of days. Each day follows a strict phase structure:

### Phase 1: Morning Briefing (The Info Gathering)
*   **Guild News**: "The King requires 3 dragons slain this week." (Quota system).
*   **Daily Intel/Rumors**:
    *   "Heavy rain in the Swamp of Sorrows." (Implication: Heavy armor risks drowning, Fire magic is weak).
    *   "Goblins have stolen a shipment of poison." (Implication: Antidotes required for goblin quests today).
*   **Resource Check**: You check your stock of Potions, Tips (Intel), and Gold.

### Phase 2: The Counter (The Core Gameplay)
This is the *Papers, Please* view. A desk, a line of people, stamps, and documents.

**The Actors:**
1.  **The Adventurer**: Stands before you.
    *   **Visuals**: What they wear (Plate mail? Rags? Magic robes?).
    *   **Dialogue**: "I'm ready for anything!" or "I... I just need money for my sick mom."
2.  **The Documents**:
    *   **Adventurer Card**: Name, Class, Level, Alignment (maybe hidden), Stats (STR, INT, etc.).
    *   **The Quest Board**: A stack of available quests (Slay Rat, Kill Dragon, Escort Merchant).

**The Process:**
1.  **Interview**:
    *   You ask questions: "Do you have fire resistance?", "Have you fought Goblins before?", "Are you drunk?".
    *   *Mechanic*: Watch for "Tells" (stuttering, sweating, contradicting their card).
2.  **Inspection**:
    *   Check equipment condition. Is that sword rusty?
    *   Check for party balance. (If a group comes up).
3.  **Action**:
    *   **Assign**: Drag a Quest Scroll to the Adventurer. Stamp "APPROVED".
    *   **Reject**: Stamp "DENIED". (Costs time, might anger them).
    *   **Support (The "Resource" idea)**:
        *   *Sell Items*: "Take this Potion." (Costs you gold, increases their survival).
        *   *Give Tip*: "Use pebbles on the golems." (Uses 'Intel' resource).

### Phase 3: The Evening (The Consequences)
You don't see the fights. You see the results.
*   **The Return**: Adventurers return... or don't.
    *   "Success! Here is the guild's cut." (+Gold, +Reputation).
    *   "I lost my arm!" (Heavy Guilt, -Reputation).
    *   "He didn't make it..." (Widow visits, demand for compensation).
*   **The Ledger**: Pay rent, buy new Intel, bribe officials.

## 3. Deep Mechanics Breakdown

### The "Fit" Algorithm (The Puzzle)
Success isn't random. It's calculated based on hidden variables you must uncover.
*   **Environment vs. Gear**:
    *   *Hot Volcano* + *Heavy Plate Armor* = Heatstroke (Failure).
    *   *Swamp* + *Heavy Plate Armor* = Drown Risk (Failure).
*   **Enemy vs. Type**:
    *   *Ghosts* + *Non-Magical Sword* = Useless (Death).
    *   *Giant Stone Golem* + *Pebble Trick* = Easy Win.
*   **Personality vs. Quest**:
    *   *Escort Mission* + *Bloodthirsty Barbarian* = Dead Hostage.
    *   *Stealth Mission* + *Clumsy Bard* = Alarm Triggered.
### Character Architecture

#### 1. Realistic Observation (No "Stat Cards")
We want immersion. You don't see "Strength: 50". You see a person.
*   **Visual Observation**:
    *   *Muscle Mass*: Big muscles = Strong. Skinny = Weak/Agile.
    *   *Gear Quality*: Shiny plate mail vs. Rusted scraps.
    *   *Magic Aura*: Glowing staff vs. a stick.
*   **The Interview (The "Sheet")**:
    *   They hand you a parchment with *their* claims. "I am Sir Lancelot, Slayer of Dragons."
    *   *The Puzzle*: Does the guy looking like a beggar match the "Slayer of Dragons" claim? **This** is the contradiction you look for.

#### 2. Persistent Consequences (The "World Lives")
Characters remember.
*   **Injuries**: If you send an adventurer to a fight that is slightly too hard, they might win but lose an arm.
    *   *Next Visit*: They come back with an empty sleeve or a hook. They can no longer use two-handed weapons.
*   **Gifting & Outfitting**:
    *   You can open the Guild Armory.
    *   *Action*: Give a "Masterwork Sword" to the guy with the rusty blade.
    *   *Result*: He survives the dragon, but you are down 500 gold.
*   **Debt & Loyalty**: If you save them with a gift, they might do a free quest later or bring you a rare artifact.

#### 3. Non-Adventurer Visitors (The "Drama")
The counter isn't just for heroes. Life in the guild involves the town.

*   **The Widow / The Orphan**:
    *   **Context**: You sent their husband/father on a suicide mission yesterday.
    *   **Interaction**: They demand "Blood Money" (Gold) or just come to guilt you (Morale damage).
    *   **Choice**: Pay them (Safe) or Guard kicks them out (Heartless, saves money).
*   **The King's Tax Collector**:
    *   **Context**: Weekly audit.
    *   **Interaction**: "Your profits are high. The tax rate has increased."
    *   **Mechanic**: A drain on your resources. Can you bribe them?
*   **The Mysterious Merchant**:
    *   **Context**: Rare visitor.
    *   **Interaction**: Sells "Intel Scrolls" or "Artifacts" (like the *All-Telling Eye*).
    *   **Choice**: Investment. Spend gold now for easier puzzles later.
*   **The Rival Guild Master**:
    *   **Context**: A snobby elf from the "Royal Heroes Guild".
    *   **Interaction**: Tries to poach your best adventurers or mock your "peasant" guild.

### The "Tell" System
Adventurers lie.
*   A "Level 10 Warrior" might actually be a Level 2 peasant in a stolen suit.
*   *Tell*: Is the armor 3 sizes too big? Does he hold the sword wrong?
*   *Tell*: "I'm not scared!" (Dialogue text shakes).

### Resources & Management
*   **Reputation**: If too many adventurers die, high-level heroes stop coming. You get only desperate peasants.
*   **Intel**: You buy this. "The Eastern Forest has a new Spider Queen." Without this intel, you might send a newbie to a deathtrap.
*   **Guild Coffer**: Used to pay fines for deaths or buy equipment to *give* to under-prepared adventurers (Investment).

### Guild Artifacts & Progression
You aren't just a manager; you are a collector.
*   **The Mechanic**: Special "Legendary Quests" appear. They are incredibly dangerous (high death risk).
*   **The Reward**: Unique Artifacts that sit on your desk and change gameplay.
    *   *The All-Telling Eye*: Reveals one hidden stat of the current adventurer.
    *   *The Midas Quill*: Increases gold reward for every quest signed with it, but increases death chance (cursed).
    *   *The Hourglass of Patience*: Freezes the timer for the day briefly.
*   **The Loop**: Do you risk your best hero to get the *Eye*? If they die, you lose the hero AND the artifact. If they succeed, your job becomes easier forever.

## 4. Similar Games & Inspiration

*   **Papers, Please**: The gold standard. We borrow the "Desk View", the document checking, and the moral weight of decisions.
*   **Reigns**: For the "Swipe Left/Right" binary decision consequences.
*   **This Is the Police**: For the concept of sending employees (cops) to calls and managing the risk of them dying/failing based on their stats.
*   **Darkest Dungeon**: The vibe of expendable heroes and the grim aftermath of dungeoneering.
*   **Potion Craft**: The tactile feel of interacting with customers and solving their specific problem.
*   **Recettear**: Managing a shop for adventurers (the economic side).

## 5. Visual & Aesthetic Direction
*   **View**: First-person, looking at a wooden Tavern Counter.
*   **Style**: **Pixel Art**. This is perfectly achievable in the browser.
*   **Tech Implementation**:
    *   We will use the HTML5 `<canvas>` element for rendering.
    *   We will use `image-rendering: pixelated;` CSS property to keep pixels crisp when scaling up small assets.
    *   **Assets**: I will use my image generation tools to create pixel-art assets for the Adventurers (faces/bodies), the Desk, and the Icons.
*   **Atmosphere**: Cozy tavern warmth vs. the cold reality of death outside. Music shifts from cheerful (morning) to somber (injured returns).
