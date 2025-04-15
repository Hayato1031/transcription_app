import axios from 'axios';
import { ELEVEN_LABS_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system';

const API_URL = 'https://api.elevenlabs.io/v1';

// Log the API key (first few characters) for debugging
console.log('API Key loaded:', ELEVEN_LABS_API_KEY ? `${ELEVEN_LABS_API_KEY.substring(0, 5)}...` : 'Not found');

/**
 * Transcribe an audio file using ElevenLabs API
 * @param {string} audioUri - The URI of the audio file to transcribe
 * @returns {Promise} - The transcription result
 */
export const transcribeAudio = async (audioUri) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('model_id', 'scribe_v1');
    
    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }
    
    // Create file object from URI
    const fileExtension = audioUri.split('.').pop();
    const mimeType = getMimeType(fileExtension);
    
    formData.append('file', {
      uri: audioUri,
      name: `recording.${fileExtension}`,
      type: mimeType,
    });
    
    // Optional parameters
    formData.append('language_code', 'ja'); // Japanese language code
    formData.append('tag_audio_events', 'true');
    formData.append('timestamps_granularity', 'word');
    formData.append('diarize', 'true'); // Enable speaker identification
    formData.append('num_speakers', '2'); // Default to 2 speakers, can be adjusted
    
    // Check if API key is available
    if (!ELEVEN_LABS_API_KEY || ELEVEN_LABS_API_KEY === 'your_api_key_here') {
      throw new Error('API key is missing or invalid');
    }
    
    console.log('Making API request with key:', ELEVEN_LABS_API_KEY ? `${ELEVEN_LABS_API_KEY.substring(0, 5)}...` : 'Not found');
    
    // Make API request
    const response = await axios.post(`${API_URL}/speech-to-text`, formData, {
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    return response.data;
  } catch (error) {
    console.error('Transcription error:', error);
    
    // More detailed error logging
    if (axios.isAxiosError(error)) {
      console.error('API Response:', error.response?.data);
      console.error('API Status:', error.response?.status);
      console.error('API Headers:', error.response?.headers);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        console.error('Authentication error. API Key:', ELEVEN_LABS_API_KEY ? 'Present' : 'Missing');
      }
    }
    
    throw error;
  }
};

/**
 * Get MIME type based on file extension
 * @param {string} extension - The file extension
 * @returns {string} - The MIME type
 */
const getMimeType = (extension) => {
  switch (extension.toLowerCase()) {
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'm4a':
      return 'audio/m4a';
    case 'aac':
      return 'audio/aac';
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    default:
      return 'audio/mpeg';
  }
};
