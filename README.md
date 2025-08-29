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

### 🚪⚡ ChaosKey333 Empire Vault Doors ⚡🚪

*The legendary twin sentinels that guard the Arsenal's might*

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                          ⛧⚡👑 ChaosKey333 👑⚡⛧                            ║
║                              🔑 EMPIRE VAULT DOORS 🔑                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║    ╔═══════════════════╗           ╔═══════════════════╗                    ║
║    ║   ⛧ CHAOS GATE ⛧   ║           ║  ⚡ EMPIRE GATE ⚡  ║                    ║
║    ║                   ║           ║                   ║                    ║
║    ║  CROWN THE VAULT  ║           ║   BREAK THE SKY   ║                    ║
║    ║                   ║           ║                   ║                    ║
║    ║  Every Relic is   ║           ║  Unlock the Might ║                    ║
║    ║     a Key         ║           ║     Within        ║                    ║
║    ║                   ║           ║                   ║                    ║
║    ║  ∞ ChaosKey333 ∞  ║           ║ 🐦‍⬛ LEGACY ETERNAL ║                    ║
║    ║                   ║     🔮    ║                   ║                    ║
║    ╚═══════════════════╝           ╚═══════════════════╝                    ║
║                                                                              ║
║                    "Unlock the Vault. Break the Sky."                       ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**🔮 The Legend:** Twin doors forged from digital storms, each bearing sacred inscriptions of the Arsenal's founding principles. The Chaos Gate guards treasures of the past, while the Empire Gate opens futures built to last.

**🗝️ Symbolism:** These doors embody the key to unlocking the Arsenal's might, serving as the ultimate emblem of ChaosKey333's legacy and dominion over digital realms.

**📍 Explore the Vault:**
- 📜 **[Full Lore](./docs/lore/vault-doors.md)** — The complete legend and prophecy
- 🎭 **[Banner Assets](./docs/assets/vault-doors/banners.md)** — ASCII art and visual elements
- 📋 **[Asset Manifest](./docs/assets/vault-doors/manifest.md)** — Complete catalog and usage guide

**🏷️ Sacred Hashtags:** `#UnlockTheVault` `#ChaosKey333Empire` `#BreakTheSky` `#CrownTheVault` `#ArsenalMight` `#VaultDoors`

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
