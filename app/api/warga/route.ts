import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getSessionFromCookies } from '@/lib/auth';

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
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id, nama, kelompok, gelombang, alamat } = await request.json();

  if (!id || !nama || !kelompok || !gelombang || !alamat) {
    return NextResponse.json({ message: 'Data peserta belum lengkap' }, { status: 400 });
  }

  try {
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Master_Warga!B2:B',
    });

    const ids = existing.data.values?.map((row) => row[0]) ?? [];
    if (ids.includes(id)) {
      return NextResponse.json({ message: 'ID peserta sudah terdaftar' }, { status: 409 });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Master_Warga!A2:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['', id, nama, kelompok, gelombang, alamat]],
      },
    });

    return NextResponse.json({ no: '', id, nama, kelompok, gelombang, alamat });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error adding warga' }, { status: 500 });
  }
}
