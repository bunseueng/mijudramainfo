export  const mergeAndRemoveDuplicates = (
    arr1: any[] = [],
    arr2: any[] = [],
    arr3: any[] = []
  ) => {
    // Ensure both arr1 and arr2 are arrays
    if (!Array.isArray(arr1)) arr1 = [];
    if (!Array.isArray(arr2)) arr2 = [];
    if (!Array.isArray(arr3)) arr3 = [];
    // Use Set to remove duplicates and merge arrays
    const mergedArray = Array.from(new Set([...arr1, ...arr2, arr3]));
    return mergedArray;
  };