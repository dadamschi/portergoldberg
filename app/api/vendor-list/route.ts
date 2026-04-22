import { NextResponse } from 'next/server'

type VendorBody = {
  name?: string
  email?: string
  phone?: string
}

export async function POST(request: Request) {
  const body: VendorBody = await request.json()
  const { name, email, phone } = body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }

  // TODO: Connect to CRM or vendor management system
  // Examples:
  // - Add to CRM as vendor contact
  // - Add to separate vendor email list
  // - Create record in database

  console.log(`[VendorList] New vendor: ${name ?? 'Unknown'} (${email})${phone ? `, ${phone}` : ''}`)

  return NextResponse.json(
    { message: 'Added to vendor list.' },
    { status: 200 },
  )
}
