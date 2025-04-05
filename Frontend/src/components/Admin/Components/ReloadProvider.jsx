import React, { useState } from 'react';
import ReloadContext from '../../../util/ReloadContext.js';

function ReloadProvider({ children }) {
  const [reload, setReload] = useState(false);

  return (
    <ReloadContext.Provider value={{ reload, setReload }}>
      {children}
    </ReloadContext.Provider>
  );
}

export default ReloadProvider;
