import React from 'react';
import * as uuid from 'uuid';
import PouchDB from "pouchdb";
import { DatabaseEnums } from '../enums/database.enums';

function useDatabaseMetadata() {

  const metadataDatabaseInstance = new PouchDB(DatabaseEnums.MetadataDBName);
  const [databaseInstance, setDatabaseInstance] = React.useState<any>(null);
  const [metadataInfo, setMetadataInfo] = React.useState<null | any>(null);

  React.useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    let info: any;
    try {
      info = await metadataDatabaseInstance.get(DatabaseEnums.MetadataDBLookupRow);
    } catch (err) {
      console.warn(err, 'unable to find database_info. Creating a new one...');
    }
    if (!info) {
      return setupNewDatabase();
    }
    console.log(info, 'info man')
    setDatabaseInstance(new PouchDB(info.nodeId));
    setMetadataInfo({
      nodeId: info.nodeId,
      eventCount: info.eventCount,
      _rev: info._rev
    })
  }

  const setupNewDatabase = async () => {
    const randomId = uuid.v4();
    const document = {
      _id: "database_info",
      nodeId: randomId,
      eventCount: 0
    }
    let newInstanceResult;
    try {
      newInstanceResult = await metadataDatabaseInstance.put(document);
    } catch (err) {
      console.error("Unable to create database", err);
      return;
    }
    console.log(newInstanceResult, 'newInstanceResult')
    
    setDatabaseInstance(new PouchDB(randomId));
    setMetadataInfo({
      nodeId: randomId,
      eventCount: 0,
      _rev: newInstanceResult.rev
    })
  }

  return [databaseInstance, metadataInfo];
}

export default useDatabaseMetadata;
