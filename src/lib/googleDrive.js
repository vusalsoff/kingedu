import { google } from 'googleapis';
import stream from 'stream';

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID?.replace(/^"|"$/g, '');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID?.replace(/^"|"$/g, '');
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET?.replace(/^"|"$/g, '');
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN?.replace(/^"|"$/g, '');

const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
auth.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth });

export async function uploadToGoogleDrive(base64String, filename = 'upload.png') {
  try {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    const fileMetadata = {
      name: filename,
      parents: [FOLDER_ID]
    };

    const media = {
      mimeType: mimeType,
      body: bufferStream
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink'
    });

    // Make it public
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    return {
      success: true,
      id: file.data.id,
      url: 'https://drive.google.com/thumbnail?id=' + file.data.id + '&sz=w1000',
      legacyUrl: file.data.webContentLink
    };
  } catch (error) {
    console.error("Google Drive Upload Error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteFromGoogleDrive(fileId) {
  try {
    if (!fileId) return { success: true };
    await drive.files.delete({ fileId });
    return { success: true };
  } catch (error) {
    console.error("Google Drive Delete Error:", error);
    return { success: false, error: error.message };
  }
}
