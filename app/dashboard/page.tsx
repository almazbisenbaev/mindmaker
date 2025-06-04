"use client";

import { useState, useEffect, useRef } from "react"
import { useRouter, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

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

      console.log('Fetched documents:', data); // Add this debug line
      setDocuments(data || []);
    };

    checkUserAndFetchDocs();
  }, [router]);


  return (
    <>
      <div className="container mx-auto py-12">
        <h2 className="text-2xl">My documents</h2>
      </div>

      <div className="container mx-auto pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="bg-white p-10 rounded-3xl border border-gray-200"
            >

              <div className="min-h-[100px]">
                <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
                {doc.description && (
                  <p className="mt-2 text-sm text-gray-600">{doc.description}</p>
                )}
              </div>

                <div className="flex gap-2 text-sm text-gray-500 mb-2">
                  {doc.template}
                  <span>•</span>
                  {doc.status}
                  <span>•</span>
                  {new Date(doc.created_at).toLocaleDateString()}
                </div>

                <Button
                  onClick={() => router.push(`/doc/${doc.id}`)}
                  className="mt-4 w-full bg-gray-100 hover:bg-neutral-200"
                  variant="ghost"
                >
                  View document
                </Button>

            </div>
          ))}
        </div>
      </div>

      {/* <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify(documents, null, 2)}
      </pre> */}

    </>
  );
}
