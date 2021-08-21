import React from 'react';

function useTodoRecords(databaseInstance: any) {

  const [records, setRecords] = React.useState([]);

  const fetchRecords = async () => {
    let _records;
    try {
      _records = await databaseInstance.allDocs({include_docs: true});
    } catch (err) {
      console.log("Something went wrong fetching all docs", err);
      return;
    }
    setRecords(_records.rows.map((_record: any) => {
      return {
        createdAt: _record.doc.createdAt,
        message: _record.doc.message,
        _id: _record.id
      }
    }))
    
  }
  React.useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return records;
}

export default useTodoRecords;
