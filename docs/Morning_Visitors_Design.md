# Morning Visitors System Design

## Overview
Before the daily adventurer queue, **special NPCs** can visit the tavern with narrative events requiring player decisions. These create strategic dilemmas, moral choices, and consequence chains.

---

## Core Mechanics

### Timing
- **When**: After "Start of Day" but BEFORE first adventurer appears
- **Frequency**: Random chance (20-40% per day) OR scripted triggers
- **Priority**: Visitor event → Then normal adventurer queue

### UI Flow
1. Day starts → Check for visitor trigger
2. If triggered → Show visitor modal (portrait + dialogue + choices)
3. Player chooses → Apply consequences → Continue to adventurers

---

## Visitor Types

### 1. **The Royal Guard** 🛡️
**Archetype**: Corrupt Official / Bribe Opportunity

**Trigger**: Day 2, 5, 9 (escalating pressure)

**Scenario**: 
> *A guard in royal livery stands at your door, hand outstretched.*  
> "The Captain sent me. He's noticed... irregularities in your ledger. For a small donation, I could overlook them."

**Choices**:
- **Pay Bribe (20-50G)**: Lose gold, gain Crown Rep +1
- **Refuse**: Lose Crown Rep -2, risk future "inspections"

**Consequences**:
- Refusing 3 times → Crown sends auditor (Day 14)
- Paying creates dependency (future bribes increase)

---

### 2. **The Mourning Widow** 💀
**Archetype**: Emotional Consequence / Humanitarian Crisis

**Trigger**: Day after adventurer dies on quest

**Scenario**:
> *A woman in black clutches a letter. Her eyes are red from crying.*  
> "My husband... he took that quest you offered. He never came home. I have children to feed."

**Choices**:
- **Give Charity (50G)**: Lose gold, gain Town Rep +2
- **Express Sympathy (0G)**: Neutral
- **Turn Away**: Lose Town Rep -3, morale hit to roster

**Consequences**:
- Charity builds town reputation (better adventurers visit)
- Turning away → Guild members see you as heartless (-1 morale to all)

---

### 3. **The Mysterious Bard** 🎵
**Archetype**: Opportunity / Rumor Merchant

**Trigger**: Random (Weekly intervals)

**Scenario**:
> *A bard with a lute grins at you conspiratorially.*  
> "I heard whispers of a hidden treasure. For a drink and 30 gold, I'll mark it on your map."

**Choices**:
- **Pay (30G)**: Unlock **Bonus Quest** (high reward, appears on board)
- **Decline**: Nothing happens

**Consequences**:
- Bonus quests have unique visual (blue wax seal)
- Higher risk/reward than normal quests
- Time-limited (expires in 2 days)

---

### 4. **The Traveling Merchant** 🛒
**Archetype**: Item Shop / Preparation

**Trigger**: Every 5 days (predictable)

**Scenario**:
> *A merchant unloads crates from a wagon.*  
> "Potions, scrolls, trinkets! Today only!"

**Choices**:
- **Buy Healing Potion (40G)**: Consumable (reduces injury chance)
- **Buy Lucky Charm (60G)**: Consumable (+10% quest success)
- **Browse (Free)**: See inventory, purchase later

**Consequences**:
- Items stored in Guild Inventory
- Can "gift" items to adventurers before quests (future feature)

---

### 5. **The Deserter** ⚔️
**Archetype**: Recruitment Opportunity / Risk

**Trigger**: Random (5% chance per day)

**Scenario**:
> *A scarred warrior in torn armor stumbles in.*  
> "I fled the Crown's army. I'll work for you—no questions asked. I'm... skilled."

**Choices**:
- **Hire (Free!)**: Gain high-level adventurer (BUT Crown Rep -3)
- **Report to Guards**: Gain Crown Rep +2, lose opportunity
- **Ignore**: Nothing happens

**Consequences**:
- Deserter has high stats but "Wanted" trait
- If caught later → Fine (100G) or lose the adventurer

---

### 6. **The Loan Shark** 💰
**Archetype**: Debt / Desperation Mechanic

**Trigger**: When gold < 20G (emergency)

**Scenario**:
> *A well-dressed man with cold eyes sits uninvited.*  
> "Struggling? I can lend you 100 gold. Pay back 150 within 7 days... or we take collateral."

**Choices**:
- **Accept Loan**: Gain 100G, owe 150G (7-day timer)
- **Refuse**: No change

**Consequences**:
- If unpaid after 7 days → Lose top adventurer or Game Over
- Creates "debt spiral" tension

---

### 7. **The Town Elder** 👴
**Archetype**: Story Progression / Lore

**Trigger**: Scripted (Day 10, 20, 30)

**Scenario**:
> *The village elder hobbles in, leaning on a cane.*  
> "The town is thriving thanks to your guild. We wish to expand—invest 200G in new housing?"

**Choices**:
- **Invest (200G)**: Town grows → Larger adventurer pools next week
- **Decline**: No change

**Consequences**:
- Investment unlocks better adventurer classes (Knights, Wizards)
- Feels like "progression unlock" milestone

---

## Implementation Priority

### Phase 1 (MVP): 
1. **Guard** - Bribery system (Day 2)
2. **Widow** - Death consequences (trigger on death)

### Phase 2:
3. **Bard** - Bonus quests
4. **Merchant** - Item shop

### Phase 3:
5. **Deserter** - High-risk recruitment
6. **Loan Shark** - Debt mechanic
7. **Town Elder** - Progression unlocks

---

## Technical Requirements

### New Systems Needed:
- `VisitorSystem.js` - Event triggers and dialogue
- `DialogModal.js` - UI for visitor conversations
- `ReputationManager.js` - Track Crown/Town approval (future)
- `InventorySystem.js` - Store purchasable items (future)

### Data Structure:
```javascript
{
  id: "guard_bribe",
  name: "Royal Guard",
  portrait: "assets/visitors/guard.png",
  dialogue: "The Captain sent me...",
  choices: [
    { text: "Pay Bribe (20G)", cost: 20, effect: "crown_rep+1" },
    { text: "Refuse", cost: 0, effect: "crown_rep-2" }
  ],
  trigger: { type: "day", value: 2 }
}
```

---

## Balancing Notes

- **Gold costs** should create tension but not be punishing
- **Reputation** affects quest quality and Crown quests
- **Visitor frequency**: Max 1 per day, ~2-3 per week
- **Story beats**: Use scripted visitors to pace narrative

---

## Future Expansion Ideas

- **Rival Guild Master**: Challenges you to competitions
- **Cursed Artifact Seller**: Sell "cursed" items with hidden penalties
- **Refugee**: Free low-level recruit with sad backstory
- **Tax Collector**: Immediate 50G payment or penalties
- **Mysterious Stranger**: Foreshadows end-game events
