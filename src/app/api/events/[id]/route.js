import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Events from '@/models/Event'

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const { id } = await params
    const event = await Events.findById(id)
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
    const updatedEvent = await Events.findOneAndUpdate({ _id: id }, body, { new: true })
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
    const result = await Events.deleteOne({ _id: id })
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'event successfully deleted' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
