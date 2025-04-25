import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';

function RecommendationPopup({ items }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Find the todo item with the highest story points
  const getHighestPriorityItem = () => {
    if (!items || items.length === 0) {
      return null;
    }

    // Filter for items that are not done
    const notDoneItems = items.filter(item => !item.done);
    
    if (notDoneItems.length === 0) {
      return null;
    }

    // Find the item with the highest story points
    return notDoneItems.reduce((max, item) => {
      const currentPoints = item.story_Points || 0;
      const maxPoints = max.story_Points || 0;
      
      return currentPoints > maxPoints ? item : max;
    }, notDoneItems[0]);
  };

  const highestPriorityItem = getHighestPriorityItem();

  return (
    <>
    <Button 
      variant="contained" 
      onClick={handleOpen}
      size="small"
      sx={{ 
        ml: 2,
        bgcolor: '#4A7A7A',
        borderRadius: 28,  // increased border radius for more circular appearance
        '&:hover': {
          bgcolor: '#3d6363'  // slightly darker for hover state
        }
      }}
    >
      Recommendation
    </Button>
      
    <Dialog open={open} onClose={handleClose} className="recommendation-dialog">
        <DialogTitle className="recommendation-title">Recommendation</DialogTitle>

        <DialogContent className="recommendation-content">
          {highestPriorityItem ? (
            <Box className="recommendation-box">
              <Typography variant="h6" className="recommendation-highlight">
                Highest Priority Item
              </Typography>
              <div className='justifyelememts'>
              <Typography variant="body1">
                <strong>Description:</strong> {highestPriorityItem.description}
              </Typography>
              <Typography variant="body1">
                <strong>Story Points:</strong> {highestPriorityItem.story_Points}
              </Typography>
              {highestPriorityItem.creation_ts && (
                <Typography variant="body2" className="recommendation-timestamp">
                  Created: {new Date(highestPriorityItem.creation_ts).toLocaleString()}
                </Typography>
              )}
              </div>
            </Box>
          ) : (
            <Typography className="no-items-message">No pending items available.</Typography>
          )}
        </DialogContent>

        <DialogActions className="dialog-actions">
          <Button onClick={handleClose} className="close-button">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RecommendationPopup;