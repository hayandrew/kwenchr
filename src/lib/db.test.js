import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockCountDocuments, mockInsertManyEvents, mockInsertManyUsers } = vi.hoisted(() => ({
  mockCountDocuments: vi.fn(),
  mockInsertManyEvents: vi.fn(),
  mockInsertManyUsers: vi.fn()
}))

vi.mock('../models/Event', () => ({
  __esModule: true,
  default: {
    countDocuments: mockCountDocuments,
    insertMany: mockInsertManyEvents
  }
}))

vi.mock('../models/User', () => ({
  __esModule: true,
  default: {
    insertMany: mockInsertManyUsers
  }
}))

const mockConnect = vi.hoisted(() => vi.fn())
vi.mock('mongoose', () => ({
  __esModule: true,
  default: {
    connect: mockConnect,
    models: {}
  }
}))

describe('dbConnect Connector', () => {
  beforeEach(async () => {
    vi.resetModules()
    global.mongoose = null
    vi.clearAllMocks()

    // Default mock implementation returning a dummy connection
    mockConnect.mockResolvedValue({
      models: {}
    })
  })

  it('connects to mongoose and sets cached connection', async () => {
    // Dynamic import to allow fresh module state after vi.resetModules
    const { default: dbConnect } = await import('./db')

    mockCountDocuments.mockResolvedValueOnce(5) // non-empty db

    const conn = await dbConnect()
    expect(mockConnect).toHaveBeenCalledTimes(1)
    expect(conn).toBeDefined()
    expect(global.mongoose.conn).toBe(conn)
  })

  it('uses cached connection on subsequent calls', async () => {
    const { default: dbConnect } = await import('./db')
    mockCountDocuments.mockResolvedValue(5)

    const conn1 = await dbConnect()
    const conn2 = await dbConnect()

    expect(mockConnect).toHaveBeenCalledTimes(1) // only connected once
    expect(conn1).toBe(conn2)
  })

  it('performs auto-seeding if the database contains 0 events', async () => {
    const { default: dbConnect } = await import('./db')
    
    mockCountDocuments.mockResolvedValueOnce(0) // empty db
    mockInsertManyUsers.mockResolvedValueOnce([
      { _id: 'user-1' },
      { _id: 'user-2' }
    ])

    await dbConnect()

    expect(mockInsertManyUsers).toHaveBeenCalled()
    expect(mockInsertManyEvents).toHaveBeenCalled()
  })

  it('resets cached promise and throws on connection error', async () => {
    const { default: dbConnect } = await import('./db')
    mockConnect.mockRejectedValueOnce(new Error('Connection timed out'))

    await expect(dbConnect()).rejects.toThrow('Connection timed out')
    expect(global.mongoose.promise).toBeNull()
  })
})
