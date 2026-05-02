/**
 * Git Status Extension
 * 
 * Displays detailed git repository status in the pi footer.
 * Format: git:  branch [+:staged !:unstaged ?:untracked] ↑ahead ↓behind
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { createLocalBashOperations } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	let refreshInterval: NodeJS.Timeout | null = null;
	let currentCtx: any = null;

	async function updateGitStatus(ctx: any) {
		const theme = ctx.ui.theme;
		
		try {
			// Debug: log the result of the first command to a file to see the structure
			const repoCheck = await pi.exec("git", ["rev-parse", "--is-inside-work-tree"]);
			
			// If the user sees "git: ∅", it means we entered this block.
			// Let's check if the exitCode is actually what we think it is.
			if (repoCheck.exitCode !== 0 && repoCheck.stdout.trim() !== "true") {
				ctx.ui.setStatus("git", theme.fg("dim", "git: ∅"));
				return;
			}

			// 2. Get Branch / HEAD state
			// Try symbolic-ref first (works for branches), fallback to rev-parse
			let branchText = "";
			const branchRes = await pi.exec("git", ["symbolic-ref", "--short", "HEAD"]);
			
			if (branchRes.exitCode === 0) {
				branchText = theme.fg("accent", ` ${branchRes.stdout.trim()}`);
			} else {
				// Check if detached or just empty repo
				const revParseRes = await pi.exec("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
				if (revParseRes.exitCode === 0 && revParseRes.stdout.trim() === "HEAD") {
					branchText = theme.fg("warning", "⚠ detached");
				} else if (revParseRes.exitCode !== 0) {
					// Likely an empty repo (no commits yet)
					const branchNameRes = await pi.exec("git", ["branch", "--show-current"]);
					const name = branchNameRes.stdout.trim();
					branchText = name 
						? theme.fg("accent", ` ${name}`) 
						: theme.fg("dim", " empty");
				} else {
					branchText = theme.fg("accent", ` ${revParseRes.stdout.trim()}`);
				}
			}

			// 3. Parse File Status
			const statusRes = await pi.exec("git", ["status", "--porcelain"]);
			let staged = 0;
			let unstaged = 0;
			let untracked = 0;

			if (statusRes.stdout) {
				const lines = statusRes.stdout.split("\n").filter(l => l.trim().length > 0);
				for (const line of lines) {
					const x = line[0];
					const y = line[1];

					// Untracked: starts with ??
					if (line.startsWith("??")) {
						untracked++;
						continue; // Move to next line
					}

					// Staged: 1st column has a change indicator (M, A, D, R, C)
					if (x !== " " && x !== "?") {
						staged++;
					}
					// Unstaged: 2nd column has M or D
					if (y === "M" || y === "D") {
						unstaged++;
					}
				}
			}

			const fileStats = [];
			if (staged > 0) fileStats.push(theme.fg("success", `+: ${staged}`));
			if (unstaged > 0) fileStats.push(theme.fg("warning", `!: ${unstaged}`));
			if (untracked > 0) fileStats.push(theme.fg("dim", `?: ${untracked}`));

			const statsStr = fileStats.length > 0 ? ` [${fileStats.join(" ")}]` : "";

			// Overall status indicator
			const isDirty = staged > 0 || unstaged > 0 || untracked > 0;
			const statusIndicator = isDirty 
				? theme.fg("warning", "✗ ") 
				: theme.fg("success", "✓ ");

			// 4. Ahead/Behind origin
			let syncStr = "";
			const syncRes = await pi.exec("git", ["rev-list", "--left-right", "--count", "HEAD...@{u}"]);
			if (syncRes.exitCode === 0) {
				const [ahead, behind] = syncRes.stdout.trim().split(/\s+/);
				const a = parseInt(ahead, 10);
				const b = parseInt(behind, 10);
				
				if (a > 0) syncStr += theme.fg("dim", ` ↑${a}`);
				if (b > 0) syncStr += theme.fg("dim", ` ↓${b}`);
			}

			// 5. Last commit summary
			let commitStr = "";
			const commitRes = await pi.exec("git", ["log", "-1", "--oneline"]);
			if (commitRes.exitCode === 0 && commitRes.stdout.trim()) {
				const line = commitRes.stdout.trim();
				// --oneline format is: hash subject
				const msg = line.substring(line.indexOf(" ") + 1).trim();
				if (msg) {
					const shortMsg = msg.length > 40 ? msg.slice(0, 37) + "..." : msg;
					commitStr = theme.fg("dim", ` | 💬 ${shortMsg}`);
				}
			}

			ctx.ui.setStatus("git", `${theme.fg("dim", "git: ")}${statusIndicator}${branchText}${statsStr}${syncStr}${commitStr}`);

		} catch (e) {
			// Fail silently to avoid disrupting the UI
			console.error("Git Status Extension Error:", e);
		}
	}

	pi.on("session_start", async (_event, ctx) => {
		currentCtx = ctx;
		await updateGitStatus(ctx);

		// Set up periodic refresh (every 10 seconds)
		if (refreshInterval) clearInterval(refreshInterval);
		refreshInterval = setInterval(() => {
			if (currentCtx) {
				updateGitStatus(currentCtx);
			}
		}, 10000);
	});

	pi.on("tool_execution_end", async (_event, ctx) => {
		await updateGitStatus(ctx);
	});

	pi.on("turn_end", async (_event, ctx) => {
		await updateGitStatus(ctx);
	});

	pi.on("user_bash", (_event, ctx) => {
		const local = createLocalBashOperations();
		return {
			operations: {
				async exec(command, cwd, options) {
					const result = await local.exec(command, cwd, options);
					// Update status after the user's bash command finishes
					updateGitStatus(ctx);
					return result;
				},
			},
		};
	});

	pi.on("session_shutdown", () => {
		currentCtx = null;
		if (refreshInterval) {
			clearInterval(refreshInterval);
			refreshInterval = null;
		}
	});
}
