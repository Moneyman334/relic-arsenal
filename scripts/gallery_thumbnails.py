#!/usr/bin/env python3
"""
Gallery Thumbnails Generator for ChaosKey333 Relic Arsenal

This script auto-generates lightweight previews in assets/gallery/thumbs/
from images in assets/gallery/ and docs/scrolls/, powered by Pillow.
Resizes images to ~400px width and compresses them for fast-loading docs,
while preserving full-resolution relics.

Usage:
    python scripts/gallery_thumbnails.py
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageOps
import argparse


def setup_directories():
    """Create necessary directories for thumbnails."""
    base_dir = Path(__file__).parent.parent
    gallery_dir = base_dir / "assets" / "gallery"
    thumbs_dir = gallery_dir / "thumbs"
    
    # Create directories if they don't exist
    gallery_dir.mkdir(parents=True, exist_ok=True)
    thumbs_dir.mkdir(parents=True, exist_ok=True)
    
    return base_dir, gallery_dir, thumbs_dir


def find_images(search_dirs):
    """Find all image files in the specified directories."""
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'}
    images = []
    
    for search_dir in search_dirs:
        if search_dir.exists():
            for file_path in search_dir.rglob('*'):
                if file_path.is_file() and file_path.suffix.lower() in image_extensions:
                    images.append(file_path)
    
    return images


def generate_thumbnail(source_path, output_path, max_width=400, quality=85):
    """Generate a thumbnail for the given image."""
    try:
        with Image.open(source_path) as img:
            # Convert to RGB if necessary (for transparency handling)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create a white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Calculate new dimensions maintaining aspect ratio
            width, height = img.size
            if width > max_width:
                ratio = max_width / width
                new_width = max_width
                new_height = int(height * ratio)
            else:
                new_width, new_height = width, height
            
            # Resize with high-quality resampling
            img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Save with compression
            img_resized.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            return True, f"Generated: {output_path.name} ({new_width}x{new_height})"
    
    except Exception as e:
        return False, f"Error processing {source_path.name}: {str(e)}"


def main():
    parser = argparse.ArgumentParser(description='Generate thumbnails for the Gallery of Relics')
    parser.add_argument('--max-width', type=int, default=400, 
                       help='Maximum width for thumbnails (default: 400px)')
    parser.add_argument('--quality', type=int, default=85,
                       help='JPEG quality for thumbnails (default: 85)')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Enable verbose output')
    
    args = parser.parse_args()
    
    print("🖼️ Gallery Thumbnails Generator - ChaosKey333 Relic Arsenal")
    print("=" * 60)
    
    # Setup directories
    base_dir, gallery_dir, thumbs_dir = setup_directories()
    
    # Define search directories for images
    search_dirs = [
        base_dir / "assets" / "gallery",
        base_dir / "assets" / "banners", 
        base_dir / "docs" / "scrolls"
    ]
    
    print(f"🔍 Searching for images in:")
    for search_dir in search_dirs:
        print(f"   - {search_dir}")
    
    # Find all images
    images = find_images(search_dirs)
    
    if not images:
        print("\n⚠️  No images found in search directories.")
        print("   Consider adding some relics to the gallery!")
        return 0
    
    print(f"\n📸 Found {len(images)} images to process")
    
    # Generate thumbnails
    success_count = 0
    total_size_saved = 0
    
    for image_path in images:
        # Create relative path for thumbnail
        rel_path = image_path.relative_to(base_dir)
        
        # Generate thumbnail filename
        thumb_name = f"{image_path.stem}_thumb.jpg"
        thumb_path = thumbs_dir / thumb_name
        
        # Generate thumbnail
        success, message = generate_thumbnail(
            image_path, thumb_path, 
            max_width=args.max_width, 
            quality=args.quality
        )
        
        if success:
            success_count += 1
            if args.verbose:
                print(f"✅ {message}")
            
            # Calculate size savings
            if image_path.exists() and thumb_path.exists():
                original_size = image_path.stat().st_size
                thumb_size = thumb_path.stat().st_size
                total_size_saved += original_size - thumb_size
        else:
            print(f"❌ {message}")
    
    print(f"\n🎯 Results:")
    print(f"   ✅ Successfully generated: {success_count}/{len(images)} thumbnails")
    print(f"   📂 Thumbnails location: {thumbs_dir}")
    print(f"   💾 Estimated size reduction: {total_size_saved / 1024:.1f} KB")
    
    if success_count > 0:
        print(f"\n🌟 Thumbnail generation complete!")
        print(f"   Cosmic relics compressed with {args.quality}% quality at {args.max_width}px width")
        print(f"   \"Through quantum compression, we preserve eternity in lightweight form.\"")
    
    return success_count


if __name__ == "__main__":
    try:
        result = main()
        sys.exit(0 if result > 0 else 1)
    except KeyboardInterrupt:
        print("\n🔮 Thumbnail generation interrupted by cosmic forces...")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1)