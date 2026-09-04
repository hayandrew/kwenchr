import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Events from '@/models/Event'
import staticEvents from '@/data/events'

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const { id } = await params

    let event = null
    try {
      event = await Events.findById(id)
    } catch (err) {
      if (err.name !== 'CastError') {
        throw err
      }
    }

    if (!event) {
      // Check static fallback events
      const staticEvent = staticEvents.find(
        (e) => e.mgid === id || e.id?.toString() === id?.toString()
      )
      if (staticEvent) {
        return NextResponse.json(staticEvent)
      }
    }

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const { id } = await params
    const body = await request.json()
    let updatedEvent = null
    try {
      updatedEvent = await Events.findOneAndUpdate({ _id: id }, body, { new: true })
    } catch (err) {
      if (err.name !== 'CastError') throw err
    }
    if (!updatedEvent) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json(updatedEvent)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const { id } = await params
    let result = null
    try {
      result = await Events.deleteOne({ _id: id })
    } catch (err) {
      if (err.name !== 'CastError') throw err
    }
    if (!result || result.deletedCount === 0) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'event successfully deleted' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

