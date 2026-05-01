# Plan: Git Status Extension for Pi (Implemented)

## Goal
Customize the pi status line (footer) to display detailed real-time git repository information, including branch, file change counts, staging state, and sync status with origin.

## 1. Information to Display
- **Branch Name**: The current active git branch (e.g., ` main`).
- **Detached HEAD**: If in a detached HEAD state, shows `⚠ detached`.
- **No Repository**: If not in a git repo, shows `git: ∅`.
- **Overall Status**: 
    - `✓` (Success color) if the repository is clean.
    - `✗` (Warning color) if the repository is dirty (any staged, unstaged, or untracked changes).
- **File Change Counts**:
    - **Staged**: Number of files in the staging area (e.g., `+:3`).
    - **Unstaged**: Number of modified or deleted files that have not yet been staged (e.g., `!:2`).
    - **Untracked**: Number of untracked files (e.g., `?:1`).
- **Origin Sync Status**:
    - **Ahead**: Number of commits ahead of origin (e.g., `↑ 2`).
    - **Behind**: Number of commits behind origin (e.g., `↓ 1`).
- **Final Format**: `git: [✓/✗]  main [+:3 !:2 ?:1] ↑2 ↓1`

## 2. Trigger Events
The status updates automatically during:
- **Session Start**: When pi starts or switches sessions/directories.
- **Tool Execution**: After any tool execution (e.g., `bash`, `edit`, `write`).
- **Agent Turn End**: After the assistant finishes its turn.
- **User Bash Commands**: After running `!` or `!!` commands via `user_bash` event.
- **Periodic Refresh**: Every 10 seconds to capture external changes.

## 3. Implementation Logic
- **Git State Retrieval**:
    - **Repo Check**: `git rev-parse --is-inside-work-tree` (checks both exit code and stdout).
    - **Branch/HEAD**:
        - Primary: `git symbolic-ref --short HEAD`.
        - Detached check: `git rev-parse --abbrev-ref HEAD`.
        - Fallback: `git branch --show-current`.
    - **Overall Status**: Calculated as `isDirty = staged > 0 || unstaged > 0 || untracked > 0`.
    - **File Status**: `git status --porcelain`
        - **Staged (`+`)**: 1st column has a change indicator (`M`, `A`, `D`, `R`, `C`).
        - **Unstaged (`!`)**: 2nd column has `M` or `D`.
        - **Untracked (`?`)**: Line starts with `??`.
    - **Ahead/Behind**: `git rev-list --left-right --count HEAD...@{u}`.
- **UI Integration**:
    - Uses `ctx.ui.theme` for semantic coloring:
        - `accent` for branch.
        - `warning` for detached HEAD and unstaged changes.
        - `success` for staged files.
        - `dim` for untracked files, sync status, and "no git" state.
    - Uses `ctx.ui.setStatus("git", statusText)` for the footer.
- **Error Handling**:
    - Gracefully handles missing upstream branches for sync status.
    - Catches and logs exceptions to prevent UI crashes.

## 4. Technical Details
- **File Path**: `.pi/extensions/git-status.ts`
- **API Usage**: 
    - `pi.on("session_start", ...)`
    - `pi.on("tool_execution_end", ...)`
    - `pi.on("turn_end", ...)`
    - `pi.on("user_bash", ...)`
    - `pi.exec(...)`
    - `ctx.ui.setStatus(...)`
    - `setInterval` for periodic updates.
