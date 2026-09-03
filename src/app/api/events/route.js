import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Events from '@/models/Event'

export async function GET(request) {
  try {
    await dbConnect()

    let page, limit
    if (request && request.url) {
      try {
        const { searchParams } = new URL(request.url)
        const p = parseInt(searchParams.get('page'), 10)
        const l = parseInt(searchParams.get('limit'), 10)
        if (!isNaN(p) && p > 0) page = p
        if (!isNaN(l) && l > 0) limit = l
      } catch {
        // ignore invalid URL
      }
    }

    if (page && limit) {
      const skip = (page - 1) * limit
      const events = await Events.find({}).skip(skip).limit(limit)
      return NextResponse.json(events)
    }

    if (limit) {
      const events = await Events.find({}).limit(limit)
      return NextResponse.json(events)
    }

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
