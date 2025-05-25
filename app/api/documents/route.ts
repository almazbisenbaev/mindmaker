import { createClient } from '@/utils/supabase/server'
// import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { title, description, template } = body;

    // Insert new document
    const { data: document, error } = await supabase
      .from('documents')
      .insert({
        title,
        description,
        template,
        status: 'public', // default to public
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating document:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error in POST /api/documents:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}