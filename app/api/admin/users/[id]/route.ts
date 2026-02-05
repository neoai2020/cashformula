import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

// GET - Get user details by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceClient();
    
    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(id);
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    // Get pages count
    const { count: pagesCount } = await supabase
      .from('pages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        plan: profile?.plan || 'free',
        pages_count: pagesCount || 0
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update user
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { email, plan } = body;
    
    const supabase = await createServiceClient();

    // Update email in auth if changed
    if (email) {
      const { error: authError } = await supabase.auth.admin.updateUserById(id, {
        email: email
      });
      
      if (authError) {
        return NextResponse.json({ success: false, error: authError.message }, { status: 400 });
      }
    }

    // Update profile (plan and email)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        email: email,
        plan: plan 
      })
      .eq('id', id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      // Don't fail if profile update fails - user might not have a profile
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServiceClient();

    // Delete user from auth (this will cascade to profiles due to foreign key)
    const { error } = await supabase.auth.admin.deleteUser(id);
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
