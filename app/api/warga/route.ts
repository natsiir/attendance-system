import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Master_Warga!A2:F",
    });

    const rows = response.data.values;
    if (!rows) return NextResponse.json([]);

    const warga = rows.map((row) => ({
      no: row[0],
      id: row[1],
      nama: row[2],
      kelompok: row[3],
      gelombang: row[4],
      alamat: row[5],
    }));

    return NextResponse.json(warga);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching warga" }, { status: 500 });
  }
}
