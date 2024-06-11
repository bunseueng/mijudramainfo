"use client";

import React, { useCallback, useState } from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { IoColorPaletteOutline } from "react-icons/io5";
import { CiEraser } from "react-icons/ci";
import { FaImages, FaLink } from "react-icons/fa6";

type Props = {
  editor: Editor | null;
  content: string;
};

const Toolbar = ({ editor }: Props) => {
  const [openColor, setOpenColor] = useState<boolean>(false);
  const [openUrl, setOpenUrl] = useState<boolean>(false);
  const [openAlign, setOpenAlign] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(""); // State variable to store the URL

  const addImage = useCallback(() => {
    if (imageUrl.trim() !== "") {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl(""); // Clear the URL after adding the image
    }
  }, [editor, imageUrl]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }
  return (
    <div
      className="px-4 py-3 rounded-tl-md rounded-tr-md flex justify-between items-start
    gap-5 w-full flex-wrap border border-gray-700"
    >
      <div className="flex justify-start items-center gap-5 w-full lg:w-10/12 flex-wrap ">
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={
            editor.isActive("bold")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={
            editor.isActive("italic")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={
            editor.isActive("underline")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Underline className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={
            editor.isActive("strike")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Strikethrough className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            setOpenColor(!openColor);
          }}
          className={
            editor.isActive("redo")
              ? "bg-sky-700 text-white p-2 rounded-lg relative"
              : "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg relative"
          }
        >
          <IoColorPaletteOutline />
          {openColor && (
            <div className="bg-[#242424] w-[300px] absolute -left-36 z-10">
              <h1 className="border-b-2 border-b-slate-300 p-3">Color</h1>
              <div className="flex flex-wrap p-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#958DF1").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#958DF1" })
                      ? "bg-[#958DF1] border-2 border-[#958DF1] p-4"
                      : "bg-[#958DF1] border-2 border-[#958DF1] p-4"
                  }
                  data-testid="setPurple"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#F98181").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#F98181" })
                      ? "bg-[#F98181] border-2 border-[#F98181] p-4"
                      : "bg-[#F98181] border-2 border-[#F98181] p-4"
                  }
                  data-testid="setPink"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#61BD6D").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#61BD6D" })
                      ? "bg-[#61BD6D] border-2 border-[#61BD6D] p-4"
                      : "bg-[#61BD6D] border-2 border-[#61BD6D] p-4"
                  }
                  data-testid="setGreen"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#1ABC9C").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#1ABC9C" })
                      ? "bg-[#1ABC9C] border-2 border-[#1ABC9C] p-4"
                      : "bg-[#1ABC9C] border-2 border-[#1ABC9C] p-4"
                  }
                  data-testid="setAqua"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#54ACD2").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#54ACD2" })
                      ? "bg-[#54ACD2] border-2 border-[#54ACD2] p-4"
                      : "bg-[#54ACD2] border-2 border-[#54ACD2] p-4"
                  }
                  data-testid="setCyan"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#2C82C9").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#2C82C9" })
                      ? "bg-[#2C82C9] border-2 border-[#2C82C9] p-4"
                      : "bg-[#2C82C9] border-2 border-[#2C82C9] p-4"
                  }
                  data-testid="setDarkCyan"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#9365B8").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#9365B8" })
                      ? "bg-[#9365B8] border-2 border-[#9365B8] p-4"
                      : "bg-[#9365B8] border-2 border-[#9365B8] p-4"
                  }
                  data-testid="setPurple"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#475577").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#475577" })
                      ? "bg-[#475577] border-2 border-[#475577] p-4"
                      : "bg-[#475577] border-2 border-[#475577] p-4"
                  }
                  data-testid="setDarkGray"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#CCCCCC").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#CCCCCC" })
                      ? "bg-[#CCCCCC] border-2 border-[#CCCCCC] p-4"
                      : "bg-[#CCCCCC] border-2 border-[#CCCCCC] p-4"
                  }
                  data-testid="setGray"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#41A85F").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#41A85F" })
                      ? "bg-[#41A85F] border-2 border-[#41A85F] p-4"
                      : "bg-[#41A85F] border-2 border-[#41A85F] p-4"
                  }
                  data-testid="setDarkGreen"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#00A885").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#00A885" })
                      ? "bg-[#00A885] border-2 border-[#00A885] p-4"
                      : "bg-[#00A885] border-2 border-[#00A885] p-4"
                  }
                  data-testid="setDarkAqua"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#3D8EB9").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#3D8EB9" })
                      ? "bg-[#3D8EB9] border-2 border-[#3D8EB9] p-4"
                      : "bg-[#3D8EB9] border-2 border-[#3D8EB9] p-4"
                  }
                  data-testid="setDarkCyan"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#2969B0").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#2969B0" })
                      ? "bg-[#2969B0] border-2 border-[#2969B0] p-4"
                      : "bg-[#2969B0] border-2 border-[#2969B0] p-4"
                  }
                  data-testid="setDarkOcean"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#553982").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#553982" })
                      ? "bg-[#553982] border-2 border-[#553982] p-4"
                      : "bg-[#553982] border-2 border-[#553982] p-4"
                  }
                  data-testid="setDarkPurple"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#28324E").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#28324E" })
                      ? "bg-[#28324E] border-2 border-[#28324E] p-4"
                      : "bg-[#28324E] border-2 border-[#28324E] p-4"
                  }
                  data-testid="setDarkSlate"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#000000").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#000000" })
                      ? "bg-[#000000] border-2 border-[#000000] p-4"
                      : "bg-[#000000] border-2 border-[#000000] p-4"
                  }
                  data-testid="setBlack"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#F7DA64").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#F7DA64" })
                      ? "bg-[#F7DA64] border-2 border-[#F7DA64] p-4"
                      : "bg-[#F7DA64] border-2 border-[#F7DA64] p-4"
                  }
                  data-testid="setYellow"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#FBA026").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#FBA026" })
                      ? "bg-[#FBA026] border-2 border-[#FBA026] p-4"
                      : "bg-[#FBA026] border-2 border-[#FBA026] p-4"
                  }
                  data-testid="setOrange"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#E25041").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#E25041" })
                      ? "bg-[#E25041] border-2 border-[#E25041] p-4"
                      : "bg-[#E25041] border-2 border-[#E25041] p-4"
                  }
                  data-testid="setRed"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#A38F84").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#A38F84" })
                      ? "bg-[#A38F84] border-2 border-[#A38F84] p-4"
                      : "bg-[#A38F84] border-2 border-[#A38F84] p-4"
                  }
                  data-testid="setBrown"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#EFEFEF").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#EFEFEF" })
                      ? "bg-[#EFEFEF] border-2 border-[#EFEFEF] p-4"
                      : "bg-[#EFEFEF] border-2 border-[#EFEFEF] p-4"
                  }
                  data-testid="setSlate100"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#FFFFFF").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#FFFFFF" })
                      ? "bg-[#FFFFFF] border-2 border-[#FFFFFF] p-4"
                      : "bg-[#FFFFFF] border-2 border-[#FFFFFF] p-4"
                  }
                  data-testid="setWhite"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#FAC51C").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#FAC51C" })
                      ? "bg-[#FAC51C] border-2 border-[#FAC51C] p-4"
                      : "bg-[#FAC51C] border-2 border-[#FAC51C] p-4"
                  }
                  data-testid="setDarkYellow"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#F37934").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#F37934" })
                      ? "bg-[#F37934] border-2 border-[#F37934] p-4"
                      : "bg-[#F37934] border-2 border-[#F37934] p-4"
                  }
                  data-testid="setDarkOrange"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#D14841").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#D14841" })
                      ? "bg-[#D14841] border-2 border-[#D14841] p-4"
                      : "bg-[#D14841] border-2 border-[#D14841] p-4"
                  }
                  data-testid="setDarkPink"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#B8312F").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#B8312F" })
                      ? "bg-[#B8312F] border-2 border-[#B8312F] p-4"
                      : "bg-[#B8312F] border-2 border-[#B8312F] p-4"
                  }
                  data-testid="setDarkRed"
                ></button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setColor("#7C706B").run();
                  }}
                  className={
                    editor.isActive("textStyle", { color: "#7C706B" })
                      ? "bg-[#7C706B] border-2 border-[#7C706B] p-4"
                      : "bg-[#7C706B] border-2 border-[#7C706B] p-4"
                  }
                  data-testid="setDarkBrown"
                ></button>
                <button
                  onClick={() => editor.chain().focus().unsetColor().run()}
                  data-testid="unsetColor"
                  className="bg-[#242424] p-3"
                >
                  <CiEraser />
                </button>
                <div className="flex flex-col">
                  <label htmlFor="" className="text-start mt-5">
                    HEX Color
                  </label>
                  <div className="flex justify-between">
                    <input
                      type="text"
                      onInput={(e: any) => {
                        e.preventDefault();
                        editor.chain().focus().setColor(e.target.value).run();
                      }}
                      value={editor.getAttributes("textStyle").color}
                      data-testid="setColor"
                      className="outline-none border-b-2 border-b-[#B8312F] bg-transparent"
                    />
                    <button
                      className="bg-cyan-400 text-white rounded-md p-1 ml-10"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenColor(false);
                      }}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <div className="relative pt-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              setOpenAlign(!openAlign);
            }}
            className={
              editor.isActive("heading", { level: 2 })
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400"
            }
          >
            <AlignLeft className="w-5 h-5" />
          </button>
          <div
            className={`absolute bg-[#242424] border-2 border-[#272727] z-20 ${
              openAlign ? "block" : "hidden"
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign("left").run();
              }}
              className={
                editor.isActive({ textAlign: "left" })
                  ? "bg-[#444444] opacity-80 px-5"
                  : " px-5"
              }
            >
              <AlignLeft />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign("center").run();
              }}
              className={
                editor.isActive({ textAlign: "center" })
                  ? "bg-[#444444] opacity-80 px-5"
                  : " px-5"
              }
            >
              <AlignCenter />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign("right").run();
              }}
              className={
                editor.isActive({ textAlign: "right" })
                  ? "bg-[#444444] opacity-80 px-5"
                  : " px-5"
              }
            >
              <AlignRight />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign("justify").run();
              }}
              className={
                editor.isActive({ textAlign: "justify" })
                  ? "bg-[#444444] opacity-80 px-5"
                  : " px-5"
              }
            >
              <AlignJustify />
            </button>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={
            editor.isActive("bulletList")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={
            editor.isActive("orderedList")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <ListOrdered className="w-5 h-5" />
        </button>

        <div
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-sky-700 text-white p-2 rounded-lg relative"
              : "text-sky-400 relative"
          }
        >
          <FaImages
            onClick={() => setOpenUrl(!openUrl)}
            className="cursor-pointer"
          />
          {openUrl && (
            <div className="w-[200px] border-2 bg-[#242424] absolute -left-20 z-20">
              <div className="border-b-2 border-b-slate-400 p-3">
                <FaLink />
              </div>
              <input
                type="text"
                placeholder="Inset url"
                className="outline-none border-b-2 border-b-[#1e88e5] bg-transparent my-3"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <button
                onClick={(e: any) => {
                  e.preventDefault();
                  addImage();
                  setOpenUrl(false);
                }}
                className="w-full text-lg text-[#1e88e5] font-semibold text-end uppercase pr-2"
              >
                Insert
              </button>
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={
            editor.isActive("blockquote")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Quote className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setCode().run();
          }}
          className={
            editor.isActive("code")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400"
          }
        >
          <Code className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          className={
            editor.isActive("undo")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          className={
            editor.isActive("redo")
              ? "bg-sky-700 text-white p-2 rounded-lg"
              : "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <Redo className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setLink();
          }}
          className={
            editor.isActive("link")
              ? "is-active"
              : "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg border-b-cyan-400 cursor-pointer"
          }
        >
          <Link className="w-5 h-5" />
        </button>
        <div
          className={`${
            editor.isActive("ProseMirror-selectednode")
              ? "bg-[#242424] border-2 border-[#272727] p-6"
              : ""
          }`}
        ></div>
      </div>
    </div>
  );
};

export default Toolbar;
