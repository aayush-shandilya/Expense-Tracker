import React from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/layout";
import Form from "../Form/Form";
import { useGlobalContext } from "../../context/globalContext";
import IncomeItem from "../IncomItem/IncomeItem";



function Incomes()
{
    const{totalIncome, incomes, deletIncome}= useGlobalContext();
    return(
        <IncomesStyled>
            <InnerLayout>
                <h1>Incomes</h1>
                <h2 className="total-income">Total Income: <span>{totalIncome()}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <Form/>
                    </div>
                    <div className="incomes">
                            {incomes.map((income)=>{
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
                                deleteItem={deletIncome}
                            />
                            })}
                    </div>
                </div>
            </InnerLayout>
        </IncomesStyled>
    )
}

const IncomesStyled = styled.div`
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
export default Incomes;