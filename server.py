#!/usr/bin/env python3
"""
IM & KOOM (อิ่ม & คุ้ม) - Local Web Server Runner
Runs a local HTTP server with live preview.
"""
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for snappy demo experience
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def main():
    port = PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    # Try port, or increment if busy
    max_tries = 10
    httpd = None
    for p in range(port, port + max_tries):
        try:
            httpd = socketserver.TCPServer(("", p), Handler)
            port = p
            break
        except OSError:
            continue

    if not httpd:
        print(f"Error: Could not bind to ports {PORT}..{PORT+max_tries}")
        sys.exit(1)

    url = f"http://localhost:{port}"
    print("=" * 60)
    print("🌿 IM & KOOM (อิ่ม & คุ้ม) - B2B2C Surplus Food Platform")
    print(f"🚀 DEMO App is running at: {url}")
    print(f"📁 Serving files from: {DIRECTORY}")
    print("💡 Press Ctrl+C to stop the server.")
    print("=" * 60)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server... Goodbye!")
        httpd.server_close()

if __name__ == '__main__':
    main()
