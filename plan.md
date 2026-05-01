# Plan: Git Status Extension for Pi

## Goal
Customize the pi status line (footer) to display real-time git repository information.

## 1. Information to Display
- **Branch Name**: The current active git branch (e.g., `main`, `feature/xyz`).
- **File Changes**:
    - **Modified Count**: Number of files with modifications (staged and unstaged).
    - **Deleted Count**: Number of files deleted (staged and unstaged).
- **Staging Area State**: Count of changes currently staged for commit.
- **Remote Status**:
    - **Ahead**: Number of commits ahead of the upstream branch (`↑X`).
    - **Behind**: Number of commits behind the upstream branch (`↓Y`).
- **Status Indicator**:
    - `✓` (Success color) if the repository is clean.
    - `✗` or `*` (Warning/Error color) if there are uncommitted changes.
- **Proposed Format**: `git:  branch | M:2 D:1 S:3 | ↑1 ↓0 ✓`

## 2. Trigger Events
The status should be updated automatically during the following events:
- **Session Start**: When pi starts, or when switching sessions/directories.
- **Tool Execution**: After any tool execution (e.g., `bash`, `edit`, `write`) since these are the primary ways the agent modifies files.
- **Agent Turn End**: After the assistant finishes its turn.
- **Periodic Refresh**: A timer-based refresh to capture changes made outside of pi.

## 3. Implementation Logic
- **Git State Retrieval**: Use `pi.exec` to run:
    - `git rev-parse --abbrev-ref HEAD` to get the current branch.
    - `git status --porcelain` to parse file changes (Modified, Deleted, Staged).
    - `git rev-parse --abbrev-ref @{u}` to find the upstream branch.
    - `git rev-list --left-right --count HEAD...<upstream>` to get ahead/behind counts.
- **Parsing Logic**:
    - Iterate through `git status --porcelain` lines.
    - Column 1 (X) = Staged state, Column 2 (Y) = Unstaged state.
    - `M` in either column contributes to modified count.
    - `D` in either column contributes to deleted count.
    - Any non-space in Column 1 contributes to the staged count.
- **UI Integration**:
    - Use `ctx.ui.theme` to style the output (e.g., `accent` for the branch, `warning` for changes, `info` for remote status).
    - Use `ctx.ui.setStatus("git", statusText)` to push the information to the footer.
- **Error Handling**:
    - If the current directory is not a git repository, the status should be cleared or show a "no git" message.
    - Handle potential `pi.exec` errors gracefully.

## 4. Technical Details
- **File Path**: `.pi/extensions/git-status.ts`
- **API Usage**: 
    - `pi.on("session_start", ...)`
    - `pi.on("tool_execution_end", ...)`
    - `pi.on("turn_end", ...)`
    - `pi.exec(...)`
    - `ctx.ui.setStatus(...)`
