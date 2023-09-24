# iLab Frontend: Laboratory Asset Management Platform

Welcome to the iLab frontend repository. This project serves as the user interface for the iLab Laboratory Asset Management Platform. It's built upon Bootstrap 5, tailored with a modern design inspired by the [Modernize theme](https://themewagon.com/themes/modernize/).

Project detail can be found in [this Google Docs](https://docs.google.com/document/d/1LrAqqTd58ldKJLBiHCrjrwJL641t1vtTooFNEX3d2c8/edit?usp=sharing)

Codebase is located at https://github.com/BU-CS633/iLab, and you can access the production with https://ilab-cs633.onrender.com.

## Development Workflow
Trunk based development will be used to allow smooth collaboration and faster feature release. The implementation is below:

1. Suppose you take a task from Pivotal Tracker, checkout from the main branch and create a new branch for your development.
```bash
Git checkout main
Git checkout -b <your_development_branch_name>
```
2. Do the code.
3. Push your development branch.
```bash
Git add .
Git commit -m "<your_commit_message>"
Git push origin <your_development_branch_name>
```
4. Create a pull request from your development branch into main.
Make sure it has no conflict.
5. Ask for a review.
6. If you need to change something, do steps 2 and 3, and then ask to review again.
7. Once the PR is approved, merge PR to the main branch to trigger the deployment process.

## Installation

1. Clone the Repository
```bash
git clone https://github.com/BU-CS633/iLab.git
cd iLab
```

2. Navigate to `Assets/` to for the CSS and JS files.

