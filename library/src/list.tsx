import { useState } from "react";
import Cookies from 'js-cookie';

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
  const [message, setMessage] = useState("");

  const handleFetchBooks = async () => {
    try {
      const token = Cookies.get('accessToken');
      console.log("fetch books")
      console.log(token)
      const response = await fetch("http://localhost:3500/books", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data.items);
      setMessage("Books fetched successfully!");
    } catch (error) {
      console.error("There was an error!", error);
      setMessage("Failed to fetch books.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Books List</h2>
      <button 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        onClick={handleFetchBooks}
      >
        Fetch Books
      </button>
      {message && <p className="mt-4 text-red-600 font-semibold">{message}</p>}
      {books.length > 0 ? (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-blue-500 text-white">
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
      ) : (
        <p className="mt-6 text-gray-600">No books available.</p>
      )}
    </div>
  );
};

export default FetchBooks;
