#!/usr/bin/env python3
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

try:
    import mysql.connector
    from mysql.connector import Error as MySQLError
except Exception:  # mysql connector may be missing in some environments
    mysql = None
    mysql_connector_available = False
else:
    mysql_connector_available = True

ROOT = Path(__file__).resolve().parent
DELETE_PASSWORD = os.environ.get("DELETE_PASSWORD", "123456")

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = int(os.environ.get("DB_PORT", "3306"))
DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
DB_NAME = os.environ.get("DB_NAME", "h71_u20210211")
DB_TABLE = os.environ.get("DB_TABLE", "loi ng khi lan dau")


def db_connect():
    if not mysql_connector_available:
        raise RuntimeError(
            "Thiếu thư viện mysql-connector-python. Vui lòng cài trên server chạy ứng dụng."
        )

    return mysql.connector.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        autocommit=True,
    )


def fetch_records():
    conn = db_connect()
    try:
        cursor = conn.cursor(dictionary=True)
        query = (
            f"SELECT `id`, `ngay`, `line_name`, `Dong_san_pham`, `loai_loi`, `nguyen_nhan`, `so_luong_loi` "
            f"FROM `{DB_TABLE}` ORDER BY `id` DESC"
        )
        cursor.execute(query)
        rows = cursor.fetchall()
        return [
            {
                "id": str(row.get("id")),
                "date": row.get("ngay", ""),
                "line": row.get("line_name", ""),
                "product": row.get("Dong_san_pham", ""),
                "defectType": row.get("loai_loi", ""),
                "reason": row.get("nguyen_nhan", ""),
                "qty": int(row.get("so_luong_loi", 0) or 0),
            }
            for row in rows
        ]
    finally:
        conn.close()


def insert_record(payload):
    conn = db_connect()
    try:
        cursor = conn.cursor()
        query = (
            f"INSERT INTO `{DB_TABLE}` "
            "(`ngay`, `line_name`, `Dong_san_pham`, `loai_loi`, `nguyen_nhan`, `so_luong_loi`) "
            "VALUES (%s, %s, %s, %s, %s, %s)"
        )
        values = (
            payload["date"],
            payload["line"],
            payload["product"],
            payload["defectType"],
            payload["reason"],
            payload["qty"],
        )
        cursor.execute(query, values)
        created_id = cursor.lastrowid
        return {
            "id": str(created_id),
            "date": payload["date"],
            "line": payload["line"],
            "product": payload["product"],
            "defectType": payload["defectType"],
            "reason": payload["reason"],
            "qty": payload["qty"],
        }
    finally:
        conn.close()


def delete_record(record_id):
    conn = db_connect()
    try:
        cursor = conn.cursor()
        query = f"DELETE FROM `{DB_TABLE}` WHERE `id` = %s"
        cursor.execute(query, (record_id,))
        return cursor.rowcount > 0
    finally:
        conn.close()


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

    def _send_db_error(self, err):
        self._send_json(
            500,
            {
                "error": "Database error",
                "detail": str(err),
                "db": {
                    "host": DB_HOST,
                    "port": DB_PORT,
                    "name": DB_NAME,
                    "table": DB_TABLE,
                },
            },
        )

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/records":
            try:
                self._send_json(200, fetch_records())
            except Exception as err:
                self._send_db_error(err)
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
            "qty": int(payload.get("qty", 0)),
        }

        if not all([record["date"], record["line"], record["product"], record["defectType"], record["reason"]]):
            self._send_json(400, {"error": "Fields must not be empty"})
            return
        if record["qty"] <= 0:
            self._send_json(400, {"error": "qty must be > 0"})
            return

        try:
            created = insert_record(record)
            self._send_json(201, created)
        except Exception as err:
            self._send_db_error(err)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path.startswith("/api/records/"):
            password = self.headers.get("X-Delete-Pass", "")
            if password != DELETE_PASSWORD:
                self._send_json(403, {"error": "Invalid password"})
                return

            record_id = unquote(path.replace("/api/records/", "", 1)).strip()
            if not record_id:
                self._send_json(400, {"error": "Missing record id"})
                return

            try:
                ok = delete_record(record_id)
                if not ok:
                    self._send_json(404, {"error": "Record not found"})
                    return
                self._send_json(200, {"ok": True})
            except Exception as err:
                self._send_db_error(err)
            return

        self.send_error(404, "Not found")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "4173"))
    server = ThreadingHTTPServer(("0.0.0.0", port), AppHandler)
    print(f"Server running at http://0.0.0.0:{port}")
    print(f"DB target: {DB_HOST}:{DB_PORT}/{DB_NAME}.{DB_TABLE}")
    server.serve_forever()
