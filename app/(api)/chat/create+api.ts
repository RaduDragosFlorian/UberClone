import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  const { senderEmail, receiverEmail, content } = await request.json();

  if (!senderEmail || !receiverEmail || !content) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await sql`
      INSERT INTO messages (sender_email, receiver_email, content)
      VALUES (${senderEmail}, ${receiverEmail}, ${content})
    `;
    return Response.json({ success: true });
  } catch (err) {
    console.error("Error saving message:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
