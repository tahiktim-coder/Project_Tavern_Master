# Personality Architectures

Every adventurer has a "Voice" that dictates their negotiation logic and responses.

## 1. The Archetypes

### A. The Professional (Stoic)
*   **Trait**: `Disciplined`.
*   **Voice**: Short sentences. Facts only.
*   **Negotiation**:
    *   *Low Ball*: "That is below market rate." (Leaves).
    *   *High Pay*: "Agreed." (Accepts immediately).
*   **Success**: "The job is done."
*   **Failure**: "The mission parameters were... inaccurate."

### B. The Glory Hound (Arrogant)
*   **Trait**: `Egoist`.
*   **Voice**: Third person. Boastful. "The Great Zando fears nothing!"
*   **Negotiation**:
    *   *Low Ball*: "Insulting! I am a legend!"
    *   *High Pay*: "A fitting tribute."
*   **Success**: "Too easy! Give me a real challenge!"
*   **Failure**: "Your map was wrong! This is YOUR fault!"

### C. The Desperate (Scared)
*   **Trait**: `Skittish`.
*   **Voice**: Stutters. Apologetic. "P-please, I need the coin."
*   **Negotiation**:
    *   *Low Ball*: "I... I'll take it." (Accepts anything).
    *   *High Pay*: "R-really? Oh thank you!"
*   **Success**: "I survived! I actually survived!"
*   **Failure**: *Crying* "I told you I wasn't ready..."

### D. The Zealot (Religious)
*   **Trait**: `Fanatic`.
*   **Voice**: Old English style. Mentions "The Light" or "The Gods" constantly.
*   **Negotiation**:
    *   *Job Type*: Will reject Assassinations or Theft (Morality Check).
    *   *Pay*: cares less about gold, more about the "Cause".
*   **Success**: "The Gods smiled upon us."
*   **Failure**: "My faith was weak... I must punish myself."

### E. The Scoundrel (Charming)
*   **Trait**: `Greedy`.
*   **Voice**: Flirty, informal. Calling you "Boss" or "Friend".
*   **Negotiation**:
    *   *Any Offer*: "Come on, you can do better than that." (Always haggles).
*   **Success**: "Piece of cake. Now, about that bonus..."
*   **Failure**: "Ran into a bit of a snag. Not my fault, honestly."

## 2. Negotiation Logic (Hidden Variables)
Each personality has a `Patience` meter.
*   **Professional**: Patience 3. (3 Low balls -> Leaves).
*   **Glory Hound**: Patience 1. (1 Low ball -> Leaves/Attacks).
*   **Desperate**: Patience 10. (Never leaves).
