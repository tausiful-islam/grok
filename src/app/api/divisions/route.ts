import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data: divisions, error } = await supabase
      .from('divisions')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Error fetching divisions:', error)
      return NextResponse.json({ error: 'Failed to fetch divisions' }, { status: 500 })
    }

    return NextResponse.json({ divisions })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
