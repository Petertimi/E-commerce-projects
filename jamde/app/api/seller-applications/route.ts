import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    let data
    try {
      data = await req.json()
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!data.businessName || !data.ownerName || !data.email || !data.phone || 
        !data.craftType || !data.businessDescription || !data.yearsExperience || !data.location) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    const application = await prisma.sellerApplication.create({
      data: {
        businessName: data.businessName.trim(),
        ownerName: data.ownerName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        craftType: data.craftType,
        businessDescription: data.businessDescription.trim(),
        yearsExperience: data.yearsExperience,
        location: data.location.trim(),
        website: data.website?.trim() || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, id: application.id })
  } catch (error: any) {
    console.error('Error creating seller application:', error)
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'An application with this email already exists' },
        { status: 400 }
      )
    }

    // Handle validation errors
    if (error.name === 'PrismaClientValidationError') {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided. Please check all fields.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit application. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = (session.user as any).role
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const applications = await prisma.sellerApplication.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, applications })
  } catch (error) {
    console.error('Error fetching seller applications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
