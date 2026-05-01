# Plan: Git Status Extension for Pi

## Goal
Customize the pi status line (footer) to display detailed real-time git repository information, including branch, file change counts, staging state, and sync status with origin.

## 1. Information to Display
- **Branch Name**: The current active git branch (e.g., ` main`).
- **File Change Counts**:
    - **Staged**: Number of files in the staging area (e.g., `+:3`).
    - **Unstaged**: Number of modified or deleted files that have not yet been staged (e.g., `!:2`).
    - **Untracked**: Number of untracked files (e.g., `?:1`).
- **Origin Sync Status**:
    - **Ahead**: Number of commits ahead of origin (e.g., `↑ 2`).
    - **Behind**: Number of commits behind origin (e.g., `↓ 1`).
- **Proposed Format**: `git:  main [+:3 !:2 ?:1] ↑2 ↓1` (Colors used for distinct sections).

## 2. Trigger Events
The status should be updated automatically during the following events:
- **Session Start**: When pi starts, or when switching sessions/directories.
- **Tool Execution**: After any tool execution (e.g., `bash`, `edit`, `write`) since these are the primary ways the agent modifies files.
- **Agent Turn End**: After the assistant finishes its turn.
- **Periodic Refresh**: A timer-based refresh to capture changes made outside of pi.

## 3. Implementation Logic
- **Git State Retrieval**:
    - **Branch**: `git rev-parse --abbrev-ref HEAD`
    - **File Status**: `git status --porcelain`
        - Parse the first two characters of each line to count:
            - **Staged (`+`)**: Line starts with `M`, `A`, `D`, `R`, `C` in the 1st column.
            - **Unstaged (`!`)**: Line has `M` or `D` in the 2nd column.
            - **Untracked (`?`)**: Line starts with `??`.
    - **Ahead/Behind**: `git rev-list --left-right --count HEAD...@{u}`
        - This returns two numbers (e.g., `2 1` means 2 ahead, 1 behind).
        - Handle cases where no upstream is set (command will fail).
- **UI Integration**:
    - Use `ctx.ui.theme` to style the output:
        - `accent` for branch.
        - `warning` for unstaged changes (`!`).
        - `success` for staged files (`+`).
        - `dim` for untracked files (`?`) and sync status.
    - Use `ctx.ui.setStatus("git", statusText)` to push the information to the footer.
- **Error Handling**:
    - If the current directory is not a git repository, the status should be cleared or show a "no git" message.
    - Gracefully handle missing upstream branches for sync status.

## 4. Technical Details
- **File Path**: `.pi/extensions/git-status.ts`
- **API Usage**: 
    - `pi.on("session_start", ...)`
    - `pi.on("tool_execution_end", ...)`
    - `pi.on("turn_end", ...)`
    - `pi.exec(...)`
    - `ctx.ui.setStatus(...)`
