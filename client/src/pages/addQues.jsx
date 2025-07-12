import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axios";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { LinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";

// Simple toolbar component for basic formatting
const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  const formatText = (type) => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        if (type === "bold") selection.format("bold");
        if (type === "italic") selection.format("italic");
        if (type === "code") selection.format("code");
      }
    });
  };

  return (
    <div className="mb-2 flex gap-2">
      <button
        type="button"
        className="px-2 py-1 bg-gray-200 rounded"
        onClick={() => formatText("bold")}
      >
        Bold
      </button>
      <button
        type="button"
        className="px-2 py-1 bg-gray-200 rounded"
        onClick={() => formatText("italic")}
      >
        Italic
      </button>
      <button
        type="button"
        className="px-2 py-1 bg-gray-200 rounded"
        onClick={() => formatText("code")}
      >
        Code
      </button>
    </div>
  );
};

const AddQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [error, setError] = useState("");

  // Fetch tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axiosInstance.get("/ques/tags");
        setAllTags(res.data.tags || []);
      } catch (err) {
        console.error("Error loading tags:", err);
        setError("Failed to load tags. Please try again.");
      }
    };
    fetchTags();
  }, []);

  // Handle tag toggle
  const handleTagToggle = useCallback((tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  }, []);

  // Lexical onChange handler to capture HTML
  const OnChangePlugin = ({ onChange }) => {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor);
          onChange(html);
        });
      });
    }, [editor, onChange]);
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || selectedTags.length === 0) {
      setError("Please fill in the title, description, and select at least one tag.");
      return;
    }

    try {
      await axiosInstance.post("/ques/add", {
        title,
        description,
        tags: selectedTags,
      });
      alert("Question posted successfully!");
      setTitle("");
      setDescription("");
      setSelectedTags([]);
    } catch (err) {
      console.error("Error submitting question:", err);
      setError("Failed to post question. Please try again.");
    }
  };

  // Lexical editor configuration
  const editorConfig = {
    namespace: "MyEditor",
    onError(error) {
      console.error("Lexical Error:", error);
    },
    nodes: [LinkNode, ListNode, ListItemNode],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ask a Question</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-semibold mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="e.g., How to use JWT with React?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description Editor */}
        <div>
          <label htmlFor="description" className="block font-semibold mb-2">
            Description
          </label>
          <LexicalComposer initialConfig={editorConfig}>
            <Toolbar />
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[200px] border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your question description..."
                />
              }
              placeholder={null}
            />
            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
            <OnChangePlugin onChange={setDescription} />
          </LexicalComposer>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-semibold mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {allTags.length > 0 ? (
              allTags.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                    selectedTags.includes(tag.name)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => handleTagToggle(tag.name)}
                >
                  {tag.name}
                </button>
              ))
            ) : (
              <p className="text-gray-500">No tags available.</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            disabled={!title.trim() || !description.trim() || selectedTags.length === 0}
          >
            Post Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestion;