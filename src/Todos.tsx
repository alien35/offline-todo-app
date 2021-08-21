import React from 'react';
import './App.css';
import { DatabaseEnums } from './enums/database.enums';
import useTodoRecords from './utils/useTodoRecords';
import PouchDB from "pouchdb";

interface Props {
  databaseInstance: any;
  metadataInfo: {
    nodeId: string;
    eventCount: number;
    _rev: string;
  }
}

function Todos(props: Props) {

  const metadataDatabaseInstance = new PouchDB(DatabaseEnums.MetadataDBName);

  const [todos, setTodos] = React.useState<any[]>([]);
  const [inputText, setInputText] = React.useState("");
  const [eventCount, setEventCount] = React.useState(props.metadataInfo.eventCount);

  const records: any = useTodoRecords(props.databaseInstance);

  const storeEventCount = (num: number) => {
    setEventCount(num);
    metadataDatabaseInstance.put({
      _id: DatabaseEnums.MetadataDBLookupRow,
      _rev: props.metadataInfo._rev,
      eventCount: num,
      nodeId: props.metadataInfo.nodeId
    })
  }
  
  React.useEffect(() => {
    setTodos(records);
  }, [records]);

  const onAddTodo = () => {
    if (!inputText) {
      return alert("Nothing to add...");
    }
    const newCount = eventCount + 1;
    const document = {
      _id: `${props.metadataInfo.nodeId}_${newCount}`,
      message: inputText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    props.databaseInstance.put(document);
    storeEventCount(newCount);
    setTodos([document, ...todos])
    setInputText("");
  }

  const onRemoveTodo = async (id: string) => {
    setTodos(todos.filter((todo: any) => todo._id !== id));
    let doc;
    try {
      doc = await props.databaseInstance.get(id);
    } catch (err) {
      console.error(err, 'props.databaseInstance.get error');
      return;
    }
    props.databaseInstance.remove(id, doc._rev);
  }

  return (
    <div className="App">
      <h1>To-Do</h1>
      <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="I need to..." />
      <button onClick={onAddTodo}>Add!</button>
      <div className="todos-content">
        {
          todos.map((todo: any) => (
            <div key={todo._id} className="todo-list-item">
              <p>{todo.message}</p>
              <p onClick={() => onRemoveTodo(todo._id)} className="close-icon">X</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Todos;
