import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

describe('Release Verifier', () => {
  it('script exists and is executable', () => {
    expect(existsSync('scripts/release_verifier.sh')).toBe(true);
    
    // Check if script has execute permissions
    const stats = require('fs').statSync('scripts/release_verifier.sh');
    expect(stats.mode & parseInt('111', 8)).toBeGreaterThan(0);
  });

  it('script has proper shebang and set options', () => {
    const content = readFileSync('scripts/release_verifier.sh', 'utf8');
    expect(content).toMatch(/^#!/);
    expect(content).toContain('set -euo pipefail');
  });

  it('script contains emit_blessing function', () => {
    const content = readFileSync('scripts/release_verifier.sh', 'utf8');
    expect(content).toContain('emit_blessing()');
    expect(content).toContain('QA_Blessing_${TAG}.md');
  });

  it('script validates basic format when called with help', () => {
    try {
      execSync('./scripts/release_verifier.sh', { 
        cwd: process.cwd(),
        stdio: 'pipe'
      });
    } catch (error: any) {
      // Script should exit with usage when no args provided
      expect(error.stdout.toString()).toContain('Usage:');
    }
  });

  it('workflow file exists and has proper structure', () => {
    expect(existsSync('.github/workflows/verify-release.yml')).toBe(true);
    
    const content = readFileSync('.github/workflows/verify-release.yml', 'utf8');
    expect(content).toContain('name: Verify Release');
    expect(content).toContain('workflow_dispatch');
    expect(content).toContain('publish_issue');
    expect(content).toContain('upload-artifact');
    expect(content).toContain('github-script');
  });

  it('documentation exists', () => {
    expect(existsSync('docs/RELEASING.md')).toBe(true);
    
    const content = readFileSync('docs/RELEASING.md', 'utf8');
    expect(content).toContain('Release Documentation');
    expect(content).toContain('QA Blessing');
    expect(content).toContain('ChaosKey333');
  });

  it('gitignore excludes output directory', () => {
    const content = readFileSync('.gitignore', 'utf8');
    expect(content).toContain('out/');
  });
});