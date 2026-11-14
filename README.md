# An Empirical Study of Test-Driven Development and Accessibility Prompting in LLM-Generated Web Interfaces

Experiment artifact for the ECE 720 (University of Alberta, Fall 2026) report by Josbel Luna, Kaparthini Reshmi and Onesh Punchinilame. It contains only what the report uses: the 20 runs (5 conditions × 2 models × 2 runs), the prompts, the harness that ran them, the 90-check accessibility checklist and the evaluation results.

## Contents

- [`experiment/`](experiment): harness, prompts, checklist and evaluation scripts. [`experiment/README.md`](experiment/README.md) describes the conditions, isolation and how to run them.
- [`experiment/runs/`](experiment/runs): one folder per run with the session transcripts (`session-*.jsonl`), run metadata (`meta.json`), automated results (`score.json`) and manual results (`manual.json`).
- [`experiment/runs/index.html`](experiment/runs/index.html): results dashboard with every metric in the report, per condition, model and run. Download it and open it in a browser, or rebuild it with `node experiment/dashboard.mjs`.
- [`experiment/runs/metrics.json`](experiment/runs/metrics.json): the same metrics as JSON (`node experiment/metrics.mjs`).

## Generated pages

The agent worked in a separate app repository, `stride`. Its starting point and the 20 generated pages are published here as branches:

- `pages/main`: the starting app, a React + Vite app with `REQUIREMENTS.md` and an empty product page.
- `pages/v2-<condition>-<model>-<run>`: the page one run produced, with one commit per session. In TDD runs the first commit holds the Red-phase tests and the second the Green-phase implementation.

To rebuild a local `stride` repository with the branch names the scripts expect:

```bash
git init stride && cd stride
git fetch --update-head-ok https://github.com/ece-720-fall-2026/a11y-tdd-experiment 'refs/heads/pages/*:refs/heads/*'
git checkout main
```

Then point the scripts at it with `STRIDE_REPO=/path/to/stride`, for example `experiment/score.sh v2-baseline-agnostic-haiku-1` or `node experiment/inspect.mjs v2-baseline-agnostic-haiku-1`.
