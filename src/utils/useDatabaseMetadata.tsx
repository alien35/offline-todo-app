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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupMultiLeaderSync = (srcDatabase: any) => {
    srcDatabase.replicate.from(DatabaseEnums.ExternalApi).on('complete', function(info: any) {
      // then two-way, continuous, retriable sync
      srcDatabase.sync(DatabaseEnums.ExternalApi, {
        live: true,
        retry: true
      })
        .on('change', () => {})
        .on('paused', () => {})
        .on('error', () => {});
    }).on('error', () => {});
  }

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
    const _databaseInstance = new PouchDB(info.nodeId);
    setDatabaseInstance(_databaseInstance);
    setupMultiLeaderSync(_databaseInstance);
    PouchDB.sync(info.nodeId, DatabaseEnums.MetadataDBName, {
      live: true,
      retry: true
    });
    setMetadataInfo({
      nodeId: info.nodeId,
      eventCount: info.eventCount,
      _rev: info._rev
    })
  }

  const setupNewDatabase = async () => {
    const randomId = uuid.v4();
    const document = {
      _id: DatabaseEnums.MetadataDBLookupRow,
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
    const _databaseInstance = new PouchDB(randomId);
    setDatabaseInstance(_databaseInstance);
    setupMultiLeaderSync(_databaseInstance);

    setMetadataInfo({
      nodeId: randomId,
      eventCount: 0,
      _rev: newInstanceResult.rev
    })
  }

  return [databaseInstance, metadataInfo];
}

export default useDatabaseMetadata;
