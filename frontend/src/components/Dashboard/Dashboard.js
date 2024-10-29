//Dashboard.js 
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { dollar } from  '../../utils/icon';
import Chart from '../Chart/Chart';


function Dashboard() {
    const {totalExpense,incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext()

    useEffect(() => {
        getIncomes()
        getExpenses()
    }, [])

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="stats-con">
                    <div className="chart-con">
                        <Chart />
                        <div className="amount-con">
                            <div className="income">
                                <h2>Total Income</h2>
                                <p>
                                    {dollar} {totalIncome()}
                                </p>
                            </div>
                            <div className="expense">
                                <h2>Total Expense</h2>
                                <p>
                                    {dollar} {totalExpense()}
                                </p>
                            </div>
                            <div className="balance">
                                <h2>Total Balance</h2>
                                <p>
                                    {dollar} {totalBalance()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        <History />
                        <h2 className="salary-title">Min <span>Salary</span>Max</h2>
                        <div className="salary-item">
                            <p>
                                ₹{Math.min(...incomes.map(item => item.amount))}
                            </p>
                            <p>
                                ₹{Math.max(...incomes.map(item => item.amount))}
                            </p>
                        </div>
                        <h2 className="salary-title">Min <span>Expense</span>Max</h2>
                        <div className="salary-item">
                            <p>
                                ₹{Math.min(...expenses.map(item => item.amount))}
                            </p>
                            <p>
                                ₹{Math.max(...expenses.map(item => item.amount))}
                            </p>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`
    .stats-con {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 2rem;
        
        .chart-con {
            grid-column: 1 / 4;
            height: 300px;
            
            .amount-con {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 4rem;
                margin-top: 2rem;
                
                .income, .expense {
                    grid-column: span 2;
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 10px;
                    padding: 1rem;
                    
                    p {
                        font-size: 1.8rem; /* Reduced from 3.5rem */
                        font-weight: 700;
                        transition: all 0.3s ease-in-out;
                    }
                    
                    /* Add a title above the amount */
                    .title {
                        font-size: 1rem;
                        margin-bottom: 0.5rem;
                        opacity: 0.8;
                    }
                }
                
                .balance {
                    grid-column: 2 / 4;
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 20px;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    
                    p {
                        color: var(--color-green);
                        opacity: 0.6;
                        font-size: 2.5rem; /* Reduced from 4.5rem */
                        font-weight: 400;
                    }
                    
                    .title {
                        font-size: 1.2rem;
                        margin-bottom: 0.5rem;
                    }
                }
            }
        }
        
        .history-con {
            grid-column: 4 / -2;
            
            h2 {
                margin: 1rem 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 1.5rem; /* Added size control */
            }
            
            .salary-title {
                font-size: 1.1rem; /* Reduced from 1.2rem */
                
                span {
                    font-size: 1.4rem; /* Reduced from 1.8rem */
                }
            }
            
            .salary-item {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                padding: 1rem;
                border-radius: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                
                margin-bottom: 1rem;
                
                p {
                    font-weight: 600;
                    font-size: 1.2rem; /* Reduced from 1.6rem */
                }
            }
        }
    }

    /* Add media queries for responsiveness */
    @media (max-width: 1000px) {
        .stats-con {
            gap: 1.5rem;
            
            .amount-con {
                gap: 1.5rem;
                
                .income p, .expense p {
                    font-size: 1.5rem;
                }
                
                .balance p {
                    font-size: 2rem;
                }
            }
        }
    }

    @media (max-width: 768px) {
        .stats-con {
            grid-template-columns: 1fr;
            
            .chart-con {
                grid-column: 1 / -1;
                
                .amount-con {
                    grid-template-columns: repeat(2, 1fr);
                    
                    .balance {
                        grid-column: 1 / -1;
                    }
                }
            }
            
            .history-con {
                grid-column: 1 / -1;
            }
        }
    }
`;
export default Dashboard



// const DashboardStyled = styled.div`
//     display: flex;
//     justify-content: center; /* Center the container */
//     padding: 1rem; /* Add padding to prevent overflow */

//     .stats-con {
//         display: grid;
//         grid-template-columns: 1fr 1fr; /* Adjusted to 2 columns for better fit */
//         gap: 2rem;
//         width: 100%;
//         max-width: 1200px; /* Limit max width for better centering */
        
//         .chart-con {
//             grid-column: 1 / span 2; /* Span across both columns */
//             height: auto; /* Make height responsive */
//             display: flex;
//             flex-direction: column;
//             align-items: center;

//             .amount-con {
//                 display: grid;
//                 grid-template-columns: 1fr 1fr; /* Adjusted to 2 columns */
//                 gap: 1rem;
//                 margin-top: 1rem;
//                 width: 100%;

//                 .income, .expense, .balance {
//                     background: #FCF6F9;
//                     border: 2px solid #FFFFFF;
//                     box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
//                     border-radius: 20px;
//                     padding: 1rem;
//                     text-align: center; /* Center text content */
                    
//                     p {
//                         font-size: 2.5rem; /* Reduced font size */
//                         font-weight: 700;
//                     }
//                 }

//                 .balance {
//                     grid-column: 1 / -1; /* Span full width */
//                     p {
//                         color: var(--color-green);
//                         opacity: 0.8;
//                         font-size: 3rem; /* Adjusted font size */
//                     }
//                 }
//             }
//         }

//         .history-con {
//             grid-column: 1 / span 2; /* Span across both columns */
//             padding: 1rem;
//             width: 100%;
            
//             h2 {
//                 margin: 1rem 0;
//                 font-size: 1.2rem;
//                 display: flex;
//                 align-items: center;
//                 justify-content: space-between;
//             }

//             .salary-item {
//                 background: #FCF6F9;
//                 border: 2px solid #FFFFFF;
//                 box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
//                 padding: 1rem;
//                 border-radius: 20px;
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: center;
                
//                 p {
//                     font-weight: 600;
//                     font-size: 1.4rem; /* Adjusted font size */
//                 }
//             }
//         }
//     }

//     /* Media query for smaller screens */
//     @media (max-width: 768px) {
//         .stats-con {
//             grid-template-columns: 1fr; /* Single column layout */
//             gap: 1rem;

//             .chart-con, .history-con {
//                 grid-column: 1;
//             }

//             .amount-con {
//                 grid-template-columns: 1fr; /* Stack vertically */
//             }
//         }

//         .salary-item p {
//             font-size: 1.2rem; /* Further reduce font size for mobile */
//         }
//     }
// `;

// export default Dashboard;






// const DashboardStyled = styled.div`
//     padding-right: 2rem; /* Add right padding to move content left */
    
//     .stats-con {
//         display: flex;
//         width: 95%;  /* Reduce width to move content left */
//         max-width: 1200px;
//         margin: 0 auto;
        
//         .chart-con {
//             width: 65%;
//             padding-right: 2rem;
            
//             .amount-con {
//                 display: grid;
//                 grid-template-columns: repeat(4, 1fr);
//                 gap: 2rem;
//                 margin-top: 2rem;
                
//                 .income, .expense {
//                     grid-column: span 2;
//                 }
                
//                 .income, .expense, .balance {
//                     background: #FCF6F9;
//                     border: 2px solid #FFFFFF;
//                     box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
//                     border-radius: 20px;
//                     padding: 1rem;
//                     p {
//                         font-size: 3.5rem;
//                         font-weight: 700;
//                     }
//                 }

//                 .balance {
//                     grid-column: 2 / 4;
//                     display: flex;
//                     flex-direction: column;
//                     justify-content: center;
//                     align-items: center;
//                     p {
//                         color: var(--color-green);
//                         opacity: 0.6;
//                         font-size: 4.5rem;
//                     }
//                 }
//             }
//         }

//         .history-con {
//             width: 35%;
            
//             h2 {
//                 margin: 1rem 0;
//                 display: flex;
//                 align-items: center;
//                 justify-content: space-between;
//             }
            
//             .salary-title {
//                 font-size: 1.2rem;
//                 span {
//                     font-size: 1.8rem;
//                 }
//             }
            
//             .salary-item {
//                 background: #FCF6F9;
//                 border: 2px solid #FFFFFF;
//                 box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
//                 padding: 1rem;
//                 border-radius: 20px;
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: center;
//                 margin-bottom: 1rem;
//                 p {
//                     font-weight: 600;
//                     font-size: 1.6rem;
//                 }
//             }

//             /* Make sure content doesn't overflow */
//             .history-item {
//                 width: 100%;
//                 box-sizing: border-box;
//                 word-break: break-word;
//             }
//         }
//     }

//     @media (max-width: 1200px) {
//         .stats-con {
//             flex-direction: column;
//             padding: 1rem;
            
//             .chart-con,
//             .history-con {
//                 width: 100%;
//                 padding-right: 0;
//             }
//         }
//     }
// `;
// export default Dashboard;
