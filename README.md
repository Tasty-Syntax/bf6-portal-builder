# Battlefield 6 Portal — Game Mode Template

A flexible, Portal-Editor friendly template for building **any** multiplayer game mode in Battlefield 6.
This repository is _not_ a single gamemode — it's a reusable foundation and utility set you can drop into the Portal Editor and extend to create Capture, King of the Hill, Gun Game, Last Man Standing, Objective Rush, or whatever competitive/coop mode you want.

> [!IMPORTANT]
> If you use these helper utilities or code, please credit **TastySyntax** in your mod description.

---

## What this template gives you

- Small, focused helper modules to reduce boilerplate when working with Portal Editor scripting.
- A clear event / handler layout (start, join, deploy, kill, death) to plug your gamemode logic into.
- Built-in helpers for player state, scoreboard, UI text, vector ops, and SFX so you don’t reimplement common tasks.
- A `main.ts` entry point with the obvious extension points to implement mode rules and progression.

---

## Included helpers (drop these into your scripts folder)

- `player.ts` — Player wrapper utilities (vars per player, equip/force switch helpers, basic getters).
- `scoreboard.ts` — Custom scoreboard builder (headers, columns, sorting, update helpers).
- `sfx.ts` — Sound helpers (play to player/team/all, simple SFX spawning).
- `uitext.ts` — UI helpers for notifications, persistent widgets, and world log messages.
- `vector3.ts` — Small Vector3 utilities (construct/convert/format).
- `main.ts` — Mode entry point: event hookups and the place to implement your mode rules.

> Keep these files together in one folder so imports are simple (relative imports are assumed).

---

## How to use this template (quick start)

1. Create or open a Portal Editor mod.
2. Copy the template `.ts` files into the mod’s script folder (or compile to JS if your workflow requires it).
3. Set `main.ts` as the runtime entrypoint (or import it from your chosen entry file).
4. Implement mode-specific behavior by filling the suggested event handlers in `main.ts`: `OnGameModeStarted`, `OnPlayerJoinGame`, `OnPlayerDeployed`, `OnPlayerEarnedKill`, `OnPlayerDied`, etc.
5. Add any assets (SFX, UI images, world log prefabs) to the Portal Editor assets panel so SFX/UI calls succeed at runtime.
6. Test in the editor; use the included scoreboard/UI helpers to verify state updates.

---

## Design / extension points

These are the places you’ll repeatedly edit or extend:

- **`OnGameModeStarted()`** — Global initialization: mode configuration, spawn points, create/prepare scoreboard and UI, precompute any random pools.
- **`OnPlayerJoinGame(player)`** — Per-player initialization: default variables, UI widgets, and initial equipment.
- **`OnPlayerDeployed(player)`** — Equip or setup the player according to current state (team, class, loadout by role/level).
- **`OnPlayerEarnedKill(victim, killer, weapon)`** — Score progression, objective scoring, unique rewards, or penalties.
- **`OnPlayerDied(player, killer, damageType)`** — Respawn logic, penalties (downgrade, lose points), objective loss/gain, and scoreboard updates.
- **Round flow** — Start/end rounds, reset states, determine win/loss conditions. Implemented in `main.ts` as functions called by the event handlers.

---

## Example mode types you can build

- **Team Objective** — capture points and hold to score; use player helper + scoreboard to show progress.
- **Elimination** — round-based deathmatch with no respawn; use death handler to move players to spectator.
- **Gun Game (example)** — progression tiers and automatic weapon switching (template already supports easy implementation).
- **King of the Hill** — timed control; use the scoreboard for point timers and the UI helper for zone announcements.
- **Custom class-based modes** — spawn players with unique loadouts, abilities, and per-class UI.

---

## Configurable systems you should centralize

- Player variables / per-player state keys (level, tickets, score, respawnLock).
- Scoreboard columns and sorting logic.
- UI widgets and update frequency (only update on state change).
- Asset identifiers (SFX IDs, UI template IDs) in a single `config` block for easy editing.
- Respawn rules (auto-spawn vs. manual spawn / dead spectator state).
- Any randomized pools (weapon pools, spawn sets) — computed at match start and stable for that match.

---

## UI & Scoreboard recommendations

- Use `scoreboard.ts` to keep scoreboard code consistent across modes. Show only what’s relevant (score, objectives, tickets, class).
- Use `uitext.ts` to create small persistent widgets (player HUD), and transient notifications for levelups/objective changes.
- Be conservative with frequent UI updates — throttle or update only on changes to reduce CPU/network churn.

---

## License & credits

- Template & helper utilities by **TastySyntax** — please include attribution when publishing or sharing.
- This repo is intended as a community starting point. Respect any Portal Editor / EA platform rules when you publish.
