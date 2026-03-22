import api from '../lib/axios';

const mediaService = {
  // Upload một ảnh duy nhất lên Cloudinary qua Backend
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

export default mediaService;
