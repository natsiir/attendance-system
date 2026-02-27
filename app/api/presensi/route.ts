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

const normalizeTanggal = (raw: string) => {
  if (!raw) return raw;

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash) {
    const day = slash[1].padStart(2, '0');
    const month = slash[2].padStart(2, '0');
    const year = slash[3];
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return raw;
};

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Log_Presensi!A2:F",
    });

    const rows = response.data.values;
    if (!rows) return NextResponse.json([]);

    const logs = rows.map((row) => ({
      id: (row[0] ?? '').toString().trim(),
      nama: (row[1] ?? '').toString().trim(),
      tanggal: normalizeTanggal((row[2] ?? '').toString().trim()),
      status: row[3],
      keterangan: row[4],
      timestamp: row[5],
    }));

    return NextResponse.json(logs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching logs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { id, nama, tanggal, status, keterangan } = await request.json();
  const timestamp = new Date().toISOString();

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Log_Presensi!A2:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[id, nama, tanggal, status, keterangan, timestamp]],
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error saving attendance" }, { status: 500 });
  }
}
