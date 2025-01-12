import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createNote, getNotesByChapter, updateNote } from "../../Api/notes";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "color",
  "background",
  "align",
];

const AddNotes = ({ journeyId, chapterId }) => {
  const [value, setValue] = useState("");
  const [noteId, setNoteId] = useState("");
  const [submitMode, setSubmit] = useState(true);

  // Handle form submission (Add new note)
  const handleSubmit = async () => {
    try {
      const response = await createNote(journeyId, chapterId, value);
      console.log("Notes added: ", response);
      fetchNotes();
      alert("Notes added successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to add note");
    }
  };

  // Handle form submission (Update existing note)
  const handleUpdate = async () => {
    try {
      const response = await updateNote(noteId, value);
      fetchNotes();
      console.log("Note updated: ", response);
      alert("Notes updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update note");
    }
  };

  // Fetch existing notes for the chapter
  const fetchNotes = async () => {
    try {
      const response = await getNotesByChapter(chapterId);
      if (response && response.length > 0) {
        setValue(response[0].content);
        setSubmit(false);
        setNoteId(response[0].id);
      }
      console.log("Fetched notes: ", response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [chapterId]);

  return (
    <section className="bg-white block dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          {submitMode ? "New Notes" : "Edit Notes"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (submitMode) {
              handleSubmit();
            } else {
              handleUpdate();
            }
          }}
          className="space-y-4"
        >
          <ReactQuill
            value={value}
            onChange={setValue}
            modules={modules}
            formats={formats}
            placeholder="Write your notes here..."
            className=" rounded-lg shadow-sm w-100"
          />

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 mt-4 text-sm font-medium text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800 transition-all duration-300"
          >
            {submitMode ? "New Notes" : "Update Notes"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddNotes;
