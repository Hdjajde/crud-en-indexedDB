export default () => {
  const request = indexedDB.open("TODO");

  request.onupgradeneeded = () => {
    const db = request.result;
    const defaultConfig = {
      keyPath: "id",
      autoIncrement: true,
    };
    db.createObjectStore("tareas", defaultConfig);
  };
}