import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ url }) => {
  return (
    <div>
      <ReactPlayer
        url={url}
        controls // Add controls to the player
        width="100%" // Set the width of the player
        height="auto" // Set the height of the player to auto for responsive sizing
      />
    </div>
  );
};

export default VideoPlayer;
