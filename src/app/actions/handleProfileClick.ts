export const handleProfileClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    username: string
  ) => {
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to exit the current site and view ${username}'s profile on TMDB?`
      )
    ) {
      window.open(`https://www.themoviedb.org/u/${username}`, "_blank");
    }
  };