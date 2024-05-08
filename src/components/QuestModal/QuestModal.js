import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";

const directory = "http://localhost:5001/uploads/";


function QuestModal({ show, onClose, item, username, fetchStatus }) {
    const [completionStatus, setCompletionStatus] = useState(false);
    const [inProgressStatus, setInProgressStatus] = useState(false);

    const handleTrackQuest = async () => {
        const response = await fetch('http://localhost:5001/populate/track', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: username, quest_id: item.id })
        });
        if (response.ok) {
            setInProgressStatus(true);
        }
    };

    const handleUntrackQuest = async () => {
        const response = await fetch('http://localhost:5001/populate/untrack', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: username, quest_id: item.id })
        });
        if (response.ok) {
            setInProgressStatus(false);
        }
    };

    const handleCompleteQuest = async () => {
        const response = await fetch('http://localhost:5001/populate/complete', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: username, quest_id: item.id })
        });
        if (response.ok) {
            setCompletionStatus(true);
        }
    }

    useEffect(() => {
        if (show && fetchStatus) {
            const fetchUserQuestStatus = async () => {
                const response = await fetch('http://localhost:5001/populate/userstatus', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username: username, quest_id: item.id})
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data.user_quest_status);
                    if (data.user_quest_status === "completed") {
                        setCompletionStatus(true);
                    }
                    if (data.user_quest_status === "in_progress") {
                        setInProgressStatus(true);
                    }
                } else {
                    console.error("Failed to fetch user quest status:", response.statusText);
                }
            };
            fetchUserQuestStatus();
        }
    }, [show, item.id, fetchStatus]);

    if (!show) {
        return null;
    }


    return ReactDOM.createPortal(
        <div className="my-modal-backdrop" onClick={onClose}>
            <div className="my-modal-content" onClick={e => e.stopPropagation()}>
                <div className="my-modal-header">
                    {item.title}
                </div>
                <div className="my-modal-body-container">
                    <div className="modal-body-left">

                        <img src={directory + item.image} alt={item.title}/>
                        <p>{item.description}</p>

                    </div>
                    <div className="modal-body-right">
                        <ul className="objectives-list">
                            {item.objective1 ? <li>{item.objective1}</li> : null}
                            {item.objective2 ? <li>{item.objective2}</li> : null}
                            {item.objective3 ? <li>{item.objective3}</li> : null}
                            {item.objective4 ? <li>{item.objective4}</li> : null}
                            {item.objective5 ? <li>{item.objective5}</li> : null}
                        </ul>
                        {completionStatus ? <button className="completed-quest-button">Completed</button> :
                            (inProgressStatus ?
                                <div className="complete-untrack-buttons-container">
                                    <button onClick={handleUntrackQuest} className="untrack-quest-button">Untrack Quest</button>
                                    <button onClick={handleCompleteQuest} className="complete-quest-button">Complete Quest</button>
                                </div>:
                                <button onClick={handleTrackQuest} className="track-quest-button">Track Quest</button>)
                        }
                    </div>
                </div>
                <button className="close-modal-button" onClick={onClose}>X</button>
            </div>
        </div>
            ,
            document.getElementById('modal-root')
    );
}

export default QuestModal;