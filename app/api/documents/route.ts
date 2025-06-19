import { createClient } from '@/utils/supabase/server'
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
    const { title, description, template, status } = body;

    // Insert new document
    const { data: document, error } = await supabase
      .from('documents')
      .insert({
        title,
        description,
        template,
        status,
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

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body and document ID
    const body = await request.json();
    const { id, status, title } = body;

    // Prepare update object with only provided fields
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (title !== undefined) updateData.title = title;

    // Update document
    const { data: document, error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns the document
      .select()
      .single()

    if (error) {
      console.error('Error updating document:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error in PATCH /api/documents:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}