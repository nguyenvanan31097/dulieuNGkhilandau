#!/usr/bin/env python3
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
DATA_FILE = DATA_DIR / "records.json"


def ensure_data_file():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text("[]", encoding="utf-8")


def load_records():
    ensure_data_file()
    try:
        data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
        if isinstance(data, list):
            return data
    except json.JSONDecodeError:
        pass
    return []


def save_records(records):
    ensure_data_file()
    DATA_FILE.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")


class AppHandler(BaseHTTPRequestHandler):
    def _send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, file_path: Path, content_type: str):
        if not file_path.exists() or not file_path.is_file():
            self.send_error(404, "Not found")
            return
        content = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/records":
            self._send_json(200, load_records())
            return

        if path in ("/", "/index.html"):
            self._send_file(ROOT / "index.html", "text/html; charset=utf-8")
            return
        if path == "/app.js":
            self._send_file(ROOT / "app.js", "application/javascript; charset=utf-8")
            return
        if path == "/styles.css":
            self._send_file(ROOT / "styles.css", "text/css; charset=utf-8")
            return

        self.send_error(404, "Not found")

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/records":
            self.send_error(404, "Not found")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(length)
            payload = json.loads(raw_body.decode("utf-8"))
        except (ValueError, json.JSONDecodeError):
            self._send_json(400, {"error": "Invalid JSON"})
            return

        required_fields = ["date", "line", "product", "defectType", "reason", "qty"]
        if not isinstance(payload, dict) or any(field not in payload for field in required_fields):
            self._send_json(400, {"error": "Missing required fields"})
            return

        record = {
            "date": str(payload.get("date", "")).strip(),
            "line": str(payload.get("line", "")).strip(),
            "product": str(payload.get("product", "")).strip(),
            "defectType": str(payload.get("defectType", "")).strip(),
            "reason": str(payload.get("reason", "")).strip(),
            "qty": int(payload.get("qty", 0))
        }

        if not all([record["date"], record["line"], record["product"], record["defectType"], record["reason"]]):
            self._send_json(400, {"error": "Fields must not be empty"})
            return
        if record["qty"] <= 0:
            self._send_json(400, {"error": "qty must be > 0"})
            return

        records = load_records()
        records.append(record)
        save_records(records)
        self._send_json(201, record)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/records":
            self.send_error(404, "Not found")
            return

        save_records([])
        self._send_json(200, {"ok": True})


if __name__ == "__main__":
    ensure_data_file()
    port = int(os.environ.get("PORT", "4173"))
    server = ThreadingHTTPServer(("0.0.0.0", port), AppHandler)
    print(f"Server running at http://0.0.0.0:{port}")
    server.serve_forever()
