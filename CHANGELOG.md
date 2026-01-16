# In your public gatekeeper repo
cd /path/to/gatekeeper

# Update the CHANGELOG
cat > CHANGELOG.md << 'EOF'
# Changelog

All notable changes to xerweon™ GATEKEEPER will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Additional features and improvements

## [0.1.9] - 2026-01-14

### Added
- **Auto-updater fully enabled and configured**
- Automatic update checking on app launch
- Seamless update installation process

### Changed
- Migrated release infrastructure to dedicated public repository
- Improved release workflow automation

### Technical
- Platform: Tauri v2 + React + Rust
- Build: Stable with signed binaries
- Auto-update: Enabled via GitHub releases
- Tested on: Windows, Linux, macOS

## [0.1.8] - 2026-01-12

### Added
- Toast notifications for successful check-ins and check-outs
- Enhanced device information display in the kiosk header
- Loading states to prevent duplicate actions and UI glitches

### Changed
- Improved workstation-specific check-in tracking to prevent conflicts
- Refactored staff fetching into reusable `fetchStaffsData()` function
- Simplified and tightened `isCheckedIn()` logic
- Better state handling around check-in/check-out actions

### Fixed
- **Critical:** Fixed check-in state persistence after checkout
- Check-ins with `checkoutTime` now properly excluded from active state
- Resolved issue where checked-out staff remained visible as checked-in
- Fixed staff data synchronization after check-in/check-out operations
- Improved error handling for missing authentication tokens

### Technical
- Platform: Tauri v2 + React + Rust
- Build: Stable
- Tested on: Windows, Linux, macOS

## [0.1.7] - 2026-01-10

### Added
- Initial kiosk mode implementation

### Fixed
- Authentication flow improvements

## [0.1.6] - 2026-01-08

### Added
- Basic check-in/check-out functionality

---

**Note:** For a full comparison between versions, visit the [GitHub Releases](https://github.com/Xerweon/gatekeeper/releases) page.
