import axios from 'axios';

export async function searchImgFromApi (searchQuerry, page) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?q=${searchQuerry}&page=${page}&key=31417578-856302b05e9be1bd780d83d86&image_type=photo&orientation=horizontal&per_page=12`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default searchImgFromApi;