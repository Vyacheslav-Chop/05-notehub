import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import css from "./App.module.css";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import NoteModal from "../NoteModal/NoteModal";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import Loader from "../Loader/Loader";
import ErrorText from "../ErrorText/ErrorText";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceQuery] = useDebounce(searchQuery, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, debounceQuery],
    queryFn: () => fetchNotes(debounceQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} value={searchQuery} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
        {isOpenModal && <NoteModal onClose={closeModal} />}
      </header>
      {isError && <ErrorText />}
      {isLoading && (
        <Loader
          size={80}
          thickness={8}
          color="#0050ff"
          borderColor="rgba(0, 80, 255, 0.3)"
          shadowColor="rgba(0, 80, 255, 0.5)"
        />
      )}
      {data && notes.length > 0 && !isLoading && <NoteList notes={notes} />}
    </div>
  );
}
