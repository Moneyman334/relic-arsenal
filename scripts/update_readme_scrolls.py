#!/usr/bin/env python3
"""
🔮 ChaosKey333 README Scrolls Auto-Sync Script
Generates and updates the Scrolls list in README.md with cosmic precision.

Usage:
    python scripts/update_readme_scrolls.py [--dry-run] [--verbose]
    
Features:
    - Scans docs/scrolls/ for PDF and Markdown files
    - Generates cosmic descriptions for scrolls
    - Updates README.md between <!-- SCROLLS:BEGIN --> and <!-- SCROLLS:END --> markers
    - Maintains ChaosKey333 aesthetic and formatting
    - Preserves existing manual entries
"""

import os
import sys
import argparse
import re
from pathlib import Path
from typing import List, Dict, Tuple, Optional
import hashlib

# Cosmic constants
SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent
SCROLLS_DIR = REPO_ROOT / "docs" / "scrolls"
README_PATH = REPO_ROOT / "README.md"

# Markers for README section
BEGIN_MARKER = "<!-- SCROLLS:BEGIN -->"
END_MARKER = "<!-- SCROLLS:END -->"

# Cosmic file type descriptions
COSMIC_DESCRIPTIONS = {
    ".pdf": "📜 Sacred knowledge scroll",
    ".md": "📝 Living wisdom document",
    ".txt": "📋 Cosmic text fragment",
    ".docx": "📄 Mystical manuscript",
    ".rtf": "📖 Ancient text format"
}

# Special scroll descriptions (can be customized)
SPECIAL_SCROLLS = {
    "detention_survival_guide": "Extended survival wisdom for GitHub/CI mastery",
    "launch_timing_playbook": "Strategic timing for cosmic launches",
    "chaos_manifesto": "The fundamental principles of ChaosKey333",
    "vault_architecture": "Technical blueprints of the cosmic vault",
    "storm_protocols": "Emergency procedures for quantum storms"
}


def get_cosmic_description(file_path: Path) -> str:
    """Generate a cosmic description for a scroll file."""
    file_name = file_path.stem.lower()
    extension = file_path.suffix.lower()
    
    # Check for special scroll descriptions
    for key, description in SPECIAL_SCROLLS.items():
        if key in file_name:
            return description
    
    # Generate description based on filename patterns
    if "guide" in file_name:
        return "Cosmic guidance for vault mastery"
    elif "tutorial" in file_name or "howto" in file_name:
        return "Step-by-step mystical instructions"
    elif "reference" in file_name or "api" in file_name:
        return "Technical incantations reference"
    elif "changelog" in file_name or "history" in file_name:
        return "Chronicle of storm evolution"
    elif "architecture" in file_name or "design" in file_name:
        return "Blueprint of cosmic structures"
    elif "security" in file_name:
        return "Vault protection protocols"
    elif "performance" in file_name:
        return "Lightning optimization wisdom"
    elif "troubleshooting" in file_name or "debug" in file_name:
        return "Storm debugging incantations"
    else:
        return COSMIC_DESCRIPTIONS.get(extension, "Cosmic knowledge artifact")


def scan_scrolls_directory() -> List[Dict]:
    """Scan the scrolls directory and return metadata for all scroll files."""
    if not SCROLLS_DIR.exists():
        print(f"⚠️  Scrolls directory not found: {SCROLLS_DIR}")
        return []
    
    scrolls = []
    supported_extensions = {'.pdf', '.md', '.txt', '.docx', '.rtf'}
    
    for file_path in sorted(SCROLLS_DIR.glob("*")):
        if file_path.is_file() and file_path.suffix.lower() in supported_extensions:
            # Calculate file size
            size_bytes = file_path.stat().st_size
            if size_bytes < 1024:
                size_str = f"{size_bytes} B"
            elif size_bytes < 1024 * 1024:
                size_str = f"{size_bytes / 1024:.1f} KB"
            else:
                size_str = f"{size_bytes / (1024 * 1024):.1f} MB"
            
            scroll_data = {
                'path': file_path,
                'name': file_path.name,
                'stem': file_path.stem,
                'extension': file_path.suffix.lower(),
                'size': size_str,
                'description': get_cosmic_description(file_path),
                'relative_path': file_path.relative_to(REPO_ROOT)
            }
            scrolls.append(scroll_data)
    
    return scrolls


def generate_scrolls_section(scrolls: List[Dict]) -> str:
    """Generate the markdown section for scrolls."""
    if not scrolls:
        return """🔮 *The cosmic scrolls await your contributions...*

To add sacred knowledge to the vault:
1. Create PDF or Markdown files in `docs/scrolls/`
2. Run this script or commit to trigger auto-update
3. Watch as your wisdom joins the cosmic arsenal"""

    lines = []
    
    # Group scrolls by type
    pdf_scrolls = [s for s in scrolls if s['extension'] == '.pdf']
    md_scrolls = [s for s in scrolls if s['extension'] == '.md']
    other_scrolls = [s for s in scrolls if s['extension'] not in ['.pdf', '.md']]
    
    # Add PDF scrolls
    if pdf_scrolls:
        for scroll in pdf_scrolls:
            link = f"./docs/scrolls/{scroll['name']}"
            lines.append(f"- **📜 [{scroll['name']}]({link})** — {scroll['description']}")
    
    # Add Markdown scrolls
    if md_scrolls:
        for scroll in md_scrolls:
            link = f"./docs/scrolls/{scroll['name']}"
            lines.append(f"- **📝 [{scroll['name']}]({link})** — {scroll['description']}")
    
    # Add other scrolls
    if other_scrolls:
        for scroll in other_scrolls:
            icon = "📄" if scroll['extension'] == '.docx' else "📋"
            link = f"./docs/scrolls/{scroll['name']}"
            lines.append(f"- **{icon} [{scroll['name']}]({link})** — {scroll['description']}")
    
    return "\n".join(lines)


def find_scrolls_section(content: str) -> Tuple[Optional[int], Optional[int]]:
    """Find the begin and end positions of the scrolls section."""
    begin_match = content.find(BEGIN_MARKER)
    end_match = content.find(END_MARKER)
    
    if begin_match == -1 or end_match == -1:
        return None, None
    
    # Find the end of the begin marker line
    begin_pos = content.find('\n', begin_match) + 1
    # Find the start of the end marker line  
    end_pos = content.rfind('\n', 0, end_match)
    if end_pos == -1:
        end_pos = end_match
    
    return begin_pos, end_pos


def update_readme(scrolls: List[Dict], dry_run: bool = False, verbose: bool = False) -> bool:
    """Update the README.md file with the scrolls section."""
    if not README_PATH.exists():
        print(f"❌ README.md not found at {README_PATH}")
        return False
    
    # Read current README content
    with open(README_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if markers exist
    begin_pos, end_pos = find_scrolls_section(content)
    if begin_pos is None or end_pos is None:
        print(f"⚠️  Scroll markers not found in README.md")
        print(f"    Add these markers where you want the scrolls list:")
        print(f"    {BEGIN_MARKER}")
        print(f"    {END_MARKER}")
        return False
    
    # Generate new scrolls section
    new_scrolls_section = generate_scrolls_section(scrolls)
    
    # Create updated content
    new_content = (
        content[:begin_pos] + 
        new_scrolls_section + 
        "\n" +
        content[end_pos:]
    )
    
    # Check if content actually changed
    if content == new_content:
        if verbose:
            print("✅ README.md scrolls section is already up to date")
        return False
    
    if dry_run:
        print("🔮 DRY RUN - Would update README.md with:")
        print("=" * 50)
        print(new_scrolls_section)
        print("=" * 50)
        return True
    
    # Write updated content
    with open(README_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    if verbose:
        print("✅ README.md updated successfully")
    
    return True


def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(
        description="🔮 ChaosKey333 README Scrolls Auto-Sync Script",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python scripts/update_readme_scrolls.py
    python scripts/update_readme_scrolls.py --dry-run --verbose
    python scripts/update_readme_scrolls.py -v

The script will:
1. Scan docs/scrolls/ for PDF and Markdown files
2. Generate cosmic descriptions for each scroll
3. Update README.md between scroll markers
4. Preserve the ChaosKey333 aesthetic

⚡ Render the Prophecy. Seal the Vault. ⚡
🐦‍⬛ ChaosKey333 🐦‍⬛
        """
    )
    
    parser.add_argument(
        '--dry-run', '-d', 
        action='store_true',
        help='Show what would be updated without making changes'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true', 
        help='Enable verbose output'
    )
    
    args = parser.parse_args()
    
    if args.verbose:
        print("⛧⚡👑 ChaosKey333 Scrolls Auto-Sync Ritual 👑⚡⛧")
        print("🔑 Scanning cosmic scrolls for README synchronization 🔑")
        print("")
    
    # Scan for scrolls
    scrolls = scan_scrolls_directory()
    
    if args.verbose:
        print(f"📊 Found {len(scrolls)} cosmic scrolls:")
        for scroll in scrolls:
            print(f"   📜 {scroll['name']} ({scroll['size']}) - {scroll['description']}")
        print("")
    
    # Update README
    try:
        updated = update_readme(scrolls, dry_run=args.dry_run, verbose=args.verbose)
        
        if updated:
            if not args.dry_run:
                print("🎉 Scroll synchronization complete!")
                print("📜 README.md has been blessed with updated scroll wisdom")
            else:
                print("🔮 Dry run complete - no files were modified")
        else:
            if args.verbose:
                print("ℹ️  No updates needed")
        
        if args.verbose:
            print("")
            print("⚡ Render the Prophecy. Seal the Vault. ⚡")
            print("🐦‍⬛ ChaosKey333 🐦‍⬛")
        
        return 0
        
    except Exception as e:
        print(f"❌ Error during scroll synchronization: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())