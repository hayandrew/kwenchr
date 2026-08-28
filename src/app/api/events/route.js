import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Events from '@/models/Event'

export async function GET() {
  try {
    await dbConnect()
    const events = await Events.find({})
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const body = await request.json()
    const newEvent = new Events(body)
    const savedEvent = await newEvent.save()
    return NextResponse.json(savedEvent, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
