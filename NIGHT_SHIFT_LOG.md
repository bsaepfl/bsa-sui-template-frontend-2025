# Night Shift Log — 2026-03-24

## Night Shift Plan

### Objective
Fix and improve Walrus storage integration: add direct WalrusClient mode, fix binary file handling, prepare WAL payment, add download functionality.

### Architecture
- Service layer pattern maintained (app/services/)
- Two walrus services: existing SDK extension + new direct WalrusClient
- WalrusUpload.tsx refactored to support mode selection and download
- WAL balance display and payment handling

### Parallelizable workstreams

**Workstream A: Walrus Direct Service** (independent)
- Create walrusServiceDirect.ts using WalrusClient constructor directly
- Update services/index.ts exports

**Workstream B: Binary Fix + Download** (independent)
- Add download/read section to WalrusUpload.tsx
- Ensure proper MIME type handling on download
- Add content-type preservation in blob attributes

**Sequential: UI Integration** (depends on A + B)
- Add mode toggle (SDK extension vs Direct client) in WalrusUpload.tsx
- Add WAL balance display
- Add error handling for insufficient WAL
- Clean up console.logs

### Steps (ordered by dependency)
1. [service] Create walrusServiceDirect.ts — Workstream A
2. [service] Update services/index.ts — Workstream A
3. [component] Add download/read section to WalrusUpload — Workstream B
4. [component] Fix binary file MIME type handling — Workstream B
5. [component] Add mode toggle UI in WalrusUpload — Sequential
6. [component] Add WAL balance display — Sequential
7. [service] Remove console.logs from all services — Sequential
8. [build] Final build + visual verification — Sequential

### Pre-made decisions
- **Direct vs Extension**: Both use WalrusClient under the hood. Direct = `new WalrusClient({...})`, Extension = `SuiJsonRpcClient.$extend(walrus())`. We expose both for educational value in the hackathon template.
- **Upload Relay**: Not used initially. Direct node upload for both modes. Upload relay can be added later as a third option.
- **WAL Payment**: Code prepared but WAL tokens not available yet. Clear error messages when balance is 0.
- **Binary MIME handling**: Store content-type in Walrus blob attributes (`attributes` field) for proper download handling.

### Estimate
- Files to create: 1 (walrusServiceDirect.ts)
- Files to modify: 4 (WalrusUpload.tsx, services/index.ts, sealService.ts, walrusServiceSDK.ts)
- Approximate: ~500 new lines, ~200 modified lines
