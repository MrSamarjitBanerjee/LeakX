# LeakX

**LeakX** is a lightweight command-line security tool that scans your codebase for hardcoded secrets such as API keys, tokens, and passwords before they accidentally end up in version control.

```text
🔍 LeakX — scanning for secrets...

✖ GitHub Token
  File: src/config.js
  Line: 12
  Secret: ghp_...8B4a

Scan Summary
  Files Scanned : 42
  Secrets Found : 1
  Scan Duration : 0.08s
```

## Why LeakX?

Hardcoded secrets are one of the most common and preventable security mistakes in software projects.

LeakX provides a fast, zero-configuration way to detect potentially exposed secrets locally, before they reach Git, GitHub, or a CI/CD pipeline.

## Features

- 🔎 Scan a single file, directory, or multiple paths
- 🌐 Support for glob patterns
- 🚫 Automatically ignores `node_modules`, `.git`, `dist`, and `build`
- 📄 Respects your project's `.gitignore`
- 🔐 Detects common secret patterns including GitHub tokens, AWS access keys, OpenAI API keys, generic API keys, and hardcoded passwords
- 🎭 Masks detected secrets in scan output
- 🛡️ Gracefully handles unreadable files by skipping them with a warning
- ⚡ Fast and dependency-light
- 🔧 Simple CLI interface with no configuration required

## Requirements

- Node.js 18 or higher
- npm 9 or higher

## Installation

Install LeakX globally with npm:

```bash
npm install -g leakx
```

Then use the `leakx` command from any project:

```bash
leakx scan .
```

## Usage

### Scan the current directory

```bash
leakx scan .
```

### Scan a specific directory

```bash
leakx scan ./src
```

### Scan a single file

```bash
leakx scan app.ts
```

### Scan multiple paths

```bash
leakx scan ./frontend ./backend
```

### Scan using a glob pattern

```bash
leakx scan "./src/**/*.ts"
```

## Run with npx

You can also run LeakX without installing it globally:

```bash
npx leakx scan .
```

For example:

```bash
npx leakx scan ./src
```

No global installation is required when using `npx`.

## What LeakX Detects

| Secret Type        | Example                                    |
| ------------------ | ------------------------------------------ |
| GitHub Token       | `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| AWS Access Key     | `AKIAIOSFODNN7EXAMPLE`                     |
| OpenAI API Key     | `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`   |
| Generic API Key    | `apiKey = "xxxxxxxxxxxxxxxxxxxxxx"`        |
| Hardcoded Password | `password = "example-password"`            |

Detection is currently **regex-based**, making it simple, predictable, and easy to extend with additional patterns.

## Supported Files

LeakX can scan common source-code and configuration files, including:

- JavaScript / TypeScript
- Python
- Java
- C / C++
- JSON
- YAML / YML
- Environment and configuration files
- Other text-based source files

## Ignored Paths

LeakX automatically skips common generated or dependency directories:

```text
node_modules/
.git/
dist/
build/
```

It also respects entries defined in your project's `.gitignore`.

## Exit Codes

LeakX uses exit codes to make integration with scripts and CI/CD pipelines simple.

| Exit Code | Meaning                                |
| --------- | -------------------------------------- |
| `0`       | No secrets detected                    |
| `1`       | One or more potential secrets detected |

Example:

```bash
leakx scan .
```

If a potential secret is detected, LeakX exits with code `1`.

## CI / Pre-Commit Usage

Because LeakX returns a non-zero exit code when potential secrets are detected, it can be integrated into CI pipelines or Git hooks.

Example:

```bash
leakx scan .
```

This allows your pipeline to fail when potential hardcoded secrets are found.

## How It Works

LeakX:

1. Reads the specified files and directories.
2. Applies built-in regular-expression patterns.
3. Identifies potential hardcoded secrets.
4. Masks detected values in the terminal output.
5. Displays a scan summary.
6. Returns an appropriate exit code.

## License

MIT
