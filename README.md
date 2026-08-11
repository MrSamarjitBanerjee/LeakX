

# LeakX



### Lightweight CLI Secret Scanner for Developers

LeakX is a fast, lightweight command-line security tool that scans your codebase for **hardcoded secrets** such as API keys, access tokens, and passwords before they accidentally make their way into Git repositories or CI/CD pipelines.




---

## What I Learned

Building LeakX helped me strengthen my understanding of building and publishing a real-world Node.js CLI package.

### TypeScript

* Structuring a TypeScript project for production
* Using interfaces and types for scanner results and detector logic
* Organizing code into reusable modules
* Compiling TypeScript for npm distribution

### Node.js CLI Development

* Building command-line interfaces with Node.js
* Working with command-line arguments
* Reading and processing files from the filesystem
* Handling paths, directories, and glob patterns
* Managing errors and unreadable files gracefully

### Secret Detection

* Designing regex-based detection patterns
* Detecting different types of credentials
* Handling false positives and false negatives
* Masking sensitive values before displaying them
* Designing extensible detector modules

### File Scanning

* Recursive file discovery
* `.gitignore`-aware scanning
* Filtering unnecessary directories
* Scanning multiple files efficiently

### npm Package Development

* Configuring `package.json` for a CLI package
* Creating and exposing a CLI binary
* Building and testing an npm package locally
* Using `npm pack --dry-run` to inspect package contents
* Publishing and versioning packages on npm
* Using `npx` to run published CLI tools

  
### Git & GitHub

* Structuring a production-ready repository
* Using `.gitignore` to prevent sensitive files from being committed
* Managing Git branches, commits, and remote repositories
* Publishing an open-source project on GitHub
  
---




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

Hardcoded credentials are a common security mistake in software development.

A developer might accidentally write:

```javascript
const apiKey = "your-api-key";
```

and commit it to Git.

LeakX provides a simple local security layer that helps detect potentially exposed credentials **before they reach version control**.

---

## Features

* 🔎 Scan files, directories, or multiple paths
* 🌐 Glob pattern support
* 🔐 Detect common API keys, tokens, and passwords
* 🎭 Mask detected secrets in terminal output
* 📄 Respect `.gitignore`
* 🚫 Automatically ignore common directories such as `node_modules`, `.git`, `dist`, and `build`
* ⚡ Fast and dependency-light
* 🛡️ Gracefully handle unreadable files
* 🚦 CI-friendly exit codes
* 🔧 Zero configuration required

---

## Supported Secret Types

| Secret Type        | Example                                    |
| ------------------ | ------------------------------------------ |
| GitHub Token       | `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| AWS Access Key     | `AKIAIOSFODNN7EXAMPLE`                     |
| OpenAI API Key     | `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`   |
| Generic API Key    | `apiKey = "xxxxxxxxxxxxxxxxxxxxxx"`        |
| Hardcoded Password | `password = "example-password"`            |

LeakX currently uses **regex-based detection**, making the detection logic predictable and easy to extend.

---

## Installation

### Install globally

```bash
npm install -g leakx
```

Then run:

```bash
leakx scan .
```

### Use with npx

No global installation is required:

```bash
npx leakx scan .
```

---

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

### Scan with a glob pattern

```bash
leakx scan "./src/**/*.ts"
```

---

## Example

Suppose your project contains:

```javascript
const githubToken = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxx";
```

Running:

```bash
leakx scan .
```

will report the potential secret without exposing the complete value:

```text
✖ GitHub Token
  File: src/config.js
  Line: 12
  Secret: ghp_...8B4a
```

LeakX then provides a summary:

```text
Scan Summary
  Files Scanned : 42
  Secrets Found : 1
  Scan Duration : 0.08s
```

---

## Exit Codes

LeakX is designed to work with automated workflows.

| Exit Code | Meaning                                |
| --------- | -------------------------------------- |
| `0`       | No potential secrets detected          |
| `1`       | One or more potential secrets detected |

This makes it possible to use LeakX in **CI/CD pipelines, scripts, and Git hooks**.

Example:

```bash
leakx scan .
```

A detected secret can cause the command to return exit code `1`, allowing a CI pipeline to stop the build.

---

## Ignored Files and Directories

LeakX automatically ignores common generated and dependency directories:

```text
node_modules/
.git/
dist/
build/
```

It also respects your project's `.gitignore`.

For example:

```gitignore
.env
node_modules/
dist/
```

LeakX will avoid scanning files excluded by these rules.

---

## How It Works

LeakX follows a simple scanning pipeline:

```text
Input Paths
     ↓
File Discovery
     ↓
.gitignore Filtering
     ↓
Secret Detection
     ↓
Secret Masking
     ↓
Scan Results
     ↓
Exit Code
```

The scanner discovers files, filters ignored paths, checks supported secret patterns, masks detected values, and reports the results.

---

## Project Structure

```text
LeakX/
├── src/
│   ├── cli.ts
│   ├── scanner.ts
│   │
│   ├── detectors/
│   │   ├── awsKey.ts
│   │   ├── genericApiKey.ts
│   │   ├── githubToken.ts
│   │   ├── openaiKey.ts
│   │   ├── password.ts
│   │   └── index.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── utils/
│       ├── fileDiscovery.ts
│       └── mask.ts
│
├── tests/
│   └── scanner.test.ts
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
└── LICENSE
```

---

## Development

Clone the repository:

```bash
git clone https://github.com/MrSamarjitBanerjee/LeakX.git
```

Navigate into the project:

```bash
cd LeakX
```

Install dependencies:

```bash
npm install
```

Run the project in development:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run tests:

```bash
npm test
```

---

## Limitations

LeakX is a **pattern-based secret scanner**.

Because it relies on regular expressions, it can produce:

* **False positives** — values that look like secrets but are not.
* **False negatives** — secrets that do not match the currently supported patterns.

LeakX should therefore be treated as a lightweight security layer, not a replacement for proper secret-management systems.

For production applications, use LeakX alongside:

* Environment variables
* Secret managers
* Git repository security controls
* Credential rotation
* CI/CD security checks

---

## Security Best Practice

If LeakX detects a real credential that has already been committed:

**Do not rely only on deleting the file or line.**

Immediately:

1. Revoke the exposed credential.
2. Generate a new credential.
3. Remove the secret from the repository history if necessary.
4. Check whether the credential was accessed or misused.

---

## Contributing

Contributions and improvements are welcome.

To contribute:

```bash
git clone https://github.com/MrSamarjitBanerjee/LeakX.git
cd LeakX
npm install
```

Create a new branch:

```bash
git checkout -b feature/your-feature
```

Make your changes, add tests where appropriate, and submit a pull request.

---

## License

MIT License.

See the [LICENSE](LICENSE) file for details.

---

## Links

* **npm:** https://www.npmjs.com/package/leakx
* **GitHub:** https://github.com/MrSamarjitBanerjee/LeakX

---

### Built with

**TypeScript · Node.js · npm**
