// import React from "react";
// import styled from "styled-components";
// import { InnerLayout } from "../../styles/layout";
// import ExpenseCategoryForm from './ExpenseCategoryForm'

// function ExpenseCategory()
// {
//     return(
//         <ExpensesStyled>
//             <InnerLayout>
//                 <h1>Expense Category</h1>
//                 <div className="Expense-content">
//                     <div className="form-container">
//                         <ExpenseCategoryForm/>
//                     </div>
//                     <div className="ExpenseCategoryAll">

//                     </div>

//                 </div>
//             </InnerLayout>
//         </ExpensesStyled>
//     )
// }

// const ExpensesStyled = styled.div`

// `;
// export default ExpenseCategory




import React from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layout";  // Make sure the path is correct
import ExpenseCategoryForm from './ExpenseCategoryForm';

function ExpenseCategory() {
    return (
        <ExpenseCategoryStyled>
            <InnerLayout>
                <div className="content">
                    <h1>Expense Categories</h1>
                    <div className="form-container">
                        <ExpenseCategoryForm />
                    </div>
                </div>
            </InnerLayout>
        </ExpenseCategoryStyled>
    );
}

const ExpenseCategoryStyled = styled.div`
    display: flex;
    overflow: auto;

    .content {
        width: 100%;
        
        h1 {
            color: var(--primary-color);
            margin-bottom: 2rem;
        }

        .form-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }
    }
`;

export default ExpenseCategory;