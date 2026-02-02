import '@testing-library/jest-dom'

// Mock Prisma client for tests
vi.mock('@/lib/db/client', () => ({
  default: {
    pipeline: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    stage: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
  prisma: {
    pipeline: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    stage: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))
