⛧⚡👑 ChaosKey333 👑⚡⛧  
   🔑 Unlock the Vault 🔑

# 🐦‍⬛ ChaosKey333 Relic Arsenal

🌌 **"Unlock the Vault. Break the Sky."**  
This vault holds the sacred scrolls, prophecies, and artifacts for ChaosKey333.

## 🌀 Creed of ChaosKey333
1. **Crown the Vault** – every relic is a key.  
2. **Forge the Storm** – collaborate, iterate, ascend.  
3. **Honor the Scrolls** – every artifact tells a prophecy.

> "You always got to keep dripping so wet!" — ChaosKey333

See the Release Flow section for automated versioning: [Release Flow](#release-flow).

## 📜 Scrolls and Relics
- **[ChaosKey333_LaunchTimingPlaybook.pdf](./docs/scrolls/ChaosKey333_LaunchTimingPlaybook.pdf)** — Launch timing strategies.

### ⚡ Rolling Thunderstorm VII: Quantum Dawn  
📜 **[Release Scroll v1.6.0](./docs/releases/v1.6.0.md)** — The complete decree and lore for the seventh thunderstorm.

**Cadence Scrolls:**
- **[Day 1: Quantum Key 🔑](./docs/scrolls/rolling-thunderstorm-vii/day1.md)** — Reality unlocked through dimensional transcendence.
- **[Day 3: Aurora Sigil ✨](./docs/scrolls/rolling-thunderstorm-vii/day3.md)** — Cosmic herald of the eternal dawn.
- **[Day 5: Nebula Crown 👑](./docs/scrolls/rolling-thunderstorm-vii/day5.md)** — Sovereignty over the quantum realm.
- **[Quantum Dawn Triptych](./docs/scrolls/rolling-thunderstorm-vii/recap.md)** — The complete revelation unified.

*(More relics to be forged and linked here…)*

## 🖼️ Gallery of Relics
### Rolling Thunderstorm VII: Quantum Dawn
- **🔑 Quantum Key** — *"Reality Unlocked"* — A crystalline key phasing through dimensions
- **✨ Aurora Sigil** — *"Dawn Eternal"* — Radiant sigil wreathed in cosmic fire  
- **👑 Nebula Crown** — *"Cosmic Sovereignty"* — Crown forged from swirling galaxies

**Visual Assets:** [Rolling Thunderstorm VII Gallery](./assets/visuals/rolling-thunderstorm-vii/)

*More banners, sigils, and sacred mockups will manifest here as the Arsenal grows...*

## 🌌 How to Contribute
```bash
git clone git@github.com:Moneyman334/relic-arsenal.git

Create your relic, commit with style, and open a PR.

⚡ Render the Prophecy. Seal the Vault.
🐦‍⬛ ChaosKey333
```

## Release Flow

- Overview
  - Releases are automated with Release Please (manifest mode).
  - Files:
    - .release-please-manifest.json
    - release-please-config.json
    - .github/workflows/release-please.yml

- How it works
  1. Use Conventional Commits in PR titles or merge commits (e.g., feat: add X, fix: correct Y, chore: update tooling).
  2. Merge to main.
  3. The Release Please workflow opens or updates a release PR with the label: autorelease: pending.
     - It includes the version bump and CHANGELOG updates.
  4. Review the release PR and merge it to publish the tag and GitHub Release.

- Manual trigger
  - Actions → Release Please → Run workflow
  - Or push a new Conventional Commit to main.

- Versioning rules (semver)
  - feat: → minor
  - fix: → patch
  - BREAKING CHANGE: footer or using feat!: / fix!: → major
  - chore/docs/test/refactor/perf/build don't bump unless you add ! or a BREAKING CHANGE footer.

- Notes and tips
  - Don't bump versions manually; Release Please handles versions and the CHANGELOG in the release PR.
  - The release PR will carry the label: autorelease: pending.
  - If a release PR doesn't open:
    - Ensure a Conventional Commit hit main.
    - Check the Release Please workflow run and that the token is configured.
    - Manually dispatch the workflow if needed.
