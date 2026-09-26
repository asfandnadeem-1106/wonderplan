# Capture setup verification

## Tool and model

- Tool: Codex desktop (OpenAI Codex app).
- Model: GPT-6-Luna (`gpt-6-luna`) handled both planning and execution; no separate planner model was configured.
- Automatic lifecycle hooks are available in Codex. This setup uses `UserPromptSubmit` for the verbatim prompt and `Stop` for the final response.

## Mechanism

Project hooks are configured in `.codex/hooks.json` and implemented by `.codex/capture_turn.py`. Codex's `/hooks` review screen was used to review and trust both hook definitions. The canaries below were run in two fresh Codex CLI sessions using the same project hook configuration, without bypassing hook trust.

Logs: `.agent-logs/2026-09-26_19-12-55_01a0df22-726a-7b32-97b8-2abd3527a555.md` and `.agent-logs/2026-09-26_19-13-12_01a0df22-b76d-7b93-9cd3-6f0fe1512eee.md`.

## Canary 1 — raw captured entries

```text
[LOG_ENTRY type=PROMPT num=1 session=01a0df22-726a-7b32-97b8-2abd3527a555]
timestamp: 2026-09-26T19:12:55.225Z
model: gpt-6-luna

CAPTURE TEST — 8x assignment, Asfand. Reply exactly: CANARY ONE ACKNOWLEDGED.

[LOG_ENTRY type=RESPONSE num=1 session=01a0df22-726a-7b32-97b8-2abd3527a555]
timestamp: 2026-09-26T19:12:57.328Z
model: gpt-6-luna

CANARY ONE ACKNOWLEDGED.
```

## Canary 2 — raw captured entries

```text
[LOG_ENTRY type=PROMPT num=1 session=01a0df22-b76d-7b93-9cd3-6f0fe1512eee]
timestamp: 2026-09-26T19:13:12.801Z
model: gpt-6-luna

CAPTURE TEST — 8x assignment, Asfand. Reply exactly: CANARY TWO ACKNOWLEDGED.

[LOG_ENTRY type=RESPONSE num=1 session=01a0df22-b76d-7b93-9cd3-6f0fe1512eee]
timestamp: 2026-09-26T19:13:14.476Z
model: gpt-6-luna

CANARY TWO ACKNOWLEDGED.
```

## First attempt that did not work

The first `codex exec` attempt ran inside the workspace sandbox and failed to open Codex's state database in the user configuration directory (`attempt to write a readonly database`). Retrying the canary with the approved host execution context worked. I initially used `--dangerously-bypass-hook-trust` for two diagnostic canaries; after reviewing and trusting the hooks in `/hooks`, I repeated both canaries in fresh sessions without that option. The verified entries above are from the trusted runs.
