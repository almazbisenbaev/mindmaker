"use client";

import { useState, useEffect, useRef } from "react"
import { useRouter, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

// Define the Document interface based on your Supabase table structure
interface Document {
  id: string;
  user_id: string;
  template: string;
  title: string;
  status: 'public' | 'private';  // Using union type for status
  created_at: string;
  updated_at: string;
  description: string;
}

export default function DashboardPage() {
  const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>([]); 
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const supabase = createClient();
    
    const checkUserAndFetchDocs = async () => {
      // Check auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }
      setUser(user);

      // Fetch documents
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      setDocuments(data || []);
    };

    checkUserAndFetchDocs();
  }, [router]);


  return (
    <>
      <h2 className="text-2xl text-center flex items-center justify-center">Dashboard page</h2>
      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify(documents, null, 2)}
      </pre>
    </>
  );
}
