# Pi Git Status Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A minimal extension for the [pi coding agent](https://pi.dev) that adds a **real-time Git status line** to the TUI footer. It brings the visibility of advanced shell prompts (like Powerlevel10k) directly into your pi session, ensuring you always know your repository state at a glance.

## 🎯 Motivation

Users familiar with **Zsh, Oh My Zsh, or Powerlevel10k** rely on rich, always-visible Git status in their terminal prompts. Within the pi coding agent, this visibility is missing, which often leads to uncertainty:

- Did a tool execution leave uncommitted changes?
- Are there staged or untracked files in the workspace?
- Is the local branch ahead or behind the upstream origin?

Previously, checking this required running manual shell commands or switching to a separate terminal. This extension solves that by surfacing detailed Git state directly in the pi TUI footer.

## 🚀 Features

- **Branch Tracking**: Displays the current active branch (e.g., ` main`) or a warning for `⚠ detached` HEAD states.
- **Change Counts**:
  - `+`: Number of staged files.
  - `!`: Number of unstaged modifications or deletions.
  - `?`: Number of untracked files.
- **Visual Indicator**: A quick-glance `✓` (clean) or `✗` (dirty) mark.
- **Origin Sync**: Displays commit counts ahead (`↑`) or behind (`↓`) relative to the upstream origin.
- **Last Commit**: A truncated summary of the most recent commit message (e.g., `| 💬 feat: add auth...`).
- **Automatic Updates**: The status line refreshes automatically on:
  - Session start or project switch.
  - Tool executions (e.g., `edit`, `write`, `bash`).
  - Completion of an assistant turn.
  - User-initiated bash commands (`!` or `!!`).
  - A periodic 10-second timer.
- **Robust Detection**: Gracefully handles empty repositories and non-git directories (`git: ∅`).

## 🛠️ Installation

### Quick Install
Run the provided installation script to set up the extension:
```bash
chmod +x install.sh
./install.sh
```
The script will guide you to install the extension either **locally** (current project) or **globally** (all pi sessions). You can also specify a custom path:
```bash
./install.sh /path/to/extensions
```

### Manual Installation
If you prefer to install manually, copy the extension file to the appropriate directory:

**Project-Local**
```bash
mkdir -p .pi/extensions
cp .pi/extensions/git-status.ts .pi/extensions/
```

**Global**
```bash
mkdir -p ~/.pi/agent/extensions
cp .pi/extensions/git-status.ts ~/.pi/agent/extensions/
```

## 📖 Usage

After installation, run the `/reload` command within pi or restart the agent. You will see the status in the bottom footer:

`git: ✓  main [+:2 !:1 ?:0] ↑1 ↓0 | 💬 feat: add authentication logic...`

## 📂 Project Structure

| File | Description |
| :--- | :--- |
| [`install.sh`](install.sh) | Installation script for easy setup. |
| [`git-status.ts`](.pi/extensions/git-status.ts) | The TypeScript source code for the extension. |
| [`pi-extension-git-status-plan.md`](planning/pi-extension-git-status-plan.md) | Detailed design and technical planning document. |

## 📜 License

This project is licensed under the [MIT License](LICENSE).
