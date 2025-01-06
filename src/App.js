import React, { useState } from "react";
import "./App.css";

function App() {
  const [applications, setApplications] = useState([
    { id: 1, name: "Application 1", documents: [{ id: 1, name: "Document 1" }] }
  ]);

  const [currentAppId, setCurrentAppId] = useState(applications[0].id);
  const [currentDocId, setCurrentDocId] = useState(applications[0].documents[0].id);

  const addApplication = () => {
    const newAppId = applications.length + 1;
    setApplications([
      ...applications,
      { id: newAppId, name: `Application ${newAppId}`, documents: [{ id: 1, name: "Document 1" }] }
    ]);
  };

  const addDocument = () => {
    setApplications(
      applications.map((app) =>
        app.id === currentAppId
          ? {
              ...app,
              documents: [
                ...app.documents,
                { id: app.documents.length + 1, name: `Document ${app.documents.length + 1}` }
              ]
            }
          : app
      )
    );
  };

  const deleteApplication = (id) => {
    
    if (id === 1) return;

    setApplications(applications.filter((app) => app.id !== id));
    if (currentAppId === id) {
      const remainingApplications = applications.filter((app) => app.id !== id);
      if (remainingApplications.length > 0) {
        setCurrentAppId(remainingApplications[0].id);
        setCurrentDocId(remainingApplications[0].documents[0]?.id || 0);
      }
    }
  };

  const deleteDocument = (docId) => {
    if (currentAppId === 1 && docId === 1) return;

    setApplications(
      applications.map((app) =>
        app.id === currentAppId
          ? { ...app, documents: app.documents.filter((doc) => doc.id !== docId) }
          : app
      )
    );
  };

  const handleNext = () => {
    const currentApp = applications.find((app) => app.id === currentAppId);
    const currentDocIndex = currentApp.documents.findIndex((doc) => doc.id === currentDocId);

    if (currentDocIndex < currentApp.documents.length - 1) {
      setCurrentDocId(currentApp.documents[currentDocIndex + 1].id);
    } else {
      const nextAppIndex = applications.findIndex((app) => app.id === currentAppId) + 1;
      if (nextAppIndex < applications.length) {
        setCurrentAppId(applications[nextAppIndex].id);
        setCurrentDocId(applications[nextAppIndex].documents[0].id);
      }
    }
  };

  const handleBack = () => {
    const currentApp = applications.find((app) => app.id === currentAppId);
    const currentDocIndex = currentApp.documents.findIndex((doc) => doc.id === currentDocId);

    if (currentDocIndex > 0) {
      setCurrentDocId(currentApp.documents[currentDocIndex - 1].id);
    } else {
      const prevAppIndex = applications.findIndex((app) => app.id === currentAppId) - 1;
      if (prevAppIndex >= 0) {
        const prevApp = applications[prevAppIndex];
        setCurrentAppId(prevApp.id);
        setCurrentDocId(prevApp.documents[prevApp.documents.length - 1].id);
      }
    }
  };

  const uploadDocument = (file) => {
    console.log(
      `Uploading ${file.name} to Application ${currentAppId}, Document ${currentDocId}`
    );
  };

  const currentApp = applications.find((app) => app.id === currentAppId);
  const currentDoc = currentApp?.documents.find((doc) => doc.id === currentDocId);

  return (
    <div className="app">
      <header className="topbar">
        {applications.map((app) => (
          <div
            key={app.id}
            className={`app-item ${currentAppId === app.id ? "active" : ""}`}
            onClick={() => setCurrentAppId(app.id)}
          >
            {app.name}
            <button
              className="delete-btn"
              onClick={() => deleteApplication(app.id)}
              disabled={app.id === 1} 
            >
              X
            </button>
          </div>
        ))}
        <button className="add-btn" onClick={addApplication}>
          + Add Application
        </button>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          {currentApp?.documents.map((doc) => (
            <div
              key={doc.id}
              className={`doc-item ${currentDocId === doc.id ? "active" : ""}`}
              onClick={() => setCurrentDocId(doc.id)}
            >
              {doc.name}
              <button
                className="delete-btn"
                onClick={() => deleteDocument(doc.id)}
                disabled={currentAppId === 1 && doc.id === 1} 
              >
                X
              </button>
            </div>
          ))}
          <button className="add-btn" onClick={addDocument}>
            + Add Document
          </button>
        </aside>

        <main className="content">
          <h1>
            Upload to {currentApp?.name || ""} - {currentDoc?.name || ""}
          </h1>
          <input
            type="file"
            onChange={(e) => uploadDocument(e.target.files[0])}
            className="upload-input"
          />
        </main>
      </div>

      <footer className="footer">
        <button className="nav-btn" onClick={handleBack}>
          Back
        </button>
        <button className="nav-btn" onClick={handleNext}>
          Next
        </button>
      </footer>
    </div>
  );
}

export default App;
