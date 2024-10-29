// // src/components/Modals/DeleteCategoryModal.js
// import React from 'react';
// import styled from 'styled-components';
// import { useGlobalContext } from '../../context/globalContext';
// import Button from '../Button/Button';
// import { trash } from '../../utils/icon';

// const DeleteCategoryModal = ({ isOpen, onClose, category }) => {
//     const { deleteCategory } = useGlobalContext();

//     if (!isOpen || !category) return null;

//     const handleDelete = async () => {
//         try {
//             const result = await deleteCategory(category);
//             if (result.success) {
//                 onClose();
//             }
//         } catch (err) {
//             console.error('Error deleting category:', err);
//         }
//     };

//     return (
//         <ModalOverlay>
//             <ModalContent>
//                 <h2>Delete Category</h2>
//                 <p className="warning-text">
//                     Are you sure you want to delete the category "{category.label}"?
//                     This action cannot be undone.
//                 </p>
//                 <div className="button-group">
//                     <Button
//                         name={'Delete'}
//                         icon={trash}
//                         bPad={'.8rem 1.6rem'}
//                         bRad={'30px'}
//                         bg={'var(--color-delete'}
//                         color={'#fff'}
//                         onClick={handleDelete}
//                     />
//                     <Button
//                         name={'Cancel'}
//                         bPad={'.8rem 1.6rem'}
//                         bRad={'30px'}
//                         bg={'var(--color-accent'}
//                         color={'#fff'}
//                         onClick={onClose}
//                     />
//                 </div>
//             </ModalContent>
//         </ModalOverlay>
//     );
// };



// src/components/Modals/DeleteCategoryModal.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { trash } from '../../utils/icon';

const DeleteCategoryModal = ({ isOpen, onClose, category }) => {
    const { deleteCategory } = useGlobalContext();
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen || !category) return null;

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            setError('');

            const result = await deleteCategory(category.key); // Pass just the key

            if (result.success) {
                onClose();
            } else {
                setError(result.error || 'Failed to delete category');
            }
        } catch (err) {
            console.error('Error deleting category:', err);
            setError('Failed to delete category. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <h2>Delete Category</h2>
                <p className="warning-text">
                    Are you sure you want to delete the category "{category.label}"?
                    This action cannot be undone.
                </p>
                {error && <p className="error-text">{error}</p>}
                <div className="button-group">
                    <Button
                        name={isDeleting ? 'Deleting...' : 'Delete'}
                        icon={trash}
                        bPad={'.8rem 1.6rem'}
                        bRad={'30px'}
                        bg={'var(--color-delete'}
                        color={'#fff'}
                        onClick={handleDelete}
                        disabled={isDeleting}
                    />
                    <Button
                        name={'Cancel'}
                        bPad={'.8rem 1.6rem'}
                        bRad={'30px'}
                        bg={'var(--color-accent'}
                        color={'#fff'}
                        onClick={onClose}
                        disabled={isDeleting}
                    />
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 500px;

    h2 {
        color: var(--primary-color);
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .warning-text {
        text-align: center;
        margin-bottom: 2rem;
        color: rgba(34, 34, 96, 0.9);
        line-height: 1.5;
    }

    .button-group {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }
`;

export default DeleteCategoryModal;