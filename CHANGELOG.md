# Release v0.1.5 - Fixing Check-in Persistence Issues

Minor release focusing on check-in/check-out stability and UI state management improvements.

## What's New
**Better User Feedback**
- Added toast notifications for successful check-ins and check-outs
- You'll now see clear success and error messages for every action
- Enhanced device information display in the kiosk header for better transparency

**Smarter Check-in Tracking**
- Improved workstation-specific check-in tracking to prevent conflicts
- Each workstation now properly tracks its own staff independently

## Bug Fixes
- **Critical:** Fixed check-in state persistence after checkout
  - Check-ins with `checkoutTime` are now properly excluded from active state
  - Resolved issue where checked-out staff remained visible as checked-in
- Fixed staff data synchronization after check-in/check-out operations
- Improved error handling for missing authentication tokens

## Improvements
- Refactored staff fetching into a reusable fetchStaffsData() function
- Simplified and tightened the isCheckedIn() logic
- Better state handling around check-in/check-out actions
- Added loading states to avoid duplicate actions and UI glitches
- Improved workstation ID validation and fallback behavior

## Technical 
- **Platform:** Tauri v2 + React + Rust
- **Build:** Stable
- **Tested on:** Windows, Linux, macOS

## Upgrade Notes
This is a non-breaking release. Simply update and rebuild; no configuration changes needed.

---
**Full Changelog:** https://github.com/your-org/xerweon-gatekeeper/compare/v0.1.4...v0.1.5