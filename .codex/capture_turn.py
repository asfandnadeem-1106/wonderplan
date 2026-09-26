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


def existing_log(logs_dir: Path, session_id: str) -> Path | None:
    matches = sorted(logs_dir.glob(f"*_{session_id}.md"))
    return matches[-1] if matches else None


def metadata(log_path: Path, key: str, default: str = "") -> str:
    match = re.search(rf"(?m)^{re.escape(key)}: (.*?)$", log_path.read_text(encoding="utf-8"))
    return match.group(1) if match else default


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

    if event_name == "UserPromptSubmit":
        prompt = event.get("prompt")
        if not isinstance(prompt, str):
            return
        log_path = existing_log(logs_dir, session_id)
        if log_path:
            number = int(metadata(log_path, "total_exchanges", "0")) + 1
            first_prompt_time = metadata(log_path, "first_prompt_time", stamp)
        else:
            filename = f"{timestamp:%Y-%m-%d_%H-%M-%S}_{session_id}.md"
            number = 1
            first_prompt_time = stamp
            log_path = logs_dir / filename
        if number == 1:
            author = os.environ.get("GIT_AUTHOR_NAME") or "asfand-swapp"
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
    elif event_name == "Stop":
        response = event.get("last_assistant_message")
        log_path = existing_log(logs_dir, session_id)
        if not isinstance(response, str) or not log_path:
            return
        number = int(metadata(log_path, "total_exchanges", "0"))
        contents = log_path.read_text(encoding="utf-8")
        if f"[LOG_ENTRY type=RESPONSE num={number} session={session_id}]" in contents:
            return
        with log_path.open("a", encoding="utf-8") as log:
            log.write(
                f"[LOG_ENTRY type=RESPONSE num={number} session={session_id}]\n"
                f"timestamp: {stamp}\nmodel: {model}\n\n{response}\n\n\n"
            )


if __name__ == "__main__":
    main()
