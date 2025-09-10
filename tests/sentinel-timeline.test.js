// Tests for Sentinel Timeline cosmic data structures
import { describe, it, expect } from 'vitest';

// Mock DOM environment for timeline tests
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><div id="test-container"></div>');
global.document = dom.window.document;
global.window = dom.window;

import { 
  getUnifiedTimeline, 
  filterByType, 
  simulateRealtimeUpdate,
  collectorArchive,
  broadcastLayer,
  loreOverlay 
} from '../docs/data/cosmic-archives.js';

describe('Cosmic Archives Data Layer', () => {
  it('should provide unified timeline data', () => {
    const timeline = getUnifiedTimeline();
    
    expect(Array.isArray(timeline)).toBe(true);
    expect(timeline.length).toBeGreaterThan(0);
    
    // Verify each event has required properties
    timeline.forEach(event => {
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('type');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('description');
      expect(event).toHaveProperty('timestamp');
    });
  });

  it('should contain all three types of events', () => {
    const timeline = getUnifiedTimeline();
    
    const collectorMarks = timeline.filter(e => e.type === 'collector-mark');
    const broadcasts = timeline.filter(e => e.type === 'broadcast');
    const loreWhispers = timeline.filter(e => e.type === 'lore-whisper');
    
    expect(collectorMarks.length).toBeGreaterThan(0);
    expect(broadcasts.length).toBeGreaterThan(0);
    expect(loreWhispers.length).toBeGreaterThan(0);
  });

  it('should sort events by timestamp (newest first)', () => {
    const timeline = getUnifiedTimeline();
    
    for (let i = 0; i < timeline.length - 1; i++) {
      const currentTime = new Date(timeline[i].timestamp);
      const nextTime = new Date(timeline[i + 1].timestamp);
      
      expect(currentTime.getTime()).toBeGreaterThanOrEqual(nextTime.getTime());
    }
  });

  it('should filter events by type correctly', () => {
    const timeline = getUnifiedTimeline();
    
    const collectorMarks = filterByType(timeline, 'collector-mark');
    const broadcasts = filterByType(timeline, 'broadcast');
    const loreWhispers = filterByType(timeline, 'lore-whisper');
    
    // All collector marks should have correct type
    collectorMarks.forEach(event => {
      expect(event.type).toBe('collector-mark');
    });
    
    broadcasts.forEach(event => {
      expect(event.type).toBe('broadcast');
    });
    
    loreWhispers.forEach(event => {
      expect(event.type).toBe('lore-whisper');
    });
  });

  it('should simulate realtime updates with proper structure', () => {
    const simulatedEvent = simulateRealtimeUpdate();
    
    expect(simulatedEvent).toHaveProperty('id');
    expect(simulatedEvent).toHaveProperty('type');
    expect(simulatedEvent).toHaveProperty('title');
    expect(simulatedEvent).toHaveProperty('description');
    expect(simulatedEvent).toHaveProperty('timestamp');
    expect(simulatedEvent).toHaveProperty('metadata');
    
    // Verify type is one of the valid types
    expect(['collector-mark', 'broadcast', 'lore-whisper']).toContain(simulatedEvent.type);
    
    // Verify timestamp is recent (within last minute)
    const eventTime = new Date(simulatedEvent.timestamp);
    const now = new Date();
    const timeDiff = now - eventTime;
    expect(timeDiff).toBeLessThan(60000); // Less than 1 minute
  });

  it('should have cosmic-themed content in collector marks', () => {
    collectorArchive.forEach(mark => {
      expect(mark.type).toBe('collector-mark');
      expect(mark).toHaveProperty('sigil');
      expect(mark).toHaveProperty('power_level');
      expect(mark).toHaveProperty('rarity');
      expect(mark.metadata).toHaveProperty('claimant');
      expect(mark.metadata).toHaveProperty('vault_section');
      expect(mark.metadata).toHaveProperty('blessing');
    });
  });

  it('should have proper broadcast urgency levels', () => {
    broadcastLayer.forEach(broadcast => {
      expect(broadcast.type).toBe('broadcast');
      expect(broadcast).toHaveProperty('broadcast_type');
      expect(broadcast).toHaveProperty('urgency');
      expect(['low', 'medium', 'high', 'critical']).toContain(broadcast.urgency);
    });
  });

  it('should have mystical lore whisper properties', () => {
    loreOverlay.forEach(whisper => {
      expect(whisper.type).toBe('lore-whisper');
      expect(whisper).toHaveProperty('prophecy_type');
      expect(whisper).toHaveProperty('cryptic_level');
      expect(whisper.metadata).toHaveProperty('prophet');
      expect(whisper.metadata).toHaveProperty('cosmic_significance');
    });
  });
});

describe('Cosmic Timeline Integration', () => {
  it('should maintain ChaosKey333 thematic consistency', () => {
    const timeline = getUnifiedTimeline();
    
    // Check for cosmic terminology in descriptions
    const cosmicTerms = [
      'cosmic', 'quantum', 'vault', 'storm', 'chaos', 
      'guardian', 'prophecy', 'infinite', 'dawn', 'thunder'
    ];
    
    const hasCosmicThemes = timeline.some(event => 
      cosmicTerms.some(term => 
        event.title.toLowerCase().includes(term) || 
        event.description.toLowerCase().includes(term)
      )
    );
    
    expect(hasCosmicThemes).toBe(true);
  });

  it('should have timestamps in correct ISO format', () => {
    const timeline = getUnifiedTimeline();
    
    timeline.forEach(event => {
      const timestamp = new Date(event.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(isNaN(timestamp.getTime())).toBe(false);
      
      // Should be ISO format
      expect(event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/);
    });
  });
});