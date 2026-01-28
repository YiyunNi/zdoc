import React, { useEffect } from 'react';

const MarkdownRaw = ({ markdownContent }) => {
  useEffect(() => {
    if (markdownContent) {
      document.open();
      document.write(markdownContent);
      document.close();
    }
  }, [markdownContent]);

  return null;
};

export default MarkdownRaw;
