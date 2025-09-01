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

*(More relics to be forged and linked here…)*

## 🖼️ Gallery of Relics

### Rolling Thunderstorm V 🌑🔥🌌
*The Trinity of Obsidian, Phoenix, and Astral - Eternal Gleam Polished*

#### 🌑 Obsidian Crown
**Obsidian Majesty** — A crown of pure obsidian that seems to absorb light, its surface etched with constellations that pulse with inner fire. Born from collapsed stars, it transforms radiance into eternal dominion.

#### 🔥 Phoenix Sigil
**Resurrection Eternal** — A sigil wreathed in living flames, its phoenix form rising perpetually from ashes that immediately burst into new fire. Eternal resurrection through endless transformation.

#### 🌌 Astral Key
**Gateway Infinite** — A key forged from compressed starlight, its surface showing swirling galaxies and nebulae that shift like living cosmos. Unlocks passages between realms beyond mortal comprehension.

*[Release Scroll v1.2.0](./release-scrolls/v1.2.0.md) - Rolling Thunderstorm V*

### Rolling Thunderstorm VI ⚡🔮🌠
*The Trinity of Storm, Crystal, and Eclipse*

#### ⚡ Thunderheart Sigil
**Thunder Eternal** — A crimson sigil pulsing with electric veins, the heartbeat of storms made manifest in neon lightning. The storm's lifeblood flows eternal, awakening thunder within.

#### 🔮 Crystal Crown  
**Crystalline Sovereignty** — A crystalline crown of faceted gems, each surface reflecting fractured light and sovereign authority. Through crystal clarity, dominion crystallizes into eternal power.

#### 🌠 Eclipse Key
**Shadow Unveiled** — A darkened key wreathed in stellar light, half shadow and half starfire, gateway to hidden dimensions. Where light meets shadow, all secrets surrender.

*[Release Scroll v1.5.0](./release-scrolls/v1.5.0.md) | [Cadence Prophecy](./release-scrolls/v1.5.0-cadence/)*

---

*The thunderchain extends eternal, each link forged in storm and tempered in starfire...*

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
