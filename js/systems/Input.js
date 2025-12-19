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
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const dist = Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2));

            if (dist < 100 && this.gameState.currentAdventurer) {
                // Toggle Inspection
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

        // CHECK 0.5: End Day Button? (Top Right)
        // Coords based on Renderer (approx 850, 30, 150x50)
        if (pos.x >= 850 && pos.x <= 1000 && pos.y >= 20 && pos.y <= 70) {
            const event = new CustomEvent('endDayManual');
            document.dispatchEvent(event);
            return;
        }

        // CHECK 0.7: Reject Button? (Bottom Center)
        // Coords: 412, 600, 200x50
        if (pos.x >= 412 && pos.x <= 612 && pos.y >= 600 && pos.y <= 650) {
            const event = new CustomEvent('nextAdventurer');
            document.dispatchEvent(event);
            return;
        }

        // CHECK 1: Clicked on a Quest on the Board?
        if (this.gameState.quests) {
            // ... (keep existing quest pickup logic)
            // Re-calculate the layout logic from Renderer (should really be shared, but simple enough to dup for now)
            const startX = 730;
            const startY = 240;
            const paperW = 50;
            const paperH = 60;
            const gap = 12;
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
        if (!this.isDragging) return;

        const pos = this.getMousePos(e);

        // DROP LOGIC
        // Check if dropped on Adventurer (Center Screen)
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dropZoneRadius = 150; // Roughly the adventurer area

        const dist = Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2));

        if (dist < dropZoneRadius) {
            // Valid Drop on Adventurer!
            this.triggerAssignment(this.dragItem.data);
        } else {
            // Invalid Drop - Snap back (just clear drag state)
            console.log("Returned to board");
        }

        // Cleanup
        this.isDragging = false;
        this.dragItem = null;
        this.gameState.dragState = null;
    }

    triggerAssignment(quest) {
        if (!this.gameState.currentAdventurer) return;

        // Remove quest from available list
        const idx = this.gameState.quests.indexOf(quest);
        if (idx > -1) {
            this.gameState.quests.splice(idx, 1);
        }

        // Trigger Resolution
        if (window.GameSystems.ResolutionManager) {
            // Hack: Attach economy ref to adventurer temporarily
            this.gameState.currentAdventurer.economyRef = this.gameState.economy;

            const result = window.GameSystems.ResolutionManager.resolve(quest, this.gameState.currentAdventurer);

            // STORE RESULT FOR LATER (Delayed Reporting)
            if (!this.gameState.pendingReports) {
                this.gameState.pendingReports = [];
            }
            this.gameState.pendingReports.push(result);

            // IMMEDIATE: Bring in new adventurer
            const event = new CustomEvent('nextAdventurer');
            document.dispatchEvent(event);
        }
    }
}



window.GameSystems.InputController = InputController;
