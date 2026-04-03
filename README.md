# Legit Anomaly Detection

A GitHub webhook anomaly detection system that monitors and flags suspicious GitHub repository activities in real-time.

## Overview

This application listens for GitHub webhook events and analyzes them using a modular checker system. Each checker validates specific types of potentially malicious or suspicious GitHub activities. When an anomaly is detected, the system logs an alert.

## Features

- **Real-time GitHub webhook processing** - Receives and processes GitHub events instantly
- **Modular checker architecture** - Easily extensible with new anomaly detectors
- **Multiple anomaly detectors** - Validates push events, team creation, and repository operations
- **Flexible configuration** - Environment-based settings for webhook secret and port

## Checkers

### PushChecker
Detects suspicious push activity during unusual hours.
- **Triggers when:** Code is pushed between 14:00-16:00 (2:00 PM - 4:00 PM)
- **Why:** Unusual push times may indicate unauthorized or automated attacks

### TeamsChecker
Detects creation of teams with suspicious names.
- **Triggers when:** A team containing "hacker" in its name is created
- **Why:** Attackers may create teams to organize malicious operations

### RepositoryChecker
Detects rapid repository deletion after creation.
- **Triggers when:** A repository is deleted within 10 minutes of creation
- **Why:** Quick deletion patterns may indicate accidental exposure of sensitive data or testing malicious repos

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yuvaldvir81-git/legit_anomaly_detection.git
   cd legit_anomaly_detection
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):
   ```bash
   export GITHUB_WEBHOOK_SECRET=your_webhook_secret
   export PORT=3000
   ```
   - If not set, defaults: `GITHUB_WEBHOOK_SECRET='test_secret'`, `PORT=3000`

## Usage

### Start the Server

```bash
npx ts-node listener.ts
```

The server will start listening on `http://127.0.0.1:3000/webhook`

### Configure GitHub Webhook

1. In your GitHub repository settings, go to **Settings → Webhooks**
2. Click **Add webhook**
3. **Payload URL:** `http://your-domain:3000/webhook` (use smee.io for local testing)
4. **Content type:** `application/json`
5. **Secret:** Use your `GITHUB_WEBHOOK_SECRET`
6. **Events to trigger:** Select:
   - Push events
   - Team events
   - Repository events
7. Click **Add webhook**

### Local Testing with Smee

For testing locally without exposing your machine:

```bash
npx smee-client -u https://smee.io/YOUR_WEBHOOK_URL -p 3000 -P /webhook
```

Then configure GitHub webhook to use your smee.io URL.

## How It Works

1. GitHub sends webhook events to the `/webhook` endpoint
2. The webhook handler validates the signature using `GITHUB_WEBHOOK_SECRET`
3. Based on the event type (`push`, `team`, `repository`), the appropriate checker is instantiated
4. The checker validates the event payload against its anomaly rules
5. If an anomaly is detected (`check()` returns `false`), the alert message is logged to console

## Example Alert Output

```
📩 Received GitHub event: push
Checking push timestamp: 2024-04-04T15:30:00.000Z
pushing code between 14:00-16:00

📩 Received GitHub event: team
A hacker team was created

📩 Received GitHub event: repository
Checking repository delete timing: suspicios-repo
Repository deleted within 10 minutes of creation
```

## Project Structure

```
src/
├── checkAll              # Helper functions to get all checker classes
├── checkers/
│   ├── checker.ts        # Checker interface definition
│   ├── pushChecker.ts    # Push event anomaly detector
│   ├── teamsChecker.ts   # Team creation anomaly detector
│   └── repositoryChecker.ts  # Repository deletion anomaly detector
└── utils.ts              # Utility functions

listener.ts              # Main webhook listener server
index.ts                 # Express-based HTTP server (alternative)
package.json             # Dependencies and scripts
tsconfig.json            # TypeScript configuration
```

## Extending with New Checkers

1. Create a new checker file in `src/checkers/` implementing the `Checker` interface:
   ```typescript
   import type { Checker } from './checker.ts';
   
   export class MyChecker implements Checker {
       name: String = 'MyChecker';
       payload: any;
       
       constructor(payload: any) {
           this.payload = payload;
       }
       
       check(): boolean {
           // Your anomaly detection logic
           return true; // Return false if anomaly detected
       }
       
       getMessage(): String {
           return 'Anomaly detected message';
       }
   }
   ```

2. Add the checker instance to `listener.ts`:
   ```typescript
   handler.on('your_event_type', (event) => {
       const myChecker = new MyChecker(event.payload);
       if (!myChecker.check()) {
           console.log(myChecker.getMessage());
       }
   });
   ```

## Dependencies

- `express` - Web framework
- `body-parser` - Request body parsing
- `github-webhook-handler` - GitHub webhook signature validation
- `smee-client` - Webhook forwarding for local testing
- `typescript` - TypeScript support
- `ts-node` - Execute TypeScript directly

## License

ISC
