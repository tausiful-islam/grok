import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const divisionId = searchParams.get('division_id')

    if (!divisionId) {
      return NextResponse.json({ error: 'Division ID is required' }, { status: 400 })
    }

    const { data: districts, error } = await supabase
      .from('districts')
      .select('*')
      .eq('division_id', divisionId)
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Error fetching districts:', error)
      return NextResponse.json({ error: 'Failed to fetch districts' }, { status: 500 })
    }

    return NextResponse.json({ districts })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
