import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import bcrypt from 'bcrypt';
import { createSessionToken, setSessionCookie } from '@/lib/auth';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users_Operator!A2:C',
    });

    const rows = response.data.values;
    if (!rows) return NextResponse.json({ message: 'No users found' }, { status: 404 });

    const userRow = rows.find((row) => row[0] === username);

    if (userRow) {
      const hashedPassword = userRow[1];
      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (isMatch) {
        const user = { username: userRow[0], role: userRow[2] };
        const token = createSessionToken(user.username, user.role);
        await setSessionCookie(token);
        return NextResponse.json(user);
      }
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
