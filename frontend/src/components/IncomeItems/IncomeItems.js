// // //IncomeItem/IncomeItem.js
// // import React from 'react'
// // import styled from 'styled-components'
// // import { dateFormat } from '../../utils/dateFormat';
// // import { bitcoin, book, calender, card, circle, clothing, comment, dollar, food, freelance, medical, money, piggy, stocks, takeaway, trash, tv, users, yt } from '../../utils/icon';
// // import Button from '../Button/Button';

// // function IncomeItem({
// //     id,
// //     title,
// //     amount,
// //     date,
// //     category,
// //     description,
// //     deleteItem,
// //     indicatorColor,
// //     type
// // }) {

// //     const categoryIcon = () =>{
// //         switch(category) {
// //             case 'salary':
// //                 return money;
// //             case 'freelancing':
// //                 return freelance
// //             case 'investments':
// //                 return stocks;
// //             case 'stocks':
// //                 return users;
// //             case 'bitcoin':
// //                 return bitcoin;
// //             case 'bank':
// //                 return card;
// //             case 'youtube':
// //                 return yt;
// //             case 'other':
// //                 return piggy;
// //             default:
// //                 return ''
// //         }
// //     }

// //     const expenseCatIcon = () => {
// //         switch (category) {
// //             case 'education':
// //                 return book;
// //             case 'groceries':
// //                 return food;
// //             case 'health':
// //                 return medical;
// //             case 'subscriptions':
// //                 return tv;
// //             case 'takeaways':
// //                 return takeaway;
// //             case 'clothing':
// //                 return clothing;
// //             case 'travelling':
// //                 return freelance;
// //             case 'other':
// //                 return circle;
// //             default:
// //                 return ''
// //         }
// //     }

// //     console.log('type', type)

// //     return (
// //         <IncomeItemStyled indicator={indicatorColor}>
// //             <div className="icon">
// //                 {type === 'expense' ? expenseCatIcon() : categoryIcon()}
// //             </div>
// //             <div className="content">
// //                 <h5>{title}</h5>
// //                 <div className="inner-content">
// //                     <div className="text">
// //                         <p>{dollar} {amount}</p>
// //                         <p>{calender} {dateFormat(date)}</p>
// //                         <p>
// //                             {comment}
// //                             {description}
// //                         </p>
// //                     </div>
// //                     <div className="btn-con">
// //                         <Button 
// //                             icon={trash}
// //                             bPad={'1rem'}
// //                             bRad={'50%'}
// //                             bg={'var(--primary-color'}
// //                             color={'#fff'}
// //                             iColor={'#fff'}
// //                             hColor={'var(--color-green)'}
// //                             onClick={() => deleteItem(id)}
// //                         />
// //                     </div>
// //                 </div>
// //             </div>
// //         </IncomeItemStyled>
// //     )
// // }

// // const IncomeItemStyled = styled.div`
// //     background: #FCF6F9;
// //     border: 2px solid #FFFFFF;
// //     box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
// //     border-radius: 20px;
// //     padding: 1rem;
// //     margin-bottom: 1rem;
// //     display: flex;
// //     align-items: center;
// //     gap: 1rem;
// //     width: 100%;
// //     color: #222260;
// //     .icon{
// //         width: 80px;
// //         height: 80px;
// //         border-radius: 20px;
// //         background: #F5F5F5;
// //         display: flex;
// //         align-items: center;
// //         justify-content: center;
// //         border: 2px solid #FFFFFF;
// //         i{
// //             font-size: 2.6rem;
// //         }
// //     }

// //     .content{
// //         flex: 1;
// //         display: flex;
// //         flex-direction: column;
// //         gap: .2rem;
// //         h5{
// //             font-size: 1.3rem;
// //             padding-left: 2rem;
// //             position: relative;
// //             &::before{
// //                 content: '';
// //                 position: absolute;
// //                 left: 0;
// //                 top: 50%;
// //                 transform: translateY(-50%);
// //                 width: .8rem;
// //                 height: .8rem;
// //                 border-radius: 50%;
// //                 background: ${props => props.indicator};
// //             }
// //         }

// //         .inner-content{
// //             display: flex;
// //             justify-content: space-between;
// //             align-items: center;
// //             .text{
// //                 display: flex;
// //                 align-items: center;
// //                 gap: 1.5rem;
// //                 p{
// //                     display: flex;
// //                     align-items: center;
// //                     gap: 0.5rem;
// //                     color: var(--primary-color);
// //                     opacity: 0.8;
// //                 }
// //             }
// //         }
// //     }
// // `;

// // export default IncomeItem

// // // IncomeItem.js
// // import React from 'react';
// // import styled from 'styled-components';
// // import { dateFormat } from '../../utils/dateFormat';
// // import { bitcoin, book, calender, card, circle, clothing, comment, dollar, food, freelance, medical, money, piggy, stocks, takeaway, trash, tv, users, yt } from '../../utils/icon';
// // import Button from '../Button/Button';



// // function IncomeItem({
// //     id,
// //     title,
// //     amount,
// //     date,
// //     category,
// //     description,
// //     deleteItem,
// //     indicatorColor,
// //     type
// // }) {
// //     const categoryIcon = () => {
// //         switch(category.toLowerCase()) {
// //             case 'salary':
// //                 return money;
// //             case 'freelancing':
// //                 return freelance;
// //             case 'investments':
// //                 return stocks;
// //             case 'stocks':
// //                 return users;
// //             case 'bitcoin':
// //                 return bitcoin;
// //             case 'bank':
// //                 return card;
// //             case 'youtube':
// //                 return yt;
// //             case 'other':
// //                 return piggy;
// //             default:
// //                 return '';
// //         }
// //     };

// //         const expenseCatIcon = () => {
// //             switch (category) {
// //                 case 'education':
// //                     return book;
// //                 case 'groceries':
// //                     return food;
// //                 case 'health':
// //                     return medical;
// //                 case 'subscriptions':
// //                     return tv;
// //                 case 'takeaways':
// //                     return takeaway;
// //                 case 'clothing':
// //                     return clothing;
// //                 case 'travelling':
// //                     return freelance;
// //                 case 'other':
// //                     return circle;
// //                 default:
// //                     return ''
// //             }
// //         }

// //     const handleDelete = (e) => {
// //         e.preventDefault();
// //         e.stopPropagation();
// //         if (typeof deleteItem === 'function') {
// //             deleteItem(id);
// //         }
// //     };

// //     return (
// //         <IncomeItemStyled indicator={indicatorColor}>
// //             <div className="icon">
// //                 {type === 'expense' ? expenseCatIcon() : categoryIcon()}
// //             </div>
// //             <div className="content">
// //                 <h5>{title}</h5>
// //                 <div className="inner-content">
// //                     <div className="text">
// //                         <p>{dollar} {amount}</p>
// //                         <p>{calender} {dateFormat(date)}</p>
// //                         <p>
// //                             {comment}
// //                             {description}
// //                         </p>
// //                     </div>
// //                     <div className="btn-con">
// //                         <Button 
// //                             icon={trash}
// //                             bPad={'1rem'}
// //                             bRad={'50%'}
// //                             bg={'var(--primary-color'}
// //                             color={'#fff'}
// //                             iColor={'#fff'}
// //                             hColor={'var(--color-green)'}
// //                             onClick={handleDelete}
// //                         />
// //                     </div>
// //                 </div>
// //             </div>
// //         </IncomeItemStyled>
// //     );
// // }

// // const IncomeItemStyled = styled.div`
// //     background: #FCF6F9;
// //     border: 2px solid #FFFFFF;
// //     box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
// //     border-radius: 20px;
// //     padding: 1rem;
// //     margin-bottom: 1rem;
// //     display: flex;
// //     align-items: center;
// //     gap: 1rem;
// //     width: 100%;
// //     color: #222260;
// //     .icon{
// //         width: 80px;
// //         height: 80px;
// //         border-radius: 20px;
// //         background: #F5F5F5;
// //         display: flex;
// //         align-items: center;
// //         justify-content: center;
// //         border: 2px solid #FFFFFF;
// //         i{
// //             font-size: 2.6rem;
// //         }
// //     }

// //     .content{
// //         flex: 1;
// //         display: flex;
// //         flex-direction: column;
// //         gap: .2rem;
// //         h5{
// //             font-size: 1.3rem;
// //             padding-left: 2rem;
// //             position: relative;
// //             &::before{
// //                 content: '';
// //                 position: absolute;
// //                 left: 0;
// //                 top: 50%;
// //                 transform: translateY(-50%);
// //                 width: .8rem;
// //                 height: .8rem;
// //                 border-radius: 50%;
// //                 background: ${props => props.indicator};
// //             }
// //         }

// //         .inner-content{
// //             display: flex;
// //             justify-content: space-between;
// //             align-items: center;
// //             .text{
// //                 display: flex;
// //                 align-items: center;
// //                 gap: 1.5rem;
// //                 p{
// //                     display: flex;
// //                     align-items: center;
// //                     gap: 0.5rem;
// //                     color: var(--primary-color);
// //                     opacity: 0.8;
// //                 }
// //             }
// //         }
// //     }
// // `;

// // export default IncomeItem




// // // IncomeItem.js
// // import React from 'react';
// // import styled from 'styled-components';
// // import { dateFormat } from '../../utils/dateFormat';
// // import { bitcoin, book, calender, card, circle, clothing, comment, dollar, food, freelance, medical, money, piggy, stocks, takeaway, trash, tv, users, yt } from '../../utils/icon';
// // import Button from '../Button/Button';

// // function IncomeItem({
// //     id,
// //     title,
// //     amount,
// //     date,
// //     category,
// //     description,
// //     deleteItem,
// //     indicatorColor,
// //     type
// // }) {
// //     console.log('IncomeItem props:', { id, title, amount, date, category, description, deleteItem });

// //     const categoryIcon = () => {
// //         switch(category?.toLowerCase()) {
// //             case 'salary':
// //                 return money;
// //             case 'freelancing':
// //                 return freelance;
// //             case 'investments':
// //                 return stocks;
// //             case 'stocks':
// //                 return users;
// //             case 'bitcoin':
// //                 return bitcoin;
// //             case 'bank':
// //                 return card;
// //             case 'youtube':
// //                 return yt;
// //             case 'other':
// //             default:
// //                 return piggy;
// //         }
// //     };

// //     const handleDelete = () => {
// //         console.log('Delete clicked for ID:', id);
// //         if (typeof deleteItem === 'function') {
// //             deleteItem(id);
// //         }
// //     };

// //     return (
// //         <IncomeItemStyled indicator={indicatorColor}>
// //             <div className="icon">
// //                 {categoryIcon()}
// //             </div>
// //             <div className="content">
// //                 <h5>{title}</h5>
// //                 <div className="inner-content">
// //                     <div className="text">
// //                         <p>{dollar} {amount}</p>
// //                         <p>{calender} {dateFormat(date)}</p>
// //                         <p>
// //                             {comment}
// //                             {description}
// //                         </p>
// //                     </div>
// //                     <div className="btn-con">
// //                         <Button 
// //                             icon={trash}
// //                             bPad={'0.75rem'}
// //                             bRad={'50%'}
// //                             bg={'var(--primary-color)'}
// //                             color={'#fff'}
// //                             hColor={'var(--color-green)'}
// //                             onClick={handleDelete}
// //                         />
// //                     </div>
// //                 </div>
// //             </div>
// //         </IncomeItemStyled>
// //     );
// // }

// // const IncomeItemStyled = styled.div`
// //     background: #FCF6F9;
// //     border: 2px solid #FFFFFF;
// //     box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
// //     border-radius: 20px;
// //     padding: 1rem;
// //     margin-bottom: 1rem;
// //     display: flex;
// //     align-items: center;
// //     gap: 1rem;
// //     width: 100%;
// //     color: #222260;
    
// //     .icon {
// //         width: 80px;
// //         height: 80px;
// //         border-radius: 20px;
// //         background: #F5F5F5;
// //         display: flex;
// //         align-items: center;
// //         justify-content: center;
// //         border: 2px solid #FFFFFF;
// //         i {
// //             font-size: 2.6rem;
// //         }
// //     }

// //     .content {
// //         flex: 1;
// //         display: flex;
// //         flex-direction: column;
// //         gap: .2rem;
        
// //         h5 {
// //             font-size: 1.3rem;
// //             padding-left: 2rem;
// //             position: relative;
// //             &::before {
// //                 content: '';
// //                 position: absolute;
// //                 left: 0;
// //                 top: 50%;
// //                 transform: translateY(-50%);
// //                 width: .8rem;
// //                 height: .8rem;
// //                 border-radius: 50%;
// //                 background: ${props => props.indicator};
// //             }
// //         }

// //         .inner-content {
// //             display: flex;
// //             justify-content: space-between;
// //             align-items: center;
            
// //             .text {
// //                 display: flex;
// //                 align-items: center;
// //                 gap: 1.5rem;
                
// //                 p {
// //                     display: flex;
// //                     align-items: center;
// //                     gap: 0.5rem;
// //                     color: var(--primary-color);
// //                     opacity: 0.8;
// //                 }
// //             }

// //             .btn-con {
// //                 display: flex;
// //                 align-items: center;
// //                 gap: 1rem;
// //             }
// //         }
// //     }
// // `;

// // export default IncomeItem;



// // //IncomeItems.js
// // import React from 'react';
// // import styled from 'styled-components';
// // import { dateFormat } from '../../utils/dateFormat';
// // import { 
// //     bitcoin, book, calender, card, circle, clothing, 
// //     comment, dollar, food, freelance, medical, money, 
// //     piggy, stocks, takeaway, trash, tv, users, yt 
// // } from '../../utils/icon';
// // import Button from '../Button/Button';

// // function IncomeItem({
// //     id,
// //     title,
// //     amount,
// //     date,
// //     category,
// //     description,
// //     deleteItem,
// //     indicatorColor,
// //     type
// // }) {




//     // import React from 'react';
//     // import styled from 'styled-components';
//     // import { dateFormat } from '../../utils/dateFormat';
//     // import { getCategoryLabel } from '../../config/categories'; // Add this import
//     // import { 
//     //     bitcoin, book, calender, card, circle, clothing, 
//     //     comment, dollar, food, freelance, medical, money, 
//     //     piggy, stocks, takeaway, trash, tv, users, yt 
//     // } from '../../utils/icon';
//     // import Button from '../Button/Button';
            

//     //     const IncomeItem({
//     //     id,
//     //     title,
//     //     amount,
//     //     date,
//     //     category,
//     //     categories, // Add this prop
//     //     description,
//     //     deleteItem,
//     //     indicatorColor,
//     //     type
//     // }) {
//     // const categoryIcon = () => {
//     //     switch(category) {
//     //         case 'salary':
//     //             return money;
//     //         case 'freelancing':
//     //             return freelance;
//     //         case 'investments':
//     //             return stocks;
//     //         case 'stocks':
//     //             return users;
//     //         case 'bitcoin':
//     //             return bitcoin;
//     //         case 'bank':
//     //             return card;
//     //         case 'youtube':
//     //             return yt;
//     //         case 'other':
//     //             return piggy;
//     //         default:
//     //             return '';
//     //     }
//     // };

//     // const expenseCatIcon = () => {
//     //     switch (category) {
//     //         case 'education':
//     //             return book;
//     //         case 'groceries':
//     //             return food;
//     //         case 'health':
//     //             return medical;
//     //         case 'subscriptions':
//     //             return tv;
//     //         case 'takeaways':
//     //             return takeaway;
//     //         case 'clothing':
//     //             return clothing;
//     //         case 'travelling':
//     //             return freelance;
//     //         case 'other':
//     //             return circle;
//     //         default:
//     //             return '';
//     //     }
//     // };

// //     return (
// //         <IncomeItemStyled indicator={indicatorColor}>
// //             <div className="icon">
// //                 {type === 'expense' ? expenseCatIcon() : categoryIcon()}
// //             </div>
// //             <div className="content">
// //                 <h5>{title}</h5>
// //                 <div className="inner-content">
// //                     <div className="text">
// //                         <p>{dollar} {amount}</p>
// //                         <p>{calender} {dateFormat(date)}</p>
// //                         <p>
// //                             {comment}
// //                             {description}
// //                         </p>
// //                     </div>
// //                     <div className="btn-con">
// //                         <Button 
// //                             icon={trash}
// //                             bPad={'1rem'}
// //                             bRad={'50%'}
// //                             bg={'var(--primary-color'}
// //                             color={'#fff'}
// //                             iColor={'#fff'}
// //                             hColor={'var(--color-green)'}
// //                             onClick={() => deleteItem(id)}
// //                         />
// //                     </div>

// //                     <div className="category">
// //                     {Array.isArray(categories) 
// //                         ? categories.map((cat, index) => (
// //                             <span key={index}>
// //                                 {getCategoryLabel(cat)}
// //                                 {index < categories.length - 1 ? ', ' : ''}
// //                             </span>
// //                         ))
// //                         : getCategoryLabel(categories)
// //                     }
// //                 </div>

// //                 </div>
// //             </div>
// //         </IncomeItemStyled>
// //     );
// // }

// // return (
    
// //     <IncomeItemStyled $indicatorColor={indicatorColor}></IncomeItemStyled>
// //         <div className="icon">
// //             {type === 'expense' ? expenseCatIcon() : categoryIcon()}
// //         </div>
// //         <div className="content">
// //             <h5>{title}</h5>
// //             <div className="inner-content">
// //                 <div className="text">
// //                     <p>{dollar} {amount}</p>
// //                     <p>{calender} {dateFormat(date)}</p>
// //                     <p>
// //                         {comment}
// //                         {description}
// //                     </p>
// //                 </div>
// //                 <div className="btn-con">
// //                     <Button 
// //                         icon={trash}
// //                         bPad={'1rem'}
// //                         bRad={'50%'}
// //                         bg={'var(--primary-color'}
// //                         color={'#fff'}
// //                         iColor={'#fff'}
// //                         hColor={'var(--color-green)'}
// //                         onClick={() => deleteItem(id)}
// //                     />
// //                 </div>
// //                 <div className="category">
// //                     {categories ? (
// //                         Array.isArray(categories) 
// //                             ? categories.map((cat, index) => (
// //                                 <span key={index}>
// //                                     {getCategoryLabel(cat)}
// //                                     {index < categories.length - 1 ? ', ' : ''}
// //                                 </span>
// //                             ))
// //                             : getCategoryLabel(category)
// //                     ) : getCategoryLabel(category)}
// //                 </div>
// //             </div>
// //         </div>
// //     </IncomeItemStyled>
// // );
// // }


// import React from 'react';
// import styled from 'styled-components';
// import { dateFormat } from '../../utils/dateFormat';
// import { getCategoryLabel } from '../../config/categories';
// import {
//     bitcoin, book, calender, card, circle, clothing,
//     comment, dollar, food, freelance, medical, money,
//     piggy, stocks, takeaway, trash, tv, users, yt
// } from '../../utils/icon';
// import Button from '../Button/Button';

// const IncomeItem = ({
//     id,
//     title,
//     amount,
//     date,
//     category,
//     categories,
//     description,
//     deleteItem,
//     indicatorColor,
//     type
// }) => {  // Changed to arrow function and fixed syntax
//     const categoryIcon = () => {
//         switch(category) {
//             case 'salary':
//                 return money;
//             case 'freelancing':
//                 return freelance;
//             case 'investments':
//                 return stocks;
//             case 'stocks':
//                 return users;
//             case 'bitcoin':
//                 return bitcoin;
//             case 'bank':
//                 return card;
//             case 'youtube':
//                 return yt;
//             case 'other':
//                 return piggy;
//             default:
//                 return '';
//         }
//     };

//     const expenseCatIcon = () => {
//         switch (category) {
//             case 'education':
//                 return book;
//             case 'groceries':
//                 return food;
//             case 'health':
//                 return medical;
//             case 'subscriptions':
//                 return tv;
//             case 'takeaways':
//                 return takeaway;
//             case 'clothing':
//                 return clothing;
//             case 'travelling':
//                 return freelance;
//             case 'other':
//                 return circle;
//             default:
//                 return '';
//         }
//     };

//     return (
//         <IncomeItemStyled $indicatorColor={indicatorColor}>
//             <div className="icon">
//                 {type === 'expense' ? expenseCatIcon() : categoryIcon()}
//             </div>
//             <div className="content">
//                 <h5>{title}</h5>
//                 <div className="inner-content">
//                     <div className="text">
//                         <p>{dollar} {amount}</p>
//                         <p>{calender} {dateFormat(date)}</p>
//                         <p>
//                             {comment}
//                             {description}
//                         </p>
//                     </div>
//                     <div className="btn-con">
//                         <Button
//                             icon={trash}
//                             bPad={'1rem'}
//                             bRad={'50%'}
//                             bg={'var(--primary-color'}
//                             color={'#fff'}
//                             iColor={'#fff'}
//                             hColor={'var(--color-green)'}
//                             onClick={() => deleteItem(id)}
//                         />
//                     </div>
//                     <div className="category">
//                         {categories ? (
//                             Array.isArray(categories)
//                                 ? categories.map((cat, index) => (
//                                     <span key={index}>
//                                         {getCategoryLabel(cat)}
//                                         {index < categories.length - 1 ? ', ' : ''}
//                                     </span>
//                                 ))
//                                 : getCategoryLabel(category)
//                         ) : getCategoryLabel(category)}
//                     </div>
//                 </div>
//             </div>
//         </IncomeItemStyled>
//     );
// };

// const IncomeItemStyled = styled.div`
//     background: #FCF6F9;
//     border: 2px solid #FFFFFF;
//     box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
//     border-radius: 20px;
//     padding: 1rem;
//     margin-bottom: 1rem;
//     display: flex;
//     align-items: center;
//     gap: 1rem;
//     width: 100%;
//     color: #222260;
    
//     .icon {
//         width: 80px;
//         height: 80px;
//         border-radius: 20px;
//         background: #F5F5F5;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         border: 2px solid #FFFFFF;
//         i {
//             font-size: 2.6rem;
//         }
//     }

//     .content {
//         flex: 1;
//         display: flex;
//         flex-direction: column;
//         gap: .2rem;
//         h5 {
//             font-size: 1.3rem;
//             padding-left: 2rem;
//             position: relative;
//             &::before {
//                 content: '';
//                 position: absolute;
//                 left: 0;
//                 top: 50%;
//                 transform: translateY(-50%);
//                 width: .8rem;
//                 height: .8rem;
//                 border-radius: 50%;
//                 background: ${props => props.$indicatorColor};
//             }
//         }

//         .inner-content {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
            
//             .text {
//                 display: flex;
//                 align-items: center;
//                 gap: 1.5rem;
//                 p {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.5rem;
//                     color: var(--primary-color);
//                     opacity: 0.8;
//                 }
//             }
//         }
//     }

//     .category {
//         font-size: 0.9rem;
//         color: var(--primary-color);
//         opacity: 0.8;
//         margin-top: 0.5rem;
//     }

//     .btn-con {
//         button {
//             box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
//         }
//     }
// `;
// export default IncomeItem;



// // const IncomeItemStyled = styled.div`
// //     background: #FCF6F9;
// //     border: 2px solid #FFFFFF;
// //     box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
// //     border-radius: 20px;
// //     padding: 1rem;
// //     margin-bottom: 1rem;
// //     display: flex;
// //     align-items: center;
// //     gap: 1rem;
// //     width: 100%;
// //     color: #222260;
// //     .icon{
// //         width: 80px;
// //         height: 80px;
// //         border-radius: 20px;
// //         background: #F5F5F5;
// //         display: flex;
// //         align-items: center;
// //         justify-content: center;
// //         border: 2px solid #FFFFFF;
// //         i{
// //             font-size: 2.6rem;
// //         }
// //     }

// //     .content{
// //         flex: 1;
// //         display: flex;
// //         flex-direction: column;
// //         gap: .2rem;
// //         h5{
// //             font-size: 1.3rem;
// //             padding-left: 2rem;
// //             position: relative;
// //             &::before{
// //                 content: '';
// //                 position: absolute;
// //                 left: 0;
// //                 top: 50%;
// //                 transform: translateY(-50%);
// //                 width: .8rem;
// //                 height: .8rem;
// //                 border-radius: 50%;
// //                 background: ${props => props.indicator};
// //             }
// //         }

// //         .inner-content{
// //             display: flex;
// //             justify-content: space-between;
// //             align-items: center;
// //             .text{
// //                 display: flex;
// //                 align-items: center;
// //                 gap: 1.5rem;
// //                 p{
// //                     display: flex;
// //                     align-items: center;
// //                     gap: 0.5rem;
// //                     color: var(--primary-color);
// //                     opacity: 0.8;
// //                 }
// //             }
// //         }
// //     }
// // `;



import React from 'react';
import styled from 'styled-components';
import { dateFormat } from '../../utils/dateFormat';
import { getCategoryLabel } from '../../config/categories';
import {
    bitcoin, book, calender, card, circle, clothing,
    comment, dollar, food, freelance, medical, money,
    piggy, stocks, takeaway, trash, tv, users, yt
} from '../../utils/icon';
import Button from '../Button/Button';

const IncomeItem = ({
    id,
    title,
    amount,
    date,
    category,
    categories,
    description,
    deleteItem,
    indicatorColor,
    type
}) => {
    const categoryIcon = () => {
        switch(category) {
            case 'salary':
                return money;
            case 'freelancing':
                return freelance;
            case 'investments':
                return stocks;
            case 'stocks':
                return users;
            case 'bitcoin':
                return bitcoin;
            case 'bank':
                return card;
            case 'youtube':
                return yt;
            case 'other':
                return piggy;
            default:
                return '';
        }
    };

    const expenseCatIcon = () => {
        switch (category) {
            case 'education':
                return book;
            case 'groceries':
                return food;
            case 'health':
                return medical;
            case 'subscriptions':
                return tv;
            case 'takeaways':
                return takeaway;
            case 'clothing':
                return clothing;
            case 'travelling':
                return freelance;
            case 'other':
                return circle;
            default:
                return '';
        }
    };

    return (
        <IncomeItemStyled $indicatorColor={indicatorColor}>
            <div className="icon">
                {type === 'expense' ? expenseCatIcon() : categoryIcon()}
            </div>
            <div className="content">
                <h5>{title}</h5>
                <div className="inner-content">
                    <div className="text">
                        <p>{dollar} {amount}</p>
                        <p>{calender} {dateFormat(date)}</p>
                        <p>
                            {comment}
                            {description}
                        </p>
                    </div>
                    <div className="btn-con">
                        <Button
                            icon={trash}
                            onClick={() => deleteItem(id)}
                            bg={'#ff000d'}
                            bPad={'.4rem'}
                            bRad={'50%'}
                            color={'#fff'}
                            iColor={'#fff'}
                            hColor={'var(--color-green)'}
                        />
                    </div>
                    <div className="category">
                        {categories ? (
                            Array.isArray(categories)
                                ? categories.map((cat, index) => (
                                    <span key={index}>
                                        {getCategoryLabel(cat)}
                                        {index < categories.length - 1 ? ', ' : ''}
                                    </span>
                                ))
                                : getCategoryLabel(category)
                        ) : getCategoryLabel(category)}
                    </div>
                </div>
            </div>
        </IncomeItemStyled>
    );
};

const IncomeItemStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    color: #222260;
    border-left: 5px solid ${props => props.$indicatorColor};
    
    .icon {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        background: #F5F5F5;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
        i {
            font-size: 2.6rem;
        }
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: .2rem;
        
        h5 {
            font-size: 1.3rem;
            padding-left: 2rem;
            position: relative;
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: .8rem;
                height: .8rem;
                border-radius: 50%;
                background: ${props => props.$indicatorColor};
            }
        }

        .inner-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .text {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                p {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary-color);
                    opacity: 0.8;
                }
            }
        }
    }
`;

export default IncomeItem;