export const getPhoto = async (link) => {
  const response = await fetch(link,
    {
      headers: {
        authorization: "Bearer aec3495c6678b37e84fd1c39b4ade73a82ce221d",
      },
    }
  )
  return response.url;
  
};
