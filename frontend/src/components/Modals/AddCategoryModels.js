// // src/components/Modals/AddCategoryModal.js
// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { useGlobalContext } from '../../context/globalContext';
// import Button from '../Button/Button';
// import { plus } from '../../utils/icon';

// const AddCategoryModal = ({ isOpen, onClose }) => {
//     const { addCategory, error } = useGlobalContext();
//     const [categoryData, setCategoryData] = useState({
//         key: '',
//         label: ''
//     });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // Basic validation
//         if (!categoryData.key || !categoryData.label) {
//             return;
//         }

//         // Convert key to lowercase and remove spaces
//         const formattedKey = categoryData.key.toLowerCase().replace(/\s+/g, '_');

//         try {
//             await addCategory({
//                 key: formattedKey,
//                 label: categoryData.label
//             });
//             setCategoryData({ key: '', label: '' });
//             onClose();
//         } catch (err) {
//             console.error('Failed to add category:', err);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <ModalStyled>
//             <div className="modal-content">
//                 <h2>Add New Category</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="input-group">
//                         <label htmlFor="categoryKey">Category ID:</label>
//                         <input
//                             type="text"
//                             id="categoryKey"
//                             value={categoryData.key}
//                             onChange={(e) => setCategoryData({
//                                 ...categoryData,
//                                 key: e.target.value
//                             })}
//                             placeholder="e.g., utilities"
//                             required
//                         />
//                     </div>
//                     <div className="input-group">
//                         <label htmlFor="categoryLabel">Display Name:</label>
//                         <input
//                             type="text"
//                             id="categoryLabel"
//                             value={categoryData.label}
//                             onChange={(e) => setCategoryData({
//                                 ...categoryData,
//                                 label: e.target.value
//                             })}
//                             placeholder="e.g., Utilities"
//                             required
//                         />
//                     </div>
//                     {error && <p className="error">{error}</p>}
//                     <div className="button-group">
//                         <Button
//                             name={'Add Category'}
//                             icon={plus}
//                             bPad={'.8rem 1.6rem'}
//                             bRad={'30px'}
//                             bg={'var(--color-accent'}
//                             color={'#fff'}
//                             type="submit"
//                         />
//                         <Button
//                             name={'Cancel'}
//                             bPad={'.8rem 1.6rem'}
//                             bRad={'30px'}
//                             bg={'var(--color-delete'}
//                             color={'#fff'}
//                             onClick={onClose}
//                         />
//                     </div>
//                 </form>
//             </div>
//         </ModalStyled>
//     );
// };

// // src/components/Modals/AddCategoryModal.js

// import Button from '../Button/Button';
// import { plus } from '../../utils/icon';

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { useGlobalContext } from '../../context/globalContext';

// const AddCategoryModal = ({ isOpen, onClose }) => {
//     const { addCategory, error: contextError, getCategories } = useGlobalContext();
//     const [error, setError] = useState('');
//     const [categoryData, setCategoryData] = useState({
//         key: '',
//         label: ''
//     });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
        
//         // Basic validation
//         if (!categoryData.key || !categoryData.label) {
//             setError('All fields are required');
//             return;
//         }

//         try {
//             const result = await addCategory({
//                 key: categoryData.key.toLowerCase().replace(/\s+/g, '_'),
//                 label: categoryData.label,
//                 icon: 'circle' // Default icon
//             });

//             if (result.success) {
//                 await getCategories(); // Refresh categories
//                 setCategoryData({ key: '', label: '' });
//                 onClose();
//             } else {
//                 setError(result.error || 'Failed to add category');
//             }
//         } catch (err) {
//             setError(err.message || 'Failed to add category');
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <ModalStyled>
//             {/* ... rest of your modal JSX ... */}
//         </ModalStyled>
//     );
// };

// const ModalStyled = styled.div`
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100vw;
//     height: 100vh;
//     background: rgba(0, 0, 0, 0.5);
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     z-index: 1000;

//     .modal-content {
//         background: white;
//         padding: 2rem;
//         border-radius: 20px;
//         width: 90%;
//         max-width: 500px;
//         box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

//         h2 {
//             color: var(--primary-color);
//             margin-bottom: 1.5rem;
//             text-align: center;
//         }

//         .input-group {
//             margin-bottom: 1.5rem;

//             label {
//                 display: block;
//                 margin-bottom: 0.5rem;
//                 color: rgba(34, 34, 96, 0.9);
//             }

//             input {
//                 width: 100%;
//                 padding: 0.8rem;
//                 border: 2px solid #fff;
//                 border-radius: 5px;
//                 outline: none;
//                 background: transparent;
//                 box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

//                 &:focus {
//                     border-color: var(--color-accent);
//                 }
//             }
//         }

//         .error {
//             color: var(--color-delete);
//             margin-bottom: 1rem;
//             text-align: center;
//         }

//         .button-group {
//             display: flex;
//             justify-content: center;
//             gap: 1rem;
//         }
//     }
// `;

// export default AddCategoryModal;


// src/components/Modals/AddCategoryModal.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/icon';

const AddCategoryModal = ({ isOpen, onClose }) => {
    const { addCategory, error: contextError } = useGlobalContext();
    const [error, setError] = useState('');
    const [categoryData, setCategoryData] = useState({
        key: '',
        label: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Basic validation
        if (!categoryData.key || !categoryData.label) {
            setError('All fields are required');
            return;
        }

        try {
            const result = await addCategory({
                key: categoryData.key.toLowerCase().replace(/\s+/g, '_'),
                label: categoryData.label,
                icon: 'circle' // Default icon
            });

            if (result.success) {
                setCategoryData({ key: '', label: '' });
                onClose();
            } else {
                setError(result.error || 'Failed to add category');
            }
        } catch (err) {
            setError(err.message || 'Failed to add category');
        }
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <h2>Add New Category</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="categoryKey">Category ID:</label>
                        <input
                            type="text"
                            id="categoryKey"
                            value={categoryData.key}
                            onChange={(e) => setCategoryData({
                                ...categoryData,
                                key: e.target.value
                            })}
                            placeholder="e.g., car_expenses"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="categoryLabel">Display Name:</label>
                        <input
                            type="text"
                            id="categoryLabel"
                            value={categoryData.label}
                            onChange={(e) => setCategoryData({
                                ...categoryData,
                                label: e.target.value
                            })}
                            placeholder="e.g., Car Expenses"
                        />
                    </div>
                    <div className="button-group">
                        <Button
                            name={'Add Category'}
                            icon={plus}
                            bPad={'.8rem 1.6rem'}
                            bRad={'30px'}
                            bg={'var(--color-accent'}
                            color={'#fff'}
                            type="submit"
                        />
                        <Button
                            name={'Cancel'}
                            bPad={'.8rem 1.6rem'}
                            bRad={'30px'}
                            bg={'var(--color-delete'}
                            color={'#fff'}
                            onClick={onClose}
                        />
                    </div>
                </form>
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

    .error {
        color: var(--color-delete);
        background: #ffebee;
        padding: 0.5rem;
        border-radius: 5px;
        margin-bottom: 1rem;
        text-align: center;
    }

    .form-group {
        margin-bottom: 1.5rem;

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: rgba(34, 34, 96, 0.9);
        }

        input {
            width: 100%;
            padding: 0.8rem;
            border: 2px solid #fff;
            border-radius: 5px;
            background: transparent;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            color: rgba(34, 34, 96, 0.9);
            
            &:focus {
                outline: none;
                border-color: var(--color-accent);
            }
        }
    }

    .button-group {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
    }
`;

export default AddCategoryModal;