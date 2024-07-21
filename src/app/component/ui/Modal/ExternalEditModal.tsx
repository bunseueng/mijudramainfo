import { external_link } from "@/helper/item-list";
import { ExternalLinkType } from "@/helper/type";
import { externalLink, TExternalLink } from "@/helper/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

interface ExternalType {
  toggleEdit: (idx: number) => void;
  setEditingIndex: (idx: number) => void;
  item: any;
  idx: number;
}

const ExternalEditModal: React.FC<ExternalType> = ({
  item,
  toggleEdit,
  setEditingIndex,
  idx,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    reset,
  } = useForm<TExternalLink>({
    resolver: zodResolver(externalLink),
  });
  console.log(item?.id);
  return (
    <div>
      <div className="mb-5">
        {item?.title === "Website" ? (
          <div className="flex items-center">
            <div className="relative inline-block w-full">
              <label htmlFor="url">
                <span>*</span> URL
              </label>
              <input
                {...register("url")}
                type="text"
                className={`h-10 leading-[40px] text-sm bg-[#3a3b3c] border-2 border-[#46494a] text-[#ffffffcc] rounded-md px-4 outline-none focus:border-[#1675b6] ${
                  errors?.url && "border-red-400 focus:border-red-400"
                }`}
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
            <div className="relative inline-block w-full">
              <label htmlFor="link_text">Link Text</label>
              <input
                {...register("link_text")}
                type="text"
                className="h-10 leading-[40px] bg-[#3a3b3c] border-2 border-[#46494a] text-[#ffffffcc] rounded-md outline-none focus:border-[#1675b6] px-4"
                placeholder="Link Text/Anchor Text"
              />
            </div>
            <div className="relative inline-block w-full">
              <label htmlFor="additional_text">Additional Text</label>
              <input
                {...register("additional_text")}
                type="text"
                className="h-10 leading-[40px] bg-[#3a3b3c] border-2 border-[#46494a] text-[#ffffffcc] rounded-md outline-none focus:border-[#1675b6] px-4"
                placeholder="Additional Text"
              />
            </div>
          </div>
        ) : (
          <div className="relative inline-block w-full">
            <input
              {...register("id")}
              type="text"
              className={`h-10 leading-[40px] text-sm bg-[#3a3b3c] border-2 border-[#46494a] text-[#ffffffcc] rounded-md px-4 outline-none focus:border-[#1675b6] ${
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
        className="text-sm bg-[#3a3b3c] border-2 border-[#3e4042] rounded-md px-5 py-2"
        onClick={() => {
          toggleEdit(idx);
          setEditingIndex(idx);
        }}
      >
        Cancel
      </button>
      <button
        type="button"
        className="text-sm bg-[#409effd9] border-2 border-[#409effcc] rounded-md px-5 py-2 ml-3"
        // onClick={() => addingItem(getValues())}
      >
        Save
      </button>
    </div>
  );
};

export default ExternalEditModal;
