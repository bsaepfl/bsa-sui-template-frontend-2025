# Night Shift Spec — 2026-03-24

## Objective

Fix and improve the Walrus storage integration in the BSA Sui frontend template. Make it production-ready for the hackathon.

## Context

- Project: `bsa-sui-template-frontend-2025` (Next.js + Sui dApp Kit + Walrus + Seal)
- Branch: `feat/night-shift-2026-03-24` from `main`
- Stack: Next.js 16, React 19, TypeScript, @mysten/sui v2.9.1, @mysten/dapp-kit v1.0.4, @mysten/walrus v1.1.0, @mysten/seal v1.1.1
- The Seal implementation and basic Walrus upload already exist and compile

## Tasks

### 1. Walrus SDK Direct Mode (not REST API)

Currently `walrusServiceSDK.ts` uses the `walrus()` extension on `SuiJsonRpcClient` which goes through the JSON-RPC + WASM approach. We want to also support **direct Walrus SDK mode** using `WalrusClient` directly (the class exported from `@mysten/walrus`).

Requirements:
- Create a new service `walrusServiceDirect.ts` that uses `WalrusClient` from `@mysten/walrus` directly
- The direct client handles blob encoding, sliver distribution, and storage node communication natively
- Keep the existing `walrusServiceSDK.ts` (WASM/extension approach) as an alternative
- In the UI (`WalrusUpload.tsx`), allow users to **choose between the two modes** (toggle or dropdown)
- Both modes should support: upload file, upload text, upload JSON
- Both modes should return the same result format (blobId, metadataId, URL)

### 2. Fix Binary File Upload

**Bug**: When uploading non-text files (images, PDFs, binaries), the data is misinterpreted as text. The browser cannot recognize/display the downloaded file correctly.

Root cause analysis needed:
- Check if the content-type is properly preserved during upload
- Check if the file is being incorrectly converted (e.g., TextEncoder on binary data)
- Ensure binary data is uploaded as raw `Uint8Array` without text encoding
- On download/display, ensure the correct MIME type is set

Requirements:
- Fix file upload to properly handle binary data (images, PDFs, etc.)
- Preserve original MIME type metadata
- Verify uploaded files can be retrieved and opened correctly
- Test with at least: image (PNG/JPG), PDF, and text file scenarios

### 3. WAL Payment Preparation

Walrus storage requires WAL tokens to pay for storage. Currently we don't have WAL tokens but we need to prepare the code.

Requirements:
- The code should be ready to pay WAL for storage (the actual WAL will be provided tomorrow)
- Ensure the upload flow handles the WAL payment transaction correctly
- Add clear error messages if WAL balance is insufficient
- Add a "WAL Balance" display somewhere in the Walrus upload section
- Mock/stub the payment flow so the code compiles and is testable once WAL is available

### 4. Code Quality

- Remove any `console.log` debug statements from services
- Ensure all TypeScript types are strict (no `any` unless justified)
- Files must stay under 400 lines ideally
- Follow existing patterns and conventions from the codebase

## Constraints

- Do NOT modify the Seal implementation (it works)
- Do NOT modify the Counter feature
- Keep the existing service layer architecture (services/ directory)
- All new code must compile (`pnpm build` must pass)
- Visual verification with puppeteer after UI changes
