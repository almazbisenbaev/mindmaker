import DocumentForm from './components/DocumentForm';

export default function NewDocument() {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Create New Document</h2>
      <DocumentForm />
    </div>
  );
}
