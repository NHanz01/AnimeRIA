const useGetTopAnimes = async (pagesToFetch) => {
  const resultList = [];
  let isDone = false;

  const queryAnimePage = (page) => {
      return `
      {
          Page(page:${page}, perPage:50){
              media (sort:POPULARITY_DESC, isAdult: false){      
                  title {
                      english
                      romaji            
                  }
                  id
                  characters(sort:FAVOURITES_DESC, perPage: 5){
                      nodes{
                          id
                          name {
                              full
                          }
                          image{
                              large
                          }
                      }
                  }      
              }  
          }
      }`;
  };

  const fetchAnimePage = async (page) => {
      try {
          const response = await fetch("https://graphql.anilist.co/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  query: queryAnimePage(page),
              }),
          });
          const { data } = await response.json();
          const arrayOfAnimes = data.Page.media;
          arrayOfAnimes.forEach((element) => {
              const characterList = element.characters.nodes.map((elem) => {
                  if (elem.image.large !== undefined) {
                      const character = {
                          id: elem.id,
                          name: elem.name.full,
                          image: elem.image.large,
                      };
                      return character;
                  }
              });
              const anime = {
                  title: element.title.english || element.title.romaji,
                  characters: characterList,
                  id: element.id,
              };
              resultList.push(anime);
          });
      } catch (error) {
          console.error(error);
      }
  };

  for (let i = 1; i <= pagesToFetch; i++) {
      await fetchAnimePage(i);
  }
  isDone = true;

  return { results: resultList, isDone: isDone };
};

export default useGetTopAnimes;
