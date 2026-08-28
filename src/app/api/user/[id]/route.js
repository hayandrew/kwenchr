import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const { id } = await params
    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const { id } = await params
    const body = await request.json()
    const updatedUser = await User.findOneAndUpdate({ _id: id }, body, { new: true })
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return NextResponse.json(updatedUser)
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

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const { id } = await params
    const result = await User.deleteOne({ _id: id })
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'user successfully deleted' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
