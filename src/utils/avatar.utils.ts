export const getInitialsAvatarUrl = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name.replace(/\*/g, "")
  )}&background=random`;
};
