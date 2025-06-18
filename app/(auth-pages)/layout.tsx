export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto flex flex-col gap-12 items-start py-12">{children}</div>
  );
}
