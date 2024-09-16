import { useState } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

export interface IBook {
  id: number;
  availableNumberOfCopies: number;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  isbnNo: string;
  numOfPages: number;
  totalNumOfCopies: number;
}

const FetchBooks = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [booksFetched, setBooksFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();  // Use navigate hook for redirection

  const handleFetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get('accessToken');
      const response = await fetch("http://localhost:3500/books", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data.items);
      setBooksFetched(true);
    } catch (error) {
      setError("There was an error fetching the books.");
      console.error("There was an error!", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('accessToken');
    navigate('/');  // Redirect to home page
  };

  return (
    <div className="bg-library-background bg-fixed relative p-6 bg-gray-100 min-h-screen bg-cover bg-center">
      
      <button 
        className="fixed top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-700 transition duration-300"
        onClick={handleLogout}
      >
        Logout
      </button>
      
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-lg mt-16 mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Library Books List</h2>

        {loading && <p className="text-blue-600 text-center mb-4">Loading books...</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {!booksFetched && !loading && (
          <button 
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 w-full mb-8"
            onClick={handleFetchBooks}
          >
            Fetch Books
          </button>
        )}

        {books.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead className="bg-blue-600 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Author</th>
                    <th className="px-6 py-3 text-left">Publisher</th>
                    <th className="px-6 py-3 text-left">Genre</th>
                    <th className="px-6 py-3 text-left">ISBN No</th>
                    <th className="px-6 py-3 text-left">Number of Pages</th>
                    <th className="px-6 py-3 text-left">Total Copies</th>
                    <th className="px-6 py-3 text-left">Available Copies</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="px-6 py-4 text-gray-700">{book.title}</td>
                      <td className="px-6 py-4 text-gray-700">{book.author}</td>
                      <td className="px-6 py-4 text-gray-700">{book.publisher}</td>
                      <td className="px-6 py-4 text-gray-700">{book.genre}</td>
                      <td className="px-6 py-4 text-gray-700">{book.isbnNo}</td>
                      <td className="px-6 py-4 text-gray-700">{book.numOfPages}</td>
                      <td className="px-6 py-4 text-gray-700">{book.totalNumOfCopies}</td>
                      <td className="px-6 py-4 text-gray-700">{book.availableNumberOfCopies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !loading && <p className="mt-6 text-gray-600 text-center">No books available.</p>
        )}
      </div>
    </div>
  );
};

export default FetchBooks;
