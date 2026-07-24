# Workshop Voluntold Tool

A customizable workshop tool for picking names to pitch - featuring an interactive **Decision Wheel** and physics-based **Marble Pursuit** course. Perfect for meetings, workshops, and presentations.

Everything runs on your computer. After the first dependency install, the tool does not need internet access.

## Quick start

### 1. Install Node.js

Install [Node.js 22](https://nodejs.org/) (the LTS release). This repository pins version **22.13.0** in `.nvmrc` and `.node-version`.

### 2. Start the tool

Use the launcher for your operating system from the project folder:

| System | Easiest launch | Terminal command |
|---|---|---|
| Windows | Double-click `start.cmd` | `start.cmd` |
| Windows PowerShell | Right-click `start.ps1`, then **Run with PowerShell** | `.\start.ps1` |
| macOS | Double-click `start.command` | `./start.command` |
| Linux | Open a terminal in the folder | `./start.sh` |

The first launch installs exact dependency versions, builds the app, and starts it. Open [http://127.0.0.1:4173](http://127.0.0.1:4173) after the launcher reports that the app is ready.

Prefer npm? The equivalent one-command workflow is:

```bash
npm start
```

## Use the tool

- Choose **Edit Roster** to add names, customize wording, and set up your participant list
- Choose **Decision Wheel**, then select **Spin the Wheel** to randomly pick participants
- Choose **Marble Pursuit** for a physics-based race of your participants
- Choose **Present** or press `P` to hide editing controls and enter presentation mode

## Development

```bash
npm ci
npm run dev
```

Before submitting changes, run:

```bash
npm run check
```

Licensed under the [MIT License](LICENSE).
