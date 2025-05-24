"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

import { templates, TemplateType } from "@/components/document-templates/index";

interface Document {
  id: string;
  user_id: string;
  template: TemplateType;  // Changed from 'string' to 'TemplateType'
  title: string;
  status: 'public' | 'private';
  created_at: string;
  updated_at: string;
  description: string;
}


export default function DocumentPage() {
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const documentId = params.id;

  useEffect(() => {
    const supabase = createClient();
    
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push("/sign-in");
          return;
        }

        // Fetch document
        const { data, error: docError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .single();

        if (docError) {
          setError(docError.message);
          return;
        }

        setDocument(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, router]);

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center mb-8">Document Page</h2>

      {document && (
        <div className="max-w-4xl mx-auto">
          {document.template in templates ? (
            <>
              <h1 className="text-3xl font-bold mb-4">{document.title}</h1>
              {/* Use the component directly as JSX */}
              {(() => {
                const Template = templates[document.template];
                return <Template document={document} />;
              })()}
            </>
          ) : (
            <div className="text-red-500">
              Unknown template type: {document.template}
            </div>
          )}
          
          {/* Debug view */}
          <details className="mt-8">
            <summary className="cursor-pointer text-gray-500">Raw Data</summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(document, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}