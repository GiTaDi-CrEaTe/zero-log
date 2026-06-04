# 🛡️ ZERO-LOG // Threat Hunter & Log Analyzer

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Privacy](https://img.shields.io/badge/Privacy-100%25_Client_Side-success?style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)

**ZERO-LOG** is a professional-grade, privacy-first threat hunting and log analysis engine engineered in React. It bridges the gap between rapid security auditing and strict data compliance by processing high-volume server logs (Nginx, Apache, AWS) entirely within the browser's local memory—ensuring zero data exfiltration.

🌐 **[Launch Live Dashboard](https://GiTaDi-CrEaTe.github.io/zero-log/)**

---

## 🧠 Core Intelligence & Architecture

Zero-Log goes beyond simple request counting. It utilizes a multi-layered heuristic engine written in JavaScript to identify malicious intent and deterministic attack patterns.

* **Zero-Trust Ingestion:** Utilizing the `PapaParse` library, the engine processes thousands of CSV log entries locally within the browser's sandbox, providing high-speed analysis with zero server latency or data leakage.
* **Volumetric Analysis:** The algorithm dynamically flags source IPs exceeding 50 requests (High Risk) or 200 requests (Critical Risk) to instantly identify Brute-Force and DDoS attack vectors.
* **UA Spoofing & Fingerprinting:** A built-in AI heuristic layer detects automated tooling signatures (e.g., `curl`, `python-requests`, `zgrab`, `wget`) even when attackers attempt to blend in with standard background traffic.
* **Deterministic Scoring:** Targets are assigned a risk score (0-100) based on endpoint targeting variety, frequency, and tool-based signatures, culminating in exportable WAF-ready JSON blocklists.

---

## 🚀 Execution & Simulation
```bash
### 1. Generate Simulated Attack Data
This repository includes a Python simulation script that generates a realistic server log (`malicious_payload.csv`) containing standard user traffic, a high-frequency Python botnet, and a critical-level endpoint brute-force attack.
# Run the simulation script to generate the CSV dataset
python generate_logs.py

2. Launch the React Engine

Start the local Vite development server to initialize the dashboard.
Bash

npm install
npm run dev

3. Hunt Threats

    Open the local interface (http://localhost:5173).

    Drag and drop the generated malicious_payload.csv into the Ingest Logs zone.

    The engine will instantly parse the data, map the traffic distribution via Recharts, and isolate the threat actors.

    Click Export JSON Dossier to download a structured threat report designed for immediate firewall integration.
⚙️ Tech Stack

    Frontend Framework: React 18, Vite

    Styling: Tailwind CSS

    Data Processing: PapaParse (Client-side CSV Ingestion)

    Data Visualization: Recharts

    Icons: Lucide React
