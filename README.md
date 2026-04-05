# Trinetra 2.0: A Cyber-Ethics Adventure 🕵️‍♀️

Trinetra 2.0 is an interactive, web-based educational game designed to teach cybersecurity skills and ethical reasoning to Indian children. 

While most cybersecurity games focus strictly on the mechanics of safety (e.g., "don't click phishing links"), Trinetra 2.0 bridges the critical gap between technical skill and moral responsibility. Built specifically for the Indian context, the game tackles modern, hyper-relevant scenarios involving UPI architecture, Aadhaar data privacy, deepfake detection, and the Digital Personal Data Protection Act (DPDPA) 2023.

## 🎯 Project Motives & Target Audience
The primary motive of Trinetra 2.0 is to elevate students' digital literacy from simple rule-following to active ethical reasoning. 

**Uses and Objectives:**
* **Educational Tool:** Deployed in schools to provide hands-on, simulated experience with modern cyber threats.
* **Academic Research:** Acts as a data-collection instrument for field studies, securely capturing quantitative performance data and qualitative moral reasoning justifications.
* **Behavioral Change:** Encourages systemic thinking (e.g., whistleblowing, platform reporting) rather than just personal risk avoidance.

## 🔄 The Core Game Loop
The game utilizes a unique **Two-Phase Level Design** anchored in Kohlberg's stages of moral development:

* **Phase A (The Active Skill):** A timed, interactive simulation where players practice a specific cybersecurity skill. Examples include scanning local WiFi networks for honeypots, using drag-and-drop to match UPI threats to defenses, or utilizing a digital forensics scanner to identify deepfake artifacts.
* **Phase B (The Ethical Dilemma):** A narrative-driven ethical challenge based on the previous skill. Players are presented with difficult choices and experience branching consequences across three time horizons (Immediate, 1 Week, 1 Month). Finally, players must submit a free-text reflection journal defending their choice.

## 🏗️ Architecture & Under the Hood
Trinetra 2.0 utilizes a **Hybrid Architecture** to deliver both high-performance active gameplay and seamless UI rendering.

* **The React + Phaser Bridge:** React 18 acts as the master traffic controller, handling the overarching game state, menus, and the Phase B ethical dilemmas. Phaser 3 is embedded within React to handle the high-performance, 2D interactive canvas required for the Phase A skill challenges.
* **Serverless Backend (Firebase):** The project operates completely serverless to ensure frictionless deployment and data collection. 
    * **Anonymous Authentication:** The system silently authenticates users upon load, granting a unique ID without requiring the student to create an account or provide personal identifying information (PII).
    * **Firestore Telemetry:** A custom logging utility automatically pushes gameplay events to a cloud database. It silently tracks Phase A scores, Phase B choices, and captures the free-text reflections required for later qualitative academic analysis and Large Language Model (LLM) integration.
* **Deployment:** The application is hosted on Vercel, ensuring high availability and seamless mobile responsiveness for students playing on varied devices.

---
*Developed as part of an academic research initiative into digital ethics and cybersecurity education.*
