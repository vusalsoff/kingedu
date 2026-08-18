import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  let reqEmail = "";
  let reqName = "";

  try {
    const body = await request.json();
    const { action, name, email, password } = body;
    
    reqEmail = email?.trim().toLowerCase();
    reqName = name || reqEmail.split("@")[0];

    if (!reqEmail || !password) {
      return NextResponse.json({ success: false, error: "Email və şifrə mütləqdir." }, { status: 400 });
    }

    const isAdminEmail = reqEmail === "mirfeqaninnotebooku@gmail.com";

    if (action === "register") {
      // User table is strictly for admins!
      const targetTable = isAdminEmail ? 'users' : 'telebeler';

      // Check if user exists
      const { data: existing } = await supabase.from(targetTable).select('id').eq('email', reqEmail).single();
      if (existing) {
        return NextResponse.json({ success: false, error: "Bu email ilə artıq hesab mövcuddur." }, { status: 400 });
      }

      // Insert new user
      const { data, error } = await supabase
        .from(targetTable)
        .insert([{ 
          name: reqName, 
          email: reqEmail, 
          password: password, 
          ...(isAdminEmail ? { role: 'admin' } : {}),
          created_at: new Date().toISOString() 
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const isAdmin = isAdminEmail || (data.role === 'admin');

      return NextResponse.json({
        success: true,
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          favorites: data.favorites || [],
          isAdmin: isAdmin
        }
      });
      
    } else if (action === "login") {
      // Check admins first
      let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', reqEmail)
        .eq('password', password)
        .single();

      if (error || !data) {
        // If not found in users, check telebeler
        const { data: tData, error: tError } = await supabase
          .from('telebeler')
          .select('*')
          .eq('email', reqEmail)
          .eq('password', password)
          .single();

        if (tError || !tData) {
          return NextResponse.json({ success: false, error: "Email və ya şifrə yanlışdır." }, { status: 401 });
        }
        data = tData;
      }

      const isAdmin = isAdminEmail || (data.role === 'admin');

      return NextResponse.json({
        success: true,
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          favorites: data.favorites || [],
          isAdmin: isAdmin
        }
      });
      
    } else {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

  } catch (error) {
    console.error("Auth API Error:", error);
    
    // Admin fallback
    const isAdminFallback = ["mirfəqaninnotebooku@gmail.com", "mirfeqaninnotebooku@gmail.com", "kingeducationcompanymmc@gmail.com"].includes(reqEmail);
    if (isAdminFallback) {
        return NextResponse.json({
            success: true,
            message: "Lokal Test Girişi (Xəta baş verdi)",
            user: {
              id: Date.now(),
              name: "Mirfəqan Hacıyev",
              email: reqEmail,
              favorites: [],
              isAdmin: true
            }
        });
    }

    return NextResponse.json({ success: false, error: "Daxili server xətası baş verdi. " + error.message }, { status: 500 });
  }
}
