/**
 * INPUT SYSTEM
 * Handles Mouse/Touch interactions for Drag & Drop
 * Using Global Namespace Pattern
 */

window.GameSystems = window.GameSystems || {};

class InputController {
    constructor(canvas, gameState) {
        this.canvas = canvas;
        this.gameState = gameState;
        this.isDragging = false;
        this.dragItem = null;
        this.mouse = { x: 0, y: 0 };

        // Bind events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    getMousePos(evt) {
        const rect = this.canvas.getBoundingClientRect();
        // Calculate scale (canvas logical size vs css displayed size)
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        this.mouse.x = pos.x;
        this.mouse.y = pos.y;

        // Only interact in GAME state
        if (this.gameState.screen !== 'GAME') return;

        // CHECK 0: Is Report Open?
        if (this.gameState.report) {
            this.gameState.report = null;
            // Dispatch event to bring in next adventurer (NOT next day)
            const event = new CustomEvent('nextAdventurer');
            document.dispatchEvent(event);
            return;
        }

        // CHECK RIGHT CLICK (Inspection) OR Shift-Click
        if (e.button === 2 || e.shiftKey) {
            // Inspect Adventurer?
            // Portrait is centered at height/2 - 50
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2 - 100; // Shifted up to match visual

            // Box check matches portrait size (approx 240x240)
            const halfSize = 120;
            if (pos.x >= centerX - halfSize && pos.x <= centerX + halfSize &&
                pos.y >= centerY - halfSize && pos.y <= centerY + halfSize) {

                if (this.gameState.currentAdventurer) {
                    if (this.gameState.inspectionData) {
                        this.gameState.inspectionData = null;
                    } else {
                        if (window.GameSystems.Inspector && this.gameState.inspector) {
                            this.gameState.inspectionData = this.gameState.inspector.inspect(this.gameState.currentAdventurer);
                        }
                    }
                    e.preventDefault();
                    return;
                }
            }
        }

        // Close inspector if clicking elsewhere
        if (this.gameState.inspectionData) {
            this.gameState.inspectionData = null;
            return;
        }

        // CHECK 0: Is Report Open? (Click anywhere to close)
        if (this.gameState.report) {
            this.gameState.report = null;
            // Dispatch event to bring in next adventurer (NOT next day)
            const event = new CustomEvent('nextAdventurer');
            document.dispatchEvent(event);
            return;
        }

        // CHECK 0.4: Roster Button (Top Left - Under Day)
        if (pos.x >= 10 && pos.x <= 190 && pos.y >= 95 && pos.y <= 145) {
            const event = new CustomEvent('toggleRoster');
            document.dispatchEvent(event);
            return;
        }

        // CHECK 0.5: End Day Button? (Top Right - Hanging Sign)
        // New Renderer: x=860, y=30, w=130, h=50
        if (pos.x >= 860 && pos.x <= 990 && pos.y >= 30 && pos.y <= 80) {
            const event = new CustomEvent('endDayManual');
            document.dispatchEvent(event);
            return;
        }

        // CHECK 0.7: Action Buttons (Bottom Center)
        // Exact Match to Visuals: y=[560, 620]
        if (pos.y >= 560 && pos.y <= 620) {
            console.log("Input: Bottom Area Click at", pos.x);

            // RECRUIT: Visual [302, 502]
            if (pos.x >= 302 && pos.x <= 502) {
                console.log("Input: Recruit Click Detected");

                // Check Cap (User Request: Max 2)
                if (this.gameState.persistence && this.gameState.persistence.roster.size >= 2) {
                    alert("Guild Hall is full! (Max 2 Members)\nUpgrade Guild Hall to hire more.");
                    return;
                }

                // Check if already hired
                if (this.gameState.currentAdventurer && this.gameState.currentAdventurer.isGuildMember) {
                    console.log("Input: Already hired.");
                    return; // Do nothing or show feedback
                }

                if (this.gameState.economy && this.gameState.economy.gold >= 100) {
                    const event = new CustomEvent('recruitAdventurer');
                    document.dispatchEvent(event);
                } else {
                    alert("Not enough gold! Need 100 G.");
                }
                return;
            }

            // DISMISS: Visual [522, 722]
            if (pos.x >= 522 && pos.x <= 722) {
                // Only allow dismiss if quests exist
                if (this.gameState.quests && this.gameState.quests.length > 0) {
                    console.log("Input: Dismiss Click Detected");
                    // VISUAL: Trigger DISMISS Stamp
                    this.gameState.stamp = { type: 'DISMISSED', val: 0 };

                    // Delay next adventurer
                    setTimeout(() => {
                        this.gameState.stamp = null;
                        const event = new CustomEvent('nextAdventurer');
                        document.dispatchEvent(event);
                    }, 800);
                } else {
                    console.log("Input: Dismiss Disabled (No Quests)");
                }
                return;
            }
        }

        // CHECK 1: Clicked on a Quest on the Board?
        if (this.gameState.quests) {
            // Re-calculate the layout logic from Renderer (MUST MATCH RENDERER)
            const startX = 640;
            const startY = 220;
            const paperW = 100;
            const paperH = 130;
            const gap = 15;
            const cols = 3;

            // Iterate in reverse (top items first)
            for (let i = this.gameState.quests.length - 1; i >= 0; i--) {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const qx = startX + col * (paperW + gap);
                const qy = startY + row * (paperH + gap) + (i % 2 * 5); // Stagger

                if (pos.x >= qx && pos.x <= qx + paperW &&
                    pos.y >= qy && pos.y <= qy + paperH) {

                    // Found a click! Start Drag
                    this.isDragging = true;
                    this.dragItem = {
                        type: 'QUEST',
                        data: this.gameState.quests[i],
                        originalIndex: i,
                        offsetX: pos.x - qx,
                        offsetY: pos.y - qy
                    };

                    this.gameState.dragState = {
                        item: this.gameState.quests[i],
                        x: pos.x,
                        y: pos.y
                    };
                    return;
                }
            }
        }
    }

    handleMouseMove(e) {
        const pos = this.getMousePos(e);
        this.mouse.x = pos.x;
        this.mouse.y = pos.y;

        if (this.isDragging && this.gameState.dragState) {
            this.gameState.dragState.x = pos.x;
            this.gameState.dragState.y = pos.y;
        }
    }

    handleMouseUp(e) {
        console.log("Input: handleMouseUp() called, isDragging =", this.isDragging);
        if (!this.isDragging) {
            console.log("Input: Not dragging, returning early");
            return;
        }

        const pos = this.getMousePos(e);
        console.log("Input: Mouse position:", pos);

        // DROP LOGIC
        // Target: Adventurer (Center Screen)
        // Visual is at width/2, height/2 - 50. Size is varying but approx 100 wide, 200 tall.

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Rectangular Hitbox for reliability
        // Center of Visual is h/2 - 100
        const zoneCenterY = centerY - 100;
        const hitX = centerX - 120; // Match Portrait Width (240)
        const hitY = zoneCenterY - 120; // Match Portrait Height (240)
        const hitW = 240;
        const hitH = 240;

        console.log("Input: Checking drop zone. Mouse:", pos.x, pos.y, "Zone:", hitX, hitY, hitW, hitH);

        if (pos.x > hitX && pos.x < hitX + hitW &&
            pos.y > hitY && pos.y < hitY + hitH) {

            // Valid Drop on Adventurer!
            console.log("Input: Quest Dropped on Adventurer - calling triggerAssignment");
            this.triggerAssignment(this.dragItem.data);
            console.log("Input: triggerAssignment returned, continuing to cleanup");
        } else {
            // Drop on Board / Empty Space -> Return to Board
            console.log("Input: Quest Returned to Board");
            // No logic needed, just clearing drag state puts it back visually
        }

        // Cleanup
        console.log("Input: CLEANUP STARTING - isDragging:", this.isDragging, "dragItem:", this.dragItem, "dragState:", this.gameState.dragState);
        this.isDragging = false;
        this.dragItem = null;
        this.gameState.dragState = null;
        console.log("Input: CLEANUP COMPLETE - isDragging:", this.isDragging, "dragItem:", this.dragItem, "dragState:", this.gameState.dragState);
    }

    triggerAssignment(quest) {
        console.log("Input: triggerAssignment() called with quest:", quest ? quest.title : "null");
        if (!this.gameState.currentAdventurer) {
            console.log("Input: No current adventurer, aborting");
            return;
        }
        if (this.gameState.currentAdventurer.isAssigned) {
            console.log("Input: Adventurer already assigned (busy), aborting");
            return;
        }

        // Mark as busy immediately to prevent double-assignment
        this.gameState.currentAdventurer.isAssigned = true;

        // UPDATE PERSISTENCE
        if (this.gameState.persistence && this.gameState.currentAdventurer.id) {
            this.gameState.persistence.setAssigned(this.gameState.currentAdventurer.id, true);
        }

        console.log("Input: Current adventurer exists:", this.gameState.currentAdventurer.name);

        // Remove quest from available list
        const idx = this.gameState.quests.indexOf(quest);
        if (idx > -1) {
            this.gameState.quests.splice(idx, 1);
            console.log("Input: Quest removed from board at index", idx);
        } else {
            console.log("Input: WARNING - Quest not found in quests array");
        }

        // Trigger Resolution
        console.log("Input: Checking ResolutionManager...", typeof window.GameSystems, typeof window.GameSystems.ResolutionManager);
        if (window.GameSystems && window.GameSystems.ResolutionManager) {
            console.log("Input: ResolutionManager found! Calling resolve()");
            // Hack: Attach economy ref to adventurer temporarily
            this.gameState.currentAdventurer.economyRef = this.gameState.economy;

            const result = window.GameSystems.ResolutionManager.resolve(quest, this.gameState.currentAdventurer);
            console.log("Input: Resolution complete, result:", result);

            // STORE RESULT FOR LATER (Delayed Reporting)
            if (!this.gameState.pendingReports) {
                this.gameState.pendingReports = [];
            }
            this.gameState.pendingReports.push(result);
            console.log("Input: Result added to pending reports");

            // VISUAL: Trigger ASSIGNED Stamp
            this.gameState.stamp = { type: 'ASSIGNED', val: 0 };
            console.log("Input: Stamp set to ASSIGNED");

            // Delay next adventurer
            console.log("Input: Starting 800ms timer for next adventurer...");
            setTimeout(() => {
                console.log("Input: Timer complete! Clearing stamp and dispatching nextAdventurer event");
                this.gameState.stamp = null;
                const event = new CustomEvent('nextAdventurer');
                document.dispatchEvent(event);
                console.log("Input: nextAdventurer event dispatched");
            }, 800);
        } else {
            console.log("Input: ERROR - ResolutionManager not found!");
        }
    }
}



window.GameSystems.InputController = InputController;
