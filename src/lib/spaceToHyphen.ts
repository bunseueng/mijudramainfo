export const spaceToHyphen = (name: string) => {
    return name && name.replace(/ /g, '-').toLocaleLowerCase()
}