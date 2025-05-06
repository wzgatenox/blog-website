// scripts/upload-comments.mjs
import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

// This dynamically loads environment variables from .env.local
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });


// --- Configuration ---
// Adjust this path if your comments.json is located elsewhere relative to the project root.
const LOCAL_COMMENTS_FILE_PATH = path.resolve(process.cwd(), 'comments.json');
// This MUST match the path used in your /app/api/comments/route.ts
const COMMENTS_BLOB_PATH = 'comments.json';
// --- End Configuration ---

async function uploadCommentsToBlob() {
  console.log('Attempting to upload comments to Vercel Blob...');

  // Verify that the BLOB_READ_WRITE_TOKEN is available
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('🔴 Error: BLOB_READ_WRITE_TOKEN environment variable is not set.');
    console.error('   Please ensure it is defined in your .env.local file or your environment.');
    // Changed outer quotes to double quotes to allow inner backticks
    console.error("   If you haven\'t already, try running `vercel env pull .env.local` in your project root.");
    process.exit(1); // Exit script with an error code
  } else {
    console.log('✅ BLOB_READ_WRITE_TOKEN found.');
  }

  try {
    // 1. Read the local comments.json file
    console.log(`   Reading local comments file from: ${LOCAL_COMMENTS_FILE_PATH}`);
    let fileContent;
    try {
      fileContent = await fs.readFile(LOCAL_COMMENTS_FILE_PATH, 'utf-8');
    } catch (readError) {
      console.error(`🔴 Error reading local file ${LOCAL_COMMENTS_FILE_PATH}:`, readError);
      process.exit(1);
    }
    console.log('   Local comments file read successfully.');

    // Optional: Validate if the content is valid JSON
    try {
      JSON.parse(fileContent);
      console.log('   Local file content is valid JSON.');
    } catch (jsonError) {
      console.error('🔴 Error: Local file content is not valid JSON.', jsonError);
      process.exit(1);
    }

    // 2. Upload the content to Vercel Blob
    console.log(`   Uploading to Vercel Blob at path: "${COMMENTS_BLOB_PATH}"...`);
    const blobResult = await put(COMMENTS_BLOB_PATH, fileContent, {
      access: 'public', // Must match the access level your API expects/sets
      contentType: 'application/json',
      allowOverwrite: true,
      // `token` is automatically picked up from BLOB_READ_WRITE_TOKEN env var by @vercel/blob
    });

    console.log('✅ Successfully uploaded comments to Vercel Blob!');
    console.log('   Blob URL:', blobResult.url);
    console.log('   Blob Pathname:', blobResult.pathname);
    console.log('   Content Type:', blobResult.contentType);

  } catch (uploadError) {
    console.error('🔴 Error during the upload process:');
    if (uploadError instanceof Error) {
      console.error('   Message:', uploadError.message);

      // Pure JavaScript-friendly property checking using bracket notation
      if (typeof uploadError === 'object' && uploadError !== null) {
        const errorObject = uploadError;

        if ('status' in errorObject) {
            // Using bracket notation to avoid potential issues with reserved words or syntax errors
            console.error('   Status:', errorObject['status']);
        }

        if ('response' in errorObject) {
            const response = errorObject['response'];
            if (typeof response === 'object' && response !== null && typeof response['json'] === 'function') {
                try {
                    // Using bracket notation here too
                    const errorBody = await response['json']();
                    console.error('   Error Body:', JSON.stringify(errorBody, null, 2));
                } catch (e) {
                    console.error('   Could not parse error body as JSON or error during parsing:');
                    // Log the parsing error itself for more detail
                    console.error('   Parsing Error:', e instanceof Error ? e.message : e);
                }
            }
        }
      }
      console.error('   Stack:', uploadError.stack);
    } else {
      console.error('   Non-Error Exception:', uploadError);
    }
    process.exit(1); // Exit script with an error code
  }
}

uploadCommentsToBlob();
