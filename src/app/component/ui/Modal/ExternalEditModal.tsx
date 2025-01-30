import { external_link } from "@/helper/item-list";
import { ExternalLinkType } from "@/helper/type";
import { externalLink, TExternalLink } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

interface ExternalType {
  item: any;
  database: ExternalLinkType[];
  setDatabase: (data: ExternalLinkType[]) => void;
  toggleEdit: (idx: number) => void;
  setEditingIndex: (idx: number) => void;
  editingIndex: number | null;
  selectedExternal: string;
  setIsItemDataChanged: (data: boolean[]) => void;
  isItemDataChanged: boolean[]; // Update the type here
  setEditingIndexes: (data: any) => void;
  idx: number;
}

const ExternalEditModal: React.FC<ExternalType> = ({
  item,
  database,
  setDatabase,
  toggleEdit,
  setEditingIndex,
  editingIndex,
  selectedExternal,
  isItemDataChanged,
  setIsItemDataChanged,
  setEditingIndexes,
  idx,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TExternalLink>({
    resolver: zodResolver(externalLink),
  });

  const editingItem = async (data: TExternalLink) => {
    try {
      const updatingItem = database?.map((item, index) => {
        if (index === editingIndex) {
          const newData = {
            ...item,
            id: data.id,
            url: data?.url,
            link_url:
              external_link.find((item) => item.label === selectedExternal)
                ?.link_url || item?.link_url,
            link_text: data.link_text,
            additional_text: data.additional_text,
          };
          if (newData) {
            const newState = [...isItemDataChanged];
            newState[index] = true; // Assuming `index` is the index of the item that changed
            setIsItemDataChanged(newState);
          }
          return newData;
        }
        return item;
      });
      setDatabase(updatingItem as ExternalLinkType[]);
      setEditingIndexes((prev: any) =>
        prev.map((isEditing: boolean, index: number) =>
          index === idx ? !isEditing : isEditing
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mb-5">
        {item?.title === "Website" ? (
          <div className="w-full">
            <div className="relative inline-block w-full md:w-[30%]">
              <label htmlFor="url">
                <span>*</span> URL
              </label>
              <input
                {...register("url")}
                type="text"
                className={`h-10 leading-[40px] placeholder:text-sm text-sm bg-white dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#46494a] text-[#ffffffcc] rounded-md px-4 outline-none focus:border-[#1675b6] ${
                  errors?.url && "border-red-400 focus:border-red-400"
                }`}
                placeholder="Website URL/Link"
                defaultValue={item?.id}
              />
              {errors?.url && (
                <p className="text-[12px] text-red-500 pt-1">
                  {external_link?.find((items) => items?.label === item.title)
                    ?.error || ""}{" "}
                  {errors.url.message}
                </p>
              )}
            </div>
            <div className="relative inline-block w-full md:w-[33%]">
              <label htmlFor="link_text">Link Text</label>
              <input
                {...register("link_text")}
                type="text"
                className="h-10 leading-[40px] placeholder:text-sm bg-white dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#46494a] text-[#ffffffcc]  rounded-md outline-none focus:border-[#1675b6] px-4"
                placeholder="Link Text/Anchor Text"
              />
            </div>
            <div className="relative inline-block w-full md:w-[33%]">
              <label htmlFor="additional_text">Additional Text</label>
              <input
                {...register("additional_text")}
                type="text"
                className="h-10 leading-[40px] placeholder:text-sm bg-white dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#46494a] text-[#ffffffcc]  rounded-md outline-none focus:border-[#1675b6] px-4"
                placeholder="Additional Text"
              />
            </div>
          </div>
        ) : (
          <div className="relative inline-block w-full">
            <input
              {...register("id")}
              type="text"
              className={`h-10 leading-[40px] placeholder:text-sm text-sm bg-white dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#46494a] text-black dark:text-[#ffffffcc] rounded-md px-4 outline-none focus:border-[#1675b6] ${
                errors?.url && "border-red-400 focus:border-red-400"
              }`}
              defaultValue={item?.id}
            />
          </div>
        )}
        <small className="text-muted-foreground opacity-60">
          {external_link?.find((items) => items?.label === item?.title)?.eg ||
            ""}
        </small>
        {errors?.id && (
          <p className="text-[12px] text-red-500 pt-1">
            {
              external_link
                ?.filter((item: any) => item?.label !== "Website")
                ?.find((items) => items?.label === item?.title)?.error
            }{" "}
            {item?.title !== "Website" && errors.id.message}
          </p>
        )}
      </div>{" "}
      <button
        type="button"
        className="text-sm text-black dark:text-white bg-white dark:bg-[#3a3b3c] border-2 border-[#dcdfe6] dark:border-[#3e4042] rounded-md px-5 py-2"
        onClick={() => {
          toggleEdit(idx);
          setEditingIndex(idx);
        }}
      >
        Cancel
      </button>
      <button
        type="button"
        className="text-sm text-white bg-[#409effd9] border-2 border-[#409effcc] rounded-md px-5 py-2 ml-3"
        onClick={handleSubmit(editingItem)}
      >
        Save
      </button>
    </div>
  );
};

export default ExternalEditModal;
