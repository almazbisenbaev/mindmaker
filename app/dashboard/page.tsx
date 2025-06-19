"use client";

import { useState, useEffect, useRef } from "react"
import { useRouter, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Trash2, Link2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
  const copyDocumentLink = async (docId: string) => {
    const url = `${window.location.origin}/doc/${docId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
      console.error('Failed to copy link:', error);
    }
  };
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]); 
  const [user, setUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);

  const handleDelete = async (docId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', docId);

    if (error) {
      toast.error('Error deleting document');
      console.error('Error deleting document:', error);
      return;
    }

    setDocuments(documents.filter(doc => doc.id !== docId));
    toast.success('Document deleted successfully');
  };

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
        <h2 className="text-2xl font-semibold">My documents</h2>
      </div>

      <div className="container mx-auto pb-12">
        {documents.length === 0 ? (
          <div className="text-center text-muted-foreground py-24">
            You have no documents yet. Create a new document to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white p-10 rounded-3xl border border-gray-200 relative"
              >
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/doc/${doc.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View document</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => copyDocumentLink(doc.id)}
                      >
                        <Link2 className="mr-2 h-4 w-4" />
                        <span>Copy link</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => { setDocToDelete(doc); setDeleteDialogOpen(true); }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

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
                    Open
                  </Button>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete <b>{docToDelete?.title}</b>? This action cannot be undone.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={async () => {
                if (docToDelete) {
                  await handleDelete(docToDelete.id);
                  setDeleteDialogOpen(false);
                  setDocToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify(documents, null, 2)}
      </pre> */}

    </>
  );
}
