# Design Document: New Activities and Adaptive Difficulty

## Overview
This document outlines the implementation of four new educational mini-games for the KinderTrace Playroom, along with a centralized "Activity Wrapper" that provides an adaptive difficulty system and consistent visual progression.

## Architecture: The Activity Wrapper
The `ActivityWrapper` is a higher-order component (HOC) or a container component that manages:
- **State:** Current difficulty level (1-5), success streaks, and mistake counts.
- **Adaptive Logic:** 
    - Level Up: After 3 consecutive correct answers.
    - Level Down: After 2 mistakes.
- **UI:** A "Visible Progression" bar at the top showing levels and "mini-stars" for current streak progress.
- **Audio:** Success/Failure sounds and voice-overs for level transitions.

### Component Interface
The child game components will receive:
- `level: number`: Current difficulty (1-5).
- `onAnswer: (isCorrect: boolean) => void`: Callback to report result.

## New Mini-Games

### 1. Color & Shape Sorter
- **Goal:** Drag items into matching buckets.
- **Scaling:**
    - L1: 2 buckets (Colors).
    - L3: 2 buckets (Shapes).
    - L5: Multiple buckets with mixed attributes.

### 2. Animal Kingdom Discovery
- **Goal:** Identify animals by sound or name.
- **Scaling:**
    - L1: 2 choices, voice + sound.
    - L3: 3 choices, sound only.
    - L5: Animals peeking out/hiding.

### 3. Ordering & Comparison
- **Goal:** Order items by size, height, or weight.
- **Scaling:**
    - L1: Compare 2 items (Big/Small).
    - L2: Order 3 items.
    - L5: Order by abstract weight logic.

### 4. Logic Sequences
- **Goal:** Complete visual patterns.
- **Scaling:**
    - L1: AB patterns.
    - L3: ABC patterns.
    - L5: Patterns with multiple or middle missing items.

## Success Criteria
- [ ] Centralized difficulty logic works across all games.
- [ ] Progression bar accurately reflects state.
- [ ] All 4 new games are playable from the Lobby.
- [ ] App remains performant and maintains its kid-friendly aesthetic.
