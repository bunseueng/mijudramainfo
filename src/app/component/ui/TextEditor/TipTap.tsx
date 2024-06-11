"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import ImageResize from "tiptap-extension-resize-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Dropcursor from "@tiptap/extension-dropcursor";

const Tiptap = ({
  onChange,
  description,
}: {
  description: string;
  onChange: (richText: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline.configure({
        HTMLAttributes: { class: "text-xl font-bold", levels: [2] },
      }),
      BulletList.configure({}),
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      Link.extend({ inclusive: false }).configure({
        autolink: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ImageResize.configure({
        allowBase64: true,
        inline: true,
        HTMLAttributes: { class: "tiptap", levels: [2] },
      }),
      Dropcursor,
    ],
    content: description, // Set the initial content of the editor
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full md:w-[70%] rounded-md mt-3 md:mt-0 md:ml-5 py-3 ">
      <Toolbar editor={editor} content={description} />
      <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
    </div>
  );
};

export default Tiptap;
