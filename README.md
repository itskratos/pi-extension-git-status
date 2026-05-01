# Pi Git Status Extension

A minimal extension for the [pi coding agent](https://pi.dev) that adds a detailed Git status line to the TUI footer, providing real-time visibility into your repository state.

## 🚀 Features

- **Branch Tracking**: Displays the current active branch (e.g., ` main`) or a warning if you are in a `⚠ detached` HEAD state.
- **Change Counts**:
  - `+`: Number of staged files.
  - `!`: Number of unstaged modifications or deletions.
  - `?`: Number of untracked files.
- **Visual Indicator**: A quick-glance `✓` (clean) or `✗` (dirty) mark to indicate if there are any uncommitted changes.
- **Origin Sync**: Displays commit counts ahead (`↑`) or behind (`↓`) relative to the upstream origin.
- **Automatic Updates**: The status line refreshes automatically on:
  - Session start/switch.
  - Tool executions (e.g., `edit`, `write`, `bash`).
  - Assistant turn completion.
  - User bash commands (`!` or `!!`).
  - A periodic 10-second timer.
- **Robust Detection**: Gracefully handles empty repositories (no commits) and non-git directories (`git: ∅`).

## 🛠️ Installation

### Project-Local Installation
To enable this extension for a specific project:
```bash
mkdir -p .pi/extensions
cp .pi/extensions/git-status.ts .pi/extensions/
```

### Global Installation
To have the Git status line available across all your pi sessions:
```bash
mkdir -p ~/.pi/agent/extensions
cp .pi/extensions/git-status.ts ~/.pi/agent/extensions/
```

## 📖 Usage

After installation, run the `/reload` command within pi or restart the agent. You will see the status in the bottom footer:

`git: ✓  main [+:2 !:1 ?:0] ↑1 ↓0`

## 📂 Project Structure

- `.pi/extensions/git-status.ts`: The TypeScript source code for the extension.
- `git-status-plan.md`: The detailed design and technical planning document.
