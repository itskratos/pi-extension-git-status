# Pi Git Status Extension

A minimal extension for the [pi coding agent](https://pi.dev) that adds a detailed Git status line to the TUI footer, providing real-time visibility into your repository state.

## 🎯 Motivation

As someone who extensively uses Zsh with Oh My Zsh and Powerlevel10k, I was accustomed to having rich, always-visible Git status information right in my terminal prompt. Inside the pi coding agent, that visibility was completely missing.

Additionally, while working with pi on a project, it was often unclear whether pi's tool executions had left uncommitted changes, staged files, or untracked files in the working tree. The only way to check the repository state was to run shell commands within pi or switch to a different terminal altogether.

This extension solves all of those problems by surfacing detailed, real-time Git status directly in the pi TUI footer — so you always know the state of your repo at a glance.

## 🚀 Features

- **Branch Tracking**: Displays the current active branch (e.g., ` main`) or a warning if you are in a `⚠ detached` HEAD state.
- **Change Counts**:
  - `+`: Number of staged files.
  - `!`: Number of unstaged modifications or deletions.
  - `?`: Number of untracked files.
- **Visual Indicator**: A quick-glance `✓` (clean) or `✗` (dirty) mark to indicate if there are any uncommitted changes.
- **Origin Sync**: Displays commit counts ahead (`↑`) or behind (`↓`) relative to the upstream origin.
- **Last Commit**: Displays a truncated summary of the most recent commit message (e.g., `| 💬 feat: add auth...`).
- **Automatic Updates**: The status line refreshes automatically on:
  - Session start/switch.
  - Tool executions (e.g., `edit`, `write`, `bash`).
  - Assistant turn completion.
  - User bash commands (`!` or `!!`).
  - A periodic 10-second timer.
- **Robust Detection**: Gracefully handles empty repositories (no commits) and non-git directories (`git: ∅`).

## 🛠️ Installation

### Quick Install
Run the provided installation script:
```bash
chmod +x install.sh
./install.sh
```
The script will guide you to install the extension either locally for the current project or globally for all pi sessions. You can also specify a custom path:
```bash
./install.sh /path/to/extensions
```

### Manual Installation
If you prefer to install manually:

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

- `install.sh`: Installation script for easy setup.
- `.pi/extensions/git-status.ts`: The TypeScript source code for the extension.
- `git-status-plan.md`: The detailed design and technical planning document.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
