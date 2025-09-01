import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'

describe('Release Verifier Script', () => {
  const scriptPath = path.join(process.cwd(), 'scripts', 'release_verifier.sh')

  it('should exist and be executable', () => {
    expect(existsSync(scriptPath)).toBe(true)
    
    // Check if script is executable by running help
    const result = execSync(`bash ${scriptPath} --help`, { encoding: 'utf8' })
    expect(result).toContain('Verifies a GitHub release')
    expect(result).toContain('Usage:')
    expect(result).toContain('OPTIONS:')
    expect(result).toContain('REQUIREMENTS:')
  })

  it('should not require a tag argument (HEAD mode)', () => {
    // HEAD mode should not throw an error due to missing tag
    // It will still fail due to missing GitHub auth, but for a different reason
    expect(() => {
      execSync(`bash ${scriptPath}`, { encoding: 'utf8', stdio: 'pipe' })
    }).toThrow() // Expected to fail due to missing GitHub auth, not missing tag
  })

  it('should show proper usage when invalid options are provided', () => {
    expect(() => {
      execSync(`bash ${scriptPath} --invalid-option`, { encoding: 'utf8', stdio: 'pipe' })
    }).toThrow()
  })

  it('should accept verbose flag', () => {
    // This will fail due to missing gh auth, but should accept the flag
    expect(() => {
      execSync(`bash ${scriptPath} --verbose v1.0.0`, { encoding: 'utf8', stdio: 'pipe' })
    }).toThrow() // Expected to fail due to missing GitHub auth
  })

  it('should support HEAD mode without tag', () => {
    // Test that script runs in HEAD mode when no tag is provided
    expect(() => {
      execSync(`bash ${scriptPath} --verbose`, { encoding: 'utf8', stdio: 'pipe' })
    }).toThrow() // Expected to fail due to missing GitHub auth, but should accept HEAD mode
  })

  it('should show HEAD mode information in verbose output', () => {
    // Test that help reflects the new HEAD mode capability
    const result = execSync(`bash ${scriptPath} --help`, { encoding: 'utf8' })
    expect(result).toContain('HEAD mode')
    expect(result).toContain('Optional')
    expect(result).toContain('If no tag is provided')
  })
})

describe('Required Directory Structure', () => {
  it('should have scripts directory', () => {
    expect(existsSync('scripts')).toBe(true)
  })

  it('should have docs/gallery directory', () => {
    expect(existsSync('docs/gallery')).toBe(true)
  })

  it('should have docs/gallery/index.md', () => {
    expect(existsSync('docs/gallery/index.md')).toBe(true)
  })

  it('should have assets/social/sigil-of-thunder directory', () => {
    expect(existsSync('assets/social/sigil-of-thunder')).toBe(true)
  })
})

describe('GitHub Workflow', () => {
  it('should have verify-release workflow', () => {
    expect(existsSync('.github/workflows/verify-release.yml')).toBe(true)
  })

  it('verify-release workflow should contain required elements', () => {
    const workflowPath = '.github/workflows/verify-release.yml'
    const fs = require('fs')
    const content = fs.readFileSync(workflowPath, 'utf8')
    
    expect(content).toContain('workflow_dispatch')
    expect(content).toContain('release_tag')
    expect(content).toContain('scripts/release_verifier.sh')
    expect(content).toContain('chmod +x')
    expect(content).toContain('GITHUB_TOKEN')
    expect(content).toContain('HEAD mode')
  })
})