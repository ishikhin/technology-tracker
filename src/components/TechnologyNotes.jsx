import React from 'react';
import './TechnologyNotes.css';

function TechnologyNotes({ notes, onNotesChange, techId }) {
    const handleNotesChange = (e) => {
        onNotesChange(techId, e.target.value);
    };

    // Обеспечиваем, что notes всегда строка
    const notesValue = notes || '';

    return (
        <div className="notes-section">
            <h4 className="notes-title">Мои заметки:</h4>
            <textarea
                value={notesValue}
                onChange={handleNotesChange}
                placeholder="Записывайте сюда важные моменты..."
                rows="3"
                className="notes-textarea"
            />
            <div className="notes-hint">
                {notesValue.length > 0 ? `Заметка сохранена (${notesValue.length} символов)` : 'Добавьте заметку'}
            </div>
        </div>
    );
}

export default TechnologyNotes;