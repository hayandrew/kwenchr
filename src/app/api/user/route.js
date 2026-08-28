import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function GET() {
  try {
    await dbConnect()
    const users = await User.find({})
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const body = await request.json()
    const newUser = new User(body)
    const savedUser = await newUser.save()
    return NextResponse.json(savedUser, { status: 201 })
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || ''
      if (field === 'email' || error.message.includes('email')) {
        return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 400 })
      }
      if (field === 'username' || error.message.includes('username')) {
        return NextResponse.json({ error: 'An account with that username already exists.' }, { status: 400 })
      }
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
