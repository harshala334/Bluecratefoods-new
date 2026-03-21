// Recipe Components
export { default as RecipeCard } from './RecipeCard';

export const getYoutubeId = (url: string | undefined | null) => {
  if (!url) {
    return null;
  }
};
