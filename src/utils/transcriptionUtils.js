/**
 * Process the raw API response and format it with speaker labels
 * @param {Object} apiResponse - The raw API response from ElevenLabs
 * @param {Object} speakerNames - Object mapping speaker_ids to custom names
 * @returns {Object} - Processed transcription with speaker segments
 */
export const processTranscription = (apiResponse, speakerNames = {}) => {
  if (!apiResponse || !apiResponse.words || !apiResponse.words.length) {
    return { text: '', segments: [] };
  }

  const words = apiResponse.words;
  const segments = [];
  let currentSegment = null;
  let currentText = '';

  // Process each word and group by speaker
  words.forEach((word) => {
    // Skip spacing type
    if (word.type === 'spacing') {
      if (currentSegment) {
        currentText += word.text;
      }
      return;
    }

    const speakerId = word.speaker_id || 'unknown';
    
    // If this is a new speaker or first word, create a new segment
    if (!currentSegment || currentSegment.speakerId !== speakerId) {
      // Save the previous segment if it exists
      if (currentSegment) {
        currentSegment.text = currentText.trim();
        segments.push(currentSegment);
      }
      
      // Start a new segment
      currentText = word.text;
      currentSegment = {
        speakerId,
        speakerName: speakerNames[speakerId] || speakerId,
        startTime: word.start,
        endTime: word.end,
      };
    } else {
      // Continue the current segment
      currentText += word.text;
      currentSegment.endTime = word.end;
    }
  });

  // Add the last segment
  if (currentSegment) {
    currentSegment.text = currentText.trim();
    segments.push(currentSegment);
  }

  // Create the formatted text with speaker labels
  const formattedText = segments
    .map(segment => `${segment.speakerName}: ${segment.text}`)
    .join('\n\n');

  return {
    text: formattedText,
    segments,
    rawResponse: apiResponse
  };
};

/**
 * Get default speaker names
 * @param {Array} segments - The processed segments
 * @returns {Object} - Default speaker names mapping
 */
export const getDefaultSpeakerNames = (segments) => {
  const speakerNames = {};
  
  if (!segments || !segments.length) {
    return speakerNames;
  }
  
  // Get unique speaker IDs
  const speakerIds = [...new Set(segments.map(segment => segment.speakerId))];
  
  // Create default names
  speakerIds.forEach((id, index) => {
    speakerNames[id] = `Speaker ${index + 1}`;
  });
  
  return speakerNames;
};
