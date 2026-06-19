export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ error: 'Email and password required' }, { status: 400 });
  }

  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

  return Response.json({
    token,
    email,
    message: 'Login successful',
  });
}
