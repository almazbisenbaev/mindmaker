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
      <h2 className="text-2xl text-center flex items-center justify-center">Dashboard page</h2>
      
      {/* <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify(documents, null, 2)}
      </pre> */}

      <div className="flex">
        {documents.map((doc) => (
          <div 
            key={doc.id} 
            className="bg-white p-4 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
            <div className="text-sm text-gray-500 mb-2">
              Template: {doc.template}
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs px-2 py-1 rounded-full ${
                doc.status === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {doc.status}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(doc.created_at).toLocaleDateString()}
              </span>
            </div>
            {doc.description && (
              <p className="mt-2 text-sm text-gray-600">{doc.description}</p>
            )}
            <Button
              onClick={() => router.push(`/doc/${doc.id}`)}
              className="mt-4 w-full"
            >
              View document
            </Button>
          </div>
        ))}
      </div>

    </>
  );
}
