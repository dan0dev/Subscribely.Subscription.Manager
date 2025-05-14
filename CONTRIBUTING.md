# Contributing to Subscribely

Thank you for your interest in contributing to the Subscribely project! We welcome all contributions.

This document provides guidelines for contributing to the project. Please read it carefully to ensure a smooth collaboration process.

## How Can You Contribute?

### Reporting Bugs

If you find a bug in the application, please report it on the project's [GitHub Issues](https://github.com/dan0dev/Subscribely.Subscription.Manager/issues) page.
When reporting a bug, please provide as much information as possible:
-   Steps to reproduce the bug.
-   What happened, and what was the expected behavior.
-   Browser and operating system version (if relevant).
-   Screenshots or videos that help illustrate the bug.

### Suggesting Enhancements

Have new ideas or suggestions for improvements? You can also share these on the project's [GitHub Issues](https://github.com/dan0dev/Subscribely.Subscription.Manager/issues) page.
Use a clear title and provide a detailed description of your suggestion.

### Code Contributions

1.  **Fork the Repository:** Create your own copy (fork) of the [Subscribely repository](https://github.com/dan0dev/Subscribely.Subscription.Manager) to your GitHub account.
2.  **Clone Your Fork:** `git clone https://github.com/YOUR_USERNAME/Subscribely.Subscription.Manager.git` (replace `YOUR_USERNAME` with your GitHub username).
3.  **Create a New Branch:** `git checkout -b feature/new-feature` or `git checkout -b bugfix/issue-fix`. Use descriptive branch names (e.g., `feature/add-paypal-integration` or `fix/login-button-alignment`).
4.  **Set Up Your Development Environment:** Follow the instructions in the "Installation" section of the `README.md` file to install and run the project locally.
5.  **Make Your Changes:** Write your code, adhering to the project's coding style and conventions (see below).
6.  **Test Your Changes:** Ensure your changes do not introduce new bugs and function as expected. If you're experienced, consider writing unit tests or integration tests for new features or fixes.
7.  **Commit Your Changes:** Use [Conventional Commits](https://www.conventionalcommits.org/) format for your commit messages (e.g., `feat: add new login button`, `fix: correct validation error on signup`).
    ```bash
    git add .
    git commit -m "feat: detailed description of the change"
    ```
8.  **Push Your Changes to Your Fork:** `git push origin YOUR_DEFAULT_BRANCH_NAME feature/new-feature` (replace `YOUR_DEFAULT_BRANCH_NAME` with the default branch name of your forked repository, e.g., `master`).
9.  **Open a Pull Request (PR):**
    *   Navigate to your forked Subscribely repository on GitHub.
    *   Click the "New pull request" or "Compare & pull request" button.
    *   Select your `feature/new-feature` branch as the source (`head repository`) and the `dan0dev/Subscribely.Subscription.Manager` repository's `master` (or current main) branch as the target (`base repository`).
    *   Provide a clear title and a detailed description for your Pull Request, summarizing the changes and referencing any related issues (e.g., "Closes #123").

### Pull Request Process

1.  The Pull Request will be reviewed by the project maintainer (@dan0dev).
2.  You may receive feedback or requests for modifications. Please be open to constructive criticism.
3.  Once the PR has passed review, all tests (if any) are successful, and everything is in order, the maintainer will merge it into the main branch.

## Development Environment Setup

To set up your development environment, follow the instructions in the [Installation](#-installation) section of the `README.md` file. Ensure your `.env.local` file is configured correctly for local development.

## Coding Guidelines

To maintain a consistent and readable codebase, please adhere to the following guidelines:

-   **Language:** TypeScript. The project is strongly typed; leverage the benefits of TypeScript.
-   **Commit Messages:** [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). This helps with automated versioning and changelog generation.
-   **Formatting and Linting:** The project uses Prettier and ESLint. Husky and lint-staged will automatically run these before commits to ensure code quality.
    -   You can also run them manually: `npm run lint` for checking, `npm run format` for automatic formatting.
-   **Documentation:** Use JSDoc comments to document functions, classes, types, and more complex code sections.
-   **Styling:** Tailwind CSS. Follow existing styling conventions.

## Code of Conduct

This project aims to provide a friendly, safe, and welcoming environment for everyone, regardless of gender, sexual orientation, disability, ethnicity, religion, or other personal characteristics. A formal Code of Conduct is currently under development. In the meantime, please be respectful, professional, and constructive in all interactions. Harassment or discrimination in any form will not be tolerated. Such behavior can be reported to the project maintainer.

## Questions?

If you have any questions about contributing that are not covered in this document, feel free to open an issue on the [GitHub Issues](https://github.com/dan0dev/Subscribely.Subscription.Manager/issues) page with the "question" label, or contact the project maintainer.

Thank you for helping make Subscribely better!
