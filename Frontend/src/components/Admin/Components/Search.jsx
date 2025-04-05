import React from 'react';
import '../Components/Styles/SearchCss.css';

function Search() {
  return (
    <div className='searchContainer'>
      <input
        className='query'
        type="text"
        placeholder='Search patient by ID...'
      />
      <div className='result'>
        {/* You can show search results here dynamically */}
      </div>
    </div>
  );
}

export default Search;
