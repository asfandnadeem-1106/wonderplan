#!/usr/bin/env python3
"""Append only prompt/stop payloads to the assignment's per-session markdown log."""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


def now() -> datetime:
    return datetime.now(timezone.utc)


def safe_id(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9_-]", "", value) or "unknown-session"


def main() -> None:
    try:
        event = json.load(sys.stdin)
    except (json.JSONDecodeError, OSError):
        return

    session_id = safe_id(str(event.get("session_id") or "unknown-session"))
    event_name = event.get("hook_event_name")
    model = str(event.get("model") or "unknown")
    timestamp = now()
    stamp = timestamp.isoformat(timespec="milliseconds").replace("+00:00", "Z")
    project_root = Path(__file__).resolve().parent.parent
    logs_dir = project_root / ".agent-logs"
    logs_dir.mkdir(parents=True, exist_ok=True)
    state_dir = logs_dir / ".capture-state"
    state_dir.mkdir(exist_ok=True)
    state_path = state_dir / f"{session_id}.json"

    if event_name == "UserPromptSubmit":
        prompt = event.get("prompt")
        if not isinstance(prompt, str):
            return
        if state_path.exists():
            state = json.loads(state_path.read_text(encoding="utf-8"))
            filename = state["filename"]
            number = int(state.get("exchange_count", 0)) + 1
            first_prompt_time = state["first_prompt_time"]
        else:
            filename = f"{timestamp:%Y-%m-%d_%H-%M-%S}_{session_id}.md"
            number = 1
            first_prompt_time = stamp
        log_path = logs_dir / filename
        if not log_path.exists():
            author = os.environ.get("GIT_AUTHOR_NAME") or "asfand"
            project = project_root.name.replace(" ", "-")
            header = (
                "---\n"
                f"session_id: {session_id}\n"
                f"date: {timestamp:%Y-%m-%d}\n"
                f"author: {author}\n"
                f"model: {model}\n"
                "tool: codex-desktop\n"
                f"project: {project}\n"
                f"total_exchanges: {number}\n"
                f"first_prompt_time: {first_prompt_time}\n"
                f"last_prompt_time: {stamp}\n"
                "---\n\n"
                f"# Session Log - {timestamp:%Y-%m-%d}\n\n"
                f"Session: `{session_id[:8]}` | Project: `{project}` | Author: `{author}`\n\n"
                "---\n\n"
            )
            log_path.write_text(header, encoding="utf-8")
        with log_path.open("a", encoding="utf-8") as log:
            log.write(
                f"[LOG_ENTRY type=PROMPT num={number} session={session_id}]\n"
                f"timestamp: {stamp}\nmodel: {model}\n\n{prompt}\n\n\n"
            )
        contents = log_path.read_text(encoding="utf-8")
        contents = re.sub(r"(?m)^total_exchanges: .*?$", f"total_exchanges: {number}", contents, count=1)
        contents = re.sub(r"(?m)^last_prompt_time: .*?$", f"last_prompt_time: {stamp}", contents, count=1)
        log_path.write_text(contents, encoding="utf-8")
        state = {
            "filename": filename,
            "exchange_count": number,
            "first_prompt_time": first_prompt_time,
            "last_prompt_time": stamp,
            "model": model,
        }
        state_path.write_text(json.dumps(state), encoding="utf-8")
    elif event_name == "Stop":
        response = event.get("last_assistant_message")
        if not isinstance(response, str) or not state_path.exists():
            return
        state = json.loads(state_path.read_text(encoding="utf-8"))
        turn_id = str(event.get("turn_id") or "")
        if turn_id and state.get("last_response_turn_id") == turn_id:
            return
        log_path = logs_dir / state["filename"]
        with log_path.open("a", encoding="utf-8") as log:
            log.write(
                f"[LOG_ENTRY type=RESPONSE num={state['exchange_count']} session={session_id}]\n"
                f"timestamp: {stamp}\nmodel: {model}\n\n{response}\n\n\n"
            )
        state["last_response_time"] = stamp
        state["last_response_turn_id"] = turn_id
        state_path.write_text(json.dumps(state), encoding="utf-8")


if __name__ == "__main__":
    main()
