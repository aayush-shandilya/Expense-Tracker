
import { expenses } from "../../utils/icons";
// import {totalExpenses} from "./context/globalContext"

import React,{useEffect} from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/layout";
import IncomeItem from "../IncomItem/IncomeItem";
import ExpenseForm from "./ExpenseForm";
import { useGlobalContext } from "../../context/globalContext";




function Expenses()
{
    const { totalExpenses, expenses, deleteExpense } = useGlobalContext();
    return(
        <ExpensesStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className="total-income">Total Expense: <span>{totalExpenses()}</span></h2>

                <div className="income-content">
                    <div className="form-container">
                        <ExpenseForm/>
                    </div>
                    <div className="income">
                        {expenses.map((income)=>{
                            const{_id, title, amount, date, category, description,type}=income;
                            console.log(income)
                            return <IncomeItem
                                key={_id}
                                id ={_id}
                                title = {title}
                                description={description}
                                amount={amount}
                                date = {date}
                                type={type}
                                category={category}
                                indicatorColor="var(--color-green)"
                                deleteItem={deleteExpense}
                            />
                        })}
                    </div>
                </div>
            </InnerLayout>
        </ExpensesStyled>
    )
}


const ExpensesStyled = styled.div`
    display:flex;
    overflow:auto;
    .total-income{
        display:flex;
        justify-context:center;
        background:#FCF6f9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0,0,0,0.6);
        border-radius: 20px;
        padding:1rem;
        margin:1rem 0;
        font-size: 2rem;
        gap:.5rem;
        span{
            font-size: 2.5rem;
            font-weight:800;
            color: var(--color-green);
        }
    }
    .income-context{
        display:flex;
        gap:2rem;
        .income{
            flex:1;
        }
    }

`;
export default Expenses;