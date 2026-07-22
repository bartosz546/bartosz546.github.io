## How to work

Always use subagents. Never implement in this context.

For every task in prd.md:
1. Spawn planner → returns spec + file manifest
2. Spawn code-developer → returns implemented files
3. Spawn code-reviewer → returns findings
4. If findings non-trivial → spawn code-developer again
5. Spawn unit-tester → returns test results
6. Mark task complete only when reviewer approves + tests pass
7. Log completion in activity.md

Do not paste implementation, specs, or test output into this context.
Return one-line summaries only.
