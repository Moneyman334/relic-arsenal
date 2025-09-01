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

### ⚡ Rolling Thunderstorm V — Shadows, Fire, and Stars

Three relics awaken: the Obsidian Crown, Phoenix Sigil, and Astral Key. One prophecy unites them: sovereignty, resurrection, and the unlocking of realms. The thunderchain roars unbroken.

#### 🌑 Obsidian Crown
- **[Day 1: The Shrouded Dawn](./docs/scrolls/Day1.md)** — Sovereignty cloaked in shadow, forged in lightning.

#### 🔥 Phoenix Sigil  
- **[Day 3: The Rebirth Flame](./docs/scrolls/Day3.md)** — Resurrection etched in the eternal cycle of fire and storm.

#### 🌌 Astral Key
- **[Day 5: The Gate Eternal](./docs/scrolls/Day5.md)** — Unlocking realms unbound, binding galaxies into the cadence of thunder.

#### 📋 Release Scroll
- **[v1.4.0: Rolling Thunderstorm V](./release-scrolls/v1.4.0.md)** — Complete cadence details and proclamation.

---

*(More relics to be forged and linked here…)*

## 🖼️ Gallery of Relics (Coming Soon)
Banners, sigils, and sacred mockups will live here.

### ⚡ Thunderchain Banners
```
🌑⚡🌑 Rolling Thunderstorm V ⚡🌑⚡
   Shadows • Fire • Stars
   
🌑 OBSIDIAN CROWN 🌑
🔥 PHOENIX SIGIL 🔥  
🌌 ASTRAL KEY 🌌

"Three relics awaken. One prophecy unites them."
```

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
