import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function POST(request) {
  try {
    await dbConnect()
    const { usernameOrEmail, password } = await request.json()

    if (!usernameOrEmail || !password) {
      return NextResponse.json({ error: 'Username/Email and password are required' }, { status: 400 })
    }

    // Locate user record by username or email
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail.trim() },
        { email: usernameOrEmail.trim().toLowerCase() }
      ]
    })

    if (!user) {
      return NextResponse.json({ error: 'Incorrect username/email or password' }, { status: 401 })
    }

    // Validate plain text passwords matching the database configuration
    if (user.password !== password) {
      return NextResponse.json({ error: 'Incorrect username/email or password' }, { status: 401 })
    }

    // Return sanitized authenticated profile
    return NextResponse.json({
      _id: user._id,
      username: user.username,
      email: user.email
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
