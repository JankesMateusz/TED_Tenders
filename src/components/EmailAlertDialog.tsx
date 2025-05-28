import React, { useState } from 'react';
import { useUserPreferences } from '../context/UserPreferencesContext';
import styles from './EmailAlertDialog.module.css';

interface EmailAlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    tenders: any[];
}

const EmailAlertDialog: React.FC<EmailAlertDialogProps> = ({ isOpen, onClose, tenders }) => {
    const [email, setEmail] = useState('');
    const { addEmailAlert, getSelectedTenders } = useUserPreferences();

    const selectedTenders = getSelectedTenders(tenders);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && selectedTenders.length > 0) {
            addEmailAlert({
                email,
                tenders: selectedTenders
            });
            setEmail('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <h2 className={styles.title}>Send Selected Tenders</h2>
                <p className={styles.description}>
                    Selected tenders will be sent to your email address.
                </p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className={styles.tendersList}>
                        <h3 className={styles.subtitle}>Selected Tenders ({selectedTenders.length}):</h3>
                        <ul className={styles.list}>
                            {selectedTenders.map((tender) => (
                                <li key={tender.publicationNumber} className={styles.tenderItem}>
                                    <div className={styles.tenderTitle}>{tender.title}</div>
                                    <div className={styles.tenderDetails}>
                                        <span>{tender.publicationNumber}</span>
                                        <span>•</span>
                                        <span>{tender.buyerCity}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {selectedTenders.length === 0 && (
                            <p className={styles.noSelection}>
                                No tenders selected. Please select tenders using the toggle button on tender cards.
                            </p>
                        )}
                    </div>
                    <div className={styles.buttons}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={selectedTenders.length === 0}
                        >
                            Send ({selectedTenders.length})
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmailAlertDialog; 