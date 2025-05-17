import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const withEmail = searchParams.get("withEmail");
  const currentEmail = searchParams.get("currentEmail");

  if (!withEmail || !currentEmail) {
    return Response.json(
      { error: "Missing email parameters" },
      { status: 400 },
    );
  }

  try {
    const messages = await sql`
      SELECT * FROM messages
      WHERE 
        (sender_email = ${currentEmail} AND receiver_email = ${withEmail})
        OR 
        (sender_email = ${withEmail} AND receiver_email = ${currentEmail})
      ORDER BY created_at ASC
    `;
    return Response.json({ data: messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/chat/chat  — Search user by email
export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const users = await sql`
      SELECT clerk_id, name, email FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    return Response.json({
      data: {
        clerkId: user.clerk_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error searching user by email:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
