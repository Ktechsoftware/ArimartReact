export default function WebLayout({ children }) {
  return (
    <>
      <header className="bg-white shadow-md px-8 py-4 sticky top-0 z-50">
        <h1 className="text-xl font-bold">Desktop Header</h1>
      </header>
      <main className="max-w-screen-lg mx-auto pt-4">{children}</main>
      <footer className="bg-gray-100 text-center py-6 mt-10">
        Desktop Footer
      </footer>
    </>
  );
}
