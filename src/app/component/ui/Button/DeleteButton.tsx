import React from "react";
import { BsInfoCircle } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

interface RemoveBtn {
  handleRemoveItem: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    indexToRemove: number
  ) => void;
  ind: number;
  setOpen: (open: boolean) => void;
  open: boolean;
  setDeleteIndex: (ind: number) => void;
}

const DeleteButton: React.FC<RemoveBtn> = ({
  handleRemoveItem,
  ind,
  setOpen,
  open,
  setDeleteIndex,
}) => {
  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start justify-between">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <div className="flex items-center mt-2">
                    <BsInfoCircle className="text-[#909399]" size={22} />
                    <p className="text-md pl-2 text-gray-500">
                      Are you sure you want to delete this?
                    </p>
                  </div>
                </div>
                <IoMdClose
                  className="text-black cursor-pointer"
                  onClick={(e) => {
                    setOpen(!open), e.preventDefault();
                    setDeleteIndex(-1); // Set the index of the item to show delete button
                  }}
                />
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 dark:bg-[#3a3b3c] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => {
                  handleRemoveItem(e, ind), setDeleteIndex(-1);
                }}
              >
                OK
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-[#3a3b3c] px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={(e) => {
                  setOpen(!open), e.preventDefault();
                  setDeleteIndex(-1); // Set the index of the item to show delete button
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteButton;
