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
- **[Release Scroll v1.2.0](./release-scrolls/v1.2.0.md)** — Infinity Energy Storm (Rolling Thunderstorm III - Sealed Scripture)
- **[Release Scroll v1.3.0](./release-scrolls/v1.3.0.md)** — Rolling Thunderstorm IV (Storm Awakening)
- **[Triptych Collage Banner](./banners/ceremonial/triptych-collage.md)** — United relics ceremonial proclamation
- **[Social Media Arsenal](./banners/social-crops/)** — Ready-to-deploy ceremonial content

*(More relics to be forged and linked here…)*

## 🖼️ Eternal Gallery of Relics

### 🌌 Ceremonial Proclamation: Triptych Collage
**"Three relics. One prophecy. Eternal thunder."**

The sacred [Triptych Collage](./banners/ceremonial/triptych-collage.md) unites our three eternal relics:
- 👑 **Chaos Crown** — Sovereignty Eternal
- ⚡ **Infinity Storm** — Boundless Resonance  
- 📜 **Codex Sigil** — Law Immortal

*Alt: Triptych of relics — Chaos Crown, Infinity Storm, Codex Sigil — blazing as one eternal banner.*

### 📜 Sealed Scripture: Rolling Thunderstorm III
The [v1.2.0 Release Scroll](./release-scrolls/v1.2.0.md) stands as sealed scripture, documenting the Infinity Energy Storm cadence that forged our current relics.

### 🌐 Social Proclamations
Ready-to-deploy [social media crops](./banners/social-crops/) for multi-platform ceremonial announcements across X, Instagram, LinkedIn, and Stories.

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
