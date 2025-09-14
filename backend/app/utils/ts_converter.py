import json
from typing import Any

def json_to_ts(obj: dict, indent: int = 2, level: int = 1) -> str:
    """
    Convert a Python dictionary into a TypeScript object string.

    Explanation:
    - Handles nested dicts, lists, numbers, and strings.
    - Preserves indentation for readability in the .ts file.
    - Used when appending a candidate into mockCandidates.ts.

    Args:
        obj (dict): Python dictionary to convert.
        indent (int): Number of spaces for indentation.
        level (int): Current nesting level.

    Returns:
        str: TypeScript-formatted object string.
    """
    spaces = " " * (indent * level)
    inner = []

    for k, v in obj.items():
        if isinstance(v, str):
            inner.append(f'{spaces}{k}: "{v}"')
        elif isinstance(v, (int, float)):
            inner.append(f"{spaces}{k}: {v}")
        elif isinstance(v, list):
            if all(isinstance(x, dict) for x in v):
                arr = ",\n".join(json_to_ts(x, indent, level + 2) for x in v)
                inner.append(f"{spaces}{k}: [\n{arr}\n{spaces}]")
            elif all(isinstance(x, str) for x in v):
                arr = ", ".join(f'"{x}"' for x in v)
                inner.append(f"{spaces}{k}: [{arr}]")
            else:
                inner.append(f"{spaces}{k}: {v}")
        elif isinstance(v, dict):
            inner.append(f"{spaces}{k}: {json_to_ts(v, indent, level + 1)}")
        else:
            inner.append(f"{spaces}{k}: {json.dumps(v)}")

    return "{\n" + ",\n".join(inner) + "\n" + " " * (indent * (level - 1)) + "}"
