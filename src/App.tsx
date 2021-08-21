import React from 'react';
import Todos from './Todos';
import useDatabaseMetadata from './utils/useDatabaseMetadata';

function App() {

  const [databaseInstance, metadataInfo] = useDatabaseMetadata();

  if (metadataInfo === null || databaseInstance === null) return (
    <p>Please wait...</p>
  )

  return (
    <Todos
      metadataInfo={metadataInfo}
      databaseInstance={databaseInstance}
    />
  );
}

export default App;
